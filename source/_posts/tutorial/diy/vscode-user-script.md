---
title: 实用教程-VSCode设置用户代码片段
author: Syaoran
date: 2022-8-21
updated: 2022-8-21
---

配置模板，通过键入命令自动生成代码片段，提高写代码效率
![img](https://code.visualstudio.com/assets/docs/editor/userdefinedsnippets/ajax-snippet.gif)

<!--more -->

## 基础
- [官方文档](https://code.visualstudio.com/docs/editor/userdefinedsnippets)
- [在线生成工具](https://snippet-generator.app/)
- 通过输入`Insert Snippet`查看代码片段命令
- 在插件中搜索安装社区代码片段`@category:"snippets"`

## 代码片段配置

{% codeblock "setting.json" lang:json >folded %}

"[markdown]": {
    "editor.formatOnSave": true,
    "editor.renderWhitespace": "all",
    "editor.quickSuggestions": {
        "other": true,
        "comments": true,
        "strings": true
    },
    "editor.acceptSuggestionOnEnter": "on"
}
{% endcodeblock %}

## MarkDown

```json
{
    "more": {
		"prefix": "more",
		"body": [
			"<!-- more -->"
		],
		"description": "阅读全文"
	}
}
```
