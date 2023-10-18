import express from "express";
import UserRoute from "./src/routes/UserRoute.js";
import AuthRoute from "./src/routes/AuthRoute.js";
import session from "express-session";
import passport from "passport";
import bodyParser from "body-parser";

const app = express();
const port = 3000;

app.use(express.json());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(
    session({
        secret: "La_Crêperie_du_Parvis",
        resave: false,
        saveUninitialized: false,
    })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(UserRoute);
app.use(AuthRoute);

app.get("/", (req, res) => {
    res.send("Hello World!");
});

app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});

export default app;
