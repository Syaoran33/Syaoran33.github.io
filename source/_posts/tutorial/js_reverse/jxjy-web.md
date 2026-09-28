---
title: 东奥会计继续教育网课逆向
date: 2023/12/18
cover: https://miro.medium.com/v2/resize:fit:1100/format:webp/1*7BneFs8K6MmQ69xLvNcDKQ.png
categories:
  - Tutorials
tags:
  - JavaScript
  - Reverse Engineering
---

继续教育网课js逆向，仅限东奥会计

<!--more-->

## js逆向过程
此倍速方法2024年失效，疑似服务端增加校验，倍速会导致学习时长不足

用Chrome开发者工具，到源码中检索playbackRate
```
// aPlayer.min.js
// location: jxjyresource.dongao.cn/cwwebResources/static/h5-listen/js/daPlayer.min.js
return t.handleClick = function() {
    a.prototype.handleClick.call(this),
    this.player().playbackRate(this.rate)
}
```

下断点，点击倍速按钮，在控制台数据`this.rate = 1.5`
到2倍速以上会触发限制，报错您不能同时学习多个视频
![](jxjy-web001.png)
```
document.getElementById('player_daPlayer').playbackRate = 1.5
video.tdata.timeLenDealInterval = 25
```
或通过代码直接调用

用`Powertoys`置顶，把标签页单独拎出来，然后缩放到最小能看到进度条时间就行


