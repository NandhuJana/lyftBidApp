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
    startingPrice: "",
    category: "",
    endTime: "",
  });
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [cameraPermissionGranted, setCameraPermissionGranted] = useState<boolean | null>(null);

  const checkCameraPermission = async () => {
    try {
      if ('permissions' in navigator) {
        const result = await navigator.permissions.query({ name: 'camera' as PermissionName });
        setCameraPermissionGranted(result.state === 'granted');
        result.addEventListener('change', () => {
          setCameraPermissionGranted(result.state === 'granted');
        });
        return result.state === 'granted';
      }
      return true;
    } catch {
      return true;
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const fileArray = Array.from(files);
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
          setImageFiles((prev) => [...prev, ...validFiles]);
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
    const hasPermission = await checkCameraPermission();
    if (!hasPermission && cameraPermissionGranted === false) {
      toast.error('Camera permission denied. Please enable it in your device settings.');
      return;
    }
    const cameraInput = document.getElementById('camera-input') as HTMLInputElement;
    if (cameraInput) cameraInput.click();
  };

  const handleGallerySelect = () => {
    const galleryInput = document.getElementById('gallery-input') as HTMLInputElement;
    if (galleryInput) galleryInput.click();
  };

  const removeImage = (index: number) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
    toast.success('Image removed');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (imagePreviews.length === 0) {
      toast.error('Please add at least one product image');
      return;
    }

    if (!formData.startingPrice || parseFloat(formData.startingPrice) < 0.01) {
      toast.error('Please enter a valid starting price');
      return;
    }

    if (!formData.endTime) {
      toast.error('Please set a bid end time');
      return;
    }

    // Store form data and file references for the preview page
    sessionStorage.setItem(
      "productPreview",
      JSON.stringify({
        title: formData.title,
        description: formData.description,
        startingPrice: parseFloat(formData.startingPrice),
        category: formData.category,
        endTime: new Date(formData.endTime).toISOString(),
        images: imagePreviews,
      })
    );

    // Store files in a global ref since they can't be serialized to sessionStorage
    (window as any).__pendingProductImages = imageFiles;

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
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
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
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="text-base resize-none"
            />
          </div>

          {/* Starting Price */}
          <div className="space-y-2">
            <Label htmlFor="startingPrice">Starting Price ($)</Label>
            <Input
              id="startingPrice"
              type="number"
              inputMode="decimal"
              placeholder="0.00"
              step="0.01"
              min="0.01"
              value={formData.startingPrice}
              onChange={(e) => setFormData({ ...formData, startingPrice: e.target.value })}
              required
              className="text-base"
            />
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Input
              id="category"
              placeholder="e.g. Electronics, Fashion, Sports"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="text-base"
            />
          </div>

          {/* End Time */}
          <div className="space-y-2">
            <Label htmlFor="endTime">Bid End Time</Label>
            <Input
              id="endTime"
              type="datetime-local"
              value={formData.endTime}
              onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
              required
              className="text-base"
            />
          </div>

          {/* Product Images */}
          <div className="space-y-3">
            <Label>Product Images</Label>

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
                      x
                    </Button>
                    <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                      {index + 1} of {imagePreviews.length}
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
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
                    <div className="text-sm font-medium text-gray-700">Take Photo</div>
                    <div className="text-xs text-gray-500">Use Camera</div>
                  </div>
                </Button>
              </div>

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
                    <div className="text-sm font-medium text-gray-700">From Gallery</div>
                    <div className="text-xs text-gray-500">Select Photos</div>
                  </div>
                </Button>
              </div>
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
