import {
    getData, updateData, insertDropDown, generateWarning,
    clearAndCloseDialog, recreateTable, callUpdateProfile, callOpenModal,createTable,createTableWithActions
} from "./common-functions.ts";

declare const window: any;

async function fetchAllUserAssetHistory(): Promise<void> {
    const data = await getData(`http://localhost:5000/users/assets-history`)
    createTable(data, "allUserAssetHistory",[])
}

async function fetchAllUserCurrentAsset(): Promise<void> {
    const response = await getData(`http://localhost:5000/users/current-assets`)
    createTable(response, "allUserCurrentAssets",[])
}

async function fetchAllUserRequestHistory(): Promise<void> {
    const response = await getData(`http://localhost:5000/request`)
    createTable(response, "userRequestHistory",[])
}

window.postUser = async function (): Promise<void> {
    const firstName = document.getElementById('first-name') as HTMLInputElement;
    const lastName = document.getElementById('last-name') as HTMLInputElement;
    const email = document.getElementById('email1') as HTMLInputElement;
    const password = document.getElementById('psw') as HTMLInputElement;
    const checkFields = !firstName.value || !lastName.value || !email.value || !password.value;
    if (checkFields) {
        generateWarning('createUserWarning')
        return;
    }
    const data = {
        firstName: firstName.value,
        lastName: lastName.value,
        email: email.value,
        password: password.value
    }
    await updateData(`http://localhost:5000/users`, data, "POST")
    clearAndCloseDialog('newUser')
}

window.createAsset = async function (): Promise<void> {
    const type = document.getElementById('createAssetSelect') as HTMLInputElement;
    const name = document.getElementById('createAssetName') as HTMLInputElement;
    const checkFields = !type.value || !name.value
    if (checkFields) {
        generateWarning('createAssetWarning')
        return;
    }
    const data = {name: name?.value, type: type?.value,}
    await updateData(`http://localhost:5000/assets`, data, 'POST')
    clearAndCloseDialog('create-Asset')
}

window.assignAsset = async function (): Promise<void> {
    const userId = document.getElementById('userList') as HTMLSelectElement;
    const assetId = document.getElementById('assetList') as HTMLSelectElement;
    const checkFields = assetId.selectedIndex === 0 || userId.selectedIndex === 0
    if (checkFields) {
        generateWarning('assignAssetWarning')
        return;
    }
    const data = {userId: userId?.value, assetId: assetId?.value}
    await updateData(`http://localhost:5000/assets/assign-assets`, data, 'POST')
    await recreateTable('allUserCurrentAssets', fetchAllUserCurrentAsset)
    clearAndCloseDialog('Assign-Asset')
}

window.unAssignAsset = async function (): Promise<void> {
    const userId = document.getElementById('user_list') as HTMLSelectElement;
    const assetId = document.getElementById('asset_list') as HTMLSelectElement;
    const checkFields = assetId.selectedIndex === 0 || userId.selectedIndex === 0;
    if (checkFields) {
        generateWarning('unassignAssetWarning')
        return;
    }
    const data = {userId: userId?.value, assetId: assetId?.value}
    await updateData(`http://localhost:5000/assets/unassign-assets`, data, 'POST')
    await recreateTable('allUserCurrentAssets', fetchAllUserCurrentAsset, fetchAllUserAssetHistory, 'allUserAssetHistory')
    clearAndCloseDialog('unAssign-Asset')
}

window.getAssignAssetByType = async function (type: string, userList: string, assetList: string): Promise<void> {
    const list = document.getElementById(assetList) as HTMLSelectElement;
    const userId = document.getElementById(userList) as HTMLSelectElement
    const response = await getData(`http://localhost:5000/users/assets?type=${type}&userId=${userId.value}`)
    insertDropDown(response, list)
}

window.openDialog = async function (id1: string, id2: string, id3: string): Promise<void> {
    const userDetailDiv = document.getElementById(id1) as HTMLDialogElement;
    userDetailDiv.style.display = "flex";
    const sidebar = document.getElementById(id2) as HTMLElement;
    sidebar.style.display = "none";
    const backdrop = document.getElementById(id3) as HTMLElement;
    backdrop.style.display = "block";
    await getAllUsers(id1)
}

const userActions = [
    {
        btnName: 'Update',
        handleFnc: (item:Record<string, any>) => window.handleUpdate(item)
    },
    {
        btnName: 'Delete',
        handleFnc: (item:Record<string, any>) => window.handleDelete(item)
    }
];
const requestActions = [
    {
        btnName: 'Update',
        handleFnc: (item:Record<string, any>) => window.handleAccept(item)
    },
    {
        btnName: 'Delete',
        handleFnc: (item:Record<string, any>) => window.handleReject(item)
    }
];


window.openUserAssetDialog = async function (id: string, name: string): Promise<void> {
    const dialog = document.getElementById(id) as HTMLElement;
    dialog.style.display = "flex";
    if (name === 'users') {
        const response = await getData(`http://localhost:5000/users`);
        createTableWithActions(response, "usersAndAssetsTable",["userId"],userActions)
    } else if (name === 'assets') {
        const response = await getData(`http://localhost:5000/assets`);
        createTableWithActions(response, "usersAndAssetsTable",["assetId"],userActions)
    } else if (name == 'request') {
        const response = await getData(`http://localhost:5000/request?type='pending'`);
        if (response.length === 0) {
            const table = document.getElementById('usersAndAssetsTable') as HTMLTableElement;
            table.innerHTML = ''
            const h2 = document.createElement("h2") as HTMLElement;
            h2.innerText = 'No-Requests'
            table.appendChild(h2)
            return;
        }
        createTableWithActions(response, "usersAndAssetsTable",["userId","assetId"],requestActions)
    }
}

window.closeUserAssetDialog = function (id: string) {
    const dialog = document.getElementById(id) as HTMLElement;
    const dialogTable = document.getElementById('usersAndAssetsTable') as HTMLElement;
    dialog.style.display = 'none'
    dialogTable.innerHTML = ''
}

window.ReplaceOwner = async function () {
    const fromUser = document.getElementById('user-list') as HTMLSelectElement;
    const toUser = document.getElementById('user-list2') as HTMLSelectElement;
    const assetId = document.getElementById('asset-list') as HTMLSelectElement;
    const checkFields = fromUser.selectedIndex === 0 || toUser.selectedIndex === 0 || assetId.selectedIndex === 0;
    if (checkFields) {
        generateWarning('changeOwnerWarning')
        return;
    }
    const object = {fromEmp: fromUser.value, toEmp: toUser.value, assetId: assetId.value}
    await updateData(`http://localhost:5000/assets/change-asset-owner`, object, 'PUT')
    clearAndCloseDialog('changeOwner')
    await recreateTable('allUserCurrentAssets', fetchAllUserCurrentAsset)
}

window.handleUpdate = async function (data: Record<any, any>) {
    if(data.userId){
    callOpenModal('updateProfile','sidebar-right','backdrop')
    const id=document.getElementById('saveBtn') as HTMLButtonElement;
    id.addEventListener('click',()=> callUpdateProfile('first','last','email','updateProfile','profileWarning',data.userId))
    }else{
        callOpenModal('updateAsset','sidebar-right','backdrop')
        const btn=document.getElementById('updateAssetBtn') as HTMLButtonElement;
        btn.addEventListener('click',async ()=>{
        const newAssetName=document.getElementById('asset1') as HTMLInputElement;
        const body={newAssetName:newAssetName.value};
        await updateData(`http://localhost:5000/assets/update/${data.assetId}`,body,"PUT")
        })
    }
}

window.handleDelete =async function (data: Record<any, any>) {
    if(data.userId){
    const body={userId:data.userId}
    await updateData(`http://localhost:5000/users/delete`,body,'PUT')
    }else{
        console.log('aassets')
    }
}

window.handleAccept = async function (data: Record<string, unknown>) {
    const object = {assetId: data.assetId, userId: data.userId}
    await updateData(`http://localhost:5000/request/approve`, object, 'POST')
    await recreateTable('userRequestHistory', fetchAllUserRequestHistory, fetchAllUserCurrentAsset, 'allUserCurrentAssets')
}

window.handleReject = async function (data: Record<string, unknown>) {
    const object = {assetId: data.assetId, userId: data.userId}
    await updateData(`http://localhost:5000/request/reject`, object, 'PUT')
    await recreateTable('userRequestHistory', fetchAllUserRequestHistory)
}

async function getAllUsers(id: string): Promise<void> {
    let list: HTMLSelectElement;
    if (id === 'Assign-Asset') {
        list = document.getElementById('userList') as HTMLSelectElement;
    }
    if (id === 'unAssign-Asset') {
        list = document.getElementById('user_list') as HTMLSelectElement;
    }
    if (id === 'changeOwner') {
        list = document.getElementById('user-list') as HTMLSelectElement;
        const list2 = document.getElementById('user-list2') as HTMLSelectElement;
        const response = await getData(`http://localhost:5000/users`)
        insertDropDown(response, list2)
    }
    const response = await getData(`http://localhost:5000/users`)
    insertDropDown(response, list)
}

fetchAllUserAssetHistory();
fetchAllUserCurrentAsset();
fetchAllUserRequestHistory()


