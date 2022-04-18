import { connection } from "../database.js";
import Employee from "../interfaces/Employee.js";

export default class EmployeeRepository{
  async findById(id: number) {
    const result = await connection.query<Employee, [number]>(
      "SELECT * FROM employees WHERE id=$1",
      [id]
    );

    return result.rows[0];
  }
}
