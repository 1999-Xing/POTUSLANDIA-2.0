function inicio() {
    document.getElementById("contenido").innerHTML = `
        <section class="hero">
            <h1>¡Bienvenidx a bordo!</h1>
            <p>Una comunidad de nakamas y buen rollo.</p>

            <button onclick="archivos()">
                Investigar el botín
            </button>
        </section>
    `;
}

function archivos() {

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

            <p>Actualmente hay <strong id="contador">${RECURSOS.length}</strong> recursos.</p>

            <button onclick="inicio()">
                ⬅ Volver al inicio
            </button>
        </section>

        <section class="cards" id="lista">
        </section>
    `;

    mostrar(RECURSOS);
}

function mostrar(listaRecursos) {

    let lista = "";

    listaRecursos.forEach(recurso => {

        lista += `
            <div class="card">
                <h2>${recurso.nombre}</h2>
                <p><strong>Categoría:</strong> ${recurso.categoria}</p>
                <p>${recurso.descripcion}</p>
                <p><strong>Origen:</strong> ${recurso.origen}</p>
                <p><strong>Tipo:</strong> ${recurso.tipo}</p>
                <button>Descargar</button>
            </div>
        `;
    });

    document.getElementById("lista").innerHTML = lista;
}

function buscar() {

    const texto = document.getElementById("buscador").value.toLowerCase();

    const filtrados = RECURSOS.filter(r =>
        r.nombre.toLowerCase().includes(texto) ||
        r.categoria.toLowerCase().includes(texto) ||
        r.descripcion.toLowerCase().includes(texto) ||
        r.origen.toLowerCase().includes(texto) ||
        r.tipo.toLowerCase().includes(texto)
    );

    document.getElementById("contador").innerText = filtrados.length;

    mostrar(filtrados);
}

function favoritos() {
    document.getElementById("contenido").innerHTML = `
        <section class="hero">
            <h1>⭐ Favoritos</h1>
            <button onclick="inicio()">⬅ Volver</button>
        </section>
    `;
}

function comunidad() {
    document.getElementById("contenido").innerHTML = `
        <section class="hero">
            <h1>👥 Comunidad</h1>
            <button onclick="inicio()">⬅ Volver</button>
        </section>
    `;
}

inicio();