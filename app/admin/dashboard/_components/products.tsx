"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@nextui-org/input";
import { CiSearch } from "react-icons/ci";
import { LuPackagePlus } from "react-icons/lu";
import { FiEdit } from "react-icons/fi";
import { MdDeleteForever } from "react-icons/md";
import { IoIosMore } from "react-icons/io";
import { Textarea } from "@nextui-org/input";
import { X } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import Image from "next/image";

interface Product {
  product_id: number;
  product_title: string;
  product_sku: string;
  product_description: string;
  product_brand: string;
  product_warranty: string;
  product_shipping: string;
  product_return: string;
  product_weight: number;
  product_discount: number;
  product_minimum: number;
  product_thumbnail: string;
  creation_date: string;
  category_id: number;
  category_name: string;
  purchase_price: number;
  product_price: number;
  product_stock: number;
  dimensions_id: number;
  height: number;
  width: number;
  depth: number;
  total: number;
}

interface Category {
  category_id: number;
  category_name: string;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [productImages, setProductImages] = useState<File[]>([]);
  const [productImagePreviews, setProductImagePreviews] = useState<string[]>(
    [],
  );
  const itemsPerPage = 10;

  const thumbnailInputRef = useRef<HTMLInputElement>(null);
  const productImagesInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [currentPage, searchTerm]);

  const fetchProducts = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API}/admin/all-products?page=${currentPage}&pageSize=${itemsPerPage}&search=${searchTerm}`,
        { credentials: "include" },
      );
      if (!response.ok) {
        throw new Error("Failed to fetch products");
      }
      const data = await response.json();
      setProducts(data.products);
      setTotalPages(data.totalPages);
      setTotalProducts(data.total);
    } catch (error) {
      console.error("Error fetching products:", error);
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API}/admin/categories`,
        { credentials: "include" },
      );
      if (!response.ok) {
        throw new Error("Failed to fetch categories");
      }
      const data = await response.json();
      setCategories(data.categories);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleEdit = (product: Product) => {
    setSelectedProduct(product);
    console.log(product);
    setThumbnailPreview(product.product_thumbnail);
    setIsEditDialogOpen(true);
  };

  const handleDelete = async (productId: number) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API}/admin/product/${productId}`,
        {
          method: "DELETE",
          credentials: "include",
        },
      );
      if (!response.ok) {
        throw new Error("Failed to delete product");
      }
      toast.success("Product deleted successfully");
      fetchProducts();
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error("Failed to delete product");
    }
    setIsDeleteDialogOpen(false);
  };

  const handleThumbnailChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      setThumbnailFile(file);
      setThumbnailPreview(URL.createObjectURL(file));
      console.log("Thumbnail file:", file);
      console.log("Thumbnail preview URL:", URL.createObjectURL(file));
    }
  };

  const handleProductImagesChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const files = Array.from(event.target.files || []);
    setProductImages((prevImages) => [...prevImages, ...files]);
    setProductImagePreviews((prevPreviews) => [
      ...prevPreviews,
      ...files.map((file) => URL.createObjectURL(file)),
    ]);
    console.log("Product images:", files);
    console.log(
      "Product image preview URLs:",
      files.map((file) => URL.createObjectURL(file)),
    );
  };

  const handleRemoveThumbnail = () => {
    setThumbnailFile(null);
    setThumbnailPreview(null);
  };

  const handleRemoveProductImage = (index: number) => {
    setProductImages((prevImages) => prevImages.filter((_, i) => i !== index));
    setProductImagePreviews((prevPreviews) =>
      prevPreviews.filter((_, i) => i !== index),
    );
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const handleDrop = (
    event: React.DragEvent<HTMLDivElement>,
    type: "thumbnail" | "productImages",
  ) => {
    event.preventDefault();
    event.stopPropagation();
    const files = Array.from(event.dataTransfer.files);

    if (type === "thumbnail") {
      const file = files[0];
      setThumbnailFile(file);
      setThumbnailPreview(URL.createObjectURL(file));
    } else {
      setProductImages((prevImages) => [...prevImages, ...files]);
      setProductImagePreviews((prevPreviews) => [
        ...prevPreviews,
        ...files.map((file) => URL.createObjectURL(file)),
      ]);
    }
  };

  const handleAddProduct = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    if (thumbnailFile) {
      formData.append("thumbnail", thumbnailFile);
    }

    productImages.forEach((file) => {
      formData.append("productImages", file);
    });

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API}/admin/add-product`,
        {
          method: "POST",
          body: formData,
          credentials: "include",
        },
      );

      if (!response.ok) {
        throw new Error("Failed to add product");
      }

      toast.success("Product added successfully");
      setIsAddDialogOpen(false);
      fetchProducts();

      // Reset form fields
      setThumbnailFile(null);
      setThumbnailPreview(null);
      setProductImages([]);
      setProductImagePreviews([]);
    } catch (error) {
      console.error("Error adding product:", error);
      toast.error("Failed to add product");
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    if (thumbnailFile) {
      formData.append("thumbnail", thumbnailFile);
    }

    productImages.forEach((file) => {
      formData.append("productImages", file);
    });

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API}/admin/product/${selectedProduct?.product_id}`,
        {
          method: "PUT",
          body: formData,
          credentials: "include",
        },
      );
      if (!response.ok) {
        throw new Error("Failed to update product");
      }
      toast.success("Product updated successfully");
      setIsEditDialogOpen(false);
      console.log(formData);
      fetchProducts();
    } catch (error) {
      console.error("Error updating product:", error);
      toast.error("Failed to update product");
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page when searching
  };

  return (
    <main className="flex h-screen w-full flex-col p-6">
      <div className="mb-6 flex h-fit w-full flex-row justify-between">
        <h1 className="text-2xl font-bold">Products</h1>
        <div className="flex flex-row items-center justify-center gap-3">
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                <LuPackagePlus className="mr-2" />
                Add Product
              </Button>
            </DialogTrigger>
            <DialogContent className="max-h-screen max-w-4xl overflow-y-scroll">
              <DialogHeader>
                <DialogTitle>Add Product</DialogTitle>
                <DialogDescription>
                  Enter the details for the new product.
                </DialogDescription>
              </DialogHeader>
              <form
                onSubmit={handleAddProduct}
                className="space-y-6"
                encType="multipart/form-data"
              >
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold">
                        Basic Information
                      </h3>
                      <div className="mt-2 grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="product_title">Product Title</Label>
                          <Input
                            id="product_title"
                            name="product_title"
                            placeholder="Enter product title"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="product_sku">SKU</Label>
                          <Input
                            id="product_sku"
                            name="product_sku"
                            placeholder="Enter SKU"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="category_id">Category</Label>
                          <Select name="category_id" required>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                            <SelectContent>
                              {categories.map((category) => (
                                <SelectItem
                                  key={category.category_id}
                                  value={category.category_id.toString()}
                                >
                                  {category.category_name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="product_brand">Product Brand</Label>
                          <Input
                            id="product_brand"
                            name="product_brand"
                            placeholder="Enter product brand"
                            required
                          />
                        </div>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">Description</h3>
                      <div className="mt-2">
                        <Textarea
                          id="product_description"
                          name="product_description"
                          label="Description"
                          labelPlacement="outside"
                          placeholder="Enter product description"
                        />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">Dimensions</h3>
                      <div className="mt-2 grid grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="height">Height</Label>
                          <Input
                            id="height"
                            name="height"
                            type="number"
                            step="0.01"
                            placeholder="Height"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="width">Width</Label>
                          <Input
                            id="width"
                            name="width"
                            type="number"
                            step="0.01"
                            placeholder="Width"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="depth">Depth</Label>
                          <Input
                            id="depth"
                            name="depth"
                            type="number"
                            step="0.01"
                            placeholder="Depth"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold">Images</h3>
                      <div className="mt-2 space-y-4">
                        <div
                          className="cursor-pointer rounded-md border-2 border-dashed border-gray-300 p-4 text-center"
                          onDragOver={handleDragOver}
                          onDrop={(e) => handleDrop(e, "thumbnail")}
                          onClick={() => thumbnailInputRef.current?.click()}
                        >
                          <input
                            type="file"
                            ref={thumbnailInputRef}
                            onChange={handleThumbnailChange}
                            accept="image/*"
                            style={{ display: "none" }}
                          />
                          {thumbnailPreview ? (
                            <Image
                              src={thumbnailPreview}
                              alt="Thumbnail preview"
                              width={100}
                              height={100}
                              className="mx-auto"
                            />
                          ) : (
                            <p>
                              Drag &apos;n&apos; drop a thumbnail here, or click
                              to select one
                            </p>
                          )}
                        </div>
                        <div
                          className="cursor-pointer rounded-md border-2 border-dashed border-gray-300 p-4 text-center"
                          onDragOver={handleDragOver}
                          onDrop={(e) => handleDrop(e, "productImages")}
                          onClick={() => productImagesInputRef.current?.click()}
                        >
                          <input
                            type="file"
                            ref={productImagesInputRef}
                            onChange={handleProductImagesChange}
                            accept="image/*"
                            multiple
                            style={{ display: "none" }}
                          />
                          <p>
                            Drag &apos;n&apos; drop product images here, or
                            click to select files
                          </p>
                        </div>
                        <div className="grid grid-cols-4 gap-4">
                          {productImagePreviews.map((preview, index) => (
                            <Image
                              key={index}
                              src={preview}
                              alt={`Product image ${index + 1}`}
                              width={100}
                              height={100}
                              className="rounded-md"
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">
                        Pricing and Stock
                      </h3>
                      <div className="mt-2 grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="purchase_price">Purchase Price</Label>
                          <Input
                            id="purchase_price"
                            name="purchase_price"
                            type="number"
                            step="0.01"
                            placeholder="Enter purchase price"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="product_price">Selling Price</Label>
                          <Input
                            id="product_price"
                            name="product_price"
                            type="number"
                            step="0.01"
                            placeholder="Enter selling price"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="product_stock">Stock</Label>
                          <Input
                            id="product_stock"
                            name="product_stock"
                            type="number"
                            placeholder="Enter stock quantity"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="product_minimum">
                            Minimum Order Quantity
                          </Label>
                          <Input
                            id="product_minimum"
                            name="product_minimum"
                            type="number"
                            placeholder="Minimum order quantity"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="product_discount">Discount</Label>
                          <Input
                            id="product_discount"
                            name="product_discount"
                            type="number"
                            step="0.01"
                            placeholder="Enter discount"
                            required
                          />
                        </div>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">
                        Additional Information
                      </h3>
                      <div className="mt-2 grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="product_warranty">Warranty</Label>
                          <Input
                            id="product_warranty"
                            name="product_warranty"
                            type="text"
                            placeholder="Enter warranty information"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="product_shipping">Shipping</Label>
                          <Input
                            id="product_shipping"
                            name="product_shipping"
                            type="text"
                            placeholder="Enter shipping information"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="product_return">Return Policy</Label>
                          <Input
                            id="product_return"
                            name="product_return"
                            type="text"
                            placeholder="Enter return policy"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="product_weight">Product Weight</Label>
                          <Input
                            id="product_weight"
                            name="product_weight"
                            type="number"
                            step="0.01"
                            placeholder="Enter product weight"
                            required
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    type="submit"
                    className="bg-green-500 transition-colors duration-200 ease-in-out hover:bg-green-600"
                  >
                    Add new product
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
          <Input
            startContent={<CiSearch size={30} className="pr-2" />}
            className="h-full w-64 rounded-md"
            placeholder="Search products"
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
      </div>
      {isLoading ? (
        <div>Loading...</div>
      ) : error ? (
        <div>Error: {error}</div>
      ) : (
        <>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>SL.</TableHead>
                <TableHead className="w-[100px]"></TableHead>
                <TableHead>Title</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead>Pur. Price</TableHead>
                <TableHead>Price</TableHead>
                <TableHead className="text-right">Stock</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Uploaded at</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.product_id}>
                  <TableCell>{product.product_id}</TableCell>
                  <TableCell>
                    <Image
                      src={product.product_thumbnail}
                      alt={product.product_title}
                      width={50}
                      height={50}
                      className="rounded-md"
                    />
                  </TableCell>
                  <TableCell>{product.product_title}</TableCell>
                  <TableCell>{product.product_sku}</TableCell>
                  <TableCell>${product.purchase_price}</TableCell>
                  <TableCell>${product.product_price}</TableCell>
                  <TableCell className="text-right">
                    {product.product_stock}
                  </TableCell>
                  <TableCell>{product.category_name}</TableCell>
                  <TableCell>
                    {new Date(product.creation_date).toLocaleTimeString()}{" "}
                    {new Date(product.creation_date).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu modal={false}>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <IoIosMore size={20} />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => handleEdit(product)}
                          className="data-[highlighted]:bg-blue-300 data-[highlighted]:text-white"
                        >
                          <FiEdit className="mr-2 text-[14px]" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => {
                            setSelectedProduct(product);
                            setIsDeleteDialogOpen(true);
                          }}
                          className="text-red-500 data-[highlighted]:bg-red-500 data-[highlighted]:text-white"
                        >
                          <MdDeleteForever className="mr-2 text-[14px]" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="mt-4 flex items-center justify-between">
            <div className="w-full">
              Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
              {Math.min(currentPage * itemsPerPage, totalProducts)} of{" "}
              {totalProducts} products
            </div>
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      if (currentPage > 1) handlePageChange(currentPage - 1);
                    }}
                    className={`cursor-pointer select-none border-none hover:bg-transparent ${
                      currentPage > 1
                        ? "hover:text-blue-700"
                        : "text-n300 hover:text-red-100"
                    }`}
                  />
                </PaginationItem>
                {[...Array(totalPages)].map((_, index) => {
                  const pageNumber = index + 1;
                  if (
                    pageNumber === 1 ||
                    pageNumber === totalPages ||
                    (pageNumber >= currentPage - 1 &&
                      pageNumber <= currentPage + 1)
                  ) {
                    return (
                      <PaginationItem key={pageNumber}>
                        <PaginationLink
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            handlePageChange(pageNumber);
                          }}
                          isActive={pageNumber === currentPage}
                        >
                          {pageNumber}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  } else if (
                    pageNumber === currentPage - 2 ||
                    pageNumber === currentPage + 2
                  ) {
                    return <PaginationEllipsis key={pageNumber} />;
                  }
                  return null;
                })}
                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      if (currentPage < totalPages)
                        handlePageChange(currentPage + 1);
                    }}
                    className={`cursor-pointer select-none border-none hover:bg-transparent ${
                      currentPage < totalPages
                        ? "hover:text-blue-700"
                        : "text-n300 hover:text-red-100"
                    }`}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </>
      )}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-h-screen max-w-4xl overflow-y-scroll">
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
            <DialogDescription>
              Make changes to the product here.
            </DialogDescription>
          </DialogHeader>
          <form
            onSubmit={handleSubmit}
            className="space-y-6"
            encType="multipart/form-data"
          >
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold">Basic Information</h3>
                  <div className="mt-2 grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="product_title">Title</Label>
                      <Input
                        id="product_title"
                        name="product_title"
                        defaultValue={selectedProduct?.product_title}
                        className="w-full"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="product_sku">SKU</Label>

                      <Input
                        id="product_sku"
                        name="product_sku"
                        defaultValue={selectedProduct?.product_sku}
                        className="w-full"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="category_id">Category</Label>
                      <Select
                        name="category_id"
                        defaultValue={selectedProduct?.category_id.toString()}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem
                              key={category.category_id}
                              value={category.category_id.toString()}
                            >
                              {category.category_name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="product_brand">Product Brand</Label>

                      <Input
                        id="product_brand"
                        name="product_brand"
                        placeholder="Enter product brand"
                        required
                        defaultValue={selectedProduct?.product_brand}
                      />
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Description</h3>
                  <div className="mt-2">
                    <Textarea
                      id="product_description"
                      name="product_description"
                      label="Description"
                      labelPlacement="outside"
                      placeholder="Enter product description"
                      defaultValue={selectedProduct?.product_description}
                    />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Dimensions</h3>
                  <div className="mt-2 grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="height">Height</Label>
                      <Input
                        id="height"
                        name="height"
                        type="number"
                        defaultValue={selectedProduct?.height?.toString()}
                        className="w-full"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="width">Width</Label>
                      <Input
                        id="width"
                        name="width"
                        type="number"
                        defaultValue={selectedProduct?.width?.toString()}
                        className="w-full"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="depth">Depth</Label>
                      <Input
                        id="depth"
                        name="depth"
                        type="number"
                        defaultValue={selectedProduct?.depth?.toString()}
                        className="w-full"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold">Images</h3>
                  <div className="mt-2 space-y-4">
                    <div
                      className="relative cursor-pointer rounded-md border-2 border-dashed border-gray-300 p-4 text-center"
                      onDragOver={handleDragOver}
                      onDrop={(e) => handleDrop(e, "thumbnail")}
                      onClick={() => thumbnailInputRef.current?.click()}
                    >
                      <input
                        type="file"
                        ref={thumbnailInputRef}
                        onChange={handleThumbnailChange}
                        accept="image/*"
                        style={{ display: "none" }}
                      />
                      {thumbnailPreview ? (
                        <>
                          <Image
                            src={thumbnailPreview}
                            alt="Thumbnail preview"
                            width={100}
                            height={100}
                            className="mx-auto"
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            className="absolute -right-2 -top-2 h-5 w-5"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemoveThumbnail();
                            }}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </>
                      ) : (
                        <p>
                          Drag &apos;n&apos; drop a thumbnail here, or click to
                          select one
                        </p>
                      )}
                    </div>
                    <div
                      className="cursor-pointer rounded-md border-2 border-dashed border-gray-300 p-4 text-center"
                      onDragOver={handleDragOver}
                      onDrop={(e) => handleDrop(e, "productImages")}
                      onClick={() => productImagesInputRef.current?.click()}
                    >
                      <input
                        type="file"
                        ref={productImagesInputRef}
                        onChange={handleProductImagesChange}
                        accept="image/*"
                        multiple
                        style={{ display: "none" }}
                      />
                      <p>
                        Drag &apos;n&apos; drop product images here, or click to
                        select files
                      </p>
                    </div>
                    <div className="grid grid-cols-4 gap-4">
                      {productImagePreviews.map((preview, index) => (
                        <div key={index} className="relative">
                          <Image
                            src={preview}
                            alt={`Product image ${index + 1}`}
                            width={100}
                            height={100}
                            className="rounded-md"
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            className="absolute -right-2 -top-2 h-5 w-5"
                            onClick={() => handleRemoveProductImage(index)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Pricing and Stock</h3>
                  <div className="mt-2 grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="purchase_price">Purchase Price</Label>
                      <Input
                        id="purchase_price"
                        name="purchase_price"
                        type="number"
                        step="0.01"
                        defaultValue={selectedProduct?.purchase_price?.toString()}
                        className="w-full"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="product_price">Selling Price</Label>
                      <Input
                        id="product_price"
                        name="product_price"
                        type="number"
                        step="0.01"
                        defaultValue={selectedProduct?.product_price?.toString()}
                        className="w-full"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="product_stock">Stock</Label>
                      <Input
                        id="product_stock"
                        name="product_stock"
                        type="number"
                        defaultValue={selectedProduct?.product_stock?.toString()}
                        className="w-full"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="product_minimum">
                        Minimum Order Quantity
                      </Label>
                      <Input
                        id="product_minimum"
                        name="product_minimum"
                        type="number"
                        step="0.01"
                        defaultValue={selectedProduct?.product_minimum?.toString()}
                        className="w-full"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="product_discount">Discount</Label>
                      <Input
                        id="product_discount"
                        name="product_discount"
                        type="number"
                        step="0.01"
                        defaultValue={selectedProduct?.product_discount?.toString()}
                        className="w-full"
                      />
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold">
                    Additional Information
                  </h3>
                  <div className="mt-2 grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="product_warranty">Warranty</Label>
                      <Input
                        id="product_warranty"
                        name="product_warranty"
                        type="text"
                        placeholder="Enter warranty information"
                        defaultValue={selectedProduct?.product_warranty}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="product_shipping">Shipping</Label>
                      <Input
                        id="product_shipping"
                        name="product_shipping"
                        type="text"
                        placeholder="Enter shipping information"
                        defaultValue={selectedProduct?.product_shipping}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="product_return">Return Policy</Label>
                      <Input
                        id="product_return"
                        name="product_return"
                        type="text"
                        placeholder="Enter return policy"
                        defaultValue={selectedProduct?.product_return}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="product_weight">Product Weight</Label>
                      <Input
                        id="product_weight"
                        name="product_weight"
                        type="number"
                        step="0.01"
                        placeholder="Enter product weight"
                        defaultValue={String(selectedProduct?.product_weight)}
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button
                type="submit"
                className="bg-green-500 transition-colors duration-200 ease-in-out hover:bg-green-600"
              >
                Update product
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              product.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() =>
                selectedProduct && handleDelete(selectedProduct.product_id)
              }
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </main>
  );
}
