import { useState, useEffect } from "react";
import axios from "axios";

export function Quadro() {
    const [tarefas, setTarefas] = useState([]);
    const [usuarios, setUsuarios] = useState([]);

    // Carregar tarefas
    useEffect(() => {
        axios.get("http://localhost:8000/api/tarefas/")
            .then((res) => setTarefas(res.data))
            .catch((err) => console.error("Erro ao carregar tarefas: ", err));
    }, []);

    // Carregar usuários
    useEffect(() => {
        axios.get("http://localhost:8000/api/usuarios/")
            .then((res) => setUsuarios(res.data))
            .catch((err) => console.error("Erro ao carregar usuários: ", err));
    }, []);

    // Função para alterar status no backend
    const alterarStatus = (id_tarefa, novoStatus) => {
        axios.patch(`http://localhost:8000/api/tarefas/${id_tarefa}/`, { status: novoStatus })
            .then(() => {
                setTarefas(prev => prev.map(t =>
                    t.id_tarefa === id_tarefa ? { ...t, status: novoStatus } : t
                ));
            })
            .catch((err) => console.error("Erro ao atualizar status: ", err));
    };

    // Card de tarefa
    const CardTarefa = ({ t }) => {
        const [novoStatus, setNovoStatus] = useState(t.status);

        // Pegar nome do usuário pelo ID
        const nomeUsuario = usuarios.find(u => u.id_usuario === t.usuario)?.nome || "Carregando...";

        return (
            <div className="cardTarefa">
                <p><strong>Descrição:</strong> {t.descricao}</p>
                <p><strong>Setor:</strong> {t.nome_setor}</p>
                <p><strong>Prioridade:</strong> {t.prioridade}</p>
                <p><strong>Vinculado a:</strong> {nomeUsuario}</p>

                <div className="botoes">
                    <button>Editar</button>
                    <button>Excluir</button>
                </div>

                <div className="status">
                    <select
                        value={novoStatus}
                        onChange={(e) => setNovoStatus(e.target.value)}
                    >
                        <option value="a fazer">A Fazer</option>
                        <option value="fazendo">Fazendo</option>
                        <option value="pronto">Pronto</option>
                    </select>
                    <button onClick={() => alterarStatus(t.id_tarefa, novoStatus)}>
                        Alterar Status
                    </button>
                </div>
            </div>
        );
    };

    // Renderiza cada coluna
    const renderColuna = (titulo, status) => (
        <section className={status}>
            <h2>{titulo}</h2>
            {tarefas
                .filter((t) => t.status === status)
                .map((t) => <CardTarefa key={t.id_tarefa} t={t} />)
            }
        </section>
    );

    return (
        <main className="tarefas">
            {renderColuna("A Fazer", "a fazer")}
            {renderColuna("Fazendo", "fazendo")}
            {renderColuna("Pronto", "pronto")}
        </main>
    );
}