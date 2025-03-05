import pool from '../../db/pool';

interface User {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    role: string;
    seat_n: number;
    active: boolean;
}

interface QueryResult {
    rows: User[];
}

export const getUsers = async (userId?: number): Promise<QueryResult> => {
    if (userId) {
        const userById = await pool.query(
            `SELECT id as "userId",first_name ||' '||last_name as "fullName",role
                ,email FROM users WHERE id = $1`,
            [userId]
        );
        return userById;
    }
    const allUsers = await pool.query(
        `SELECT id as "userId",first_name ||' '||last_name as "fullName",  
                email,role FROM users where active='true' order by id DESC`
    );
    return allUsers;
};

export const loginUser = async (email: string): Promise<QueryResult> => {
        return await pool.query(
            `SELECT id,first_name ||' '||last_name as "fullName"
            ,email,password,role,seat_n,active FROM users WHERE email = $1`,
            [email]);
}

export const updateUser = async (firstName: string, lastName: string, email: string, id: number): Promise<QueryResult> => {
    return await pool.query(
        `UPDATE users SET first_name=$1,last_name=$2, email = $3 where id=$4`,
        [firstName, lastName, email, id]);
}

export const postUser = async (firstName: string, lastName: string, email: string, password: string, seat_no: number|undefined): Promise<QueryResult> => {
        return await pool.query(
            `INSERT INTO users (first_name, last_name, email, password, seat_n) 
             VALUES ($1, $2, $3, $4, $5)`,
            [firstName, lastName, email, password, seat_no]
        );
}

export const deleteUser = async (id: number): Promise<QueryResult> => {
    return await pool.query(
        `UPDATE users SET active=false where id=$1`,
        [id]);
}

export const getCurrentAssets = async (): Promise<QueryResult> => {
    return await pool.query(
        `SELECT
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
             asset_history.id DESC`,
        );
}

export const getUserCurrentAssetsByType = async (userId: number, type?: string): Promise<QueryResult> => {
    let query: string;
    let params: (number | string)[];
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

    } else {
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

    return await pool.query(query, params);
};

export const getAllAssets = async (): Promise<QueryResult> => {
    return await pool.query(
        `SELECT
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
        `
    );
};

export const forgotPassword= async (email: string, password: string): Promise<QueryResult> => {
    return await pool.query(
        `update users set password=$1 where email=$2`,[password,email]
    );
}

export const checkUser= async (email: string): Promise<QueryResult> => {
    return await pool.query(
        `select id,first_name,last_name,email,role,seat_n,active from users where email=$1`,[email]
    );
}

