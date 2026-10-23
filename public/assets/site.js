/* Cuprice MCP server landing page: copy buttons, tool tabs, section index and
   the live console. No dependencies; the page reads fine without it. */
(function () {
  "use strict";

  var PUBLIC_ENDPOINT = "https://mcp.cuprice.io/mcp";
  var reducedMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function $(sel, root) { return (root || document).querySelector(sel); }
  function $$(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }

  function escapeHtml(s) {
    return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }

  /* ---------- Syntax colouring (JSON, bash, HTML) ---------- */

  function highlightJson(text) {
    var re = /("(?:\\u[a-fA-F0-9]{4}|\\[^u]|[^\\"])*")(\s*:)?|\b(true|false|null)\b|(-?\d+(?:\.\d+)?(?:[eE][+\-]?\d+)?)|([{}\[\],:])/g;
    var out = "", last = 0, m;
    while ((m = re.exec(text))) {
      out += escapeHtml(text.slice(last, m.index));
      if (m[1]) {
        out += m[2]
          ? '<span class="t-key">' + escapeHtml(m[1]) + '</span><span class="t-punc">' + escapeHtml(m[2]) + "</span>"
          : '<span class="t-str">' + escapeHtml(m[1]) + "</span>";
      } else if (m[3]) {
        out += '<span class="t-lit">' + m[3] + "</span>";
      } else if (m[4]) {
        out += '<span class="t-num">' + m[4] + "</span>";
      } else {
        out += '<span class="t-punc">' + escapeHtml(m[5]) + "</span>";
      }
      last = re.lastIndex;
    }
    return out + escapeHtml(text.slice(last));
  }

  function highlightBash(text) {
    return text.split("\n").map(function (line) {
      var comment = "";
      var hash = line.search(/(^|\s)#/);
      if (hash !== -1) {
        var at = line.indexOf("#", hash);
        comment = '<span class="t-com">' + escapeHtml(line.slice(at)) + "</span>";
        line = line.slice(0, at);
      }
      var first = true;
      var body = line.split(/(\s+)/).map(function (part) {
        if (!part || /^\s+$/.test(part)) return escapeHtml(part);
        if (first) { first = false; return '<span class="t-cmd">' + escapeHtml(part) + "</span>"; }
        if (/^--?[a-z]/i.test(part)) return '<span class="t-flag">' + escapeHtml(part) + "</span>";
        return escapeHtml(part);
      }).join("");
      return body + comment;
    }).join("\n");
  }

  function highlightHtml(text) {
    var re = /(<!--[\s\S]*?-->)|(<\/?[A-Za-z][\w-]*)|("[^"]*")|(\/?>)/g;
    var out = "", last = 0, m;
    while ((m = re.exec(text))) {
      out += '<span class="t-attr">' + escapeHtml(text.slice(last, m.index)) + "</span>";
      if (m[1]) out += '<span class="t-com">' + escapeHtml(m[1]) + "</span>";
      else if (m[2] || m[4]) out += '<span class="t-tag">' + escapeHtml(m[2] || m[4]) + "</span>";
      else out += '<span class="t-str">' + escapeHtml(m[3]) + "</span>";
      last = re.lastIndex;
    }
    return out + '<span class="t-attr">' + escapeHtml(text.slice(last)) + "</span>";
  }

  var HIGHLIGHT = { json: highlightJson, bash: highlightBash, html: highlightHtml };

  function paint(pre) {
    var fn = HIGHLIGHT[pre.getAttribute("data-lang")];
    if (fn) pre.innerHTML = fn(pre.textContent);
  }

  $$("pre[data-lang]").forEach(paint);

  /* ---------- Copy ---------- */

  var toast = $("[data-toast]");
  var toastTimer;

  function say(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add("is-visible");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toast.classList.remove("is-visible"); }, 1800);
  }

  function writeClipboard(text) {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(text);
    }
    return new Promise(function (resolve, reject) {
      var ta = document.createElement("textarea");
      ta.value = text;
      ta.setAttribute("readonly", "");
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand("copy") ? resolve() : reject(new Error("copy failed")); }
      catch (err) { reject(err); }
      finally { document.body.removeChild(ta); }
    });
  }

  function flashCopied(button) {
    var label = $(".btn__label", button);
    var use = $("use", button);
    var original = button.getAttribute("data-copy-label") || (label && label.textContent) || "";
    button.classList.add("is-copied");
    if (label) label.textContent = "Copied";
    if (use) use.setAttribute("href", "#i-check");
    clearTimeout(button._copyTimer);
    button._copyTimer = setTimeout(function () {
      button.classList.remove("is-copied");
      if (label) label.textContent = original;
      if (use) use.setAttribute("href", "#i-copy");
    }, 1800);
  }

  function copyFrom(button, text) {
    writeClipboard(text).then(function () {
      flashCopied(button);
      say("Copied to clipboard");
    }, function () {
      say("Copy did not work. Select the text and copy it by hand.");
    });
  }

  document.addEventListener("click", function (event) {
    var button = event.target.closest("[data-copy], [data-copy-target]");
    if (!button) return;
    var text = button.getAttribute("data-copy");
    if (text == null) {
      var target = document.getElementById(button.getAttribute("data-copy-target"));
      text = target ? target.textContent.replace(/\s+$/, "") : "";
      if (target && target.tagName !== "PRE") text = text.replace(/\s+/g, " ").trim();
    }
    if (text) copyFrom(button, text);
  });

  /* ---------- Tool tabs ---------- */

  var tabsRoot = $("[data-tabs]");
  var tabs = tabsRoot ? $$('[role="tab"]', tabsRoot) : [];
  var CLIENT_IDS = tabs.map(function (t) { return t.getAttribute("aria-controls"); });

  function selectTab(id, opts) {
    opts = opts || {};
    tabs.forEach(function (tab) {
      var on = tab.getAttribute("aria-controls") === id;
      tab.setAttribute("aria-selected", on ? "true" : "false");
      tab.tabIndex = on ? 0 : -1;
      var panel = document.getElementById(tab.getAttribute("aria-controls"));
      if (!panel) return;
      if (on) {
        var wasHidden = panel.hidden;
        panel.hidden = false;
        if (wasHidden && !reducedMotion) {
          panel.classList.remove("is-entering");
          void panel.offsetWidth;
          panel.classList.add("is-entering");
        }
        if (opts.focus) tab.focus();
      } else {
        panel.hidden = true;
      }
    });
    if (opts.updateHash) history.replaceState(null, "", "#" + id);
    markSubLinks();
  }

  tabs.forEach(function (tab, i) {
    tab.addEventListener("click", function () {
      selectTab(tab.getAttribute("aria-controls"), { updateHash: true });
    });
    tab.addEventListener("keydown", function (event) {
      var next = null;
      if (event.key === "ArrowRight") next = tabs[(i + 1) % tabs.length];
      else if (event.key === "ArrowLeft") next = tabs[(i - 1 + tabs.length) % tabs.length];
      else if (event.key === "Home") next = tabs[0];
      else if (event.key === "End") next = tabs[tabs.length - 1];
      if (next) {
        event.preventDefault();
        selectTab(next.getAttribute("aria-controls"), { focus: true, updateHash: true });
      }
    });
  });

  /* ---------- Section index ---------- */

  var indexLinks = $$(".toc__link, .pagenav a");
  var currentSection = "top";
  var currentTool = null;

  function setCurrent() {
    indexLinks.forEach(function (link) {
      var id = (link.getAttribute("href") || "").slice(1);
      var on = id === currentSection;
      if (link.classList.contains("toc__link--sub")) {
        on = false;
        if (currentSection === "connect") {
          var sel = tabs.filter(function (t) { return t.getAttribute("aria-selected") === "true"; })[0];
          on = !!sel && sel.getAttribute("aria-controls") === id;
        } else if (currentSection === "tools") {
          on = id === currentTool;
        }
      }
      if (on) link.setAttribute("aria-current", "true");
      else link.removeAttribute("aria-current");
    });
    var active = $('.pagenav a[aria-current="true"]');
    if (active && active.scrollIntoView && window.matchMedia("(max-width: 980px)").matches) {
      var nav = active.parentNode;
      var left = active.offsetLeft - (nav.clientWidth - active.offsetWidth) / 2;
      nav.scrollTo({ left: Math.max(0, left), behavior: reducedMotion ? "auto" : "smooth" });
    }
  }
  function markSubLinks() { setCurrent(); }

  if ("IntersectionObserver" in window) {
    var visible = {};
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { visible[e.target.id] = e.isIntersecting; });
      var sections = $$("[data-spy]");
      for (var i = 0; i < sections.length; i++) {
        if (visible[sections[i].id]) { currentSection = sections[i].id; break; }
      }
      setCurrent();
    }, { rootMargin: "-30% 0px -60% 0px" });
    $$("[data-spy]").forEach(function (s) { spy.observe(s); });

    var toolSpy = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) currentTool = e.target.id; });
      setCurrent();
    }, { rootMargin: "-30% 0px -60% 0px" });
    $$(".tool").forEach(function (t) { toolSpy.observe(t); });
  }

  /* ---------- Live console ---------- */

  var consoleEl = $("[data-console]");
  var form = $("[data-console-form]");
  var hint = $("[data-hint]");
  var requestPre = $("[data-request]");
  var responseEl = $("[data-response]");
  var readout = $("[data-readout]");
  var runButton = $("[data-run]");
  var shareInput = $("#arg-share");

  var TOOLS = {
    "tools/list": { args: [], hint: "Lists the tools this server gives your assistant. No input needed." },
    "get-pricing": { args: ["shareId"], hint: "Reads the plans, features and theme of a published project. Use your own Share ID; an unknown one comes back as the API's error, the same way your assistant would see it." },
    "get-embed-code": { args: ["shareId", "framework", "widget"], hint: "Writes the embed snippet for your framework. It is built from the Share ID you type, so you can try it with any value." },
    "get-css-classes": { args: [], hint: "Lists the class names on the widget, for styling it from your own CSS. No input needed." }
  };

  var currentCall = "tools/list";
  var requestId = 0;
  var hasRun = false;
  var running = false;

  function checkedValue(name) {
    var input = form && form.querySelector('input[name="' + name + '"]:checked');
    return input ? input.value : undefined;
  }

  function buildRequest(id) {
    if (currentCall === "tools/list") {
      return { jsonrpc: "2.0", id: id, method: "tools/list" };
    }
    var args = {};
    TOOLS[currentCall].args.forEach(function (name) {
      if (name === "shareId") args.shareId = (shareInput.value || "").trim();
      else args[name] = checkedValue(name);
    });
    return { jsonrpc: "2.0", id: id, method: "tools/call", params: { name: currentCall, arguments: args } };
  }

  function renderRequest() {
    if (!requestPre) return;
    requestPre.textContent = JSON.stringify(buildRequest(requestId + 1), null, 2);
    paint(requestPre);
  }

  function clearShareError() {
    shareInput.removeAttribute("aria-invalid");
    shareInput.removeAttribute("aria-describedby");
    var err = $("#arg-share-error");
    if (err) err.remove();
  }

  function selectCall(name, opts) {
    if (!TOOLS[name]) return;
    currentCall = name;
    $$(".ctool", consoleEl).forEach(function (b) {
      var on = b.getAttribute("data-tool") === name;
      b.setAttribute("aria-checked", on ? "true" : "false");
      b.tabIndex = on ? 0 : -1;
    });
    hint.textContent = TOOLS[name].hint;
    $$("[data-arg]", form).forEach(function (field) {
      field.hidden = TOOLS[name].args.indexOf(field.getAttribute("data-arg")) === -1;
    });
    form.classList.toggle("has-args", TOOLS[name].args.length > 0);
    clearShareError();
    renderRequest();
    if (opts && opts.focus) {
      var btn = $('.ctool[data-tool="' + name + '"]', consoleEl);
      if (btn) btn.focus();
    }
  }

  function formatSize(bytes) {
    return bytes < 1024 ? bytes + " B" : (bytes / 1024).toFixed(1) + " KB";
  }

  function parseBody(text, contentType) {
    if (contentType && contentType.indexOf("text/event-stream") !== -1) {
      var data = text.split(/\r?\n/).filter(function (l) { return l.indexOf("data:") === 0; })
        .map(function (l) { return l.slice(5).replace(/^ /, ""); }).join("\n");
      return JSON.parse(data);
    }
    return JSON.parse(text);
  }

  function block(label, html, extraClass) {
    return (label ? '<p class="pane__label">' + escapeHtml(label) + "</p>" : "") +
      '<pre class="' + (extraClass || "") + '">' + html + "</pre>";
  }

  function showResponse(html, raw) {
    responseEl.innerHTML = html +
      (raw ? '<details class="raw"><summary>Raw response</summary><pre>' + escapeHtml(raw) + "</pre></details>" : "");
    if (!reducedMotion) {
      responseEl.classList.remove("reveal");
      void responseEl.offsetWidth;
      responseEl.classList.add("reveal");
    }
  }

  function setReadout(status, httpOk, result, resultOk, ms, bytes) {
    readout.hidden = false;
    var s = $("[data-r-status]", readout);
    s.textContent = status;
    s.className = httpOk ? "is-ok" : "is-bad";
    var r = $("[data-r-result]", readout);
    r.textContent = result;
    r.className = resultOk ? "is-ok" : "is-bad";
    $("[data-r-time]", readout).textContent = ms == null ? "n/a" : Math.round(ms) + " ms";
    $("[data-r-size]", readout).textContent = bytes == null ? "n/a" : formatSize(bytes);
  }

  function renderResult(payload, raw) {
    if (payload.error) {
      showResponse('<p class="pane__alert">The server answered with a JSON-RPC error: ' + escapeHtml(payload.error.message || "unknown error") + "</p>" +
        block("error", highlightJson(JSON.stringify(payload.error, null, 2))), raw);
      return "rpc error";
    }
    var result = payload.result || {};
    if (currentCall === "tools/list") {
      var tools = result.tools || [];
      var retired = tools.filter(function (t) {
        return t.name === "get-receipt" || /^\[deprecated\]/i.test(t.description || "");
      });
      var active = tools.length - retired.length;
      var label = "result, " + active + (active === 1 ? " tool" : " tools");
      if (retired.length) {
        label += ", plus " + retired.map(function (t) { return t.name; }).join(", ") +
          " (deprecated, kept so older setups do not break)";
      }
      showResponse(block(label, highlightJson(JSON.stringify(result, null, 2))), raw);
      return "ok";
    }
    var text = (result.content && result.content[0] && result.content[0].text) || "";
    var alert = result.isError
      ? '<p class="pane__alert">The tool returned an error. This is what your assistant would read:</p>'
      : "";
    var parsed = null;
    try { parsed = JSON.parse(text); } catch (e) { parsed = null; }
    if (parsed !== null && typeof parsed === "object") {
      showResponse(alert + block("result.content[0].text, as JSON", highlightJson(JSON.stringify(parsed, null, 2))), raw);
    } else {
      var fw = checkedValue("framework");
      var html = currentCall === "get-embed-code" && (fw === "html" || fw === "vue") && !result.isError
        ? highlightHtml(text) : escapeHtml(text);
      showResponse(alert + block("result.content[0].text", html), raw);
    }
    return result.isError ? "tool error" : "ok";
  }

  function run() {
    if (running) return;
    var needsShare = TOOLS[currentCall].args.indexOf("shareId") !== -1;
    if (needsShare && !(shareInput.value || "").trim()) {
      shareInput.setAttribute("aria-invalid", "true");
      shareInput.setAttribute("aria-describedby", "arg-share-error");
      if (!$("#arg-share-error")) {
        var err = document.createElement("p");
        err.id = "arg-share-error";
        err.className = "field__error";
        err.textContent = "Type a Share ID first. It is the last part of your share link.";
        shareInput.parentNode.appendChild(err);
      }
      shareInput.focus();
      return;
    }

    requestId += 1;
    var body = buildRequest(requestId);
    requestPre.textContent = JSON.stringify(body, null, 2);
    paint(requestPre);

    running = true;
    hasRun = true;
    runButton.setAttribute("aria-busy", "true");
    $(".btn__label", runButton).textContent = "Running";
    consoleEl.classList.remove("is-arrived");
    consoleEl.classList.add("is-sending");
    readout.hidden = true;
    responseEl.innerHTML = '<p class="pane__empty">Waiting for the server…</p>';

    var started = performance.now();
    fetch("/mcp", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Accept": "application/json, text/event-stream" },
      body: JSON.stringify(body)
    }).then(function (res) {
      return res.text().then(function (text) {
        var ms = performance.now() - started;
        var bytes = new Blob([text]).size;
        if (!res.ok) {
          setReadout(String(res.status), false, "failed", false, ms, bytes);
          showResponse('<p class="pane__alert">The server answered with HTTP ' + res.status + ".</p>" + block("body", escapeHtml(text || "(empty)")), null);
          return;
        }
        var payload;
        try { payload = parseBody(text, res.headers.get("content-type")); }
        catch (e) {
          setReadout(String(res.status), true, "unreadable", false, ms, bytes);
          showResponse('<p class="pane__alert">The answer could not be read as JSON.</p>', text);
          return;
        }
        var outcome = renderResult(payload, text);
        setReadout(String(res.status), true, outcome, outcome === "ok", ms, bytes);
      });
    }).catch(function () {
      setReadout("none", false, "no answer", false, null, null);
      showResponse('<p class="pane__alert">Could not reach the server. Check your connection and run the call again.</p>', null);
    }).then(function () {
      running = false;
      runButton.removeAttribute("aria-busy");
      $(".btn__label", runButton).textContent = "Run call";
      consoleEl.classList.remove("is-sending");
      if (!reducedMotion) {
        void consoleEl.offsetWidth;
        consoleEl.classList.add("is-arrived");
      }
    });
  }

  function curlCommand() {
    var payload = JSON.stringify(buildRequest(requestId || 1)).replace(/'/g, "'\\''");
    var endpoint = location.protocol.indexOf("http") === 0 && location.host !== "mcp.cuprice.io"
      ? location.origin + "/mcp" : PUBLIC_ENDPOINT;
    return "curl -X POST " + endpoint + " \\\n" +
      "  -H 'Content-Type: application/json' \\\n" +
      "  -H 'Accept: application/json, text/event-stream' \\\n" +
      "  -d '" + payload + "'";
  }

  if (consoleEl && form) {
    var callButtons = $$(".ctool", consoleEl);
    callButtons.forEach(function (b, i) {
      b.tabIndex = b.getAttribute("aria-checked") === "true" ? 0 : -1;
      b.addEventListener("click", function () { selectCall(b.getAttribute("data-tool")); });
      b.addEventListener("keydown", function (event) {
        var next = null;
        if (event.key === "ArrowRight" || event.key === "ArrowDown") next = callButtons[(i + 1) % callButtons.length];
        else if (event.key === "ArrowLeft" || event.key === "ArrowUp") next = callButtons[(i - 1 + callButtons.length) % callButtons.length];
        if (next) { event.preventDefault(); selectCall(next.getAttribute("data-tool"), { focus: true }); }
      });
    });

    form.addEventListener("submit", function (event) { event.preventDefault(); run(); });
    form.addEventListener("input", function (event) {
      if (event.target === shareInput && shareInput.value.trim()) clearShareError();
      renderRequest();
    });
    form.addEventListener("change", renderRequest);

    var curlButton = $("[data-copy-curl]");
    if (curlButton) curlButton.addEventListener("click", function () { copyFrom(curlButton, curlCommand()); });

    if ("IntersectionObserver" in window) {
      var auto = new IntersectionObserver(function (entries) {
        if (entries.some(function (e) { return e.isIntersecting; })) {
          auto.disconnect();
          if (!hasRun && TOOLS[currentCall].args.length === 0) run();
        }
      }, { threshold: 0.35 });
      auto.observe(consoleEl);
    }
  }

  /* ---------- Deep links: #cursor, #claude-code, #try-get-pricing ---------- */

  function scrollToEl(el) {
    if (el) el.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth", block: "start" });
  }

  function route(hash, opts) {
    var id = (hash || "").replace(/^#/, "");
    if (!id) return false;
    if (CLIENT_IDS.indexOf(id) !== -1) {
      selectTab(id);
      if (!opts || opts.scroll !== false) scrollToEl(tabsRoot);
      return true;
    }
    if (id.indexOf("try-") === 0 && TOOLS[id.slice(4)]) {
      selectCall(id.slice(4));
      scrollToEl($("#try"));
      if (id.slice(4) !== "tools/list" && TOOLS[id.slice(4)].args.length && shareInput) {
        setTimeout(function () { shareInput.focus({ preventScroll: true }); }, reducedMotion ? 0 : 450);
      }
      return true;
    }
    return false;
  }

  document.addEventListener("click", function (event) {
    var link = event.target.closest('a[href^="#"]');
    if (!link || event.metaKey || event.ctrlKey || event.shiftKey) return;
    var hash = link.getAttribute("href");
    if (route(hash)) {
      event.preventDefault();
      history.pushState(null, "", hash);
    }
  });

  window.addEventListener("popstate", function () { route(location.hash); });

  if (location.hash) {
    // Wait a frame so fonts and layout settle before scrolling.
    requestAnimationFrame(function () { route(location.hash); });
  }

  renderRequest();
})();
