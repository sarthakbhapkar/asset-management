"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkUser = exports.forgotPassword = exports.getAllAssets = exports.getUserCurrentAssetsByType = exports.getCurrentAssets = exports.deleteUser = exports.postUser = exports.updateUser = exports.loginUser = exports.getUsers = void 0;
const pool_1 = __importDefault(require("../../db/pool"));
const getUsers = async (userId) => {
    if (userId) {
        const userById = await pool_1.default.query(`SELECT id as "userId",first_name ||' '||last_name as "fullName",role
                ,email FROM users WHERE id = $1`, [userId]);
        return userById;
    }
    const allUsers = await pool_1.default.query(`SELECT id as "userId",first_name ||' '||last_name as "fullName",  
                email,role FROM users where active='true' order by id DESC`);
    return allUsers;
};
exports.getUsers = getUsers;
const loginUser = async (email) => {
    return await pool_1.default.query(`SELECT id,first_name ||' '||last_name as "fullName"
            ,email,password,role,seat_n,active FROM users WHERE email = $1`, [email]);
};
exports.loginUser = loginUser;
const updateUser = async (firstName, lastName, email, id) => {
    return await pool_1.default.query(`UPDATE users SET first_name=$1,last_name=$2, email = $3 where id=$4`, [firstName, lastName, email, id]);
};
exports.updateUser = updateUser;
const postUser = async (firstName, lastName, email, password, seat_no) => {
    return await pool_1.default.query(`INSERT INTO users (first_name, last_name, email, password, seat_n) 
             VALUES ($1, $2, $3, $4, $5)`, [firstName, lastName, email, password, seat_no]);
};
exports.postUser = postUser;
const deleteUser = async (id) => {
    return await pool_1.default.query(`UPDATE users SET active=false where id=$1`, [id]);
};
exports.deleteUser = deleteUser;
const getCurrentAssets = async () => {
    return await pool_1.default.query(`SELECT
             users.first_name||' '||users.last_name AS "fullName",
             assets.name AS "assetName",
             to_char(asset_history.assigned_at,'DD/MM/YY') as "assignedAt"
         FROM
             asset_history
                 JOIN
             assets ON asset_history.asset_id = assets.id
                 JOIN
             users ON asset_history.user_id = users.id
         WHERE
             asset_history.unassigned_at IS NULL 
         ORDER BY
             asset_history.id DESC`);
};
exports.getCurrentAssets = getCurrentAssets;
const getUserCurrentAssetsByType = async (userId, type) => {
    let query;
    let params;
    if (type) {
        query = `
            SELECT 
                users.first_name||' '||users.last_name as "fullName",
                assets.name AS "assetName",
                assets.type AS "assetType",
                asset_history.user_id as "userId",
                asset_history.asset_id as "assetId",
                to_char(asset_history.assigned_at,'DD/MM/YY') as "assignedAt"
            FROM 
                asset_history
            JOIN 
                users ON asset_history.user_id = users.id
            JOIN 
                assets ON asset_history.asset_id = assets.id
            WHERE 
                asset_history.user_id = $1 
                AND assets.type = $2
                and asset_history.unassigned_at IS  NULL
            ORDER BY
                asset_history.id DESC
        `;
        params = [userId, type];
    }
    else {
        query = `
            SELECT 
                users.first_name||' '||users.last_name as "fullName",
                assets.name AS "assetName",
                to_char(asset_history.assigned_at,'DD/MM/YY') as "assignedAt"
            FROM 
                asset_history
            JOIN 
                users ON asset_history.user_id = users.id
            JOIN 
                assets ON asset_history.asset_id = assets.id
            WHERE 
                asset_history.user_id = $1 
                and asset_history.unassigned_at IS  NULL
            ORDER BY
                asset_history.id DESC
        `;
        params = [userId];
    }
    return await pool_1.default.query(query, params);
};
exports.getUserCurrentAssetsByType = getUserCurrentAssetsByType;
const getAllAssets = async () => {
    return await pool_1.default.query(`SELECT
             users.first_name||' '||users.last_name as "fullName",
             assets.name AS "assetName",
             to_char(asset_history.assigned_at,'DD/MM/YY') as "assignedAt",
             to_char(asset_history.unassigned_at,'DD/MM/YY') as "unassignedAt"
         FROM
             asset_history
                 JOIN
             assets ON asset_history.asset_id = assets.id
                 JOIN
             users ON asset_history.user_id = users.id
         where  asset_history.unassigned_at is not null    
         ORDER BY
             asset_history.id DESC;
        `);
};
exports.getAllAssets = getAllAssets;
const forgotPassword = async (email, password) => {
    return await pool_1.default.query(`update users set password=$1 where email=$2`, [password, email]);
};
exports.forgotPassword = forgotPassword;
const checkUser = async (email) => {
    return await pool_1.default.query(`select id,first_name,last_name,email,role,seat_n,active from users where email=$1`, [email]);
};
exports.checkUser = checkUser;
