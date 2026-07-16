---
layout: page
page_class: research-page
title: "Research"
eyebrow: "Research programme"
description: "Computational and applied mathematics for inverse problems, imaging, and scientific machine learning."
seo_description: "Research by A.T. Tiamiyu on inverse problems, electrical impedance tomography, regularization theory, and scientific machine learning. Publications and presentations."
---

<div class="research-editorial">
  <nav class="research-page-nav" aria-label="Research page sections">
    <span>On this page</span>
    <a href="#programme">Programme</a>
    <a href="#publications">Publications</a>
    <a href="#talks">Talks</a>
    <a href="#projects">Software</a>
    <a href="#collaborate">Collaborate</a>
  </nav>

  <section class="editorial-section" id="programme" aria-labelledby="programme-heading">
    <div class="editorial-label"><p>Programme</p></div>
    <div class="editorial-content">
      <h2 id="programme-heading">Recovering information that cannot be measured directly</h2>
      <div class="research-introduction">
        <p>I work on inverse problems: mathematical problems where indirect measurements are used to reconstruct the quantity that produced them. These problems arise in medical imaging, non-destructive testing, and geophysics. They are usually ill-posed, so small measurement errors can produce large reconstruction errors without suitable regularization.</p>
        <p>My approach combines variational methods and regularization theory with numerical optimization and scientific machine learning. My doctoral work developed inversion frameworks for electrical impedance tomography with partial boundary data. My current research extends these ideas to linear and nonlinear inverse problems in medical and subsurface imaging.</p>
      </div>

      <div class="research-theme-list">
        <article>
          <span class="research-theme-number" aria-hidden="true">01</span>
          <div>
            <h3>Inverse problems and regularization</h3>
            <p>Variational inversion frameworks, adaptive primal-dual algorithms, and parameter identification for ill-posed and nonlinear problems.</p>
            <details class="research-theme-details">
              <summary>Applications and relevance</summary>
              <p><strong>Applications:</strong> Seismic exploration, anomaly detection in medical imaging, non-destructive testing, and parameter recovery in fluid and heat-flow models.</p>
              <p><strong>Industry connection:</strong> The same mathematical structure appears in velocity-model building, medical image reconstruction, and engineering model calibration.</p>
            </details>
          </div>
        </article>

        <article>
          <span class="research-theme-number" aria-hidden="true">02</span>
          <div>
            <h3>Computational imaging and tomography</h3>
            <p>Reconstruction methods for linear modalities such as CT and MRI, and nonlinear modalities such as EIT, ultrasound tomography, and full waveform inversion.</p>
            <details class="research-theme-details">
              <summary>Applications and relevance</summary>
              <p><strong>Applications:</strong> EIT lung monitoring, sparse-view CT, undersampled MRI, ultrasound tomography, and subsurface velocity recovery.</p>
              <p><strong>Industry connection:</strong> These reconstruction methods form the computational basis of medical imaging systems and seismic processing workflows.</p>
            </details>
          </div>
        </article>

        <article>
          <span class="research-theme-number" aria-hidden="true">03</span>
          <div>
            <h3>Scientific machine learning</h3>
            <p>Physics-informed neural networks, learned regularizers, and GPU-accelerated methods for inverse problems and differential equations.</p>
            <details class="research-theme-details">
              <summary>Applications and relevance</summary>
              <p><strong>Applications:</strong> Accelerating PDE-constrained simulation, learning reconstruction priors from data, and reducing the cost of iterative inversion.</p>
              <p><strong>Industry connection:</strong> Physics-informed methods and neural operators are studied for computational fluid dynamics, seismic processing, and digital-twin models.</p>
            </details>
          </div>
        </article>

        <article>
          <span class="research-theme-number" aria-hidden="true">04</span>
          <div>
            <h3>Numerical methods</h3>
            <p>Finite element methods, iterative solvers, collocation methods, and constrained optimization for differential equations and large-scale computation.</p>
            <details class="research-theme-details">
              <summary>Applications and relevance</summary>
              <p><strong>Applications:</strong> Forward simulation in imaging, fluid dynamics, heat transfer, and the numerical models required for inversion.</p>
              <p><strong>Industry connection:</strong> Finite element solvers and iterative linear algebra underpin reservoir simulation, structural analysis, and climate models.</p>
            </details>
          </div>
        </article>
      </div>
    </div>
  </section>

  <section class="editorial-section" id="publications" aria-labelledby="publications-heading">
    <div class="editorial-label"><p>Publications</p></div>
    <div class="editorial-content">
      <h2 id="publications-heading">Selected publications</h2>
      <p class="research-section-intro">A complete and current citation record is available on <a href="https://scholar.google.com/citations?user=oZ3egAIAAAAJ&amp;hl=en" target="_blank" rel="noopener">Google Scholar</a>.</p>

      <div class="research-publication-list">
        <article class="research-publication">
          <time datetime="2026">2026</time>
          <div>
            <h3>Approximate numerical solutions of second-order delay differential equations using artificial neural networks</h3>
            <p class="research-authors">Audu K.J., Iyanda F.K., Balogun O.O., <strong>Tiamiyu A.T.</strong>, Adedayo O.A., Iyadunni A.V., and Kamorudeen A.A.</p>
            <p class="research-venue">In <em>Neural Networks: Theory, Algorithms, Simulation, and Applications</em>, Springer Nature Switzerland, pp. 91&ndash;112</p>
            <p class="research-annotation">An artificial neural network method for second-order delay differential equations that incorporates the history function directly into the network structure.</p>
            <a class="research-record-link" href="https://doi.org/10.1007/978-3-032-18750-5_6" target="_blank" rel="noopener">DOI <span aria-hidden="true">↗</span></a>
          </div>
        </article>

        <article class="research-publication">
          <time datetime="2026">2026</time>
          <div>
            <h3>A new spectral conjugate gradient method for convex constrained monotone nonlinear equations with application to image restoration</h3>
            <p class="research-authors">Abdullahi M., Pan K., Halilu A.S., Abubakar A.B., <strong>Tiamiyu A.T.</strong>, and Al-Yaari A.</p>
            <p class="research-venue"><em>Japan Journal of Industrial and Applied Mathematics</em>, Vol. 43, No. 2</p>
            <p class="research-annotation">A spectral conjugate gradient algorithm for constrained nonlinear equation systems, tested on image deblurring and compressed signal recovery.</p>
            <a class="research-record-link" href="https://doi.org/10.1007/s13160-026-00778-x" target="_blank" rel="noopener">DOI <span aria-hidden="true">↗</span></a>
          </div>
        </article>

        <article class="research-publication">
          <time datetime="2026">2026</time>
          <div>
            <h3>Accelerated double step-length method for solving monotone nonlinear equations with convex-constraint and application</h3>
            <p class="research-authors">Abdullahi M., Halilu A.S., Saleh M.A., Almaymuni A.Z., Siamakani S.Y.M., <strong>Tiamiyu A.T.</strong>, and Ibrahim S.M.</p>
            <p class="research-venue"><em>AIMS Mathematics</em>, Vol. 11, No. 4, pp. 10908&ndash;10935</p>
            <p class="research-annotation">An accelerated step-length strategy with convergence analysis and numerical tests for signal reconstruction and machine learning problems.</p>
            <a class="research-record-link" href="https://doi.org/10.3934/math.2026448" target="_blank" rel="noopener">DOI <span aria-hidden="true">↗</span></a>
          </div>
        </article>

        <article class="research-publication">
          <time datetime="2026">2026</time>
          <div>
            <h3>Combined effects of anisotropic permeability, chemical reaction, and dual stratifications on unsteady free convection around a vertical circular cylinder</h3>
            <p class="research-authors">Adeniyan A., Rauf Q.O., and <strong>Tiamiyu A.T.</strong></p>
            <p class="research-venue"><em>International Journal of Mathematical Sciences and Optimization: Theory and Applications</em>, Vol. 12, No. 1, pp. 104&ndash;128</p>
            <p class="research-annotation">An adaptive collocation study of unsteady free convection in an anisotropic porous medium, including global parameter-sensitivity analysis.</p>
            <a class="research-record-link" href="https://doi.org/10.5281/zenodo.20467246" target="_blank" rel="noopener">DOI <span aria-hidden="true">↗</span></a>
          </div>
        </article>

        <article class="research-publication">
          <time datetime="2025">2025</time>
          <div>
            <h3>Numerical solution of first and higher order IVPs via a single continuous block method</h3>
            <p class="research-authors">Garba J., Audu K.J., Mohammed U., and <strong>Tiamiyu A.T.</strong></p>
            <p class="research-venue"><em>Scientific Journal of Mehmet Akif Ersoy University</em>, Vol. 8, No. 1, pp. 16&ndash;34</p>
            <p class="research-annotation">A seventh-order continuous collocation scheme for solving first and higher order ordinary differential equations.</p>
            <a class="research-record-link" href="https://dergipark.org.tr/en/pub/sjmakeu/article/1611387" target="_blank" rel="noopener">Article <span aria-hidden="true">↗</span></a>
          </div>
        </article>

        <article class="research-publication">
          <time datetime="2025">2025</time>
          <div>
            <h3>Physics-informed neural networks in iterative form of nonlinear equations for numerical algorithms and simulations of delay differential equations</h3>
            <p class="research-authors">He J. and <strong>Tiamiyu A.T.</strong></p>
            <p class="research-venue"><em>Physica A: Statistical Mechanics and its Applications</em></p>
            <p class="research-annotation">Physics-informed methods for differential equations with time-delay terms, with examples from population dynamics, control, and epidemic modelling.</p>
            <a class="research-record-link" href="https://doi.org/10.1016/j.physa.2025.130368" target="_blank" rel="noopener">DOI <span aria-hidden="true">↗</span></a>
          </div>
        </article>

        <article class="research-publication">
          <time datetime="2024">2024</time>
          <div>
            <h3>Numerical simulation of time-dependent non-Newtonian compressible fluid flow in porous media: finite element method and time integration approach</h3>
            <p class="research-authors">Ahmad S. and <strong>Tiamiyu A.T.</strong></p>
            <p class="research-venue"><em>International Communications in Heat and Mass Transfer</em></p>
            <p class="research-annotation">Finite element simulation of compressible non-Newtonian flow through porous media, with relevance to reservoir simulation and industrial filtration.</p>
            <a class="research-record-link" href="https://doi.org/10.1016/j.icheatmasstransfer.2024.107934" target="_blank" rel="noopener">DOI <span aria-hidden="true">↗</span></a>
          </div>
        </article>

        <article class="research-publication">
          <time datetime="2024">2024</time>
          <div>
            <h3>Numerical assessment of some semi-analytical techniques for solving a fractional-order leptospirosis model</h3>
            <p class="research-authors">Audu K.J., <strong>Tiamiyu A.T.</strong>, Akpabio J.N., Ahmad H., and Olabiyi M.A.</p>
            <p class="research-venue"><em>Malaysian Journal of Science</em></p>
            <p class="research-annotation">A comparison of semi-analytical methods for a fractional-order epidemiological model of leptospirosis.</p>
            <a class="research-record-link" href="https://doi.org/10.22452/mjs.vol43no3.9" target="_blank" rel="noopener">DOI <span aria-hidden="true">↗</span></a>
          </div>
        </article>
      </div>
    </div>
  </section>

  <section class="editorial-section" id="talks" aria-labelledby="talks-heading">
    <div class="editorial-label"><p>Presentations</p></div>
    <div class="editorial-content">
      <h2 id="talks-heading">Selected talks and academic events</h2>
      <div class="research-talk-list">
        <article>
          <p class="research-talk-meta">Guest speaker · August 2025</p>
          <h3>Harnessing AI for Innovative and Ethical Use in Academia</h3>
          <p>ANSHK Research Forum 2025</p>
        </article>
        <article>
          <p class="research-talk-meta">Minisymposium co-organizer · July 2025</p>
          <h3>Industrial and Applied Mathematics</h3>
          <p>HK-SIAM Conference 2025</p>
        </article>
        <article>
          <p class="research-talk-meta">Speaker · July 2025</p>
          <h3>Harnessing AI for Innovative Teaching and Ethical Research in Academia</h3>
          <p>Academic Discourse with MLA, Nigeria</p>
        </article>
        <article>
          <p class="research-talk-meta">Workshop co-organizer · 2024</p>
          <h3>SIAM Student Chapter Workshop</h3>
          <p>The Chinese University of Hong Kong</p>
        </article>
      </div>
    </div>
  </section>

  <section class="editorial-section" id="projects" aria-labelledby="projects-heading">
    <div class="editorial-label"><p>Software</p></div>
    <div class="editorial-content">
      <h2 id="projects-heading">Open research software</h2>
      <p class="research-section-intro">Implementations and computational experiments connected to my research programme. Development history and current releases are available on <a href="https://github.com/abdgafartunde" target="_blank" rel="noopener">GitHub</a>.</p>

      <div class="research-project-list">
        <article>
          <p class="research-project-meta">Reconstruction toolkit · Active</p>
          <h3><a href="https://github.com/abdgafartunde/eit-reconstruction-toolkit" target="_blank" rel="noopener">EIT Reconstruction Toolkit</a></h3>
          <p>Classical and learned reconstruction methods for Electrical Impedance Tomography, including Tikhonov regularization, total variation, and primal-dual algorithms.</p>
          <div class="research-project-links">
            <a href="https://github.com/abdgafartunde/eit-reconstruction-toolkit" target="_blank" rel="noopener">GitHub <span aria-hidden="true">↗</span></a>
            <a href="https://doi.org/10.5281/zenodo.21037312" target="_blank" rel="noopener">Zenodo <span aria-hidden="true">↗</span></a>
          </div>
        </article>
        <article>
          <p class="research-project-meta">Scientific machine learning · In development</p>
          <h3><a href="https://github.com/abdgafartunde/seismic-inversion-ml" target="_blank" rel="noopener">Seismic Inversion ML</a></h3>
          <p>Physics-informed and data-driven methods for recovering subsurface velocity models from seismic measurements.</p>
        </article>
        <article>
          <p class="research-project-meta">Computational imaging · Active</p>
          <h3><a href="https://github.com/abdgafartunde/medical-imaging" target="_blank" rel="noopener">Medical Imaging</a></h3>
          <p>Compressed sensing and sparse recovery algorithms for accelerated MRI and low-dose CT reconstruction.</p>
          <div class="research-project-links">
            <a href="https://github.com/abdgafartunde/medical-imaging" target="_blank" rel="noopener">GitHub <span aria-hidden="true">↗</span></a>
            <a href="https://doi.org/10.5281/zenodo.21321376" target="_blank" rel="noopener">Zenodo <span aria-hidden="true">↗</span></a>
          </div>
        </article>
        <article>
          <p class="research-project-meta">Geophysical inversion · In development</p>
          <h3><a href="https://github.com/abdgafartunde/groundwater-detection" target="_blank" rel="noopener">Groundwater Detection</a></h3>
          <p>Electrical resistivity inversion for identifying water-bearing zones from surface measurements.</p>
        </article>
      </div>
    </div>
  </section>

  <section class="editorial-section research-collaboration" id="collaborate" aria-labelledby="collaborate-heading">
    <div class="editorial-label"><p>Collaborate</p></div>
    <div class="editorial-content">
      <h2 id="collaborate-heading">Research and technical collaboration</h2>
      <p>I welcome research collaborations with academic groups, industry teams, and public institutions working on inverse problems, scientific machine learning, computational imaging, or PDE-constrained models.</p>
      <p>If your problem involves indirect measurements, large-scale simulation, data-sparse inversion, or the integration of physical models with data, I would be glad to discuss the mathematical and computational requirements.</p>
      <div class="research-contact-links">
        <a href="mailto:abdgafartunde@yahoo.com">abdgafartunde@yahoo.com <span aria-hidden="true">→</span></a>
        <a href="mailto:tiamiyuabdgafar@jlu.edu.cn">tiamiyuabdgafar@jlu.edu.cn</a>
      </div>
    </div>
  </section>
</div>
