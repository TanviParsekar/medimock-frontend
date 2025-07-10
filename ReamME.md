# MediMock - Frontend

MediMock is a Mock AI-powered symptom checker. It simulates symptom tracking, charting, and admin user management using mock data and dummy responses.  This is the **frontend** built with **React**, **TypeScript**, **Material UI**, and **Zod** for validation.

---

## 🚀 Features

- JWT-based Authentication (Register/Login)
- Role-based access (Admin / User)
- Symptom submission with AI mock response
- Symptom analytics with bar chart (monthly analytics)
- Profile update (name/password)
- Admin Panel to manage users (promote/demote/delete)
- Modern responsive UI with Material UI
- Form validation using `react-hook-form` + `zod`

---

## 📦 Tech Stack

- React 18 + Vite
- TypeScript
- Material UI
- React Router
- React Hook Form
- Zod
- Axios
- Chart (MUI X Charts)

---

## 📂 Folder Structure

src/
├── components/
│ └── Navbar, LoginForm, RegisterForm, SymptomForm, SymptomChart, ...
├── context/
│ └── AuthContext.tsx, AuthProvider.tsx
├── hooks/
│ └── useAuth.ts
├── pages/
│ └── Dashboard, Profile, Symptom, AdminPanel, Login, Register
├── utils/
│ └── axios.ts
├── App.tsx
├── main.tsx

---

## 🛠️ Setup Instructions

1. **Clone the repo:**
   ```bash
   git clone https://github.com/your-username/MediMock.git
   cd MediMock
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```

# 👨‍⚕️ Roles

User: Can view dashboard, submit symptoms, update profile

Admin: Has full user management access via Admin Panel
