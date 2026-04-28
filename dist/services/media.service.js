"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadImageToCloudinary = void 0;
const cloudinary_1 = __importDefault(require("../utils/cloudinary"));
const uploadImageToCloudinary = async (fileBuffer, folder = 'thu_vien_nong_nghiep') => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary_1.default.uploader.upload_stream({
            folder: folder,
            resource_type: 'auto'
        }, (error, result) => {
            if (error) {
                return reject(new Error(`Cloudinary upload failed: ${error.message}`));
            }
            if (result) {
                return resolve({
                    url: result.secure_url,
                    public_id: result.public_id
                });
            }
            reject(new Error('Cloudinary upload result is undefined'));
        });
        uploadStream.end(fileBuffer);
    });
};
exports.uploadImageToCloudinary = uploadImageToCloudinary;
