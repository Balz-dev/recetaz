"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, ExternalLink } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Receta } from "@/types";

interface RecetaCardProps {
    receta: Receta;
    patientName?: string;
}

export function RecetaCard({ receta, patientName }: RecetaCardProps) {
    return (
        <Card className="overflow-hidden h-full hover:shadow-md transition-shadow">
            <CardContent className="p-4 flex flex-col h-full gap-4">
                <div className="space-y-2 flex-1">
                    <div className="flex items-center justify-between gap-2">
                        <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors border-transparent bg-secondary text-secondary-foreground font-mono">
                            #{receta.numeroReceta}
                        </span>
                        <span className="text-[10px] text-muted-foreground flex items-center gap-1 shrink-0">
                            <Calendar className="h-3 w-3" />
                            {receta.fechaEmision
                                ? format(new Date(receta.fechaEmision), "dd/MM/yy", { locale: es })
                                : "N/D"}
                        </span>
                    </div>

                    {patientName && (
                        <div>
                            <p className="text-sm font-medium leading-tight truncate" title={patientName}>
                                {patientName}
                            </p>
                        </div>
                    )}

                    <div>
                        <h4 className="font-semibold text-xs  text-muted-foreground mb-1">
                            Diagnóstico
                        </h4>
                        <p
                            className="text-sm font-medium leading-tight line-clamp-2"
                            title={receta.diagnostico}
                        >
                            {receta.diagnostico}
                        </p>
                    </div>

                    <div>
                        <h4 className="font-semibold text-xs  text-muted-foreground mb-1">
                            Medicamentos
                        </h4>
                        <p className="text-xs text-muted-foreground line-clamp-3">
                            {receta.medicamentos.map((m) => m.nombre).join(", ")}
                        </p>
                    </div>
                </div>

                <div className="w-full mt-auto pt-2 border-t">
                    <Link href={`/recetas/${receta.id}`} target="_blank" className="w-full">
                        <Button variant="ghost" size="sm" className="w-full h-8 text-xs gap-2">
                            <ExternalLink className="h-3 w-3" />
                            Ver Receta
                        </Button>
                    </Link>
                </div>
            </CardContent>
        </Card>
    );
}
