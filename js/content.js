/**
 * Portfolio content. Sources: Grishma_Gajurel_Resume_MASTER.pdf (Sept 2026), github.com/grizz6, and the documents
 * in files/ (the ESA 2025 poster, the SEED St. Louis report and the RAD slides). Each fact appears once on the page:
 * a project's reports, posters and slides live in its `docs` and show as paper covers inside that project.
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
      cdc: [["The challenge", "A four-year, USDA-funded pollination study across 18 St. Louis orchards, with data from seven partner institutions and no two recording sites, dates or units the same way."], ["What I did", "Built one validated R dataset from 10,000+ records, fixed a hidden zero-count bias, modelled bee behaviour against urbanization, and put the code under automated checks."], ["What changed", "SEED St. Louis got site-level recommendations for its orchards, 50+ non-technical stakeholders got answers they could use, and the findings were presented at ESA and RAD."]],
    },
    {
      role: "Software Engineer",
      org: "Aaran Tech Private Limited",
      dates: "Feb 2021 – Jun 2023",
      cdc: [["The challenge", "Slow production transformations and fragile scheduled jobs feeding the reporting tables."], ["What I did", "Rewrote SQL and PySpark transformations, designed schemas, wrote pandas ETLs and built Laravel APIs with React and TypeScript front ends."], ["What changed", "Jobs ran 60% faster, 17+ defects were fixed, and the systems were documented for the team."]],
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
        approach: "Insect behaviour was video-recorded at the study's 18 community and commercial orchards along an urbanization gradient in St. Louis and scored in BORIS. Urbanization was measured as impervious surface within 500 m of each orchard, and effects were tested with generalized linear models in R.",
        result: "Species differed in three behaviours, including one that may transfer pollen. Effects of urbanization were small and varied by year. Co-authored poster at the Ecological Society of America meeting in Baltimore, August 2025.",
      },
      tags: ["r", "glm", "ecology"],
      links: [{ label: "GitHub", href: "https://github.com/grizz6/ESA" }],
      docs: [{ kind: "Poster · ESA 2025", title: "Beeing Urban", art: "flow", seed: 2025, href: "files/Slide1.jpg" }],
    },
    {
      title: "Pollination report for SEED St. Louis",
      kind: "Findings report",
      year: "2025",
      summary: "Preliminary findings for SEED St. Louis from a USDA-funded study of 18 community and commercial orchards: which insects pollinate the trees, how they forage, whether the trees get enough pollen, and which bees produce fruit. December 2025.",
      tags: ["r", "research"],
      links: [{ label: "GitHub", href: "https://github.com/grizz6/R-Projects" }],
      docs: [{ kind: "Report · SEED St. Louis", title: "Maximizing pollination in urban orchards", art: "rings", seed: 18, href: "files/insect-distribution-usda.pdf" }],
    },
    {
      title: "Orchard weather regression",
      kind: "Research · RAD 2025",
      year: "2025",
      summary: "Some orchards had no weather station. Calibrated per-site regressions for temperature, humidity and wind against nearby stations, then modelled growing degree hours and days against urbanization with a random effect for year. Presented at Research Across Disciplines, Webster University, December 2025.",
      tags: ["r", "regression", "mixed models"],
      links: [{ label: "GitHub", href: "https://github.com/grizz6/R-Projects" }],
      docs: [{ kind: "R report", title: "Orchard weather regression", art: "hatch", seed: 60, href: "files/weather-regression.pdf" }, { kind: "Slides · RAD 2025", title: "Climate along an urbanization gradient", art: "ribbons", seed: 7, href: "files/rad.pdf" }],
    },
    {
      title: "Mortgage default & payoff",
      kind: "ML practicum",
      year: "2025",
      summary: "Predicted which loans default. Compared logistic and mixed-effects regression, random forest and gradient boosting, balanced the rare default class, and set the classification threshold using ROC/AUC.",
      tags: ["r", "machine learning"],
      links: [{ label: "GitHub", href: "https://github.com/grizz6/Academic-Project---Webster-University" }],
      docs: [{ kind: "ML report", title: "Mortgage default & payoff", art: "stipple", seed: 41, href: "files/mortgage-payback.pdf" }],
    },
    {
      title: "Mailing campaign targeting",
      kind: "ML practicum",
      year: "2025",
      summary: "Segmented a 5-million-name mailing list with k-means and hierarchical clustering, then predicted purchases with logistic regression and a neural network to decide who to mail.",
      tags: ["r", "machine learning"],
      links: [{ label: "GitHub", href: "https://github.com/grizz6/Academic-Project---Webster-University" }],
      docs: [{ kind: "ML report", title: "Mailing campaign targeting", art: "truchet", seed: 5, href: "files/software-mailing.pdf" }],
    },
    {
      title: "Used smartphone pricing",
      kind: "ML practicum",
      year: "2025",
      summary: "Predicted used phone prices. Compared linear regression, cross-validated ridge regression and k-nearest neighbours after imputing missing specs and handling outliers.",
      tags: ["r", "machine learning"],
      links: [{ label: "GitHub", href: "https://github.com/grizz6/Academic-Project---Webster-University" }],
      docs: [{ kind: "ML report", title: "Used smartphone pricing", art: "rings", seed: 3, href: "files/used-smartphone.pdf" }],
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

};
