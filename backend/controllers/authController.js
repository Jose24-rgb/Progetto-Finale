const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const transporter = require('../utils/mailer');

exports.register = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const hashed = await bcrypt.hash(password, 10);
    const verificationToken = crypto.randomBytes(32).toString('hex');
    console.log('🔐 TOKEN CREATO:', verificationToken); // <-- LOG per debug

    const newUser = await User.create({
      username,
      email,
      password: hashed,
      verificationToken,
      isVerified: false
    });

    const verifyLink = `http://localhost:3000/verify-email?token=${verificationToken}&email=${email}`;

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Verifica il tuo indirizzo email',
      html: `<p>Clicca il link per verificare il tuo account:</p><a href="${verifyLink}">${verifyLink}</a>`
    });

    res.status(201).json({ message: 'Registrazione completata. Controlla la tua email per la verifica.' });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Email o username già in uso' });
    }
    console.error('❌ Errore nella registrazione:', err);
    res.status(500).json({ error: 'Registration failed' });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password)))
      return res.status(401).json({ error: 'Invalid credentials' });

    if (!user.isVerified) {
      return res.status(403).json({ error: 'Verifica prima la tua email.' });
    }

    const token = jwt.sign(
      { id: user._id, isAdmin: user.isAdmin },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({ token, user: { id: user._id, username: user.username, isAdmin: user.isAdmin } });
  } catch (err) {
    res.status(500).json({ error: 'Login failed' });
  }
};

exports.verifyEmail = async (req, res) => {
  const { email, token } = req.query;
  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ error: 'Utente non trovato' });
    }

    if (user.isVerified) {
      return res.json({ message: 'Email già verificata.' });
    }

    if (!user.verificationToken || user.verificationToken !== token) {
      return res.status(400).json({ error: 'Token non valido o scaduto' });
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    await user.save();

    res.json({ message: 'Email verificata con successo. Ora puoi effettuare il login.' });
  } catch (err) {
    res.status(500).json({ error: 'Errore durante la verifica' });
  }
};



exports.requestPasswordReset = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: 'Utente non trovato' });

    const token = crypto.randomBytes(32).toString('hex');
    user.resetToken = token;
    user.resetExpires = Date.now() + 3600000;
    await user.save();

    const link = `http://localhost:3000/reset-password?token=${token}&email=${email}`;

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Reset password',
      html: `<p>Clicca il link per resettare la tua password:</p><a href="${link}">${link}</a>`
    });

    res.json({ message: 'Email per il reset inviata' });
  } catch (err) {
    console.error('❌ Errore richiesta reset:', err);
    res.status(500).json({ error: 'Errore durante la richiesta reset' });
  }
};


exports.resetPassword = async (req, res) => {
  const { email, token, newPassword } = req.body;
  try {
    const user = await User.findOne({
      email,
      resetToken: token,
      resetExpires: { $gt: Date.now() }
    });

    if (!user) return res.status(400).json({ error: 'Token non valido o scaduto' });

    user.password = await bcrypt.hash(newPassword, 10);
    user.resetToken = undefined;
    user.resetExpires = undefined;
    await user.save();

    res.json({ message: 'Password aggiornata con successo' });
  } catch (err) {
    console.error('❌ Errore reset password:', err);
    res.status(500).json({ error: 'Errore durante il reset della password' });
  }
};



