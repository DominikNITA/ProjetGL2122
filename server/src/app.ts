import express, { Express } from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import authRouter from './routes/auth';
import { requireAuthToken } from './utility/middlewares';
import devRouter from './routes/dev';
// import todoRoutes from "./routes"

require('dotenv').config();

const app: Express = express();

const PORT: string | number = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.use('/auth', authRouter);
app.use('/dev', devRouter);

app.use(requireAuthToken);

// app.use(todoRoutes)

//const uri: string = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@clustertodo.raz9g.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`

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

// mongoose
//   .connect(uri, options)
//   .then(() =>
//     app.listen(PORT, () =>
//       console.log(`Server running on http://localhost:${PORT}`)
//     )
//   )
