'use client';

/**
 * @fileoverview Página de Utilidades de Desarrollo
 * 
 * Esta página proporciona herramientas de desarrollo para poblar
 * la base de datos con datos de ejemplo.
 * 
 * Acceso: http://localhost:3000/dev-utils
 */

import { useState } from 'react';
import { seedDatabase } from '@/shared/utils/seed';
import { seederService } from '@/features/medicamentos/services/seeder.service';
import { Button } from '@/shared/components/ui/button';

export default function DevUtilsPage() {
    const [isSeeding, setIsSeeding] = useState(false);
    const [message, setMessage] = useState('');
    const [logs, setLogs] = useState<string[]>([]);

    const handleSeed = async () => {
        setIsSeeding(true);
        setMessage('');
        setLogs([]);

        // Capturar console.log
        const originalLog = console.log;
        console.log = (...args) => {
            setLogs(prev => [...prev, args.join(' ')]);
            originalLog(...args);
        };

        try {
            await seedDatabase();
            setMessage('✅ Base de datos poblada exitosamente. Recarga la página para ver los cambios.');
        } catch (error) {
            setMessage(`❌ Error: ${error instanceof Error ? error.message : 'Error desconocido'}`);
            console.error(error);
        } finally {
            console.log = originalLog;
            setIsSeeding(false);
        }
    };

    const handleMedicamentosSeed = async () => {
        setIsSeeding(true);
        setMessage('');
        setLogs([]);

        const originalLog = console.log;
        console.log = (...args) => {
            setLogs(prev => [...prev, args.join(' ')]);
            originalLog(...args);
        };

        try {
            const count = await seederService.seedMedicamentos();
            setMessage(`✅ Catálogo de medicamentos actualizado. Se agregaron ${count} medicamentos.`);
        } catch (error) {
            setMessage(`❌ Error al poblar medicamentos: ${error instanceof Error ? error.message : 'Error desconocido'}`);
        } finally {
            console.log = originalLog;
            setIsSeeding(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-lg shadow-lg p-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        🛠️ Utilidades de Desarrollo
                    </h1>
                    <p className="text-gray-600 mb-8">
                        Herramientas para desarrollo y testing
                    </p>

                    <div className="border-t pt-6">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">
                            Poblar Base de Datos
                        </h2>
                        <p className="text-gray-600 mb-4">
                            Esta acción llenará la base de datos con datos de ejemplo:
                        </p>

                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                            <p className="text-yellow-800 font-medium">
                                ⚠️ Advertencia
                            </p>
                            <p className="text-yellow-700 text-sm mt-1">
                                Esta acción eliminará todos los datos existentes en la base de datos.
                            </p>
                        </div>

                        <div className="flex flex-wrap gap-4">
                            <Button
                                onClick={handleSeed}
                                disabled={isSeeding}
                                className="w-full sm:w-auto"
                                size="lg"
                            >
                                {isSeeding ? '⏳ Poblando...' : '🌱 Poblar Todo (Reset)'}
                            </Button>

                            <Button
                                onClick={handleMedicamentosSeed}
                                disabled={isSeeding}
                                variant="secondary"
                                className="w-full sm:w-auto"
                                size="lg"
                            >
                                💊 Poblar Solo Medicamentos
                            </Button>
                        </div>

                        {message && (
                            <div className={`mt-6 p-4 rounded-lg ${
                                message.startsWith('✅') 
                                    ? 'bg-green-50 border border-green-200 text-green-800' 
                                    : 'bg-red-50 border border-red-200 text-red-800'
                            }`}>
                                <p className="font-medium">{message}</p>
                            </div>
                        )}

                        {logs.length > 0 && (
                            <div className="mt-6">
                                <h3 className="text-sm font-semibold text-gray-700 mb-2">
                                    Registro de Consola:
                                </h3>
                                <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm max-h-96 overflow-y-auto">
                                    {logs.map((log, index) => (
                                        <div key={index}>{log}</div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="border-t mt-8 pt-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-3">
                            Navegación
                        </h3>
                        <div className="flex flex-wrap gap-3">
                            <a
                                href="/"
                                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                🏠 Ir al Dashboard
                            </a>
                            <a
                                href="/pacientes"
                                className="inline-flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                            >
                                👥 Ver Pacientes
                            </a>
                            <a
                                href="/recetas"
                                className="inline-flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                            >
                                📋 Ver Recetas
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
