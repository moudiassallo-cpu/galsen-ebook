# 📚 GALSEN EBOOK

## 🚀 Utilisation rapide (Frontend seul)
Ouvrez simplement `frontend/index.html` dans votre navigateur.

**Compte admin demo:** `admin@galsen.com` / `admin123`

## 🖥️ Backend Node.js
```bash
cd backend
cp .env.example .env
npm install
npm start
```
Accès: http://localhost:5000

## 📡 API
- POST /api/auth/register
- POST /api/auth/login
- GET /api/ebooks
- GET /api/ebooks/:id
- POST /api/ebooks (admin)
- PUT /api/ebooks/:id (admin)
- DELETE /api/ebooks/:id (admin)
