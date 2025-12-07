import axios from "axios";

// Define the expected type for the image data being passed.
// Assuming 'imageData' can be a File object (from input type="file") or a Blob.
type ImageData = File | Blob;

// The core function to upload an image to Cloudinary.
export const uploadToCloudinary = async (imageData: ImageData): Promise<string | null> => {
  // Use Next.js environment variables (NEXT_PUBLIC_ prefix for client-side access)
  const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

  // Basic validation for environment variables
  if (!CLOUD_NAME || !UPLOAD_PRESET) {
    console.error("Cloudinary environment variables (CLOUD_NAME or UPLOAD_PRESET) are not set.");
    return null;
  }

  const formData = new FormData();
  formData.append("file", imageData);
  formData.append("upload_preset", UPLOAD_PRESET);
  
  // Note: Appending cloud_name is usually optional when it's in the URL, but kept for robustness.
  // formData.append("cloud_name", CLOUD_NAME); 

  try {
    const uploadUrl = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;
    
    // Make the POST request to the Cloudinary API
    const { data } = await axios.post(
      uploadUrl,
      formData,
      {
        headers: {
          // Setting the content type explicitly to undefined lets axios/browser set it correctly
          // including the boundary for FormData.
          'Content-Type': 'multipart/form-data', 
        },
      }
    );

    // Cloudinary returns the secure URL of the uploaded image
    return data.secure_url;
  } catch (error) {
    // Check if the error is an Axios error and log details
    if (axios.isAxiosError(error)) {
      console.error("Error uploading image to Cloudinary:", error.message);
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error("Cloudinary API Response Error:", error.response.data);
      }
    } else {
      console.error("Unknown error during Cloudinary upload:", error);
    }
    
    return null;
  }
};