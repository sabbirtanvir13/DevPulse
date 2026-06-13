declare class IssueService {
    createIssue: (payload: any) => Promise<any>;
    getAllIssues: (sort?: string, type?: string, status?: string) => Promise<{
        id: any;
        title: any;
        description: any;
        type: any;
        status: any;
        reporter: any;
        created_at: any;
        updated_at: any;
    }[]>;
    getSingleIssue: (id: number) => Promise<{
        id: any;
        title: any;
        description: any;
        type: any;
        status: any;
        reporter: any;
        created_at: any;
        updated_at: any;
    } | null>;
    getIssueById: (id: number) => Promise<any>;
    updateIssue: (id: number, payload: {
        title?: string;
        description?: string;
        type?: string;
    }) => Promise<any>;
    deleteIssue: (id: number) => Promise<any>;
}
export declare const issueService: IssueService;
export {};
//# sourceMappingURL=issue.service.d.ts.map