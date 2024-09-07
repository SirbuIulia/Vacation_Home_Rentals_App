import "../styles/Success.scss";
import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const SuccessPage = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const handleSendEmail = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const sessionId = urlParams.get('session_id');

      if (!sessionId) {
        console.error("No session ID found.");
        return;
      }

      try {
        const response = await fetch(`http://localhost:3001/bookings/complete-and-notify/${bookingId}?session_id=${sessionId}`, {
          method: 'POST'
        });

        if (!response.ok) {
          const data = await response.json();
          console.error('Failed to send confirmation email:', data.message);
          throw new Error(data.message);
        }

        const data = await response.json();
        console.log('Confirmation email sent successfully:', data.message);
      } catch (error) {
        console.error('Error in sending email:', error.message);
      }
    };
    handleSendEmail();
  }, [bookingId]);

  return (
    <div className="success-page">
      <h1>Rezervare completă</h1>
      <p>Rezervarea ta a fost realizată cu succes.</p>
      <button onClick={() => navigate('/')}>Înapoi la pagina principală</button>
    </div>
  );
};

export default SuccessPage;
