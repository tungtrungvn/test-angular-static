
import { IUserInfo } from '@app/models/interfaces/users.interface';

export interface ILoginBody {
    email: string;
    password: string;
}

export interface ILogin {
    user: IUserInfo;
    token: string;
}
export interface IRoles {
    name: string;
    id: number;
}
//add by long
export interface ILoginFirebaseBody {
    email: string;
    password: string;
    returnSecureToken: boolean;
}
export interface ILoginFirebase {
    kind: string,
    localId: string,
    email: string,
    displayName: string,
    idToken: string,
    registered: boolean,
    profilePicture: string,
    refreshToken: string,
    expiresIn: string
}
export interface IUserFirebase {
    email?: string;
    firstName: string;
    lastName: string;
    phoneNumber?: string;
    role?: number;
    emailVerified: boolean;
}
export interface ILoginFirebaseResult {
    user: IUserFirebase;
    token: string;
}
export interface IAdminRole {
    id: string,
    roleName: string
}
