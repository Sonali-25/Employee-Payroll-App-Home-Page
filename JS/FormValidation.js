let isUpdate = false;
let empObject = {};

window.addEventListener('DOMContentLoaded', (event) => {
    validateName();
    salaryOutput();
    validateDate();
    checkForUpdate();
});

function salaryOutput() {
    const salary = document.querySelector('#salary');
    const output = document.querySelector('.salary-output');
    output.textContent = salary.value;
    salary.addEventListener('input', function () {
        output.textContent = salary.value;
    });
}

function validateName() {
    const name = document.querySelector('#name');
    const textError = document.querySelector('.text-error');
    name.addEventListener('input', function () {
        if (name.value.length == 0) {
            textError.textContent = "";
            return;
        }
        try {
            (new EmployeePayrollData()).name = name.value;
            textError.textContent = "";
        } catch (e) {
            textError.textContent = e;
        }
    });
}

function validateDate() {
    const day = document.querySelector('#day');
    const month = document.querySelector('#month');
    const year = document.querySelector('#year');

    day.addEventListener('input', checkDate);
    month.addEventListener('input', checkDate);
    year.addEventListener('input', checkDate);
}

function checkDate() {
    const dateError = document.querySelector('.date-error');
    try {
        let date = day.value + " " + month.value + " " + year.value;
        (new EmployeePayrollData()).startDate = new Date(Date.parse(date));
        dateError.textContent = "";
    } catch (e) {
        dateError.textContent = e;
    }
}

const save = (event) => {
    event.preventDefault();
    event.stopPropagation();
    try {
        let empData = setempObject();
        createAndUpdateStorage(empData);
        resetForm();
        window.location.replace(site_properties.home_page)
    } catch (e) {
        console.log(e)
        return;
    }
}

const setempObject = () => {
    let employeePayrollData = new EmployeePayrollData();
    try {
        alert(getInputValueId('#name'))
        employeePayrollData.name = getInputValueId('#name');
        let date = getInputValueId('#day') + " " + getInputValueId('#month') + " " + getInputValueId('#year');
        employeePayrollData.startDate = new Date(Date.parse(date));
    } catch (e) {
        if ('Incorrect Name' == e) {
            setTextValue('.text-error', e);
        } else {
            setTextValue('.date-error', e);
        }
        throw e
    }
    employeePayrollData.profilePic = getSelectedValue('[name=profile]').pop();
    employeePayrollData.gender = getSelectedValue('[name=gender]').pop();
    employeePayrollData.department = getSelectedValue('[name=department]');
    employeePayrollData.salary = getInputValueId('#salary');
    employeePayrollData.note = getInputValueId('#notes').replace(/\s/g, '');
    employeePayrollData.id = empObject._id;
    return employeePayrollData;
}

const getInputValueId = (id) => {
    let value = document.querySelector(id).value;
    return value;
}

const getSelectedValue = (propertyValue) => {
    let allItem = document.querySelectorAll(propertyValue);
    let setItem = [];
    allItem.forEach(item => {
        if (item.checked) {
            setItem.push(item.value);
        }
    });
    return setItem;
}

const setTextValue = (id, value) => {
    let textError = document.querySelector(id);
    textError.textContent = value;
}

const createNewEmpId = () => {
    let empId = localStorage.getItem('EmpId');
    empId = !empId ? 1 : (parseInt(empId) + 1).toString();
    console.log(empId +"Create new emp")
    localStorage.setItem('EmpId', empId);
    return empId;
}

const createAndUpdateStorage = (data) => {
    let dataList = JSON.parse(localStorage.getItem("EmployeePayrollList"));
    if (dataList) {
        let existingEmpData = dataList.find(empData => empData._id == data.id);
        console.log(existingEmpData);
        if (!existingEmpData) {
            data._id = createNewEmpId();
            console.log("Saved")
            dataList.push(data);
        } else {
            const index = dataList.map(empData => empData._id).indexOf(data.id);
            dataList.splice(index, 1, data);
            console.log(dataList)
        }
    } else {
        data._id = createNewEmpId();
        dataList = [data]
    }
    localStorage.setItem("EmployeePayrollList", JSON.stringify(dataList));
}

const resetForm = () => {
    setValue('#name', '');
    unsetSelectedValues('[name=profile]');
    unsetSelectedValues('[name=gender]');
    unsetSelectedValues('[name=department]');
    setValue('#salary', '');
    setTextValue('.salary-output', 400000);
    setValue('#notes', '');
    setValue('#day', '1');
    setValue('#month', 'Jan');
    setValue('#year', '2020');
}
const unsetSelectedValues = (propertyValue) => {
    let allItems = document.querySelectorAll(propertyValue);
    allItems.forEach(item => {
        item.checked = false;
    });
}

const setValue = (id, value) => {
    const element = document.querySelector(id);
    element.value = value;
}

const checkForUpdate = () => {
    const jsonData = localStorage.getItem('edit-emp');
    isUpdate = jsonData ? true : false;
    if (!isUpdate) return;
    console.log(JSON.parse(jsonData));
    empObject = JSON.parse(jsonData);
    setForm();
}

const setForm = () => {

    setValue('#name', empObject._name);
    setSelectedValue('[name = profile]', empObject._profilePic);
    setSelectedValue('[name = gender]', empObject._gender);
    setSelectedValue('[name = department]', empObject._department);
    setValue('#salary', empObject._salary);
    setTextValue('.salary-output', empObject._salary);
   
    let date = strigifyDate(empObject._startDate).split(" ");
    console.log(date[1]);
    setValue('#day', date[0]);
    setValue('#month', date[1]);
    setValue('#year', date[2]);
    setValue('#notes', empObject._note);
}

const setSelectedValue = (propertyValue, value) => {
    let allItem = document.querySelectorAll(propertyValue);
    allItem.forEach(item => {
        if (Array.isArray(value)) {
            if (value.includes(item.value)) {
                item.checked = true;
            }
        } else if (item.value === value) {
            item.checked = true;
        }
    });
}