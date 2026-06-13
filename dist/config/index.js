import dotenv from 'dotenv';
import { env } from 'process';
dotenv.config({ quiet: true });
const config = {
    port: env.PORT,
    database_url: env.DATABASE_URL,
    secret: env.JWT_SECRET
};
console.log(process.env.PORT);
export default config;
//# sourceMappingURL=index.js.map