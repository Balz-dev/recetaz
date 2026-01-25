import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { UserProfile } from '../UserProfile';
import { useAuth } from '@/shared/hooks/useAuth';

// Mock de useAuth
jest.mock('@/shared/hooks/useAuth');

describe('UserProfile', () => {
    const mockSignOut = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('no debe renderizar nada si el usuario no está autenticado', () => {
        (useAuth as jest.Mock).mockReturnValue({
            isAuthenticated: false,
            user: null,
            signOut: mockSignOut
        });

        const { container } = render(<UserProfile />);
        expect(container.firstChild).toBeNull();
    });

    it('debe renderizar el nombre del usuario y el avatar con iniciales', () => {
        (useAuth as jest.Mock).mockReturnValue({
            isAuthenticated: true,
            user: {
                email: 'doctor@test.com',
                user_metadata: { nombre: 'Dr. House' }
            },
            signOut: mockSignOut
        });

        render(<UserProfile />);

        expect(screen.getByText('Dr. House')).toBeInTheDocument();
        expect(screen.getByText('H')).toBeInTheDocument();
        expect(screen.getByText('Médico Verificado')).toBeInTheDocument();
    });

    it('debe abrir el menú al hacer clic en el perfil', () => {
        (useAuth as jest.Mock).mockReturnValue({
            isAuthenticated: true,
            user: {
                email: 'doctor@test.com',
                user_metadata: { nombre: 'Dr. House' }
            },
            signOut: mockSignOut
        });

        render(<UserProfile />);

        const trigger = screen.getByRole('button');
        fireEvent.click(trigger);

        expect(screen.getByText('Centro de Ayuda y Cuenta')).toBeInTheDocument();
        expect(screen.getByText('Cerrar sesión')).toBeInTheDocument();
    });
});
