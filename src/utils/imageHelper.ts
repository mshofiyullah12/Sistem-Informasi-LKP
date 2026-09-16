/**
 * Compresses and resizes an uploaded image file into a lightweight base64 Data URL
 * suitable for fast rendering on ID cards, local storage, and Firestore syncing.
 */
export async function compressAndResizeImage(
  file: File,
  maxWidth = 480,
  maxHeight = 600,
  quality = 0.85
): Promise<string> {
  return new Promise((resolve, reject) => {
    // Validate file type
    if (!file.type.startsWith("image/")) {
      reject(new Error("Berkas yang dipilih bukan gambar yang valid (PNG/JPG/WEBP)."));
      return;
    }

    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Gagal membaca file gambar."));
    reader.onload = (e) => {
      const img = new Image();
      img.onerror = () => reject(new Error("Format gambar rusak atau tidak didukung."));
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        // Calculate new dimensions preserving aspect ratio
        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width = Math.round(width * ratio);
          height = Math.round(height * ratio);
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");

        if (!ctx) {
          reject(new Error("Gagal menginisialisasi canvas untuk kompresi gambar."));
          return;
        }

        // Smooth rendering
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";

        // Draw image
        ctx.drawImage(img, 0, 0, width, height);

        // Export as JPEG Data URL for optimal compression (small payload)
        const compressedDataUrl = canvas.toDataURL("image/jpeg", quality);
        resolve(compressedDataUrl);
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  });
}
