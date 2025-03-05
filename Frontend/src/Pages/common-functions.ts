declare const window: any;

window.openModal = function (id1: string, id2: string, id3: string): void {
    const userDetailDiv = document.getElementById(id1) as HTMLDialogElement;
    userDetailDiv.style.display = "flex";
    const sidebar = document.getElementById(id2) as HTMLElement;
    sidebar.style.display = "none";
    const backdrop = document.getElementById(id3) as HTMLElement;
    backdrop.style.display = "block";

}

export function callOpenModal(id1: string, id2: string, id3: string): void {
    window.openModal(id1, id2, id3)
}

window.closeModal = function (id1: string): void {
    const div = document.getElementById(id1) as HTMLDialogElement;
    div.style.display = "none";
    const backdrop = document.getElementById('backdrop') as HTMLElement;
    backdrop.style.display = "none";
    clearFields(id1)
}

export const clearFields = function (id: string) {
    const element = document.getElementById(id) as HTMLInputElement;
    const inputs = element.querySelectorAll('input');
    const selects = element.querySelectorAll('select');
    if (selects) {
        selects.forEach(select => {
            select.innerHTML = ''
            const option = document.createElement("option");
            option.innerText = 'Select'
            select.appendChild(option)
        })
    }
    if (inputs) {
        inputs.forEach(input => {
            input.value = '';
            input.checked = false;
        })
    }
}

export function clearAndCloseDialog(id: string) {
    clearFields(id)
    setTimeout(() => {
        window.closeModal(id)
    }, 500)
}

export async function recreateTable(id: string, fn1: { (): Promise<void>; (): void; }, fn2?: {
    (): Promise<void>;
    (): void;
}, id1?: string) {
    const table = document.getElementById(id) as HTMLTableElement;
    table.innerHTML = ''
    if (id1) {
        const table1 = document.getElementById(id1) as HTMLTableElement;
        table1.innerHTML = ''
    }
    await fn1()
    if (fn2) {
        await fn2()
    }
}

window.updateProfile = async function (id: string, id1: string, id2: string, id3: string, id4: string, id5?: string) {
    const firstName = document.getElementById(id) as HTMLInputElement;
    const lastName = document.getElementById(id1) as HTMLInputElement;
    const email = document.getElementById(id2) as HTMLInputElement;
    let userId;
    if (id5) {
        userId = id5
    } else {
        userId = localStorage.getItem('id')
    }
    const checkFields = !firstName.value || !lastName.value || !email.value;
    if (checkFields) {
        generateWarning(id4)
        return;
    }
    const data = {firstName: firstName.value, lastName: lastName.value, email: email.value}
    await updateData(`http://localhost:5000/users/${userId}`, data, 'PUT')
    clearAndCloseDialog(id3)
}

export function callUpdateProfile(id: string, id1: string, id2: string, id3: string, id4: string, id5: string) {
    window.updateProfile(id, id1, id2, id3, id4, id5)
}

export function generateWarning(id: string) {
    const warning = document.getElementById(id) as HTMLSpanElement;
    warning.innerText = "Please fill all fields";
    setTimeout(() => {
        warning.innerText = ''
    }, 500)
}


window.openSideBar = function (id: string): void {
    const sidebar = document.getElementById(id) as HTMLElement;
    if (sidebar) {
        sidebar.style.display = "block";
    }
}

window.closeSideBar = function (id: string): void {
    const sidebar = document.getElementById(id) as HTMLElement;
    if (sidebar) {
        sidebar.style.display = "none";
    }
}

window.getUnassignAsset = async function (type: string, id: string): Promise<void> {
    const list = document.getElementById(id) as HTMLSelectElement;
    const response = await getData(`http://localhost:5000/assets/unassigned?type=${type}`)
    insertDropDown(response, list)
}

interface DropDownData {
    fullName: string | null;
    userId: number | null;
    assetId: number | null;
    assetName: string | null
}

export const insertDropDown = function (response: DropDownData[], id: HTMLSelectElement) {
    response?.forEach(data => {
        if (data.fullName && !data.assetName) {
            const option = document.createElement('option');
            option.value = String(data.userId);
            option.textContent = `${data.fullName}`;
            id.appendChild(option)
        } else {
            const option = document.createElement('option');
            option.value = String(data.assetId);
            option.textContent = `${data.assetName}`;
            id.appendChild(option)
        }
    })
}

window.logout = function (): void {
    localStorage.clear();
    window.location.replace("../../index.html")
}


export const getData = async function (url: string) {
    const getData = await fetch(url, {
        method: 'GET',
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem('token')}`,
        },
    })
    return await getData.json();
}
export const updateData = async function (url: string, body: Record<string, unknown>, method: string) {
    const getData = await fetch(url, {
        method: method,
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(body)
    })
    return await getData.json();
}

// function handleMousePos(event: any) {
//     let mouseClickWidth = event.clientX;
//     const sideBarLeft = document.getElementById('sidebar-left') as HTMLElement;
//     const sideBarRight = document.getElementById('sidebar-right') as HTMLElement;
//     if (mouseClickWidth >= 200) {
//         sideBarLeft.style.display = 'none'
//     }
//     if (event.clientX <= document.body.clientWidth-200) {
//         sideBarRight.style.display = 'none'
//     }
// }
// document.addEventListener("click", handleMousePos);


export function createTable(response: Record<string, any>, id: string, excludeFields?: string[]) {
    const table = document.getElementById(id) as HTMLTableElement;
    const header = table.createTHead();
    const headRow = header.insertRow()
    for (let key in response[0]) {
        if (excludeFields?.includes(key)) {
            continue
        }
        headRow.style.fontWeight = '700';
        const headCell = headRow.insertCell();
        headCell.innerHTML = key;
    }
    response.forEach((item:Record<string, any>) => {
        const row = table.insertRow();
        for (let val in item) {
            if(excludeFields?.includes(val)) {
                continue;
            }
            const cell = row.insertCell();
            cell.innerHTML = item[val];
        }
    })
}

export function createTableWithActions(response: Record<string, any>, id: string,excludedFields:string[],btnDetails?:Record<any, any>) {
    const table = document.getElementById(id) as HTMLTableElement;
    table.innerHTML = '';
    const header = table.createTHead();
    const headRow = header.insertRow()
    headRow.style.fontWeight = '700';
    for (let key in response[0]) {
        if (excludedFields.includes(key)) {
            continue
        }
        headRow.style.fontWeight = '700';
        const headCell = headRow.insertCell();
        headCell.innerHTML = key;
    }
    response.forEach((item:Record<string, any>) => {
        const row = table.insertRow();
        for (let val in item) {
            if (val === 'assetId' || val === 'userId') {
                continue;
            }
            const cell = row.insertCell();
            cell.innerHTML = item[val];
        }
        btnDetails.forEach(({ btnName,handleFnc }) => {
            const actionButton = document.createElement('button');
            actionButton.textContent = btnName;
            actionButton.style.backgroundColor='#0069d9'
            actionButton.style.color='white'
            actionButton.onclick = () => handleFnc(item);
            const cell = row.insertCell();
            cell.appendChild(actionButton);
        });
    })
}
