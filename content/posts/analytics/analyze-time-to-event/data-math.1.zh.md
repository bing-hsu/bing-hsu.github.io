+++
date = '2026-11-13T15:59:26+08:00'
draft = false
title = '数据特征与数学工具集'
description = '理解事件时间数据、删失与潜在事件时间，并将生存函数和风险函数与 Cox 及 AFT 模型背后的建模思路联系起来。'
tags = ['数据分析']
translationKey='analyze-time-to-event-1'
math = true
seriesID = 'analyze-time-to-event'
seriesTitle = 'Analyze Time-to-Event'
seriesRole = 'chapter'
seriesChapter = 1
seriesSection = 0
seriesOrder = 100
+++

<!-- span color classes (inserted by :SpanStyles) -->
<style>
  .red       { color: #e74c3c; }
  .orange    { color: #e67e22; }
  .yellow    { color: #b58900; }
  .green     { color: #27ae60; }
  .blue      { color: #3498db; }
  .purple    { color: #8e44ad; }
  .dim       { color: #888888; }
  .highlight { background-color: #fff3b0; color: #7a5c00; }
</style>

## 事件时间数据

**事件时间数据(Time-to-event data)**
衡量的是研究对象在一段观察窗口内所经历的时间以及所处的状态。

<figure style="text-align: center; width: 100%; max-width: 600px; margin: 30px auto;">
<img src="/img/analytics/time-to-event.png" alt="time-to-event" />
</figure>

- **观察窗口（Observation Window）$\tau$ 或
  $T_\text{max}$**：从“研究开始”到“分析时间点”。
- **入组时间（Recruited）$t_\text{entry}$**：研究对象开始被观察的起始时间点。
- **事件时间（Event）$t_\text{event}$**：表示研究对象在观察窗口内发生了我们关注的事件。
- **删失时间（Censored）$t_\text{censored}$**：表示研究对象在观察窗口内未发生我们关注的事件。

每个研究对象 $i$ 都可以表示为如下结构：

$$(T_i, \delta_i, X_i)$$

- **持续时间（Duration，$T_i$）：**
  研究对象在观察窗口内处于观察状态的时长（$T_i \le \tau$）。
- **状态指示变量（Status Indicator，$\delta_i$）：**
  - $\delta_i = 1$：事件在时间 $T_i$ 发生。
  - $\delta_i = 0$：事件在观察窗口内未发生。
- **协变量（Covariates）$X_i = (X_{i1}, X_{i2}, \dots, X_{ip})$：** 刻画对象 $i$
  特征的 $p$ 个独立因素。

## 日历时间 vs. 持续时间

需要注意两个截然不同的时间概念：**日历时间（calendar time）$t$**
与**持续时间（duration）$T$**。

例如，研究对象 10 的观察持续时间约为 15（$t_{\text{event}} - t_{\text{entry}} = 65 - 50 \approx 15$），但事件发生在第 65 天（$t_{\text{event}} \approx 65$）。

- **日历时间（$t$）：** **统一的**自然时间轴。$t = 0$
  标记观察开始的那一天，$t = 100$ 标记观察结束的那一天。

- **持续时间（$T$）：**
  每个研究对象的**独立**计时器，表示该对象在当前研究中所经历的时长。

对于研究对象 10：

$$
\begin{aligned}
&t_{\text{entry}} \approx 50 \quad t_{\text{event}} \approx 65 \\[1em]
&T = t_{\text{event}} - t_{\text{entry}} \approx 15
\end{aligned}
$$

对于研究对象 7：

$$
\begin{aligned}
&t_{\text{entry}} \approx 20 \quad t_{\text{censored}} \approx 70 \\[1em]
&T = t_{\text{censored}} - t_{\text{entry}} \approx 50
\end{aligned}
$$

我们可以使用**持续时间**坐标轴重新排列上述图表：

<figure style="text-align: center; width: 100%; max-width: 500px; margin: 30px auto;">
<img src="/img/analytics/time-to-event-aligned.png" alt="alt text" />
</figure>

基于这一理解，我们可以用日历时间 $t$ 来表示持续时间 $T$：

$$
T = \begin{cases} t_{\text{event}} - t_{\text{entry}}, & \text{if } \delta = 1 \text{ (发生事件)} \\ t_{\text{censored}} - t_{\text{entry}}, & \text{if } \delta = 0 \text{ (发生删失)} \end{cases}
$$

使用示性函数记号进行代数表达，即为：

$$T = \delta \, (t_{\text{event}} - t_{\text{entry}}) + (1 - \delta) \, (t_{\text{censored}} - t_{\text{entry}})$$

## 提前退出 / 删失

到达分析时间点 $t = 100$ 的研究对象经历了**行政删失（administrative
censoring）**，因为观察窗口已关闭；而研究对象 7 在研究仍在进行时便停止了观察，这体现了**右删失（right-censoring）**。

## 潜在事件时间 $T^*$

在事件发生时间分析中，我们真正建模的对象是
**给定协变量$X$条件下，_潜在事件时间（latent event time）$T^*$_ 的条件分布** 。

$${P}(T^* \mid X)$$

在一次研究中，你无法得知所有研究对象的事件时间
$T^*$；由于观察不可能无限期持续，他们发生了“删失”。然而，每个研究对象都存在一个事件终将发生的时间点。从某种意义上说，这段持续时间是真实存在的，只是尚未在研究期间显现出来——因此称为“潜在”（latent）。

对于一部分对象，你在观察窗口内确认了他们的 $T^*$，这些人就是 **“事件对象”（Event
Subjects）** ；而另一部分对象在观察窗口内并未遭遇该事件，这些人就是
**“删失对象”（Censored Subjects）**。

分析师所做的事情，本质上是利用观察窗口内从“事件对象”和“删失对象”两类人群中收集到的证据，对这些“删失对象”何时会发生事件（$T^*$）做出有依据的推断。

- “事件对象”揭示了什么样的特征倾向于导致事件发生。
- “删失对象”揭示了什么样的特征倾向于阻止事件发生。

之所以能够对新对象进行预测，是因为我们可以**将新加入的对象概念化为在起点处即发生删失的删失对象**。

于是问题转化为：_我们能否利用手头已有的信息
$(T, \delta, X)$，估计出这些“删失”对象**何时**会发生事件 $T^*$？_

**任务 A：已删失的研究对象**

> 由于他们在时间 $T$ 发生删失，你可以确信 $T^* > T$。

- **目标：** 估计在时间 $T$ *之后*的**剩余生存分布（residual survival
  distribution）**：

对于研究对象 7，已知 $(T, X) = (50, X)$，我们对其 $T^*$ 建模：

$$
{P}(T^* > t \mid T^* > 50, X)  \quad \text{for } t > 50
$$

> _“已知该患者在观察终止前保持健康长达 50 天，他们大约会在什么时候发生‘目标事件’？”_

**任务 B：新研究对象**

我们可以将一个新对象概念化为 $T=0$ 时的“删失”对象：_“一个在起点
$(T, \delta) = (0,0)$ 处便脱离观察的人”_。 由于他们在第 $0$
天即发生删失，你事先对 $T^*$ 一无所知；换言之，$T^*$ 是“不受约束的” / “不以 $T$
为条件的”。

- **目标：** 估计 $T^*$ 的分布：

对于具有特征 $X$ 的新对象，我们对其 $T^*$ 建模：

$${P}(T^* > t \mid X) \quad \text{for } t \ge 0$$

### 关于 ${P}(T^* \mid X)$ 的函数分类体系

概率测度 ${P}(T^* \mid X)$
是一个抽象的数学实体。为了使其具有可操作性，我们用四个相互关联的函数来刻画它。这四个函数彼此等价，确定其中任意一个即可推导出其余三个：

> 出于历史沿革，这些函数的命名惯例承袭自医学治疗中的死亡率研究——事件意味着“死亡”；因此，事件发生代表坏结果，而未发生代表好结果。
>
> 在实际应用中，事件发生时间分析并不仅限于事件不受欢迎的场景。这种偏好是可逆的——事件发生也可以代表好结果，而未发生反而不理想。

**失效概率（Failure Probability）$F(t)$**

> 累积分布函数（CDF）

研究对象未能存活超过时间 $t$（即在 $t$ 之前发生事件）的概率。

$$F(t \mid X) = {P}(T^* \le t \mid X)$$

**生存概率（Survival Probability）$S(t)$：**

> 互补累积分布函数（CCDF）

研究对象存活超过时间 $t$（即在 $t$ 之前未发生事件）的概率。

$$S(t \mid X) = {P}(T^* > t \mid X) = 1 - F(t \mid X)$$

**风险率（Hazard Rate）$h$**

> 尾部概率的消耗率（depletion rate）。
>
> 在概率论中，尾部概率是指随机变量超过某一高阈值的概率
> $P(X > x)$。消耗率（或衰减率）描述了随着阈值 $x$ 增大，该概率向零趋近的速度。
>
> $h$ 表示在时刻 $t$，剩余生存“缓冲垫” $S(t)$ 被消耗掉的**比例**。
>
> 从某种意义上说，
> $$h = \frac{\text{当前趋向事件的速度}}{\text{距离事件的剩余缓冲}}$$

$$
h(t \mid X) = \lim_{\Delta t \to 0} \frac{{P}(t \le T^* < t + \Delta t \mid T^* \ge t, X)}{\Delta t} = \frac{f(t \mid X)}{S(t \mid X)}
$$

$h$
表示概率的瞬时变化率，即概率变化的速度。它可以超过 1；事实上，只要瞬时概率变化量满足
$\Delta {P} = h(t \mid X) \cdot \Delta t \in [0,1]$，$h(t \mid X)$ 就可以取
$[0, \infty)$ 内的任意非负值。

> $f(t)$
> 是概率密度函数（PDF）；作为失效函数的导数（$f(t) = F'(t)$），它代表了趋向失效的速度（当前趋向事件的速度）。

**累积风险（Cumulative Hazard）$H(t \mid X)$：**

> 表示假设事件可重复发生且不会导致个体“退出”时，截至时间 $t$
> 预期会经历的事件次数。

$$H(t \mid X) = \int_0^t h(u \mid X) \, du = -\log S(t \mid X)$$

反演可得：

$$S(t \mid X) = \exp\big(-H(t \mid X)\big) = 1 - F(t \mid X)$$

想象一个机械零件，它以风险率 $h(t)$
发生故障。每次故障时，你都立即更换一个新零件，同时保持环境中的其他条件不变。在较长的一段时间
$t$ 内，这台机器可能会损坏 3 到 4 次。这个预期故障次数就是
$H(t)$（例如，$H(t) = 3.5$）。

> 推导 $H(t)$
>
> 在期望次数为 $H(t)$ 的泊松过程（Poisson
> process）下，经历零次事件（即存活至时间 $t$，亦即 $S(t)$）的概率为：
>
> $$S(t) = {P}(\text{Count} = 0) = \frac{H(t)^0 e^{-H(t)}}{0!} = \exp(-H(t))$$
>
> 经历至少一次事件（失效概率 $F(t)$）的概率为：
>
> $$F(t) = 1 - \exp(-H(t))$$

> 你也可能会看到用 $\lambda(t)$ 和 $\Lambda(t)$
> 分别表示风险率和累积风险；本文统一使用 $h(t)$ 和 $H(t)$。

## 形式化建模：$X \to T^*$

> 在数学中，**形式化（formalize）**是指将某个想法转化为由显式公理和逻辑演绎规则支配的**无歧义符号系统**。

核心问题在于利用协变量 $X$
来<span class="orange">**估计生命周期（潜在事件时间）$T^*$ 的分布**</span>。

$$X \longmapsto \hat{\mathcal{P}}_{T^* \mid X}$$

这一表达式概括了建模活动的思想；虽然它本身不具备可操作性，但能帮助你理解“建模”究竟意味着什么。

建模活动试图构建从<span class="orange">**协变量空间 $X$**</span>
到<span class="orange">**估计的条件概率测度族**
$\hat{\mathcal{P}}_{T^* \mid X}$</span> 的映射。

> 当概率测度的*结构（代数形式）*与*参数*都固定时，我们得到一个具体的概率测度实例。只要其中任一部分可变，我们就得到了一个概率测度
> **“族”（family）**。
>
> $$\mathcal{P} = \{P_\theta : \theta \in \Theta\}$$
>
> 逐步具体化的过程如下：
>
> - 实例（Instance）：当函数形式已确定，且所有参数 $\theta$
>   都固定为具体数值时，$P_{\theta_0}$ 就是一个具体的概率测度。
> - 参数族（Parametric family）：当函数形式固定，但参数 $\theta$ 允许在参数空间
>   $\Theta$ 中变化时，构成参数族。
> - 非参数族（Non-parametric
>   family）：当连函数形式本身都在一个广泛的函数类中变化时，便构成了非参数族。

通过这一映射，我们可以在给定观测特征 $X$ 时获得概率测度 $P_{T^* \mid X}$，并利用
$P_{T^* \mid X}$ 读取各个候选 $T^*$
的概率（例如某人的生命周期为 1、2、5、10 等各有多大可能）。

### 方法全景

在实践中，建模工作就是对理论概率测度 $\mathcal{P}_{T^* \mid X}$
的特定<span class="orange">**表示形式**</span>进行公式化与估计。

> 参见[关于 ${P}(T^* \mid X)$ 的函数分类体系](#关于-pt-mid-x-的函数分类体系)

选择不同的表示形式，衍生出了不同的学术流派与建模方法。

**$\hat{S}(t \mid x)$，条件互补累积分布函数（生存函数）**

$$x \longmapsto \hat{S}(t \mid x) = \hat{P}(T^* > t \mid x)$$

> [加速失效时间模型（AFT）](#加速失效时间模型accelerated-failure-time-aft)、Bennett 比例优势模型（Proportional
> Odds model）、Logistic-hazard 模型、随机生存森林（Random Survival Forests,
> RSF）

**$\hat{F}(t \mid x)$，条件累积分布函数（失效函数）**

$$x \longmapsto \hat{F}(t \mid x) = \hat{P}(T^* \le t \mid x)$$

> Fine-Gray 子分布模型（竞争风险）、[DeepHit](https://github.com/chl8856/DeepHit)、神经多任务逻辑回归（[N-MTLR](https://arxiv.org/abs/1801.05512)）

**$\hat{h}(t \mid x)$，风险函数**

$$x \longmapsto \hat{h}(t \mid x) = \lim_{\Delta t \to 0} \frac{\hat{P}(t \le T^* < t + \Delta t \mid T^* \ge t, X = x)}{\Delta t}$$

> [Cox 比例风险模型](#cox-比例风险模型cox-proportional-hazard)、Aalen 加性模型（Aalen's
> Additive Model）、DeepSurv。

**其他值得关注的方法**

- 分位数函数 $x \longmapsto Q(\tau \mid x)$：删失分位数回归（Censored Quantile
  Regression，如 Portnoy、Peng-Huang 方法）。
- 潜在时间期望 $x \longmapsto {E}[\ln T^* \mid x]$：Buckley-James 最小二乘法。

### Cox 比例风险模型（Cox Proportional Hazard）

假设协变量 $X$ 以**乘性方式**平移基线风险：

> 协变量 $X$ 的存在会调整时刻 $t$ 的基线风险率 $h_0(t)$。

$$h(t \mid X) = h_0(t) \cdot \exp(\beta^\top X)$$

_系数 / 估计量（Estimand）：_ $\exp(\beta_k)$ 称为**风险比（Hazard Ratio,
HR）**。HR 为 $1.5$ 意味着 $X_k$
每增加一个单位，在任意时间点上的瞬时风险都会增加 50%。

**“未指定”（_"unspecified"_）的基线风险 $h_0(t)$ 是什么意思？**

“未指定”意味着你对基线风险如何随时间变化的概率分布**不做任何假设**。

**偏似然（Partial Likelihood）：无需指定 $h_0(t)$ 即可估计 $\beta$**

未知的基线风险 $h_0(t)$ 会阻碍你使用标准的最大似然估计（MLE）。David
Cox 通过构建**偏似然**解决了这一问题。简而言之，基线风险 $h_0(t)$
在计算中被消去了，因此你可以直接最大化该偏似然来估计 $\beta$，而无需考虑
$h_0(t)$。

**权衡（Trade-Offs）**

- **优势：** 避免了错误设定基线分布的风险。
- **局限：** 由于绕过了
  $h_0(t)$，<span class="orange">Cox 模型只能给出组间的**相对比较**</span>（例如，“疗法 B 相比疗法 A 降低了 40% 的风险”），而无法直接揭示个体的**生存历程**。

### 加速失效时间模型（Accelerated Failure Time, AFT）

假设协变量直接作用于潜在事件时间 $T^*$ 的**时间尺度**，而非作用于风险率：

> 协变量不再是在固定时间 $t$
> 上成倍放大风险，而是加快或减慢研究对象内部“事件时钟”的流逝速度。

$$\log T^* = \beta^\top X + \sigma \epsilon$$

其中 $\sigma > 0$ 为尺度参数，$\epsilon$
为服从特定概率分布（如标准正态分布、逻辑斯蒂分布或极值分布）的随机误差项。

对等式两边取指数，即可将 $T^*$ 表达为相对于基线潜在时间
$T_0^* = \exp(\sigma \epsilon)$ 的乘性形式：

$$T^* = \exp(\beta^\top X) \cdot T_0^*$$

**AFT 如何与生存函数 $\hat{S}(t \mid X)$ 相关联**

由于 $T^* = \exp(\beta^\top X) T_0^*$，具有协变量 $X$ 的个体存活超过时间
$t$，等价于基线个体存活超过经尺度缩放后的时间 $t \cdot \exp(-\beta^\top X)$：

$$S(t \mid X) = {P}(T^* > t \mid X) = S_0\big(t \cdot \exp(-\beta^\top X)\big)$$

**系数 / 估计量（Estimand）：时间比与加速因子**

- **时间比（Time Ratio，$\text{TR} = \exp(\beta_k)$）：** 衡量 $X_k$
  每增加一个单位时，预期生存持续时间的缩放倍数。
  - $\text{TR}$ 为
    $2.0$（$\beta_k > 0$）意味着暴露于该协变量会使预期生存时间**翻倍**（将生存曲线沿水平方向拉伸）。
- **加速因子（Acceleration Factor，$\text{AF} = \exp(-\beta_k)$）：**
  衡量个体沿着基线生存曲线 $S_0(\cdot)$ 推进的速度。
  - $\text{AF}$ 为
    $2.0$（$\beta_k < 0$）意味着该研究对象的事件时钟运行速度**加快一倍**，从而使预期生存时间**减半**。

**通过全似然进行参数估计**

与 Cox 比例风险模型不同，AFT 是一种**参数化**模型：为 $\epsilon$
选择一个分布，也就为 $T^*$（进而为 $S_0(t)$ 和
$f(t \mid X)$）指定了具体的参数族：

- **威布尔（Weibull）AFT：** $\epsilon$
  服从标准极值分布（这是唯一同时满足 AFT 与比例风险假设的分布族）。
- **对数正态（Log-Normal）AFT：** $\epsilon \sim \mathcal{N}(0, 1)$，因此 $T^*$
  服从对数正态分布。
- **对数逻辑斯蒂（Log-Logistic）AFT：** $\epsilon$
  服从标准逻辑斯蒂分布，允许风险率呈现先升后降的非单调（驼峰形）变化。

在明确指定密度函数 $f(t \mid X)$ 和生存函数 $S(t \mid X)$
后，即可通过最大化全似然函数直接估计参数 $(\beta, \sigma)$。

**权衡（Trade-Offs）**

- **局限：** 需要为 $\epsilon$
  指定一个参数误差分布；如果所选分布与真实的数据生成过程不符，参数估计以及对尾部的外推预测就可能产生偏差。
- **优势：** 直接对事件持续时间 $T^*$
  建模，无需额外的基线估计器即可直接生成<span class="orange">**完整的个体生存曲线**
  $\hat{S}(t \mid X)$ 以及事件发生时间预测</span>。
