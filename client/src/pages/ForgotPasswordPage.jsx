import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Login.scss";

function ForgotPassword() {
    const [email, setEmail] = useState("");
    const navigate = useNavigate();
    const [message, setMessage] = useState("");

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    };

    const handleEmailBlur = () => {
        if (!email.endsWith("@gmail.com") && email.length > 0) {
            setEmail(email + "@gmail.com");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            localStorage.setItem('userEmail', email);
            const response = await fetch('http://localhost:3001/auth/forgot-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email })
            });

            const data = await response.json();
            setMessage(data.message);

            if (response.ok) {
                navigate('/enter-code');
            } else {
                console.error('Error:', data.message);
            }

        } catch (error) {
            console.error('Error:', error);
            setMessage("A apărut o eroare la trimiterea instrucțiunilor.");
        }
    };

    return (
        <div className="login">
            <div className="login_content">
                <h2>Resetare parolă</h2>
                <form className="login_content_form" onSubmit={handleSubmit}>
                    <div className="input-icon-group">
                        <input
                            type="email"
                            placeholder="Introdu adresa de email"
                            value={email}
                            onChange={handleEmailChange}
                            onBlur={handleEmailBlur}
                            required
                        />
                    </div>
                    {message && <p>{message}</p>}
                    <button type="submit">Trimite instrucțiuni</button>
                </form>
                <a href="/login">Întoarce-te la pagina de autentificare</a>
            </div>
        </div>
    );
}

export default ForgotPassword;
