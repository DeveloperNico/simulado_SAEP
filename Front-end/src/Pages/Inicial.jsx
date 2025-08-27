import { BarraNavegacao } from "../Components/BarraNavegacao";
import { Cabecalho } from "../Components/Cabecalho";
import { Outlet } from "react-router-dom";

export function Inicial() {
    return (
        <>
            <BarraNavegacao />
            <Cabecalho />
            <Outlet />
        </>
    )
}