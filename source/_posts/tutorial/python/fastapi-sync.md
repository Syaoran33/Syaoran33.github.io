---
title: FastAPI 异步接口中执行同步函数
date: 2024/08/15
cover: https://miro.medium.com/v2/resize:fit:720/format:webp/1*7mfeWrFnlYWppeJje2SJyw.png
categories:
  - Tutorials
tags:
  - Python
  - FastAPI
---

比较 run_in_executor 和 run_in_threadpool

<!-- more -->

`run_in_executor` 和 `run_in_threadpool` 都是在异步应用中运行同步代码而不阻塞事件循环的工具。`run_in_executor` 来自 Python `asyncio`，`run_in_threadpool` 来自 Starlette。

```python
# run_in_executor
import asyncio
from concurrent.futures import ThreadPoolExecutor

def sync_function(argument1, argument2):
    pass

async def main():
    loop = asyncio.get_running_loop()
    with ThreadPoolExecutor() as pool:
        result = await loop.run_in_executor(pool, sync_function, 'arg1', 'arg2')
```

```python
# run_in_threadpool
from fastapi import FastAPI
from starlette.concurrency import run_in_threadpool

app = FastAPI()

def sync_function(argument1, argument2):
    pass

@app.get("/example")
async def example_route():
    result = await run_in_threadpool(sync_function, 'arg1', 'arg2')
    return {"result": result}
```

`run_in_threadpool` 更简洁，不需要手动指定执行器，是 FastAPI 下的推荐方式。如果需要 `ProcessPoolExecutor` 等特殊执行器，则用 `run_in_executor`。
