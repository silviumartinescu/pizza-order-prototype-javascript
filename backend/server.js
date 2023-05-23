const express = require("express");
const path = require("path");
const fs = require("fs");
const port = 8000;

// Take the path from JSON

const pizzaPath = path.join(`${__dirname}/../pizza.json`);
const allergensPath = path.join(`${__dirname}/../allergens.json`);
const orderFilePath = path.join(`${__dirname}/../order.json`);

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(
  "/static",
  express.static(path.resolve(__dirname, "../", "frontend", "static"))
);

// Geting data from JSON and parse it

const pizzaData = JSON.parse(fs.readFileSync(pizzaPath, "utf-8"));
const allergensData = JSON.parse(fs.readFileSync(allergensPath, "utf-8"));

// Create endpoints
app.get("/", (req, res) => {
  res.sendFile(path.resolve(__dirname, "../", "frontend", "newfile.html"));
});

app.get("/checkout", (req, res) => {
  res.sendFile(path.resolve(__dirname, "../", "frontend", "index.html"));
});
app.get("/menu", (req, res) => {
  res.sendFile(path.resolve(__dirname, "../", "frontend", "index.html"));
});
// app.post("/order", (req, res) => {
//   const fileData = fs.readFileSync(orderFilePath);
//   const fileDataJson = JSON.parse(fileData).packages;
//   console.log(fileDataJson);
//   let pkgsUpdate = {};
//   const newPackage = Object.assign(req.body);
//   fileDataJson.push(newPackage);
//   pkgsUpdate = Object.assign({ packages: fileDataJson });

//   fs.writeFile(orderFilePath, JSON.stringify(pkgsUpdate), (err) => {
//     res.status(201).json({
//       status: "succes",
//       data: {
//         package: newPackage,
//       },
//     });
//   });
// });

app.post("/order", (req, res) => {
  console.log("Post request received");
  // const test = fs.readFileSync("test.json");
  fs.writeFile("test.json", JSON.stringify(req.body, null, 2), (err) => {
    if (err) {
      console.log(err);
      return;
    }
  });
  res.send("Done");
});

app.post("/placeOrder", (req, res) => {
  console.log("Post request received");
  // const test = fs.readFileSync("test.json");
  fs.writeFile("orders.json", JSON.stringify(req.body, null, 2), (err) => {
    if (err) {
      console.log(err);
      return;
    }
  });
  res.send("Done");
});

app.get("/checkout", (req, res) => {
  res.sendFile(path.resolve(__dirname, "../", "frontend", "index.html"));
});

app.get("/getData", (req, res) => {
  res.send(pizzaData);
});
app.get("/allergens", (req, res) => {
  res.send(allergensData);
});

app.get("/test.json", (req, res) => {
  // res.setHeader("Content-type", "application.json");
  res.sendFile(path.resolve(__dirname, "../", "test.json"));
});

app.get("/completeOrder", (req, res) => {
  console.log("complete order received");
  res.sendFile(
    path.resolve(__dirname, "../", "frontend", "completeOrder.html")
  );
});

app.get("/:img", (req, res) => {
  res.sendFile(path.join(`${__dirname}/../images/${req.params.img}`));
});

app.listen(port, (_) => console.log(`http://127.0.0.1:${port}`));
