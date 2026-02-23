---
layout: post
title: "Physics-Informed Neural Networks: What Works, What Doesn't, and What Nobody Tells You"
description: "A practitioner's honest account of physics-informed neural networks: where they shine, where they fail, and practical lessons from actually training them."
date: 2026-02-23
author: "Abd'gafar Tunde Tiamiyu"
tags: [Scientific Machine Learning, PINNs, Numerical Methods]
math: true
---

Physics-informed neural networks have become one of the most discussed ideas in scientific computing. The concept is elegant: train a neural network to approximate the solution of a partial differential equation by encoding the PDE directly into the loss function. No mesh, no finite element assembly, no basis functions. Just a network, automatic differentiation, and gradient descent.

Since Raissi, Perdikaris, and Karpathy's influential 2019 paper, the literature has exploded. Thousands of papers have applied PINNs to fluid dynamics, heat transfer, solid mechanics, electromagnetics, inverse problems, and a growing list of other domains. The pitch is appealing: mesh-free solvers that handle complex geometries naturally, integrate observational data with physical laws seamlessly, and scale to high-dimensional problems where classical methods choke on the curse of dimensionality.

I have spent considerable time working with PINNs, particularly for inverse problems and parameter identification. What follows is an honest account of what I have found, not the version you would write for a grant application, but the version you would share with a colleague over coffee.


## The Setup

The idea is simple enough. You want to solve a PDE,

$$
\mathcal{N}[u](x) = 0, \quad x \in \Omega,
$$

subject to boundary conditions $\mathcal{B}[u](x) = 0$ on $\partial\Omega$.

You parameterise the unknown $u$ with a neural network $u_\theta(x)$. Concretely, $u_\theta : \mathbb{R}^d \to \mathbb{R}$ is a fully connected network of the form

$$
u_\theta(x) = W_L \circ \phi \circ W_{L-1} \circ \cdots \circ \phi \circ W_1(x),
$$

where each $W_\ell(z) = A_\ell z + b_\ell$ is an affine map with weight matrix $A_\ell$ and bias $b_\ell$, and $\phi$ is a nonlinear activation applied element-wise. The parameter vector $\theta$ collects all the weights and biases. Using automatic differentiation, you compute whatever partial derivatives $\mathcal{N}$ requires, directly through the computational graph of the network. No discretization of the differential operator, no stiffness matrices, no mesh.

The training loss is typically a weighted sum:

$$
\mathcal{L}(\theta) = \lambda_r \mathcal{L}_r(\theta) + \lambda_b \mathcal{L}_b(\theta) + \lambda_d \mathcal{L}_d(\theta),
$$

where each term has the form

$$
\begin{aligned}
\mathcal{L}_r &= \frac{1}{N_r} \sum_{i=1}^{N_r} \lvert \mathcal{N}[u_\theta](x_i^r) \rvert^2, \\[6pt]
\mathcal{L}_b &= \frac{1}{N_b} \sum_{j=1}^{N_b} \lvert \mathcal{B}[u_\theta](x_j^b) \rvert^2, \\[6pt]
\mathcal{L}_d &= \frac{1}{N_d} \sum_{k=1}^{N_d} \lvert u_\theta(x_k^d) - u_k^{\text{obs}} \rvert^2.
\end{aligned}
$$

The first term $\mathcal{L}_r$ measures how well the PDE is satisfied at collocation points scattered through the domain. The second $\mathcal{L}_b$ enforces boundary conditions. The third $\mathcal{L}_d$, present only when you have observational data, fits the network to measurements.

You minimise this compound loss with some gradient-based optimiser and hope the result approximates the true solution to acceptable accuracy.

Simple in principle. The trouble is in the long list of things that can go wrong.


## Where PINNs Genuinely Help

Let me start with where I have found them most useful, because the method does have a legitimate place.

**Inverse problems with sparse data.** This is the setting where PINNs have impressed me most. Suppose you have a PDE governing some physical process and you have scattered, noisy observations of the solution. You want to identify unknown parameters: a spatially varying coefficient, a source term, a boundary condition. PINNs give you a natural framework for fusing the physics with data. The PDE residual acts as a regulariser, constraining the solution to be physically plausible, while the observations pin down the specific case. I have obtained genuinely good results in parameter identification problems using this approach, results that would have required significantly more effort with classical methods.

**Problems where meshing is prohibitive.** If your domain is geometrically complex, moving, or defined implicitly, mesh generation can dominate the entire workflow. I once spent longer generating and debugging a mesh for a 3D domain with internal inclusions than I spent on the actual solve. PINNs sidestep this entirely. You scatter collocation points and move on. For domains that change shape during the computation (free boundary problems, shape optimisation) this is a meaningful practical advantage.

**High-dimensional problems.** The curse of dimensionality is real and it is vicious. Finite element methods in six or ten spatial dimensions are simply not feasible. Neural networks, at least empirically, can represent high-dimensional functions without the exponential cost blowup. For certain classes of PDEs in high dimensions (Hamilton-Jacobi-Bellman equations in optimal control, Fokker-Planck equations in many-particle systems) PINNs and related methods have produced results that no mesh-based approach could match.

**Exploratory work.** When I am trying to understand a new problem, test a hypothesis about the solution structure, or quickly explore a parameter space, the low setup cost of a PINN is valuable. Thirty lines of PyTorch and you have a working solver. The feedback loop is fast. The results are approximate, but for building intuition and deciding where to invest serious computational effort, that is fine.


## Where PINNs Struggle, And What Papers Do Not Emphasise

**Spectral bias is a persistent headache.** Standard neural networks learn low-frequency components of the target function much more readily than high-frequency ones. This is not a minor nuance; it is a fundamental limitation that affects nearly every PDE with sharp gradients, boundary layers, or oscillatory solutions.

Mathematically, if we decompose the target function in the Fourier basis, $u(x) = \sum_k \hat{u}_k e^{i k \cdot x}$, gradient descent on a standard MLP will reduce the error in the low-$\lvert k \rvert$ modes long before it begins to fit the high-frequency content. This is related to the eigenvalue spectrum of the neural tangent kernel (NTK): for smooth activations like $\tanh$, the NTK eigenvalues decay rapidly for high-frequency eigenfunctions, meaning those components converge at much slower rates during training.

Here is what it looks like in practice. You train a PINN on a singularly perturbed convection-diffusion problem. The loss decreases nicely. The solution looks smooth and plausible. You compare against a reference computed with a fine-grid classical method, and the boundary layer is either absent or smeared beyond recognition. The network has learned the smooth large-scale behaviour and quietly ignored the thin region where the solution changes rapidly.

Remedies exist: Fourier feature embeddings, which map the input through sinusoidal functions before feeding it to the network,

$$
\gamma(x) = \bigl[\cos(2\pi B x), \, \sin(2\pi B x)\bigr]^T,
$$

where $B$ is a matrix of learnable or random frequencies, effectively lifting the input into a space where the NTK has a more uniform spectrum; multi-scale architectures; adaptive activation functions. These can help considerably. But each one introduces new hyperparameters and design choices, and none of them fully resolve the issue. My experience is that spectral bias can be managed for specific problems, but you never truly eliminate it. You learn to watch for it and compensate.

**The loss function is adversarial.** This is the single issue I would most like prospective PINN users to understand. The compound loss (PDE residual plus boundary plus data) is not a friendly optimisation landscape. The three terms routinely have different magnitudes, different gradient scales, and competing optima.

Here is a common failure mode. You set up the loss, start training, and the PDE residual term decreases beautifully. You feel encouraged. Then you check the boundary condition term and find it has barely moved, or even increased. The optimiser is satisfying the PDE in the interior by adopting a solution that violates the boundary conditions. Or vice versa: boundary conditions are perfectly met, but the PDE residual stalls because the network is locked into a shape that cannot simultaneously satisfy both.

Tuning the weights $\lambda_r$, $\lambda_b$, $\lambda_d$ is the standard response, but it amounts to introducing three hyperparameters that interact in non-obvious ways and whose optimal values shift during training. Adaptive weighting schemes (gradient-normalisation, neural tangent kernel-inspired methods) help in some cases. In others, they introduce their own instabilities. I have spent entire weeks on a single problem doing nothing but adjusting these weights and watching the training dynamics, trying to find a configuration where all the terms decrease together.

And then there is the optimiser. Adam alone rarely delivers high accuracy. The usual recipe is Adam for the first phase (get roughly into the right region of parameter space) followed by L-BFGS for the fine convergence. L-BFGS is more powerful but also more fragile: it is sensitive to noise in the gradients, it requires substantial memory for large networks, and the handoff from Adam to L-BFGS is one more decision point where things can go wrong. When the handoff works, the improvement in accuracy can be dramatic. When it does not, the L-BFGS phase diverges and you lose progress.

**You have no reliable error certificate.** This is what unsettles me most as someone trained in numerical analysis. When I solve a problem with finite elements, I have theory: convergence rates, a priori error estimates, a posteriori error indicators. I know, within quantifiable bounds, how good my solution is. I can refine the mesh and prove that the solution improves at a predictable rate.

PINNs provide nothing comparable. The loss value is a measure of residual at the collocation points, not a measure of solution quality. A loss of $10^{-6}$ does not mean the solution is accurate to six digits. The network can perfectly satisfy the PDE at every training point while being wildly wrong in between. I have seen cases (not pathological toy examples, but real problems I was working on) where the loss was small, the training curves looked healthy, and the solution had qualitatively wrong features that only became apparent when I compared against a reference.

If you do not have a reference solution, you are flying blind. This is the hardest limitation to work around.

**Stiff and multi-scale problems are painful.** PDEs with several active length or time scales push PINNs to their limit. The network must simultaneously resolve features at very different scales; neural network architectures have finite resolution budgets, and training dynamics do not distribute that budget evenly across scales. Convection-dominated flows, reaction-diffusion systems with sharp fronts, and problems with thin boundary layers are all difficult. Classical methods also struggle with these problems, but they have decades of well-tested adaptive strategies: mesh refinement, stabilisation, specially designed elements. For PINNs, the adaptive toolkit is much less mature.

**For standard forward problems, PINNs are usually the wrong tool.** I say this despite working extensively with the method. For a well-posed forward PDE in two or three spatial dimensions on a domain where meshing is feasible, a standard finite element or finite difference solver will be faster, more accurate, and more reliable. Often by orders of magnitude. The training time required for a PINN to achieve the accuracy that a classical solver delivers routinely is enormous by comparison.

This does not make PINNs useless. It means their value lies elsewhere, in the specific settings I described above. But I have seen too many papers apply PINNs to problems that are trivially solvable by classical methods, reporting PINN results that are orders of magnitude less accurate, and framing this as a contribution. It does the field no favours.


## Practical Lessons From the Trenches

Concrete things I have learned, mostly the hard way.

**Start with a problem where you know the answer.** Before applying a PINN to the problem you actually care about, test your entire setup (architecture, loss weights, training schedule, collocation strategy) on a problem with a known analytical or well-computed numerical solution. Validate that you can reproduce the known answer. Only then move to the real problem. This step catches an enormous number of bugs and configuration errors.

**Collocation point placement deserves serious thought.** Uniform random sampling is a reasonable default but rarely optimal. If the solution has boundary layers, concentrate points there. If there are internal interfaces or singularities, refine around them. Residual-based adaptive sampling (periodically evaluating the residual on a fine grid and adding collocation points where it is large) is effective but adds complexity to the training loop. Latin hypercube sampling is a simple improvement over pure random sampling that provides better space-filling coverage.

**Hard-enforce what you can.** The boundary condition loss term is often the weakest link. If you can enforce boundary conditions analytically, do it. For Dirichlet conditions $u = 0$ on $\partial\Omega$, write $u_\theta(x) = d(x) \cdot v_\theta(x)$, where $d(x)$ is a distance function vanishing on the boundary and $v_\theta$ is a free network. The boundary condition is then satisfied by construction, regardless of the parameters. One fewer term in the loss means one fewer knob to tune and one fewer potential source of conflict during training.

The same idea extends to initial conditions in time-dependent problems. If $u(x,0) = g(x)$, write $u_\theta(x,t) = g(x) + t \cdot v_\theta(x,t)$. At $t=0$, the initial condition is exactly satisfied. More generally, for Robin boundary conditions $\partial_n u + \beta u = h$ on $\partial\Omega$, one can construct trial functions that satisfy these conditions by design, though the construction becomes problem-specific.

The mathematical benefit is concrete. With $L$ terms in the loss, the gradient at each step is a linear combination of $L$ competing directions. Removing one term from the loss reduces the dimension of the optimisation conflict. In practice, hard-enforced PINNs often converge in a fraction of the iterations.

**Keep the network modest.** Bigger is not always better. I have found that networks with 4 to 6 hidden layers and 40 to 60 neurons per layer work well for a wide range of problems. Going deeper can make training harder without improving accuracy. $\tanh$ is a reliable activation function for PDE problems because it is smooth and its derivatives are well-behaved; you are, after all, differentiating through this network multiple times. ReLU and its variants introduce issues at the points where derivatives are discontinuous. This matters less in classification but matters a lot when your loss function involves second-order derivatives.

**Monitor everything, not just the loss.** Track the PDE residual, the boundary residual, and the data fit separately. Compute the solution at validation points *not* used in training and watch whether the error there tracks the training loss. If the training loss decreases but the validation error does not, you are overfitting to your collocation points. Check conservation laws, symmetries, or other known properties of the exact solution. These sanity checks have saved me from accepting wrong solutions more times than I would like to admit.

**Be judicious about when to use PINNs at all.** This is perhaps the most important lesson. For every problem where I have used PINNs productively, there are several where I tried them, struggled, and ultimately obtained better results faster with a classical method. The novelty of the approach is not a mathematical argument for its suitability. Ask yourself: does this problem involve data integration, complex or changing geometry, high dimensions, or an inverse component? If yes, PINNs may offer a genuine advantage. If no, start with classical methods and reach for PINNs only if you have a specific reason to believe they will help.


## Looking Ahead

PINNs are roughly seven years old as a widely known method, which is very young by the standards of numerical analysis. The field is going through the predictable arc: initial excitement, proliferation of applications, accumulation of difficult cases, and a gradual settling toward a more clear-eyed understanding of where the method belongs.

My sense is that the lasting contributions will be in inverse problems, data assimilation, and high-dimensional problems, settings where the unique features of PINNs solve real bottlenecks rather than reinventing existing capabilities. The operational framework (encoding physics into a neural network's loss function) is a genuinely useful idea. The challenge is developing the theoretical understanding and practical methodology to make it reliable.

What the field needs most right now, in my view, is honest reporting. More papers that document failures and failure modes. More systematic comparisons with classical methods on shared benchmarks. More theoretical work connecting PINNs to the existing frameworks of approximation theory and regularisation. The foundations are being built, but there is a long way to go.

For anyone beginning to work with PINNs, my strongest recommendation is this: learn finite elements and classical regularisation theory first. Understand the PDEs you are solving at a mathematical level. Then use PINNs where they add value, with full awareness of their limitations. The researchers I have seen make the most effective use of these tools are invariably those who could also solve the problem without them. That foundation is not optional.

The tools are powerful. They are also young, imperfect, and poorly understood in important ways. Treating them honestly, as capable tools with real limitations, not as a revolution that renders classical methods obsolete, is the clearest path to using them well.
