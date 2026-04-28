---
layout: post
title: "Compressed Sensing: Recovering Signals from Few Measurements"
description: "An introduction to compressed sensing: the theory of recovering sparse signals from far fewer measurements than classical sampling theory demands."
date: 2026-06-01
author: "Abd'gafar Tunde Tiamiyu"
tags: [Mathematics, Inverse Problems, Sparse Recovery]
math: true
---

Classical sampling theory says that to recover a signal of bandwidth $W$, you must sample at a rate of at least $2W$ samples per second (the Nyquist rate). For decades this was treated as a fundamental limit. Then, in a series of papers by Candès, Romberg, Tao, and Donoho published around 2004–2006, it became clear that the Nyquist rate is not a fundamental limit at all. It is only a limit for the wrong class of signals.

If a signal is *sparse*, meaning it has few nonzero components relative to its ambient dimension, then it can be recovered from a number of measurements that is proportional to its sparsity, not its bandwidth. The number of measurements required can be dramatically smaller than the Nyquist rate would suggest. This is the core claim of compressed sensing (also called compressive sensing or CS).

The theory is beautiful and the implications are significant. MRI scanning times can be reduced by acquiring fewer $k$-space measurements. Cameras can be designed that capture images at a fraction of the traditional pixel count. Seismic surveys can use sparser shot patterns without losing resolution. And the mathematical framework connects directly to the regularization theory I work with in inverse problems.


## The Setup

Suppose $f \in \mathbb{R}^n$ is a signal we wish to recover. We do not observe $f$ directly; instead, we collect $m$ linear measurements:

$$
y = \Phi f,
$$

where $\Phi \in \mathbb{R}^{m \times n}$ is the measurement matrix and $m \ll n$. The system is massively underdetermined: there are infinitely many vectors $f$ consistent with the measurements $y$.

The compressed sensing premise is that $f$ is **$s$-sparse**: at most $s$ of its $n$ entries are nonzero, with $s \ll n$. For example, a natural image is not sparse in the pixel domain, but it is sparse (or approximately sparse) in a wavelet basis. A signal sparse in the frequency domain has only a few active Fourier coefficients.

With sparsity, the recovery problem becomes:

$$
\min_{f \in \mathbb{R}^n} \lVert f \rVert_0 \quad \text{subject to} \quad \Phi f = y,
$$

where $\lVert f \rVert_0$ counts the nonzero entries. This is the combinatorial problem of finding the sparsest consistent signal. It is, in general, NP-hard.


## The $\ell^1$ Relaxation

The key insight of compressed sensing is that the intractable $\ell^0$ minimization can be replaced by the convex $\ell^1$ minimization:

$$
\min_{f \in \mathbb{R}^n} \lVert f \rVert_1 \quad \text{subject to} \quad \Phi f = y.
$$

This is called **basis pursuit**. It is a linear program, solvable in polynomial time.

The remarkable fact is that under appropriate conditions on $\Phi$, basis pursuit recovers the same sparse solution as the intractable $\ell^0$ problem. Exactly. Not approximately, but exactly. The $\ell^1$ norm acts as a convex proxy for sparsity, and when the measurement matrix is well-behaved, the proxy is exact.

In the noisy case $y = \Phi f + \eta$, the problem is relaxed to:

$$
\min_{f \in \mathbb{R}^n} \lVert f \rVert_1 \quad \text{subject to} \quad \lVert \Phi f - y \rVert_2 \leq \delta,
$$

or equivalently (via Lagrangian duality) to the LASSO:

$$
\min_{f \in \mathbb{R}^n} \frac{1}{2}\lVert \Phi f - y \rVert_2^2 + \alpha \lVert f \rVert_1.
$$

This is precisely $\ell^1$ regularization — the same total variation prior that appears in imaging, the same Laplace prior that appears in Bayesian inverse problems. Compressed sensing is not a separate theory; it is one instance of the broader $\ell^1$ regularization framework, studied in a setting where the sparsity of the signal and the structure of the measurement operator can be made precise.


## The Restricted Isometry Property

The conditions under which basis pursuit exactly recovers sparse signals are codified in the **restricted isometry property** (RIP), introduced by Candès and Tao.

A matrix $\Phi \in \mathbb{R}^{m \times n}$ satisfies the RIP of order $s$ with constant $\delta_s \in [0, 1)$ if, for every $s$-sparse vector $f$,

$$
(1 - \delta_s) \lVert f \rVert_2^2 \leq \lVert \Phi f \rVert_2^2 \leq (1 + \delta_s) \lVert f \rVert_2^2.
$$

Intuitively, $\Phi$ acts as a near-isometry on every $s$-dimensional subspace. It does not collapse sparse vectors: distinct sparse vectors produce distinguishable measurements.

The main recovery guarantee states: if $\Phi$ satisfies the RIP of order $2s$ with $\delta_{2s} < \sqrt{2} - 1 \approx 0.41$, then every $s$-sparse signal is the unique solution of basis pursuit.

For noisy measurements with noise level $\delta$, the recovery error satisfies

$$
\lVert \hat{f} - f \rVert_2 \lesssim \delta,
$$

meaning the recovery error is proportional to the noise level. This is the best one can hope for.


## When Does $\Phi$ Satisfy the RIP?

The RIP is a condition on the measurement matrix, not on the signal. The question is: which measurement matrices satisfy it, and with how many rows?

The key result is that **random matrices** satisfy the RIP with high probability when $m \gtrsim s \log(n/s)$. Specifically:

- Gaussian matrices with i.i.d. $\mathcal{N}(0, 1/m)$ entries.
- Bernoulli matrices with i.i.d. $\pm 1/\sqrt{m}$ entries.
- Subsampled random orthogonal matrices (e.g., random rows of a Fourier matrix, suitably normalized).

The last class is particularly important for applications, because the DFT can be applied in $O(n \log n)$ time. For MRI, the measurement matrix is precisely a subsampled Fourier matrix, and the patient's anatomy is approximately sparse in wavelet space. Compressed sensing provides a theoretical justification for acquiring fewer Fourier measurements than the Nyquist rate would require.

The $m \gtrsim s \log(n/s)$ bound is nearly optimal. One can show that any method, regardless of its computational cost, requires at least $\Omega(s \log(n/s))$ measurements to recover all $s$-sparse signals. The gap between the random matrix result and the information-theoretic lower bound is at most a constant factor.


## Connections to Regularization Theory

The connection between compressed sensing and classical regularization theory is closer than it might appear.

Both frameworks address the same problem: recovering an unknown from underdetermined measurements. Both use the $\ell^1$ norm (or total variation) as a regularizer to promote sparse or piecewise-constant structure. And both provide stability estimates showing that the reconstruction error is controlled by the noise level.

The main conceptual distinction is in how the measurement operator is modelled. In classical regularization, the forward operator $\mathcal{A}$ is given (it encodes the physics of the measurement process), and the regularizer is chosen to encode prior knowledge. In compressed sensing, the signal structure (sparsity) is the starting point, and the theory identifies which measurement operators are compatible with recovery.

From the regularization perspective, the LASSO penalty $\alpha \lVert f \rVert_1$ is a special case of $\ell^1$ Tikhonov regularization. The compressed sensing theory gives conditions under which this regularizer is strong enough to recover the true signal exactly in the noiseless case, which is a stronger result than classical regularization theory typically provides.

From the compressed sensing perspective, many classical inverse problems involve operators that are not random, and the RIP may not hold. In EIT, for instance, the measurement operator is determined by the physics and cannot be randomized. Whether $\ell^1$ regularization recovers sparse conductivity distributions in EIT is a question about the specific structure of the EIT forward operator, not a consequence of the standard CS theory.


## Algorithms

Several families of algorithms are used to solve the LASSO and basis pursuit problems.

**Iterative thresholding.** The simplest family iterates between a gradient step in the data fidelity term and a proximal (soft-thresholding) step in the $\ell^1$ term:

$$
f^{k+1} = \mathcal{S}_{\alpha/L}\!\left(f^k - \frac{1}{L}\Phi^\top(\Phi f^k - y)\right),
$$

where $\mathcal{S}_\tau(x)_i = \text{sign}(x_i)\max(|x_i| - \tau, 0)$ is the soft-threshold operator and $L$ is the Lipschitz constant of the gradient. This is ISTA (iterative shrinkage-thresholding algorithm). Its accelerated variant, FISTA, converges as $O(1/k^2)$.

**Alternating Direction Method of Multipliers (ADMM).** ADMM splits the problem into a sequence of subproblems that are individually easy to solve. It is widely used for structured convex programs and handles the constraint form of basis pursuit naturally.

**Greedy methods.** Matching pursuit and its variants (OMP, CoSaMP) iteratively identify the support of the sparse signal without explicitly solving a convex program. They are computationally cheaper but come with weaker theoretical guarantees.


## What I Take from It

Compressed sensing taught me to take sparsity seriously as a modelling assumption, not just as a convenient regularizer. The theory provides conditions under which sparsity is not merely useful (it helps, but we are not sure how much) but *sufficient* (exact recovery is guaranteed). That precision is rare in inverse problems.

The theory also clarified for me why $\ell^1$ regularization works better than $\ell^2$ regularization for recovering sharp features. The geometric reason is simple: the $\ell^1$ ball has corners that align with the coordinate axes, and minimizing over the $\ell^1$ ball naturally pushes solutions toward sparse vectors. The $\ell^2$ ball is smooth and rotationally symmetric, with no preference for sparse solutions. This geometric intuition explains empirical experience before the formal theory was in place.

In my EIT work, the conductivities I want to recover are often nearly piecewise constant: a background with a few inclusions. This is approximately sparse in a total variation sense. $\ell^1$-type regularization consistently outperforms $\ell^2$ in this setting. The compressed sensing literature provides a partial explanation for why, even if the RIP conditions are not directly applicable.
