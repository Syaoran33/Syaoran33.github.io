---
title: Python装饰器及异步装饰器
date: 2022/10/13
cover: https://miro.medium.com/v2/resize:fit:720/format:webp/1*yr6MAETw6WkPdRwpVVODIg.jpeg
categories:
  - Tutorials
tags:
  - Python
  - Spider
---

爬虫请求时,可以将请求体等信息作为静态信息,通过定义装饰器来请求响应及除错

<!-- more -->

## 常规


```python 
import httpx

# Decorator 
def request(func):

    def wrapper(*arg, **kwarg):
        req = func(*arg, **kwarg)
        client = httpx.Client()
        ret = client.send(req)
        return ret

    return wrapper

@request
def getUsers(method, url, params):
    return httpx.Request(method, url, params=params)

data = getUsers('GET', 'http://127.0.0.1:5200/getUsers',{'user_query': 'username'})
print(data.text)
```


## 协程

通过协程来使用装饰器时,需要额外借助functools来对异步函数进行装饰

```python 
import httpx
import asyncio
import functools

def asyncRequest(client):

    def inner(func):

        @functools.wraps(func)
        async def wrapper(*arg,**kwarg):
            req = func(*arg, **kwarg)
            ret = await client.send(req)
            return ret
        
        return wrapper

    return inner


client = httpx.AsyncClient()

@asyncRequest(client)
def asyncGetUsers(method, url, params):
    return httpx.Request(method, url, params=params)


data = asyncio.run(getUsers('GET', 'http://127.0.0.1:5200/getUsers',{'user_query': 'username'}))

print(data.text)
```

