const form = document.querySelector("#builder-form");
const previewName = document.querySelector("#preview-name");
const previewTitle = document.querySelector("#preview-title");
const previewBio = document.querySelector("#preview-bio");
const previewAvatar = document.querySelector("#preview-avatar");
const root = document.documentElement;
const authModal = document.querySelector("#auth-modal");
const paywallModal = document.querySelector("#paywall-modal");
const authForm = document.querySelector("#auth-form");
const authTitle = document.querySelector("#auth-title");
const authSubtitle = document.querySelector("#auth-subtitle");
const authSubmit = document.querySelector("#auth-submit");
const authFootnote = document.querySelector("#auth-footnote");
const authToggles = document.querySelectorAll("[data-auth-mode]");
const openAuthButtons = document.querySelectorAll("[data-open-auth]");
const closeAuthButton = document.querySelector("[data-close-auth]");
const openPaywallButtons = document.querySelectorAll("[data-open-paywall]");
const closePaywallButton = document.querySelector("[data-close-paywall]");
const paystackButtons = document.querySelectorAll("[data-paystack]");

const syncPreview = () => {
  previewName.textContent = document.querySelector("#name").value || "Your name";
  previewTitle.textContent = document.querySelector("#title").value || "Your title";
  previewBio.textContent = document.querySelector("#bio").value || "Tell the world about you.";
  previewAvatar.textContent = document.querySelector("#initials").value || "YY";
  root.style.setProperty("--primary", document.querySelector("#accent").value || "#5c6cff");
};

form.addEventListener("input", syncPreview);

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const shareEl = document.querySelector(".share");
  shareEl.textContent = `hihello-ish.me/${document.querySelector("#name").value
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-") || "your-name"}`;
});

const setAuthMode = (mode) => {
  const isSignup = mode === "signup";
  authForm.classList.toggle("signup", isSignup);
  authTitle.textContent = isSignup ? "Create your account" : "Welcome back";
  authSubtitle.textContent = isSignup
    ? "Start sharing your digital business card in minutes."
    : "Sign in to manage your digital card and leads.";
  authSubmit.textContent = isSignup ? "Create account" : "Sign in";
  authFootnote.textContent = isSignup
    ? "Already have an account? Log in to keep your card updated."
    : "New here? Create a free account to start sharing your card.";
  authToggles.forEach((toggle) => {
    toggle.classList.toggle("active", toggle.dataset.authMode === mode);
  });
};

const openAuthModal = () => {
  authModal.classList.add("open");
  authModal.setAttribute("aria-hidden", "false");
};

const closeAuthModal = () => {
  authModal.classList.remove("open");
  authModal.setAttribute("aria-hidden", "true");
};

const openPaywallModal = () => {
  paywallModal.classList.add("open");
  paywallModal.setAttribute("aria-hidden", "false");
};

const closePaywallModal = () => {
  paywallModal.classList.remove("open");
  paywallModal.setAttribute("aria-hidden", "true");
};

openAuthButtons.forEach((button) => {
  button.addEventListener("click", openAuthModal);
});

closeAuthButton.addEventListener("click", closeAuthModal);

openPaywallButtons.forEach((button) => {
  button.addEventListener("click", openPaywallModal);
});

closePaywallButton.addEventListener("click", closePaywallModal);

authModal.addEventListener("click", (event) => {
  if (event.target === authModal) {
    closeAuthModal();
  }
});

paywallModal.addEventListener("click", (event) => {
  if (event.target === paywallModal) {
    closePaywallModal();
  }
});

authToggles.forEach((toggle) => {
  toggle.addEventListener("click", () => {
    setAuthMode(toggle.dataset.authMode);
  });
});

authForm.addEventListener("submit", (event) => {
  event.preventDefault();
  authForm.reset();
  closeAuthModal();
});

paystackButtons.forEach((button) => {
  button.addEventListener("click", () => {
    alert("Paystack checkout would open here.");
  });
});

setAuthMode("login");
syncPreview();
