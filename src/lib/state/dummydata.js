import icons from "../icons";

export default {
  // --- CONTACT AND SUMMARY DETAILS ---
  details: {
    // 🎯 Use a Placeholder Name
    name: "Professional Resume Demo",
    // 📝 Your Career Summary/Objective goes here
    about:
      "Detail-oriented and results-driven professional with experience in data analysis, problem-solving, and strategic thinking. Seeking a challenging role to leverage skills in technology and data science for impactful business outcomes.",
    // 📧 Use a placeholder email
    email: "placeholder@example.com",
    // 📞 Use a placeholder phone
    phone: "+91 00000 00000",
    // 📍 Placeholder Location
    location: "City, Country",
    // 💼 Your main job title or focus
    role: 'Data Science Professional',
    // Uncomment and replace with your actual URLs
    // github: "YourGitHubUsername",
    // linkedin: "YourLinkedInProfileURL",
  },

  // --- PROFESSIONAL EXPERIENCE / INTERNSHIPS ---
  workExp: [
    {
      company: "Encryptix",
      title: "C++ Developer Intern",
      date: "July 10 – August 10 2024",
      // Responsibilities for this role
      desc: [
        "- Learned how to write clean, maintainable, and testable code.",
        "- Enhanced problem-solving and logical thinking skills through real-world coding tasks and structured programming practice.",
      ].join("\n"),
    },
    {
      company: "Outlier",
      title: "AI Trainer",
      date: "Specific Dates/Current", // *You'll need to fill in the date range here*
      desc: [
        "- Assisted in curating datasets for training, validation, and testing of AI models.",
        "- Accurately tagged and labeled datasets used to train AI models.",
        "- Identified edge cases, outliers, or inconsistencies in data that could impact AI performance.",
      ].join("\n"),
    },
  ],

  // --- EDUCATION ---
  education: [
    {
      institution: "Guru Tegh Bahadur Institute Of Technology",
      date: "Nov 2022 – July 2026",
      qualification: "Bachelor of Technology (Information & Technology)",
      // You can add GPA or other details here for display on some templates
      details: "8.2 GPA", 
    },
  ],

  // --- PROJECTS ---
  projects: [
    {
      name: "Bellabeat: Smart Device Usage Analysis",
      link: "#", // Add project link if available, otherwise use "#"
      desc: "Conducted in-depth analysis of smart device usage patterns using a publicly available dataset to generate actionable insights for Bellabeat, a wellness technology company. Explored user behaviour across health metrics, identifying key trends and usage clusters. Delivered a comprehensive analytical report including data cleaning, transformation (R tidyverse), and key insights using R (ggplot2).",
    },
  ],

  // --- SKILLS AND CERTIFICATIONS/COURSES ---
  // We combine the technical skills and courses here for simplicity and impact.
  skills: [
    // Technical Skills
    { name: "C++", icon: icons.cpp }, 
    { name: "R", icon: icons.r },
    { name: "Python", icon: icons.python },
    { name: "DBMS / SQL", icon: icons.sql },
    { name: "Data Structures & Algorithms", icon: icons.dsa }, 
    { name: "Data Analysis", icon: icons.analysis }, 
    { name: "Data Visualization", icon: icons.visualization },
    
    // Software & Tools
    { name: "My SQL", icon: icons.mysql },
    { name: "Tableau", icon: icons.tableau },
    { name: "Microsoft Excel/PowerPoint", icon: icons.excel },

    // Courses / Certifications (Grouped under a logical name if necessary)
    { name: "DSA using C++ (Udemy)", icon: icons.udemy },
    { name: "Google Data Analytics Professional Certificate", icon: icons.google },
    { name: "Google Cloud Foundations", icon: icons.googlecloud },
  ],

  // --- EXTRACURRICULAR ACTIVITIES (as a separate array, if supported by the template) ---
  // Since the original file didn't have a specific 'extracurricular' section, 
  // we'll format it as a custom 'award' or 'activity' section. You might need
  // to adjust your chosen Svelte template to display this.
  activities: [
    {
        name: "IPL Auction Simulation | College Fest 2025",
        date: "3rd Prize",
        desc: [
            "- Applied strategic decision-making and budget analysis to build a competitive virtual team.",
            "- Demonstrated strong decision-making and team collaboration skills."
        ].join("\n")
    }
  ],
};