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
import { Loader2, Save, ArrowLeft, Plus, Trash2, Check, UserPlus } from "lucide-react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent } from "@/shared/components/ui/card"
import { PatientRegistrationModal } from "@/features/pacientes/components/PatientRegistrationModal"

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/shared/components/ui/select"
import { medicoService } from "@/features/config-medico/services/medico.service"
import { SPECIALTIES_CONFIG } from "@/shared/config/specialties"

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
    pacienteDireccion: z.string().optional(),
    pacientePeso: z.string().optional(),
    pacienteTalla: z.string().optional(),
    //pacienteCedula: z.string().optional(),
    diagnostico: z.string().min(1, "El diagnóstico es requerido"),
    medicamentos: z.array(medicamentoSchema).min(1, "Debe agregar al menos un medicamento"),
    instrucciones: z.string().optional(),
    datosEspecificos: z.record(z.string(), z.any()).optional(),
})

interface RecetaFormProps {
    preSelectedPacienteId?: string;
    onCancel?: () => void;
    onSuccess?: (recetaId: string) => void;
}

/**
 * Formulario maestro para la creación de recetas médicas.
 * @description Permite buscar pacientes existentes o crear uno nuevo con registro rápido.
 * Búsqueda en tiempo real mientras escribe.
 * @param props.preSelectedPacienteId ID opcional para pre-cargar un paciente
 * @param props.onCancel Callback para cancelar la operación
 * @param props.onSuccess Callback ejecutado al crear la receta con éxito (evita redirección automática)
 */
export function RecetaForm({ preSelectedPacienteId, onCancel, onSuccess }: RecetaFormProps) {
    const [isLoading, setIsLoading] = useState(false)
    const [pacientes, setPacientes] = useState<Paciente[]>([])
    const [filteredPacientes, setFilteredPacientes] = useState<Paciente[]>([])
    const [specialtyConfig, setSpecialtyConfig] = useState<any>(null) // SpecialtyConfig type

    // Estados para autocompletado de medicamentos
    const [medicamentoSuggestions, setMedicamentoSuggestions] = useState<MedicamentoCatalogo[]>([])
    const [activeMedicamentoIndex, setActiveMedicamentoIndex] = useState<number | null>(null)
    const [searchQuery, setSearchQuery] = useState("")
    const [showSuggestions, setShowSuggestions] = useState(false)
    const [selectedPaciente, setSelectedPaciente] = useState<Paciente | null>(null)

    const [isPatientModalOpen, setIsPatientModalOpen] = useState(false)
    const { toast } = useToast()
    const router = useRouter()

    const form = useForm<RecetaFormData>({
        resolver: zodResolver(recetaFormSchema),
        defaultValues: {
            pacienteId: preSelectedPacienteId || undefined,
            pacienteNombre: "",
            pacienteEdad: undefined,
            pacienteDireccion: "",
            pacientePeso: "",
            pacienteTalla: "",
            // pacienteCedula: "",
            diagnostico: "",
            medicamentos: [{ nombre: "", presentacion: "", dosis: "", frecuencia: "", duracion: "", indicaciones: "" }],
            instrucciones: "",
            datosEspecificos: {},
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
        // Cargar configuración de especialidad
        const loadConfig = async () => {
            const config = await medicoService.get();
            if (config) {
                const key = config.especialidadKey || 'general';
                setSpecialtyConfig(SPECIALTIES_CONFIG[key] || SPECIALTIES_CONFIG['general']);
            }
        };
        loadConfig();
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
            form.setValue("pacientePeso", exactMatch.peso)
            form.setValue("pacienteTalla", exactMatch.talla)
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
        form.setValue("pacientePeso", paciente.peso)
        form.setValue("pacienteTalla", paciente.talla)
        setShowSuggestions(false)
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

    const handlePatientCreated = async (pacienteId: string) => {
        setIsPatientModalOpen(false)
        await loadPacientes()
        const newPaciente = await pacienteService.getById(pacienteId)
        if (newPaciente) {
            handleSelectPaciente(newPaciente)
            toast({
                title: "Paciente asignado",
                description: "El paciente recién creado ha sido seleccionado.",
            })
        }
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
                    direccion: values.pacienteDireccion

                }

                pacienteId = await pacienteService.create(newPacienteData)
                pacienteData = {
                    nombre: newPacienteData.nombre,
                    edad: newPacienteData.edad || 0
                }

                // Recargar lista de pacientes y seleccionar el recién creado
                await loadPacientes()
                const newPaciente = await pacienteService.getById(pacienteId)
                if (newPaciente) {
                    setSelectedPaciente(newPaciente)
                    setSearchQuery(newPaciente.nombre)
                }
            }

            // Crear receta con datos del paciente
            const recetaFormDataForService = {
                pacienteId: pacienteId!,
                pacienteNombre: pacienteData.nombre,
                pacienteEdad: pacienteData.edad,
                pacientePeso: values.pacientePeso || undefined, // Nuevo
                pacienteTalla: values.pacienteTalla || undefined, // Nuevo
                diagnostico: values.diagnostico,
                medicamentos: values.medicamentos,
                instrucciones: values.instrucciones,
                datosEspecificos: values.datosEspecificos
            }

            const recetaId = await recetaService.create(
                recetaFormDataForService,
                pacienteData
            )

            toast({
                title: "Receta creada",
                description: `Receta guardada correctamente.`,
            })

            if (onSuccess) {
                onSuccess(recetaId)
            } else {
                // Redirigir a la receta creada si no hay callback
                router.push(`/recetas/${recetaId}`)
            }
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

    const renderDynamicField = (fieldDef: any) => {
        return (
            <FormField
                key={fieldDef.id}
                control={form.control}
                name={`datosEspecificos.${fieldDef.id}`}
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>
                            {fieldDef.label} {fieldDef.required && "*"}
                        </FormLabel>
                        <FormControl>
                            {fieldDef.type === 'select' ? (
                                <Select
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                    value={field.value}
                                >
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Seleccione..." />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {fieldDef.options?.map((opt: string) => (
                                            <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            ) : fieldDef.type === 'textarea' ? (
                                <Textarea placeholder={fieldDef.placeholder} {...field} />
                            ) : (
                                <Input 
                                    type={fieldDef.type === 'number' ? 'number' : fieldDef.type === 'date' ? 'date' : 'text'} 
                                    placeholder={fieldDef.placeholder} 
                                    {...field} 
                                />
                            )}
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
        );
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                {!onCancel && (
                    <div className="flex items-center gap-4 mb-6">
                        <Link href="/recetas">
                            <Button variant="ghost" size="icon" type="button">
                                <ArrowLeft className="h-5 w-5" />
                            </Button>
                        </Link>
                        <h2 className="text-xl font-semibold">Nueva Receta Médica</h2>
                    </div>
                )}

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
                                            <div className="flex gap-2">
                                                <div className="relative flex-1">
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
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="icon"
                                                    onClick={() => setIsPatientModalOpen(true)}
                                                    title="Registrar Nuevo Paciente"
                                                    disabled={!!preSelectedPacienteId}
                                                >
                                                    <UserPlus className="h-5 w-5" />
                                                </Button>

                                                <PatientRegistrationModal
                                                    open={isPatientModalOpen}
                                                    onOpenChange={setIsPatientModalOpen}
                                                    onSuccess={handlePatientCreated}
                                                    onCancel={() => setIsPatientModalOpen(false)}
                                                />
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
                                                    ⚠ Paciente no encontrado. Se creará con el nombre ingresado o use el botón + para registro completo.
                                                </div>
                                            )}
                                        </FormItem>
                                    )}
                                />


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

                            {/* Inputs de Peso y Talla (Siempre visibles para actualizar "Snapshot" de esta receta) */}
                            <div className="grid grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="pacientePeso"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Peso</FormLabel>
                                            <FormControl>
                                                <Input placeholder="kg" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="pacienteTalla"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Talla</FormLabel>
                                            <FormControl>
                                                <Input placeholder="cm/m" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            {/* Campos Dinámicos de Especialidad (Exploración Física / Obstétricos) */}
                            {specialtyConfig?.prescriptionFields && (
                                <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-4 border-t pt-4 mt-2">
                                     <div className="md:col-span-3 font-medium text-sm text-slate-500">Datos de Exploración / Especialidad</div>
                                     {specialtyConfig.prescriptionFields.map(renderDynamicField)}
                                </div>
                            )}

                        </CardContent>
                    </Card>



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
