---
title: 'Docker: Alpine Linux'
date: 2022/8/19
cover: /img/covers/1.docker-alpine.png
categories:
  - Tutorials
tags:
  - Docker
  - Linux
---

搭建基于 Alpine Linux 的 Docker 应用

<!-- more -->

## 安装Docker Alpine

```shell
docker pull alpine
docker run -it --name=pycloud --privileged=true -p 8000:8000 -p 27017:27017 -p 5200:5200 -d alpine /bin/sh
docker start pycloud
docker exec -it pycloud ash
```

## Alpine基础配置

### 设置apk国内镜像
```ash
echo "https://mirrors.aliyun.com/alpine/v3.16/main" >> /etc/apk/repositories
echo "https://mirror.tuna.tsinghua.edu.cn/alpine/v3.16/main" >> /etc/apk/repositories
cat /etc/apk/repositories
apk update
apk upgrade
```

### 安装常用包
```ash
apk add vim curl git nmap util-linux build-base
```

## 环境安装

### 安装Python3
```ash
apk add python3 python3-dev
ln -s /usr/bin/python3 /usr/bin/python
python -V
python -m ensurepip --upgrade
ln -s /usr/bin/pip3 /usr/bin/pip
```

### 安装NodeJs
```ash
apk add nodejs
echo "https://mirrors.aliyun.com/alpine/v3.15/main" >> /etc/apk/repositories
apk add --no-cache npm
npm config set registry https://registry.npmmirror.com/
npm config get registry
```

## Web应用

### 安装nginx
```ash
apk add nginx
vim /etc/nginx/nginx.conf
```

### 安装hexo博客
```ash
npm install hexo-cli -g
cd /opt
hexo init blog
cd blog
npm install -S hexo-theme-icarus hexo-renderer-inferno
hexo config theme icarus
hexo server
```

### CyberChef
```ash
cd /opt
git clone https://github.com/gchq/CyberChef.git
cd CyberChef
npm install -g grunt-cli
npm install
grunt prod
cd build/prod/
python -m http.server 8000
```

### JupyterLab
```ash
apk add linux-headers --no-cache
pip install jupyterlab
pip install jupyterlab-language-pack-zh-CN
jupyter lab --generate-config
cd ~/.jupyter
vim jupyter_notebook_config.py
jupyter lab password
```

### Gitea
```ash
mkdir /opt/gitea/
apk add gitea
```

### Code-Server
```
apk add alpine-sdk bash libstdc++ libc6-compat
npm config set python python3
yarn global add code-server
code-server
```
