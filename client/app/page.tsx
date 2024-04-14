"use client";
import { Fragment, Suspense, lazy } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useAuth, useUser } from "@clerk/nextjs";
import { getAPIURL } from "@/hooks/apiUtils";
import Link from "next/link";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ErrorComponent } from "@/components/layout/main/error";
const CircularLoader = lazy(
  () => import("@/components/layout/loaders/circular-loader")
);
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import Sidebar from "@/components/layout/sidebar";

import { Separator } from "@/components/ui/separator";

type Products = {
  productID: string;
  name: string;
  description: string;
  price: number;
  imageURL: string;
  code: string;
  checkout: string;
};

export default function Page() {
  const { isLoaded, isSignedIn, userId } = useAuth();
  const { user } = useUser();
  const apiurl = getAPIURL();

  const { isPending, error, data, isError } = useQuery({
    queryKey: ["pub_products"],
    queryFn: async () => await fetchProducts(),
  });

  /**
   * The function `fetchProducts` asynchronously fetches product data from an API using Axios with
   * specific headers and returns the data if the response status is 200.
   * @returns If the conditions `!isLoaded` or `!userId` are met, `null` will be returned. Otherwise, if
   * the API call is successful and the response status is 200, the data from the response will be
   * returned. If there is an error during the API call, the error will be logged and rethrown.
   */
  const fetchProducts = async () => {
    if (!isLoaded || !userId || !isSignedIn) {
      return null;
    }
    try {
      const response = await axios.get(`${apiurl}/products`, {
        headers: {
          "Content-Type": "application/json",
          apikey: process.env.NEXT_PUBLIC_NODE_API_KEY,
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
  };

  if (isError) {
    console.error(error);
  }

  return (
    <Fragment>
      <Header />

      <main className="h-screen flex">
        <Sidebar />
        <div className="w-full bg-transparent md:ml-64 lg:ml-64 mt-32">
          <section className="w-full">
            <hgroup className="flex items-center gap-2 flex-col">
              <h1 className="text-2xl">Popular Stores</h1>
              <p className="text-sm text-slate-400">
                Find popluar stores that you may like.
              </p>
            </hgroup>
            <div id="cards stores" className="flex items-center gap-3">
              <div
                id="card"
                className="group p-6 bg-zinc-950 flex flex-col gap-3 shadow-lg border border-zinc-800 text-center rounded-lg"
              >
                <div
                  id="img"
                  className="w-full h-full rounded-full overflow-hidden"
                >
                  <Image
                    src="/Vercel Lab.png"
                    width={150}
                    height={150}
                    alt="Picture of the author"
                    className="rounded-full w-36 h-36 object-cover transition-all overflow-hidden group-hover:scale-110"
                  />
                </div>
                <hgroup>
                  <Link href="/" className="group-hover:underline">
                    Example
                  </Link>
                </hgroup>
              </div>
            </div>
          </section>
          <section className="mt-10 w-full border border-zinc-800 p-3">
            <hgroup className="flex items-center gap-2 flex-col mt-3 relative">
              <h1 className="text-4xl font-semibold">Feeds</h1>
            </hgroup>
            {isPending && <CircularLoader />}
            <div
              id="feeds popular"
              className="grid grid-cols-2 gap-4 w-full h-full mt-10"
            >
              {!isPending && data && (
                <Suspense fallback={<CircularLoader />}>
                  <Feeds data={data} />
                </Suspense>
              )}
            </div>
            {!isPending && isError && <div>{error.message}</div>}
          </section>
        </div>
      </main>
    </Fragment>
  );
}

function Header() {
  return (
    <header className="w-full fixed top-0 z-10 flex items-center justify-between bg-zinc-950/50 backdrop-blur-md border-b border-zinc-700 p-8 px-64">
      <div id="unknown-text">
        <h3 className="text-3xl">Home</h3>
      </div>
      <Dialog>
        <DialogTrigger asChild>
          <div id="input-wrapper" className="w-full max-w-md relative">
            <Input
              type="text"
              placeholder="Search for products"
              className="border border-zinc-800 bg-zinc-900"
            />
            <Search className="absolute top-2 right-4 w-5 h-5" />
          </div>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px] bg-zinc-950/30 backdrop-blur border border-zinc-900">
          <DialogHeader>
            <DialogTitle>Search for products</DialogTitle>
            <DialogDescription className="text-zinc-400 text-sm">
              Lookup a product by name. Hit enter or click the search button to
              bring up the results.
            </DialogDescription>
          </DialogHeader>
          <Separator className="bg-zinc-800" />
          <div id="input-wrapper" className="flex items-center gap-3">
            <Input
              type="text"
              placeholder="Search for products"
              className="border border-zinc-800 bg-zinc-950 p-5"
            />
            <Button className="bg-white text-black hover:bg-zinc-200">
              Search
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </header>
  );
}

const shimmer = (w: number, h: number) => `
<svg width="${w}" height="${h}" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <defs>
    <linearGradient id="g">
      <stop stop-color="#333" offset="20%" />
      <stop stop-color="#222" offset="50%" />
      <stop stop-color="#333" offset="70%" />
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="#333" />
  <rect id="r" width="${w}" height="${h}" fill="url(#g)" />
  <animate xlink:href="#r" attributeName="x" from="-${w}" to="${w}" dur="1s" repeatCount="indefinite"  />
</svg>`;

const toBase64 = (str: string) =>
  typeof window === "undefined"
    ? Buffer.from(str).toString("base64")
    : window.btoa(str);

function Feeds({ data }: { data: Products[] }) {
  return (
    <Fragment>
      {data.map((product: Products) => {
        const formatted = new Intl.NumberFormat(navigator.language || "en", {
          style: "currency",
          currency: product.code,
          currencyDisplay: "narrowSymbol",
        }).format(product.price);
        const description = `${product.description.substring(0, 70)}...`;
        return (
          <div id="feed" className="w-full h-full" key={product.productID}>
            <div
              id="image-wrapper"
              className="group relative overflow-hidden w-full h-full rounded-lg"
            >
              <Image
                src={product.imageURL}
                width={900}
                height={900}
                alt={product.name}
                className="w-full h-full rounded-lg relative transition-all duration-300 group-hover:scale-110"
                priority={true}
                placeholder="blur"
                blurDataURL={`data:image/svg+xml;base64,${toBase64(
                  shimmer(900, 900)
                )}`}
              />
              <div
                id="card-slick"
                className="bg-black/60 backdrop-blur-md overflow-hidden w-full absolute bottom-[-100%] left-0 p-8 rounded-b-lg border-l-2 border-indigo-600 transition-all duration-300 group-hover:bottom-0"
              >
                <div className="flex justify-between">
                  <div className="flex flex-col gap-4">
                    <hgroup>
                      <h3 className="text-xl text-white">{product.name}</h3>
                      <p className="text-sm text-gray-400">{description}</p>
                    </hgroup>
                    <div id="btn-f">
                      <Link href={product.checkout} target="_blank">
                        <Button className="bg-indigo-500 hover:bg-indigo-600">
                          Buy Now
                        </Button>
                      </Link>
                    </div>
                  </div>
                  <span className="flex items-end justify-end font-bold text-3xl">
                    {formatted}
                  </span>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </Fragment>
  );
}
