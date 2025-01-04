import axios from "axios";

const uploadImageToCloudinary = async (file) => {
  const data = new FormData();
  data.append("file", file);
  data.append("upload_preset", "chatapp");
  data.append("cloud_name", "dmewoii2k");
  try {
    const response = await axios.post(
      "https://api.cloudinary.com/v1_1/dmewoii2k/image/upload",

      data
    );

    return response.data.secure_url;
  } catch (error) {
    return error;
  }
};

export { uploadImageToCloudinary };
