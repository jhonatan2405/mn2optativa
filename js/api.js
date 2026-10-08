const API_BASE_URL = "https://dummyjson.com/products";

/**
 * Convierte las respuestas de la API a un modelo consistente para la interfaz.
 */
function normalizeProduct(product) {
  return {
    id: Number(product.id),
    title: String(product.title || "Producto sin nombre"),
    category: String(product.category || "sin-categoria"),
    price: Number(product.price) || 0,
    stock: Number(product.stock) || 0,
    brand: String(product.brand || "Marca no indicada"),
    thumbnail: String(product.thumbnail || ""),
  };
}

async function parseResponse(response, operation) {
  if (!response.ok) {
    throw new Error(`${operation} falló: HTTP ${response.status}`);
  }
  return response.json();
}

async function getProducts() {
  const response = await fetch(`${API_BASE_URL}?limit=12`);
  const data = await parseResponse(response, "La consulta del catálogo");
  return (data.products || []).map(normalizeProduct);
}

async function addProduct(product) {
  const response = await fetch(`${API_BASE_URL}/add`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(product),
  });
  const data = await parseResponse(response, "El registro del producto");
  return normalizeProduct(data);
}

async function updateProduct(id, changes) {
  const response = await fetch(`${API_BASE_URL}/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(changes),
  });
  const data = await parseResponse(response, "La edición del producto");
  return normalizeProduct({ ...changes, ...data, id });
}

async function deleteProduct(id) {
  const response = await fetch(`${API_BASE_URL}/${id}`, { method: "DELETE" });
  return parseResponse(response, "La eliminación del producto");
}
