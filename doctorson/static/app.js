(function () {
  "use strict";

  function formatStamp(tz) {
    var now = new Date();
    try {
      var fmt = new Intl.DateTimeFormat("en-GB", {
        weekday: "short",
        day: "2-digit",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
        timeZone: tz || undefined
      });
      return "Live · " + fmt.format(now) + (tz ? " (" + tz + ")" : "");
    } catch (_e) {
      return "Live · " + now.toLocaleTimeString();
    }
  }

  function setOnline(dot, stamp, tz) {
    if (dot) dot.classList.remove("stale");
    if (stamp) {
      stamp.classList.remove("stale");
      stamp.textContent = formatStamp(tz || stamp.dataset.tz || "");
    }
  }

  function setOffline(dot, stamp) {
    if (dot) dot.classList.add("stale");
    if (stamp) {
      stamp.classList.add("stale");
      stamp.textContent = "Offline - retrying...";
    }
  }

  document.addEventListener("DOMContentLoaded", function () {
    // 1. Safe confirmation prompts via data-confirm
    document.addEventListener("submit", function (e) {
      var form = e.target;
      if (form && form.dataset && form.dataset.confirm) {
        if (!window.confirm(form.dataset.confirm)) {
          e.preventDefault();
        }
      }
    });

    // 2. Auto-submit filter dropdowns and checkboxes
    var filterForms = document.querySelectorAll("form[data-auto-submit]");
    filterForms.forEach(function (form) {
      form.addEventListener("change", function (e) {
        if (e.target && (e.target.tagName === "SELECT" || e.target.type === "checkbox")) {
          form.submit();
        }
      });
    });

    var dot = document.querySelector(".live-bar .dot");
    var stamp = document.getElementById("live-stamp");

    // 3. Live polling for main doctor list or SOS emergency list
    var liveContainer = document.querySelector("[data-live-url]");
    if (liveContainer) {
      var liveUrl = liveContainer.dataset.liveUrl;
      var intervalMs = parseInt(liveContainer.dataset.liveInterval || "30000", 10);

      window.setInterval(function () {
        if (document.hidden) return;
        fetch(liveUrl + window.location.search, { headers: { "X-Requested-With": "fetch" } })
          .then(function (resp) {
            if (!resp.ok) throw new Error("HTTP " + resp.status);
            return resp.text();
          })
          .then(function (html) {
            liveContainer.innerHTML = html;
            setOnline(dot, stamp);
          })
          .catch(function () {
            setOffline(dot, stamp);
          });
      }, intervalMs);
    }

    // 4. Live polling on individual doctor profile page
    var profile = document.querySelector("section.profile[data-doctor-id]");
    if (profile) {
      var doctorId = profile.dataset.doctorId;
      var badge = document.getElementById("status-badge");
      var detail = document.getElementById("status-detail");

      window.setInterval(function () {
        if (document.hidden) return;
        fetch("/api/doctors/" + encodeURIComponent(doctorId))
          .then(function (resp) {
            if (!resp.ok) throw new Error("HTTP " + resp.status);
            return resp.json();
          })
          .then(function (payload) {
            if (!payload || !payload.doctor) return;
            var d = payload.doctor;
            if (badge) {
              badge.className = "badge " + d.status;
              badge.textContent = d.status_label;
            }
            if (detail) {
              detail.textContent = d.status_detail || "";
            }
            setOnline(dot, stamp);
          })
          .catch(function () {
            setOffline(dot, stamp);
          });
      }, 30000);
    }
  });
})();
