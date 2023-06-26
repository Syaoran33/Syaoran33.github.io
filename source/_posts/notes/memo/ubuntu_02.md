---
title: Ubuntu系统-应用安装篇
author: Syaoran
date: 2023-06-25
updated: 2023-06-25
categories: 

  - Notes
tags: 
  - Ubuntu
  - Linux
  - Memo
---



# Ubuntu系统-应用安装篇


## Docker

官方文档: [Install Docker Engine on Ubuntu | Docker Documentation](https://docs.docker.com/engine/install/ubuntu/)

### 设置源仓库

1. 更新 `apt` 和安装使用HTTPS的依赖:

   

   ```shell
   sudo apt-get update
   sudo apt-get install ca-certificates curl gnupg
   ```

2. 添加官方公钥 GPG key:

   ```shell
   sudo install -m 0755 -d /etc/apt/keyrings
   curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
   sudo chmod a+r /etc/apt/keyrings/docker.gpg
   ```

3. 设置源仓库:

   

   ```shell
   echo \
     "deb [arch="$(dpkg --print-architecture)" signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
     "$(. /etc/os-release && echo "$VERSION_CODENAME")" stable" | \
     sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
   ```

### 安装 Docker Engine

1. 更新 `apt` 目录:

   

   ```shell
   sudo apt-get update
   ```

2. 安装 Docker Engine, containerd, and Docker Compose.

   安装最新版:

   

   ```shell
   sudo apt-get install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
   ```

   ------

3. 测试是否安装成功通过新建 `hello-world` 镜像.

   

   ```shell
   sudo docker run hello-world
   ```

   该命令下载并运行了一个测试镜像. 当它运行后会输出消息并退出。



### 配置国内镜像

```shell
sudo mkdir -p /etc/docker
sudo tee /etc/docker/daemon.json <<-'EOF'
{
  "registry-mirrors": ["https://docker.mirrors.ustc.edu.cn"]
}
EOF
sudo systemctl daemon-reload
sudo systemctl restart docker
```

