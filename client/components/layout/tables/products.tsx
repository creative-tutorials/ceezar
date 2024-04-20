import { useState } from "react";
import axios from "axios";
import { env } from "@/env";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ArrowUpDown, ChevronDown, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ProductsTableData, ProductInfo } from "@/types/products";

export function ProductsTable({
  products,
  apiUrl,
  isLoaded,
  userId,
  editButtonRef,
  setPID,
  isSignedIn,
  email,
}: ProductsTableData) {
  const queryClient = useQueryClient();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
    code: false,
    productID: false,
  });
  const [rowSelection, setRowSelection] = useState({});

  /**
   * Asynchronously deletes a product.
   *
   * @param {string} pID - the ID of the product to be deleted
   * @return {Promise<any>} the response data if the deletion is successful
   */
  const deleteProduct = async (pID: string): Promise<any> => {
    if (!isLoaded || !userId || !isSignedIn) {
      return null;
    }
    try {
      const response = await axios.delete(`${apiUrl}/user/products`, {
        headers: {
          "Content-Type": "application/json",
          apikey: env.NEXT_PUBLIC_NODE_API_KEY,
          userid: userId,
          email: email,
        },
        data: {
          productID: pID,
        },
      });

      if (response.status === 200) {
        return response.data;
      }
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const deleteProductById = useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      toast.success("200 - OK", {
        description: "Product deleted successfully",
        action: {
          label: "Close",
          onClick: () => console.log("Toast dismissed"),
        },
      });
      queryClient.invalidateQueries({ queryKey: ["products"] }); // refetch products
      /**
       * Invalidate the "store" query
       * to reflect the deleted product in the store
       */
      setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: ["store"] });
      }, 3000);
    },
    onError: (err: any) => {
      toast.error("Error deleting product", {
        description: err.response.data.error,
        action: {
          label: "Close",
          onClick: () => console.log("Toast dismissed"),
        },
      });
    },
  });

  const columns: ColumnDef<ProductInfo>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          className="border border-zinc-700"
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          className="border border-zinc-700"
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "name",
      header: "Names",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("name")}</div>
      ),
    },
    {
      accessorKey: "description",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Description
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const description: string = row.getValue("description");
        const sliced = `${description.slice(0, 50)}...`;
        return <div className="lowercase">{sliced}</div>;
      },
    },
    {
      accessorKey: "code",
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "productID",
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "price",
      header: () => <div className="text-right">Amount</div>,
      cell: ({ row }) => {
        const amount = parseFloat(row.getValue("price"));
        const code: string = row.getValue("code");

        // Format the amount as a dollar amount
        const formatted = new Intl.NumberFormat(navigator.language || "en", {
          style: "currency",
          currency: code,
          currencyDisplay: "narrowSymbol",
        }).format(amount);

        return <div className="text-right font-medium">{formatted}</div>;
      },
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                className="cursor-pointer rounded focus:text-red-300 focus:bg-[#6a1313]"
                onClick={() => {
                  deleteProductById.mutate(row.getValue("productID")); // delete product with ID
                }}
              >
                Delete Product
              </DropdownMenuItem>
              <DropdownMenuSeparator className="my-2 bg-zinc-700" />
              <DropdownMenuItem
                className="cursor-pointer rounded focus:text-gray-300 focus:bg-zinc-950"
                onClick={() => {
                  /**
                   * Triggers a click event on the editButtonRef element, if it exists.
                   * This is used to open the edit modal.
                   * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/click}
                   */
                  editButtonRef?.current?.click();
                  setPID(row.getValue("productID"));
                }}
              >
                Edit Product
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const data: ProductInfo[] = products;

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <div className="w-full">
      <div className="flex md:flex-row lg:flex-row flex-col md:gap-0 lg:gap-0 gap-3 items-center py-4">
        <Input
          placeholder="Filter names..."
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("name")?.setFilterValue(event.target.value)
          }
          className="max-w-sm bg-zinc-950 border-zinc-800"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="ml-auto md:w-auto lg:w-auto w-full bg-zinc-950 border border-zinc-800 shadow-lg"
            >
              Columns <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value: boolean) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="rounded-md border border-zinc-900 shadow-xl bg-[#0b0b0c]">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow
                key={headerGroup.id}
                className="border-b border-zinc-800"
              >
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="border-b border-zinc-800"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-zinc-500">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
