import { MedicamentoCatalogo } from '@/types';

// Helper para generar medicamentos de forma compacta y evitar redundancia
const createMed = (
    generico: string,
    concentracion: string,
    forma: string,
    presentacion: string, // e.g., "Caja con 10 tabletas"
    via: string,
    categoria: string,
    comerciales: string[],
    clave: string,
    dosisDef: string,
    frecDef: string,
    duracionDef: string,
    indicacionesDef: string,
    cantSurtirDef: string
): Omit<MedicamentoCatalogo, 'id' | 'nombreBusqueda' | 'vecesUsado' | 'fechaCreacion' | 'fechaUltimoUso'> => {
    const nombreUpper = generico.toUpperCase();
    // Generar palabras clave
    const palabrasClave = [
        nombreUpper,
        generico.toLowerCase(),
        ...comerciales.map(c => c.toLowerCase()),
        ...comerciales.map(c => c.toUpperCase()),
        clave,
        forma.toLowerCase()
    ].filter(Boolean);

    return {
        nombre: `${nombreUpper} ${concentracion} ${forma}`, // Nombre display
        nombreGenerico: nombreUpper,
        concentracion,
        formaFarmaceutica: forma,
        presentacion,
        categoria,
        laboratorio: 'Genérico / Varios',
        viaAdministracionDefault: via,
        dosisDefault: dosisDef,
        frecuenciaDefault: frecDef,
        duracionDefault: duracionDef,
        indicacionesDefault: indicacionesDef,
        cantidadSurtirDefault: cantSurtirDef,
        esPersonalizado: false,
        palabrasClave,
        sincronizado: true,
        idRemoto: clave // Usamos la clave del cuadro básico como referencia
    };
};

export const catalogoMedicamentosExtenso: Omit<MedicamentoCatalogo, 'id' | 'nombreBusqueda' | 'vecesUsado' | 'fechaCreacion' | 'fechaUltimoUso'>[] = [
    // ANALGESIA
    createMed('ACIDO ACETILSALICILICO', '500 mg', 'Tabletas', 'Caja con 20', 'Oral', 'Analgesia', ['ASPIRINA', 'CAFIASPIRINA'], '010.000.0104.00', '1 tableta', 'Cada 8 horas', '3 a 5 días', 'Tomar con alimentos. Disolver si es soluble.', '1 caja'),
    createMed('ACIDO ACETILSALICILICO', '300 mg', 'Tabletas Solubles', 'Caja con 20', 'Oral', 'Analgesia', ['ASPIRINA'], '010.000.0103.00', '1 tableta', 'Cada 8 horas', '3 días', 'Disolver en agua.', '1 caja'),
    createMed('PARACETAMOL', '500 mg', 'Tabletas', 'Caja con 20', 'Oral', 'Analgesia', ['TEMPRA', 'TYLENOL', 'PANADOL'], '010.000.0104.00', '1 tableta', 'Cada 6-8 horas', '3 a 5 días', 'No exceder dosis. Cuidar hígado.', '1 caja'),
    createMed('PARACETAMOL', '100 mg/ml', 'Solución Gotas', 'Frasco 15-30ml', 'Oral', 'Analgesia', ['TEMPRA GOTAS', 'TYLENOL INFANTIL'], '010.000.0106.00', '10-15 mg/kg', 'Cada 6 horas', '3 días', 'Usar gotero calibrado.', '1 frasco'),
    createMed('PARACETAMOL', '120 mg/5 ml', 'Jarabe', 'Frasco 120ml', 'Oral', 'Analgesia', ['TEMPRA JARABE'], '010.000.9999.00', '10-15 mg/kg', 'Cada 6 horas', '3 días', 'Agitar antes de usar.', '1 frasco'),
    createMed('METAMIZOL SODICO', '500 mg', 'Tabletas', 'Caja con 10', 'Oral', 'Analgesia', ['NEOMELUBRINA'], '010.000.0108.00', '1 tableta', 'Cada 6-8 horas', '3 días', 'Si persiste dolor acudir a urgencias.', '1 caja'),
    createMed('METAMIZOL SODICO', '1 g/2 ml', 'Solución Inyectable', 'Caja con 3 ampolletas', 'Intramuscular', 'Analgesia', ['NEOMELUBRINA INY'], '010.000.0109.00', '1 g', 'Dosis única o c/8h', '1-2 días', 'Aplicación IM profunda.', '1 caja'),
    createMed('IBUPROFENO', '400 mg', 'Tabletas', 'Caja con 10', 'Oral', 'Analgesia/AINE', ['ADVIL', 'MOTRIN', 'ACTRON'], '010.000.0122.00', '1 tableta', 'Cada 8 horas', '3 a 5 días', 'Tomar con alimentos.', '1 caja'),
    createMed('IBUPROFENO', '600 mg', 'Tabletas', 'Caja con 10', 'Oral', 'Analgesia/AINE', ['MOTRIN 600'], '010.000.5266.00', '1 tableta', 'Cada 12 horas', '5 días', 'Tomar con alimentos.', '1 caja'),
    createMed('NAPROXENO', '250 mg', 'Tabletas', 'Caja con 30', 'Oral', 'Analgesia/AINE', ['FLANAX', 'NAXEN'], '010.000.0124.00', '1-2 tabletas', 'Cada 12 horas', '5 a 7 días', 'Tomar con leche o alimentos.', '1 caja'),
    createMed('NAPROXENO', '500 mg', 'Tabletas', 'Caja con 12', 'Oral', 'Analgesia/AINE', ['FLANAX 550'], '010.000.0125.00', '1 tableta', 'Cada 12 horas', '5 días', 'Tomar después de alimentos.', '1 caja'),
    createMed('DICLOFENACO', '100 mg', 'Grageas LP', 'Caja con 20', 'Oral', 'Analgesia/AINE', ['VOLTAREN RETARD'], '010.000.0123.00', '1 gragea', 'Cada 24 horas', '5 a 7 días', 'No masticar. Tragar entero.', '1 caja'),
    createMed('DICLOFENACO', '75 mg/3 ml', 'Solución Inyectable', 'Caja con 2 ampolletas', 'Intramuscular', 'Analgesia/AINE', ['VOLTAREN IM'], '010.000.0127.00', '75 mg', 'Cada 12-24 horas', '2 días máx', 'Aplicación profunda.', '1 caja'),
    createMed('KETOROLACO', '10 mg', 'Tabletas', 'Caja con 10', 'Oral', 'Analgesia', ['DOLAC', 'SUPRADOL'], '010.000.3129.00', '1 tableta', 'Cada 6-8 horas', 'Máximo 5 días', 'No exceder 5 días de tratamiento.', '1 caja'),
    createMed('KETOROLACO', '30 mg', 'Solución Inyectable', 'Caja con 3 ampolletas', 'Intramuscular', 'Analgesia', ['DOLAC 30'], '010.000.3130.00', '30 mg', 'Cada 6-8 horas', '2 días', 'Uso hospitalario o urgencias.', '1 caja'),
    createMed('TRAMADOL', '50 mg', 'Cápsulas', 'Caja con 10', 'Oral', 'Analgesia/Opioide', ['TRADOL', 'TRAMA-KLOSIDOL'], '010.000.2117.00', '1 cápsula', 'Cada 8-12 horas', '3 a 5 días', 'Puede causar mareo o sueño.', '1 caja'),
    createMed('TRAMADOL/PARACETAMOL', '37.5/325 mg', 'Tabletas', 'Caja con 20', 'Oral', 'Analgesia', ['ZALDIAR', 'TRAZIDEX'], '010.000.4132.00', '1-2 tabletas', 'Cada 8 horas', '5 días', 'No conducir maquinaria pesada.', '1 caja'),

    // ANESTESIA
    createMed('LIDOCAINA', '2 %', 'Solución Inyectable', 'Frasco 50ml', 'Infiltración', 'Anestesia', ['XYLOCAINA', 'PISACAINA'], '010.000.0210.00', 'Según procedimiento', 'Dosis única', 'N/A', 'Uso médico exclusivo.', '1 frasco'),
    createMed('LIDOCAINA EN SPRAY', '10 %', 'Aerosol', 'Frasco 115ml', 'Tópica', 'Anestesia', ['XYLOCAINA SPRAY'], '010.000.0213.00', '1-2 disparos', 'Según necesidad', 'N/A', 'Anestesia local mucosa.', '1 frasco'),

    // GASTROENTEROLOGIA
    createMed('ALUMINIO Y MAGNESIO', 'Suspensión', 'Suspensión', 'Frasco 240ml', 'Oral', 'Gastro', ['MELOX', 'GELAN PLUS'], '010.000.1205.00', '10 ml', 'Cada 8 horas', '5 días', 'Tomar entre comidas.', '1 frasco'),
    createMed('RANITIDINA', '150 mg', 'Tabletas', 'Caja con 20', 'Oral', 'Gastro', ['AZANTAC'], '010.000.1211.00', '1 tableta', 'Cada 12 horas', '14 días', ' *Verificar disponibilidad actual*', '1 caja'),
    createMed('OMEPRAZOL', '20 mg', 'Cápsulas', 'Frasco con 14', 'Oral', 'Gastro', ['ULSEN', 'LOSEC', 'OPRAZ'], '010.000.1212.00', '1 cápsula', 'Cada 24 horas', '14-28 días', 'En ayunas, 30 min antes desayuno.', '1 frasco'),
    createMed('PANTOPRAZOL', '40 mg', 'Tabletas', 'Caja con 14', 'Oral', 'Gastro', ['TECTA', 'ZOLTUM'], '010.000.1214.00', '1 tableta', 'Cada 24 horas', '14 días', 'Ayunas preferentemente.', '1 caja'),
    createMed('ESOMEPRAZOL', '40 mg', 'Tabletas', 'Caja con 14', 'Oral', 'Gastro', ['NEXIUM'], '010.000.2222.00', '1 tableta', 'Cada 24 horas', '14 días', 'En ayunas.', '1 caja'),
    createMed('BUTILHIOSCINA', '10 mg', 'Grageas', 'Caja con 10', 'Oral', 'Gastro', ['BUSCAPINA'], '010.000.1226.00', '1 gragea', 'Cada 8 horas', '3 días', 'Para cólicos.', '1 caja'),
    createMed('BUTILHIOSCINA/METAMIZOL', '10/250 mg', 'Grageas', 'Caja con 20', 'Oral', 'Gastro', ['BUSCAPINA COMPOSITUM'], '010.000.1227.00', '1-2 grageas', 'Cada 8 horas', '3 días', 'Dolor tipo cólico fuerte.', '1 caja'),
    createMed('METOCLOPRAMIDA', '10 mg', 'Tabletas', 'Caja con 20', 'Oral', 'Gastro', ['PLASIL', 'CARNOTPRIM'], '010.000.1232.00', '1 tableta', 'Cada 8 horas', '5 días', '30 min antes de alimentos.', '1 caja'),
    createMed('LOPERAMIDA', '2 mg', 'Tabletas', 'Caja con 12', 'Oral', 'Gastro', ['LOMOTIL', 'ACQTA'], '010.000.1242.00', '2 tabs inicio, 1 x evacuación', 'S.O.S', '2 días max', 'No usar en disentería.', '1 caja'),
    createMed('SENOSIDOS A-B', '8.6 mg', 'Tabletas', 'Caja con 20', 'Oral', 'Gastro', ['SENOKOT'], '010.000.1251.00', '2 tabletas', 'Cada 24 horas (noche)', '3 días', 'Para estreñimiento ocasional.', '1 caja'),
    createMed('LACTULOSA', '66.6 g/100 ml', 'Jarabe', 'Frasco 120ml', 'Oral', 'Gastro', ['REGULACT'], '010.000.1254.00', '15-30 ml', 'Cada 24 horas', 'Hasta regularizar', 'Ajustar según respuesta.', '1 frasco'),
    createMed('ONDANSETRON', '8 mg', 'Tabletas', 'Caja con 10', 'Oral', 'Gastro', ['ZOFRAN'], '010.000.4262.00', '8 mg', 'Cada 8-12 horas', '3 días', 'Para náuseas intensas.', '1 caja'),

    // CARDIOVASCULAR
    createMed('CAPTOPRIL', '25 mg', 'Tabletas', 'Caja con 30', 'Oral', 'Cardio', ['CAPOTEN'], '010.000.0501.00', '1 tableta', 'Cada 8-12 horas', 'Permanente', '1h antes de alimentos.', '1 caja'),
    createMed('ENALAPRIL', '10 mg', 'Tabletas', 'Caja con 30', 'Oral', 'Cardio', ['GLIOTEN', 'RENITEC'], '010.000.0502.00', '1 tableta', 'Cada 12-24 horas', 'Permanente', 'Vigilar tos seca.', '1 caja'),
    createMed('LOSARTAN', '50 mg', 'Grageas', 'Caja con 30', 'Oral', 'Cardio', ['COZAAR'], '010.000.0503.00', '1 gragea', 'Cada 12-24 horas', 'Permanente', 'Control de presión.', '1 caja'),
    createMed('TELMISARTAN', '40 mg', 'Tabletas', 'Caja con 14', 'Oral', 'Cardio', ['MICARDIS'], '010.000.0504.00', '1 tableta', 'Cada 24 horas', 'Permanente', 'Por la mañana.', '1 caja'),
    createMed('TELMISARTAN', '80 mg', 'Tabletas', 'Caja con 14', 'Oral', 'Cardio', ['MICARDIS'], '010.000.0505.00', '1 tableta', 'Cada 24 horas', 'Permanente', 'Por la mañana.', '1 caja'),
    createMed('CANDESARTAN', '16 mg', 'Tabletas', 'Caja con 14', 'Oral', 'Cardio', ['ATACAND'], '010.000.5666.00', '1 tableta', 'Cada 24 horas', 'Permanente', 'Control PA.', '1 caja'),
    createMed('AMLODIPINO', '5 mg', 'Tabletas', 'Caja con 10/30', 'Oral', 'Cardio', ['NORVAS'], '010.000.0506.00', '1 tableta', 'Cada 24 horas', 'Permanente', 'Puede causar edema tobillos.', '1 caja'),
    createMed('NIFEDIPINO', '30 mg', 'Comprimidos LP', 'Caja con 30', 'Oral', 'Cardio', ['ADALAT OROS'], '010.000.0507.00', '1 comprimido', 'Cada 24 horas', 'Permanente', 'No partir ni masticar.', '1 caja'),
    createMed('METOPROLOL', '100 mg', 'Tabletas', 'Caja con 20', 'Oral', 'Cardio', ['LOPRESOR', 'SELOKEN'], '010.000.0515.00', '1/2 a 1 tableta', 'Cada 12 horas', 'Permanente', 'Con alimentos.', '1 caja'),
    createMed('BISOPROLOL', '5 mg', 'Tabletas', 'Caja con 30', 'Oral', 'Cardio', ['CONCOR'], '010.000.0516.00', '1 tableta', 'Cada 24 horas', 'Permanente', 'Por la mañana.', '1 caja'),
    createMed('HIDROCLOROTIAZIDA', '25 mg', 'Tabletas', 'Caja con 20', 'Oral', 'Cardio', ['ROFUCAL'], '010.000.0525.00', '1 tableta', 'Cada 24 horas', 'Permanente', 'Por la mañana (diurético).', '1 caja'),
    createMed('FUROSEMIDA', '40 mg', 'Tabletas', 'Caja con 20', 'Oral', 'Cardio', ['LASIX'], '010.000.0527.00', '1 tableta', 'Cada en la mañana', 'Permanente', 'Efecto diurético rápido.', '1 caja'),
    createMed('ESPIRONOLACTONA', '25 mg', 'Tabletas', 'Caja con 30', 'Oral', 'Cardio', ['ALDACTONE'], '010.000.0529.00', '1 tableta', 'Cada 24 horas', 'Permanente', 'Ahorrador de potasio.', '1 caja'),
    createMed('DIGOXINA', '0.25 mg', 'Tabletas', 'Caja con 20', 'Oral', 'Cardio', ['LANOXIN'], '010.000.0512.00', '1 tableta', 'Cada 24 horas', 'Permanente', 'Vigilancia estrecha.', '1 caja'),
    createMed('ISOSORBIDA', '10 mg', 'Tabletas', 'Caja con 20', 'Oral', 'Cardio', ['ISORBID'], '010.000.0551.00', '1 tableta', 'Cada 8 horas', 'Permanente', 'Prevención angina.', '1 caja'),
    createMed('ISOSORBIDA', '5 mg', 'Sublingual', 'Caja con 20', 'Sublingual', 'Cardio', ['ISORBID SL'], '010.000.0552.00', '1 tableta', 'PRN dolor pecho', 'N/A', 'Dejar disolver bajo lengua y acudir a urgencias.', '1 caja'),
    createMed('ATORVASTATINA', '20 mg', 'Tabletas', 'Caja con 30', 'Oral', 'Cardio/Lipidos', ['LIPITOR'], '010.000.0560.00', '1 tableta', 'Cada 24 horas', 'Permanente', 'Por la noche.', '1 caja'),
    createMed('PRAVASTATINA', '10 mg', 'Tabletas', 'Caja con 30', 'Oral', 'Cardio/Lipidos', ['PRAVACOL'], '010.000.0561.00', '1-2 tabletas', 'Cada 24 horas', 'Permanente', 'Por la noche.', '1 caja'),
    createMed('BEZAFIBRATO', '200 mg', 'Tabletas', 'Caja con 30', 'Oral', 'Cardio/Lipidos', ['BEZALIP'], '010.000.0565.00', '1 tableta', 'Cada 12-24 horas', '3 meses', 'Con la cena.', '1 caja'),

    // ENDOCRINOLOGIA
    createMed('METFORMINA', '850 mg', 'Tabletas', 'Caja con 30', 'Oral', 'Endocrino', ['DABEX', 'GLUCOPHAGE'], '010.000.1001.00', '1 tableta', 'Cada 12 horas', 'Permanente', 'Con alimentos.', '1 caja'),
    createMed('METFORMINA', '500 mg', 'Tabletas', 'Caja con 60', 'Oral', 'Endocrino', ['DABEX'], '010.000.1000.00', '1 tableta', 'Cada 8 horas', 'Permanente', 'Con alimentos.', '1 caja'),
    createMed('GLIBENCLAMIDA', '5 mg', 'Tabletas', 'Caja con 50', 'Oral', 'Endocrino', ['EUGLUCON'], '010.000.1002.00', '1 tableta', 'Cada 24 horas', 'Permanente', 'Antes del desayuno.', '1 caja'),
    createMed('INSULINA INTERMEDIA (NPH)', '100 UI/ml', 'Suspensión inyectable', 'Frasco 10ml', 'Subcutánea', 'Endocrino', ['INSULATARD', 'HUMULIN N'], '010.000.1051.00', 'Ver esquema', 'Cada 12-24 horas', 'Permanente', 'Rotar sitio inyección.', '1 frasco'),
    createMed('INSULINA RAPIDA (REGULAR)', '100 UI/ml', 'Solución Inyectable', 'Frasco 10ml', 'Subcutánea', 'Endocrino', ['HUMULIN R'], '010.000.1050.00', 'Ver esquema', 'Pre-prandial', 'Permanente', '30 min antes de comer.', '1 frasco'),
    createMed('INSULINA GLARGINA', '100 UI/ml', 'Solución Inyectable', 'Pluma/Vial', 'Subcutánea', 'Endocrino', ['LANTUS'], '010.000.1064.00', 'Ver indicación', 'Cada 24 horas', 'Permanente', 'Misma hora siempre.', '1 caja'),
    createMed('LEVOTIROXINA', '100 mcg', 'Tabletas', 'Caja con 100', 'Oral', 'Endocrino', ['EUTIROX', 'KARET'], '010.000.1082.00', '1 tableta', 'Cada 24 horas', 'Permanente', 'Ayuno estricto (1h antes desayuno).', '1 caja'),
    createMed('PREDNISONA', '5 mg', 'Tabletas', 'Caja con 20', 'Oral', 'Endocrino/Reuma', ['NOSIPREN'], '010.000.0000.00', 'Ver indicación', 'Cada 24 horas', 'Ver indicación', 'Por la mañana.', '1 caja'),
    createMed('PREDNISONA', '50 mg', 'Tabletas', 'Caja con 20', 'Oral', 'Endocrino/Reuma', ['NOSIPREN'], '010.000.0000.00', 'Ver indicación', 'Cada 24 horas', 'Ver indicación', 'Por la mañana. No suspender de golpe.', '1 caja'),
    createMed('DEXAMETASONA', '8 mg/2 ml', 'Solución Inyectable', 'Ampolleta', 'IM/IV', 'Endocrino/Alergia', ['ALIN'], '010.000.0000.00', '8 mg', 'Dosis única', 'N/A', 'Uso agudo.', '1 caja'),

    // INFECTOLOGIA (ANTIBIOTICOS)
    createMed('AMOXICILINA', '500 mg', 'Cápsulas', 'Caja con 12-15', 'Oral', 'Antibiótico', ['AMOXIL', 'PENAMOX'], '010.000.1905.00', '1 cápsula', 'Cada 8 horas', '7 días', 'Terminar esquema completo.', '1 caja'),
    createMed('AMOXICILINA/CLAVULANATO', '875/125 mg', 'Tabletas', 'Caja con 10-14', 'Oral', 'Antibiótico', ['AUGMENTIN', 'CLAVULIN'], '010.000.2127.00', '1 tableta', 'Cada 12 horas', '7-10 días', 'Con alimentos.', '1 caja'),
    createMed('AMOXICILINA/CLAVULANATO', '500/125 mg', 'Tabletas', 'Caja con 20', 'Oral', 'Antibiótico', ['AUGMENTIN 12H'], '010.000.2126.00', '1 tableta', 'Cada 8 horas', '7-10 días', 'Con alimentos.', '1 caja'),
    createMed('AMPICILINA', '500 mg', 'Cápsulas', 'Caja con 20', 'Oral', 'Antibiótico', ['PENTREXYL'], '010.000.1901.00', '1 cápsula', 'Cada 6 horas', '7 días', 'Alejado de alimentos.', '1 caja'),
    createMed('CEFALEXINA', '500 mg', 'Cápsulas', 'Caja con 20', 'Oral', 'Antibiótico', ['KEFLEX'], '010.000.1923.00', '1 cápsula', 'Cada 6 horas', '7 días', 'Bien tolerado.', '1 caja'),
    createMed('CEFTRIAXONA', '1 g', 'Sol. Iny.', 'Frasco Ampula', 'IM/IV', 'Antibiótico', ['ROCEPHIN'], '010.000.5269.00', '1 g', 'Cada 24 horas', '3-5 días', 'Aplicación IM Dolorosa (usar lidocaína si indicado).', '3 frascos'),
    createMed('CIPROFLOXACINO', '500 mg', 'Tabletas', 'Caja con 14', 'Oral', 'Antibiótico', ['CIPROXINA'], '010.000.1950.00', '1 tableta', 'Cada 12 horas', '7 días', 'No tomar con lácteos.', '1 caja'),
    createMed('LEVOFLOXACINO', '500 mg', 'Tabletas', 'Caja con 7', 'Oral', 'Antibiótico', ['TAVANIC', 'ELEQUINE'], '010.000.5268.00', '1 tableta', 'Cada 24 horas', '7-10 días', 'Lejos de antiácidos.', '1 caja'),
    createMed('TRIMETOPRIMA/SULFAMETOXAZOL', '80/400 mg', 'Tabletas', 'Caja con 20', 'Oral', 'Antibiótico', ['BACTRIM'], '010.000.1911.00', '2 tabletas', 'Cada 12 horas', '7 días', 'Tomar mucha agua.', '1 caja'),
    createMed('TRIMETOPRIMA/SULFAMETOXAZOL', '160/800 mg', 'Tabletas (F)', 'Caja con 14', 'Oral', 'Antibiótico', ['BACTRIM F', 'SEPTRA  F'], '010.000.1912.00', '1 tableta', 'Cada 12 horas', '7 días', 'Tomar mucha agua.', '1 caja'),
    createMed('DOXICICLINA', '100 mg', 'Cápsulas', 'Caja con 10', 'Oral', 'Antibiótico', ['VIBRAMICINA'], '010.000.1928.00', '1 cápsula', 'Cada 12-24 horas', '10-14 días', 'No acostarse inmediatamente. Fotosensibilidad.', '1 caja'),
    createMed('AZITROMICINA', '500 mg', 'Tabletas', 'Caja con 3', 'Oral', 'Antibiótico', ['AZITROCIN'], '010.000.2120.00', '1 tableta', 'Cada 24 horas', '3 días', '1 hora antes o 2 después de comer.', '1 caja'),
    createMed('CLARITROMICINA', '500 mg', 'Tabletas', 'Caja con 10', 'Oral', 'Antibiótico', ['KLARICID'], '010.000.2121.00', '1 tableta', 'Cada 12 horas', '7-10 días', 'Sabor metálico posible.', '1 caja'),
    createMed('CLINDAMICINA', '300 mg', 'Cápsulas', 'Caja con 16', 'Oral', 'Antibiótico', ['DALACIN C'], '010.000.2122.00', '1 cápsula', 'Cada 6-8 horas', '7 días', 'Con vaso lleno de agua.', '1 caja'),
    createMed('METRONIDAZOL', '500 mg', 'Tabletas', 'Caja con 20', 'Oral', 'Antibiótico/Antiparasitario', ['FLAGYL'], '010.000.1306.00', '1 tableta', 'Cada 8 horas', '7-10 días', 'NO ALCOHOL durante tratamiento.', '1 caja'),
    createMed('NITROFURANTOINA', '100 mg', 'Cápsulas', 'Caja con 40', 'Oral', 'Antibiótico', ['MACRODANTINA'], '010.000.1947.00', '1 cápsula', 'Cada 6-12 horas', '7 días', 'Orina color ámbar/oscuro.', '1 caja'),
    createMed('FLUCONAZOL', '150 mg', 'Cápsulas', 'Caja con 1', 'Oral', 'Antifúngico', ['DIFLUCAN'], '010.000.2010.00', '150 mg', 'Dosis única (semanal)', '1 o más dosis', 'Para candidiasis.', '1 caja'),
    createMed('KETOCONAZOL', '200 mg', 'Tabletas', 'Caja con 10', 'Oral', 'Antifúngico', ['NIZORAL'], '010.000.2001.00', '1 tableta', 'Cada 24 horas', '10 días', 'Hepatotóxico monitorizar.', '1 caja'),
    createMed('ALBENDAZOL', '400 mg', 'Tabletas', 'Caja con 2', 'Oral', 'Antiparasitario', ['ZENTEL'], '010.000.1332.00', '400 mg', 'Dosis única', '1 día', 'Masticar o tragar. Toda la familia.', '1 caja'),
    createMed('MEBENDAZOL', '100 mg', 'Tabletas', 'Caja con 6', 'Oral', 'Antiparasitario', ['VERMOX'], '010.000.1331.00', '1 tableta', 'Cada 12 horas', '3 días', 'Toda la familia.', '1 caja'),
    createMed('ACICLOVIR', '200 mg', 'Tabletas', 'Caja con 25', 'Oral', 'Antiviral', ['ZOVIRAX'], '010.000.1965.00', '1-2 tabletas', 'Cada 4 horas (5 veces)', '5-7 días', 'Beber mucha agua.', '1 caja'),
    createMed('ACICLOVIR', '400 mg', 'Tabletas', 'Caja con 35', 'Oral', 'Antiviral', ['ZOVIRAX'], '010.000.1966.00', '1 tableta', 'Cada 4-8 horas', '7 días', 'Herpes zoster/simple.', '1 caja'),

    // RESPIRATORIO
    createMed('LORATADINA', '10 mg', 'Tabletas', 'Caja con 10', 'Oral', 'Alergias', ['CLARITYNE'], '010.000.0401.00', '1 tableta', 'Cada 24 horas', '7 días', 'No da sueño.', '1 caja'),
    createMed('CLORFENAMINA', '4 mg', 'Tabletas', 'Caja con 20', 'Oral', 'Alergias', ['CLOROTRIMETON'], '010.000.0403.00', '1 tableta', 'Cada 6-8 horas', '3-5 días', 'Puede causar somnolencia importante.', '1 caja'),
    createMed('AMBROXOL', '30 mg/5 ml', 'Jarabe', 'Frasco 120ml', 'Oral', 'Respiratorio', ['MUCOSOLVAN'], '010.000.0423.00', '5-10 ml', 'Cada 8 horas', '5 días', 'Expectorante.', '1 frasco'),
    createMed('DEXTROMETORFANO', 'Jarabe', 'Jarabe', 'Frasco 120ml', 'Oral', 'Respiratorio', ['BISOLVON', 'HISTIACIL'], '010.000.0425.00', '5-10 ml', 'Cada 6-8 horas', '3-5 días', 'Tos seca.', '1 frasco'),
    createMed('SALBUTAMOL', '100 mcg', 'Aerosol', 'Frasco 200 dosis', 'Inhalada', 'Respiratorio', ['VENTOLIN'], '010.000.0440.00', '2 disparos', 'Cada 4-6 horas', 'PRN', 'Usar cámara espaciadora preferible.', '1 tubo'),
    createMed('SALMETEROL/FLUTICASONA', '50/250 mcg', 'Polvo/Aerosol', 'Dispositivo', 'Inhalada', 'Respiratorio', ['SERETIDE'], '010.000.0450.00', '1 dosis', 'Cada 12 horas', 'Permanente', 'Enjuagar boca tras uso.', '1 caja'),

    // NEUROLOGIA / PSIQUIATRIA
    createMed('CARBAMAZEPINA', '200 mg', 'Tabletas', 'Caja con 20', 'Oral', 'Neuro', ['TEGRETOL'], '010.000.2601.00', '1 tableta', 'Cada 8-12 horas', 'Permanente', 'Control niveles.', '1 caja'),
    createMed('VALPROATO DE MAGNESIO', '200 mg', 'Tabletas', 'Caja con 40', 'Oral', 'Neuro', ['ATEMPERATOR'], '010.000.2605.00', '1 tableta', 'Cada 8-12 horas', 'Permanente', 'No suspender.', '1 caja'),
    createMed('GABAPENTINA', '300 mg', 'Cápsulas', 'Caja con 15', 'Oral', 'Neuro/Dolor', ['NEURONTIN'], '010.000.2612.00', '1 cápsula', 'Cada 8 horas', 'Permanente', 'Ajustar dosis gradual.', '1 caja'),
    createMed('PREGABALINA', '75 mg', 'Cápsulas', 'Caja con 14', 'Oral', 'Neuro/Dolor', ['LYRICA'], '010.000.4613.00', '1 cápsula', 'Cada 12 horas', 'Permanente', 'Puede dar sueño.', '1 caja'),
    createMed('CLONAZEPAM', '2 mg', 'Tabletas', 'Caja con 30', 'Oral', 'Psiquiatría', ['RIVOTRIL'], '010.000.5486.00', '1/4 a 1/2 tableta', 'Cada 24 horas (noche)', 'Controlado', 'Genera dependencia. Retiro gradual.', '1 caja'),
    createMed('DIAZEPAM', '10 mg', 'Tabletas', 'Caja con 20', 'Oral', 'Psiquiatría', ['VALIUM'], '010.000.2483.00', '10 mg', 'PRN', 'Agudo', 'Uso delicado.', '1 caja'),
    createMed('ALPRAZOLAM', '0.25-0.5 mg', 'Tabletas', 'Caja con 30', 'Oral', 'Psiquiatría', ['TAFIL'], '010.000.2487.00', '1 tableta', 'Cada 12-24 horas', 'Controlado', 'Ansiedad.', '1 caja'),
    createMed('SERTRALINA', '50 mg', 'Tabletas', 'Caja con 14', 'Oral', 'Psiquiatría', ['ALTRULINE'], '010.000.2496.00', '1 tableta', 'Cada 24 horas', 'Permanente', 'Efecto inicia en 2-3 semanas.', '1 caja'),
    createMed('FLUOXETINA', '20 mg', 'Cápsulas', 'Caja con 14', 'Oral', 'Psiquiatría', ['PROZAC'], '010.000.2491.00', '1 cápsula', 'Cada 24 horas', 'Permanente', 'Por la mañana.', '1 caja'),

    // GINECO-OBSTETRICIA
    createMed('ACIDO FOLICO', '4 mg', 'Tabletas', 'Caja con 90', 'Oral', 'Embarazo', ['ACFOL'], '010.000.3401.00', '1 tableta', 'Cada 24 horas', 'Embarazo', 'Prevención defectos tubo neural.', '1 caja'),
    createMed('FUMARATO FERROSO', '200 mg', 'Tabletas', 'Caja con 50', 'Oral', 'Hemato/Emb', ['VALDEFER'], '010.000.1901.00', '1 tableta', 'Cada 12-24 horas', '3 meses', 'Evitar con lácteos.', '1 caja'),
    createMed('CALCIO', '500 mg', 'Tabletas', 'Caja con 30', 'Oral', 'Suplemento', ['CALTRATE'], '010.000.0000.00', '1 tableta', 'Cada 12-24 horas', 'Permanente', 'Prevención osteoporosis.', '1 caja'),
    createMed('ESTROGENOS CONJUGADOS', '0.625 mg', 'Grageas', 'Caja con 21', 'Oral', 'Gineco', ['PREMARIN'], '010.000.3001.00', '1 gragea', 'Cada 24 horas', 'Ciclico', 'Terapia reemplazo hormonal.', '1 caja'),
    createMed('MEDROXIPROGESTERONA', '150 mg/ml', 'Inyectable', 'Ampolleta/Jeringa', 'Intramuscular', 'Gineco', ['DEPO-PROVERA'], '010.000.3016.00', '150 mg', 'Cada 3 meses', 'Anticoncepción', 'Aplicación estricta.', '1 caja'),
    createMed('NISTATINA', '100,000 UI', 'Óvulos', 'Caja con 12', 'Vaginal', 'Gineco', ['MICOSTATIN'], '010.000.3031.00', '1 óvulo', 'Cada 24 horas (noche)', '12 días', 'Aplicar profundo.', '1 caja'),

    // DERMATOLOGIA / OFTALMO / OTORRINO
    createMed('MICONAZOL', '2 g/100 g', 'Crema', 'Tubo 20g', 'Tópica', 'Derma', ['DAKTARIN'], '010.000.0801.00', 'Aplicar capa fina', 'Cada 12 horas', '14-21 días', 'Hongos piel.', '1 tubo'),
    createMed('BETAMETASONA', '0.05 %', 'Crema', 'Tubo 20g', 'Tópica', 'Derma', ['DIPROSONE'], '010.000.0805.00', 'Capa fina', 'Cada 12-24 horas', '5-7 días', 'No usar en cara por tiempo prolongado.', '1 tubo'),
    createMed('CLORANFENICOL', '5 mg/ml', 'Solución Oftálmica', 'Gotero 10ml', 'Oftálmica', 'Oftalmo', ['CHLOROMYCETIN'], '010.000.0601.00', '2 gotas', 'Cada 4-6 horas', '5-7 días', 'Ojo afectado.', '1 frasco'),
    createMed('HIPROMELOSA', '0.5 %', 'Solución Oftálmica', 'Gotero 10ml', 'Oftálmica', 'Oftalmo', ['METHOCEL', 'LAGRICEL'], '010.000.2801.00', '2 gotas', 'Cada 4-6 horas', 'PRN', 'Lubricante ocular.', '1 frasco'),
    createMed('NEOMICINA/POLIMIXINA B/DEXAMETASONA', 'Solución', 'Gotas Oftálmicas', 'Frasco 5ml', 'Oftálmica', 'Oftalmo', ['MAXITROL'], '010.000.0621.00', '2 gotas', 'Cada 6-8 horas', '5-7 días', 'Infección con inflamación.', '1 frasco'),

    // VARIOS / URGENCIAS BASICAS
    createMed('EINEFRINA (ADRENALINA)', '1 mg/ml', 'Inyectable', 'Ampolleta', 'IM/SC', 'Urgencias', ['ADRENALINA'], '010.000.0101.00', '0.3-0.5 mg', 'Dosis respuesta', 'Agudo', 'Shock anafiláctico.', '1 caja'),
    createMed('DIFENIDOL', '25 mg', 'Tabletas', 'Caja con 30', 'Oral', 'Vértigo', ['VONTROL'], '010.000.2241.00', '1 tableta', 'Cada 8 horas', '3-5 días', 'Para vértigo o mareo.', '1 caja'),

    // DERMATOLOGIA ADICIONAL
    createMed('ACIBRETINA', '10 mg', 'Cápsulas', 'Caja con 30', 'Oral', 'Derma', ['NEOTIGASON'], '010.000.0822.00', '10-25 mg', 'Cada 24 horas', 'Especialista', 'Psoriasis severa.', '1 caja'),
    createMed('ISOTRETINOINA', '10 mg', 'Cápsulas', 'Caja con 30', 'Oral', 'Derma', ['TREVISSAGE'], '010.000.0824.00', 'Dosis peso', 'Cada 24 horas', 'Especialista', 'Acné severo. Teratogénico.', '1 caja'),
    createMed('MUPIROCINA', '2 %', 'Ungüento', 'Tubo 15g', 'Tópica', 'Derma', ['BACTROBAN'], '010.000.0831.00', 'Aplicar local', 'Cada 8 horas', '7 días', 'Infecciones piel.', '1 tubo'),
    createMed('OXIDO DE ZINC', 'Pasta', 'Pasta', 'Tubo 30g', 'Tópica', 'Derma', ['PASTA LASSAR'], '010.000.0841.00', 'Capa gruesa', 'Cada cambio pañal', 'Indefinido', 'Protector cutáneo.', '1 tubo'),
    createMed('PERMETRINA', '5 %', 'Crema', 'Tubo 60g', 'Tópica', 'Derma', ['SCABISAN'], '010.000.0864.00', 'Aplicar cuerpo', 'Dosis única', '8-14 horas', 'Escabiosis. Lavar tras 8-14h.', '1 tubo'),

    // OFTALMOLOGIA ADICIONAL
    createMed('TIMOLOL', '0.5 %', 'Gotas', 'Frasco 5ml', 'Oftálmica', 'Oftalmo', ['IMOT'], '010.000.0605.00', '1 gota', 'Cada 12 horas', 'Permanente', 'Glaucoma.', '1 frasco'),
    createMed('LATANOPROST', '0.005 %', 'Gotas', 'Frasco 2.5ml', 'Oftálmica', 'Oftalmo', ['XALATAN'], '010.000.0609.00', '1 gota', 'Cada 24 horas', 'Permanente', 'Glaucoma. Refrigerar.', '1 frasco'),
    createMed('CIPROFLOXACINO OFT', '0.3 %', 'Gotas', 'Frasco 5ml', 'Oftálmica', 'Oftalmo', ['SOPHIXIN'], '010.000.0624.00', '1-2 gotas', 'Cada 4-6 horas', '7 días', 'Infección ocular.', '1 frasco'),
    createMed('PREDNISOLONA OFT', '1 %', 'Suspensión', 'Frasco 5ml', 'Oftálmica', 'Oftalmo', ['PREDNEFRIN'], '010.000.0628.00', '1-2 gotas', 'Cada 4-6 horas', '5-7 días', 'Inflamación severa. Agitar.', '1 frasco'),
    createMed('NAFAZOLINA', '0.1 %', 'Gotas', 'Frasco 15ml', 'Oftálmica', 'Oftalmo', ['NAZIL'], '010.000.0000.00', '1-2 gotas', 'Cada 6-8 horas', '3 días max', 'Ojo rojo. No abusar.', '1 frasco'),

    // METABOLISMO Y NUTRICION
    createMed('CLORURO DE POTASIO', '149 mg/ml', 'Solución Iny', 'Ampolleta', 'IV', 'Electrolitos', ['KCL'], '010.000.3603.00', 'Según labs', 'Diluido', 'Agudo', 'Alto riesgo. Diluir siempre.', '1 caja'),
    createMed('GLUCONATO DE CALCIO', '10 %', 'Solución Iny', 'Ampolleta', 'IV', 'Electrolitos', ['CALCIO'], '010.000.3607.00', '1 g', 'Lento', 'Agudo', 'Monitor cardiaco.', '1 caja'),
    createMed('SULFATO DE MAGNESIO', '1 g/10 ml', 'Solución Iny', 'Ampolleta', 'IV/IM', 'Electrolitos', ['MAGNESIO'], '010.000.3609.00', '1 g', 'Cada 8 h', 'Agudo', 'Eclampsia / Hipomagnesemia.', '1 caja'),
    createMed('MULTIVITAMINICO', 'Grageas', 'Grageas', 'Caja con 30', 'Oral', 'Vitaminas', ['BIOMETRICS', 'CENTRUM'], '010.000.3621.00', '1 gragea', 'Cada 24 horas', '30 días', 'Con desayuno.', '1 caja'),
    createMed('HIERRO DEXTRANO', '100 mg/2ml', 'Solución Iny', 'Ampolleta', 'IM Profunda', 'Hematología', ['HI-DEX'], '010.000.1906.00', '100 mg', 'Cada 3 días', 'Según Hb', 'Técnica en Z para no manchar.', '1 caja'),

    // NEUMO ADICIONAL
    createMed('IPRATROPIO', '0.286 mg', 'Solución para Nebulizar', 'Frasco 20ml', 'Inhalada', 'Neumo', ['ATROVENT'], '010.000.0436.00', '10-20 gotas', 'Cada 6-8 horas', 'Agudo', 'Mezclar con solución salina.', '1 frasco'),
    createMed('BUDESONIDA', '0.250 mg/ml', 'Suspensión Nebulizar', 'Frasco', 'Inhalada', 'Neumo', ['PULMICORT'], '010.000.0452.00', '1 ampula', 'Cada 12 horas', 'Agudo', 'Enjuagar boca.', '1 caja'),
    createMed('TEOFILINA', '100 mg', 'Elixir/Jarabe', 'Frasco', 'Oral', 'Neumo', ['TEOLONG'], '010.000.0431.00', '5 ml', 'Cada 8 horas', 'Crónico', 'Broncodilatador.', '1 frasco'),

    // PSIQUIATRIA ADICIONAL
    createMed('PAROXETINA', '20 mg', 'Tabletas', 'Caja con 10', 'Oral', 'Psiquiatría', ['PAXIL'], '010.000.4492.00', '1 tableta', 'Cada 24 horas', 'Crónico', 'Depresión/Ansiedad.', '1 caja'),
    createMed('CITALOPRAM', '20 mg', 'Tabletas', 'Caja con 14', 'Oral', 'Psiquiatría', ['SEROPRAM'], '010.000.4496.00', '1 tableta', 'Cada 24 horas', 'Crónico', 'Depresión.', '1 caja'),
    createMed('ESCITALOPRAM', '10 mg', 'Tabletas', 'Caja con 14', 'Oral', 'Psiquiatría', ['LEXAPRO'], '010.000.5491.00', '1 tableta', 'Cada 24 horas', 'Crónico', 'Depresión/Ansiedad.', '1 caja'),
    createMed('IMIPRAMINA', '25 mg', 'Grageas', 'Caja con 20', 'Oral', 'Psiquiatría', ['TOFRANIL'], '010.000.2462.00', '1 gragea', 'Cada 8-24 horas', 'Crónico', 'Tricíclico.', '1 caja'),
    createMed('HALOPERIDOL', '5 mg', 'Tabletas', 'Caja con 20', 'Oral', 'Psiquiatría', ['HALDOL'], '010.000.2471.00', '1 tableta', 'Cada 8-12 horas', 'Crónico', 'Antipsicótico.', '1 caja'),
    createMed('HALOPERIDOL', '50 mg/ml', 'Inyectable', 'Ampolleta', 'IM', 'Psiquiatría', ['HALDOL DECANOAS'], '010.000.2473.00', '1 amp', 'Cada 4 semanas', 'Crónico', 'Depósito.', '1 caja'),
    createMed('RISPERIDONA', '2 mg', 'Tabletas', 'Caja con 40', 'Oral', 'Psiquiatría', ['RISPERDAL'], '010.000.4485.00', '1 tableta', 'Cada 24 horas', 'Crónico', 'Antipsicótico atípico.', '1 caja'),
    createMed('OLANZAPINA', '10 mg', 'Tabletas', 'Caja con 14', 'Oral', 'Psiquiatría', ['ZYPREXA'], '010.000.4488.00', '1 tableta', 'Cada 24 horas', 'Crónico', 'Antipsicótico atípico.', '1 caja'),
    createMed('QUETIAPINA', '25 mg', 'Tabletas', 'Caja con 30', 'Oral', 'Psiquiatría', ['SEROQUEL'], '010.000.5489.00', '1-2 tabletas', 'Cada 24 horas', 'Crónico', 'Inductor sueño/Antipsicótico.', '1 caja'),
    createMed('LITHIUM', '300 mg', 'Tabletas', 'Caja con 50', 'Oral', 'Psiquiatría', ['LITHEUM'], '010.000.2476.00', '1 tableta', 'Cada 8-12 horas', 'Crónico', 'Bipolaridad. Monitorizar niveles.', '1 caja'),

    // REUMATOLOGIA
    createMed('ALOPURINOL', '300 mg', 'Tabletas', 'Caja con 20', 'Oral', 'Reuma', ['ZYLOPRIM'], '010.000.0000.00', '1 tableta', 'Cada 24 horas', 'Crónico', 'Gota / Ácido úrico.', '1 caja'),
    createMed('COLCHICINA', '1 mg', 'Tabletas', 'Caja con 20', 'Oral', 'Reuma', ['COLCHICINA'], '010.000.2031.00', '1 tableta', 'Cada 12-24 horas', 'Agudo', 'Crisis gotosa. Diarrea = toxicidad.', '1 caja'),
    createMed('METOTREXATO', '2.5 mg', 'Tabletas', 'Caja con 50', 'Oral', 'Reuma/Onco', ['LEDERTREXATE'], '010.000.1761.00', 'Ver indicación', 'Semanal', 'Crónico', 'Artritis Reumatoide. Ácido fólico obligatorio.', '1 caja'),

    // UROLOGIA
    createMed('TAMSULOSINA', '0.4 mg', 'Cápsulas', 'Caja con 20', 'Oral', 'Urología', ['SECOTEX'], '010.000.5369.00', '1 cápsula', 'Cada 24 horas', 'Crónico', 'Hiperplasia prostática.', '1 caja'),
    createMed('FINASTERIDA', '5 mg', 'Grageas', 'Caja con 30', 'Oral', 'Urología', ['PROSCAR'], '010.000.5368.00', '1 gragea', 'Cada 24 horas', 'Crónico', 'Hiperplasia prostática.', '1 caja'),
    createMed('SILDENAFIL', '50 mg', 'Tabletas', 'Caja con 1-4', 'Oral', 'Urología', ['VIAGRA'], '010.000.0000.00', '1 tableta', '1h antes actividad', 'PRN', 'No usar con nitratos.', '1 caja'),
];
