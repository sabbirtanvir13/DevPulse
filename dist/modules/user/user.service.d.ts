import type { IUser } from "../../types/user.types";
export declare const userService: {
    createUserIntoDB: (paylood: IUser) => Promise<import("pg").QueryResult<any>>;
    getAllUsersFromDB: () => Promise<import("pg").QueryResult<any>>;
    getSingleUserFromDB: (id: String) => Promise<import("pg").QueryResult<any>>;
};
//# sourceMappingURL=user.service.d.ts.map