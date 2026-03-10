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
        src: "proyectos/reparacion-filtracion-tuberia-pvc.jpeg",
        alt: "Reparacion de tuberia PVC con filtracion de agua en casa",
        caption: "Reparacion de filtracion en tuberia PVC para evitar perdida de agua."
      },
      {
        type: "image",
        src: "proyectos/reparacion-desague-pvc.jpeg",
        alt: "Reparacion de desague PVC domiciliario por fuga y obstruccion",
        caption: "Correccion de desague PVC en red domiciliaria."
      },
      {
        type: "image",
        src: "proyectos/instalacion-red-agua-cobre-reparacion-filtracion.jpeg",
        alt: "Instalacion de red de agua en cobre para reparacion de filtracion",
        caption: "Renovacion de red de agua en cobre para mejorar presion y durabilidad."
      },
      {
        type: "video",
        src: "proyectos/reparacion-conexion-desague.mp4",
        caption: "Video de reparacion de conexion y desague en instalacion sanitaria."
      }
    ]
  },
  hotwater: {
    title: "Agua caliente",
    summary: "Trabajos recientes de instalacion, mantencion y reparacion de calefont y termos electricos.",
    items: [
      {
        type: "image",
        src: "proyectos/base-termo-electrico-ariston-desarmado.jpeg",
        alt: "Base de termo electrico desarmado para reparacion y mantencion",
        caption: "Desarme de termo electrico para diagnostico y reparacion."
      },
      {
        type: "image",
        src: "proyectos/desarme-termo-electrico-reparacion.jpeg",
        alt: "Desarme de termo electrico para reparacion de agua caliente",
        caption: "Revision interna de termo electrico con falla de agua caliente."
      },
      {
        type: "image",
        src: "proyectos/resistencia-termo-electrico-con-sarro.jpeg",
        alt: "Resistencia de termo electrico con sarro en mantencion preventiva",
        caption: "Mantencion de termo electrico con acumulacion de sarro."
      },
      {
        type: "image",
        src: "proyectos/resistencia-termo-electrico-calcificada.jpeg",
        alt: "Resistencia calcificada de termo electrico para reparacion",
        caption: "Componente calcificado que afecta el rendimiento del termo."
      },
      {
        type: "image",
        src: "proyectos/instalacion-termo-electrico-bajo-lavaplatos.jpeg",
        alt: "Instalacion de termo electrico bajo lavaplatos en cocina",
        caption: "Instalacion de termo electrico bajo lavaplatos."
      },
      {
        type: "image",
        src: "proyectos/termo-electrico-instalado-bano.jpeg",
        alt: "Termo electrico instalado en baño para agua caliente",
        caption: "Equipo instalado para suministro de agua caliente en baño."
      },
      {
        type: "image",
        src: "proyectos/instalacion-termo-electrico-vertical.jpeg",
        alt: "Instalacion vertical de termo electrico domiciliario",
        caption: "Montaje vertical de termo electrico con conexion segura."
      },
      {
        type: "image",
        src: "proyectos/base-termo-electrico-instalacion.jpeg",
        alt: "Base de instalacion de termo electrico en vivienda",
        caption: "Preparacion de base para instalacion de termo electrico."
      },
      {
        type: "image",
        src: "proyectos/instalacion-termo-electrico-anwo.jpeg",
        alt: "Instalacion de termo electrico Anwo para agua caliente",
        caption: "Instalacion de termo electrico Anwo en domicilio."
      },
      {
        type: "image",
        src: "proyectos/conexion-termo-electrico-instalacion-agua-caliente.jpeg",
        alt: "Conexion de termo electrico a red de agua caliente",
        caption: "Conexion final de termo electrico a sistema de agua caliente."
      },
      {
        type: "video",
        src: "proyectos/reparacion-calefont.mp4",
        caption: "Video de reparacion de calefont con falla de encendido."
      },
      {
        type: "video",
        src: "proyectos/reparacion-calefont-trotter.mp4",
        caption: "Video de reparacion de calefont Trotter en domicilio."
      },
      {
        type: "video",
        src: "proyectos/filtracion-calefont-gas.mp4",
        caption: "Video de revision de calefont con filtracion y problema de gas."
      }
    ]
  },
  bath: {
    title: "Baño, cocina y artefactos",
    summary: "Trabajos de griferia, artefactos sanitarios, WC, lavamanos, lavaplatos y desagues.",
    items: [
      {
        type: "image",
        src: "proyectos/instalacion-llave-lavamanos-bano.jpeg",
        alt: "Instalacion de llave de lavamanos en baño",
        caption: "Instalacion de llave de lavamanos en baño."
      },
      {
        type: "image",
        src: "proyectos/conexion-agua-lavamanos-griferia.jpeg",
        alt: "Conexion de agua para lavamanos y griferia nueva",
        caption: "Conexion de agua para lavamanos con griferia renovada."
      },
      {
        type: "image",
        src: "proyectos/valvula-descarga-wc-fanaloza.jpeg",
        alt: "Reparacion de valvula de descarga de WC Fanaloza",
        caption: "Cambio y ajuste de valvula de descarga para WC."
      },
      {
        type: "image",
        src: "proyectos/llave-lavamanos-nueva-griferia.jpeg",
        alt: "Nueva griferia de lavamanos instalada por gasfiter",
        caption: "Cambio de griferia de lavamanos en baño."
      },
      {
        type: "video",
        src: "proyectos/cambio-griferia-baño.mp4",
        caption: "Video de cambio de griferia en baño."
      },
      {
        type: "video",
        src: "proyectos/reparacion-conexion-desague.mp4",
        caption: "Video de reparacion de conexion de desague."
      }
    ]
  },
  technical: {
    title: "Servicios tecnicos y emergencias",
    summary: "Trabajos generales, revisiones tecnicas, normalizacion y atencion de urgencias.",
    items: [
      {
        type: "image",
        src: "proyectos/revision-calefon-junkers-instalado.jpeg",
        alt: "Revision tecnica de calefon Junkers instalado en domicilio",
        caption: "Revision tecnica de calefon ya instalado."
      },
      {
        type: "image",
        src: "proyectos/reparacion-calefon-exterior.jpeg",
        alt: "Reparacion de calefon exterior en servicio tecnico",
        caption: "Servicio tecnico en calefon exterior."
      },
      {
        type: "image",
        src: "proyectos/mantencion-calefon-exterior.jpeg",
        alt: "Mantencion de calefon exterior para mejorar funcionamiento",
        caption: "Mantencion preventiva de calefon exterior."
      },
      {
        type: "image",
        src: "proyectos/compra-calefon-nuevo-sodimac.jpeg",
        alt: "Cambio e instalacion de calefon nuevo comprado para vivienda",
        caption: "Renovacion de calefon por cambio de equipo."
      },
      {
        type: "image",
        src: "proyectos/instalacion-calefon-splendid-10-litros.jpeg",
        alt: "Instalacion de calefon Splendid de 10 litros",
        caption: "Instalacion de calefon Splendid de 10 litros."
      },
      {
        type: "image",
        src: "proyectos/reparacion-termo-solar-techo.jpeg",
        alt: "Reparacion de termo solar en techo para agua caliente",
        caption: "Servicio tecnico en termo solar instalado en techo."
      },
      {
        type: "video",
        src: "proyectos/mantencion-filtraciones-gas.mp4",
        caption: "Video de mantencion tecnica y revision de filtraciones."
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
