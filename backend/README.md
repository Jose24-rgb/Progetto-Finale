# 🎮 GameDev Shop - Backend

Benvenuto nel backend di **GameDev Shop**, una piattaforma e-commerce per la vendita di videogiochi. Questo progetto è stato sviluppato come capstone finale del corso Full Stack Web Developer.

---

## 🚀 Descrizione del Progetto

GameDev Shop permette agli utenti di:

- Registrarsi e accedere
- Navigare e acquistare videogiochi
- Effettuare pagamenti tramite Stripe
- Ricevere conferme via email
- Usare pannelli Admin per la gestione dei giochi
- Vedere gli ordini effettuati

Tutto questo con un'architettura sicura, moderna e testata.

---

## 🛠️ Tecnologie Utilizzate

- **Node.js** + **Express.js**
- **MongoDB** + **Mongoose**
- **JWT** & **bcrypt.js** per autenticazione
- **Stripe API** per i pagamenti
- **Nodemailer** per email
- **Cloudinary** per l'upload immagini
- **Swagger** per la documentazione API
- **Jest** + **Supertest** per i test.

## 📁 Struttura delle Cartelle
backend/
│
├── config/ # Configurazioni (DB, Swagger, Cloudinary)
├── controllers/ # Logica di business (auth, games, orders, stripe)
├── middleware/ # Middleware custom (auth, isAdmin, upload)
├── models/ # Modelli Mongoose (User, Game, Order)
├── routes/ # API routes (auth, games, orders, stripe)
├── tests/ # Test automatici con Jest + Supertest
├── utils/ # Utility (mailer nodemailer)
├── .env # Variabili ambiente (produzione)
├── .env.test # Variabili ambiente (test)
├── server.js # Punto di ingresso dell'app
└── README.md # Questo file


---

## 🧪 Come Avviare il Progetto in Locale

> Assicurati di avere **Node.js** e **MongoDB Atlas URI** validi.

### 1. Clona il repository
```bash
git clone https://github.com/tuo-username/backend-gamedev.git
cd backend-gamedev

2. Installa le dipendenze
npm install

3. Configura le variabili ambiente
PORT=5000
MONGO_URI=your_mongo_uri
JWT_SECRET=your_jwt_secret
STRIPE_SECRET_KEY=your_stripe_key
STRIPE_WEBHOOK_SECRET=your_webhook_secret
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
EMAIL_USER=your_email
EMAIL_PASS=your_email_pass

4. Avvia il server
npm run dev

5. Avvia i test
npm test

✅ Test Coperti
Login / Register
Protezione Token
Creazione ordini
Sessioni Stripe
Errori edge-case gestiti
CRUD giochi (Admin)

📘 API Documentation
http://localhost:5000/api-docs

Sviluppato da José Bueso
📧 josephbueso1997al@gmail.com
    jose_R_licona12@hotmail.com