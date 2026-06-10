
<br>

<p align="center">
  <img src="https://img.shields.io/badge/SAT-400–800-blue?style=flat-square" />
  <img src="https://img.shields.io/badge/CLEP-35–80-green?style=flat-square" />
  <img src="https://img.shields.io/badge/AP-2–5-red?style=flat-square" />
  <img src="https://img.shields.io/badge/license-MIT-lightgrey?style=flat-square" />
</p>

<h1 align="center">Tawjehi Calculator</h1>
<p align="center">
  <strong>Score Conversion & Equivalency Averaging Tool</strong><br>
  Converts SAT, CLEP, and AP scores to a unified percentage scale and calculates a composite average across 6 exams.
</p>

<br>

---

## How It Works

You input **6 exam scores** — 2 SAT (English + Math) and 4 additional (CLEP or AP). Each raw score is mapped to a percentage using standardized conversion tables. The final **Equivalency Average** is the mean of all 6 mapped percentages.

```
Equivalency Average = (SAT_Eng% + SAT_Math% + Exam_1% + Exam_2% + Exam_3% + Exam_4%) / 6
```

---

## Conversion Tables

### SAT → Percentage

| SAT Score | %     | SAT Score | %     | SAT Score | %     | SAT Score | %     |
|-----------|-------|-----------|-------|-----------|-------|-----------|-------|
| 400       | 65%   | 500       | 77%   | 600       | 87%   | 700       | 97%   |
| 410       | 66%   | 510       | 78%   | 610       | 88%   | 710       | 98%   |
| 420       | 67%   | 520       | 79%   | 620       | 89%   | 720       | 98%   |
| 430       | 68%   | 530       | 80%   | 630       | 90%   | 730       | 98%   |
| 440       | 69%   | 540       | 81%   | 640       | 91%   | 740       | 99%   |
| 450       | 70%   | 550       | 82%   | 650       | 92%   | 750       | 99%   |
| 460       | 71%   | 560       | 83%   | 660       | 93%   | 760       | 99%   |
| 470       | 72%   | 570       | 84%   | 670       | 94%   | 770       | 99%   |
| 480       | 73%   | 580       | 85%   | 680       | 95%   | 780       | 100%  |
| 490       | 74%   | 590       | 86%   | 690       | 96%   | 790       | 100%  |
|           |       |           |       |           |       | 800       | 100%  |

**Range:** 400 – 800 &nbsp;·&nbsp; **Increment:** 10 &nbsp;·&nbsp; **Output:** 65% – 100%

---

### CLEP → Percentage

| CLEP Score | %     | CLEP Score | %     | CLEP Score | %     | CLEP Score | %     |
|------------|-------|------------|-------|------------|-------|------------|-------|
| 35         | 65%   | 45         | 75%   | 55         | 84%   | 65         | 91%   |
| 36         | 66%   | 46         | 76%   | 56         | 85%   | 66         | 92%   |
| 37         | 67%   | 47         | 77%   | 57         | 85%   | 67         | 92%   |
| 38         | 68%   | 48         | 78%   | 58         | 86%   | 68         | 93%   |
| 39         | 69%   | 49         | 79%   | 59         | 87%   | 69         | 94%   |
| 40         | 70%   | 50         | 80%   | 60         | 87%   | 70         | 94%   |
| 41         | 71%   | 51         | 81%   | 61         | 88%   | 71         | 95%   |
| 42         | 72%   | 52         | 82%   | 62         | 89%   | 72         | 96%   |
| 43         | 73%   | 53         | 83%   | 63         | 90%   | 73         | 97%   |
| 44         | 74%   | 54         | 83%   | 64         | 90%   | 74         | 98%   |

| 75–76      | 99%   | 77–80      | 100%  |

---

### AP → Percentage

| AP Score | %     |
|----------|-------|
| 2        | 77%   |
| 3        | 89%   |
| 4        | 96%   |
| 5        | 100%  |

---

## Stack

- **React 19** + **TypeScript**
- **Vite 6** — dev server & build
- **Tailwind CSS 4** — styling
- **jsPDF** — score report PDF export
- **Framer Motion** — animations

---

## Run Locally

```bash
npm install
npm run dev
```

Opens at `http://localhost:3000`.

---

## License

MIT
