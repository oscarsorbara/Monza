export interface Review {
    name: string;
    avatar: string;
    rating: number;
    comment: string;
}

// Reviews por handle de producto. Cada producto tiene su set único.
export const PRODUCT_REVIEWS: Record<string, Review[]> = {
    // Ópticas BMW Serie 2 F22 Look G
    'opticas-bmw-f22-g-look-nuevo-serie-2': [
        { name: 'Matías G.', avatar: 'https://i.pravatar.cc/150?img=12', rating: 5, comment: 'Le cambió la cara al auto, parece otro. Muy conforme.' },
        { name: 'Agustín R.', avatar: 'https://i.pravatar.cc/150?img=60', rating: 4, comment: 'Muy buenas ópticas, la instalación me llevó un ratito pero salió bien.' },
        { name: 'Leandro P.', avatar: 'https://i.pravatar.cc/150?img=65', rating: 5, comment: 'Excelente la terminación y los LED son muy fuertes de noche.' },
        { name: 'Nicolás M.', avatar: 'https://i.pravatar.cc/150?img=52', rating: 3, comment: 'Están buenas, pero tardaron un par de días más de lo que pensaba en llegar.' }
    ],

    // Ópticas OLED BMW Serie 2 F22 Estilo GTS
    'opticas-bmw-serie-2-f22-estilo-gts': [
        { name: 'Joaquín S.', avatar: 'https://i.pravatar.cc/150?img=8', rating: 5, comment: 'El efecto OLED es una locura, mucho mejor que en las fotos.' },
        { name: 'Fernando B.', avatar: 'https://i.pravatar.cc/150?img=14', rating: 5, comment: 'Pagué lo que valen, calidad premium. Recomendadas.' },
        { name: 'Rodrigo T.', avatar: 'https://i.pravatar.cc/150?img=3', rating: 4, comment: 'Espectaculares. Un poco más caras de lo que esperaba pero la calidad lo justifica.' }
    ],

    // Alerón Ducktail Serie 2
    'aleron-cola-de-pato-bmw-serie-2-f22-fibra-de-carbono-real-ducktail': [
        { name: 'Facu D.', avatar: 'https://i.pravatar.cc/150?img=11', rating: 5, comment: 'La fibra es real, se nota. Calce perfecto.' },
        { name: 'Carla R.', avatar: 'https://i.pravatar.cc/150?img=44', rating: 4, comment: 'Muy bueno, quedó genial. La instalación la hice en un taller.' },
        { name: 'Iván L.', avatar: 'https://i.pravatar.cc/150?img=68', rating: 5, comment: 'Me encantó cómo quedó atrás. Se ve bien deportivo.' }
    ],

    // Cachas de Espejo BMW
    'cachas-de-espejo-bmw': [
        { name: 'Pablo H.', avatar: 'https://i.pravatar.cc/150?img=7', rating: 5, comment: 'Las puse yo mismo, muy fácil. Calidad altísima.' },
        { name: 'Sofía K.', avatar: 'https://i.pravatar.cc/150?img=45', rating: 4, comment: 'Buenas, aunque el primer intento de clipar me costó un poco.' },
        { name: 'Santi', avatar: 'https://i.pravatar.cc/150?img=32', rating: 5, comment: 'Quedaron tremendas, cambia el frente del auto.' },
        { name: 'Bruno V.', avatar: 'https://i.pravatar.cc/150?img=58', rating: 5, comment: 'Muy conforme. Envío rápido, producto excelente.' },
        { name: 'Julián E.', avatar: 'https://i.pravatar.cc/150?img=17', rating: 3, comment: 'Lindas, pero una venía con un detalle mínimo en el borde. Igual lo solucionaron.' }
    ],

    // Parrilla Serie 3
    'parrilla-carbono-doble-rejilla-bmw-look-sport-oem': [
        { name: 'Gonzalo A.', avatar: 'https://i.pravatar.cc/150?img=51', rating: 5, comment: 'Le da otra presencia al auto, mejor que la original sin dudas.' },
        { name: 'Ramiro O.', avatar: 'https://i.pravatar.cc/150?img=13', rating: 4, comment: 'Muy buena, encastró bien. Tardé en animarme a comprarla pero no me arrepiento.' },
        { name: 'Emilia F.', avatar: 'https://i.pravatar.cc/150?img=48', rating: 5, comment: 'Terminación impecable, el carbono se nota que es real.' }
    ],

    // Alerón M4 Serie 2
    'aleron-estilo-m4-bmw-serie-2-f22-fibra-de-carbono-real-performance': [
        { name: 'Tomás Z.', avatar: 'https://i.pravatar.cc/150?img=56', rating: 5, comment: 'Divino, mucho mejor de lo que esperaba por el precio.' },
        { name: 'Lucas C.', avatar: 'https://i.pravatar.cc/150?img=33', rating: 4, comment: 'Muy bueno. La cinta venía bien pero lo terminé atornillando igual por las dudas.' },
        { name: 'Gaby M.', avatar: 'https://i.pravatar.cc/150?img=20', rating: 5, comment: 'Calce exacto, se ve de fábrica.' },
        { name: 'Mariano I.', avatar: 'https://i.pravatar.cc/150?img=15', rating: 3, comment: 'El producto está bien, pero la caja llegó bastante golpeada. Por suerte el alerón estaba ok.' }
    ],

    // Difusor Trasero BMW Serie 2 F22
    'difusor-trasero-bmw-serie-2-f22-fibra-de-carbono-real-performance': [
        { name: 'Axel B.', avatar: 'https://i.pravatar.cc/150?img=57', rating: 5, comment: 'Quedó tremendo, se ve muy agresivo desde atrás.' },
        { name: 'Germán P.', avatar: 'https://i.pravatar.cc/150?img=67', rating: 4, comment: 'Muy bueno, cumple. La instalación necesita paciencia pero sale.' },
        { name: 'Nadia V.', avatar: 'https://i.pravatar.cc/150?img=41', rating: 5, comment: 'Lo puso el chapista y quedó perfecto. Recomiendo.' }
    ],

    // Ópticas MINI F55/F56/F57
    'opticas-traseras-led-union-jack-mini-cooper-f55-f56-f57-look-jcw-premium': [
        { name: 'Caro D.', avatar: 'https://i.pravatar.cc/150?img=47', rating: 5, comment: 'Hace años quería estas ópticas, quedaron hermosas en mi cooper.' },
        { name: 'Eze F.', avatar: 'https://i.pravatar.cc/150?img=31', rating: 5, comment: 'Plug and play, las instalé en menos de 30 minutos.' },
        { name: 'Valeria J.', avatar: 'https://i.pravatar.cc/150?img=38', rating: 4, comment: 'Muy lindas. El único detalle es que la luz de giro tardé en configurarla pero después todo bien.' },
        { name: 'Marcos A.', avatar: 'https://i.pravatar.cc/150?img=54', rating: 5, comment: 'Las mejores para el MINI, se nota la diferencia.' }
    ],

    // Tablero Digital BMW con CarPlay
    'tablero-digital-bmw-serie-3-4-con-carplay': [
        { name: 'Hernán R.', avatar: 'https://i.pravatar.cc/150?img=9', rating: 5, comment: 'Lo esperaba bueno pero me sorprendió. El CarPlay anda de 10.' },
        { name: 'Juan M.', avatar: 'https://i.pravatar.cc/150?img=22', rating: 4, comment: 'Muy buen producto. Lo instaló el técnico, tardó un par de horas.' },
        { name: 'Dami G.', avatar: 'https://i.pravatar.cc/150?img=26', rating: 5, comment: 'Le dio otra vida al auto. Se ve full moderno.' },
        { name: 'Sol M.', avatar: 'https://i.pravatar.cc/150?img=5', rating: 3, comment: 'Funciona bien pero el menú está medio en inglés, me costó un poco al principio.' },
        { name: 'Fede C.', avatar: 'https://i.pravatar.cc/150?img=64', rating: 5, comment: 'Impresionante, parece de fábrica.' }
    ],

    // Tablero Digital BMW sin CarPlay
    'tablero-digital-bmw-serie-3-4-upgrade-cluster': [
        { name: 'Cristian B.', avatar: 'https://i.pravatar.cc/150?img=59', rating: 5, comment: 'Muy prolijo. Lo puse con un amigo mecánico, sin drama.' },
        { name: 'Lorenzo P.', avatar: 'https://i.pravatar.cc/150?img=18', rating: 4, comment: 'Está muy bueno. Hubiera preferido el que trae CarPlay, pero igual cumple.' },
        { name: 'Andrea S.', avatar: 'https://i.pravatar.cc/150?img=43', rating: 5, comment: 'Se ve 10 veces mejor que el original. Muy conforme.' }
    ],

    // Tablero Digital AUDI
    'tablero-digital-audi-upgrade-cluster-con-carplay-integrado-copia': [
        { name: 'Nacho T.', avatar: 'https://i.pravatar.cc/150?img=34', rating: 5, comment: 'Venía buscando el virtual cockpit desde hace tiempo. Quedó brutal.' },
        { name: 'Franco L.', avatar: 'https://i.pravatar.cc/150?img=50', rating: 4, comment: 'Excelente, solo tuve que configurar el idioma al principio.' },
        { name: 'Paula N.', avatar: 'https://i.pravatar.cc/150?img=39', rating: 5, comment: 'Se ve de fábrica, nadie cree que es aftermarket.' },
        { name: 'Tincho V.', avatar: 'https://i.pravatar.cc/150?img=61', rating: 3, comment: 'Bueno el producto, pero el instalador no conocía bien y tardó más de la cuenta.' }
    ],

    // Tablero Digital VW GOLF
    'tablero-digital-vw-golf-upgrade-cluster-con-carplay-integrado': [
        { name: 'Diego A.', avatar: 'https://i.pravatar.cc/150?img=33', rating: 5, comment: 'Tremendo cambio en el GTI. CarPlay sin drama.' },
        { name: 'Lucía B.', avatar: 'https://i.pravatar.cc/150?img=21', rating: 4, comment: 'Muy buen producto. La instalación te la tiene que hacer alguien que sepa.' },
        { name: 'Mauro G.', avatar: 'https://i.pravatar.cc/150?img=66', rating: 5, comment: 'Funciona perfecto, re recomendado.' }
    ],

    // Tablero Digital VW AMAROK
    'tablero-digital-vw-amarok-upgrade-cluster-con-carplay-integrado': [
        { name: 'Seba R.', avatar: 'https://i.pravatar.cc/150?img=53', rating: 5, comment: 'Le cambié la cara a la amarok. El CarPlay anda bárbaro.' },
        { name: 'Miguel C.', avatar: 'https://i.pravatar.cc/150?img=62', rating: 4, comment: 'Cumple. La pantalla se ve muy nítida.' },
        { name: 'Alejo M.', avatar: 'https://i.pravatar.cc/150?img=69', rating: 5, comment: 'Buenísimo, lo venía buscando hace meses.' },
        { name: 'Guille P.', avatar: 'https://i.pravatar.cc/150?img=6', rating: 3, comment: 'Está bien pero esperaba que fuera un poco más fácil de instalar.' }
    ],

    // Ópticas MINI R56
    'opticas-traseras-led-union-jack-mini-cooper-r56-f57-f58-59-look-jcw-premium': [
        { name: 'Rocío T.', avatar: 'https://i.pravatar.cc/150?img=49', rating: 5, comment: 'Ame mi mini, quedaron divinas de noche.' },
        { name: 'Nico H.', avatar: 'https://i.pravatar.cc/150?img=24', rating: 4, comment: 'Muy buenas. El único detalle: una luz de giro parpadea más rápido pero se arregla con una resistencia.' },
        { name: 'Mica L.', avatar: 'https://i.pravatar.cc/150?img=23', rating: 5, comment: 'Re lindas, me re gustó como se ven. Recomiendo.' },
        { name: 'Vicky D.', avatar: 'https://i.pravatar.cc/150?img=36', rating: 5, comment: 'Plug and play como dice. Quedaron perfectas.' }
    ],

    // Parrilla BMW Serie 1
    'parrilla-fibra-de-carbono-real-doble-rejilla-bmw-serie-3-f20-look-sport-oem': [
        { name: 'Iñaki O.', avatar: 'https://i.pravatar.cc/150?img=19', rating: 5, comment: 'Se ve tremendo el carbono real. Calce preciso en la F20.' },
        { name: 'Cami R.', avatar: 'https://i.pravatar.cc/150?img=46', rating: 4, comment: 'Muy buen producto, llegó bien embalado.' },
        { name: 'Toto B.', avatar: 'https://i.pravatar.cc/150?img=10', rating: 5, comment: 'Le cambió la cara al 1er, re recomendable.' }
    ],

    // Parrilla BMW Serie 2 F22
    'parrilla-fibra-de-carbono-real-doble-rejilla-bmw-serie-2-f22-look-sport-oem': [
        { name: 'Esteban V.', avatar: 'https://i.pravatar.cc/150?img=16', rating: 5, comment: 'Se ve de otro nivel con la parrilla puesta. Muy buena calidad.' },
        { name: 'Dani F.', avatar: 'https://i.pravatar.cc/150?img=30', rating: 4, comment: 'Buenísima, el carbono se siente firme. El encastre requirió ajustes mínimos.' },
        { name: 'Juampi G.', avatar: 'https://i.pravatar.cc/150?img=70', rating: 5, comment: 'Quedó bárbara, tardé 20 minutos en ponerla.' },
        { name: 'Flor M.', avatar: 'https://i.pravatar.cc/150?img=25', rating: 5, comment: 'Muy conforme con la compra, envío rápido.' }
    ],

    // Alerón M4 Serie 3
    'aleron-estilo-m4-bmw-serie-3-fibra-de-carbono-real-performance': [
        { name: 'Nahuel R.', avatar: 'https://i.pravatar.cc/150?img=2', rating: 5, comment: 'Me encantó cómo quedó, el carbono se ve brillante.' },
        { name: 'Brian M.', avatar: 'https://i.pravatar.cc/150?img=63', rating: 4, comment: 'Lo probé, quedó muy bien. Igual lo atornillé además de la cinta.' },
        { name: 'Ceci P.', avatar: 'https://i.pravatar.cc/150?img=40', rating: 5, comment: 'Hermoso producto, la verdad que no esperaba tanta calidad.' }
    ],

    // Alerón Ducktail Serie 3
    'aleron-cola-de-pato-bmw-serie-3-fibra-de-carbono-real-ducktail': [
        { name: 'Agos F.', avatar: 'https://i.pravatar.cc/150?img=42', rating: 5, comment: 'Estilo ducktail es lo más, quedó increíble en el f30.' },
        { name: 'Kevin D.', avatar: 'https://i.pravatar.cc/150?img=4', rating: 4, comment: 'Muy buen alerón. El envío demoró un poco más de lo esperado.' },
        { name: 'Lolo S.', avatar: 'https://i.pravatar.cc/150?img=28', rating: 5, comment: 'Tremendo. La terminación es 10 puntos.' },
        { name: 'Mauri O.', avatar: 'https://i.pravatar.cc/150?img=37', rating: 3, comment: 'Está bien pero el manual de instalación viene medio justo. Tuve que mirar un video de youtube.' }
    ]
};

// Fallback reviews para productos sin entrada específica (genéricas pero naturales)
export const FALLBACK_REVIEWS: Review[] = [
    { name: 'Martín G.', avatar: 'https://i.pravatar.cc/150?img=12', rating: 5, comment: 'Muy buena compra. Cumple lo que promete.' },
    { name: 'Lucía P.', avatar: 'https://i.pravatar.cc/150?img=47', rating: 4, comment: 'Buen producto, llegó bien y en tiempo.' },
    { name: 'Ale C.', avatar: 'https://i.pravatar.cc/150?img=33', rating: 5, comment: 'Todo perfecto, lo recomiendo.' }
];

/**
 * Returns the aggregated rating stats for a product based on its reviews.
 * If no reviews exist for the handle, falls back to FALLBACK_REVIEWS.
 */
export function getReviewStats(productHandle: string): { avgRating: number; count: number } {
    const reviews = PRODUCT_REVIEWS[productHandle] ?? FALLBACK_REVIEWS;
    if (reviews.length === 0) return { avgRating: 0, count: 0 };
    const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
    // Round to 1 decimal
    const avg = Math.round((sum / reviews.length) * 10) / 10;
    return { avgRating: avg, count: reviews.length };
}
