import { API_ENDPOINTS } from "../util/apiEndpoints";

const CLOUDINARY_CLOUD_PRESET = "moneymanager";

const uploadProfileImage = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", CLOUDINARY_CLOUD_PRESET);

    try {
        const response = await fetch(API_ENDPOINTS.UPLOAD_IMAGE, {
            method: "POST",
            body: formData
        });

        // read response as text first
        const text = await response.text();
        const data = text ? JSON.parse(text) : {};

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Failed to upload image: ${data?.error?.message || response.statusText}`);
        }

        console.log("Image uploaded successfully:", data);
        return data.secure_url;
    } catch (error) {
        console.error("Error uploading image:", error);
        throw error;
    }
};

export default uploadProfileImage;
