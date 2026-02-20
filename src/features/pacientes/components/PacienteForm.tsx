"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
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
import { pacienteService } from "@/features/pacientes/services/paciente.service"
import { PacienteFormData, Paciente } from "@/types"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/shared/components/ui/select"
import { medicoService } from "@/features/config-medico/services/medico.service"
import { db } from "@/shared/db/db.config"
import { useEffect, useState } from "react"
import { useToast } from "@/shared/components/ui/use-toast"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Loader2, Save } from "lucide-react"
import { cn } from "@/shared/lib/utils"

const pacienteFormSchema = z.object({
    nombre: z.string().min(2, {
        message: "El nombre es requerido.",
    }),
    edad: z.number().optional(),
    telefono: z.string().optional(),
    peso: z.string().optional(),
    talla: z.string().optional(),
    alergias: z.string().optional(),
    antecedentes: z.string().optional(),
    datosEspecificos: z.record(z.string(), z.any()).optional(),
})

interface PacienteFormProps {
    initialData?: Paciente
    isEditing?: boolean
    afterSave?: (newPacienteId: string) => void
    onCancel?: () => void
}

/**
 * Formulario para crear o editar la información de un paciente.
 * Utiliza React Hook Form y Zod para validación.
 * Integra campos para datos personales, médicos y antecedentes.
 * @param props.initialData Datos iniciales si se está editando
 * @param props.isEditing Flag para indicar modo edición
 * @param props.afterSave Callback ejecutado tras guardar exitosamente
 * @param props.onCancel Callback para el botón cancelar
 */
export function PacienteForm({ initialData, isEditing = false, afterSave, onCancel }: PacienteFormProps) {
    const [isLoading, setIsLoading] = useState(false)
    const [specialtyConfig, setSpecialtyConfig] = useState<any>(null) // SpecialtyConfig type
    const { toast } = useToast()
    const router = useRouter()

    const form = useForm<PacienteFormData>({
        resolver: zodResolver(pacienteFormSchema),
        defaultValues: {
            nombre: initialData?.nombre || "",
            edad: initialData?.edad,
            fechaNacimiento: initialData?.fechaNacimiento,
            telefono: initialData?.telefono || "",
            peso: initialData?.peso || "",
            talla: initialData?.talla || "",
            alergias: initialData?.alergias || "",
            antecedentes: initialData?.antecedentes || "",
            datosEspecificos: initialData?.datosEspecificos || {},
        },
    })

    useEffect(() => {
        const loadConfig = async () => {
            try {
                const config = await medicoService.get();
                if (config && config.especialidadKey) {
                    const spConfig = await db.especialidades.get(config.especialidadKey);
                    if (spConfig) {
                        setSpecialtyConfig(spConfig);
                    } else {
                        const generalConfig = await db.especialidades.get('general');
                        setSpecialtyConfig(generalConfig);
                    }
                } else {
                    const generalConfig = await db.especialidades.get('general');
                    setSpecialtyConfig(generalConfig);
                }
            } catch (error) {
                console.error("Error cargando configuración de especialidad:", error);
            }
        };
        loadConfig();
    }, []);

    async function onSubmit(values: PacienteFormData) {
        setIsLoading(true)
        try {
            let pacienteId = "";
            if (isEditing && initialData) {
                await pacienteService.update(initialData.id, values)
                pacienteId = initialData.id;
                toast({
                    title: "Paciente actualizado",
                    description: "Los datos del paciente se han guardado correctamente.",
                })
            } else {
                pacienteId = await pacienteService.create(values)
                toast({
                    title: "Paciente registrado",
                    description: "El nuevo paciente ha sido creado exitosamente.",
                })
            }

            if (afterSave) {
                afterSave(pacienteId)
            } else {
                router.push("/pacientes")
                router.refresh()
            }
        } catch (error) {
            console.error(error)
            toast({
                title: "Error",
                description: "Hubo un problema al guardar el paciente.",
                variant: "destructive",
            })
        } finally {
            setIsLoading(false)
        }
    }

    const onDateChange = (date: Date | undefined) => {
        form.setValue("fechaNacimiento", date);
        if (date) {
            const age = new Date().getFullYear() - date.getFullYear();
            form.setValue("edad", age > 0 ? age : 0);
        }
    }

    const onAgeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        const newAge = val === "" ? undefined : Number(val);
        form.setValue("edad", newAge);

        if (newAge !== undefined && newAge >= 0) {
            const currentYear = new Date().getFullYear();
            const birthYear = currentYear - newAge;
            const currentDate = form.getValues("fechaNacimiento");
            let newDate = new Date(birthYear, 0, 1);
            if (currentDate) {
                newDate = new Date(birthYear, currentDate.getMonth(), currentDate.getDate());
            }
            form.setValue("fechaNacimiento", newDate);
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
        <div className={cn(!onCancel && "p-6 pt-0")}>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className={cn(onCancel ? "flex flex-col flex-1 min-h-0" : "space-y-6")}>
                    <div className={cn(onCancel ? "flex-1 overflow-y-auto p-6 space-y-6" : "space-y-6")}>

                        {/* Datos Personales */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormField
                                control={form.control}
                                name="nombre"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-xs font-bold text-slate-500">Nombre Completo *</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Nombre del paciente" {...field} className="rounded-xl border-slate-200 focus:border-blue-500 bg-slate-50/50" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="telefono"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-xs font-bold text-slate-500">Teléfono / WhatsApp</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Ej: 5512345678" {...field} className="rounded-xl border-slate-200 focus:border-blue-500 bg-slate-50/50" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="grid grid-cols-12 gap-4">
                                <FormField
                                    control={form.control}
                                    name="fechaNacimiento"
                                    render={({ field }) => (
                                        <FormItem className="col-span-12 md:col-span-8">
                                            <FormLabel className="text-xs font-bold text-slate-500">Fecha Nacimiento</FormLabel>
                                            <FormControl>
                                                <DateInput
                                                    value={field.value}
                                                    onDateChange={(date) => {
                                                        field.onChange(date);
                                                        onDateChange(date);
                                                    }}
                                                    className="rounded-xl border-slate-200 focus:border-blue-500 bg-slate-50/50"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="edad"
                                    render={({ field }) => (
                                        <FormItem className="col-span-12 md:col-span-4">
                                            <FormLabel className="text-xs font-bold text-slate-500">Edad</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    placeholder="0"
                                                    {...field}
                                                    value={field.value ?? ""}
                                                    onChange={onAgeChange}
                                                    className="rounded-xl border-slate-200 focus:border-blue-500 bg-slate-50/50"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>


                            <FormField
                                control={form.control}
                                name="peso"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-xs font-bold text-slate-500">Peso (kg)</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Ej: 75" {...field} className="rounded-xl border-slate-200 focus:border-blue-500 bg-slate-50/50" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="talla"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-xs font-bold text-slate-500">Talla (cm/m)</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Ej: 1.75" {...field} className="rounded-xl border-slate-200 focus:border-blue-500 bg-slate-50/50" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>



                        {/* Campos Dinámicos - Datos Médicos */}
                        {specialtyConfig?.patientFields.some((f: any) => f.section === 'datos_medicos') && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50 p-4 rounded-lg border">
                                <div className="md:col-span-2 font-medium text-slate-700">Información Médica Adicional</div>
                                {specialtyConfig.patientFields
                                    .filter((f: any) => f.section === 'datos_medicos')
                                    .map(renderDynamicField)}
                            </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormField
                                control={form.control}
                                name="alergias"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-xs font-bold text-red-600">Alergias</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Lista de alergias conocidas..."
                                                className="resize-none border-red-100 focus:border-red-400 rounded-xl bg-red-50/30"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="antecedentes"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-xs font-bold text-slate-500">Antecedentes Médicos</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Enfermedades crónicas, cirugías previas..."
                                                className="resize-none rounded-xl border-slate-200 focus:border-blue-500 bg-slate-50/50"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </div>

                    <div className={cn("flex items-center gap-4", onCancel ? "p-6 pt-4 bg-white border-t border-slate-100 flex-col-reverse sm:flex-row sm:justify-end sm:gap-3" : "flex-row-reverse justify-start")}>
                        {onCancel ? (
                            <Button variant="ghost" type="button" onClick={onCancel} className="text-slate-500 hover:bg-slate-100 rounded-xl px-6 font-bold">Cancelar</Button>
                        ) : (
                            <Link href="/pacientes">
                                <Button variant="ghost" type="button" className="text-slate-500 hover:bg-slate-100 rounded-xl px-6 font-bold">Cancelar</Button>
                            </Link>
                        )}
                        <Button type="submit" disabled={isLoading} className="bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xl shadow-blue-200 transition-all active:scale-95 text-white px-10 font-bold h-11">
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Guardando...
                                </>
                            ) : (
                                <>
                                    <Save className="mr-2 h-4 w-4" />
                                    {isEditing ? "Guardar Cambios" : "Guardar Paciente"}
                                </>
                            )}
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    )
}
