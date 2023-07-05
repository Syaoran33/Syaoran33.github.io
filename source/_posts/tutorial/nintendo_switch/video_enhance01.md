[百度网盘下载地址](https://pan.baidu.com/s/12Kqi2C9C5bM0UqfwtNE3sw?pwd=3045)



演示设备

采集卡: 海备思THB03 (MS2131)

显卡: 移动端 RTX3070



相关命令

ffmpeg/bin/ffmpeg.exe -list_devices true -f dshow -i dummy

start mpvnet/mpvnet.exe av://dshow:video="capturecardname" --profile=low-latency --untimed 

start ffmpeg/bin/ffplay -f dshow -i audio="audioname" -audio_buffer_size 4



相关软件

https://www.lckp.top/thing/mpvnet_cm/

https://www.bilibili.com/video/BV1jG41137ak

https://github.com/BtbN/FFmpeg-Builds/releases



文档参考

https://blog.kumo.dev/2022/05/17/nintendo_switch_4k

https://www.reddit.com/r/ffmpeg/comments/u741n7/remove_delay_on_ffplay_for_capture_device/

https://github.com/mpv-player/mpv/issues/7778 