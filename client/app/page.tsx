"use client";
import { Fragment, Suspense, lazy } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { env } from "@/env";
import { useAuth, useUser } from "@clerk/nextjs";
import { getAPIURL } from "@/hooks/apiUtils";
import Link from "next/link";
import Image from "next/image";
const CircularLoader = lazy(
  () => import("@/components/layout/loaders/circular-loader")
);
const Sidebar = lazy(() => import("@/components/layout/main/sidebar"));
import { Button } from "@/components/ui/button";

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
  };

  if (isError) {
    console.error(error);
  }

  return (
    <main>
      <section className="h-screen flex">
        <Suspense fallback={<div>Loading</div>}>
          <Sidebar />
        </Suspense>
        <div className="w-full bg-transparent md:ml-64 lg:ml-64 md:mt-32 lg:mt-32 mt-20 md:p-0 lg:p-0 p-4">
          <section className="w-full">
            <hgroup className="flex items-center gap-2 flex-col">
              <h1 className="text-2xl">Popular Stores</h1>
              <p className="text-sm text-slate-400">
                Find popluar stores that you may like.
              </p>
            </hgroup>
            <div
              id="cards stores"
              className="grid md:grid-cols-3 lg:grid-cols-3 grid-cols-2 gap-4 mt-8 w-full"
            >
              <div
                id="card"
                className="group p-2 w-full bg-zinc-950 flex flex-col gap-3 shadow-lg border border-zinc-800 text-center rounded-lg"
              >
                <div
                  id="img"
                  className="w-full h-full rounded-md overflow-hidden"
                >
                  <Image
                    src="/acme logo.png"
                    width={500}
                    height={500}
                    priority
                    alt="Picture of the author"
                    className="rounded-md w-full h-full object-cover transition-all overflow-hidden group-hover:scale-110"
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
              <h2 className="text-4xl font-semibold">Feeds</h2>
            </hgroup>
            {isPending && (
              <div className="flex items-center justify-center mt-8">
                <CircularLoader />
              </div>
            )}
            <div
              id="feeds popular"
              className="grid md:grid-cols-2 lg:grid-cols-2 grid-cols-1 gap-4 w-full h-full mt-10"
            >
              {!isPending && data && (
                <Suspense fallback={<CircularLoader />}>
                  <Feeds data={data} />
                </Suspense>
              )}
            </div>
            {!isPending && isError && (
              <hgroup>
                <h3 className="text-xl font-semibold text-center">
                  Error: {error.message}
                </h3>
              </hgroup>
            )}
          </section>
        </div>
      </section>
    </main>
  );
}

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
              className="group relative overflow-hidden w-full h-auto rounded-lg"
            >
              <Image
                src={product.imageURL}
                width={500}
                height={500}
                alt={product.name}
                className="w-full h-auto rounded-lg relative transition-all duration-300 group-hover:scale-110"
                priority
                // placeholder="blur"
                // blurDataURL={`data:image/svg+xml;base64,${toBase64(
                //   shimmer(900, 900)
                // )}`}
              />
              <div
                id="card-slick"
                className="bg-black/60 backdrop-blur-md overflow-hidden w-full absolute bottom-[-100%] left-0 p-8 rounded-b-lg border-l-2 border-indigo-600 transition-all duration-300 group-hover:bottom-0"
              >
                <div className="flex justify-between">
                  <div className="flex flex-col gap-4">
                    <hgroup className="flex flex-col gap-2">
                      <h3
                        className="md:text-xl lg:text-xl text-lg text-white"
                        aria-label="Name"
                      >
                        {product.name}
                      </h3>
                      <p className="md:text-sm lg:text-sm text-xs text-gray-400">
                        {description}
                      </p>
                    </hgroup>
                    <div id="btn-f">
                      <Link href={product.checkout} target="_blank">
                        <Button className="bg-indigo-500 hover:bg-indigo-600 flex items-center gap-2">
                          Buy Now
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="w-6 h-6"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z"
                            />
                          </svg>
                        </Button>
                      </Link>
                    </div>
                  </div>
                  <span className="flex items-end justify-end font-bold md:text-3xl lg:text-3xl text-2xl">
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
