export default class UnprocessableEntity{
    message:string;
    status:number;

    constructor(message: string){
        this.message = message;
        this.status = 422
    }
} 