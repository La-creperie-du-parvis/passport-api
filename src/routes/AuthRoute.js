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

router.get("/signin", function (req, res, next) {
    res.json({ message: "Endpoint de connexion" });
});

router.post(
    "/signin",
    passport.authenticate("local", {
        successRedirect: "/profile",
        failureRedirect: "/signin",
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
    const { nom, prenom, telephone, email, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);
    try {
        const user = await prisma.user.create({
            data: {
                nom,
                prenom,
                telephone,
                email,
                password: hashedPassword,
            },
            select: {
                id: true,
                nom: true,
                prenom: true,
                telephone: true,
                email: true,
                password: false,
            },
        });

        req.login(user, function (err) {
            if (err) {
                return next(err);
            }
            res.redirect("/profile");
        });
    } catch (err) {
        res.status(400).json({ error: "Failed to create user" });
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
