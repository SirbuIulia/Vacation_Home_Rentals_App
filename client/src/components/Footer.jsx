import "../styles/Footer.scss";
import { LocalPhone, Email, HelpOutline } from "@mui/icons-material";
import { useState } from "react";
import TermsModal from "./TermsModal";
import PrivacyModal from "./PrivacyModal";
import AboutUsModal from "./AboutUsModal";
import HelpModal from "./HelpModal";

const Footer = () => {
    const [modalType, setModalType] = useState("");

    const closeModal = () => {
        setModalType("");
    }

    return (
        <div className="footer">
            <div className="footer_top">
                <div className="footer_left">
                    <a href="/"><img src="/assets/logo.png" alt="logo" /></a>
                </div>

                <div className="footer_center">
                    <h3>Link-uri utile</h3>
                    <ul>
                        <li><a href="#!" onClick={() => setModalType("about")}>Despre noi</a></li>
                        <li><a href="#!" onClick={() => setModalType("terms")}>Termeni si conditii</a></li>
                        <li><a href="#!" onClick={() => setModalType("privacy")}>Politica de confidentialitate</a></li>
                    </ul>
                </div>

                <div className="footer_right">
                    <h3>Contact</h3>
                    <div className="footer_right_info">
                        <LocalPhone />
                        <p>+40 757 734 974</p>
                    </div>
                    <div className="footer_right_info">
                        <Email />
                        <p>homerentals480@gmail.com</p>
                    </div>
                </div>
                <button className="footer_help_button" onClick={() => setModalType("help")}>
                    <HelpOutline style={{ fontSize: 24 }} />
                </button>
            </div>
            <div className="footer_bottom">
                <p>&copy; Toate drepturile rezervate Holiday Vacation Home Rentals</p>
            </div>

            {modalType === "about" && <AboutUsModal onClose={closeModal} />}
            {modalType === "terms" && <TermsModal onClose={closeModal} />}
            {modalType === "privacy" && <PrivacyModal onClose={closeModal} />}
            {modalType === "help" && <HelpModal onClose={closeModal} />}
        </div>
    );
}

export default Footer;
