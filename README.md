# TecnoMarket Dashboard

Panel administrativo académico para consultar y gestionar un catálogo mediante la API de demostración [DummyJSON](https://dummyjson.com/docs/products).

## Acceso

- Usuario: `admin`
- Contraseña: `admin123`

El acceso es una simulación local para fines académicos. Las credenciales no se transmiten ni sustituyen un sistema de autenticación real.

## Cómo ejecutar

1. Abra `tecnomarket-examen` en Visual Studio Code.
2. Abra `index.html` con **Live Server**.
3. Ingrese con las credenciales indicadas arriba.
4. Mantenga conexión a Internet para consultar DummyJSON, cargar imágenes y usar SweetAlert2.

## Funciones incluidas

- Login interactivo con validación, estado de carga y sesión durante la pestaña actual.
- Tema claro predeterminado y modo oscuro persistente mediante `localStorage`.
- Dashboard con valor del inventario, precio promedio, stock bajo y categorías.
- Gráfico de distribución por categoría y control de salud del inventario.
- Vista de estadísticas con categorías, rangos de precio e indicadores adicionales.
- GET de 12 productos mediante `fetch()`, JSON y `async/await`.
- Búsqueda por título o marca y filtros combinables por categoría y precio.
- Contador actualizado de resultados visibles.
- Registro mediante POST y actualización inmediata del estado local.
- Edición mediante PATCH con formulario de SweetAlert2.
- Eliminación mediante DELETE y confirmación de SweetAlert2.
- Botón para recargar el catálogo sin recargar la página.
- Estados visibles de carga, éxito, vacío y error.
- Navegación responsive con menú lateral adaptable a móviles.

## Estructura

```text
tecnomarket-examen/
├── index.html        # Login, dashboard y vistas operativas
├── css/
│   └── styles.css    # Sistema visual claro/oscuro y responsive
├── js/
│   ├── api.js        # GET, POST, PATCH y DELETE
│   └── app.js        # Sesión, estado, eventos, estadísticas y DOM
├── PRODUCT.md        # Contexto estable del producto
├── DESIGN.md         # Sistema visual documentado
└── README.md
```

## Flujo de datos

Después del acceso, `app.js` solicita los productos a las funciones de `api.js`. La respuesta HTTP se valida con `response.ok`, se convierte mediante `response.json()` y se normaliza a un modelo consistente. El estado local alimenta las tarjetas, la tabla, los filtros y todas las estadísticas.

Las operaciones POST, PATCH y DELETE se procesan con `async/await`. La interfaz solo actualiza el estado cuando la operación termina correctamente y siempre muestra una confirmación o un error comprensible.

## Nota sobre DummyJSON

DummyJSON simula las operaciones de escritura. Los productos creados, editados o eliminados no se conservan en una base de datos real y el catálogo vuelve a su estado original al recargarlo.

## Pruebas rápidas

1. Probar credenciales incorrectas y luego ingresar con `admin` / `admin123`.
2. Cambiar entre tema claro y oscuro y recargar la página.
3. Buscar `mascara` y revisar el contador.
4. Combinar categoría y rango de precio.
5. Registrar un producto y comprobar métricas y catálogo.
6. Editar título, precio o stock desde SweetAlert2.
7. Eliminar un producto y cancelar otra eliminación.
8. Abrir Estadísticas y verificar que los valores coincidan con el catálogo.
9. Desconectar Internet y utilizar **Actualizar** para comprobar el estado de error.

# mn2optativa
