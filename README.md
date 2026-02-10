# 🌍 Anime World

Una piattaforma moderna per scoprire, cercare e salvare i tuoi anime preferiti! Costruita con il miglior stack web moderno.

![Status](https://img.shields.io/badge/status-in%20development-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Node.js](https://img.shields.io/badge/node.js-18+-green)

## ✨ Features

- 🔐 **Autenticazione Sicura** - Login/Signup con JWT e HTTP-only cookies
- 🔍 **Ricerca Anime** - Cerca i tuoi anime preferiti in tempo reale
- ❤️ **My Anime List** - Salva e gestisci i tuoi anime preferiti
- 🎨 **UI Moderna** - Interfaccia pulita e responsiva con Material-UI
- 🌙 **Design Accattivante** - Tema dark con gradients affascinanti
- 📱 **Mobile Responsive** - Perfetto su ogni dispositivo
- ⚡ **Performance** - Server veloce con caching intelligente

## 🛠️ Stack Tecnologico

### Frontend

- **Next.js 15** - Framework React moderno
- **React 19** - UI library
- **Tailwind CSS** - Styling utility-first
- **Material-UI** - Componenti eleganti
- **JavaScript/JSX** - Linguaggio principale

### Backend

- **Express.js** - Server Node.js leggero e veloce
- **PostgreSQL** - Database robusto (Neon)
- **Prisma ORM** - Gestione del database
- **JWT** - Autenticazione sicura
- **Bcrypt** - Hashing delle password

## 📦 Requisiti

- Node.js 18+
- npm o yarn
- Database PostgreSQL (Neon consigliato)

## 🚀 Getting Started

### 1. Clonare il repository

```bash
git clone https://github.com/your-username/anime-world.git
cd anime-world
```

### 2. Setup Backend

```bash
cd backend
npm install

# Crea il file .env
cat > .env << EOF
PORT=5000
FRONTEND_URL="http://localhost:3000"
NODE_ENV="development"
DATABASE_URL="postgresql://user:password@host/database"
JWT_SECRET="your-secret-key-here"
EOF

# Configura il database
npx prisma migrate dev --name init

# Avvia il backend
npm run dev
```

Server sarà disponibile su `http://localhost:5000`

### 3. Setup Frontend

```bash
npm install

# Crea il file .env.local
cat > .env.local << EOF
NEXT_PUBLIC_API_URL=http://localhost:5000
EOF

# Avvia il frontend
npm run dev
```

Frontend sarà disponibile su `http://localhost:3000`

## 📂 Struttura del Progetto

```
anime-world/
├── backend/
│   ├── config/              # Configurazione database
│   ├── controllers/         # Logica di autenticazione
│   ├── middleware/          # Verifiche JWT
│   ├── routes/              # Definizione endpoints
│   ├── utils/               # Utilità (generazione token)
│   ├── prisma/              # Schema database
│   ├── server.js            # Entry point
│   └── .env                 # Variabili d'ambiente
│
├── src/
│   ├── app/
│   │   ├── (auth)/          # Pagine login/signup
│   │   ├── anime/           # Pagine anime
│   │   ├── api/             # API routes
│   │   ├── layout.js        # Layout principale
│   │   └── page.js          # Home page
│   ├── components/          # Componenti React
│   │   ├── atoms/           # Componenti piccolissimi
│   │   ├── molecules/       # Componenti semplici
│   │   └── organisms/       # Componenti complessi
│   ├── services/            # Utility per API
│   └── .env.local           # Variabili frontend
│
├── public/                  # File statici
└── README.md                # Questo file
```

## 🔐 Autenticazione

L'app usa **JWT (JSON Web Tokens)** con **HTTP-only cookies** per massima sicurezza:

1. L'utente fa login/signup
2. Backend genera un JWT e lo invia nel cookie
3. Il browser salva il cookie automaticamente
4. Ogni richiesta include il cookie
5. Backend verifica il token prima di rispondere

Leggi la [Guida completa](./GUIDA_COMPLETA_AUTENTICAZIONE.txt) per i dettagli tecnici.

## 📡 API Endpoints

### Authentication Routes

```bash
# Registrazione
POST /api/auth/signup
Content-Type: application/json
{
  "email": "user@example.com",
  "password": "password123"
}

# Login
POST /api/auth/login
Content-Type: application/json
{
  "email": "user@example.com",
  "password": "password123"
}

# Logout
POST /api/auth/logout

# Get Current User (Protected)
GET /api/auth/me
Authorization: Bearer <token>
```

## 🧪 Testing

### Test Signup

1. Vai a `http://localhost:3000/signup`
2. Inserisci email e password
3. Verifica il reindirizzamento a `/my-list`
4. Controlla che "Logout" appaia nella Navbar

### Test Login

1. Vai a `http://localhost:3000/login`
2. Inserisci le credenziali
3. Verifica il reindirizzamento a `/my-list`

### Test Logout

1. Clicca "Logout" nella Navbar
2. Verifica che "Login" e "SignUp" riappaiano

## 🎨 Customizzazione

### Colori e Tema

I colori principale si trovano in:

- `src/components/Navbar/Navbar.jsx` - Header styling
- `tailwind.config.js` - Configurazione Tailwind

### Font

Personalizza i font in `src/app/layout.js`

## 🐛 Troubleshooting

### ❌ "Error: Cannot find module"

```bash
# Reinstalla i pacchetti
npm install
```

### ❌ "CORS Error"

- Verifica che il backend sia in esecuzione
- Controlla `FRONTEND_URL` in `backend/.env`

### ❌ "JWT Error"

- Verifica che `NODE_ENV=development` nel backend
- Controlla che il `JWT_SECRET` sia impostato

### ❌ "Database Connection Error"

- Verifica `DATABASE_URL` nel `.env`
- Assicurati che il database sia raggiungibile

## 📚 Documentazione Completa

Per una guida dettagliata su come funziona l'autenticazione, vedi:
→ [GUIDA_COMPLETA_AUTENTICAZIONE.txt](./GUIDA_COMPLETA_AUTENTICAZIONE.txt)

## 🤝 Contribuire

Pull request sono benvenute!

1. Fork il repository
2. Crea un branch per la tua feature (`git checkout -b feature/AmazingFeature`)
3. Commit i tuoi cambiamenti (`git commit -m 'Add AmazingFeature'`)
4. Push al branch (`git push origin feature/AmazingFeature`)
5. Apri una Pull Request

## 📄 Licenza

Questo progetto è under the MIT License - vedi il file [LICENSE](LICENSE) per i dettagli.

## 👨‍💻 Autore

Creato con ❤️ da un appassionato di anime (e di coding)

## 🔗 Links Utili

- [Next.js Documentation](https://nextjs.org/docs)
- [Express Documentation](https://expressjs.com/)
- [Prisma Documentation](https://www.prisma.io/docs/)
- [JWT Documentation](https://jwt.io/)

---

**Buon divertimento con Anime World!** 🎌
