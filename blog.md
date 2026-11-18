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
    {% if site.posts.size > 0 %}<a href="#archive">Browse by topic</a>{% endif %}
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

      {% else %}
      <p class="blog-empty">No posts yet. New writing on computational mathematics and inverse problems will appear here.</p>
      {% endif %}
    </div>
  </section>

  {% if site.posts.size > 0 %}
  <section class="editorial-section blog-archive-section" id="archive" aria-labelledby="archive-heading">
    <div class="editorial-label"><p>Archive</p></div>
    <div class="editorial-content">
      <h2 id="archive-heading">Explore the writing</h2>
      <div class="blog-controls" id="blogControls" hidden>
        <div class="blog-search" role="search" aria-label="Search the blog">
          <label for="blogSearch">Search essays</label>
          <input id="blogSearch" type="search" placeholder="Title, topic or description" aria-controls="blogArchive" autocomplete="off">
        </div>
        <div class="blog-topic-filters" role="group" aria-label="Filter essays by topic">
          <button type="button" data-topic="all" aria-pressed="true" aria-controls="blogArchive">All topics</button>
          {% for topic in site.data.blog_topics %}
          <button type="button" data-topic="{{ topic.id }}" aria-pressed="false" aria-controls="blogArchive">{{ topic.title | escape }}</button>
          {% endfor %}
        </div>
        <p class="blog-result-count" id="blogResultCount" role="status" aria-live="polite" aria-atomic="true"></p>
      </div>
      <div class="blog-reading-list" id="blogArchive" aria-label="All essays">
        {% for post in sorted_posts %}
        {% capture post_topics %}{% for topic in site.data.blog_topics %}{% assign matches_topic = false %}{% for tag in topic.tags %}{% if post.tags contains tag %}{% assign matches_topic = true %}{% break %}{% endif %}{% endfor %}{% if matches_topic %}{{ topic.id }} {% endif %}{% endfor %}{% endcapture %}
        {% assign post_tags = post.tags | join: ' ' %}
        {% capture search_text %}{{ post.title }} {{ post.description }} {{ post_tags }}{% endcapture %}
        <article data-blog-entry data-topics="{{ post_topics | strip }}" data-search="{{ search_text | strip | escape }}">
          <time datetime="{{ post.date | date_to_xmlschema }}">{{ post.date | date: "%d %b %Y" }}</time>
          <div>
            <h3><a href="{{ post.url | relative_url }}">{{ post.title }}</a></h3>
            <p>{{ post.description }}</p>
            {% if post.tags.size > 0 %}<p class="blog-topic">{{ post.tags | first }}</p>{% endif %}
          </div>
        </article>
        {% endfor %}
      </div>
      <div class="blog-no-results" id="blogNoResults" hidden>
        <p>No essays match this search and topic.</p>
        <button type="button" id="blogReset">Clear filters</button>
      </div>
    </div>
  </section>
  {% endif %}
</div>
