/**
 * Portfolio content, taken from the public repos at github.com/grizz6 (READMEs and code, Oct 2026), the resume
 * (Sept 2026) and the documents in files/. Numbers come from the repos' own READMEs.
 * The resume itself is not published. No phone number, GPA, or location on the site.
 */
window.PORTFOLIO = {
  name: "Grishma Gajurel",
  title: "Data analyst · Software engineer · Photographer",
  headline: "I clean, combine and model messy data, then report what it shows.",
  email: "gajurel.grizma@gmail.com",
  github: "https://github.com/grizz6",
  social: [
    { label: "GitHub", href: "https://github.com/grizz6" },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/grishma-gajurel-54891a2b5/" },
  ],

  // Each project draws a small live figure (`viz`) of what it does. The first four show; the rest sit behind Load more.
  projects: [
    {
      title: "Filings Q&A", year: "2026", viz: "cite",
      line: "Ask what a US company says about its risks. Every sentence of the answer cites the 10-K passage it came from, and questions the filings don't cover get “Not found.”",
      facts: ["90% right passage found", "10/10 unanswerable declined", "10 companies"],
      tags: ["pgvector", "Gemini", "Streamlit", "MLflow"],
      links: [{ label: "Live app", href: "https://filings.streamlit.app" }, { label: "Code", href: "https://github.com/grizz6/filings-qa" }],
    },
    {
      title: "synthkit", year: "2026", viz: "copula",
      line: "Test data with the shape of production and none of its rows. It learns how columns move together, so tests that depend on a correlation still pass.",
      facts: ["385 tests", "~2M rows/s", "Python 3.10–3.13"],
      tags: ["Gaussian copula", "pytest plugin", "CI"],
      links: [{ label: "Code", href: "https://github.com/grizz6/synthkit" }],
    },
    {
      title: "AI Data Analyst", year: "2026", viz: "outliers",
      line: "Drop in a CSV and get the whole exploratory pass: gaps, outliers with likely causes, relationships and next steps. The language model may only quote numbers pandas computed.",
      facts: ["CSV up to 200 MB", "every number checked"],
      tags: ["FastAPI", "pandas", "statsmodels", "React"],
      links: [{ label: "Live app", href: "https://ai-data-analyst-xz78.onrender.com" }, { label: "Code", href: "https://github.com/grizz6/ai-data-analyst" }],
    },
    {
      title: "Computer-use automation", year: "2026", viz: "replay",
      line: "A model works out a task in an old app with no API by clicking through it. The run is saved as a typed capability that replays without the model and hands over to a person when stuck.",
      facts: ["learn once, replay free", "human handoff"],
      tags: ["Playwright", "Pydantic", "Gemini"],
      links: [{ label: "Code", href: "https://github.com/grizz6/interface-ai-takehome" }],
    },
    {
      title: "Urban bee behaviour", year: "2025", viz: "bees",
      line: "Does a bee's species, or the pavement around an orchard, change how it forages? Camcorder ethograms from St. Louis orchards, 2022–2024. Co-authored poster at ESA 2025.",
      facts: ["10 behaviours", "binomial mixed models"],
      tags: ["R", "lme4", "GIS"],
      links: [{ label: "Poster", href: "files/Slide1.jpg" }, { label: "SEED report", href: "files/insect-distribution-usda.pdf" }, { label: "Code", href: "https://github.com/grizz6/ESA" }],
    },
    {
      title: "Orchard phenology & weather", year: "2025", viz: "bloom",
      line: "When the trees flower, when the insects fly, and how warm each orchard runs, with weather rebuilt for sites that had no station.",
      facts: ["growing degree days", "RAD 2025 talk"],
      tags: ["R", "mixed models"],
      links: [{ label: "Report", href: "files/weather-regression.pdf" }, { label: "Slides", href: "files/rad.pdf" }, { label: "Code", href: "https://github.com/grizz6/R-Projects" }],
    },
    {
      title: "Analytics practicum", year: "2025", viz: "roc",
      line: "Three end-to-end models in R: which mortgages default, which catalogue customers buy, and what a used phone is worth.",
      facts: ["random forest", "gradient boosting", "neural nets"],
      tags: ["R", "caret", "glmnet"],
      links: [{ label: "Mortgage", href: "files/mortgage-payback.pdf" }, { label: "Mailing", href: "files/software-mailing.pdf" }, { label: "Phones", href: "files/used-smartphone.pdf" }, { label: "Code", href: "https://github.com/grizz6/Academic-Project---Webster-University" }],
    },
    {
      title: "Python notebooks", year: "2025", viz: "heat",
      line: "When 911 calls peak across 99,492 emergency calls, and a survival model on 20,000 patient records.",
      facts: ["99,492 calls", "20,000 records"],
      tags: ["pandas", "seaborn", "scikit-learn"],
      links: [{ label: "Code", href: "https://github.com/grizz6/Python-mini-projects" }],
    },
  ],

  experience: [
    { dates: "2024 – 2025", role: "Research Assistant, Data Analysis", org: "Webster University", line: "Merged 10,000+ records from seven institutions into one validated dataset for a USDA-funded pollination study." },
    { dates: "2021 – 2023", role: "Software Engineer", org: "Aaran Tech", line: "Made production SQL and PySpark jobs 60% faster; built Laravel APIs with React front ends." },
  ],
  // Photographs for the film strip. Put the files in photos/ and add one entry each; the section stays hidden while this is empty.
  // Example: { src: "photos/forest-park.jpg", title: "Forest Park, St. Louis", settings: "35mm · ƒ/2 · 1/500 · ISO 100", year: "2026" }
  photos: [],

  skills: ["SQL", "Python", "R", "pandas", "scikit-learn", "statsmodels", "dbt", "BigQuery", "PostgreSQL", "pgvector", "Tableau", "Power BI", "FastAPI", "React", "Playwright", "GitHub Actions"],
};
