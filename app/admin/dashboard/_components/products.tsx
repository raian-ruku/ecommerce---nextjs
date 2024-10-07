import { Button } from "@/components/ui/button";
import { Input } from "@nextui-org/input";
import { CiSearch } from "react-icons/ci";
import { FaPlus } from "react-icons/fa6";
import { LuPackagePlus } from "react-icons/lu";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const ProductsPage = () => {
  return (
    <main className="flex h-screen w-full flex-col">
      <div className="flex h-fit w-full flex-row justify-between">
        <h1 className="text-xl">Products</h1>
        <div className="flex flex-row items-center justify-center gap-3">
          <Button className="h-full bg-black">
            <LuPackagePlus className="mr-2" />
            Add Product
          </Button>
          <Input
            placeholder="Search products"
            startContent={<CiSearch size={30} className="pr-2" />}
            className="h-full rounded-md border-[1px] border-n100"
          />
        </div>
      </div>
      <Table className="mt-5">
        <TableHeader>
          <TableRow className="pointer-events-none border-y-[1px] border-y-neutral-200/50">
            <TableHead></TableHead>
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
      </Table>
    </main>
  );
};

export default ProductsPage;
