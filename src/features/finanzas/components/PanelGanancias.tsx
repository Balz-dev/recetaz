"use client"

import { useEffect, useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/shared/components/ui/card';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Button } from '@/shared/components/ui/button';
import { finanzasService } from '../services/finanzas.service';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from 'recharts';
import { Save, Loader2, DollarSign, Calendar, TrendingUp } from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import { useMetrics } from '@/shared/hooks/useMetrics';

type Periodo = 'semana' | 'mes' | 'año';

/**
 * Panel de visualización de ganancias avanzado.
 * 
 * Permite filtrar ingresos por diferentes periodos:
 * - Vista Anual: Agrupado por meses.
 * - Vista Mensual: Agrupado por semanas.
 * - Vista Semanal: Agrupado por días.
 * 
 * @returns Componente de panel de ganancias rediseñado
 */
export function PanelGanancias() {
    const [periodo, setPeriodo] = useState<Periodo>('semana');
    const [data, setData] = useState<{ label: string; ganancia: number; recetas: number }[]>([]);
    const [costo, setCosto] = useState<number>(0);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const { track } = useMetrics();

    useEffect(() => {
        track('earnings_dashboard_viewed', { period: periodo });
    }, [periodo, track]);

    const loadData = useCallback(async () => {
        setLoading(true);
        try {
            const config = await finanzasService.getConfig();
            setCosto(config.costoConsulta);

            let result;
            const hoy = new Date();

            if (periodo === 'año') {
                result = await finanzasService.getGananciasPorAnio(hoy.getFullYear());
            } else if (periodo === 'mes') {
                result = await finanzasService.getGananciasPorMes(hoy.getMonth(), hoy.getFullYear());
            } else {
                result = await finanzasService.getGananciasPorSemana(hoy);
            }

            setData(result);
        } catch (e) {
            console.error("Error cargando datos financieros:", e);
        } finally {
            setLoading(false);
        }
    }, [periodo]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const handleSaveCosto = async () => {
        setSaving(true);
        try {
            await finanzasService.updateCostoConsulta(costo);
            await loadData();
        } finally {
            setSaving(false);
        }
    };

    const totalGanancia = data.reduce((acc, curr) => acc + curr.ganancia, 0);
    const totalRecetas = data.reduce((acc, curr) => acc + curr.recetas, 0);

    return (
        <Card className="col-span-full shadow-xl shadow-slate-200/50 dark:shadow-none border-slate-100 dark:border-slate-800 rounded-3xl overflow-hidden transition-all duration-300">
            <CardHeader className="border-b border-slate-50 dark:border-slate-800/50 pb-6 bg-white dark:bg-slate-900/20">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-1">
                        <CardTitle className="flex items-center gap-2 text-2xl font-bold tracking-tight">
                            <TrendingUp className="h-6 w-6 text-blue-600" />
                            Análisis de Ingresos
                        </CardTitle>
                        <CardDescription className="text-base">
                            Consulte el rendimiento de su consultorio por periodo
                        </CardDescription>
                    </div>

                    {/* Filtros de Periodo */}
                    <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl self-start w-full md:w-auto">
                        {(['semana', 'mes', 'año'] as Periodo[]).map((p) => (
                            <button
                                key={p}
                                onClick={() => setPeriodo(p)}
                                className={cn(
                                    "flex-1 md:flex-none px-6 py-2 rounded-xl text-sm font-semibold transition-all duration-200 capitalize",
                                    periodo === p
                                        ? "bg-white dark:bg-slate-700 shadow-sm text-blue-600 dark:text-blue-400"
                                        : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                                )}
                            >
                                {p === 'año' ? 'Año Actual' : p === 'mes' ? 'Mes Actual' : 'Esta Semana'}
                            </button>
                        ))}
                    </div>
                </div>
            </CardHeader>

            <CardContent className="pt-8">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Área del Gráfico (Izquierda) */}
                    <div className="lg:w-2/3 h-[360px] w-full bg-slate-50/30 dark:bg-slate-900/20 rounded-3xl p-6 pb-2 border border-slate-100 dark:border-slate-800 relative order-2 lg:order-1">
                        {loading && (
                            <div className="absolute inset-0 z-10 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm flex items-center justify-center rounded-3xl">
                                <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
                            </div>
                        )}

                        <ResponsiveContainer width="100%" height="100%" minHeight={300}>
                            <BarChart data={data} margin={{ top: 20, right: 10, left: 10, bottom: 25 }}>
                                <defs>
                                    <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#2563eb" stopOpacity={1} />
                                        <stop offset="100%" stopColor="#4f46e5" stopOpacity={1} />
                                    </linearGradient>
                                    <filter id="shadow" height="130%">
                                        <feGaussianBlur in="SourceAlpha" stdDeviation="3" />
                                        <feOffset dx="0" dy="2" result="offsetblur" />
                                        <feComponentTransfer>
                                            <feFuncA type="linear" slope="0.1" />
                                        </feComponentTransfer>
                                        <feMerge>
                                            <feMergeNode />
                                            <feMergeNode in="SourceGraphic" />
                                        </feMerge>
                                    </filter>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-slate-200 dark:stroke-slate-800" />
                                <XAxis
                                    dataKey="label"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 10, fill: '#64748b', fontWeight: 600 }}
                                    dy={10}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tickFormatter={(value) => `$${value < 1000 ? value : (value / 1000) + 'k'}`}
                                    tick={{ fontSize: 11, fill: '#94a3b8' }}
                                />
                                <Tooltip
                                    cursor={{ fill: 'rgba(37, 99, 235, 0.03)', radius: 12 }}
                                    contentStyle={{
                                        borderRadius: '20px',
                                        border: 'none',
                                        boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
                                        padding: '16px',
                                        background: 'rgba(255, 255, 255, 0.95)'
                                    }}
                                    itemStyle={{ color: '#1e293b', fontWeight: 700 }}
                                    labelStyle={{ color: '#64748b', marginBottom: '4px', fontSize: '12px' }}
                                    formatter={(value: number) => [`$${value.toLocaleString()}`, 'Ingreso Neto']}
                                />
                                <Bar
                                    dataKey="ganancia"
                                    fill="url(#barGradient)"
                                    radius={[8, 8, 8, 8]}
                                    barSize={periodo === 'semana' ? 45 : periodo === 'mes' ? 60 : 25}
                                    animationDuration={1000}
                                    filter="url(#shadow)"
                                >
                                    {data.map((entry, index) => (
                                        <Cell
                                            key={`cell-${index}`}
                                            fillOpacity={entry.ganancia === 0 ? 0.3 : 1}
                                        />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Lateral: Resumen y Configuración (Derecha) */}
                    <div className="lg:w-1/3 space-y-8 order-1 lg:order-2">
                        {/* KPI Cards */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
                            <div className="p-6 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl text-white shadow-lg overflow-hidden relative group">
                                <DollarSign className="absolute -right-4 -bottom-4 h-24 w-24 opacity-10 group-hover:scale-110 transition-transform" />
                                <p className="text-blue-100 text-sm font-medium">Ingresos Totales ({periodo})</p>
                                <h3 className="text-3xl font-black mt-1">
                                    ${totalGanancia.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                                </h3>
                            </div>

                            <div className="p-6 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-sm">
                                <p className="text-slate-500 dark:text-slate-400 text-sm font-medium underline decoration-blue-200 underline-offset-4">Consultas Realizadas</p>
                                <div className="flex items-center gap-3 mt-1">
                                    <h3 className="text-3xl font-bold">{totalRecetas}</h3>
                                    <span className="text-xs font-semibold px-2 py-0.5 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full">
                                        Atenciones
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Configuración de Costo */}
                        <div className="p-6 bg-slate-50/50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-4">
                            <div className="space-y-3">
                                <div className="flex items-center gap-2">
                                    <Calendar className="h-4 w-4 text-slate-400" />
                                    <Label htmlFor="costo" className="text-sm font-bold text-slate-700 dark:text-slate-300">
                                        Costo Base por Consulta
                                    </Label>
                                </div>
                                <div className="flex gap-2">
                                    <div className="relative flex-1">
                                        <span className="absolute left-3 top-2.5 text-slate-400 font-medium">$</span>
                                        <Input
                                            type="number"
                                            id="costo"
                                            value={costo}
                                            onChange={(e) => setCosto(Number(e.target.value))}
                                            className="pl-7 bg-white dark:bg-slate-950 rounded-xl border-slate-200 dark:border-slate-800"
                                        />
                                    </div>
                                    <Button
                                        onClick={handleSaveCosto}
                                        disabled={saving}
                                        size="icon"
                                        className="rounded-xl shrink-0 bg-slate-900 hover:bg-black dark:bg-blue-600 dark:hover:bg-blue-700"
                                    >
                                        {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4 text-white" />}
                                    </Button>
                                </div>
                                <p className="text-[11px] text-muted-foreground leading-snug">
                                    Este valor multiplica el número de recetas para proyectar sus ganancias.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
