import type { Request, Response } from "express";
declare class IssueController {
    create: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    getAll: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    getSingleIssue: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    updateIssue: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    deleteIssue: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
}
export declare const issueController: IssueController;
export {};
//# sourceMappingURL=issues.controller.d.ts.map