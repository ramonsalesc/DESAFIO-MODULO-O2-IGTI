import express from "express";
import { promises as fs, promises } from "fs";
import router from "./router.js";
const { readFile, writeFile } = fs;
const app = express();
app.use("/grades", router);

app.listen(3000, async () => {
    console.log("API STARTED");
});
