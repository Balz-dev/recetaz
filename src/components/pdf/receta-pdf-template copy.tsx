import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';
import { Receta, Paciente, MedicoConfig } from '@/types';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

// Estilos del PDF
const styles = StyleSheet.create({
    page: {
        padding: 40,
        fontSize: 11,
        fontFamily: 'Helvetica',
    },
    header: {
        marginBottom: 20,
        borderBottom: 2,
        borderBottomColor: '#0066CC',
        paddingBottom: 10,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#0066CC',
        marginBottom: 4,
    },
    headerSubtitle: {
        fontSize: 10,
        color: '#666',
        marginBottom: 2,
    },
    section: {
        marginBottom: 15,
    },
    sectionTitle: {
        fontSize: 12,
        fontWeight: 'bold',
        marginBottom: 8,
        color: '#0066CC',
        borderBottom: 1,
        borderBottomColor: '#E0E0E0',
        paddingBottom: 4,
    },
    row: {
        flexDirection: 'row',
        marginBottom: 4,
    },
    label: {
        fontWeight: 'bold',
        width: 100,
        fontSize: 10,
    },
    value: {
        flex: 1,
        fontSize: 10,
    },
    medicamentoCard: {
        marginBottom: 12,
        padding: 10,
        backgroundColor: '#F5F5F5',
        borderRadius: 4,
        borderLeft: 3,
        borderLeftColor: '#0066CC',
    },
    medicamentoNombre: {
        fontSize: 12,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    medicamentoDetalle: {
        fontSize: 9,
        marginBottom: 2,
        color: '#333',
    },
    instrucciones: {
        fontSize: 10,
        lineHeight: 1.5,
        textAlign: 'justify',
    },
    footer: {
        marginTop: 40,
        paddingTop: 20,
        borderTop: 1,
        borderTopColor: '#E0E0E0',
        alignItems: 'center',
    },
    firma: {
        marginTop: 30,
        borderTop: 1,
        borderTopColor: '#333',
        width: 200,
        paddingTop: 5,
        textAlign: 'center',
    },
    firmaNombre: {
        fontSize: 10,
        fontWeight: 'bold',
    },
    firmaTexto: {
        fontSize: 8,
        color: '#666',
    },
    numeroReceta: {
        position: 'absolute',
        top: 40,
        right: 40,
        fontSize: 10,
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
        <Page size="LETTER" style={styles.page}>
            {/* Número de Receta */}
            <Text style={styles.numeroReceta}>Receta N° {receta.numeroReceta}</Text>

            {/* Encabezado - Datos del Médico */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>{medico.nombre}</Text>
                <Text style={styles.headerSubtitle}>{medico.especialidad}</Text>
                <Text style={styles.headerSubtitle}>Cédula Profesional: {medico.cedula}</Text>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 4 }}>
                    <Text style={styles.headerSubtitle}>{medico.direccion}</Text>
                    <Text style={styles.headerSubtitle}>Tel: {medico.telefono}</Text>
                </View>
            </View>

            {/* Información del Paciente */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Datos del Paciente</Text>
                <View style={styles.row}>
                    <Text style={styles.label}>Nombre:</Text>
                    <Text style={styles.value}>{paciente.nombre}</Text>
                </View>
                <View style={styles.row}>
                    <Text style={styles.label}>Edad:</Text>
                    <Text style={styles.value}>{paciente.edad} años</Text>
                </View>
                <View style={styles.row}>
                    <Text style={styles.sectionTitle}>Diagnóstico</Text>
                    <Text style={styles.value}>{receta.diagnostico}</Text>
                </View>

                {/* Medicamentos */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Tratamiento Prescrito</Text>
                    {receta.medicamentos.map((med, index) => (
                        <View key={med.id} style={styles.medicamentoCard}>
                            <Text style={styles.medicamentoNombre}>
                                {index + 1}. {med.nombre}
                            </Text>
                            <Text style={styles.medicamentoDetalle}>
                                <Text style={{ fontWeight: 'bold' }}>Dosis:</Text> {med.dosis}
                            </Text>
                            <Text style={styles.medicamentoDetalle}>
                                <Text style={{ fontWeight: 'bold' }}>Frecuencia:</Text> {med.frecuencia}
                            </Text>
                            <Text style={styles.medicamentoDetalle}>
                                <Text style={{ fontWeight: 'bold' }}>Duración:</Text> {med.duracion}
                            </Text>
                            {med.indicaciones && (
                                <Text style={styles.medicamentoDetalle}>
                                    <Text style={{ fontWeight: 'bold' }}>Indicaciones:</Text> {med.indicaciones}
                                </Text>
                            )}
                        </View>
                    ))}
                </View>

                {/* Instrucciones Generales */}
                {receta.instrucciones && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Indicaciones Generales</Text>
                        <Text style={styles.instrucciones}>{receta.instrucciones}</Text>
                    </View>
                )}

                {/* Firma */}
                <View style={styles.footer}>
                    <View style={styles.firma}>
                        <Text style={styles.firmaNombre}>{medico.nombre}</Text>
                        <Text style={styles.firmaTexto}>Firma del Médico</Text>
                    </View>
                </View>
            </View>
        </Page>
    </Document>
);
