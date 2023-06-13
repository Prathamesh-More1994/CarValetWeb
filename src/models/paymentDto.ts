import { IPayment } from "./payment";

export interface IPaymentDto{
    payments:IPayment[],
    monthlyRevenue:number,
    yearlyRevenue:number
}