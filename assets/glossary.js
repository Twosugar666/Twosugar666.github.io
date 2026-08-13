// 术语表：点击正文中的专业名词弹出解释
(function () {
  const GLOSSARY = [
    { g: "policy", match: ["policy", "策略"], title: "策略（Policy）",
      text: "模型在给定上下文时选择下一个 token / action 的概率分布。RL 训练的全部意义就是改进这个分布：让高奖励的选择更可能被做出。" },
    { g: "trajectory", match: ["trajectory", "轨迹"], title: "轨迹（Trajectory）",
      text: "从 prompt 到最终答案（或任务结束）的完整序列，包括模型生成、工具调用、环境反馈。RL 的训练数据单位。" },
    { g: "reward", match: ["reward", "奖励"], title: "奖励（Reward）",
      text: "环境或规则给一条轨迹的打分，是 RL 优化的唯一目标信号。本系列多为结果奖励：答对 +1、答错 0 或 −1。" },
    { g: "value-model", match: ["value model", "价值模型"], title: "价值模型（Value Model / Critic）",
      text: "PPO 中用来估计『当前局面平均能拿多少奖励』的辅助模型，通常和 policy 一样大、很烧钱。GRPO 用组内平均 reward 替代它，把这个开销省掉了。" },
    { g: "baseline", match: ["baseline", "基线"], title: "基线（Baseline）",
      text: "衡量『比平均水平好多少』的参照线。从 reward 中减去基线可以降低梯度方差，让训练更稳。GRPO 的基线就是同题一组回答的平均分。" },
    { g: "advantage", match: ["advantage", "优势"], title: "优势（Advantage）",
      text: "某条轨迹或某个 token 比基线好多少。正值 → 训练提高它的概率；负值 → 压低。全系列所有算法的差别，本质上就是 advantage 从哪来。" },
    { g: "policy-gradient", match: ["policy gradient", "策略梯度"], title: "策略梯度（Policy Gradient）",
      text: "直接对策略参数求梯度、让高奖励行为概率变大的方法家族。PPO、GRPO、GSPO 都属于它。" },
    { g: "is", match: ["importance sampling", "重要性采样"], title: "重要性采样（Importance Sampling）",
      text: "训练数据是旧策略（old policy）采的，但你在优化新策略——用概率比 ratio 修正两者之间的分布偏差。" },
    { g: "ratio", match: ["ratio", "概率比"], title: "概率比（Ratio）",
      text: "exp(新策略 logprob − 旧策略 logprob)。等于 1 表示策略没变；偏离 1 越远，这一步更新越猛。PPO 的 clip 就是在给它限速。" },
    { g: "ppo", match: ["PPO"], title: "PPO（Proximal Policy Optimization）",
      text: "最经典的策略梯度算法：给 ratio 加 clip（如 [0.8, 1.2]），防止一次更新走太远。稳定性好，是 RLHF / RLVR 的常用基座。" },
    { g: "clip", match: ["clip", "裁剪"], title: "裁剪（Clip）",
      text: "把 ratio 限制在 [1−ε, 1+ε] 区间内，超出部分不再产生更大的梯度。DAPO 的 Clip-Higher 把上界放宽到 1.28，给低概率好 token 更大提升空间。" },
    { g: "kl", match: ["reverse KL", "KL 散度", "KL"], title: "KL 散度 / Reverse KL",
      text: "衡量两个概率分布差异的指标。OPD/OPSD 用 token 级 reverse KL（Student logprob − Teacher logprob）：Teacher 更认可的 token 被鼓励，反之被压低。" },
    { g: "entropy", match: ["entropy collapse", "entropy", "熵"], title: "熵（Entropy）与熵塌缩",
      text: "策略的随机性/多样性。熵塌缩（entropy collapse）指模型过早变得『只会一种答法』，探索能力枯竭。DAPO 的 Clip-Higher 就是针对这个问题。" },
    { g: "rollout", match: ["rollout"], title: "Rollout（采样轨迹）",
      text: "让当前策略实际生成回答、与环境交互的完整过程，产出训练原料（token + logprob + reward）。Agentic RL 中 rollout 往往比训练本身更耗时。" },
    { g: "on-policy", match: ["on-policy", "off-policy", "同策略"], title: "On-policy / Off-policy（同策略 / 异策略）",
      text: "训练数据来自当前最新策略就是 on-policy；数据落后于参数更新就变旧（off-policy）了。OPSD 每步刷新 sampler，就是为了严格 on-policy。" },
    { g: "token", match: ["token"], title: "Token",
      text: "模型处理文本的最小单位（约 0.5～1 个汉字/英文单词片段）。所有的计费、长度限制、loss 计算都按 token 进行。" },
    { g: "logprob", match: ["logprob", "log probability"], title: "Logprob（对数概率）",
      text: "模型给某个 token 的对数概率，越接近 0 表示越『喜欢』。RL loss 的核心操作数；old logprob 必须来自采样当时的策略，不能事后重算。" },
    { g: "tokenizer", match: ["tokenizer", "分词器"], title: "Tokenizer（分词器）",
      text: "文本与 token id 序列之间的转换器。训练、采样、Teacher 打分必须用同一个 tokenizer，否则逐 token 对齐全部失效。" },
    { g: "temperature", match: ["temperature", "top-p", "温度"], title: "采样温度（Temperature）与 Top-p",
      text: "控制采样随机性的参数：温度 >1 更发散、<1 更保守；top-p 只从累计概率前 p 的候选 token 中采样。评测通常用低温度（如 0.01）求稳定。" },
    { g: "lora", match: ["LoRA"], title: "LoRA（低秩适配）",
      text: "冻结主模型、只训练一小撮低秩矩阵的轻量微调方式，显存和成本都低一个量级。本系列全部实验都是 LoRA（rank 32～64）微调 Qwen3.5-4B。" },
    { g: "sft", match: ["SFT", "监督微调"], title: "SFT（监督微调）",
      text: "用『标准答案』数据做监督学习。缺点是训练时看专家轨迹、推理时面对自己的错误状态——分布错位，这正是 OPD/OPSD 要解决的问题。" },
    { g: "rlvr", match: ["RLVR", "可验证奖励"], title: "RLVR（可验证奖励强化学习）",
      text: "用规则而非 learned reward model 打分的 RL：数学题对答案、代码跑测试、格式做校验。只要能写出判分函数，就能先把 RL 循环跑起来。" },
    { g: "distillation", match: ["distillation", "蒸馏"], title: "蒸馏（Distillation）",
      text: "让小模型（Student）模仿大模型（Teacher）的输出分布。OPD 是它的 on-policy 变体：Teacher 在 Student 自己走出的轨迹上逐 token 指导。" },
    { g: "teacher-forcing", match: ["teacher forcing", "教师强制"], title: "Teacher Forcing（教师强制）",
      text: "把已有序列喂给模型只做前向打分、不让它自由生成。OPD 中 Teacher 就是这样给 Student 的真实轨迹计算 logprob 的——打分，不重写。" },
    { g: "forgetting", match: ["灾难性遗忘", "遗忘"], title: "灾难性遗忘（Catastrophic Forgetting）",
      text: "领域微调后原有通用能力显著退化。第 2 篇里 Medical SFT 让 C-Eval 从 81.67% 掉到 69.33%，SAR/IDT 两套 OPD 方案就是为解决这个问题。" },
    { g: "hacking", match: ["reward hacking", "奖励投机"], title: "Reward Hacking（奖励投机）",
      text: "模型钻奖励函数的空子而不是真正变强——比如奖励搜索次数就疯狂搜索。所以本系列坚持 outcome-only reward：只看最终结果。" },
    { g: "degenerate", match: ["degenerate", "退化组"], title: "退化组（Degenerate Group）",
      text: "同一 prompt 的一组回答 reward 全相同（全对或全错），组内 advantage 全为 0、没有训练信号。这个比例高说明题太易/太难，或环境出问题。" },
    { g: "prefill", match: ["prefill", "prefilling", "预填充"], title: "Prefill（预填充）",
      text: "生成前对整段 prompt 的一次性前向计算。长上下文 Agentic RL（如 ALFWorld）每轮都要带着增长的历史重算 prefix——843M prefill token 的账单大头就是这么来的。" },
    { g: "backward", match: ["backward", "反向传播", "forward"], title: "Forward / Backward（前向 / 反向传播）",
      text: "前向算出预测和 loss，反向根据 loss 计算梯度。本系列中这两步都由 PyTRIO 远端完成，本地只提交 Datum。" },
    { g: "adam", match: ["Adam", "优化器"], title: "Adam 优化器",
      text: "最常用的自适应学习率优化器，为每个参数维护动量和方差估计。学习率（lr）是它最关键的超参，本系列在 1e-6～4e-5 之间。" },
    { g: "checkpoint", match: ["checkpoint", "检查点"], title: "Checkpoint（检查点）",
      text: "训练中保存的模型快照。sampler weights 用于推理评测，training state 用于断点续训——第 2 篇特别强调了这两类路径不能混用。" },
    { g: "em", match: ["Exact Match", "EM"], title: "Exact Match（精确匹配）",
      text: "答案与参考答案完全一致才得分的严格判分（会做大小写、标点归一化）。不像人工评分那样给部分分。" },
    { g: "passk", match: ["Pass@", "Average@"], title: "Pass@k / Average@k",
      text: "每题采样 k 次：Pass@k 是『至少答对一次』的题目比例（能力上限）；Average@k 是所有生成的平均正确率（约等于 pass@1，日常水平）。" },
    { g: "sandbox", match: ["sandbox", "沙箱"], title: "沙箱（Sandbox）",
      text: "隔离执行模型生成代码的环境：超时限制、资源约束、无状态。ReTool 用本地 subprocess + 30s 超时 + RLIMIT_CPU 实现了零成本沙箱。" },
    { g: "datum", match: ["Datum"], title: "Datum（PyTRIO 训练数据单元）",
      text: "一次训练样本的打包：model_input + target_tokens + logprobs + advantages，四者必须严格等长对齐。构造时的自回归右移是最易错点。" },
    { g: "micro-batch", match: ["micro-batch", "微批"], title: "Micro-batch（微批）",
      text: "把过大的训练批次拆小、分次算梯度再累积，数学上等价于一次大批。注意：必须先在完整 group 上算 advantage，再拆 micro-batch，顺序不能反。" },
    { g: "grpo", match: ["GRPO", "组内相对"], title: "GRPO（组内相对策略优化）",
      text: "DeepSeekMath 提出：同一 prompt 采一组回答，用组内平均 reward 当 baseline，省掉 value model。本系列所有算法的起点。" },
    { g: "chat-template", match: ["chat template", "聊天模板"], title: "Chat Template（聊天模板）",
      text: "把多轮对话渲染成模型能懂的原始文本格式（含特殊 token）。各家模型格式不同；Qwen3.5 的模板会 strip assistant 内容，是 ReTool 篇踩过的坑。" },
    { g: "format-rate", match: ["Format", "格式率"], title: "Format Rate（格式遵循率）",
      text: "输出能被解析出规定答案格式（如 \\boxed{} 或 Answer:）的比例。多篇实验显示：RL 最先学会的往往是格式，而这部分提升容易被误读为能力变强。" },
  ];

  const article = document.querySelector(".post-body");
  if (!article) return;

  // 1) 自动标记正文中的术语（每词最多标前 2 次）
  const walker = document.createTreeWalker(article, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      if (!node.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
      const p = node.parentElement;
      if (p && p.closest("pre,code,a,h1,h2,h3,button,.term,script,style"))
        return NodeFilter.FILTER_REJECT;
      return NodeFilter.FILTER_ACCEPT;
    },
  });
  const textNodes = [];
  while (walker.nextNode()) textNodes.push(walker.currentNode);

  const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  GLOSSARY.forEach((entry) => {
    const re = new RegExp(
      entry.match
        .map((m) => (/^[\x20-\x7e]+$/.test(m) ? "\\b" + esc(m) + "\\b" : esc(m)))
        .join("|"),
      "i"
    );
    let marked = 0;
    for (const node of textNodes) {
      if (marked >= 2) break;
      if (!node.parentNode) continue;
      const m = re.exec(node.nodeValue);
      if (!m) continue;
      const after = node.splitText(m.index);
      after.splitText(m[0].length);
      const span = document.createElement("span");
      span.className = "term";
      span.dataset.g = entry.g;
      span.textContent = after.nodeValue;
      node.parentNode.replaceChild(span, after);
      marked++;
    }
  });

  // 2) 点击弹出解释卡片
  let pop = null;
  function closePop() {
    if (pop) { pop.remove(); pop = null; }
  }
  document.addEventListener("click", function (e) {
    const t = e.target.closest(".term");
    if (!t) { closePop(); return; }
    e.preventDefault();
    const entry = GLOSSARY.find((x) => x.g === t.dataset.g);
    if (!entry) return;
    closePop();
    pop = document.createElement("div");
    pop.className = "term-popover";
    pop.innerHTML =
      "<h4>" + entry.title + "</h4><p>" + entry.text + "</p>";
    document.body.appendChild(pop);
    const r = t.getBoundingClientRect();
    const pw = Math.min(340, window.innerWidth - 24);
    pop.style.maxWidth = pw + "px";
    let left = r.left + window.scrollX;
    left = Math.max(12, Math.min(left, window.scrollX + window.innerWidth - pw - 12));
    pop.style.left = left + "px";
    pop.style.top = r.bottom + window.scrollY + 8 + "px";
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closePop();
  });
  window.addEventListener("scroll", closePop, { passive: true });
})();
