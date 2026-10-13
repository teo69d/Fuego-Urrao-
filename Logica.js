const ADMIN_USER = "admin";
const ADMIN_PASS = "1234";

let esAdmin = false;
let carrito = [];
let productos = [];
let categoriaActual = "todos";
let productoSeleccionado = null;

const numeroWhatsApp = "573233626933";

const productosIniciales = [
    {
        id: 1,
        nombre: "Prenda de Lencería",
        descripcion: "Prenda de lencería para complementar tu colección.",
        presentacion: "Consultar disponibilidad",
        precio: 50000,
        categoria: "lenceria",
        imagen: "https://placehold.co/300x300?text=Lenceria"
    },
    {
        id: 2,
        nombre: "Energizantes Masculinos",
        descripcion: "Bebida energizante a base de frutos naturales y enriquecida con vitaminas.",
        presentacion: "Consultar presentación en el empaque",
        precio: 18000,
        categoria: "Energizantes",
        imagen: "XBULL.png"
    },
    {
        id: 3,
        nombre: "Conjunto Especial",
        descripcion: "Conjunto especial de lencería.",
        presentacion: "Consultar disponibilidad",
        precio: 65000,
        categoria: "lenceria",
        imagen: "https://placehold.co/300x300?text=Conjunto"
    },
    {
        id: 4,
        nombre: "Energizantes Femeninos",
        descripcion: "Bebida energizante en sachet con frutos exóticos y vitaminas.",
        presentacion: "Sachet",
        precio: 6200,
        categoria: "Energizantes",
        imagen: "ENM.png"
    },
    {
        id: 5,
        nombre: "Lubricante anal electrizante x 30 ml",
        descripcion: "Lubricante anal electrizante sin anestésico.",
        presentacion: "30 ml",
        precio: 34000,
        categoria: "lubricantes anales",
        imagen: "Electrizante.png"
    },
    {
        id: 6,
        nombre: "Lubricante anal electrizante x 7 ml",
        descripcion: "Lubricante anal electrizante sin anestésico.",
        presentacion: "7 ml",
        precio: 34000,
        categoria: "lubricantes anales",
        imagen: "electripq.png"
    },
    {
        id: 7,
        nombre: "Lubricante anal desensibilizante x 30 ml",
        descripcion: "Lubricante anal desensibilizante con anestésico. Sigue las instrucciones del fabricante.",
        presentacion: "30 ml",
        precio: 31500,
        categoria: "lubricantes anales",
        imagen: "anal(2).png"
    },
    {
        id: 8,
        nombre: "Lubricante anal desensibilizante x 7 ml",
        descripcion: "Lubricante anal desensibilizante con anestésico. Sigue las instrucciones del fabricante.",
        presentacion: "7 ml",
        precio: 9000,
        categoria: "lubricantes anales",
        imagen: "desensibilizantePq.png"
    },
    {
        id: 9,
        nombre: "Lubricante Neutro x 15 ml",
        descripcion: "Lubricante a base de agua. Consulta las indicaciones del fabricante sobre compatibilidad y uso.",
        presentacion: "15 ml",
        precio: 20500,
        categoria: "lubricantes",
        imagen: "NEUTRO.png"
    },
    {
        id: 10,
        nombre: "Lubricante Neutro x 7 ml",
        descripcion: "Lubricante a base de agua. Consulta las indicaciones del fabricante sobre compatibilidad y uso.",
        presentacion: "7 ml",
        precio: 9000,
        categoria: "lubricantes",
        imagen: "Neutropq.png"
    },
    {
        id: 11,
        nombre: "Lubricante Íntimo Retardante x 15 ml",
        descripcion: "Lubricante íntimo retardante. Revisa las instrucciones y precauciones del producto.",
        presentacion: "15 ml",
        precio: 32500,
        categoria: "lubricantes",
        imagen: "Retardante.png"
    },
    {
        id: 12,
        nombre: "Lubricante Íntimo Retardante x 7 ml",
        descripcion: "Lubricante íntimo retardante. Revisa las instrucciones y precauciones del producto.",
        presentacion: "7 ml",
        precio: 7700,
        categoria: "lubricantes",
        imagen: "RETARDANTEPq.png"
    },
    {
        id: 13,
        nombre: "Lubricante Íntimo Estrechante Sachet",
        descripcion: "Producto íntimo en presentación individual. Consulta las indicaciones del fabricante.",
        presentacion: "Sachet de 7 ml",
        precio: 6500,
        categoria: "lubricantes",
        imagen: "Estrechante.png"
    },
    {
        id: 14,
        nombre: "Lubricante Íntimo Silicona",
        descripcion: "Lubricante íntimo de silicona resistente al agua. Revisa las recomendaciones de compatibilidad del fabricante.",
        presentacion: "30 ml",
        precio: 34000,
        categoria: "lubricantes",
        imagen: "Silicona.png"
    },
    {
        id: 15,
        nombre: "Lubricante Neutro con Ácido Hialurónico y Aloe",
        descripcion: "Lubricante íntimo neutro con ácido hialurónico y aloe.",
        presentacion: "55 ml",
        precio: 25500,
        categoria: "lubricantes",
        imagen: "aloe.png"
    },
    {
        id: 16,
        nombre: "Lubricante Íntimo Trío",
        descripcion: "Lubricante con aroma y sabor. Consulta las indicaciones de uso del fabricante.",
        presentacion: "30 ml",
        precio: 25500,
        categoria: "lubricantes",
        imagen: "TRIO.png"
    },
    {
        id: 17,
        nombre: "Lubricante Íntimo Híbrido",
        descripcion: "Lubricante íntimo de fórmula híbrida. Revisa su compatibilidad con preservativos y juguetes.",
        presentacion: "30 ml",
        precio: 25500,
        categoria: "lubricantes",
        imagen: "Hibrido.png"
    },
    {
        id: 18,
        nombre: "Lubricante Chocolate Sensación Caliente",
        descripcion: "Lubricante íntimo con sabor a chocolate. Consulta las instrucciones del fabricante.",
        presentacion: "30 ml",
        precio: 21000,
        categoria: "lubricantes saborizados",
        imagen: "chocolate.png"
    },
    {
        id: 19,
        nombre: "Lubricante Chocolate Sensación Caliente",
        descripcion: "Lubricante íntimo con sabor a chocolate. Consulta las instrucciones del fabricante.",
        presentacion: "7 ml",
        precio: 6900,
        categoria: "lubricantes saborizados",
        imagen: "chocolatePq.png"
    },
    {
        id: 20,
        nombre: "Lubricante Caramelo Sensación Caliente",
        descripcion: "Lubricante íntimo con sabor a caramelo. Consulta las instrucciones del fabricante.",
        presentacion: "7 ml",
        precio: 6900,
        categoria: "lubricantes saborizados",
        imagen: "caramelo.png"
    },
    {
        id: 21,
        nombre: "Lubricante Moka Whisky Sensación Caliente",
        descripcion: "Lubricante íntimo saborizado. Revisa las indicaciones del fabricante.",
        presentacion: "30 ml",
        precio: 21000,
        categoria: "lubricantes saborizados",
        imagen: "whisky.png"
    },
    {
        id: 22,
        nombre: "Lubricante Moka Whisky Sensación Caliente",
        descripcion: "Lubricante íntimo saborizado. Revisa las indicaciones del fabricante.",
        presentacion: "7 ml",
        precio: 6900,
        categoria: "lubricantes saborizados",
        imagen: "whiskyPq.png"
    },
    {
        id: 23,
        nombre: "Lubricante Lychee Sensación Caliente",
        descripcion: "Lubricante íntimo con sabor a lychee. Consulta las indicaciones del fabricante.",
        presentacion: "7 ml",
        precio: 9000,
        categoria: "lubricantes saborizados",
        imagen: "lycheePq.png"
    },
    {
        id: 24,
        nombre: "Lubricante Tequila Sensación Caliente",
        descripcion: "Lubricante íntimo saborizado. Consulta las indicaciones del fabricante.",
        presentacion: "30 ml",
        precio: 34000,
        categoria: "lubricantes saborizados",
        imagen: "tequila.png"
    },
    {
        id: 25,
        nombre: "Lubricante Lychee Sensación Caliente",
        descripcion: "Lubricante íntimo con sabor a lychee. Consulta las indicaciones del fabricante.",
        presentacion: "30 ml",
        precio: 34000,
        categoria: "lubricantes saborizados",
        imagen: "lycheeG.png"
    },
    {
        id: 26,
        nombre: "Lubricante Crema de Whisky",
        descripcion: "Lubricante íntimo saborizado. Revisa las instrucciones del fabricante.",
        presentacion: "30 ml",
        precio: 34000,
        categoria: "lubricantes saborizados",
        imagen: "WhiskiE.png"
    },
    {
        id: 27,
        nombre: "Lubricante Mango Sensación Caliente",
        descripcion: "Lubricante íntimo con sabor a mango. Consulta las indicaciones del fabricante.",
        presentacion: "30 ml",
        precio: 33500,
        categoria: "lubricantes saborizados",
        imagen: "mango.png"
    },
    {
        id: 28,
        nombre: "Lubricante Moka Café Sensación Caliente",
        descripcion: "Lubricante íntimo con sabor a café. Consulta las indicaciones del fabricante.",
        presentacion: "30 ml",
        precio: 21000,
        categoria: "lubricantes saborizados",
        imagen: "cafemoka.png"
    },
    {
        id: 29,
        nombre: "Lubricante Menta Sensación Fría",
        descripcion: "Lubricante íntimo con sensación fría. Consulta las indicaciones del fabricante.",
        presentacion: "30 ml",
        precio: 21000,
        categoria: "lubricantes saborizados",
        imagen: "menta.png"
    }
];

productos = productosIniciales.map(producto => ({ ...producto }));

document.addEventListener("DOMContentLoaded", function () {
    renderizarProductos();
    actualizarVistaCarrito();
});

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

        const imagen = document.createElement("img");
        imagen.src = producto.imagen;
        imagen.alt = producto.nombre;
        imagen.className = "img-producto";
        imagen.loading = "lazy";

        imagen.onerror = function () {
            this.onerror = null;
            this.src = "https://placehold.co/300x300?text=Imagen+no+disponible";
        };

        const nombre = document.createElement("h3");
        nombre.textContent = producto.nombre;

        const precio = document.createElement("p");
        precio.className = "precio";
        precio.textContent = "$" + producto.precio.toLocaleString("es-CO");

        const botonDetalles = document.createElement("button");
        botonDetalles.className = "btn-comprar";
        botonDetalles.textContent = "Ver detalles";
        botonDetalles.type = "button";
        botonDetalles.addEventListener("click", function () {
            abrirDetalleProducto(producto.id);
        });

        tarjeta.appendChild(imagen);
        tarjeta.appendChild(nombre);
        tarjeta.appendChild(precio);
        tarjeta.appendChild(botonDetalles);

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

function filtrarProductos(categoria) {
    renderizarProductos(categoria);
}

function abrirDetalleProducto(id) {
    const producto = productos.find(function (item) {
        return item.id === id;
    });

    if (!producto) {
        alert("No se encontró el producto.");
        return;
    }

    productoSeleccionado = producto;

    document.getElementById("detalle-imagen").src = producto.imagen;
    document.getElementById("detalle-imagen").alt = producto.nombre;
    document.getElementById("detalle-nombre").textContent = producto.nombre;
    document.getElementById("detalle-descripcion").textContent = producto.descripcion;
    document.getElementById("detalle-presentacion").textContent =
        producto.presentacion || "Consultar disponibilidad";
    document.getElementById("detalle-precio").textContent =
        producto.precio.toLocaleString("es-CO");

    document.getElementById("modal-producto").style.display = "flex";
}

function cerrarDetalleProducto() {
    document.getElementById("modal-producto").style.display = "none";
    productoSeleccionado = null;
}

function agregarProductoDesdeDetalle() {
    if (!productoSeleccionado) {
        return;
    }

    agregarProducto(
        productoSeleccionado.id,
        productoSeleccionado.nombre,
        productoSeleccionado.precio
    );

    cerrarDetalleProducto();
    abrirCarrito();
}

function abrirLogin() {
    document.getElementById("modal-login").style.display = "flex";
}

function cerrarLogin() {
    document.getElementById("modal-login").style.display = "none";
}

function validarLogin(evento) {
    evento.preventDefault();

    const usuario = document.getElementById("usuario").value;
    const password = document.getElementById("password").value;

    if (usuario === ADMIN_USER && password === ADMIN_PASS) {
        esAdmin = true;

        document.getElementById("panel-admin").style.display = "block";

        cerrarLogin();
        renderizarProductos();

        alert("Bienvenida, administradora.");
    } else {
        alert("Usuario o contraseña incorrectos.");
    }
}

function cerrarSesion() {
    esAdmin = false;
    document.getElementById("panel-admin").style.display = "none";
    renderizarProductos();
}

function guardarProducto(evento) {
    evento.preventDefault();

    if (!esAdmin) {
        alert("Debes iniciar sesión como administradora.");
        return;
    }

    const id = document.getElementById("prod-id").value;
    const nombre = document.getElementById("prod-nombre").value.trim();
    const descripcion = document.getElementById("prod-descripcion").value.trim();
    const presentacion = document.getElementById("prod-presentacion").value.trim();
    const precio = Number(document.getElementById("prod-precio").value);
    const imagen = document.getElementById("prod-imagen").value.trim();
    const categoria = document.getElementById("prod-categoria").value;

    if (!nombre || !descripcion || !presentacion || !imagen ||
        !Number.isFinite(precio) || precio <= 0 || !categoria) {
        alert("Completa todos los campos correctamente.");
        return;
    }

    if (id) {
        const indice = productos.findIndex(function (producto) {
            return producto.id === Number(id);
        });

        if (indice !== -1) {
            productos[indice] = {
                id: Number(id),
                nombre: nombre,
                descripcion: descripcion,
                presentacion: presentacion,
                precio: precio,
                imagen: imagen,
                categoria: categoria
            };
        }
    } else {
        productos.push({
            id: Date.now(),
            nombre: nombre,
            descripcion: descripcion,
            presentacion: presentacion,
            precio: precio,
            imagen: imagen,
            categoria: categoria
        });
    }

    document.getElementById("form-producto").reset();
    document.getElementById("prod-id").value = "";
    document.getElementById("form-titulo").textContent = "Agregar nuevo producto";

    renderizarProductos();
    alert("Producto guardado correctamente.");
}

function cargarParaEditar(id) {
    if (!esAdmin) {
        return;
    }

    const producto = productos.find(function (item) {
        return item.id === id;
    });

    if (!producto) {
        return;
    }

    document.getElementById("prod-id").value = producto.id;
    document.getElementById("prod-nombre").value = producto.nombre;
    document.getElementById("prod-descripcion").value = producto.descripcion;
    document.getElementById("prod-presentacion").value =
        producto.presentacion || "";
    document.getElementById("prod-precio").value = producto.precio;
    document.getElementById("prod-imagen").value = producto.imagen;
    document.getElementById("prod-categoria").value = producto.categoria;

    document.getElementById("form-titulo").textContent = "Editar producto";

    window.location.hash = "panel-admin";
}

function eliminarProductoAdmin(id) {
    if (!esAdmin) {
        return;
    }

    if (confirm("¿Deseas eliminar este producto?")) {
        productos = productos.filter(function (producto) {
            return producto.id !== id;
        });

        renderizarProductos();
        alert("Producto eliminado.");
    }
    //Carrito de compras 
}

function agregarProducto(id, nombre, precio) {
    carrito.push({
        id: id,
        nombre: nombre,
        precio: precio
    });

    actualizarVistaCarrito();
}

function eliminarProducto(indice) {
    carrito.splice(indice, 1);
    actualizarVistaCarrito();
}

function actualizarVistaCarrito() {
    const lista = document.getElementById("lista-carrito");
    const totalElemento = document.getElementById("total-precio");

    if (!lista || !totalElemento) {
        return;
    }

    const contador = document.getElementById("contador-carrito");
    if (contador) {
        contador.textContent = carrito.length;
        contador.style.display = carrito.length ? "flex" : "none";
    }

    lista.innerHTML = "";

    let total = 0;

    if (carrito.length === 0) {
        const mensaje = document.createElement("li");
        mensaje.textContent = "El carrito está vacío.";
        lista.appendChild(mensaje);
        totalElemento.textContent = "0";
        return;
    }

    carrito.forEach(function (item, indice) {
        total += item.precio;

        const li = document.createElement("li");
        li.className = "elemento-carrito";

        const texto = document.createElement("span");
        texto.textContent =
            item.nombre + " - $" + item.precio.toLocaleString("es-CO");

        const botonQuitar = document.createElement("button");
        botonQuitar.type = "button";
        botonQuitar.textContent = "Quitar";
        botonQuitar.className = "btn-eliminar";
        botonQuitar.onclick = function () {
            eliminarProducto(indice);
        };

        li.appendChild(texto);
        li.appendChild(botonQuitar);
        lista.appendChild(li);
    });

    totalElemento.textContent = total.toLocaleString("es-CO");
}

function enviarPedidoWhatsApp() {
    if (carrito.length === 0) {
        alert("El carrito está vacío.");
        return;
    }

    let mensaje = "Hola, quiero realizar este pedido en Fuego Urrao:\n\n";
    let total = 0;

    carrito.forEach(function (item, indice) {
        mensaje += (indice + 1) + ". " + item.nombre +
            " - $" + item.precio.toLocaleString("es-CO") + "\n";

        total += item.precio;
    });

    mensaje += "\nTotal del pedido: $" + total.toLocaleString("es-CO");

    const url = "https://wa.me/" + numeroWhatsApp +
        "?text=" + encodeURIComponent(mensaje);

    window.open(url, "_blank", "noopener,noreferrer");
}

function abrirCarrito() {
    document.getElementById("carrito").classList.add("abierto");
    document.getElementById("panel-carrito-fondo").classList.add("abierto");
}

function cerrarCarrito() {
    document.getElementById("carrito").classList.remove("abierto");
    document.getElementById("panel-carrito-fondo").classList.remove("abierto");
}

function mostrarTema(tema) {
    const titulo = document.getElementById("tema-titulo");
    const contenido = document.getElementById("tema-contenido");

    const temas = {
        bienestar: {
            titulo: "Bienestar íntimo",
            contenido: "El bienestar íntimo incluye el cuidado personal, la comunicación, el respeto y las decisiones informadas. Ante dudas sobre salud sexual, consulta a un profesional de salud."
        },

        lubricantes: {
            titulo: "Uso responsable de lubricantes",
            contenido: "Lee las instrucciones del producto y verifica su compatibilidad con preservativos y juguetes. Algunos lubricantes a base de aceite pueden dañar los preservativos de látex. Suspende el uso si aparece irritación."
        },

        presentaciones: {
            titulo: "Cómo elegir una presentación",
            contenido: "Compara el contenido, el precio, los ingredientes y las indicaciones del fabricante. Revisa el empaque y la fecha de vencimiento antes de utilizar el producto."
        },

        cuidado: {
            titulo: "Cuidado y almacenamiento",
            contenido: "Conserva los productos según las indicaciones del fabricante, lejos del calor excesivo y de la luz directa cuando corresponda. No uses productos vencidos ni envases deteriorados."
        }
    };

    const informacion = temas[tema];

    if (!informacion) {
        return;
    }

    titulo.textContent = informacion.titulo;
    contenido.textContent = informacion.contenido;

    document.getElementById("modal-tema").style.display = "flex";
}

function cerrarTema() {
    document.getElementById("modal-tema").style.display = "none";
}

window.addEventListener("click", function (evento) {
    const modalProducto = document.getElementById("modal-producto");
    const modalTema = document.getElementById("modal-tema");
    const modalLogin = document.getElementById("modal-login");

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

window.addEventListener("keydown", function (evento) {
    if (evento.key === "Escape") {
        cerrarDetalleProducto();
        cerrarTema();
        cerrarLogin();
        cerrarCarrito();
    }
});