import { BarraNavegacao } from "../Components/BarraNavegacao";
import { Cabecalho } from "../Components/Cabecalho";
import { Outlet } from "react-router-dom";
import { Quadro } from "../Components/Quadro";

export function Inicial() {
    return (
        <>
            <div className="containerCabecalho">
                <Cabecalho />
                <BarraNavegacao />
            </div>
            <Outlet />
        </>
    )
}