export interface UserAddress {
    id: string;
    label?: string;
    line1: string;
    line2?: string;
    city: string;
    state?: string;
    postalCode: string;
    country: string;
}

export interface UserProfile {
    uid: string;
    email: string;
    displayName?: string;
    firstName?: string;
    lastName?: string;
    createdAt?: Date;
    updatedAt?: Date;
}
