import "../styles/HelpModal.scss";

const HelpModal = ({ onClose }) => {
    return (
        <div className="help_modal">
            <div className="help_modal_content">
                <span className="help_modal_close" onClick={onClose}>&times;</span>
                <h2>Asistență utilizare aplicație</h2>
                <div className="help_modal_item">
                    <h4>Cum îmi fac un cont?</h4>
                    <p>Poți crea un cont apăsând pe butonul de înregistrare din colțul din dreapta sus și completând informațiile necesare.</p>
                </div>
                <div className="help_modal_item">
                    <h4>Cum fac o rezervare?</h4>
                    <p>Pentru a face o rezervare, selectează proprietatea dorită, alege datele de check-in și check-out și apasă pe butonul de rezervare.</p>
                </div>
                <div className="help_modal_item">
                    <h4>Ce fac dacă am uitat parola?</h4>
                    <p>Dacă ai uitat parola, accesează pagina de autentificare și apasă pe link-ul "Am uitat parola". Introdu adresa de email asociată contului tău și vei primi un email cu instrucțiuni pentru resetarea parolei.</p>
                </div>
            </div>
        </div>
    )
}

export default HelpModal;
