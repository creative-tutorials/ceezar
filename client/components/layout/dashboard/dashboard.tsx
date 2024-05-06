import Image from "next/image";
import axios from "axios";
import { env } from "@/env";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Suspense, lazy, useState, useRef } from "react";
import { useCountryCodes } from "@/hooks/country-codes";
import { getAPIURL } from "@/hooks/apiUtils";
import { useAuth, useUser } from "@clerk/nextjs";
import { createUpload } from "@/functions/upload";
import { toast } from "sonner";
import { ProductData, formDataProp, ImageData } from "@/types/formProps";
import { DashboardProps } from "@/types/componentTypes";
const BubbleLoader = lazy(() => import("../loaders/bubble-loader"));
const Sidebar = lazy(() => import("../main/sidebar"));
import { ProductsTable } from "../tables/products";
import { Bolt, CloudUpload, Heart, Package2 } from "lucide-react";
import { Button } from "@/components/ui/button";
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
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { TriggeredDialog } from "./triggered-dialog";

export default function Dashboard({ store }: DashboardProps) {
  const { isLoaded, isSignedIn, userId } = useAuth();
  const { user } = useUser();
  const apiUrl = getAPIURL();
  const queryClient = useQueryClient();
  const codes = useCountryCodes();
  const editButtonRef = useRef<HTMLButtonElement>(null);
  const [pID, setPID] = useState("");
  const [fileData, setFileData] = useState<ImageData>({
    imageURL: "",
    isUploading: false,
  });
  const [productForm, setProductForm] = useState<ProductData>({
    name: "",
    description: "",
    price: 0,
    code: "",
    checkout: "",
  });
  const [formData, setFormData] = useState<formDataProp>({
    name: "",
    description: "",
    isDisabled: false,
  });
  const [isDisabled, setIsDisabled] = useState(false);

  const { isPending, error, data, isError } = useQuery({
    queryKey: ["products"],
    queryFn: async () => await fetchUserProducts(),
  });

  async function fetchUserProducts() {
    if (!isLoaded || !userId || !isSignedIn) {
      return null;
    }
    try {
      const response = await axios.get(`${apiUrl}/user/products`, {
        headers: {
          "Content-Type": "application/json",
          apikey: env.NEXT_PUBLIC_NODE_API_KEY,
          userid: userId, // current user ID
          email: user?.emailAddresses[0]?.emailAddress,
        },
      });

      if (response.status === 200) {
        return response.data;
      }
    } catch (error: any) {
      console.error(error);
      const { data } = error.response;
      throw new Error(data.error);
    }
  }

  const updateProfile = async () => {
    if (!isLoaded || !userId || !isSignedIn) {
      return null;
    }
    setIsDisabled(true);
    try {
      const response = await axios.put(
        `${apiUrl}/update/store`,
        {
          name: formData.name,
          description: formData.description,
          imageURL: fileData.imageURL,
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
        setIsDisabled(false);
        return response.data;
      }
    } catch (error: any) {
      console.error(error);
      const { data } = error.response;
      throw new Error(data.error);
    }
  };

  const modifyProfile = useMutation({
    mutationFn: updateProfile,
    onSuccess: () => {
      toast.success("200 - OK", {
        description: "Profile updated successfully",
        action: {
          label: "Close",
          onClick: () => console.log("Toast dismissed"),
        },
      });
      queryClient.invalidateQueries({ queryKey: ["store"] }); // refetch store
    },
    onError: (err: any) => {
      console.error(err);
      setIsDisabled(false);
      toast.error("Error", {
        description: err,
        action: {
          label: "Close",
          onClick: () => console.log("Toast dismissed"),
        },
      });
    },
  });

  const publishProduct = async () => {
    if (!isLoaded || !userId || !isSignedIn) {
      return null;
    }
    setIsDisabled(true);
    try {
      const response = await axios.post(
        `${apiUrl}/products`,
        {
          name: productForm.name,
          description: productForm.description,
          price: productForm.price,
          imageURL: fileData.imageURL,
          code: productForm.code,
          checkout: productForm.checkout,
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

      if (response.status === 201) {
        setIsDisabled(false);
        return response.data;
      }
    } catch (error: any) {
      console.error(error);
      const { data } = error.response;
      throw new Error(data.error);
    }
  };

  const addProduct = useMutation({
    mutationFn: publishProduct,
    onSuccess: () => {
      toast.success("201 - Created", {
        description: "Product created successfully",
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
      console.error(err);
      setIsDisabled(false);
      toast.error("Error", {
        description: err,
        action: {
          label: "Close",
          onClick: () => console.log("Toast dismissed"),
        },
      });
    },
  });

  if (isError) {
    console.error(error);
  }

  return (
    <section id="store-main" className="h-screen flex">
      <Suspense fallback={<div>Loading</div>}>
        <Sidebar />
      </Suspense>
      <div
        id="-right"
        className="w-full bg-transparent md:ml-56 lg:ml-56 md:mt-20 lg:mt-20 mt-16"
      >
        <div
          id="card"
          className="mesh p-8 flex md:flex-row lg:flex-row flex-col md:items-end lg:items-end md:justify-between lg:justify-between md:gap-0 lg:gap-0 gap-3"
        >
          <div
            id="pf-wrapper"
            className="flex md:flex-row lg:flex-row md:items-end lg:items-end gap-3 w-full"
          >
            <div
              id="profile"
              className="bg-neutral-900 border border-zinc-800 w-auto h-auto rounded-md shadow-md shadow-black/20"
            >
              <Image
                src={store.imageURL}
                width={100}
                height={100}
                className="rounded-md p-1 md:w-48 lg:w-48 md:h-48 lg:h-48 w-auto h-auto object-cover"
                priority={true}
                alt={store.name}
              />
            </div>
            <hgroup className="flex flex-col gap-3">
              <h2 className="md:text-3xl lg:text-3xl text-2xl text-white font-medium">
                {store.name}
              </h2>
              <div className="flex md:flex-row lg:flex-row flex-col md:items-center lg:items-center gap-5 text-zinc-900 font-medium">
                <p className="flex items-center gap-1 text-white md:text-base lg:text-base text-sm">
                  <span className="bg-[#bab7f4] p-1 rounded-full">
                    <Bolt className="text-[#181296]" />
                  </span>{" "}
                  {store.reputations} reputation
                </p>
                <p className="flex items-center gap-1 text-white md:text-base lg:text-base text-sm">
                  <span className="bg-[#bab7f4] p-1 rounded-full">
                    <Heart className="text-[#181296]" />
                  </span>{" "}
                  {store.totalLikes} likes
                </p>
              </div>
            </hgroup>
          </div>
          <div
            id="btn-wrapper"
            className="flex md:flex-row lg:flex-row flex-col gap-3"
          >
            <Dialog>
              <DialogTrigger asChild>
                <Button className="bg-white hover:bg-slate-200 text-black font-medium shadow-xl">
                  Edit store
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px] bg-zinc-950 shadow-lg border border-zinc-900">
                <DialogHeader>
                  <DialogTitle>Edit profile</DialogTitle>
                  <DialogDescription>
                    Make changes to your profile here. Click save when
                    you&apos;re done.
                  </DialogDescription>
                </DialogHeader>
                <div className="flex flex-col gap-3">
                  <div className="">
                    <Label htmlFor="name" className="text-right">
                      Store name
                    </Label>
                    <Input
                      id="name"
                      placeholder="Acme Labs"
                      disabled={isDisabled}
                      type="text"
                      value={formData.name}
                      className="col-span-3 border border-zinc-800 placeholder:text-zinc-300"
                      autoComplete="off"
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                    />
                  </div>
                  <div className="">
                    <Label htmlFor="description" className="text-right">
                      Description
                    </Label>
                    <Textarea
                      id="description"
                      placeholder="Acme Labs is a digital store..."
                      disabled={isDisabled}
                      value={formData.description}
                      className="col-span-3 border border-zinc-800 max-h-52 placeholder:text-zinc-300"
                      autoComplete="off"
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          description: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="flex flex-col gap-4">
                    <hgroup>
                      <h2 className="text-xl">Upload Profile</h2>
                      <p className="text-xs text-zinc-400">
                        Upload and attach your profile picture
                      </p>
                    </hgroup>
                    <Separator className="w-full h-px bg-zinc-500" />
                    <div id="upload-f">
                      <Label
                        htmlFor="picture"
                        className="w-full flex items-center justify-center text-center bg-indigo-400/10 border-2 border-dashed border-indigo-500 p-4 rounded-lg"
                      >
                        {!fileData.isUploading && (
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
                        {fileData.isUploading && (
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
                        id="picture"
                        type="file"
                        hidden
                        disabled={fileData.isUploading}
                        className="hidden"
                        onChange={(event) =>
                          createUpload({ event, setFileData })
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
                      modifyProfile.mutate();
                    }}
                    disabled={isDisabled}
                  >
                    {isDisabled ? <BubbleLoader /> : <>Save Changes</>}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="bg-indigo-700 text-white hover:bg-indigo-800 font-medium shadow transition-all hover:shadow-indigo-500/30">
                  Create Product
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px] bg-zinc-950 shadow-lg border border-zinc-900">
                <DialogHeader>
                  <DialogTitle>Create Product</DialogTitle>
                  <DialogDescription>
                    Fill in the form below to create a new product, when you are
                    done click on publish to save your changes.
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
                      disabled={isDisabled}
                      type="text"
                      value={productForm.name}
                      className="col-span-3 border border-zinc-800 placeholder:text-zinc-300"
                      autoComplete="off"
                      onChange={(e) =>
                        setProductForm({ ...productForm, name: e.target.value })
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
                      disabled={isDisabled}
                      value={productForm.description}
                      className="col-span-3 border border-zinc-800 max-h-52 placeholder:text-zinc-300"
                      autoComplete="off"
                      onChange={(e) =>
                        setProductForm({
                          ...productForm,
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
                      disabled={isDisabled}
                      type="number"
                      value={productForm.price}
                      className="col-span-3 border border-zinc-800 placeholder:text-zinc-300"
                      autoComplete="off"
                      onChange={(e) =>
                        setProductForm({
                          ...productForm,
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
                      disabled={isDisabled}
                      defaultValue={productForm.code}
                      onValueChange={(value) =>
                        setProductForm({ ...productForm, code: value })
                      }
                    >
                      <SelectTrigger className="w-full col-span-3 border border-zinc-800 placeholder:text-zinc-300">
                        <SelectValue placeholder="Select a country code" />
                      </SelectTrigger>
                      <SelectContent>
                        {codes.map((item) => (
                          <SelectGroup key={item.code}>
                            <SelectItem value={item.code}>
                              {item.name}
                            </SelectItem>
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
                      placeholder="https://acme.lemonsqueezy.com/checkout"
                      disabled={isDisabled}
                      type="url"
                      value={productForm.checkout}
                      className="col-span-3 border border-zinc-800 placeholder:text-zinc-300"
                      autoComplete="off"
                      onChange={(e) =>
                        setProductForm({
                          ...productForm,
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
                        {!fileData.isUploading && (
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
                        {fileData.isUploading && (
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
                        disabled={fileData.isUploading}
                        className="hidden"
                        onChange={(event) =>
                          createUpload({ event, setFileData })
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
                      addProduct.mutate(); // create product
                    }}
                    disabled={isDisabled || fileData.isUploading}
                  >
                    {isDisabled || fileData.isUploading ? (
                      <BubbleLoader />
                    ) : (
                      <>Publish</>
                    )}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        <div id="content" className="p-8 flex flex-col gap-8">
          <div
            id="cards"
            className="grid md:grid-cols-3 lg:grid-cols-3 grid-cols-1 gap-4 w-full h-full"
          >
            <div
              id="card"
              className="w-full bg-[#0b0b0c] border border-zinc-900 p-8 rounded-md shadow-xl flex flex-col gap-9"
            >
              <hgroup className="flex items-center justify-between">
                <h4 className=" text-gray-400 text-sm">Total Reputation</h4>
                <Bolt className="w-4 h-4 text-gray-400" />
              </hgroup>
              <div>
                <p className="text-4xl font-semibold">{store.reputations}</p>
              </div>
            </div>
            <div
              id="card"
              className="w-full bg-[#0b0b0c] border border-zinc-900 p-8 rounded-md shadow-xl flex flex-col gap-9"
            >
              <hgroup className="flex items-center justify-between">
                <h4 className=" text-gray-400 text-sm">Total Likes</h4>
                <Heart className="w-4 h-4 text-gray-400" />
              </hgroup>
              <div>
                <p className="text-4xl font-semibold">{store.totalLikes}</p>
              </div>
            </div>
            <div
              id="card"
              className="w-full bg-[#0b0b0c] border border-zinc-900 p-8 rounded-md shadow-xl flex flex-col gap-9"
            >
              <hgroup className="flex items-center justify-between">
                <h4 className=" text-gray-400 text-sm">Total Products </h4>
                <Package2 className="w-4 h-4 text-gray-400" />
              </hgroup>
              <div>
                <p className="text-4xl font-semibold">{store.totalProducts}</p>
              </div>
            </div>
          </div>
          <div id="tb-wrapper" className="">
            <div id="orders-tb">
              <hgroup>
                <h3 className="text-3xl font-semibold">Products</h3>
              </hgroup>
              {isPending && <div>Loading data...</div>}
              {!isPending && data && (
                <ProductsTable
                  products={data}
                  apiUrl={apiUrl}
                  isLoaded={isLoaded}
                  userId={userId}
                  editButtonRef={editButtonRef}
                  setPID={setPID}
                  isSignedIn={isSignedIn as boolean}
                  email={user?.emailAddresses[0].emailAddress as string}
                />
              )}
              {!isPending && isError && <div>{error.message}</div>}
            </div>
          </div>
        </div>
      </div>
      <TriggeredDialog
        codes={codes}
        editButtonRef={editButtonRef}
        pID={pID}
        fileData={fileData}
        setFileData={setFileData}
        productForm={productForm}
        setProductForm={setProductForm}
        setIsDisabled={setIsDisabled}
        isDisabled={isDisabled}
      />
    </section>
  );
}
