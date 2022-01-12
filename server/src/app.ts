import express, { Express } from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import authRouter from './routes/auth';
import { requireAuthToken } from './utility/middlewares';
import devRouter from './routes/dev';
import dotenv from 'dotenv';
// import todoRoutes from "./routes"

dotenv.config();

const app: Express = express();

const PORT: string | number = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.use('/auth', authRouter);
app.use('/dev', devRouter);

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
