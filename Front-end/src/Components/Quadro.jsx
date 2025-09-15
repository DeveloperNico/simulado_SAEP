import { useState, useEffect } from "react";
import axios from "axios";

export function Quadro() {
    const [tarefas, setTarefas] = useState([]);
    const [usuarios, setUsuarios] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:8000/api/usuarios/')
            .then((res) => setUsuarios(res.data))
            .catch((err) => console.error("Erro ao carregar usuário: ", err));

        axios.get('http://localhost:8000/api/tarefas/')
            .then((res) => setTarefas(res.data))
            .catch((err) => console.error("Erro ao carregar tarefa: ", err));
    }, []);

    const tarefasAFazer = tarefas.filter(t => t.status === "a_fazer");
    const tarefasFazendo = tarefas.filter(t => t.status === "fazendo");
    const tarefasPronto = tarefas.filter(t => t.status === "pronto");

    return (
        <main className="tarefas">
            <section>
                <h2>A Fazer</h2>
                {tarefasAFazer.map((t) => (
                    <div key={t.id} className="cardTarefa">
                        <p><strong>Descrição:</strong> {t.descricao}</p>
                        <p><strong>Setor:</strong> {t.setor}</p>
                        <p><strong>Prioridade:</strong> {t.prioridade}</p>
                        <p><strong>Vinculado a:</strong> {t.usuario_nome}</p>

                        <div className="botoes">
                            <button>Editar</button>
                            <button>Excluir</button>
                        </div>

                        <div className="status">
                            <select defaultValue={t.status}>
                                <option value="a_fazer">A Fazer</option>
                                <option value="fazendo">Fazendo</option>
                                <option value="pronto">Pronto</option>
                            </select>
                            <button>Alterar Status</button>
                        </div>
                    </div>
                ))}
            </section>

            <section>
                <h2>Fazendo</h2>
                {tarefasFazendo.map((t) => (
                    <div key={t.id} className="cardTarefa">
                        <p><strong>Descrição:</strong> {t.descricao}</p>
                        <p><strong>Setor:</strong> {t.setor}</p>
                        <p><strong>Prioridade:</strong> {t.prioridade}</p>
                        <p><strong>Vinculado a:</strong> {t.usuario_nome}</p>

                        <div className="botoes">
                            <button>Editar</button>
                            <button>Excluir</button>
                        </div>

                        <div className="status">
                            <select defaultValue={t.status}>
                                <option value="a_fazer">A Fazer</option>
                                <option value="fazendo">Fazendo</option>
                                <option value="pronto">Pronto</option>
                            </select>
                            <button>Alterar Status</button>
                        </div>
                    </div>
                ))}
            </section>

            <section>
                <h2>Pronto</h2>
                {tarefasPronto.map((t) => (
                    <div key={t.id} className="cardTarefa">
                        <p><strong>Descrição:</strong> {t.descricao}</p>
                        <p><strong>Setor:</strong> {t.setor}</p>
                        <p><strong>Prioridade:</strong> {t.prioridade}</p>
                        <p><strong>Vinculado a:</strong> {t.usuario_nome}</p>

                        <div className="botoes">
                            <button>Editar</button>
                            <button>Excluir</button>
                        </div>

                        <div className="status">
                            <select defaultValue={t.status}>
                                <option value="a_fazer">A Fazer</option>
                                <option value="fazendo">Fazendo</option>
                                <option value="pronto">Pronto</option>
                            </select>
                            <button>Alterar Status</button>
                        </div>
                    </div>
                ))}
            </section>
        </main>
    );
}