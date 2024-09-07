import React from 'react';
import { useEffect } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import "../styles/Cancel.scss";

const CancelPage = () => {
    const { bookingId } = useParams();
    const navigate = useNavigate();

    console.log("Received bookingId:", bookingId);

    useEffect(() => {
        if (!bookingId) {
            console.error("Booking ID is undefined.");
            return;
        }

        fetch(`http://localhost:3001/bookings/mark-cancelled/${bookingId}`, {
            method: 'POST'
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                console.log('Booking marked as cancelled', data);
            })
            .catch(error => console.error('Failed to mark booking as cancelled', error));
    }, [bookingId]);


    return (
        <div className="cancel-page">
            <div className="cancel-container">
                <h1>Anularea Rezervării</h1>
                <p>Rezervarea ta a fost anulată cu succes.</p>
                <button onClick={() => navigate('/')}>Înapoi la pagina principală</button>
            </div>
        </div>
    );
}

export default CancelPage;
