<div align="center">
  
# 🚀 Pranav R Portfolio & Personal CMS

![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Deployment](https://img.shields.io/badge/Deploy-Netlify-black?style=for-the-badge&logo=netlify)
![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)
![Status](https://img.shields.io/badge/Status-Active-success?style=for-the-badge)

A modern, highly scalable, and fully responsive **Personal Portfolio and Content Management System (CMS)** built from the ground up. Designed to showcase projects, manage technical blogs, handle contact inquiries, and track analytics—all through a secure admin dashboard.

</div>

---

## 🌟 Key Features

### 🧑‍💻 Public Portfolio
- **Dynamic Content:** Showcases Projects, Blogs, Certificates, and Experiences pulled in real-time from the database.
- **Modern UI/UX:** Glassmorphism design, sleek typography, dynamic scroll animations, and fully responsive layouts.
- **Dark/Light Mode:** Seamless theme switching with system-preference detection and local storage persistence.
- **SEO Optimized:** Dynamic JSON-LD structured data generation, custom metadata, and `llms.txt` integration for AI crawlers.

### 🔐 Secure Admin Dashboard
- **Content Management:** Create, edit, draft, publish, archive, and restore Blogs, Projects, and Certificates effortlessly.
- **Media Storage:** Integrated directly with Supabase Storage for fast image and file uploads.
- **Activity Tracking:** Comprehensive activity logs for all CMS actions and incoming user interactions.
- **Analytics & Insights:** Visual dashboards for tracking site traffic, engagement metrics, and contact submissions.

---

## 💻 Tech Stack

- **Frontend Core:** [Next.js 14](https://nextjs.org/) (App Router), [React.js](https://reactjs.org/), [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/), Vanilla CSS modules, Framer Motion (Animations)
- **Backend & Auth:** [Supabase](https://supabase.com/) (PostgreSQL, Edge Functions, Row Level Security)
- **Hosting & CI/CD:** [Netlify](https://www.netlify.com/) (Frontend), GitHub Actions (Automated Workflows)

---

## 📁 Project Structure

```text
pranav-r-portfolio/
├── app/               # Next.js App Router (Pages, Layouts, API Routes)
├── components/        # Reusable React components (UI, Sections, Admin)
├── lib/               # Utility functions and Supabase client configuration
├── public/            # Static assets (Images, Icons, llms.txt, Resume)
├── supabase/          # Database migrations, schema, and trigger definitions
└── .github/workflows/ # GitHub Actions CI/CD and Keep-Alive scripts
```

---

## 🤝 Connect with Me

- **LinkedIn:** [linkedin.com/in/pranavr06](https://linkedin.com/in/pranavr06/)
- **GitHub:** [github.com/Pranavr06](https://github.com/Pranavr06)
- **Portfolio:** [pranavr.netlify.app](https://pranavr.netlify.app)

---

## 🙏 Acknowledgements

The initial UI/UX design and structure of this portfolio were inspired by an excellent [YouTube tutorial by JavaScript Mastery](https://www.youtube.com/watch?v=ldwlOzRvYOU). From that foundation, I heavily expanded the project by implementing a fully custom Next.js App Router architecture, a complete Supabase backend, a custom secure Admin CMS dashboard, dynamic SEO generation, and real-time activity logging.

---
*© Pranav R. All Rights Reserved.*
