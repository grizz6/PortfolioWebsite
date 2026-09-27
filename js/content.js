/**
 * Portfolio content. Sources: Grishma_Gajurel_Resume_MASTER.pdf (Sept 2026) and github.com/grizz6.
 * The resume itself is not published. No phone number, GPA, or location on the site.
 */
window.PORTFOLIO = {
  name: "Grishma Gajurel",
  first: "Grishma",
  last: "Gajurel",
  title: "Data Analyst & Software Engineer",
  email: "gajurel.grizma@gmail.com",
  social: [
    { label: "GitHub", href: "https://github.com/grizz6" },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/grishma-gajurel-54891a2b5/" },
    { label: "Instagram", href: "https://www.instagram.com/grizzz.ma" },
  ],

  headline: "I turn messy, multi-source data into models and reports people can act on.",
  summary:
    "I started out writing software, then fell for the questions hiding in data. These days I take data that doesn't agree with itself, get it into one place I can trust, and work out what it's actually saying. I've helped a city nonprofit decide where to act on pollinators, taken that research to a national conference, and I'm building an open-source library so people can test with realistic data instead of real people's records.",

  currently: [
    { label: "Building", text: "synthkit, an open-source library for realistic test data", href: "https://github.com/grizz6/synthkit" },
    { label: "Open to", text: "new opportunities" },
  ],

  stats: [
    { value: 10000, suffix: "+", label: "records unified from 7 partner institutions" },
    { value: 15, label: "urban orchards modeled" },
    { value: 316, label: "automated tests in synthkit" },
    { value: 2, label: "conference presentations" },
  ],

  services: [
    {
      title: "Dashboards & reporting",
      desc: "I turn raw spreadsheets and databases into clear dashboards and reports, so the numbers your team checks every week are right and easy to read.",
      example: "Like the findings report I wrote for SEED St. Louis.",
      tags: ["Tableau", "Power BI", "SQL", "Excel"],
    },
    {
      title: "Statistics & research",
      desc: "Want to know if something really made a difference? I set up the analysis, run the models and explain the answer in plain words.",
      example: "Like figuring out how city life changes the way bees forage.",
      tags: ["R", "Mixed models", "ANOVA"],
    },
    {
      title: "Machine learning",
      desc: "Predicting who will buy, which loans go bad or what something is worth. I build the model and test it properly before anyone relies on it.",
      example: "Like my mortgage default and mailing-campaign models.",
      tags: ["Python", "scikit-learn", "R"],
    },
    {
      title: "Software & data engineering",
      desc: "I build the software around the analysis: Python tools, APIs, pipelines and web front ends, tested and shipped with CI so they keep working after I hand them over.",
      example: "Like synthkit, my open-source library with 316 automated tests.",
      tags: ["Python", "dbt", "FastAPI", "CI/CD"],
    },
  ],

  experience: [
    {
      role: "Research Assistant, Data Analysis",
      org: "Webster University",
      dates: "Feb 2024 – Dec 2025",
      story: "For almost two years I was the data person on an urban pollination study. I merged records from seven institutions into one validated dataset, rebuilt weather for orchards that had no station, caught a hidden bias where zero outcomes had never been written down, and set up checks so the R code tested itself on every push. Along the way I worked with 50+ non-technical stakeholders, wrote the report SEED St. Louis used to plan each orchard, and presented the research nationally.",
      highlights: ["10,000+ records unified", "15 orchards modeled", "50+ stakeholders", "National conference talk"],
      points: [
        "Merged 10,000+ records from seven partner institutions into one validated dataset, lining up site names, dates and units across three field seasons.",
        "Measured how city density changes 10 bee foraging behaviors across 15 orchards, and took the findings to a national ecology conference.",
        "Rebuilt temperature for orchards with no weather station, and fixed a bias caused by zero outcomes that had never been recorded.",
        "Turned the questions of 50+ non-technical stakeholders into clean datasets and clear recommendations, including the report SEED St. Louis used to plan each orchard.",
      ],
    },
    {
      role: "Software Engineer",
      org: "Aaran Tech Private Limited",
      dates: "Feb 2021 – Jun 2023",
      story: "Before data, I spent over two years as a software engineer on e-commerce products. I designed database schemas, rewrote slow SQL and PySpark transformations so they ran 60% faster, wrote pandas ETLs that fed reporting, and built Laravel APIs with React and TypeScript front ends. I also kept scheduled jobs healthy, fixing 17+ defects, and documented everything so the next person didn't have to guess.",
      highlights: ["60% faster jobs", "17+ defects fixed", "Schemas, ETLs & APIs"],
      points: [
        "Rewrote production SQL and PySpark transformations so they ran 60% faster.",
        "Designed database schemas and wrote pandas ETLs that turned production data into reporting-ready tables.",
        "Built Laravel APIs and the React and TypeScript screens on top of them, and fixed 17+ defects in scheduled jobs.",
      ],
    },
  ],

  education: [
    { degree: "M.S. Data Analytics", school: "Webster University", year: "May 2026" },
    { degree: "B.S. Computing", school: "London Metropolitan University", year: "Oct 2022" },
  ],

  talks: [
    { name: "Ecological Society of America (ESA)", detail: "Baltimore. Showed how city density shapes which pollinators show up and how much fruit sets.", date: "Aug 2025", href: "files/Slide1.jpg" },
    { name: "Research Across Disciplines (RAD)", detail: "Webster University. How I rebuilt missing orchard weather, and what the bees told us.", date: "Dec 2025", href: "files/rad.pdf" },
  ],

  // Real-world outcomes, each tied to a real client, audience or artifact.
  impact: [
    { who: "SEED St. Louis", kind: "Client · nonprofit", what: "Wrote the findings report for a USDA-funded pollination study. SEED used it to plan next steps for each of its 15 urban orchards.", proof: { label: "Read the report", href: "files/insect-distribution-usda.pdf" } },
    { who: "Webster University research team", kind: "Research team", what: "Turned 10,000+ records from seven partner institutions into one validated dataset, and the questions of 50+ non-technical stakeholders into clear recommendations.", proof: null },
    { who: "Ecological Society of America", kind: "National conference · 2025", what: "Presented how city density changes which pollinators show up and how much fruit sets, to a national audience in Baltimore.", proof: { label: "See the poster", href: "files/Slide1.jpg" } },
    { who: "Open-source developers", kind: "synthkit · public library", what: "Built a tested library that lets teams test with realistic data instead of real people's records. 316 tests, CI on three operating systems.", proof: { label: "View on GitHub", href: "https://github.com/grizz6/synthkit" } },
  ],

  // Achievements in Google XYZ form: accomplished X (measured by Y), by doing Z. <b> marks the measurable part.
  receipts: [
    { metric: "10,000+", unit: "records", x: "Unified <b>10,000+ records from 7 partner institutions</b> into one validated dataset,", z: "by building a site-name map and lining up dates and units across three field seasons in R.", tag: "R" },
    { metric: "60%", unit: "faster", x: "Made production data transformations <b>run 60% faster</b> at Aaran Tech,", z: "by rewriting SQL and PySpark jobs with CTEs, tighter joins and window functions.", tag: "SQL" },
    { metric: "15", unit: "orchards", x: "Gave SEED St. Louis a <b>next-step plan for each of 15 urban orchards</b>,", z: "by turning model results into a plain-language findings report with site-level recommendations.", tag: "Client" },
    { metric: "10", unit: "behaviors", x: "Measured how city density changes <b>10 bee foraging behaviors across 15 orchards</b>, presented at ESA 2025,", z: "by fitting a binomial mixed-effects model on paved-surface cover within 500 m of each site.", tag: "Research" },
    { metric: "316", unit: "tests", x: "Shipped synthkit with <b>316 automated tests passing on Linux, macOS and Windows</b>,", z: "by modeling column relationships with a Gaussian copula and failing the build when new data drifts from its profile.", tag: "Open source" },
    { metric: "0", unit: "made-up numbers", x: "Built an AI data analyst that <b>can't report a number it didn't compute</b>, backed by 128 tests,", z: "by doing all the math in a pandas pipeline and rejecting any reply that cites a figure outside the results.", tag: "AI" },
  ],
  // Only real quotes go here. The section stays hidden while this is empty.
  testimonials: [],

  goals: [
    { title: "Data analytics in industry", desc: "Owning analyses end to end, from messy source data to the decision it supports." },
    { title: "Freelance analytics", desc: "Helping small teams, nonprofits and labs make sense of the data they already have." },
    { title: "Data products", desc: "Building tools people rely on, like synthkit, that make data work safer and faster." },
  ],

  tools: [
    { group: "Statistics", items: ["Mixed-effects models (lme4)", "Linear, logistic & ridge regression", "Hypothesis testing", "ANOVA", "Cross-validation", "ROC / AUC", "Clustering & segmentation"] },
    { group: "Programming", items: ["SQL (CTEs, window functions)", "Python (pandas, NumPy, scikit-learn)", "R (tidyverse, lme4, caret, glmnet)", "PySpark", "TypeScript", "PHP"] },
    { group: "Data modeling & pipelines", items: ["dbt", "Google BigQuery", "PostgreSQL", "Schema design", "ETL / ELT pipelines", "Data quality testing"] },
    { group: "Reporting", items: ["Tableau", "Power BI (DAX, Power Query)", "Excel", "ggplot2", "Plotly", "InDesign"] },
    { group: "Engineering & AI", items: ["FastAPI", "Laravel", "React", "pytest", "Git", "GitHub Actions", "LLM APIs", "Hallucination guardrails"] },
  ],
  projects: [
    {
      title: "synthkit",
      kind: "Python library",
      year: "2026",
      summary: "Realistic test data without real people's records.",
      case: {
        problem: "Teams can't put real customer records into tests or demos, and fake data from tools like Faker loses the relationships between columns, so tests pass on nonsense.",
        approach: "A Python library and command-line tool that learns each column's distribution and the relationships between columns (Gaussian copula) into a small, versioned profile holding zero real records, then generates rows from it. Privacy is checked against a held-out set.",
        result: "Fixtures that behave like production data and contain none of it, plus a check that fails the build when fresh data drifts from its profile. 316 tests in CI on Linux, macOS and Windows, Python 3.10–3.13.",
      },
      tags: ["python", "synthetic data", "data quality", "testing"],
      links: [{ label: "GitHub", href: "https://github.com/grizz6/synthkit" }],
    },
    {
      title: "AI Data Analyst Agent",
      kind: "Web app",
      year: "2026",
      summary: "Upload a spreadsheet, get a report you can verify.",
      case: {
        problem: "AI summaries of data can invent numbers, and that is hard to catch.",
        approach: "A nine-stage pandas pipeline behind five FastAPI endpoints checks quality (nulls, duplicates, outliers), cleans, runs statistics and draws Plotly charts. The language model only explains those results, and any reply that cites a number the pipeline didn't compute is rejected in code.",
        result: "Upload a CSV or Excel file and get a report you can verify, as a downloadable HTML page. 128 tests, a React and TypeScript front end, and CI on every push.",
      },
      tags: ["python", "fastapi", "react", "typescript"],
      links: [{ label: "GitHub", href: "https://github.com/grizz6/AI-Data-Analyst-Agent" }],
    },
    {
      title: "Urban bee foraging",
      kind: "Research · ESA 2025",
      year: "2025",
      summary: "Does a city change how bees forage?",
      case: {
        problem: "Do bees forage differently in the city? Three summers of field notes from 15 St. Louis orchards said a lot, if someone could untangle them.",
        approach: "Measured how paved the land is within 500 m of each orchard from GIS data, then modeled ten foraging behaviors across all three years with a binomial mixed-effects model.",
        result: "Took the findings to the Ecological Society of America in Baltimore in August 2025.",
      },
      tags: ["r", "glmm", "ecology"],
      links: [
        { label: "Poster", href: "files/Slide1.jpg" },
        { label: "GitHub", href: "https://github.com/grizz6/ESA" },
      ],
    },
    {
      title: "Pollination in urban orchards",
      kind: "Research report",
      year: "2025",
      summary: "Turned two years of pollination research into a report a nonprofit could act on, with clear charts and a plan for each orchard.",
      tags: ["r", "research"],
      links: [{ label: "Report", href: "files/insect-distribution-usda.pdf" }, { label: "GitHub", href: "https://github.com/grizz6/R-Projects" }],
    },
    {
      title: "Orchard microclimate modeling",
      kind: "Research",
      year: "2025",
      summary: "Some orchards had no weather station. I calibrated per-site regressions for temperature, humidity and wind from nearby stations, then modeled seasonal heat to see whether busier neighborhoods run warmer.",
      tags: ["r", "regression"],
      links: [{ label: "Report", href: "files/weather-regression.pdf" }, { label: "GitHub", href: "https://github.com/grizz6/R-Projects" }],
    },
    {
      title: "Mortgage default & payoff",
      kind: "ML practicum",
      year: "2025",
      summary: "Which loans go bad? Compared logistic and mixed-effects regression, random forest and gradient boosting, balanced the rare defaults, and tuned the cut-off on ROC/AUC to catch them without crying wolf.",
      tags: ["r", "machine learning"],
      links: [{ label: "Report", href: "files/mortgage-payback.pdf" }, { label: "GitHub", href: "https://github.com/grizz6/Academic-Project---Webster-University" }],
    },
    {
      title: "Mailing campaign targeting",
      kind: "ML practicum",
      year: "2025",
      summary: "Grouped a 5-million-name mailing list with k-means and hierarchical clustering, then predicted who would buy with logistic regression and a neural network, so the campaign could skip everyone else.",
      tags: ["r", "machine learning"],
      links: [{ label: "Report", href: "files/software-mailing.pdf" }, { label: "GitHub", href: "https://github.com/grizz6/Academic-Project---Webster-University" }],
    },
    {
      title: "Used smartphone pricing",
      kind: "ML practicum",
      year: "2025",
      summary: "What is a used phone worth? Compared plain regression, cross-validated ridge regression and nearest neighbours, after filling in missing specs and taming outliers.",
      tags: ["r", "machine learning"],
      links: [{ label: "Report", href: "files/used-smartphone.pdf" }, { label: "GitHub", href: "https://github.com/grizz6/Academic-Project---Webster-University" }],
    },
    {
      title: "RAD Conference talk",
      kind: "Presentation",
      year: "2025",
      summary: "Shared how I rebuilt missing weather data, and what it meant for the bees, at Webster University in December 2025.",
      tags: ["r", "ecology"],
      links: [{ label: "Slides", href: "files/rad.pdf" }],
    },
    {
      title: "911 call patterns",
      kind: "Data exploration",
      year: "2025",
      summary: "Reshaped 99,000 emergency dispatch records into hour, weekday and month views to show when EMS, fire and traffic calls peak, with seaborn heatmaps.",
      tags: ["python", "pandas"],
      links: [{ label: "Notebook", href: "https://github.com/grizz6/Python-mini-projects/blob/main/911%20Call%20data/911%20Call%20data.ipynb" }],
    },
    {
      title: "Brain tumor survival model",
      kind: "Machine learning",
      year: "2025",
      summary: "Predicted survival from age, tumor size and growth rate with a scikit-learn regression, after capping outliers and scaling, and checked it on MSE and R².",
      tags: ["python", "scikit-learn"],
      links: [{ label: "Notebook", href: "https://github.com/grizz6/Python-mini-projects/blob/main/brain%20tumor%20project/Grishma_Gajurel_project.ipynb" }],
    },
  ],
};
