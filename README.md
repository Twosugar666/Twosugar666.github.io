# Xuanbo Guo's Personal Blog

🌐 **Live:** https://twosugar666.github.io

纯静态个人博客（HTML + CSS + JS），托管于 GitHub Pages。

## 结构

```
├── index.html          # 主页（About / Research / Experience / Publications / Blog）
├── assets/
│   ├── style.css       # 全站样式（支持浅色/深色主题）
│   └── main.js         # 主题切换 + 收藏夹筛选
└── posts/              # 博客文章（每篇一个 HTML 文件）
```

## 收藏夹

首页 chip 的 `data-filter` 对应列表项 `data-cat`（可多个，空格分隔）：

| chip 显示 | data-cat |
| --- | --- |
| Infra | `infra` |
| 基座 | `base` |
| Agent | `agent` |
| RL | `rl` |
| Harness | `harness` |
| 算法 | `algo` |
| 显卡 | `gpu` |
| 配件 | `pc` |

工作日日更三路：一线资讯（RL / Agent / LLM / Infra）、Harness、经典算法。基座收藏夹用于收录混元 HY 等基座模型专文，不独立成日更第四路。

## 如何发布新文章

1. 在 `posts/` 下新建一个 HTML 文件（可复制现有文章作为模板，推荐 `posts/daily-2026-08-26-granite-4-2.html`）
2. 在 `index.html` 的 Blog 列表**最前面**添加对应链接，并用 `data-cat` 归入收藏夹：
   ```html
   <li data-cat="rl agent">   <!-- infra / base / agent / rl / harness / algo / gpu / pc，可多个，空格分隔 -->
     <a href="posts/xxx.html">文章标题</a>
     <span class="post-side">
       <span class="post-cat">RL</span>
       <span class="post-date">2026-08-13</span>
     </span>
   </li>
   ```
3. `git add . && git commit -m "new post" && git push`，GitHub Pages 自动更新
