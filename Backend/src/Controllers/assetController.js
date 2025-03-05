"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.changeOwner = exports.getUnassignedAssets = exports.unAssignAsset = exports.assignAsset = exports.deleteAsset = exports.updateAsset = exports.postAsset = exports.getAssetsHistoryByUserId = exports.getAllAssets = void 0;
var assetModel_1 = require("../Models/assetModel");
var getAllAssets = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var assets, err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, (0, assetModel_1.getAllAssets)()];
            case 1:
                assets = _a.sent();
                res.status(200).json(assets.rows);
                return [3 /*break*/, 3];
            case 2:
                err_1 = _a.sent();
                res.status(500).json({ error: 'Failed to fetch users', details: err_1 });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getAllAssets = getAllAssets;
var getAssetsHistoryByUserId = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, asset, err_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                id = parseInt(req.params.userId, 10);
                if (!id) {
                    res.status(404).json({ error: 'Please enter user id' });
                    return [2 /*return*/];
                }
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, (0, assetModel_1.getAssetByUserId)(id)];
            case 2:
                asset = _a.sent();
                if (asset.rows.length > 0) {
                    res.status(200).json(asset.rows);
                }
                else {
                    res.status(404).json({ error: 'Asset not found' });
                }
                return [3 /*break*/, 4];
            case 3:
                err_2 = _a.sent();
                res.status(500).json({ error: 'Failed to fetch Asset', details: err_2 });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.getAssetsHistoryByUserId = getAssetsHistoryByUserId;
var postAsset = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, type, name, assets, err_3;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, type = _a.type, name = _a.name;
                if (!type || !name) {
                    res.status(404).json({ error: 'Please fill all the fields' });
                    return [2 /*return*/];
                }
                _b.label = 1;
            case 1:
                _b.trys.push([1, 3, , 4]);
                return [4 /*yield*/, (0, assetModel_1.postAsset)(type, name)];
            case 2:
                assets = _b.sent();
                if (assets.rows.length > 0) {
                    res.status(200).json({ message: 'Asset added Successfully' });
                }
                return [3 /*break*/, 4];
            case 3:
                err_3 = _b.sent();
                res.status(500).json({ error: 'Failed to Post Assets', details: err_3 });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.postAsset = postAsset;
var updateAsset = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var name, assetId, err_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                name = req.body.newAssetName;
                assetId = parseInt(req.params.id, 10);
                if (!name || !assetId) {
                    res.status(404).json({ error: 'Please fill all the fields' });
                    return [2 /*return*/];
                }
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, (0, assetModel_1.updateAsset)(name, assetId)];
            case 2:
                _a.sent();
                res.status(200).json({ message: 'Asset updated Successfully' });
                return [3 /*break*/, 4];
            case 3:
                err_4 = _a.sent();
                res.status(500).json({ error: 'Failed to fetch Assets', details: err_4 });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.updateAsset = updateAsset;
var deleteAsset = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var assetId, err_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                assetId = parseInt(req.params.id, 10);
                if (!assetId) {
                    res.status(404).json({ error: 'Please enter asset id' });
                    return [2 /*return*/];
                }
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, (0, assetModel_1.deleteAsset)(assetId)];
            case 2:
                _a.sent();
                res.status(200).json({ message: 'Asset deleted Successfully' });
                return [3 /*break*/, 4];
            case 3:
                err_5 = _a.sent();
                res.status(500).json({ error: 'Failed to fetch assets', details: err_5 });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.deleteAsset = deleteAsset;
var assignAsset = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, userId, assetId, assets;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, userId = _a.userId, assetId = _a.assetId;
                if (!userId || !assetId) {
                    res.status(404).json({ error: 'Please fill all the fields' });
                    return [2 /*return*/];
                }
                return [4 /*yield*/, (0, assetModel_1.isAssetAvailable)(assetId)];
            case 1:
                assets = _b.sent();
                if (!(assets.rows[0].status === 'unassigned')) return [3 /*break*/, 3];
                return [4 /*yield*/, (0, assetModel_1.assignAsset)(userId, assetId)];
            case 2:
                _b.sent();
                _b.label = 3;
            case 3:
                res.json({ message: 'Asset assigned Successfully' });
                return [2 /*return*/];
        }
    });
}); };
exports.assignAsset = assignAsset;
var unAssignAsset = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, userId, assetId, assets;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, userId = _a.userId, assetId = _a.assetId;
                if (!userId || !assetId) {
                    res.status(404).json({ error: 'Please fill all the fields' });
                    return [2 /*return*/];
                }
                return [4 /*yield*/, (0, assetModel_1.checkOwner)(userId, assetId)];
            case 1:
                assets = _b.sent();
                if (!(assets.rows[0].status === 'assigned')) return [3 /*break*/, 3];
                return [4 /*yield*/, (0, assetModel_1.unAssignAsset)(userId, assetId)];
            case 2:
                _b.sent();
                res.json({ message: 'Asset unassigned Successfully' });
                _b.label = 3;
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.unAssignAsset = unAssignAsset;
var getUnassignedAssets = function (req, res) {
    var type = req.query.type;
    if (!type || (type !== 'hardware' && type !== 'software')) {
        res.status(400).json({ error: 'Please provide a valid asset type: "hardware" or "software"' });
        return;
    }
    try {
        (0, assetModel_1.getUnassignedAssetsByType)(type)
            .then(function (data) { return console.log(data); });
        // res.json(assets.rows);
    }
    catch (error) {
        console.error('Error retrieving unassigned assets:', error);
        res.status(500).json({ error: 'An error occurred while retrieving unassigned assets' });
    }
};
exports.getUnassignedAssets = getUnassignedAssets;
var changeOwner = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, fromEmp, toEmp, assetId, assets;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, fromEmp = _a.fromEmp, toEmp = _a.toEmp, assetId = _a.assetId;
                if (!fromEmp || !assetId || !toEmp) {
                    res.status(404).json({ error: 'Please fill all the fields' });
                    return [2 /*return*/];
                }
                return [4 /*yield*/, (0, assetModel_1.checkOwner)(fromEmp, assetId)];
            case 1:
                assets = _b.sent();
                console.log(assets.rows);
                if (!(assets.rows.length > 0)) return [3 /*break*/, 3];
                return [4 /*yield*/, (0, assetModel_1.changeOwner)(fromEmp, assetId, toEmp)];
            case 2:
                _b.sent();
                _b.label = 3;
            case 3:
                res.json({ message: 'Changed Ownership Successfully' });
                return [2 /*return*/];
        }
    });
}); };
exports.changeOwner = changeOwner;
