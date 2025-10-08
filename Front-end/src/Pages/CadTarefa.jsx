import { useState, useEffect } from "react";
import axios from "axios";
import { z } from "zod";

const tarefaSchema = z.object({
  descricao: z
    .string()
    .trim()
    .min(5, { message: "A descrição deve ter pelo menos 5 caracteres." })
    .max(255, { message: "A descrição deve ter no máximo 255 caracteres." })
    .regex(/^[A-Za-zÀ-ÖØ-öø-ÿ0-9\s.,!?]+$/, { message: "A descrição contém caracteres inválidos." }),
  setor: z
    .string()
    .trim()
    .min(2, { message: "O setor deve ter pelo menos 2 caracteres." })
    .max(100, { message: "O setor deve ter no máximo 100 caracteres." })
    .regex(/^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/, { message: "O setor deve conter apenas letras." }),
  usuarioId: z
    .string()
    .nonempty({ message: "Selecione um usuário." }),
  prioridade: z
    .string()
    .refine(val => ["Alta", "Média", "Baixa"].includes(val), {
        message: "Selecione uma prioridade válida."
    }),
}); 

export function CadTarefa() {
    const [usuarios, setUsuarios] = useState([]);
    const [descricao, setDescricao] = useState("");
    const [setor, setSetor] = useState("");
    const [usuarioId, setUsuarioId] = useState("");
    const [prioridade, setPrioridade] = useState("");
    const [errors, setErrors] = useState({});

    useEffect(() => {
        axios.get("http://localhost:8000/api/usuarios/")
        .then((res) => setUsuarios(res.data))
        .catch((err) => console.error("Erro ao carregar usuários: ", err));
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const validation = tarefaSchema.safeParse({
            descricao,
            setor,
            usuarioId,
            prioridade
        });

        if (!validation.success) {
            const fieldErrors = validation.error.flatten().fieldErrors;
            setErrors({
                descricao: fieldErrors.descricao?.[0],
                setor: fieldErrors.setor?.[0],
                usuarioId: fieldErrors.usuarioId?.[0],
                prioridade: fieldErrors.prioridade?.[0]
            });
            return;
        }

        setErrors({});

        try {
            const response = await axios.post("http://localhost:8000/api/tarefas/", { 
                descricao, 
                nome_setor: setor, 
                prioridade, usuario: 
                usuarioId 
            });

            alert("Tarefa cadastrada com sucesso!");
            setDescricao("");
            setSetor("");
            setUsuarioId("");
            setPrioridade("");
        } catch (err) {
            console.error("Erro ao cadastrar tarefa: ", err);
            alert("Erro ao cadastrar tarefa! Tente novamente.");
        }
    };

    return (
        <form className="formulario" onSubmit={handleSubmit} aria-labelledby="cadastro-de-tarefa">
            <h1>Cadastro de tarefa</h1>

            <label>Descrição:
                <input id="descricao"
                    type="text"
                    value={descricao}
                    onChange={(e) => setDescricao(e.target.value)}
                    placeholder="Digite a descrição..."
                    aria-describedby={errors.descricao ? "descricao-error" : undefined}
                    aria-invalid={!!errors.descricao}
                />
                {errors.descricao && <span className="error">{errors.descricao}</span>}
            </label>

            <label>Setor:
                <input id="setor"
                    type="text"
                    value={setor}
                    onChange={(e) => setSetor(e.target.value)}
                    placeholder="Digite o setor..."
                    aria-describedby={errors.setor ? "setor-error" : undefined}
                    aria-invalid={!!errors.setor}
                />
                {errors.setor && <span className="error">{errors.setor}</span>}
            </label>

            <label>Usuário:
                <select id="usuarioId"
                    value={usuarioId}
                    onChange={(e) => setUsuarioId(e.target.value)}
                    aria-describedby={errors.usuarioId ? "usuario-error" : undefined}
                    aria-invalid={!!errors.usuarioId}
                >
                    <option value="">Selecione um usuário</option>
                    {usuarios.map((u) => (
                        <option key={u.id_usuario} value={u.id_usuario}>
                            {u.nome}
                        </option>
                    ))}
                </select>
                {errors.usuarioId && <span className="error">{errors.usuarioId}</span>}
            </label>

            <label>Prioridade:
                <select id="prioridade" 
                    value={prioridade}
                    onChange={(e) => setPrioridade(e.target.value)}
                    aria-describedby={errors.prioridade ? "prioridade-error" : undefined}
                    aria-invalid={!!errors.prioridade}    
                >
                    <option value="">Selecione a prioridade</option>
                    <option value="Alta">Alta</option>
                    <option value="Média">Média</option>
                    <option value="Baixa">Baixa</option>
                </select>
                {errors.prioridade && <span className="error">{errors.prioridade}</span>}
            </label>

            <button name="Cadastrar Tarefa" type="submit">Cadastrar tarefa</button>
        </form>
    )
}