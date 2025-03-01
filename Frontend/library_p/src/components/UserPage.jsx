import Navbar from "./Navbar";
import Footer from "./Footer";
import UsersView from "../models/UserView";

export default function UserPage() {
    return (
        <>
            <div id="root">
                <Navbar />
                <div className="container-fluid mt-4">
                    <div className="row justify-content-center">
                        <div className="col-12 col-lg-10">
                            <div className="card shadow-sm p-4">
                                <UsersView />
                            </div>
                        </div>
                    </div>
                </div>
                <Footer />
            </div>
        </>
    );
}
