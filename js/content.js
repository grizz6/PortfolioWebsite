/**
 * Portfolio content. Sources: Grishma_Gajurel_Resume_MASTER.pdf (Sept 2026), github.com/grizz6, and the documents
 * in files/ (the ESA 2025 poster, the SEED St. Louis report and the RAD slides).
 * Kept short on purpose: six selected projects, one line per role. Everything else lives on GitHub.
 * The resume itself is not published. No phone number, GPA, or location on the site.
 */
window.PORTFOLIO = {
  name: "Grishma Gajurel",
  title: "Data analyst · Software engineer",
  headline: "I clean, combine and model messy data, then report what it shows.",
  email: "gajurel.grizma@gmail.com",
  github: "https://github.com/grizz6",
  social: [
    { label: "GitHub", href: "https://github.com/grizz6" },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/grishma-gajurel-54891a2b5/" },
  ],
  status: [
    { label: "Building", text: "synthkit", href: "https://github.com/grizz6/synthkit" },
    { label: "Open to", text: "new opportunities" },
  ],

  projects: [
    { title: "synthkit", year: "2026", summary: "Python library that generates realistic test data without using real records. 316 tests in CI.", tags: ["Python", "Gaussian copula", "CI"], href: "https://github.com/grizz6/synthkit" },
    { title: "AI Data Analyst Agent", year: "2026", summary: "Spreadsheet in, verifiable report out. The model can only cite numbers the pandas pipeline computed.", tags: ["FastAPI", "pandas", "React"], href: "https://github.com/grizz6/AI-Data-Analyst-Agent" },
    { title: "Urban bee foraging", year: "2025", summary: "Bee behaviour at 10 orchards along an urbanization gradient. Co-authored poster, ESA 2025.", tags: ["R", "GLM"], href: "files/Slide1.jpg" },
    { title: "Pollination report", year: "2025", summary: "Preliminary findings for SEED St. Louis from a USDA-funded study of 18 orchards.", tags: ["R", "Reporting"], href: "files/insect-distribution-usda.pdf" },
    { title: "Orchard weather regression", year: "2025", summary: "Rebuilt weather for orchards without stations and modelled heat against urbanization. RAD 2025.", tags: ["R", "Mixed models"], href: "files/weather-regression.pdf" },
    { title: "Mortgage default", year: "2025", summary: "Compared regression, random forest and gradient boosting to predict which loans default.", tags: ["R", "ML"], href: "files/mortgage-payback.pdf" },
  ],

  experience: [
    { dates: "2024 – 2025", role: "Research Assistant, Data Analysis", org: "Webster University", line: "Merged 10,000+ records from seven institutions into one validated dataset for a USDA-funded pollination study." },
    { dates: "2021 – 2023", role: "Software Engineer", org: "Aaran Tech", line: "Made production SQL and PySpark jobs 60% faster; built Laravel APIs with React front ends." },
  ],
  education: [
    { dates: "2026", role: "M.S. Data Analytics", org: "Webster University" },
    { dates: "2022", role: "B.S. Computing", org: "London Metropolitan University" },
  ],

  // Photographs for the film strip. Put the files in photos/ and add one entry each; the section stays hidden while this is empty.
  // Example: { src: "photos/forest-park.jpg", title: "Forest Park, St. Louis", settings: "35mm · ƒ/2 · 1/500 · ISO 100", year: "2026" }
  photos: [],

  skills: ["SQL", "Python", "R", "pandas", "scikit-learn", "dbt", "BigQuery", "PostgreSQL", "Tableau", "Power BI", "FastAPI", "React", "GitHub Actions"],
};
