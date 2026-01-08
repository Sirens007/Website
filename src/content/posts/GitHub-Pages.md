---
title: GitHub Pages配置
published: 2025-08-27
pinned: false
description: 一篇关于建立GitHub Pages博客的文章.
tags: [JavaScript,GitHub Pages,笔记]
category: 教程
draft: false
---

# 环境依赖

在开始使用 Mizuki 之前，您需要确保系统满足以下要求：

+ **Node.js >= 20**
+ **pnpm >= 9**
+ **Git**

## 安装Node.js
访问 [Node.js 官网](https://nodejs.org/) 下载并安装最新版本的 Node.js。建议使用 LTS 版本。

安装完成后，打开终端或命令提示符，运行以下命令验证 Node.js 是否安装成功：

```bash
node -v
npm -v
```

如果显示版本号，则表示安装成功。

## 安装pnpm
如果您尚未安装 pnpm，可以通过 npm 安装：

```bash
npm install -g pnpm
```

安装完成后，打开终端或命令提示符，运行以下命令验证 pnpm 是否安装成功：

```bash
pnpm -v
```

如果显示版本号，则表示安装成功。

## 安装Git
访问 [Git 官网](https://git-scm.com/downloads) 下载并安装适合您操作系统的 Git 版本。

安装完成后，打开终端或命令提示符，运行以下命令验证 Git 是否安装成功：

```bash
git --version
```

如果显示版本号，则表示安装成功。  


# 项目启动
## 1.克隆项目
首先将模板拉下到本地仓库

```bash
git clone https://github.com/matsuzaka-yuki/Mizuki.git
cd ...//cd到项目地址处
```

## 2.安装依赖
使用 pnpm 安装项目依赖：

```bash
pnpm install
```

## 3.配置博客
在启动项目之前，您需要根据自己的需求进行配置：

+ 编辑 `src/config.ts` 文件来自定义博客设置
+ 更新站点信息、主题颜色、横幅图片和社交链接
+ 配置翻译设置和特殊页面功能

## 4.启动开发服务器
运行以下命令启动开发服务器：

```bash
pnpm dev
```

启动成功后，您可以在浏览器中访问 `http://localhost:4321` 查看您的博客。

## 5.打包网站
在本地项目处运行以下命令将网站打包成静态文件，生成到 `dist` 目录中：

```bash
pnpm build
```

生成的 `dist` 目录可以部署到您自己的服务器上。

# 部署到GitHub Pages
如果您希望将博客托管在 GitHub Pages 上，Mizuki 项目通常会包含一个 GitHub Actions 工作流，可以帮助您自动化部署过程。您需要确保在 `astro.config.mjs` 中配置正确的 `base` 路径。

还有将`package.json`的script中加入

```javascript
{
  "scripts": {
    "build": "vite build",  
    "deploy": "gh-pages -d dist -r https://github.com/<你的用户名>/<你的仓库名>.git"
  }
}
```

总共要改的配置文件为`astro.config.mjs`、`package.json`、`src/config.ts`

## 部署到 github.io 网址
在 `astro.config.mjs` 中配置文件设置 `site` 和 `base` 选项。

```javascript
import { defineConfig } from 'astro/config'

export default defineConfig({
  site: 'https://sirens007.github.io/',
  base: '/',
})
```

**Site**

`site` 的值必须是以下之一：

+ 基于你的用户名的以下网址: `https://<username>.github.io`
+ 为 GitHub 组织的私有页面 自动生成的随机网址：`https://<random-string>.pages.github.io/`

> **提示**
>
> 如果出现了以下情况，则不要设置 base 参数：
>
> 你的页面是由根文件夹所提供。
>
> 你的源码存储库是位于 https://github.com/<USERNAME>/<USERNAME>.github.io。
>

**Base**

`base` 的值应该是你的仓库名称，以正斜杠开头，例如 `/my-blog`。这样做是为了让 Astro 理解你的网站根目录是 `/my-repo`，而不是默认的 `/`。

**注意**

当配置了这个值后，你所有的内部页面链接都必须以你的 base 值作为前缀：

```html
<a href="/my-repo/about">关于本站</a>
```

查看更多关于配置 [base](https://docs.astro.build/zh-cn/reference/configuration-reference/#base) 值的信息。

## （可选）在GitHub Pages上使用自定义域名
> **设置一个自定义域**
>
> 你可以选择通过将一个 ./public/CNAME 文件添加到你的项目中，来设置自定义域
>
> 这会将你的站点部署在你的自定义域而不是 <YOUR_USERNAME>.github.io。
>
> 不要忘记为你的域名提供商配置 DNS。
>

要配置 Astro 以在 GitHub Pages 上使用自定义域名，请将你的域名设置为 site 的值。不要为 `base` 设置值：

```javascript
import { defineConfig } from 'astro/config'

export default defineConfig({
    site: 'https://example.com',
})
```

## 方法一：配置GitHub Action
在你的项目中的 `.github/workflows/` 目录创建一个新文件 `deploy.yml`，并粘贴以下 YAML 配置信息。

```yaml
name: Deploy to GitHub Pages

on:
# 每次推送到 `main` 分支时触发这个“工作流程”
# 如果你使用了别的分支名，请按需将 `main` 替换成你的分支名
push:
    branches: [ main ]
# 允许你在 GitHub 上的 Actions 标签中手动触发此“工作流程”
workflow_dispatch:

# 允许 job 克隆 repo 并创建一个 page deployment
permissions:
contents: read
pages: write
id-token: write

jobs:
build:
    runs-on: ubuntu-latest
    steps:
    - name: Checkout your repository using git
        uses: actions/checkout@v4
    - name: Install, build, and upload your site
        uses: withastro/action@v3
        # with:
        # path: . # 存储库中 Astro 项目的根位置。（可选）
        # node-version: 20 # 用于构建站点的特定 Node.js 版本，默认为 20。（可选）
        # package-manager: pnpm@latest # 应使用哪个 Node.js 包管理器来安装依赖项和构建站点。会根据存储库中的 lockfile 自动检测。（可选）

deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
    name: github-pages
    url: ${{ steps.deployment.outputs.page_url }}
    steps:
    - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

（可选）如果你在本地开发期间或预览构建期间，将环境变量传入给 Astro 项目，则需要定义 deploy.yml 文件中的任何公共变量，以便在部署到 Github 页面时处理它们。

```yaml
jobs:
build:
    runs-on: ubuntu-latest
    steps:
    - name: Checkout your repository using git
        uses: actions/checkout@v4
    - name: Install, build, and upload your site
        uses: withastro/action@v3
        env:
        # 使用单引号来包裹变量值
        PUBLIC_EVM_WALLET_ADDRESS: '0x4bFc229A40d41698154336aFF864f61083E76659'
```

1. 在 GitHub 上，跳转到存储库的 Settings 选项卡并找到设置的 Pages 部分。
2. 选择 GitHub Actions 作为你网站的 Source，然后按 Save。
3. 选择 GitHub Actions 作为你网站的 Source，然后按 Save。

你的网站现在应该已完成发布了！当你将更改推送到 Astro 项目的存储库时，GitHub Action 将自动为你部署它们。

## 方法二：增加gh-pages分支
## 安装部署
```bash
pnpm add -D gh-pages
```

 安装 `gh-pages` 包，它会帮你把 `dist/` 目录推送到 GitHub 仓库的 `gh-pages` （自动创建）分支。  

**运行命令**

+ `pnpm run build` → 生成 `dist/`
+ `pnpm run deploy` → 自动把 `dist/` 上传到 GitHub Pages

# 日常维护
#### 1.修改/新增文章或页面
在本地项目里（比如 `src/content`、`posts`、`pages` 等目录），新建或修改 Markdown/HTML/JSX 文件。

#### 2. 重新构建
```bash
pnpm build
```

+ **作用**：把修改后的源代码再打包到 `dist/` 目录。
+ **原因**：GitHub Pages 只会展示 `dist` 文件夹里的内容，而不会读取你的源代码。

#### 3. 部署到 GitHub Pages
```bash
pnpm run deploy
```

+ **作用**：自动运行 `gh-pages -d dist`，把最新的 `dist/` 推送到 `gh-pages` 分支。
+ **原因**：GitHub Pages 是根据 `gh-pages` 分支的内容来渲染你的网站的。





[部署 | Mizuki主题官方文档](https://docs.mizuki.mysqil.com/guide/deployment/#%E9%85%8D%E7%BD%AE-github-action)

