---
title: 从零开始的手游解包教程-批量解包篇(六)
author: Syaoran
cover: 
date: 2021-03-11
updated: 2021-03-11
categories: 
  - Tutorials
tags: 
  - Sdorica
  - Mobile games
  - Reverse engineering
---

本篇介绍使用脚本进行批量的分类解包

<!-- more --> 

> ***申明：**
>
> **在此申明，仅作为非商业用途的学习交流和个人记录用途，请严格遵守游戏用户协定，勿将提取的游戏资源发布到任何第三方平台。**
>
> **否则将可能造成游戏公司切实的利益损失，与一些不必要的麻烦甚者需承担相应的法律责任**
>
> **本篇不授权并禁止任何目的的分享、转载和引用，望理解**



## 介绍

本篇介绍使用脚本进行批量的分类解包

不出意料这样该是解包教程的最后一篇了，相信看完这篇你将成为一名解包大佬

鼓掌👏

## 优势

- 批量解包，提升效率
- 解包后文件按原路径提取和分类，便于查看
- 指定类型，获取对应类型文件

## 操作方法

### 依赖

```
pip install UnityPy
```

### 代码

```
# Sdorica_ABC.py
import os
from UnityPy import AssetsManager
from collections import Counter
import zipfile
import logging

logging.basicConfig(level=logging.ERROR,format='%(message)s')

TYPES = ['TextAsset', 'Sprite', 'Texture2D']

ROOT = os.path.dirname(os.path.realpath(__file__))

# source folder
ASSETS = os.path.join(ROOT, 'AssetBundles')
# destination folder
DST = os.path.join(ROOT, 'textasset')
# number of dirs to ignore
# e.g. IGNOR_DIR_COUNT = 2 will reduce
# 'assets/assetbundles/images/story_picture/small/15.png'
# to
# 'images/story_picture/small/15.png'

IGNOR_DIR_COUNT = 0

os.makedirs(DST, exist_ok=True)


def main():
	for root, dirs, files in os.walk(ASSETS):
		del dirs
		for f in files:
			#print(f)
			src = os.path.realpath(os.path.join(root, f))
			try:
				extract_assets(src)
			except:
				pass


def extract_assets(src):
	# load source
	am = AssetsManager(src)

	# iterate over assets
	for asset in am.assets.values():
		# assets without container / internal path will be ignored for now
		if not asset.container:
			continue

		# check which mode we will have to use
		num_cont = sum(1 for obj in asset.container.values() if obj.type in TYPES)
		num_objs = sum(1 for obj in asset.objects.values() if obj.type in TYPES)

		# check if container contains all important assets, if yes, just ignore the container
		if num_objs <= num_cont * 2:
			for asset_path, obj in asset.container.items():
				fp = os.path.join(DST, *asset_path.split('/')[IGNOR_DIR_COUNT:])
				export_obj(obj, fp)

		# otherwise use the container to generate a path for the normal objects
		else:
			extracted = []
			# find the most common path
			occurence_count = Counter(os.path.splitext(asset_path)[0] for asset_path in asset.container.keys())
			local_path = os.path.join(DST, *occurence_count.most_common(1)[0][0].split('/')[IGNOR_DIR_COUNT:])

			for obj in asset.objects.values():
				if obj.path_id not in extracted:
					extracted.extend(export_obj(obj, local_path, append_name=True))


def export_obj(obj, fp: str, append_name: bool = False) -> list:
	if obj.type not in TYPES:
		return []
	data = obj.read()
	if append_name:
		fp = os.path.join(fp, data.name)

	fp, extension = os.path.splitext(fp)
	os.makedirs(os.path.dirname(fp), exist_ok=True)

	if obj.type == 'TextAsset':
		if not extension:
			extension = '.txt'
		with open(f"{fp}{extension}", 'wb') as f:
			f.write(data.script)

	elif obj.type == 'MonoBehaviour':
		extension = '.txt'
		metadata =data.type_tree['_serializedStateValues'][0]
		with open(f"{fp}{extension}", 'w') as f:
			f.write(metadata)

	elif obj.type == "Sprite":
		extension = ".png"
		data.image.save(f"{fp}{extension}")

		return [obj.path_id, data.m_RD.texture.path_id, getattr(data.m_RD.alphaTexture, 'path_id', None)]

	elif obj.type == "Texture2D":
		extension = ".png"
		fp = f"{fp}{extension}"
		if not os.path.exists(fp):
			try:
				data.image.save(fp)
			except EOFError:
				pass

	elif obj.type == 'AudioClip':
		if not extension:
			extension = '.wav'
		try:
			samples = data.samples
			for item in samples:
				audio = samples.get(item).obj
			with open(f"{fp}{extension}", 'wb') as f:
				f.write(audio)
		except Exception as error:
			logging.error(error)
			pass

	return [obj.path_id]


if __name__ == '__main__':

	main()
```

### 类型

```
TYPES = ['TextAsset', 'Sprite', 'Texture2D']
```

修改上面的内容，进行添加或限制进行解包

### 文件夹路径

```
# source folder
ASSETS = os.path.join(ROOT, 'AssetBundles')
# destination folder
DST = os.path.join(ROOT, 'textasset')
```

ASSETS为输入文件夹，就是存放`.ab`文件的文件夹

DST为输出文件夹，输出解包后的文件

### 额外依赖

在对`AudioClip`解包时需要额外的依赖文件

```
libogg.dll
libvorbis.dll
```

可以在`github`上搜索后下载，置于`.py`脚本的同级目录

### 使用方法

```
python Sdorica_ABC.py 
```

### 优化

- 使用脚本可能会导致解包文件被重复替换
- 由于电脑性能限制本例未使用多线程，可自行添加多线程提升解包速度
- 未对文件作筛选过滤，可以通过`if判断限制`想要解包的内容

## 结语

至此，已经基本结束了对万象物语的游戏解包教程，难度较大的内容已经被我省去，基本上有一台能正常使用的Windows电脑即可操作

还请记住，不要将解包获取到的游戏资源上传、分享到其他第三方，谢谢合作
