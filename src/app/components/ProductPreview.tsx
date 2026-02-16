import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, Link as LinkIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { Toaster } from "./ui/sonner";
import { uploadAPI, productsAPI } from "@/services/api";

interface PreviewData {
  title: string;
  description: string;
  images: string[];
  startingPrice: number;
  category: string;
  endTime: string;
}

export function ProductPreview() {
  const navigate = useNavigate();
  const [previewData, setPreviewData] = useState<PreviewData | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    const data = sessionStorage.getItem("productPreview");
    if (data) {
      setPreviewData(JSON.parse(data));
    } else {
      navigate("/create");
    }
  }, [navigate]);

  const handleCreateLink = async () => {
    if (!previewData) return;

    setCreating(true);
    try {
      // Upload images first
      const pendingFiles: File[] = (window as any).__pendingProductImages || [];
      let imageUrls: string[] = [];

      if (pendingFiles.length > 0) {
        imageUrls = await uploadAPI.uploadMultiple(pendingFiles);
      }

      // Create the product
      await productsAPI.create({
        title: previewData.title,
        description: previewData.description,
        startingPrice: previewData.startingPrice,
        category: previewData.category,
        endTime: previewData.endTime,
        images: imageUrls,
      });

      // Cleanup
      sessionStorage.removeItem("productPreview");
      delete (window as any).__pendingProductImages;

      toast.success("Product created successfully!");
      setTimeout(() => {
        navigate("/seller/existing");
      }, 1000);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to create product");
    } finally {
      setCreating(false);
    }
  };

  const goToPrevImage = () => {
    if (previewData) {
      setCurrentImageIndex((prev) =>
        prev === 0 ? previewData.images.length - 1 : prev - 1
      );
    }
  };

  const goToNextImage = () => {
    if (previewData) {
      setCurrentImageIndex((prev) =>
        prev === previewData.images.length - 1 ? 0 : prev + 1
      );
    }
  };

  if (!previewData) {
    return (
      <div className="h-full flex items-center justify-center bg-white">
        <p>Loading preview...</p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-white">
      <Toaster />

      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center gap-3 mb-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/create")}
            className="rounded-full"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl">Preview Listing</h1>
        </div>
        <p className="text-sm text-gray-600 ml-12">
          Review before publishing
        </p>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Image Carousel */}
        <div className="relative bg-black">
          <div className="aspect-square w-full">
            <img
              src={previewData.images[currentImageIndex]}
              alt={`${previewData.title} - Image ${currentImageIndex + 1}`}
              className="w-full h-full object-cover"
            />
          </div>

          {previewData.images.length > 1 && (
            <>
              <Button
                variant="outline"
                size="icon"
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full"
                onClick={goToPrevImage}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full"
                onClick={goToNextImage}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </>
          )}

          {previewData.images.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 text-white px-3 py-1 rounded-full text-sm">
              {currentImageIndex + 1} / {previewData.images.length}
            </div>
          )}
        </div>

        {/* Product Details */}
        <div className="px-6 py-6 space-y-6">
          <div>
            <h2 className="text-2xl mb-3">{previewData.title}</h2>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2">
              Description
            </h3>
            <p className="text-base text-gray-700 leading-relaxed whitespace-pre-wrap">
              {previewData.description}
            </p>
          </div>

          {/* Price and Details */}
          <div className="bg-gray-50 rounded-xl p-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Starting Price</span>
              <span className="font-semibold">${previewData.startingPrice}</span>
            </div>
            {previewData.category && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Category</span>
                <span className="font-medium">{previewData.category}</span>
              </div>
            )}
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Bidding Ends</span>
              <span className="font-medium">
                {new Date(previewData.endTime).toLocaleString()}
              </span>
            </div>
          </div>

          {/* Image Gallery Thumbnails */}
          {previewData.images.length > 1 && (
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-3">
                Product Images ({previewData.images.length})
              </h3>
              <div className="grid grid-cols-4 gap-2">
                {previewData.images.map((image, index) => (
                  <div
                    key={index}
                    className={`aspect-square rounded-lg overflow-hidden border-2 cursor-pointer ${
                      index === currentImageIndex
                        ? "border-blue-500"
                        : "border-gray-200"
                    }`}
                    onClick={() => setCurrentImageIndex(index)}
                  >
                    <img
                      src={image}
                      alt={`Thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Create Button */}
          <div className="pb-6">
            <Button
              onClick={handleCreateLink}
              className="w-full rounded-full h-14 text-lg"
              size="lg"
              disabled={creating}
            >
              <LinkIcon className="h-6 w-6 mr-2" />
              {creating ? "Creating..." : "Create Listing"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
