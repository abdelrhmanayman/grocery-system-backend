const { MONTHS, WEEKENDS, EMPLOYEES } = require('./constants')
const { createObjectCsvWriter } = require('csv-writer')

const csvWriter = createObjectCsvWriter({
    path: 'output.csv',
    header: [
        { id: 'name', title: 'Name' },
        { id: 'salary', title: 'Salary' },
        { id: 'salaryDate', title: 'Salary_Date' },
        { id: 'bonus', title: 'Bonus' },
        { id: 'bonusDate', title: 'Bonus_Date' },
    ]
})

const records = []
let salary = new Date()
let bonus = new Date()
for (let currentMonthIndex = 0,
    year = salary.getFullYear(),
    month = salary.getMonth(),
    monthsCount = MONTHS.length;
    currentMonthIndex < monthsCount;
    currentMonthIndex++) {
    // getting the last day of the month
    let nextMonthIndex = currentMonthIndex + month + 1
    // checks if next month is in this year or to go to a new year
    if (nextMonthIndex >= monthsCount && year == salary.getFullYear()) {
        salary.setFullYear(year + 1)
        bonus.setFullYear(year + 1)
    }
    let payroll = nextMonthIndex % monthsCount
    salary.setMonth(payroll, 0)
    bonus.setMonth(payroll, 15)
    let salaryDayIndex = salary.getDay()
    let bonusDayIndex = bonus.getDay()
    // conditions checks if the salary will be on a weekend or not
    if (WEEKENDS.includes(salaryDayIndex)) {
        salary.setDate(salary.getDate() - salaryDayIndex + 4)
    }
    // check if bonus will be on weekend or not
    if (WEEKENDS.includes(bonusDayIndex)) {
        bonus.setDate(bonus.getDate() - bonusDayIndex + 7 + 3)
    }
    for (let employeeIndex = 0,
        employeesLength = EMPLOYEES.length;
        employeeIndex < employeesLength;
        employeeIndex++) {
        let employee = EMPLOYEES[employeeIndex]
        // push the new record to the CSV file
        records.push({
            name: employee.name,
            salary: employee.salary,
            salaryDate: salary.toLocaleDateString(),
            bonus: employee.bonus,
            bonusDate: bonus.toLocaleDateString()
        })
    }
    // push empty record to separate the months
    records.push({})
}
csvWriter.writeRecords(records)
    .then(() => console.log('Done!, Check the output.csv'))
    .catch(({ message }) => console.log(message))