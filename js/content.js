/**
 * Portfolio content. Sources: Grishma_Gajurel_Resume_MASTER.pdf (Sept 2026), github.com/grizz6, and the documents
 * in files/ (the ESA 2025 poster, the SEED St. Louis report and the RAD slides). Each fact appears once on the page.
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

  headline: "I clean, combine and model messy data, then report what it shows.",

  currently: [
    { label: "Building", text: "synthkit, an open-source library for realistic test data", href: "https://github.com/grizz6/synthkit" },
    { label: "Open to", text: "new opportunities" },
  ],

  experience: [
    {
      role: "Research Assistant, Data Analysis",
      org: "Webster University",
      dates: "Feb 2024 – Dec 2025",
      points: [
        "Data analyst on a USDA-funded study of pollination in St. Louis community orchards.",
        "Merged 10,000+ records from seven partner institutions into one validated dataset, standardising site names, dates and units.",
        "Found and corrected a bias caused by zero counts that had never been recorded.",
        "Turned questions from 50+ non-technical stakeholders into datasets and recommendations.",
        "Set up automated checks that run the R analysis code on every push.",
      ],
    },
    {
      role: "Software Engineer",
      org: "Aaran Tech Private Limited",
      dates: "Feb 2021 – Jun 2023",
      points: [
        "Rewrote production SQL and PySpark transformations so they ran 60% faster.",
        "Designed database schemas and wrote pandas ETLs that produced reporting tables.",
        "Built Laravel APIs with React and TypeScript front ends.",
        "Fixed 17+ defects in scheduled jobs and documented the systems I worked on.",
      ],
    },
  ],

  education: [
    { degree: "M.S. Data Analytics", school: "Webster University", year: "May 2026" },
    { degree: "B.S. Computing", school: "London Metropolitan University", year: "Oct 2022" },
  ],

  tools: [
    { group: "Analytics & statistics", items: ["Linear, logistic & ridge regression", "Mixed-effects models (GLMMs)", "Hypothesis testing", "ANOVA", "Cross-validation", "ROC / AUC", "Clustering", "Segmentation", "Predictive modeling", "Data cleaning", "Outlier treatment"] },
    { group: "Programming", items: ["SQL (CTEs, joins, window functions, query tuning)", "Python (pandas, NumPy, scikit-learn, FastAPI, pytest)", "R (tidyverse, lme4, caret, glmnet, ggplot2)", "PySpark", "TypeScript", "PHP"] },
    { group: "Data modeling & pipelines", items: ["dbt", "Google BigQuery", "PostgreSQL", "Relational schema design", "Data modeling", "ETL / ELT pipelines", "Data quality testing", "Scheduled job monitoring", "Documentation"] },
    { group: "BI & visualization", items: ["Tableau", "Power BI (DAX, Power Query, data modeling)", "Microsoft Excel", "ggplot2", "Plotly", "Dashboards", "KPI reporting", "Adobe InDesign"] },
    { group: "Engineering & AI", items: ["REST API design", "Laravel", "React", "Git", "GitHub Actions", "CI/CD", "LLM APIs", "Hallucination guardrails", "AI-assisted development (Claude Code, Cursor)"] },
  ],
  projects: [
    {
      title: "synthkit",
      kind: "Python library",
      year: "2026",
      summary: "Generates realistic test data without using real records.",
      case: {
        problem: "Teams can't put real customer records into tests or demos, and generated fake data loses the relationships between columns.",
        approach: "A Python library and command-line tool that learns each column's distribution and the relationships between columns (Gaussian copula) into a small versioned profile that holds no real records, then generates rows from it. Privacy is checked against a held-out set.",
        result: "Test fixtures that behave like production data, plus a check that fails the build when new data drifts from its profile. 316 tests run in CI on Linux, macOS and Windows with Python 3.10–3.13.",
      },
      tags: ["python", "synthetic data", "data quality", "testing"],
      links: [{ label: "GitHub", href: "https://github.com/grizz6/synthkit" }],
    },
    {
      title: "AI Data Analyst Agent",
      kind: "Web app",
      year: "2026",
      summary: "Upload a spreadsheet and get a report whose numbers can be checked.",
      case: {
        problem: "Language models can invent numbers when they summarise data.",
        approach: "A nine-stage pandas pipeline behind five FastAPI endpoints checks quality (nulls, duplicates, outliers), cleans the data, runs the statistics and draws Plotly charts. The language model only describes those results, and any reply citing a number the pipeline didn't compute is rejected.",
        result: "CSV or Excel in, a downloadable HTML report out. React and TypeScript front end, 128 tests, CI on every push.",
      },
      tags: ["python", "fastapi", "react", "typescript"],
      links: [{ label: "GitHub", href: "https://github.com/grizz6/AI-Data-Analyst-Agent" }],
    },
    {
      title: "Urban bee foraging",
      kind: "Poster · ESA 2025",
      year: "2025",
      summary: "Do bee species forage differently, and does urbanization change their behaviour?",
      case: {
        problem: "Whether urban bee species show distinct foraging behaviours, and whether bee activity and behaviour change with urbanization.",
        approach: "Insect behaviour was video-recorded at 10 orchards along an urbanization gradient in St. Louis in spring 2022, 2023 and 2024 and scored in BORIS. Urbanization was measured as impervious surface within 500 m of each orchard, and effects were tested with generalized linear models in R.",
        result: "Species differed in three behaviours, including one that may transfer pollen. Effects of urbanization were small and varied by year. Co-authored poster at the Ecological Society of America meeting in Baltimore, August 2025.",
      },
      tags: ["r", "glm", "ecology"],
      links: [
        { label: "Poster", href: "files/Slide1.jpg" },
        { label: "GitHub", href: "https://github.com/grizz6/ESA" },
      ],
    },
    {
      title: "Pollination report for SEED St. Louis",
      kind: "Findings report",
      year: "2025",
      summary: "Preliminary findings for SEED St. Louis from a USDA-funded study of 18 community and commercial orchards: which insects pollinate the trees, how they forage, whether the trees get enough pollen, and which bees produce fruit. December 2025.",
      tags: ["r", "research"],
      links: [{ label: "Report", href: "files/insect-distribution-usda.pdf" }, { label: "GitHub", href: "https://github.com/grizz6/R-Projects" }],
    },
    {
      title: "Orchard weather regression",
      kind: "Research · RAD 2025",
      year: "2025",
      summary: "Some orchards had no weather station. Calibrated per-site regressions for temperature, humidity and wind against nearby stations, then modelled growing degree hours and days against urbanization with a random effect for year. Presented at Research Across Disciplines, Webster University, December 2025.",
      tags: ["r", "regression", "mixed models"],
      links: [{ label: "Report", href: "files/weather-regression.pdf" }, { label: "Slides", href: "files/rad.pdf" }, { label: "GitHub", href: "https://github.com/grizz6/R-Projects" }],
    },
    {
      title: "Mortgage default & payoff",
      kind: "ML practicum",
      year: "2025",
      summary: "Predicted which loans default. Compared logistic and mixed-effects regression, random forest and gradient boosting, balanced the rare default class, and set the classification threshold using ROC/AUC.",
      tags: ["r", "machine learning"],
      links: [{ label: "Report", href: "files/mortgage-payback.pdf" }, { label: "GitHub", href: "https://github.com/grizz6/Academic-Project---Webster-University" }],
    },
    {
      title: "Mailing campaign targeting",
      kind: "ML practicum",
      year: "2025",
      summary: "Segmented a 5-million-name mailing list with k-means and hierarchical clustering, then predicted purchases with logistic regression and a neural network to decide who to mail.",
      tags: ["r", "machine learning"],
      links: [{ label: "Report", href: "files/software-mailing.pdf" }, { label: "GitHub", href: "https://github.com/grizz6/Academic-Project---Webster-University" }],
    },
    {
      title: "Used smartphone pricing",
      kind: "ML practicum",
      year: "2025",
      summary: "Predicted used phone prices. Compared linear regression, cross-validated ridge regression and k-nearest neighbours after imputing missing specs and handling outliers.",
      tags: ["r", "machine learning"],
      links: [{ label: "Report", href: "files/used-smartphone.pdf" }, { label: "GitHub", href: "https://github.com/grizz6/Academic-Project---Webster-University" }],
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
      summary: "Predicted survival from age, tumor size and growth rate with a scikit-learn regression after capping outliers and scaling, evaluated on MSE and R².",
      tags: ["python", "scikit-learn"],
      links: [{ label: "Notebook", href: "https://github.com/grizz6/Python-mini-projects/blob/main/brain%20tumor%20project/Grishma_Gajurel_project.ipynb" }],
    },
  ],

  // The documents shelf: each is a real file, shown as a 3D paper page. `art` picks the generative cover, `seed` fixes it.
  reports: [
    { kind: "REPORT · SEED ST. LOUIS", title: "Maximizing pollination in urban orchards", sub: "Preliminary findings, December 2025", art: "rings", seed: 18, href: "files/insect-distribution-usda.pdf" },
    { kind: "POSTER · ESA 2025", title: "Beeing Urban", sub: "How city life is changing pollination behaviors", art: "flow", seed: 2025, href: "files/Slide1.jpg" },
    { kind: "SLIDES · RAD 2025", title: "Weather regression", sub: "Climate along an urbanization gradient", art: "ribbons", seed: 7, href: "files/rad.pdf" },
    { kind: "R REPORT", title: "Orchard weather regression", sub: "Site weather calibrated against nearby stations", art: "hatch", seed: 60, href: "files/weather-regression.pdf" },
    { kind: "ML REPORT", title: "Mortgage default & payoff", sub: "Classification and threshold tuning", art: "stipple", seed: 41, href: "files/mortgage-payback.pdf" },
    { kind: "ML REPORT", title: "Mailing campaign targeting", sub: "Segmentation and purchase prediction", art: "truchet", seed: 5, href: "files/software-mailing.pdf" },
    { kind: "ML REPORT", title: "Used smartphone pricing", sub: "Regression and model comparison", art: "rings", seed: 3, href: "files/used-smartphone.pdf" },
  ],
};
