import {Router} from 'express';
import authenticateJWT from '../Middlewares/verifyJWT';
import authorizeRole from '../Middlewares/authorizeRole';
import {
    getAllUsers, getUserById, postUser, updateUser, deleteUser,
    getUserCurrentAssets, getAllUsersAssetHistory, getAllUsersCurrentAssets, forgotPassword, sendMail,verifyOtp
} from '../Controllers/userController';

const router= Router();

router.get('/', authenticateJWT, authorizeRole(['admin']), getAllUsers);
router.get('/current-assets', authenticateJWT, authorizeRole(['admin']), getAllUsersCurrentAssets);
router.get('/assets-history', authenticateJWT, authorizeRole(['admin']), getAllUsersAssetHistory);
router.get('/assets',authenticateJWT,getUserCurrentAssets);
router.put('/delete', authenticateJWT, authorizeRole(['admin']), deleteUser);
router.get('/:id',authenticateJWT,getUserById);
router.post('/', authenticateJWT, authorizeRole(['admin']), postUser);
router.put('/:id',authenticateJWT,updateUser);
router.post('/update-password', forgotPassword);
router.post('/send-mail',sendMail);
router.post('/verify-otp',verifyOtp);

export default router;
