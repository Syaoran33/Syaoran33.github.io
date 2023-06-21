---
title: 从零开始的手游解包教程-文本资源篇(五)
author: Syaoran
cover: 
date: 2021-03-10
updated: 2021-03-10
categories: 
  - Tutorials
tags: 
  - Sdorica
  - Mobile games
  - Reverse engineering
---

本篇介绍如何解包相关文本资源
使用脚本对16进制数据文件进行反序列化的处理

<!-- more --> 

> ***申明：**
>
> **在此申明，仅作为非商业用途的学习交流和个人记录用途，请严格遵守游戏用户协定，勿将提取的游戏资源发布到任何第三方平台。**
>
> **否则将可能造成游戏公司切实的利益损失，与一些不必要的麻烦甚者需承担相应的法律责任**
>
> **本篇不授权并禁止任何目的的分享、转载和引用，望理解**



## 介绍

本篇介绍如何解包相关文本资源

使用脚本对16进制数据文件进行反序列化的处理

通过本篇的学习，也可以为普吉机器人的开发提供更加便利的数据支持

## 引入

在游戏资料根目录里有一个`imperium/`文件夹

其中的文件就存放了游戏的相关文本资源，其中包括但不仅限于

角色名称、技能名称、技能组资料等

## 分析

将`imperium/localization/`文件夹下的文件复制到电脑

![img](/img/gamedata_reverse05_001.png)

使用Hex编辑器打开检查,这里使用`HxD编辑器`

![img](/img/gamedata_reverse05_002.png)

发现不是单纯的二进制，用python读一下

![img](/img/gamedata_reverse05_003.png)

果然是对一部分数据进行了特殊的序列化，部分文本正常

这种特殊的处理，让我立即联想到一种数据格式`pickle`

但很明显手游不可能使用python的存储格式

所以我立即在谷歌上搜素了一下Java的序列化方法

终于，在不懈的努力下我总算找到了序列化的方法—`MessagePack`





## 解包方法

### 安装依赖

```
pip install u-msgpack-python
```

### 解包

```
t = open(file_path,'rb').read()
data =umsgpack.unpackb(t)
```

### 完整代码

```
# unpack.py

import umsgpack
import json
import sys 

file_path = sys.argv[1]
file_name = sys.argv[2]

t = open(file_path,'rb').read()
data =umsgpack.unpackb(t)

with open(file_name+'.json','w',encoding='utf-8') as f:
    f.write(json.dumps(data,ensure_ascii=False))
    f.close()
```

### 用法

```
python unpack.py fa05c23a-ecb7-4743-a719-bb4f5a0eaf38 localization
```

生成一个`localization.json`的文件

![img](/img/gamedata_reverse05_004.png)

### 引申

其他文件的解包方法类似，`gamedata`文件中也有很多重要的资料





## 普吉机器人技能组文件

### 介绍

使用脚本生成技能组文件并编码

### 代码

创建`skillInfo.py`文件

```
#!/usr/bin/env python
# -*- encoding: utf-8 -*-

import json
import base64

data = json.load(open('localization.json','r',encoding='utf-8'))

MetagameSkillInfo = data["C"]["MetagameSkillInfo"]["D"]

skillDict = {}
for skillInfo in MetagameSkillInfo:
    metaDict = {
        skillInfo[5]: skillInfo[2]
    }
    skillDict.update(metaDict)

metaBytes = base64.b64encode(json.dumps(skillDict,ensure_ascii=False).encode())

with open('skillInfo','wb') as f:
    f.write(metaBytes)
    f.close()
```

### 使用方法

首先，用上述方法，将更新后的localization文件解包获取`localization.json`

然后，把文件`skillInfo.py`和`localization.json`复制在同目录下

使用如下命令即可

```
python skillInfo.py
```

最后，替换普吉机器人的资源文件，重启使用
