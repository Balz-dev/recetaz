"use client"

import { useState, useEffect } from "react"
import { Receta } from "@/types"
import { recetaService } from "@/lib/db/recetas"
import { pacienteService } from "@/lib/db/pacientes"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Search, FileText, Calendar, User, PlusCircle } from "lucide-react"
import Link from "next/link"
import { format } from "date-fns"
import { es } from "date-fns/locale"

export function RecetaList() {
    const [recetas, setRecetas] = useState<Receta[]>([])
    const [pacientes, setPacientes] = useState<Record<string, string>>({})
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState("")

    useEffect(() => {
        loadData()
    }, [])

    useEffect(() => {
        const search = async () => {
            if (searchTerm.trim() === "") {
                await loadData()
            } else {
                const results = await recetaService.search(searchTerm)
                setRecetas(results)
            }
        }
        const timeoutId = setTimeout(() => {
            search()
        }, 300)
        return () => clearTimeout(timeoutId)
    }, [searchTerm])

    const loadData = async () => {
        setLoading(true)
        try {
            const [recetasData, pacientesData] = await Promise.all([
                recetaService.getAll(),
                pacienteService.getAll()
            ])

            // Crear mapa de id -> nombre paciente
            const pacientesMap: Record<string, string> = {}
            pacientesData.forEach(p => {
                pacientesMap[p.id] = p.nombre
            })

            setRecetas(recetasData)
            setPacientes(pacientesMap)
        } catch (error) {
            console.error("Error cargando recetas:", error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
                <div className="relative w-full sm:w-96">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Buscar por diagnóstico o paciente..."
                        className="pl-8"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <Link href="/recetas/nueva" className="w-full sm:w-auto">
                    <Button className="w-full gap-2">
                        <PlusCircle size={18} />
                        Nueva Receta
                    </Button>
                </Link>
            </div>

            {loading ? (
                <div className="text-center py-10">Cargando recetas...</div>
            ) : recetas.length === 0 ? (
                <Card className="text-center py-10">
                    <CardContent className="flex flex-col items-center gap-4">
                        <div className="bg-slate-100 p-4 rounded-full dark:bg-slate-800">
                            <FileText size={48} className="text-slate-400" />
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-lg font-semibold">No hay recetas emitidas</h3>
                            <p className="text-muted-foreground max-w-sm mx-auto">
                                Crea tu primera receta médica para un paciente registrado.
                            </p>
                        </div>
                        <Link href="/recetas/nueva">
                            <Button variant="outline">Crear Receta</Button>
                        </Link>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {recetas.map((receta) => (
                        <Link key={receta.id} href={`/recetas/${receta.id}`}>
                            <Card className="hover:border-blue-400 transition-colors cursor-pointer h-full">
                                <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                                    <CardTitle className="text-base font-bold">
                                        Receta #{receta.numeroReceta}
                                    </CardTitle>
                                    <FileText className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-sm text-muted-foreground space-y-2">
                                        <div className="flex items-center gap-2 font-medium text-foreground">
                                            <User className="h-3 w-3" />
                                            {pacientes[receta.pacienteId] || "Paciente Desconocido"}
                                        </div>
                                        <div className="line-clamp-2 text-xs">
                                            <span className="font-semibold">Dx:</span> {receta.diagnostico}
                                        </div>
                                        <div className="flex items-center gap-2 text-xs pt-2 border-t mt-2">
                                            <Calendar className="h-3 w-3" />
                                            {receta.fechaEmision
                                                ? format(new Date(receta.fechaEmision), "d MMM yyyy, HH:mm", { locale: es })
                                                : "Fecha no disponible"
                                            }
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    )
}
