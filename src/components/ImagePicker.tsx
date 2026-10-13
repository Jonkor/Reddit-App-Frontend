import { useEffect, useRef, useState, type ChangeEvent } from "react";
import { Label } from "flowbite-react";

const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const ALLOWED_EXTENSIONS = ["jpg", "jpeg", "png", "webp", "gif"];
const configuredMaxMb = Number(import.meta.env.VITE_MAX_IMAGE_UPLOAD_MB || 10);
export const MAX_IMAGE_UPLOAD_MB =
  Number.isFinite(configuredMaxMb) && configuredMaxMb > 0 ? configuredMaxMb : 10;
const MAX_IMAGE_BYTES = MAX_IMAGE_UPLOAD_MB * 1024 * 1024;

interface ImagePickerProps {
  file: File | null;
  onChange: (file: File | null) => void;
  currentImageUrl?: string | null;
  removeCurrentImage?: boolean;
  onRemoveCurrentImage?: (remove: boolean) => void;
  disabled?: boolean;
  uploadProgress?: number | null;
}

const ImagePicker = ({
  file,
  onChange,
  currentImageUrl,
  removeCurrentImage = false,
  onRemoveCurrentImage,
  disabled = false,
  uploadProgress,
}: ImagePickerProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!file) {
      setPreviewUrl(null);
      return;
    }
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [file]);

  const clearSelectedFile = () => {
    onChange(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0] ?? null;
    setError(null);
    if (!selectedFile) {
      onChange(null);
      return;
    }

    const extension = selectedFile.name.split(".").pop()?.toLowerCase() ?? "";
    if (
      !ALLOWED_IMAGE_TYPES.includes(selectedFile.type) ||
      !ALLOWED_EXTENSIONS.includes(extension)
    ) {
      setError("Choose a JPG, JPEG, PNG, WebP, or GIF image.");
      clearSelectedFile();
      return;
    }
    if (selectedFile.size > MAX_IMAGE_BYTES) {
      setError(`The image must be ${MAX_IMAGE_UPLOAD_MB} MB or smaller.`);
      clearSelectedFile();
      return;
    }

    onChange(selectedFile);
    onRemoveCurrentImage?.(false);
  };

  const displayedImage = previewUrl ?? (!removeCurrentImage ? currentImageUrl : null);

  return (
    <div>
      <div className="mb-2 block">
        <Label htmlFor="post-image" value="Image (optional)" />
      </div>
      <input
        ref={inputRef}
        id="post-image"
        type="file"
        accept={ALLOWED_IMAGE_TYPES.join(",")}
        onChange={handleChange}
        disabled={disabled}
        className="block w-full cursor-pointer rounded-lg border border-gray-300 bg-gray-50 text-sm text-gray-900 file:mr-4 file:border-0 file:bg-gray-100 file:px-4 file:py-2.5 file:text-sm file:font-medium dark:border-gray-600 dark:bg-gray-700 dark:text-gray-400 dark:file:bg-gray-600 dark:file:text-white"
      />
      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
        JPG, PNG, WebP, or GIF. Maximum {MAX_IMAGE_UPLOAD_MB} MB.
      </p>
      {error && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>}

      {displayedImage && (
        <img
          src={displayedImage}
          alt="Post image preview"
          className="mt-3 max-h-72 w-full rounded-lg bg-gray-100 object-contain dark:bg-gray-800"
        />
      )}

      <div className="mt-2 flex gap-4">
        {file && (
          <button
            type="button"
            onClick={clearSelectedFile}
            disabled={disabled}
            className="text-sm font-medium text-red-600 hover:underline disabled:opacity-50 dark:text-red-400"
          >
            Remove selected image
          </button>
        )}
        {!file && currentImageUrl && onRemoveCurrentImage && (
          <button
            type="button"
            onClick={() => onRemoveCurrentImage(!removeCurrentImage)}
            disabled={disabled}
            className="text-sm font-medium text-red-600 hover:underline disabled:opacity-50 dark:text-red-400"
          >
            {removeCurrentImage ? "Keep current image" : "Remove current image"}
          </button>
        )}
      </div>

      {uploadProgress !== null && uploadProgress !== undefined && (
        <div className="mt-3" aria-live="polite">
          <div className="mb-1 flex justify-between text-sm text-gray-600 dark:text-gray-300">
            <span>Uploading image</span>
            <span>{uploadProgress}%</span>
          </div>
          <div className="h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700">
            <div
              className="h-2 rounded-full bg-blue-600 transition-all"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ImagePicker;
