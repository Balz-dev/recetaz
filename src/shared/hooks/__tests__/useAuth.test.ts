import { renderHook, act } from '@testing-library/react';
import { useAuth } from '../useAuth';
import { supabase } from '@/shared/lib/supabase/client';

// Mock de Supabase
jest.mock('@/shared/lib/supabase/client', () => ({
    supabase: {
        auth: {
            getSession: jest.fn(),
            onAuthStateChange: jest.fn(() => ({
                data: { subscription: { unsubscribe: jest.fn() } }
            })),
            signOut: jest.fn(),
            signUp: jest.fn(),
            signInWithPassword: jest.fn(),
        }
    }
}));

describe('useAuth', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        (supabase.auth.getSession as jest.Mock).mockResolvedValue({ data: { session: null } });
    });

    it('debe inicializar con estado de carga y sin usuario', async () => {
        const { result } = renderHook(() => useAuth());

        expect(result.current.loading).toBe(true);
        expect(result.current.user).toBe(null);
        expect(result.current.isAuthenticated).toBe(false);
    });

    it('debe manejar el cierre de sesión correctamente', async () => {
        const { result } = renderHook(() => useAuth());

        await act(async () => {
            await result.current.signOut();
        });

        expect(supabase.auth.signOut).toHaveBeenCalled();
    });

    it('debe registrar un usuario correctamente', async () => {
        const mockUser = { id: '123', email: 'test@test.com' };
        (supabase.auth.signUp as jest.Mock).mockResolvedValue({ data: { user: mockUser }, error: null });

        const { result } = renderHook(() => useAuth());

        let response;
        await act(async () => {
            response = await result.current.signUp('test@test.com', 'password123');
        });

        expect(supabase.auth.signUp).toHaveBeenCalledWith({
            email: 'test@test.com',
            password: 'password123',
            options: { data: undefined }
        });
        expect(response.data.user).toEqual(mockUser);
    });
});
