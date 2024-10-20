"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@nextui-org/input";
import { CiSearch } from "react-icons/ci";
import { LuPackagePlus } from "react-icons/lu";
import { FiEdit } from "react-icons/fi";
import { MdDeleteForever } from "react-icons/md";
import { IoIosMore } from "react-icons/io";
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
import Link from "next/link";

interface Product {
  product_id: number;
  product_title: string;
  product_sku: string;
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
  const itemsPerPage = 10;

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

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API}/admin/product/${selectedProduct?.product_id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(Object.fromEntries(formData)),
          credentials: "include",
        },
      );
      if (!response.ok) {
        throw new Error("Failed to update product");
      }
      toast.success("Product updated successfully");
      setIsEditDialogOpen(false);
      fetchProducts();
    } catch (error) {
      console.error("Error updating product:", error);
      toast.error("Failed to update product");
    }
  };
  const handleAddProduct = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const productData = Object.fromEntries(formData.entries());

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API}/admin/add-product`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(productData),
          credentials: "include",
        },
      );

      if (!response.ok) {
        throw new Error("Failed to add product");
      }

      toast.success("Product added successfully");
      setIsAddDialogOpen(false);
      fetchProducts();
    } catch (error) {
      console.error("Error adding product:", error);
      toast.error("Failed to add product");
    }
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
              <form onSubmit={handleAddProduct} className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Basic Information</h3>
                  <div className="grid grid-cols-2 gap-4">
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
                      <Label htmlFor="product_thumbnail">Thumbnail URL</Label>
                      <Input
                        id="product_thumbnail"
                        name="product_thumbnail"
                        placeholder="Enter thumbnail URL"
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
                  </div>
                </div>
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Dimensions</h3>
                  <div className="grid grid-cols-3 gap-4">
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
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Pricing and Stock</h3>
                  <div className="grid grid-cols-3 gap-4">
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
            className="h-full w-64 rounded-md border-[1px] border-n100"
            placeholder="Search products"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
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
                <TableHead>Stock</TableHead>
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
                  <TableCell>{product.product_stock}</TableCell>
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
              {Math.min(currentPage * itemsPerPage, products.length)} of{" "}
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
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </>
      )}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
            <DialogDescription>
              Make changes to the product here.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Basic Information</h3>
              <div className="grid grid-cols-2 gap-4">
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
                  <Label htmlFor="product_thumbnail">Thumbnail URL</Label>
                  <Input
                    id="product_thumbnail"
                    name="product_thumbnail"
                    defaultValue={selectedProduct?.product_thumbnail}
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
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Dimensions</h3>
              <div className="grid grid-cols-3 gap-4">
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
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Pricing and Stock</h3>
              <div className="grid grid-cols-3 gap-4">
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
