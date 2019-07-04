import { DMMF, DMMFClass, Engine, Datasource } from './runtime';
/**
 * Utility Types
 */
export declare type Enumerable<T> = T | Array<T>;
export declare type MergeTruthyValues<R extends object, S extends object> = {
    [key in keyof S | keyof R]: key extends false ? never : key extends keyof S ? S[key] extends false ? never : S[key] : key extends keyof R ? R[key] : never;
};
export declare type CleanupNever<T> = {
    [key in keyof T]: T[key] extends never ? never : key;
}[keyof T];
/**
 * Subset
 * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
 */
export declare type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
};
declare class PhotonFetcher {
    private readonly engine;
    private readonly debug;
    private readonly hooks?;
    private url?;
    constructor(engine: Engine, debug?: boolean, hooks?: Hooks | undefined);
    request<T>(document: any, path?: string[], rootField?: string, typeName?: string): Promise<T>;
    protected unpack(result: any, path: string[], rootField?: string): any;
}
/**
 * Client
**/
export declare type Datasources = {
    db?: Datasource;
};
export interface PhotonOptions {
    datasources?: Datasources;
    autoConnect?: boolean;
    debug?: boolean | {
        engine?: boolean;
        library?: boolean;
    };
    /**
     * You probably don't want to use this. `__internal` is used by internal tooling.
     */
    __internal?: {
        hooks?: Hooks;
        engine?: {
            cwd?: string;
            binaryPath?: string;
        };
    };
}
export declare type Hooks = {
    beforeRequest?: (options: {
        query: string;
        path: string[];
        rootField?: string;
        typeName?: string;
        document: any;
    }) => any;
};
export default class Photon {
    private fetcher;
    private readonly dmmf;
    private readonly engine;
    private readonly autoConnect;
    private readonly internalDatasources;
    private readonly datamodel;
    private connectionPromise?;
    constructor(options?: PhotonOptions);
    connect(): Promise<void>;
    disconnect(): Promise<void>;
    readonly users: UserDelegate;
}
export declare const OrderByArg: {
    asc: "asc";
    desc: "desc";
};
export declare type OrderByArg = (typeof OrderByArg)[keyof typeof OrderByArg];
/**
 * Model User
 */
export declare type User = {
    id: string;
    name: string;
    email: string;
};
export declare type UserScalars = 'id' | 'name' | 'email';
export declare type UserSelect = {
    id?: boolean;
    name?: boolean;
    email?: boolean;
};
declare type UserDefault = {};
declare type UserGetPayload<S extends boolean | UserSelect> = S extends true ? User : S extends UserSelect ? {
    [P in CleanupNever<MergeTruthyValues<UserDefault, S>>]: P extends UserScalars ? User[P] : never;
} : never;
export interface UserDelegate {
    <T extends FindManyUserArgs>(args?: Subset<T, FindManyUserArgs>): Promise<Array<UserGetPayload<ExtractFindManyUserArgsSelect<T>>>>;
    findOne<T extends FindOneUserArgs>(args: Subset<T, FindOneUserArgs>): 'select' extends keyof T ? Promise<UserGetPayload<ExtractFindOneUserArgsSelect<T>>> : UserClient<User>;
    findMany<T extends FindManyUserArgs>(args?: Subset<T, FindManyUserArgs>): Promise<Array<UserGetPayload<ExtractFindManyUserArgsSelect<T>>>>;
    create<T extends UserCreateArgs>(args: Subset<T, UserCreateArgs>): 'select' extends keyof T ? Promise<UserGetPayload<ExtractUserCreateArgsSelect<T>>> : UserClient<User>;
    delete<T extends UserDeleteArgs>(args: Subset<T, UserDeleteArgs>): 'select' extends keyof T ? Promise<UserGetPayload<ExtractUserDeleteArgsSelect<T>>> : UserClient<User>;
    update<T extends UserUpdateArgs>(args: Subset<T, UserUpdateArgs>): 'select' extends keyof T ? Promise<UserGetPayload<ExtractUserUpdateArgsSelect<T>>> : UserClient<User>;
    deleteMany<T extends UserDeleteManyArgs>(args: Subset<T, UserDeleteManyArgs>): 'select' extends keyof T ? Promise<UserGetPayload<ExtractUserDeleteManyArgsSelect<T>>> : UserClient<User>;
    updateMany<T extends UserUpdateManyArgs>(args: Subset<T, UserUpdateManyArgs>): 'select' extends keyof T ? Promise<UserGetPayload<ExtractUserUpdateManyArgsSelect<T>>> : UserClient<User>;
    upsert<T extends UserUpsertArgs>(args: Subset<T, UserUpsertArgs>): 'select' extends keyof T ? Promise<UserGetPayload<ExtractUserUpsertArgsSelect<T>>> : UserClient<User>;
}
declare class UserClient<T> implements Promise<T> {
    private readonly dmmf;
    private readonly fetcher;
    private readonly queryType;
    private readonly rootField;
    private readonly clientMethod;
    private readonly args;
    private readonly path;
    private callsite;
    private requestPromise?;
    constructor(dmmf: DMMFClass, fetcher: PhotonFetcher, queryType: 'query' | 'mutation', rootField: string, clientMethod: string, args: UserArgs, path: string[]);
    readonly [Symbol.toStringTag]: 'PhotonPromise';
    private readonly document;
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | Promise<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | Promise<TResult2>) | undefined | null): Promise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | Promise<TResult>) | undefined | null): Promise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): Promise<T>;
}
export declare type FindOneUserArgs = {
    select?: UserSelect;
    where: UserWhereUniqueInput;
};
export declare type FindOneUserArgsWithSelect = {
    select: UserSelect;
    where: UserWhereUniqueInput;
};
declare type ExtractFindOneUserArgsSelect<S extends undefined | boolean | FindOneUserArgs> = S extends undefined ? false : S extends boolean ? S : S extends FindOneUserArgsWithSelect ? S['select'] : true;
export declare type FindManyUserArgs = {
    select?: UserSelect;
    where?: UserWhereInput;
    orderBy?: UserOrderByInput;
    skip?: number;
    after?: string;
    before?: string;
    first?: number;
    last?: number;
};
export declare type FindManyUserArgsWithSelect = {
    select: UserSelect;
    where?: UserWhereInput;
    orderBy?: UserOrderByInput;
    skip?: number;
    after?: string;
    before?: string;
    first?: number;
    last?: number;
};
declare type ExtractFindManyUserArgsSelect<S extends undefined | boolean | FindManyUserArgs> = S extends undefined ? false : S extends boolean ? S : S extends FindManyUserArgsWithSelect ? S['select'] : true;
export declare type UserCreateArgs = {
    select?: UserSelect;
    data: UserCreateInput;
};
export declare type UserCreateArgsWithSelect = {
    select: UserSelect;
    data: UserCreateInput;
};
declare type ExtractUserCreateArgsSelect<S extends undefined | boolean | UserCreateArgs> = S extends undefined ? false : S extends boolean ? S : S extends UserCreateArgsWithSelect ? S['select'] : true;
export declare type UserUpdateArgs = {
    select?: UserSelect;
    data: UserUpdateInput;
    where: UserWhereUniqueInput;
};
export declare type UserUpdateArgsWithSelect = {
    select: UserSelect;
    data: UserUpdateInput;
    where: UserWhereUniqueInput;
};
declare type ExtractUserUpdateArgsSelect<S extends undefined | boolean | UserUpdateArgs> = S extends undefined ? false : S extends boolean ? S : S extends UserUpdateArgsWithSelect ? S['select'] : true;
export declare type UserUpdateManyArgs = {
    select?: UserSelect;
    data: UserUpdateManyMutationInput;
    where?: UserWhereInput;
};
export declare type UserUpdateManyArgsWithSelect = {
    select: UserSelect;
    data: UserUpdateManyMutationInput;
    where?: UserWhereInput;
};
declare type ExtractUserUpdateManyArgsSelect<S extends undefined | boolean | UserUpdateManyArgs> = S extends undefined ? false : S extends boolean ? S : S extends UserUpdateManyArgsWithSelect ? S['select'] : true;
export declare type UserUpsertArgs = {
    select?: UserSelect;
    where: UserWhereUniqueInput;
    create: UserCreateInput;
    update: UserUpdateInput;
};
export declare type UserUpsertArgsWithSelect = {
    select: UserSelect;
    where: UserWhereUniqueInput;
    create: UserCreateInput;
    update: UserUpdateInput;
};
declare type ExtractUserUpsertArgsSelect<S extends undefined | boolean | UserUpsertArgs> = S extends undefined ? false : S extends boolean ? S : S extends UserUpsertArgsWithSelect ? S['select'] : true;
export declare type UserDeleteArgs = {
    select?: UserSelect;
    where: UserWhereUniqueInput;
};
export declare type UserDeleteArgsWithSelect = {
    select: UserSelect;
    where: UserWhereUniqueInput;
};
declare type ExtractUserDeleteArgsSelect<S extends undefined | boolean | UserDeleteArgs> = S extends undefined ? false : S extends boolean ? S : S extends UserDeleteArgsWithSelect ? S['select'] : true;
export declare type UserDeleteManyArgs = {
    select?: UserSelect;
    where?: UserWhereInput;
};
export declare type UserDeleteManyArgsWithSelect = {
    select: UserSelect;
    where?: UserWhereInput;
};
declare type ExtractUserDeleteManyArgsSelect<S extends undefined | boolean | UserDeleteManyArgs> = S extends undefined ? false : S extends boolean ? S : S extends UserDeleteManyArgsWithSelect ? S['select'] : true;
export declare type UserArgs = {
    select?: UserSelect;
};
export declare type UserArgsWithSelect = {
    select: UserSelect;
};
/**
 * Deep Input Types
 */
export declare type UserWhereInput = {
    id?: string | StringFilter;
    name?: string | StringFilter;
    email?: string | StringFilter;
    AND?: Enumerable<UserWhereInput>;
    OR?: Enumerable<UserWhereInput>;
    NOT?: Enumerable<UserWhereInput>;
};
export declare type UserWhereUniqueInput = {
    id?: string;
    email?: string;
};
export declare type UserCreateInput = {
    id?: string;
    name: string;
    email: string;
};
export declare type UserUpdateInput = {
    name?: string;
    email?: string;
};
export declare type UserUpdateManyMutationInput = {
    name?: string;
    email?: string;
};
export declare type StringFilter = {
    equals?: string;
    not?: string | StringFilter;
    in?: Enumerable<string>;
    notIn?: Enumerable<string>;
    lt?: string;
    lte?: string;
    gt?: string;
    gte?: string;
    contains?: string;
    startsWith?: string;
    endsWith?: string;
};
export declare type UserOrderByInput = {
    id?: OrderByArg;
    name?: OrderByArg;
    email?: OrderByArg;
};
/**
 * DMMF
 */
export declare const dmmf: DMMF.Document;
export {};
