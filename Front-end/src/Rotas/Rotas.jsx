import { Routes, Route } from "react-router-dom";
import { Inicial } from "../Pages/Inicial";
import { Quadro } from "../Components/Quadro";
import { CadTarefa } from "../Pages/CadTarefa";
import { CadUsuario } from "../Pages/CadUsuario";

export function Rotas() {
    return (
        <Routes>
            <Route path="/" element={<Inicial />}>
                <Route index element={<Quadro />} />
                <Route path='/cadTarefa' element={<CadTarefa />} />
                <Route path='/cadUsuario' element={<CadUsuario />} />
            </Route>
        </Routes>
    )
}