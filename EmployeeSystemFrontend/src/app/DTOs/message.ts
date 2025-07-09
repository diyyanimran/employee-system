export interface IMessage
{
    text: string,
    senderId: number,
    receiverId: number,
    time: Date,
    isRead: boolean
}