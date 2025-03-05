import pool from '../../db/pool';

interface Asset {
    id: number;
    type: string;
    name: string;
    createdAt: string;
    status: string;
}

interface QueryResult {
    rows: Asset[];
}

export const getAllAssets = async (): Promise<QueryResult> => {
    return await pool.query(
        `SELECT id as "assetId",name,type,status,to_char(assets.created_at,'DD/MM/YY') as "createdAt" FROM assets ORDER BY id DESC`
    );
};

export const getAssetByUserId = async (userId: number): Promise<QueryResult> => {
    return await pool.query(
        `SELECT 
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
             asset_history.id DESC`,
        [userId]
    );
};

export const postAsset = async (type: string, name: string): Promise<QueryResult> => {
    return await pool.query(
        `INSERT INTO assets (type, name) 
             VALUES ($1, $2)`,
        [type, name]
    );
}

export const updateAsset = async (name: string, id: number): Promise<QueryResult> => {
    return await pool.query(
        `UPDATE assets SET name=$1 where id=$2`,
        [name, id]);
}

export const deleteAsset = async (id: number): Promise<QueryResult> => {
    return await pool.query(
        `DELETE from assets WHERE id = $1`,
        [id]);
}

export const assignAsset = async (user_id: number, asset_id: number): Promise<QueryResult> => {
    await pool.query(
        `INSERT INTO asset_history (user_id, asset_id) VALUES ($1, $2)`,
        [user_id, asset_id]
    );
    return await pool.query(
        `UPDATE assets SET status = 'assigned' WHERE id = $1`,
        [asset_id]
    );
};

export const unAssignAsset = async (user_id: number, asset_id: number): Promise<QueryResult> => {
    await pool.query(`UPDATE asset_history set unassigned_at=now() where user_id=$1 and asset_id=$2 
                      and unassigned_at is null`, [user_id, asset_id]
    );
    return await pool.query(
        `UPDATE assets set status='unassigned' where id=$1`,
        [asset_id]
    );
}

export const getUnassignedAssetsByType = async (type: string): Promise<QueryResult> => {
    return await pool.query(
        `SELECT 
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
             assets.id DESC`,[type]);
};

export const changeOwner = async (from_emp: number, asset_id: number,to_emp:number): Promise<QueryResult> => {
   return  await  pool.query(`UPDATE asset_history set user_id=$1,assigned_at=now() 
                              where user_id=$2 and asset_id=$3 and unassigned_at is null `, [to_emp,from_emp,asset_id])

}

// Validation Queries
export const isAssetAvailable= async (asset_id: number): Promise<QueryResult> => {
    return await pool.query(
        `select * from assets where id=$1`,[asset_id]
    );
}

export const checkOwner = async (from_emp: number, asset_id: number): Promise<QueryResult> => {
    return await pool.query(
        `SELECT asset_history.asset_id,asset_history.user_id, assets.status FROM asset_history 
                    join assets on assets.id=asset_history.asset_id WHERE asset_history.user_id = $1 
            AND asset_history.asset_id = $2 AND asset_history.unassigned_at IS NULL 
        `,
        [from_emp, asset_id]
    );
}
