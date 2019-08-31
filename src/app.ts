import express from "express";

const app = express();
const port = 3005;

app.get("/", (req, res) => {
  res.send("You can now use typescript for this project");
});

app.listen(port, err => {
  if (err) {
    return console.log("error");
  }

  return console.log(`server running at port ${port}`);
});
