# Reglas de Manejo de Estado (State Management)

El estado se divide estrictamente entre persistente/backend (Dexie/Supabase) y efímero (UI/Client).

## 1. Estado de Interface de Usuario (Efímero)
- **Definición:** Menús abiertos, modales, steps de formularios, filtros a nivel de pantalla, valores de inputs no enviados.
- **Implementación:** 
  - Usar `useState` para estado local acotado a un componente.
  - Usar `useContext` / `Zustand` para estado transversal (ej: Modales globales, Sidebar en dashboards).
- ❌ **PROHIBIDO:** Usar Dexie.js, localStorage o IndexedDB para guardar estados colapsables de UI o pestañas, a menos que exista un requerimiento de negocio explícito de persistencia post-reinicio.

## 2. Estado de Dominio (Modelos Híbridos)
- **Definición:** Catálogos locales, histórico de recetas, datos de pacientes.
- **Implementación:**
  - El "Single Source of Truth" local es **siempre IndexedDB (Dexie)**.
  - El componente React nunca almacena copias manipulables completas. Accede a ellas re-consultando a través del Hook.
- ❌ **PROHIBIDO:** Mantener una matriz de datos (ej `const [pacientes, setPacientes] = useState([])`) que reciba updates en lugar de interactuar con el Service de la BD y forzar un refetch. Mantén la Reactividad orientada a queries.

## 3. Estado de Formulario
- Utilizar OBLIGATORIAMENTE `react-hook-form` asociado a resolvers de `zod`.
- No esparcir estado por inputs individuales gestionados en memoria.
