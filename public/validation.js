/**
 * Validación de formulario — Preregistro Kiosco
 * Solo lógica de validación. Vanilla JS ES6+.
 */
(function () {
  const FORM_SELECTOR = "form[data-cta-container]";
  const SUBMIT_BTN_SELECTOR = "[data-cta-submit]";
  const ERROR_MSG_CLASS = "validation-error-msg";

  const messages = {
    nombre: "Ingresa tu nombre completo (solo letras)",
    instagram: "Ingresa un usuario de Instagram válido (ej: @elkiosco)",
    telefono: "Ingresa un número de teléfono válido (solo dígitos, mín. 7)",
    email: "Ingresa un correo electrónico válido (ej: nombre@correo.com)",
    ciudad: "Ingresa el nombre de tu ciudad (solo letras)",
    talla: "Selecciona o ingresa tu talla (ej: S, M, L, XL)",
  };

  const fieldOrder = ["nombre", "instagram", "email", "telefono", "talla", "ciudad"];

  function getForm() {
    return document.querySelector(FORM_SELECTOR);
  }

  function getErrorSpan(field) {
    const wrap = field.closest("div");
    if (!wrap) return null;
    let span = wrap.querySelector("." + ERROR_MSG_CLASS);
    if (!span) {
      span = document.createElement("span");
      span.className = ERROR_MSG_CLASS + " hidden";
      span.setAttribute("role", "alert");
      field.parentNode.insertBefore(span, field.nextSibling);
    }
    return span;
  }

  function showError(field, message) {
    const span = getErrorSpan(field);
    if (span) {
      span.textContent = message;
      span.classList.remove("hidden");
    }
  }

  function clearError(field) {
    const span = getErrorSpan(field);
    if (span) {
      span.textContent = "";
      span.classList.add("hidden");
    }
  }

  function validateNombre(value) {
    const v = (value || "").trim();
    if (v.length === 0) return false;
    if (v.length < 2 || v.length > 50) return false;
    return /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/.test(v);
  }

  function validateInstagram(value) {
    let v = (value || "").trim();
    if (v.length === 0) return false;
    if (v.startsWith("@")) v = v.slice(1);
    if (v.length === 0 || v.length > 30) return false;
    if (/\s/.test(v)) return false;
    return /^[a-zA-Z0-9._]+$/.test(v);
  }

  function validateTelefono(value) {
    const v = (value || "").replace(/\s/g, "").replace(/-/g, "");
    if (v.length === 0) return false;
    const digits = v.replace(/^\+/, "");
    if (!/^\d+$/.test(digits)) return false;
    return digits.length >= 7 && digits.length <= 15;
  }

  function validateEmail(value) {
    const v = (value || "").trim();
    if (v.length === 0) return false;
    if (/\s/.test(v)) return false;
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
  }

  function validateCiudad(value) {
    const v = (value || "").trim();
    if (v.length === 0) return false;
    if (v.length < 2 || v.length > 50) return false;
    return /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/.test(v);
  }

  function validateTalla(field) {
    if (field.tagName === "SELECT") {
      const val = (field.value || "").trim();
      return val.length > 0;
    }
    const val = (field.value || "").trim().toUpperCase();
    if (val.length === 0) return false;
    const sizes = ["XS", "S", "M", "L", "XL", "XXL"];
    if (sizes.includes(val)) return true;
    return /^\d{2,3}$/.test(val);
  }

  function runFieldValidation(fieldName, field) {
    const raw = field.value;
    let valid = false;
    switch (fieldName) {
      case "nombre":
        valid = validateNombre(raw);
        break;
      case "instagram":
        valid = validateInstagram(raw);
        break;
      case "telefono":
        valid = validateTelefono(raw);
        break;
      case "email":
        valid = validateEmail(raw);
        break;
      case "ciudad":
        valid = validateCiudad(raw);
        break;
      case "talla":
        valid = validateTalla(field);
        break;
      default:
        valid = true;
    }
    if (valid) {
      clearError(field);
      return true;
    }
    showError(field, messages[fieldName]);
    return false;
  }

  function ensureInstagramAt(field) {
    let v = (field.value || "").trim();
    if (v.length > 0 && !v.startsWith("@")) {
      field.value = "@" + v;
    }
  }

  function validateForm(form) {
    let firstInvalid = null;
    for (const name of fieldOrder) {
      const field = form.querySelector('[name="' + name + '"]');
      if (!field) continue;
      const ok = runFieldValidation(name, field);
      if (!ok && !firstInvalid) firstInvalid = field;
    }
    return firstInvalid;
  }

  function init() {
    const form = getForm();
    if (!form) return;

    const submitBtn = form.querySelector(SUBMIT_BTN_SELECTOR);
    if (submitBtn) {
      submitBtn.addEventListener(
        "click",
        function (e) {
          const firstInvalid = validateForm(form);
          if (firstInvalid) {
            e.preventDefault();
            e.stopPropagation();
            firstInvalid.scrollIntoView({ behavior: "smooth", block: "center" });
            firstInvalid.focus();
          }
        },
        true
      );
    }

    fieldOrder.forEach(function (name) {
      const field = form.querySelector('[name="' + name + '"]');
      if (!field) return;

      field.addEventListener("blur", function () {
        if (name === "instagram") ensureInstagramAt(field);
        runFieldValidation(name, field);
      });
    });

    form.addEventListener("submit", function (e) {
      const firstInvalid = validateForm(form);
      if (firstInvalid) {
        e.preventDefault();
        firstInvalid.scrollIntoView({ behavior: "smooth", block: "center" });
        firstInvalid.focus();
      }
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
