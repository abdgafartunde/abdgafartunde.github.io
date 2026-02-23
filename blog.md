---
layout: page
title: "Blog"
description: "Thoughts on Mathematics, Research, and Academic Life"
---

<p class="blog-intro">Writing about the mathematics I work on, the tools I use, and the questions that interest me — from inverse problems and scientific computing to the broader role of mathematics in a changing research landscape.</p>

<div class="blog-posts">
{% assign sorted_posts = site.posts | sort: 'date' | reverse %}
{% for post in sorted_posts %}
<article class="blog-card {% if forloop.first %}blog-card-featured{% endif %}">
  <div class="blog-card-content">
    <div class="blog-card-date">
      <span class="date-day">{{ post.date | date: "%d" }}</span>
      <span class="date-month">{{ post.date | date: "%b %Y" }}</span>
    </div>
    <div class="blog-card-text">
      {% if forloop.first %}<span class="featured-label">Latest</span>{% endif %}
      <h3><a href="{{ post.url }}">{{ post.title }}</a></h3>
      <p class="post-excerpt">{{ post.description }}</p>
      <div class="blog-card-footer">
        {% if post.tags.size > 0 %}
        <div class="post-tags">
          {% for tag in post.tags limit:3 %}
          <span class="tag">{{ tag }}</span>
          {% endfor %}
        </div>
        {% endif %}
        <span class="read-time"><i class="far fa-clock"></i> {% assign words = post.content | number_of_words %}{% assign mins = words | divided_by: 200 %}{% if mins < 1 %}1{% else %}{{ mins }}{% endif %} min read</span>
      </div>
    </div>
  </div>
</article>
{% endfor %}
</div>

{% if site.posts.size == 0 %}
<p class="text-muted">No posts yet. Check back soon for updates on computational mathematics, inverse problems, and scientific computing.</p>
{% endif %}
