---
title: 实用教程-联通光猫桥接路由
author: Syaoran
date: 2023-06-11
updated: 2023-06-11
categories: 
  - Tutorials
tags: 
  - DIY
---





联通光猫桥接路由器，使用路由器进行拨号上网，解放网速

<!-- more-->

## 简介

联通光猫桥接路由器，使用路由器进行拨号上网，解放网速

光猫型号： `HS8346V5`

省流：密码是宽带账号后6位



## Web管理端

**管理端:** 

管理端网址：http://192.168.1.1/

管理员密码：`CUAdmin`

**基本配置：**

0. 选择INTERNET配置

1. 查看用户名 

2. 改为桥接模式

**高级配置：**

启用Telnet连接



## Win启用Telnet

```powershell
pkgmgr /iu:”TelnetServer”
telnet 192.168.1.1
#认证管理用户
Login: root
password: adminHW
#查看当前配置信息
display current-configuration
```



## 获取密码&解密

查询用户名获取密码

[华为配置加解密工具](https://www.luojiasan.com/wp-content/uploads/2022/04/%E5%8D%8E%E4%B8%BA%E9%85%8D%E7%BD%AE%E5%8A%A0%E8%A7%A3%E5%AF%86%E5%B7%A5%E5%85%B7.zip)进行解密



## 路由器拨号上网

> 常用设置-> 上网设置 -> PPPoE
>

输入账号密码明文并应用





## 参考：

[华为`HS8346v5`光猫超级密码获取教程](https://www.luojiasan.com/category/computer/1237.html )
