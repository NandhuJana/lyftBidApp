import { useState } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, Eye, Camera, Image as ImageIcon } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { toast } from "sonner";

export function CreateProduct() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
  });
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [cameraPermissionGranted, setCameraPermissionGranted] = useState<boolean | null>(null);

  // Check and request camera permission
  const checkCameraPermission = async () => {
    try {
      // Check if the Permissions API is available
      if ('permissions' in navigator) {
        const result = await navigator.permissions.query({ name: 'camera' as PermissionName });
        setCameraPermissionGranted(result.state === 'granted');

        result.addEventListener('change', () => {
          setCameraPermissionGranted(result.state === 'granted');
        });

        return result.state === 'granted';
      }
      // Fallback for browsers that don't support Permissions API
      return true;
    } catch (error) {
      console.log('Camera permission check not supported, will prompt on use');
      return true;
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) {
      return;
    }

    const fileArray = Array.from(files);

    // Validate file size (10MB max)
    const invalidFiles = fileArray.filter(file => file.size > 10 * 1024 * 1024);
    if (invalidFiles.length > 0) {
      toast.error(`Some files exceed 10MB limit and were skipped`);
    }

    const validFiles = fileArray.filter(file => file.size <= 10 * 1024 * 1024);
    const newPreviews: string[] = [];

    validFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        newPreviews.push(reader.result as string);
        if (newPreviews.length === validFiles.length) {
          setImagePreviews((prev) => [...prev, ...newPreviews]);
          toast.success(`${validFiles.length} image${validFiles.length > 1 ? 's' : ''} added`);
        }
      };
      reader.onerror = () => {
        toast.error('Failed to read image file');
      };
      reader.readAsDataURL(file);
    });
  };

  const handleCameraCapture = async () => {
    // Request permission first
    const hasPermission = await checkCameraPermission();

    if (!hasPermission && cameraPermissionGranted === false) {
      toast.error('Camera permission denied. Please enable it in your device settings.');
      return;
    }

    // Trigger the camera input
    const cameraInput = document.getElementById('camera-input') as HTMLInputElement;
    if (cameraInput) {
      cameraInput.click();
    }
  };

  const handleGallerySelect = () => {
    const galleryInput = document.getElementById('gallery-input') as HTMLInputElement;
    if (galleryInput) {
      galleryInput.click();
    }
  };

  const removeImage = (index: number) => {
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
    toast.success('Image removed');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (imagePreviews.length === 0) {
      toast.error('Please add at least one product image');
      return;
    }

    // Store data in sessionStorage to pass to preview page
    sessionStorage.setItem(
      "productPreview",
      JSON.stringify({
        title: formData.title,
        description: formData.description,
        images: imagePreviews,
      })
    );
    navigate("/preview/new");
  };

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center gap-3 mb-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/seller")}
            className="rounded-full"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl">Create New Listing</h1>
        </div>
        <p className="text-sm text-gray-600 ml-12">Add product details</p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-6 py-6">
        <div className="space-y-6">
          {/* Product Name */}
          <div className="space-y-2">
            <Label htmlFor="title">Product Name</Label>
            <Input
              id="title"
              placeholder="Enter product name"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              required
              className="text-base"
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Describe your product in detail..."
              rows={6}
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              required
              className="text-base resize-none"
            />
            <p className="text-xs text-gray-500">
              Include key details like condition, features, and specifications
            </p>
          </div>

          {/* Product Images */}
          <div className="space-y-3">
            <Label>Product Images</Label>

            {/* Image Previews */}
            {imagePreviews.length > 0 && (
              <div className="grid grid-cols-2 gap-3 mb-3">
                {imagePreviews.map((preview, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={preview}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg border-2 border-gray-200"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute top-2 right-2 h-7 w-7 p-0 rounded-full opacity-90 group-hover:opacity-100 transition-opacity"
                      onClick={() => removeImage(index)}
                    >
                      ×
                    </Button>
                    <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                      {index + 1} of {imagePreviews.length}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Camera and Gallery Buttons */}
            <div className="grid grid-cols-2 gap-3">
              {/* Camera Button */}
              <div className="relative">
                <input
                  id="camera-input"
                  type="file"
                  accept="image/*"
                  capture="environment"
                  className="hidden"
                  onChange={handleImageUpload}
                />
                <Button
                  type="button"
                  variant="outline"
                  className="w-full h-32 border-2 border-dashed hover:border-gray-400 hover:bg-gray-50"
                  onClick={handleCameraCapture}
                >
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <Camera className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="text-sm font-medium text-gray-700">
                      Take Photo
                    </div>
                    <div className="text-xs text-gray-500">
                      Use Camera
                    </div>
                  </div>
                </Button>
              </div>

              {/* Gallery Button */}
              <div className="relative">
                <input
                  id="gallery-input"
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={handleImageUpload}
                />
                <Button
                  type="button"
                  variant="outline"
                  className="w-full h-32 border-2 border-dashed hover:border-gray-400 hover:bg-gray-50"
                  onClick={handleGallerySelect}
                >
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                      <ImageIcon className="h-6 w-6 text-green-600" />
                    </div>
                    <div className="text-sm font-medium text-gray-700">
                      From Gallery
                    </div>
                    <div className="text-xs text-gray-500">
                      Select Photos
                    </div>
                  </div>
                </Button>
              </div>
            </div>

            {/* Info Text */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-xs text-blue-800">
                📸 <strong>Camera Permission:</strong> Your browser will ask for camera access when you tap "Take Photo"
              </p>
              <p className="text-xs text-blue-700 mt-1">
                Works on both iOS and Android devices
              </p>
            </div>

            {imagePreviews.length === 0 && (
              <p className="text-sm text-gray-500 text-center py-2">
                Add at least one product image to continue
              </p>
            )}
          </div>

          {/* Submit Button */}
          <div className="pt-4 pb-6">
            <Button
              type="submit"
              className="w-full rounded-full h-14 text-lg"
              size="lg"
              disabled={imagePreviews.length === 0}
            >
              <Eye className="h-6 w-6 mr-2" />
              See Preview
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
