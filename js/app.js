const DEMO_USER = "admin";
const DEMO_PASSWORD = "admin123";
const CHART_COLORS = ["#059669", "#10b981", "#047857", "#34d399", "#065f46", "#6ee7b7", "#0f766e", "#14b8a6"];

/* Tasa de conversión simulada USD → COP */
const USD_TO_COP = 4200;
const STORAGE_KEY = "tm_products_v2";

const state = {
  products: [],
  filters: { search: "", category: "all", price: "all" },
  activeView: "dashboard",
  loaded: false,
  uploadedImageUrl: "",
};

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];

const elements = {
  loginView: $("#loginView"), dashboardApp: $("#dashboardApp"), loginForm: $("#loginForm"), loginButton: $("#loginButton"),
  loginError: $("#loginError"), username: $("#usernameInput"), password: $("#passwordInput"), passwordToggle: $("#passwordToggle"),
  themeButtons: [$("#loginThemeButton"), $("#themeButton")], sidebar: $("#sidebar"), sidebarBackdrop: $("#sidebarBackdrop"),
  sidebarCollapseBtn: $("#sidebarCollapseBtn"),
  menuButton: $("#menuButton"), sidebarClose: $("#sidebarClose"), logout: $("#logoutButton"), reload: $("#reloadButton"),
  status: $("#statusMessage"), globalSearch: $("#globalSearch"), search: $("#searchInput"), category: $("#categoryFilter"),
  price: $("#priceFilter"), clearFilters: $("#clearFiltersButton"), grid: $("#productsGrid"), template: $("#productTemplate"),
  empty: $("#emptyState"), resultCount: $("#resultCount"), form: $("#productForm"), submit: $("#submitButton"),
  recentBody: $("#recentTableBody"), currentDate: $("#currentDate"), apiConnection: $("#apiConnection"),
  apiConnectionLabel: $("#apiConnectionLabel"), apiConnectionDetail: $("#apiConnectionDetail"),
  liveStatus: $("#liveStatus"), liveStatusLabel: $("#liveStatusLabel"),
  priceInput: $("#priceInput"),
  imageUploadArea: $("#imageUploadArea"), imageFileInput: $("#imageFileInput"),
  imageUrlInput: $("#imageUrlInput"), imagePreview: $("#imagePreview"),
  imagePreviewContainer: $("#imagePreviewContainer"),
};

/* ─── Formateo de moneda COP ─── */
const money = new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", minimumFractionDigits: 0, maximumFractionDigits: 0 });
const compactMoney = new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", notation: "compact", maximumFractionDigits: 1 });
const number = new Intl.NumberFormat("es-CO");

/**
 * Persistencia en localStorage
 */
function saveProductsToStorage() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.products));
  } catch (error) {
    console.warn("No se pudo guardar en localStorage:", error);
  }
}

function getStoredProducts() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (error) {
    console.warn("Error leyendo de localStorage:", error);
  }
  return null;
}

/**
 * Convierte precio USD de la API a COP.
 */
function toCOP(usdPrice) {
  return Math.round(usdPrice * USD_TO_COP);
}

/**
 * Formatea un número con separadores de miles para el input de precio.
 */
function formatPriceInput(value) {
  const num = String(value).replace(/\D/g, "");
  if (!num) return "";
  return new Intl.NumberFormat("es-CO").format(Number(num));
}

/**
 * Parsea el valor del input de precio (remueve separadores).
 */
function parsePriceInput(value) {
  return Number(String(value).replace(/\D/g, "")) || 0;
}

const swalOptions = () => ({
  customClass: { popup: "tm-swal" },
  backdrop: "rgba(15, 23, 42, 0.45)",
  confirmButtonColor: getComputedStyle(document.documentElement).getPropertyValue("--primary").trim() || "#059669",
  cancelButtonColor: "#64748b",
});

function toast(icon, title) {
  if (!window.Swal) return;
  Swal.fire({
    toast: true,
    position: "bottom-end",
    icon,
    title,
    showConfirmButton: false,
    timer: 2600,
    timerProgressBar: true,
    backdrop: false,
    customClass: { popup: "tm-toast" },
  });
}

function formatCategory(value) {
  return String(value || "sin-categoria").replaceAll("-", " ");
}

function getStockStatus(stock) {
  if (stock <= 0) return { label: "Agotado", className: "out" };
  if (stock < 10) return { label: "Stock bajo", className: "warning" };
  return { label: "Disponible", className: "ok" };
}

function escapeHtml(value) {
  return String(value).replace(/[&<>'"]/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[character]);
}

function setTheme(theme) {
  document.documentElement.dataset.theme = theme;
  localStorage.setItem("tm-theme", theme);
  const isDark = theme === "dark";
  elements.themeButtons.forEach((button) => {
    if (button) button.setAttribute("aria-label", isDark ? "Activar modo claro" : "Activar modo oscuro");
  });
}

function toggleTheme() {
  setTheme(document.documentElement.dataset.theme === "dark" ? "light" : "dark");
}

function showStatus(message, type = "loading", autoHide = false) {
  elements.status.textContent = message;
  elements.status.className = `status-banner ${type}`;
  elements.status.hidden = false;
  if (autoHide) window.setTimeout(() => { elements.status.hidden = true; }, 3200);
}

function setConnectionState(status) {
  const copy = {
    loading: ["Conectando API", "Consultando DummyJSON…", "Actualizando"],
    success: ["API conectada", "DummyJSON · Datos sincronizados", "En vivo"],
    error: ["API sin conexión", "Reintenta para recuperar los datos", "Sin conexión"],
  }[status] || ["", "", ""];
  if (elements.apiConnection) elements.apiConnection.dataset.state = status;
  if (elements.apiConnectionLabel) elements.apiConnectionLabel.textContent = copy[0];
  if (elements.apiConnectionDetail) elements.apiConnectionDetail.textContent = copy[1];
  if (elements.liveStatus) elements.liveStatus.dataset.state = status;
  if (elements.liveStatusLabel) elements.liveStatusLabel.textContent = copy[2];
}

function showCatalogSkeletons() {
  elements.grid.innerHTML = Array.from({ length: 8 }, () => '<div class="product-card skeleton-card"><div class="product-media"></div><div class="product-card-body"><i></i><i></i><i></i></div></div>').join("");
}

function openDashboard() {
  elements.loginView.hidden = true;
  elements.dashboardApp.hidden = false;
  elements.currentDate.textContent = new Intl.DateTimeFormat("es-CO", { weekday: "long", day: "numeric", month: "long", year: "numeric" }).format(new Date());
  if (!state.loaded) loadProducts();
}

function openLogin() {
  elements.dashboardApp.hidden = true;
  elements.loginView.hidden = false;
  elements.loginForm.reset();
  elements.loginError.hidden = true;
  window.setTimeout(() => elements.username.focus(), 80);
}

async function handleLogin(event) {
  event.preventDefault();
  elements.loginError.hidden = true;
  const username = elements.username.value.trim();
  const password = elements.password.value;

  if (!username || !password) {
    elements.loginError.textContent = "Completa el usuario y la contraseña para continuar.";
    elements.loginError.hidden = false;
    elements.loginForm.classList.remove("shake");
    void elements.loginForm.offsetWidth;
    elements.loginForm.classList.add("shake");
    return;
  }

  elements.loginButton.disabled = true;
  elements.loginButton.classList.add("is-loading");
  elements.loginButton.querySelector("span").textContent = "Verificando acceso…";
  await new Promise((resolve) => window.setTimeout(resolve, 650));

  if (username === DEMO_USER && password === DEMO_PASSWORD) {
    sessionStorage.setItem("tm-authenticated", "true");
    elements.loginButton.querySelector("span").textContent = "Acceso correcto";
    await new Promise((resolve) => window.setTimeout(resolve, 250));
    openDashboard();
    toast("success", "Bienvenido a TecnoMarket");
  } else {
    elements.loginError.textContent = "Credenciales incorrectas. Usa admin y admin123.";
    elements.loginError.hidden = false;
    elements.loginForm.classList.remove("shake");
    void elements.loginForm.offsetWidth;
    elements.loginForm.classList.add("shake");
    elements.password.select();
  }

  elements.loginButton.disabled = false;
  elements.loginButton.classList.remove("is-loading");
  elements.loginButton.querySelector("span").textContent = "Ingresar al panel";
}

function togglePassword() {
  const visible = elements.password.type === "text";
  elements.password.type = visible ? "password" : "text";
  elements.passwordToggle.setAttribute("aria-label", visible ? "Mostrar contraseña" : "Ocultar contraseña");
  elements.password.focus();
}

async function handleLogout() {
  const result = window.Swal
    ? await Swal.fire({ ...swalOptions(), icon: "question", title: "¿Cerrar sesión?", text: "Volverás a la pantalla de acceso.", showCancelButton: true, confirmButtonText: "Cerrar sesión", cancelButtonText: "Cancelar" })
    : { isConfirmed: window.confirm("¿Cerrar sesión?") };
  if (!result.isConfirmed) return;
  sessionStorage.removeItem("tm-authenticated");
  closeSidebar();
  openLogin();
}

function setActiveView(view) {
  state.activeView = view;
  $$('[data-view-panel]').forEach((panel) => {
    const active = panel.dataset.viewPanel === view;
    panel.hidden = !active;
    panel.classList.toggle("is-active", active);
  });
  $$(".nav-item").forEach((button) => button.classList.toggle("is-active", button.dataset.view === view));
  closeSidebar();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function openSidebar() {
  elements.sidebar.classList.add("is-open");
  elements.sidebarBackdrop.classList.add("is-open");
}

function closeSidebar() {
  elements.sidebar.classList.remove("is-open");
  elements.sidebarBackdrop.classList.remove("is-open");
}

function categoryCounts() {
  return state.products.reduce((counts, product) => {
    counts[product.category] = (counts[product.category] || 0) + 1;
    return counts;
  }, {});
}

function renderMetrics() {
  const total = state.products.length;
  const inventoryValue = state.products.reduce((sum, item) => sum + toCOP(item.price) * item.stock, 0);
  const lowStock = state.products.filter((item) => item.stock > 0 && item.stock < 10).length;
  const average = total ? state.products.reduce((sum, item) => sum + toCOP(item.price), 0) / total : 0;
  const healthy = state.products.filter((item) => item.stock >= 10).length;
  const out = state.products.filter((item) => item.stock <= 0).length;
  const healthyPercent = total ? Math.round((healthy / total) * 100) : 0;

  $("#totalProducts").textContent = number.format(total);
  $("#sidebarCount").textContent = total;
  $("#inventoryValue").textContent = compactMoney.format(inventoryValue);
  $("#lowStockCount").textContent = number.format(lowStock);
  $("#averagePrice").textContent = money.format(average);
  $("#healthyPercent").textContent = `${healthyPercent}%`;
  $("#healthyBar").style.width = `${healthyPercent}%`;
  $("#healthyCount").textContent = healthy;
  $("#warningCount").textContent = lowStock;
  $("#outCount").textContent = out;
  $("#productTrend").textContent = `${Object.keys(categoryCounts()).length} categorías disponibles`;
}

function renderCategoryChart() {
  const entries = Object.entries(categoryCounts()).sort((a, b) => b[1] - a[1]);
  $("#categoryCount").textContent = entries.length;
  const total = Math.max(state.products.length, 1);
  let current = 0;
  const segments = entries.slice(0, 6).map(([category, count], index) => {
    const start = current;
    current += (count / total) * 100;
    return `${CHART_COLORS[index % CHART_COLORS.length]} ${start}% ${current}%`;
  });
  $("#categoryDonut").style.background = segments.length ? `conic-gradient(${segments.join(",")})` : "var(--surface-soft)";
  $("#categoryLegend").innerHTML = entries.slice(0, 5).map(([category, count], index) => `<div class="legend-row"><i style="background:${CHART_COLORS[index % CHART_COLORS.length]}"></i><span>${escapeHtml(formatCategory(category))}</span><strong>${count}</strong></div>`).join("");
}

function renderRecentTable() {
  elements.recentBody.innerHTML = state.products.slice(0, 6).map((product) => {
    const status = getStockStatus(product.stock);
    const priceCOP = toCOP(product.price);
    return `<tr><td><div class="table-product"><img src="${escapeHtml(product.thumbnail)}" alt=""><span>${escapeHtml(product.title)}</span></div></td><td>${escapeHtml(formatCategory(product.category))}</td><td>${money.format(priceCOP)}</td><td>${number.format(product.stock)}</td><td><span class="status-pill ${status.className}">${status.label}</span></td><td><div class="table-actions"><button type="button" data-edit-id="${product.id}" aria-label="Editar ${escapeHtml(product.title)}"><svg viewBox="0 0 24 24"><path d="M12 20h9M16.5 3.5a2.12 2.12 0 0 1 3 3L8 18l-4 1 1-4Z"/></svg></button><button class="delete" type="button" data-delete-id="${product.id}" aria-label="Eliminar ${escapeHtml(product.title)}"><svg viewBox="0 0 24 24"><path d="M4 7h16M9 7V4h6v3m-8 0 1 13h8l1-13"/></svg></button></div></td></tr>`;
  }).join("");
}

function renderAnalytics() {
  const counts = Object.entries(categoryCounts()).sort((a, b) => b[1] - a[1]);
  const max = Math.max(...counts.map(([, count]) => count), 1);
  $("#categoryBars").innerHTML = counts.map(([category, count], index) => `<div class="bar-row"><span>${escapeHtml(formatCategory(category))}</span><div class="bar-track"><i style="width:${(count / max) * 100}%;background:${CHART_COLORS[index % CHART_COLORS.length]}"></i></div><strong>${count}</strong></div>`).join("");

  const ranges = [
    { label: "Hasta $2.000.000", count: state.products.filter((item) => toCOP(item.price) <= 2000000).length },
    { label: "$2M a $6M", count: state.products.filter((item) => toCOP(item.price) >= 2000001 && toCOP(item.price) <= 6000000).length },
    { label: "Más de $6.000.000", count: state.products.filter((item) => toCOP(item.price) > 6000000).length },
  ];
  const rangeMax = Math.max(...ranges.map((item) => item.count), 1);
  $("#priceDistribution").innerHTML = ranges.map((item) => `<div class="price-row"><div><span>${item.label}</span><strong>${item.count}</strong></div><i style="width:${(item.count / rangeMax) * 100}%"></i></div>`).join("");

  const stock = state.products.reduce((sum, item) => sum + item.stock, 0);
  const mostExpensive = state.products.reduce((current, item) => item.price > (current?.price || -1) ? item : current, null);
  const bestStock = state.products.reduce((current, item) => item.stock > (current?.stock || -1) ? item : current, null);
  $("#detailStats").innerHTML = `<div><dt>Unidades totales</dt><dd>${number.format(stock)}</dd></div><div><dt>Categorías</dt><dd>${Object.keys(categoryCounts()).length}</dd></div><div><dt>Mayor precio</dt><dd>${mostExpensive ? money.format(toCOP(mostExpensive.price)) : "—"}</dd></div><div><dt>Mayor stock</dt><dd>${bestStock ? number.format(bestStock.stock) : "—"}</dd></div>`;
}

function renderDashboard() {
  renderMetrics();
  renderCategoryChart();
  renderRecentTable();
  renderAnalytics();
}

function getVisibleProducts() {
  const term = state.filters.search.trim().toLocaleLowerCase("es");
  return state.products.filter((product) => {
    const matchesSearch = product.title.toLocaleLowerCase("es").includes(term) || product.brand.toLocaleLowerCase("es").includes(term);
    const matchesCategory = state.filters.category === "all" || product.category === state.filters.category;
    const priceCOP = toCOP(product.price);
    const matchesPrice = state.filters.price === "all" || (state.filters.price === "low" && priceCOP <= 2000000) || (state.filters.price === "mid" && priceCOP >= 2000001 && priceCOP <= 6000000) || (state.filters.price === "high" && priceCOP > 6000000);
    return matchesSearch && matchesCategory && matchesPrice;
  });
}

function buildProductCard(product) {
  const card = elements.template.content.firstElementChild.cloneNode(true);
  const image = card.querySelector(".product-image");
  const fallbackThumb = "https://placehold.co/640x420/ecfdf5/059669?text=TecnoMarket";
  if (image) {
    image.src = product.thumbnail || fallbackThumb;
    image.alt = `Imagen de ${product.title}`;
    image.addEventListener("error", () => { image.src = fallbackThumb; }, { once: true });
  }
  card.querySelector(".category-tag").textContent = formatCategory(product.category);
  card.querySelector(".product-brand").textContent = product.brand;
  card.querySelector(".product-title").textContent = product.title;
  card.querySelector(".product-price").textContent = money.format(toCOP(product.price));
  const stock = card.querySelector(".product-stock");
  stock.textContent = `${number.format(product.stock)} en stock`;
  stock.classList.toggle("low", product.stock < 10);
  const edit = card.querySelector(".edit-product");
  const remove = card.querySelector(".delete-product");
  edit.setAttribute("aria-label", `Editar ${product.title}`);
  remove.setAttribute("aria-label", `Eliminar ${product.title}`);
  edit.addEventListener("click", () => handleEdit(product));
  remove.addEventListener("click", () => handleDelete(product));
  return card;
}

function renderCatalog() {
  const visible = getVisibleProducts();
  const fragment = document.createDocumentFragment();
  visible.forEach((product) => fragment.append(buildProductCard(product)));
  elements.grid.replaceChildren(fragment);
  elements.grid.hidden = visible.length === 0;
  elements.empty.hidden = visible.length !== 0;
  elements.resultCount.textContent = `Mostrando ${visible.length} ${visible.length === 1 ? "producto" : "productos"}`;
}

function renderAll() {
  renderDashboard();
  renderCatalog();
}

function populateCategories() {
  const selected = elements.category.value;
  const categories = [...new Set(state.products.map((item) => item.category))].sort((a, b) => a.localeCompare(b, "es"));
  elements.category.replaceChildren(new Option("Todas las categorías", "all"), ...categories.map((category) => new Option(formatCategory(category), category)));
  elements.category.value = categories.includes(selected) ? selected : "all";
  state.filters.category = elements.category.value;
}

async function loadProducts(forceFromAPI = false) {
  elements.reload.disabled = true;
  setConnectionState("loading");

  // Si no se fuerza desde la API y existen datos guardados en el navegador, usarlos
  if (!forceFromAPI) {
    const cached = getStoredProducts();
    if (cached) {
      state.products = cached;
      state.loaded = true;
      populateCategories();
      renderAll();
      setConnectionState("success");
      elements.status.hidden = true;
      elements.reload.disabled = false;
      return;
    }
  }

  showStatus("Consultando el catálogo…", "loading");
  showCatalogSkeletons();
  try {
    const apiProducts = await getProducts();
    state.products = apiProducts;
    state.loaded = true;
    saveProductsToStorage();
    populateCategories();
    renderAll();
    setConnectionState("success");
    elements.status.hidden = true;
  } catch (error) {
    console.error("Error al cargar productos:", error);
    const cached = getStoredProducts();
    if (cached) {
      state.products = cached;
      state.loaded = true;
      populateCategories();
      renderAll();
      setConnectionState("success");
      elements.status.hidden = true;
    } else {
      state.products = [];
      populateCategories();
      renderAll();
      setConnectionState("error");
      showStatus("No fue posible cargar el catálogo. Comprueba tu conexión.", "error");
    }
  } finally {
    elements.reload.disabled = false;
  }
}

async function handleReloadClick() {
  if (!window.Swal) {
    loadProducts(true);
    return;
  }
  const result = await Swal.fire({
    ...swalOptions(),
    icon: "question",
    title: "¿Actualizar catálogo?",
    html: "Puedes restaurar los datos iniciales de DummyJSON o simplemente recargar tus datos locales guardados.",
    showCancelButton: true,
    showDenyButton: true,
    confirmButtonText: "Restaurar API original",
    denyButtonText: "Recargar guardado",
    cancelButtonText: "Cancelar",
    confirmButtonColor: "#059669",
    denyButtonColor: "#475569",
  });
  if (result.isConfirmed) {
    localStorage.removeItem(STORAGE_KEY);
    await loadProducts(true);
    toast("success", "Catálogo original restaurado");
  } else if (result.isDenied) {
    await loadProducts(false);
    toast("success", "Datos locales recargados");
  }
}

/* ─── Image upload handling ─── */
function setupImageUpload() {
  const area = elements.imageUploadArea;
  const fileInput = elements.imageFileInput;
  const urlInput = elements.imageUrlInput;

  // Click to upload
  area.addEventListener("click", (e) => {
    if (e.target === urlInput || e.target === fileInput) return;
    fileInput.click();
  });

  // File selected
  fileInput.addEventListener("change", () => {
    const file = fileInput.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      state.uploadedImageUrl = e.target.result;
      showImagePreview(e.target.result);
      urlInput.value = "";
    };
    reader.readAsDataURL(file);
  });

  // URL input
  urlInput.addEventListener("input", () => {
    const url = urlInput.value.trim();
    if (url) {
      state.uploadedImageUrl = url;
      showImagePreview(url);
    } else {
      state.uploadedImageUrl = "";
      hideImagePreview();
    }
  });

  // Prevent URL click from triggering file dialog
  urlInput.addEventListener("click", (e) => e.stopPropagation());

  // Drag and drop
  area.addEventListener("dragover", (e) => { e.preventDefault(); area.style.borderColor = "var(--primary)"; });
  area.addEventListener("dragleave", () => { area.style.borderColor = ""; });
  area.addEventListener("drop", (e) => {
    e.preventDefault();
    area.style.borderColor = "";
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        state.uploadedImageUrl = ev.target.result;
        showImagePreview(ev.target.result);
      };
      reader.readAsDataURL(file);
    }
  });
}

function showImagePreview(src) {
  elements.imagePreview.src = src;
  elements.imagePreviewContainer.hidden = false;
  elements.imageUploadArea.classList.add("has-image");
}

function hideImagePreview() {
  elements.imagePreview.src = "";
  elements.imagePreviewContainer.hidden = true;
  elements.imageUploadArea.classList.remove("has-image");
}

/* ─── Price input formatting ─── */
function setupPriceInput() {
  elements.priceInput.addEventListener("input", () => {
    const raw = elements.priceInput.value;
    const cursor = elements.priceInput.selectionStart;
    const beforeFormat = raw.length;
    const formatted = formatPriceInput(raw);
    elements.priceInput.value = formatted;
    // Adjust cursor position
    const diff = formatted.length - beforeFormat;
    elements.priceInput.setSelectionRange(cursor + diff, cursor + diff);
  });

  elements.priceInput.addEventListener("keydown", (e) => {
    // Allow: backspace, delete, tab, escape, enter, arrows
    if ([8, 46, 9, 27, 13, 37, 38, 39, 40].includes(e.keyCode)) return;
    // Allow Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
    if ((e.ctrlKey || e.metaKey) && [65, 67, 86, 88].includes(e.keyCode)) return;
    // Block non-numeric characters
    if ((e.keyCode < 48 || e.keyCode > 57) && (e.keyCode < 96 || e.keyCode > 105)) {
      e.preventDefault();
    }
  });
}

async function handleCreate(event) {
  event.preventDefault();

  const priceValue = parsePriceInput(elements.priceInput.value);
  const stockValue = Number($("#stockInput").value);
  const titleValue = $("#titleInput").value.trim();
  const categoryValue = $("#newCategoryInput").value.trim();

  if (!titleValue || titleValue.length < 2 || !categoryValue || categoryValue.length < 2 || priceValue <= 0 || stockValue < 0) {
    if (elements.form.checkValidity && !elements.form.checkValidity()) {
      elements.form.reportValidity();
    }
    toast("warning", "Revisa los campos obligatorios");
    return;
  }

  const thumbnailUrl = state.uploadedImageUrl || elements.imageUrlInput.value.trim() || "https://placehold.co/640x420/eef2ff/4f46e5?text=Nuevo+producto";

  const product = {
    title: titleValue,
    category: categoryValue.toLocaleLowerCase("es").replaceAll(" ", "-"),
    brand: ($("#brandInput").value.trim()) || "Marca no indicada",
    price: priceValue / USD_TO_COP, // Convert COP back to USD for API
    stock: stockValue,
    thumbnail: thumbnailUrl,
  };

  elements.submit.disabled = true;
  elements.submit.querySelector("span").textContent = "Registrando…";
  try {
    let created;
    try {
      created = await addProduct(product);
    } catch (err) {
      console.warn("Error API al registrar, guardando en local:", err);
      created = { id: Date.now() };
    }
    const newProduct = { ...product, id: (created && created.id) ? created.id : Date.now(), isLocal: true };
    state.products.unshift(newProduct);
    saveProductsToStorage();
    elements.form.reset();
    state.uploadedImageUrl = "";
    hideImagePreview();
    populateCategories();
    renderAll();
    toast("success", `"${product.title}" fue registrado`);
    setActiveView("catalog");
  } catch (error) {
    console.error(error);
    if (window.Swal) await Swal.fire({ ...swalOptions(), icon: "error", title: "No se pudo registrar", text: "Comprueba tu conexión e inténtalo nuevamente." });
  } finally {
    elements.submit.disabled = false;
    elements.submit.querySelector("span").textContent = "Registrar producto";
  }
}

async function handleEdit(product) {
  if (!window.Swal) return;
  const priceCOP = toCOP(product.price);
  const result = await Swal.fire({
    ...swalOptions(),
    title: "Editar producto",
    html: `
      <div class="edit-form-grid">
        <div class="edit-field">
          <label for="swal-title">Título</label>
          <input id="swal-title" aria-label="Título" placeholder="Título del producto" value="${escapeHtml(product.title)}">
        </div>
        <div class="edit-field-row">
          <div class="edit-field">
            <label for="swal-brand">Marca</label>
            <input id="swal-brand" aria-label="Marca" placeholder="Marca" value="${escapeHtml(product.brand)}">
          </div>
          <div class="edit-field">
            <label for="swal-category">Categoría</label>
            <input id="swal-category" aria-label="Categoría" placeholder="Categoría" value="${escapeHtml(product.category)}">
          </div>
        </div>
        <div class="edit-field-row">
          <div class="edit-field">
            <label for="swal-price">Precio (COP)</label>
            <input id="swal-price" aria-label="Precio" type="text" inputmode="numeric" value="${formatPriceInput(priceCOP)}">
          </div>
          <div class="edit-field">
            <label for="swal-stock">Stock</label>
            <input id="swal-stock" aria-label="Stock" type="number" min="0" step="1" value="${product.stock}">
          </div>
        </div>
        <div class="edit-field">
          <label for="swal-thumbnail">URL de imagen <small style="font-weight:400;opacity:.7">(opcional)</small></label>
          <input id="swal-thumbnail" aria-label="Imagen" type="url" placeholder="https://..." value="${escapeHtml(product.thumbnail || "")}">
        </div>
      </div>
    `,
    showCancelButton: true,
    confirmButtonText: "Guardar cambios",
    cancelButtonText: "Cancelar",
    focusConfirm: false,
    width: "520px",
    showLoaderOnConfirm: true,
    didOpen: () => {
      // Setup price formatting in the edit modal
      const priceEl = document.getElementById("swal-price");
      priceEl.addEventListener("input", () => {
        const cursor = priceEl.selectionStart;
        const beforeLen = priceEl.value.length;
        priceEl.value = formatPriceInput(priceEl.value);
        const diff = priceEl.value.length - beforeLen;
        priceEl.setSelectionRange(cursor + diff, cursor + diff);
      });
    },
    preConfirm: () => {
      const editPriceCOP = parsePriceInput($("#swal-price").value);
      const changes = {
        title: $("#swal-title").value.trim(),
        brand: $("#swal-brand").value.trim() || "Marca no indicada",
        category: $("#swal-category").value.trim().toLocaleLowerCase("es").replaceAll(" ", "-"),
        price: editPriceCOP / USD_TO_COP,
        stock: Number($("#swal-stock").value),
        thumbnail: $("#swal-thumbnail").value.trim() || product.thumbnail,
      };
      if (changes.title.length < 2 || changes.category.length < 2 || editPriceCOP <= 0 || changes.stock < 0) {
        Swal.showValidationMessage("Completa datos válidos: título, categoría, precio mayor a cero y stock no negativo.");
        return false;
      }
      return changes;
    },
    allowOutsideClick: () => !Swal.isLoading(),
  });
  if (!result.isConfirmed) return;

  try {
    if (!product.isLocal) {
      try { await updateProduct(product.id, result.value); } catch (e) { console.warn("API offline:", e); }
    }
    state.products = state.products.map((item) => item.id === product.id ? { ...item, ...result.value } : item);
    saveProductsToStorage();
    populateCategories();
    renderAll();
    toast("success", "Cambios guardados correctamente");
  } catch (error) {
    console.error(error);
    await Swal.fire({ ...swalOptions(), icon: "error", title: "No se pudo editar", text: "La información original se conservó sin cambios." });
  }
}

async function handleDelete(product) {
  const result = window.Swal
    ? await Swal.fire({ ...swalOptions(), icon: "warning", title: "¿Eliminar producto?", html: `Se retirará <strong>${escapeHtml(product.title)}</strong> del catálogo.`, showCancelButton: true, confirmButtonText: "Sí, eliminar", cancelButtonText: "Cancelar", confirmButtonColor: "#dc2626" })
    : { isConfirmed: window.confirm(`¿Eliminar ${product.title}?`) };
  if (!result.isConfirmed) return;

  try {
    if (!product.isLocal) {
      try { await deleteProduct(product.id); } catch (e) { console.warn("API offline:", e); }
    }
    state.products = state.products.filter((item) => item.id !== product.id);
    saveProductsToStorage();
    populateCategories();
    renderAll();
    toast("success", "Producto eliminado del catálogo");
  } catch (error) {
    console.error(error);
    if (window.Swal) await Swal.fire({ ...swalOptions(), icon: "error", title: "No se pudo eliminar", text: "El producto se conservó en el catálogo." });
  }
}

function toggleSidebarCollapse() {
  const isCollapsed = elements.dashboardApp.classList.toggle("sidebar-collapsed");
  localStorage.setItem("tm_sidebar_collapsed", isCollapsed ? "true" : "false");
}

function clearFilters() {
  state.filters = { search: "", category: "all", price: "all" };
  elements.search.value = "";
  elements.globalSearch.value = "";
  elements.category.value = "all";
  elements.price.value = "all";
  renderCatalog();
}

/* ─── Event Listeners ─── */
elements.loginForm.addEventListener("submit", handleLogin);
elements.passwordToggle.addEventListener("click", togglePassword);
elements.themeButtons.forEach((button) => button?.addEventListener("click", toggleTheme));
elements.menuButton.addEventListener("click", openSidebar);
elements.sidebarClose.addEventListener("click", closeSidebar);
elements.sidebarBackdrop.addEventListener("click", closeSidebar);
elements.sidebarCollapseBtn?.addEventListener("click", toggleSidebarCollapse);
elements.logout.addEventListener("click", handleLogout);
elements.reload.addEventListener("click", handleReloadClick);
elements.form.addEventListener("submit", handleCreate);
elements.clearFilters.addEventListener("click", clearFilters);
$("[data-clear-filters]").addEventListener("click", clearFilters);

$$(".nav-item").forEach((button) => button.addEventListener("click", () => setActiveView(button.dataset.view)));
$$('[data-go-view]').forEach((button) => button.addEventListener("click", () => setActiveView(button.dataset.goView)));

elements.search.addEventListener("input", (event) => {
  state.filters.search = event.target.value;
  elements.globalSearch.value = event.target.value;
  renderCatalog();
});
elements.globalSearch.addEventListener("input", (event) => {
  state.filters.search = event.target.value;
  elements.search.value = event.target.value;
  if (event.target.value.trim()) setActiveView("catalog");
  renderCatalog();
});
elements.category.addEventListener("change", (event) => { state.filters.category = event.target.value; renderCatalog(); });
elements.price.addEventListener("change", (event) => { state.filters.price = event.target.value; renderCatalog(); });

elements.recentBody.addEventListener("click", (event) => {
  const editButton = event.target.closest("[data-edit-id]");
  const deleteButton = event.target.closest("[data-delete-id]");
  if (editButton) handleEdit(state.products.find((item) => item.id === Number(editButton.dataset.editId)));
  if (deleteButton) handleDelete(state.products.find((item) => item.id === Number(deleteButton.dataset.deleteId)));
});

document.addEventListener("keydown", (event) => {
  if ((event.ctrlKey || event.metaKey) && event.key.toLocaleLowerCase() === "k" && !elements.dashboardApp.hidden) {
    event.preventDefault();
    elements.globalSearch.focus();
  }
  if (event.key === "Escape") closeSidebar();
});

/* ─── Reset form handler ─── */
elements.form.addEventListener("reset", () => {
  window.setTimeout(() => {
    state.uploadedImageUrl = "";
    hideImagePreview();
    elements.priceInput.value = "";
  }, 10);
});

/* ─── Initialize ─── */
setTheme(localStorage.getItem("tm-theme") || "light");
setupPriceInput();
setupImageUpload();
if (localStorage.getItem("tm_sidebar_collapsed") === "true") {
  elements.dashboardApp.classList.add("sidebar-collapsed");
}
if (sessionStorage.getItem("tm-authenticated") === "true") openDashboard(); else openLogin();
