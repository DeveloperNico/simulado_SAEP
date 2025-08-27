export function CadUsuario() {
    return (
        <form className="formulario">
            <h1 className="titulo">Cadastro de usuários</h1>

            <label>Nome:</label>
            <input type="text" required/>

            <label>Email:</label>
            <input type="email" required />

            <button type="submit">Cadastrar</button>
        </form>
    )
}