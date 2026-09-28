# Dr.Syaoran's Blog

基于 **Hexo 8** + **Arknights 主题** 的个人博客。

## 快速启动

```bash
# 安装依赖
npm install

# 本地预览（端口 8080）
npx hexo server -p 8080 -i 127.0.0.1

# 构建静态文件
npx hexo generate

# 清理缓存
npx hexo clean
```

Windows 下可直接双击 `blog.bat` 启动本地服务。

## 目录结构

```
source/
├── _posts/             # 博客文章
│   ├── notes/          # 随笔笔记
│   └── tutorial/       # 教程文章
│       ├── database/   # 数据库
│       ├── docker/     # Docker 相关
│       ├── js_reverse/ # JS 逆向
│       ├── nintendo-switch/  # Switch 相关
│       ├── python/     # Python
│       ├── python-spider/    # 爬虫
│       ├── sdorica/    # Sdorica 游戏逆向
│       └── windows/    # Windows
├── img/                # 图片资源
│   └── covers/         # 文章封面（3:1 比例）
├── about/              # 关于
└── music/              # 音乐页面
```

## 写作规范

### 1. 文件命名

**使用短横线（kebab-case）命名，不要用下划线。**

| ✅ 正确 | ❌ 错误 |
|---------|--------|
| `deploy-coder.md` | `deploy_coder.md` |
| `mongodb-query.md` | `mongodb_query.md` |
| `video-enhance.md` | `video_enhance.md` |

文件路径同时也决定了文章的 URL，如 `source/_posts/tutorial/docker/deploy-coder.md` → `/2024/03/28/tutorial/docker/deploy-coder/`。

### 2. Front-matter 模板

每篇文章必须包含以下头部信息：

```yaml
---
title: 文章标题
date: 2024/01/01
categories:          # 必填，主分类
  - Tutorials
tags:                # 必填，至少 1 个
  - 标签1
  - 标签2
cover:               # 可选，封面图 URL 或本地路径
---
```

#### 分类（Categories）

| 分类 | 适用场景 |
|------|---------|
| `Notes` | 随笔、笔记、导航页 |
| `Tutorials` | 技术教程、逆向分析 |

#### 标签（Tags）

标签不限数量，但要有实际意义。现有标签参考：

`Python` `Docker` `Linux` `MongoDB` `Streamlit` `FastAPI`
`JavaScript` `Reverse Engineering` `Security` `Network`
`Spider` `Spine` `Sdorica` `DIY` `Ubuntu` `Zelda` `TOTK`
`Nintendo Switch` `Windows`

### 3. 封面图片

- **推荐比例 3:1**（如 1200×400 或 900×300），与首页卡片展示一致。
- 本地图片放在 `source/img/covers/` 目录，front-matter 中引用 `/img/covers/xxx.jpg`。
- 也可以使用外部图片链接（如 medium 图床）作为封面。
- 如果文章没有合适的封面图，可以省略 `cover` 字段。

### 4. 文章内容

- 使用 `<!-- more -->` 标记摘要截断位置，摘要内容会显示在首页卡片中。
- 图片引用统一用绝对路径：`![alt](/img/xxx.png)`
- 代码块标注语言：```` ```python ````、```` ```bash ````

### 5. 文章筛选原则

- ✅ 保留：个性化经验、逆向分析、运维实战、独特方案
- ❌ 舍弃：通用教程、AI/搜索引擎可快速获取的内容

## 技术栈

- [Hexo](https://hexo.io/) v8.1.2 — 静态博客框架
- [Arknights](https://github.com/Yue-plus/hexo-theme-arknights) v1.19.0 — 明日方舟主题
- Node.js >= 20.19.0
