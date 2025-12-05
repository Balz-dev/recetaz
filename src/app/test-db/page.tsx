'use client';

import { useEffect, useState } from 'react';
import { medicoService } from '@/lib/db/medico';
import { pacienteService } from '@/lib/db/pacientes';
import { recetaService } from '@/lib/db/recetas';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function TestDBPage() {
    const [logs, setLogs] = useState<string[]>([]);
    const [status, setStatus] = useState<'idle' | 'running' | 'success' | 'error'>('idle');

    const addLog = (msg: string) => setLogs(prev => [...prev, `${new Date().toLocaleTimeString()} - ${msg}`]);

    const runTests = async () => {
        setStatus('running');
        setLogs([]);
        addLog('Iniciando pruebas de base de datos...');

        try {
            // 1. Prueba Médico
            addLog('--- Probando Médico ---');
            const medicoData = {
                nombre: 'Dr. Test',
                especialidad: 'General',
                cedula: '123',
                telefono: '555',
                direccion: 'Calle Test'
            };
            await medicoService.save(medicoData);
            addLog('Médico guardado');

            const medico = await medicoService.get();
            if (medico?.nombre === 'Dr. Test') {
                addLog('✅ Médico recuperado correctamente');
            } else {
                throw new Error('Error recuperando médico');
            }

            // 2. Prueba Pacientes
            addLog('--- Probando Pacientes ---');
            const pacienteData = {
                nombre: 'Paciente Test',
                edad: 30,
                cedula: 'P-123',
                telefono: '111',
                direccion: 'Av Test'
            };
            const pacienteId = await pacienteService.create(pacienteData);
            addLog(`Paciente creado con ID: ${pacienteId}`);

            const pacientes = await pacienteService.getAll();
            if (pacientes.length > 0) {
                addLog(`✅ Pacientes listados: ${pacientes.length}`);
            } else {
                throw new Error('Error listando pacientes');
            }

            const searchResult = await pacienteService.search('Paciente Test');
            if (searchResult.length > 0) {
                addLog('✅ Búsqueda de paciente exitosa');
            } else {
                throw new Error('Error buscando paciente');
            }

            // 3. Prueba Recetas
            addLog('--- Probando Recetas ---');
            const recetaData = {
                diagnostico: 'Gripe',
                medicamentos: [
                    { id: '1', nombre: 'Paracetamol', dosis: '500mg', frecuencia: '8h', duracion: '3d' }
                ],
                instrucciones: 'Reposo',
                fechaEmision: new Date(),
                pacienteId: pacienteId // Agregamos el ID del paciente creado
            };

            const recetaId = await recetaService.create(recetaData, {
                nombre: pacienteData.nombre,
                edad: pacienteData.edad,

            });
            addLog(`Receta creada con ID: ${recetaId}`);

            const recetas = await recetaService.getAll();
            if (recetas.length > 0) {
                addLog(`✅ Recetas listadas: ${recetas.length}`);
            } else {
                throw new Error('Error listando recetas');
            }

            const receta = await recetaService.getById(recetaId);
            if (receta?.numeroReceta) {
                addLog(`✅ Receta recuperada con número: ${receta.numeroReceta}`);
            } else {
                throw new Error('Error recuperando receta');
            }

            // Limpieza (opcional, para no llenar la DB)
            // await recetaService.delete(recetaId);
            // await pacienteService.delete(pacienteId);

            setStatus('success');
            addLog('🎉 TODAS LAS PRUEBAS PASARON EXITOSAMENTE');

        } catch (error) {
            console.error(error);
            setStatus('error');
            addLog(`❌ ERROR: ${error instanceof Error ? error.message : String(error)}`);
        }
    };

    return (
        <div className="container mx-auto p-8">
            <Card>
                <CardHeader>
                    <CardTitle>Pruebas de Base de Datos (IndexedDB)</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="mb-4">
                        <Button onClick={runTests} disabled={status === 'running'}>
                            {status === 'running' ? 'Ejecutando...' : 'Ejecutar Pruebas'}
                        </Button>
                    </div>

                    <div className="bg-slate-950 text-slate-50 p-4 rounded-md font-mono text-sm min-h-[300px]">
                        {logs.map((log, i) => (
                            <div key={i} className={log.includes('❌') ? 'text-red-400' : log.includes('✅') ? 'text-green-400' : ''}>
                                {log}
                            </div>
                        ))}
                        {logs.length === 0 && <span className="text-slate-500">Esperando ejecución...</span>}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
