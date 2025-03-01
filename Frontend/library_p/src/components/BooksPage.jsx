import Navbar from "./Navbar";
import Footer from "./Footer";
import BooksView from "../models/BooksView";

export default function BooksPage() {
    return (
        <>
            <div id="root">
                <Navbar />
                <div className="container-fluid mt-4">
                    <div className="row justify-content-center">
                        <div className="col-12 col-lg-10">
                            <div className="card shadow-sm p-4">
                                <BooksView />
                            </div>
                        </div>
                    </div>
                </div>
                <Footer />
            </div>
        </>
    );
}
