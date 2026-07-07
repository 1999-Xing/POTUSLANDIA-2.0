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
const auth = firebase.auth();

/* =========================
   ADMIN EMAILS
========================= */

const ADMIN_EMAILS = [
    "xing75949@gmail.com",
    "capitana@gmail.com"
];

/* =========================
   LOGIN
========================= */

function login(email, password) {

    auth.signInWithEmailAndPassword(email, password)
        .then(() => {

            alert("Login correcto 🔓");

            // 🔥 espera a que Firebase actualice sesión
            setTimeout(() => {
                panelAdmin();
            }, 500);

        })
        .catch(err => alert(err.message));
}

/* =========================
   LOGIN UI
========================= */

function mostrarLogin() {

    document.getElementById("contenido").innerHTML = `
        <section class="hero">
            <h1>🔐 Login Admin</h1>

            <input id="email" placeholder="Email"><br><br>
            <input id="password" type="password" placeholder="Contraseña"><br><br>

            <button onclick="login(
                document.getElementById('email').value,
                document.getElementById('password').value
            )">
                Entrar
            </button>

            <button onclick="inicio()">Volver</button>
        </section>
    `;
}

/* =========================
   ESTADO GLOBAL USUARIO
========================= */

let usuarioActual = null;

auth.onAuthStateChanged(user => {
    usuarioActual = user;
});

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

            <button onclick="mostrarLogin()">
                🔐 Admin
            </button>

        </section>
    `;
}

/* =========================
   GET RECURSOS
========================= */

async function getRecursos() {
    const snap = await db.collection("recursos").get();
    return snap.docs.map(doc => doc.data());
}

/* =========================
   PANEL ADMIN (FIX DEFINITIVO)
========================= */

async function panelAdmin() {

    // 🔥 espera si Firebase aún no ha cargado usuario
    if (!auth.currentUser) {
        setTimeout(panelAdmin, 300);
        return;
    }

    const user = auth.currentUser;

    if (!ADMIN_EMAILS.includes(user.email)) {

        document.getElementById("contenido").innerHTML = `
            <section class="hero">
                <h1>⛔ Acceso denegado</h1>
                <button onclick="inicio()">Volver</button>
            </section>
        `;
        return;
    }

    document.getElementById("contenido").innerHTML = `
        <section class="hero">

            <h1>⚙ Panel de Admin</h1>

            <input id="nombre" placeholder="Nombre"><br><br>
            <input id="descripcion" placeholder="Descripción"><br><br>
            <input id="categoria" placeholder="Categoría"><br><br>
            <input id="seccion" placeholder="Sección"><br><br>
            <input id="enlace" placeholder="Enlace de descarga"><br><br>

            <button onclick="guardarRecurso()">
                ➕ Guardar
            </button>

            <button onclick="inicio()">
                ⬅ Volver
            </button>

        </section>
    `;
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
                style="padding:10px; width:80%; max-width:400px;"
            >

            <p>Actualmente hay <strong id="contador">${datos.length}</strong></p>

            <button onclick="inicio()">⬅ Volver</button>

        </section>

        <section class="cards" id="lista"></section>
    `;

    mostrar(datos);
}

/* =========================
   MOSTRAR
========================= */

function mostrar(listaRecursos) {

    document.getElementById("lista").innerHTML = listaRecursos.map(r => `
        <div class="card">
            <h2>${r.nombre}</h2>

            <p>
                <strong>Categoría:</strong>
                <a href="#" onclick="abrirCategoria('${r.seccion}'); return false;">
                    ${r.categoria}
                </a>
            </p>

            <p>${r.descripcion}</p>
            <p>${r.origen}</p>
            <p>${r.tipo}</p>

            <button onclick="window.open('${r.enlace}', '_blank')">
                📥 Descargar
            </button>
        </div>
    `).join("");
}

/* =========================
   BUSCADOR
========================= */

async function buscar() {

    const texto = document.getElementById("buscador").value.toLowerCase();
    const datos = await getRecursos();

    const filtrados = datos.filter(r =>
        r.nombre.toLowerCase().includes(texto) ||
        r.categoria.toLowerCase().includes(texto) ||
        r.descripcion.toLowerCase().includes(texto)
    );

    document.getElementById("contador").innerText = filtrados.length;

    mostrar(filtrados);
}

/* =========================
   GUARDAR RECURSO
========================= */

async function guardarRecurso() {

    const nombre = document.getElementById("nombre").value.trim();
    const descripcion = document.getElementById("descripcion").value.trim();
    const categoria = document.getElementById("categoria").value.trim();
    const seccion = document.getElementById("seccion").value.trim();
    const enlace = document.getElementById("enlace").value.trim();

    if (
        !nombre ||
        !descripcion ||
        !categoria ||
        !seccion ||
        !enlace
    ){
        alert("Debes rellenar todos los campos.");
        return;
    }

    const nuevo = {
        nombre,
        descripcion,
        categoria,
        seccion,
        origen: "Potuslandia",
        tipo: "WEB",
        enlace,
        fecha: new Date()
    };

    try{

        await db.collection("recursos").add(nuevo);

        alert("✅ Recurso añadido correctamente.");

        panelAdmin();

    }catch(error){

        console.error(error);
        alert("Ha ocurrido un error al guardar.");

    }

}

/* =========================
   START
========================= */

inicio();