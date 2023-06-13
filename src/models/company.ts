import { IOwner } from "./owner";
import { IService } from "./service";


export interface ICompany {
    companyId: string;
    ownerId: string;
    serviceId: string;
    address: string;
    companyName: string;
    serviceDay: Date;
    location: ILocation;
    owner: IOwner;
    service: IService[];
    //staff:IStaff[];
    workingHours:IWorkingHours[]
}

export interface ILocation {
    latitude: number;
    longitude: number;
}

export interface IWorkingHours{
    day:string,
    from:Date,
    to:Date
}