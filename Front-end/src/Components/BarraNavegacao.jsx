import { Link } from "react-router-dom"

export function BarraNavegacao() {
    return (
        <nav className="barra" aria-label="Barra de navegação">
            <ul>
                <li><Link to='/' aria-current="page">Gerenciamento de Tarefas</Link></li>
                <li><Link to='/cadUsuario'>Cadastro de Usuário</Link></li>
                <li><Link to='/cadTarefa'>Cadastro de Tarefas</Link></li>
            </ul>
        </nav>
    )
}