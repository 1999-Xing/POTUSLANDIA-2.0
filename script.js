const firebaseConfig = {
  apiKey: "AIzaSyAxh_5_fl9_3qFArsP3gnDbAe2P8HGKSm8",
  authDomain: "potuslandia-2-0.firebaseapp.com",
  projectId: "potuslandia-2-0",
  storageBucket: "potuslandia-2-0.appspot.com",
  messagingSenderId: "360720398181",
  appId: "1:360720398181:web:83c604c8012cfa05d2d38c"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

/* =========================
   INICIO
========================= */

function inicio() {
    document.getElementById("contenido").innerHTML = `
        <section class="hero">
            <h1>¡Bienvenidx a bordo!</h1>
            <p>Una comunidad de nakamas y buen rollo.</p>

            <button onclick="archivos()">
                Investigar el botín
            </button>

            <button onclick="panelAdmin()">
                ⚙ Admin
            </button>

        </section>
    `;
}

/* =========================
   FIREBASE: GET
========================= */

async function getRecursos() {
    const snap = await db.collection("recursos").get();
    return snap.docs.map(doc => doc.data());
}

/* =========================
   ARCHIVOS
========================= */

async function archivos() {

    const datos = await getRecursos();

    document.getElementById("contenido").innerHTML = `
        <section class="hero">

            <h1>📁 Tesoro</h1>

            <input 
                id="buscador"
                type="text"
                placeholder="🔍 Buscar recursos..."
                oninput="buscar()"
                style="padding:10px; width:80%; max-width:400px; margin-top:10px;"
            >

            <p>Actualmente hay <strong id="contador">${datos.length}</strong> recursos.</p>

            <button onclick="inicio()">
                ⬅ Volver al inicio
            </button>
        </section>

        <section class="cards" id="lista">
        </section>
    `;

    mostrar(datos);
}

/* =========================
   MOSTRAR LISTA
========================= */

function mostrar(listaRecursos) {

    let lista = "";

    listaRecursos.forEach(recurso => {

        lista += `
            <div class="card">

                <h2>${recurso.nombre}</h2>

                <p>
                    <strong>Categoría:</strong>
                    <a href="#" onclick="abrirCategoria('${recurso.seccion}'); return false;">
                        ${recurso.categoria}
                    </a>
                </p>

                <p>${recurso.descripcion}</p>
                <p><strong>Origen:</strong> ${recurso.origen}</p>
                <p><strong>Tipo:</strong> ${recurso.tipo}</p>

                <button onclick="window.open('${recurso.enlace}', '_blank')">
                    📥 Descargar
                </button>

            </div>
        `;
    });

    document.getElementById("lista").innerHTML = lista;
}

/* =========================
   BUSCADOR GLOBAL
========================= */

async function buscar() {

    const texto = document.getElementById("buscador").value.toLowerCase();
    const datos = await getRecursos();

    const filtrados = datos.filter(r =>
        r.nombre.toLowerCase().includes(texto) ||
        r.categoria.toLowerCase().includes(texto) ||
        r.descripcion.toLowerCase().includes(texto) ||
        r.origen.toLowerCase().includes(texto) ||
        r.tipo.toLowerCase().includes(texto)
    );

    document.getElementById("contador").innerText = filtrados.length;

    mostrar(filtrados);
}

/* =========================
   CATEGORÍAS
========================= */

async function abrirCategoria(seccion) {

    const datos = await getRecursos();

    const filtrados = datos.filter(r => r.seccion === seccion);

    document.getElementById("contenido").innerHTML = `
        <section class="hero">

            <h1>📂 ${seccion.toUpperCase()}</h1>

            <p>Mostrando <strong>${filtrados.length}</strong> recursos</p>

            <button onclick="archivos()">
                ⬅ Volver a Biblioteca
            </button>

        </section>

        <section class="cards" id="listaSeccion">
        </section>
    `;

    mostrarSeccion(filtrados);
}

/* =========================
   MOSTRAR SECCIÓN
========================= */

function mostrarSeccion(listaRecursos) {

    let lista = "";

    listaRecursos.forEach(recurso => {

        lista += `
            <div class="card">

                <h2>${recurso.nombre}</h2>

                <p>${recurso.descripcion}</p>

                <p><strong>Origen:</strong> ${recurso.origen}</p>
                <p><strong>Tipo:</strong> ${recurso.tipo}</p>

                <button onclick="window.open('${recurso.enlace}', '_blank')">
                    📥 Descargar
                </button>

            </div>
        `;
    });

    document.getElementById("listaSeccion").innerHTML = lista;
}

/* =========================
   ADMIN PANEL
========================= */

function panelAdmin() {

    document.getElementById("contenido").innerHTML = `
        <section class="hero">

            <h1>⚙ Panel de Admin</h1>

            <input id="nombre" placeholder="Nombre"><br><br>
            <input id="descripcion" placeholder="Descripción"><br><br>
            <input id="categoria" placeholder="Categoría"><br><br>
            <input id="seccion" placeholder="Sección"><br><br>
            <input id="enlace" placeholder="Enlace de descarga"><br><br>

            <button onclick="guardarRecurso()">
                ➕ Guardar recurso
            </button>

            <button onclick="inicio()">
                ⬅ Volver
            </button>

        </section>
    `;
}

/* =========================
   GUARDAR EN FIREBASE
========================= */

async function guardarRecurso() {

    const nuevo = {
        id: Date.now(),
        nombre: document.getElementById("nombre").value,
        descripcion: document.getElementById("descripcion").value,
        categoria: document.getElementById("categoria").value,
        seccion: document.getElementById("seccion").value,
        tipo: "WEB",
        enlace: document.getElementById("enlace").value
    };

    await db.collection("recursos").add(nuevo);

    alert("Recurso guardado en la nube ☁️");

    inicio();
}

/* =========================
   ARRANQUE
========================= */

inicio();