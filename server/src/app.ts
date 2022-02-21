import express, { Express, NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import authRouter from './routes/authRouter';
import devRouter from './routes/devRouter';
import dotenv from 'dotenv';
import noteRouter from './routes/noteRouter';
import { ErrorResponse, InvalidParameterValue } from './utility/errors';
import serviceRouter from './routes/serviceRouter';
import path from 'path';
import vehicleRouter from './routes/vehicleRouter';
import avanceRouter from './routes/avanceRouter';
import missionRouter from './routes/missionRouter';
import { convertDates } from './utility/middlewares';

dotenv.config();

const app: Express = express();

const PORT: string | number = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());
app.use(convertDates);
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.use('/auth', authRouter);
app.use('/dev', devRouter);
app.use('/note', noteRouter);
app.use('/avance', avanceRouter);
app.use('/service', serviceRouter);
app.use('/vehicle', vehicleRouter);
app.use('/mission', missionRouter);

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.log(err);
    if (err instanceof ErrorResponse) {
        res.status(err.statusCode).send({
            message: err.message,
            status: err.statusCode,
        });
    } else if (err instanceof InvalidParameterValue) {
        res.status(400).send({ message: err.message, status: 400 });
    } else {
        res.status(500).send('Unknown error on the server');
    }
});

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
