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
const rtdb = firebase.database();

console.log("Realtime Database:", rtdb);

/* =========================
   PISTAS SECRETAS
========================= */

const pistasSecretas = [

    "🔍 La tripulación más curiosa siempre encuentra algo que otrxs pasan por alto.",

    "🗺️ No todos los caminos aparecen dibujados en el mapa.",

    "⚓ Un buen marinerx sabe que debe revisar cada rincón del barco.",

    "🐙 El pulpo de cubierta ha encontrado algo... pero dice que está escondido a simple vista.",

    "🌊 Bajo la cubierta puede haber más de lo que parece.",

    "🏴‍☠️ Los grandes tesoros suelen esconderse donde nadie mira.",

    "🔐 Algunos cofres no tienen llave... solo necesitan que alguien los encuentre.",

    "🦜 El loro de cubierta dice que ha visto algo raro... aunque pocxs le creen."

];

/* =========================
   FONDOS ALEATORIOS
========================= */

const fondos = [

    "fondos/fondo_aurora_1.png",
    "fondos/fondo_ballena_1.png",
    "fondos/fondo_medusa_1.png",
    "fondos/fondo_peces_1.png",
    "fondos/fondo_pov_1.png"

];

function cambiarFondoAleatorio(){

    console.log("CAMBIANDO FONDO");

    const fondo = fondos[Math.floor(Math.random() * fondos.length)];

    const capaFondo = document.getElementById("fondo");

    console.log("CAPA FONDO:", capaFondo);
    console.log("IMAGEN ELEGIDA:", fondo);


    if(!capaFondo){

        document.body.style.backgroundImage = `url('${fondo}')`;

    } else {


        capaFondo.style.opacity = "0";


        setTimeout(()=>{

            capaFondo.style.backgroundImage = `url('${fondo}')`;

            capaFondo.style.opacity = "1";


        },500);

    }

}


/* =========================
   PISTAS SECRETAS
========================= */

function mostrarPistaSecreta(){

    const pista = pistasSecretas[
        Math.floor(Math.random() * pistasSecretas.length)
    ];


    mostrarMensaje(pista);

}


/* =========================
   FONDO INICIAL AL CARGAR
========================= */

window.addEventListener("load", () => {

    cambiarFondoAleatorio();

});

/* =========================
   ADMIN EMAILS
========================= */

const ADMIN_EMAILS = [
    "xing75949@gmail.com",
    "mikylove943@gmail.com",
    "xing75494@gmail.com"
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
   LOGIN GOOGLE
========================= */

function loginGoogle() {

    auth.signInWithPopup(googleProvider)

    .then(async (resultado)=>{

        const usuario = resultado.user;

        console.log("Usuario conectado:", usuario);


        await db.collection("usuarios").doc(usuario.uid).set({

            nombre: usuario.displayName,
            email: usuario.email,
            foto: usuario.photoURL,
            fechaRegistro: new Date()

        }, { merge: true });


        alert(
            "Bienvenidx a Potuslandia, " + usuario.displayName + " ⚓"
        );


        inicio();

    })

    .catch(error=>{

        console.error(error);
        alert("Error al intentar subir al barco.");

    });

}

function cerrarSesion() {

    auth.signOut()

    .then(() => {

        alert("Has salido del bote. ¡Hasta pronto! ⚓");

    })

    .catch(error => {

        console.error(error);
        alert("No se pudo salir del bote.");

    });

}

function mostrarAcceso() {

    document.getElementById("contenido").innerHTML = `
        <section class="hero">

            <h1>⚓ Bienvenidx a Potuslandia</h1>

            <p>
                Para acceder al tesoro necesitas registrarte en Potuslandia.
            </p>

            <button onclick="loginGoogle()">
                ⚓ Registrarse con Gmail
            </button>

        </section>
    `;

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

    const menuPrincipal = document.getElementById("menuPrincipal");
    const menuUsuario = document.getElementById("menuUsuario");
    const fotoUsuario = document.getElementById("fotoUsuario");
    const nombreUsuario = document.getElementById("nombreUsuario");
    const adminBtn = document.getElementById("adminBtn");

    if (user) {

    /* =========================
   PRESENCIA EN TIEMPO REAL
========================= */

const presenciaRef = rtdb.ref("presencia/" + user.uid);

presenciaRef.set({

    nombre: user.displayName || "Tripulante",
    foto: user.photoURL || "",
    conectado: true

});

presenciaRef.onDisconnect().remove();

    // Mostrar menú principal
    menuPrincipal.style.display = "flex";

    // Mostrar perfil de usuario
    menuUsuario.style.display = "flex";

    // Foto
    if (user.photoURL) {

        fotoUsuario.src = user.photoURL;

     } else {

        db.collection("usuarios").doc(user.uid).get()
            .then(doc => {

                if (doc.exists && doc.data().foto) {
                    fotoUsuario.src = doc.data().foto;
                }

            })
            .catch(error => {

                console.error("Error al cargar la foto:", error);

            });

    }

    // Nombre
    nombreUsuario.textContent = user.displayName || user.email;

    // Mostrar botón de administrador
    if (ADMIN_EMAILS.includes(user.email)) {
        adminBtn.style.display = "block";
    } else {
        adminBtn.style.display = "none";
    }

    inicio();

} else {

    // Ocultar menú principal
    menuPrincipal.style.display = "none";

    // Ocultar perfil
    menuUsuario.style.display = "none";

    mostrarAcceso();

}

});

let ultimaFraseTripulacion = "";

const FRASES_TRIPULACION = {

    vacio: [
        "🌊 El barco está tan tranquilo que hasta las gaviotas están echando una siesta.",
        "⚓ No hay ningún nakama en cubierta... ¿Seguro que esto no es un barco fantasma?",
        "💤 La capitana tiene la cubierta para ella sola. Hora de hablar con los barriles.",
        "🐙 Hasta el pulpo del puerto se ha ido porque aquí no pasa nada.",
        "🦜 El loro de a bordo está repitiendo 'aburrido' desde hace una hora.",
        "🌙 La cubierta está tan silenciosa que se escucha a una vela crujir.",
        "🚢 Potuslandia navega en modo fantasma... ¡nadie toca el timón!",
        "🐟 Los peces miran el barco y preguntan: '¿Hoy no hay fiesta?'",
        "⚓ La tripulación está desaparecida. Probablemente buscando snacks.",
        "🧭 La brújula está funcionando, pero no sabe a quién guiar."
    ],

    uno: [
        "🚢 Solo hay un nakama al mando. Esperemos que sepa distinguir proa de popa.",
        "☕ Un único nakama vigila la cubierta... seguramente con café en mano.",
        "🧭 Alguien tiene el timón. Ahora solo falta recordar hacia dónde vamos.",
        "⚓ Un héroe solitario navega el Potuslandia. Los barriles le apoyan.",
        "🐟 Un nakama en cubierta. Los peces ya están impresionados.",
        "🏴 El barco tiene capitán, marinero y cocinero... todo en una sola persona.",
        "🌊 La aventura empieza con un nakama. Los demás llegarán cuando huelan comida.",
        "🪢 Una persona, mil tareas. La vela no se va a levantar sola.",
        "🦜 El loro tiene más compañía que la tripulación ahora mismo.",
        "🚢 Un nakama controla el barco. Esperemos que no haya botón de autodestrucción."
    ],

    pocos: [
        "🪢 La tripulación empieza a desperezarse. Alguien acaba de encontrar la cafetera.",
        "🐟 Los peces empiezan a notar movimiento alrededor del barco.",
        "⚓ Ya hay suficientes manos para izar una vela... aunque alguien tendrá que empujar.",
        "🌊 Potuslandia vuelve a tener vida. Los barriles están emocionados.",
        "🍪 La tripulación crece lentamente... igual que la montaña de galletas.",
        "🧹 Ya hay gente suficiente para limpiar la cubierta. Qué mala suerte.",
        "🦜 El loro está feliz. Por fin tiene más personas a las que molestar.",
        "🚢 Varias velas arriba y ningún marinero perdido. De momento.",
        "⚓ La tripulación está reuniéndose. El caos organizado comienza.",
        "🧭 Más manos, más aventuras y probablemente más cosas rotas."
    ],

    varios: [
        "🚢 Potuslandia navega con buen viento y mejor compañía.",
        "🍌 Alguien ha dejado un plátano en cubierta... otra vez.",
        "🌊 La cubierta empieza a llenarse de vida.",
        "⚓ La tripulación ya puede montar una pequeña fiesta sin hundir el barco.",
        "🦜 El loro acaba de aprender nuevos nombres para gritar por la mañana.",
        "🍕 Hay suficientes nakamas para organizar una batalla por la última porción.",
        "🚢 El barco avanza fuerte. Incluso los barriles parecen motivados.",
        "🌴 La tripulación crece y las historias también.",
        "🐙 Los monstruos marinos están pensando dos veces antes de acercarse.",
        "🧭 Ya somos suficientes para perdernos en grupo."
    ],

    muchos: [
        "🪝 La capitana ya no da abasto saludando a todos los nakamas.",
        "⚓ El barco ya parece una auténtica tripulación pirata.",
        "🏴 Las velas están desplegadas y el viaje promete.",
        "🌊 Hay tanta gente en cubierta que hasta las olas piden permiso.",
        "🍲 El cocinero ha pedido ayuda porque desaparece la comida misteriosamente.",
        "🚢 Potuslandia está llena de voces, risas y alguna que otra pelea por tonterías.",
        "🪢 Hay tantxs nakamas que alguien ha perdido a alguien... y era él mismo.",
        "🐟 Los peces ya reconocen el barco por el ruido.",
        "⚓ La tripulación está completa. Ahora falta recordar dónde aparcamos.",
        "🦑 Hasta las criaturas marinas quieren unirse al viaje."
    ],

    multitud: [
        "🐙 Incluso los pulpos quieren unirse a la tripulación.",
        "🌊 ¡La cubierta está hasta arriba de nakamas!",
        "🪢 Si alguien grita '¡Tierra!', lo van a escuchar hasta los peces.",
        "🚢 Potuslandia necesita ampliar la cubierta. Los barriles ya no caben.",
        "🦜 El loro está confundido porque ya no sabe a quién insultar primero.",
        "⚓ Hay tanta tripulación que alguien acaba de pedir un mapa del propio barco.",
        "🌊 Las olas miran el barco y dicen: 'Demasiados pasajeros'.",
        "🍌 La comida desaparece tan rápido que parece magia.",
        "🏴 La bandera ondea fuerte. Probablemente por la cantidad de gente empujando.",
        "🐋 Una ballena se acercó solo para comprobar qué está pasando."
    ],

    legendario: [
        "🐋 Una ballena acaba de asomarse para cotillear qué está pasando.",
        "🚢 Si seguimos embarcando nakamas habrá que construir otro barco.",
        "👑 ¡La cubierta está tan llena que las gaviotas tienen que pedir turno para aterrizar!",
        "🌊 Potuslandia ya no navega... desfila por el océano.",
        "⚓ Hay tantxs nakamas que el barco necesita una lista de asistencia.",
        "🦜 El loro se ha jubilado porque no puede saludar a tanta gente.",
        "🐙 Los monstruos marinos están pensando en pedir autógrafos.",
        "🚢 La tripulación es tan grande que alguien está perdido desde ayer.",
        "🏴 La capitana mira la cubierta y pregunta: '¿Todxs cabemos aquí?'",
        "🌌 Hasta las estrellas miran abajo para contar cuántxs nakamas hay."
    ]

};

function obtenerFraseTripulacion(activos){

    let lista;

    if(activos === 0){

        lista = FRASES_TRIPULACION.vacio;

    }else if(activos === 1){

        lista = FRASES_TRIPULACION.uno;

    }else if(activos <= 5){

        lista = FRASES_TRIPULACION.pocos;

    }else if(activos <= 15){

        lista = FRASES_TRIPULACION.varios;

    }else if(activos <= 30){

        lista = FRASES_TRIPULACION.muchos;

    }else if(activos <= 60){

        lista = FRASES_TRIPULACION.multitud;

    }else{

        lista = FRASES_TRIPULACION.legendario;

    }


    let frase;


    do {

        frase = lista[Math.floor(Math.random() * lista.length)];

    } while(frase === ultimaFraseTripulacion && lista.length > 1);



    ultimaFraseTripulacion = frase;


    return frase;

}

/* =========================
   ESTADO DE LA TRIPULACIÓN
========================= */

function cargarTripulacion(){

    const referencia = rtdb.ref("presencia");

    referencia.on("value", async snapshot => {

        const activos = snapshot.exists()
            ? Object.keys(snapshot.val()).length
            : 0;

        const usuariosSnapshot = await db
            .collection("usuarios")
            .get();

        const totalUsuarios = usuariosSnapshot.size;

        const enPuerto = totalUsuarios - activos;

        const totalTexto = document.getElementById("tripulacion");

        if(!totalTexto) return;

        const frase = obtenerFraseTripulacion(activos);

        totalTexto.innerHTML = `

            <h3>⚓ Estado de la tripulación</h3>

            <p>
                🟢 Nakamas a bordo: ${activos}
            </p>

            <p>
                ⚪ Descansando: ${enPuerto}
            </p>

            <br>

            <p class="fraseTripulacion">
                ${frase}
            </p>

        `;

    });

}

/* =========================
   INICIO
========================= */

function inicio() {
   
    document.getElementById("contenido").innerHTML = `
        <section class="hero">

            <h1>¡Bienvenidx a bordo!</h1>


            <p>
                Una comunidad de nakamas y buen rollo.
            </p>


            <button onclick="archivos()">
                Investigar el botín
            </button>


            <br><br><br>


            <div id="tripulacion"></div>


            <button class="btnFondo" onclick="cambiarFondoAleatorio()">
                🌌
            </button>


        </section>
    `;


    console.log("INICIO LLAMANDO A TRIPULACION");


    cargarTripulacion();

}

/* =========================
   GET RECURSOS
========================= */

async function getRecursos() {
    const snap = await db.collection("recursos").get();

    return snap.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    }));
}

/* =========================
   GET FAVORITOS USUARIO
========================= */

async function getFavoritosUsuario(){

    if(!auth.currentUser){

        return [];

    }


    const uid = auth.currentUser.uid;


    const snap = await db
        .collection("favoritos")
        .where("usuario", "==", uid)
        .get();


    return snap.docs.map(doc => doc.data().recurso);

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
                <h1>⛔ Nakama no identificado </h1>
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

    const favoritosUsuario = await getFavoritosUsuario();

    document.getElementById("contenido").innerHTML = `
        <section class="hero">

            <h1>📁 Tesoro</h1>

            <input 
                id="buscador"
                type="text"
                placeholder="🔍 Buscar tesoro..."
                oninput="buscar()"
                style="padding:10px; width:80%; max-width:400px;"
            >

            <p>Actualmente hay <strong id="contador">${datos.length}</strong></p>

            <button onclick="inicio()">⬅ Volver</button>

        </section>

        <section class="cards" id="lista"></section>
        `;


        mostrar(datos, favoritosUsuario);

        mostrarMensaje("⬇️ Los tesoros te esperan más abajo ^^.");

}


/* =========================
   MIS FAVORITOS
========================= */

async function misFavoritos(){

    const favoritosUsuario = await getFavoritosUsuario();

    const datos = await getRecursos();


    const listaFavoritos = datos.filter(r =>
        favoritosUsuario.includes(r.id)
    );


    document.getElementById("contenido").innerHTML = `

        <section class="hero">

            <h1>🌟 Mis favoritos</h1>

            <button onclick="inicio()">
                ⬅ Volver
            </button>

        </section>


        <section class="cards" id="lista"></section>

    `;


    mostrar(listaFavoritos, favoritosUsuario);

}

/* =========================
   MI PERFIL
========================= */

function miPerfil() {

    if (!auth.currentUser) {

        mostrarMensaje("Debes iniciar sesión.");
        return;

    }

    const usuario = auth.currentUser;

    const fecha = new Date(usuario.metadata.creationTime);

    const fechaTexto = fecha.toLocaleDateString("es-ES", {
        day: "numeric",
        month: "long",
        year: "numeric"
    });

    const horaTexto = fecha.toLocaleTimeString("es-ES", {
        hour: "2-digit",
        minute: "2-digit"
    });

    document.getElementById("contenido").innerHTML = `

        <section class="hero cajaPerfil">

            <h1>👤 Mi perfil</h1>

            <br>

            <img
                src="${usuario.photoURL}"
                class="fotoPerfilGrande"
            >

            <br><br>

            <h2>${usuario.displayName}</h2>

            <p>
                📧 ${usuario.email}
            </p>

            <br>

            <p><strong>🆔 ID de tripulante</strong></p>

            <div
                id="miUID"
                class="uidCaja"
            >
                ${usuario.uid}
            </div>

            <button
                class="btnCopiar"
                onclick="copiarUID()"
            >
                📋 Copiar ID
            </button>

            <br><br>

            <p><strong>📅 A bordo desde</strong></p>

            <p>
                ${fechaTexto}
                <br>
                ${horaTexto}
            </p>

            <br>

            <p><strong>⏳ Tiempo navegando: </strong></p>

            <p id="tiempoNavegando">
                Calculando...
            </p>

            <br>

            <p id="estadoPerfil">
                📜 La capitana está contando a los nakamas a bordo...
            </p>

            <br>

            <p><i>⚓ Todo gran viaje comienza con subir a bordo.</i></p>

            <br>

            <button onclick="inicio()">
                ⬅ Volver
            </button>

        </section>

    `;

    comprobarEstadoPerfil();

}

/* =========================
   TIEMPO NAVEGANDO
========================= */

function actualizarTiempoNavegando(fechaRegistro){

    const ahora = new Date();

    let diferencia = Math.floor((ahora - fechaRegistro) / 1000);


    const dias = Math.floor(diferencia / 86400);

    diferencia %= 86400;


    const horas = Math.floor(diferencia / 3600);

    diferencia %= 3600;


    const minutos = Math.floor(diferencia / 60);


    const elemento = document.getElementById("tiempoNavegando");


    if(!elemento) return;


    let texto = "";


    if(dias > 0){

        texto += `${dias} día${dias !== 1 ? "s" : ""}`;

    }


    if(horas > 0){

        if(texto !== "") texto += "<br>";

        texto += `${horas} hora${horas !== 1 ? "s" : ""}`;

    }


    if(minutos > 0){

        if(texto !== "") texto += "<br>";

        texto += `${minutos} minuto${minutos !== 1 ? "s" : ""}`;

    }


    if(texto === ""){

        texto = "Recién embarcado ⚓";

    }


    elemento.innerHTML = texto;

}

/* =========================
   ESTADO DEL TRIPULANTE
========================= */

function comprobarEstadoPerfil(){

    if(!auth.currentUser) return;

    const uid = auth.currentUser.uid;

    const referencia = rtdb.ref("presencia/" + uid);

    referencia.on("value", snapshot => {

        const estado = document.getElementById("estadoPerfil");

        if(!estado) return;

        if(snapshot.exists()){

            estado.innerHTML = "🟢 La capitana confirma que sigues a bordo.";

        } else {

            estado.innerHTML = "💤 La capitana marca tu nombre como descansando.";

        }

    });

}

/* =========================
   COPIAR UID
========================= */

function copiarUID(){

    if(!auth.currentUser) return;

    navigator.clipboard.writeText(auth.currentUser.uid)
        .then(() => {

            mostrarMensaje("🐙 El pulpo de cubierta te ha prestado su tinta para que anotes el ID.");

        })
        .catch(error => {

            console.error(error);

            mostrarMensaje("🌊 Una ola ha movido el barco. No se pudo guardar tu ID.");

        });

}

/* =========================
   MOSTRAR
========================= */

function mostrar(listaRecursos, favoritosUsuario = []) {

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

            <div class="botonesCard">

                <button
                class="btnFavorito ${favoritosUsuario.includes(r.id) ? "favoritoActivo" : ""}"
                id="fav-${r.id}"
                onclick="toggleFavorito('${r.id}')"
                >
                ${favoritosUsuario.includes(r.id) ? "🌟" : "⭐"}
                </button>
    
                <button
                    class="btnDescargar"
                    onclick="window.open('${r.enlace}', '_blank')"
                >
                    📥 Descargar
                </button>

            </div>

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
        tipo: "Web",
        enlace,
        fecha: new Date()
    };

    try{

        await db.collection("recursos").add(nuevo);

        alert("✅ Tesoro añadido correctamente.");

        panelAdmin();

    }catch(error){

        console.error(error);
        alert("Ha ocurrido un error al guardar.");

    }

}

function toggleMenu() {

    console.log("DENTRO DEL TOGGLE MENU");

    const menu = document.getElementById("menuDesplegable");
    const flecha = document.getElementById("flechaMenu");

    if (!menu) return;

    if (menu.style.display === "block") {

        menu.style.display = "none";

        if (flecha) {
            flecha.style.transform = "rotate(0deg)";
        }

    } else {

        menu.style.display = "block";

        if (flecha) {
            flecha.style.transform = "rotate(180deg)";
        }

    }

}

console.log("TOGGLE MENU CARGADO");

/* =========================
   FAVORITOS
========================= */

async function toggleFavorito(idRecurso){

    if(!auth.currentUser){

        alert("Debes iniciar sesión.");

        return;

    }


    const uid = auth.currentUser.uid;


    const idFavorito = uid + "_" + idRecurso;


    const favorito = await db
        .collection("favoritos")
        .doc(idFavorito)
        .get();


    const boton = document.getElementById("fav-" + idRecurso);



    if(favorito.exists){


        await db
            .collection("favoritos")
            .doc(idFavorito)
            .delete();

        alert("⭐ Expulsado de Favoritos");

        if(boton){

            boton.innerHTML = "⭐";
            boton.classList.remove("favoritoActivo");

        }


    } else {


        await db
            .collection("favoritos")
            .doc(idFavorito)
            .set({

                usuario: uid,
                recurso: idRecurso,
                fecha: new Date()

            });

            alert("🌟 Guardado en Favoritos");

        if(boton){

            boton.innerHTML = "🌟";
            boton.classList.add("favoritoActivo");

        }

    }

}

/* =========================
   MENSAJES TEMPORALES
========================= */

function mostrarMensaje(texto){

    const mensaje = document.createElement("div");

    mensaje.className = "mensajeTemporal";

    mensaje.innerHTML = texto;

    document.body.appendChild(mensaje);


    setTimeout(() => {

        mensaje.classList.add("mostrar");

    }, 50);


    setTimeout(() => {

        mensaje.classList.remove("mostrar");


        setTimeout(() => {

            mensaje.remove();

        }, 300);


    }, 3000);

}

/* =========================
   COMUNIDAD
========================= */

function comunidad(){

    document.getElementById("contenido").innerHTML = `

        <section class="hero">

            <h1>🌊 Comunidad Potuslandia</h1>

            <p>
                Explora y descubre todo lo que ofrece la comunidad.
            </p>


            <div class="comunidadMenu">


                <button onclick="inicio()">
                    ⬅ Volver
                </button>


                <button onclick="normas()">
                    📜 Normas
                </button>


                <button onclick="guia()">
                    🧭 Guía
                </button>


                <button onclick="noticias()">
                    📢 Noticias
                </button>


                <button onclick="discord()">
                    💬 Discord
                </button>


            </div>

        </section>

    `;

}

/* =========================
   NORMAS COMUNIDAD
========================= */

function normas(){

    document.getElementById("contenido").innerHTML = `

        <section class="hero">

            <h1>📜 Normas de Potuslandia</h1>


            <p>
                Para mantener la isla tranquila y agradable para todos:

            </p>


            <div class="comunidadTexto">


                <p>
                    ⚓ Respeta al resto de navegantes.
                </p>


                <p>
                    🌱 Comparte botín seguro.
                </p>


                <p>
                    💬 Mantén un buen ambiente en la comunidad.
                </p>


                <p>
                    🚫 No uses lenguaje ofensivo o dañino.
                </p>


                <p>
                    🗺️ Explora, comparte y disfruta de Potuslandia.
                </p>


                <button onclick="comunidad()">
                    ⬅ Volver a Comunidad
                </button>


            </div>

        </section>

    `;

}

/* =========================
   GUIA COMUNIDAD
========================= */

function guia(){

    document.getElementById("contenido").innerHTML = `

        <section class="hero">

            <h1>🧭 Guía de Potuslandia</h1>


            <p>
                Aprende a explorar la isla y encontrar sus tesoros.
            </p>


            <div class="comunidadTexto">


                <p>
                    📁 Archivos: encuentra y descarga recursos.
                </p>


                <p>
                    🌟 Favoritos: guarda tus tesoros preferidos.
                </p>


                <p>
                    🔍 Buscador: encuentra rápidamente lo que buscas.
                </p>


                <p>
                    👤 Perfil: administra tu cuenta.
                </p>


                <p>
                    🌊 Comunidad: descubre nuevas zonas a bordo.
                </p>


                <button onclick="comunidad()">
                    ⬅ Volver a Comunidad
                </button>


            </div>

        </section>

    `;

}

/* =========================
   NOTICIAS COMUNIDAD
========================= */

function noticias(){

    document.getElementById("contenido").innerHTML = `

        <section class="hero">

            <h1>📢 Noticias Potuslandia</h1>


            <p>
                Este espacio del barco todavía está en construcción.
            </p>


            <div class="comunidadTexto">


                <p>
                    ⚓ El Soporte está construyendo este rincón para futuros avisos.
                </p>


                <p>
                    🌱 Próximamente encontrarás aquí las novedades de Potuslandia.
                </p>


                <p>
                    🗺️ Sigue explorando mientras terminamos esta zona.
                </p>


                <button onclick="comunidad()">
                    ⬅ Volver a Comunidad
                </button>


            </div>

        </section>

    `;

}

/* =========================
   DISCORD COMUNIDAD
========================= */

function discord(){

    document.getElementById("contenido").innerHTML = `

        <section class="hero">

            <h1>💬 Discord Potuslandia</h1>


            <p>
                Únete a la tripulación y navega junto a otrxs exploradores.
            </p>


            <div class="comunidadTexto">


                <p>
                    ⛵ Comparte tus descubrimientos.
                </p>


                <p>
                    🛟 Ayuda a otrxs navegantes.
                </p>


                <p>
                    📢 Descubre avisos y novedades.
                </p>


                <button onclick="abrirDiscord()">
                    💬 Entrar al Discord
                </button>


                <br>


                <button onclick="comunidad()">
                    ⬅ Volver a Comunidad
                </button>


            </div>

        </section>

    `;

}

/* =========================
   ABRIR DISCORD
========================= */

function abrirDiscord(){

    window.open(
        "https://discord.gg/9HmZhRUK4H",
        "_blank"
    );

}

/* =========================
   MI PERFIL
========================= */

function miPerfil() {

    if (!auth.currentUser) {

        mostrarMensaje("Debes iniciar sesión.");
        return;

    }

    const usuario = auth.currentUser;

    const fecha = new Date(usuario.metadata.creationTime);

    const fechaTexto = fecha.toLocaleDateString("es-ES", {
        day: "numeric",
        month: "long",
        year: "numeric"
    });

    const horaTexto = fecha.toLocaleTimeString("es-ES", {
        hour: "2-digit",
        minute: "2-digit"
    });

    document.getElementById("contenido").innerHTML = `

        <section class="hero">

            <div class="carnetPerfil">

                <h2>⚓ POTUSLANDIA</h2>

                <br>

                <img
                    src="${usuario.photoURL}"
                    class="fotoPerfilGrande"
                    id="fotoSecreta"
                    onclick="clicFotoSecreta()"
                >

                <br><br>

                <h1>${usuario.displayName}</h1>

                <h3>⚓ Tripulante</h3>

                <br>

                <p>
                    📧 ${usuario.email}
                </p>

                <br>

                <p><strong>🆔 ID de tripulante</strong></p>

                <div
                    class="uidCaja"
                    id="miUID"
                >
                    ${usuario.uid}
                </div>

                <br>

                <button
                    class="btnCopiar"
                    onclick="copiarUID()"
                >
                    📋 Copiar ID
                </button>

                <br><br>

                <p><strong>📅 A bordo desde...</strong></p>

                <p>
                    ${fechaTexto}
                    <br>
                    ${horaTexto}
                </p>

                <br>

                <p><strong>⏳ Tiempo navegando</strong></p>

                <p id="tiempoNavegando">
                    Calculando...
                </p>

                <br>

                <p id="estadoPerfil">
                    📜 La capitana está contando a los nakamas a bordo...
                </p>

                <br>

                <button onclick="inicio()">
                    ⬅ Volver
                </button>

            </div>

        </section>

    `;

    comprobarEstadoPerfil();

    const fechaRegistro = new Date(usuario.metadata.creationTime);

    actualizarTiempoNavegando(fechaRegistro);

    setInterval(() => {

        actualizarTiempoNavegando(fechaRegistro);

    }, 1000);

}

/* =========================
   FOTO SECRETA
========================= */

let clicksFotoSecreta = 0;

function clicFotoSecreta(){

    clicksFotoSecreta++;

    switch(clicksFotoSecreta){

        case 1:
            mostrarMensaje("📜 La capitana te dedica una mirada curiosa.");
            break;

        case 2:
            mostrarMensaje("👀 Parece que buscas algo...");
            break;

        case 3:
            mostrarMensaje("⚓ Hay nakamas que nunca dejan de explorar.");
            break;

        case 4:
            mostrarMensaje("🐙 El pulpo de cubierta parece querer enseñarte algo.");
            break;

        case 5:

            mostrarSecretoDescubierto();

            // Reinicia el contador para poder volver a descubrir el secreto
            clicksFotoSecreta = 0;

            break;

    }

}


/* =========================
   CARTEL SECRETO DESCUBIERTO
========================= */

function mostrarSecretoDescubierto(){

    console.log("🔓 SECRETO DESBLOQUEADO");


    const cartel = document.createElement("div");

    cartel.id = "cartelSecreto";


    cartel.innerHTML = `

        <div class="contenidoSecreto aparecerPixel">

            <h2>
                🔓 SECRETO DESCUBIERTO
            </h2>


            <p>
                🏴‍☠️ La capitana sonríe.
            </p>


            <p>
                Has demostrado ser un nakama persistente.
            </p>


            <p>
                Como recompensa, Soporte comparte contigo
                la ubicación de un pequeño tesoro escondido.
            </p>


            <p>
                🎬 Cofre de películas
            </p>


            <button
                onclick="abrirCofre()"
            >
                🎬 Abrir el cofre
            </button>


            <button
                class="botonEsconder"
                onclick="cerrarSecreto()"
            >
                Esconder
            </button>


        </div>

    `;


    document.body.appendChild(cartel);

}



/* =========================
   ABRIR COFRE SECRETO
========================= */

function abrirCofre(){

    console.log("🎬 Cofre abierto");


    window.open(
        "https://gofile.io/d/g6sTYT",
        "_blank"
    );


    cerrarSecreto();

}



/* =========================
   CERRAR CARTEL SECRETO
========================= */

function cerrarSecreto(){

    const cartel = document.getElementById("cartelSecreto");


    if(cartel){

        cartel.remove();

    }

}

/* =========================
   START
========================= */
