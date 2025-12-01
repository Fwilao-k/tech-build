// ================= Firebase Setup =================
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyBsyMeZIjJy0etMkiA0BX7YeiJIgUWyyUY",
  authDomain: "tech-build-d4be2.firebaseapp.com",
  projectId: "tech-build-d4be2",
  storageBucket: "tech-build-d4be2.firebasestorage.app",
  messagingSenderId: "61119563260",
  appId: "1:61119563260:web:1eedd152ce040691dede79"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// ================= Grab Elements (may not exist on every page) =================
const modal = document.getElementById("authModal");
const authTitle = document.getElementById("authTitle");
const authActionBtn = document.getElementById("authActionBtn");
const authEmail = document.getElementById("authEmail");
const authPassword = document.getElementById("authPassword");
const switchToLogin = document.getElementById("switchToLogin");

const joinBtn = document.getElementById("joinBtn");
const loginBtn = document.getElementById("loginBtn");
const logoutBtn = document.getElementById("logoutBtn");
const navDivider = document.getElementById("navDivider");

const profileMenu = document.getElementById("profileMenu");
const dropdownMenu = document.getElementById("dropdownMenu");
const profileLetter = document.getElementById("profileLetter");
const dropdownEmail = document.getElementById("dropdownEmail");

let isLogin = false;

// ================= Modal Helpers =================
function openModal(mode = "signup") {
  if (!modal) return;
  modal.classList.remove("hidden");
  document.body.style.overflow = "hidden";

  if (mode === "login") {
    isLogin = true;
    authTitle && (authTitle.innerText = "Log In");
    authActionBtn && (authActionBtn.innerText = "Log In");
  } else {
    isLogin = false;
    authTitle && (authTitle.innerText = "Join");
    authActionBtn && (authActionBtn.innerText = "Sign Up");
  }
}

function closeModal() {
  if (!modal) return;
  modal.classList.add("hidden");
  document.body.style.overflow = "auto";
}

// ================= Require Auth Helper =================
function requireAuth(callback) {
  if (!auth.currentUser) {
    openModal("login");
  } else {
    callback();
  }
}

// Expose scrollToResults globally for the Explore button
window.scrollToResults = function () {
  const section = document.getElementById("results-section");
  if (!section) return;

  requireAuth(() => {
    section.scrollIntoView({ behavior: "smooth" });
  });
};

// ================= Auth State → Navbar UI =================
onAuthStateChanged(auth, (user) => {
  if (!profileMenu || !joinBtn || !loginBtn) return;

  // always hide dropdown on state change
  if (dropdownMenu) dropdownMenu.classList.add("hidden");

  if (user) {
    const email = user.email;
    if (profileLetter) profileLetter.textContent = email.charAt(0).toUpperCase();
    if (dropdownEmail) dropdownEmail.textContent = email;

    profileMenu.classList.remove("hidden");
    joinBtn.classList.add("hidden");
    loginBtn.classList.add("hidden");
    navDivider && navDivider.classList.add("hidden");
  } else {
    profileMenu.classList.add("hidden");
    joinBtn.classList.remove("hidden");
    loginBtn.classList.remove("hidden");
    navDivider && navDivider.classList.remove("hidden");
  }
});

// ================= Modal Events =================
joinBtn && joinBtn.addEventListener("click", () => openModal("signup"));
loginBtn && loginBtn.addEventListener("click", () => openModal("login"));

if (modal) {
  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });
}

const closeBtn = document.querySelector(".close-auth");
closeBtn && closeBtn.addEventListener("click", closeModal);

switchToLogin &&
  switchToLogin.addEventListener("click", () => openModal("login"));

// Signup / Login button
if (authActionBtn && authEmail && authPassword) {
  authActionBtn.addEventListener("click", () => {
    const email = authEmail.value.trim();
    const password = authPassword.value.trim();

    if (!email || !password) {
      alert("Enter email & password!");
      return;
    }

    const promise = isLogin
      ? signInWithEmailAndPassword(auth, email, password)
      : createUserWithEmailAndPassword(auth, email, password);

    promise
      .then(() => {
        closeModal();
      })
      .catch((err) => alert(err.message));
  });
}

// ================= Profile Dropdown =================
if (profileMenu && dropdownMenu) {
  profileMenu.addEventListener("click", (e) => {
    e.stopPropagation();
    dropdownMenu.classList.toggle("show");
  });

  document.addEventListener("click", () => {
    dropdownMenu.classList.remove("show");
  });
}

// Logout
logoutBtn &&
  logoutBtn.addEventListener("click", () => {
    signOut(auth);
    dropdownMenu && dropdownMenu.classList.remove("show");
  });

// ================= Protect Result Cards (require login) =================
document.addEventListener("click", (e) => {
  const card = e.target.closest(".result-card-link");
  if (!card) return;

  e.preventDefault();
  const href = card.href;

  requireAuth(() => {
    window.location.href = href;
  });
});
