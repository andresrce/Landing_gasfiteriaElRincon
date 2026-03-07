const menuBtn = document.querySelector(".menu-toggle");
const menu = document.querySelector("nav ul");

if (menuBtn && menu) {
  menuBtn.addEventListener("click", () => {
    menu.classList.toggle("open");
  });
}

const SITE_CONFIG = {
  phone: "+56947809668",
  displayPhone: "+56 9 4780 9668",
  whatsapp: "56947809668",
  email: "matias.crooker10@gmail.com",
  brand: "Gasfiteria El Rincón"
};

function toWhatsappMessage(formData) {
  const raw = [
    `Hola, necesito cotizacion con ${SITE_CONFIG.brand}`,
    `Nombre: ${formData.get("nombre") || "No indicado"}`,
    `Comuna: ${formData.get("comuna") || "No indicada"}`,
    `Servicio: ${formData.get("servicio") || "No indicado"}`,
    `Mensaje: ${formData.get("mensaje") || "No indicado"}`
  ].join("\n");

  return `https://wa.me/${SITE_CONFIG.whatsapp}?text=${encodeURIComponent(raw)}`;
}

const quickForms = document.querySelectorAll("[data-whatsapp-form]");
quickForms.forEach((form) => {
  form.addEventListener("submit", (e) => {
    const intent = form.querySelector("input[name='canal']:checked")?.value;
    if (intent === "whatsapp") {
      e.preventDefault();
      const data = new FormData(form);
      window.open(toWhatsappMessage(data), "_blank");
    }
  });
});

const dynamicPhone = document.querySelectorAll("[data-phone]");
dynamicPhone.forEach((item) => {
  item.textContent = SITE_CONFIG.displayPhone;
  if (item.tagName.toLowerCase() === "a") {
    item.href = `tel:${SITE_CONFIG.phone}`;
  }
});

const dynamicMail = document.querySelectorAll("[data-mail]");
dynamicMail.forEach((item) => {
  item.textContent = SITE_CONFIG.email;
  if (item.tagName.toLowerCase() === "a") {
    item.href = `mailto:${SITE_CONFIG.email}`;
  }
});

const dynamicWa = document.querySelectorAll("[data-wa]");
dynamicWa.forEach((item) => {
  item.href = `https://wa.me/${SITE_CONFIG.whatsapp}`;
});
