import express from "express";
import { PrismaClient } from "@prisma/client";
import passport from "passport";
import bcrypt from "bcrypt";
import LocalStrategy from "passport-local";

const prisma = new PrismaClient();

passport.use(
    new LocalStrategy(
        { usernameField: "email" },
        async (email, password, done) => {
            try {
                const user = await prisma.user.findUnique({
                    where: {
                        email: email,
                    },
                });

                if (!user) {
                    return done(null, false, {
                        message: "Incorrect email or password.",
                    });
                }

                bcrypt.compare(password, user.password, (err, isMatch) => {
                    if (err) {
                        return done(err);
                    }
                    if (!isMatch) {
                        return done(null, false, {
                            message: "Incorrect email or password.",
                        });
                    }
                    return done(null, user);
                });
            } catch (err) {
                return done(err);
            }
        }
    )
);
passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(async function (id, done) {
    try {
        const user = await prisma.user.findUnique({
            where: {
                id: id,
            },
        });
        done(null, user);
    } catch (err) {
        done(err);
    }
});

const router = express.Router();

router.get("/login", function (req, res, next) {
    res.json({ message: "Endpoint de connexion" });
});

router.post(
    "/login",
    passport.authenticate("local", {
        successRedirect: "/",
        failureRedirect: "/login",
    })
);

router.post("/logout", function (req, res, next) {
    req.logout();
    res.redirect("/");
});

router.get("/signup", function (req, res, next) {
    res.json({ message: "Endpoint d'inscription" });
});

router.post("/signup", async function (req, res, next) {
    try {
        const user = await prisma.user.create({
            data: {
                email: req.body.email,
                password: req.body.password,
            },
        });

        req.login(user, function (err) {
            if (err) {
                return next(err);
            }
            res.redirect("/");
        });
    } catch (err) {
        return next(err);
    }
});

router.get("/profile", function (req, res, next) {
    if (req.user) {
        const user = {
            nom: req.user.nom,
            prenom: req.user.prenom,
            email: req.user.email,
        };
        res.json({ message: "Utilisateur connecté", user: user });
    } else {
        res.json({ message: "Aucun utilisateur connecté" });
    }
});

export default router;
