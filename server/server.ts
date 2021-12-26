const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config({ path: "./config.env" });
const port = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());
app.use(require("./routes/record"));
// get driver connection
import * as dbo from "./db/conn";
import { notesRouter } from "./routes/notes.router";


// perform a database connection when server starts
dbo.connectToDatabase().
  then(() => {
    app.use("/notes", notesRouter);


    app.listen(port, () => {
      console.log(`Server started at http://localhost:${port}`);
    })
  });


export { };