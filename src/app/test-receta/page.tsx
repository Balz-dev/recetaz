"use client"

import { Button } from "@/components/ui/button"
import { recetaService } from "@/lib/db/recetas"
import { pacienteService } from "@/lib/db/pacientes"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function TestRecetaPage() {
    const router = useRouter()
    const [status, setStatus] = useState("Esperando...")

    const createReceta = async () => {
        setStatus("Creando datos de prueba...")
        try {
            // 1. Crear paciente
            const pacienteId = await pacienteService.create({
                nombre: "Paciente Test",
                edad: 45,
                telefono: "555-0000",
                alergias: "Ninguna",
                antecedentes: "Ninguno"
            })

            // 2. Obtener datos del paciente
            const paciente = await pacienteService.getById(pacienteId)
            if (!paciente) throw new Error("Paciente no encontrado")

            // 3. Crear receta
            const recetaId = await recetaService.create({
                pacienteId,
                diagnostico: "Prueba Automática de Receta",
                medicamentos: [
                    {
                        nombre: "Medicamento A",
                        dosis: "500mg",
                        frecuencia: "Cada 8h",
                        duracion: "5 días",
                        indicaciones: "Tomar con agua"
                    },
                    {
                        nombre: "Medicamento B",
                        dosis: "10mg",
                        frecuencia: "Una vez al día",
                        duracion: "1 mes",
                        indicaciones: "En ayunas"
                    }
                ],
                instrucciones: "Reposo relativo por 3 días.",
                fechaEmision: new Date()
            }, {
                nombre: paciente.nombre,
                edad: paciente.edad || 0
            })

            setStatus(`Receta creada: ${recetaId}. Redirigiendo...`)
            setTimeout(() => router.push(`/recetas/${recetaId}`), 500)
        } catch (error: any) {
            console.error(error)
            const errorMsg = error instanceof Error ? error.message : JSON.stringify(error)
            setStatus("Error: " + errorMsg)
        }
    }

    return (
        <div className="p-10 text-center space-y-4">
            <h1 className="text-2xl font-bold">Generador de Receta de Prueba</h1>
            <p>Estado: {status}</p>
            <Button onClick={createReceta}>Generar Receta y Ver Detalle</Button>
        </div>
    )
}
