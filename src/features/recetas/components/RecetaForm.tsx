"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useFieldArray, useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/shared/components/ui/button"
import { DateInput } from "@/shared/components/ui/date-input"
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
import { buscarMedicamentosAutocompletado, agregarMedicamento, registrarUsoMedicamento } from "@/shared/services/medicamentos.service" // Mantener compatibilidad si existe, pero preferir local service para nueva logica
import { medicamentoService } from "@/features/medicamentos/services/medicamento.service"
import { diagnosticoService } from "@/features/diagnosticos/services/diagnostico.service"
import { treatmentLearningService } from "@/features/recetas/services/treatment-learning.service"
import { RecetaFormData, Paciente, MedicamentoCatalogo, DiagnosticoCatalogo, TratamientoHabitual } from "@/types"
import { calculatePediatricAge } from "@/shared/utils/age-calculator"
import { useState, useEffect } from "react"
import { useToast } from "@/shared/components/ui/use-toast"
import { Loader2, Save, ArrowLeft, Plus, Trash2, Check, UserPlus } from "lucide-react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent } from "@/shared/components/ui/card"


import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/shared/components/ui/select"
import { medicoService } from "@/features/config-medico/services/medico.service"
import { db } from "@/shared/db/db.config"
import { Switch } from "@/shared/components/ui/switch"
import { Label } from "@/shared/components/ui/label"

const medicamentoSchema = z.object({
    nombre: z.string().min(1, "El nombre es requerido"),
    nombreGenerico: z.string().optional(),
    presentacion: z.string().optional(),
    formaFarmaceutica: z.string().optional(),
    concentracion: z.string().optional(),
    cantidadSurtir: z.string().optional(),
    dosis: z.string().min(1, "La dosis es requerida"),
    viaAdministracion: z.string().optional(),
    frecuencia: z.string().min(1, "La frecuencia es requerida"),
    duracion: z.string().min(1, "La duración es requerida"),
    indicaciones: z.string().optional(),
})

const recetaFormSchema = z.object({
    pacienteId: z.string().optional(),
    pacienteNombre: z.string().min(1, "El nombre del paciente es requerido"),
    pacienteEdad: z.number().optional(),
    pacienteFechaNacimiento: z.date().optional(),
    pacientePeso: z.string().optional(),
    pacienteTalla: z.string().optional(),
    pacienteAlergias: z.string().optional(),
    pacienteAntecedentes: z.string().optional(),
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
    const [isPediatric, setIsPediatric] = useState(false)

    // Estados para diagnósticos y tratamientos inteligentes
    const [diagnosticoSuggestions, setDiagnosticoSuggestions] = useState<DiagnosticoCatalogo[]>([])
    const [showDiagnosticoSuggestions, setShowDiagnosticoSuggestions] = useState(false)
    const [suggestedTreatments, setSuggestedTreatments] = useState<TratamientoHabitual[]>([])
    const [activeDiagnosticoIndex, setActiveDiagnosticoIndex] = useState<number | null>(null)
    const [saveDiagnosis, setSaveDiagnosis] = useState(true)


    const { toast } = useToast()
    const router = useRouter()

    const form = useForm<RecetaFormData>({
        resolver: zodResolver(recetaFormSchema),
        defaultValues: {
            pacienteId: preSelectedPacienteId || undefined,
            pacienteNombre: "",
            pacienteEdad: undefined,
            pacienteFechaNacimiento: undefined,
            pacientePeso: "",
            pacienteTalla: "",
            pacienteAlergias: "",
            pacienteAntecedentes: "",
            diagnostico: "",
            medicamentos: [{
                nombre: "",
                nombreGenerico: "",
                presentacion: "",
                formaFarmaceutica: "",
                concentracion: "",
                cantidadSurtir: "",
                dosis: "",
                viaAdministracion: "",
                frecuencia: "",
                duracion: "",
                indicaciones: ""
            }],
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
        // Cargar configuración de especialidad desde BD
        const loadConfig = async () => {
            try {
                // Esperar a que Dexie esté listo
                await db.open().catch(() => { }); // Ignorar si ya está abierto

                const config = await medicoService.get();
                if (config && config.especialidadKey) {
                    try {
                        const spConfig = await db.especialidades.get(config.especialidadKey);
                        if (spConfig) {
                            setSpecialtyConfig({ ...spConfig, specialtyName: spConfig.label });
                        } else {
                            const generalConfig = await db.especialidades.get('general');
                            setSpecialtyConfig({ ...(generalConfig || {}), specialtyName: generalConfig?.label || 'General' });
                        }

                        // Detectar pediatría
                        if (config.especialidadKey === 'pediatria' || config.especialidad?.toLowerCase().includes('pediatra')) {
                            setIsPediatric(true);
                        }
                    } catch (dbError) {
                        console.error("Error accediendo a especialidades:", dbError);
                        // Fallback: configuración mínima para permitir funcionamiento
                        setSpecialtyConfig({ specialtyName: 'General', prescriptionFields: [], patientFields: [] });
                    }
                } else {
                    try {
                        const generalConfig = await db.especialidades.get('general');
                        setSpecialtyConfig({ ...(generalConfig || {}), specialtyName: generalConfig?.label || 'General' });
                    } catch (dbError) {
                        console.error("Error cargando config general:", dbError);
                        setSpecialtyConfig({ specialtyName: 'General', prescriptionFields: [], patientFields: [] });
                    }
                }
            } catch (error) {
                console.error("Error cargando configuración de especialidad:", error);
                // Fallback crítico: permitir que el formulario funcione sin campos dinámicos
                setSpecialtyConfig({ specialtyName: 'General', prescriptionFields: [], patientFields: [] });
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
                form.setValue("pacientePeso", paciente.peso)
                form.setValue("pacienteTalla", paciente.talla)
                form.setValue("pacienteAlergias", paciente.alergias)
                form.setValue("pacienteAntecedentes", paciente.antecedentes)

                // Lógica de Edad Inteligente (Duplicada para consistencia)
                if (paciente.fechaNacimiento) {
                    form.setValue("pacienteFechaNacimiento", paciente.fechaNacimiento);
                    const edadExacta = new Date().getFullYear() - new Date(paciente.fechaNacimiento).getFullYear();
                    form.setValue("pacienteEdad", edadExacta);
                } else if (paciente.edad) {
                    const lastUpdate = paciente.updatedAt || paciente.createdAt || new Date();
                    const yearsDiff = new Date().getFullYear() - new Date(lastUpdate).getFullYear();
                    const projectedAge = paciente.edad + yearsDiff;
                    form.setValue("pacienteEdad", projectedAge);

                    const estimatedYear = new Date().getFullYear() - projectedAge;
                    const estimatedDate = new Date(estimatedYear, 0, 1);
                    form.setValue("pacienteFechaNacimiento", estimatedDate);
                }
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
            form.setValue("pacienteAlergias", exactMatch.alergias)
            form.setValue("pacienteAntecedentes", exactMatch.antecedentes)
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
        form.setValue("pacientePeso", paciente.peso)
        form.setValue("pacienteTalla", paciente.talla)
        form.setValue("pacienteAlergias", paciente.alergias)
        form.setValue("pacienteAntecedentes", paciente.antecedentes)

        // Lógica de Edad Inteligente
        if (paciente.fechaNacimiento) {
            // Si tiene fecha exacta, usarla
            form.setValue("pacienteFechaNacimiento", paciente.fechaNacimiento);
            const edadExacta = new Date().getFullYear() - new Date(paciente.fechaNacimiento).getFullYear();
            form.setValue("pacienteEdad", edadExacta);
        } else if (paciente.edad) {
            // Si solo tiene edad histórica, proyectarla
            const lastUpdate = paciente.updatedAt || paciente.createdAt || new Date();
            const yearsDiff = new Date().getFullYear() - new Date(lastUpdate).getFullYear();
            const projectedAge = paciente.edad + yearsDiff;

            form.setValue("pacienteEdad", projectedAge);

            // Estimar fecha nacimiento basada en edad proyectada
            const estimatedYear = new Date().getFullYear() - projectedAge;
            const estimatedDate = new Date(estimatedYear, 0, 1); // 1ro Enero
            form.setValue("pacienteFechaNacimiento", estimatedDate);

            if (yearsDiff > 0) {
                toast({
                    title: "Edad actualizada",
                    description: `La edad registrada era ${paciente.edad} hace ${yearsDiff} años. Se sugiere ${projectedAge}.`,
                    duration: 4000
                });
            }
        }

        setShowSuggestions(false)
    }

    const onDateChange = (date: Date | undefined) => {
        form.setValue("pacienteFechaNacimiento", date);
        if (date) {
            const age = new Date().getFullYear() - date.getFullYear();
            form.setValue("pacienteEdad", age > 0 ? age : 0);
        }
    }

    const onAgeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        const newAge = val === "" ? undefined : Number(val);
        form.setValue("pacienteEdad", newAge);

        if (newAge !== undefined && newAge >= 0) {
            const currentYear = new Date().getFullYear();
            const birthYear = currentYear - newAge;
            // Preservar mes y día si ya existe una fecha, sino usar 1ro Enero
            const currentDate = form.getValues("pacienteFechaNacimiento");
            let newDate = new Date(birthYear, 0, 1);

            if (currentDate) {
                newDate = new Date(birthYear, currentDate.getMonth(), currentDate.getDate());
            }
            form.setValue("pacienteFechaNacimiento", newDate);
        }
    }

    // --- Lógica de Diagnósticos y Tratamientos Inteligentes ---

    const handleDiagnosticoSearch = async (query: string) => {
        form.setValue("diagnostico", query)
        if (query.length < 2) {
            setDiagnosticoSuggestions([])
            return
        }

        // Priorizar por especialidad del médico si está configurada
        const especialidad = specialtyConfig?.specialtyName;
        const results = await diagnosticoService.search(query, especialidad)
        setDiagnosticoSuggestions(results)
        setShowDiagnosticoSuggestions(true)
    }

    const handleSelectDiagnostico = async (diagnostico: DiagnosticoCatalogo) => {
        form.setValue("diagnostico", diagnostico.nombre + (diagnostico.codigo ? ` (${diagnostico.codigo})` : ''))
        setDiagnosticoSuggestions([])
        setShowDiagnosticoSuggestions(false)

        // Buscar sugerencias de tratamiento
        const especialidad = specialtyConfig?.specialtyName;
        // Asumiendo que guardamos el código del diagnóstico en alguna parte si fuera necesario, 
        // por ahora usamos el código o nombre para buscar
        const diagId = diagnostico.codigo || diagnostico.nombre;
        const suggestions = await treatmentLearningService.getSuggestions(diagId, especialidad);

        if (suggestions.length > 0) {
            setSuggestedTreatments(suggestions)

            // LÓGICA DE AUTOCOMPLETADO AGRESIVO
            // Si hay una sugerencia "predominante" (mucho uso o marcada manualmente) o es búsqueda exacta, cargarla.
            // Criterio: Si el tratamiento #1 tiene > 10 usos o es un tratamiento manual (usoCount >= 50), aplicar automágicamente.
            const bestMsg = suggestions[0];
            if (bestMsg.usoCount >= 10 || diagnostico.codigo) { // Si hay código oficial, asumimos estándar, o si es muy usado
                applyTreatment(bestMsg);
                toast({
                    title: "Tratamiento sugerido cargado",
                    description: `Se aplicó el protocolo: ${bestMsg.nombreTratamiento}`,
                })
            } else {
                toast({
                    title: "Tratamientos sugeridos encontrados",
                    description: "Se han encontrado tratamientos habituales para este diagnóstico.",
                })
            }
        }
    }

    const applyTreatment = (treatment: TratamientoHabitual) => {
        // Reemplazar medicamentos actuales con los del tratamiento sugerido
        // O preguntar al usuario (por ahora reemplazamos o agregamos si está vacío)

        // Limpiar medicamentos actuales si solo hay uno vacío
        const currentMeds = form.getValues("medicamentos");
        if (currentMeds.length === 1 && !currentMeds[0].nombre) {
            remove(0);
        }

        // Agregar medicamentos del tratamiento en lote
        append(treatment.medicamentos.map(med => ({
            nombre: med.nombre || "",
            nombreGenerico: med.nombreGenerico || "",
            presentacion: med.presentacion || "",
            formaFarmaceutica: med.formaFarmaceutica || "",
            concentracion: med.concentracion || "",
            cantidadSurtir: med.cantidadSurtir || "",
            dosis: med.dosis || "",
            viaAdministracion: med.viaAdministracion || "",
            frecuencia: med.frecuencia || "",
            duracion: med.duracion || "",
            indicaciones: med.indicaciones || ""
        })));

        if (treatment.instrucciones) {
            form.setValue("instrucciones", treatment.instrucciones);
        }

        setSuggestedTreatments([]); // Ocultar sugerencias tras aplicar
        toast({
            title: "Tratamiento aplicado",
            description: `Se han cargado ${treatment.medicamentos.length} medicamentos.`,
        })
    }

    // --- Fin Lógica Diagnósticos ---

    const handleMedicamentoSearch = async (query: string, index: number) => {
        form.setValue(`medicamentos.${index}.nombre`, query)

        if (query.trim().length < 2) {
            setMedicamentoSuggestions([])
            setActiveMedicamentoIndex(null)
            return
        }

        // Usar el nuevo servicio con prioridad por especialidad
        const especialidad = specialtyConfig?.specialtyName;
        const results = await medicamentoService.searchWithPriority(query, especialidad)

        setMedicamentoSuggestions(results)
        setActiveMedicamentoIndex(index)
    }

    const selectMedicamentoSuggestion = (medicamento: MedicamentoCatalogo, index: number) => {
        // console.log('Seleccionando medicamento:', medicamento);
        form.setValue(`medicamentos.${index}.nombre`, medicamento.nombre, { shouldValidate: true })

        // Mapear campos desde el catálogo si están disponibles
        if (medicamento.nombreGenerico) {
            form.setValue(`medicamentos.${index}.nombreGenerico`, medicamento.nombreGenerico, { shouldValidate: true })
        }

        if (medicamento.presentacion) {
            form.setValue(`medicamentos.${index}.presentacion`, medicamento.presentacion, { shouldValidate: true })
        }

        if (medicamento.formaFarmaceutica) {
            form.setValue(`medicamentos.${index}.formaFarmaceutica`, medicamento.formaFarmaceutica, { shouldValidate: true })
        }

        if (medicamento.concentracion) {
            form.setValue(`medicamentos.${index}.concentracion`, medicamento.concentracion, { shouldValidate: true })
        }

        // Valores predeterminados clínicos (los nuevos campos optimizados)
        if (medicamento.cantidadSurtirDefault) {
            form.setValue(`medicamentos.${index}.cantidadSurtir`, medicamento.cantidadSurtirDefault, { shouldValidate: true })
        }

        if (medicamento.viaAdministracionDefault) {
            form.setValue(`medicamentos.${index}.viaAdministracion`, medicamento.viaAdministracionDefault, { shouldValidate: true })
        }

        if (medicamento.dosisDefault) {
            form.setValue(`medicamentos.${index}.dosis`, medicamento.dosisDefault, { shouldValidate: true })
        }

        if (medicamento.frecuenciaDefault) {
            form.setValue(`medicamentos.${index}.frecuencia`, medicamento.frecuenciaDefault, { shouldValidate: true })
        }

        if (medicamento.duracionDefault) {
            form.setValue(`medicamentos.${index}.duracion`, medicamento.duracionDefault, { shouldValidate: true })
        }

        if (medicamento.indicacionesDefault) {
            form.setValue(`medicamentos.${index}.indicaciones`, medicamento.indicacionesDefault, { shouldValidate: true })
        }

        setMedicamentoSuggestions([])
        setActiveMedicamentoIndex(null)
    }



    async function onSubmit(values: RecetaFormData) {
        setIsLoading(true)
        try {
            // 1. Procesar medicamentos: agregar nuevos al catálogo y registrar uso
            for (const med of values.medicamentos) {
                // Agregar medicamento al catálogo si no existe (con validación de duplicados)
                const medicamentoId = await agregarMedicamento({
                    nombre: med.nombre,
                    nombreGenerico: med.nombreGenerico,
                    concentracion: med.concentracion,
                    formaFarmaceutica: med.formaFarmaceutica,
                    presentacion: med.presentacion,
                    categoria: undefined, // Se puede extraer de un campo adicional si se desea
                    laboratorio: undefined,
                    cantidadSurtirDefault: med.cantidadSurtir,
                    dosisDefault: med.dosis,
                    viaAdministracionDefault: med.viaAdministracion,
                    frecuenciaDefault: med.frecuencia,
                    duracionDefault: med.duracion,
                    indicacionesDefault: med.indicaciones,
                    esPersonalizado: true, // Marcado como personalizado ya que lo agregó el médico
                    sincronizado: false,
                })

                // Registrar uso del medicamento
                if (medicamentoId) {
                    await registrarUsoMedicamento(medicamentoId)
                }
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
                    alergias: values.pacienteAlergias,
                    antecedentes: values.pacienteAntecedentes
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
            } else {
                // Si el paciente ya existe, actualizar sus datos (alergias/antecedentes)
                // Esto asegura que los cambios hechos en el formulario se guarden en el perfil
                if (values.pacienteAlergias || values.pacienteAntecedentes || values.pacientePeso || values.pacienteTalla) {
                    await pacienteService.update(pacienteId, {
                        alergias: values.pacienteAlergias,
                        antecedentes: values.pacienteAntecedentes,
                        peso: values.pacientePeso,
                        talla: values.pacienteTalla
                    });
                }
            }

            // Crear receta con datos del paciente
            const recetaFormDataForService = {
                pacienteId: pacienteId!,
                pacienteNombre: pacienteData.nombre,
                pacienteEdad: pacienteData.edad,
                pacientePeso: values.pacientePeso || undefined,
                pacienteTalla: values.pacienteTalla || undefined,
                diagnostico: values.diagnostico,
                medicamentos: values.medicamentos,
                instrucciones: values.instrucciones,
                datosEspecificos: values.datosEspecificos
            }

            const recetaId = await recetaService.create(
                recetaFormDataForService,
                pacienteData
            )

            // 2. Aprender tratamiento (Gestión de diagnóstico centralizada en servicio)
            const diagInput = values.diagnostico.trim();
            const codeMatch = diagInput.match(/\(([^)]+)\)$/);
            // Pasar el código si existe, o el nombre completo si es nuevo
            const diagIdentifier = codeMatch ? codeMatch[1] : diagInput;

            try {
                // Solo aprender si el toggle está activado
                if (saveDiagnosis) {
                    // Esperar a que el aprendizaje se complete para asegurar consistencia
                    await treatmentLearningService.learn(
                        diagIdentifier,
                        values.medicamentos.map(m => ({
                            ...m,
                            nombre: m.nombre,
                            nombreGenerico: m.nombreGenerico
                        }) as any),
                        values.instrucciones || "",
                        specialtyConfig?.specialtyName
                    );
                }
            } catch (err) {
                console.error('Error al registrar aprendizaje de tratamiento:', err);
            }

            toast({
                title: "Receta creada",
                description: `Receta guardada correctamente.`,
            })

            if (onSuccess) {
                onSuccess(recetaId)
            } else {
                // Usar window.location para evitar RSC payload fetch offline
                window.location.href = `/recetas/${recetaId}`
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

                            {/* Inputs de Peso, Talla, Fecha Nac. y Edad */}
                            <div className="grid grid-cols-12 gap-4">
                                <FormField
                                    control={form.control}
                                    name="pacienteFechaNacimiento"
                                    render={({ field }) => (
                                        <FormItem className="col-span-12 md:col-span-4">
                                            <FormLabel>Fecha Nac.</FormLabel>
                                            <FormControl>
                                                <DateInput
                                                    value={field.value}
                                                    onDateChange={(date) => {
                                                        field.onChange(date);
                                                        onDateChange(date);
                                                    }}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="pacienteEdad"
                                    render={({ field }) => (
                                        <FormItem className="col-span-6 md:col-span-3">
                                            <FormLabel>Edad</FormLabel>
                                            <FormControl>
                                                {form.watch("pacienteFechaNacimiento") ? (
                                                    <div className="relative">
                                                        <Input
                                                            value={calculatePediatricAge(form.watch("pacienteFechaNacimiento")!)}
                                                            readOnly
                                                            className="bg-slate-50 text-slate-600 font-medium"
                                                        />
                                                        {/* Input oculto para mantener el valor numérico en el formulario */}
                                                        <input
                                                            type="hidden"
                                                            {...field}
                                                            value={field.value || ''}
                                                        />
                                                    </div>
                                                ) : (
                                                    <Input
                                                        type="number"
                                                        placeholder="0"
                                                        {...field}
                                                        onChange={onAgeChange}
                                                    />
                                                )}
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="pacientePeso"
                                    render={({ field }) => (
                                        <FormItem className="col-span-6 md:col-span-2">
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
                                        <FormItem className="col-span-6 md:col-span-3">
                                            <FormLabel>Talla</FormLabel>
                                            <FormControl>
                                                <Input placeholder="cm" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            {/* Alergias y Antecedentes (Campos Generales Persistentes) */}
                            <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="pacienteAlergias"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-red-600 font-semibold">Alergias</FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    placeholder="Alergias a medicamentos, alimentos, etc."
                                                    className="resize-none min-h-[80px]"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="pacienteAntecedentes"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Antecedentes Médicos</FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    placeholder="Enfermedades crónicas, cirugías previas..."
                                                    className="resize-none min-h-[80px]"
                                                    {...field}
                                                />
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

                            <FormField
                                control={form.control}
                                name="diagnostico"
                                render={({ field }) => (
                                    <FormItem className="relative md:col-span-2">
                                        <FormLabel>Diagnóstico *</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Diagnóstico principal (CIE-11 o nombre)"
                                                {...field}
                                                onChange={(e) => handleDiagnosticoSearch(e.target.value)}
                                                onBlur={() => setTimeout(() => setShowDiagnosticoSuggestions(false), 200)}
                                            />
                                        </FormControl>

                                        {/* Sugerencias de Diagnóstico */}
                                        {showDiagnosticoSuggestions && diagnosticoSuggestions.length > 0 && (
                                            <div className="absolute z-20 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-auto">
                                                {diagnosticoSuggestions.map((diag) => (
                                                    <button
                                                        key={diag.id || diag.codigo}
                                                        type="button"
                                                        className="w-full px-4 py-2 text-left hover:bg-slate-100 block"
                                                        onClick={() => handleSelectDiagnostico(diag)}
                                                    >
                                                        <span className="font-medium">{diag.nombre}</span>
                                                        {diag.codigo && <span className="text-xs text-slate-500 ml-2">({diag.codigo})</span>}
                                                    </button>
                                                ))}
                                            </div>
                                        )}

                                        {/* Sugerencias de Tratamientos Habituales */}
                                        {suggestedTreatments.length > 0 && (
                                            <div className="mt-2 space-y-2">
                                                <div className="text-xs font-semibold text-blue-600">Tratamientos sugeridos:</div>
                                                <div className="flex gap-2 flex-wrap">
                                                    {suggestedTreatments.map((t, idx) => (
                                                        <Button
                                                            key={idx}
                                                            type="button"
                                                            variant="outline"
                                                            size="sm"
                                                            className="text-xs bg-blue-50 hover:bg-blue-100 border-blue-200"
                                                            onClick={() => applyTreatment(t)}
                                                        >
                                                            {t.nombreTratamiento || `Opción ${idx + 1}`} ({t.medicamentos.length} meds)
                                                        </Button>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

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
                                <CardContent className="pt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-6">
                                    <FormField
                                        control={form.control}
                                        name={`medicamentos.${index}.nombre`}
                                        render={({ field }) => (
                                            <FormItem className="lg:col-span-3 relative">
                                                <FormLabel>Medicamento {index + 1} *</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="Nombre comercial / Genérico"
                                                        {...field}
                                                        onChange={(e) => handleMedicamentoSearch(e.target.value, index)}
                                                        onBlur={() => {
                                                            setTimeout(() => {
                                                                if (activeMedicamentoIndex === index) {
                                                                    setMedicamentoSuggestions([])
                                                                    setActiveMedicamentoIndex(null)
                                                                }
                                                            }, 200)
                                                        }}
                                                    />
                                                </FormControl>
                                                {activeMedicamentoIndex === index && medicamentoSuggestions.length > 0 && (
                                                    <div className="absolute z-20 w-full mt-1 bg-white border rounded-md shadow-lg max-h-40 overflow-auto">
                                                        {medicamentoSuggestions.map((med) => (
                                                            <button
                                                                key={med.id}
                                                                type="button"
                                                                className="w-full px-4 py-2 text-left hover:bg-slate-100 flex flex-col"
                                                                onClick={() => selectMedicamentoSuggestion(med, index)}
                                                            >
                                                                <span className="font-medium text-sm">{med.nombre}</span>
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
                                        name={`medicamentos.${index}.nombreGenerico`}
                                        render={({ field }) => (
                                            <FormItem className="lg:col-span-3">
                                                <FormLabel>Nombre Genérico (DCI)</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Ej: Paracetamol" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name={`medicamentos.${index}.concentracion`}
                                        render={({ field }) => (
                                            <FormItem className="lg:col-span-2">
                                                <FormLabel>Concentración</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Ej: 500 mg" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name={`medicamentos.${index}.formaFarmaceutica`}
                                        render={({ field }) => (
                                            <FormItem className="lg:col-span-2">
                                                <FormLabel>Forma Farmacéutica</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Ej: Tabletas, Suspensión" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name={`medicamentos.${index}.viaAdministracion`}
                                        render={({ field }) => (
                                            <FormItem className="lg:col-span-2">
                                                <FormLabel>Vía de Adm.</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Ej: V.O., I.M." {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name={`medicamentos.${index}.dosis`}
                                        render={({ field }) => (
                                            <FormItem className="lg:col-span-2">
                                                <FormLabel>Dosis *</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Ej: 1 tableta" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name={`medicamentos.${index}.frecuencia`}
                                        render={({ field }) => (
                                            <FormItem className="lg:col-span-2">
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
                                            <FormItem className="lg:col-span-2">
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
                                        name={`medicamentos.${index}.cantidadSurtir`}
                                        render={({ field }) => (
                                            <FormItem className="lg:col-span-2">
                                                <FormLabel>Cantidad a Surtir</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Ej: 14 tabletas" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name={`medicamentos.${index}.indicaciones`}
                                        render={({ field }) => (
                                            <FormItem className="lg:col-span-4">
                                                <FormLabel>Indicaciones Especiales</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Ej: Tomar en ayunas / Agitar antes de usar" {...field} />
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
                                onClick={() => append({
                                    nombre: "",
                                    nombreGenerico: "",
                                    presentacion: "",
                                    formaFarmaceutica: "",
                                    concentracion: "",
                                    cantidadSurtir: "",
                                    dosis: "",
                                    viaAdministracion: "",
                                    frecuencia: "",
                                    duracion: "",
                                    indicaciones: ""
                                })}
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

                <div className="flex flex-col md:flex-row justify-end items-center gap-6 mt-8 pb-10">
                    <div className="flex items-center space-x-2">
                        <Switch
                            id="save-diagnosis"
                            checked={saveDiagnosis}
                            onCheckedChange={setSaveDiagnosis}
                        />
                        <Label htmlFor="save-diagnosis" className="text-sm font-medium text-slate-600 cursor-pointer">
                            Recordar diagnóstico con medicamentos (Autocompletado futuro)
                        </Label>
                    </div>

                    <div className="flex gap-4">
                        <Button type="submit" disabled={isLoading} className="bg-blue-600 hover:bg-blue-700 order-1 md:order-none">
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Guardando...
                                </>
                            ) : (
                                <>
                                    <Save className="mr-2 h-4 w-4" />
                                    Guardar/Imprimir Receta
                                </>
                            )}
                        </Button>

                        {onCancel ? (
                            <Button variant="outline" type="button" onClick={onCancel} className="order-2 md:order-none">Cancelar</Button>
                        ) : (
                            <Link href="/recetas">
                                <Button variant="outline" type="button" className="order-2 md:order-none">Cancelar</Button>
                            </Link>
                        )}
                    </div>
                </div>
            </form>
        </Form >
    )
}
