"use client"

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/shared/components/ui/card';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Button } from '@/shared/components/ui/button';
import { finanzasService } from '../services/finanzas.service';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Save, Loader2, DollarSign } from 'lucide-react';

export function PanelGanancias() {
    const [data, setData] = useState<{ fecha: string; ganancia: number; recetas: number }[]>([]);
    const [costo, setCosto] = useState<number>(0);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const loadData = async () => {
        try {
            const [ganancias, config] = await Promise.all([
                finanzasService.getGananciasUltimos7Dias(),
                finanzasService.getConfig()
            ]);
            setData(ganancias);
            setCosto(config.costoConsulta);
        } catch (e) {
            console.error("Error cargando datos financieros:", e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleSaveCosto = async () => {
        setSaving(true);
        try {
            await finanzasService.updateCostoConsulta(costo);
            // Recargamos los datos para reflejar el nuevo cálculo en la gráfica
            const nuevasGanancias = await finanzasService.getGananciasUltimos7Dias();
            setData(nuevasGanancias);
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <Card className="col-span-full">
                <CardHeader>
                    <CardTitle>Cargando finanzas...</CardTitle>
                </CardHeader>
                <CardContent className="h-[300px] flex items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                </CardContent>
            </Card>
        );
    }

    const totalGanancia = data.reduce((acc, curr) => acc + curr.ganancia, 0);

    return (
        <Card className="col-span-full shadow-md">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-green-600" />
                    Ingresos por Consultas
                </CardTitle>
                <CardDescription>
                    Monitoreo de ganancias basado en recetas generadas (Últimos 7 días)
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Panel de Control y Resumen */}
                    <div className="lg:w-1/4 space-y-6">
                        <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-lg border space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="costo" className="text-sm font-medium">
                                    Costo por Consulta
                                </Label>
                                <div className="flex gap-2">
                                    <div className="relative flex-1">
                                        <span className="absolute left-2.5 top-2.5 text-gray-500">$</span>
                                        <Input 
                                            type="number" 
                                            id="costo" 
                                            value={costo} 
                                            onChange={(e) => setCosto(Number(e.target.value))}
                                            className="pl-6" 
                                        />
                                    </div>
                                    <Button onClick={handleSaveCosto} disabled={saving} size="icon" title="Guardar Costo">
                                        {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                                    </Button>
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    Define el valor base para el cálculo de ingresos.
                                </p>
                            </div>
                        </div>
                        
                        <div className="space-y-1">
                            <div className="text-sm font-medium text-muted-foreground">Ganancia Estimada Total</div>
                            <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                                ${totalGanancia.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Total acumulado en la última semana
                            </p>
                        </div>
                    </div>
                    
                    {/* Gráfico */}
                    <div className="lg:w-3/4 h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-slate-200 dark:stroke-slate-700" />
                                <XAxis 
                                    dataKey="fecha" 
                                    axisLine={false} 
                                    tickLine={false} 
                                    tick={{ fontSize: 12, fill: '#888888' }}
                                    dy={10}
                                />
                                <YAxis 
                                    axisLine={false} 
                                    tickLine={false} 
                                    tickFormatter={(value) => `$${value}`} 
                                    tick={{ fontSize: 12, fill: '#888888' }}
                                />
                                <Tooltip 
                                    cursor={{ fill: 'transparent' }}
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    formatter={(value: number) => [`$${value}`, 'Ganancia']}
                                />
                                <Bar 
                                    dataKey="ganancia" 
                                    fill="#2563eb" 
                                    radius={[4, 4, 0, 0]} 
                                    name="Ganancia"
                                    animationDuration={1500}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
