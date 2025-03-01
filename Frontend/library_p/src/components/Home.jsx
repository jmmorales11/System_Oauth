import Footer from "./Footer";
import Navbar from "./Navbar";
import "../style/Footer.css";
import "../index.css"

export default function Home(){
    return(
        <>
        <div id="root">
        <Navbar/>
        <div className="page">
        <h1>Pagina Home</h1>
        <h1>Pagina Home</h1>
        <h1>Pagina Home</h1>
        <h1>Pagina Homye</h1>
        </div>
        <Footer/>
        </div>
        </>
    );
}