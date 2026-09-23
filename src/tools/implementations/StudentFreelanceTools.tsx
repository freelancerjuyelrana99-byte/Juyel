import React, { useState } from 'react';
import { Plus, Trash2, GraduationCap, DollarSign, FileText, Download, Printer, Check, Copy } from 'lucide-react';
import { jsPDF } from 'jspdf';
import confetti from 'canvas-confetti';

interface StudentFreelanceToolsProps {
  slug: string;
}

interface CourseItem {
  id: string;
  name: string;
  gradePoint: number;
  credits: number;
}

export const StudentFreelanceTools: React.FC<StudentFreelanceToolsProps> = ({ slug }) => {
  // GPA Calculator State
  const [courses, setCourses] = useState<CourseItem[]>([
    { id: '1', name: 'Computer Programming', gradePoint: 4.0, credits: 3.0 },
    { id: '2', name: 'Data Structures', gradePoint: 3.75, credits: 3.0 },
    { id: '3', name: 'Calculus & Linear Algebra', gradePoint: 3.5, credits: 3.0 },
    { id: '4', name: 'Physics Laboratory', gradePoint: 4.0, credits: 1.5 },
  ]);

  // Freelance Rate State
  const [monthlyExpenses, setMonthlyExpenses] = useState(40000);
  const [desiredSavings, setDesiredSavings] = useState(25000);
  const [billableHoursPerWeek, setBillableHoursPerWeek] = useState(25);
  const [workingWeeksPerYear, setWorkingWeeksPerYear] = useState(48);

  // Resume Builder State
  const [resumeData, setResumeData] = useState({
    fullName: 'Mohammad Tanvir Rahman',
    jobTitle: 'Full Stack Web Developer & UI Designer',
    email: 'tanvir.rahman@example.com',
    phone: '+880 1712-345678',
    location: 'Dhaka, Bangladesh',
    summary: 'Dedicated and result-driven Software Engineer with 4+ years of hands-on experience in building scalable web apps, modern responsive user interfaces, and automated workflows.',
    skills: 'TypeScript, React, Node.js, Express, Tailwind CSS, PostgreSQL, Figma, Git',
    experience: 'Senior Frontend Engineer at TechSoft BD (2022 - Present)\n• Architected modern React web applications with 99.9% uptime.\n• Boosted client conversion rates by 35% with responsive UX design.',
    education: 'B.Sc. in Computer Science & Engineering (2018 - 2022)\nUniversity of Dhaka, CGPA: 3.82 / 4.00',
  });

  const [copied, setCopied] = useState(false);

  // GPA Calculation
  const totalCredits = courses.reduce((acc, c) => acc + c.credits, 0);
  const totalPoints = courses.reduce((acc, c) => acc + c.gradePoint * c.credits, 0);
  const gpa = totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : '0.00';

  const addCourse = () => {
    setCourses(prev => [
      ...prev,
      {
        id: Math.random().toString(36).substring(2),
        name: `Subject #${prev.length + 1}`,
        gradePoint: 4.0,
        credits: 3.0,
      },
    ]);
  };

  const removeCourse = (id: string) => {
    setCourses(prev => prev.filter(c => c.id !== id));
  };

  // Freelance Rate Calculation
  const totalAnnualTarget = (monthlyExpenses + desiredSavings) * 12;
  const annualBillableHours = billableHoursPerWeek * workingWeeksPerYear;
  const hourlyRateBDT = annualBillableHours > 0 ? Math.round(totalAnnualTarget / annualBillableHours) : 0;
  const hourlyRateUSD = (hourlyRateBDT / 118).toFixed(1);

  // Export Resume as PDF using jsPDF
  const exportResumePDF = () => {
    const doc = new jsPDF();
    
    // Header
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(20);
    doc.text(resumeData.fullName, 20, 25);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(12);
    doc.setTextColor(6, 182, 212); // cyan
    doc.text(resumeData.jobTitle, 20, 33);

    doc.setFontSize(9);
    doc.setTextColor(100, 116, 139);
    doc.text(`${resumeData.email}  |  ${resumeData.phone}  |  ${resumeData.location}`, 20, 40);

    // Divider line
    doc.setDrawColor(203, 213, 225);
    doc.line(20, 45, 190, 45);

    // Summary Section
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(15, 23, 42);
    doc.text('Professional Summary', 20, 54);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(51, 65, 85);
    const splitSummary = doc.splitTextToSize(resumeData.summary, 170);
    doc.text(splitSummary, 20, 61);

    // Skills
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(15, 23, 42);
    doc.text('Core Skills & Competencies', 20, 85);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(51, 65, 85);
    doc.text(resumeData.skills, 20, 92);

    // Experience
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(15, 23, 42);
    doc.text('Work Experience', 20, 108);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(51, 65, 85);
    const splitExp = doc.splitTextToSize(resumeData.experience, 170);
    doc.text(splitExp, 20, 115);

    // Education
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(15, 23, 42);
    doc.text('Education', 20, 155);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(51, 65, 85);
    const splitEdu = doc.splitTextToSize(resumeData.education, 170);
    doc.text(splitEdu, 20, 162);

    doc.save(`${resumeData.fullName.replace(/\s+/g, '_')}_Resume_ToolBoxBD.pdf`);
    confetti({ particleCount: 40, spread: 60, origin: { y: 0.8 } });
  };

  // 1. GPA Calculator
  if (slug === 'gpa-calculator' || slug === 'cgpa-calculator') {
    return (
      <div className="space-y-6">
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-cyan-400" /> Enter Course Grades
            </h4>
            <button
              onClick={addCourse}
              className="px-3 py-1.5 rounded-lg text-xs font-bold bg-cyan-500 text-slate-950 flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" /> Add Course
            </button>
          </div>

          <div className="space-y-2.5">
            {courses.map((course, idx) => (
              <div
                key={course.id}
                className="grid grid-cols-12 gap-2.5 items-center p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs"
              >
                <div className="col-span-5 sm:col-span-6">
                  <input
                    type="text"
                    value={course.name}
                    onChange={e => {
                      const val = e.target.value;
                      setCourses(prev => prev.map(c => (c.id === course.id ? { ...c, name: val } : c)));
                    }}
                    placeholder="Course Name"
                    className="w-full px-2.5 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-white"
                  />
                </div>
                <div className="col-span-3 sm:col-span-3">
                  <select
                    value={course.gradePoint}
                    onChange={e => {
                      const val = parseFloat(e.target.value);
                      setCourses(prev => prev.map(c => (c.id === course.id ? { ...c, gradePoint: val } : c)));
                    }}
                    className="w-full px-2 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-white font-mono"
                  >
                    <option value={4.0}>A+ (4.00)</option>
                    <option value={3.75}>A (3.75)</option>
                    <option value={3.5}>A- (3.50)</option>
                    <option value={3.25}>B+ (3.25)</option>
                    <option value={3.0}>B (3.00)</option>
                    <option value={2.75}>B- (2.75)</option>
                    <option value={2.5}>C+ (2.50)</option>
                    <option value={2.0}>D (2.00)</option>
                    <option value={0.0}>F (0.00)</option>
                  </select>
                </div>
                <div className="col-span-3 sm:col-span-2">
                  <input
                    type="number"
                    step="0.5"
                    value={course.credits}
                    onChange={e => {
                      const val = parseFloat(e.target.value) || 0;
                      setCourses(prev => prev.map(c => (c.id === course.id ? { ...c, credits: val } : c)));
                    }}
                    placeholder="Credits"
                    className="w-full px-2 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-white font-mono"
                  />
                </div>
                <div className="col-span-1 text-right">
                  <button
                    onClick={() => removeCourse(course.id)}
                    className="p-1 rounded text-slate-500 hover:text-rose-400"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Live GPA Output Card */}
        <div className="p-8 rounded-2xl bg-gradient-to-br from-cyan-950/40 via-slate-900 to-indigo-950/40 border border-cyan-500/40 text-center max-w-sm mx-auto shadow-xl">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
            Calculated Grade Point Average (GPA)
          </span>
          <div className="text-5xl font-black text-cyan-400 font-mono tracking-tight my-2">{gpa}</div>
          <p className="text-xs text-slate-400">
            Based on <span className="text-white font-bold">{totalCredits}</span> total credit hours
          </p>
        </div>
      </div>
    );
  }

  // 2. Freelance Rate Calculator
  if (slug === 'freelance-rate-calculator') {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-5 rounded-2xl bg-slate-900/80 border border-slate-800">
          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1">Monthly Personal & Business Expenses (৳)</label>
            <input
              type="number"
              value={monthlyExpenses}
              onChange={e => setMonthlyExpenses(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm font-mono"
            />
          </div>
          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1">Desired Monthly Savings/Profit (৳)</label>
            <input
              type="number"
              value={desiredSavings}
              onChange={e => setDesiredSavings(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm font-mono"
            />
          </div>
          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1">Billable Working Hours Per Week</label>
            <input
              type="number"
              value={billableHoursPerWeek}
              onChange={e => setBillableHoursPerWeek(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm font-mono"
            />
          </div>
          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1">Working Weeks Per Year (52 - vacation)</label>
            <input
              type="number"
              value={workingWeeksPerYear}
              onChange={e => setWorkingWeeksPerYear(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm font-mono"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg mx-auto">
          <div className="p-6 rounded-2xl bg-slate-900/80 border border-emerald-500/30 text-center">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Minimum Hourly Rate (BDT)
            </span>
            <div className="text-3xl font-black text-emerald-400 font-mono">৳ {hourlyRateBDT} / hr</div>
          </div>
          <div className="p-6 rounded-2xl bg-slate-900/80 border border-cyan-500/30 text-center">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Equivalent In USD
            </span>
            <div className="text-3xl font-black text-cyan-400 font-mono">${hourlyRateUSD} / hr</div>
          </div>
        </div>
      </div>
    );
  }

  // 3. CV Maker / Resume Builder
  return (
    <div className="space-y-6">
      <div className="flex justify-end space-x-3">
        <button
          onClick={exportResumePDF}
          className="px-6 py-2.5 rounded-xl font-bold text-xs bg-cyan-500 hover:bg-cyan-400 text-slate-950 flex items-center gap-2 shadow-md shadow-cyan-500/20"
        >
          <Download className="w-4 h-4" /> Download PDF Resume
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Editor Form */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
          <h4 className="text-sm font-bold text-white mb-2">Personal Information</h4>
          <div className="grid grid-cols-2 gap-2">
            <input
              type="text"
              value={resumeData.fullName}
              onChange={e => setResumeData({ ...resumeData, fullName: e.target.value })}
              placeholder="Full Name"
              className="px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-xs"
            />
            <input
              type="text"
              value={resumeData.jobTitle}
              onChange={e => setResumeData({ ...resumeData, jobTitle: e.target.value })}
              placeholder="Job Title"
              className="px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-xs"
            />
          </div>

          <div className="grid grid-cols-3 gap-2">
            <input
              type="email"
              value={resumeData.email}
              onChange={e => setResumeData({ ...resumeData, email: e.target.value })}
              placeholder="Email"
              className="px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-xs"
            />
            <input
              type="text"
              value={resumeData.phone}
              onChange={e => setResumeData({ ...resumeData, phone: e.target.value })}
              placeholder="Phone"
              className="px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-xs"
            />
            <input
              type="text"
              value={resumeData.location}
              onChange={e => setResumeData({ ...resumeData, location: e.target.value })}
              placeholder="Location"
              className="px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-xs"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-400 block mb-1">Professional Summary</label>
            <textarea
              rows={3}
              value={resumeData.summary}
              onChange={e => setResumeData({ ...resumeData, summary: e.target.value })}
              className="w-full p-2.5 rounded-lg bg-slate-800 border border-slate-700 text-white text-xs"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-400 block mb-1">Skills</label>
            <input
              type="text"
              value={resumeData.skills}
              onChange={e => setResumeData({ ...resumeData, skills: e.target.value })}
              className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-xs"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-400 block mb-1">Work Experience</label>
            <textarea
              rows={4}
              value={resumeData.experience}
              onChange={e => setResumeData({ ...resumeData, experience: e.target.value })}
              className="w-full p-2.5 rounded-lg bg-slate-800 border border-slate-700 text-white text-xs"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-400 block mb-1">Education</label>
            <textarea
              rows={3}
              value={resumeData.education}
              onChange={e => setResumeData({ ...resumeData, education: e.target.value })}
              className="w-full p-2.5 rounded-lg bg-slate-800 border border-slate-700 text-white text-xs"
            />
          </div>
        </div>

        {/* Live Resume Document Preview */}
        <div className="p-6 rounded-2xl bg-white text-slate-900 shadow-2xl border border-slate-200 overflow-y-auto max-h-[600px] text-xs space-y-4">
          <div className="border-b border-slate-300 pb-3">
            <h2 className="text-xl font-bold text-slate-950">{resumeData.fullName}</h2>
            <p className="text-cyan-600 font-bold text-sm">{resumeData.jobTitle}</p>
            <p className="text-slate-500 text-[11px] mt-1">
              {resumeData.email} • {resumeData.phone} • {resumeData.location}
            </p>
          </div>

          <div>
            <h3 className="font-bold text-slate-900 uppercase text-[11px] tracking-wider mb-1">
              Professional Summary
            </h3>
            <p className="text-slate-700 leading-relaxed">{resumeData.summary}</p>
          </div>

          <div>
            <h3 className="font-bold text-slate-900 uppercase text-[11px] tracking-wider mb-1">Skills</h3>
            <p className="text-slate-700">{resumeData.skills}</p>
          </div>

          <div>
            <h3 className="font-bold text-slate-900 uppercase text-[11px] tracking-wider mb-1">Experience</h3>
            <p className="text-slate-700 whitespace-pre-wrap leading-relaxed">{resumeData.experience}</p>
          </div>

          <div>
            <h3 className="font-bold text-slate-900 uppercase text-[11px] tracking-wider mb-1">Education</h3>
            <p className="text-slate-700 whitespace-pre-wrap leading-relaxed">{resumeData.education}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
