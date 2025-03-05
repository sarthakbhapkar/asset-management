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
exports.checkOwner = exports.isAssetAvailable = exports.changeOwner = exports.getUnassignedAssetsByType = exports.unAssignAsset = exports.assignAsset = exports.deleteAsset = exports.updateAsset = exports.postAsset = exports.getAssetByUserId = exports.getAllAssets = void 0;
var pool_1 = require("../../db/pool");
var getAllAssets = function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, pool_1["default"].query("SELECT id as \"assetId\",name,type,status,to_char(assets.created_at,'DD/MM/YY') as \"createdAt\" FROM assets ORDER BY id DESC")];
            case 1: return [2 /*return*/, _a.sent()];
        }
    });
}); };
exports.getAllAssets = getAllAssets;
var getAssetByUserId = function (userId) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, pool_1["default"].query("SELECT \n            users.id as \"userId\",\n            users.first_name||' '||users.last_name as \"fullName\",\n            assets.name as \"assetName\",\n            to_char(asset_history.assigned_at,'DD/MM/YY') as \"assignedAt\",\n            to_char(asset_history.unassigned_at,'DD/MM/YY') as \"unassignedAt\"\n         FROM \n            asset_history\n         JOIN \n            users ON asset_history.user_id = users.id\n         JOIN \n            assets ON asset_history.asset_id = assets.id\n         WHERE \n            asset_history.user_id = $1 and asset_history.unassigned_at is not null\n         ORDER BY \n             asset_history.id DESC", [userId])];
            case 1: return [2 /*return*/, _a.sent()];
        }
    });
}); };
exports.getAssetByUserId = getAssetByUserId;
var postAsset = function (type, name) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, pool_1["default"].query("INSERT INTO assets (type, name) \n             VALUES ($1, $2)", [type, name])];
            case 1: return [2 /*return*/, _a.sent()];
        }
    });
}); };
exports.postAsset = postAsset;
var updateAsset = function (name, id) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, pool_1["default"].query("UPDATE assets SET name=$1 where id=$2", [name, id])];
            case 1: return [2 /*return*/, _a.sent()];
        }
    });
}); };
exports.updateAsset = updateAsset;
var deleteAsset = function (id) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, pool_1["default"].query("DELETE from assets WHERE id = $1", [id])];
            case 1: return [2 /*return*/, _a.sent()];
        }
    });
}); };
exports.deleteAsset = deleteAsset;
var assignAsset = function (user_id, asset_id) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, pool_1["default"].query("INSERT INTO asset_history (user_id, asset_id) VALUES ($1, $2)", [user_id, asset_id])];
            case 1:
                _a.sent();
                return [4 /*yield*/, pool_1["default"].query("UPDATE assets SET status = 'assigned' WHERE id = $1", [asset_id])];
            case 2: return [2 /*return*/, _a.sent()];
        }
    });
}); };
exports.assignAsset = assignAsset;
var unAssignAsset = function (user_id, asset_id) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, pool_1["default"].query("UPDATE asset_history set unassigned_at=now() where user_id=$1 and asset_id=$2 \n                      and unassigned_at is null", [user_id, asset_id])];
            case 1:
                _a.sent();
                return [4 /*yield*/, pool_1["default"].query("UPDATE assets set status='unassigned' where id=$1", [asset_id])];
            case 2: return [2 /*return*/, _a.sent()];
        }
    });
}); };
exports.unAssignAsset = unAssignAsset;
var getUnassignedAssetsByType = function (type) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, pool_1["default"].query("SELECT \n            assets.id AS \"assetId\",\n            assets.name AS \"assetName\",\n            assets.type AS \"assetType\",\n            assets.status,\n            assets.created_at as \"createdAt\"\n         FROM \n            assets\n         WHERE \n            assets.status = 'unassigned' AND assets.type = $1\n         ORDER BY \n             assets.id DESC", [type])];
            case 1: return [2 /*return*/, _a.sent()];
        }
    });
}); };
exports.getUnassignedAssetsByType = getUnassignedAssetsByType;
var changeOwner = function (from_emp, asset_id, to_emp) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, pool_1["default"].query("UPDATE asset_history set user_id=$1,assigned_at=now() \n                              where user_id=$2 and asset_id=$3 and unassigned_at is null ", [to_emp, from_emp, asset_id])];
            case 1: return [2 /*return*/, _a.sent()];
        }
    });
}); };
exports.changeOwner = changeOwner;
// Validation Queries
var isAssetAvailable = function (asset_id) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, pool_1["default"].query("select * from assets where id=$1", [asset_id])];
            case 1: return [2 /*return*/, _a.sent()];
        }
    });
}); };
exports.isAssetAvailable = isAssetAvailable;
var checkOwner = function (from_emp, asset_id) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, pool_1["default"].query("SELECT asset_history.asset_id,asset_history.user_id, assets.status FROM asset_history \n                    join assets on assets.id=asset_history.asset_id WHERE asset_history.user_id = $1 \n            AND asset_history.asset_id = $2 AND asset_history.unassigned_at IS NULL \n        ", [from_emp, asset_id])];
            case 1: return [2 /*return*/, _a.sent()];
        }
    });
}); };
exports.checkOwner = checkOwner;
