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
  const dev = req.body;

  if (!dev.name)
    res
      .status(500)
      .json({ status: "Failed", message: "Failed to insert dev info" });

  developersData.push(dev);
  res
    .status(200)
    .json({ status: "Success", message: `Developer ${dev.name} to the group` });
});

// Delete developer
app.delete("/api/v1/developers/:id", (req, res, next) => {
  const developer = developersData.filter((el) => el.id == req.params.id);
  if (!developer)
    res
      .status(500)
      .json({ status: "Fail", message: "Failed to delete developer" });

  console.log(`Dev on delete ${developer[0].name}`);
  // Splice deletes the selected developer
  developersData.splice(developersData.indexOf(developer.id, 0));
  res.status(200).json({
    message: "Developer successfully deleted",
  });
});

// Update developer info
// app.patch("/api/v1/developers/:id", (req, res, next) => {
//   // Get developer by Id
//   const developer = developersData.filter((el) => el.id == req.params.id);
//   console.log(`Developer with ${developer[0].name} name found`);

//   console.log(`Dev index ${developersData.indexOf(developer)}`);
//   const devIndex = developersData.indexOf(developer);
//   const dev = req.body;
//   console.log(developersData[devIndex]);
//   res.status(200).json({
//     status: "SUCCESS",
//     message: "Updated successfully",
//   });
// });

// Server instance
const server = http.createServer(app);
server.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
