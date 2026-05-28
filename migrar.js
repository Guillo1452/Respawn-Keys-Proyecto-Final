// ======================================================
// RESPAWNKEYS - MIGRADOR SOLO TERROR
// Juegos de terror buenos y conocidos
// ======================================================

const admin = require('firebase-admin');
const axios = require('axios');

// ======================================================
// FIREBASE
// ======================================================

const serviceAccount =
require('./serviceAccountKey.json');

admin.initializeApp({
  credential:
    admin.credential.cert(
      serviceAccount
    )
});

const db = admin.firestore();

// ======================================================
// CONFIG
// ======================================================

const RAWG_API_KEY =
'32057b4ef11a43dcb5ddc271141d344d';

const COLLECTION = 'juegos';

const TOTAL_JUEGOS = 40;

// ======================================================
// PALABRAS BASURA
// ======================================================

const PALABRAS_BASURA = [

  'dlc',
  'soundtrack',
  'demo',
  'bundle',
  'pack',
  'beta',
  'alpha',
  'test',
  'prototype',
  'wallpaper',
  'avatar',
  'theme'

];

// ======================================================
// VALIDAR
// ======================================================

function esJuegoValido(juego) {

  if (!juego) return false;

  const nombre =
    (juego.name || '')
      .toLowerCase();

  // =========================================
  // IMAGEN
  // =========================================

  if (!juego.background_image) {
    return false;
  }

  // =========================================
  // BASURA
  // =========================================

  for (const palabra of PALABRAS_BASURA) {

    if (nombre.includes(palabra)) {
      return false;
    }

  }

  // =========================================
  // RATING
  // =========================================

  if (
    (juego.rating || 0) < 2.8
  ) {
    return false;
  }

  // =========================================
  // POPULARIDAD
  // =========================================

  if (
    (juego.ratings_count || 0) < 15
  ) {
    return false;
  }

  return true;

}

// ======================================================
// PRECIO
// ======================================================

function generarPrecio(fechaLanzamiento) {

  const fecha =
    new Date(fechaLanzamiento);

  const hoy =
    new Date();

  const diferenciaDias = Math.floor(

    (hoy - fecha)

    /

    (1000 * 60 * 60 * 24)

  );

  // NUEVOS
  if (diferenciaDias <= 365) {

    return Math.floor(

      Math.random()

      *

      (280000 - 180000 + 1)

    ) + 180000;

  }

  // RECIENTES
  if (diferenciaDias <= 1500) {

    return Math.floor(

      Math.random()

      *

      (180000 - 90000 + 1)

    ) + 90000;

  }

  // VIEJOS
  return Math.floor(

    Math.random()

    *

    (90000 - 40000 + 1)

  ) + 40000;

}

// ======================================================
// DESCARGAR
// ======================================================

async function obtenerJuegos() {

  try {

    const response =
      await axios.get(

        'https://api.rawg.io/api/games',

        {
          params: {

            key:
              RAWG_API_KEY,

            page_size: 40,

            ordering:
              '-metacritic',

            dates:
              '2010-01-01,2025-12-31',

            exclude_additions:
              true

          }
        }

      );

    return (
      response.data.results || []
    );

  } catch (error) {

    console.error(
      '❌ Error RAWG'
    );

    console.error(
      error.response?.data
      || error.message
    );

    return [];

  }

}

// ======================================================
// PRINCIPAL
// ======================================================

async function migrarTerror() {

  try {

    console.log('\n================================');

    console.log(
      '👻 MIGRADOR TERROR'
    );

    console.log('================================\n');

    const juegos =
      await obtenerJuegos();

    console.log(
      `🎮 Descargados: ${juegos.length}\n`
    );

    // =========================================
    // FILTRO TERROR
    // =========================================

    const juegosTerror = juegos.filter(juego => {

      const texto = (

        juego.name + ' ' +

        (juego.tags || [])
          .map(t => t.name)
          .join(' ') + ' ' +

        (juego.genres || [])
          .map(g => g.name)
          .join(' ')

      ).toLowerCase();

      return (

        texto.includes('horror')

        ||

        texto.includes('survival')

        ||

        texto.includes('zombie')

        ||

        texto.includes('dead')

        ||

        texto.includes('evil')

        ||

        texto.includes('fear')

        ||

        texto.includes('dark')

        ||

        texto.includes('ghost')

        ||

        texto.includes('monster')

      );

    });

    console.log(
      `👻 Horror encontrados: ${juegosTerror.length}\n`
    );

    // =========================================
    // VALIDAR
    // =========================================

    const filtrados =

      juegosTerror

        .filter(esJuegoValido)

        .sort((a, b) => {

          const scoreA =

            (a.metacritic || 0)

            +

            ((a.rating || 0) * 10);

          const scoreB =

            (b.metacritic || 0)

            +

            ((b.rating || 0) * 10);

          return scoreB - scoreA;

        })

        .slice(
          0,
          TOTAL_JUEGOS
        );

    console.log(
      `✅ Válidos: ${filtrados.length}\n`
    );

    // =========================================
    // MOSTRAR
    // =========================================

    filtrados.forEach(j => {

      console.log(
        `🎮 ${j.name}`
      );

    });

    console.log('');

    // =========================================
    // FIRESTORE
    // =========================================

    let agregados = 0;

    for (const juego of filtrados) {

      const categoria =

        juego.genres?.length

          ? juego.genres[0].name

          : 'Horror';

      const plataforma =

        juego.platforms

          ?.map(
            p => p.platform.name
          )

          .join(', ')

          ||

          'PC';

      const galeria =

        juego.short_screenshots

          ? juego.short_screenshots.map(
              s => s.image
            )

          : [];

      const destacado =

        (juego.metacritic || 0) >= 75

        ||

        (juego.rating || 0) >= 4;

      const nuevoJuego = {

        titulo:
          juego.name,

        descripcion:

          `Disfruta de ${juego.name} con clave digital instantánea y segura.`,

        categoria:
          'Horror',

        plataforma,

        precio:

          generarPrecio(
            juego.released
          ),

        promocion:
          destacado ? 10 : 15,

        principal:
          juego.background_image,

        fotocarrito:
          juego.background_image,

        galeria,

        rating:
          juego.rating || 0,

        metacritic:
          juego.metacritic || 0,

        fechaLanzamiento:
          juego.released,

        destacado,

        tipo:
          'popular',

        fechaImportacion:
          new Date().toISOString()

      };

      await db

        .collection(COLLECTION)

        .doc(juego.slug)

        .set(

          nuevoJuego,

          {
            merge: true
          }

        );

      agregados++;

      console.log(
        `✅ ${juego.name}`
      );

    }

    console.log('\n================================');

    console.log(
      `🔥 ${agregados} juegos horror agregados`
    );

    console.log('================================\n');

  } catch (error) {

    console.error(
      '\n❌ ERROR GENERAL\n'
    );

    console.error(error);

  }

}

// ======================================================
// EJECUTAR
// ======================================================

migrarTerror();