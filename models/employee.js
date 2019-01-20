class Employee {
	constructor(csvString) {
		this.name = csvString[0];
		this.lastName = csvString[1];
		this.joinDate = csvString[2];
		this.salary = csvString[3];
		this.badges = JSON.parse(csvString[4]);
	}
}

module.exports = Employee;