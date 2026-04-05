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
        expect(screen.getByText('D')).toBeInTheDocument();
        expect(screen.getByText('Verificado')).toBeInTheDocument();
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

        expect(screen.getByText('Mi Cuenta Profesional')).toBeInTheDocument();
        expect(screen.getByText('Cerrar sesión')).toBeInTheDocument();
    });
});
