# Xuanbo Guo's Personal Blog

🌐 **Live:** https://twosugar666.github.io

纯静态个人博客（HTML + CSS + JS），托管于 GitHub Pages。

## 结构

```
├── index.html          # 主页（About / Research / Experience / Publications / Blog）
├── work.html           # 互动工作旅程（左侧 3D 手机 + 右侧经历详情，CSS/JS 内置）
├── assets/
│   ├── style.css       # 全站样式（支持浅色/深色主题）
│   ├── main.js         # 主题切换 + 收藏夹筛选
│   └── logos/apps/     # 6 个产品的官方 App 图标（512×512）
└── posts/              # 博客文章（每篇一个 HTML 文件）
```

## 互动工作旅程（真 3D 机身 + 右侧详情）

`work.html` 左右分栏：左边是一台 CSS 3D 六面 iPhone 机身（390×844×34，正面玻璃 / 背面三摄镜头模组 / 四条拉丝金属侧边与音量键 / 随视角流动的高光与地面阴影，另有动态壁纸、状态栏时钟、灵动岛、Widget 进度环），主屏只放 6 段实习的官方 App 图标；右边是当前选中经历的详情（标题、进度条、关键词、简介、统计、可展开项目卡片、上一段/下一段）。窄屏改为上下堆叠。

交互：点手机上的图标 → 手机以**弹簧阻尼 + rAF 连续插值**转动约 9°（默认 −24°，在 −40°~4° 间往复，带轻微惯性回弹）、图标高亮、右侧详情淡入切换；点机身空白处也会转；按住手机拖拽可自由转到侧面/背面（±170°），此时切到背面镜头面板，再点一下自动回正面；鼠标移动有阻尼视差倾斜。「重置视角」回初始角度，手机下方的「动效」可关闭动画并记忆偏好（也尊重 `prefers-reduced-motion`）。动画循环按需启动、静止自动停止，并有超时与切回标签页的对齐兜底。键盘 ← →、左右滑动、右侧按钮都能切换经历，深链接 `work.html#exp-<id>` 直接定位。

3D 实现要点：`.phone-rot / .phone-tilt / .phone-float / .phone-body` 保持 `transform-style: preserve-3d`；正反面 `.pfront / .pback` 必须 `transform-style: flat`，否则屏幕内容会穿过背面显示成镜像。不要在 `.phone-rot` 上放 opacity 动画、不要在 `.phone-frame` 上放 `translateZ(0)`，两者都会把 3D 上下文扁平化。`writeTransform()` 按 `cos(ry)` 显式切换正反面 `visibility` 作跨浏览器兜底，并按角度写入 `--sheen-pos / --sheen-shift / --frame-glow / --side-op / --shadow-x`（接近背面时压暗侧边，避免细亮线脱离机身）。

图标使用官方 App 图标，放在 `assets/logos/apps/`：微信、抖音（代表字节，Flow 无独立公开图标）、快手、网易云音乐、蔚来，以及由现有 logo 生成的第四范式品牌图标，均 512×512 满版铺满。主屏只保留这 6 个实习 App，无辅助 App / Dock。带 `logo` 的图标加载失败会回退到字母图标。

改内容只需编辑 `work.html` 里 `<script>` 顶部的 `EXPERIENCES` 数组；字段：`id / name / company / time / role / logo / g1,g2 / tags / summary / projects[{title, desc, metrics[]}] / todo`。`todo:false` 会去掉「待补充」提示，右侧详情版式在 `expPaneHTML` 里。新增经历时同时在 `index.html` 加一条 `href="work.html#exp-<id>"`。

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
