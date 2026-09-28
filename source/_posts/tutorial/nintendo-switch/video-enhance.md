---
title: Switch串流视频超分补帧教程
author: Syaoran
cover: 
date: 2023-05-21
updated: 2023-06-14
categories: 
  - Tutorials
tags: 
  - Nintendo Switch
  - MPV
---

采集卡将Switch画面串流到PC,使用mpv播放器搭配各项npy滤镜文件

通过调用独立显卡的高算力，实现视频流的超分补帧

![cover](img/covers/switch_video_enhance01.png)

<!-- more -->



## 简介

采集卡将Switch画面串流到PC,使用mpv播放器搭配各项npy滤镜文件

通过调用独立显卡的高算力，实现视频流的超分补帧



## 设备需求

- `NintendoSwitch` 支持底座模式
- 视频采集卡
- `Winodows`系统 PC 
- 独立显卡(补帧推荐`Nvidia RTX3060`以上)



## 使用说明

[视频演示: 【首发教程】正版Switch超分补帧，4K 60fps只用check it一下!🤘](https://www.bilibili.com/video/BV1Fc411A7iU/)

[整合网盘地址](https://pan.baidu.com/s/12Kqi2C9C5bM0UqfwtNE3sw?pwd=3045)

### 演示设备

采集卡: 海备思THB03 (MS2131)

显卡: 移动端 RTX3070

### 操作步骤

此处待后期有时间补充详细图文

1. 查看采集卡设备信息
“.\mpvnet\ffmpeg\bin\ffmpeg.exe -list_devices true -f dshow -i dummy”
2. 修改run.bat文件中采集卡设备信息
3. (可选)添加缓存参数，用法"--demuxer-lavf-o=rtbufsize=2147480000,thread_queue_size=1024,video_size=1920x1080,framerate=24"
4. (可选)低配用户修改输入源分辨率和帧率，例如输入为720p，帧率20/24, 用法"--demuxer-lavf-o=rtbufsize=video_size=1280x720,framerate=20"
5. 双击运行，右键打开菜单选择超分补帧文件
6. (可选)N卡用户在MPV设置中，视情况分别修改配置为"gpu-next","winvk","nvdec-copy"
7. (可选)高配显卡(推荐40系列)用户可选下载，对应补帧高配选项。网盘/可选文件/mpv-lazy-20230513-Nvidia.7z，下载解压后覆盖到整合包里
如有相关问题，可以评论区留言或私信UP

### 相关命令

```shell
ffmpeg/bin/ffmpeg.exe -list_devices true -f dshow -i dummy

start mpvnet/mpvnet.exe av://dshow:video="capturecardname" --profile=low-latency --untimed 

start ffmpeg/bin/ffplay -f dshow -i audio="audioname" -audio_buffer_size 4
```



### 指令参数

此处补充参数说明



## 常见问题

Q：显卡和采集卡要求？延迟如何？

A：显卡至少独显，推荐N卡中高端(近几年60以上)，支持A卡，但部分超分文件存在兼容性问题；采集卡能连上电脑的就行，推荐1080p30fps的

中高端显卡无明显延迟，音画同步

延迟=采集卡延迟+超分延迟

超分延迟↑=显卡性能↓+超分配置文件↑



Q: 如何查看超分补帧状态信息

A: `键(Esc下面那个键)可以打开控制台；

i键可以查看视频信息



Q."xxx"不是内部或外部命令，也不是可运行的程序

A 1.检查文件夹名称是否和视频中一样重命名了；2.老版本windows系统路径问题，将斜杠改为反斜杠，例如"ffmpeg/bin/ffmpeg.exe"改为“.\ffmpeg\bin\ffmpeg.exe"



Q: 找不到接受实际参数“--profile=low-latency”的位置形式参数

A: 在文件夹地址栏使用CMD命令行打开，不要用右键菜单自带的powershell



Q: 音频存在延迟，声音比画面慢

A: "-audio_buffer_size 4" 把这个参数的值调高，例如从4调到100



Q: 视频播放器闪退，打开闪了一下就关了

A: 检查下采集卡连接情况，或者是否被其他软件在使用（如OBS,Potplayer)



Q: 补帧效果不明显

A: 自带的几个配置文件默认是给动漫使用的，源帧率限制在了32帧，目前还在找比较合适的配置文件，后面会放到整合包的里 



## 更新说明

### 整合v1.3_230620

1. 新增多个预设组，为王国之泪专门测试了几个好用的组合
2. 更新了自动保存配置的插件，下次打开自动使用上次运行配置
3. 新增着色器滤镜RA_Reduce
4. 修改超分补帧配置快捷键


### 整合v1.2_230617
v1.2更新内容(归档)

1. 更新超分补帧配置文件,并增量添加到预设中,方便快捷启用
   滤镜路径：\mpvnet\portable_config\vs
   着色器路径: \mpvnet\portable_config\shaders
   更新来源 hooke007/MPV_lazy

2. MPV.net程序UI替换为 diana7127/mpv.net-DW
3. 将ffmpeg移动到mpvnet内
4. 优化了启动命令，并对启动文件修改
视频：支持限制分辨率和帧率；可自行添加缓存参数
音频：修改缓存大小，降低延迟；静默显示





## 参考/来源

### 软件

[BtbN/FFmpeg](https://github.com/BtbN/FFmpeg-Builds/releases): 音视频全功能处理工具
[hooke007/MPV_lazy](https://github.com/hooke007/MPV_lazy): mpv_lazy懒人整合包
[diana7127/mpv.net-DW](https://github.com/diana7127/mpv.net-DW): mpv.net定制版

鸣谢hooke007整合的懒人包，diana7127的定制UI程序



### 资料参考

https://hooke007.github.io/unofficial/mpv_shaders.html

https://blog.kumo.dev/2022/05/17/nintendo_switch_4k

https://www.reddit.com/r/ffmpeg/comments/u741n7/remove_delay_on_ffplay_for_capture_device/

https://github.com/mpv-player/mpv/issues/7778 



## 申明
所有实现基于以上软件、程序和代码，版权参考开源仓库许可证
整合及配置花费大量时间精力,如需转载、分享或演示使用等,请注明作者和出处,望理解和支持