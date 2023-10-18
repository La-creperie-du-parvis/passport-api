import express from "express";
import UserRoute from "./src/routes/UserRoute.js";
import Auth from "./src/routes/AuthRoute.js";
import session from "express-session";
import passport from "./src/auth/passport.js";

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(UserRoute);
app.use(Auth);

app.use(
    session({
        secret: "La_Crêperie_du_Parvis",
        resave: false,
        saveUninitialized: false,
        cookie: { secure: true },
    })
);

app.use(passport.initialize());
app.use(passport.session());

app.get("/", (req, res) => {
    res.send("Hello World!");
});

app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});

export default app;
