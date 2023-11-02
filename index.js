import express from "express";
import UserRoute from "./src/routes/UserRoute.js";
import AuthRoute from "./src/routes/AuthRoute.js";
import session from "express-session";
import passport from "passport";
import bodyParser from "body-parser";
import { auth } from "./src/middlewares/authjwt.js";
import cors from "cors";

const app = express();
const port = 3000;

const allowedOrigins = ["http://localhost:3001/"];
const options = {
    origin: allowedOrigins,
};

app.use(cors(options));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(
    session({
        secret: "La_Crêperie_du_Parvis",
        resave: false,
        saveUninitialized: false,
    })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(AuthRoute);
app.use("/api", auth, UserRoute);

app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});

export default app;
