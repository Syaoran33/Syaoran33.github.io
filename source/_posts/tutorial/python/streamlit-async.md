---
title: Streamlit, asyncio and MongoDB
date: 2024/10/09
cover: https://miro.medium.com/v2/resize:fit:720/format:webp/0*Bpl8kZtxhyVNPJiH
categories:
  - Tutorials
tags:
  - Python
  - Streamlit
  - MongoDB
---

在 Streamlit 中启用异步的 MongoDB 操作

<!-- more -->

Streamlit 基于 asyncio（底层用 Tornado），但事件循环不暴露给用户代码。本文探讨如何在 Streamlit 中正确使用 asyncio 数据源。

## Problem

```python
async def fetch_data():
    count = await Product.find(fetch_links=True).count()
    if not count:
        await Product(name='test').save()
    return await Product.find(fetch_links=True).to_list()
```

## Solution 1: asyncio.run()

```python
import asyncio
from beanie import Document, init_beanie
from motor.motor_asyncio import AsyncIOMotorClient
import streamlit as st

class Product(Document):
    name: str

async def init_database(client):
    database = client.get_database(name='asyncio_streamlit_db')
    await init_beanie(database=database, document_models=[Product])

async def fetch_data():
    count = await Product.find(fetch_links=True).count()
    if not count:
        await Product(name='test').save()
    return await Product.find(fetch_links=True).to_list()

async def main():
    client = AsyncIOMotorClient("mongodb://127.0.0.1:27017/")
    await init_database(client)
    products = await fetch_data()
    for product in products:
        st.write(product)

if __name__ == '__main__':
    asyncio.run(main())
```

**问题**：每次请求都创建新连接，项目规模扩大后不现实。

## Solution 2: Cache per session

```python
import asyncio
from beanie import Document, init_beanie
from motor.motor_asyncio import AsyncIOMotorClient
import streamlit as st

class Product(Document):
    name: str

async def init_database(client):
    database = client.get_database(name='asyncio_streamlit_db')
    await init_beanie(database=database, document_models=[Product])

async def fetch_data():
    count = await Product.find(fetch_links=True).count()
    if count < 10:
        for i in range(10):
            await Product(name='test').save()
    return await Product.find(fetch_links=True).limit(10).to_list()

async def main():
    if not st.session_state.get('client'):
        st.session_state.client = AsyncIOMotorClient("mongodb://127.0.0.1:27017/")
        await init_database(st.session_state.client)
    products = await fetch_data()
    for product in products:
        st.write(product)
    st.button("Quick rerun")

if __name__ == '__main__':
    asyncio.run(main())
```

**问题**：按钮点击 rerun 时，`asyncio.run()` 创建新的事件循环，beanie 初始化状态丢失。

## Solution 3: Cache event loop

```python
import asyncio
from beanie import Document, init_beanie
from motor.motor_asyncio import AsyncIOMotorClient
import streamlit as st

class Product(Document):
    name: str

async def init_database(client):
    database = client.get_database(name='asyncio_streamlit_db')
    await init_beanie(database=database, document_models=[Product])

async def fetch_data():
    count = await Product.find(fetch_links=True).count()
    if count < 10:
        for i in range(10):
            await Product(name='test').save()
    return await Product.find(fetch_links=True).limit(10).to_list()

def get_event_loop():
    return asyncio.new_event_loop()

if not st.session_state.get('event_loop'):
    st.session_state.event_loop = get_event_loop()
if not st.session_state.get('client'):
    st.session_state.client = AsyncIOMotorClient(
        "mongodb://127.0.0.1:27017/",
        io_loop=st.session_state.event_loop
    )

async def main():
    await init_database(st.session_state.client)
    products = await fetch_data()
    for product in products:
        st.write(product)
    st.button("Quick rerun")

if __name__ == '__main__':
    st.session_state.event_loop.run_until_complete(main())
```

**问题**：快速点击按钮时 `RuntimeError: This event loop is already running`。

## Solution 4: Worker thread (推荐)

```python
import asyncio
from asyncio import run_coroutine_threadsafe
from threading import Thread
from motor.motor_asyncio import AsyncIOMotorClient
import streamlit as st

@st.cache_resource(show_spinner=False)
def create_loop():
    loop = asyncio.new_event_loop()
    thread = Thread(target=loop.run_forever)
    thread.start()
    return loop, thread

st.session_state.event_loop, worker_thread = create_loop()

def run_async(coroutine):
    return run_coroutine_threadsafe(coroutine, st.session_state.event_loop).result()

# 将 beanie 模型和 init 移出脚本目录，避免每次 rerun 重置
@st.cache_resource(show_spinner=False)
def setup_database():
    client = AsyncIOMotorClient(
        "mongodb://127.0.0.1:27017/",
        io_loop=st.session_state.event_loop
    )
    run_async(init_database(client=client))
    return client

st.session_state.db_client = setup_database()

def main():
    products = run_async(fetch_data())
    for product in products:
        st.write(product)
    st.button("Quick rerun")

if __name__ == '__main__':
    main()
```

**优点**：独立的 worker 线程运行事件循环，`run_coroutine_threadsafe` 安全提交任务，`st.cache_resource` 缓存连接不重置。

**缺点**：Streamlit 没有 shutdown 钩子，worker 线程无法优雅退出。

---

完整示例：https://github.com/thorin-schiffer/streamlit_asyncio
