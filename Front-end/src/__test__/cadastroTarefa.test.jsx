import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { CadTarefa } from '../Pages/CadTarefa';
import { describe, it, expect, vi } from 'vitest';

describe("CadTarefa - testes completos", () => {

  // 1. Renderização do formulário
  it("Deve renderizar todos os campos", () => {
    render(<CadTarefa />);
    expect(screen.getByLabelText(/Descrição/i)).toBeTruthy();
    expect(screen.getByLabelText(/Setor/i)).toBeTruthy();
    expect(screen.getByLabelText(/Usuário/i)).toBeTruthy();
    expect(screen.getByLabelText(/Prioridade/i)).toBeTruthy();
  });

  // 2. Inputs atualizam
  it("Deve permitir digitar nos inputs", () => {
    render(<CadTarefa />);
    const desc = screen.getByLabelText(/Descrição/i);
    const setor = screen.getByLabelText(/Setor/i);
    fireEvent.change(desc, { target: { value: "Teste" } });
    fireEvent.change(setor, { target: { value: "TI" } });
    expect(desc.value).toBe("Teste");
    expect(setor.value).toBe("TI");
  });

  // 3. Campos vazios
  it("Deve exibir erros ao enviar formulário vazio", async () => {
    render(<CadTarefa />);
    fireEvent.click(screen.getByRole('button', { name: /Cadastrar Tarefa/i }));
    await waitFor(() => {
      expect(screen.getByText(/A descrição deve ter pelo menos 5 caracteres./i)).toBeTruthy();
      expect(screen.getByText(/O setor deve ter pelo menos 2 caracteres./i)).toBeTruthy();
      expect(screen.getByText(/Selecione um usuário./i)).toBeTruthy();
      expect(screen.getByText(/Selecione uma prioridade válida./i)).toBeTruthy();
    });
  });

  // 4. Apenas espaços
  it("Não permite apenas espaços na descrição e setor", async () => {
    render(<CadTarefa />);
    fireEvent.change(screen.getByLabelText(/Descrição/i), { target: { value: "   " } });
    fireEvent.change(screen.getByLabelText(/Setor/i), { target: { value: "  " } });
    fireEvent.click(screen.getByRole('button', { name: /Cadastrar Tarefa/i }));
    await waitFor(() => {
      expect(screen.getByText(/A descrição deve ter pelo menos 5 caracteres./i)).toBeTruthy();
      expect(screen.getByText(/O setor deve ter pelo menos 2 caracteres./i)).toBeTruthy();
    });
  });

  // 5. Descrição acima do limite
  it("Deve gerar erro se descrição > 255 caracteres", async () => {
    render(<CadTarefa />);
    fireEvent.change(screen.getByLabelText(/Descrição/i), { target: { value: "A".repeat(256) } });
    fireEvent.change(screen.getByLabelText(/Setor/i), { target: { value: "TI" } });
    fireEvent.click(screen.getByRole('button', { name: /Cadastrar Tarefa/i }));
    await waitFor(() => {
      expect(screen.getByText(/A descrição deve ter no máximo 255 caracteres./i)).toBeTruthy();
    });
  });

  // 6. Setor acima do limite
  it("Deve gerar erro se setor > 100 caracteres", async () => {
    render(<CadTarefa />);
    fireEvent.change(screen.getByLabelText(/Descrição/i), { target: { value: "Teste válido" } });
    fireEvent.change(screen.getByLabelText(/Setor/i), { target: { value: "A".repeat(101) } });
    fireEvent.click(screen.getByRole('button', { name: /Cadastrar Tarefa/i }));
    await waitFor(() => {
      expect(screen.getByText(/O setor deve ter no máximo 100 caracteres./i)).toBeTruthy();
    });
  });

  // 7. Descrição abaixo do mínimo
  it("Erro se descrição < 5 caracteres", async () => {
    render(<CadTarefa />);
    fireEvent.change(screen.getByLabelText(/Descrição/i), { target: { value: "Abc" } });
    fireEvent.change(screen.getByLabelText(/Setor/i), { target: { value: "TI" } });
    fireEvent.click(screen.getByRole('button', { name: /Cadastrar Tarefa/i }));
    await waitFor(() => {
      expect(screen.getByText(/A descrição deve ter pelo menos 5 caracteres./i)).toBeTruthy();
    });
  });

  // 8. Setor abaixo do mínimo
  it("Erro se setor < 2 caracteres", async () => {
    render(<CadTarefa />);
    fireEvent.change(screen.getByLabelText(/Descrição/i), { target: { value: "Descrição válida" } });
    fireEvent.change(screen.getByLabelText(/Setor/i), { target: { value: "A" } });
    fireEvent.click(screen.getByRole('button', { name: /Cadastrar Tarefa/i }));
    await waitFor(() => {
      expect(screen.getByText(/O setor deve ter pelo menos 2 caracteres./i)).toBeTruthy();
    });
  });

  // 9. Caracteres inválidos na descrição
  it("Erro se descrição contiver caracteres inválidos", async () => {
    render(<CadTarefa />);
    fireEvent.change(screen.getByLabelText(/Descrição/i), { target: { value: "!@#$%" } });
    fireEvent.change(screen.getByLabelText(/Setor/i), { target: { value: "TI" } });
    fireEvent.click(screen.getByRole('button', { name: /Cadastrar Tarefa/i }));
    await waitFor(() => {
      expect(screen.getByText(/A descrição contém caracteres inválidos./i)).toBeTruthy();
    });
  });

  // 10. Caracteres inválidos no setor
  it("Erro se setor contiver números ou símbolos", async () => {
    render(<CadTarefa />);
    fireEvent.change(screen.getByLabelText(/Descrição/i), { target: { value: "Descrição" } });
    fireEvent.change(screen.getByLabelText(/Setor/i), { target: { value: "T1!" } });
    fireEvent.click(screen.getByRole('button', { name: /Cadastrar Tarefa/i }));
    await waitFor(() => {
      expect(screen.getByText(/O setor deve conter apenas letras./i)).toBeTruthy();
    });
  });

  // 11. Usuário não selecionado
  it("Erro se usuário não for selecionado", async () => {
    render(<CadTarefa />);
    fireEvent.change(screen.getByLabelText(/Descrição/i), { target: { value: "Descrição" } });
    fireEvent.change(screen.getByLabelText(/Setor/i), { target: { value: "TI" } });
    fireEvent.change(screen.getByLabelText(/Prioridade/i), { target: { value: "Alta" } });
    fireEvent.click(screen.getByRole('button', { name: /Cadastrar Tarefa/i }));
    await waitFor(() => {
      expect(screen.getByText(/Selecione um usuário./i)).toBeTruthy();
    });
  });

  // 12. Prioridade não selecionada
  it("Erro se prioridade não for selecionada", async () => {
    render(<CadTarefa />);
    fireEvent.change(screen.getByLabelText(/Descrição/i), { target: { value: "Descrição" } });
    fireEvent.change(screen.getByLabelText(/Setor/i), { target: { value: "TI" } });
    fireEvent.change(screen.getByLabelText(/Usuário/i), { target: { value: "João" } });
    fireEvent.click(screen.getByRole('button', { name: /Cadastrar Tarefa/i }));
    await waitFor(() => {
      expect(screen.getByText(/Selecione uma prioridade válida./i)).toBeTruthy();
    });
  });

  // 13. Prioridade inválida
  it("Erro se prioridade for inválida", async () => {
    render(<CadTarefa />);
    fireEvent.change(screen.getByLabelText(/Descrição/i), { target: { value: "Teste" } });
    fireEvent.change(screen.getByLabelText(/Setor/i), { target: { value: "TI" } });
    fireEvent.change(screen.getByLabelText(/Usuário/i), { target: { value: "João" } });
    fireEvent.change(screen.getByLabelText(/Prioridade/i), { target: { value: "Urgente" } });
    fireEvent.click(screen.getByRole('button', { name: /Cadastrar Tarefa/i }));
    await waitFor(() => {
      expect(screen.getByText(/Selecione uma prioridade válida./i)).toBeTruthy();
    });
  });

  // 14. Múltiplos erros aparecem juntos
  it("Mostra todos os erros juntos", async () => {
    render(<CadTarefa />);
    fireEvent.change(screen.getByLabelText(/Descrição/i), { target: { value: "   " } });
    fireEvent.change(screen.getByLabelText(/Setor/i), { target: { value: "A" } });
    fireEvent.click(screen.getByRole('button', { name: /Cadastrar Tarefa/i }));
    await waitFor(() => {
      expect(screen.getByText(/A descrição deve ter pelo menos 5 caracteres./i)).toBeTruthy();
      expect(screen.getByText(/O setor deve ter pelo menos 2 caracteres./i)).toBeTruthy();
      expect(screen.getByText(/Selecione um usuário./i)).toBeTruthy();
      expect(screen.getByText(/Selecione uma prioridade válida./i)).toBeTruthy();
    });
  });

  // 15. Usuário inválido
  it("Erro se usuário não estiver na lista", async () => {
    render(<CadTarefa />);
    fireEvent.change(screen.getByLabelText(/Descrição/i), { target: { value: "Descrição válida" } });
    fireEvent.change(screen.getByLabelText(/Setor/i), { target: { value: "TI" } });
    fireEvent.change(screen.getByLabelText(/Usuário/i), { target: { value: "Inexistente" } });
    fireEvent.change(screen.getByLabelText(/Prioridade/i), { target: { value: "Alta" } });
    fireEvent.click(screen.getByRole('button', { name: /Cadastrar Tarefa/i }));
    // Aqui precisaria do mock de usuários para validar, mas pelo schema podemos verificar se não selecionou
    await waitFor(() => {
      expect(screen.getByText(/Selecione um usuário./i)).toBeTruthy();
    });
  });

  // 16. Setor com números → erro
  it("Erro se setor contiver números", async () => {
    render(<CadTarefa />);
    fireEvent.change(screen.getByLabelText(/Descrição/i), { target: { value: "Descrição" } });
    fireEvent.change(screen.getByLabelText(/Setor/i), { target: { value: "TI123" } });
    fireEvent.click(screen.getByRole('button', { name: /Cadastrar Tarefa/i }));
    await waitFor(() => {
      expect(screen.getByText(/O setor deve conter apenas letras./i)).toBeTruthy();
    });
  });
});
