"use client"

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { recetaService } from "@/features/recetas/services/receta.service";
import { medicoService } from "@/features/config-medico/services/medico.service";
import { plantillaService } from "@/features/recetas/services/plantilla.service";
import { Receta, Paciente, MedicoConfig, PlantillaReceta } from "@/types";
import { Loader2, Printer, ArrowLeft, FileText, Download } from "lucide-react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import Image from "next/image";
import { getMedicoLogo } from "@/shared/constants/logo-default";
import { pdf } from "@react-pdf/renderer";
import { RecetaPDFTemplate } from "@/features/recetas/components/RecetaPdfTemplate";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/shared/components/ui/dialog";
import { obtenerVerbo, calcularCantidad } from "@/features/recetas/utils/receta-formatters";
import { Switch } from "@/shared/components/ui/switch";
import { Label } from "@/shared/components/ui/label";

export default function DetalleRecetaPage() {
    const params = useParams();
    const [receta, setReceta] = useState<Receta | null>(null);
    const [paciente, setPaciente] = useState<Paciente | null>(null);
    const [medico, setMedico] = useState<MedicoConfig | null>(null);
    const [loading, setLoading] = useState(true);
    const [downloadingPDF, setDownloadingPDF] = useState(false);
    const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);
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

                        // Cargar plantilla activa
                        const plantilla = await plantillaService.getActive();
                        setPlantillaActiva(plantilla || null);
                        // Inicializar estado de imprimirFondo con la configuración de la plantilla
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
    }, [params.id]);

    // Funcion para manejar el cambio de impresion de fondo con persistencia
    const handleImprimirFondoChange = async (checked: boolean) => {
        setImprimirFondo(checked);
        if (plantillaActiva) {
            try {
                // Actualizamos la preferencia en la base de datos para que sea persistente
                await plantillaService.update(plantillaActiva.id, { imprimirFondo: checked });
                // Actualizamos estado local
                setPlantillaActiva({ ...plantillaActiva, imprimirFondo: checked });

                // Si el modal de PDF está abierto, regenerar el PDF automáticamente
                if (isPdfModalOpen) {
                    setRegeneratingPDF(true);

                    // Limpiar el URL anterior
                    if (pdfUrl) {
                        URL.revokeObjectURL(pdfUrl);
                        setPdfUrl(null);
                    }

                    // Regenerar el PDF con el nuevo estado
                    setTimeout(async () => {
                        try {
                            const blob = await generatePDFBlob();
                            if (blob) {
                                const url = URL.createObjectURL(blob);
                                setPdfUrl(url);
                            }
                        } catch (error) {
                            console.error("Error regenerando PDF:", error);
                        } finally {
                            setRegeneratingPDF(false);
                        }
                    }, 100);
                }
            } catch (error) {
                console.error("Error al guardar preferencia de impresión de fondo:", error);
            }
        }
    };

    const generatePDFBlob = async () => {
        if (!receta || !paciente || !medico) return null;

        // Crear una copia temporal de la plantilla con la preferencia de impresión de fondo actual
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

    const handlePrintPDF = async () => {
        setDownloadingPDF(true);
        try {
            const blob = await generatePDFBlob();
            if (blob) {
                const url = URL.createObjectURL(blob);
                setPdfUrl(url);
                setIsPdfModalOpen(true);
            } else {
                alert("No se pudo generar el PDF");
            }
        } catch (error) {
            console.error('Error al generar PDF:', error);
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
            <Dialog open={isPdfModalOpen} onOpenChange={setIsPdfModalOpen}>
                <DialogContent className="max-w-4xl h-[90vh] flex flex-col gap-2 p-4">
                    <DialogHeader>
                        <DialogTitle>Vista Previa de Receta</DialogTitle>
                    </DialogHeader>
                    {regeneratingPDF ? (
                        <div className="flex-1 flex items-center justify-center">
                            <div className="text-center space-y-3">
                                <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto" />
                                <p className="text-sm text-slate-600">Regenerando PDF...</p>
                            </div>
                        </div>
                    ) : pdfUrl ? (
                        <>
                            <div className="flex justify-end space-x-2">
                                <Button variant="outline" onClick={() => setIsPdfModalOpen(false)}>
                                    Cerrar
                                </Button>
                            </div>
                            <iframe
                                src={pdfUrl}
                                className="w-full flex-1 rounded-md border"
                                title="Vista Previa PDF"
                            />
                        </>
                    ) : null}
                </DialogContent>
            </Dialog>

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
                <div className="flex gap-2 items-center">
                    {plantillaActiva && (
                        <div className="flex items-center space-x-3 mr-2 bg-white px-4 py-2.5 rounded-lg border shadow-sm hover:shadow-md transition-shadow">
                            <Label htmlFor="print-bg-toggle" className="font-medium text-slate-700 text-sm">Imprimir fondo</Label>
                            <Switch
                                id="print-bg-toggle"
                                checked={imprimirFondo}
                                onCheckedChange={(checked) => handleImprimirFondoChange(checked)}
                            />
                        </div>
                    )}
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
                    <div className="flex gap-6 items-center">
                        {/* Logo */}
                        <div className="flex-shrink-0 w-24 h-24 relative opacity-90">
                            {medico?.logo && (
                                <Image
                                    src={getMedicoLogo(medico.logo)}
                                    alt="Logotipo"
                                    fill
                                    className="object-contain"
                                />
                            )}
                        </div>

                        {/* Datos del Médico */}
                        <div className="flex-1 flex justify-between items-start">
                            <div>
                                <h3 className="text-xl font-bold text-blue-700">{medico?.nombre || "Nombre del Médico"}</h3>
                                <p className="text-sm text-slate-600 font-medium">{medico?.especialidad}</p>
                                <p className="text-sm text-slate-500">Ced: {medico?.cedula}</p>
                            </div>
                            <div className="text-right text-sm text-slate-500">
                                <p className="font-medium text-slate-700">{medico?.institucion_gral || medico?.direccion}</p>
                                <p>Tel: {medico?.telefono}</p>
                                {medico?.correo && <p>{medico.correo}</p>}
                            </div>
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
                            {receta.medicamentos.map((med, index) => {
                                // 1. Nombre Genérico + Conc + Forma + (Comercial)
                                const nombreGenerico = med.nombreGenerico || med.nombre;
                                const nombreComercial = (med.nombre && med.nombre !== nombreGenerico && !med.nombre.toLowerCase().includes(nombreGenerico.toLowerCase()))
                                    ? med.nombre
                                    : '';

                                const linea1 = `${nombreGenerico} ${med.concentracion || ''} ${med.formaFarmaceutica || ''} ${nombreComercial ? `(${nombreComercial})` : ''}`.replace(/\s+/g, ' ').trim();

                                // 2. Verbo + Dosis + Frecuencia + Duración
                                const verbo = obtenerVerbo(med.viaAdministracion);
                                const frecLimpia = (med.frecuencia || '').replace(/^cada\s+/i, '');
                                const durLimpia = (med.duracion || '').replace(/^por\s+/i, '');
                                const linea2 = `${verbo} ${med.dosis} ${frecLimpia ? `cada ${frecLimpia}` : ''} ${durLimpia ? `por ${durLimpia}` : ''}`;

                                // 3. Vía de administración
                                const viaLimpia = (med.viaAdministracion || 'Oral').replace(/^vía\s+/i, '');
                                const linea3 = `Vía ${viaLimpia}`;

                                // 4. Cantidad
                                const cantidad = calcularCantidad(med);

                                return (
                                    <div key={index} className="pl-4 border-l-2 border-blue-200">
                                        <div className="mb-1">
                                            <span className="font-bold text-lg text-slate-900">{linea1}</span>
                                        </div>
                                        <div className="text-slate-700 space-y-0.5">
                                            <p><span className="font-medium">{linea3} :</span> {linea2}</p>
                                            <p className="font-medium text-slate-900">Cantidad: {cantidad}</p>
                                        </div>
                                        {med.indicaciones && (
                                            <p className="text-sm text-slate-500 mt-1 italic">
                                                Nota: {med.indicaciones}
                                            </p>
                                        )}
                                    </div>
                                );
                            })}
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
