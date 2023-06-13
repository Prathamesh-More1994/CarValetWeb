import { KeyValue } from "@angular/common";

export interface IPayment {
    productName: string,
    amount: number,
    metadata: KeyValue<string, string>[],
    clientSecretKey: string,
    companyId: string,
    userId: string,
    createdDate:Date
}