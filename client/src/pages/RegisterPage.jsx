import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faLock, faUser } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom"
import "../styles/Register.scss";

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    profileImage: null,
  });
  const [passwordError, setPasswordError] = useState("");
  const [passwordMatch, setPasswordMatch] = useState(true);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: value,
      [name]: name === "profileImage" ? files[0] : value,
    });
  };
  const validatePassword = (password) => {
    const regex = /^(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{5,10}$/;
    return regex.test(password);
  };

  useEffect(() => {
    setPasswordMatch(formData.password === formData.confirmPassword || formData.confirmPassword === "");
  }, [formData.password, formData.confirmPassword]);

  useEffect(() => {
    if (validatePassword(formData.password) || formData.password === "") {
      setPasswordError("");
    } else {
      setPasswordError("Parola trebuie să fie între 5-10 caractere, să conțină minim o literă mare și o cifră.");
    }
  }, [formData.password]);

  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!passwordError && passwordMatch) {
      try {
        const register_form = new FormData()

        Object.keys(formData).forEach(key => {
          if (key === 'profileImage' && formData[key]) {
            register_form.append(key, formData[key]);
          } else {
            register_form.append(key, formData[key]);
          }
        });
        const response = await fetch("http://localhost:3001/auth/register", {
          method: "POST",
          body: register_form
        });

        if (response.ok) {
          navigate("/login")
        }
      } catch (err) {
        console.log("Registration failed", err.message)
      }
    }
  };

  return (
    <div className="register">
      <div className="register_content">
        <form className="register_content_form" onSubmit={handleSubmit}>
          <div className="input-icon-group">
            <input
              placeholder="Prenume"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
            />
            <FontAwesomeIcon icon={faUser} />
          </div>
          <div className="input-icon-group">
            <input
              placeholder="Nume"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              required
            />
            <FontAwesomeIcon icon={faUser} />
          </div>
          <div className="input-icon-group">
            <input
              placeholder="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <FontAwesomeIcon icon={faEnvelope} />
          </div>

          <div className="input-icon-group">
            <input
              placeholder="Parola"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <FontAwesomeIcon icon={faLock} />
          </div>

          <div className="input-icon-group">
            <input
              placeholder="Confirmă Parola"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
            <FontAwesomeIcon icon={faLock} />
          </div>

          {!passwordMatch && <p style={{ color: "red" }}>Parolele nu coincid!</p>}
          {passwordError && <p style={{ color: "red" }}>{passwordError}</p>}

          <input
            id="image"
            type="file"
            name="profileImage"
            accept="image/*"
            style={{ display: "none" }}
            onChange={handleChange}
            required
          />
          <label htmlFor="image">
            <img src="/assets/addImage.png" alt="add profile" />
            <p>Încarcă de pe dispozitivul tău</p>
          </label>

          {formData.profileImage && (
            <img
              src={URL.createObjectURL(formData.profileImage)}
              alt="profile preview"
              style={{ maxWidth: "80px" }}
            />
          )}
          <button type="submit" disabled={!passwordMatch || passwordError}>Înregistrare</button>
        </form>
        <a href="/login">Ai deja cont? Loghează-te Aici</a>
      </div>
    </div>
  );
};

export default RegisterPage;