/* =========================
   CARGAR NOTICIAS
========================= */


async function cargarNoticias() {


    console.log("📰 CARGANDO NOTICIAS...");


    try {


        const snapshot = await db.collection("noticias")
            .orderBy("fecha", "desc")
            .get();



        console.log("Noticias encontradas:", snapshot.size);



        let html = "";



        if (snapshot.empty) {


            html = `

                <div class="sinNoticias">

                    🌊 Todavía no hay noticias en el tablón.

                </div>

            `;


        } else {



            snapshot.forEach((doc) => {



                const noticia = doc.data();



                console.log("📢 NOTICIA RECIBIDA:", {
                    autor: noticia.autor,
                    categoria: noticia.categoria,
                    canal: noticia.canal,
                    contenido: noticia.contenido,
                    imagenes: noticia.imagenes,
                    embeds: noticia.embeds
                });





                let icono = "📢";


                if (noticia.categoria === "mods") {

                    icono = "🛠️";

                }




                let imagenesHTML = "";



                if (
                    noticia.imagenes &&
                    noticia.imagenes.length > 0
                ) {


                    noticia.imagenes.forEach((imagen) => {


                        imagenesHTML += `

                            <div class="noticiaImagen">

                                <img
                                    src="${imagen.url}"
                                    alt="${imagen.nombre || "Imagen Discord"}"
                                >

                            </div>

                        `;


                    });


                }





                html += `



                <article class="noticiaCard">



                    <div class="noticiaCabecera">


                        <img
                            class="avatarNoticia"
                            src="${noticia.avatar || 'https://cdn.discordapp.com/embed/avatars/0.png'}"
                            alt="Avatar"
                        >



                        <div>

                            <h3>
                                ${noticia.autor || "Usuario"}
                            </h3>


                            <span>
                                ${icono}
                                ${noticia.canal || "Discord"}
                            </span>


                        </div>


                    </div>





                    <div class="noticiaContenido">

                        ${
                            noticia.contenido
                            ?
                            formatearDiscord(noticia.contenido)
                            :
                            "📭 Sin texto"
                        }

                    </div>





                    ${imagenesHTML}





                    <div class="noticiaPie">


                        <span>

                            ⚓ ${(noticia.categoria || "general").toUpperCase()}

                        </span>




                        ${
                            noticia.urlDiscord
                            ?

                            `

                            <a
                                href="${noticia.urlDiscord}"
                                target="_blank"
                                class="discordLink"
                            >

                                💬 Ver en Discord

                            </a>

                            `

                            :

                            ""

                        }


                    </div>



                </article>



                `;



            });



        }




        const contenedor = document.getElementById("noticias");



        if (contenedor) {


            contenedor.innerHTML = html;


        } else {


            console.error(
                "❌ No existe #noticias"
            );


        }




    } catch(error) {


        console.error(
            "❌ Error cargando noticias:",
            error
        );


    }


}

/* =========================
   FORMATEAR DISCORD
========================= */


function formatearDiscord(texto) {


    if (!texto) return "";



    return texto


        // Negrita Discord
        .replace(
            /\*\*(.*?)\*\*/g,
            "<strong>$1</strong>"
        )


        // Cursiva Discord
        .replace(
            /\*(.*?)\*/g,
            "<em>$1</em>"
        )


        // Enlaces
        .replace(
            /(https?:\/\/[^\s]+)/g,
            '<a href="$1" target="_blank">$1</a>'
        )


        // Canales Discord
        .replace(
            /<#(\d+)>/g,
            "💬 Canal Discord"
        )


        // Roles Discord
        .replace(
            /<@&(\d+)>/g,
            "👥 Rol"
        )


        // Usuarios Discord
        .replace(
            /<@(\d+)>/g,
            "👤 Usuario"
        )


        // Separadores
        .replace(
            /---/g,
            "<hr>"
        )


        // Saltos de línea
        .replace(
            /\n/g,
            "<br>"
        );

}