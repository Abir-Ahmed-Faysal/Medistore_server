import express, { Application } from 'express';
import { toNodeHandler } from "better-auth/node";
import cors from 'cors';
import { auth } from './lib/auth';
import { userRouter } from './modules/users/user.route';
import { hitApi } from './middleware/hitChecker';
import { authRouter } from './modules/auth/auth.route';
const app: Application = express()

app.use(cors({ origin: [process.env.FRONTEND_URL as string], credentials: true }))

app.all("/api/auth/sign-up/*splat", toNodeHandler(auth));
app.all("/api/auth/sign-in/*splat", toNodeHandler(auth));

app.use(express.json())

app.use("/api/auth/me", authRouter)
app.use("/api/admin/users", userRouter)
app.use("/api/admin/users", userRouter)



app.get('/', (req, res) => {
    res.send('MediStore server is running')
})

export default app