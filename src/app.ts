import express, { Application } from 'express';
import { toNodeHandler } from "better-auth/node";
import cors from 'cors';
import { auth } from './lib/auth';
import { userRouter } from './modules/users/user.route';
import { authRouter } from './modules/auth/auth.route';
import { notFoundHandler } from './middleware/notFound';
import { universalErrorHandler } from './middleware/universalError';
import { medicineRouter } from './modules/medicines/medicine.route';
import { categoryRouter } from './modules/categories/category.route';
const app: Application = express()

app.use(cors({ origin: [process.env.FRONTEND_URL as string], credentials: true }))

app.all("/api/auth/sign-up/*splat", toNodeHandler(auth));
app.all("/api/auth/sign-in/*splat", toNodeHandler(auth));

app.use(express.json())
app.get('/', (req, res) => {
    res.send('MediStore server is running')
})


// *category routes */
app.use("/api/categories", categoryRouter)
app.use("/api/admin/categories", categoryRouter)



//*medicine routes */
app.use("/api/medicines", medicineRouter)
app.use("/api/seller/medicines", medicineRouter)



app.use("/api/auth/me", authRouter)
app.use("/api/admin/users", userRouter)
app.use("/api/admin/users", userRouter)








app.use(notFoundHandler)
app.use(universalErrorHandler)

export default app