export class Param {
    Username: string;
    Name: string;
    Password: string;
    Role: string;
    RefreshToken: string;

    constructor(
        username: string,
        name: string,
        password: string,
        role: string,
        refreshToken: string
    ) {
        this.Username = username;
        this.Name = name;
        this.Password = password;
        this.Role = role;
        this.RefreshToken = refreshToken;
    }
}