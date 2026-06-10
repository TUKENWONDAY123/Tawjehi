<div align="center">

# 🧮 Tawjehi Calculator

**Score Conversion & Equivalency Averaging Tool** 📊

Convert SAT, CLEP, and AP scores to a unified percentage and compute a composite average across 6 exams.

[![SAT](https://img.shields.io/badge/SAT-400–800-1e40af?style=flat-square&logo=bookstack)](https://github.com/TUKENWONDAY123/Tawjehi)
[![CLEP](https://img.shields.io/badge/CLEP-35–80-15803d?style=flat-square&logo=bookstack)](https://github.com/TUKENWONDAY123/Tawjehi)
[![AP](https://img.shields.io/badge/AP-2–5-dc2626?style=flat-square&logo=bookstack)](https://github.com/TUKENWONDAY123/Tawjehi)
[![React](https://img.shields.io/badge/React-19-61dafb?style=flat-square&logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178c6?style=flat-square&logo=typescript)](https://www.typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-6-646cff?style=flat-square&logo=vite)](https://vitejs.dev)
[![License](https://img.shields.io/badge/license-MIT-f5f5f5?style=flat-square)](LICENSE)

</div>

---

## ⚙️ How It Works

You enter **6 exam scores** — 2 SAT (English & Math) and 4 additional exams (each can be CLEP or AP). Each raw score is automatically mapped to a percentage using the conversion tables below. The app calculates your **Equivalency Average** as the mean of all 6 mapped percentages.

```
📐 Equivalency Average = (SAT_Eng% + SAT_Math% + Exam1% + Exam2% + Exam3% + Exam4%) / 6
```

Once you're satisfied, hit **Save Score** 📄 to export a clean PDF report.

---

## 📋 Conversion Tables

### 📘 SAT → Percentage

| Score | % | Score | % | Score | % | Score | % | Score | % |
|------|---|------|---|------|---|------|---|------|---|
| 400 | 65% | 480 | 73% | 560 | 83% | 640 | 91% | 720 | 98% |
| 410 | 66% | 490 | 74% | 570 | 84% | 650 | 92% | 730 | 98% |
| 420 | 67% | 500 | 77% | 580 | 85% | 660 | 93% | 740 | 99% |
| 430 | 68% | 510 | 78% | 590 | 86% | 670 | 94% | 750 | 99% |
| 440 | 69% | 520 | 79% | 600 | 87% | 680 | 95% | 760 | 99% |
| 450 | 70% | 530 | 80% | 610 | 88% | 690 | 96% | 770 | 99% |
| 460 | 71% | 540 | 81% | 620 | 89% | 700 | 97% | 780 | 100% |
| 470 | 72% | 550 | 82% | 630 | 90% | 710 | 98% | 790–800 | 100% |

<br>

### 📗 CLEP → Percentage

| Score | % | Score | % | Score | % | Score | % | Score | % |
|------|---|------|---|------|---|------|---|------|---|
| 35 | 65% | 44 | 74% | 53 | 83% | 62 | 89% | 71 | 95% |
| 36 | 66% | 45 | 75% | 54 | 83% | 63 | 90% | 72 | 96% |
| 37 | 67% | 46 | 76% | 55 | 84% | 64 | 90% | 73 | 97% |
| 38 | 68% | 47 | 77% | 56 | 85% | 65 | 91% | 74 | 98% |
| 39 | 69% | 48 | 78% | 57 | 85% | 66 | 92% | 75–76 | 99% |
| 40 | 70% | 49 | 79% | 58 | 86% | 67 | 92% | 77–80 | 100% |
| 41 | 71% | 50 | 80% | 59 | 87% | 68 | 93% | | |
| 42 | 72% | 51 | 81% | 60 | 87% | 69 | 94% | | |
| 43 | 73% | 52 | 82% | 61 | 88% | 70 | 94% | | |

<br>

### 📕 AP → Percentage

| Score | % |
|-------|---|
| 2     | 77% |
| 3     | 89% |
| 4     | 96% |
| 5     | 100% |

---

## 🚀 Quick Start

```bash
npm install
npm run dev
```

Opens at `http://localhost:3000`. 🎯

### ⌨️ Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server (port 3000) |
| `npm run build` | Production build → `dist/` |
| `npm run preview` | Preview production build |

---

## 🛠️ Stack

<div align="center">

| Frontend | Build | Styling | PDF | Animation |
|----------|-------|---------|-----|-----------|
| React 19 | Vite 6 | Tailwind CSS 4 | jsPDF 4 | Framer Motion |

</div>

---

<div align="center">
  <sub>Built with TypeScript 💙 &nbsp;·&nbsp; Licensed under MIT 📄</sub>
</div>
