export default class Conflict{
    message:string;
    status:number;

    constructor(message: string){
        this.message = message;
        this.status = 409
    }
} 