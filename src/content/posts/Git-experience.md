---
title: Git基础学习
published: 2025-08-27
pinned: false
description: 一篇关于 Git 使用经验的文章.
tags: [Git,GitHub,笔记]
category: 开发
draft: false
---

## 📝以自己经验用Git

### 1.Git基础概念
Git = word写文档	GitHub = 腾讯文档分享协作

Git三个区域

```bash
工作区（Working Directory）—— 你正在编辑的文件
  ↓ git add
暂存区（Staging Area）—— 即将提交的快照
  ↓ git commit
版本库（Repository）—— Git 保存的历史记录
```

完整的开发流程通常是：

```bash
# 修改代码
git add 文件名             # 添加文件到暂存区
git commit -m "说明信息"   # 提交暂存区到版本库
```

---

### 2.本地 Git 仓库操作
以下内容是指在终端中使用

```bash
git config --global user.name "待填入名字"
git config -- global user.email "待填入邮箱"	#建议使用注册GitHub的用户名和邮箱，便于同步
                                  # --global 表示在你这台电脑上的所有仓库都使用这套设置。

git init #建立Git仓库，初始化Git仓库
         #或者从GitHub上拉一个项目（如刚创建了远程仓库）
git clone https://github.com/Sirens007/MyStorage.git

#如创建一个新文件
echo "#我的第一个项目" > README.md
#添加到Git暂存区
git add README.md
#提交到本地仓库
git commit -m "添加了README文件"
#绑定 GitHub 仓库作为远程仓库 origin	（即origin为远程仓库昵称）
git remote add origin https://github.com/Sirens007/MyStorage.git
#首次推送GitHub
git push -u origin main #如果提示 main 不存在，可以先用 git branch -M main 把默认的 master 分支改名。

git status
#查看当前工作状态 （如查看还未暂存的文件
git log
#查看提交历史

```

---

### 3.查看状态与差异
当你已经完成了基本的 `add` 和 `commit` 操作后，日常开发中你最常用的两个命令是：

+ `git status`：查看当前仓库状态
+ `git diff`：查看文件内容发生了哪些改动

**一、git status —— 查看状态**

```bash
git status
```

**作用：**

查看当前工作区和暂存区的状态。

**原理解释：**

Git 会比较这三者的内容是否一致：

1. **工作目录中的文件**
2. **暂存区中的文件（通过 git add 添加的）**
3. **最后一次提交的版本（历史）**

<details class="lake-collapse">
  <summary id="u29606243"><strong><span class="ne-text">结果分析</span></strong></summary>

  <h4 id="98be1ecf"><span class="ne-text" style="color: #DF2A3F">🔴</span> <span class="ne-text">情况1：工作区干净</span></h4>
  <pre data-language="bash" id="WQi54" class="ne-codeblock language-bash"><code>$ git status
On branch master
nothing to commit, working tree clean</code></pre>
  <p id="u0e2b9816" class="ne-p"><span class="ne-text">意思是：没有文件被修改，也没有新增或删除。</span></p>

  <h4 id="3e1a3f71"><span class="ne-text" style="color: #DF2A3F">🟡</span> <span class="ne-text">情况2：修改了文件但还没 add</span></h4>
  <pre data-language="bash" id="ZGtno" class="ne-codeblock language-bash"><code>$ git status
modified:   hello.txt</code></pre>
  <p id="ufa272c14" class="ne-p"><span class="ne-text">说明 </span><code class="ne-code"><span class="ne-text">hello.txt</span></code><span class="ne-text"> 有改动，但还没有被添加进暂存区。</span></p>

  <h4 id="c160fd94"><span class="ne-text">🟢</span> <span class="ne-text">情况3：已 add 到暂存区但还没 commit</span></h4>
  <pre data-language="bash" id="L2q4R" class="ne-codeblock language-bash"><code>$ git status
Changes to be committed:
  (use "git restore --staged <file>..." to unstage)
        modified:   hello.txt</code></pre>
</details>

**二、git diff —— 查看修改内容**

```bash
git diff
```

**作用**

+ 显示当前工作目录中未加入暂存区的变更（对比的是：工作区 ↔ 暂存区）

**你也可以用：**

```bash
git diff hello.txt
```

来查看某个具体文件的改动。

<details class="lake-collapse"><summary id="u423a2fc5"><strong><span class="ne-text">补充</span></strong></summary><h4 id="k8LQy"><span class="ne-text">查看已经 add 但还未 commit 的差异：</span></h4><pre data-language="bash" id="J3Z0b" class="ne-codeblock language-git"><code>git diff --cached</code></pre><p id="u52bf5124" class="ne-p"><span class="ne-text">或者：</span></p><pre data-language="bash" id="cEllX" class="ne-codeblock language-git"><code>git diff --staged</code></pre><h4 id="u539c"><span class="ne-text"></span><span class="ne-text">作用：</span></h4><ul class="ne-ul"><li id="udf0dfced" data-lake-index-type="0"><span class="ne-text">查看“暂存区”中与“上一次提交版本”之间的差异。</span></li></ul></details>



### 4.文件恢复与版本回退
**开发中你经常会遇到这些情况：**

| **场景** | **想做的事** |
| --- | --- |
| 改错文件了 | 想恢复回之前保存的版本 |
| add 错文件了 | 想撤回到未暂存状态 |
| commit 之后后悔了 | 想撤销或回退提交 |
| 改了很多但不想要了 | 想恢复整个文件夹到之前状 |


**本节主要命令：**

+ `git restore`：恢复文件内容（推荐）
+ `git checkout`：旧版本恢复（老派用法）
+ `git reset`：取消暂存、版本回退
+ `git log`：查看历史提交

---

**一、恢复工作区文件：**`git restore`

```bash
git restore <filename>

eg:
echo "bad line" >> hello.txt      # 加了一行错误内容
git restore hello.txt             # 撤销这次改动
```

**作用**：

把某个文件恢复到上一次 `git add` 或 `git commit` 之后的状态，**取消你刚刚改的内容**。

**背后原理：**

从 Git 暂存区或仓库中拿出该文件的版本，覆盖当前工作区。

---

**二、撤销 **`git add`**：**`git restore --staged`

```bash
git restore --staged <filename>

eg:
git add hello.txt
git restore --staged hello.txt  #撤回add，但改动还在
```

**作用：**

把文件从**暂存区**移除，但保留工作区的改动。

**使用场景：**

你 `git add` 了一个不该提交的文件，可以用这条命令撤回。

---

 **三、版本回退：**`git reset`

**命令：取消已经 add 的内容**

```bash
git reset filename
```

等效于上面那句 `git restore --staged`，只是老一点的写法。

---

**命令：回退到上一个提交版本（慎用）**

```bash
git reset --hard HEAD
```

**作用：**

把整个项目（工作区 + 暂存区）恢复到上一次提交的状态。

 ❗❗ 注意：`--hard` 是“硬回退”，**不可恢复的清空当前修改**，一定要确认再用！  

---

**四、查看历史版本：**`git log`

+ 显示提交历史
+ 会看到一堆 `commit xxx...` 的 ID、作者、时间、提交说明

```bash
git log

eg:
git log -p hello.txt	#查看历史内容改了什么
```

### 5.分支管理（分支的创建、切换、合并）
在实际开发中，我们经常会遇到这种需求：

+ 不打扰主线代码，先试试一个新功能
+ 多个开发人员各自写各自的功能
+ 想在多个版本之间切换工作

这时，就要用到「**分支（branch）**」来隔离、管理不同的开发线。

> <font style="color:#DF2A3F;">补充对分支的理解，如我在main分支创建了a.txt （未add），此时创建dev分支可以看见main分支对a.txt的更改。但如果我在dev上commit之后，回到main之后则不存在a.txt文件了，就相当于两个工作区一样</font>
>

**Git 分支基本概念**

+ **主分支**：默认叫 `master`（或 `main`）
+ **分支的本质**：一个指向某次提交的“指针”
+ **HEAD**：指向当前分支的位置（你正在干活的分支）

**1.查看已有分支： **`git branch 分支名`

```bash
git branch
```

+ 会列出当前所有分支，当前所在的分之前有`*`标记

---

**2.创建新分支：**`git branch 分支名`

```bash
git branch dev
```

+ 创建一个名为dev的新分支，复制自当前分支的最新提交。

---

**3.切换分支：**`git switch 分支名`

```bash
git switch dev
```

+ 此时已切换dev分支，开始在上面开发了
+ 如果是老版本Git，也可以用`git checkout dev`。

---

**4.创建并切换新分支：一条命令搞定**

```bash
git switch -c dev
```

相当于：

```bash
git branch dev
git switch dev
```

Git 会尝试把`dev`上的改动合并进master，如果没有冲突，会自动完成。

---

5.合并分支：`git merge`

切换会主分支后，合并新分支的内容：

```bash
git switch main
git merge dev
```

Git 会尝试把`dev`上的改动合并进main，如果没有冲突，会自动完成。

---

6.删除分支（合并后清理）：`git branch -d`

```bash
git branch -d dev
```

如果你确认合并完了，就可以删掉旧分支。

### 6.搭建ssh远程连接（无需梯子）
**一、配置git bash**

在git bash中运行以下：

```bash
ssh-keygen -t ed25519 -C "你的GitHub邮箱"
```

当提示：

```bash
Enter file in which to save the key (~/.ssh/id_ed25519):
```

你可以直接回车（会覆盖旧的 id_ed25519）  
或者输入一个新名字，比如：

```bash
~/.ssh/id_ed25519_laptop
```

---

**二、启用新的ssh key**

```bash
eval "$(ssh-agent -s)"

ssh-add ~/.ssh/id_ed25519_laptop
```

**三、把公钥加到Github**

```bash
cat ~/.ssh/id_ed25519_laptop.pub
```

 复制整段（从 `ssh-ed25519` 开始到最后），  
然后在 GitHub → **Settings** → **SSH and GPG keys** → **New SSH key** → 粘贴保存。  
标题建议写成 “Laptop - 2025” 这种好区分的名字。  

**四、验证**

```bash
ssh -T git@github.com
```

看到：

```bash
Hi Sirens007! You've successfully authenticated...
```

说明配置成功

### 7.远程仓库操作
**1.远程仓库概念**

 本地 Git 仓库 = 你电脑上的版本库（`.git` 目录）。  
远程仓库 = 存在于服务器（比如 GitHub）上的版本库。

**2.四个常用操作**

**（1）clone - 从远程仓库下载到本地**

```bash
git clone https://github.com/Sirens007/MyStorage.git

#运行后，你本地就有一个 myproject 目录，并且可以直接 git pull 或 git push。
```

作用：

+ 会在本地新建一个文件夹
+ 自动把该仓库的所有版本历史下载到本地
+ 自动设置好 `origin` 这个远程名，指向该仓库



---

**（2）remote - 管理远程仓库地址**

查看已有远程：

```bash
git remote -v
```

添加远程：

```bash
git remote add origin https://github.com/Sirens007/MyStorage.git
```

修改远程：

```bash
git remote set-url origin <新地址>
```

删除远程：

```bash
git remote remove origin
```

`origin` 是默认的远程仓库名字，你也可以用别的名字。



---

**（3）push - 推送本地代码到远程**

第一次推送（如果远程没有内容）：

```bash
git push -u origin main
```

解释：

+ `origin`：远程仓库名
+ `main`：分支名
+ `-u`：记住这个推送目标，下次可以直接`git push`

之后推送就可以：

```bash
git push
```



---

**（4）pull - 从远程拉取最新版本**

```bash
git pull origin main
```

作用：

+ 把远程 main 分支的最新提交下载到本地
+ 并与本地当前分支合并

如果远程没有变化，你会看到：

```bash
Already up to date.
```



---

**（5）远程分支与本地分支的关系**

+ 当你执行 `git clone` 或 `git fetch` 后，Git 会在本地维护远程分支的快照，叫做 **远程跟踪分支**，格式一般是 `origin/分支名`。
+ 本地分支和远程分支是分开的，推送（`push`）和拉取（`pull`）就是它们之间的同步操作。



---

**（6）查看远程分支**

```bash
git branch -r
```

+ 只列出远程仓库的分支

```bash
git branch -a
```

+ 本地和远程所有分支都会显示



---

**（7）跟踪远程分支的新建本地分支**

如果远程有个分支，你想在本地工作，需要先新建一个本地分支跟踪远程：

```bash
git switch-c dev origin/dev
```

+ 这会基于远程`dev`分支新建本地`dev`分支



---

**（8）远程仓库冲突解决**

多人合作时，推送可能被拒绝，提示远程有更新需要先拉取：

```bash
git push
To https://github.com/xxx.git
 ! [rejected]        main -> main (fetch first)
error: failed to push some refs to 'https://github.com/xxx.git'
hint: Updates were rejected because the remote contains work that you do
hint: not have locally. ...
```

这时，需要先拉取远程的最新修改：

```bash
git pull --rebase origin main
```

+ `--rebase` 表示把你的提交“挪到”最新远程修改之后，避免额外合并提交。



---

**（9）查看远程仓库详情**

```bash
git remote show origin
```

可以看到：

+ 远程分支状态
+ 你本地分支对应的上游分支
+ 是否有可推送或拉取的内容

