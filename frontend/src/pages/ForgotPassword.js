import { useState } from 'react';
import axios from 'axios';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/auth/request-reset`, { email });
      setMessage('Email inviata! Controlla la tua casella di posta.');
    } catch (err) {
      setMessage(err.response?.data?.error || 'Errore durante l\'invio.');
    }
  };

  return (
    <div className="container mt-5">
      <h2>Recupera password</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          className="form-control my-2"
          placeholder="Inserisci la tua email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button className="btn btn-primary">Invia</button>
      </form>
      {message && <p className="mt-3">{message}</p>}
    </div>
  );
}

export default ForgotPassword;
