+++
date = '2026-11-13T23:25:39+08:00'
draft = false
title = '最大似然估计'
description = '从观测数据出发逆向推理，寻找最有可能生成这组数据的参数。'
tags = ['数据分析']
translationKey = 'maximum-likelihood-estimation'
math = true
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

# 最大似然估计

**最大似然估计（Maximum Likelihood Estimation, MLE）**
是一种<span class="orange">**从观测数据出发逆向推理，寻找最有可能生成这组数据的参数**</span>的技术。

> _“我已经拿到了数据——什么样的系统参数设定能让这组特定数据的出现显得<span class="green">**最不令人意外**</span>？”_

**启发故事：神秘硬币**

想象一位朋友递给你一枚陌生的硬币，你怀疑这枚硬币可能动过手脚（质地不均，weighted）。

你抛了 10 次并记录下结果：**7 次正面**和 **3 次反面**。

你希望估计参数
$p$，即这枚硬币在任意一次投掷中正面朝上的真实概率。你测试了几个候选值：

- **候选值 A（$p = 0.1$）：**
  如果这枚硬币只有 10% 的概率正面朝上，那么 10 次中出现 7 次正面是非常罕见的。这种解释不太可能成立。
- **候选值 B（$p = 0.5$）：**
  如果硬币是均匀的，出现 7 次正面虽然有可能，但出现 5 次正面才更为典型。
- **候选值 C（$p = 0.7$）：**
  如果这枚硬币有 70% 的概率正面朝上，那么在 10 次投掷中得到 7 次正面就是最有可能发生的结果。

由于 $p = 0.7$ 赋予了你所观测到的现实情况最高的概率，因此 MLE 给出的估计值就是
**0.7**。

## 似然（Likelihood）

虽然人们在日常口语中经常将“概率”与“似然”这两个词互换使用，但统计学将它们视为方向相反的概念：

**概率（Probability）**
向前看：系统参数设定是固定的，推理未来可能产生什么样的数据。

> _“假设硬币是均匀的（$p = 0.5$），得到 7 次正面的概率是多少？”_

**似然（Likelihood）** 向后看：观测数据是固定的，反推系统的参数设定可能是什么。

> _“我已经得到了 7 次正面，真实参数是 $p = 0.5$ 与 $p = 0.7$
> 的似然度分别是多少？”_

### 唯有在比较中才有意义

> 注意措辞：“A 相对于 B 的似然度（Likelihood of A versus B）”

<span class="orange">**似然唯有在相互比较中才有意义**</span>。单个孤立的似然数值本身并没有内在的可解释性。

如果你抛一枚硬币 100 次并观测到 60 次正面，那么均匀硬币（$p = 0.5$）对应的似然值大约为：

$$0.0108$$

这个 $0.0108$ 究竟算“好”还是“坏”？

> 这与概率（probability）截然不同：概率严格界定在 $[0,1]$
> 区间内且具有明确的方向性，$0$ 代表不可能发生，$1$
> 代表必然发生，概率越高意味着在重复试验中越容易出现。

单看 $0.0108$ 本身，你无法做出判断。如果你把这枚硬币抛 1,000 次，_任何_ $p$
值设定下的似然都会骤降到类似 $0.000000000000000003$ 这样的极小数字。

只有当你同时评估另一个参数设定时，这个数字才获得意义：

- 设定 A（$p = 0.5$）得到的似然值为 $0.000000000000000003$
- 设定 B（$p = 0.6$）得到的似然值为 $0.000000000000000030$

现在你就获得了有价值的信息：设定 B 对观测数据的解释力比设定 A **高出 10 倍**。

### 盐水溶液类比

> [问题]
> 这种“似然唯有在比较中才有意义”的概念，感觉就像往两杯盐水里不断加水：持续加水会降低两份样本的测量浓度，但稀释并不会改变它们的相对高低——含盐量更多的那杯依然含盐更多。

**辨析与修正（Critic）**

你的盐水溶液类比很好地捕捉到了似然数值随规模缩放的直觉，不过在数学上还有一个关键的转折：随着你加入更多数据，两者之间的相对差距实际上会不断拉大。

> 如果继续沿用盐水溶液的比喻，加水仿佛施了魔法，让原本含盐更多的溶液变得含盐更浓，而含盐更少的溶液变得更淡——它们之间的相对差距被放大了。

**是什么决定了似然分数的量级？**

> 每条证据（观测样本）上的概率乘子

由于似然是通过**将各个独立事件的概率相乘**计算出来的，以下几个因素会拉低原始似然数值的量级：

> 似然本质上是“证据”的聚合，在数学上量化为概率的连乘。从纯算术角度看，你“混入”的证据越多，乘积得到的似然分数就越小。

- **样本量（Sample Size，$N$）：**
  每一个新增的观测样本都会引入一个新的小于 1 的乘子。随着 $N$
  的增长，连乘积会呈指数级向零收缩。

- **维度 / 特征数量（Dimensionality / Number of Features）：**
  评估每行包含 50 个属性的数据时，每条独立观测都会相乘 50 个概率项，这使得数值量级的下降速度远快于只分析单个特征的情况。

- **过程噪声 / 方差（Process Noise / Variance）：**
  如果结果高度可预测，概率就会高度集中在少数几个取值上（单个乘子较大）；如果系统具有高度随机性，概率就会稀薄地分散在众多可能性上，导致每次试验的乘子都很小。

**相对差距不断拉大**

> 马太效应（Matthew effect）：证据的效力产生“复利”

在物理世界的盐水溶液中，如果样本 A 含有 10 克盐，样本 B 含有 5 克盐，加入 10,000 升水会使两者的浓度都趋近于零，但它们的含盐量之比始终固定在
$2:1$。

然而在似然计算中，每一条新证据都会放大更优参数设定的相对优势：

**第 1 次试验：**

- 设定 A 的概率：$0.6$
- 设定 B 的概率：$0.5$
- 比值（$A / B$）：$1.2$（设定 A 优出 20%）

**第 10 次试验：**

- 设定 A 的似然：$0.6^{10} \approx 0.0060$
- 设定 B 的似然：$0.5^{10} \approx 0.00098$
- 比值（$A / B$）：$(1.2)^{10} \approx 6.19$（设定 A 优出 6 倍）

**第 100 次试验：**

- 设定 A 的似然：$\approx 6.5 \times 10^{-23}$
- 设定 B 的似然：$\approx 7.9 \times 10^{-31}$
- 比值（$A / B$）：$(1.2)^{100} \approx 82,817,974$

尽管两者的原始似然分数都在向零俯冲，但更优的解释却以指数级拉开差距。这正是拥有更多数据能让统计检验一锤定音的原因：即便单次试验中微小的优势，也会通过复利效应累积成巨大的似然比（likelihood
ratio）。

### 对数证据累积：$\ln(L)$

正如你所料，中等规模数据集的原始似然分数会迅速衰减至接近 0，从而导致计算机出现数值下溢（underflow，即被四舍五入为零）。

取自然对数（natural logarithm）可以将连乘转化为线性相加，使数值计算成为可能：

$$L = \prod_{i}{p_i}$$

两边取对数：

$$\ln(L) = \ln(\prod_{i}{p_i}) = \sum_{i}{\ln{p_i}}$$

现在，你不再需要比较 $L_A = 10^{-23}$ 与 $L_B = 10^{-31}$
这样极小的似然分数，而是直接比较<span class="orange">**“对数证据累积”（log
evidence accumulation）**</span>：$\ln(L_A) = -51.1$ 与 $\ln(L_B) = -69.3$。

除了让计算更简便之外，对数似然的差值还具有更直观的定量解释：

$$\ln(L_A) - \ln(L_B ) = \ln{\frac{L_A}{L_B}} = 18.2$$

这代表了两个<span class="orange">**累积对数证据 $\ln(L)$**</span>
之间的相对优势：在*对数单位尺度*上，数据对 $A$ 的支持度比 $B$ 高出 18.2 个单位。

> 对数尺度上的 18.2 意味着什么：
>
> $$e^{18.2} \approx 79,996,000$$
>
> 在原始概率尺度上，数据对模型 $A$ 的支持度大约是模型 $B$ 的 8,000 万倍。

> *“对数证据累积（log evidence
> accumulation）”*这一说法在概念上与信息论以及艾伦·图灵（Alan
> Turing）的表述高度一致：每一条独立观测都会向证据账本中记入固定数量的奈特（nats）或班（bans），直到某一种解释胜出。

## MLE 的求解流程

想象一个 $n$ 维空间，其中 $n$ 是我们在分布假设中可以调整的参数个数。

对于每一组可能的参数取值 $\theta$，我们都可以基于数据集 $\mathbf{x}$
计算出一个证据支持度——即似然分数 $L(\theta \mid \mathbf{x})$ 或对数证据
$\ln(L(\theta \mid \mathbf{x}))$。

我们的任务是找到那组特殊的参数值
$\hat{\theta}_{\text{MLE}}$，使其提供最大的证据支持度：

$$
\hat{\theta}_{\text{MLE}} = \arg \max L(\theta \mid \mathbf{x}) = \arg \max \ln(L(\theta \mid \mathbf{x}))
$$

在这座山峰的顶点处，斜率等于零，意味着向任何一个方向偏离都会降低观测数据出现的合理性。这个最高点就是你的最大似然估计量（Maximum
Likelihood Estimator）。

> 切记 $\hat{\theta}_{\text{MLE}}$ 依赖于具体的样本
> $\mathbf{x}$，这也是它头顶上带有“帽子（hat）”符号的原因。$\hat{\theta}_{\text{MLE}}$
> 并不是假设存在的真实参数 $\theta$，而是你利用样本 $\mathbf{x}$
> 对其做出的最佳推断。

### 第一步：构建似然函数

> 似然 = 联合概率密度函数（Joint PDF）

对于数据集 $\mathbf{x} = (x_1, x_2, \dots, x_n)$
和未知参数（或参数向量）$\theta$，似然函数的一般形式为：

$$L(\theta \mid \mathbf{x}) = f(\mathbf{x} \mid \theta)$$

- $f(\mathbf{x} \mid \theta)$ —— 在给定参数 $\theta$
  的分布假设下，由概率密度函数针对整个数据集 $\mathbf{x}$ 返回的概率值。

> 重要提示：$f(\mathbf{x} \mid \theta)$ 表示的是***整个数据集*出现的概率**。
>
> 其正式术语称为<span class="orange">**联合概率密度函数**（**Joint Probability
> Density Function**，简称 **Joint PDF** 或 **联合分布 Joint
> Distribution**）</span>。之所以称为“联合（Joint）”，是因为整个数据集是由一条条独立观测共同组成的联合现象。

> 注意符号上的区别：<span class="green">“$x$”代表单条观测</span>，而
> <span class="blue">“$\mathbf{x}$”代表观测样本的集合</span>。
>
> 切勿被表面形式*“似然 = PDF”*所迷惑。

**联合概率密度函数（Joint PDF）**

如何构建一个 $n$ 维的联合 PDF？这需要借助 **i.i.d. 假设**（Independent and
Identically Distributed，独立同分布假设）：

- **同分布（Identically Distributed）：** 每一个数据点 $x_i$
  都抽取自同一个潜在分布规律 $f(x_i \mid \theta)$。
- **独立（Independent）：** 任意一条观测的结果都不会影响其他观测。

在概率论中，**独立事件乘法法则（Multiplication Rule for Independent
Events）**指出，多个独立结果同时发生的联合概率等于各自概率的乘积：

$$P(A \cap B) = P(A) \times P(B)$$

将其推广到整个数据集的概率密度上，便得到：

$$f(\mathbf{x} \mid \theta) = f(x_1 \mid \theta) \times f(x_2 \mid \theta) \times \dots \times f(x_n \mid \theta) = \prod_{i=1}^{n} f(x_i \mid \theta)$$

### 第二步：对数似然形式 $\ell$

由于大量小数连乘在计算上极不稳定，似然函数几乎总是写成其等价的对数形式（$\ell$）：

$$\ell(\theta) = \ln L(\theta \mid \mathbf{x}) = \sum_{i=1}^{n} \ln f(x_i \mid \theta)$$

### 第三步：寻找最高点

根据数学公式能否直接在纸面上求得解析解，寻找峰值的过程通常通过**解析微积分（analytical
calculus）**或**数值优化（numerical optimization）**来完成。

#### 解析解（The Analytical Solution）

当似然方程形式简洁时，你可以运用基础微积分原理直接求解峰值。

**1. 计算斜率（得分函数，The Score Function）：** 对数似然 $\ell$ 关于参数
$\theta$ 求一阶导数。在统计学中，这个导数有一个正式名称：**得分函数（Score
Function）**，记作 $S(\theta)$：

$$S(\theta) = \frac{d}{d\theta} \ell(\theta)$$

如果 $\theta$ 包含多个参数（例如正态分布钟形曲线中的均值 $\mu$ 和方差
$\sigma^2$），得分函数则是一个由偏导数组成的向量，称为**梯度（gradient）**（$\nabla \ell(\theta)$），指向函数值上升最快的方向（direction
of steepest ascent）。

**2. 令斜率为 0 并求解：**

> 找出所有斜率为 0 的驻点位置。

$$S(\theta) = 0 \quad \text{或} \quad \nabla \ell(\theta) = \mathbf{0}$$

求解该方程可以通过代数变换将 $\theta$ 单独分离出来，从而得到
$\hat{\theta}_{\text{MLE}}$ 的显式公式。

**3. 验证其为极大值（曲率检验，The Curvature Test）：**
斜率为零既可能出现在山峰（极大值），也可能出现在山谷（极小值）或平台（鞍点，saddle
point）。为确认它确实是峰值，需要检验二阶导数：

$$\frac{d^2}{d\theta^2} \ell(\theta) < 0$$

负的二阶导数表明曲线向下凹（concave
downward，如同一个倒扣的碗），从而保证该点是一个局部极大值。

**具体示例：求解神秘硬币问题**

假设在 $n$ 次抛硬币中出现了 $k$ 次正面，正面朝上的未知概率为 $p$。

似然函数（联合 PDF）：

$$
L(p) = kp \cdot (n-k)(1-p)
$$

对数似然函数：

$$\ell(p) = k \ln(p) + (n - k) \ln(1 - p)$$

关于 $p$ 求导：

$$\frac{d}{dp} \ell(p) = \frac{k}{p} - \frac{n - k}{1 - p}$$

令导数等于零并求解：

$$\frac{k}{p} - \frac{n - k}{1 - p} = 0 \implies \frac{k}{p} = \frac{n - k}{1 - p}$$

化简过程：

$$
\begin{aligned}
k(1 - p) = p(n - k) \\[1em]
k - kp = np - kp \\[1em]
k = np \implies \hat{p}_{\text{MLE}} = \frac{k}{n}
\end{aligned}
$$

微积分推导印证了直觉常识：最有可能的参数值就是样本比例。对于 10 次投掷中出现 7 次正面的情况，$\hat{p} = \frac{7}{10} = 0.7$。

> 注意，在这个简单的例子中，你甚至不需要代入具体数据就能推导出通用的推断规则。

#### 数值解（The Numerical Solution）

在许多现实问题中，令导数为零会得到一个复杂的方程，无法通过解析手段将 $\theta$
单独解出。

在这些情况下，软件会使用迭代搜索算法来攀爬似然曲面：

**1. 梯度上升（Gradient Ascent）：** 从一个任意选定的初始猜测值 $\theta_0$
出发。

1. 计算该点处的斜率 / 梯度 $\nabla\ell(\theta)$。
2. 沿着正斜率方向向上迈出一步：

$$\theta_{\text{new}} = \theta_{\text{old}} + \alpha \cdot \nabla\ell(\theta)$$

> 这里的 $\nabla\ell(\theta)$
> 正是数据发挥作用的地方，参见[数据在何处发挥作用](#数据在何处发挥作用)。

其中 $\alpha$ 为学习率（learning rate）或步长（step
size）。不断重复上述步骤，直到斜率小到可以忽略不计（$S(\theta) \approx 0$）。

**2. 牛顿-拉夫逊法（Newton-Raphson Method）：**
同时利用斜率（一阶导数）和曲率（二阶导数）来估算距离山顶还有多远。它能够沿着曲面迈出更大、更精准的步伐直奔顶点，在光滑曲面上比梯度上升收敛得更快。

**3. 费雪得分法（Fisher Scoring）：**
牛顿-拉夫逊法在统计学中的一种专门变体，它用所有潜在样本下的期望曲率（expected
curvature）来替代当前观测样本的局部曲率。

#### 海森矩阵与 MLE 的确定性

> 记住，MLE 依然是一个基于样本生成的估计量，它本身存在“误差”——一部分源于系统固有的随机性，另一部分源于有限样本内部的波动与矛盾。

在更高维度下，所有二阶偏导数的集合构成了一个矩阵，称为**海森矩阵（Hessian
matrix, $H$）**。

海森矩阵衡量了似然地形在峰值周围弯曲的剧烈程度：

- **陡峭尖锐的山峰：** 如果曲线在 $\hat{\theta}_{\text{MLE}}$
  周围急剧下降，那么哪怕稍微偏离峰值一点点，模型对数据的解释力都会大幅恶化。这表明估计结果具有*高度确定性（high
  certainty）*，标准误（standard error）较低。

- **宽阔平缓的山顶：** 如果山顶宽广而平坦，说明许多不同的 $\theta$
  取值都能给出几乎相同的对数似然分数。这表明估计结果具有*高度不确定性（high
  uncertainty）*，通常是由数据噪声较大引起的。

## 数据在何处发挥作用

假设你手头有当前的参数猜测值 $\theta_0$ 以及数据集
$\mathbf{x} = (x_1, x_2, \dots, x_n)$。

数据在计算对数似然梯度 $\nabla \ell$ 时发挥核心作用。

> 似然分数是整个数据集上的联合概率密度：
>
> $$L(\theta \mid \mathbf{x}) = f(\mathbf{x} \mid \theta) $$
>
> 因此，它的导数就是联合 PDF 的导数：
>
> $$\nabla L(\theta | \mathbf{x}) = \nabla  f(\mathbf{x} \mid \theta)$$
>
> 写成对数形式即为：

$$\nabla \ell(\theta) = \nabla \ln f(\mathbf{x} \mid \theta) = \sum_{i=1}^{n} \nabla \ln f(x_i \mid \theta)$$

针对每一个新的候选参数 $\theta_i$，我们都会利用数据集计算出一个梯度
$\nabla \ell (\theta_i)$。

随后，我们利用这个梯度 $\nabla \ell (\theta_i)$ 并结合更新规则（updating
rule），推导出新的参数猜测值 $\theta_j$，形式如下：

$$\theta_{j} = \theta_{i} + \alpha \cdot \nabla\ell(\theta_i)$$

由此形成了一个<span class="orange">**链式反应**</span>：

1. 给出一个初始猜测：$\theta_i$
2. 利用数据计算梯度：$\nabla\ell(\theta_i) = \nabla \ln f(\mathbf{x} \mid \theta_i)$
3. 应用更新规则得到新的参数 $\theta_j$
4. 评估新位置处的梯度
   $\nabla\ell(\theta_j) = \nabla \ln f(\mathbf{x} \mid \theta_j)$：
   - 如果
     $\nabla\ell(\theta_j) \approx 0$，且能够验证该点为极大值，则获得最终估计
     $\hat{\theta}_\text{MLE} = \theta_j$
   - 否则，带着 $\theta_j$ 返回第 (1) 步重新运行上述流程

### 理想模型 vs. 工程实现

**理想状态：**

- 整个数据集 $\mathbf{x}$ 被视为一个单一整体，拥有联合概率密度函数
  $f(\mathbf{x} \mid \theta)$。
- 对数似然 $\ell(\theta) = \ln f(\mathbf{x} \mid \theta)$
  定义了一张静态的多维地形图。
- 优化的目标非常明确：计算统一的全局斜率
  $\nabla \ell(\theta)$，然后一路向上攀登直到斜率等于零。

**工程现实：**

- **解析解 / 闭式解（Analytic / Closed-Form）：**
  当联合 PDF 形式较为简单时，可以直接解析求解满足 $\nabla \ell(\theta) = 0$ 的
  $\theta$，完全跳过迭代优化过程。
- **全批量梯度上升（Full-Batch Gradient Ascent）：**
  对于不存在闭式解的模型，无法通过解析方法直接解出 $\nabla \ell(\theta) = 0$ 的
  $\theta$，只能迭代更新参数猜测值
  $\theta$。<span class="orange">**每一次参数更新都需要*一次性*遍历全部 $n$
  个数据点**</span>；当 $n$ 超过内存容量时，这种方法便不再可行。
- **随机近似（Stochastic Approximation，如 SGD / Mini-Batch）：**
  当全量数据遍历成为硬件瓶颈时，算法会牺牲精确的全局地形斜率，转而在每一步更新中仅使用数据的随机子集来估算上升方向。
