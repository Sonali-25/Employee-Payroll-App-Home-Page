let employeePayrollList;
window.addEventListener('DOMContentLoaded', (event) => {
    console.log("Called Event");
    employeePayrollList = getDataFromLocalStorage();
    document.querySelector('.emp-count').textContent = employeePayrollList.length;
    createInnerHtml();

    localStorage.removeItem("edit-emp");
});

const createInnerHtml = () => {
    const headerHtml ="<tr><th></th><th>Name</th> <th>Gender</th><th>Department</th><th>Salary</th><th>Start Date</th><th>Actions</th></tr>"
    //const empPayrollDataList = createEmployeePayrollJSON ();
    let innerHtml = `${headerHtml}`;
    for(let empPayrollData of employeePayrollList) {
        innerHtml =`${innerHtml}
   
<tr>
    <td><img src="${empPayrollData._profilePic}"></td>
    <td>${empPayrollData._name}</td>
    <td>${empPayrollData._gender}</td>
    <td>
        ${getDepatmentHtml(empPayrollData._department)}
        
    </td >
    <td>${empPayrollData._salary}</td>
    <td>${strigifyDate(empPayrollData._startDate)}</td>
    <td>
        <img id="${empPayrollData._id}" src="../assets/icons/delete-black-18dp.svg" alt="Delete" onclick="remove(this)">
        <img id="${empPayrollData._id}" src="../assets/icons/create-black-18dp.svg" alt="Edit" onclick="update(this)">
    </td>
</tr>`;
document.querySelector('#display').innerHTML=innerHtml;
}
}
const getDepatmentHtml = (data) => {
    let deptHtml ='';
    for(let dept of data){
        deptHtml = `${deptHtml}<div class ='dept-label'>${dept}</div>`;
    }
    return deptHtml;
}

const getDataFromLocalStorage= () => {
    return localStorage.getItem('EmployeePayrollList')? 
           JSON.parse(localStorage.getItem('EmployeePayrollList')) : [];
}
const remove = (data) =>{
    console.log(data.id);
    let employeeData = employeePayrollList.find(empData => empData._id == data.id);
    if(!employeeData){
        return;
    } 
    const index = employeePayrollList.map(empData => empData._id).indexOf(employeeData._id);
    employeePayrollList.splice(index, 1);
    localStorage.setItem("EmployeePayrollList", JSON.stringify(employeePayrollList));
    document.querySelector('.emp-count'),textContent = employeePayrollList.length;
    createInnerHtml();
}

const update = (data) => {
    let employeeData = employeePayrollList.find(empData => empData._id == data.id);
    if(!employeeData){
        return;
    
}
localStorage.setItem("edit-emp", JSON.stringify(employeeData));
window.location.replace(site_properties.add_employee_page);
}