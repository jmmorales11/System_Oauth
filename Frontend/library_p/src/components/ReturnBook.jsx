import Navbar from "./Navbar";
import Footer from "./Footer";
import LoansTable from "../models/LoansTable";
export default function ReturnBook(){
    return(
        <>
        <div id="root">
        <Navbar/>
        <div className="page">
        <h1 className="text-center">Devolver libros</h1>
        <LoansTable/>
        </div>
        <Footer/>
        </div>
        </>
    );
}

