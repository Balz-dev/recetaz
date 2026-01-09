'use client';

/**
 * @fileoverview Galería de Plantillas Prediseñadas
 * 
 * Este componente se encarga de cargar y mostrar una cuadrícula de plantillas
 * prediseñadas desde el archivo manifest.json estático.
 * Permite previsualizar y seleccionar una plantilla para su uso o edición.
 */

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Plus, FileText, Loader2 } from "lucide-react";
import { useToast } from "@/shared/components/ui/use-toast";

interface PlantillaGalleryProps {
    /** Función que se ejecuta al seleccionar una plantilla de la galería */
    onSelectTemplate: (template: any) => void;
}

/**
 * Componente que muestra la galería de plantillas prediseñadas.
 * 
 * @param props - Propiedades del componente
 * @returns Componente JSX de la galería
 */
export function PlantillaGallery({ onSelectTemplate }: PlantillaGalleryProps) {
    const [galleryTemplates, setGalleryTemplates] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();

    /**
     * Carga la galería de plantillas desde el manifiesto estático JSON.
     * Esto permite el funcionamiento offline/estático sin depender de API Routes.
     */
    const loadGallery = async () => {
        if (galleryTemplates.length > 0) return;

        setIsLoading(true);
        try {
            const res = await fetch('/plantillas/manifest.json', { cache: 'no-store' });
            if (!res.ok) {
                throw new Error(`Error al obtener manifest.json: ${res.status} ${res.statusText}`);
            }

            const manifest = await res.json();

            if (!Array.isArray(manifest)) {
                throw new Error("El manifest.json no es un array válido");
            }

            const templatesWithContent = await Promise.all(manifest.map(async (item: any) => {
                try {
                    const filename = item.filename;
                    const contentRes = await fetch(`/plantillas/${filename}`, { cache: 'no-store' });

                    if (contentRes.ok) {
                        const content = await contentRes.json();
                        return {
                            ...item,
                            tamanoPapel: (item.tamanoPapel || content.tamanoPapel)?.replace('-', '_') || 'media_carta',
                            imagenFondo: item.imagenFondo || content.imagenFondo || '',
                            content
                        };
                    } else {
                        return {
                            ...item,
                            tamanoPapel: item.tamanoPapel?.replace('-', '_') || 'media_carta',
                            content: null
                        };
                    }
                } catch (e) {
                    return { ...item, content: null };
                }
            }));

            setGalleryTemplates(templatesWithContent);
        } catch (error) {
            console.error("Error crítico cargando la galería:", error);
            toast({
                title: "Error de Galería",
                description: error instanceof Error ? error.message : "No se pudo cargar la galería prediseñada",
                variant: "destructive"
            });
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadGallery();
    }, []);

    if (isLoading) {
        return (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3].map((i) => (
                    <Card key={i} className="animate-pulse h-64 bg-slate-50 border-slate-100" />
                ))}
            </div>
        );
    }

    if (galleryTemplates.length === 0) {
        return (
            <div className="text-center py-8 text-slate-500">
                No hay plantillas públicas disponibles por el momento.
            </div>
        );
    }

    return (
        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 pb-8">
            {galleryTemplates.map((template, idx) => (
                <Card key={idx} className="relative overflow-hidden transition-all hover:shadow-2xl border-slate-200 group hover:-translate-y-1.5 duration-300 bg-white shadow-md flex flex-col h-full">
                    <div className="absolute top-0 right-0 bg-blue-600/90 backdrop-blur-sm text-white text-[10px] font-bold px-3 py-1 rounded-bl-lg shadow-sm z-20 uppercase tracking-tighter">
                        Diseño Pro
                    </div>
                    <CardHeader className="p-4 pb-2">
                        <CardTitle className="text-lg font-extrabold text-slate-900 group-hover:text-blue-600 transition-colors duration-300 truncate">
                            {template.nombre}
                        </CardTitle>
                        <CardDescription className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">
                            {template.tamanoPapel === 'carta' ? 'Papel Carta (8.5" x 11")' : 'Media Carta (8.5" x 5.5")'}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="p-4 pt-0 flex-grow flex flex-col">
                        <div className={`border border-slate-100 rounded-lg flex items-center justify-center mb-4 relative overflow-hidden mx-auto bg-slate-50/30
                            ${template.tamanoPapel === 'carta' ? 'aspect-[8.5/11]' : 'aspect-[8.5/5.5]'} w-full shadow-inner group-hover:bg-white transition-all duration-500`}
                        >
                            {template.imagenFondo || template.content?.imagenFondo ? (
                                <img
                                    src={template.imagenFondo || template.content?.imagenFondo}
                                    alt="Previsualización"
                                    className="w-full h-full object-contain opacity-95 transition-all group-hover:scale-105 duration-700"
                                />
                            ) : (
                                <div className="flex flex-col items-center gap-3 text-slate-200">
                                    <FileText className="h-10 w-10 opacity-10" />
                                </div>
                            )}
                            {/* Overlay de campos (puntos/bloques) */}
                            <div className="absolute inset-0 p-2 overflow-hidden pointer-events-none opacity-30 group-hover:opacity-40 transition-opacity">
                                {template.content?.campos?.filter((c: any) => c.visible !== false).slice(0, 15).map((c: any) => (
                                    <div
                                        key={c.id}
                                        className="absolute bg-blue-500/20 border-[0.5px] border-blue-400/30 rounded-[1px]"
                                        style={{
                                            left: `${c.x}%`,
                                            top: `${c.y}%`,
                                            width: `${c.ancho}%`,
                                            height: `${c.alto || 4}%`
                                        }}
                                    />
                                ))}
                            </div>
                        </div>

                        <Button
                            className="w-full mt-auto h-10 text-xs font-bold uppercase tracking-wider bg-slate-900 hover:bg-blue-600 text-white shadow-md hover:shadow-blue-500/25 active:scale-[0.97] transition-all duration-300"
                            onClick={() => onSelectTemplate(template)}
                        >
                            <Plus className="mr-2 h-3.5 w-3.5" />
                            Seleccionar este diseño
                        </Button>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
