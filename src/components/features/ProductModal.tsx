import React, { useEffect, useState, useMemo, useCallback } from "react";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { X } from "lucide-react";
import OrderForm from "./OrderForm";

// --- TypeScript Interfaces ---
interface Label {
  key: string;
  value: string;
}

interface ProductSize {
  width: number;
  height: number;
}

interface Product {
  sku: string;
  name: string;
  description_short?: string;
  labels: Label[];
  product_size?: ProductSize;
  image_url_1?: string;
  total_price: number;
  per_item_price: number;
}

interface ModalImage {
  title: string;
  description: string;
  public_preview_uri: string;
  products: Product[];
}

interface ProductModalProps {
  image: ModalImage;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Memoized ProductCard component to prevent unnecessary re-renders
const ProductCard = React.memo(({ product }: { product: Product }) => (
  <Card className="flex flex-col">
    <CardHeader>
      <CardTitle>{product.name}</CardTitle>
      {product.description_short && (
        <CardDescription>{product.description_short}</CardDescription>
      )}
    </CardHeader>
    <CardContent className="flex-grow">
      {product.image_url_1 && (
        <div className="relative w-full h-48 mb-4">
          <Image
            src={product.image_url_1}
            alt={product.name}
            fill
            className="object-contain rounded-lg shadow"
            loading="lazy"
          />
        </div>
      )}

      <h5 className="font-bold">Details:</h5>
      <ul className="list-disc list-inside text-sm text-muted-foreground">
        {product.labels
          .filter((label) => label.key !== "sku")
          .map((label) => (
            <li key={label.key}>
              <span className="capitalize font-medium">{label.key}:</span>{" "}
              {label.value}
            </li>
          ))}
      </ul>

      {product.product_size && (
        <div className="mt-4">
          <h5 className="font-bold">Size:</h5>
          <p className="text-sm text-muted-foreground">
            {product.product_size.width} inches (W) x{" "}
            {product.product_size.height} inches (H)
          </p>
        </div>
      )}
    </CardContent>
    <CardFooter className="flex justify-between items-center">
      <p className="text-green-600 font-bold text-xl">
        ${product.per_item_price.toFixed(2)}
      </p>
      <Button variant="outline">Order This</Button>
    </CardFooter>
  </Card>
));

ProductCard.displayName = "ProductCard";

// Helper Function
const getUniqueValues = (key: string, products: Product[]): string[] => {
  const values = new Set<string>();
  products.forEach((product) => {
    product.labels.forEach((label) => {
      if (label.key === key) values.add(label.value);
    });
  });
  return Array.from(values);
};

// Main Component
const ProductModal: React.FC<ProductModalProps> = ({
  image,
  open,
  onOpenChange,
}) => {
  // Combined state object to reduce re-renders
  const [selections, setSelections] = useState({
    type: "",
    media: "",
    style: "",
    collection: "",
    frame: "",
    baseMat: "",
    glazing: "",
  });

  const [orderForm, setOrderForm] = useState<boolean>(false);

  // Memoized filtered products - only recalculates when selections change
  const filteredProducts = useMemo(() => {
    let products = image.products || [];
    const filters = [
      { key: "type", value: selections.type },
      { key: "media", value: selections.media },
      { key: "style", value: selections.style },
      { key: "collection", value: selections.collection },
      { key: "frame", value: selections.frame },
      { key: "base mat", value: selections.baseMat },
      { key: "glazing", value: selections.glazing },
    ];

    filters.forEach(({ key, value }) => {
      if (value) {
        products = products.filter((product) =>
          product.labels.some(
            (label) => label.key === key && label.value === value
          )
        );
      }
    });

    return products;
  }, [selections, image.products]);

  // Memoized selected image
  const selectedImage = useMemo(() => {
    return filteredProducts.length > 0
      ? filteredProducts[0]?.image_url_1 || image.public_preview_uri
      : image.public_preview_uri;
  }, [filteredProducts, image.public_preview_uri]);

  // Dynamic Options
  const allTypes = useMemo(
    () => getUniqueValues("type", image.products || []),
    [image.products]
  );
  
  const allMedia = useMemo(
    () => (selections.type ? getUniqueValues("media", filteredProducts) : []),
    [selections.type, filteredProducts]
  );
  
  const allStyles = useMemo(
    () => (selections.media ? getUniqueValues("style", filteredProducts) : []),
    [selections.media, filteredProducts]
  );
  
  const allCollections = useMemo(
    () => (selections.style ? getUniqueValues("collection", filteredProducts) : []),
    [selections.style, filteredProducts]
  );
  
  const allFrames = useMemo(
    () => (selections.collection ? getUniqueValues("frame", filteredProducts) : []),
    [selections.collection, filteredProducts]
  );
  
  const allBaseMats = useMemo(
    () => (selections.frame ? getUniqueValues("base mat", filteredProducts) : []),
    [selections.frame, filteredProducts]
  );
  
  const allGlazings = useMemo(
    () => (selections.baseMat ? getUniqueValues("glazing", filteredProducts) : []),
    [selections.baseMat, filteredProducts]
  );

  // Optimized dropdown change handler with useCallback
  const handleDropdownChange = useCallback((field: string, value: string) => {
    setSelections((prev) => {
      const newSelections = { ...prev, [field]: value };
      
      // Reset subsequent selections based on hierarchy
      if (field === "type") {
        return { ...newSelections, media: "", style: "", collection: "", frame: "", baseMat: "", glazing: "" };
      } else if (field === "media") {
        return { ...newSelections, style: "", collection: "", frame: "", baseMat: "", glazing: "" };
      } else if (field === "style") {
        return { ...newSelections, collection: "", frame: "", baseMat: "", glazing: "" };
      } else if (field === "collection") {
        return { ...newSelections, frame: "", baseMat: "", glazing: "" };
      } else if (field === "frame") {
        return { ...newSelections, baseMat: "", glazing: "" };
      } else if (field === "baseMat") {
        return { ...newSelections, glazing: "" };
      }
      
      return newSelections;
    });
    setOrderForm(false);
  }, []);

  // Check if should show order button
  const shouldShowOrderButton = useMemo(() => {
    if (!selections.type && allTypes.length > 0) return false;
    if (!selections.media && allMedia.length > 0) return false;
    if (!selections.style && allStyles.length > 0) return false;
    if (!selections.collection && allCollections.length > 0) return false;
    if (!selections.frame && allFrames.length > 0) return false;
    if (!selections.baseMat && allBaseMats.length > 0) return false;
    if (!selections.glazing && allGlazings.length > 0) return false;

    return filteredProducts.length > 0;
  }, [selections, allTypes, allMedia, allStyles, allCollections, allFrames, allBaseMats, allGlazings, filteredProducts]);

  const finalProduct = filteredProducts.length > 0 ? filteredProducts[0] : null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl w-11/12 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            {image.title}
          </DialogTitle>
          <DialogDescription>{image.description}</DialogDescription>
        </DialogHeader>
        <DialogClose asChild>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-4"
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogClose>

        {orderForm && finalProduct ? (
          <OrderForm
            productSKU={finalProduct.sku}
            Price={finalProduct.total_price}
            productTitle={finalProduct.name}
            onCancel={() => setOrderForm(false)}
          />
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-4">
              {/* Left Column: Image & Details */}
              <div className="flex flex-col items-center">
                <div className="relative w-full max-w-md aspect-square">
                  <Image
                    src={selectedImage}
                    alt={image.title}
                    fill
                    className="object-contain rounded-lg shadow-lg"
                    priority
                  />
                </div>
                {finalProduct && (
                  <div className="mt-4 p-4 border rounded-lg w-full max-w-md">
                    <h4 className="font-bold text-lg">Selected Product:</h4>
                    <p className="text-muted-foreground">{finalProduct.name}</p>
                    {finalProduct.product_size && (
                      <div className="mt-2">
                        <p>
                          <strong>Size: </strong>
                          {finalProduct.product_size.width} inches (W) x{" "}
                          {finalProduct.product_size.height} inches (H)
                        </p>
                      </div>
                    )}
                    <div className="mt-2">
                      <p className="text-xl font-bold">
                        <strong>Price: </strong>$
                        {finalProduct.total_price.toFixed(2)}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Right Column: Dropdown Selection */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 content-start">
                {/* Type Selection */}
                {allTypes.length > 0 && (
                  <div className="space-y-2">
                    <Label htmlFor="type-select">Type:</Label>
                    <Select
                      value={selections.type}
                      onValueChange={(value) => handleDropdownChange("type", value)}
                    >
                      <SelectTrigger id="type-select">
                        <SelectValue placeholder="Select Type" />
                      </SelectTrigger>
                      <SelectContent>
                        {allTypes.map((option) => (
                          <SelectItem key={option} value={option}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {/* Media Selection */}
                {selections.type && allMedia.length > 0 && (
                  <div className="space-y-2">
                    <Label htmlFor="media-select">Media:</Label>
                    <Select
                      value={selections.media}
                      onValueChange={(value) => handleDropdownChange("media", value)}
                    >
                      <SelectTrigger id="media-select">
                        <SelectValue placeholder="Select Media" />
                      </SelectTrigger>
                      <SelectContent>
                        {allMedia.map((option) => (
                          <SelectItem key={option} value={option}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {/* Style Selection */}
                {selections.media && allStyles.length > 0 && (
                  <div className="space-y-2">
                    <Label htmlFor="style-select">Style:</Label>
                    <Select
                      value={selections.style}
                      onValueChange={(value) => handleDropdownChange("style", value)}
                    >
                      <SelectTrigger id="style-select">
                        <SelectValue placeholder="Select Style" />
                      </SelectTrigger>
                      <SelectContent>
                        {allStyles.map((option) => (
                          <SelectItem key={option} value={option}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {/* Collection Selection */}
                {selections.style && allCollections.length > 0 && (
                  <div className="space-y-2">
                    <Label htmlFor="collection-select">Collection:</Label>
                    <Select
                      value={selections.collection}
                      onValueChange={(value) => handleDropdownChange("collection", value)}
                    >
                      <SelectTrigger id="collection-select">
                        <SelectValue placeholder="Select Collection" />
                      </SelectTrigger>
                      <SelectContent>
                        {allCollections.map((option) => (
                          <SelectItem key={option} value={option}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {/* Frame Selection */}
                {selections.collection && allFrames.length > 0 && (
                  <div className="space-y-2">
                    <Label htmlFor="frame-select">Frame:</Label>
                    <Select
                      value={selections.frame}
                      onValueChange={(value) => handleDropdownChange("frame", value)}
                    >
                      <SelectTrigger id="frame-select">
                        <SelectValue placeholder="Select Frame" />
                      </SelectTrigger>
                      <SelectContent>
                        {allFrames.map((option) => (
                          <SelectItem key={option} value={option}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {/* Base Mat Selection */}
                {selections.frame && allBaseMats.length > 0 && (
                  <div className="space-y-2">
                    <Label htmlFor="basemat-select">Base Mat:</Label>
                    <Select
                      value={selections.baseMat}
                      onValueChange={(value) => handleDropdownChange("baseMat", value)}
                    >
                      <SelectTrigger id="basemat-select">
                        <SelectValue placeholder="Select Base Mat" />
                      </SelectTrigger>
                      <SelectContent>
                        {allBaseMats.map((option) => (
                          <SelectItem key={option} value={option}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {/* Glazing Selection */}
                {selections.baseMat && allGlazings.length > 0 && (
                  <div className="space-y-2">
                    <Label htmlFor="glazing-select">Glazing:</Label>
                    <Select
                      value={selections.glazing}
                      onValueChange={(value) => handleDropdownChange("glazing", value)}
                    >
                      <SelectTrigger id="glazing-select">
                        <SelectValue placeholder="Select Glazing" />
                      </SelectTrigger>
                      <SelectContent>
                        {allGlazings.map((option) => (
                          <SelectItem key={option} value={option}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>
            </div>

            <DialogFooter className="mt-8">
              {shouldShowOrderButton && (
                <Button
                  size="lg"
                  className="w-full md:w-auto"
                  onClick={() => setOrderForm(true)}
                >
                  Order Now
                </Button>
              )}
            </DialogFooter>
          </>
        )}

        {/* All Available Products */}
        <Separator className="my-12" />
        <div className="mt-8">
          <h4 className="text-2xl text-center font-bold mb-8">
            All Available Products
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {image.products.map((product) => (
              <ProductCard key={product.sku} product={product} />
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductModal;