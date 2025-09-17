import { useState } from "react";
import axios from "axios";
import { z } from "zod";

const usuarioSchema = z.object({
    nome: z
        .string()
        .min(2, { message: "O nome deve ter pelo menos 2 caracteres." })
        .max(100, { message: "O nome deve ter no máximo 100 caracteres." })
        .regex(/^[A-Za-zÀ-ÖØ-öø-ÿ]+$/, { message: "O nome deve conter apenas letras." }),
    email: z.string().email({ message: "Email inválido." }),
});

export function CadUsuario() {
    const [nome, setNome] = useState("");
    const [email, setEmail] = useState("");
    const [errors, setErrors] = useState({});

    const handleSubmit = async (e) => {
        e.preventDefault();

        const validation = usuarioSchema.safeParse({ nome, email });

        if (!validation.success) {
            const fieldErrors = validation.error.flatten().fieldErrors;
            setErrors({
                nome: fieldErrors.nome?.[0],
                email: fieldErrors.email?.[0],
            });
            return;
        }

        setErrors({});

        try {
            const response = await axios.post("http://localhost:8000/api/usuarios/", 
                { nome, email }
            );

            alert("Usuário cadastrado com sucesso!");
            setNome("");
            setEmail("");
        } catch (error) {
            alert("Erro ao cadastrar usuário. Tente novamente.");
        }
    }

    return (
        <form className="formulario" onSubmit={handleSubmit} noValidate>
            <h1 className="titulo">Cadastro de usuários</h1>

            <label>Nome:
                <input type="text" value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Digite aqui..."/>
                    {errors.nome && <span className="error">{errors.nome}</span>}
            </label>

            <label>Email:
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="exemplo@gmail.com"/>
                {errors.email && <span className="error">{errors.email}</span>}
            </label>

            <button type="submit">Cadastrar</button>
        </form>
    )
}