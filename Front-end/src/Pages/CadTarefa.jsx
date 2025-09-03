import { useState, useEffect } from "react";
import axios from "axios";

export function CadTarefa() {
    const [usuarios, setUsuarios] = useState([]);
    const [descricao, setDescricao] = useState("");
    const [setor, setSetor] = useState("");
    const [usuarioId, setUsuarioId] = useState("");
    const [prioridade, setPrioridade] = useState("");

    useEffect(() => {
        axios.get("http://localhost:8000/api/usuarios/")
        .then((res) => setUsuarios(res.data))
        .catch((err) => console.error("Erro ao carregar usuários: ", err));
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

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
        <form onSubmit={handleSubmit}>
            <h1>Cadastro de tarefa</h1>

            <label>Descrição:</label>
            <input type="text" value={descricao} onChange={(e) => setDescricao(e.target.value)} />

            <label>Setor:</label>
            <input type="text" value={setor} onChange={(e) => setSetor(e.target.value)} />

            <label>Usuário:</label>
            <select value={usuarioId} onChange={(e) => setUsuarioId(e.target.value)}>
                <option value="">Selecione um usuário</option>
                {usuarios.map((u) => (
                    <option key={u.id_usuario} value={u.id_usuario}>
                        {u.nome}
                    </option>
                ))}
            </select>

            <label>Prioridade:</label>
            <select value={prioridade} onChange={(e) => setPrioridade(e.target.value)}>
                <option value="">Selecione a prioridade</option>
                <option value="Alta">Alta</option>
                <option value="Média">Média</option>
                <option value="Baixa">Baixa</option>
            </select>

            <button type="submit">Cadastrar tarefa</button>
        </form>
    )
}