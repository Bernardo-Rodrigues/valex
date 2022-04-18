import BusinessRepository from "./businessRepository.js";
import CardRepository from "./cardRepository.js";
import CompanyRepository from "./companyRepository.js";
import EmployeeRepository from "./employeeRepository.js";
import PaymentRepository from "./paymentRepository.js";
import RechargeRepository from "./rechargeRepository.js";

const card = new CardRepository();
const business = new BusinessRepository();
const company = new CompanyRepository();
const employee = new EmployeeRepository();
const payment = new PaymentRepository();
const recharge = new RechargeRepository();

const repositories = {
    card,
    business,
    company,
    employee,
    payment,
    recharge
}

export default repositories;