---
title: MongoDB基础操作
date: 2023/06/01
cover: https://miro.medium.com/v2/resize:fit:720/format:webp/1*QJnvahq_EBdUGjYQUYrhvA.png
categories:
  - Tutorials
tags:
  - MongoDB
  - Database
---

最适合Python的数据库，再也不用担心写SQL语句了

<!-- more -->

## 安装部署
```
# MongoDB Community Server
mongod
ln -s mongod /usr/bin/mongod
mkdir -p /app/mongodb/data
mkdir -p /var/log/mongodb/
touch /var/log/mongodb/mongod.log
# MongoDB Shell
mongosh
# 设置初始密码
use admin
db.createUser({ user: 'admin', pwd: '123456Aa?', roles: [{ role: 'root', db: 'admin'}] })
```

配置文件
```
# mongod.conf

# for documentation of all options, see:
#   http://docs.mongodb.org/manual/reference/configuration-options/

# Where and how to store data.
storage:
  dbPath: /app/mongodb/data
  # journal:
  #   enabled: true
#  engine:
#  mmapv1:
#  wiredTiger:

# where to write logging data.
systemLog:
  destination: file
  logAppend: true
  path: /var/log/mongodb/mongod.log

# network interfaces
net:
  port: 27017
  bindIp: 0.0.0.0


# how the process runs
processManagement:
  timeZoneInfo: /usr/share/zoneinfo

security:
  authorization: enabled
```


## 基础操作

### 多级查询
用点来分割，支持对象(dict)和数组(list)
例如查询组织编号
```
{"account_org.code" : "Z000000000000000001"}
```

### 查询参数等于与不等于
```
{"special_table.tax_liability": {"$eq": true}}
{"special_table.tax_liability": {"$ne": true}}
```

### 操作ObjectId
处理未指定id时自动生成的ObjectId
```
from bson.objectid import ObjectId

oid = ObjectId(oid_str)
```



## 角色和权限

### 用户角色
数据库默认角色

| 角色描述       | 角色标识                                                     |
| -------------- | ------------------------------------------------------------ |
| 数据库用户角色 | read、readWrite                                              |
| 数据库管理角色 | dbAdmin、dbOwner、userAdmin                                  |
| 集群管理角色   | clusterAdmin、clusterManager、clusterMonitor、hostManager    |
| 备份恢复角色   | backup、restore                                              |
| 所有数据库角色 | readAnyDatabase、readWriteAnyDatabase、userAdminAnyDatabase、  dbAdminAnyDatabase |
| 超级用户角色   | root                                                         |



```
Mongo的授权采用了角色授权的方法，每个用户都有一组权限，Monog内建角色权限如下：

数据库用户角色
read：允许用户读取指定数据库
readWrite：允许用户读写指定数据库
数据库管理角色
dbOwner：包含readWrite、dbAdmin、userAdmin
dbAdmin：允许用户在指定数据库中对集合、文档等操作
userAdmin：允许用户向system.users集合写入，可以在指定数据库里创建、删除和管理用户
集群管理角色
clusterAdmin：只在admin数据库中可用，包含clusterManager、clusterMonitor、hostManager
clusterManager：
clusterMonitor：
hostManager
备份和恢复角色
backup
restore
所有数据库角色
readAnyDatabase：只在admin数据库中可用，赋予用户所有数据库的读权限
readWriteAnyDatabase：只在admin数据库中可用，赋予用户所有数据库的读写权限
dbAdminAnyDatabase：只在admin数据库中可用，赋予用户所有数据库的dbAdmin权限
userAdminAnyDatabase：只在admin数据库中可用，赋予用户所有数据库的userAdmin权限
超级用户角色
root：只在admin数据库中可用。超级账号，超级权限
内部角色
__system
```

### 创建用户
```js
db.createUser({user:'user',pwd:'pwd',roles:[{role: 'dbAdmin', db:'dbname'}]})
```



### 授权用户

```js
use admin
db.grantRolesToUser("pycloud",[{"role":"dbOwner","db":"QuestionBank"}])
```

### 取消权限

```js
use admin
db.revokeRolesFromUser("pycloud",
[
      {
        role: 'readWrite',
        db: 'PyCloud_Rules'
      },
      {
        role: 'readWrite',
        db: 'PyCloud_Data'
      }
])
```

```
db.grantRolesToUser("pycloud",
[
      {
        role: 'dbOwner',
        db: 'BankReconciliation'
      },
      {
        role: 'dbOwner',
        db: 'ClosingAlert'
      },
      {
        role: 'dbOwner',
        db: 'LedgerCheck'
      },
      {
        role: 'dbOwner',
        db: 'ReportCheck'
      },
      {
        role: 'dbOwner',
        db: 'VoucherInspect'
      }
    ])
```





## 管理命令

On mongo shell:

```sql
db.adminCommand({getParameter: 1, logLevel: 1})
```

> { "logLevel" : 0, "ok" : 1 }

On python:

```sql
from pymongo import MongoClient

server = 'localhost'

port = 27017

client = MongoClient(server, port)

print(client.admin.command(({'getParameter': 1, 'logLevel': 1})))
```

> {'logLevel': 0, 'ok': 1.0}



## 模糊查询

```js
collection.find({name:/text/})
```





## 移动集合

```js
use admin
db.adminCommand({renameCollection:"PyCloud_Output.ReportCheck_Final_20240301",to:"ReportCheck.ReportCheck_Final_20240301"})
```



## 移动数据库

mongodb没有修改db名称的接口，执行copydb操作太耗时，所以要实现源数据库重命名为目标数据库，需要遍历源数据库下所有的集合，重命名到目标数据库下，就实现了renameDatabase的功能，使用mongodb shell直接执行js脚本

```js
collection_list = db.getSiblingDB("PyCloud_Data").getCollectionNames();
for (let i = 0; i< collection_list.length; i++) {
    let original_db_name = "PyCloud_Data" +"." + collection_list[i];
    let target_db_name = "VoucherInspect"+"."+ collection_list[i];
    db.adminCommand({renameCollection: original_db_name, to: target_db_name});
}
```
