import "../styles/HelpModal.scss";

const PrivacyModal = ({ onClose }) => {
    return (
        <div className="help_modal">
            <div className="help_modal_content">
                <span className="help_modal_close" onClick={onClose}>&times;</span>
                <h2>Politica de confidențialitate</h2>
                <p>Ne angajăm să protejăm confidențialitatea și securitatea informațiilor dvs. personale. Vă rugăm să citiți următoarele pentru a înțelege practicile noastre privind datele personale:</p>
                <div className="help_modal_item">
                    <h4>1. Colectarea Informațiilor</h4>
                    <p>Colectăm informații personale atunci când vă înregistrați pe site-ul nostru, plasați o rezervare sau ne contactați pentru asistență. Informațiile colectate pot include numele dvs., adresa de email, adresa fizică și alte detalii necesare pentru a vă oferi serviciile noastre.</p>
                </div>
                <div className="help_modal_item">
                    <h4>2. Utilizarea Informațiilor</h4>
                    <p>Informațiile colectate sunt utilizate pentru a procesa comenzile, a oferi suport, a îmbunătăți serviciile noastre și a personaliza experiența dvs. pe site. Nu vom vinde, închiria sau distribui informațiile dvs. personale către terți fără consimțământul dvs., cu excepția cazurilor impuse de lege.</p>
                </div>
                <div className="help_modal_item">
                    <h4>3. Protecția Informațiilor</h4>
                    <p>Implementăm măsuri de securitate pentru a proteja informațiile dvs. personale. Acestea includ criptarea datelor sensibile, controale de acces și politici stricte de confidențialitate pentru angajații noștri.</p>
                </div>
                <p>Dacă aveți întrebări sau preocupări legate de politica noastră de confidențialitate, vă rugăm să ne contactați.</p>
            </div>
        </div>
    );
}

export default PrivacyModal;
