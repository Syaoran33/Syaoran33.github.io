---
title: Pickle序列化以及数据安全
date: 2023/12/07
cover: https://miro.medium.com/v2/resize:fit:640/format:webp/1*Ir0LMCoxnpvvimI3iVwFbw.png
categories:
  - Tutorials
tags:
  - Python
  - Security
---

相比较于其他序列化工具，pickle非常方便，它可以存储特殊的python对象，而不仅局限于字典、列表等。但反序列化时可能会执行恶意代码，从而存在安全问题，在使用时需要额外注意。

<!--more-->


## 介绍

Pickle 是 Python 的一个序列化协议，它允许将 Python 对象转化为字节流，以便于存储或传输，同时也允许将字节流反序列化为原始的 Python 对象。尽管 Pickle 在许多情况下都很方便，但也存在一些安全性方面的潜在问题，主要包括以下几点：

潜在的代码执行风险： Pickle 不仅仅是数据的序列化和反序列化，它还包含 Python 对象的结构信息和执行代码的能力。这就使得在反序列化 Pickle 数据时，恶意构造的 Pickle 数据可能会导致执行恶意代码。这被称为 "Pickle 反序列化漏洞"，是一种潜在的安全风险。

不安全的来源： 如果你从不受信任的来源（例如用户输入、网络或未受信任的文件）接收 Pickle 数据并进行反序列化，那么你可能容易受到恶意构造的 Pickle 数据的攻击。不受信任的 Pickle 数据可能包含有害代码，导致安全问题。

## 文件校验


```python
import pickle
import hashlib
import hmac

def hmac_sha256(data, secret_key):
    """计算 HMAC-SHA256 哈希值"""
    return hmac.new(secret_key.encode(), data, hashlib.sha256).digest()

def salt_pickle_dump(data, file_path, hmac_secret_key):
    """输出带校验的pickle文件"""
    # 将数据序列化为 Pickle
    pickled_data = pickle.dumps(data)
    # 计算 HMAC-SHA256 哈希值
    hash_value = hmac_sha256(pickled_data, hmac_secret_key)

    with open(file_path, 'wb') as file:
        file.write(pickled_data)
        file.write(hash_value)

def salt_pickle_load(file_path, hmac_secret_key):
    """读取带校验的pickle文件"""
    
    with open(file_path, 'rb') as file:
        pickled_data = file.read()

    # 提取文件中的 Pickle 数据和哈希值
    data_length = len(pickled_data) - hashlib.sha256().digest_size
    pickled_data, stored_hash = pickled_data[:data_length], pickled_data[data_length:]

    # 验证哈希值是否匹配
    computed_hash = hmac_sha256(pickled_data, hmac_secret_key)
    if hmac.compare_digest(stored_hash, computed_hash):
        return pickle.loads(pickled_data)
    else:
        raise ValueError("文件被篡改 Pickle file integrity verification failed.")

```