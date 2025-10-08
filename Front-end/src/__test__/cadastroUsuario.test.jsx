import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { CadUsuario } from "../Pages/CadUsuario";
import { describe, it, expect, vi, beforeEach } from "vitest";
import axios from "axios";

vi.mock("axios");
window.alert = vi.fn();

describe("Componente CadUsuario", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ---------------------------
  // 1–3: Renderização
  // ---------------------------

  it("1. Deve renderizar o formulário corretamente", () => {
    render(<CadUsuario />);
    expect(screen.getByText(/Cadastro de usuários/i)).toBeTruthy();
  });

  it("2. Deve renderizar os campos de nome e email", () => {
    render(<CadUsuario />);
    expect(screen.getByLabelText(/Nome/i)).toBeTruthy();
    expect(screen.getByLabelText(/Email/i)).toBeTruthy();
  });

  it("3. Deve renderizar o botão de cadastro", () => {
    render(<CadUsuario />);
    expect(screen.getByRole("button", { name: /Cadastrar/i })).toBeTruthy();
  });

  // ---------------------------
  // 4–8: Validações
  // ---------------------------

  it("4. Deve exibir erro se o nome for vazio", async () => {
    render(<CadUsuario />);
    fireEvent.click(screen.getByRole("button", { name: /Cadastrar/i }));

    await waitFor(() =>
      expect(screen.getByText(/O nome deve ter pelo menos 2 caracteres/i)).toBeTruthy()
    );
  });

  it("5. Deve exibir erro se o email for vazio", async () => {
    render(<CadUsuario />);
    fireEvent.click(screen.getByRole("button", { name: /Cadastrar/i }));

    await waitFor(() =>
      expect(screen.getByText(/Email inválido/i)).toBeTruthy()
    );
  });

  it("6. Deve exibir erro se o nome tiver menos de 2 caracteres", async () => {
    render(<CadUsuario />);
    fireEvent.change(screen.getByLabelText(/Nome/i), { target: { value: "J" } });
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: "teste@gmail.com" } });
    fireEvent.click(screen.getByRole("button", { name: /Cadastrar/i }));

    await waitFor(() =>
      expect(screen.getByText(/O nome deve ter pelo menos 2 caracteres/i)).toBeTruthy()
    );
  });

  it("7. Deve exibir erro se o nome contiver caracteres inválidos", async () => {
    render(<CadUsuario />);
    fireEvent.change(screen.getByLabelText(/Nome/i), { target: { value: "Jo@123" } });
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: "teste@gmail.com" } });
    fireEvent.click(screen.getByRole("button", { name: /Cadastrar/i }));

    await waitFor(() =>
      expect(screen.getByText(/O nome deve conter apenas letras/i)).toBeTruthy()
    );
  });

  it("8. Deve exibir erro se o email for inválido", async () => {
    render(<CadUsuario />);
    fireEvent.change(screen.getByLabelText(/Nome/i), { target: { value: "João" } });
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: "emailErrado" } });
    fireEvent.click(screen.getByRole("button", { name: /Cadastrar/i }));

    await waitFor(() =>
      expect(screen.getByText(/Email inválido/i)).toBeTruthy()
    );
  });

  // ---------------------------
  // 9–10: Atualização dos campos
  // ---------------------------

  it("9. Deve permitir digitar no campo nome", () => {
    render(<CadUsuario />);
    const inputNome = screen.getByLabelText(/Nome/i);
    fireEvent.change(inputNome, { target: { value: "Maria" } });
    expect(inputNome.value).toBe("Maria");
  });

  it("10. Deve permitir digitar no campo email", () => {
    render(<CadUsuario />);
    const inputEmail = screen.getByLabelText(/Email/i);
    fireEvent.change(inputEmail, { target: { value: "maria@email.com" } });
    expect(inputEmail.value).toBe("maria@email.com");
  });

  // ---------------------------
  // 11–12: Envio com sucesso
  // ---------------------------

  it("11. Deve enviar o formulário corretamente com dados válidos", async () => {
    axios.post.mockResolvedValueOnce({ data: {} });

    render(<CadUsuario />);
    fireEvent.change(screen.getByLabelText(/Nome/i), { target: { value: "João" } });
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: "joao@email.com" } });
    fireEvent.click(screen.getByRole("button", { name: /Cadastrar/i }));

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        "http://localhost:8000/api/usuarios/",
        { nome: "João", email: "joao@email.com" }
      );
      expect(window.alert).toHaveBeenCalledWith("Usuário cadastrado com sucesso!");
    });
  });

  it("12. Deve limpar os campos após envio bem-sucedido", async () => {
    axios.post.mockResolvedValueOnce({ data: {} });
    render(<CadUsuario />);

    const nomeInput = screen.getByLabelText(/Nome/i);
    const emailInput = screen.getByLabelText(/Email/i);

    fireEvent.change(nomeInput, { target: { value: "Lucas" } });
    fireEvent.change(emailInput, { target: { value: "lucas@email.com" } });
    fireEvent.click(screen.getByRole("button", { name: /Cadastrar/i }));

    await waitFor(() => {
      expect(nomeInput.value).toBe("");
      expect(emailInput.value).toBe("");
    });
  });

  // ---------------------------
  // 13–14: Envio com erro
  // ---------------------------

  it("13. Deve exibir alerta de erro se a API falhar", async () => {
    axios.post.mockRejectedValueOnce(new Error("Erro na API"));

    render(<CadUsuario />);
    fireEvent.change(screen.getByLabelText(/Nome/i), { target: { value: "Maria" } });
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: "maria@email.com" } });
    fireEvent.click(screen.getByRole("button", { name: /Cadastrar/i }));

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith("Erro ao cadastrar usuário. Tente novamente.");
    });
  });

  it("14. Não deve enviar o formulário se houver erros de validação", async () => {
    render(<CadUsuario />);
    fireEvent.change(screen.getByLabelText(/Nome/i), { target: { value: "" } });
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: "errado" } });
    fireEvent.click(screen.getByRole("button", { name: /Cadastrar/i }));

    await waitFor(() => {
      expect(axios.post).not.toHaveBeenCalled();
    });
  });

  // ---------------------------
  // 15: Reset de erros
  // ---------------------------

  it("15. Deve limpar as mensagens de erro após corrigir os campos", async () => {
    render(<CadUsuario />);

    // Erro inicial
    fireEvent.click(screen.getByRole("button", { name: /Cadastrar/i }));

    await waitFor(() => {
      expect(screen.getByText(/O nome deve ter pelo menos 2 caracteres/i)).toBeTruthy();
    });

    // Corrige os campos
    fireEvent.change(screen.getByLabelText(/Nome/i), { target: { value: "Ana" } });
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: "ana@email.com" } });
    fireEvent.click(screen.getByRole("button", { name: /Cadastrar/i }));

    await waitFor(() => {
      expect(screen.queryByText(/O nome deve ter pelo menos 2 caracteres/i)).toBeNull();
      expect(screen.queryByText(/Email inválido/i)).toBeNull();
    });
  });
});
