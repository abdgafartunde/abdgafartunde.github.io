---
layout: page
title: "Research"
description: "Computational and Applied Mathematics"
seo_description: "Research by A.T. Tiamiyu on inverse problems, electrical impedance tomography, regularization theory, and scientific machine learning. Publications and presentations."
---

<section class="research-section">
<h2 class="section-heading"><i class="fas fa-microscope"></i> Overview</h2>

<div class="about-text">
<p>I work on inverse problems: mathematical problems where you observe indirect measurements and want to reconstruct the quantity that produced them. These problems arise naturally in medical imaging, non-destructive testing, and geophysics, and they are almost always ill-posed, meaning small measurement errors can cause large reconstruction errors if not handled carefully.</p>

<p>My approach combines variational methods and regularization theory with modern computational tools, including deep learning. During my PhD, I developed novel inversion frameworks for electrical impedance tomography with partial boundary data, integrating physics-based models with learned regularizers. My current postdoctoral work extends these ideas to broader classes of both linear and nonlinear inverse problems, spanning medical imaging modalities (CT, MRI, ultrasound, EIT) and geophysical modalities (full waveform inversion), and explores the theoretical foundations of scientific machine learning for inversion.</p>
</div>

<div class="research-areas">

<div class="research-card">
  <div class="research-icon"><i class="fas fa-search-plus"></i></div>
  <h3>Inverse Problems & Regularization</h3>
  <p>Developing variational inversion frameworks using adaptive primal-dual hybrid gradient methods to address ill-posedness and nonlinearity in parameter identification and image reconstruction.</p>
  <p class="pub-annotation"><strong>Applied to:</strong> Seismic exploration and full waveform inversion, anomaly detection in medical imaging, material characterisation in non-destructive testing, and parameter recovery in fluid and heat flow models.</p>
  <p class="pub-annotation"><strong>Industry connection:</strong> The same mathematical structure underlies velocity model building in oil &amp; gas, image reconstruction in medical devices, and model calibration in engineering simulation.</p></div>

<div class="research-card">
  <div class="research-icon"><i class="fas fa-x-ray"></i></div>
  <h3>Computational Imaging &amp; Tomography</h3>
  <p>Developing reconstruction algorithms for both linear and nonlinear imaging inverse problems. Linear modalities (CT, MRI, X-ray tomography) admit efficient Fourier and filtered-backprojection methods but require careful regularization under noise and incomplete data. Nonlinear modalities (EIT, ultrasound, full waveform inversion) require iterative inversion of a nonlinear forward map, combining adjoint-based gradient computation with variational or learned regularizers.</p>
  <p class="pub-annotation"><strong>Applied to:</strong> EIT lung monitoring, sparse-view CT reconstruction, undersampled MRI, ultrasound tomography for soft-tissue imaging, and seismic full waveform inversion for subsurface velocity recovery.</p>
  <p class="pub-annotation"><strong>Industry connection:</strong> Every major medical imaging manufacturer (Siemens, GE, Philips) and every seismic processing company depends on reconstruction algorithms of exactly this type as the core of their imaging pipeline.</p>
</div>

<div class="research-card">
  <div class="research-icon"><i class="fas fa-robot"></i></div>
  <h3>Scientific Machine Learning</h3>
  <p>Integrating deep neural networks with physics-oriented models, including physics-informed neural networks and GPU-accelerated deep learning for real-time imaging.</p>
  <p class="pub-annotation"><strong>Applied to:</strong> Accelerating PDE-constrained simulations, enabling real-time inversion where classical iterative methods are too slow, and learning regularisers from data for improved reconstruction quality.</p>
  <p class="pub-annotation"><strong>Industry connection:</strong> Physics-informed neural networks and neural operators are being adopted in computational fluid dynamics, seismic processing pipelines, and industrial digital twin systems.</p>
</div>

<div class="research-card">
  <div class="research-icon"><i class="fas fa-calculator"></i></div>
  <h3>Numerical Methods</h3>
  <p>Developing efficient numerical algorithms for differential equations and optimization, including finite element methods, iterative solvers, and collocation methods.</p>
  <p class="pub-annotation"><strong>Applied to:</strong> Discretising and solving forward models in imaging, fluid dynamics, and heat transfer: the computational foundation that makes large-scale inversion tractable.</p>
  <p class="pub-annotation"><strong>Industry connection:</strong> Finite element solvers and iterative linear algebra underpin reservoir simulation, structural analysis codes, and climate modelling used throughout industry and government.</p>
</div>

</div>
</section>

<section class="research-section">
<h2 class="section-heading"><i class="fas fa-book"></i> Publications</h2>

<div class="publications-list">

<div class="publication">
  <span class="pub-number">[1]</span>
  <div class="pub-content">
    <div class="pub-title">A new spectral conjugate gradient method for convex constrained monotone nonlinear equations with application to image restoration</div>
    <div class="pub-authors">Abdullahi M., Pan K., Halilu A.S., Abubakar A.B., <strong>Tiamiyu A.T.</strong>, and Al-Yaari A.</div>
    <div class="pub-venue"><em>Japan Journal of Industrial and Applied Mathematics</em>, Vol. 43, No. 2, 2026</div>
    <div class="pub-links"><a href="https://doi.org/10.1007/s13160-026-00778-x" target="_blank" rel="noopener"><i class="fas fa-external-link-alt"></i> DOI</a></div>
    <div class="pub-annotation">Develops a spectral conjugate gradient algorithm for nonlinear equation systems under convex constraints, with numerical experiments demonstrating improved convergence on image deblurring and compressed signal recovery problems.</div>
  </div>
</div>

<div class="publication">
  <span class="pub-number">[2]</span>
  <div class="pub-content">
    <div class="pub-title">Accelerated double step-length method for solving monotone nonlinear equations with convex-constraint and application</div>
    <div class="pub-authors">Abdullahi M., Halilu A.S., Saleh M.A., Almaymuni A.Z., Siamakani S.Y.M., <strong>Tiamiyu A.T.</strong>, and Ibrahim S.M.</div>
    <div class="pub-venue"><em>AIMS Mathematics</em>, Vol. 11, No. 4, pp. 10908–10935, 2026</div>
    <div class="pub-links"><a href="https://doi.org/10.3934/math.2026448" target="_blank" rel="noopener"><i class="fas fa-external-link-alt"></i> DOI</a></div>
    <div class="pub-annotation">Proposes an accelerated step-length strategy for iteratively solving constrained monotone equations, with convergence analysis and benchmarks on signal reconstruction and machine learning applications.</div>
  </div>
</div>

<div class="publication">
  <span class="pub-number">[3]</span>
  <div class="pub-content">
    <div class="pub-title">Combined Effects of Anisotropic Permeability, Chemical Reaction, and Dual Stratifications on Unsteady Free Convection Around a Vertical Circular Cylinder</div>
    <div class="pub-authors">Adeniyan A., Rauf Q.O., and <strong>Tiamiyu A.T.</strong></div>
    <div class="pub-venue"><em>International Journal of Mathematical Sciences and Optimization: Theory and Applications</em>, Vol. 12, No. 1, pp. 104&ndash;128, 2026</div>
    <div class="pub-links"><a href="https://doi.org/10.5281/zenodo.20467246" target="_blank" rel="noopener"><i class="fas fa-external-link-alt"></i> DOI</a></div>
    <div class="pub-annotation">Studies unsteady free convection past a translating vertical cylinder embedded in an anisotropic porous medium under simultaneous thermal and solutal stratifications with first-order chemical reaction; solved by an adaptive Lobatto IIIa collocation scheme with global sensitivity analysis ranking parameter influence on heat, mass, and momentum transfer.</div>
  </div>
</div>

<div class="publication">
  <span class="pub-number">[4]</span>
  <div class="pub-content">
    <div class="pub-title">Physics-informed neural networks in iterative form of nonlinear equations for numerical algorithms and simulations of delay differential equations</div>
    <div class="pub-authors">He J., and <strong>Tiamiyu A.T.</strong></div>
    <div class="pub-venue"><em>Physica A: Statistical Mechanics and its Applications</em>, 2025</div>
    <div class="pub-links"><a href="https://doi.org/10.1016/j.physa.2025.130368" target="_blank" rel="noopener"><i class="fas fa-external-link-alt"></i> DOI</a></div>
    <div class="pub-annotation">Extends physics-informed neural networks to differential equations with time-delay terms, covering iterative solvers and simulation of functional differential equations arising in population dynamics, control theory, and epidemic modeling.</div>
  </div>
</div>

<div class="publication">
  <span class="pub-number">[5]</span>
  <div class="pub-content">
    <div class="pub-title">Numerical simulation of time-dependent non-Newtonian compressible fluid flow in porous media: finite element method and time-dependent approach</div>
    <div class="pub-authors">Ahmad S. and <strong>Tiamiyu A.T.</strong></div>
    <div class="pub-venue"><em>International Communications in Heat and Mass Transfer</em>, 2024</div>
    <div class="pub-links"><a href="https://doi.org/10.1016/j.icheatmasstransfer.2024.107934" target="_blank" rel="noopener"><i class="fas fa-external-link-alt"></i> DOI</a></div>
    <div class="pub-annotation">Uses finite element simulation to model compressible non-Newtonian fluid flow through porous media in the time-dependent setting, relevant to oil reservoir simulation, industrial filtration, and biomedical fluid dynamics.</div>
  </div>
</div>

<div class="publication">
  <span class="pub-number">[6]</span>
  <div class="pub-content">
    <div class="pub-title">Numerical assessment of some semi-analytical techniques for solving a fractional-order leptospirosis model</div>
    <div class="pub-authors">Audu K.J., <strong>Tiamiyu A.T.</strong>, Akpabio J.N., Ahmad H., and Olabiyi M.A.</div>
    <div class="pub-venue"><em>Malaysian Journal of Science</em>, 2024</div>
    <div class="pub-links"><a href="https://doi.org/10.22452/mjs.vol43no3.9" target="_blank" rel="noopener"><i class="fas fa-external-link-alt"></i> DOI</a></div>
    <div class="pub-annotation">Evaluates and compares semi-analytical methods for a fractional-order epidemiological model of leptospirosis, providing computational tools applicable to disease dynamics modeling in tropical and subtropical environments.</div>
  </div>
</div>

<p class="pub-footnote">For a complete list of publications, see <a href="https://scholar.google.com/citations?user=oZ3egAIAAAAJ&hl=en" target="_blank" rel="noopener">Google Scholar</a>.</p>

</div>
</section>

<section class="research-section">
<h2 class="section-heading"><i class="fas fa-microphone-alt"></i> Presentations & Talks</h2>

<div class="presentations-grid">

<div class="presentation-item">
  <div class="pres-type">Guest Speaker</div>
  <div class="pres-title">Harnessing AI for Innovative and Ethical Use in Academia</div>
  <div class="pres-venue">ANSHK Research Forum 2025 · August 2025</div>
</div>

<div class="presentation-item">
  <div class="pres-type">Minisymposium Co-organizer</div>
  <div class="pres-title">Industrial and Applied Mathematics</div>
  <div class="pres-venue">HK-SIAM Conference 2025 · July 2025</div>
</div>

<div class="presentation-item">
  <div class="pres-type">Speaker</div>
  <div class="pres-title">Harnessing AI for Innovative Teaching and Ethical Research in Academia</div>
  <div class="pres-venue">Academic Discourse with MLA, Nigeria · July 2025</div>
</div>

<div class="presentation-item">
  <div class="pres-type">Workshop Co-organizer</div>
  <div class="pres-title">SIAM Student Chapter Workshop</div>
  <div class="pres-venue">CUHK · 2024</div>
</div>

</div>
</section>

<section class="research-section">
<h2 class="section-heading"><i class="fas fa-code"></i> Projects &amp; Code</h2>

<div class="about-text">
<p>Open-source implementations of the methods developed in my research. Repositories are in active development; see <a href="https://github.com/abdgafartunde" target="_blank" rel="noopener">GitHub</a> for the latest status.</p>
</div>

<div class="research-areas">

<div class="research-card">
  <div class="research-icon"><i class="fas fa-heartbeat"></i></div>
  <h3>EIT Reconstruction Toolkit <span class="badge-dev">in development</span></h3>
  <p>Classical (Tikhonov, TV, PDHG) and deep learning methods for Electrical Impedance Tomography reconstruction, with applications in low-resource medical imaging.</p>
  <p class="pub-annotation"><a href="https://github.com/abdgafartunde/eit-reconstruction-toolkit" target="_blank" rel="noopener"><i class="fab fa-github"></i> abdgafartunde/eit-reconstruction-toolkit</a></p>
</div>

<div class="research-card">
  <div class="research-icon"><i class="fas fa-wave-square"></i></div>
  <h3>Seismic Inversion ML <span class="badge-dev">in development</span></h3>
  <p>Physics-informed and data-driven methods for full waveform inversion, recovering subsurface velocity models from seismic measurements.</p>
  <p class="pub-annotation"><a href="https://github.com/abdgafartunde/seismic-inversion-ml" target="_blank" rel="noopener"><i class="fab fa-github"></i> abdgafartunde/seismic-inversion-ml</a></p>
</div>

<div class="research-card">
  <div class="research-icon"><i class="fas fa-x-ray"></i></div>
  <h3>Medical Imaging <span class="badge-dev">in development</span></h3>
  <p>Compressed sensing and sparse recovery algorithms for accelerated MRI and low-dose CT reconstruction.</p>
  <p class="pub-annotation"><a href="https://github.com/abdgafartunde/medical-imaging" target="_blank" rel="noopener"><i class="fab fa-github"></i> abdgafartunde/medical-imaging</a></p>
</div>

<div class="research-card">
  <div class="research-icon"><i class="fas fa-water"></i></div>
  <h3>Groundwater Detection <span class="badge-dev">in development</span></h3>
  <p>ERT-based inversion for locating water-bearing zones from surface electrical resistivity measurements.</p>
  <p class="pub-annotation"><a href="https://github.com/abdgafartunde/groundwater-detection" target="_blank" rel="noopener"><i class="fab fa-github"></i> abdgafartunde/groundwater-detection</a></p>
</div>

</div>
</section>

<section class="research-section">
<h2 class="section-heading"><i class="fas fa-handshake"></i> Collaborations &amp; Consulting</h2>

<div class="about-text">
<p>I am open to research collaborations and consulting engagements with academic groups, industry partners, and government bodies working on problems where computational mathematics and scientific machine learning can make a meaningful difference.</p>

<p>My technical expertise spans inverse problems and regularization theory, physics-informed machine learning, finite element and spectral methods for PDEs, and data-driven reconstruction algorithms. On the applied side, I have worked on problems in medical imaging (electrical impedance tomography), parameter identification in subsurface and fluid flow models, and computational methods for nonlinear optimization. I am comfortable working across sectors, from academic research collaborations to applied industrial problems.</p>

<p>If your work involves indirect measurements, large-scale simulation, data-sparse inversion, or the integration of physical models with data, I would be glad to discuss how computational mathematics can contribute.</p>

<div class="interest-tags" style="margin-top: 1rem;">
  <span class="interest-tag"><i class="fas fa-search"></i> Inverse Problems & Imaging</span>
  <span class="interest-tag"><i class="fas fa-wave-square"></i> Geophysical & Seismic Inversion</span>
  <span class="interest-tag"><i class="fas fa-heartbeat"></i> Medical Imaging</span>
  <span class="interest-tag"><i class="fas fa-brain"></i> Scientific Machine Learning</span>
  <span class="interest-tag"><i class="fas fa-water"></i> Engineering Simulation & PDEs</span>
  <span class="interest-tag"><i class="fas fa-flask"></i> Research Consulting</span>
</div>

<p style="margin-top: 1.2rem;"><i class="fas fa-envelope"></i> Get in touch: <a href="mailto:abdgafartunde@yahoo.com">abdgafartunde@yahoo.com</a> &middot; <a href="mailto:tiamiyuabdgafar@jlu.edu.cn">tiamiyuabdgafar@jlu.edu.cn</a> <span style="font-size:0.82rem; color:var(--text-muted);">(institutional)</span></p>
</div>
</section>
