---
title: Docker 端口映射与 iptables
date: 2023/04/23
cover: https://miro.medium.com/v2/resize:fit:720/format:webp/1*9tQj7Nb5rkhR8qnG5ibelA.png
categories:
  - Tutorials
tags:
  - Docker
  - Linux
  - Network
---

不重启容器，通过 iptables 手动映射端口

<!-- more -->

## 查看端口
```
iptables -t nat --list-rules DOCKER
```

## 添加端口映射
```sh
echo $1
echo $2
iptables -t nat -A DOCKER ! -i docker0 -p tcp -m tcp --dport $2 -j DNAT --to-destination $1:$2
iptables -t nat -A POSTROUTING -s $1/32 -d $1/32 -p tcp -m tcp --dport $2 -j MASQUERADE
iptables -t filter -A DOCKER -d $1/32 ! -i docker0 -o docker0 -p tcp -m tcp --dport $2 -j ACCEPT
```
使用
```
sh add_port.sh $host $port
```

## 删除端口映射

```sh
echo $1
echo $2
iptables -t nat -D DOCKER ! -i docker0 -p tcp -m tcp --dport $2 -j DNAT --to-destination $1:$2
iptables -t nat -D POSTROUTING -s $1/32 -d $1/32 -p tcp -m tcp --dport $2 -j MASQUERADE
iptables -t filter -D DOCKER -d $1/32 ! -i docker0 -o docker0 -p tcp -m tcp --dport $2 -j ACCEPT
```
使用
```
sh del_port.sh $host $port
```
