"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/shared/components/ui/card";
import { MedicoConfigForm } from "@/features/config-medico/components/MedicoConfigForm";
import { PlantillaList } from "@/features/recetas/components/PlantillaList";
import { Button } from "@/shared/components/ui/button";
import { Save, Loader2 } from "lucide-react";
import { useState } from "react";

interface ConfiguracionContentProps {
    onConfigSaved?: () => void;
}

export function ConfiguracionContent({ onConfigSaved }: ConfiguracionContentProps) {
    const [isSaving, setIsSaving] = useState(false);

    return (
        <div className="space-y-8 pb-12">
            <div className="flex flex-col lg:flex-row gap-6">
                {/* Columna Izquierda: Datos del Médico */}
                <div className="w-full lg:w-1/3">
                    <Card>
                        <CardHeader>
                            <CardTitle>Datos del Médico</CardTitle>
                            <CardDescription>
                                Configura tus datos personales y profesionales. Estos aparecerán en todas las recetas que generes.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <MedicoConfigForm
                                onSuccess={onConfigSaved}
                                hideSubmitButton
                                onLoadingChange={setIsSaving}
                            />
                        </CardContent>
                    </Card>
                </div>

                {/* Columna Derecha: Plantillas */}
                <div className="w-full lg:w-2/3">
                    <Card>
                        <CardHeader>
                            <CardTitle>Plantillas de Recetas</CardTitle>
                            <CardDescription>
                                Gestiona el diseño de impresión de tus recetas. Puedes elegir entre el diseño predeterminado del sistema o crear el tuyo propio para papel membretado.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <PlantillaList defaultTab="gallery" />
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Botón de Guardar al final de la página */}
            <div className="flex justify-center md:justify-end pt-4 border-t">
                <Button
                    type="submit"
                    form="medico-config-form"
                    disabled={isSaving}
                    size="lg"
                    className="min-w-[240px] bg-blue-600 hover:bg-blue-700 rounded-xl shadow-lg shadow-blue-500/20 transition-all active:scale-95 text-white"
                >
                    {isSaving ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Guardando cambios...
                        </>
                    ) : (
                        <>
                            <Save className="mr-2 h-4 w-4" />
                            Guardar Configuración
                        </>
                    )}
                </Button>
            </div>
        </div>
    );
}
