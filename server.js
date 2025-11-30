const express = require("express");
const path = require("path");

const app = express();

// load data once
const pathsData = require("./data/paths.json");

// view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// static files
app.use(express.static(path.join(__dirname, "public")));

// HOME PAGE
app.get("/", (req, res) => {
  res.render("index", { paths: pathsData });
});

// SEARCH API (for filters on home page)
app.get("/search", (req, res) => {
  const role = req.query.role;
  const level = req.query.level;

  let results = pathsData;

  if (role && role !== "All") {
    results = results.filter((p) => p.role === role);
  }
  if (level && level !== "All") {
    results = results.filter((p) => p.level === level);
  }

  res.json(results);
});

// PATH DETAIL PAGE (click card)
app.get("/path/:id", (req, res) => {
  const id = parseInt(req.params.id, 10);
  const pathItem = pathsData.find((p) => p.id === id);

  if (!pathItem) {
    return res
      .status(404)
      .render("simple-page", {
        title: "Path Not Found - Tech Build",
        heading: "Path Not Found",
        description: "The path you are looking for does not exist.",
      });
  }

  res.render("path-detail", {
    title: `${pathItem.title} - Tech Build`,
    pathItem,
  });
});

// NAVBAR PAGES
app.get("/paths", (req, res) => {
  res.render("simple-page", {
    title: "Tech Paths - Tech Build",
    heading: "Tech Paths",
    description: "Browse all available tech learning paths on Tech Build.",
  });
});

app.get("/resources", (req, res) => {
  res.render("simple-page", {
    title: "Resources - Tech Build",
    heading: "Resources",
    description:
      "Coming soon: curated articles, videos and tools to help you learn faster.",
  });
});

app.get("/projects", (req, res) => {
  res.render("simple-page", {
    title: "Projects - Tech Build",
    heading: "Projects",
    description:
      "Hands-on project ideas so you can build a real portfolio and learn by doing.",
  });
});

app.get("/roadmaps", (req, res) => {
  res.render("simple-page", {
    title: "Roadmaps - Tech Build",
    heading: "Roadmaps",
    description:
      "Step-by-step roadmaps for becoming a developer, designer, data scientist and more.",
  });
});

app.get("/salaries", (req, res) => {
  res.render("simple-page", {
    title: "Salaries - Tech Build",
    heading: "Salaries",
    description:
      "Understand typical salary ranges for different tech roles and experience levels.",
  });
});

app.get("/learn", (req, res) => {
  res.render("simple-page", {
    title: "Learn - Tech Build",
    heading: "Learn",
    description:
      "Learn core concepts in programming, design and data with beginner-friendly explanations.",
  });
});

// FIND MY TECH TRACK (button under navbar)
app.get("/track", (req, res) => {
  res.render("simple-page", {
    title: "Find My Tech Track - Tech Build",
    heading: "Find My Tech Track",
    description:
      "Answer a few questions (coming soon) and we’ll suggest the best tech path to start with.",
  });
});

const PORT = 3000;
app.listen(PORT, () =>
  console.log(`Tech Build running → http://localhost:${PORT}`)
);
