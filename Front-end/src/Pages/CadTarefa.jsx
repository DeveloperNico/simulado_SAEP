export function CadTarefa() {
    return (
        <form>
            <h1>Cadastro de tarefa</h1>

            <label>Descrição:</label>
            <input type="text" alt="Campo de descrição" required/>

            <label>Setor:</label>
            <input type="text" alt="Setor"  required/>

            <label>Prioridade:</label>
            <select>
                <option>Selecione a prioridade</option>
                <option>Alta</option>
                <option>Média</option>
                <option>Baixa</option>
            </select>
        </form>
    )
}