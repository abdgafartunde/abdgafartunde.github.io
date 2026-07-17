---
layout: post
title: "Compressed Sensing: Recovering Signals from Few Measurements"
description: "An introduction to compressed sensing: the theory of recovering sparse signals from far fewer measurements than classical sampling theory demands."
date: 2026-06-01
author: "Abd'gafar Tunde Tiamiyu"
tags: [Mathematics, Inverse Problems, Sparse Recovery]
math: true
---

The Shannon-Nyquist theorem concerns uniform time samples of a bandlimited signal and requires a sampling frequency above twice the highest frequency under its standard assumptions. Compressed sensing addresses a different measurement model: recovery of a sparse or compressible finite-dimensional representation from designed linear measurements. It does not invalidate the sampling theorem.

If a signal is $s$-sparse in a known representation and the measurement operator is sufficiently incoherent or satisfies a suitable recovery condition, then roughly $s$ times a logarithmic factor in the ambient dimension can suffice. The guarantee concerns that sparse model and measurement ensemble, not every signal with few apparent features.

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

An alternative penalized formulation is the LASSO:

$$
\min_{f \in \mathbb{R}^n} \frac{1}{2}\lVert \Phi f - y \rVert_2^2 + \alpha \lVert f \rVert_1.
$$

This is $\ell^1$ regularization. Total variation instead applies an $\ell^1$ penalty to a discrete gradient, and a finite-dimensional Laplace prior can produce an $\ell^1$ MAP penalty. Constrained and penalized formulations are related, but a particular $\delta$ does not determine the same solution as an arbitrary $\alpha$; the parameter correspondence depends on the solution and constraint activity.


## The Restricted Isometry Property

The conditions under which basis pursuit exactly recovers sparse signals are codified in the **restricted isometry property** (RIP), introduced by Candès and Tao.

A matrix $\Phi \in \mathbb{R}^{m \times n}$ satisfies the RIP of order $s$ with constant $\delta_s \in [0, 1)$ if, for every $s$-sparse vector $f$,

$$
(1 - \delta_s) \lVert f \rVert_2^2 \leq \lVert \Phi f \rVert_2^2 \leq (1 + \delta_s) \lVert f \rVert_2^2.
$$

Intuitively, $\Phi$ acts as a near-isometry on every $s$-dimensional subspace. It does not collapse sparse vectors: distinct sparse vectors produce distinguishable measurements.

The main recovery guarantee states: if $\Phi$ satisfies the RIP of order $2s$ with $\delta_{2s} < \sqrt{2} - 1 \approx 0.41$, then every $s$-sparse signal is the unique solution of basis pursuit.

Under an appropriate RIP or related recovery condition, basis-pursuit denoising satisfies a bound of the form

$$
\lVert \hat{f}-f\rVert_2
\leq C_0\frac{\sigma_s(f)_1}{\sqrt{s}}+C_1\delta,
$$

where $\sigma_s(f)_1$ is the best $s$-term approximation error in $\ell^1$. For exactly $s$-sparse signals, the first term vanishes. The constants depend on the recovery condition.


## When Does $\Phi$ Satisfy the RIP?

The RIP is a condition on the measurement matrix, not on the signal. The question is: which measurement matrices satisfy it, and with how many rows?

The key result is that **random matrices** satisfy the RIP with high probability when $m \gtrsim s \log(n/s)$. Specifically:

- Gaussian matrices with i.i.d. $\mathcal{N}(0, 1/m)$ entries.
- Bernoulli matrices with i.i.d. $\pm 1/\sqrt{m}$ entries.
- Subsampled random orthogonal matrices (e.g., random rows of a Fourier matrix, suitably normalized).

Subsampled Fourier operators are important in MRI, where measurements are acquired in $k$-space and images can be compressible in wavelet or learned representations. Practical guarantees depend on variable-density sampling, the sparsifying transform, coil sensitivities, noise, and the measurement model.

For uniform stable recovery of all $s$-sparse vectors with common random ensembles, $m$ of order $s\log(n/s)$ is near the relevant lower bounds. Different guarantees, such as recovery of one fixed signal or structured sparsity models, can have different sample complexity.


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

where $$\mathcal{S}_\tau(x)_i=\operatorname{sign}(x_i)\max(\lvert x_i\rvert-\tau,0)$$ and $L\geq\lVert\Phi\rVert_2^2$ is a valid Lipschitz bound. ISTA has an $O(1/k)$ objective-gap rate for this convex problem. FISTA improves the objective-gap rate to $O(1/k^2)$ under the standard fixed-step assumptions.

**Alternating Direction Method of Multipliers (ADMM).** ADMM splits the problem into a sequence of subproblems that are individually easy to solve. It is widely used for structured convex programs and handles the constraint form of basis pursuit naturally.

**Greedy methods.** Matching pursuit and its variants, including OMP and CoSaMP, identify a support iteratively. Their cost and guarantees differ from basis pursuit rather than being uniformly weaker; RIP or coherence conditions also provide exact and stable recovery results for several greedy methods.


## What I Take from It

Compressed sensing taught me to take sparsity seriously as a modelling assumption, not just as a convenient regularizer. The theory provides conditions under which sparsity is not merely useful (it helps, but we are not sure how much) but *sufficient* (exact recovery is guaranteed). That precision is rare in inverse problems.

The theory also clarified for me why $\ell^1$ regularization works better than $\ell^2$ regularization for recovering sharp features. The geometric reason is simple: the $\ell^1$ ball has corners that align with the coordinate axes, and minimizing over the $\ell^1$ ball naturally pushes solutions toward sparse vectors. The $\ell^2$ ball is smooth and rotationally symmetric, with no preference for sparse solutions. This geometric intuition explains empirical experience before the formal theory was in place.

In my EIT work, the conductivities I want to recover are often nearly piecewise constant: a background with a few inclusions. This is approximately sparse in a total variation sense. $\ell^1$-type regularization consistently outperforms $\ell^2$ in this setting. The compressed sensing literature provides a partial explanation for why, even if the RIP conditions are not directly applicable.

---

## Compressed Sensing in Practice

The theory was worked out in lecture halls and journals, but compressed sensing is now embedded in systems used by millions of people every day.

**MRI acceleration across European healthcare.** Magnetic resonance imaging is inherently slow: each measurement samples one line of Fourier space, and filling k-space fully takes time, time during which the patient must remain still, time that limits throughput in busy radiology departments. Compressed sensing MRI acquires only a random subset of k-space measurements and recovers the full image by exploiting sparsity in a wavelet basis. The technique was approved for clinical use and has been deployed in scanner software by Siemens Healthineers (Germany) and Philips Healthcare (Netherlands), among others. The National Health Service in the UK has used this to reduce scan times and improve patient experience in high-demand units. Compressed sensing cardiac MRI (where motion makes conventional acquisition impractical) is now routine in specialist centres across Germany, France, and the Netherlands.

**Radio astronomy.** The Event Horizon Telescope (EHT), which produced the first image of a black hole in 2019, combines observations from telescopes on multiple continents into a sparse measurement of the Fourier domain of the sky. The reconstruction problem (recovering an image from very few, irregularly sampled Fourier measurements) is exactly the compressed sensing problem. The CLEAN algorithm used in radio astronomy since the 1970s is an early instance of sparse recovery. Modern variants explicitly solve the $\ell^1$-regularized problem. LOFAR (Low-Frequency Array), located primarily in the Netherlands and connecting stations across Europe, faces the same mathematical challenge at a different frequency and scale.

**Industrial inspection and non-destructive testing.** Ultrasonic inspection of welds, castings, and composite structures (widely used in European aerospace and automotive manufacturing) generates tomographic data that is sparse in appropriate bases. Compressed sensing approaches reduce the number of transducers required and the time needed for a full inspection sweep. This has practical consequences for production-line testing, where scan time directly affects throughput.

**Seismic acquisition.** Randomized or jittered source and receiver sampling can reduce acquisition density when seismic data are compressible in a suitable transform domain. Reconstruction quality depends on wavefield complexity, sampling geometry, coherent noise, and model mismatch. Standard compressed-sensing guarantees do not automatically provide exact recovery for a field survey.

The pattern is consistent. Any domain where measurements are expensive, slow, invasive, or constrained by physical geometry, and where the signal to be reconstructed is sparse in some transform domain, is a candidate for compressed sensing. The theory provides the rigorous foundation; the practice shows up in hospitals, telescopes, and production lines.

*For code and implementations related to sparse reconstruction methods, see the [medical-imaging GitHub repository](https://github.com/abdgafartunde/medical-imaging) (to be updated).*
