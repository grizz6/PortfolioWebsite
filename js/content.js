/**
 * Portfolio content. Sources: Grishma_Gajurel_Resume_MASTER.pdf (Sept 2026) and github.com/grizz6.
 * The resume itself is not published. No phone number, GPA, or location on the site.
 */
window.PORTFOLIO = {
  name: "Grishma Gajurel",
  first: "Grishma",
  last: "Gajurel",
  title: "Data Scientist & Software Engineer",
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
      tags: ["R", "Mixed models", "A/B testing"],
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
      tags: ["Python", "FastAPI", "React", "CI/CD"],
    },
  ],

  experience: [
    {
      role: "Research Assistant, Data Analysis",
      org: "Webster University",
      dates: "Feb 2024 – Dec 2025",
      story: "For almost two years I was the data person on an urban pollination study. I pulled records from seven institutions into one dataset people could trust, rebuilt missing weather data for 15 orchards, worked out how city life changes the way bees forage, and wrote the report SEED St. Louis used to plan each orchard. Then I took the research to a national ecology conference.",
      highlights: ["10,000+ records unified", "15 orchards modeled", "National conference talk"],
      points: [
        "Spent three field seasons working out whether city life changes how bees forage across 15 St. Louis orchards, and turned it into a talk at a national ecology conference.",
        "Pulled more than 10,000 records from seven partner institutions into one dataset the whole team could trust.",
        "Rebuilt missing orchard weather from nearby stations, so the team could finally compare temperature between sites.",
        "Wrote the findings report SEED St. Louis used to plan next steps for each orchard.",
      ],
    },
    {
      role: "Software Engineer",
      org: "Aaran Tech Private Limited",
      dates: "Feb 2021 – Jun 2023",
      story: "Before data, I spent over two years building software: making slow database queries fast again, building the APIs our internal apps ran on and the React screens people used on top of them. It's why I build analysis like software, tested and repeatable.",
      highlights: ["Faster queries", "APIs", "React front ends"],
      points: [
        "Made slow production database queries fast again.",
        "Built the APIs our internal apps ran on, and the React screens people used on top of them.",
        "Kept a live product healthy: tracking down bugs, shipping fixes, keeping releases steady.",
      ],
    },
  ],

  education: [
    { degree: "M.S. Data Analytics", school: "Webster University", year: "2026" },
    { degree: "B.S. Computing", school: "London Metropolitan University", year: "2022" },
  ],

  talks: [
    { name: "Ecological Society of America (ESA)", detail: "Baltimore. Showed how city density shapes which pollinators show up and how much fruit sets.", date: "Aug 2025", href: "files/Slide1.jpg" },
    { name: "Research Across Disciplines (RAD)", detail: "Webster University. How I rebuilt missing orchard weather, and what the bees told us.", date: "Dec 2025", href: "files/rad.pdf" },
  ],

  // Real-world outcomes, each tied to a real client, audience or artifact.
  impact: [
    { who: "SEED St. Louis", kind: "Client · nonprofit", what: "Wrote the findings report for a USDA-funded pollination study. SEED used it to plan next steps for each of its 15 urban orchards.", proof: { label: "Read the report", href: "files/insect-distribution-usda.pdf" } },
    { who: "Webster University research team", kind: "Research team", what: "Turned 10,000+ records from seven partner institutions into one dataset the whole team could trust and analyze.", proof: null },
    { who: "Ecological Society of America", kind: "National conference · 2025", what: "Presented how city density changes which pollinators show up and how much fruit sets, to a national audience in Baltimore.", proof: { label: "See the poster", href: "files/Slide1.jpg" } },
    { who: "Open-source developers", kind: "synthkit · public library", what: "Built a tested library that lets teams test with realistic data instead of real people's records. 316 tests, CI on three operating systems.", proof: { label: "View on GitHub", href: "https://github.com/grizz6/synthkit" } },
  ],

  // Achievements in Google XYZ form: accomplished X (measured by Y), by doing Z. <b> marks the measurable part.
  receipts: [
    { metric: "10,000+", unit: "records", x: "Unified <b>10,000+ records from 7 partner institutions</b> into one dataset the whole team trusted,", z: "by cleaning, reconciling and validating three field seasons of data in R.", tag: "R" },
    { metric: "15", unit: "orchards", x: "Gave SEED St. Louis a <b>next-step plan for each of 15 urban orchards</b>,", z: "by turning regression and field-experiment results into a plain-language findings report.", tag: "Client" },
    { metric: "10", unit: "behaviors", x: "Showed how city density shapes <b>10 bee foraging behaviors across 3 field seasons</b>, presented at ESA 2025,", z: "by fitting mixed-effects models on GIS-derived urbanization scores.", tag: "Research" },
    { metric: "316", unit: "tests", x: "Shipped synthkit with <b>316 automated tests passing on Linux, macOS and Windows</b>,", z: "by modeling column correlations with a Gaussian copula so fake data behaves like real data.", tag: "Open source" },
    { metric: "0", unit: "made-up numbers", x: "Built an AI data analyst that <b>can't report a number it didn't compute</b>,", z: "by doing all the math in pandas and rejecting any reply that cites a figure outside the results.", tag: "AI" },
    { metric: "2+ yrs", unit: "in production", x: "Kept a live product fast and stable for <b>over two years at Aaran Tech</b>,", z: "by restructuring slow SQL and PySpark jobs and building Laravel APIs with React front ends.", tag: "Software" },
  ],

  // Only real quotes go here. The section stays hidden while this is empty.
  testimonials: [],

  goals: [
    { title: "Data science in industry", desc: "Owning analyses end to end, from messy source data to the decision it supports." },
    { title: "Freelance analytics", desc: "Helping small teams, nonprofits and labs make sense of the data they already have." },
    { title: "Data products", desc: "Building tools people rely on, like synthkit, that make data work safer and faster." },
  ],

  tools: [
    { group: "Statistics", items: ["Mixed-effects models (lme4)", "Logistic, linear & ridge regression", "Hypothesis testing", "Cross-validation", "ROC / AUC", "Clustering"] },
    { group: "Programming", items: ["R (tidyverse, caret, glmnet)", "Python (pandas, scikit-learn)", "SQL", "PostgreSQL", "PySpark", "TypeScript"] },
    { group: "Reporting", items: ["Tableau", "Power BI", "ggplot2", "Plotly", "Excel", "InDesign"] },
    { group: "Engineering & AI", items: ["LLM agents", "Hallucination guardrails", "FastAPI", "Playwright", "ETL pipelines", "GitHub Actions"] },
  ],

  projects: [
    {
      title: "synthkit",
      kind: "Python library",
      year: "2026",
      summary: "Realistic test data without real people's records.",
      case: {
        problem: "Teams can't put real customer records into tests or demos, and fake data from tools like Faker loses the relationships between columns, so tests pass on nonsense.",
        approach: "Learn each column's distribution and the correlations between them (Gaussian copula), save that as a small JSON profile, and generate rows from it. A privacy check compares synthetic rows against real ones.",
        result: "Fixtures that behave like production data and contain none of it. 316 tests, with CI on Linux, macOS and Windows across Python 3.10–3.13.",
      },
      tags: ["python", "synthetic data", "testing"],
      links: [{ label: "GitHub", href: "https://github.com/grizz6/synthkit" }],
    },
    {
      title: "AI Data Analyst Agent",
      kind: "Web app",
      year: "2026",
      summary: "Upload a spreadsheet, get a report you can verify.",
      case: {
        problem: "AI summaries of data can invent numbers, and that is hard to catch.",
        approach: "A pandas pipeline computes every figure. The language model is only allowed to explain those results, and any reply containing a number that isn't in the computed facts is rejected in code.",
        result: "Upload a CSV or Excel file and get cleaned data, charts, plain-English insights and a downloadable HTML report. Built with FastAPI and React.",
      },
      tags: ["python", "fastapi", "react"],
      links: [{ label: "GitHub", href: "https://github.com/grizz6/AI-Data-Analyst-Agent" }],
    },
    {
      title: "Urban bee foraging",
      kind: "Research · ESA 2025",
      year: "2025",
      summary: "Does a city change how bees forage?",
      case: {
        problem: "Do bees forage differently in the city? Three summers of field notes from 15 St. Louis orchards said a lot, if someone could untangle them.",
        approach: "Scored how built-up the land around each orchard is from map data, then modeled ten foraging behaviors across all three years together.",
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
      summary: "The orchard sensors had gaps. I filled them using nearby weather stations, then checked whether busier neighborhoods really run warmer.",
      tags: ["r", "regression"],
      links: [{ label: "Report", href: "files/weather-regression.pdf" }, { label: "GitHub", href: "https://github.com/grizz6/R-Projects" }],
    },
    {
      title: "Mortgage default & payoff",
      kind: "ML practicum",
      year: "2025",
      summary: "Which loans go bad, and when do the rest pay off? Tested several models and tuned them to catch the rare defaults without crying wolf.",
      tags: ["r", "machine learning"],
      links: [{ label: "Report", href: "files/mortgage-payback.pdf" }, { label: "GitHub", href: "https://github.com/grizz6/Academic-Project---Webster-University" }],
    },
    {
      title: "Mailing campaign targeting",
      kind: "ML practicum",
      year: "2025",
      summary: "Picked out who on a 5-million-name mailing list was most likely to buy, so the campaign could skip everyone else.",
      tags: ["r", "machine learning"],
      links: [{ label: "Report", href: "files/software-mailing.pdf" }, { label: "GitHub", href: "https://github.com/grizz6/Academic-Project---Webster-University" }],
    },
    {
      title: "Used smartphone pricing",
      kind: "ML practicum",
      year: "2025",
      summary: "Estimating what a used phone is worth from 15 things about it, like brand, age and specs.",
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
      summary: "99,000 emergency calls: when do EMS, fire and traffic calls peak, by hour, weekday and month?",
      tags: ["python", "pandas"],
      links: [{ label: "Notebook", href: "https://github.com/grizz6/Python-mini-projects/blob/main/911%20Call%20data/911%20Call%20data.ipynb" }],
    },
    {
      title: "Brain tumor survival model",
      kind: "Machine learning",
      year: "2025",
      summary: "Which patient and tumor details (age, size, type, growth rate) are most tied to survival.",
      tags: ["python", "scikit-learn"],
      links: [{ label: "Notebook", href: "https://github.com/grizz6/Python-mini-projects/blob/main/brain%20tumor%20project/Grishma_Gajurel_project.ipynb" }],
    },
  ],
};
