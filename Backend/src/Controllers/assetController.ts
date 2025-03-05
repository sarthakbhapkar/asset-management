import {Request, Response} from 'express';
import {
    getAllAssets as getAllAssetsModel, getAssetByUserId as getAssetByUserIdModel,
    postAsset as postAssetModel, updateAsset as updateAssetModel,
    deleteAsset as deleteAssetModel, assignAsset as assignAssetModel,
    unAssignAsset as unAssignAssetModel, getUnassignedAssetsByType as unAssignedAssetsModel,
    changeOwner as changeOwnerModel, isAssetAvailable, checkOwner
} from '../Models/assetModel';
import {PostAsset,AssignData,ChangeOwnerData} from "../Interfaces/interface";

export const getAllAssets = async (req: Request, res: Response): Promise<void> => {
    try {
        const assets = await getAllAssetsModel();
        res.status(200).json(assets.rows);
    } catch (err) {
        res.status(500).json({error: 'Failed to fetch users', details: err});
    }
};

export const getAssetsHistoryByUserId = async (req: Request, res: Response): Promise<void> => {
    const id = parseInt(req.params.userId, 10);
    if (!id) {
        res.status(404).json({error: 'Please enter user id'});
        return;
    }
    try {
        const asset = await getAssetByUserIdModel(id);
        if (asset.rows.length > 0) {
            res.status(200).json(asset.rows);
        } else {
            res.status(404).json({error: 'Asset not found'});
        }
    } catch (err) {
        res.status(500).json({error: 'Failed to fetch Asset', details: err});
    }
};

export const postAsset = async (req: Request, res: Response): Promise<void> => {
    const {type,name}:PostAsset = req.body;
    if (!type || !name) {
        res.status(404).json({error: 'Please fill all the fields'});
        return;
    }
    try {
        const assets = await postAssetModel(type, name);
        if (assets.rows.length > 0) {
            res.status(200).json({message: 'Asset added Successfully'});
        }
    } catch (err) {
        res.status(500).json({error: 'Failed to Post Assets', details: err});
    }
};

export const updateAsset = async (req: Request, res: Response): Promise<void> => {
    const name:string = req.body.newAssetName;
    const assetId = parseInt(req.params.id, 10);
    if (!name || !assetId) {
        res.status(404).json({error: 'Please fill all the fields'});
        return;
    }
    try {
        await updateAssetModel(name, assetId);
        res.status(200).json({message: 'Asset updated Successfully'});
    } catch (err) {
        res.status(500).json({error: 'Failed to fetch Assets', details: err});
    }
};

export const deleteAsset = async (req: Request, res: Response): Promise<void> => {
    const assetId = parseInt(req.params.id, 10);
    if (!assetId) {
        res.status(404).json({error: 'Please enter asset id'});
        return;
    }
    try {
        await deleteAssetModel(assetId);
        res.status(200).json({message: 'Asset deleted Successfully'});
    } catch (err) {
        res.status(500).json({error: 'Failed to fetch assets', details: err});
    }
};

export const assignAsset = async (req: Request, res: Response) => {
    const {userId, assetId}:AssignData = req.body;
    if (!userId || !assetId) {
        res.status(404).json({error: 'Please fill all the fields'});
        return;
    }
    const assets= await isAssetAvailable(assetId);
    if(assets.rows[0].status==='unassigned'){
        await assignAssetModel(userId, assetId);
    }
    res.json({message: 'Asset assigned Successfully'});
}

export const unAssignAsset = async (req: Request, res: Response): Promise<void> => {
    const {userId, assetId}:AssignData = req.body;
    if (!userId || !assetId) {
        res.status(404).json({error: 'Please fill all the fields'});
        return;
    }
    const assets= await checkOwner(userId, assetId);
    if(assets.rows[0].status==='assigned'){
        await unAssignAssetModel(userId, assetId);
        res.json({message: 'Asset unassigned Successfully'});
    }
}

export const getUnassignedAssets = async (req: Request, res: Response): Promise<void> => {
    const type = req.query.type;
    if (!type || (type !== 'hardware' && type !== 'software')) {
        res.status(400).json({error: 'Please provide a valid asset type: "hardware" or "software"'});
        return;
    }
    try {
        const assets = await unAssignedAssetsModel(type as string);
        res.json(assets.rows);
    } catch (error) {
        console.error('Error retrieving unassigned assets:', error);
        res.status(500).json({error: 'An error occurred while retrieving unassigned assets'});
    }
};

export const changeOwner = async (req: Request, res: Response): Promise<void> => {
    const {fromEmp, toEmp, assetId}:ChangeOwnerData = req.body;
    if (!fromEmp || !assetId || !toEmp) {
        res.status(404).json({error: 'Please fill all the fields'});
        return;
    }
    const assets = await checkOwner(fromEmp, assetId);
    console.log(assets.rows);
    if(assets.rows.length > 0 ){
        await changeOwnerModel(fromEmp, assetId, toEmp);
    }
    res.json({message: 'Changed Ownership Successfully'});
}


