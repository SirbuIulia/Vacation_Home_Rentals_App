import "../styles/HelpModal.scss";

const AboutUsModal = ({ onClose }) => {
    return (
        <div className="help_modal">
            <div className="help_modal_content">
                <span className="help_modal_close" onClick={onClose}>&times;</span>
                <h2>Despre noi</h2>
                <p>Suntem dedicați să oferim cele mai bune servicii pentru rezervarea caselor de vacanță. Aflați mai multe despre noi mai jos:</p>
                <div className="help_modal_item">
                    <h4>Misiunea noastră</h4>
                    <p>Misiunea noastră este de a oferi experiențe de neuitat clienților noștri prin servicii de înaltă calitate și atenție la detalii.</p>
                </div>
                <div className="help_modal_item">
                    <h4>Istoricul nostru</h4>
                    <p>Am început această companie în 2024, având la bază pasiunea pentru călătorii și dorința de a crea un serviciu de rezervări de încredere și accesibil.</p>
                </div>
                <div className="help_modal_item">
                    <h4>Valorile noastre</h4>
                    <p>Ne ghidăm după valori precum integritatea, inovația și satisfacția clienților. Credem în construirea de relații de durată cu clienții noștri și în oferirea de servicii personalizate.</p>
                </div>
                <p>Vă mulțumim că ați ales serviciile noastre. Pentru orice întrebări sau sugestii, nu ezitați să ne contactați.</p>
            </div>
        </div>
    );
}

export default AboutUsModal;
