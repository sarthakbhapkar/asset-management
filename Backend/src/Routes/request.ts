import {Router} from 'express';
import authenticateJWT from "../Middlewares/verifyJWT";
import authorizeRole from "../Middlewares/authorizeRole";
import {
    postRequest, changeRequest, getRequestHistoryByUserId,
    getAllRequestHistory, approveRequest,rejectRequest,
} from '../Controllers/requestController'

const router = Router();

router.post('/', authenticateJWT, postRequest);
router.put('/', authenticateJWT, changeRequest);
router.get('/:id', authenticateJWT, getRequestHistoryByUserId);
router.get('/', authenticateJWT, authorizeRole(['admin']), getAllRequestHistory);
router.post('/approve', authenticateJWT, authorizeRole(['admin']), approveRequest);
router.put('/reject', authenticateJWT, authorizeRole(['admin']), rejectRequest);


export default router;