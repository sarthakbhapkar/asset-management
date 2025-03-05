"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.changeOwner = exports.getUnassignedAssets = exports.unAssignAsset = exports.assignAsset = exports.deleteAsset = exports.updateAsset = exports.postAsset = exports.getAssetsHistoryByUserId = exports.getAllAssets = void 0;
const assetModel_1 = require("../Models/assetModel");
const getAllAssets = async (req, res) => {
    try {
        const assets = await (0, assetModel_1.getAllAssets)();
        res.status(200).json(assets.rows);
    }
    catch (err) {
        res.status(500).json({ error: 'Failed to fetch users', details: err });
    }
};
exports.getAllAssets = getAllAssets;
const getAssetsHistoryByUserId = async (req, res) => {
    const id = parseInt(req.params.userId, 10);
    if (!id) {
        res.status(404).json({ error: 'Please enter user id' });
        return;
    }
    try {
        const asset = await (0, assetModel_1.getAssetByUserId)(id);
        if (asset.rows.length > 0) {
            res.status(200).json(asset.rows);
        }
        else {
            res.status(404).json({ error: 'Asset not found' });
        }
    }
    catch (err) {
        res.status(500).json({ error: 'Failed to fetch Asset', details: err });
    }
};
exports.getAssetsHistoryByUserId = getAssetsHistoryByUserId;
const postAsset = async (req, res) => {
    const { type, name } = req.body;
    if (!type || !name) {
        res.status(404).json({ error: 'Please fill all the fields' });
        return;
    }
    try {
        const assets = await (0, assetModel_1.postAsset)(type, name);
        if (assets.rows.length > 0) {
            res.status(200).json({ message: 'Asset added Successfully' });
        }
    }
    catch (err) {
        res.status(500).json({ error: 'Failed to Post Assets', details: err });
    }
};
exports.postAsset = postAsset;
const updateAsset = async (req, res) => {
    const name = req.body.newAssetName;
    const assetId = parseInt(req.params.id, 10);
    if (!name || !assetId) {
        res.status(404).json({ error: 'Please fill all the fields' });
        return;
    }
    try {
        await (0, assetModel_1.updateAsset)(name, assetId);
        res.status(200).json({ message: 'Asset updated Successfully' });
    }
    catch (err) {
        res.status(500).json({ error: 'Failed to fetch Assets', details: err });
    }
};
exports.updateAsset = updateAsset;
const deleteAsset = async (req, res) => {
    const assetId = parseInt(req.params.id, 10);
    if (!assetId) {
        res.status(404).json({ error: 'Please enter asset id' });
        return;
    }
    try {
        await (0, assetModel_1.deleteAsset)(assetId);
        res.status(200).json({ message: 'Asset deleted Successfully' });
    }
    catch (err) {
        res.status(500).json({ error: 'Failed to fetch assets', details: err });
    }
};
exports.deleteAsset = deleteAsset;
const assignAsset = async (req, res) => {
    const { userId, assetId } = req.body;
    if (!userId || !assetId) {
        res.status(404).json({ error: 'Please fill all the fields' });
        return;
    }
    const assets = await (0, assetModel_1.isAssetAvailable)(assetId);
    if (assets.rows[0].status === 'unassigned') {
        await (0, assetModel_1.assignAsset)(userId, assetId);
    }
    res.json({ message: 'Asset assigned Successfully' });
};
exports.assignAsset = assignAsset;
const unAssignAsset = async (req, res) => {
    const { userId, assetId } = req.body;
    if (!userId || !assetId) {
        res.status(404).json({ error: 'Please fill all the fields' });
        return;
    }
    const assets = await (0, assetModel_1.checkOwner)(userId, assetId);
    if (assets.rows[0].status === 'assigned') {
        await (0, assetModel_1.unAssignAsset)(userId, assetId);
        res.json({ message: 'Asset unassigned Successfully' });
    }
};
exports.unAssignAsset = unAssignAsset;
const getUnassignedAssets = async (req, res) => {
    const type = req.query.type;
    if (!type || (type !== 'hardware' && type !== 'software')) {
        res.status(400).json({ error: 'Please provide a valid asset type: "hardware" or "software"' });
        return;
    }
    try {
        const assets = await (0, assetModel_1.getUnassignedAssetsByType)(type);
        res.json(assets.rows);
    }
    catch (error) {
        console.error('Error retrieving unassigned assets:', error);
        res.status(500).json({ error: 'An error occurred while retrieving unassigned assets' });
    }
};
exports.getUnassignedAssets = getUnassignedAssets;
const changeOwner = async (req, res) => {
    const { fromEmp, toEmp, assetId } = req.body;
    if (!fromEmp || !assetId || !toEmp) {
        res.status(404).json({ error: 'Please fill all the fields' });
        return;
    }
    const assets = await (0, assetModel_1.checkOwner)(fromEmp, assetId);
    if (assets.rows.length > 0) {
        await (0, assetModel_1.changeOwner)(fromEmp, assetId, toEmp);
    }
    res.json({ message: 'Changed Ownership Successfully' });
};
exports.changeOwner = changeOwner;
