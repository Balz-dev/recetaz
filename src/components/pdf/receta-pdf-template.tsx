import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import { Receta, Paciente, MedicoConfig } from '@/types';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

// Estilos del PDF - Media Carta (8.5" x 5.5" = 612pt x 396pt)
const styles = StyleSheet.create({
    page: {
        padding: 20,
        fontSize: 10,
        fontFamily: 'Helvetica',
    },
    // Header Row: Doctor (Left) - Paciente (Right)
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        height: 65, // Altura fija para el encabezado para asegurar espacio uniforme
        borderBottom: 1.5,
        borderBottomColor: '#0066CC',
        paddingBottom: 5,
        marginBottom: 10,
    },
    // Doctor Section (Left) - 35% del ancho - Compacto
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
    // Paciente Section (Right) - 60% del ancho - Destacado
    headerRight: {
        width: '60%',
        alignItems: 'flex-end', // Alinear a la derecha
        justifyContent: 'center',
    },
    pacienteNombre: {
        fontSize: 16, // Más grande
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

    // Cuerpo Principal
    bodySection: {
        flexGrow: 1, // Ocupa el espacio restante
    },

    // Diagnóstico
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

    // Medicamentos
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

    // Instrucciones Generales
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

    // Footer & Firma
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
    }
});

interface RecetaPDFTemplateProps {
    receta: Receta;
    paciente: Paciente;
    medico: MedicoConfig;
}

export const RecetaPDFTemplate = ({ receta, paciente, medico }: RecetaPDFTemplateProps) => (
    <Document>
        <Page size={[612, 396]} style={styles.page}> {/* Half Letter Horizontal */}

            {/* Header */}
            <View style={styles.headerRow}>
                {/* Left: Doctor Info */}
                <View style={styles.headerLeft}>
                    {medico.logo && (
                        <View style={styles.logoContainer}>
                            <Image src={medico.logo} style={styles.logo} />
                        </View>
                    )}
                    <View style={styles.doctorInfo}>
                        <Text style={styles.medicoNombre}>{medico.nombre}</Text>
                        <Text style={styles.medicoSmall}>{medico.especialidad}</Text>
                        <Text style={styles.medicoSmall}>Ced. Prof: {medico.cedula}</Text>
                    </View>
                </View>

                {/* Right: Patient Info */}
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

            {/* Body */}
            <View style={styles.bodySection}>
                {/* Diagnóstico */}
                <View style={styles.diagnosticoContainer}>
                    <Text style={styles.diagnosticoLabel}>Dx:</Text>
                    <Text style={styles.diagnosticoText}>{receta.diagnostico}</Text>
                </View>

                {/* Medicamentos */}
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

                {/* Instrucciones Generales (si existen) */}
                {receta.instrucciones && (
                    <View style={styles.generalInstrucciones}>
                        <Text style={styles.generalLabel}>Recomendaciones / Cuidados Generales:</Text>
                        <Text style={styles.generalText}>{receta.instrucciones}</Text>
                    </View>
                )}
            </View>

            {/* Footer */}
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
