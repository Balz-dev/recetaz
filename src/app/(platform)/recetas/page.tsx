"use client"

import { useState, Suspense } from "react"
import { RecetaList } from "@/features/recetas/components/RecetaList"
import { Button } from "@/shared/components/ui/button"
import Link from "next/link"
import { Settings, PlusCircle } from "lucide-react"
import { CatalogHeader } from "@/shared/components/catalog/CatalogHeader"

export default function RecetasPage() {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <CatalogHeader
                    title="Recetas Médicas"
                    description="Historial de recetas emitidas y creación de nuevos documentos."
                />
                <div className="flex items-center gap-2">
                    <Link href="/recetas/plantillas">
                        <Button variant="outline" className="gap-2 rounded-xl">
                            <Settings className="h-4 w-4" />
                            <span className="hidden md:inline">Plantillas</span>
                        </Button>
                    </Link>
                </div>
            </div>

            <Suspense fallback={<div>Cargando listado...</div>}>
                <RecetaList />
            </Suspense>
        </div>
    );
}
