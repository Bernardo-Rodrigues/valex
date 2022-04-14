import Unauthorized from "../errors/UnauthorizedError.js";
import * as companyRepository from "../repositories/companyRepository.js"

export async function validateKey(apiKey: string){
    const company = await companyRepository.findByApiKey(apiKey);
    if(!company) throw new Unauthorized("Invalid api key")

    return company
}