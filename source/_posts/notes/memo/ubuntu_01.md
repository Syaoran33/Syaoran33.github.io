---
title: Ubuntu系统-基础配置篇
author: Syaoran
date: 2023-06-18
updated: 2023-06-25
categories: 

  - Notes
tags: 
  - Ubuntu
  - Linux
  - Memo
---

Ubuntu系统使用的基础配置记录

# Ubuntu系统-基础配置篇

## 基础环境

### Apt包管理器

```shell
apt update
apt upgrade
apt list --installed
```

### 常用软件

```shell
apt install curl wget vim git
```

### 系统设置

```
# 设置系统时区
timedatectl set-timezone Asia/Shanghai
```

### Omz终端

```shell
# 安装zsh
apt install zsh
# 切换终端
chsh -s $(which zsh)
# 使用omz安装脚本
wget https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh
sh install.sh

```
