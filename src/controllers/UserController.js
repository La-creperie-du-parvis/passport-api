import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const getUsers = async (req, res) => {
    try {
        const response = await prisma.user.findMany();
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

export const getUserById = async (req, res) => {
    try {
        const response = await prisma.user.findUnique({
            where: {
                uuid: req.params.id,
            },
            select: {
                id: true,
                nom: true,
                prenom: true,
                telephone: false,
                email: false,
                password: false,
            },
        });
        res.status(200).json(response);
    } catch (error) {
        res.status(404).json({ msg: error.message });
    }
};

export const updateUser = async (req, res) => {
    const { name, price } = req.body;
    try {
        const user = await prisma.user.update({
            where: {
                id: req.params.id,
            },
            data: {
                name
            },
        });
        res.status(200).json(user);
    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
};

export const deleteUser = async (req, res) => {
    try {
        const user = await prisma.user.delete({
            where: {
                id: req.params.id,
            },
        });
        res.status(200).json(user);
    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
};
