---
layout: page
page_class: blog-page
title: "Blog"
eyebrow: "Notes and essays"
description: "Writing on mathematics, research, computation, and academic life."
seo_description: "Blog by A.T. Tiamiyu covering inverse problems, scientific computing, physics-informed neural networks, regularization, and reflections on academic life."
---

{% assign sorted_posts = site.posts | sort: 'date' | reverse %}

<div class="blog-editorial">
  <nav class="blog-page-nav" aria-label="Blog page sections">
    <span>On this page</span>
    <a href="#writing">Writing</a>
    {% if site.posts.size > 6 %}<a href="#archive">Archive</a>{% endif %}
  </nav>

  <section class="editorial-section" id="writing" aria-labelledby="writing-heading">
    <div class="editorial-label"><p>Writing</p></div>
    <div class="editorial-content">
      <h2 id="writing-heading">Mathematics in theory and practice</h2>
      <p class="blog-editorial-intro">Notes on inverse problems, scientific computing, and the process of doing mathematical research. I also write about teaching, academic work, and applications that matter beyond the university.</p>

      {% if site.posts.size > 0 %}
      {% for post in sorted_posts limit:1 %}
      <article class="blog-lead">
        <div class="blog-lead-meta">
          <span>Latest essay</span>
          <time datetime="{{ post.date | date_to_xmlschema }}">{{ post.date | date: "%d %B %Y" }}</time>
        </div>
        <h3><a href="{{ post.url | relative_url }}">{{ post.title }}</a></h3>
        <p>{{ post.description }}</p>
        <div class="blog-lead-footer">
          <a href="{{ post.url | relative_url }}">Read the essay <span aria-hidden="true">&rarr;</span></a>
          <span>{% assign words = post.content | number_of_words %}{% assign mins = words | divided_by: 200 %}{% if mins < 1 %}1{% else %}{{ mins }}{% endif %} min read</span>
        </div>
      </article>
      {% endfor %}

      <div class="blog-reading-list" aria-label="Recent essays">
        {% for post in sorted_posts offset:1 limit:5 %}
        <article>
          <time datetime="{{ post.date | date_to_xmlschema }}">{{ post.date | date: "%d %b %Y" }}</time>
          <div>
            <h3><a href="{{ post.url | relative_url }}">{{ post.title }}</a></h3>
            <p>{{ post.description }}</p>
            {% if post.tags.size > 0 %}
            <p class="blog-topic">{{ post.tags | first }}</p>
            {% endif %}
          </div>
        </article>
        {% endfor %}
      </div>
      {% else %}
      <p class="blog-empty">No posts yet. New writing on computational mathematics and inverse problems will appear here.</p>
      {% endif %}
    </div>
  </section>

  {% if site.posts.size > 6 %}
  <section class="editorial-section blog-archive-section" id="archive" aria-labelledby="archive-heading">
    <div class="editorial-label"><p>Archive</p></div>
    <div class="editorial-content">
      <h2 id="archive-heading">Earlier essays</h2>
      <ol class="blog-editorial-archive">
        {% for post in sorted_posts offset:6 %}
        <li>
          <time datetime="{{ post.date | date_to_xmlschema }}">{{ post.date | date: "%b %Y" }}</time>
          <a href="{{ post.url | relative_url }}">{{ post.title }}</a>
        </li>
        {% endfor %}
      </ol>
    </div>
  </section>
  {% endif %}
</div>
