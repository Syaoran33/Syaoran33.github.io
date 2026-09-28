---
title: ASM入网小助手软件校验
date: 2025/03/24
cover: https://miro.medium.com/v2/resize:fit:720/format:webp/1*0VPcgDFGv63P68nrtQtkmw.jpeg
categories:
  - Tutorials
tags:
  - Windows
  - Security
---

## 注册表

入网认证时会校验电脑是否安装指定软件和卸载指定软件，具体对应到注册表`Uninstall`中的`DisplayName`
<!-- more -->


### 安装软件
我们可以直接用注册表进行伪装,打开记事本复制对应内容,重命名为`asm.reg`,双击安装即可
```reg
Windows Registry Editor Version 5.00

; 注册虚拟软件 WPS Office 和 腾讯御点 到 64 位和 32 位路径

[HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows\CurrentVersion\Uninstall\WPS Office]
"DisplayName"="WPS Office"
"DisplayVersion"="11.8.2.8361" 
"Publisher"="Kingsoft"
"InstallLocation"="C:\\Program Files\\Kingsoft\\WPS Office\\"  
"UninstallString"="C:\\Program Files\\Kingsoft\\WPS Office\\uninstall.exe"  
"DisplayIcon"="C:\\Program Files\\Kingsoft\\WPS Office\\WPS.exe"  
"QuietUninstallString"="C:\\Program Files\\Kingsoft\\WPS Office\\uninstall.exe /quiet" 
"InstallDate"="20241213"  
"Publisher"="Kingsoft"


; 对应 32 位注册表路径
[HKEY_LOCAL_MACHINE\SOFTWARE\WOW6432Node\Microsoft\Windows\CurrentVersion\Uninstall\WPS Office]
"DisplayName"="WPS Office"
"DisplayVersion"="11.8.2.8361" 
"Publisher"="Kingsoft"
"InstallLocation"="C:\\Program Files (x86)\\Kingsoft\\WPS Office\\" 
"UninstallString"="C:\\Program Files (x86)\\Kingsoft\\WPS Office\\uninstall.exe" 
"DisplayIcon"="C:\\Program Files (x86)\\Kingsoft\\WPS Office\\WPS.exe"  
"QuietUninstallString"="C:\\Program Files (x86)\\Kingsoft\\WPS Office\\uninstall.exe /quiet"
"InstallDate"="20241213"  
"Publisher"="Kingsoft"


[HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows\CurrentVersion\Uninstall\QQPCMgr]
"DisplayName"="Tencent EPM"  ; 软件显示名称，这个是关键
"DisplayVersion"="15.5.0.1234" 
"Publisher"="Tencent"  
"InstallLocation"="C:\\Program Files\\Tencent\\PC Manager\\"  
"UninstallString"="C:\\Program Files\\Tencent\\PC Manager\\uninstall.exe" 
"DisplayIcon"="C:\\Program Files\\Tencent\\PC Manager\\PCMgr.exe" 
"QuietUninstallString"="C:\\Program Files\\Tencent\\PC Manager\\uninstall.exe /quiet" 
"InstallDate"="20231213" 
"Publisher"="Tencent" 

[HKEY_LOCAL_MACHINE\SOFTWARE\WOW6432Node\Microsoft\Windows\CurrentVersion\Uninstall\QQPCMgr]]
"DisplayName"="Tencent EPM"
"DisplayVersion"="15.5.0.1234"
"Publisher"="Tencent" 
"InstallLocation"="C:\\Program Files (x86)\\Tencent\\PC Manager\\" 
"UninstallString"="C:\\Program Files (x86)\\Tencent\\PC Manager\\uninstall.exe"
"DisplayIcon"="C:\\Program Files (x86)\\Tencent\\PC Manager\\PCMgr.exe"  
"QuietUninstallString"="C:\\Program Files (x86)\\Tencent\\PC Manager\\uninstall.exe /quiet"  
"InstallDate"="20231213" 
"Publisher"="Tencent"  


[HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows\CurrentVersion\Uninstall\ThreatBook Agent]
"DisplayName"="ThreatBook Agent"
"DisplayVersion"="3.7.5.2024"
"Publisher"="ThreatBook Inc."
"InstallLocation"="C:\\Program Files\\ThreatBook\\Endpoint Agent\\"
"UninstallString"="\"C:\\Program Files\\ThreatBook\\Endpoint Agent\\uninstaller.exe\" /mode unattended"
"DisplayIcon"="C:\\Program Files\\ThreatBook\\Endpoint Agent\\TbAgentGUI.exe,0"
"QuietUninstallString"="\"C:\\Program Files\\ThreatBook\\Endpoint Agent\\uninstaller.exe\" /silent"
"InstallDate"="20231015"
"URLUpdateInfo"="https://www.threatbook.com/support/updates"
"HelpLink"="https://support.threatbook.com/endpoint"
"EstimatedSize"=dword:00000200  ; 512MB
"SystemComponent"=dword:00000000
"NoRepair"=dword:00000001
"RealTimeProtection"=dword:00000001
"FirewallIntegration"=dword:00000001
"LastVirusDefinitionUpdate"="20231015153000"


```


### 卸载软件
卸载软件的修改也是找到指定的`DisplayName`,手动进行修改或删除
office软件推测识别的是否包含`Microsoft Office`

64位：HKEY_LOCAL_MACHINE\SOFTWARE\Wow6432Node\Microsoft\Windows\CurrentVersion\Uninstall\

32位：HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows\CurrentVersion\Uninstall
