export class Param {
    Username: string;
    Name: string;
    Password: string;
    Role: string;
    RefreshToken: string;
    SenderId: number;
    ReceiverId: number;
    Text: string;

    constructor(
        username: string,
        name: string,
        password: string,
        role: string,
        refreshToken: string,
        senderId: number,
        receiverId: number,
        text: string
    ) {
        this.Username = username;
        this.Name = name;
        this.Password = password;
        this.Role = role;
        this.RefreshToken = refreshToken;
        this.SenderId = senderId;
        this.ReceiverId = receiverId;
        this.Text = text;
    }
}