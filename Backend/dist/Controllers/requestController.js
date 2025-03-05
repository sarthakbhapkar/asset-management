"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rejectRequest = exports.approveRequest = exports.getAllRequestHistory = exports.getRequestHistoryByUserId = exports.changeRequest = exports.postRequest = void 0;
const requestModel_1 = require("../Models/requestModel");
const assetModel_1 = require("../Models/assetModel");
const postRequest = async (req, res) => {
    const { userId, assetId } = req.body;
    try {
        const status = await (0, requestModel_1.checkRequestStatus)(userId, assetId);
        if (status.rows.length > 0 && status.rows[0].status === 'pending') {
            res.status(404).json({ error: 'Request already exists' });
        }
        else {
            const assets = await (0, requestModel_1.postRequest)(userId, assetId);
            res.status(200).json(assets.rows);
        }
    }
    catch (err) {
    }
};
exports.postRequest = postRequest;
const changeRequest = async (req, res) => {
    const { fromId, toId, userId } = req.body;
    try {
        const assets = await (0, requestModel_1.changeRequest)(fromId, toId, userId);
        res.status(200).json('Changed Successfully');
    }
    catch (err) {
        res.status(500).json('internal server error');
    }
};
exports.changeRequest = changeRequest;
const getRequestHistoryByUserId = async (req, res) => {
    const userId = parseInt(req.params.id, 10);
    if (!userId) {
        res.status(404).json({ error: 'Please enter User-id' });
        return;
    }
    try {
        const assets = await (0, requestModel_1.getRequestByUserId)(userId);
        res.status(200).json(assets.rows);
    }
    catch (err) {
        res.status(500).send('internal server error');
    }
};
exports.getRequestHistoryByUserId = getRequestHistoryByUserId;
const getAllRequestHistory = async (req, res) => {
    const type = req.query.type;
    try {
        const assets = await (0, requestModel_1.getAllRequest)(type);
        res.status(200).json(assets.rows);
    }
    catch (err) {
        res.status(500).send('internal server error');
    }
};
exports.getAllRequestHistory = getAllRequestHistory;
const approveRequest = async (req, res) => {
    const { userId, assetId } = req.body;
    try {
        const asset = await (0, assetModel_1.isAssetAvailable)(assetId);
        if (asset.rows[0].status === 'unassigned') {
            const assets = await (0, requestModel_1.approveRequest)(userId, assetId);
            res.status(200).json(assets.rows);
        }
        else {
            res.status(404).json({ error: 'Asset is already assigned' });
        }
    }
    catch (err) {
        res.status(500).send("internal server error");
    }
};
exports.approveRequest = approveRequest;
const rejectRequest = async (req, res) => {
    const { userId, assetId } = req.body;
    try {
        const assets = await (0, requestModel_1.rejectRequest)(userId, assetId);
        res.status(200).json(assets.rows);
    }
    catch (err) {
        res.status(500).send("internal server error");
    }
};
exports.rejectRequest = rejectRequest;
