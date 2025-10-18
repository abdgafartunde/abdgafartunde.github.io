---
layout: page
title: Blog
permalink: /blog/
---

{% if site.posts and site.posts.size > 0 %}
<ul class="list">
  {% assign grouped = site.posts | group_by_exp:"p","p.date | date: '%Y'" %}
  {% for year in grouped %}
    <li>
      <h3>{{ year.name }}</h3>
      <ul>
        {% for post in year.items %}
          <li>
            <a href="{{ post.url | relative_url }}">{{ post.title }}</a>
            <span class="meta"> · {{ post.date | date: "%b %-d" }}</span>
          </li>
        {% endfor %}
      </ul>
    </li>
  {% endfor %}
</ul>
{% else %}
<p class="meta">No posts yet. Add Markdown files under <code>_posts/</code> named like <code>YYYY-MM-DD-title.md</code>.</p>
{% endif %}
