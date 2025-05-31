# 🎮 GameDev Shop - Backend

Benvenuto nel backend di **GameDev Shop**, una piattaforma e-commerce per la vendita di videogiochi.  
Questo progetto è stato sviluppato come capstone finale del corso Full Stack Web Developer.

---

## 🚀 Descrizione del Progetto

GameDev Shop permette agli utenti di:

- Registrarsi e accedere
- Navigare e acquistare videogiochi
- Effettuare pagamenti tramite Stripe
- Ricevere conferme via email
- Usare pannelli Admin per la gestione dei giochi
- Vedere gli ordini effettuati
- Gestire i webhook Stripe tramite ngrok in ambiente di sviluppo

Il backend è costruito con un'architettura **sicura**, **scalabile** e **completamente testata**.

---

## 🛠️ Tecnologie Utilizzate

- **Node.js** + **Express.js**
- **MongoDB** + **Mongoose**
- **JWT** & **bcrypt.js** per autenticazione
- **Stripe API** + **Webhook Stripe**
- **Nodemailer** per email automatiche
- **Cloudinary** per upload immagini
- **Swagger** per documentazione API
- **Jest** + **Supertest** per test automatici
- **ngrok** per tunneling del webhook Stripe

---

## 📁 Struttura delle Cartelle  
backend/
├── config/ # Configurazioni (DB, Swagger, Cloudinary)
├── controllers/ # Logica di business (auth, games, orders, stripe)
├── middleware/ # Middleware custom (auth, isAdmin, upload)
├── models/ # Modelli Mongoose (User, Game, Order)
├── routes/ # API REST (auth, games, orders, stripe)
├── tests/ # Test con Jest + Supertest
├── utils/ # Utility (mailer con Nodemailer)
├── .env # Variabili ambiente
├── .env.test # Variabili ambiente per test
├── server.js # Entry point dell’app
└── README.md # Documentazione del progetto


---


## 🧪 Come Avviare il Progetto in Locale

> Assicurati di avere **Node.js**, **MongoDB Atlas** e **ngrok** installati

### 1. Clona il repository

```bash
git clone https://github.com/tuo-username/backend-gamedev.git
cd backend-gamedev

2. Installa le dipendenze
npm install

3. Configura il file .env
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

5. Avvia ngrok per Stripe Webhook
ngrok http 5000
🔗 Copia l’URL generato (es: https://xxxx-xx-xx.ngrok-free.app)
Vai su Stripe Webhooks e imposta questo endpoint:https://xxxx-xx-xx.ngrok-free.app/api/checkout/webhook
⚠️ Ricorda: l’URL cambia ogni volta che riavvii ngrok. Aggiorna Stripe ogni volta!.

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
📧 jose_R_licona12@hotmail.com