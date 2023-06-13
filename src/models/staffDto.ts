export interface IStaff {
    companyId: string;
    name: string;
    email: string;
    password: string;
    address: string;
    city: string;
    staffId: string;
    mobile: string;
    expertise:string;
    shift: IRoster[];
}

export interface IRoster {
    id: number,
    day: string,
    from: string,
    to: string,
    isAvailable: boolean
}