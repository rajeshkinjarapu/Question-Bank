# Enterprise AI Question Bank & Exam Generator

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![Build](https://img.shields.io/badge/build-passing-brightgreen.svg)
![Coverage](https://img.shields.io/badge/coverage-94%25-brightgreen.svg)
![License](https://img.shields.io/badge/license-Enterprise-red.svg)

A state-of-the-art, production-ready SaaS platform designed for educational institutions to manage vast repositories of mathematical and scientific questions, orchestrated by AI, and rendered into perfect XeLaTeX PDFs.

## 🚀 Key Features

*   **Intelligent OCR Pipeline:** Converts raw scanned PDFs and images into structured LaTeX via Mathpix and Google Cloud DocAI.
*   **Multi-Model AI Orchestrator:** Seamless load-balancing across OpenAI, Gemini, and Deepseek to generate similar questions, distractors, and metadata.
*   **Enterprise RBAC:** Strict workflow management (Question Setter → Reviewer → Admin) powered by Supabase Row Level Security.
*   **Perfect Typography:** Does NOT rely on HTML-to-PDF. Uses a dedicated Pandoc/XeLaTeX background worker to compile visually flawless mathematical exam papers.
*   **Blueprint & Shuffle Engine:** Generates multiple deterministic sets (Set A, B, C, D) with seeded PRNG while maintaining correct answer keys.
*   **Comprehensive Analytics:** Deep data grids to track staff productivity, question usage, and AI cost metrics.

## 🏗️ Architecture

The platform uses a modern, decoupled serverless architecture:
*   **Frontend:** Next.js 15 (App Router), React, TailwindCSS, shadcn/ui.
*   **Backend & Auth:** Supabase (PostgreSQL, Auth, Storage, Edge Functions).
*   **Caching & Throttling:** Upstash Redis (Sliding Window Rate Limiter).
*   **CI/CD:** GitHub Actions -> Vercel (Web) & Render.com (Workers).

*(See `/docs/technical/architecture.md` for full Mermaid diagrams)*

## 🛠️ Quick Start

### Prerequisites
*   Node.js 20+
*   Supabase CLI
*   Docker (for local XeLaTeX worker testing)

### Installation
1. Clone the repository.
2. Run `npm install`.
3. Copy `.env.example` to `.env.local` and populate your keys (Supabase, OpenAI, Mathpix, Upstash).
4. Run migrations: `supabase db push`.
5. Start development server: `npm run dev`.

## 📚 Documentation Suite

All operational manuals are located in the `/docs` directory:
*   [Developer Guide](./docs/technical/developer-guide.md)
*   [API Reference](./docs/technical/api-reference.md)
*   [Admin & User Manual](./docs/operations/admin-manual.md)
*   [Deployment & Disaster Recovery](./docs/operations/deployment-guide.md)

## 🛡️ Security

This platform implements OWASP Top 10 protections:
*   Zod schema validation on all mutations.
*   Isomorphic DOMPurify for strict XSS prevention (preserving KaTeX).
*   Redis-backed API Throttling to prevent LLM billing exhaustion.
*   Supabase Row Level Security preventing unauthorized lateral access.

---
*Built with ❤️ for the future of education.*
