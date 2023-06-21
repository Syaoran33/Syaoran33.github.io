---
title: 从零开始的手游解包教程-角色资源篇(四)
author: Syaoran
cover: 
date: 2021-02-08
updated: 2021-03-10
categories: 
  - Tutorials
tags: 
  - Sdorica
  - Mobile games
  - Reverse engineering
---

前面介绍了如何对各种资源的解包，里面提到了角色的资源编号
本篇介绍相关角色编号的特征和对应名称的解释

<!-- more --> 

> ***申明：**
>
> **在此申明，仅作为非商业用途的学习交流和个人记录用途，请严格遵守游戏用户协定，勿将提取的游戏资源发布到任何第三方平台。**
>
> **否则将可能造成游戏公司切实的利益损失，与一些不必要的麻烦甚者需承担相应的法律责任**
>
> **本篇不授权并禁止任何目的的分享、转载和引用，望理解**



*注: 本篇所有`术语`非官方，部分名词术语是根据英文语义进行翻译和实际应用进行总结的
相关释义和备注的准确性有待商榷，其功用和大致意思会因本人的习惯比较主观的体现



## 资源编号

### 简介

`资源编号(AssetsId)`是为了编程为了方便区分角色的一种编号。对于开发者比较友好，可以通过其编号特征对编号索引，快速找到指定某一角色，及其各阶角色、技能书等

例如：h0030s5(琉 三阶), b0037s4(普吉 二阶)，h0097s5_a3(诺瓦 造型书)

### 编号特征

以诺瓦为例

```
h      0097      s      5      _a3
种族   序号      所属    阶级   技能书\造型书
```

#### 种族

> *注：雷亚对于种族分类的界定不是特别的严谨，部分角色和其对应的种族存在些许差异

| 缩写 | 推测原缩写 | 释义                 | 举例             |
| ---- | ---------- | -------------------- | ---------------- |
| h    | human      | 人类、亚种人类(亚人) | 希欧、猫眼、琉   |
| t    | -          | 兽人、有尾种族       | 庞、洛、杨波     |
| b    | beast      | 野兽                 | 古鲁瓦德、普吉   |
| r    | robot      | 机械、机巧           | 玛莉亚、夏洛克   |
| e    | -          | -                    | 荷丝缇雅、蔓朵菈 |
| m    | monster    | 魔物、怪兽           | 实验体           |
| n    | -          | -                    | 啾啾、猫头鹰号   |

#### 所属

| 缩写 | 推测原缩写 | 释义       |
| ---- | ---------- | ---------- |
| s    | storybook  | 魂册       |
| c    | common     | 通用、剧情 |

#### 阶级

> *注：部分情况剧情角色不守该阶级限制

| 编号 | 对应颜色 | 对应阶级 |
| ---- | -------- | -------- |
| s2   | 灰色     | -        |
| s3   | 蓝色     | 一阶     |
| s4   | 紫色     | 二阶     |
| s5   | 金色     | 三阶     |

#### 技能书\造型书

> *注：通常情况下，造型书/技能书都是以三阶角色为原型。
>
> 少部分如蒂卡-冬青少女，是以二阶为原型制作，其编号也会因此改变h0010s4_a3

| 编号 | 类型    |
| ---- | ------- |
| _a2  | 技能书  |
| _a3  | 造型书1 |
| _a4  | 造型书2 |



## *.bson文件

`Bson`按字面意思就是(Binary Json)，一种二进制的数据格式。

广泛(并不)用于MongoDB数据库的数据格式，在万象中bson文件也是为了压缩文件和序列化而被使用，例子就是`charAssets.bson`(老版本,3.2更新以前)

### 使用python读写

#### 安装

```
pip install bson
```

如果安装过pymongo库，请先卸载后再安装。否则会库的路径不对导致模块引入报错

```
pip uninstall pymongo
pip install bson
```

#### 读取

```
import bson

f = open('metadata.bson','rb')

data = bson.loads(f)
```

#### 写入

```
import bson

data = bson.dumps()
```

## charAssets.bson

> *注：现版本已经失效

万象物语角色技能组配置文件，包含所有角色的技能、buff等配置

角色技能的释放都依赖于该文件，理论上对此文件进行修改可直接影响游戏内技能效果和倍率等

### 解码方式

使用python脚本

```
#!/usr/bin/env python
# -*- encoding: utf-8 -*-
# Author: Syaoran at Sdorica.dev

import json
import bson
import base64

bson_file = open('charAssets.bson','rb')
bson_file = base64.b64decode(bson_file.read())
bson_data = bson.loads(bson_file)

def replace():
	raw = json.dumps(bson_data) #raw
	raw = raw.replace('\\','') #replace \
	raw = raw.replace('": "{"','": {"') #replace front "
	raw = raw.replace('"}",','"},') #replace back "
	raw = raw.replace('"}"},','"}},').replace('}"}}','}}}') #replace special "
	raw = raw.replace('":.','":0.').replace('":-.','":-0.') #add 0.
	return raw

raw = replace()

with open('charAssets.json','w') as f:
	f.write(raw)
```

## CharAssets.zip

新版本更新后采用这种方式来存放技能组配置文件。但是相较于之前，更加容易解包

### 解压

首先看后缀就知道是压缩文件格式(.zip)

### 分析bson

起初我以为还是和之前一样是b64编码的bson文件，试了很长时间都没成功。

后来直接读二进制，发现能看到部分内容，猜想应该是某种序列化。又试了一段时间，还是没有完美还原

后来看到文件大小突然醒悟，30M的内容变成5M，肯定是采用了压缩格式。所以我就用压缩软件测试，发现果然是压缩文档。随后确定就是`gunzip()`

综上，只需要使用两次解压即可获取数据，bson完全是糊弄人的

### 解包

压缩完成后即是json数据格式，无需其他处理

### 使用python脚本自动化

```
#!/usr/bin/env python
# -*- encoding: utf-8 -*-

import gzip
import zipfile
import os

class zippy:

    def unzip(self,bundle_path,dir_path):
        """解压CharAsset.zip\n
        :param bundle_path: 压缩包地址\n
        :param dir_path: 解压路径文件夹"""
        zip_file = zipfile.ZipFile(bundle_path)
        zip_ls = zip_file.namelist()
        for f in zip_ls:
            zip_file.extract(f, dir_path)
        zip_file.close()

    def bson2json(self,bundle_path,dir_path,dst_path):
        """批量转换bson文件为json文件\n
        :param bundle_path: 压缩包地址\n
        :param dir_path: 解压路径文件夹\n
        :param dst_path: json文件输出路径文件夹
        """
        if os.path.isfile(os.path.join(dir_path,'Manifest.bson')) != True:
            self.unzip(bundle_path,dir_path)
        for root,dirs,files in os.walk(dir_path):
            for file_name in files:
                file_path = os.path.join(root,file_name)
                data = gzip.GzipFile(file_path,'rb').read().decode()
                if os.path.isdir(dst_path) != True:
                    os.mkdir(dst_path)
                if os.path.isfile(os.path.join(dst_path,'Manifest.json')) != True:
                    with open(os.path.join(dst_path,file_name).replace('bson','json'),'w',encoding='utf8') as f:
                        f.write(data)
                        f.close()
        del dirs
```

### 更加安全高效

在后续研究中发现，使用这种方式：

- 一是可以降低占用的内存，只有在加载进关卡时才会根据所需角色释放压缩文件
- 二是额外添加了Manifest文件作为数据的质检员，对各项文件进行了哈希处理并做了不可逆的加密，较为有效的防止了数据的篡改





## 模板

### BattleCharacter

```
{
    "AssetsId":{
        "_power": 0,
        "_armorCapacity": 0,
        "_bloodCapacity": 0,
        "_passiveBuff": {
            "$content": []
        },
        "_levelStartBuff": {
            "$content": []
        },
        "_characterAI": {
            "OrderList": {
                "$content": []
            },
            "$type": "BattleModel.SequenceEnemyAI"
        },
        "_stoneEraseSetting": {
            "$content": [
                {
                    "Key": 0,
                    "Value": "S1"
                },
                {
                    "Key": 1,
                    "Value": "S2"
                },
                {
                    "Key": 2,
                    "Value": "S3"
                }
            ]
        },
        "_skillsetTable": {},
        "_skills": {},
        "_reviveCount": 0,
        "_stoneType": 0,
        "_assistantSkill": null,
        "_initialCoolDown": 0,
        "_defaultCoolDown": 0,
        "_masterRank": 0,
        "_mass": 1,
        "_pose": "Stand",
        "ReferenceCharacterKeys": {
            "$content": []
        },
        "ReferenceEffectKeys": {
            "$content": []
        },
        "ReferenceBuffKeys": {
            "$content": []
        },
        "ReferenceSFXKeys": {
            "$content": []
        },
        "ReferenceVoiceSFXKeys": {
            "$content": []
        },
        "ReferenceMusicKeys": {
            "$content": []
        },
        "ReferenceEmoIconKeys": {
            "$content": []
        },
        "$type": "BattleModel.SummonSlot"
    }
}
```

### 键值参数

| 键                     | 释义             | 角色备注 |
| ---------------------- | ---------------- | -------- |
| AssetsId               | 资产编号/名称    | b0037s5  |
| _power                 | 基础攻击力       |          |
| _bloodCapacity         | 基础血量         |          |
| _armorCapacity         | 基础护盾值       |          |
| _passiveBuff           | 被动buff         |          |
| _levelStartBuff        | - (阶段开始效果) |          |
| _characterAI           | - (角色AI)       |          |
| _characterAI.OrderList | - (技能顺序)     |          |
| _stoneEraseSetting     | 技能魂芯消除设定 |          |
