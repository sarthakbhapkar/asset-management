"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkRequestStatus = exports.rejectRequest = exports.approveRequest = exports.getAllRequest = exports.getRequestByUserId = exports.changeRequest = exports.postRequest = void 0;
const pool_1 = __importDefault(require("../../db/pool"));
const assetModel_1 = require("./assetModel");
const postRequest = async (userId, assetId) => {
    return await pool_1.default.query(`INSERT INTO employee_request(user_id,asset_id) VALUES ($1, $2)`, [userId, assetId]);
};
exports.postRequest = postRequest;
const changeRequest = async (fromId, toId, userId) => {
    return await pool_1.default.query(`UPDATE employee_request
         set asset_id=$1 where asset_id=$2 and user_id=$3 and status='pending'`, [toId, fromId, userId]);
};
exports.changeRequest = changeRequest;
const getRequestByUserId = async (userId) => {
    return await pool_1.default.query(`
    SELECT
        users.first_name||' '||users.last_name as "fullName",
        assets.name AS "assetName",
        employee_request.status as "status",
        users.id as "userId",
        assets.id as "assetId",
        assets.type as "assetType"
    FROM employee_request
    JOIN assets ON employee_request.asset_id = assets.id
    JOIN users ON employee_request.user_id = users.id
    WHERE employee_request.user_id =$1
    ORDER BY employee_request.id DESC`, [userId]);
};
exports.getRequestByUserId = getRequestByUserId;
const getAllRequest = async (type) => {
    if (type) {
        return await pool_1.default.query(`
           SELECT
                users.first_name||' '||users.last_name as "fullName",
                assets.name AS "assetName",
                employee_request.status as "requestStatus",
                employee_request.user_id as "userId",
                employee_request.asset_id as "assetId"
                
           FROM employee_request
                JOIN assets ON employee_request.asset_id = assets.id
                JOIN users ON employee_request.user_id = users.id
           WHERE employee_request.status ='pending'
           ORDER BY employee_request.id DESC`);
    }
    return await pool_1.default.query(`
    SELECT
        users.first_name||' '||users.last_name as "fullName",
        assets.name AS "assetName",
        employee_request.status as "status"
    FROM employee_request
    JOIN assets ON employee_request.asset_id = assets.id
    JOIN users ON employee_request.user_id = users.id
    WHERE employee_request.status !='pending'`);
};
exports.getAllRequest = getAllRequest;
const approveRequest = async (userId, assetId) => {
    await (0, assetModel_1.assignAsset)(userId, assetId);
    return await pool_1.default.query(`
        UPDATE  employee_request set status='accepted'
        where user_id=$1 and asset_id=$2 and status='pending'`, [userId, assetId]);
};
exports.approveRequest = approveRequest;
const rejectRequest = async (userId, assetId) => {
    return await pool_1.default.query(`
        UPDATE employee_request
         set status='rejected'
         where user_id=$1 and asset_id=$2 and status='pending'`, [userId, assetId]);
};
exports.rejectRequest = rejectRequest;
const checkRequestStatus = async (userId, assetId) => {
    return await pool_1.default.query(`SELECT status FROM employee_request
                             WHERE user_id = $1 AND asset_id = $2
                             ORDER BY id DESC
                             LIMIT 1;
        `, [userId, assetId]);
};
exports.checkRequestStatus = checkRequestStatus;
