export default class Unauthorized{
    message:string;
    status:number;

    constructor(message: string){
        this.message = message;
        this.status = 401
    }
} 