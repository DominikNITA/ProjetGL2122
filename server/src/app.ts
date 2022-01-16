import express, { Express } from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import authRouter from './routes/authRouter';
import { requireAuthToken } from './utility/middlewares';
import devRouter from './routes/devRouter';
import dotenv from 'dotenv';
import noteRouter from './routes/noteRouter';

dotenv.config();

const app: Express = express();

const PORT: string | number = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.use('/auth', authRouter);
app.use('/dev', devRouter);
app.use('/note', noteRouter);

app.use(requireAuthToken);
// app.use('/service');
// app.use('/user');
// app.use('/note');

const opts = {
    bufferCommands: false,
};

mongoose
    .connect(process.env.USER_DATABASE_URL as string, opts)
    .then(() => {
        app.listen(PORT, () =>
            console.log(`Server running on http://localhost:${PORT}`)
        );
    })
    .catch((error) => {
        throw error;
    });

export default app;
