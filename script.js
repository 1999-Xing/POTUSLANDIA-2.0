function inicio() {
    document.getElementById("contenido").innerHTML = `
        <section class="hero">
            <h1>Bienvenido a Potuslandia</h1>
            <p>Una biblioteca creada por la comunidad para compartir recursos y mucho más.</p>
            <button>Explorar archivos</button>
        </section>

        <section class="cards">
            <div class="card">
                📁
                <h2>Archivos</h2>
                <p>Explora miles de archivos organizados.</p>
            </div>

            <div class="card">
                ⭐
                <h2>Destacados</h2>
                <p>Los recursos favoritos de la comunidad.</p>
            </div>

            <div class="card">
                👥
                <h2>Comunidad</h2>
                <p>Más de 30.000 miembros colaborando.</p>
            </div>
        </section>
    `;
}

function archivos() {
    document.getElementById("contenido").innerHTML = `
        <section class="hero">
            <h1>📁 Archivos</h1>
            <p>Aquí aparecerán todos los archivos compartidos.</p>
        </section>
    `;
}

function favoritos() {
    document.getElementById("contenido").innerHTML = `
        <section class="hero">
            <h1>⭐ Favoritos</h1>
            <p>Aquí estarán tus archivos favoritos.</p>
        </section>
    `;
}