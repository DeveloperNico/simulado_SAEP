import { useState, useEffect } from "react";
import axios from "axios";
import { Modal } from "./Modal";
import Swal from "sweetalert2";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

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

    const handleDelete = (id_tarefa) => {
        Swal.fire({
            title: "Tem certeza?",
            text: "Você não poderá reverter isso!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Sim, excluir!",
            cancelButtonText: "Cancelar"
        }).then((result) => {
            if (result.isConfirmed) {
                axios.delete(`http://localhost:8000/api/tarefas/${id_tarefa}/`)
                    .then(() => {
                        setTarefas(prev => prev.filter(t => t.id_tarefa !== id_tarefa));
                        Swal.fire("Excluído!", "A tarefa foi removida.", "success");
                    })
                    .catch(err => {
                        console.error(err);
                        Swal.fire("Erro!", "Não foi possível excluir a tarefa.", "error");
                    });
            }
        });
    };

    // Função para arrastar os cards
    const onDragEnd = (result) => {
        if (!result.destination) return;

        const { source, destination, draggableId } = result;

        if (source.droppableId === destination.droppableId && source.index === destination.index) {
            return
        }

        const novoStatus = destination.droppableId

        setTarefas(prev => {
            let novaLista = Array.from(prev);

            const tarefaMovida = novaLista.find(t => t.id_tarefa.toString() === draggableId);

            if (tarefaMovida) {
                tarefaMovida.status = destination.droppableId;
            }

            novaLista = novaLista.filter(t => t.id_tarefa.toString() !== draggableId);

            // Separa as da coluna de destino
            const antes = novaLista.filter(t => t.status !== destination.droppableId);
            const colunaDestino = novaLista.filter(t => t.status === destination.droppableId);

            // Insere na nova posição
            colunaDestino.splice(destination.index, 0, tarefaMovida);

            // Junta de volta
            return [...antes, ...colunaDestino];
        })

        axios.patch(`http://localhost:8000/api/tarefas/${draggableId}/`, {
            status: destination.droppableId
        }).catch(err => console.error(err));
    };

    const CardTarefa = ({ t, index }) => {
        const [novoStatus, setNovoStatus] = useState(t.status);

        return (
            <Draggable draggableId={t.id_tarefa.toString()} index={index}>
                {(provided, snapshot) => (
                    <section className={`cardTarefa ${snapshot.isDragging ? "dragging" : ""}`} ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} role="group" aria-label={`Tarefa: ${t.descricao}, prioridade ${t.prioridade}, vinculada a ${getNomeUsuario(t.usuario)}`}>
                        <p><strong>Descrição:</strong> {t.descricao}</p>
                        <p><strong>Setor:</strong> {t.nome_setor}</p>
                        <p><strong>Prioridade:</strong> {t.prioridade}</p>
                        <p><strong>Vinculado a:</strong> {getNomeUsuario(t.usuario)}</p>

                        <div className="botoes">
                            <button onClick={() => handleOpenEdit(t)}>Editar</button>
                            <button onClick={() => handleDelete(t.id_tarefa)}>Excluir</button>
                        </div>

                        <div className="status">
                            <select
                                aria-label={`Alterar status da tarefa ${t.descricao}`}
                                value={novoStatus}
                                onChange={(e) => setNovoStatus(e.target.value)}
                            >
                                <option value="a fazer">A Fazer</option>
                                <option value="fazendo">Fazendo</option>
                                <option value="pronto">Pronto</option>
                            </select>
                            <button onClick={() => alterarStatus(t.id_tarefa, novoStatus)} aria-label={`Alterar status da tarefa ${t.descricao} para ${novoStatus}`}>
                                Alterar Status
                            </button>
                        </div>
                    </section>
                )}
            </Draggable>
        );
    };

    const renderColuna = (titulo, status) => (
        <Droppable droppableId={status}>
            {(provided, snapshot) => (
                <section className={`coluna ${snapshot.isDraggingOver ? "coluna-hover" : ""}`} ref={provided.innerRef} {...provided.droppableProps} aria-labelledby={`titulo-${status}`}>
                    <h2 id={`titulo-${status}`}>{titulo}</h2>
                    {tarefas.filter(t => t.status === status)
                        .map((t, index) => (
                            <CardTarefa key={t.id_tarefa} t={t} index={index} />
                        ))}
                    {provided.placeholder}
                </section>
            )}
        </Droppable>
    );

    return (
        <>
            <DragDropContext onDragEnd={onDragEnd}>
                <main className="tarefas">
                    {renderColuna("A Fazer", "a fazer")}
                    {renderColuna("Fazendo", "fazendo")}
                    {renderColuna("Pronto", "pronto")}
                </main>
            </DragDropContext>

            <Modal isOpen={showModal} onClose={resetForm} role="dialog" aria-modal="true" aria-labelledby="Editar tarefa">
                <h2>{isEditing ? "Editar Tarefa" : ""}</h2>
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


