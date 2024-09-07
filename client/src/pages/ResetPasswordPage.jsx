import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import "../styles/Login.scss";

function ResetPasswordPage() {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();
    const { token } = useParams();

    const validatePassword = (password) => {
        const regex = /^(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{5,10}$/;
        return regex.test(password);
    };

    useEffect(() => {
        if (newPassword !== confirmPassword) {
            setPasswordError("Parolele nu coincid!");
        } else if (!validatePassword(newPassword)) {
            setPasswordError("Parola trebuie să fie între 5-10 caractere, să conțină minim o literă mare și o cifră.");
        } else {
            setPasswordError("");
        }
    }, [newPassword, confirmPassword]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (passwordError) {
            setErrorMessage(passwordError);
            return;
        }

        if (!token) {
            setErrorMessage("Token is missing or invalid.");
            return;
        }

        try {
            const response = await fetch(`http://localhost:3001/auth/reset-password/${token}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token, password: newPassword })
            });

            const data = await response.json();

            if (response.ok) {
                console.log('Password reset successfully');
                navigate('/login');
            } else {
                throw new Error(data.message || 'Password reset failed');
            }
        } catch (error) {
            console.error('Error:', error);
            setErrorMessage(error.message || 'Failed to reset password. Please try again.');
        }
    };

    return (
        <div className="login">
            <div className="login_content">
                <h2>Resetare Parolă</h2>
                <form className="login_content_form" onSubmit={handleSubmit}>
                    <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Introdu parola nouă"
                        required
                    />

                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirmă parola nouă"
                        required
                    />
                    <button type="submit">Modifică Parola</button>
                    {errorMessage && <div style={{ color: 'red' }}>{errorMessage}</div>}
                </form>
            </div>
        </div>
    );
}

export default ResetPasswordPage;
