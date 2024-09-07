import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import "../styles/Login.scss";
import { setLogin } from "../redux/state";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { auth, googleProvider } from "../firebase_googleauth/firebase.config";
import { signInWithPopup } from "firebase/auth";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordShown, setPasswordShown] = useState(false);
  const [error, setError] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setPasswordShown(passwordShown => !passwordShown);
  };


  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      console.log("User ID before API request:", user?._id);

      const response = await fetch('http://localhost:3001/auth/google-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user.email, name: user.displayName, googleId: user.uid, picture: user.photoURL })
      });

      if (!response.ok) {
        const responseText = await response.text();
        throw new Error(`${response.status}, ${responseText}`);
      }
      const data = await response.json();
      console.log("User object after login:", data.user);
      dispatch(setLogin({ user: data.user, token: data.token }));
      navigate("/");

    } catch (error) {
      console.error("Failed to authenticate with Google", error);

    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch("http://localhost:3001/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error('Autentificare eșuată. Verificați emailul și parola.');
      }

      const loggedIn = await response.json();
      if (loggedIn) {
        dispatch(
          setLogin({
            user: loggedIn.user,
            token: loggedIn.token,
          })
        );
        navigate("/");
      }
    } catch (err) {
      console.log("Login failed", err.message);
    }
  };

  return (
    <div className="login">
      <div className="login_content">
        <form className="login_content_form" onSubmit={handleSubmit}>
          <div className="input-icon-group">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <FontAwesomeIcon icon={faEnvelope} className="icon" />
          </div>
          <div className="input-icon-group">
            <input
              type={passwordShown ? "text" : "password"}
              placeholder="Parolă"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <span onClick={togglePasswordVisibility} className="password-visibility-icon">
              <FontAwesomeIcon icon={passwordShown ? faEyeSlash : faEye} />
            </span>
          </div>
          {error && <div className="error-message">{error}</div>}
          <button type="submit">Autentificare</button>

        </form>
        <p>sau </p>
        <div className="login_content_google">
          <button
            className="login-with-google"
            onClick={handleGoogleLogin}>
            Continuă cu Google
          </button>
        </div>
        <a href="/forgot-password">Ai uitat parola?</a>
        <a href="/register">Nu ai încă cont? Înregistrează-te Aici</a>

      </div>
    </div>
  );
};

export default LoginPage;