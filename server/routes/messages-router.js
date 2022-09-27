import express from 'express';
import db from '../models';
const Message = db.model('message');

// Este router esta ya montado en /messages en server/app.js
const messages = express.Router();

messages.get("/to/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const messages = await Message.getAllWhereReceiver(id)
        res.status(200).json(messages)
    } catch (error) {
        res.status(501).json(error)
    }
})

messages.get("/from/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const messages = await Message.getAllWhereSender(id)
        res.status(200).json(messages)
    } catch (error) {
        res.status(501).json(error)
    }
})

messages.post("/", async (req, res) => {
    const { fromId, toId, body } = req.body;
    try {
        const newMessage = await Message.create({ fromId, toId, body })
        res.status(201).json(newMessage)
    } catch (error) {
        res.status(501).json(error)
    }
});

export default messages;