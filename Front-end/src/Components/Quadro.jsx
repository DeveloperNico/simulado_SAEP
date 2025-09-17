import { useState, useEffect } from "react";
import axios from "axios";
import { Modal } from "./Modal";

export function Quadro() {
    const [tarefas, setTarefas] = useState([]);
    const [usuarios, setUsuarios] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editTarefaId, setEditTarefaId] = useState(null);
    const [formData, setFormData] = useState({
        descricao: "",
        nome_setor: "",
        prioridade: "Baixa",
        usuario: "",
        status: "a fazer"
    });

    // Carregar tarefas
    useEffect(() => {
        axios.get("http://localhost:8000/api/tarefas/")
            .then(res => setTarefas(res.data))
            .catch(err => console.error(err));
    }, []);

    // Carregar usuários
    useEffect(() => {
        axios.get("http://localhost:8000/api/usuarios/")
            .then(res => setUsuarios(res.data))
            .catch(err => console.error(err));
    }, []);

    // Abrir modal para edição
    const handleOpenEdit = (tarefa) => {
        setFormData({
            descricao: tarefa.descricao,
            nome_setor: tarefa.nome_setor,
            prioridade: tarefa.prioridade,
            usuario: tarefa.usuario,
        });
        setEditTarefaId(tarefa.id_tarefa);
        setIsEditing(true);
        setShowModal(true);
    };

    // Fechar modal e resetar formulário
    const resetForm = () => {
        setFormData({
            descricao: "",
            nome_setor: "",
            prioridade: "Média",
            usuario: "",
        });
        setEditTarefaId(null);
        setIsEditing(false);
        setShowModal(false);
    };

    // Submeter formulário
    const handleSubmit = (e) => {
        e.preventDefault();

        const url = isEditing
            ? `http://localhost:8000/api/tarefas/${editTarefaId}/`
            : "http://localhost:8000/api/tarefas/";

        const method = isEditing ? axios.patch : axios.post;

        method(url, formData)
            .then(res => {
                if (isEditing) {
                    setTarefas(prev => prev.map(t => t.id_tarefa === editTarefaId ? res.data : t));
                } else {
                    setTarefas(prev => [...prev, res.data]);
                }
                resetForm();
            })
            .catch(err => console.error(err));
    };

    // Alterar status rápido
    const alterarStatus = (id_tarefa, novoStatus) => {
        axios.patch(`http://localhost:8000/api/tarefas/${id_tarefa}/`, { status: novoStatus })
            .then(() => {
                setTarefas(prev => prev.map(t =>
                    t.id_tarefa === id_tarefa ? { ...t, status: novoStatus } : t
                ));
            })
            .catch(err => console.error(err));
    };

    const getNomeUsuario = (id) => usuarios.find(u => u.id_usuario === id)?.nome || "Carregando...";

    const CardTarefa = ({ t }) => {
        const [novoStatus, setNovoStatus] = useState(t.status);

        return (
            <div className="cardTarefa">
                <p><strong>Descrição:</strong> {t.descricao}</p>
                <p><strong>Setor:</strong> {t.nome_setor}</p>
                <p><strong>Prioridade:</strong> {t.prioridade}</p>
                <p><strong>Vinculado a:</strong> {getNomeUsuario(t.usuario)}</p>

                <div className="botoes">
                    <button onClick={() => handleOpenEdit(t)}>Editar</button>
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

    const renderColuna = (titulo, status) => (
        <section className={status}>
            <h2>{titulo}</h2>
            {tarefas.filter(t => t.status === status)
                .map(t => <CardTarefa key={t.id_tarefa} t={t} />)}
        </section>
    );

    return (
        <>
            <main className="tarefas">
                {renderColuna("A Fazer", "a fazer")}
                {renderColuna("Fazendo", "fazendo")}
                {renderColuna("Pronto", "pronto")}
            </main>

            <Modal isOpen={showModal} onClose={resetForm}>
                <h2>{isEditing ? "Editar Tarefa" : "Nova Tarefa"}</h2>
                <form onSubmit={handleSubmit} className="form">
                    <label>
                        Descrição:
                        <input
                            value={formData.descricao}
                            onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                            required
                        />
                    </label>
                    <label>
                        Setor:
                        <input
                            value={formData.nome_setor}
                            onChange={(e) => setFormData({ ...formData, nome_setor: e.target.value })}
                            required
                        />
                    </label>
                    <label>
                        Prioridade:
                        <select
                            value={formData.prioridade}
                            onChange={(e) => setFormData({ ...formData, prioridade: e.target.value })}
                        >
                            <option value="Alta">Alta</option>
                            <option value="Média">Média</option>
                            <option value="Baixa">Baixa</option>
                        </select>
                    </label>
                    <label>
                        Usuário:
                        <select
                            value={formData.usuario}
                            onChange={(e) => setFormData({ ...formData, usuario: e.target.value })}
                        >
                            {usuarios.map(u => <option key={u.id_usuario} value={u.id_usuario}>{u.nome}</option>)}
                        </select>
                    </label>
                    <button type="submit">{isEditing ? "Salvar" : "Cadastrar"}</button>
                </form>
            </Modal>
        </>
    );
}
