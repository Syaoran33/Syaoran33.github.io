


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


