(function () {
  // ---------------------------------------------------------------
  // cmm 9/24/26 
  // One rule per form. Add a line here for any future form.
  // "phone" and "texting" are the HTML ids of the fields on the page.
  // ---------------------------------------------------------------
  var RULES = [
    { name: "Account creation",   phone: "address1_telephone2",        texting: "w47_allowtexting" },
    { name: "Application",        phone: "datatel_address1_cellphone", texting: "w47_allowtexting" }
  ];

  var LOG = "[W47 Texting]";
  var MESSAGE = "Since you gave us a cell number, please answer this question.";

  function addStylesOnce() {
    if (document.getElementById("w47-texting-styles")) return;
    var style = document.createElement("style");
    style.id = "w47-texting-styles";
    style.textContent =
      ".w47-needs-answer { outline: 2px dashed #c00; outline-offset: 3px; border-radius: 2px; }" +
      ".w47-hint { color: #c00; font-size: 0.9em; margin-top: 4px; }";
    document.head.appendChild(style);
  }

  function setupRule(rule) {
    var cellphone = document.getElementById(rule.phone);
    var allowTexting = document.getElementById(rule.texting);

    if (!cellphone || !allowTexting) return false;       // this page hasn't loaded yet
    if (allowTexting.getAttribute("data-w47-wired")) return true; // page has loaded!
    allowTexting.setAttribute("data-w47-wired", "true");

    //console.log(LOG, "Wired up:", rule.name);
    addStylesOnce();

    // Create Asterisk on the label
    var label =
      document.querySelector('label[for="' + rule.texting + '"]') ||
      document.getElementById(rule.texting + "_label");
    if (!label) console.warn(LOG, "Label not found for", rule.texting);

    var marker = document.createElement("span");
    marker.textContent = " *";
    marker.setAttribute("aria-hidden", "true");
    marker.style.color = "#c00";
    marker.style.display = "none";
    if (label) label.appendChild(marker);

    // Message appears under field
    var hint = document.createElement("div");
    hint.id = rule.texting + "_w47hint";
    hint.className = "w47-hint";
    hint.textContent = MESSAGE;
    hint.style.display = "none";
    allowTexting.insertAdjacentElement("afterend", hint);

    function isAnswered() {
      var tag = allowTexting.tagName;
      if (tag === "SELECT" || (tag === "INPUT" && allowTexting.type !== "radio")) {
        return allowTexting.value !== "" && allowTexting.value !== "-1";
      }
      return !!allowTexting.querySelector("input:checked");
    }

    function sync() {
      var needed = cellphone.value.trim().length > 0;
      var showWarning = needed && !isAnswered();

      if (needed) {
        allowTexting.setAttribute("required", "required");
        allowTexting.setAttribute("aria-required", "true");
      } else {
        allowTexting.removeAttribute("required");
        allowTexting.removeAttribute("aria-required");
      }

      marker.style.display = needed ? "inline" : "none";
      allowTexting.classList.toggle("w47-needs-answer", showWarning);
      hint.style.display = showWarning ? "block" : "none";
      if (showWarning) allowTexting.setAttribute("aria-describedby", hint.id);
      else allowTexting.removeAttribute("aria-describedby");
    }

    cellphone.addEventListener("input", sync);
    cellphone.addEventListener("change", sync);
    cellphone.addEventListener("blur", sync);
    allowTexting.addEventListener("change", sync);

    sync();
    setTimeout(sync, 1000); // catch a phone number pre-filled by the portal after load
    return true;
  }

  function setupAll() {
    var allDone = true;
    RULES.forEach(function (rule) {
      if (!setupRule(rule)) allDone = false;
    });
    return allDone;
  }

  function init() {
    //console.log(LOG, "LOADED");
    if (setupAll()) return;

    // Waiting in case the portal loads slower
    var observer = new MutationObserver(function () {
      if (setupAll()) observer.disconnect();
    });
    observer.observe(document.body, { childList: true, subtree: true });
    setTimeout(function () { observer.disconnect(); }, 30000);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
