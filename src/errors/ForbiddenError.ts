export default class Forbidden{
    message:string;
    status:number;

    constructor(message: string){
        this.message = message;
        this.status = 403
    }
} 