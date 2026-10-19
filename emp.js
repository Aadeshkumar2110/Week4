 async function getEmployees(){
      try{
        const responce = await fetch("data.json");
        if(!responce.ok){
            throw new Error("Faild to fetch employee data.");
        }
        const employees = await responce.json();
        const table = document.getElementById("employeeTable");

        employees.forEach(employee => {
              const row = document.createElement("tr");
              row.innerHTML= `
              <td>${employee.id}</td>
              <td>${employee.name}</td>
              <td>${employee.department}</td>
              <td>${employee.contact}</td>
              <td><span class="badge ${employee.status == "Active" ?"bg-success":"bg-danger"}"> ${employee.status}</span></td>          
              <td>${employee.joinDate}</td>
              <td><i class="fa-solid fa-ellipsis-vertical"></i></td>`;
              table.appendChild(row);
        });
      }
      catch(error){
        console.error("Error Fetching employees : ",error);
      }
    }
    getEmployees();
  