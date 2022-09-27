import express from 'express';
import db from '../models';
const User = db.model('user');
const Message = db.model('message');

// Este router esta ya montado en /users en server/app.js
const users = express.Router();

users.get("/", async (req, res) => {
    try {
        const users = await User.findAll();

        res.status(200).json(users)
    } catch (error) {
        res.sendStatus(501)
    }
})

users.put("/:id", async (req, res) => {
    const { id } = req.params;
    const email = req.body;

    try {
        const update = User.update(email,
            {
                where: { id },
                returning: true,
                plain: true
            });
        res.status(201).json(update[1])
    } catch (error) {
        res.sendStatus(501)
    };
});

export default users;