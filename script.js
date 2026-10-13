
"use strict";

const BOOKING_URL =
  "https://calendar.app.google/Tuo6mK3f19tUUhBQ7";

async function loadPartial(elementId, filePath) {
  const container = document.getElementById(elementId);

  if (!container) return false;

  try {
    const response = await fetch(filePath);

    if (!response.ok) {
      throw new Error(
        `Failed to load ${filePath}: ${response.status}`
      );
    }

    container.innerHTML = await response.text();
    return true;

  } catch (error) {
    console.error(error);

    // Preserve access to scheduling if the header fails.
    if (elementId === "site-header") {
      container.innerHTML = `
        <header class="site-header">
          <div class="container header-inner">
            <a href="#home" class="brand">
              <span class="brand-symbol">✳</span>
              <span>REDLINE <small>PEST CONTROL</small></span>
            </a>

            <a
              class="button button-red"
              href="${BOOKING_URL}"
              target="_blank"
              rel="noopener noreferrer"
            >
              Book Now ↗
            </a>
          </div>
        </header>
      `;
    }

    return false;
  }
}

function setupMobileNavigation() {
  const toggle = document.querySelector(".menu-toggle");
  const navigation = document.getElementById("primary-navigation");

  if (!toggle || !navigation) return;

  function closeMenu() {
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Open navigation menu");

    navigation.classList.remove("is-open");
    document.body.classList.remove("menu-open");
  }

  function openMenu() {
    toggle.setAttribute("aria-expanded", "true");
    toggle.setAttribute("aria-label", "Close navigation menu");

    navigation.classList.add("is-open");
    document.body.classList.add("menu-open");
  }

  toggle.addEventListener("click", () => {
    const isOpen =
      toggle.getAttribute("aria-expanded") === "true";

    if (isOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  navigation.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("keydown", event => {
    if (event.key === "Escape") closeMenu();
  });

  document.addEventListener("click", event => {
    if (
      navigation.classList.contains("is-open") &&
      !navigation.contains(event.target) &&
      !toggle.contains(event.target)
    ) {
      closeMenu();
    }
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 760) closeMenu();
  });
}

function setupFooter() {
  const yearElement = document.getElementById("current-year");

  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }
}

async function initializeWebsite() {
  await Promise.all([
    loadPartial("site-header", "header.html"),
    loadPartial("site-footer", "footer.html")
  ]);

  setupMobileNavigation();
  setupFooter();
}

document.addEventListener(
  "DOMContentLoaded",
  initializeWebsite
);
