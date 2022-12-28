export interface IUserInfo {
    id: number;
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
    gender?: number;
    avatarUrl?: string;
    avatar?: string;
    birthday?: string;
    specialty?: string;
    clinicName?: string;
    fax?: string;
    address?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    npi?: string;
    dea?: string;
    eazyScriptId?: number;
}

export interface IAddressInfo {
    suitApt?: string;
    street?: string;
    city?: string;
    state?: string;
    postalCode?: string;
}

export interface InsuranceCardInfo {
    frontSide: string;
    backSide: string;
}

export interface IPatientInfo {
    id: number;
    firstName?: string;
    lastName?: string;
    email?: string;
    phoneNumber?: string;
    gender: number;
    avatarUrl?: string;
    birthday?: Date;
    height?: number;
    weight?: number;
    waist?: number;
    eazyscriptId?: number;
    address?: IAddressInfo;
    insuranceCard?: InsuranceCardInfo;
    firebaseUserId: string;
}
