import "../styles/HelpModal.scss";

const TermsModal = ({ onClose }) => {
    return (
        <div className="help_modal">
            <div className="help_modal_content">
                <span className="help_modal_close" onClick={onClose}>&times;</span>
                <h2>Termeni si conditii</h2>
                <p>Acest document stabilește termenii și condițiile în care puteți utiliza site-ul nostru și serviciile oferite de noi. Vă rugăm să citiți cu atenție următoarele puncte:</p>
                <div className="help_modal_item">
                    <h4>1. Acceptarea Termenilor</h4>
                    <p>Prin accesarea și utilizarea acestui site, acceptați automat toți termenii și condițiile specificate aici. Dacă nu sunteți de acord cu acești termeni, vă rugăm să nu utilizați site-ul nostru.</p>
                </div>
                <div className="help_modal_item">
                    <h4>2. Modificări ale Termenilor</h4>
                    <p>Ne rezervăm dreptul de a modifica acești termeni în orice moment, fără notificare prealabilă. Continuarea utilizării site-ului după modificări constituie acceptarea termenilor modificați.</p>
                </div>
                <div className="help_modal_item">
                    <h4>3. Utilizarea Site-ului</h4>
                    <p>Site-ul nostru poate fi utilizat numai în scopuri legale. Este interzisă utilizarea site-ului în orice mod care ar putea deteriora, dezactiva, suprasolicita sau afecta funcționarea acestuia.</p>
                </div>
                <div className="help_modal_item">
                    <h4>4. Proprietatea Intelectuală</h4>
                    <p>Toate materialele de pe acest site, inclusiv designul, textele, grafica, logo-urile, sunt protejate de drepturi de autor și alte drepturi de proprietate intelectuală. Nu aveți voie să reproduceți, distribuiți sau creați lucrări derivate din aceste materiale fără permisiunea noastră scrisă.</p>
                </div>
                <div className="help_modal_item">
                    <h4>5. Limitarea Răspunderii</h4>
                    <p>Nu vom fi responsabili pentru niciun fel de daune directe, indirecte, incidentale sau consecutive care rezultă din utilizarea sau incapacitatea de a utiliza site-ul nostru.</p>
                </div>
                <p>Vă mulțumim că ați citit termenii și condițiile noastre. Dacă aveți întrebări, vă rugăm să ne contactați.</p>
            </div>
        </div>
    );
}

export default TermsModal;
