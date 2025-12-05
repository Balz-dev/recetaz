"use client"

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { recetaService } from "@/lib/db/recetas";
import { medicoService } from "@/lib/db/medico";
import { Receta, Paciente, MedicoConfig } from "@/types";
import { Loader2, Printer, ArrowLeft, FileText, Download } from "lucide-react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { pdf } from "@react-pdf/renderer";
import { RecetaPDFTemplate } from "@/components/pdf/receta-pdf-template";

export default function DetalleRecetaPage() {
    const params = useParams();
    const [receta, setReceta] = useState<Receta | null>(null);
    const [paciente, setPaciente] = useState<Paciente | null>(null);
    const [medico, setMedico] = useState<MedicoConfig | null>(null);
    const [loading, setLoading] = useState(true);
    const [downloadingPDF, setDownloadingPDF] = useState(false);

    useEffect(() => {
        const loadData = async () => {
            if (params.id) {
                try {
                    const recetaData = await recetaService.getById(params.id as string);
                    if (recetaData) {
                        setReceta(recetaData);

                        const pacienteData: Paciente = {
                            id: recetaData.pacienteId,
                            nombre: recetaData.pacienteNombre,
                            edad: recetaData.pacienteEdad,
                            createdAt: new Date(),
                            updatedAt: new Date()
                        };

                        const medicoData = await medicoService.get();

                        setPaciente(pacienteData);
                        setMedico(medicoData || null);
                    }
                } catch (error) {
                    console.error("Error cargando detalles:", error);
                } finally {
                    setLoading(false);
                }
            }
        };
        loadData();
    }, [params.id]);

    const generatePDFBlob = async () => {
        if (!receta || !paciente || !medico) return null;
        return pdf(<RecetaPDFTemplate receta={receta} paciente={paciente} medico={medico} />).toBlob();
    };

    const handleDownloadPDF = async () => {
        if (!receta?.fechaEmision || !paciente) return;

        setDownloadingPDF(true);
        try {
            const blob = await generatePDFBlob();
            if (!blob) return;

            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `${paciente.nombre.replace(/\s+/g, '_')}_${format(new Date(receta.fechaEmision), "dd-MM-yyyy", { locale: es })}.pdf`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Error generando PDF:', error);
        } finally {
            setDownloadingPDF(false);
        }
    };

    const handlePrintPDF = async () => {
        setDownloadingPDF(true);
        try {
            // Abrir ventana inmediatamente para evitar bloqueo de popups
            const pdfWindow = window.open('', '_blank');
            if (pdfWindow) {
                pdfWindow.document.write('<html><body style="display:flex;justify-content:center;align-items:center;height:100vh;font-family:sans-serif;"><div>Cargando vista previa del PDF...</div></body></html>');
            }

            const blob = await generatePDFBlob();
            if (blob && pdfWindow) {
                const url = URL.createObjectURL(blob);
                pdfWindow.location.href = url;
            } else if (pdfWindow) {
                pdfWindow.close();
                alert("No se pudo generar el PDF");
            }
        } catch (error) {
            console.error('Error al abrir PDF:', error);
        } finally {
            setDownloadingPDF(false);
        }
    };

    if (loading) {
        return (
            <div className="flex h-64 items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
        );
    }

    if (!receta || !paciente) {
        return (
            <div className="text-center py-10 space-y-4">
                <h3 className="text-lg font-semibold text-red-600">Receta no encontrada</h3>
                <Link href="/recetas">
                    <Button variant="outline">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Volver al historial
                    </Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <div className="flex items-center justify-between print:hidden">
                <div className="flex items-center gap-4">
                    <Link href="/recetas">
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                    </Link>
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">Receta #{receta.numeroReceta}</h2>
                        <p className="text-muted-foreground text-sm">
                            {receta.fechaEmision
                                ? `Emitida el ${format(new Date(receta.fechaEmision), "PPP 'a las' p", { locale: es })}`
                                : "Fecha no disponible"
                            }
                        </p>
                    </div>
                </div>
                <div className="flex gap-2">
                    {medico && receta.fechaEmision && (
                        <Button
                            variant="outline"
                            className="gap-2"
                            onClick={handleDownloadPDF}
                            disabled={downloadingPDF}
                        >
                            {downloadingPDF ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                <Download size={18} />
                            )}
                            {downloadingPDF ? 'Generando...' : 'Descargar PDF'}
                        </Button>
                    )}
                    <Button onClick={handlePrintPDF} className="gap-2" disabled={downloadingPDF}>
                        <Printer size={18} />
                        Imprimir / Ver PDF
                    </Button>
                </div>
            </div>

            {/* Vista previa de impresión */}
            <Card className="print:shadow-none print:border-none">
                <CardHeader className="border-b pb-6">
                    <div className="flex justify-between items-start">
                        <div>
                            <h3 className="text-xl font-bold text-blue-700">{medico?.nombre || "Nombre del Médico"}</h3>
                            <p className="text-sm text-slate-600">{medico?.especialidad}</p>
                            <p className="text-sm text-slate-500">Ced: {medico?.cedula}</p>
                        </div>
                        <div className="text-right text-sm text-slate-500">
                            <p>{medico?.direccion}</p>
                            <p>Tel: {medico?.telefono}</p>
                        </div>
                    </div>
                </CardHeader>

                <CardContent className="pt-6 space-y-8">
                    {/* Datos del Paciente */}
                    <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-lg border print:border-slate-200">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <span className="font-semibold text-slate-500 block">Paciente:</span>
                                <span className="text-lg">{paciente.nombre}</span>
                            </div>
                            <div>
                                <span className="font-semibold text-slate-500 block">Edad:</span>
                                <span>{paciente.edad} años</span>
                            </div>
                            <div>
                                <span className="font-semibold text-slate-500 block">Diagnóstico:</span>
                                <span className="font-medium">{receta.diagnostico}</span>
                            </div>
                            <div>
                                <span className="font-semibold text-slate-500 block">Fecha:</span>
                                <span>
                                    {receta.fechaEmision
                                        ? format(new Date(receta.fechaEmision), "dd/MM/yyyy", { locale: es })
                                        : "N/A"
                                    }
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Medicamentos */}
                    <div>
                        <h4 className="font-bold text-lg mb-4 flex items-center gap-2 border-b pb-2">
                            <FileText className="h-5 w-5 text-blue-600" />
                            Tratamiento
                        </h4>
                        <div className="space-y-6">
                            {receta.medicamentos.map((med, index) => (
                                <div key={index} className="pl-4 border-l-2 border-blue-200">
                                    <div className="flex justify-between items-baseline mb-1">
                                        <span className="font-bold text-lg">{med.nombre}</span>
                                        <span className="text-sm font-medium bg-blue-50 text-blue-700 px-2 py-0.5 rounded">
                                            {med.dosis}
                                        </span>
                                    </div>
                                    <p className="text-slate-700">
                                        <span className="font-medium">Tomar:</span> {med.frecuencia} durante {med.duracion}
                                    </p>
                                    {med.indicaciones && (
                                        <p className="text-sm text-slate-500 mt-1 italic">
                                            Nota: {med.indicaciones}
                                        </p>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Instrucciones Generales */}
                    {receta.instrucciones && (
                        <div>
                            <h4 className="font-bold text-lg mb-2 border-b pb-2">Indicaciones Generales</h4>
                            <p className="text-slate-700 whitespace-pre-wrap">{receta.instrucciones}</p>
                        </div>
                    )}

                    {/* Firma */}
                    <div className="pt-16 mt-8 flex justify-center">
                        <div className="text-center border-t border-slate-400 w-64 pt-2">
                            <p className="font-medium">{medico?.nombre}</p>
                            <p className="text-xs text-slate-500">Firma del Médico</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
