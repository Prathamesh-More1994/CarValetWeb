import { IService } from "./service";
import { IStaff } from "./staffDto";

export interface IAppointment {
    //appointmentId: string;
    timeSlot: Date;
    startTime: Date;
    endTime: Date;
    amount: number;
    staff: IStaff;
    service: IService;
    isCompleted: boolean;
    isCancelled: boolean;
    rating: number;
    comment: string;
}