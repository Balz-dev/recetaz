"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useFieldArray, useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/shared/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/shared/components/ui/form"
import { Input } from "@/shared/components/ui/input"
import { Textarea } from "@/shared/components/ui/textarea"
import { recetaService } from "@/features/recetas/services/receta.service"
import { pacienteService } from "@/features/pacientes/services/paciente.service"
import { medicamentoService } from "@/features/medicamentos/services/medicamento.service"
import { RecetaFormData, Paciente, MedicamentoCatalogo } from "@/types"
import { useState, useEffect } from "react"
import { useToast } from "@/shared/components/ui/use-toast"
import { Loader2, Save, ArrowLeft, Plus, Trash2, Check } from "lucide-react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent } from "@/shared/components/ui/card"

const medicamentoSchema = z.object({
    nombre: z.string().min(1, "El nombre es requerido"),
    presentacion: z.string().optional(),
    dosis: z.string().min(1, "La dosis es requerida"),
    frecuencia: z.string().min(1, "La frecuencia es requerida"),
    duracion: z.string().min(1, "La duración es requerida"),
    indicaciones: z.string().optional(),
})

const recetaFormSchema = z.object({
    pacienteId: z.string().optional(),
    pacienteNombre: z.string().min(1, "El nombre del paciente es requerido"),
    pacienteEdad: z.number().optional(),
    pacienteTelefono: z.string().optional(),
    pacienteDireccion: z.string().optional(),
    //pacienteCedula: z.string().optional(),
    diagnostico: z.string().min(1, "El diagnóstico es requerido"),
    medicamentos: z.array(medicamentoSchema).min(1, "Debe agregar al menos un medicamento"),
    instrucciones: z.string().optional(),
})

interface RecetaFormProps {
    preSelectedPacienteId?: string;
    onCancel?: () => void;
}

/**
 * Formulario maestro para la creación de recetas médicas.
 * @description Permite buscar pacientes existentes o crear uno nuevo con registro rápido.
 * Búsqueda en tiempo real mientras escribe.
 * @param props.preSelectedPacienteId ID opcional para pre-cargar un paciente
 * @param props.onCancel Callback para cancelar la operación
 */
export function RecetaForm({ preSelectedPacienteId, onCancel }: RecetaFormProps) {
    const [isLoading, setIsLoading] = useState(false)
    const [pacientes, setPacientes] = useState<Paciente[]>([])
    const [filteredPacientes, setFilteredPacientes] = useState<Paciente[]>([])
    
    // Estados para autocompletado de medicamentos
    const [medicamentoSuggestions, setMedicamentoSuggestions] = useState<MedicamentoCatalogo[]>([])
    const [activeMedicamentoIndex, setActiveMedicamentoIndex] = useState<number | null>(null)
    const [searchQuery, setSearchQuery] = useState("")
    const [showSuggestions, setShowSuggestions] = useState(false)
    const [selectedPaciente, setSelectedPaciente] = useState<Paciente | null>(null)
    const [showFullRegistration, setShowFullRegistration] = useState(false)
    const { toast } = useToast()
    const router = useRouter()

    const form = useForm<RecetaFormData>({
        resolver: zodResolver(recetaFormSchema),
        defaultValues: {
            pacienteId: preSelectedPacienteId || undefined,
            pacienteNombre: "",
            pacienteEdad: undefined,
            pacienteTelefono: "",
            pacienteDireccion: "",
           // pacienteCedula: "",
            diagnostico: "",
            medicamentos: [{ nombre: "", presentacion: "", dosis: "", frecuencia: "", duracion: "", indicaciones: "" }],
            instrucciones: "",
        },
    })

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "medicamentos",
    })

    const loadPacientes = async () => {
        const data = await pacienteService.getAll()
        setPacientes(data)
    }

    useEffect(() => {
        loadPacientes()
    }, [])

    // Cargar paciente preseleccionado
    useEffect(() => {
        if (preSelectedPacienteId && pacientes.length > 0) {
            const paciente = pacientes.find(p => p.id === preSelectedPacienteId)
            if (paciente) {
                setSelectedPaciente(paciente)
                setSearchQuery(paciente.nombre)
                form.setValue("pacienteNombre", paciente.nombre)
                form.setValue("pacienteEdad", paciente.edad)
            }
        }
    }, [preSelectedPacienteId, pacientes, form])

    const handleSearchChange = (value: string) => {
        setSearchQuery(value)
        form.setValue("pacienteNombre", value)
        
        if (value.trim().length === 0) {
            setFilteredPacientes([])
            setShowSuggestions(false)
            setSelectedPaciente(null)
            return
        }
        
        // Buscar pacientes que coincidan
        const matches = pacientes.filter(p => 
            p.nombre.toLowerCase().includes(value.toLowerCase())
        )
        
        setFilteredPacientes(matches)
        setShowSuggestions(matches.length > 0)
        
        // Si hay coincidencia exacta, seleccionar automáticamente
        const exactMatch = matches.find(p => 
            p.nombre.toLowerCase() === value.toLowerCase()
        )
        
        if (exactMatch) {
            setSelectedPaciente(exactMatch)
            form.setValue("pacienteId", exactMatch.id)
            form.setValue("pacienteEdad", exactMatch.edad)
        } else {
            setSelectedPaciente(null)
            form.setValue("pacienteId", undefined)
        }
    }

    const handleSelectPaciente = (paciente: Paciente) => {
        setSelectedPaciente(paciente)
        setSearchQuery(paciente.nombre)
        form.setValue("pacienteId", paciente.id)
        form.setValue("pacienteNombre", paciente.nombre)
        form.setValue("pacienteEdad", paciente.edad)
        setShowSuggestions(false)
        setShowFullRegistration(false)
        setShowFullRegistration(false)
    }

    const handleMedicamentoSearch = async (query: string, index: number) => {
        form.setValue(`medicamentos.${index}.nombre`, query)
        
        if (query.trim().length < 2) {
            setMedicamentoSuggestions([])
            setActiveMedicamentoIndex(null)
            return
        }

        const results = await medicamentoService.search(query)
        setMedicamentoSuggestions(results)
        setActiveMedicamentoIndex(index)
    }

    const selectMedicamentoSuggestion = (medicamento: MedicamentoCatalogo, index: number) => {
        form.setValue(`medicamentos.${index}.nombre`, medicamento.nombre)
        if (medicamento.presentacion) {
            form.setValue(`medicamentos.${index}.presentacion`, medicamento.presentacion)
        }
        setMedicamentoSuggestions([])
        setActiveMedicamentoIndex(null)
    }

    async function onSubmit(values: RecetaFormData) {
        setIsLoading(true)
        try {
            // 1. Guardar nuevos medicamentos en el catálogo
            for (const med of values.medicamentos) {
                await medicamentoService.findOrCreateByName(med.nombre)
            }

            let pacienteId = values.pacienteId
            let pacienteData = {
                nombre: values.pacienteNombre,
                edad: values.pacienteEdad || 0
            }
            
            // Si no hay paciente seleccionado, crear uno nuevo
            if (!pacienteId) {
                const newPacienteData = {
                    nombre: values.pacienteNombre,
                    edad: values.pacienteEdad,
                    telefono: values.pacienteTelefono,
                    direccion: values.pacienteDireccion
                  
                }
                
                pacienteId = await pacienteService.create(newPacienteData)
                pacienteData = {
                    nombre: newPacienteData.nombre,
                    edad: newPacienteData.edad || 0
                }
            }
            
            // Crear receta con datos del paciente
            const recetaFormDataForService = {
                pacienteId: pacienteId!,
                pacienteNombre: pacienteData.nombre,
                pacienteEdad: pacienteData.edad,
                diagnostico: values.diagnostico,
                medicamentos: values.medicamentos,
                instrucciones: values.instrucciones
            }
            
            const recetaId = await recetaService.create(
                recetaFormDataForService,
                pacienteData
            )

            toast({
                title: "Receta creada",
                description: `Receta guardada correctamente.`,
            })

            // Redirigir a la receta creada
            router.push(`/recetas/${recetaId}`)
        } catch (error) {
            console.error(error)
            toast({
                title: "Error",
                description: error instanceof Error ? error.message : "Hubo un problema al guardar la receta.",
                variant: "destructive",
            })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <div className="flex items-center gap-4 mb-6">
                    <Link href="/recetas">
                        <Button variant="ghost" size="icon" type="button">
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                    </Link>
                    <h2 className="text-xl font-semibold">Nueva Receta Médica</h2>
                </div>

                <div className="grid gap-6">
                    {/* Selección/Búsqueda de Paciente y Diagnóstico */}
                    <Card>
                        <CardContent className="pt-6 grid gap-6 md:grid-cols-2">
                            {/* Búsqueda de Paciente */}
                            <div className="space-y-4">
                                <FormField
                                    control={form.control}
                                    name="pacienteNombre"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Paciente *</FormLabel>
                                            <div className="relative">
                                                <FormControl>
                                                    <Input
                                                        placeholder="Escriba el nombre del paciente..."
                                                        value={searchQuery}
                                                        onChange={(e) => handleSearchChange(e.target.value)}
                                                        onFocus={() => {
                                                            if (filteredPacientes.length > 0) {
                                                                setShowSuggestions(true)
                                                            }
                                                        }}
                                                        className={selectedPaciente ? "border-green-500" : ""}
                                                        disabled={!!preSelectedPacienteId}
                                                    />
                                                </FormControl>
                                                
                                                {/* Lista de Sugerencias */}
                                                {showSuggestions && filteredPacientes.length > 0 && !preSelectedPacienteId && (
                                                    <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-auto">
                                                        {filteredPacientes.map((paciente) => (
                                                            <button
                                                                key={paciente.id}
                                                                type="button"
                                                                className="w-full px-4 py-2 text-left hover:bg-slate-100 flex justify-between items-center"
                                                                onClick={() => handleSelectPaciente(paciente)}
                                                            >
                                                                <span>{paciente.nombre}</span>
                                                                <span className="text-sm text-slate-500">
                                                                    {paciente.edad} años
                                                                </span>
                                                            </button>
                                                        ))}
                                                    </div>
                                                )}
                                                
                                                {/* Indicador de Paciente Seleccionado */}
                                                {selectedPaciente && (
                                                    <div className="absolute right-2 top-2 text-green-600">
                                                        <Check className="h-5 w-5" />
                                                    </div>
                                                )}
                                            </div>
                                            <FormMessage />
                                            
                                            {/* Información del Paciente Seleccionado */}
                                            {selectedPaciente && (
                                                <div className="text-sm text-slate-600 bg-green-50 p-2 rounded">
                                                    ✓ Paciente existente: {selectedPaciente.nombre}, {selectedPaciente.edad} años
                                                </div>
                                            )}
                                            
                                            {/* Mensaje si no existe */}
                                            {searchQuery && !selectedPaciente && searchQuery.length > 2 && !preSelectedPacienteId && (
                                                <div className="text-sm text-amber-600 bg-amber-50 p-2 rounded">
                                                    ⚠ Paciente no encontrado. {showFullRegistration ? "Complete los datos" : "Se creará con el nombre ingresado"}
                                                </div>
                                            )}
                                        </FormItem>
                                    )}
                                                />
                                
                                {/* Checkbox para Registro Completo */}
                                {!selectedPaciente && searchQuery && !preSelectedPacienteId && (
                                    <div className="flex items-center space-x-2">
                                        <input
                                            type="checkbox"
                                            id="fullRegistration"
                                            checked={showFullRegistration}
                                            onChange={(e) => setShowFullRegistration(e.target.checked)}
                                            className="rounded border-gray-300 h-4 w-4"
                                        />
                                        <label htmlFor="fullRegistration" className="text-sm font-medium cursor-pointer">
                                            Registrar datos completos del paciente
                                        </label>
                                    </div>
                                )}
                            </div>

                            <FormField
                                control={form.control}
                                name="diagnostico"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Diagnóstico *</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Diagnóstico principal" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </CardContent>
                    </Card>

                    {/* Formulario Inline de Paciente (Condicional) */}
                    {showFullRegistration && !selectedPaciente && (
                        <Card>
                            <CardContent className="pt-6">
                                <h3 className="text-sm font-semibold mb-4 text-slate-700">Datos del Paciente</h3>
                                <div className="grid gap-4 md:grid-cols-2">
                                    <FormField
                                        control={form.control}
                                        name="pacienteEdad"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Edad</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="number"
                                                        placeholder="Edad del paciente"
                                                        value={field.value || ""}
                                                        onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    
                                    <FormField
                                        control={form.control}
                                        name="pacienteTelefono"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Teléfono</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Teléfono" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    
                                    <FormField
                                        control={form.control}
                                        name="pacienteDireccion"
                                        render={({ field }) => (
                                            <FormItem className="md:col-span-2">
                                                <FormLabel>Dirección</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Dirección" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    
                                    
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Medicamentos */}
                    <div className="space-y-4">
                        {fields.map((field, index) => (
                            <Card key={field.id} className="relative">
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="absolute right-2 top-2 text-muted-foreground hover:text-destructive"
                                    onClick={() => remove(index)}
                                    disabled={fields.length === 1}
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                                <CardContent className="pt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                                    <FormField
                                        control={form.control}
                                        name={`medicamentos.${index}.nombre`}
                                        render={({ field }) => (
                                            <FormItem className="lg:col-span-2 relative">
                                                <FormLabel>Medicamento {index + 1} *</FormLabel>
                                                <FormControl>
                                                    <Input 
                                                        placeholder="Nombre comercial / Genérico" 
                                                        {...field} 
                                                        onChange={(e) => handleMedicamentoSearch(e.target.value, index)}
                                                        onBlur={() => {
                                                            // Pequeño delay para permitir click en sugerencia
                                                            setTimeout(() => {
                                                                if (activeMedicamentoIndex === index) {
                                                                    setMedicamentoSuggestions([])
                                                                    setActiveMedicamentoIndex(null)
                                                                }
                                                            }, 200)
                                                        }}
                                                    />
                                                </FormControl>
                                                {/* Sugerencias de Medicamentos */}
                                                {activeMedicamentoIndex === index && medicamentoSuggestions.length > 0 && (
                                                    <div className="absolute z-20 w-full mt-1 bg-white border rounded-md shadow-lg max-h-40 overflow-auto">
                                                        {medicamentoSuggestions.map((med) => (
                                                            <button
                                                                key={med.id}
                                                                type="button"
                                                                className="w-full px-4 py-2 text-left hover:bg-slate-100 flex flex-col"
                                                                onClick={() => selectMedicamentoSuggestion(med, index)}
                                                            >
                                                                <span className="font-medium">{med.nombre}</span>
                                                                {med.presentacion && (
                                                                    <span className="text-xs text-slate-500">{med.presentacion}</span>
                                                                )}
                                                            </button>
                                                        ))}
                                                    </div>
                                                )}
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name={`medicamentos.${index}.presentacion`}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Presentación</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Ej: Tabs 500mg" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name={`medicamentos.${index}.dosis`}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Dosis *</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Ej: 500mg" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name={`medicamentos.${index}.frecuencia`}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Frecuencia *</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Ej: Cada 8 horas" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name={`medicamentos.${index}.duracion`}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Duración *</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Ej: 7 días" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name={`medicamentos.${index}.indicaciones`}
                                        render={({ field }) => (
                                            <FormItem className="lg:col-span-3">
                                                <FormLabel>Instrucciones Específicas</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Ej: Tomar con alimentos" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </CardContent>
                            </Card>
                        ))}
                        <div className="flex justify-between items-center">
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => append({ nombre: "", presentacion: "", dosis: "", frecuencia: "", duracion: "", indicaciones: "" })}
                            >
                                <Plus className="mr-2 h-4 w-4" />
                                Agregar Medicamento
                            </Button>
                        </div>
                    </div>

                    {/* Instrucciones Generales */}
                    <Card>
                        <CardContent className="pt-6 space-y-4">
                            <FormField
                                control={form.control}
                                name="instrucciones"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Instrucciones Generales / Recomendaciones</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Dieta, reposo, cuidados generales..."
                                                className="resize-none"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </CardContent>
                    </Card>
                </div>

                <div className="flex justify-end gap-4">
                    {onCancel ? (
                        <Button variant="outline" type="button" onClick={onCancel}>Cancelar</Button>
                    ) : (
                        <Link href="/recetas">
                            <Button variant="outline" type="button">Cancelar</Button>
                        </Link>
                    )}
                    <Button type="submit" disabled={isLoading} className="bg-blue-600 hover:bg-blue-700">
                        {isLoading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Guardando...
                            </>
                        ) : (
                            <>
                                <Save className="mr-2 h-4 w-4" />
                                Guardar Receta
                            </>
                        )}
                    </Button>
                </div>
            </form>
        </Form>
    )
}
