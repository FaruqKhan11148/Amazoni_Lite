'use strict';

// === MODAL ===
// only one modal close function
const modal = document.querySelector('[data-modal]');
const modalCloseBtn = document.querySelector('[data-modal-close]');
const modalCloseOverlay = document.querySelector('[data-modal-overlay]');

if (modal && modalCloseBtn && modalCloseOverlay) {
  const closeModal = () => modal.classList.add('closed');
  modalCloseOverlay.addEventListener('click', closeModal);
  modalCloseBtn.addEventListener('click', closeModal);
}

// === TOAST ===
const notificationToast = document.querySelector('[data-toast]');
const toastCloseBtn = document.querySelector('[data-toast-close]');

if (notificationToast && toastCloseBtn) {
  toastCloseBtn.addEventListener('click', () => notificationToast.classList.add('closed'));
}

// === MOBILE MENU ===
const mobileMenuOpenBtn = document.querySelectorAll('[data-mobile-menu-open-btn]');
const mobileMenu = document.querySelectorAll('[data-mobile-menu]');
const mobileMenuCloseBtn = document.querySelectorAll('[data-mobile-menu-close-btn]');
const overlay = document.querySelector('[data-overlay]');

for (let i = 0; i < mobileMenuOpenBtn.length; i++) {
  const closeMobileMenu = () => {
    mobileMenu[i].classList.remove('active');
    overlay.classList.remove('active');
  };

  mobileMenuOpenBtn[i].addEventListener('click', () => {
    mobileMenu[i].classList.add('active');
    overlay.classList.add('active');
  });

  mobileMenuCloseBtn[i].addEventListener('click', closeMobileMenu);
  overlay.addEventListener('click', closeMobileMenu);
}

// === ACCORDION ===
const accordionBtn = document.querySelectorAll('[data-accordion-btn]');
const accordion = document.querySelectorAll('[data-accordion]');

for (let i = 0; i < accordionBtn.length; i++) {
  accordionBtn[i].addEventListener('click', function () {
    const isActive = this.nextElementSibling.classList.contains('active');

    for (let j = 0; j < accordion.length; j++) {
      if (isActive) break;

      if (accordion[j].classList.contains('active')) {
        accordion[j].classList.remove('active');
        accordionBtn[j].classList.remove('active');
      }
    }

    this.nextElementSibling.classList.toggle('active');
    this.classList.toggle('active');
  });
}

// === PROFILE SIDEBAR ===
const profile = document.querySelector(".profile");
const profileSidebar = document.querySelector(".profile-sidebar"); // use class
const profileClose = document.getElementById("closeProfile");


if (profile && profileSidebar && profileClose) {
  profile.addEventListener("click", () => profileSidebar.classList.toggle("active"));
  profileClose.addEventListener("click", () => profileSidebar.classList.remove("active"));
}

// === USER PROFILE LOAD ===
async function loadUserProfile() {
  try {
    const res = await fetch("/api/users/me", { credentials: "include" });
    if (!res.ok) return;

    const user = await res.json();
    document.getElementById("profileName").innerText = user.name;
    document.getElementById("profileEmail").innerText = user.email;
  } catch (err) {
    console.log("User not logged in");
  }
}

loadUserProfile();
