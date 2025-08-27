import { Cabecalho } from './Components/Cabecalho'
import { BarraNavegacao } from './Components/BarraNavegacao';
import { CadUsuario } from './Pages/CadUsuario';
import './Style/main.scss'

function App() {
  return (
    <>
      <BarraNavegacao />
      <Cabecalho />
      <CadUsuario />
    </>
  )
}

export default App;