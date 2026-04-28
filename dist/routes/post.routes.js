"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const postController = __importStar(require("../controllers/post.controller"));
const interactionController = __importStar(require("../controllers/interaction.controller"));
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
// Post CRUD
router.get('/', postController.getPosts);
router.get('/search', postController.searchPosts);
router.get('/:slug', postController.getPostBySlug);
router.post('/', auth_middleware_1.protect, postController.createPost);
router.put('/:id', auth_middleware_1.protect, postController.updatePost);
router.delete('/:id', auth_middleware_1.protect, postController.deletePost);
// Interaction Routes
router.post('/:id/comments', auth_middleware_1.protect, interactionController.createComment);
router.get('/:id/comments', interactionController.getComments);
router.post('/:id/like', auth_middleware_1.protect, interactionController.likePost);
router.delete('/:id/like', auth_middleware_1.protect, interactionController.unlikePost);
router.post('/:id/save', auth_middleware_1.protect, interactionController.savePost);
router.delete('/:id/save', auth_middleware_1.protect, interactionController.unsavePost);
exports.default = router;
