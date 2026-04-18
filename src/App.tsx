/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import { ResumeEditor } from './components/ResumeEditor';
import { ResumePreview } from './components/ResumePreview';
import { initialResumeData } from './data/initialData';
import { ResumeData, TemplateId } from './types';
import { Download, LayoutPanelLeft, Sparkles, Wand2, Eye, Edit3, Grid3X3, User, Briefcase, GraduationCap, Code, BrainCircuit, DownloadCloud, Printer } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from './lib/utils';

export type EditorTab = 'personal' | 'experience' | 'education' | 'skills' | 'projects' | 'ai';

export default function App() {
  const [resumeData, setResumeData] = useState<ResumeData>(initialResumeData);
  const [template, setTemplate] = useState<TemplateId>('modern');
  const [activeTab, setActiveTab] = useState<EditorTab>('personal');
  const [viewMode, setViewMode] = useState<'edit' | 'preview'>('edit');
  const [isExporting, setIsExporting] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    window.print();
  };

  const handleExport = async () => {
    if (!previewRef.current) return;
    setIsExporting(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      const canvas = await html2canvas(previewRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${resumeData.personalInfo.fullName.replace(/\s+/g, '_')}_Resume.pdf`);
    } catch (error) {
      console.error('PDF Export failed:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const templates: { id: TemplateId; name: string; icon: React.ReactNode }[] = [
    { id: 'professional', name: 'Executive Modern', icon: <Grid3X3 size={16} /> },
    { id: 'minimal', name: 'Creative Minimal', icon: <Wand2 size={16} /> },
    { id: 'modern', name: 'Standard Corporate', icon: <Sparkles size={16} /> },
  ];

  const sidebarGroups = [
    {
      label: 'Structure',
      items: [
        { id: 'personal', name: 'Personal Info', icon: <User size={16} /> },
        { id: 'experience', name: 'Work Experience', icon: <Briefcase size={16} /> },
        { id: 'education', name: 'Education', icon: <GraduationCap size={16} /> },
        { id: 'skills', name: 'Skills & Tech', icon: <Code size={16} /> },
        { id: 'projects', name: 'Key Projects', icon: <LayoutPanelLeft size={16} /> },
        { id: 'ai', name: 'AI Laboratory', icon: <BrainCircuit size={16} /> },
      ]
    }
  ];

  const calculateScore = () => {
    let score = 30; // Base score
    if (resumeData.personalInfo.summary.length > 50) score += 10;
    if (resumeData.experience.length >= 2) score += 15;
    if (resumeData.education.length >= 1) score += 10;
    if (resumeData.skills.length >= 5) score += 15;
    if (resumeData.projects.length >= 1) score += 10;
    if (resumeData.personalInfo.phone && resumeData.personalInfo.email) score += 10;
    return Math.min(score, 100);
  };

  const getSuggestions = () => {
    const suggestions = [];
    if (resumeData.personalInfo.summary.length < 100) {
      suggestions.push({
        title: "Short Summary",
        text: "Your professional summary is a bit brief. Aim for 3-4 sentences to capture recruiter interest.",
        priority: "high"
      });
    }
    if (resumeData.experience.length < 2) {
      suggestions.push({
        title: "Add Experience",
        text: "Adding more work history can significanly improve your profile scannability.",
        priority: "high"
      });
    }
    if (resumeData.skills.length < 8) {
      suggestions.push({
        title: "Skill Density",
        text: `You have ${resumeData.skills.length} skills. Industry leaders typically list 8-12 core competencies.`,
        priority: "medium"
      });
    }
    if (resumeData.projects.length === 0) {
      suggestions.push({
        title: "Portfolio Projects",
        text: "Highlighting a key project can demonstrate your methodology and impact.",
        priority: "medium"
      });
    }
    return suggestions.length > 0 ? suggestions : [{
      title: "All Clear!",
      text: "Your resume structure is solid. Consider using the AI Lab for job-specific optimization.",
      priority: "low"
    }];
  };

  const score = calculateScore();
  const suggestions = getSuggestions();

  return (
    <div className="flex h-screen bg-bg overflow-hidden text-text-main font-sans">
      {/* Left Navigation: 220px */}
      <nav className="w-[220px] bg-sidebar border-r border-border flex flex-col p-6 overflow-y-auto">
        <div className="flex items-center gap-2 font-extrabold text-xl text-accent mb-8">
          ResumePro <span className="font-light">AI</span>
        </div>

        {sidebarGroups.map(group => (
          <div key={group.label} className="mb-8">
            <h3 className="text-[10px] uppercase tracking-widest font-bold text-text-muted mb-4 px-3 flex items-center justify-between">
              {group.label}
            </h3>
            <div className="flex flex-col gap-1">
              {group.items.map(item => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as EditorTab)}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all text-left",
                    activeTab === item.id 
                      ? "bg-[#EFF6FF] text-accent font-semibold" 
                      : "text-text-main hover:bg-slate-50"
                  )}
                >
                  {item.icon}
                  {item.name}
                </button>
              ))}
            </div>
          </div>
        ))}

        <div className="mt-8">
          <h3 className="text-[10px] uppercase tracking-widest font-bold text-text-muted mb-4 px-3">Templates</h3>
          <div className="flex flex-col gap-1">
            {templates.map(t => (
              <button
                key={t.id}
                onClick={() => setTemplate(t.id)}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all text-left",
                  template === t.id 
                    ? "bg-[#EFF6FF] text-accent font-semibold" 
                    : "text-text-main hover:bg-slate-50"
                )}
              >
                {t.icon}
                {t.name}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-auto pt-8 border-t border-border">
            <div className="flex items-center gap-2 px-3 mb-2">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Cloud Sync Active</span>
            </div>
            <div className="px-3 text-[10px] text-slate-300 italic">
                Last auto-save: {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
        </div>
      </nav>

      {/* Main Area: Center Stage */}
      <main className="flex-1 bg-[#E2E8F0] overflow-hidden flex flex-col relative">
        <div className="h-16 bg-white border-b border-border flex items-center justify-between px-8 sticky top-0 z-10 shrink-0">
          <div className="flex bg-slate-100 p-1 rounded-lg gap-1">
             <button 
               onClick={() => setViewMode('edit')}
               className={cn("px-4 py-1.5 rounded-md text-xs font-bold transition-all", viewMode === 'edit' ? "bg-white text-slate-900 shadow-sm" : "text-slate-500")}
             >
               Editor
             </button>
             <button 
               onClick={() => setViewMode('preview')}
               className={cn("px-4 py-1.5 rounded-md text-xs font-bold transition-all", viewMode === 'preview' ? "bg-white text-slate-900 shadow-sm" : "text-slate-500")}
             >
               Preview
             </button>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-text-muted">Template:</span>
            <select 
              value={template} 
              onChange={(e) => setTemplate(e.target.value as TemplateId)}
              className="bg-transparent text-xs font-bold outline-none cursor-pointer"
            >
              {templates.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-8 flex justify-center items-start scroll-smooth">
          <AnimatePresence mode="wait">
            {viewMode === 'edit' ? (
              <motion.div 
                key="editor"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="w-full max-w-2xl bg-white rounded-2xl shadow-sm border border-border p-2"
              >
                <ResumeEditor data={resumeData} onChange={setResumeData} activeTabOverride={activeTab} />
              </motion.div>
            ) : (
              <motion.div
                key="preview"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="shadow-[0_10px_25px_rgba(0,0,0,0.1)] w-full max-w-[480px]"
              >
                <ResumePreview ref={previewRef} data={resumeData} template={template} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Right Sidebar: Tools Panel (280px) */}
      <div className="w-[280px] bg-sidebar border-l border-border flex flex-col overflow-hidden">
        <div className="p-5 border-b border-border flex justify-between items-center bg-white sticky top-0 z-10">
          <span className="font-bold text-sm">AI Assistant</span>
          <span className="text-accent text-xs font-semibold">Active</span>
        </div>

        <div className="p-5 bg-slate-900 m-5 rounded-xl text-white">
          <div className="text-[10px] uppercase opacity-70 mb-1">ATS Scannability</div>
          <motion.div 
            key={score}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={cn(
                "text-3xl font-extrabold",
                score > 80 ? "text-[#4ADE80]" : score > 50 ? "text-amber-400" : "text-red-400"
            )}
          >
            {score}/100
          </motion.div>
          <div className="text-[11px] mt-2 text-slate-400">
            {score > 80 ? 'Excellent Optimization' : score > 50 ? 'Needs Improvement' : 'Incomplete Profile'}
          </div>
        </div>

        <div className="p-5 flex-1 overflow-y-auto">
          <h3 className="text-[10px] uppercase tracking-widest font-bold text-text-muted mb-4 font-sans">Content Suggestions</h3>
          <div className="space-y-4">
            {suggestions.map((s, i) => (
                <motion.div 
                   key={s.title}
                   initial={{ opacity: 0, x: 20 }}
                   animate={{ opacity: 1, x: 0 }}
                   transition={{ delay: i * 0.1 }}
                   className={cn(
                       "p-4 border border-border rounded-xl text-xs bg-white shadow-sm border-l-4",
                       s.priority === 'high' ? "border-l-red-500" : s.priority === 'medium' ? "border-l-amber-500" : "border-l-green-500"
                   )}
                >
                    <div className="font-bold mb-1 text-slate-800">{s.title}</div>
                    <p className="text-text-muted leading-relaxed">{s.text}</p>
                </motion.div>
            ))}
          </div>
        </div>

        <div className="p-5 border-t border-border bg-white grid grid-cols-2 gap-2">
           <button 
             onClick={handleExport}
             disabled={isExporting}
             className="flex items-center justify-center gap-2 p-3 bg-white border border-border rounded-lg text-xs font-bold hover:bg-slate-50 transition-colors"
           >
             PDF
           </button>
           <button className="flex items-center justify-center gap-2 p-3 bg-white border border-border rounded-lg text-xs font-bold hover:bg-slate-50 transition-colors">
             DOCX
           </button>
           <button 
             onClick={handlePrint}
             className="col-span-2 flex items-center justify-center gap-2 p-3 bg-white border border-border rounded-lg text-xs font-bold hover:bg-slate-50 transition-colors text-slate-700"
           >
             <Printer size={16} />
             Print Resume
           </button>
           <button 
             onClick={handleExport}
             disabled={isExporting}
             className="col-span-2 flex items-center justify-center gap-2 p-3 bg-accent text-white rounded-lg text-sm font-bold hover:bg-blue-600 transition-all shadow-lg shadow-accent/20"
           >
             <DownloadCloud size={18} />
             {isExporting ? 'GENERATING...' : 'Download CV'}
           </button>
        </div>
      </div>
    </div>
  );
}
