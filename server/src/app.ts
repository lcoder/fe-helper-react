import express from "express";
import compression from "compression";  // compresses requests
import bodyParser from "body-parser";
import path from "path";
import apiRouter from './api';

// Controllers (route handlers)
import * as homeController from "./controllers/home";

// Create Express server
const app = express();

// Express configuration
app.set("port", process.env.PORT || 7001);
app.set("views", path.join(__dirname, "../views"));
app.set("view engine", "pug");
app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(
    express.static(path.join(__dirname, "public"), { maxAge: 31557600000 })
);

app.get("/", homeController.index);

/**
 * API 相关
 */
app.use("/api", apiRouter);

export default app;
