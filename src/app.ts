import express, { type Application, type Request, type Response } from 'express'
import { userRouter } from './modules/user/user.route';
import { authRouter } from './modules/auth/auth.route';
import logger from './middleware/logger';
import { issueRouter } from './modules/Issues/issue.route';

const app: Application = express()

app.use(express.json());

app.use(logger);

app.get('/', (req: Request, res: Response) => {
    // sendResponse
    res.send('Hello World!')
})

app.use('/api/users', userRouter)

app.use('/api/auth', authRouter)

app.use("/api/issues", issueRouter);






export default app 