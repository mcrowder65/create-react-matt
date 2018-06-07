import express from "express";
import bodyParser from "body-parser";
import path from "path";

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.get("*.js", (req, res, next) => {
  // eslint-disable-next-line no-param-reassign
  req.url += ".gz";
  res.set("Content-Encoding", "gzip");
  next();
});
app.use(express.static(path.resolve(__dirname, "../..", "build")));

app.listen(3000, () => console.log(`server started on port 3000`));