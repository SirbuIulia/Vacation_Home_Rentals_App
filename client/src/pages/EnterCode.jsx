import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "../styles/Login.scss";

function EnterCode() {
    const [code, setCode] = useState(Array(6).fill(''));
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const email = localStorage.getItem('userEmail');

    const handleChange = (element, index) => {
        if (isNaN(element.value)) return false;
        const newCode = [...code];
        newCode[index] = element.value;
        setCode(newCode);

        if (element.nextSibling) {
            element.nextSibling.focus();
        }
    };

    const handleVerifyCode = async (e) => {
        e.preventDefault();
        const fullCode = code.join('');
        try {
            console.log("Email from storage:", email);
            console.log("Code entered:", code);
            const response = await fetch('http://localhost:3001/auth/verify-code', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, code: fullCode })
            });
            const data = await response.json();

            if (response.ok) {
                navigate(`/reset-password/${data.token}`);
            } else {
                setErrorMessage(data.message || 'Verification failed. Please try again.');
            }
        } catch (error) {
            console.error('Verification failed:', error);
            setErrorMessage('An error occurred during verification. Please try again.');
        }
    };

    return (
        <div className="login">
            <div className="login_content">
                <h2>Introdu codul de verificare</h2>
                <form className="login_content_form" style={{ flexDirection: "row" }} onSubmit={handleVerifyCode}>
                    {code.map((singleCode, index) => (
                        <input
                            type="text"
                            key={index}
                            value={singleCode}
                            maxLength="1"
                            onChange={e => handleChange(e.target, index)}
                            onFocus={(e) => e.target.select()}
                            className="codeInput"
                        />
                    ))}
                </form>
                <button type="submit" onClick={handleVerifyCode}>Verifică Codul</button>
                {errorMessage && <div style={{ color: 'red' }}>{errorMessage}</div>}
            </div>
        </div>
    );
}

export default EnterCode;