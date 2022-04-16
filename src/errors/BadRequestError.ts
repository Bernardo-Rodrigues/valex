export default class BadRequest{
    message:string;
    status:number;

    constructor(message: string){
        this.message = message;
        this.status = 400
    }
} 