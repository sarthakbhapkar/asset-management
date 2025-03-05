import {
    clearAndCloseDialog, recreateTable, getData,
    updateData, generateWarning, callOpenModal, createTable
} from "./common-functions.ts";

declare const window: any;

async function fetchUserAssetHistory() {
    const response = await getData(`http://localhost:5000/assets/${localStorage.getItem("id")}`)
    createTable(response, "user_asset_table", ['userId'])
}

async function fetchUserCurrentAsset() {
    const response = await getData(`http://localhost:5000/users/assets?userId=${localStorage.getItem("id")}`)
    createTable(response, 'userCurrentAsset')
}

const changeRequestActions = [
    {
        btnName: 'Change',
        handleFnc: (item: Record<string, any>) => handleChange(item)
    },
];

async function fetchUserRequestHistory() {
    const response = await getData(`http://localhost:5000/request/${localStorage.getItem("id")}`)
    console.log(response)
    createTableWithActions(response, "userRequestHistory", ['userId', 'assetId', 'assetType'], changeRequestActions)

}

function createTableWithActions(response: Record<string, any>, id: string, excludedFields: string[], btnDetails: Record<any, any>) {
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
    response.forEach((item: Record<string, any>) => {
        const row = table.insertRow();
        if (item.status === 'pending') {
            for (let val in item) {
                if (val === 'assetId' || val === 'userId' || val === 'assetType') {
                    continue;
                }
                const cell = row.insertCell();
                cell.innerHTML = item[val];
            }
            btnDetails.forEach(({btnName, handleFnc}:Record<any, any>) => {
                const actionButton = document.createElement('button');
                actionButton.textContent = btnName;
                actionButton.style.backgroundColor = '#0069d9'
                actionButton.style.color = 'white'
                actionButton.onclick = () => handleFnc(item);
                const cell = row.insertCell();
                cell.appendChild(actionButton);
            });
        } else {
            for (let val in item) {
                if (val === 'assetId' || val === 'userId' || val === 'assetType') {
                    continue;
                }
                const cell = row.insertCell();
                cell.innerHTML = item[val];
            }
        }
    })
}

async function handleChange(data: Record<any, any>) {
    const typeSpanInnerText = document.getElementById('typeNameSpan') as HTMLSpanElement;
    const assetSpanInnerText = document.getElementById('assetNameSpan') as HTMLSpanElement;
    callOpenModal('changeRequest', 'sidebar-right', 'backdrop')
    typeSpanInnerText.innerText = data.assetType
    assetSpanInnerText.innerText = `From:  ${data.assetName}`
    const changeRequest = document.getElementById('changeRequestBtn') as HTMLButtonElement;
    changeRequest.addEventListener('click', async () => {
        const newAssetId = document.getElementById('selectNewAsset') as HTMLSelectElement
        const body = {userId: data.userId, toId: +newAssetId.value, fromId: data.assetId}
        const response = await updateData(`http://localhost:5000/request/`, body, 'PUT')
        if (response === 'Changed Successfully') {
            const msg = document.getElementById('changeMsg') as HTMLSpanElement;
            msg.innerText = 'changed successfully';
            setTimeout(() => {
                msg.innerText = '';
                clearAndCloseDialog('changeRequest');
                recreateTable('userRequestHistory', fetchUserRequestHistory)
            }, 1000)
        }
    })
}

window.sendRequest = async function () {
    const userId = localStorage.getItem("id")
    const assetId = document.getElementById('AssetList') as HTMLSelectElement;
    if (assetId.selectedIndex === 0) {
        generateWarning('requestWarning')
        return;
    }
    const data = {userId: userId, assetId: assetId.value}
    const response = await updateData(`http://localhost:5000/request`, data, 'POST')
    if (response.error === 'Request already exists') {
        window.alert("Already Requested")
    }
    clearAndCloseDialog("Create-Request")
    await recreateTable('userRequestHistory', fetchUserRequestHistory, fetchUserCurrentAsset, 'userCurrentAsset')
}

fetchUserAssetHistory();
fetchUserCurrentAsset();
fetchUserRequestHistory();
