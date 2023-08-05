import dotenv from "dotenv"
import { handler } from './build/handler.js';
import express from 'express';

dotenv.config();
const app = express();

app.get('/health', (req, res) => {
    res.send({
        status: 'OK',
        message: 'Server is running.'
    });
});

app.use(handler);

app.listen(3000, () => {
    console.log("Listening on port 3000.");
})