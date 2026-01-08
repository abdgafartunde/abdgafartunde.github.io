---
layout: page
title: "Blog"
description: "Thoughts on Mathematics, Research, and Academic Life"
---

<div class="blog-posts">
{% assign sorted_posts = site.posts | sort: 'date' | reverse %}
{% for post in sorted_posts %}
<article class="blog-post-preview">
  <h3><a href="{{ post.url }}">{{ post.title }}</a></h3>
  <p class="post-meta">
    <i class="far fa-calendar-alt"></i> {{ post.date | date: "%B %d, %Y" }}
    {% if post.tags.size > 0 %}
    <span class="post-tags">
      {% for tag in post.tags limit:3 %}
      <span class="tag">{{ tag }}</span>
      {% endfor %}
    </span>
    {% endif %}
  </p>
  <p class="post-description">{{ post.description }}</p>
</article>
{% endfor %}
</div>

{% if site.posts.size == 0 %}
<p class="text-muted">No posts yet. Check back soon for updates on computational mathematics, inverse problems, and scientific computing.</p>
{% endif %}
