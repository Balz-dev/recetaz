---
name: test-hook-dexie
description: Generar un suite y environment de scaffold para testear con aislamiento total custom-hooks que consumen DB Local (Dexie)
---

# Skill: Isolated Hook Testing Base (Dexie Mocking)

## Contexto
Evitar inyectar un IndexedDB falso a Memory o levantar esquemas enormes solo para testear el reducer o la orquestación UI de un Hook React consumiendo una promesa.

## Flujo Implementador de un Test de Archivo Específico

1.  Determinar el Service Real subyacente. (Ej: `MedicoService`).
2.  Importar Mock Utilities: Vitest `vi.mock` o Jest `jest.mock`.
3.  **Hacer Stubbing del Servio Completo antes que Dexie.**
    Es preferible hacer mock de los métodos del Service que simular la tabla entera Dexie.
    ```typescript
    vi.mock('@/features/medicos/services/medicos.service', () => ({
       MedicoService: { getMedico: vi.fn(), saveMedico: vi.fn() }
    }));
    ```
4.  Si **debes** Testear el Service mismo, simula la Database.
    ```typescript
    vi.mock('@/shared/db/db.config', () => ({
       db: { 
          medicos: { toArray: vi.fn(), put: vi.fn() }
       }
    }));
    ```
5.  Usa React Testing Library (`@testing-library/react-hooks` o equivalente en RTL moderno).
    ```typescript
    const { result, waitForNextUpdate } = renderHook(() => useMedico());
    act(() => result.current.save(mockData));
    await waitForNextUpdate();
    expect(MedicoService.saveMedico).toHaveBeenCalledWith(mockData);
    ```
