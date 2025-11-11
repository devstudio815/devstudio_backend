export class ResponseDto<T> {
    data: T;
    success: boolean = true;
    statusCode : number = 200;
    message: string;
    constructor(data: T,success : boolean,statusCode : number, message: string) {
        this.data = data;
        this.message = message;
        this.success = success;
        this.statusCode = statusCode;
    }   
}
