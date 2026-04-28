import cloudinary from '../utils/cloudinary';

export const uploadImageToCloudinary = async (
  fileBuffer: Buffer,
  folder: string = 'thu_vien_nong_nghiep'
): Promise<{ url: string; public_id: string }> => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: folder,
        resource_type: 'auto'
      },
      (error, result) => {
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
      }
    );

    uploadStream.end(fileBuffer);
  });
};
