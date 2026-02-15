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
import { orderRouter } from './modules/orders/order.route';

import { reviewRouter } from './modules/reviews/review.route';
import { staticsRouter } from './modules/statistics/statistics.routes';
const app: Application = express()

const allowedOrigins = [process.env.APP_URL, process.env.PROD_APP_URL].filter(Boolean)

console.log("here is the array ", allowedOrigins);

app.use(cors({
    origin: (origin, callback) => {
        if (!origin) return callback(null, true)
        const isAllowed = allowedOrigins.includes(origin) || /^https:\/\/next-blog-client.*\.vercel\.app$/.test(origin) ||
            /^https:\/\/.*\.vercel\.app$/.test(origin);

            if(isAllowed){
                callback(null,true)
            }else{
                callback(new Error(`Origin ${origin} not allowed by CORS`))
            }

    }, credentials: true,
    methods:["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"], allowedHeaders:["Content-Type", "Authorization", "Cookie"],
exposedHeaders: ["Set-Cookie"],
}))





app.all("/api/auth/sign-in/*splat", toNodeHandler(auth));
app.all("/api/auth/sign-out", toNodeHandler(auth));
app.all("/api/auth/get-session", toNodeHandler(auth));

// auth handler over the body parser
app.use(express.json())
app.get('/', (_, res) => {
    res.send('MediStore server is running')
})



// *auth routes */
app.use("/api/auth/me", authRouter)
app.use("/api/auth/sign-up", authRouter)
app.use("/api/admin/users", userRouter)
app.use("/api/user", userRouter)



// *category routes */
app.use("/api/categories", categoryRouter)
app.use("/api/admin/categories", categoryRouter)



//*medicine routes */
app.use("/api/medicines", medicineRouter)
app.use("/api/seller/medicines", medicineRouter)



// *order routes */
app.use("/api/orders", orderRouter)



// *review routes */
app.use("/api/reviews", reviewRouter)



//*statistics
app.use("/api/statistics", staticsRouter)



app.use(notFoundHandler)
app.use(universalErrorHandler)

export default app