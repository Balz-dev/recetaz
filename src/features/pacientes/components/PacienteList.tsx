"use client"

import { useState, useEffect } from "react"
import { Paciente } from "@/types"
import { pacienteService } from "@/features/pacientes/services/paciente.service"
import { Input } from "@/shared/components/ui/input"
import { Button } from "@/shared/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Search, UserPlus, User, Calendar, Phone } from "lucide-react"
import Link from "next/link"
import { format } from "date-fns"
import { es } from "date-fns/locale"

export function PacienteList() {
    const [pacientes, setPacientes] = useState<Paciente[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState("")

    // Cargar pacientes
    useEffect(() => {
        loadPacientes()
    }, [])

    // Filtrar pacientes cuando cambia el término de búsqueda
    useEffect(() => {
        const search = async () => {
            if (searchTerm.trim() === "") {
                await loadPacientes()
            } else {
                const results = await pacienteService.search(searchTerm)
                setPacientes(results)
            }
        }
        // Debounce simple
        const timeoutId = setTimeout(() => {
            search()
        }, 300)
        return () => clearTimeout(timeoutId)
    }, [searchTerm])

    const loadPacientes = async () => {
        setLoading(true)
        try {
            const data = await pacienteService.getAll()
            setPacientes(data)
        } catch (error) {
            console.error("Error cargando pacientes:", error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="space-y-6">
            {/* Barra de búsqueda y botón de nuevo */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
                <div className="relative w-full sm:w-96">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Buscar por nombre o cédula..."
                        className="pl-8"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <Link href="/pacientes/nuevo" className="w-full sm:w-auto">
                    <Button className="w-full gap-2">
                        <UserPlus size={18} />
                        Nuevo Paciente
                    </Button>
                </Link>
            </div>

            {/* Lista de Pacientes */}
            {loading ? (
                <div className="text-center py-10">Cargando pacientes...</div>
            ) : pacientes.length === 0 ? (
                <Card className="text-center py-10">
                    <CardContent className="flex flex-col items-center gap-4">
                        <div className="bg-slate-100 p-4 rounded-full dark:bg-slate-800">
                            <User size={48} className="text-slate-400" />
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-lg font-semibold">No hay pacientes registrados</h3>
                            <p className="text-muted-foreground max-w-sm mx-auto">
                                Comienza agregando tu primer paciente para gestionar sus recetas e historial médico.
                            </p>
                        </div>
                        <Link href="/pacientes/nuevo">
                            <Button variant="outline">Registrar Paciente</Button>
                        </Link>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {pacientes.map((paciente) => (
                        <Link key={paciente.id} href={`/pacientes/${paciente.id}`}>
                            <Card className="hover:border-blue-400 transition-colors cursor-pointer h-full">
                                <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                                    <CardTitle className="text-base font-bold line-clamp-1">
                                        {paciente.nombre}
                                    </CardTitle>
                                    <User className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-sm text-muted-foreground space-y-1">
                                        <div className="flex items-center gap-2">
                                            <span className="font-medium text-foreground">Edad:</span>
                                            {paciente.edad} años
                                        </div>
                                        {paciente.telefono && (
                                            <div className="flex items-center gap-2">
                                                <Phone className="h-3 w-3" />
                                                {paciente.telefono}
                                            </div>
                                        )}
                                        <div className="flex items-center gap-2 text-xs pt-2">
                                            <Calendar className="h-3 w-3" />
                                            Registrado: {format(paciente.createdAt, "d MMM yyyy", { locale: es })}
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
