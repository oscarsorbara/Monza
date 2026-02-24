
// Helper to generate year range
const range = (start: number, end: number) =>
    Array.from({ length: end - start + 1 }, (_, i) => String(end - i));

// Common variants
const VARIANTS = {
    STD: ["Base", "Full", "Premium"],
    VW: ["Trendline", "Comfortline", "Highline", "GTS", "GLI"],
    CHEVROLET: ["LS", "LT", "LTZ", "Premier", "RS"],
    FORD: ["S", "SE", "SEL", "Titanium", "Raptor"],
    TOYOTA: ["XLI", "XEI", "SEG", "GR-Sport", "DX", "SR", "SRV", "SRX"],
    FIAT: ["Attractive", "Drive", "Precision", "Volcano", "Freedom", "Ranch", "Ultra"],
    PEUGEOT: ["Active", "Allure", "Feline", "GT-Line", "GT"],
    RENAULT: ["Authentique", "Expression", "Dynamique", "Privilege", "Intens", "Iconic", "Outsider"],
    JEEP: ["Sport", "Longitude", "Limited", "Trailhawk"],
    HONDA: ["LX", "EX", "EXL", "Touring"],
    NISSAN: ["Sense", "Advance", "Exclusive"],
    TRUCK: ["Cabina Simple", "Cabina Doble", "4x2", "4x4"],
    BMW: ["Base", "M Sport", "Luxury", "M"],
    AUDI: ["Base", "S Line", "Ambition", "Attraction", "Sport"],
    MERCEDES: ["Base", "Avantgarde", "AMG-Line", "AMG"],
    PREMIUM: ["Base", "S", "GTS", "Turbo", "GT"]
};

// Data definition
const DATA: Record<string, Array<{ name: string, start: number, end?: number, variants?: string[] }>> = {
    "Volkswagen": [
        { name: "Gol Power", start: 1999, end: 2014, variants: ["Base", "Dublín", "Comfortline"] },
        { name: "Gol Trend", start: 2008, end: 2023, variants: VARIANTS.VW },
        { name: "Polo", start: 1999, end: 2008, variants: ["Classic", "Comfortline"] },
        { name: "Polo (Nuevo)", start: 2018, end: 2026, variants: VARIANTS.VW },
        { name: "Virtus", start: 2018, end: 2026, variants: VARIANTS.VW },
        { name: "Vento", start: 2006, end: 2024, variants: ["Advance", "Luxury", "Sportline", "GLI"] },
        { name: "Bora", start: 2000, end: 2015, variants: ["Trendline", "1.8T", "TDI"] },
        { name: "Fox", start: 2004, end: 2022, variants: ["Comfortline", "Trendline", "Highline", "CrossFox"] },
        { name: "Suran", start: 2006, end: 2019, variants: VARIANTS.VW },
        { name: "Up!", start: 2014, end: 2021, variants: ["Take", "Move", "High", "Cross", "Pepper"] },
        { name: "Amarok", start: 2010, end: 2026, variants: ["Startline", ...VARIANTS.VW, "V6", "V6 Extreme", "V6 Black Style"] },
        { name: "T-Cross", start: 2019, end: 2026, variants: VARIANTS.VW },
        { name: "Nivus", start: 2020, end: 2026, variants: ["Comfortline", "Highline", "Hero"] },
        { name: "Taos", start: 2021, end: 2026, variants: ["Comfortline", "Highline", "Hero"] },
        { name: "Tiguan", start: 2008, end: 2026, variants: ["Trend & Fun", "Sport & Style", "Allspace", "Life"] },
        { name: "Saveiro", start: 1999, end: 2026, variants: ["Cabina Simple", "Cabina Extendida", "Cabina Doble", "Cross"] },
        { name: "Voyage", start: 2008, end: 2023, variants: VARIANTS.VW }
    ],
    "Toyota": [
        { name: "Hilux", start: 1999, end: 2026, variants: ["DX", "SR", "SRV", "SRX", "GR-Sport", "Conquest"] },
        { name: "Corolla", start: 1999, end: 2026, variants: ["XLI", "XEI", "SEG", "Fielder", "GR-Sport"] },
        { name: "Etios", start: 2013, end: 2023, variants: ["X", "XS", "XLS", "Platinum", "Cross"] },
        { name: "Yaris", start: 2016, end: 2026, variants: ["XS", "XLS", "S"] },
        { name: "Corolla Cross", start: 2021, end: 2026, variants: ["XLI", "XEI", "SEG", "GR-Sport"] },
        { name: "SW4", start: 2005, end: 2026, variants: ["SR", "SRV", "SRX", "Diamond", "GR-Sport"] },
        { name: "RAV4", start: 2000, end: 2026, variants: ["VX", "TX", "Limited", "Hybrid"] },
        { name: "Camry", start: 2000, end: 2026, variants: ["L4", "V6", "Hybrid"] }
    ],
    "Ford": [
        { name: "Fiesta", start: 1999, end: 2019, variants: ["Ambiente", "Edge", "Titanium", "Kinetic"] },
        { name: "Focus", start: 1999, end: 2019, variants: ["Ambiente", "Edge", "Ghia", "S", "SE", "SE Plus", "Titanium"] },
        { name: "Ka", start: 1999, end: 2021, variants: ["Base", "Fly", "Viral", "S", "SE", "SEL", "Freestyle"] },
        { name: "EcoSport", start: 2003, end: 2022, variants: ["XL", "XLS", "XLT", "Freestyle", "Titanium", "Storm"] },
        { name: "Ranger", start: 1999, end: 2026, variants: ["XL", "XLS", "XLT", "Limited", "Raptor"] },
        { name: "Mondeo", start: 1999, end: 2022, variants: ["Ghia", "Titanium", "Vignale"] },
        { name: "Kuga", start: 2010, end: 2026, variants: ["Trend", "Titanium", "Hybrid"] },
        { name: "Territory", start: 2020, end: 2026, variants: ["SEL", "Titanium"] },
        { name: "Bronco Sport", start: 2021, end: 2026, variants: ["Big Bend", "Wildtrak"] },
        { name: "Maverick", start: 2022, end: 2026, variants: ["XLT", "Lariat", "Hybrid"] },
        { name: "Mustang", start: 2016, end: 2026, variants: ["GT", "Mach 1"] }
    ],
    "Chevrolet": [
        { name: "Corsa", start: 1999, end: 2011, variants: ["City", "Wind", "GL", "GLS"] },
        { name: "Classic", start: 2010, end: 2016, variants: ["LS", "LT"] },
        { name: "Aveo", start: 2008, end: 2014, variants: ["LS", "LT"] },
        { name: "Onix", start: 2013, end: 2026, variants: VARIANTS.CHEVROLET },
        { name: "Prisma", start: 2013, end: 2019, variants: VARIANTS.CHEVROLET },
        { name: "Cruze", start: 2011, end: 2024, variants: ["LT", "LTZ", "Premier"] },
        { name: "Tracker", start: 2013, end: 2026, variants: VARIANTS.CHEVROLET },
        { name: "S10", start: 1999, end: 2026, variants: VARIANTS.CHEVROLET },
        { name: "Spin", start: 2012, end: 2026, variants: ["LT", "LTZ", "Activ", "Premier"] },
        { name: "Agile", start: 2009, end: 2016, variants: ["LS", "LT", "LTZ"] },
        { name: "Astra", start: 1999, end: 2012, variants: ["GL", "GLS", "GSI"] },
        { name: "Vectra", start: 1999, end: 2011, variants: ["GLS", "CD", "GT"] },
        { name: "Meriva", start: 2003, end: 2012, variants: ["GL", "GLS"] },
        { name: "Captiva", start: 2008, end: 2018, variants: ["LS", "LT", "LTZ"] },
        { name: "Trailblazer", start: 2013, end: 2026, variants: ["LTZ", "Premier"] }
    ],
    "Fiat": [
        { name: "Palio", start: 1999, end: 2018, variants: ["ELX", "HLX", "Fire", "Novo"] },
        { name: "Siena", start: 1999, end: 2017, variants: ["ELX", "HLX", "Fire", "EL"] },
        { name: "Grand Siena", start: 2012, end: 2021, variants: ["Attractive", "Essence"] },
        { name: "Uno", start: 1999, end: 2014, variants: ["Fire", "Scr"] },
        { name: "Novo Uno", start: 2010, end: 2021, variants: ["Attractive", "Way", "Sporting"] },
        { name: "Punto", start: 2007, end: 2017, variants: ["ELX", "HLX", "Sporting", "Blackmotion"] },
        { name: "Argo", start: 2017, end: 2026, variants: VARIANTS.FIAT },
        { name: "Cronos", start: 2018, end: 2026, variants: VARIANTS.FIAT },
        { name: "Mobi", start: 2016, end: 2026, variants: ["Easy", "Way", "Trekking"] },
        { name: "Toro", start: 2016, end: 2026, variants: ["Freedom", "Volcano", "Ranch", "Ultra"] },
        { name: "Strada", start: 1999, end: 2026, variants: ["Working", "Trekking", "Adventure", "Endurance", "Freedom", "Volcano", "Ranch", "Ultra"] },
        { name: "Fiorino", start: 1999, end: 2026, variants: ["Base", "Fire", "Evo"] },
        { name: "Pulse", start: 2021, end: 2026, variants: ["Drive", "Audace", "Impetus"] },
        { name: "Fastback", start: 2023, end: 2026, variants: ["Turbo", "Audace", "Limited", "Abarth"] },
        { name: "500", start: 2008, end: 2020, variants: ["Cult", "Sport", "Lounge", "Abarth"] }
    ],
    "Peugeot": [
        { name: "206", start: 1999, end: 2012, variants: ["XR", "XS", "XT"] },
        { name: "207 Compact", start: 2008, end: 2016, variants: ["XR", "XS", "XT"] },
        { name: "208", start: 2013, end: 2026, variants: VARIANTS.PEUGEOT },
        { name: "307", start: 2004, end: 2011, variants: ["XR", "XS", "XT"] },
        { name: "308", start: 2012, end: 2021, variants: ["Active", "Allure", "Feline", "Sport"] },
        { name: "408", start: 2011, end: 2021, variants: VARIANTS.PEUGEOT },
        { name: "2008", start: 2016, end: 2026, variants: VARIANTS.PEUGEOT },
        { name: "3008", start: 2010, end: 2026, variants: ["Allure", "GT-Line", "GT"] },
        { name: "Partner", start: 1999, end: 2026, variants: ["Confort", "Patagónica"] }
    ],
    "Renault": [
        { name: "Clio", start: 1999, end: 2017, variants: ["Authentique", "Expression", "Privilege", "Mío"] },
        { name: "Sandero", start: 2008, end: 2026, variants: VARIANTS.RENAULT },
        { name: "Stepway", start: 2008, end: 2026, variants: VARIANTS.RENAULT },
        { name: "Logan", start: 2007, end: 2026, variants: VARIANTS.RENAULT },
        { name: "Kangoo", start: 1999, end: 2017, variants: ["Authentique", "Sportway"] },
        { name: "Kangoo (Nuevo)", start: 2018, end: 2026, variants: ["Life", "Zen", "Stepway"] },
        { name: "Duster", start: 2011, end: 2026, variants: VARIANTS.RENAULT },
        { name: "Oroch", start: 2016, end: 2026, variants: VARIANTS.RENAULT },
        { name: "Captur", start: 2016, end: 2024, variants: ["Life", "Zen", "Intens"] },
        { name: "Kwid", start: 2017, end: 2023, variants: ["Life", "Zen", "Intens", "Iconic"] },
        { name: "Alaskan", start: 2020, end: 2026, variants: ["Confort", "Emotion", "Intens", "Iconic"] },
        { name: "Fluence", start: 2010, end: 2018, variants: ["Dynamique", "Privilege", "Luxe", "GT"] },
        { name: "Megane", start: 1999, end: 2016, variants: ["RXE", "Privilege", "Luxe"] }
    ],
    "Citroen": [
        { name: "C3", start: 2003, end: 2026, variants: ["SX", "Exclusive", "Live", "Feel", "Shine"] },
        { name: "C3 Aircross", start: 2011, end: 2026, variants: ["SX", "Exclusive", "Live", "Feel", "Shine"] },
        { name: "C4", start: 2007, end: 2015, variants: ["X", "SX", "Exclusive"] },
        { name: "C4 Lounge", start: 2013, end: 2021, variants: ["Live", "Feel", "Shine"] },
        { name: "C4 Cactus", start: 2018, end: 2026, variants: ["Live", "Feel", "Shine"] },
        { name: "Berlingo", start: 1999, end: 2026, variants: ["Multispace", "XTR"] }
    ],
    "Jeep": [
        { name: "Renegade", start: 2016, end: 2026, variants: VARIANTS.JEEP },
        { name: "Compass", start: 2007, end: 2026, variants: VARIANTS.JEEP },
        { name: "Grand Cherokee", start: 1999, end: 2026, variants: ["Laredo", "Limited", "Overland"] },
        { name: "Commander", start: 2022, end: 2026, variants: ["Limited", "Overland"] },
        { name: "Wrangler", start: 2000, end: 2026, variants: ["Sport", "Rubicon", "Sahara"] }
    ],
    "Honda": [
        { name: "Civic", start: 1999, end: 2021, variants: VARIANTS.HONDA },
        { name: "Fit", start: 2003, end: 2021, variants: ["LX", "LXL", "EX", "EXL"] },
        { name: "City", start: 2009, end: 2021, variants: VARIANTS.HONDA },
        { name: "HR-V", start: 2015, end: 2026, variants: VARIANTS.HONDA },
        { name: "CR-V", start: 1999, end: 2026, variants: ["LX", "EX", "EXL"] },
        { name: "ZR-V", start: 2023, end: 2026, variants: ["LX", "Touring"] }
    ],
    "Nissan": [
        { name: "Frontier", start: 2002, end: 2026, variants: ["S", "SE", "XE", "LE", "Pro-4X"] },
        { name: "Kicks", start: 2017, end: 2026, variants: VARIANTS.NISSAN },
        { name: "Versa", start: 2013, end: 2026, variants: VARIANTS.NISSAN },
        { name: "Sentra", start: 2010, end: 2026, variants: VARIANTS.NISSAN },
        { name: "March", start: 2012, end: 2020, variants: ["Active", "Sense", "Advance"] },
        { name: "Note", start: 2015, end: 2020, variants: ["Sense", "Advance", "Exclusive"] },
        { name: "Tiida", start: 2007, end: 2014, variants: ["Visia", "Acenta", "Tekna"] }
    ],
    "BMW": [
        { name: "Serie 1", start: 2004, end: 2026, variants: ["118i", "120i", "M135i", "140i"] },
        { name: "Serie 2", start: 2014, end: 2026, variants: ["F22", "F23", "218i", "220i", "M235i", "M240i", "M2"] },
        { name: "M2C", start: 2014, end: 2019, variants: ["F87"] },
        { name: "Serie 3", start: 1999, end: 2026, variants: ["320i", "323i", "325i", "328i", "330i", "340i", "M3"] },
        { name: "Serie 4", start: 2013, end: 2026, variants: ["430i", "440i", "M4"] },
        { name: "Serie 5", start: 1999, end: 2026, variants: ["530i", "540i", "M5"] },
        { name: "X1", start: 2009, end: 2026, variants: ["sDrive18i", "sDrive20i", "xDrive25i"] },
        { name: "X3", start: 2004, end: 2026, variants: ["xDrive20i", "xDrive30i", "M40i"] },
        { name: "X5", start: 1999, end: 2026, variants: ["xDrive35i", "xDrive40i", "M50i", "M"] },
        { name: "X6", start: 2008, end: 2026, variants: ["xDrive35i", "xDrive40i", "M"] }
    ],
    "Audi": [
        { name: "A1", start: 2011, end: 2026, variants: ["Attraction", "Ambition", "S Line"] },
        { name: "A3", start: 1999, end: 2026, variants: ["1.4 TFSI", "1.8 TFSI", "2.0 TFSI", "S3", "RS3"] },
        { name: "A4", start: 1999, end: 2026, variants: ["1.8 TFSI", "2.0 TFSI", "3.0 TDI", "S4"] },
        { name: "A5", start: 2007, end: 2026, variants: ["Coupe", "Sportback", "Cabriolet", "S5", "RS5"] },
        { name: "Q3", start: 2011, end: 2026, variants: ["1.4 TFSI", "2.0 TFSI", "RS Q3"] },
        { name: "Q5", start: 2008, end: 2026, variants: ["2.0 TFSI", "3.0 TDI", "SQ5"] },
        { name: "Q7", start: 2006, end: 2026, variants: ["3.0 TDI", "3.0 TFSI"] },
        { name: "TT", start: 1999, end: 2026, variants: ["Coupe", "Roadster", "TTS", "TTRS"] }
    ],
    "Mercedes-Benz": [
        { name: "Clase A", start: 1999, end: 2026, variants: ["A200", "A250", "AMG A35", "AMG A45"] },
        { name: "Clase C", start: 1999, end: 2026, variants: ["C200", "C250", "C300", "AMG C43", "AMG C63"] },
        { name: "Clase E", start: 1999, end: 2026, variants: ["E300", "E350", "AMG E53", "AMG E63"] },
        { name: "GLA", start: 2014, end: 2026, variants: ["200", "250", "AMG 45"] },
        { name: "GLC", start: 2015, end: 2026, variants: ["300", "AMG 43", "AMG 63"] },
        { name: "GLE", start: 1999, end: 2026, variants: ["400", "450", "AMG 53", "AMG 63"] },
        { name: "Sprinter", start: 1999, end: 2026, variants: ["310", "313", "415", "515", "Street", "Furgon", "Minibus"] }
    ],
    "MINI": [
        { name: "Cooper", start: 2001, end: 2026, variants: ["Salt", "Pepper", "Chili", "S", "JCW"] },
        { name: "Countryman", start: 2010, end: 2026, variants: ["Salt", "Pepper", "Chili", "S", "JCW"] },
        { name: "Clubman", start: 2007, end: 2026, variants: ["S", "JCW"] }
    ],
    "DS": [
        { name: "DS3", start: 2010, end: 2022, variants: ["Chic", "So Chic", "Sport Chic", "Performance"] },
        { name: "DS4", start: 2011, end: 2026, variants: ["Chic", "So Chic", "Crossback"] },
        { name: "DS7 Crossback", start: 2018, end: 2026, variants: ["Bastille", "Rivoli", "Opera"] }
    ],
    "Land Rover": [
        { name: "Range Rover Evoque", start: 2011, end: 2026, variants: ["Pure", "SE", "HSE", "Dynamic"] },
        { name: "Discovery Sport", start: 2015, end: 2026, variants: ["S", "SE", "HSE"] },
        { name: "Defender", start: 1999, end: 2026, variants: ["90", "110"] }
    ],
    "Porsche": [
        { name: "911", start: 1999, end: 2026, variants: ["Carrera", "Carrera S", "GTS", "Turbo", "GT3"] },
        { name: "Cayenne", start: 2003, end: 2026, variants: ["V6", "S", "GTS", "Turbo", "E-Hybrid"] },
        { name: "Macan", start: 2014, end: 2026, variants: ["Base", "S", "GTS", "Turbo"] },
        { name: "Panamera", start: 2010, end: 2026, variants: ["4S", "GTS", "Turbo", "E-Hybrid"] },
        { name: "718 Boxster/Cayman", start: 1999, end: 2026, variants: ["Base", "S", "GTS", "GT4"] }
    ],
    "Hyundai": [
        { name: "Tucson", start: 2005, end: 2026, variants: ["GL", "GLS", "Full Premium", "Turbo"] },
        { name: "Santa Fe", start: 2001, end: 2026, variants: ["GLS", "V6", "CRDi"] },
        { name: "Creta", start: 2016, end: 2026, variants: ["GL", "GLS", "Safety"] },
        { name: "H1", start: 2008, end: 2022, variants: ["Minibus", "Furgon"] }
    ],
    "Kia": [
        { name: "Sportage", start: 1999, end: 2026, variants: ["EX", "LX", "GDI", "GT Line"] },
        { name: "Sorento", start: 2002, end: 2026, variants: ["EX", "LX", "CRDi"] },
        { name: "Carnival", start: 2006, end: 2026, variants: ["EX", "SX", "Full"] }
    ],
    "Volvo": [
        { name: "XC40", start: 2018, end: 2026, variants: ["T4", "T5", "Recharge"] },
        { name: "XC60", start: 2009, end: 2026, variants: ["T5", "T6", "D5", "Recharge"] },
        { name: "XC90", start: 2003, end: 2026, variants: ["T6", "D5", "Recharge"] }
    ]
};

// Convert to export format
const generateDatabase = () => {
    const db: Record<string, Record<string, Record<string, string[]>>> = {};

    Object.entries(DATA).forEach(([brand, models]) => {
        db[brand] = {};
        models.forEach(model => {
            db[brand][model.name] = {};
            const endYear = model.end || 2026;
            // Ensure year is not > 2026 (current max context usually)
            // User requested up to 2026
            range(model.start, endYear).forEach(year => {
                db[brand][model.name][year] = model.variants || ["Base"];
            });
        });
    });

    return db;
};

export const VEHICLE_DATABASE = generateDatabase();
