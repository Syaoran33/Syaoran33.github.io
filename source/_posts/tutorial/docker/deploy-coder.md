---
title: 使用docker部署Code-server
date: 2024/3/28
cover: https://miro.medium.com/v2/resize:fit:720/format:webp/1*2A2zR_BWfgaRHx6_ila13w.jpeg
categories:
  - Tutorials
tags:
  - Docker
  - Linux
---

docker部署在线版vscode步骤

<!--more-->


## 安装命令

```
docker run -it --name hzcwgx_coder -p 5000:8080 -v "$HOME/.config:/home/coder/.config" -u "$(id -u):$(id -g)" -e "DOCKER_USER=$USER" --memory 2g --restart unless-stopped --security-opt seccomp=unconfined codercom/code-server:latest
```



## 基础配置

```
# 修改密码-直接用明文然后重启容器
vi /root/.config/code-server/config.yaml
apt update && apt upgrade
apt install curl wget git vim net-tools
```



## 安装Python

```
apt install python3
apt install python3-pip
# 编辑pip配置文件
# /root/.config/pip/pip.conf
[global]
index-url = https://pypi.tuna.tsinghua.edu.cn/simple
break-system-packages = true

```

