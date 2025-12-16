
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import { Receta, Paciente, MedicoConfig, PlantillaReceta } from '@/types';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { getMedicoLogo } from '@/shared/constants/logo-default';

// Estilos por defecto (Legacy)
const styles = StyleSheet.create({
    page: {
        padding: 20,
        fontSize: 10,
        fontFamily: 'Helvetica',
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        height: 65,
        borderBottom: 1.5,
        borderBottomColor: '#0066CC',
        paddingBottom: 5,
        marginBottom: 10,
    },
    headerLeft: {
        width: '35%',
        flexDirection: 'row',
        alignItems: 'center',
    },
    logoContainer: {
        marginRight: 8,
    },
    logo: {
        width: 45,
        height: 45,
        objectFit: 'contain',
    },
    doctorInfo: {
        justifyContent: 'center',
    },
    medicoNombre: {
        fontSize: 10,
        fontWeight: 'bold',
        color: '#0066CC',
    },
    medicoSmall: {
        fontSize: 7,
        color: '#555',
    },
    headerRight: {
        width: '60%',
        alignItems: 'flex-end',
        justifyContent: 'center',
    },
    pacienteNombre: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 2,
    },
    pacienteInfoRow: {
        flexDirection: 'row',
        gap: 15,
    },
    pacienteDato: {
        fontSize: 9,
        color: '#444',
    },
    bodySection: {
        flexGrow: 1,
    },
    diagnosticoContainer: {
        marginBottom: 8,
        flexDirection: 'row',
        alignItems: 'baseline',
    },
    diagnosticoLabel: {
        fontSize: 9,
        fontWeight: 'bold',
        color: '#0066CC',
        marginRight: 5,
    },
    diagnosticoText: {
        fontSize: 10,
        fontWeight: 'bold',
    },
    medicamentosContainer: {
        marginTop: 5,
    },
    medicamentoItem: {
        marginBottom: 8,
        paddingLeft: 6,
        borderLeft: 2,
        borderLeftColor: '#0066CC',
    },
    medicamentoHeader: {
        fontSize: 11,
        fontWeight: 'bold',
        marginBottom: 1,
    },
    medicamentoDetailsRow: {
        flexDirection: 'row',
        gap: 10,
    },
    medicamentoDetail: {
        fontSize: 9,
        color: '#333',
    },
    indicaciones: {
        fontSize: 9,
        fontStyle: 'italic',
        color: '#555',
        marginTop: 1,
    },
    generalInstrucciones: {
        marginTop: 10,
        padding: 5,
        backgroundColor: '#f8f9fa',
        borderRadius: 2,
    },
    generalLabel: {
        fontSize: 8,
        fontWeight: 'bold',
        color: '#0066CC',
        marginBottom: 2,
    },
    generalText: {
        fontSize: 8,
        color: '#333',
    },
    footer: {
        position: 'absolute',
        bottom: 20,
        left: 20,
        right: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
    },
    footerAddress: {
        width: '50%',
    },
    footerText: {
        fontSize: 7,
        color: '#888',
    },
    firmaContainer: {
        width: 180,
        alignItems: 'center',
    },
    firmaLine: {
        width: '100%',
        borderTop: 1,
        borderTopColor: '#333',
        marginBottom: 3,
    },
    firmaName: {
        fontSize: 9,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    firmaLabel: {
        fontSize: 7,
        color: '#666',
        textAlign: 'center',
    },
    numeroRecetaLabel: {
        position: 'absolute',
        top: 25,
        right: 20,
        fontSize: 8,
        color: '#999',
    },
    // Estilos dinámicos
    dynamicText: {
        fontSize: 10,
        fontFamily: 'Helvetica',
    }
});

interface RecetaPDFTemplateProps {
    receta: Receta;
    paciente: Paciente;
    medico: MedicoConfig;
    plantilla?: PlantillaReceta | null;
}

export const RecetaPDFTemplate = ({ receta, paciente, medico, plantilla }: RecetaPDFTemplateProps) => {

    // Si hay una plantilla activa, usar el renderizado dinámico
    if (plantilla) {
        // Dimensiones basadas en selección. 
        // Carta: 612x792 (Portrait)
        // Media Carta: 612x396 (Horizontal/Landscape) que es el estándar actual del sistema
        const pageSize: [number, number] = plantilla.tamanoPapel === 'carta' ? [612, 792] : [612, 396];

        return (
            <Document>
                <Page size={pageSize} style={{ position: 'relative' }}>
                    {/* Imagen de fondo opcional */}
                    {plantilla.imprimirFondo && plantilla.imagenFondo && (
                        <Image
                            src={plantilla.imagenFondo}
                            style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: '100%',
                                height: '100%',
                                objectFit: 'fill'
                            }}
                        />
                    )}

                    {/* Campos dinámicos */}
                    {plantilla.campos.filter(c => c.visible).map((campo) => {
                        let content: React.ReactNode = null;

                        // Mapeo de datos
                        switch (campo.id) {
                            case 'fecha':
                                content = receta.fechaEmision
                                    ? format(new Date(receta.fechaEmision), "dd MMM yyyy", { locale: es })
                                    : "";
                                break;
                            case 'receta_fecha':
                                content = receta.fechaEmision
                                    ? format(new Date(receta.fechaEmision), "dd/MM/yyyy", { locale: es })
                                    : "";
                                break;
                            case 'paciente_nombre':
                                content = paciente.nombre;
                                break;
                            case 'paciente_edad':
                                content = `${paciente.edad} años`;
                                break;
                            case 'diagnostico':
                                content = receta.diagnostico;
                                break;
                            case 'instrucciones':
                            case 'instrucciones_lista':
                            case 'sugerencias':
                                content = receta.instrucciones;
                                break;
                            case 'medicamentos':
                            case 'medicamentos_lista':
                                // Renderizado especial para lista
                                content = (
                                    <View>
                                        {receta.medicamentos.map((med, idx) => (
                                            <Text key={med.id || idx} style={{ fontSize: 9, marginBottom: 2 }}>
                                                {`• ${med.nombre} - ${med.dosis} (${med.frecuencia} / ${med.duracion})`}
                                            </Text>
                                        ))}
                                    </View>
                                );
                                break;
                            case 'paciente_peso':
                                content = receta.peso || paciente.peso || "";
                                break;
                            case 'paciente_talla':
                                content = receta.talla || paciente.talla || "";
                                break;
                            case 'receta_folio':
                                content = receta.numeroReceta;
                                break;
                            default:
                                content = "";
                        }

                        // Estilo posicional absoluto
                        const fieldStyle = {
                            position: 'absolute' as const,
                            left: `${campo.x}%`,
                            top: `${campo.y}%`,
                            width: `${campo.ancho}%`,
                            // Si es lista y tiene alto definido
                            ...(campo.alto ? { height: `${campo.alto}%` } : {}),
                        };

                        return (
                            <View key={campo.id} style={fieldStyle}>
                                {campo.id === 'medicamentos' ? content : (
                                    <Text style={styles.dynamicText}>{content as string}</Text>
                                )}
                            </View>
                        );
                    })}
                </Page>
            </Document>
        );
    }

    // Renderizado por defecto (Legacy)
    return (
        <Document>
            <Page size={[612, 396]} style={styles.page}>
                <View style={styles.headerRow}>
                    <View style={styles.headerLeft}>
                        <View style={styles.logoContainer}>
                            <Image src={getMedicoLogo(medico.logo)} style={styles.logo} />
                        </View>
                        <View style={styles.doctorInfo}>
                            <Text style={styles.medicoNombre}>{medico.nombre}</Text>
                            <Text style={styles.medicoSmall}>{medico.especialidad}</Text>
                            <Text style={styles.medicoSmall}>Ced. Prof: {medico.cedula}</Text>
                        </View>
                    </View>

                    <View style={styles.headerRight}>
                        <Text style={styles.pacienteDato}>Receta #{receta.numeroReceta}</Text>
                        <Text style={styles.pacienteNombre}>{paciente.nombre}</Text>
                        <View style={styles.pacienteInfoRow}>
                            <Text style={styles.pacienteDato}>Edad: {paciente.edad} años</Text>
                            <Text style={styles.pacienteDato}>
                                Fecha: {receta.fechaEmision
                                    ? format(new Date(receta.fechaEmision), "dd/MM/yyyy", { locale: es })
                                    : "N/D"}
                            </Text>
                        </View>
                    </View>
                </View>

                <View style={styles.bodySection}>
                    <View style={styles.diagnosticoContainer}>
                        <Text style={styles.diagnosticoLabel}>Dx:</Text>
                        <Text style={styles.diagnosticoText}>{receta.diagnostico}</Text>
                    </View>

                    <View style={styles.medicamentosContainer}>
                        {receta.medicamentos.map((med, index) => (
                            <View key={med.id} style={styles.medicamentoItem}>
                                <Text style={styles.medicamentoHeader}>
                                    {index + 1}. {med.nombre} - {med.dosis}
                                </Text>
                                <View style={styles.medicamentoDetailsRow}>
                                    <Text style={styles.medicamentoDetail}>
                                        <Text style={{ fontWeight: 'bold' }}>Frec:</Text> {med.frecuencia}
                                    </Text>
                                    <Text style={styles.medicamentoDetail}>
                                        <Text style={{ fontWeight: 'bold' }}>Dur:</Text> {med.duracion}
                                    </Text>
                                </View>
                                {med.indicaciones && (
                                    <Text style={styles.indicaciones}>
                                        Nota: {med.indicaciones}
                                    </Text>
                                )}
                            </View>
                        ))}
                    </View>

                    {receta.instrucciones && (
                        <View style={styles.generalInstrucciones}>
                            <Text style={styles.generalLabel}>Recomendaciones / Cuidados Generales:</Text>
                            <Text style={styles.generalText}>{receta.instrucciones}</Text>
                        </View>
                    )}
                </View>

                <View style={styles.footer}>
                    <View style={styles.footerAddress}>
                        <Text style={styles.footerText}>{medico.direccion}</Text>
                        <Text style={styles.footerText}>Tel: {medico.telefono}</Text>
                    </View>
                    <View style={styles.firmaContainer}>
                        <View style={styles.firmaLine} />
                        <Text style={styles.firmaName}>{medico.nombre}</Text>
                        <Text style={styles.firmaLabel}>Firma del Médico</Text>
                    </View>
                </View>
            </Page>
        </Document>
    );
};

