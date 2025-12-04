import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import { Receta, Paciente, MedicoConfig } from '@/types';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

// Estilos del PDF - Media Carta (8.5" x 5.5" = 612pt x 396pt)
const styles = StyleSheet.create({
    page: {
        padding: 30,
        fontSize: 10,
        fontFamily: 'Helvetica',
    },
    // Header horizontal: médico (izquierda) + paciente (derecha)
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderBottom: 2,
        borderBottomColor: '#0066CC',
        paddingBottom: 12,
        marginBottom: 20,
    },
    headerLeft: {
        width: '48%',
    },
    headerRight: {
        width: '48%',
        paddingLeft: 10,
    },
    logoContainer: {
        marginBottom: 8,
    },
    logo: {
        width: 60,
        height: 60,
        objectFit: 'contain',
    },
    medicoNombre: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#0066CC',
        marginBottom: 3,
    },
    medicoInfo: {
        fontSize: 9,
        color: '#666',
        marginBottom: 2,
    },
    pacienteLabel: {
        fontSize: 8,
        color: '#666',
        marginBottom: 1,
    },
    pacienteValue: {
        fontSize: 11,
        fontWeight: 'bold',
        marginBottom: 6,
    },
    // Sección central ampliada
    section: {
        marginBottom: 12,
    },
    diagnostico: {
        marginBottom: 16,
    },
    diagnosticoLabel: {
        fontSize: 10,
        fontWeight: 'bold',
        color: '#0066CC',
        marginBottom: 4,
    },
    diagnosticoText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#000',
    },
    tratamientoLabel: {
        fontSize: 11,
        fontWeight: 'bold',
        color: '#0066CC',
        marginBottom: 10,
        borderBottom: 1,
        borderBottomColor: '#0066CC',
        paddingBottom: 3,
    },
    medicamentoItem: {
        marginBottom: 14,
        paddingLeft: 8,
        borderLeft: 3,
        borderLeftColor: '#0066CC',
    },
    medicamentoNombre: {
        fontSize: 13,
        fontWeight: 'bold',
        marginBottom: 4,
        color: '#000',
    },
    medicamentoDetalle: {
        fontSize: 11,
        marginBottom: 2,
        color: '#333',
    },
    medicamentoLabel: {
        fontWeight: 'bold',
    },
    indicaciones: {
        fontSize: 10,
        fontStyle: 'italic',
        color: '#555',
        marginTop: 3,
    },
    // Footer compacto
    footer: {
        position: 'absolute',
        bottom: 20,
        left: 30,
        right: 30,
        borderTop: 1,
        borderTopColor: '#999',
        paddingTop: 8,
    },
    footerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 4,
    },
    footerText: {
        fontSize: 7,
        color: '#666',
    },
    firmaLine: {
        width: 180,
        borderTop: 1,
        borderTopColor: '#333',
        marginTop: 15,
        paddingTop: 3,
    },
    firmaText: {
        fontSize: 8,
        textAlign: 'center',
        color: '#666',
    },
    numeroReceta: {
        position: 'absolute',
        top: 30,
        right: 30,
        fontSize: 9,
        color: '#666',
    },
});

interface RecetaPDFTemplateProps {
    receta: Receta;
    paciente: Paciente;
    medico: MedicoConfig;
}

export const RecetaPDFTemplate = ({ receta, paciente, medico }: RecetaPDFTemplateProps) => (
    <Document>
        <Page size={[612, 396]} style={styles.page}>
            {/* Número de Receta */}
            <Text style={styles.numeroReceta}>Receta N° {receta.numeroReceta}</Text>

            {/* Header Horizontal: Médico (izq) + Paciente (der) */}
            <View style={styles.headerRow}>
                {/* Columna Izquierda: Médico */}
                <View style={styles.headerLeft}>
                    {medico.logo && (
                        <View style={styles.logoContainer}>
                            <Image src={medico.logo} style={styles.logo} />
                        </View>
                    )}
                    <Text style={styles.medicoNombre}>{medico.nombre}</Text>
                    <Text style={styles.medicoInfo}>{medico.especialidad}</Text>
                    <Text style={styles.medicoInfo}>Cédula Prof: {medico.cedula}</Text>
                </View>

                {/* Columna Derecha: Paciente */}
                <View style={styles.headerRight}>
                    <Text style={styles.pacienteLabel}>Paciente:</Text>
                    <Text style={styles.pacienteValue}>{paciente.nombre}</Text>

                    <Text style={styles.pacienteLabel}>Edad:</Text>
                    <Text style={styles.pacienteValue}>{paciente.edad} años</Text>

                    <Text style={styles.pacienteLabel}>Fecha:</Text>
                    <Text style={styles.pacienteValue}>
                        {receta.fechaEmision
                            ? format(new Date(receta.fechaEmision), "dd/MM/yyyy", { locale: es })
                            : "N/A"
                        }
                    </Text>
                </View>
            </View>

            {/* Diagnóstico */}
            <View style={styles.diagnostico}>
                <Text style={styles.diagnosticoLabel}>Diagnóstico:</Text>
                <Text style={styles.diagnosticoText}>{receta.diagnostico}</Text>
            </View>

            {/* Tratamiento Prescrito */}
            <View style={styles.section}>
                <Text style={styles.tratamientoLabel}>Tratamiento Prescrito</Text>
                {receta.medicamentos.map((med, index) => (
                    <View key={med.id} style={styles.medicamentoItem}>
                        <Text style={styles.medicamentoNombre}>
                            {index + 1}. {med.nombre} - {med.dosis}
                        </Text>
                        <Text style={styles.medicamentoDetalle}>
                            <Text style={styles.medicamentoLabel}>Frecuencia:</Text> {med.frecuencia}
                        </Text>
                        <Text style={styles.medicamentoDetalle}>
                            <Text style={styles.medicamentoLabel}>Duración:</Text> {med.duracion}
                        </Text>
                        {med.indicaciones && (
                            <Text style={styles.indicaciones}>
                                Nota: {med.indicaciones}
                            </Text>
                        )}
                    </View>
                ))}
            </View>

            {/* Instrucciones Generales */}
            {receta.instrucciones && (
                <View style={styles.section}>
                    <Text style={styles.diagnosticoLabel}>Indicaciones Generales:</Text>
                    <Text style={styles.medicamentoDetalle}>{receta.instrucciones}</Text>
                </View>
            )}

            {/* Footer */}
            <View style={styles.footer}>
                <View style={styles.footerRow}>
                    <Text style={styles.footerText}>{medico.direccion}</Text>
                    <Text style={styles.footerText}>Tel: {medico.telefono}</Text>
                </View>
                <View style={styles.firmaLine}>
                    <Text style={styles.firmaText}>Firma del Médico</Text>
                </View>
            </View>
        </Page>
    </Document>
);
