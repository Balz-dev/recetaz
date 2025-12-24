
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
    },
    // Estilos para grupo tratamiento
    tratamientoSection: {
        marginBottom: 10,
    },
    tratamientoHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 2,
    },
    tratamientoIcon: {
        fontSize: 12,
        marginRight: 4,
    },
    tratamientoTitle: {
        fontSize: 11,
        fontWeight: 'bold',
        color: '#000',
    },
    tratamientoDivider: {
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        marginBottom: 8,
        marginTop: 2,
    },
    medicationRow: {
        marginBottom: 10,
        paddingBottom: 8,
        borderBottomWidth: 0.5,
        borderBottomColor: '#eee',
    },
    medHeaderLine: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8, // Aumentado de 4 para dar un salto claro
        width: '100%',
    },
    medName: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#000',
    },
    medBadgeContainer: {
        backgroundColor: '#f0f4f8',
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 4,
    },
    medBadgeText: {
        fontSize: 10,
        color: '#0066CC',
        fontWeight: 'bold',
    },
    medInstructions: {
        fontSize: 11,
        color: '#333',
        marginBottom: 8, // Aumentado de 4 para separar de las notas
        lineHeight: 1.6,
    },
    medNote: {
        fontSize: 10,
        fontStyle: 'italic',
        color: '#666',
        marginTop: 4, // Aumentado ligeramente
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
                            // Fechas
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

                            // Datos del Paciente
                            case 'paciente_nombre':
                                content = paciente.nombre || "";
                                break;
                            case 'paciente_edad':
                                content = paciente.edad ? `${paciente.edad} años` : "";
                                break;
                            case 'paciente_peso':
                                content = receta.peso || paciente.peso || "";
                                break;
                            case 'paciente_talla':
                                content = receta.talla || paciente.talla || "";
                                break;
                            case 'alergias':
                                content = paciente.alergias || "";
                                break;

                            // Diagnóstico y tratamiento
                            case 'diagnostico':
                                content = receta.diagnostico || "";
                                break;
                            case 'instrucciones':
                            case 'instrucciones_lista':
                            case 'sugerencias':
                                content = receta.instrucciones || "";
                                break;

                            // Lista de medicamentos
                            case 'medicamentos':
                            case 'medicamentos_lista':
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

                            // Grupo Tratamiento Estilizado
                            case 'tratamiento_grupo':
                                content = (
                                    <View style={styles.tratamientoSection}>
                                        <View style={styles.tratamientoHeader}>
                                            <Text style={styles.tratamientoTitle}>Tratamiento</Text>
                                        </View>
                                        <View style={styles.tratamientoDivider} />
                                        
                                        {receta.medicamentos.map((med, idx) => (
                                            <View key={med.id || idx} style={styles.medicationRow}>
                                                <View style={styles.medHeaderLine}>
                                                    <Text style={styles.medName}>{med.nombre}</Text>
                                                    <View style={styles.medBadgeContainer}>
                                                        <Text style={styles.medBadgeText}>{med.dosis}</Text>
                                                    </View>
                                                </View>
                                                
                                                <Text style={styles.medInstructions}>
                                                    <Text style={{fontWeight: 'bold'}}>Tomar: </Text>
                                                    {med.frecuencia ? `${med.frecuencia} ` : ''}
                                                    {med.duracion ? `durante ${med.duracion}` : ''}
                                                </Text>
                                                
                                                {med.indicaciones && (
                                                    <Text style={styles.medNote}>
                                                        Nota: {med.indicaciones}
                                                    </Text>
                                                )}
                                            </View>
                                        ))}
                                    </View>
                                );
                                break;

                            // Campos individuales de medicamento (primer medicamento)
                            case 'medicamento_nombre':
                                content = receta.medicamentos[0]?.nombre || "";
                                break;
                            case 'medicamento_generico':
                                content = receta.medicamentos[0]?.nombre || ""; // No hay campo genérico en modelo
                                break;
                            case 'medicamento_marca':
                                content = ""; // No hay campo marca en modelo
                                break;
                            case 'medicamento_forma':
                                content = ""; // No hay campo forma en modelo
                                break;
                            case 'medicamento_dosis':
                                content = receta.medicamentos[0]?.dosis || "";
                                break;
                            case 'medicamento_presentacion':
                                content = receta.medicamentos[0]?.presentacion || "";
                                break;
                            case 'medicamento_via':
                                content = ""; // No hay campo vía en modelo
                                break;
                            case 'medicamento_posologia':
                                content = receta.medicamentos[0]?.indicaciones || "";
                                break;

                            // Folio
                            case 'receta_folio':
                                content = receta.numeroReceta || "";
                                break;

                            // Campos de médico
                            case 'medico_nombre':
                                content = medico.nombre || "";
                                break;
                            case 'medico_especialidad':
                                content = medico.especialidad || "";
                                break;
                            case 'medico_cedula_gral':
                            case 'medico_cedula_esp':
                                content = medico.cedula || "";
                                break;
                            case 'medico_institucion_gral':
                            case 'medico_institucion_esp':
                                content = medico.direccion || "";
                                break;
                            case 'medico_domicilio':
                                content = medico.direccion || "";
                                break;
                            case 'medico_contacto':
                                content = medico.telefono || "";
                                break;
                            case 'medico_correo':
                                content = ""; // No disponible en MedicoConfig
                                break;
                            case 'medico_web':
                                content = ""; // No disponible en MedicoConfig
                                break;
                            case 'medico_logo':
                                content = campo.src ? (
                                    <Image src={campo.src} style={{ width: '100%', height: '100%' }} />
                                ) : null;
                                break;

                            default:
                                content = "";
                        }
                        // Renderizar imágenes si el tipo es 'imagen' y no se manejó antes
                        if (campo.tipo === 'imagen' && campo.src) {
                            content = <Image src={campo.src} style={{ width: '100%', height: '100%' }} />;
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

                        // Renderizado según tipo de contenido
                        let renderedContent: React.ReactNode;
                        if (campo.tipo === 'imagen' || campo.id === 'medico_logo') {
                            // Imágenes se renderizan directamente
                            renderedContent = content;
                        } else if (campo.id === 'medicamentos' || campo.id === 'medicamentos_lista' || campo.id === 'tratamiento_grupo') {
                            // Listas y grupos complejos se renderizan directamente (ya son View con Text)
                            renderedContent = content;
                        } else {
                            // Texto normal
                            renderedContent = <Text style={styles.dynamicText}>{content as string}</Text>;
                        }

                        return (
                            <View key={campo.id} style={fieldStyle}>
                                {renderedContent}
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

