"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkOwner = exports.isAssetAvailable = exports.changeOwner = exports.getUnassignedAssetsByType = exports.unAssignAsset = exports.assignAsset = exports.deleteAsset = exports.updateAsset = exports.postAsset = exports.getAssetByUserId = exports.getAllAssets = void 0;
const pool_1 = __importDefault(require("../../db/pool"));
const getAllAssets = async () => {
    return await pool_1.default.query(`SELECT id as "assetId",name,type,status,to_char(assets.created_at,'DD/MM/YY') as "createdAt" FROM assets ORDER BY id DESC`);
};
exports.getAllAssets = getAllAssets;
const getAssetByUserId = async (userId) => {
    return await pool_1.default.query(`SELECT 
            users.id as "userId",
            users.first_name||' '||users.last_name as "fullName",
            assets.name as "assetName",
            to_char(asset_history.assigned_at,'DD/MM/YY') as "assignedAt",
            to_char(asset_history.unassigned_at,'DD/MM/YY') as "unassignedAt"
         FROM 
            asset_history
         JOIN 
            users ON asset_history.user_id = users.id
         JOIN 
            assets ON asset_history.asset_id = assets.id
         WHERE 
            asset_history.user_id = $1 and asset_history.unassigned_at is not null
         ORDER BY 
             asset_history.id DESC`, [userId]);
};
exports.getAssetByUserId = getAssetByUserId;
const postAsset = async (type, name) => {
    return await pool_1.default.query(`INSERT INTO assets (type, name) 
             VALUES ($1, $2)`, [type, name]);
};
exports.postAsset = postAsset;
const updateAsset = async (name, id) => {
    return await pool_1.default.query(`UPDATE assets SET name=$1 where id=$2`, [name, id]);
};
exports.updateAsset = updateAsset;
const deleteAsset = async (id) => {
    return await pool_1.default.query(`DELETE from assets WHERE id = $1`, [id]);
};
exports.deleteAsset = deleteAsset;
const assignAsset = async (user_id, asset_id) => {
    await pool_1.default.query(`INSERT INTO asset_history (user_id, asset_id) VALUES ($1, $2)`, [user_id, asset_id]);
    return await pool_1.default.query(`UPDATE assets SET status = 'assigned' WHERE id = $1`, [asset_id]);
};
exports.assignAsset = assignAsset;
const unAssignAsset = async (user_id, asset_id) => {
    await pool_1.default.query(`UPDATE asset_history set unassigned_at=now() where user_id=$1 and asset_id=$2 
                      and unassigned_at is null`, [user_id, asset_id]);
    return await pool_1.default.query(`UPDATE assets set status='unassigned' where id=$1`, [asset_id]);
};
exports.unAssignAsset = unAssignAsset;
const getUnassignedAssetsByType = async (type) => {
    return await pool_1.default.query(`SELECT 
            assets.id AS "assetId",
            assets.name AS "assetName",
            assets.type AS "assetType",
            assets.status,
            assets.created_at as "createdAt"
         FROM 
            assets
         WHERE 
            assets.status = 'unassigned' AND assets.type = $1
         ORDER BY 
             assets.id DESC`, [type]);
};
exports.getUnassignedAssetsByType = getUnassignedAssetsByType;
const changeOwner = async (from_emp, asset_id, to_emp) => {
    return await pool_1.default.query(`UPDATE asset_history set user_id=$1,assigned_at=now() 
                              where user_id=$2 and asset_id=$3 and unassigned_at is null `, [to_emp, from_emp, asset_id]);
};
exports.changeOwner = changeOwner;
// Validation Queries
const isAssetAvailable = async (asset_id) => {
    return await pool_1.default.query(`select * from assets where id=$1`, [asset_id]);
};
exports.isAssetAvailable = isAssetAvailable;
const checkOwner = async (from_emp, asset_id) => {
    return await pool_1.default.query(`SELECT asset_history.asset_id,asset_history.user_id, assets.status FROM asset_history 
                    join assets on assets.id=asset_history.asset_id WHERE asset_history.user_id = $1 
            AND asset_history.asset_id = $2 AND asset_history.unassigned_at IS NULL 
        `, [from_emp, asset_id]);
};
exports.checkOwner = checkOwner;
