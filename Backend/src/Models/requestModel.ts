import pool from '../../db/pool';
import {assignAsset} from "./assetModel";

interface Asset {
    userId?: number;
    assetId?: string;
    status?: string;
}

interface QueryResult {
    rows: Asset[];
}

export const postRequest = async (userId: number, assetId: number): Promise<QueryResult> => {
    return await pool.query(
        `INSERT INTO employee_request(user_id,asset_id) VALUES ($1, $2)`,
        [userId, assetId]
    );
}

export const changeRequest = async (fromId: number, toId: number, userId: number): Promise<QueryResult> => {
    return await pool.query(
        `UPDATE employee_request
         set asset_id=$1 where asset_id=$2 and user_id=$3 and status='pending'`,[toId, fromId, userId]);
}

export const getRequestByUserId = async (userId: number): Promise<QueryResult> => {
    return await pool.query(`
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
}

export const getAllRequest = async (type?: string): Promise<QueryResult> => {
    if (type) {
        return await pool.query(`
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
    return await pool.query(`
    SELECT
        users.first_name||' '||users.last_name as "fullName",
        assets.name AS "assetName",
        employee_request.status as "status"
    FROM employee_request
    JOIN assets ON employee_request.asset_id = assets.id
    JOIN users ON employee_request.user_id = users.id
    WHERE employee_request.status !='pending'`);
}

export const approveRequest = async (userId: number, assetId: number): Promise<QueryResult> => {
    await assignAsset(userId, assetId);
    return await pool.query(`
        UPDATE  employee_request set status='accepted'
        where user_id=$1 and asset_id=$2 and status='pending'`, [userId, assetId]
    );
}

export const rejectRequest = async (userId: number, assetId: number): Promise<QueryResult> => {
    return await pool.query(`
        UPDATE employee_request
         set status='rejected'
         where user_id=$1 and asset_id=$2 and status='pending'`, [userId, assetId]);
}

export const checkRequestStatus = async (userId: number, assetId: number): Promise<QueryResult> => {
    return await pool.query(`SELECT status FROM employee_request
                             WHERE user_id = $1 AND asset_id = $2
                             ORDER BY id DESC
                             LIMIT 1;
        `,[userId, assetId]
    );
}