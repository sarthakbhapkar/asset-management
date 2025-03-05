"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const verifyJWT_1 = __importDefault(require("../Middlewares/verifyJWT"));
const authorizeRole_1 = __importDefault(require("../Middlewares/authorizeRole"));
const requestController_1 = require("../Controllers/requestController");
const router = (0, express_1.Router)();
router.post('/', verifyJWT_1.default, requestController_1.postRequest);
router.put('/', verifyJWT_1.default, requestController_1.changeRequest);
router.get('/:id', verifyJWT_1.default, requestController_1.getRequestHistoryByUserId);
router.get('/', verifyJWT_1.default, (0, authorizeRole_1.default)(['admin']), requestController_1.getAllRequestHistory);
router.post('/approve', verifyJWT_1.default, (0, authorizeRole_1.default)(['admin']), requestController_1.approveRequest);
router.put('/reject', verifyJWT_1.default, (0, authorizeRole_1.default)(['admin']), requestController_1.rejectRequest);
exports.default = router;
