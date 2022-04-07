// Require express module
const express = require("express");

const app = express();

// Http module
const http = require("http");

// Port
const port = process.env.port || 3000;

// FS module
const fs = require("fs");

const path = require("path");
const { json } = require("express/lib/response");

const filePath = path.join(process.cwd(), "data/developers.json");

// Parse incoming request
app.use(express.json());

// Read the JSON data synchronously
const developersData = JSON.parse(fs.readFileSync(filePath, "utf-8"));

// Fetch all developers data
app.get("/api/v1/developers/", (req, res, next) => {
  res.status(200).json({
    result: Object.keys(developersData).length,
    status: "SUCCESS",
    data: {
      developersData,
    },
  });
});

// Fetch one developer
app.get("/api/v1/developers/:id", (req, res, next) => {
  // const developerByID = developersData[req.params.id];
  const developerByID = developersData.filter((el) => el.id == req.params.id);
  console.log(`Dev on delete ${developerByID[0].id}`);
  res.status(200).json({
    status: "SUCCESS",
    data: {
      developerByID,
    },
  });
});

// Add newbie
app.post("/api/v1/developers/", (req, res, next) => {
  const { name } = req.body;

  if (!name)
    res
      .status(500)
      .json({ status: "Failed", message: "Failed to insert dev info" });
});

// Delete developer
app.delete("/api/v1/developers/:id", (req, res, next) => {
  const developer = developersData.filter((el) => el.id == req.params.id);
  if (!developer)
    res
      .status(500)
      .json({ status: "Fail", message: "Failed to delete developer" });

  console.log(`Dev on delete ${developer[0].name}`);
  // SPlice deletes the selected developer
  developersData.splice(developersData.indexOf(developer.id, 0));
  res.status(200).json({
    message: "Developer successfully deleted",
  });
});

// Server instance
const server = http.createServer(app);
server.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
