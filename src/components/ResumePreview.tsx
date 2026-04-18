import React from 'react';
import { ResumeData, TemplateId } from '../types';
import { Mail, Phone, MapPin, Globe, Linkedin, Github } from 'lucide-react';
import { cn } from '../lib/utils';

interface Props {
  data: ResumeData;
  template: TemplateId;
}

export const ResumePreview = React.forwardRef<HTMLDivElement, Props>(({ data, template }, ref) => {
  const { personalInfo, experience, education, skills, projects, interests } = data;

  const renderModern = () => (
    <div className="flex h-full text-[10pt] text-slate-700">
      {/* Sidebar */}
      <div className="w-1/3 bg-slate-900 text-white p-8 flex flex-col gap-8">
        <div>
          <h1 className="text-2xl font-display font-bold leading-tight mb-2">{personalInfo.fullName}</h1>
          <p className="text-slate-400 font-medium uppercase tracking-wider text-[8pt]">{personalInfo.title}</p>
        </div>

        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2 text-slate-300">
            <Mail size={14} className="text-accent" />
            <span className="truncate">{personalInfo.email}</span>
          </div>
          <div className="flex items-center gap-2 text-slate-300">
            <Phone size={14} className="text-accent" />
            <span>{personalInfo.phone}</span>
          </div>
          <div className="flex items-center gap-2 text-slate-300">
            <MapPin size={14} className="text-accent" />
            <span>{personalInfo.location}</span>
          </div>
          {personalInfo.website && (
            <div className="flex items-center gap-2 text-slate-300">
              <Globe size={14} className="text-accent" />
              <span className="truncate">{personalInfo.website}</span>
            </div>
          )}
        </div>

        <div>
          <h3 className="text-xs font-display font-bold uppercase tracking-widest text-slate-400 mb-4 border-b border-white/10 pb-2">Skills</h3>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill) => (
              <span key={skill.id} className="bg-white/10 px-2 py-1 rounded text-[8pt] border border-white/5">
                {skill.name}
              </span>
            ))}
          </div>
        </div>

        {interests.length > 0 && (
          <div>
            <h3 className="text-xs font-display font-bold uppercase tracking-widest text-slate-400 mb-4 border-b border-white/10 pb-2">Interests</h3>
            <div className="flex flex-col gap-2 opacity-80">
              {interests.map((interest, i) => (
                <span key={i} className="text-[9pt]">• {interest}</span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 p-10 flex flex-col gap-8 overflow-hidden bg-white">
        <div>
          <h3 className="text-sm font-display font-bold uppercase tracking-widest text-slate-900 mb-4 border-b-2 border-slate-900 pb-2">Executive Profile</h3>
          <p className="leading-relaxed text-slate-600">{personalInfo.summary}</p>
        </div>

        <div>
          <h3 className="text-sm font-display font-bold uppercase tracking-widest text-slate-900 mb-4 border-b-2 border-slate-900 pb-2">Experience</h3>
          <div className="flex flex-col gap-6">
            {experience.map((exp) => (
              <div key={exp.id}>
                <div className="flex justify-between items-baseline mb-1">
                  <h4 className="font-bold text-slate-900 text-[11pt]">{exp.position}</h4>
                  <span className="font-mono text-slate-400 text-[8pt]">{exp.startDate} — {exp.endDate}</span>
                </div>
                <p className="text-accent font-medium mb-2">{exp.company}</p>
                <ul className="list-disc list-outside ml-4 flex flex-col gap-1 text-slate-600">
                  {exp.description.map((bullet, i) => (
                    <li key={i}>{bullet}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-display font-bold uppercase tracking-widest text-slate-900 mb-4 border-b-2 border-slate-900 pb-2">Education</h3>
          <div className="flex flex-col gap-4">
            {education.map((edu) => (
              <div key={edu.id}>
                <div className="flex justify-between items-baseline">
                  <h4 className="font-bold text-slate-900">{edu.school}</h4>
                  <span className="font-mono text-slate-400 text-[8pt]">{edu.startDate} — {edu.endDate}</span>
                </div>
                <p className="text-slate-600 italic">{edu.degree} {edu.fieldOfStudy}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderMinimal = () => (
    <div className="p-12 flex flex-col gap-10 text-[10pt] text-slate-700 bg-white h-full font-sans">
      <header className="text-center border-b pb-8">
        <h1 className="text-4xl font-serif font-light tracking-tight text-slate-900 mb-4">{personalInfo.fullName}</h1>
        <div className="flex items-center justify-center gap-4 text-slate-400 text-[9pt]">
          <span>{personalInfo.email}</span>
          <span>•</span>
          <span>{personalInfo.phone}</span>
          <span>•</span>
          <span>{personalInfo.location}</span>
        </div>
      </header>

      <div className="grid grid-cols-12 gap-10">
        <div className="col-span-8 flex flex-col gap-10">
          <section>
            <h2 className="text-xs uppercase tracking-[0.2em] font-bold text-slate-400 mb-4">Philosophy</h2>
            <p className="text-[11pt] leading-relaxed text-slate-600 font-light italic">"{personalInfo.summary}"</p>
          </section>

          <section>
            <h2 className="text-xs uppercase tracking-[0.2em] font-bold text-slate-400 mb-6">Work History</h2>
            <div className="flex flex-col gap-8">
              {experience.map((exp) => (
                <div key={exp.id} className="relative pl-6 border-l border-slate-100">
                  <div className="absolute top-0 left-[-4px] w-2 h-2 rounded-full bg-slate-200" />
                  <div className="mb-2">
                    <h3 className="text-[12pt] font-medium text-slate-900">{exp.position}</h3>
                    <div className="flex justify-between text-slate-400 text-[9pt]">
                      <span>{exp.company}</span>
                      <span className="font-mono">{exp.startDate} — {exp.endDate}</span>
                    </div>
                  </div>
                  <ul className="flex flex-col gap-2 text-slate-600">
                    {exp.description.map((bullet, i) => (
                      <li key={i} className="leading-relaxed">• {bullet}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="col-span-4 flex flex-col gap-10">
          <section>
            <h2 className="text-xs uppercase tracking-[0.2em] font-bold text-slate-400 mb-6 font-mono">Competencies</h2>
            <div className="flex flex-col gap-4">
              {skills.map((skill) => (
                <div key={skill.id}>
                  <p className="text-[9pt] font-medium text-slate-700">{skill.name}</p>
                </div>
              ))}
            </div>
          </section>

           <section>
            <h2 className="text-xs uppercase tracking-[0.2em] font-bold text-slate-400 mb-6">Background</h2>
            <div className="flex flex-col gap-6">
              {education.map((edu) => (
                <div key={edu.id}>
                  <h4 className="font-medium text-slate-900">{edu.school}</h4>
                  <p className="text-[9pt] text-slate-500">{edu.degree}</p>
                  <p className="text-[8pt] text-slate-400 font-mono italic">{edu.endDate}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );

  const renderProfessional = () => (
    <div className="p-10 flex flex-col gap-8 text-[10pt] text-slate-800 bg-white h-full shadow-none border-none">
      <header className="border-b-2 border-slate-900 pb-4">
        <h1 className="text-3xl font-display font-extrabold text-slate-900 tracking-tight leading-none uppercase">{personalInfo.fullName}</h1>
        <p className="text-xs text-slate-500 mt-2 font-medium">
          {personalInfo.title} • {personalInfo.location} • {personalInfo.email}
        </p>
      </header>

      <section>
        <div className="text-[12px] font-bold uppercase tracking-widest text-accent border-b border-slate-200 pb-1 mb-2 flex justify-between items-center">
          <span>Professional Summary</span>
          <span className="ai-badge">AI Optimized</span>
        </div>
        <div className="summary-box">
          <p className="text-[11px] leading-relaxed text-slate-700">{personalInfo.summary}</p>
        </div>
      </section>

      <section>
        <div className="text-[12px] font-bold uppercase tracking-widest text-accent border-b border-slate-200 pb-1 mb-4">
          Work Experience
        </div>
        <div className="flex flex-col gap-6">
          {experience.map((exp) => (
            <div key={exp.id}>
              <div className="flex justify-between items-baseline mb-1">
                <h3 className="font-bold text-slate-900 text-[12px]">{exp.company.toUpperCase()}</h3>
                <span className="text-[11px] font-bold text-slate-500">{exp.startDate.toUpperCase()} — {exp.endDate.toUpperCase()}</span>
              </div>
              <div className="italic text-accent font-semibold text-[11px] mb-2">{exp.position}</div>
              <ul className="list-disc list-inside space-y-1">
                {exp.description.map((bullet, i) => (
                  <li key={i} className="text-[11px] text-slate-700 leading-normal">{bullet}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section>
        <div className="text-[12px] font-bold uppercase tracking-widest text-accent border-b border-slate-200 pb-1 mb-3">
          Core Skills
        </div>
        <div className="flex flex-wrap gap-2">
          {skills.map((skill) => (
            <span key={skill.id} className="bg-slate-100 px-2 py-1 rounded-sm text-[10px] text-slate-700 font-medium">
              {skill.name}
            </span>
          ))}
        </div>
      </section>
    </div>
  );

  return (
    <div ref={ref} className="resume-paper shadow-2xl relative overflow-hidden">
      {template === 'modern' && renderModern()}
      {template === 'minimal' && renderMinimal()}
      {template === 'professional' && renderProfessional()}
      {template === 'creative' && renderModern()} {/* Fallback for now */}
    </div>
  );
});

ResumePreview.displayName = 'ResumePreview';
