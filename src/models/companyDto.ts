import { ILocation, IWorkingHours } from "./company";
import { IOwner } from "./owner";
import { IService } from "./service";
import { IStaff } from "./staffDto";

export interface ICompanyDto {
    companyId: string,
    address: string,
    companyName: string,
    serviceDay: Date,
    location: ILocation,
    owner:IOwner,
    service:IService[],
    workingHours:IWorkingHours[],
    staffs:IStaff[]
}