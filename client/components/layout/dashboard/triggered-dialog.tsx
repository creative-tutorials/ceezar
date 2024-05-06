import { CloudUpload } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";
import { env } from "@/env";
import { useAuth, useUser } from "@clerk/nextjs";
import { useQueryClient } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";
import { createUpload } from "@/functions/upload";
import { getAPIURL } from "@/hooks/apiUtils";
import { TDialogProp } from "@/types/componentTypes";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import BubbleLoader from "../loaders/bubble-loader";

export function TriggeredDialog(props: TDialogProp) {
  const { isLoaded, userId, isSignedIn } = useAuth();
  const { user } = useUser();
  const apiUrl = getAPIURL();
  const queryClient = useQueryClient();
  const editProduct = async (pID: string) => {
    if (!isLoaded || !userId || !isSignedIn) {
      return null;
    }
    props.setIsDisabled(true);
    try {
      const response = await axios.put(
        `${apiUrl}/product`,
        {
          productID: pID,
          name: props.productForm.name,
          description: props.productForm.description,
          price: props.productForm.price,
          imageURL: props.fileData.imageURL,
          code: props.productForm.code,
          checkout: props.productForm.checkout,
        },
        {
          headers: {
            "Content-Type": "application/json",
            apikey: env.NEXT_PUBLIC_NODE_API_KEY,
            userid: userId,
            email: user?.emailAddresses[0]?.emailAddress,
          },
        }
      );

      if (response.status === 200) {
        props.setIsDisabled(false);
        return response.data;
      }
    } catch (error: any) {
      console.error(error);
      const { data } = error.response;
      throw new Error(data.error);
    }
  };

  const modifyProduct = useMutation({
    mutationFn: editProduct,
    onSuccess: () => {
      toast.success("200 - OK", {
        description: "Product updated successfully",
        action: {
          label: "Close",
          onClick: () => console.log("Toast dismissed"),
        },
      });
      queryClient.invalidateQueries({ queryKey: ["products"] }); // refetch products
    },
    onError: (err: any) => {
      console.error(err);
      props.setIsDisabled(false);
      toast.error("Error", {
        description: err,
        action: {
          label: "Close",
          onClick: () => console.log("Toast dismissed"),
        },
      });
    },
  });

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          className="bg-indigo-700 hidden bottom-0 text-white hover:bg-indigo-800 font-medium shadow-xl transition-all hover:shadow-indigo-500"
          ref={props.editButtonRef}
        >
          Edit Product
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-zinc-950 shadow-lg border border-zinc-900">
        <DialogHeader>
          <DialogTitle>Edit product</DialogTitle>
          <DialogDescription>
            Make changes to your product here. Click save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-3 h-full max-h-96 overflow-auto">
          <div className="">
            <Label htmlFor="name" className="text-right">
              Product name
            </Label>
            <Input
              id="name"
              placeholder="Acme Slides"
              disabled={props.isDisabled}
              type="text"
              value={props.productForm.name}
              className="col-span-3 border border-zinc-800 placeholder:text-zinc-300"
              autoComplete="off"
              onChange={(e) =>
                props.setProductForm({
                  ...props.productForm,
                  name: e.target.value,
                })
              }
            />
          </div>
          <div className="">
            <Label htmlFor="description" className="text-right">
              Description
            </Label>
            <Textarea
              id="description"
              placeholder="Acme Slides is a presentation software..."
              disabled={props.isDisabled}
              value={props.productForm.description}
              className="col-span-3 border border-zinc-800 max-h-52 placeholder:text-zinc-300"
              autoComplete="off"
              onChange={(e) =>
                props.setProductForm({
                  ...props.productForm,
                  description: e.target.value,
                })
              }
            />
          </div>
          <div className="">
            <Label htmlFor="price" className="text-right">
              Price
            </Label>
            <Input
              id="price"
              placeholder="$0.00"
              disabled={props.isDisabled}
              type="number"
              value={props.productForm.price}
              className="col-span-3 border border-zinc-800 placeholder:text-zinc-300"
              autoComplete="off"
              onChange={(e) =>
                props.setProductForm({
                  ...props.productForm,
                  price: parseInt(e.target.value),
                })
              }
            />
          </div>
          <div className="">
            <Label htmlFor="price" className="text-right">
              Country Code
            </Label>
            <Select
              disabled={props.isDisabled}
              defaultValue={props.productForm.code}
              onValueChange={(value) =>
                props.setProductForm({ ...props.productForm, code: value })
              }
            >
              <SelectTrigger className="w-full col-span-3 border border-zinc-800 placeholder:text-zinc-300">
                <SelectValue placeholder="Select a country code" />
              </SelectTrigger>
              <SelectContent>
                {props.codes.map((item) => (
                  <SelectGroup key={item.code}>
                    <SelectItem value={item.code}>{item.name}</SelectItem>
                  </SelectGroup>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="">
            <Label htmlFor="checkout" className="text-right">
              Checkout URL
            </Label>
            <Input
              id="checkout"
              placeholder="http://acme.com/checkout"
              disabled={props.isDisabled}
              type="url"
              value={props.productForm.checkout}
              className="col-span-3 border border-zinc-800 placeholder:text-zinc-300"
              autoComplete="off"
              onChange={(e) =>
                props.setProductForm({
                  ...props.productForm,
                  checkout: e.target.value,
                })
              }
            />
          </div>
          <div className="flex flex-col gap-4">
            <hgroup>
              <h2 className="text-xl">Upload Product Image</h2>
              <p className="text-xs text-zinc-400">
                Upload and attach your image here
              </p>
            </hgroup>
            <Separator className="w-full h-px bg-zinc-500" />
            <div id="upload-f">
              <Label
                htmlFor="image"
                className="w-full flex items-center justify-center text-center bg-indigo-400/10 border-2 border-dashed border-indigo-500 p-4 rounded-lg"
              >
                {!props.fileData.isUploading && (
                  <hgroup className="flex items-center justify-center text-center flex-col gap-3">
                    <div
                      id="icon"
                      className="p-4 bg-indigo-400 rounded-full border-4 border-indigo-700"
                    >
                      <CloudUpload className="x text-indigo-800 w-8 h-8" />
                    </div>
                    <h3 className="text-lg">Upload File Here</h3>
                    <p className="text-xs text-zinc-400">
                      PNG, JPG, JPEG, AVIF up to 10MB
                    </p>
                  </hgroup>
                )}
                {props.fileData.isUploading && (
                  <hgroup className="flex items-center justify-center text-center flex-col gap-3 pointer-events-none select-none">
                    <div id="icon">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="100"
                        height="100"
                        viewBox="0 0 24 24"
                      >
                        <g
                          fill="none"
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeWidth="2"
                        >
                          <path
                            strokeDasharray="2 4"
                            strokeDashoffset="6"
                            d="M12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3"
                          >
                            <animate
                              attributeName="stroke-dashoffset"
                              dur="0.6s"
                              repeatCount="indefinite"
                              values="6;0"
                            />
                          </path>
                          <path
                            strokeDasharray="30"
                            strokeDashoffset="30"
                            d="M12 3C16.9706 3 21 7.02944 21 12C21 16.9706 16.9706 21 12 21"
                          >
                            <animate
                              fill="freeze"
                              attributeName="stroke-dashoffset"
                              begin="0.1s"
                              dur="0.3s"
                              values="30;0"
                            />
                          </path>
                          <path
                            strokeDasharray="10"
                            strokeDashoffset="10"
                            d="M12 16v-7.5"
                          >
                            <animate
                              fill="freeze"
                              attributeName="stroke-dashoffset"
                              begin="0.5s"
                              dur="0.2s"
                              values="10;0"
                            />
                          </path>
                          <path
                            strokeDasharray="6"
                            strokeDashoffset="6"
                            d="M12 8.5l3.5 3.5M12 8.5l-3.5 3.5"
                          >
                            <animate
                              fill="freeze"
                              attributeName="stroke-dashoffset"
                              begin="0.7s"
                              dur="0.2s"
                              values="6;0"
                            />
                          </path>
                        </g>
                      </svg>
                    </div>
                    <h3 className="text-2xl">Uploading Image</h3>
                  </hgroup>
                )}
              </Label>
              <Input
                id="image"
                type="file"
                hidden
                disabled={props.fileData.isUploading}
                className="hidden"
                onChange={(event) =>
                  createUpload({
                    event,
                    setFileData: props.setFileData,
                  })
                }
                accept="image/jpg ,image/png, image/jpeg, image/avif"
              />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button
            type="submit"
            className="bg-zinc-900 hover:bg-zinc-800"
            onClick={() => {
              modifyProduct.mutate(props.pID); // modify product
            }}
            disabled={props.isDisabled || props.fileData.isUploading}
          >
            {props.isDisabled || props.fileData.isUploading ? (
              <BubbleLoader />
            ) : (
              <>Save changes</>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
