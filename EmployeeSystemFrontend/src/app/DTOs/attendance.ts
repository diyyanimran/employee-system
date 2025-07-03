export interface IAttendance
{
    checkInTime: Date,
    checkOutTime : Date | null,
    present: boolean,
    leaveAllowed: boolean
}