# Xuanbo Guo's Personal Blog

🌐 **Live:** https://twosugar666.github.io

纯静态个人博客（HTML + CSS + JS），托管于 GitHub Pages。

## 结构

```
├── index.html          # 主页（About / Research / Experience / Publications / Blog）
├── assets/
│   ├── style.css       # 全站样式（支持浅色/深色主题）
│   └── main.js         # 主题切换
└── posts/              # 博客文章（每篇一个 HTML 文件）
```

## 如何发布新文章

1. 在 `posts/` 下新建一个 HTML 文件（可复制现有文章作为模板）
2. 在 `index.html` 的 Blog 列表中添加对应链接，并用 `data-cat` 归入收藏夹：
   ```html
   <li data-cat="rl agent">   <!-- 可选：infra / agent / rl，可多个，空格分隔 -->
     <a href="posts/xxx.html">文章标题</a>
     <span class="post-side">
       <span class="post-cat">RL</span>
       <span class="post-date">2026-08-13</span>
     </span>
   </li>
   ```
3. `git add . && git commit -m "new post" && git push`，GitHub Pages 自动更新
