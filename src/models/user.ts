export interface UserAddress {
    id: string;
    label?: string;
    fullName?: string;
    line1: string;
    line2?: string;
    city: string;
    state?: string;
    postalCode: string;
    country: string;
    isDefault?: boolean;
}

export interface UserProfile {
    uid: string;
    email: string;
    phoneNumber?: string;
    displayName?: string;
    firstName?: string;
    lastName?: string;
    createdAt?: Date;
    updatedAt?: Date;
}
