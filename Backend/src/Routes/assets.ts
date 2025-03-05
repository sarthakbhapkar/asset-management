import { Router } from 'express';
import { getAllAssets, getAssetsHistoryByUserId, postAsset, updateAsset, deleteAsset, assignAsset, unAssignAsset, getUnassignedAssets,changeOwner} from '../Controllers/assetController';
import authenticateJWT from "../Middlewares/verifyJWT";
import authorizeRole from "../Middlewares/authorizeRole";

const router = Router();

router.get('/',authenticateJWT, authorizeRole(['admin']), getAllAssets);
router.get('/unassigned',authenticateJWT, getUnassignedAssets);
router.get('/:userId',authenticateJWT,getAssetsHistoryByUserId);
router.post('/',authenticateJWT, authorizeRole(['admin']), postAsset);
router.put('/:id',authenticateJWT, authorizeRole(['admin']),deleteAsset);
router.post('/assign-assets',authenticateJWT, authorizeRole(['admin']), assignAsset);
router.post('/unassign-assets',authenticateJWT, authorizeRole(['admin']), unAssignAsset);
router.put('/change-asset-owner',authenticateJWT, authorizeRole(['admin']), changeOwner);
router.put('/update/:id',authenticateJWT, authorizeRole(['admin']),updateAsset);


export default router;