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

interface AdditionalExam {
  type: 'AP' | 'CLEP';
  value: string;
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
    { type: 'CLEP', value: '50' },
    { type: 'CLEP', value: '50' },
    { type: 'CLEP', value: '50' },
    { type: 'CLEP', value: '50' },
  ]);

  const [saved, setSaved] = useState(false);
  const [generatedDate, setGeneratedDate] = useState(() => makeTimestamp());

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
      { type: 'CLEP', value: '50' },
      { type: 'CLEP', value: '50' },
      { type: 'CLEP', value: '50' },
      { type: 'CLEP', value: '50' },
    ]);
  };

  const handleSaveCard = async () => {
    if (!calculatedInfo) return;

    const jsPDF = (await import('jspdf')).default;

    const doc = new jsPDF('p', 'mm', 'a4');
    const pw = doc.internal.pageSize.getWidth();
    const ph = doc.internal.pageSize.getHeight();

    // White background
    doc.setFillColor('#FFFFFF');
    doc.rect(0, 0, pw, ph, 'F');

    // Large red circle (Hinomaru inspired) top right
    doc.setFillColor('#D32F2F');
    (doc as any).setGState((doc as any).GState({ opacity: 0.08 }));
    doc.circle(pw - 20, 10, 60, 'F');

    // Full red circle bottom right
    doc.circle(pw - 30, ph - 40, 80, 'F');
    (doc as any).setGState((doc as any).GState({ opacity: 1 }));

    // Thin black double border frame
    doc.setDrawColor('#000000');
    doc.setLineWidth(0.5);
    doc.rect(10, 10, pw - 20, ph - 20, 'S');
    doc.setLineWidth(0.2);
    doc.rect(12, 12, pw - 24, ph - 24, 'S');

    // Header
    doc.setFont('courier', 'bold');
    doc.setFontSize(10);
    doc.setTextColor('#000000');
    doc.text('TAWJEHI', 20, 25);

    doc.setFont('courier', 'normal');
    doc.setFontSize(7);
    doc.setTextColor('#666666');
    doc.text(generatedDate, pw - 20, 25, { align: 'right' } as any);

    // Red separator line
    doc.setDrawColor('#D32F2F');
    doc.setLineWidth(0.5);
    doc.line(20, 30, pw - 20, 30);

    // Hero section
    const score = calculatedInfo.average.toFixed(2);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(64);
    doc.setTextColor('#D32F2F');
    doc.text(score, pw / 2, 75, { align: 'center' } as any);

    doc.setFontSize(28);
    doc.setTextColor('#000000');
    doc.text('%', pw / 2 + 55, 70, { align: 'center' } as any);

    // Sub label
    doc.setFont('courier', 'normal');
    doc.setFontSize(6);
    doc.setTextColor('#999999');
    doc.text('— 6 EXAMS / 100 MAX —', pw / 2, 90, { align: 'center' } as any);

    // Breakdown
    let by = 105;
    doc.setFillColor('#000000');
    doc.rect(20, by, pw - 40, 1, 'F');
    by += 6;

    const rows = [
      { name: 'SAT ENGLISH', score: String(satEnglish), percent: calculatedInfo.engPercent },
      { name: 'SAT MATH', score: String(satMath), percent: calculatedInfo.mathPercent },
      ...calculatedInfo.compiledExams.map((ex) => ({
        name: ex.type === 'AP' ? `AP EXAM` : `CLEP EXAM`,
        score: String(ex.rawVal),
        percent: ex.percent,
      })),
    ];

    rows.forEach((row) => {
      const yPos = by;

      // Red circle bullet
      doc.setFillColor('#D32F2F');
      doc.circle(24, yPos - 1.5, 1.5, 'F');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor('#000000');
      doc.text(row.name, 32, yPos);

      // Score in a bordered box
      doc.setDrawColor('#D32F2F');
      doc.setLineWidth(0.3);
      const scoreW = doc.getTextWidth(row.score) + 4;
      doc.rect(pw / 2 + 5, yPos - 3, scoreW + 4, 6, 'S');
      doc.setFont('courier', 'bold');
      doc.setFontSize(7);
      doc.setTextColor('#D32F2F');
      doc.text(row.score, pw / 2 + 7 + scoreW / 2, yPos, { align: 'center' } as any);

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor('#000000');
      doc.text(`${row.percent.toFixed(1)}%`, pw - 25, yPos, { align: 'right' } as any);

      // Red underline
      doc.setDrawColor('#D32F2F');
      doc.setLineWidth(0.2);
      doc.line(32, yPos + 2, pw - 25, yPos + 2);

      by += 9;
    });

    // Formula
    by += 6;
    doc.setFillColor('#000000');
    doc.rect(20, by, pw - 40, 1, 'F');
    by += 4;

    doc.setFont('courier', 'bold');
    doc.setFontSize(9);
    doc.setTextColor('#000000');
    doc.text('SUM', 25, by);
    doc.setFont('courier', 'normal');
    doc.text(calculatedInfo.sum.toFixed(2), 55, by);

    doc.setFont('courier', 'bold');
    doc.setTextColor('#D32F2F');
    doc.text('/ 6', pw / 2, by, { align: 'center' } as any);

    doc.setFont('courier', 'bold');
    doc.setTextColor('#000000');
    doc.text('=', pw / 2 + 15, by, { align: 'center' } as any);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor('#D32F2F');
    doc.text(`${calculatedInfo.average.toFixed(2)}%`, pw - 30, by, { align: 'right' } as any);

    // Vertical text on left
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(6);
    doc.setTextColor('#D32F2F');
    doc.text('SCORE REPORT', 16, ph / 2, { angle: 90, align: 'center' } as any);

    // Footer
    doc.setFont('courier', 'normal');
    doc.setFontSize(5);
    doc.setTextColor('#CCCCCC');
    doc.text('TAWJEHI CALCULATOR', pw / 2, ph - 16, { align: 'center' } as any);

    doc.save('tawjehi_score_report.pdf');

    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  // Dynamically change specific exam slot type
  const handleToggleExamType = (index: number, newType: 'AP' | 'CLEP') => {
    const updated = [...additionalExams];
    updated[index] = { 
      type: newType, 
      value: newType === 'AP' ? '' : '35' // Default to min for CLEP when toggled
    };
    setAdditionalExams(updated);
  };

  const handleUpdateExamValue = (index: number, val: string) => {
    const updated = [...additionalExams];
    updated[index].value = val;
    setAdditionalExams(updated);
  };

  return (
    <div id="app-root" className="min-h-screen bg-[#f8f5f2] text-[#1c1c1c] font-sans selection:bg-[#1c1c1c] selection:text-white py-14 px-4 sm:px-6 md:px-10">
      <div className="max-w-7xl mx-auto space-y-10">

        {/* HEADER */}
        <div className="flex items-center justify-between border-b-2 border-[#1c1c1c] pb-5">
          <h1 className="text-4xl font-serif font-black tracking-tight uppercase leading-none">
            Tawjehi Calculator
          </h1>
          <button
            onClick={handleResetInputs}
            className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-neutral-500 hover:text-[#1c1c1c] transition-colors px-3 py-2 border border-transparent hover:border-[#1c1c1c]"
            title="Reset all inputs"
          >
            <RotateCcw className="w-4 h-4" />
            Reset
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* COLUMN 1: INPUT GRID (7 columns) */}
          <div className="lg:col-span-7 bg-white border-2 border-[#1c1c1c] p-6 sm:p-7 print:hidden">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* SAT ENGLISH */}
              <div className={`bg-[#f8f5f2] p-4 border-l-4 ${satEnglish && !engStatus.isInvalid ? 'border-l-emerald-700' : 'border-l-amber-500'}`}>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-mono uppercase tracking-wider text-neutral-500">SAT English</span>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-mono font-black">{satEnglish || '—'}</span>
                    <span className="text-[10px] font-mono bg-[#1c1c1c] text-white px-2 py-0.5 uppercase font-bold">SAT</span>
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
                  className="w-full h-2.5 bg-[#e0dbd5] appearance-none cursor-pointer accent-[#1c1c1c] focus:outline-hidden"
                />
                <div className="flex justify-between text-[10px] font-mono text-neutral-400 mt-2">
                  <span>400</span>
                  <span>800</span>
                </div>
                <div className="flex justify-between items-center mt-3 pt-3 border-t border-[#1c1c1c]/10 text-xs">
                  <span className="text-neutral-500 font-mono uppercase">Mapped</span>
                  <span className="font-mono font-bold">{engStatus.percent ?? '—'}%</span>
                </div>
              </div>

              {/* SAT MATH */}
              <div className={`bg-[#f8f5f2] p-4 border-l-4 ${satMath && !mathStatus.isInvalid ? 'border-l-emerald-700' : 'border-l-amber-500'}`}>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-mono uppercase tracking-wider text-neutral-500">SAT Math</span>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-mono font-black">{satMath || '—'}</span>
                    <span className="text-[10px] font-mono bg-[#1c1c1c] text-white px-2 py-0.5 uppercase font-bold">SAT</span>
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
                  className="w-full h-2.5 bg-[#e0dbd5] appearance-none cursor-pointer accent-[#1c1c1c] focus:outline-hidden"
                />
                <div className="flex justify-between text-[10px] font-mono text-neutral-400 mt-2">
                  <span>400</span>
                  <span>800</span>
                </div>
                <div className="flex justify-between items-center mt-3 pt-3 border-t border-[#1c1c1c]/10 text-xs">
                  <span className="text-neutral-500 font-mono uppercase">Mapped</span>
                  <span className="font-mono font-bold">{mathStatus.percent ?? '—'}%</span>
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
                  <div key={i} className={`bg-[#f8f5f2] p-4 border-l-4 ${borderClass}`}>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono uppercase tracking-wider text-neutral-500">Exam {i + 1}</span>
                        <div className="flex border-2 border-[#1c1c1c] p-0.5 bg-white">
                          <button
                            type="button"
                            onClick={() => handleToggleExamType(i, 'AP')}
                            className={`px-2 py-1 text-[10px] font-mono font-bold uppercase ${exam.type === 'AP' ? 'bg-[#1c1c1c] text-white' : 'text-neutral-400'}`}
                            aria-label={`Set exam ${i + 1} to AP`}
                          >
                            AP
                          </button>
                          <button
                            type="button"
                            onClick={() => handleToggleExamType(i, 'CLEP')}
                            className={`px-2 py-1 text-[10px] font-mono font-bold uppercase ${exam.type === 'CLEP' ? 'bg-[#1c1c1c] text-white' : 'text-neutral-400'}`}
                            aria-label={`Set exam ${i + 1} to CLEP`}
                          >
                            CLEP
                          </button>
                        </div>
                      </div>
                      <span className="text-2xl font-mono font-black">{exam.value || '—'}</span>
                    </div>

                    {exam.type === 'AP' ? (
                      <div className="grid grid-cols-4 gap-1.5">
                        {[2, 3, 4, 5].map((grade) => {
                          const isSelected = exam.value === String(grade);
                          return (
                            <button
                              type="button"
                              key={grade}
                              onClick={() => handleUpdateExamValue(i, String(grade))}
                              className={`py-2.5 text-base font-mono font-black border-2 ${isSelected ? 'bg-[#1c1c1c] text-white border-[#1c1c1c]' : 'bg-white text-[#1c1c1c] border-neutral-300 hover:border-[#1c1c1c]'}`}
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
                        className="w-full h-2.5 bg-[#e0dbd5] appearance-none cursor-pointer accent-[#1c1c1c] focus:outline-hidden"
                      />
                    )}

                    <div className="flex justify-between items-center mt-3 pt-3 border-t border-[#1c1c1c]/10 text-xs">
                      <span className="text-neutral-500 font-mono uppercase">Mapped</span>
                      <span className="font-mono font-bold">{status.percent ?? '—'}%</span>
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
                  className="bg-white border-2 border-dashed border-[#1c1c1c]/25 p-12 text-center flex flex-col items-center justify-center min-h-[450px]"
                >
                  <Compass className="w-8 h-8 text-neutral-300 mb-4 stroke-1 animate-pulse" />
                  <h3 className="text-sm font-mono font-bold uppercase tracking-widest text-neutral-500">
                    Awaiting inputs
                  </h3>
                </motion.div>
              ) : (
                <motion.div
                  key="report"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="bg-white border-2 border-[#1c1c1c] p-6 sm:p-7 space-y-6 print:border-none print:p-0"
                >
                  {/* TOP: Save button */}
                  <div className="flex items-center justify-end gap-3 print:hidden">
                    <button
                      onClick={handleSaveCard}
                      className="px-5 py-2.5 text-sm font-mono font-bold uppercase border-2 border-[#1c1c1c] bg-[#1c1c1c] text-white hover:bg-white hover:text-[#1c1c1c] transition-colors flex items-center gap-2 cursor-pointer"
                      title="Export score report as PDF"
                    >
                      {saved ? (
                        <>
                          <Check className="w-4 h-4 text-emerald-400" />
                          Saved
                        </>
                      ) : (
                        <>
                          <Download className="w-4 h-4" />
                          Save Score
                        </>
                      )}
                    </button>
                  </div>

                  {/* HERO: Score */}
                  <div className="text-center py-6">
                    <p className="text-xs font-mono text-neutral-500 uppercase tracking-widest mb-3">
                      Equivalency Average
                    </p>
                    <motion.div
                      key={calculatedInfo.average.toFixed(2)}
                      initial={{ scale: 0.95, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.2 }}
                      className="text-8xl sm:text-9xl font-serif font-black tracking-tighter text-[#1c1c1c] leading-none"
                    >
                      {calculatedInfo.average.toFixed(2)}<span className="text-4xl sm:text-5xl">%</span>
                    </motion.div>
                  </div>

                  {/* FOOTER: Formula */}
                  <div className="pt-4 border-t border-[#1c1c1c]/15 flex justify-between items-center text-xs font-mono text-neutral-500">
                    <span className="uppercase tracking-wider">{calculatedInfo.sum.toFixed(1)} / 6</span>
                    <span className="font-bold text-[#1c1c1c]">6 exams</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>

      </div>
    </div>
  );
}
