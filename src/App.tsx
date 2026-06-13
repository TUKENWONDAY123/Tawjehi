import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  RotateCcw, 
  Check, 
  Compass,
  Download,
} from 'lucide-react';
import { 
  SAT_CONVERSION, 
  CLEP_CONVERSION, 
  AP_CONVERSION, 
  getSatEnglishStatus, 
  getAdditionalExamStatus 
} from './data';

const CLEP_EXAMS = [
  { category: 'History and Social Sciences', exams: [
    'American Government',
    'History of the United States I: Early Colonization to 1877',
    'History of the United States II: 1865 to the Present',
    'Human Growth and Development',
    'Introduction to Educational Psychology',
    'Introductory Psychology',
    'Introductory Sociology',
    'Principles of Macroeconomics',
    'Principles of Microeconomics',
    'Social Sciences and History',
    'Western Civilization I: Ancient Near East to 1648',
    'Western Civilization II: 1648 to the Present',
  ]},
  { category: 'Composition and Literature', exams: [
    'American Literature',
    'Analyzing and Interpreting Literature',
    'College Composition',
    'College Composition Modular',
    'English Literature',
    'Humanities',
  ]},
  { category: 'Science and Mathematics', exams: [
    'Biology',
    'Calculus',
    'Chemistry',
    'College Algebra',
    'College Mathematics',
    'Natural Sciences',
    'Precalculus',
  ]},
  { category: 'Business', exams: [
    'Financial Accounting',
    'Information Systems',
    'Introductory Business Law',
    'Principles of Management',
    'Principles of Marketing',
  ]},
  { category: 'World Languages', exams: [
    'French Language: Levels 1 and 2',
    'German Language: Levels 1 and 2',
    'Spanish Language: Levels 1 and 2',
    'Spanish with Writing: Levels 1 and 2',
  ]},
];

const AP_EXAMS = [
  { category: 'Arts', exams: [
    'AP 2-D Art and Design',
    'AP 3-D Art and Design',
    'AP Drawing',
    'AP Art History',
    'AP Music Theory',
  ]},
  { category: 'English', exams: [
    'AP English Language and Composition',
    'AP English Literature and Composition',
  ]},
  { category: 'History and Social Sciences', exams: [
    'AP African American Studies',
    'AP Comparative Government and Politics',
    'AP European History',
    'AP Human Geography',
    'AP Macroeconomics',
    'AP Microeconomics',
    'AP Psychology',
    'AP United States Government and Politics',
    'AP United States History',
    'AP World History: Modern',
  ]},
  { category: 'Math and Computer Science', exams: [
    'AP Calculus AB',
    'AP Calculus BC',
    'AP Computer Science A',
    'AP Computer Science Principles',
    'AP Precalculus',
    'AP Statistics',
  ]},
  { category: 'Sciences', exams: [
    'AP Biology',
    'AP Chemistry',
    'AP Environmental Science',
    'AP Physics 1: Algebra-Based',
    'AP Physics 2: Algebra-Based',
    'AP Physics C: Electricity and Magnetism',
    'AP Physics C: Mechanics',
  ]},
  { category: 'World Languages and Cultures', exams: [
    'AP Chinese Language and Culture',
    'AP French Language and Culture',
    'AP German Language and Culture',
    'AP Italian Language and Culture',
    'AP Japanese Language and Culture',
    'AP Latin',
    'AP Spanish Language and Culture',
    'AP Spanish Literature and Culture',
  ]},
  { category: 'AP Capstone', exams: [
    'AP Research',
    'AP Seminar',
  ]},
  { category: 'AP Career Kickstart', exams: [
    'AP Business with Personal Finance',
    'AP Cybersecurity',
  ]},
];

interface AdditionalExam {
  type: 'AP' | 'CLEP';
  value: string;
  name: string;
}

const makeTimestamp = (date: Date = new Date()): string => {
  let hours = date.getHours();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12;
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const year = date.getFullYear();
  return `${hours.toString().padStart(2, '0')}:${minutes} ${ampm} ${month}/${day}/${year}`;
};

export default function App() {
  const [satEnglish, setSatEnglish] = useState<string>('600');
  const [satMath, setSatMath] = useState<string>('620');

  const [additionalExams, setAdditionalExams] = useState<AdditionalExam[]>([
    { type: 'CLEP', value: '50', name: '' },
    { type: 'CLEP', value: '50', name: '' },
    { type: 'CLEP', value: '50', name: '' },
    { type: 'CLEP', value: '50', name: '' },
  ]);

  const [saved, setSaved] = useState(false);
  const [generatedDate, setGeneratedDate] = useState(() => makeTimestamp());
  const [showExamNameModal, setShowExamNameModal] = useState(false);
  const [activeExamPicker, setActiveExamPicker] = useState<number | null>(null);
  const [showWelcome, setShowWelcome] = useState(true);

  // Input Validation and Real-Time Percentage lookups
  const engStatus = getSatEnglishStatus(satEnglish);
  const mathStatus = getSatEnglishStatus(satMath);
  
  const examStatuses = additionalExams.map((exam) => 
    getAdditionalExamStatus(exam.type, exam.value)
  );

  // Form check: returns true if all 6 inputs are filled and valid
  const isFormValid = !engStatus.isInvalid && 
                      satEnglish.trim() !== '' && 
                      !mathStatus.isInvalid && 
                      satMath.trim() !== '' && 
                      examStatuses.every((status, i) => !status.isInvalid && additionalExams[i].value.trim() !== '');

  // Live composite calculations based on valid form values
  const getCalculatedAverage = () => {
    if (!isFormValid) return null;

    const engPercent = engStatus.percent || 0;
    const mathPercent = mathStatus.percent || 0;
    
    const compiledExams = additionalExams.map((exam, idx) => {
      const status = examStatuses[idx];
      return {
        type: exam.type,
        rawVal: Number(exam.value),
        percent: status.percent || 0,
      };
    });

    const sum = engPercent + mathPercent + compiledExams.reduce((acc, ex) => acc + ex.percent, 0);
    const average = sum / 6;

    return {
      average,
      sum,
      engPercent,
      mathPercent,
      compiledExams,
    };
  };

  const calculatedInfo = getCalculatedAverage();

  // Perform full resets
  const handleResetInputs = () => {
    setSatEnglish('');
    setSatMath('');
    setAdditionalExams([
      { type: 'CLEP', value: '50', name: '' },
      { type: 'CLEP', value: '50', name: '' },
      { type: 'CLEP', value: '50', name: '' },
      { type: 'CLEP', value: '50', name: '' },
    ]);
  };

  const handleSaveCard = () => {
    if (!calculatedInfo) return;
    setShowExamNameModal(true);
  };

  const handleExamNameConfirm = async () => {
    setShowExamNameModal(false);
    await generatePDF();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const generatePDF = async () => {
    if (!calculatedInfo) return;

    const jsPDF = (await import('jspdf')).default;

    const doc = new jsPDF('p', 'mm', 'a4');
    const pw = doc.internal.pageSize.getWidth();
    const ph = doc.internal.pageSize.getHeight();

    // Background
    doc.setFillColor('#F8F5F2');
    doc.rect(0, 0, pw, ph, 'F');

    // Top accent bar
    doc.setFillColor('#1C1C1C');
    doc.rect(0, 0, pw, 6, 'F');

    // Red accent stripe
    doc.setFillColor('#D32F2F');
    doc.rect(0, 6, pw, 2, 'F');

    // Main content frame
    doc.setDrawColor('#1C1C1C');
    doc.setLineWidth(0.8);
    doc.rect(16, 20, pw - 32, ph - 40, 'S');

    // Header block
    doc.setFillColor('#1C1C1C');
    doc.rect(16, 20, pw - 32, 22, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(18);
    doc.setTextColor('#FFFFFF');
    doc.text('TAWJEHI', 26, 34);

    doc.setFont('courier', 'normal');
    doc.setFontSize(7);
    doc.setTextColor('#999999');
    doc.text('SCORE REPORT', pw - 26, 34, { align: 'right' } as any);

    doc.setFontSize(6);
    doc.text(generatedDate, pw - 26, 38, { align: 'right' } as any);

    // Score hero section
    const score = calculatedInfo.average.toFixed(2);

    doc.setFillColor('#D32F2F');
    doc.rect(16, 42, pw - 32, 0.5, 'F');

    // Large score
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(72);
    doc.setTextColor('#1C1C1C');
    doc.text(score, pw / 2 - 8, 82, { align: 'center' } as any);

    doc.setFontSize(30);
    doc.setTextColor('#D32F2F');
    doc.text('%', pw / 2 + 42, 76, { align: 'center' } as any);

    // Score subtitle
    doc.setDrawColor('#1C1C1C');
    doc.setLineWidth(0.3);
    doc.line(pw / 2 - 40, 88, pw / 2 + 40, 88);

    doc.setFont('courier', 'normal');
    doc.setFontSize(7);
    doc.setTextColor('#999999');
    doc.text('EQUIVALENCY AVERAGE', pw / 2, 93, { align: 'center' } as any);

    doc.setFont('courier', 'bold');
    doc.setFontSize(8);
    doc.setTextColor('#1C1C1C');
    doc.text(`${calculatedInfo.sum.toFixed(1)} / 6`, pw / 2, 99, { align: 'center' } as any);

    // Section divider
    let by = 110;
    doc.setFillColor('#1C1C1C');
    doc.rect(20, by, pw - 40, 0.5, 'F');
    by += 5;

    // Section title
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor('#1C1C1C');
    doc.text('EXAM BREAKDOWN', 24, by);
    by += 8;

    const rows = [
      { name: 'SAT ENGLISH', score: String(satEnglish), percent: calculatedInfo.engPercent },
      { name: 'SAT MATH', score: String(satMath), percent: calculatedInfo.mathPercent },
      ...calculatedInfo.compiledExams.map((ex, i) => ({
        name: ex.type === 'AP'
          ? (additionalExams[i].name || 'AP EXAM')
          : (additionalExams[i].name ? `${additionalExams[i].name} CLEP` : 'CLEP EXAM'),
        score: String(ex.rawVal),
        percent: ex.percent,
      })),
    ];

    rows.forEach((row, idx) => {
      const yPos = by;

      // Alternating row background
      if (idx % 2 === 0) {
        doc.setFillColor('#EDE9E3');
        doc.rect(20, yPos - 4, pw - 40, 10, 'F');
      }

      // Red left accent
      doc.setFillColor('#D32F2F');
      doc.rect(20, yPos - 4, 1.5, 10, 'F');

      // Exam name
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor('#1C1C1C');
      doc.text(row.name, 26, yPos + 1);

      // Score badge
      doc.setFillColor('#1C1C1C');
      const scoreW = doc.getTextWidth(row.score) + 6;
      doc.roundedRect(pw / 2 + 2, yPos - 3.5, scoreW, 7, 1, 1, 'F');
      doc.setFont('courier', 'bold');
      doc.setFontSize(7);
      doc.setTextColor('#FFFFFF');
      doc.text(row.score, pw / 2 + 4 + scoreW / 2, yPos + 0.5, { align: 'center' } as any);

      // Percentage
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor('#D32F2F');
      doc.text(`${row.percent.toFixed(1)}%`, pw - 24, yPos + 1, { align: 'right' } as any);

      by += 10;
    });

    // Bottom accent bar
    doc.setFillColor('#D32F2F');
    doc.rect(0, ph - 8, pw, 2, 'F');
    doc.setFillColor('#1C1C1C');
    doc.rect(0, ph - 6, pw, 6, 'F');

    doc.save('tawjehi_score_report.pdf');
  };

  // Dynamically change specific exam slot type
  const handleToggleExamType = (index: number, newType: 'AP' | 'CLEP') => {
    const updated = [...additionalExams];
    updated[index] = { 
      type: newType, 
      value: newType === 'AP' ? '' : '35',
      name: updated[index].name
    };
    setAdditionalExams(updated);
  };

  const handleUpdateExamValue = (index: number, val: string) => {
    const updated = [...additionalExams];
    updated[index].value = val;
    setAdditionalExams(updated);
  };

  return (
    <div id="app-root" className="min-h-screen bg-[#f8f5f2] text-[#1c1c1c] font-sans selection:bg-[#1c1c1c] selection:text-white">
      <AnimatePresence mode="wait">
        {showWelcome ? (
          <motion.div
            key="welcome"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.5 }}
            className="min-h-screen flex flex-col items-center justify-center px-6 py-10"
          >
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="text-center"
            >
              <motion.h1
                initial={{ opacity: 0, y: 30, letterSpacing: '0.5em' }}
                animate={{ opacity: 1, y: 0, letterSpacing: '-0.05em' }}
                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
                className="text-[4rem] sm:text-[7rem] md:text-[10rem] lg:text-[12rem] xl:text-[14rem] font-serif font-black uppercase leading-none"
              >
                Tawjehi
              </motion.h1>

              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.6, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="w-12 sm:w-16 md:w-20 h-0.5 bg-[#D32F2F] mx-auto mt-5 sm:mt-6 md:mb-6 origin-left"
              />

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 1 }}
                className="text-[10px] sm:text-xs md:text-sm font-mono uppercase tracking-[0.3em] sm:tracking-[0.4em] text-neutral-400 mb-8 sm:mb-10 md:mb-12"
              >
                Equivalency Calculator
              </motion.p>

              <motion.button
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1.2 }}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setShowWelcome(false)}
                className="px-8 sm:px-10 md:px-14 py-3.5 sm:py-4 md:py-5 text-xs sm:text-sm md:text-base font-mono font-bold uppercase tracking-[0.2em] sm:tracking-[0.25em] border-2 border-[#1c1c1c] bg-[#1c1c1c] text-white hover:bg-[#f8f5f2] hover:text-[#1c1c1c] transition-colors cursor-pointer shadow-[3px_3px_0_0_#D32F2F] sm:shadow-[4px_4px_0_0_#D32F2F] md:shadow-[5px_5px_0_0_#D32F2F]"
              >
                Calculate My Score
              </motion.button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 1.5 }}
              className="absolute bottom-8"
            >
              <p className="text-[8px] sm:text-[9px] md:text-[10px] font-mono uppercase tracking-[0.2em] sm:tracking-[0.3em] text-neutral-300">Clep & AP Score Calculator</p>
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            key="app"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="py-16 px-8 sm:px-10 md:px-14"
          >
            <div className="max-w-[80rem] mx-auto space-y-12">

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">

          {/* COLUMN 1: INPUT GRID (7 columns) */}
          <div className="lg:col-span-7 bg-white border-2 border-[#1c1c1c] p-8 sm:p-10 print:hidden shadow-[5px_5px_0_0_#1c1c1c]">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* SAT ENGLISH */}
              <div className={`bg-[#f8f5f2] p-7 border-l-4 ${satEnglish && !engStatus.isInvalid ? 'border-l-emerald-700' : 'border-l-amber-500'}`}>
                <div className="flex items-center justify-between mb-5">
                  <span className="text-sm font-mono uppercase tracking-widest text-neutral-500">SAT English</span>
                  <div className="flex items-center gap-3">
                    <span className="text-5xl font-mono font-black">{satEnglish || '—'}</span>
                    <span className="text-xs font-mono bg-[#1c1c1c] text-white px-2 py-1 uppercase font-bold">SAT</span>
                  </div>
                </div>
                <input
                  type="range"
                  min={400}
                  max={800}
                  step={10}
                  value={satEnglish || '400'}
                  onChange={(e) => setSatEnglish(e.target.value)}
                  aria-label="SAT English score"
                  className="w-full h-3.5 bg-[#e0dbd5] appearance-none cursor-pointer accent-[#1c1c1c] focus:outline-hidden rounded-full"
                />
                <div className="flex justify-between text-xs font-mono text-neutral-400 mt-3">
                  <span>400</span>
                  <span>800</span>
                </div>
                <div className="flex justify-between items-center mt-4 pt-4 border-t border-[#1c1c1c]/10 text-sm">
                  <span className="text-neutral-400 font-mono uppercase tracking-wider">Equivalency</span>
                  <span className="font-mono font-black text-[#1c1c1c]">{engStatus.percent ?? '—'}%</span>
                </div>
              </div>

              {/* SAT MATH */}
              <div className={`bg-[#f8f5f2] p-7 border-l-4 ${satMath && !mathStatus.isInvalid ? 'border-l-emerald-700' : 'border-l-amber-500'}`}>
                <div className="flex items-center justify-between mb-5">
                  <span className="text-sm font-mono uppercase tracking-widest text-neutral-500">SAT Math</span>
                  <div className="flex items-center gap-3">
                    <span className="text-5xl font-mono font-black">{satMath || '—'}</span>
                    <span className="text-xs font-mono bg-[#1c1c1c] text-white px-2 py-1 uppercase font-bold">SAT</span>
                  </div>
                </div>
                <input
                  type="range"
                  min={400}
                  max={800}
                  step={10}
                  value={satMath || '400'}
                  onChange={(e) => setSatMath(e.target.value)}
                  aria-label="SAT Math score"
                  className="w-full h-3.5 bg-[#e0dbd5] appearance-none cursor-pointer accent-[#1c1c1c] focus:outline-hidden rounded-full"
                />
                <div className="flex justify-between text-xs font-mono text-neutral-400 mt-3">
                  <span>400</span>
                  <span>800</span>
                </div>
                <div className="flex justify-between items-center mt-4 pt-4 border-t border-[#1c1c1c]/10 text-sm">
                  <span className="text-neutral-400 font-mono uppercase tracking-wider">Equivalency</span>
                  <span className="font-mono font-black text-[#1c1c1c]">{mathStatus.percent ?? '—'}%</span>
                </div>
              </div>

              {/* ELECTIVE EXAMS (4 cards) */}
              {additionalExams.map((exam, i) => {
                const status = examStatuses[i];
                const isValid = exam.value.trim() !== '' && !status.isInvalid;
                const borderClass = isValid
                  ? 'border-l-emerald-700'
                  : 'border-l-amber-500';

                return (
                  <div key={i} className={`bg-[#f8f5f2] p-7 border-l-4 ${borderClass}`}>
                    <div className="flex items-center justify-between mb-5">
                      <div className="flex items-center gap-3">
                        <div className="flex border-2 border-[#1c1c1c] p-0.5 bg-white">
                          <button
                            type="button"
                            onClick={() => handleToggleExamType(i, 'AP')}
                            className={`px-4 py-1.5 text-sm font-mono font-bold uppercase transition-colors ${exam.type === 'AP' ? 'bg-[#1c1c1c] text-white' : 'text-neutral-400 hover:text-[#1c1c1c]'}`}
                            aria-label={`Set exam ${i + 1} to AP`}
                          >
                            AP
                          </button>
                          <button
                            type="button"
                            onClick={() => handleToggleExamType(i, 'CLEP')}
                            className={`px-4 py-1.5 text-sm font-mono font-bold uppercase transition-colors ${exam.type === 'CLEP' ? 'bg-[#1c1c1c] text-white' : 'text-neutral-400 hover:text-[#1c1c1c]'}`}
                            aria-label={`Set exam ${i + 1} to CLEP`}
                          >
                            CLEP
                          </button>
                        </div>
                      </div>
                      <span className="text-5xl font-mono font-black">{exam.value || '—'}</span>
                    </div>

                    {exam.type === 'AP' ? (
                      <div className="grid grid-cols-4 gap-3">
                        {[2, 3, 4, 5].map((grade) => {
                          const isSelected = exam.value === String(grade);
                          return (
                            <button
                              type="button"
                              key={grade}
                              onClick={() => handleUpdateExamValue(i, String(grade))}
                              className={`py-4 text-xl font-mono font-black border-2 transition-all ${isSelected ? 'bg-[#1c1c1c] text-white border-[#1c1c1c] shadow-[3px_3px_0_0_#D32F2F]' : 'bg-white text-[#1c1c1c] border-neutral-200 hover:border-[#1c1c1c]'}`}
                              aria-label={`AP grade ${grade}`}
                            >
                              {grade}
                            </button>
                          );
                        })}
                      </div>
                    ) : (
                      <input
                        type="range"
                        min={35}
                        max={80}
                        step={1}
                        value={exam.value || '35'}
                        onChange={(e) => handleUpdateExamValue(i, e.target.value)}
                        aria-label={`CLEP score for exam ${i + 1}`}
                        className="w-full h-3.5 bg-[#e0dbd5] appearance-none cursor-pointer accent-[#1c1c1c] focus:outline-hidden rounded-full"
                      />
                    )}

                    <div className="flex justify-between items-center mt-4 pt-4 border-t border-[#1c1c1c]/10 text-sm">
                      <span className="text-neutral-400 font-mono uppercase tracking-wider">Equivalency</span>
                      <span className="font-mono font-black text-[#1c1c1c]">{status.percent ?? '—'}%</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* COLUMN 2: REPORT PANEL (5 columns) */}
          <div id="equivalency-report-section" className="lg:col-span-5 lg:sticky lg:top-6">
            <AnimatePresence mode="wait">
              {!calculatedInfo ? (
                <motion.div
                  key="standby"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="bg-white border-2 border-dashed border-[#1c1c1c]/20 p-16 text-center flex flex-col items-center justify-center min-h-[550px] shadow-[5px_5px_0_0_rgba(28,28,28,0.06)]"
                >
                  <Compass className="w-12 h-12 text-neutral-300 mb-5 stroke-1 animate-pulse" />
                  <h3 className="text-sm font-mono font-bold uppercase tracking-[0.3em] text-neutral-400">
                    Awaiting inputs
                  </h3>
                </motion.div>
              ) : (
                <motion.div
                  key="report"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="bg-white border-2 border-[#1c1c1c] p-8 sm:p-10 space-y-7 print:border-none print:p-0 shadow-[5px_5px_0_0_#1c1c1c]"
                >
                  {/* TOP: Save button */}
                  <div className="flex items-center justify-center print:hidden">
                    <button
                      onClick={handleSaveCard}
                      className="px-10 py-4 text-sm font-mono font-bold uppercase tracking-widest border-2 border-[#1c1c1c] bg-[#1c1c1c] text-white hover:bg-white hover:text-[#1c1c1c] transition-all flex items-center gap-3 cursor-pointer shadow-[4px_4px_0_0_#D32F2F] hover:shadow-[4px_4px_0_0_#1c1c1c]"
                      title="Export score report as PDF"
                    >
                      {saved ? (
                        <>
                          <Check className="w-5 h-5 text-emerald-400" />
                          Saved
                        </>
                      ) : (
                        <>
                          <Download className="w-5 h-5" />
                          Save Score
                        </>
                      )}
                    </button>
                  </div>

                  {/* HERO: Score */}
                  <div className="text-center py-6">
                    <p className="text-sm font-mono text-neutral-400 uppercase tracking-[0.3em] mb-5">
                      Equivalency Average
                    </p>
                    <motion.div
                      key={calculatedInfo.average.toFixed(2)}
                      initial={{ scale: 0.95, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.2 }}
                      className="text-[6rem] sm:text-[8rem] font-serif font-black tracking-tighter text-[#1c1c1c] leading-none"
                    >
                      {calculatedInfo.average.toFixed(2)}<span className="text-[3rem] sm:text-[4rem] text-[#D32F2F]">%</span>
                    </motion.div>
                  </div>

                  {/* FOOTER: Formula */}
                  <div className="pt-5 border-t border-[#1c1c1c]/10 flex justify-between items-center text-sm font-mono text-neutral-400">
                    <span className="uppercase tracking-widest">{calculatedInfo.sum.toFixed(1)} / 6</span>
                    <span className="font-bold text-[#1c1c1c] uppercase tracking-wider">6 exams</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>

      </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Exam Name Modal */}
      <AnimatePresence>
        {showExamNameModal && (
          <motion.div
            key="exam-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
            onClick={() => { setShowExamNameModal(false); setActiveExamPicker(null); }}
          >
            <motion.div
              key="exam-modal-dialog"
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: 'spring', damping: 18, stiffness: 220 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white border-2 border-[#1c1c1c] p-8 max-w-lg w-full mx-4 max-h-[85vh] overflow-y-auto"
            >
              <div className="mb-6">
                <h3 className="text-xl font-serif font-black uppercase tracking-tight mb-1">Name Your Exams</h3>
                <p className="text-xs font-mono text-neutral-400 uppercase tracking-widest">Tap a score to pick its test name</p>
              </div>

              <div className="space-y-3">
                {additionalExams.map((exam, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + i * 0.07, type: 'spring', damping: 20, stiffness: 200 }}
                  >
                    <button
                      type="button"
                      onClick={() => setActiveExamPicker(activeExamPicker === i ? null : i)}
                      className={`w-full text-left bg-[#f8f5f2] border-l-4 p-4 transition-all cursor-pointer ${exam.name ? 'border-l-emerald-700' : 'border-l-[#D32F2F]'}`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-baseline gap-3">
                          <span className="text-3xl font-mono font-black text-[#D32F2F]">{exam.value}</span>
                          <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-neutral-400 bg-[#1c1c1c] text-white px-2 py-0.5">{exam.type}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          {exam.name ? (
                            <span className="text-xs font-mono text-[#1c1c1c] max-w-[180px] truncate">{exam.name}</span>
                          ) : (
                            <span className="text-xs font-mono text-neutral-400 italic">Choose exam...</span>
                          )}
                          <motion.div
                            animate={{ rotate: activeExamPicker === i ? 180 : 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            <svg className="w-4 h-4 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                            </svg>
                          </motion.div>
                        </div>
                      </div>
                    </button>

                    <AnimatePresence>
                      {activeExamPicker === i && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                          className="overflow-hidden"
                        >
                          <div className="bg-white border-2 border-[#1c1c1c] border-t-0 max-h-64 overflow-y-auto">
                            {exam.type === 'CLEP' ? (
                              CLEP_EXAMS.map((group, gi) => (
                                <motion.div
                                  key={group.category}
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                  transition={{ delay: gi * 0.03 }}
                                >
                                  <div className="px-4 py-2 bg-[#1c1c1c] text-white text-[10px] font-mono font-bold uppercase tracking-widest sticky top-0 z-10">
                                    {group.category}
                                  </div>
                                  {group.exams.map((name) => (
                                    <button
                                      key={name}
                                      type="button"
                                      onClick={() => {
                                        const updated = [...additionalExams];
                                        updated[i] = { ...updated[i], name, type: 'CLEP' };
                                        setAdditionalExams(updated);
                                        setActiveExamPicker(null);
                                      }}
                                      className={`w-full text-left px-4 py-2.5 text-sm font-mono border-b border-[#1c1c1c]/10 transition-all cursor-pointer ${exam.name === name ? 'bg-[#D32F2F] text-white font-bold' : 'hover:bg-[#f8f5f2] text-[#1c1c1c]'}`}
                                    >
                                      {name}
                                    </button>
                                  ))}
                                </motion.div>
                              ))
                            ) : (
                              AP_EXAMS.map((group, gi) => (
                                <motion.div
                                  key={group.category}
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                  transition={{ delay: gi * 0.03 }}
                                >
                                  <div className="px-4 py-2 bg-[#1c1c1c] text-white text-[10px] font-mono font-bold uppercase tracking-widest sticky top-0 z-10">
                                    {group.category}
                                  </div>
                                  {group.exams.map((name) => (
                                    <button
                                      key={name}
                                      type="button"
                                      onClick={() => {
                                        const updated = [...additionalExams];
                                        updated[i] = { ...updated[i], name, type: 'AP' };
                                        setAdditionalExams(updated);
                                        setActiveExamPicker(null);
                                      }}
                                      className={`w-full text-left px-4 py-2.5 text-sm font-mono border-b border-[#1c1c1c]/10 transition-all cursor-pointer ${exam.name === name ? 'bg-[#D32F2F] text-white font-bold' : 'hover:bg-[#f8f5f2] text-[#1c1c1c]'}`}
                                    >
                                      {name}
                                    </button>
                                  ))}
                                </motion.div>
                              ))
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => { setShowExamNameModal(false); setActiveExamPicker(null); }}
                  className="flex-1 px-4 py-3 text-xs font-mono font-bold uppercase tracking-wider border-2 border-[#1c1c1c]/20 text-neutral-400 hover:border-[#1c1c1c] hover:text-[#1c1c1c] transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleExamNameConfirm}
                  className="flex-1 px-4 py-3 text-xs font-mono font-bold uppercase tracking-wider border-2 border-[#1c1c1c] bg-[#1c1c1c] text-white hover:bg-white hover:text-[#1c1c1c] transition-all"
                >
                  Save PDF
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
