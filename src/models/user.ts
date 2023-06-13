import { IAppointment } from "./appointment";
import { ILoyalty } from "./loyalty";

import { IWallet } from "./wallet";

export interface IUser{
    userId:string;
    name:string;
    email:string;
    mobile:number;
    password:string;
    appointments:IAppointment[];
    wallet:IWallet;
    loyalty:ILoyalty;
    createdDate:Date;
}