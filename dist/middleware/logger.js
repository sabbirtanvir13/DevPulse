import fs from 'fs';
const logger = (req, res, next) => {
    console.log("mathed_url_time", req.method, req.url, Date.now());
    const log = ` \nMethod ->${req.method} Time ->${Date.now()} Url${req.url}\n `;
    fs.appendFile('logger.txt', log, (error) => {
        console.log(error);
    });
    next();
};
export default logger;
//# sourceMappingURL=logger.js.map