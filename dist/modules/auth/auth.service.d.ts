import type { IUser } from "../../types/user.types";
export declare const authService: {
    loginUserIntoDB: (payload: {
        email: string;
        password: string;
    }) => Promise<{
        token: string;
        user: {
            id: any;
            name: any;
            email: any;
            role: any;
        };
    }>;
    createUserIntoDB: (payload: IUser) => Promise<any>;
};
//# sourceMappingURL=auth.service.d.ts.map