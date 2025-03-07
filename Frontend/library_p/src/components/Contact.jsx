import Navbar from "./Navbar";
import Footer from "./Footer";

export default function Contact() {
    return (
        <>
            <div id="root">
                <Navbar />
                <div className="page" style={{ minHeight: "80vh", padding: "40px 20px", backgroundColor: "#f5f5f5" }}>
                    <div style={{ 
                        maxWidth: "800px", 
                        margin: "0 auto", 
                        backgroundColor: "white", 
                        padding: "30px", 
                        borderRadius: "10px", 
                        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)" 
                    }}>
                        <h1 style={{ 
                            color: "#2c3e50", 
                            textAlign: "center", 
                            marginBottom: "30px", 
                            fontFamily: "Arial, sans-serif" 
                        }}>
                            Página de Contacto
                        </h1>
                        <p style={{ 
                            fontSize: "1.1rem", 
                            lineHeight: "1.6", 
                            color: "#34495e", 
                            textAlign: "center" 
                        }}>
                            Si el problema persiste o necesitas asistencia técnica, puedes contactar al soporte del sistema:
                        </p>
                        <div style={{ 
                            marginTop: "20px", 
                            textAlign: "center", 
                            fontSize: "1rem", 
                            color: "#2c3e50" 
                        }}>
                            <p><strong>Correo Electrónico:</strong> <a href="mailto:epramirez2@espe.edu.ec" style={{ color: "#2980b9", textDecoration: "none" }}>epramirez2@espe.edu.ec</a></p>
                            <p><strong>Teléfono:</strong> +593 995344020</p>
                            <p><strong>Horario de Atención:</strong> Lunes a Viernes, 9:00 AM - 5:00 PM</p>
                        </div>
                    </div>
                </div>
                <Footer />
            </div>
        </>
    );
}