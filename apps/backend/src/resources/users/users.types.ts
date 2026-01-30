export interface ICreateUserData {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role?: 'user' | 'admin';
}

export interface IUpdateUserData {
    firstName?: string | undefined;
    lastName?: string | undefined;
    email?: string | undefined;
    role?: 'user' | 'admin' | undefined;
}

export interface IUserResponseData {
    _id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: 'user' | 'admin';
    createdAt: string;
    updatedAt: string;
}
