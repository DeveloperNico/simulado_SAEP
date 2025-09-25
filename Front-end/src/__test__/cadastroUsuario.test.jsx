import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { CadUsuario }  from '../Pages/CadUsuario';
import { describe, it, expect } from 'vitest';

describe("Cadastro de Usuário", () => {
    it("Deve rederizar o formulário de cadastro", () => {
        render(<CadUsuario />);

        const nomeInput = screen.getByLabelText(/Nome/i);
        const emailInput = screen.getByLabelText(/Email/i);
        const botao = screen.getByRole('button', { name: /Cadastrar/i });

        expect(nomeInput).toBeTruthy();
        expect(emailInput).toBeTruthy();
        expect(botao).toBeTruthy();
    })
})
