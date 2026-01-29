import express, { Application } from 'express';
import { toNodeHandler } from "better-auth/node";
import cors from 'cors';
import { auth } from './lib/auth';
import { userRouter } from './modules/users/user.route';
const app: Application = express()

app.use(cors({ origin: ["http://localhost:5000"], credentials: true }))

app.all("/api/auth/*splat", toNodeHandler(auth));

app.use(express.json())

app.get('/', (req, res) => {
    res.send('MediStore server is running')
})

app.use("/api/users", userRouter)




export default app