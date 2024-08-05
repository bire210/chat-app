import axios from "axios";

const uploadImageToCloudinary = async (file) => {
    const data = new FormData();
    console.log("file",file)
    data.append("file", file);
    data.append("upload_preset", "chatapp");
    data.append("cloud_name", "dmewoii2k"); 
    try {
      const response = await axios.post(
        "https://api.cloudinary.com/v1_1/dmewoii2k/image/upload",
        
        data,
        
      );
      console.log("file uploading",response)
      return response.data.secure_url;
    } catch (error) {
      console.error("eror while uploading image",error)
      return error;
    }
  };

  export {uploadImageToCloudinary}
