export interface ProcessedImage {
  base64Data: string; // raw base64 data without data:image/jpeg;base64, prefix
  mimeType: string;
  dataUrl: string;
  originalSize: number;
  compressedSize: number;
  width: number;
  height: number;
}

const MAX_IMAGE_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB
const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_DIMENSION_PX = 1600;
const COMPRESSION_QUALITY = 0.8;

/**
 * Validates file size and type, then downscales image in the browser canvas
 * so that the longest edge is <= 1600px and returns compressed JPEG base64.
 */
export async function downscaleImage(file: File): Promise<ProcessedImage> {
  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    throw new Error(
      `Unsupported file type "${file.type}". Allowed formats: JPEG, PNG, WebP.`
    );
  }

  if (file.size > MAX_IMAGE_FILE_SIZE_BYTES) {
    throw new Error(
      `File size (${(file.size / (1024 * 1024)).toFixed(1)} MB) exceeds the maximum allowed 10 MB.`
    );
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onerror = () => {
      reject(new Error("Failed to read image file."));
    };

    reader.onload = () => {
      const img = new Image();

      img.onerror = () => {
        reject(new Error("Failed to load image for downscaling."));
      };

      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > MAX_DIMENSION_PX || height > MAX_DIMENSION_PX) {
          if (width > height) {
            height = Math.round((height * MAX_DIMENSION_PX) / width);
            width = MAX_DIMENSION_PX;
          } else {
            width = Math.round((width * MAX_DIMENSION_PX) / height);
            height = MAX_DIMENSION_PX;
          }
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Unable to create canvas rendering context."));
          return;
        }

        // Draw white background for transparent PNGs converted to JPEG
        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);

        const dataUrl = canvas.toDataURL("image/jpeg", COMPRESSION_QUALITY);
        const base64Data = dataUrl.split(",")[1];
        const compressedSize = Math.round((base64Data.length * 3) / 4);

        resolve({
          base64Data,
          mimeType: "image/jpeg",
          dataUrl,
          originalSize: file.size,
          compressedSize,
          width,
          height,
        });
      };

      img.src = reader.result as string;
    };

    reader.readAsDataURL(file);
  });
}
