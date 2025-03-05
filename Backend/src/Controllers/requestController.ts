import {Request, Response} from 'express';
import {postRequest as postRequestModel,changeRequest as changeRequestModel,
         getRequestByUserId as getRequestByUserIdModel,
  getAllRequest as getAllRequestModel,approveRequest as approveRequestModel,
rejectRequest as rejectRequestModel, checkRequestStatus} from "../Models/requestModel";
import {isAssetAvailable} from "../Models/assetModel";
import {RequestData1,RequestData2} from "../Interfaces/interface";

export const postRequest = async (req: Request, res: Response): Promise<void> => {
    const {userId,assetId}:RequestData1=req.body
    try {
        const status = await checkRequestStatus(userId,assetId);
            if(status.rows.length > 0 && status.rows[0].status==='pending'){
                res.status(404).json({error: 'Request already exists'});
            }
            else{
                const assets = await postRequestModel(userId,assetId);
                res.status(200).json(assets.rows);
            }
    } catch (err) {
    }
};

export const changeRequest = async (req: Request, res: Response): Promise<void> => {
    const {fromId,toId,userId}:RequestData2=req.body
    try {
        const assets = await changeRequestModel(fromId,toId,userId);
        res.status(200).json('Changed Successfully');
    } catch (err) {
        res.status(500).json('internal server error');
    }
};

export const getRequestHistoryByUserId = async (req: Request, res: Response): Promise<void> => {
    const userId = parseInt(req.params.id, 10);
    if(!userId) {
        res.status(404).json({error: 'Please enter User-id'});
        return;
    }
    try {
        const assets = await getRequestByUserIdModel(userId);
        res.status(200).json(assets.rows);
    } catch (err) {
        res.status(500).send('internal server error');
    }
};

export const getAllRequestHistory = async (req: Request, res: Response): Promise<void> => {
    const type = req.query.type;
    try {
        const assets = await getAllRequestModel(type as string);
        res.status(200).json(assets.rows);
    } catch (err) {
        res.status(500).send('internal server error');
    }
};

export const approveRequest = async (req: Request, res: Response): Promise<void> => {
    const {userId,assetId}:RequestData1=req.body
    try {
        const asset= await isAssetAvailable(assetId);
        if(asset.rows[0].status==='unassigned'){
            const assets = await approveRequestModel(userId,assetId);
            res.status(200).json(assets.rows);
        }
        else{
            res.status(404).json({ error: 'Asset is already assigned' });
        }
    } catch (err) {
        res.status(500).send("internal server error");
    }
};

export const rejectRequest = async (req: Request, res: Response): Promise<void> => {
    const {userId,assetId}:RequestData1=req.body
    try {
        const assets = await rejectRequestModel(userId,assetId);
        res.status(200).json(assets.rows);
    } catch (err) {
        res.status(500).send("internal server error");
    }
};


