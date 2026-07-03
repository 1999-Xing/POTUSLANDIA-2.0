function inicio() {
    document.getElementById("contenido").innerHTML = `
        <section class="hero">
            <h1>¡Bienvenidx a bordo!</h1>
            <p> Una comunidad de nakamas y buen rollo.</p>

            <button onclick="archivos()">
                Investigar el botín
            </button>
        </section>

        <section class="cards">
            <div class="card">
                📁
                <h2>Tesoro</h2>
                <p>Explora los archivos de la comunidad.</p>
            </div>

            <div class="card">
                ⭐
                <h2>Destacados</h2>
                <p>Los botines más jugosos.</p>
            </div>

            <div class="card">
                👥
                <h2>Comunidad</h2>
                <p>Casi 30.000 nakamas.</p>
            </div>
        </section>
    `;
}

function archivos() {
    document.getElementById("contenido").innerHTML = `
        <section class="hero">
            <h1>📁 Tesoro</h1>
            <p>Aquí aparecerán todos los archivos subidos.</p>

            <button onclick="inicio()">
                ⬅ Volver al inicio
            </button>
        </section>
    `;
}

function favoritos() {
    document.getElementById("contenido").innerHTML = `
        <section class="hero">
            <h1>⭐ Favoritos</h1>
            <p>Aquí estarán tus archivos favoritos.</p>

            <button onclick="inicio()">
                ⬅ Volver al inicio
            </button>
        </section>
    `;
}

function comunidad() {
    document.getElementById("contenido").innerHTML = `
        <section class="hero">
            <h1>👥 Comunidad</h1>
            <p>Camarote de nakamas.</p>

            <button onclick="inicio()">
                ⬅ Volver al inicio
            </button>
        </section>
    `;
}

// 🔥 Arranque automático
inicio();