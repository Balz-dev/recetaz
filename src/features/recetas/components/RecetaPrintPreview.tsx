"use client"

import { useEffect, useState } from "react";
import { Button } from "@/shared/components/ui/button";
import { recetaService } from "@/features/recetas/services/receta.service";
import { medicoService } from "@/features/config-medico/services/medico.service";
import { plantillaService } from "@/features/recetas/services/plantilla.service";
import { Receta, Paciente, MedicoConfig, PlantillaReceta } from "@/types";
import { Loader2, Printer, Download, Save } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { pdf } from "@react-pdf/renderer";
import { RecetaPDFTemplate } from "@/features/recetas/components/RecetaPdfTemplate";
import { Switch } from "@/shared/components/ui/switch";
import { Label } from "@/shared/components/ui/label";

interface RecetaPrintPreviewProps {
    recetaId: string;
    onClose: () => void;
}

export function RecetaPrintPreview({ recetaId, onClose }: RecetaPrintPreviewProps) {
    const [receta, setReceta] = useState<Receta | null>(null);
    const [paciente, setPaciente] = useState<Paciente | null>(null);
    const [medico, setMedico] = useState<MedicoConfig | null>(null);
    const [loading, setLoading] = useState(true);
    const [downloadingPDF, setDownloadingPDF] = useState(false);
    const [pdfUrl, setPdfUrl] = useState<string | null>(null);
    const [plantillaActiva, setPlantillaActiva] = useState<PlantillaReceta | null>(null);
    const [imprimirFondo, setImprimirFondo] = useState(false);
    const [regeneratingPDF, setRegeneratingPDF] = useState(false);

    useEffect(() => {
        return () => {
            if (pdfUrl) {
                URL.revokeObjectURL(pdfUrl);
            }
        };
    }, [pdfUrl]);

    useEffect(() => {
        const loadData = async () => {
            if (recetaId) {
                try {
                    const recetaData = await recetaService.getById(recetaId);
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

                        const plantilla = await plantillaService.getActive();
                        setPlantillaActiva(plantilla || null);
                        if (plantilla) {
                            setImprimirFondo(plantilla.imprimirFondo);
                        }
                    }
                } catch (error) {
                    console.error("Error cargando detalles:", error);
                } finally {
                    setLoading(false);
                }
            }
        };
        loadData();
    }, [recetaId]);

    // Generar PDF inicial cuando los datos estén listos
    useEffect(() => {
        if (!loading && receta && paciente && medico && !pdfUrl) {
            generateAndSetPDF();
        }
    }, [loading, receta, paciente, medico, pdfUrl]);

    const handleImprimirFondoChange = async (imprimirFondoValue: boolean) => {
        // Actualizamos estado local inmediatamente
        setImprimirFondo(imprimirFondoValue);
        
        // Limpiamos el URL actual para forzar regeneración en el efecto
        if (pdfUrl) {
            URL.revokeObjectURL(pdfUrl);
            setPdfUrl(null);
        }
        setRegeneratingPDF(true);

        if (plantillaActiva) {
            try {
                await plantillaService.update(plantillaActiva.id, { imprimirFondo: imprimirFondoValue });
                setPlantillaActiva({ ...plantillaActiva, imprimirFondo: imprimirFondoValue });
            } catch (error) {
                console.error("Error al guardar preferencia de impresión de fondo:", error);
            }
        }
    };

    const generateAndSetPDF = async () => {
        try {
            const blob = await generatePDFBlob();
            if (blob) {
                const url = URL.createObjectURL(blob);
                setPdfUrl(url);
            }
        } catch (error) {
            console.error("Error generando PDF:", error);
        } finally {
            setRegeneratingPDF(false);
        }
    };

    const generatePDFBlob = async () => {
        if (!receta || !paciente || !medico) return null;

        const plantillaParaImprimir = plantillaActiva ? {
            ...plantillaActiva,
            imprimirFondo: imprimirFondo
        } : null;

        return pdf(<RecetaPDFTemplate receta={receta} paciente={paciente} medico={medico} plantilla={plantillaParaImprimir} />).toBlob();
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

    const handlePrintPDF = () => {
        if (pdfUrl) {
            const printWindow = window.open(pdfUrl);
            if (printWindow) {
                // Alguna navegadores pueden bloquear esto, pero es el intento estándar
                // printWindow.print(); 
                // Mejor dejar que el visor de PDF del navegador maneje la impresión
            }
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
            <div className="text-center py-10">
                <p className="text-red-500">Error al cargar la receta.</p>
                <Button onClick={onClose} className="mt-4">Cerrar</Button>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-[70vh] gap-4">
            <div className="flex items-center justify-between border-b pb-4">
                <div>
                    <h3 className="text-lg font-semibold">Vista Previa de Impresión</h3>
                    <p className="text-sm text-slate-500">
                        {receta.diagnostico} - {paciente.nombre}
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    {plantillaActiva && (
                        <div className="flex items-center space-x-2 mr-2 bg-slate-50 px-3 py-2 rounded-md border">
                            <Switch
                                id="preview-bg-toggle"
                                checked={!imprimirFondo} // Si NO imprimimos fondo, es porque usamos hoja membretada
                                onCheckedChange={(checked) => handleImprimirFondoChange(!checked)}
                            />
                            <Label htmlFor="preview-bg-toggle" className="text-sm cursor-pointer">Imprimir en hoja membretada</Label>
                        </div>
                    )}
                </div>
            </div>

            <div className="flex-1 bg-slate-100 rounded-lg border overflow-hidden relative">
                {regeneratingPDF ? (
                    <div className="absolute inset-0 flex items-center justify-center bg-white/80 z-10">
                        <div className="text-center">
                            <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-2" />
                            <p className="text-sm text-slate-600">Actualizando...</p>
                        </div>
                    </div>
                ) : null}

                {pdfUrl ? (
                    <iframe
                        src={pdfUrl}
                        className="w-full h-full"
                        title="Vista Previa PDF"
                    />
                ) : (
                    <div className="flex items-center justify-center h-full">
                        <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
                    </div>
                )}
            </div>

            <div className="flex justify-end gap-3 pt-2 border-t mt-auto">
                <Button variant="outline" onClick={onClose}>
                    Cerrar y Finalizar
                </Button>
                <Button variant="secondary" onClick={handleDownloadPDF} disabled={downloadingPDF || regeneratingPDF}>
                    <Download className="mr-2 h-4 w-4" />
                    Descargar
                </Button>
                <Button onClick={handlePrintPDF} disabled={downloadingPDF || regeneratingPDF}>
                    <Printer className="mr-2 h-4 w-4" />
                    Imprimir
                </Button>
            </div>
        </div>
    );
}
