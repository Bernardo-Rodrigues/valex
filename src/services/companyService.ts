import { Unauthorized } from "../errors/index.js";
import repositories from "../repositories/index.js";

export default class CompanyService{
    async validateKey(apiKey: string){
        const company = await repositories.company.findByApiKey(apiKey);
        if(!company) throw new Unauthorized("Invalid api key")

        return company
    }
}