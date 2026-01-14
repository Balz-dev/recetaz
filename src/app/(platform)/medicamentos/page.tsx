/**
 * @fileoverview Página de gestión de medicamentos
 * 
 * Permite administrar el catálogo completo de medicamentos:
 * - Ver todos los medicamentos
 * - Filtrar por categoría y tipo (catálogo/personalizados)
 * - Buscar medicamentos
 * - Crear nuevos medicamentos
 * - Editar medicamentos existentes
 * - Eliminar medicamentos
 * - Importar/Exportar datos en formato JSON
 */

"use client"

import { useState, useEffect } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import {
    obtenerMedicamentos,
    eliminarMedicamento,
    obtenerEstadisticasMedicamentos,
    agregarMedicamento,
    actualizarMedicamento
} from '@/shared/services/medicamentos.service'
import { MedicamentoCatalogo, MedicamentoCatalogoFormData } from '@/types'
import { Button } from '@/shared/components/ui/button'
import { Card, CardContent } from '@/shared/components/ui/card'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from '@/shared/components/ui/table'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/shared/components/ui/select'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/shared/components/ui/dialog'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/shared/components/ui/alert-dialog'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/shared/components/ui/form'
import { Input } from '@/shared/components/ui/input'
import { useToast } from '@/shared/components/ui/use-toast'
import { Badge } from '@/shared/components/ui/badge'
import { Plus, Package, ChevronLeft, ChevronRight } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Skeleton } from '../../../shared/components/ui/skeleton'
import { CatalogHeader } from '@/shared/components/catalog/CatalogHeader'
import { StatsCards } from '@/shared/components/catalog/StatsCards'
import { CatalogFilters } from '@/shared/components/catalog/CatalogFilters'
import { ImportExportButtons } from '@/shared/components/catalog/ImportExportButtons'
import { TableActions } from '@/shared/components/catalog/TableActions'
import { exportToJSON, getFormattedDate } from '@/shared/utils/import-export.utils'

/**
 * Schema de validación para formulario de medicamentos
 */
const medicamentoFormSchema = z.object({
    nombre: z.string().min(1, 'El nombre es requerido'),
    nombreGenerico: z.string().optional(),
    concentracion: z.string().optional(),
    formaFarmaceutica: z.string().optional(),
    presentacion: z.string().optional(),
    categoria: z.string().optional(),
    laboratorio: z.string().optional(),
    cantidadSurtirDefault: z.string().optional(),
    dosisDefault: z.string().optional(),
    viaAdministracionDefault: z.string().optional(),
    frecuenciaDefault: z.string().optional(),
    duracionDefault: z.string().optional(),
    indicacionesDefault: z.string().optional(),
    esPersonalizado: z.boolean(),
    sincronizado: z.boolean().optional(),
})

/**
 * Componente principal de gestión de medicamentos
 */
export default function MedicamentosPage() {
    const [medicamentos, setMedicamentos] = useState<MedicamentoCatalogo[]>([])
    const [filtroCategoria, setFiltroCategoria] = useState<string>('todas')
    const [filtroTipo, setFiltroTipo] = useState<'todos' | 'catalogo' | 'personalizados'>('todos')
    const [ordenPor, setOrdenPor] = useState<'nombre' | 'uso' | 'reciente'>('uso') // Ordenar por más usados por defecto
    const [busqueda, setBusqueda] = useState('')
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [medicamentoEditando, setMedicamentoEditando] = useState<MedicamentoCatalogo | null>(null)
    const [medicamentoEliminar, setMedicamentoEliminar] = useState<MedicamentoCatalogo | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [paginaActual, setPaginaActual] = useState(1)
    const itemsPorPagina = 20
    const { toast } = useToast()

    // Estadísticas en tiempo real
    const estadisticas = useLiveQuery(
        () => obtenerEstadisticasMedicamentos(),
        []
    )

    const form = useForm<MedicamentoCatalogoFormData>({
        resolver: zodResolver(medicamentoFormSchema),
        defaultValues: {
            nombre: '',
            nombreGenerico: '',
            concentracion: '',
            formaFarmaceutica: '',
            presentacion: '',
            categoria: '',
            laboratorio: '',
            cantidadSurtirDefault: '',
            dosisDefault: '',
            viaAdministracionDefault: '',
            frecuenciaDefault: '',
            duracionDefault: '',
            indicacionesDefault: '',
            esPersonalizado: true,
            sincronizado: false,
        },
    })

    /**
     * Carga medicamentos con filtros aplicados
     */
    const cargarMedicamentos = async () => {
        setIsLoading(true)
        try {
            const filtros: any = {
                ordenarPor: ordenPor,
                busqueda: busqueda // Pasar búsqueda al servicio
            }

            if (filtroCategoria !== 'todas') {
                filtros.categoria = filtroCategoria
            }

            if (filtroTipo === 'catalogo') {
                filtros.soloPersonalizados = false
            } else if (filtroTipo === 'personalizados') {
                filtros.soloPersonalizados = true
            }

            // Paginación
            const offset = (paginaActual - 1) * itemsPorPagina
            const meds = await obtenerMedicamentos(filtros, { offset, limit: itemsPorPagina })

            setMedicamentos(meds)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        cargarMedicamentos()
    }, [filtroCategoria, filtroTipo, ordenPor, busqueda, paginaActual])

    // Resetear a página 1 cuando cambian los filtros
    useEffect(() => {
        setPaginaActual(1)
    }, [filtroCategoria, filtroTipo, ordenPor, busqueda])

    /**
     * Abre el diálogo para crear un nuevo medicamento
     */
    const handleNuevoMedicamento = () => {
        setMedicamentoEditando(null)
        form.reset({
            nombre: '',
            nombreGenerico: '',
            concentracion: '',
            formaFarmaceutica: '',
            presentacion: '',
            categoria: '',
            laboratorio: '',
            cantidadSurtirDefault: '',
            dosisDefault: '',
            viaAdministracionDefault: '',
            frecuenciaDefault: '',
            duracionDefault: '',
            indicacionesDefault: '',
            esPersonalizado: true,
            sincronizado: false,
        })
        setIsDialogOpen(true)
    }

    /**
     * Abre el diálogo para editar un medicamento existente
     */
    const handleEditarMedicamento = (medicamento: MedicamentoCatalogo) => {
        setMedicamentoEditando(medicamento)
        form.reset({
            nombre: medicamento.nombre,
            nombreGenerico: medicamento.nombreGenerico || '',
            concentracion: medicamento.concentracion || '',
            formaFarmaceutica: medicamento.formaFarmaceutica || '',
            presentacion: medicamento.presentacion || '',
            categoria: medicamento.categoria || '',
            laboratorio: medicamento.laboratorio || '',
            cantidadSurtirDefault: medicamento.cantidadSurtirDefault || '',
            dosisDefault: medicamento.dosisDefault || '',
            viaAdministracionDefault: medicamento.viaAdministracionDefault || '',
            frecuenciaDefault: medicamento.frecuenciaDefault || '',
            duracionDefault: medicamento.duracionDefault || '',
            indicacionesDefault: medicamento.indicacionesDefault || '',
            esPersonalizado: medicamento.esPersonalizado,
            sincronizado: medicamento.sincronizado,
        })
        setIsDialogOpen(true)
    }

    /**
     * Guarda el medicamento (crear o actualizar)
     */
    const onSubmit = async (values: MedicamentoCatalogoFormData) => {
        try {
            if (medicamentoEditando) {
                // Actualizar
                await actualizarMedicamento(medicamentoEditando.id!, values)
                toast({
                    title: 'Medicamento actualizado',
                    description: `${values.nombre} ha sido actualizado correctamente.`,
                })
            } else {
                // Crear
                await agregarMedicamento(values)
                toast({
                    title: 'Medicamento creado',
                    description: `${values.nombre} ha sido agregado al catálogo.`,
                })
            }

            setIsDialogOpen(false)
            await cargarMedicamentos()
        } catch (error) {
            toast({
                title: 'Error',
                description: error instanceof Error ? error.message : 'No se pudo guardar el medicamento',
                variant: 'destructive',
            })
        }
    }

    /**
     * Confirma y elimina un medicamento
     */
    const handleEliminarConfirmado = async () => {
        if (!medicamentoEliminar) return

        try {
            await eliminarMedicamento(medicamentoEliminar.id!)
            toast({
                title: 'Medicamento eliminado',
                description: `${medicamentoEliminar.nombre} ha sido eliminado del catálogo.`,
            })
            setMedicamentoEliminar(null)
            await cargarMedicamentos()
        } catch (error) {
            toast({
                title: 'Error',
                description: 'No se pudo eliminar el medicamento',
                variant: 'destructive',
            })
        }
    }

    /**
     * Exporta todos los medicamentos a JSON
     */
    const handleExport = async () => {
        const todos = await obtenerMedicamentos({}, { offset: 0, limit: 10000 })
        const date = getFormattedDate()
        exportToJSON(todos, `medicamentos-${date}`)
    }

    /**
     * Importa medicamentos desde JSON
     */
    const handleImport = async (data: any[]) => {
        let importados = 0
        for (const item of data) {
            try {
                // Verificar si ya existe por nombre
                const filtros = { busqueda: item.nombre }
                const existentes = await obtenerMedicamentos(filtros, { offset: 0, limit: 1 })

                if (existentes.length === 0) {
                    await agregarMedicamento(item)
                    importados++
                }
            } catch (error) {
                console.error('Error importando medicamento:', error)
            }
        }

        if (importados > 0) {
            await cargarMedicamentos()
        }

        toast({
            title: "Importación completada",
            description: `Se importaron ${importados} de ${data.length} medicamentos.`
        })
    }

    return (
        <div className="container mx-auto py-6 space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <CatalogHeader
                    title="Catálogo de Medicamentos"
                    description="Administra el catálogo completo de medicamentos"
                    buttonText="Nuevo Medicamento"
                    onButtonClick={handleNuevoMedicamento}
                    ButtonIcon={Plus}
                />
                <ImportExportButtons
                    onExport={handleExport}
                    onImport={handleImport}
                    entityName="medicamentos"
                />
            </div>

            {/* Estadísticas */}
            {estadisticas && (
                <StatsCards
                    stats={[
                        {
                            title: "Total Medicamentos",
                            value: estadisticas.total,
                            icon: Package
                        },
                        {
                            title: "Del Catálogo",
                            value: estadisticas.delCatalogo,
                            icon: Package
                        },
                        {
                            title: "Personalizados",
                            value: estadisticas.personalizados,
                            icon: Package
                        }
                    ]}
                />
            )}

            {/* Filtros y Búsqueda */}
            <CatalogFilters
                searchValue={busqueda}
                onSearchChange={setBusqueda}
                searchPlaceholder="Buscar medicamento..."
            >
                <Select value={filtroCategoria} onValueChange={setFiltroCategoria}>
                    <SelectTrigger>
                        <SelectValue placeholder="Categoría" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="todas">Todas las categorías</SelectItem>
                        {estadisticas?.categorias.map((cat) => (
                            <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <Select value={filtroTipo} onValueChange={(value: any) => setFiltroTipo(value)}>
                    <SelectTrigger>
                        <SelectValue placeholder="Tipo" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="todos">Todos</SelectItem>
                        <SelectItem value="catalogo">Del catálogo</SelectItem>
                        <SelectItem value="personalizados">Personalizados</SelectItem>
                    </SelectContent>
                </Select>
                <Select value={ordenPor} onValueChange={(value: any) => setOrdenPor(value)}>
                    <SelectTrigger>
                        <SelectValue placeholder="Ordenar por" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="nombre">Nombre</SelectItem>
                        <SelectItem value="uso">Más usados</SelectItem>
                        <SelectItem value="reciente">Más recientes</SelectItem>
                    </SelectContent>
                </Select>
            </CatalogFilters>

            {/* Tabla de Medicamentos */}
            <Card>
                <CardContent className="pt-6">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Nombre</TableHead>
                                <TableHead>Genérico</TableHead>
                                <TableHead>Presentación</TableHead>
                                <TableHead>Categoría</TableHead>
                                <TableHead className="text-center">Tipo</TableHead>
                                <TableHead className="text-center">Usos</TableHead>
                                <TableHead className="text-right">Acciones</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading ? (
                                Array.from({ length: 5 }).map((_, index) => (
                                    <TableRow key={index}>
                                        <TableCell><Skeleton className="h-4 w-[150px]" /></TableCell>
                                        <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
                                        <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
                                        <TableCell><Skeleton className="h-4 w-[80px]" /></TableCell>
                                        <TableCell className="text-center"><Skeleton className="h-6 w-[80px] rounded-full mx-auto" /></TableCell>
                                        <TableCell className="text-center"><Skeleton className="h-4 w-[40px] mx-auto" /></TableCell>
                                        <TableCell className="text-right"><Skeleton className="h-8 w-[80px] ml-auto" /></TableCell>
                                    </TableRow>
                                ))
                            ) : medicamentos.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                                        No se encontraron medicamentos
                                    </TableCell>
                                </TableRow>
                            ) : (
                                medicamentos.map((med) => (
                                    <TableRow key={med.id}>
                                        <TableCell className="font-medium">{med.nombre}</TableCell>
                                        <TableCell>{med.nombreGenerico || '-'}</TableCell>
                                        <TableCell>{med.presentacion || '-'}</TableCell>
                                        <TableCell>{med.categoria || '-'}</TableCell>
                                        <TableCell className="text-center">
                                            {med.esPersonalizado ? (
                                                <Badge variant="info">
                                                    Personalizado
                                                </Badge>
                                            ) : (
                                                <Badge variant="success">
                                                    Catálogo
                                                </Badge>
                                            )}
                                        </TableCell>
                                        <TableCell className="text-center">{med.vecesUsado}</TableCell>
                                        <TableCell className="text-right">
                                            <TableActions
                                                onEdit={() => handleEditarMedicamento(med)}
                                                onDelete={() => setMedicamentoEliminar(med)}
                                                editLabel="Editar medicamento"
                                                deleteLabel="Eliminar medicamento"
                                            />
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>

                    {/* Controles de Paginación */}
                    <div className="flex items-center justify-end space-x-2 py-4 px-2 border-t mt-4">
                        <div className="flex-1 text-sm text-muted-foreground">
                            Página {paginaActual}
                        </div>
                        <div className="space-x-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setPaginaActual(prev => Math.max(prev - 1, 1))}
                                disabled={paginaActual === 1 || isLoading}
                            >
                                <ChevronLeft className="h-4 w-4 mr-1" />
                                Anterior
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setPaginaActual(prev => prev + 1)}
                                disabled={medicamentos.length < itemsPorPagina || isLoading}
                            >
                                Siguiente
                                <ChevronRight className="h-4 w-4 ml-1" />
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Dialog de Crear/Editar */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>
                            {medicamentoEditando ? 'Editar Medicamento' : 'Nuevo Medicamento'}
                        </DialogTitle>
                        <DialogDescription>
                            {medicamentoEditando
                                ? 'Modifica los datos del medicamento.'
                                : 'Agrega un nuevo medicamento al catálogo.'}
                        </DialogDescription>
                    </DialogHeader>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <div className="grid gap-4 md:grid-cols-2">
                                <FormField
                                    control={form.control}
                                    name="nombre"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Nombre Comercial *</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Paracetamol 500mg" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="nombreGenerico"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Nombre Genérico</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Paracetamol" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="concentracion"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Concentración</FormLabel>
                                            <FormControl>
                                                <Input placeholder="500 mg" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="formaFarmaceutica"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Forma Farmacéutica</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Tabletas" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="presentacion"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Presentación</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Tabletas 500mg" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="categoria"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Categoría</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Analgésico" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="laboratorio"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Laboratorio</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Genérico" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="cantidadSurtirDefault"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Cantidad a Surtir</FormLabel>
                                            <FormControl>
                                                <Input placeholder="1 caja (20 tabletas)" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="dosisDefault"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Dosis Predeterminada</FormLabel>
                                            <FormControl>
                                                <Input placeholder="1 tableta" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="viaAdministracionDefault"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Vía de Administración</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Oral" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="frecuenciaDefault"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Frecuencia</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Cada 8 horas" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="duracionDefault"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Duración</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Por 5 días" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <FormField
                                control={form.control}
                                name="indicacionesDefault"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Indicaciones Predeterminadas</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Tomar con alimentos" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <DialogFooter>
                                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                                    Cancelar
                                </Button>
                                <Button type="submit">
                                    {medicamentoEditando ? 'Actualizar' : 'Crear'}
                                </Button>
                            </DialogFooter>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>

            {/* Dialog de Confirmación de Eliminación */}
            <AlertDialog open={!!medicamentoEliminar} onOpenChange={() => setMedicamentoEliminar(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Esta acción no se puede deshacer. El medicamento &quot;{medicamentoEliminar?.nombre}&quot; será eliminado permanentemente del catálogo.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={handleEliminarConfirmado} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                            Eliminar
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div >
    )
}
