import React, { useState, useEffect } from 'react';
import { ResumeData, Skill, Experience, Education } from '../types';
import { Edit3, Plus, Trash2, Sparkles, ChevronRight, ChevronLeft, Save, BrainCircuit } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { suggestSummary, suggestSkills } from '../services/aiService';

interface Props {
  data: ResumeData;
  onChange: (data: ResumeData) => void;
  activeTabOverride?: 'personal' | 'experience' | 'education' | 'skills' | 'ai';
}

export const ResumeEditor: React.FC<Props> = ({ data, onChange, activeTabOverride }) => {
  const [internalTab, setInternalTab] = useState<'personal' | 'experience' | 'education' | 'skills' | 'ai'>('personal');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [jobDescription, setJobDescription] = useState('');
  const [aiAnalysis, setAiAnalysis] = useState('');

  const activeTab = activeTabOverride || internalTab;

  const updatePersonalInfo = (field: keyof typeof data.personalInfo, value: string) => {
    onChange({
      ...data,
      personalInfo: { ...data.personalInfo, [field]: value }
    });
  };

  const handleAiSummary = async () => {
    setIsAiLoading(true);
    try {
      const summary = await suggestSummary(data);
      if (summary) updatePersonalInfo('summary', summary);
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleAiSkills = async () => {
    setIsAiLoading(true);
    try {
      const suggested = await suggestSkills(data.experience);
      if (suggested) {
        const newSkills: Skill[] = suggested.map((s, i) => ({
          id: `ai-${i}-${Date.now()}`,
          name: s,
          level: 'Advanced'
        }));
        onChange({ ...data, skills: [...data.skills, ...newSkills] });
      }
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleAiAnalysis = async () => {
    setIsAiLoading(true);
    try {
      const { optimizeForKeywords } = await import('../services/aiService');
      const analysis = await optimizeForKeywords(data, jobDescription);
      if (analysis) setAiAnalysis(analysis);
    } finally {
      setIsAiLoading(false);
    }
  };

  const addExperience = () => {
    const newExp: Experience = {
      id: Date.now().toString(),
      company: '',
      position: '',
      location: '',
      startDate: '',
      endDate: '',
      current: false,
      description: ['']
    };
    onChange({ ...data, experience: [newExp, ...data.experience] });
  };

  const updateExperience = (id: string, field: keyof Experience, value: any) => {
    onChange({
      ...data,
      experience: data.experience.map(exp => exp.id === id ? { ...exp, [field]: value } : exp)
    });
  };

  const removeExperience = (id: string) => {
    onChange({ ...data, experience: data.experience.filter(exp => exp.id !== id) });
  };

  const updateEducation = (id: string, field: keyof Education, value: any) => {
    onChange({
      ...data,
      education: data.education.map(edu => edu.id === id ? { ...edu, [field]: value } : edu)
    });
  };

  const addEducation = () => {
    const newEdu: Education = {
      id: Date.now().toString(),
      school: '',
      degree: '',
      fieldOfStudy: '',
      startDate: '',
      endDate: '',
      description: ''
    };
    onChange({ ...data, education: [newEdu, ...data.education] });
  };

  const removeEducation = (id: string) => {
    onChange({ ...data, education: data.education.filter(edu => edu.id !== id) });
  };

  const renderPersonal = () => (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1">
          <label className="text-xs font-bold uppercase text-slate-500">Full Name</label>
          <input
            className="p-3 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-accent outline-none transition-all"
            value={data.personalInfo.fullName}
            onChange={(e) => updatePersonalInfo('fullName', e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs font-bold uppercase text-slate-500">Professional Title</label>
          <input
            className="p-3 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-accent outline-none transition-all"
            value={data.personalInfo.title}
            onChange={(e) => updatePersonalInfo('title', e.target.value)}
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1">
          <label className="text-xs font-bold uppercase text-slate-500">Email</label>
          <input
            className="p-3 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-accent outline-none transition-all"
            value={data.personalInfo.email}
            onChange={(e) => updatePersonalInfo('email', e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs font-bold uppercase text-slate-500">Phone</label>
          <input
            className="p-3 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-accent outline-none transition-all"
            value={data.personalInfo.phone}
            onChange={(e) => updatePersonalInfo('phone', e.target.value)}
          />
        </div>
      </div>
      <div className="flex flex-col gap-1">
        <div className="flex justify-between items-center mb-1">
          <label className="text-xs font-bold uppercase text-slate-500">Professional Summary</label>
          <button
            onClick={handleAiSummary}
            disabled={isAiLoading}
            className="flex items-center gap-1 text-[10px] font-bold text-accent hover:text-blue-600 transition-colors bg-blue-50 px-2 py-1 rounded"
          >
            <Sparkles size={12} />
            {isAiLoading ? 'THINKING...' : 'AI SUGGEST'}
          </button>
        </div>
        <textarea
          rows={6}
          className="p-3 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-accent outline-none transition-all resize-none text-sm leading-relaxed"
          value={data.personalInfo.summary}
          onChange={(e) => updatePersonalInfo('summary', e.target.value)}
        />
      </div>
    </div>
  );

  const renderExperience = () => (
    <div className="flex flex-col gap-8">
      <div className="flex justify-between items-center">
        <h3 className="font-display font-bold text-slate-700">Work Experience</h3>
        <button
          onClick={addExperience}
          className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-slate-800 transition-colors"
        >
          <Plus size={16} /> Add Role
        </button>
      </div>

      <div className="flex flex-col gap-10">
        {data.experience.map((exp, idx) => (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            key={exp.id}
            className="p-6 bg-slate-50 border border-slate-200 rounded-xl relative group"
          >
            <button
              onClick={() => removeExperience(exp.id)}
              className="absolute top-4 right-4 text-slate-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
            >
              <Trash2 size={18} />
            </button>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <input
                placeholder="Job Title"
                className="p-2 bg-transparent border-b border-slate-300 focus:border-accent outline-none font-bold text-lg"
                value={exp.position}
                onChange={(e) => updateExperience(exp.id, 'position', e.target.value)}
              />
              <input
                placeholder="Company Name"
                className="p-2 bg-transparent border-b border-slate-300 focus:border-accent outline-none font-medium text-slate-600"
                value={exp.company}
                onChange={(e) => updateExperience(exp.id, 'company', e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="flex items-center gap-2">
                <input
                  type="month"
                  className="p-2 bg-white border border-slate-200 rounded text-xs"
                  value={exp.startDate}
                  onChange={(e) => updateExperience(exp.id, 'startDate', e.target.value)}
                />
                <span className="text-slate-400">to</span>
                <input
                  type="month"
                  className="p-2 bg-white border border-slate-200 rounded text-xs"
                  value={exp.endDate}
                  disabled={exp.current}
                  onChange={(e) => updateExperience(exp.id, 'endDate', e.target.value)}
                />
              </div>
              <label className="flex items-center gap-2 text-xs font-bold text-slate-500 cursor-pointer">
                <input
                  type="checkbox"
                  checked={exp.current}
                  className="w-4 h-4 rounded border-slate-300 text-accent focus:ring-accent"
                  onChange={(e) => updateExperience(exp.id, 'current', e.target.checked)}
                />
                Present Position
              </label>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-bold uppercase text-slate-400">Responsibilities</label>
              {exp.description.map((bullet, bIdx) => (
                <div key={bIdx} className="flex gap-2">
                  <span className="text-slate-300 mt-2">•</span>
                  <input
                    className="flex-1 p-2 bg-white border border-slate-100 rounded text-sm focus:ring-1 focus:ring-accent outline-none"
                    value={bullet}
                    onChange={(e) => {
                      const newDesc = [...exp.description];
                      newDesc[bIdx] = e.target.value;
                      updateExperience(exp.id, 'description', newDesc);
                    }}
                  />
                  <button
                    onClick={() => {
                        const newDesc = exp.description.filter((_, i) => i !== bIdx);
                        updateExperience(exp.id, 'description', newDesc);
                    }}
                    className="text-slate-200 hover:text-red-400"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
              <button
                onClick={() => {
                  updateExperience(exp.id, 'description', [...exp.description, '']);
                }}
                className="text-[10px] font-bold text-accent mt-2 hover:underline w-fit"
              >
                + ADD POINT
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );

  const renderSkills = () => (
    <div className="flex flex-col gap-8">
      <div className="flex justify-between items-center">
        <h3 className="font-display font-bold text-slate-700">Skills & Expertise</h3>
        <button
          onClick={handleAiSkills}
          disabled={isAiLoading}
          className="flex items-center gap-2 bg-blue-50 text-accent px-4 py-2 rounded-lg text-sm font-bold hover:bg-blue-100 transition-colors"
        >
          <Sparkles size={16} /> {isAiLoading ? 'GENERATING...' : 'AI SUGGEST SKILLS'}
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {data.skills.map((skill) => (
          <div key={skill.id} className="flex items-center gap-3 p-3 bg-white border border-slate-200 rounded-lg group">
            <input
              className="flex-1 text-sm font-medium outline-none"
              value={skill.name}
              onChange={(e) => {
                onChange({
                  ...data,
                  skills: data.skills.map(s => s.id === skill.id ? { ...s, name: e.target.value } : s)
                });
              }}
            />
            <button
              onClick={() => {
                onChange({ ...data, skills: data.skills.filter(s => s.id !== skill.id) });
              }}
              className="text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}
        <button
          onClick={() => {
            const newSkill: Skill = { id: Date.now().toString(), name: '', level: 'Intermediate' };
            onChange({ ...data, skills: [...data.skills, newSkill] });
          }}
          className="p-3 border-2 border-dashed border-slate-200 rounded-lg text-slate-400 text-sm font-bold hover:border-accent hover:text-accent transition-all"
        >
           + ADD SKILL
        </button>
      </div>
    </div>
  );

  const renderEducation = () => (
    <div className="flex flex-col gap-8">
      <div className="flex justify-between items-center">
        <h3 className="font-display font-bold text-slate-700">Education</h3>
        <button
          onClick={addEducation}
          className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-slate-800 transition-colors"
        >
          <Plus size={16} /> Add Degree
        </button>
      </div>

      <div className="flex flex-col gap-8">
        {data.education.map((edu) => (
          <div key={edu.id} className="p-6 bg-white border border-slate-200 rounded-xl relative group">
            <button
              onClick={() => removeEducation(edu.id)}
              className="absolute top-4 right-4 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100"
            >
              <Trash2 size={16} />
            </button>
            <div className="grid grid-cols-2 gap-4">
              <input
                placeholder="School/University"
                className="col-span-2 p-2 bg-transparent border-b border-slate-200 focus:border-accent outline-none font-bold text-lg"
                value={edu.school}
                onChange={(e) => updateEducation(edu.id, 'school', e.target.value)}
              />
              <input
                placeholder="Degree (e.g. Bachelor of Science)"
                className="p-2 border-b border-slate-100 outline-none text-sm"
                value={edu.degree}
                onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)}
              />
              <input
                placeholder="Year (e.g. 2020)"
                className="p-2 border-b border-slate-100 outline-none text-sm text-right font-mono"
                value={edu.endDate}
                onChange={(e) => updateEducation(edu.id, 'endDate', e.target.value)}
              />
            </div>
          </div>
        ))}
        {data.education.length === 0 && (
          <div className="text-center py-10 border-2 border-dashed border-slate-100 rounded-2xl">
            <p className="text-slate-400 text-sm">No education records added yet.</p>
          </div>
        )}
      </div>
    </div>
  );

  const renderAiLab = () => (
    <div className="flex flex-col gap-6">
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-6 rounded-2xl text-white">
        <div className="flex items-center gap-3 mb-4">
          <Sparkles className="text-accent" />
          <h3 className="font-display font-bold text-xl">AI Keyword Lab</h3>
        </div>
        <p className="text-slate-400 text-sm mb-6">Paste a job description below, and I'll analyze your resume's reach and suggest optimizations for ATS systems.</p>
        
        <textarea
          placeholder="Paste job description here..."
          className="w-full h-40 bg-white/5 border border-white/10 rounded-xl p-4 text-sm font-sans focus:bg-white/10 outline-none transition-all placeholder:text-slate-600 mb-4"
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
        />

        <button
          onClick={handleAiAnalysis}
          disabled={isAiLoading || !jobDescription}
          className="w-full bg-accent hover:bg-blue-600 py-3 rounded-xl font-bold transition-all disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {isAiLoading ? (
            <>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
              />
              ANALYZING...
            </>
          ) : (
            <>OPTIMIZE FOR ATS</>
          )}
        </button>
      </div>

      {aiAnalysis && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white border border-slate-200 p-6 rounded-2xl"
        >
          <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3 flex items-center gap-2">
            <Sparkles size={14} className="text-accent" /> Analysis Result
          </h4>
          <div className="prose prose-slate prose-sm max-w-none text-slate-600 whitespace-pre-line leading-relaxed">
            {aiAnalysis}
          </div>
        </motion.div>
      )}
    </div>
  );

  return (
    <div className="flex flex-col h-full bg-transparent w-full">
      <div className="p-8">
        <div className="flex items-center gap-2 mb-8">
          <div className="w-10 h-10 bg-accent/10 rounded-xl flex items-center justify-center">
             <Edit3 size={18} className="text-accent" />
          </div>
          <div>
            <h2 className="font-display font-bold text-slate-900 text-xl tracking-tight">
              {activeTab === 'personal' && 'Personal Profile'}
              {activeTab === 'experience' && 'Work Experience'}
              {activeTab === 'education' && 'Education & Degrees'}
              {activeTab === 'skills' && 'Skills & Expertise'}
              {activeTab === 'ai' && 'AI Optimization Lab'}
            </h2>
            <p className="text-xs text-text-muted mt-0.5">Edit your contents here</p>
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === 'personal' && renderPersonal()}
            {activeTab === 'experience' && renderExperience()}
            {activeTab === 'skills' && renderSkills()}
            {activeTab === 'education' && renderEducation()}
            {activeTab === 'ai' && renderAiLab()}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};
