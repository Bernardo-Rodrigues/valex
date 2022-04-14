export default class NotFound{
    message:string;
    status:number;

    constructor(message: string){
        this.message = message;
        this.status = 404
    }
} 