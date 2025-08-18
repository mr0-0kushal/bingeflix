import { cloudinary } from "./cloudinary.config.js";

const uploadOnCloudinary = async (fileBuffer) => {
    return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { resource_type: "auto" },
      (error, result) => {
        if (error) {
          console.error("Cloudinary Upload Error:", error);
          reject(error);
        } else {
          resolve(result);
        }
      }
    );
    stream.end(fileBuffer);
  });
}



export { uploadOnCloudinary }