import { ResumeData } from '../types';

export const initialResumeData: ResumeData = {
  personalInfo: {
    fullName: "Mongezi Sikiti",
    title: "Growth & Commercial Strategy",
    email: "sikiti.m@gmail.com",
    phone: "071 788 2567",
    location: "Parklands, Cape Town",
    website: "linkedin.com/in/mongezisikiti",
    summary: "Growth-focused Account Manager and commercial operator with 14+ years across communications, media, marketing, and public service. Known for translating complex portfolio performance into clear growth plays, aligning stakeholders around measurable outcomes, and executing integrated campaigns that drive revenue, efficiency, and brand momentum."
  },
  experience: [
    {
      id: "1",
      company: "Takealot RF",
      position: "Account Manager (Retail Media)",
      location: "Cape Town",
      startDate: "2024-02",
      endDate: "Present",
      current: true,
      description: [
        "Serve as a strategic partner to suppliers, matching business objectives to performance-driven advertising solutions across App, Web, and Mobile.",
        "Build account strategies that connect audience, offer, channel, and measurement, translating performance into next-best actions.",
        "Lead campaign execution end-to-end: briefing, planning, coordination, flighting, optimization inputs, and reporting.",
        "Portfolio Impact: 74 brands across 5 categories, R914.6M Ad spend influenced."
      ]
    },
    {
      id: "2",
      company: "Fresh Advertising & Marketing",
      position: "Account Manager",
      location: "Cape Town",
      startDate: "2023-07",
      endDate: "2024-01",
      current: false,
      description: [
        "Managed the client–agency interface, maintaining strong relationships and consistent delivery quality.",
        "Coordinated integrated communications plans and ensured on-brand strategy delivery within budget and timelines.",
        "Managed creative development workflows and aligned suppliers/partner agencies."
      ]
    },
    {
      id: "3",
      company: "99 Cents Communications",
      position: "Digital Account Manager",
      location: "Cape Town",
      startDate: "2022-01",
      endDate: "2023-06",
      current: false,
      description: [
        "Managed small-to-medium digital campaigns from briefing to delivery, ensuring tight execution and stakeholder alignment.",
        "Liaised with media partners and third-party suppliers to ensure compliance and performance."
      ]
    }
  ],
  education: [
    {
      id: "edu1",
      school: "University of Johannesburg",
      degree: "BA Humanities",
      fieldOfStudy: "Politics, Psychology, Philosophy, Communications & English",
      startDate: "2004",
      endDate: "2007",
      description: ""
    },
    {
      id: "edu2",
      school: "National School of Government",
      degree: "Short Course",
      fieldOfStudy: "Gender Mainstreaming in the Public Service",
      startDate: "2018",
      endDate: "2018",
      description: ""
    }
  ],
  skills: [
    { id: "s1", name: "Strategic Account Management", level: "Expert" },
    { id: "s2", name: "Retail Media & Advertising", level: "Expert" },
    { id: "s3", name: "Performance Marketing", level: "Advanced" },
    { id: "s4", name: "Stakeholder Engagement", level: "Expert" },
    { id: "s5", name: "Market & Competitor Analysis", level: "Advanced" },
    { id: "s6", name: "CRM Management", level: "Advanced" }
  ],
  projects: [],
  interests: ["Growth Strategy", "Innovation", "Commercial Excellence"]
};
