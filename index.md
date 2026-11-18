---
layout: page
title: ""
description: ""
seo_title: "Abd'gafar Tunde Tiamiyu | Computational and Applied Mathematics"
seo_description: "Personal website of A.T. Tiamiyu. Research, publications, and writing on inverse problems and scientific computing."
---

<div class="homepage-editorial">
  <header class="home-hero">
    <div class="home-portrait-wrap">
      <img src="{{ '/assets/images/profile_pic.jpeg' | relative_url }}" alt="Portrait of Abd'gafar Tunde Tiamiyu" class="home-portrait" width="995" height="1280" fetchpriority="high">
    </div>

    <div class="home-hero-copy">
      <p class="home-eyebrow">Computational and applied mathematician</p>
      <h1 id="profile-heading">Abd'gafar Tunde <span>TIAMIYU</span></h1>
      <p class="home-lede">I develop mathematical and computational methods for recovering hidden structure from incomplete and noisy measurements.</p>
      <p class="home-summary" id="focus-heading">My work combines regularization, numerical analysis and scientific machine learning, with applications in medical and subsurface imaging.</p>
      <p class="home-position">Postdoctoral Researcher, School of Mathematics<br><a href="https://www.jlu.edu.cn/" target="_blank" rel="noopener">Jilin University</a>, Changchun, China</p>

      <div class="home-actions">
        <a class="home-primary-action" href="{{ '/research/' | relative_url }}">View research <span aria-hidden="true">→</span></a>
        <a class="home-text-action" href="{{ '/CV.pdf' | relative_url }}">Curriculum vitae</a>
      </div>

      <nav class="home-profile-links" aria-label="Professional profiles">
        <a href="mailto:abdgafartunde@yahoo.com">Email</a>
        <a href="https://scholar.google.com/citations?user=oZ3egAIAAAAJ&amp;hl=en" target="_blank" rel="noopener">Google Scholar</a>
        <a href="https://github.com/abdgafartunde" target="_blank" rel="noopener">GitHub</a>
      </nav>
    </div>
  </header>

  <nav class="home-page-nav" aria-label="Homepage sections">
    <span>Explore</span>
    <a href="#work-heading">Selected work</a>
    <a href="#writing-heading">Recent writing</a>
    <a href="#updates-heading">Updates</a>
  </nav>

  <section class="home-editorial-section" aria-labelledby="work-heading">
    <div class="home-section-label">
      <p>Selected work</p>
    </div>
    <div class="home-section-content">
      <h2 id="work-heading">Software and publications</h2>
      <div class="home-research-feature">
        <h3>Reconstructing the interior from boundary measurements</h3>
        <p>Electrical impedance tomography uses electrical measurements at the boundary to infer conductivity inside an object. This eitkit example compares two ways of regularizing that reconstruction.</p>
        <figure class="research-visual">
          <div class="research-visual-panels">
            <svg viewBox="0 60 800 690" role="img" aria-labelledby="eit-known-title eit-known-desc">
              <title id="eit-known-title">Known conductivity</title>
              <desc id="eit-known-desc">A simulated circular object contains one more conductive inclusion at the upper right and one less conductive inclusion at the lower left. Sixteen electrodes surround its boundary.</desc>
              <image href="{{ '/assets/images/eitkit-reconstructions.png' | relative_url }}" width="2400" height="750"/>
            </svg>
            <svg viewBox="800 60 800 690" role="img" aria-labelledby="eit-tikhonov-title eit-tikhonov-desc">
              <title id="eit-tikhonov-title">Tikhonov reconstruction</title>
              <desc id="eit-tikhonov-desc">The Tikhonov reconstruction locates the two inclusions but smooths their boundaries.</desc>
              <image href="{{ '/assets/images/eitkit-reconstructions.png' | relative_url }}" width="2400" height="750"/>
            </svg>
            <svg viewBox="1600 60 800 690" role="img" aria-labelledby="eit-tv-title eit-tv-desc">
              <title id="eit-tv-title">Total-variation reconstruction</title>
              <desc id="eit-tv-desc">The total-variation reconstruction, computed with ADMM, retains sharper boundaries in this example.</desc>
              <image href="{{ '/assets/images/eitkit-reconstructions.png' | relative_url }}" width="2400" height="750"/>
            </svg>
          </div>
          <figcaption>Synthetic eitkit demonstration with 16 electrodes and 45 dB signal-to-noise ratio. Data were simulated on the reconstruction mesh. Panels show the known conductivity, Tikhonov reconstruction and total-variation reconstruction. <a href="{{ '/assets/images/eitkit-reconstructions.png' | relative_url }}">View the full figure</a>.</figcaption>
        </figure>
        <a class="home-inline-link" href="https://github.com/abdgafartunde/eit-reconstruction-toolkit/blob/442d581/scripts/reconstruct_and_plot.py" target="_blank" rel="noopener">Explore the eitkit example <span aria-hidden="true">↗</span></a>
      </div>
      <div class="home-work-list">
        <article class="home-work-item">
          <p class="home-work-meta">Open-source software · 2026</p>
          <h3><a href="https://github.com/abdgafartunde/medical-imaging" target="_blank" rel="noopener">medimg</a></h3>
          <p>Compressed sensing reconstruction methods for accelerated MRI and CT.</p>
          <a class="home-work-link" href="https://doi.org/10.5281/zenodo.21321199" target="_blank" rel="noopener">Software record <span aria-hidden="true">↗</span></a>
        </article>
        <article class="home-work-item">
          <p class="home-work-meta">Journal article · 2026</p>
          <h3><a href="https://doi.org/10.1007/s13160-026-00778-x" target="_blank" rel="noopener">A spectral conjugate gradient method for constrained nonlinear equations</a></h3>
          <p>Published in the <em>Japan Journal of Industrial and Applied Mathematics</em>, with an application to image restoration.</p>
          <a class="home-work-link" href="{{ '/research/' | relative_url }}">See all research <span aria-hidden="true">→</span></a>
        </article>
      </div>
    </div>
  </section>

  {% assign recent_posts = site.posts | sort: 'date' | reverse %}
  {% if recent_posts.size > 0 %}
  <section class="home-editorial-section" aria-labelledby="writing-heading">
    <div class="home-section-label"><p>Recent writing</p></div>
    <div class="home-section-content">
      <h2 id="writing-heading">Notes from research and academic life</h2>
      <div class="home-writing-list">
        {% for post in recent_posts limit:2 %}
        <article>
          <time datetime="{{ post.date | date_to_xmlschema }}">{{ post.date | date: "%d %B %Y" }}</time>
          <h3><a href="{{ post.url | relative_url }}">{{ post.title }}</a></h3>
          <p>{{ post.description }}</p>
        </article>
        {% endfor %}
      </div>
      <a class="home-inline-link" href="{{ '/blog/' | relative_url }}">All writing <span aria-hidden="true">→</span></a>
    </div>
  </section>
  {% endif %}

  <section class="home-editorial-section" aria-labelledby="updates-heading">
    <div class="home-section-label">
      <p>Recent activity</p>
    </div>
    <div class="home-section-content">
      <h2 id="updates-heading">Latest updates</h2>
      <div class="home-update-list">
        {% for update in site.data.activity limit:3 %}
        <article>
          <time datetime="{{ update.date }}">{{ update.label }}</time>
          <p>{{ update.text }}</p>
        </article>
        {% endfor %}
      </div>
      {% if site.data.activity.size > 3 %}
      <details class="home-update-archive">
        <summary>Earlier updates</summary>
        <div class="home-update-list">
          {% for update in site.data.activity offset:3 %}
          <article>
            <time datetime="{{ update.date }}">{{ update.label }}</time>
            <p>{{ update.text }}</p>
          </article>
          {% endfor %}
        </div>
      </details>
      {% endif %}
    </div>
  </section>

</div>
