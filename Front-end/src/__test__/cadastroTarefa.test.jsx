import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { CadTarefa } from '../Pages/CadTarefa';
import { describe, it, expect } from 'vitest';

describe("Cadastro de Tarefa", () => { // Fala o que está sendo testado
    it("Deve renderizar o formulário de cadastro", () => { // Descreve qual o comportamento esperado
        render(<CadTarefa />); // Renderiaza o componente que vai ser testado

        // getByLabelText: procura pelo texto do label associado ao input
        const descricaoInput = screen.getByLabelText(/Descrição/i); // Pega o input que tem o label "Descrição"
        const setorInput = screen.getByLabelText(/Setor/i); // Pega o input que tem o label "Setor"
        const usuarioSelect = screen.getByLabelText(/Usuário/i); // Pega o select que tem o label "Usuário"
        const prioridadeSelect = screen.getByLabelText(/Prioridade/i); // Pega o select que tem o label "Prioridade"

        // expect: função que faz a verificação
        // toBeTruthy: Verifica se o elemento existe na tela
        expect(descricaoInput).toBeTruthy(); // Verifica se o input de descrição foi renderizado
        expect(setorInput).toBeTruthy(); // Verifica se o input de setor foi renderizado
        expect(usuarioSelect).toBeTruthy(); // Verifica se o select de usuário foi renderizado
        expect(prioridadeSelect).toBeTruthy(); // Verifica se o select de prioridade foi renderizado
    });
});

describe("Validação de Formulário", () => {
    it("Deve mostrar mensagens de erro para campos os campos que estão com errados", () => {
        render(<CadTarefa />);

        const botao = screen.getByRole('button', { name: /Cadastrar/i }); // getByRole: procura pelo papel do elemento, nesse caso o papel é button
        fireEvent.click(botao); // Simula o clique no botão com o fireEvent

        waitFor(() => { // waitFor: espera até que as expectativas dentro dela sejam verdadeiras
            expect(screen.getByText(/A descrição deve ter pelo menos 5 caracteres./i)).toBeTruthy(); // getByText: procura pelo texto que está sendo exibido na tela
            expect(screen.getByText(/O setor deve ter pelo menos 2 caracteres./i)).toBeTruthy();
            expect(screen.getByText(/Selecione um usuário./i)).toBeTruthy();
            expect(screen.getByText(/Selecione uma prioridade válida./i)).toBeTruthy();
        });
    });
});