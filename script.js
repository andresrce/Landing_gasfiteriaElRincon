const menuBtn = document.querySelector(".menu-toggle");
const menu = document.querySelector("nav ul");
const isServicePage = window.location.pathname.includes("/servicios/");
const assetBase = isServicePage ? "../" : "";

if (menuBtn && menu) {
  menuBtn.addEventListener("click", () => {
    menu.classList.toggle("open");
  });
}

const SITE_CONFIG = {
  phone: "+56950411122",
  displayPhone: "+56 9 5041 1122",
  whatsapp: "56950411122",
  email: "contacto@gasfiteriaelrincon.cl",
  brand: "Gasfiteria El Rincón"
};

const FORM_TRACKING_CONFIG = {
  sheetEndpoint: "https://script.google.com/macros/s/AKfycbzpEVhpHfjKAnaj8yS4LyrU-7p0OiaKsdQx_chpVVcX8fBwq4EZU30leA8qP-j-UTbSmQ/exec"
};

function setFormStatus(form, message, type) {
  let status = form.querySelector("[data-form-status]");

  if (!status) {
    status = document.createElement("p");
    status.setAttribute("data-form-status", "");
    status.setAttribute("aria-live", "polite");
    status.style.marginTop = "1rem";
    form.appendChild(status);
  }

  status.textContent = message;
  status.style.color = type === "error" ? "#b42318" : "#0f766e";
}

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

function updateHiddenField(form, fieldName, fieldValue) {
  const input = form.querySelector(`input[name='${fieldName}']`);
  if (input) {
    input.value = fieldValue;
  }
}

function buildLeadPayload(form, formData, submitChannel) {
  const formId = form.dataset.formId || formData.get("form_id") || form.id || "form-sin-id";

  return {
    sent_at: new Date().toISOString(),
    form_id: formId,
    submit_channel: submitChannel,
    nombre: formData.get("nombre") || "",
    telefono: formData.get("telefono") || "",
    comuna: formData.get("comuna") || "",
    servicio: formData.get("servicio") || "",
    mensaje: formData.get("mensaje") || "",
    canal_respuesta: formData.get("canal") || "",
    pagina_origen: window.location.href,
    page_title: document.title,
    user_agent: navigator.userAgent
  };
}

async function saveLeadToGoogleSheets(payload) {
  if (!FORM_TRACKING_CONFIG.sheetEndpoint) {
    return;
  }

  try {
    await fetch(FORM_TRACKING_CONFIG.sheetEndpoint, {
      method: "POST",
      mode: "no-cors",
      headers: {
        "Content-Type": "text/plain;charset=utf-8"
      },
      body: JSON.stringify(payload),
      keepalive: true
    });
  } catch (error) {
    console.error("No se pudo registrar el lead en Google Sheets.", error);
  }
}

async function sendLeadByFormSubmit(form) {
  await fetch(form.action, {
    method: form.method || "POST",
    mode: "no-cors",
    body: new FormData(form),
    keepalive: true
  });
}

const quickForms = document.querySelectorAll("[data-whatsapp-form]");
quickForms.forEach((form) => {
  const handleFormSend = async () => {
    if (!form.reportValidity()) {
      return;
    }

    if (form.dataset.submitting === "true") {
      return;
    }

    form.dataset.submitting = "true";

    const responseChannel = form.querySelector("input[name='canal']:checked")?.value || "correo";
    const submitChannel = responseChannel === "whatsapp" ? "whatsapp" : "correo";

    updateHiddenField(form, "form_id", form.dataset.formId || form.id || "form-sin-id");
    updateHiddenField(form, "canal_envio", submitChannel);
    updateHiddenField(form, "fecha_envio", new Date().toISOString());
    updateHiddenField(form, "pagina_origen", window.location.href);

    const data = new FormData(form);
    const payload = buildLeadPayload(form, data, submitChannel);

    if (window.dataLayer) {
      window.dataLayer.push({
        event: "lead_form_submit",
        formId: payload.form_id,
        submitChannel: payload.submit_channel,
        responseChannel: payload.canal_respuesta
      });
    }

    try {
      await Promise.all([
        saveLeadToGoogleSheets(payload),
        sendLeadByFormSubmit(form)
      ]);

      if (submitChannel === "whatsapp") {
        setFormStatus(form, "Solicitud enviada. Se abrira WhatsApp para continuar.", "success");
        form.reset();
        window.open(toWhatsappMessage(data), "_blank");
        return;
      }

      setFormStatus(form, "Solicitud enviada correctamente. Te responderemos pronto.", "success");
      form.reset();
    } catch (error) {
      console.error("No se pudo enviar el formulario.", error);
      setFormStatus(form, "No se pudo enviar la solicitud. Intenta nuevamente.", "error");
    } finally {
      form.dataset.submitting = "false";
    }
  };

  const submitButton = form.querySelector("[data-form-send]");
  if (submitButton) {
    submitButton.addEventListener("click", handleFormSend);
  }

  form.addEventListener("keydown", (event) => {
    if (event.key !== "Enter" || event.target.tagName === "TEXTAREA") {
      return;
    }

    event.preventDefault();
    handleFormSend();
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

const floatButton = document.createElement("a");
floatButton.className = "whatsapp-float";
floatButton.href = `https://wa.me/${SITE_CONFIG.whatsapp}`;
floatButton.target = "_blank";
floatButton.rel = "noopener";
floatButton.setAttribute("aria-label", "Contactar por WhatsApp");

const floatIcon = document.createElement("img");
floatIcon.src = `${assetBase}images/logo-wsp.png`;
floatIcon.alt = "WhatsApp";

floatButton.appendChild(floatIcon);
document.body.appendChild(floatButton);

const MEDIA_LIBRARY = {
  water: {
    title: "Agua y tuberias",
    summary: "Galeria de trabajos de filtraciones, reparacion de tuberias, red de agua y soluciones de presion.",
    items: [
      {
        type: "image",
        src: "proyectos/instalacion-red-agua-cobre-reparacion-filtracion.jpeg",
        alt: "Reparacion de red de agua en tuberia de cobre en Villa Alemana",
        caption: "Reparacion de red de agua domiciliaria en tuberia de cobre.",
      },
      {
        type: "image",
        src: "proyectos/reparacion-filtracion-tuberia-pvc.jpeg",
        alt: "Reparacion de tuberia PVC con filtracion de agua en Quilpue",
        caption: "Reparacion de filtracion en tuberia PVC para evitar perdida de agua.",
      },
      {
        type: "image",
        src: "proyectos/reparacion-desague-pvc.jpeg",
        alt: "Reparacion de desague PVC domiciliario en Viña del Mar",
        caption: "Reparacion de sistema de desague domiciliario.",
      },
      {
        type: "image",
        src: "proyectos/conexion-agua-lavamanos-griferia.jpeg",
        alt: "Conexion de agua a lavamanos con griferia nueva en Valparaiso",
        caption: "Conexion de lavamanos a red de agua domiciliaria.",
      },
      {
        type: "video",
        src: "proyectos/reparacion-filtracion-tuberia-pvc.mp4",
        alt: "Video de reparacion de tuberia PVC con filtracion en Quilpue",
        caption: "Proceso de reparacion de filtracion en tuberia PVC."
      },
      {
        type: "video",
        src: "proyectos/reparacion-desague-pvc.mp4",
        alt: "Video de reparacion de desague PVC en Viña del Mar",
        caption: "Trabajo de reparacion de desague domiciliario."
      }
    ]
  },
  hotwater: {
    title: "Agua caliente",
    summary: "Trabajos recientes de instalacion, mantencion y reparacion de calefont y termos electricos.",
    items: [
      {
        type: "image",
        src: "proyectos/instalacion-calefon-splendid-10-litros.jpeg",
        alt: "Instalacion de calefont Splendid en vivienda de Villa Alemana",
        caption: "Instalacion de calefont para sistema de agua caliente.",
      },
      {
        type: "image",
        src: "proyectos/reparacion-calefont.jpeg",
        alt: "Reparacion de calefont a gas en casa en Quilpue",
        caption: "Diagnostico y reparacion de calefont domiciliario.",
      },
      {
        type: "image",
        src: "proyectos/reparacion-calefont-trotter.jpeg",
        alt: "Reparacion de calefont Trotter en vivienda en Viña del Mar",
        caption: "Servicio tecnico y reparacion de calefont Trotter.",
      },
      {
        type: "image",
        src: "proyectos/revision-calefon-junkers-instalado.jpeg",
        alt: "Revision tecnica de calefont Junkers en Valparaiso",
        caption: "Revision y mantencion de calefont Junkers.",
      },
      {
        type: "image",
        src: "proyectos/instalacion-termo-electrico-vertical.jpeg",
        alt: "Instalacion de termo electrico para agua caliente en Quilpue",
        caption: "Instalacion de termo electrico en vivienda.",
      },
      {
        type: "image",
        src: "proyectos/desarme-termo-electrico-reparacion.jpeg",
        alt: "Reparacion interna de termo electrico en Villa Alemana",
        caption: "Desarme de termo electrico para mantencion.",
      },
      {
        type: "image",
        src: "proyectos/resistencia-termo-electrico-calcificada.jpeg",
        alt: "Resistencia de termo electrico con sarro en Viña del Mar",
        caption: "Cambio y limpieza de resistencia de termo electrico.",
      },
      {
        type: "image",
        src: "proyectos/base-termo-electrico-ariston-desarmado.jpeg",
        alt: "Desarme de termo electrico Ariston para reparacion en Valparaiso",
        caption: "Revision interna de termo electrico Ariston.",
      },
      {
        type: "image",
        src: "proyectos/base-termo-electrico-instalacion.jpeg",
        alt: "Instalacion de base para termo electrico en Villa Alemana",
        caption: "Preparacion e instalacion de soporte para termo electrico.",
      },
      {
        type: "video",
        src: "proyectos/base-termo-electrico-instalacion.mp4",
        alt: "Video de instalacion de base para termo electrico en Villa Alemana",
        caption: "Proceso de instalacion de base para termo electrico."
      },
      {
        type: "video",
        src: "proyectos/base-termo-electrico-ariston-desarmado.mp4",
        alt: "Video de reparacion de termo electrico Ariston en Quilpue",
        caption: "Desarme y diagnostico de termo electrico Ariston."
      },
      {
        type: "video",
        src: "proyectos/instalacion-termo-electrico-a-nuevo.mp4",
        alt: "Video de instalacion de termo electrico nuevo en Viña del Mar",
        caption: "Instalacion profesional de termo electrico."
      }
    ]
  },
  bath: {
    title: "Baño, cocina y artefactos",
    summary: "Trabajos de griferia, artefactos sanitarios, WC, lavamanos, lavaplatos y desagues.",
    items: [
      {
        type: "image",
        src: "proyectos/cambio-griferia-bano.jpeg",
        alt: "Cambio de griferia en lavamanos de baño en Valparaiso",
        caption: "Instalacion de griferia nueva en baño.",
      },
      {
        type: "image",
        src: "proyectos/instalacion-llave-lavamanos-bano.jpeg",
        alt: "Instalacion de llave monomando en lavamanos en Quilpue",
        caption: "Instalacion de griferia moderna para lavamanos.",
      },
      {
        type: "image",
        src: "proyectos/llave-lavamanos-nueva-griferia.jpeg",
        alt: "Instalacion de griferia nueva en baño en Villa Alemana",
        caption: "Cambio de llave de agua en lavamanos.",
      },
      {
        type: "image",
        src: "proyectos/valvula-descarga-wc-fanalosa.jpeg",
        alt: "Reparacion de valvula de descarga de WC en Viña del Mar",
        caption: "Cambio de valvula de descarga en sanitario.",
      },
      {
        type: "image",
        src: "proyectos/conexion-agua-lavamanos-griferia.jpeg",
        alt: "Conexion de agua a lavamanos con griferia nueva en Valparaiso",
        caption: "Conexion de lavamanos a red de agua domiciliaria.",
      },
      {
        type: "video",
        src: "proyectos/cambio-griferia-bano.mp4",
        alt: "Video de cambio de griferia en baño en Valparaiso",
        caption: "Proceso de instalacion de griferia en baño."
      }
    ]
  },
  technical: {
    title: "Servicios tecnicos y emergencias",
    summary: "Trabajos generales, revisiones tecnicas, normalizacion y atencion de urgencias.",
    items: [
      {
        type: "image",
        src: "proyectos/mantencion-filtraciones-gas.jpeg",
        alt: "Mantencion de instalacion de gas en vivienda en Villa Alemana",
        caption: "Revision tecnica de conexiones de gas domiciliario.",
      },
      {
        type: "image",
        src: "proyectos/filtracion-calefont-gas.jpeg",
        alt: "Filtracion detectada en sistema de calefont a gas en Quilpue",
        caption: "Diagnostico y reparacion de filtraciones en calefont.",
      },
      {
        type: "image",
        src: "proyectos/reparacion-desague.jpeg",
        alt: "Reparacion de desague domiciliario obstruido en Viña del Mar",
        caption: "Limpieza y reparacion de desagues domiciliarios.",
      },
      {
        type: "image",
        src: "proyectos/reparacion-termo-solar-techo.jpeg",
        alt: "Reparacion de termo solar instalado en techo en Valparaiso",
        caption: "Servicio tecnico para sistemas de agua caliente solar.",
      },
      {
        type: "image",
        src: "proyectos/reparacion-calefont.jpeg",
        alt: "Servicio tecnico de calefont a gas en Quilpue",
        caption: "Diagnostico y reparacion de calefont.",
      },
      {
        type: "image",
        src: "proyectos/reparacion-calefont-trotter.jpeg",
        alt: "Servicio tecnico de calefont Trotter en Viña del Mar",
        caption: "Mantencion y reparacion de calefont Trotter.",
      },
      {
        type: "video",
        src: "proyectos/mantencion-filtraciones-gas.mp4",
        alt: "Video de mantencion de calefont y conexiones de gas en Valparaiso",
        caption: "Revision tecnica de sistema de gas domiciliario."
      },
      {
        type: "video",
        src: "proyectos/reparacion-calefont.mp4",
        alt: "Video de reparacion de calefont en Quilpue",
        caption: "Servicio tecnico de calefont a domicilio."
      }
    ]
  }
};

function createMediaSection(groupKey) {
  const media = MEDIA_LIBRARY[groupKey];
  const serviceSection = document.querySelector(".service-layout")?.closest(".section");

  if (!media || !serviceSection) {
    return;
  }

  const section = document.createElement("section");
  section.className = "section media-section";

  const container = document.createElement("div");
  container.className = "container media-stack";

  const galleryCard = document.createElement("article");
  galleryCard.className = "media-card";
  galleryCard.innerHTML = `
    <h2>Galeria de trabajos de ${media.title}</h2>
    <p>${media.summary}</p>
  `;

  const carousel = document.createElement("div");
  carousel.className = "carousel";

  const prevButton = document.createElement("button");
  prevButton.className = "carousel-control";
  prevButton.type = "button";
  prevButton.setAttribute("aria-label", "Ver imagen anterior");
  prevButton.textContent = "‹";

  const track = document.createElement("div");
  track.className = "carousel-track";

  media.items.forEach((mediaItem) => {
    const item = document.createElement("figure");
    item.className = `carousel-item ${mediaItem.type === "video" ? "video-card" : ""}`;

    if (mediaItem.type === "video") {
      item.innerHTML = `
        <video controls preload="metadata">
          <source src="${assetBase}${mediaItem.src}" type="video/mp4" />
        </video>
        <figcaption class="carousel-caption">${mediaItem.caption}</figcaption>
      `;
    } else {
      item.innerHTML = `
        <img src="${assetBase}${mediaItem.src}" alt="${mediaItem.alt}" loading="lazy" />
        <figcaption class="carousel-caption">${mediaItem.caption}</figcaption>
      `;
    }

    track.appendChild(item);
  });

  const nextButton = document.createElement("button");
  nextButton.className = "carousel-control";
  nextButton.type = "button";
  nextButton.setAttribute("aria-label", "Ver imagen siguiente");
  nextButton.textContent = "›";

  prevButton.addEventListener("click", () => {
    track.scrollBy({ left: -track.clientWidth * 0.9, behavior: "smooth" });
  });

  nextButton.addEventListener("click", () => {
    track.scrollBy({ left: track.clientWidth * 0.9, behavior: "smooth" });
  });

  carousel.append(prevButton, track, nextButton);
  galleryCard.appendChild(carousel);
  container.appendChild(galleryCard);

  section.appendChild(container);
  serviceSection.insertAdjacentElement("afterend", section);
}

const mediaGroup = document.body.dataset.mediaGroup;
if (mediaGroup) {
  createMediaSection(mediaGroup);
}
