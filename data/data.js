const DATA = {

  profile: {
    photo: "data/face.jpg",
    ko: {
      name: "채지운",
      major: "AI.SW학부(인공지능공학전공)",
      desc: "백엔드와 서버, 그리고 AI.",
    },
    en: {
      name: "Chae Ji-woon",
      major: "AI·SW Dept. (Artificial Intelligence Engineering)",
      desc: "Backend, Server, and AI.",
    },
  },

  about: {
    ko: "인공지능 공학을 전공하며, AI Persona에 대해 관심이있습니다. 저를 위한 개발하는 삶을 목표로 SI, SM에 관심을 가지며 관련 지식을 습득하고있습니다.",
    en: "Majoring in AI Engineering with a keen interest in AI Persona. Aiming to build a life centered on personal projects, I am actively expanding my knowledge in SI and SM.",
  },

  education: {
    ko: [
      { label: "학교명",         value: "조선대학교" },
      { label: "학과",           value: "AI.SW학부(인공지능공학전공)" },
      { label: "학년",           value: "3학년" },
      { label: "재학 기간",      value: "3년" },
      { label: "주요 과목",      value: "딥러닝 기초, 컴퓨터 네트워크, AI 디지털 미디어" },
      { label: "Academic Score", value: "3.75" },
    ],
    en: [
      { label: "School",         value: "Chosun University" },
      { label: "Major",          value: "AI·SW Dept. (AI Engineering)" },
      { label: "Year",           value: "3rd Year" },
      { label: "Duration",       value: "3 Years" },
      { label: "Key Courses",    value: "Deep Learning Basics, Computer Networks, AI Digital Media" },
      { label: "Academic Score", value: "3.75" },
    ],
  },

  skills: [
    {
      category: "Programming",
      items: [
        { name: "Java",   level: "중" },
        { name: "Unity",  level: "상" },
        { name: "Python", level: "중" },
        { name: "C",      level: "중" },
      ],
    },
    {
      category: "Web",
      items: [
        { name: "Spring Boot", level: "중" },
        { name: "HTML",        level: "하" },
      ],
    },
    {
      category: "Tools",
      items: [
        { name: "Git",     level: "중" },
        { name: "VS Code", level: "중상" },
        { name: "Claude",  level: "중" },
        { name: "DBeaver", level: "하" },
      ],
    },
    {
      category: "Database",
      items: [
        { name: "MySQL",      level: "하" },
        { name: "SQLite",     level: "하" },
        { name: "PostgreSQL", level: "하" },
      ],
    },
  ],

  projects: [
    {
      name: "DeepFurnace",
      url: "https://deepfurnace.com",
      ko: { desc: "AI 문제 풀이 사이트 - 제작중" },
      en: { desc: "AI problem-solving platform" },
    },
    {
      name: "DazzaGozza",
      url: "https://dazzagozza.com",
      ko: { desc: "용량 제한 없는 파일 공유 사이트" },
      en: { desc: "Unlimited file sharing service" },
    },
  ],

  experience: [
    {
      ko: { tab: "교내 코드포스 경진대회", type: "알고리즘 대회", period: "26/04/08", activity: "참여",  result: "3등" },
      en: { tab: "Campus Codeforces",       type: "Algorithm Contest", period: "26/04/08", activity: "Participant", result: "3rd Place" },
    },
    {
      ko: { tab: "AI문제 사이트", type: "Web", period: "26/05~", activity: "백엔드",  result: "제작중" },
      en: { tab: "AI Problem Site", type: "Web", period: "26/05~", activity: "Backend", result: "In Progress" },
    },
    {
      ko: { tab: "itchio 게임잼", type: "게임 해커톤", period: "25/06~", activity: "전체",       result: "순위권 외" },
      en: { tab: "itch.io Game Jam", type: "Game Hackathon", period: "25/06~", activity: "Full Stack", result: "Unranked" },
    },
  ],

  cv: {
    ko: { label: "↓ PDF 다운로드" },
    en: { label: "↓ Download PDF" },
  },

  careerGoals: {
    ko: ["졸업", "Project DF"],
    en: ["Graduation", "Project DF"],
  },

  contact: {
    email:  "r14n7jng@gmail.com",
    github: "https://github.com/EmptyBug",
  },

  i18n: {
    ko: {
      overview:   "개요",
      education:  "Education",
      skills:     "Skills",
      projects:   "Projects",
      experience: "Experience",
      cv:         "CV / Resume",
      careerGoal: "커리어 목표",
      expLabels: { type: "유형", period: "기간", activity: "활동 내용", result: "성과" },
    },
    en: {
      overview:   "About",
      education:  "Education",
      skills:     "Skills",
      projects:   "Projects",
      experience: "Experience",
      cv:         "CV / Resume",
      careerGoal: "Career Goal",
      expLabels: { type: "Type", period: "Period", activity: "Activity", result: "Result" },
    },
  },

};
