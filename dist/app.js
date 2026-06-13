import express, {} from 'express';
import { userRouter } from './modules/user/user.route';
import { authRouter } from './modules/auth/auth.route';
import logger from './middleware/logger';
import { issueRouter } from './modules/Issues/issue.route';
import cors from "cors";
import globalErrorHandler from './middleware/globalErrorHandler';
const app = express();
app.use(express.json());
app.use(logger);
app.get('/', (req, res) => {
    // sendResponse
    res.send('Hello World!');
});
app.use(cors({
    origin: "http://localhost:5000",
}));
app.use('/api/users', userRouter);
app.use('/api/auth', authRouter);
app.use("/api/issues", issueRouter);
app.use(globalErrorHandler);
export default app;
//# sourceMappingURL=app.js.map