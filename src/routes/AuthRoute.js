import express from "express";
import { PrismaClient } from "@prisma/client";
import passport from "passport";
import bcrypt from "bcrypt";
import LocalStrategy from "passport-local";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

passport.use(
    new LocalStrategy(
        { usernameField: "email" },
        async (email, password, done) => {
            try {
                const user = await prisma.customer.findUnique({
                    where: {
                        email
                    },
                    include:{
                        user: true
                    }
                });

                if (!user) {
                    return done(null, false, {
                        message: "Incorrect email or password.",
                    });
                }

                const isMatch = await bcrypt.compare(password, user.user.password);
                if (!isMatch) {
                    return done(null, false, {
                        message: "Incorrect email or password.",
                    });
                }
                return done(null, user);
            } catch (err) {
                return done(err);
            }
        }
    )
);

passport.serializeUser(function (user, done) {
    done(null, user.user.uuid);
});

passport.deserializeUser(async function (id, done) {
    try {
        const user = await prisma.user.findUnique({
            where: {
                uuid: id,
            },
        });
        done(null, user);
    } catch (err) {
        done(err);
    }
});

const router = express.Router();

router.get("/signin", function (req, res, next) {
    res.json({ message: "Connection Failed" });
});

router.post(
    "/signin",
    passport.authenticate("local", {
        successRedirect: "/connect",
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
    const { name, phone, email, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);
    try {
        const user = await prisma.user.create({
            include:{
                customer: true,
            },
            data: {
                password: hashedPassword,
                customer: {
                    create: {
                        email,
                        name,
                        phone,
                    },
                },
            },
        });

        const loginData = {
            id: user.uuid,
            name: user.customer.name,
            email: user.customer.email,
            password: user.password
        }

        req.login(loginData, function (err) {
            if (err) {
                return next(err);
            }
            return res.status(201).json({
                message: "Utilisateur connecté",
                token: jwt.sign(
                    { user: user },
                    `${process.env.SECRET_TOKEN_USER}`,
                    {
                        expiresIn: "3 days",
                    }
                ),
            });
        });
    } catch (err) {
        return res.status(400).json({ error: "Failed to create user" });
    }
});

router.get(`/connect`, function (req, res, next) {
    if (req.user) {
        const user = {
            id: req.user.id,
            nom: req.user.name,
            email: req.user.email,
        };
        res.status(200).json({
            message: "Utilisateur connecté",
            user: user,
            token: `Bearer ${jwt.sign(
                { userId: user },
                `${process.env.SECRET_TOKEN_USER}`,
                {
                    expiresIn: "3 days",
                }
            )}`,
        });
    } else {
        res.json({ message: "Aucun utilisateur connecté" });
    }
});

router.get("/profile", async function (req, res, next) {
    try {
        const token = req.headers.authorization.split(" ")[1];

        const decodedToken = jwt.verify(
            token,
            `${process.env.SECRET_TOKEN_USER}`
        );

        const userId = decodedToken.userId.id; //token decodé

        res.locals.userId = userId;

        if (req.body.userId && req.body.userId !== userId) {
            throw "Invalid user ID";
        } else {
            const response = await prisma.user.findUnique({
                where: {
                    uuid: userId,
                },
            });
            res.status(200).json(response);
        }
    } catch {
        res.status(401).json({
            error: new Error("Invalid request!"),
        });
    }
});

export default router;
