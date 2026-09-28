---
title: Python爬虫技巧-Pica接口签名加密分析
author: Syaoran
date: 2021-03-19
updated: 2021-03-19
categories: 
  - Tutorials
tags: 
  - Python
  - Spider
  - Crypto
  - NSFW
---

接口签名加密，某小粉书app接口加密方法分析

![img](/img/covers/python_spider01.jpg)

<!-- more --> 

> ***申明：**
>
> **在此申明，仅作为非商业用途的学习交流和个人记录用途，请严格遵守相关国家规定**



逛Github发现一个各种平台自动打卡的[项目](https://hub.fastgit.org/BlueskyClouds/My-Actions)

研究发现了一个接口签名加密，然后对某粉色app接口加密方法进行分析

看完突然想到，上次版本更新以后加了一些随机数和时间戳等参数

好像和[K7大佬](https://k7cl.com)说的万象物语数据包加密有点相似。用的参数类似，具体方法应该不同

## 依赖

### python包

```
pip install httpx
```

### 代理

配置一个代理



## 加密方式

### 分析

用代理工具(BurpSuite)分析了几个数据包

发现头部(headers)有三个变化的参数

```
time、nonce、signature
```

### time

看的出来就是时间戳

生成方法

```
import time
time.time()
```

### nonce

32位的字母数字混合字符串

后面几位没有变化，可能是`uuid`

然后看项目代码，果然是`uuid`

这里使用随机数的uuid4伪造

后来发现，任意32位英文数字字符串也可以

生成方法

```
import uuid
uuid.uuid4()
```

### signature

参考源项目代码，使用了`hmac_sha256`的方式

消息是使用多因素的验证

```
formater = path + timestamp + uuid + method + api_key
```

请求地址，时间戳，随机数，请求方法，API密钥

生成方法

```
formater = path + time + nonce + method + api_key
msg = formater.lower().encode()

encrypter = hmac.new(key, msg, digestmod=hashlib.sha256)
signature = encrypter.hexdigest()
```

## 完整代码

```
#!/usr/bin/env python
# -*- encoding: utf-8 -*-

import uuid
import time
import hmac
import hashlib
import base64
import httpx
import json

class PICACG:
    api_key = 'C69BAF41DA5ABD1FFEDC6D2FEA56B'
    secret_key = 'fmR9JFE3JGVJbmk9Vik5XFJLL1AuUk00OzlbN3xAL0NBfWJ+T1chMz9FVmA6PD5NN3BkZFVCTDVufDAvKkNu'
    base_url = 'https://picaapi.picacomic.com/'
    headers = {
        'user-agent': 'okhttp/3.8.1',
        'Accept-Encoding': 'gzip, deflate',
        'accept': 'application/vnd.picacomic.com.v1+json',
        'api-key': api_key,
        'app-channel': '3',
        'app-uuid': 'defaultUuid',
        'app-version': '2.2.1.3.3.4',
        'image-quality': 'original',
        'app-platform': 'android',
        'app-build-version': '45',
        'Host': 'picaapi.picacomic.com',
        'Content-Type': 'application/json; charset=UTF-8', #'application/x-www-form-urlencoded'
    }

    @staticmethod
    def _proxy(proxy):

        if isinstance(proxy, dict):
            proxies = proxy
        elif proxy == 'Clash':
            proxies = {
                'http': 'http://localhost:7890',
                'https': 'http://localhost:7890',
            }
        elif proxy == 'BurpSuite':
            proxies = {
                'http': 'http://localhost:8080',
                'https': 'http://localhost:8080',
            }
        else:
            proxies = {}
        return proxies

    def __init__(self, proxy=False):
        self.client = httpx.Client(
            base_url=self.base_url, proxies=self._proxy(proxy))

    @staticmethod
    def _nonce() -> str:
        nonce = uuid.uuid4().hex
        return nonce

    @staticmethod
    def _timestamp() -> str:
        timestamp = time.time()

        return str(int(timestamp))

    def _signature(self, path, method) -> dict:
        """Signature encrypter"""
        time = self._timestamp()
        nonce = self._nonce()
        api_key = self.api_key
        key = base64.b64decode(self.secret_key.encode())

        formater = path + time + nonce + method + api_key
        msg = formater.lower().encode()

        encrypter = hmac.new(key, msg, digestmod=hashlib.sha256)
        signature = encrypter.hexdigest()

        varibals = {
            'time': time,
            'nonce': nonce,
            'signature': signature
        }

        headers = self.headers.copy()
        headers.update(varibals)
        return headers

    def login(self, uid: str, pwd: str):
        url = 'auth/sign-in'
        method = 'POST'
        headers = self._signature(url, method)
        data = {
            'email': uid,
            'password': pwd
        }

        res = self.client.post(url=url, headers=headers, data=json.dumps(data))
        print(res.json())
        token = res.json()['data'].get('token')

        return token


pica = PICACG(proxy= 'Clash')
token = pica.login('uid','pwd')
```

## 爬虫知识

通过这种加密方式，可以提高安全性

防止接口被爬虫攻击和滥用

对于游戏而言，通过添加随机字符串，时间戳等参数

可以较为有效的防止重放攻击和数据被恶意修改
