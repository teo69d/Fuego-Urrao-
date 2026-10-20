let esAdmin = false;
let carrito = [];
let productos = [];
let categoriaActual = "todos";
let productoSeleccionado = null;

const numeroWhatsApp = "573233626933";

// ========================================
// CARGAR LOS PRODUCTOS
// ========================================

document.addEventListener("DOMContentLoaded", function () {
    cargarProductos();
    cargarTemas();
    actualizarVistaCarrito();
    restaurarSesionAdmin();
});

async function cargarProductos() {
    try {
        const respuesta = await fetch("obtener_productos.php");

        if (!respuesta.ok) {
            throw new Error("No se pudieron cargar los productos.");
        }

        productos = await respuesta.json();

        if (!Array.isArray(productos)) {
            throw new Error("La respuesta de productos no es válida.");
        }

        renderizarProductos();

    } catch (error) {
        console.error("Error al cargar los productos:", error);

        const grid = document.getElementById("grid-productos");

        if (grid) {
            grid.textContent =
                "No se pudieron cargar los productos. Revisa la conexión con la base de datos.";
        }
    }
}

// ========================================
// INVENTARIO: OBTENER LAS EXISTENCIAS
// ========================================

function obtenerStock(producto) {
    const stock = Number(producto.stock);

    if (!Number.isInteger(stock) || stock < 0) {
        return 0;
    }

    return stock;
}

// ========================================
// INVENTARIO: DETERMINAR DISPONIBILIDAD
// ========================================

function obtenerEstadoStock(producto) {
    const stock = obtenerStock(producto);

    if (stock === 0) {
        return {
            mensaje: "Agotado",
            clase: "stock-agotado"
        };
    }

    if (stock <= 5) {
        return {
            mensaje: "Últimas unidades",
            clase: "stock-ultimas-unidades"
        };
    }

    return {
        mensaje: "Disponible",
        clase: "stock-disponible"
    };
}

// ========================================
// CREAR EL MENSAJE DE INVENTARIO
// ========================================

function crearMensajeStock(producto) {
    const estado = obtenerEstadoStock(producto);

    const mensaje = document.createElement("p");

    mensaje.className = "estado-stock " + estado.clase;
    mensaje.textContent = estado.mensaje;

    return mensaje;
}

// ========================================
// MOSTRAR LOS PRODUCTOS
// ========================================

function renderizarProductos(categoriaFiltro = categoriaActual) {
    const grid = document.getElementById("grid-productos");

    if (!grid) {
        return;
    }

    categoriaActual = categoriaFiltro;

    grid.innerHTML = "";

    const productosFiltrados = productos.filter(function (producto) {
        return categoriaFiltro === "todos" ||
            producto.categoria === categoriaFiltro;
    });

    if (productosFiltrados.length === 0) {
        grid.textContent = "No hay productos en esta categoría.";
        return;
    }

    productosFiltrados.forEach(function (producto) {
        const tarjeta = document.createElement("article");

        tarjeta.className = "tarjeta";

        // Imagen del producto

        const imagen = document.createElement("img");

        imagen.src = obtenerRutaImagen(producto.imagen);
        imagen.alt = producto.nombre;
        imagen.className = "img-producto";
        imagen.loading = "lazy";

        imagen.onerror = function () {
            this.onerror = null;

            this.src =
                "https://placehold.co/300x300?text=Imagen+no+disponible";
        };

        // Nombre

        const nombre = document.createElement("h3");

        nombre.textContent = producto.nombre;

        // Precio

        const precio = document.createElement("p");

        precio.className = "precio";

        precio.textContent =
            "$" + Number(producto.precio).toLocaleString("es-CO");

        // Mostrar el estado del inventario

        const mensajeStock = crearMensajeStock(producto);

        // Botón de detalles

        const botonDetalles = document.createElement("button");

        botonDetalles.className = "btn-comprar";
        botonDetalles.textContent = "Ver detalles";
        botonDetalles.type = "button";

        botonDetalles.addEventListener("click", function () {
            abrirDetalleProducto(producto.id);
        });

        // Agregar elementos a la tarjeta

        tarjeta.appendChild(imagen);
        tarjeta.appendChild(nombre);
        tarjeta.appendChild(precio);
        tarjeta.appendChild(mensajeStock);
        tarjeta.appendChild(botonDetalles);

        // Botones de administración

        if (esAdmin) {
            const botonesAdmin = document.createElement("div");

            const botonEditar = document.createElement("button");

            botonEditar.textContent = "Editar";
            botonEditar.className = "btn-admin-accion btn-editar";
            botonEditar.type = "button";

            botonEditar.onclick = function () {
                cargarParaEditar(producto.id);
            };

            const botonEliminar = document.createElement("button");

            botonEliminar.textContent = "Eliminar";
            botonEliminar.className = "btn-admin-accion btn-eliminar";
            botonEliminar.type = "button";

            botonEliminar.onclick = function () {
                eliminarProductoAdmin(producto.id);
            };

            botonesAdmin.appendChild(botonEditar);
            botonesAdmin.appendChild(botonEliminar);

            tarjeta.appendChild(botonesAdmin);
        }

        grid.appendChild(tarjeta);
    });
}

// ========================================
// OBTENER UNA RUTA DE IMAGEN VÁLIDA
// ========================================

function obtenerRutaImagen(imagen) {
    if (!imagen) {
        return "https://placehold.co/300x300?text=Imagen+no+disponible";
    }

    let ruta = String(imagen).trim();

    if (
        ruta.toLowerCase().includes("fakepath") ||
        ruta.toLowerCase().startsWith("file:")
    ) {
        return "https://placehold.co/300x300?text=Imagen+no+disponible";
    }

    return ruta;
}

// ========================================
// FILTRAR PRODUCTOS POR CATEGORÍA
// ========================================

function filtrarProductos(categoria) {
    renderizarProductos(categoria);
}

// ========================================
// MOSTRAR LOS DETALLES DEL PRODUCTO
// ========================================

function abrirDetalleProducto(id) {
    const producto = productos.find(function (item) {
        return Number(item.id) === Number(id);
    });

    if (!producto) {
        alert("No se encontró el producto.");
        return;
    }

    productoSeleccionado = producto;

    // Imagen

    const imagen = document.getElementById("detalle-imagen");

    if (imagen) {
        imagen.src = obtenerRutaImagen(producto.imagen);
        imagen.alt = producto.nombre;

        imagen.onerror = function () {
            this.onerror = null;

            this.src =
                "https://placehold.co/300x300?text=Imagen+no+disponible";
        };
    }

    // Nombre

    const nombre = document.getElementById("detalle-nombre");

    if (nombre) {
        nombre.textContent = producto.nombre;
    }

    // Descripción

    const descripcion = document.getElementById("detalle-descripcion");

    if (descripcion) {
        descripcion.textContent =
            producto.descripcion || "Sin descripción disponible.";
    }
        // Presentación

    const presentacion = document.getElementById("detalle-presentacion");

    if (presentacion) {
        presentacion.textContent =
            producto.presentacion || "Consultar disponibilidad";
    }

    // Precio

    const precio = document.getElementById("detalle-precio");

    if (precio) {
        precio.textContent =
            Number(producto.precio).toLocaleString("es-CO");
    }

    // Mostrar inventario en la ventana de detalles

    mostrarStockEnDetalles(producto);

    // Abrir ventana

    const modal = document.getElementById("modal-producto");

    if (modal) {
        modal.style.display = "flex";
    }
}


// ========================================
// MOSTRAR INVENTARIO EN LOS DETALLES
// ========================================

function mostrarStockEnDetalles(producto) {
    const modal = document.getElementById("modal-producto");

    if (!modal) {
        return;
    }

    let mensajeStock = document.getElementById("detalle-stock");

    if (!mensajeStock) {
        mensajeStock = document.createElement("p");

        mensajeStock.id = "detalle-stock";
        mensajeStock.className = "estado-stock";

        const precio = document.getElementById("detalle-precio");

        if (precio) {
            const contenedorPrecio = precio.closest("p");

            if (contenedorPrecio) {
                contenedorPrecio.insertAdjacentElement(
                    "afterend",
                    mensajeStock
                );
            } else {
                modal.appendChild(mensajeStock);
            }
        } else {
            modal.appendChild(mensajeStock);
        }
    }

    const estado = obtenerEstadoStock(producto);

    mensajeStock.textContent = estado.mensaje;
    mensajeStock.className = "estado-stock " + estado.clase;
}


// ========================================
// CERRAR LOS DETALLES
// ========================================

function cerrarDetalleProducto() {
    const modal = document.getElementById("modal-producto");

    if (modal) {
        modal.style.display = "none";
    }

    productoSeleccionado = null;
}


// ========================================
// AGREGAR PRODUCTO DESDE SUS DETALLES
// ========================================

function agregarProductoDesdeDetalle() {
    if (!productoSeleccionado) {
        return;
    }

    const agregado = agregarProducto(
        productoSeleccionado.id,
        productoSeleccionado.nombre,
        Number(productoSeleccionado.precio)
    );

    if (agregado) {
        cerrarDetalleProducto();
        abrirCarrito();
    }
}


// ========================================
// INICIAR SESIÓN COMO ADMINISTRADORA
// ========================================

function abrirLogin() {
    const modal = document.getElementById("modal-login");

    if (modal) {
        modal.style.display = "flex";
    }
}


function cerrarLogin() {
    const modal = document.getElementById("modal-login");

    if (modal) {
        modal.style.display = "none";
    }
}


async function validarLogin(evento) {
    evento.preventDefault();

    const datos = new FormData();
    datos.append("usuario", document.getElementById("usuario").value);
    datos.append("password", document.getElementById("password").value);

    try {
        const respuesta = await fetch("admin_login.php", {
            method: "POST",
            body: datos
        });
        const resultado = await respuesta.json();

        if (!respuesta.ok || resultado.error) {
            throw new Error(resultado.error || "No se pudo iniciar sesión.");
        }

        esAdmin = true;

        const panel = document.getElementById("panel-admin");

        if (panel) {
            panel.style.display = "block";
        }

        cerrarLogin();
        renderizarProductos();
        document.getElementById("password").value = "";

        alert(resultado.mensaje || "Bienvenida, administradora.");

    } catch (error) {
        console.error("Error al iniciar sesión:", error);
        alert(error.message || "No se pudo iniciar sesión.");
    }
}

async function restaurarSesionAdmin() {
    try {
        const respuesta = await fetch("admin_status.php");
        const resultado = await respuesta.json();

        if (!respuesta.ok) {
            throw new Error(resultado.error || "No se pudo verificar la sesión.");
        }

        esAdmin = resultado.autenticado === true;

        const panel = document.getElementById("panel-admin");

        if (panel) {
            panel.style.display = esAdmin ? "block" : "none";
        }

        renderizarProductos();
    } catch (error) {
        esAdmin = false;
        console.error("Error al verificar la sesión administrativa:", error);
    }
}

async function cerrarSesion() {
    try {
        const respuesta = await fetch("admin_logout.php", {
            method: "POST"
        });
        const resultado = await respuesta.json();

        if (!respuesta.ok || resultado.error) {
            throw new Error(resultado.error || "No se pudo cerrar la sesión.");
        }

        alert(resultado.mensaje || "Sesión cerrada.");
    } catch (error) {
        console.error("Error al cerrar sesión:", error);
        alert(error.message || "No se pudo cerrar la sesión.");
    } finally {
        esAdmin = false;

        const panel = document.getElementById("panel-admin");

        if (panel) {
            panel.style.display = "none";
        }

        renderizarProductos();
    }
}
// ========================================
// GUARDAR UN PRODUCTO NUEVO O ACTUALIZARLO
// ========================================

async function guardarProducto(evento) {
    evento.preventDefault();

    if (!esAdmin) {
        alert("Debes iniciar sesión como administradora.");
        return;
    }

    const campoId = document.getElementById("prod-id");
    const campoNombre = document.getElementById("prod-nombre");
    const campoDescripcion = document.getElementById("prod-descripcion");
    const campoPresentacion = document.getElementById("prod-presentacion");
    const campoPrecio = document.getElementById("prod-precio");
    const campoCategoria = document.getElementById("prod-categoria");
    const campoStock = document.getElementById("prod-stock");
    const campoImagen = document.getElementById("prod-imagen");

    if (
        !campoId ||
        !campoNombre ||
        !campoDescripcion ||
        !campoPresentacion ||
        !campoPrecio ||
        !campoCategoria ||
        !campoStock ||
        !campoImagen
    ) {
        alert("No se encontraron todos los campos del formulario.");
        return;
    }

    const id = campoId.value.trim();
    const nombre = campoNombre.value.trim();
    const descripcion = campoDescripcion.value.trim();
    const presentacion = campoPresentacion.value.trim();
    const precio = Number(campoPrecio.value);
    const categoria = campoCategoria.value;
    const valorStock = campoStock.value.trim();
    const stock = Number(valorStock);

    const archivoImagen = campoImagen.files[0];

    // Validar los campos

    if (
        nombre === "" ||
        descripcion === "" ||
        presentacion === "" ||
        !Number.isFinite(precio) ||
        precio <= 0 ||
        categoria === "" ||
        valorStock === "" ||
        !Number.isInteger(stock) ||
        stock < 0
    ) {
        alert(
            "Completa los campos correctamente. Revisa el precio y las existencias."
        );

        return;
    }

    // La imagen es obligatoria para los productos nuevos

    if (id === "" && !archivoImagen) {
        alert("Selecciona una imagen para el producto.");
        return;
    }

    // Validar el archivo seleccionado

    if (archivoImagen) {
        const tiposPermitidos = [
            "image/jpeg",
            "image/png",
            "image/webp",
            "image/gif"
        ];

        if (!tiposPermitidos.includes(archivoImagen.type)) {
            alert("Selecciona una imagen JPG, PNG, WEBP o GIF.");
            return;
        }

        if (archivoImagen.size > 5 * 1024 * 1024) {
            alert("La imagen no puede pesar más de 5 MB.");
            return;
        }
    }

    // Preparar los datos para enviarlos a PHP

    const datos = new FormData();

    datos.append("nombre", nombre);
    datos.append("descripcion", descripcion);
    datos.append("presentacion", presentacion);
    datos.append("precio", String(precio));
    datos.append("categoria", categoria);
    datos.append("stock", String(stock));

    if (id !== "") {
        datos.append("id", id);
    }

    if (archivoImagen) {
        datos.append("imagen", archivoImagen);
    }

    let direccion = "guardar_producto.php";

    let mensajeExito = "Producto agregado correctamente.";

    if (id !== "") {
        direccion = "actualizar_producto.php";

        mensajeExito = "Producto actualizado correctamente.";
    }

    try {
        const respuesta = await fetch(direccion, {
            method: "POST",
            body: datos
        });

        const resultado = await respuesta.json();

        if (!respuesta.ok || resultado.error) {
            throw new Error(
                resultado.mensaje ||
                resultado.error ||
                "No se pudo guardar el producto."
            );
        }

        alert(resultado.mensaje || mensajeExito);

        // Recargar los productos desde MySQL

        await cargarProductos();

        // Limpiar el formulario

        limpiarFormularioProducto();

    } catch (error) {
        console.error("Error al guardar el producto:", error);

        alert(
            "No se pudo guardar el producto. Revisa la consola y los archivos PHP."
        );
    }
}


// ========================================
// LIMPIAR EL FORMULARIO
// ========================================

function limpiarFormularioProducto() {
    const formulario = document.getElementById("form-producto");

    if (formulario) {
        formulario.reset();
    }

    const campoId = document.getElementById("prod-id");

    if (campoId) {
        campoId.value = "";
    }

    const titulo = document.getElementById("form-titulo");

    if (titulo) {
        titulo.textContent = "Agregar nuevo producto";
    }

    const botonGuardar = document.getElementById("btn-guardar-producto");

    if (botonGuardar) {
        botonGuardar.textContent = "Guardar producto";
    }
}


// ========================================
// CARGAR UN PRODUCTO PARA EDITAR
// ========================================

function cargarParaEditar(id) {
    if (!esAdmin) {
        alert("Debes iniciar sesión como administradora.");
        return;
    }

    const producto = productos.find(function (item) {
        return Number(item.id) === Number(id);
    });

    if (!producto) {
        alert("No se encontró el producto que deseas editar.");
        return;
    }

    document.getElementById("prod-id").value = producto.id;

    document.getElementById("prod-nombre").value =
        producto.nombre;

    document.getElementById("prod-descripcion").value =
        producto.descripcion || "";

    document.getElementById("prod-presentacion").value =
        producto.presentacion || "";

    document.getElementById("prod-precio").value =
        producto.precio;

    document.getElementById("prod-categoria").value =
        producto.categoria;

    const campoStock = document.getElementById("prod-stock");

    if (campoStock) {
        campoStock.value = producto.stock ?? 0;
    }

    // No rellenar automáticamente el campo de imagen

    document.getElementById("prod-imagen").value = "";

    const titulo = document.getElementById("titulo-formulario");

    if (titulo) {
        titulo.textContent = "Editar producto";
    }

    const botonGuardar = document.getElementById("btn-guardar-producto");

    if (botonGuardar) {
        botonGuardar.textContent = "Actualizar producto";
    }

    const formulario = document.getElementById("form-producto");

    if (formulario) {
        formulario.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    }
}


// ========================================
// ELIMINAR UN PRODUCTO
// ========================================

async function eliminarProductoAdmin(id) {
    if (!esAdmin) {
        alert("Debes iniciar sesión como administradora.");
        return;
    }

    const producto = productos.find(function (item) {
        return Number(item.id) === Number(id);
    });

    if (!producto) {
        alert("No se encontró el producto.");
        return;
    }

    const confirmar = confirm(
        "¿Estás segura de que deseas eliminar " +
        producto.nombre +
        "?"
    );

    if (!confirmar) {
        return;
    }

    try {
        const respuesta = await fetch("eliminar_producto.php", {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                id: id
            })
        });

        const resultado = await respuesta.json();

        if (!respuesta.ok || resultado.error) {
            throw new Error(
                resultado.mensaje ||
                resultado.error ||
                "No se pudo eliminar el producto."
            );
        }

        alert(
            resultado.mensaje ||
            "Producto eliminado correctamente."
        );

        await cargarProductos();

    } catch (error) {
        console.error("Error al eliminar el producto:", error);

        alert(
            "No se pudo eliminar el producto. Revisa eliminar_producto.php."
        );
    }
}// ========================================
// AGREGAR PRODUCTOS AL CARRITO
// ========================================

function agregarProducto(id, nombre, precio) {
    const producto = productos.find(function (item) {
        return Number(item.id) === Number(id);
    });

    if (!producto) {
        alert("No se encontró el producto.");
        return false;
    }

    // Revisar si hay existencias disponibles

    const stock = obtenerStock(producto);

    const cantidadEnCarrito = carrito
        .filter(function (item) {
            return Number(item.id) === Number(id);
        })
        .reduce(function (total, item) {
            return total + item.cantidad;
        }, 0);

    if (cantidadEnCarrito >= stock) {
        alert("No hay suficientes unidades disponibles.");
        return false;
    }

    // Buscar si el producto ya está en el carrito

    const productoEnCarrito = carrito.find(function (item) {
        return Number(item.id) === Number(id);
    });

    if (productoEnCarrito) {
        productoEnCarrito.cantidad++;
    } else {
        carrito.push({
            id: producto.id,
            nombre: producto.nombre,
            precio: Number(producto.precio),
            cantidad: 1
        });
    }

    actualizarVistaCarrito();

    alert("Producto agregado al carrito.");

    return true;
}


// ========================================
// ELIMINAR PRODUCTOS DEL CARRITO
// ========================================

function eliminarProducto(indice) {
    if (
        !Number.isInteger(indice) ||
        indice < 0 ||
        indice >= carrito.length
    ) {
        return;
    }

    carrito.splice(indice, 1);

    actualizarVistaCarrito();
}


// ========================================
// CAMBIAR LA CANTIDAD DE UN PRODUCTO
// ========================================

function cambiarCantidad(indice, cambio) {
    if (
        !Number.isInteger(indice) ||
        indice < 0 ||
        indice >= carrito.length
    ) {
        return;
    }

    const item = carrito[indice];

    const producto = productos.find(function (producto) {
        return Number(producto.id) === Number(item.id);
    });

    if (!producto) {
        alert("Este producto ya no está disponible.");
        return;
    }

    const nuevaCantidad = item.cantidad + cambio;

    // Si la cantidad es cero, eliminar el producto

    if (nuevaCantidad <= 0) {
        eliminarProducto(indice);
        return;
    }

    // Revisar las existencias disponibles

    if (nuevaCantidad > obtenerStock(producto)) {
        alert("No hay suficientes unidades disponibles.");
        return;
    }

    item.cantidad = nuevaCantidad;

    actualizarVistaCarrito();
}


// ========================================
// CALCULAR EL TOTAL DE LA COMPRA
// ========================================

function calcularTotalCarrito() {
    let total = 0;

    carrito.forEach(function (item) {
        total += item.precio * item.cantidad;
    });

    return total;
}


// ========================================
// CONTAR LOS PRODUCTOS DEL CARRITO
// ========================================

function contarProductosCarrito() {
    let cantidad = 0;

    carrito.forEach(function (item) {
        cantidad += item.cantidad;
    });

    return cantidad;
}


// ========================================
// ACTUALIZAR LA VISTA DEL CARRITO
// ========================================

function actualizarVistaCarrito() {
    const lista = document.getElementById("lista-carrito");

    const totalElemento = document.getElementById("total-carrito");

    const contador = document.getElementById("contador-carrito");

    // Actualizar el contador

    if (contador) {
        contador.textContent = contarProductosCarrito();
    }

    // Si no existe la lista, terminar

    if (!lista) {
        if (totalElemento) {
            totalElemento.textContent =
                "$" + calcularTotalCarrito().toLocaleString("es-CO");
        }

        return;
    }

    // Limpiar la lista

    lista.innerHTML = "";

    // Mostrar mensaje si está vacío

    if (carrito.length === 0) {
        const mensaje = document.createElement("p");

        mensaje.textContent = "Tu carrito está vacío.";

        lista.appendChild(mensaje);
    }

    // Mostrar los productos

    carrito.forEach(function (item, indice) {
        const fila = document.createElement("div");

        fila.className = "producto-carrito";

        const nombre = document.createElement("p");

        nombre.textContent = item.nombre;

        const precio = document.createElement("p");

        precio.textContent =
            "Precio: $" +
            item.precio.toLocaleString("es-CO");

        const cantidad = document.createElement("p");

        cantidad.textContent = "Cantidad: " + item.cantidad;

        const subtotal = document.createElement("p");

        subtotal.textContent =
            "Subtotal: $" +
            (item.precio * item.cantidad).toLocaleString("es-CO");

        // Botón para disminuir la cantidad

        const botonMenos = document.createElement("button");

        botonMenos.type = "button";
        botonMenos.textContent = "-";

        botonMenos.addEventListener("click", function () {
            cambiarCantidad(indice, -1);
        });

        // Botón para aumentar la cantidad

        const botonMas = document.createElement("button");

        botonMas.type = "button";
        botonMas.textContent = "+";

        botonMas.addEventListener("click", function () {
            cambiarCantidad(indice, 1);
        });

        // Botón para eliminar el producto

        const botonEliminar = document.createElement("button");

        botonEliminar.type = "button";
        botonEliminar.textContent = "Eliminar";

        botonEliminar.addEventListener("click", function () {
            eliminarProducto(indice);
        });

        // Agregar elementos a la fila

        fila.appendChild(nombre);
        fila.appendChild(precio);
        fila.appendChild(cantidad);
        fila.appendChild(subtotal);
        fila.appendChild(botonMenos);
        fila.appendChild(botonMas);
        fila.appendChild(botonEliminar);

        lista.appendChild(fila);
    });

    // Actualizar el total

    if (totalElemento) {
        totalElemento.textContent =
            "$" + calcularTotalCarrito().toLocaleString("es-CO");
    }
}


// ========================================
// ABRIR EL CARRITO
// ========================================

function abrirCarrito() {
    const modal = document.getElementById("modal-carrito");

    if (modal) {
        modal.style.display = "flex";
    }

    actualizarVistaCarrito();
}


// ========================================
// CERRAR EL CARRITO
// ========================================

function cerrarCarrito() {
    const modal = document.getElementById("modal-carrito");

    if (modal) {
        modal.style.display = "none";
    }
}// ========================================
// ENVIAR EL PEDIDO POR WHATSAPP
// ========================================

function enviarPedidoWhatsApp() {
    if (carrito.length === 0) {
        alert("El carrito está vacío.");
        return;
    }

    let mensaje =
        "Hola, quiero realizar este pedido en Fuego Urrao:\n\n";

    let total = 0;

    carrito.forEach(function (item, indice) {
        mensaje +=
            (indice + 1) +
            ". " +
            item.nombre +
            " - $" +
            item.precio.toLocaleString("es-CO") +
            "\n";

        total += item.precio;
    });

    mensaje +=
        "\nTotal del pedido: $" +
        total.toLocaleString("es-CO");

    const url =
        "https://wa.me/" +
        numeroWhatsApp +
        "?text=" +
        encodeURIComponent(mensaje);

    window.open(url, "_blank", "noopener,noreferrer");
}


// ========================================
// ABRIR Y CERRAR EL CARRITO
// ========================================

function abrirCarrito() {
    const carritoElemento = document.getElementById("carrito");

    const fondo = document.getElementById("panel-carrito-fondo");

    if (carritoElemento) {
        carritoElemento.classList.add("abierto");
    }

    if (fondo) {
        fondo.classList.add("abierto");
    }
}


function cerrarCarrito() {
    const carritoElemento = document.getElementById("carrito");

    const fondo = document.getElementById("panel-carrito-fondo");

    if (carritoElemento) {
        carritoElemento.classList.remove("abierto");
    }

    if (fondo) {
        fondo.classList.remove("abierto");
    }
}


// ========================================
// TEMAS DE INTERÉS
// ========================================

function mostrarTema(tema) {
    const titulo = document.getElementById("tema-titulo");

    const contenido = document.getElementById("tema-contenido");

    const temas = {
        bienestar: {
            titulo: "Bienestar íntimo",

            contenido:
                "El bienestar íntimo incluye el cuidado personal, la comunicación, el respeto y las decisiones informadas. Ante dudas sobre salud sexual, consulta a un profesional de salud."
        },

        lubricantes: {
            titulo: "Uso responsable de lubricantes",

            contenido:
                "Lee las instrucciones del producto y verifica su compatibilidad con preservativos y juguetes. Algunos lubricantes a base de aceite pueden dañar los preservativos de látex. Suspende el uso si aparece irritación."
        },

        presentaciones: {
            titulo: "Cómo elegir una presentación",

            contenido:
                "Compara el contenido, el precio, los ingredientes y las indicaciones del fabricante. Revisa el empaque y la fecha de vencimiento antes de utilizar el producto."
        },

        cuidado: {
            titulo: "Cuidado y almacenamiento",

            contenido:
                "Conserva los productos según las indicaciones del fabricante, lejos del calor excesivo y de la luz directa cuando corresponda. No uses productos vencidos ni envases deteriorados."
        }
    };

    const informacion = temas[tema];

    if (!informacion || !titulo || !contenido) {
        return;
    }

    titulo.textContent = informacion.titulo;

    contenido.textContent = informacion.contenido;

    const modal = document.getElementById("modal-tema");

    if (modal) {
        modal.style.display = "flex";
    }
}


function cerrarTema() {
    const modal = document.getElementById("modal-tema");

    if (modal) {
        modal.style.display = "none";
    }
}


// ========================================
// CARGAR TEMAS GUARDADOS EN MYSQL
// ========================================

let temasGuardados = [];

async function cargarTemas() {
    try {
        const respuesta = await fetch("obtener_temas.php");

        if (!respuesta.ok) {
            throw new Error("No se pudieron cargar los temas.");
        }

        const datos = await respuesta.json();

        if (!Array.isArray(datos)) {
            throw new Error(
                datos.error || "La respuesta de temas no es válida."
            );
        }

        temasGuardados = datos;

        renderizarTemasPublicos();

        renderizarTemasAdmin();

    } catch (error) {
        console.error("Error al cargar temas de interés:", error);

        const listaPublica =
            document.getElementById("lista-temas-publicos");

        const listaAdmin =
            document.getElementById("lista-temas-admin");

        if (listaPublica) {
            listaPublica.textContent =
                "No se pudieron cargar los temas guardados.";
        }

        if (listaAdmin) {
            listaAdmin.textContent =
                "No se pudieron cargar los temas. Revisa los archivos PHP y la conexión a la base de datos.";
        }
    }
}


// ========================================
// MOSTRAR TEMAS A LOS CLIENTES
// ========================================

function renderizarTemasPublicos() {
    const contenedor =
        document.getElementById("lista-temas-publicos");

    if (!contenedor) {
        return;
    }

    contenedor.replaceChildren();

    temasGuardados.forEach(function (tema) {
        const tarjeta = document.createElement("article");

        tarjeta.className = "tarjeta-tema";

        const titulo = document.createElement("h3");

        titulo.textContent = tema.titulo;

        const resumen = document.createElement("p");

        const texto = String(tema.contenido || "");

        resumen.textContent =
            texto.length > 140
                ? texto.substring(0, 140) + "..."
                : texto;

        const boton = document.createElement("button");

        boton.type = "button";

        boton.className = "btn-comprar";

        boton.textContent = "Leer más";

        boton.addEventListener("click", function () {
            mostrarTemaGuardado(tema.titulo, tema.contenido);
        });

        tarjeta.append(titulo, resumen, boton);

        contenedor.appendChild(tarjeta);
    });
}


// ========================================
// ABRIR UN TEMA GUARDADO
// ========================================

function mostrarTemaGuardado(tituloTexto, contenidoTexto) {
    const titulo = document.getElementById("tema-titulo");

    const contenido = document.getElementById("tema-contenido");

    const modal = document.getElementById("modal-tema");

    if (!titulo || !contenido || !modal) {
        return;
    }

    titulo.textContent = tituloTexto || "Tema de interés";

    contenido.textContent = contenidoTexto || "";

    modal.style.display = "flex";
}


// ========================================
// MOSTRAR TEMAS EN EL PANEL ADMINISTRADOR
// ========================================

function renderizarTemasAdmin() {
    const contenedor =
        document.getElementById("lista-temas-admin");

    if (!contenedor) {
        return;
    }

    contenedor.replaceChildren();

    if (temasGuardados.length === 0) {
        const mensaje = document.createElement("p");

        mensaje.textContent =
            "Todavía no hay temas guardados en la base de datos.";

        contenedor.appendChild(mensaje);

        return;
    }

    temasGuardados.forEach(function (tema) {
        const tarjeta = document.createElement("div");

        tarjeta.className = "tarjeta-tema-admin";

        const titulo = document.createElement("h4");

        titulo.textContent = tema.titulo;

        const contenido = document.createElement("p");

        const texto = String(tema.contenido || "");

        contenido.textContent =
            texto.length > 180
                ? texto.substring(0, 180) + "..."
                : texto;

        const botonEditar = document.createElement("button");

        botonEditar.type = "button";

        botonEditar.className = "btn-comprar";

        botonEditar.textContent = "Editar";

        botonEditar.addEventListener("click", function () {
            editarTema(tema.id);
        });

        const botonEliminar = document.createElement("button");

        botonEliminar.type = "button";

        botonEliminar.className = "btn-comprar";

        botonEliminar.textContent = "Eliminar";

        botonEliminar.addEventListener("click", function () {
            eliminarTema(tema.id);
        });

        tarjeta.append(
            titulo,
            contenido,
            botonEditar,
            botonEliminar
        );

        contenedor.appendChild(tarjeta);
    });
}// ========================================
// GUARDAR O ACTUALIZAR TEMAS DE INTERÉS
// ========================================

async function guardarTema(evento) {
    evento.preventDefault();

    if (!esAdmin) {
        alert("Debes iniciar sesión como administradora para gestionar los temas.");
        return;
    }

    const id = document.getElementById("tema-id").value.trim();

    const titulo = document.getElementById("tema-titulo-admin").value.trim();

    const contenido = document.getElementById("tema-contenido-admin").value.trim();

    if (!titulo || !contenido) {
        alert("Escribe el título y el contenido del tema.");
        return;
    }

    const datos = new FormData();

    datos.append("titulo", titulo);
    datos.append("contenido", contenido);

    if (id) {
        datos.append("id", id);
    }

    const archivo = id
        ? "actualizar_tema.php"
        : "guardar_tema.php";

    const boton = document.getElementById("btn-guardar-tema");

    try {
        if (boton) {
            boton.disabled = true;
        }

        const respuesta = await fetch(archivo, {
            method: "POST",
            body: datos
        });

        const resultado = await respuesta.json();

        if (
            !respuesta.ok ||
            resultado.exito === false ||
            resultado.error
        ) {
            throw new Error(
                resultado.mensaje ||
                resultado.error ||
                "No se pudo guardar el tema."
            );
        }

        alert(
            resultado.mensaje ||
            (id
                ? "Tema actualizado correctamente."
                : "Tema guardado correctamente.")
        );

        limpiarFormularioTema();

        await cargarTemas();

    } catch (error) {
        console.error("Error al guardar el tema:", error);

        alert(
            "No se pudo guardar el tema. Verifica el archivo PHP y la conexión con la base de datos."
        );

    } finally {
        if (boton) {
            boton.disabled = false;
        }
    }
}


// ========================================
// EDITAR UN TEMA
// ========================================

function editarTema(id) {
    if (!esAdmin) {
        alert("Debes iniciar sesión como administradora.");
        return;
    }

    const tema = temasGuardados.find(function (elemento) {
        return String(elemento.id) === String(id);
    });

    if (!tema) {
        alert("No se encontró el tema seleccionado.");
        return;
    }

    document.getElementById("tema-id").value = tema.id;

    document.getElementById("tema-titulo-admin").value =
        tema.titulo;

    document.getElementById("tema-contenido-admin").value =
        tema.contenido;

    document.getElementById("btn-guardar-tema").textContent =
        "Actualizar tema";

    document.getElementById("form-tema").scrollIntoView({
        behavior: "smooth",
        block: "center"
    });
}


// ========================================
// ELIMINAR UN TEMA
// ========================================

async function eliminarTema(id) {
    if (!esAdmin) {
        alert("Debes iniciar sesión como administradora.");
        return;
    }

    const tema = temasGuardados.find(function (elemento) {
        return String(elemento.id) === String(id);
    });

    if (!tema) {
        return;
    }

    const confirmar = confirm(
        "¿Seguro que deseas eliminar el tema «" +
        tema.titulo +
        "»?"
    );

    if (!confirmar) {
        return;
    }

    const datos = new FormData();

    datos.append("id", id);

    try {
        const respuesta = await fetch("eliminar_tema.php", {
            method: "POST",
            body: datos
        });

        const resultado = await respuesta.json();

        if (
            !respuesta.ok ||
            resultado.exito === false ||
            resultado.error
        ) {
            throw new Error(
                resultado.mensaje ||
                resultado.error ||
                "No se pudo eliminar el tema."
            );
        }

        alert(
            resultado.mensaje ||
            "Tema eliminado correctamente."
        );

        await cargarTemas();

        const campoId = document.getElementById("tema-id");

        if (campoId && String(campoId.value) === String(id)) {
            limpiarFormularioTema();
        }

    } catch (error) {
        console.error("Error al eliminar el tema:", error);

        alert(
            "No se pudo eliminar el tema. Revisa la conexión con la base de datos."
        );
    }
}


// ========================================
// LIMPIAR EL FORMULARIO DE TEMAS
// ========================================

function limpiarFormularioTema() {
    const formulario = document.getElementById("form-tema");

    if (formulario) {
        formulario.reset();
    }

    const campoId = document.getElementById("tema-id");

    const boton = document.getElementById("btn-guardar-tema");

    if (campoId) {
        campoId.value = "";
    }

    if (boton) {
        boton.textContent = "Guardar tema";
    }
}


// ========================================
// CERRAR MODALES AL HACER CLIC AFUERA
// ========================================

window.addEventListener("click", function (evento) {
    const modalProducto =
        document.getElementById("modal-producto");

    const modalTema =
        document.getElementById("modal-tema");

    const modalLogin =
        document.getElementById("modal-login");

    if (evento.target === modalProducto) {
        cerrarDetalleProducto();
    }

    if (evento.target === modalTema) {
        cerrarTema();
    }

    if (evento.target === modalLogin) {
        cerrarLogin();
    }
});


// ========================================
// CERRAR VENTANAS CON LA TECLA ESCAPE
// ========================================

window.addEventListener("keydown", function (evento) {
    if (evento.key === "Escape") {
        cerrarDetalleProducto();

        cerrarTema();

        cerrarLogin();

        cerrarCarrito();
    }
});