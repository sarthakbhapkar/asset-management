export interface PostUser{
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    seat_n: number;
}

export interface UpdateUser{
    firstName: string;
    lastName: string;
    email: string;
}

export interface SendMail{
    email: string;
}

export interface LoginUser{
    email: string;
    password: string;
}

export interface PostAsset{
    type: string;
    name: string;
}

export interface AssignData{
    userId: number;
    assetId: number;
}

export interface ChangeOwnerData{
    fromEmp: number;
    toEmp: number;
    assetId: number;
}

export interface RequestData {
    userId?:number;
    assetId?:number;
    status?:string;
    fromId?:number;
    toId?:number;
}
export interface RequestData1 {
    userId:number;
    assetId:number;
}
export interface RequestData2 {
    fromId:number;
    toId:number;
    userId:number;
}