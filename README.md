# Xuanbo Guo's Personal Blog

🌐 **Live:** https://twosugar666.github.io

纯静态个人博客（HTML + CSS + JS），托管于 GitHub Pages。

## 结构

```
├── index.html          # 主页（About / Research / Experience / Publications / Blog）
├── work.html           # 互动工作旅程（苹果官网式影棚产品页：左侧 3D 手机 + 右侧大字叙事，CSS/JS 内置）
├── assets/
│   ├── style.css       # 全站样式（支持浅色/深色主题）
│   ├── main.js         # 主题切换 + 收藏夹筛选
│   └── logos/apps/     # 6 个产品的官方 App 图标（512×512）
└── posts/              # 博客文章（每篇一个 HTML 文件）
```

## 互动工作旅程（真 3D 机身 + 右侧详情）

`work.html` 是苹果官网式产品页：纯净影棚渐变背景（无粒子/彩色光晕）、放大到主视觉的 CSS 3D 六面 iPhone 机身（390×844×34，多层金属边框 / 玻璃斜向高光 / 背面三摄镜头模组与蓝色镀膜 / 拉丝金属侧边与音量键 / 接触阴影）、亮色壁纸上的 6 个官方 App 图标。右侧是大字叙事：超大白色标题、时间/职位、细描边关键词、简介、细线分隔的规格条、细线项目列表、文字式上一段/下一段，**没有卡片和 dashboard 方框**。窄屏改为上下堆叠。

交互：点手机上的图标 → 手机以**弹簧阻尼 + rAF 连续插值**转动约 9°（默认 −24°，在 −40°~4° 间往复，带轻微惯性回弹）、玻璃上一道高光扫过（`sweepSheen()` + `.glass-sheen.sweeping`）、图标高亮、右侧详情位移入场；点机身空白处也会转；按住手机拖拽可自由转到侧面/背面（±170°），此时切到背面镜头面板，再点一下自动回正面；鼠标移动有阻尼视差倾斜。「重置视角」回初始角度，手机下方的「动效」可关闭动画并记忆偏好（也尊重 `prefers-reduced-motion`）。动画循环按需启动、静止自动停止，并有超时与切回标签页的对齐兜底。键盘 ← →、左右滑动、右侧按钮都能切换经历，深链接 `work.html#exp-<id>` 直接定位。

视觉约定：机身缩放由 `--sc` 控制（桌面 0.96，矮屏/窄屏有 media query 降级），透视 `2200px` 模拟长焦产品摄影；侧边高度 760px 且两端渐隐，收进机身 58px 圆角，避免在圆角外露出一截亮「刀刃」。屏幕壁纸用亮色渐变，让官方图标更跳。

3D 实现要点：`.phone-rot / .phone-tilt / .phone-float / .phone-body` 保持 `transform-style: preserve-3d`；正反面 `.pfront / .pback` 必须 `transform-style: flat`，否则屏幕内容会穿过背面显示成镜像。不要在 `.phone-rot` 上放 opacity 动画、不要在 `.phone-frame` 上放 `translateZ(0)`，两者都会把 3D 上下文扁平化。`writeTransform()` 按 `cos(ry)` 显式切换正反面 `visibility` 作跨浏览器兜底，并按角度写入 `--sheen-pos / --sheen-shift / --frame-glow / --side-op / --shadow-x`（接近背面时压暗侧边）。进场动画只做 `transform: translateY()`，不用 opacity。

动效陷阱（已修）：右侧详情入场**只做位移、不碰 opacity**，且切换前 `cancel()` 上一次动画 —— Web Animations 时钟若不推进会卡在第一帧 `opacity:0` 让整块面板消失；规格数字改为静态写入，不再用 `performance.now()` + rAF 翻滚（帧时间戳可能早于起点，插值会算出负数）。粒子 canvas 已完全停用，动效开关只管弹簧旋转。

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
