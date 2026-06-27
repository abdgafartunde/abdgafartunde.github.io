---
layout: page
title: "Book a Call"
description: "Free 20–30 minute intro conversation. No obligation."
seo_description: "Book a free 20–30 minute intro call with A.T. Tiamiyu to discuss research mentorship, coursework tutoring, consulting, or workshops in inverse problems and scientific machine learning."
---

<section class="exp-section">
<div class="about-text">
<p>This is a free, 20–30 minute intro conversation. There is no obligation, and no pitch. If ongoing work makes sense after we talk, we will sort out the arrangement by email.</p>
<p>One request: if you need to cancel, reschedule rather than no-show. 24 hours' notice is enough.</p>
</div>
</section>

<section class="exp-section">
<h2 class="section-heading"><i class="fas fa-align-left"></i> Before You Schedule</h2>

<div class="about-text">
<p>Tell me a bit about what you are looking for. This helps me come to the call prepared rather than spending the first ten minutes on context-setting.</p>
</div>

<div id="calendly-intake" style="max-width:600px;">
  <form id="intake-form" onsubmit="launchCalendly(event)" novalidate>

    <div style="margin-bottom:1.2rem;">
      <label for="calendly-reason" style="display:block;font-weight:600;margin-bottom:0.4rem;">
        What brings you here? <span aria-hidden="true" style="color:#c0392b;">*</span>
      </label>
      <select id="calendly-reason" name="reason" required
        style="width:100%;padding:0.5rem 0.6rem;border:1px solid #ccc;border-radius:4px;font-size:1rem;">
        <option value="">Select one...</option>
        <option value="Mentorship">Mentorship</option>
        <option value="Coursework tutoring">Coursework tutoring</option>
        <option value="Team training or workshop">Team training or workshop</option>
        <option value="Consulting inquiry">Consulting inquiry</option>
        <option value="Other">Other</option>
      </select>
    </div>

    <div style="margin-bottom:1.2rem;">
      <label for="calendly-context" style="display:block;font-weight:600;margin-bottom:0.4rem;">
        What would you like to discuss? <span aria-hidden="true" style="color:#c0392b;">*</span>
      </label>
      <textarea id="calendly-context" name="context" rows="4" required
        placeholder="A few sentences is enough: the topic, where you are in your work, and what you are hoping to get out of the conversation."
        style="width:100%;padding:0.5rem 0.6rem;border:1px solid #ccc;border-radius:4px;font-size:1rem;resize:vertical;box-sizing:border-box;"></textarea>
      <p id="context-error" style="color:#c0392b;font-size:0.875rem;margin-top:0.25rem;display:none;">
        Please describe what you would like to discuss.
      </p>
    </div>

    <button type="submit"
      style="padding:0.6rem 1.4rem;background:#2563eb;color:#fff;border:none;border-radius:4px;font-size:1rem;font-weight:600;cursor:pointer;">
      Continue to scheduling &rarr;
    </button>

  </form>
</div>

<div id="calendly-widget"
  style="min-width:320px;height:700px;display:none;">
</div>

<script>
function launchCalendly(e) {
  e.preventDefault();

  var reasonEl  = document.getElementById('calendly-reason');
  var contextEl = document.getElementById('calendly-context');
  var errorEl   = document.getElementById('context-error');
  var context   = contextEl.value.trim();
  var reason    = reasonEl.value;

  // Reset validation state
  errorEl.style.display = 'none';
  contextEl.style.borderColor = '#ccc';

  if (!reason) {
    reasonEl.reportValidity();
    return;
  }

  if (!context) {
    errorEl.style.display = 'block';
    contextEl.style.borderColor = '#c0392b';
    contextEl.focus();
    return;
  }

  var url = 'https://calendly.com/abdgafartunde/30min'
    + '?a1=' + encodeURIComponent(reason)
    + '&a2=' + encodeURIComponent(context);

  var widgetEl = document.getElementById('calendly-widget');
  document.getElementById('calendly-intake').style.display = 'none';
  widgetEl.style.display = 'block';
  widgetEl.scrollIntoView({ behavior: 'smooth' });

  if (window.Calendly && typeof window.Calendly.initInlineWidget === 'function') {
    window.Calendly.initInlineWidget({ url: url, parentElement: widgetEl });
  } else {
    var script = document.createElement('script');
    script.src = 'https://assets.calendly.com/assets/external/widget.js';
    script.onload = function () {
      window.Calendly.initInlineWidget({ url: url, parentElement: widgetEl });
    };
    document.head.appendChild(script);
  }
}
</script>

</section>

<section class="exp-section">
<div class="about-text">
<p>After we talk, I will follow up by email with next steps.</p>
</div>
</section>
