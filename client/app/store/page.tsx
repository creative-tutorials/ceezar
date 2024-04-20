"use client";
import { useSearchParams } from "next/navigation";
import { env } from "@/env";
import { useAuth, useUser } from "@clerk/nextjs";
import axios from "axios";
import { lazy, Suspense } from "react";
import { getAPIURL } from "@/hooks/apiUtils";
const CircularLoader = lazy(
  () => import("@/components/layout/loaders/circular-loader")
);
const ProfileFormView = lazy(() => import("@/components/layout/profileView"));
const Dashboard = lazy(() => import("@/components/layout/dashboard/dashboard"));
import { useQuery } from "@tanstack/react-query";

export default function Page() {
  const { isLoaded, isSignedIn, userId } = useAuth();
  const { user } = useUser();
  const apiurl = getAPIURL();
  const searchParams = useSearchParams();

  const tab = searchParams.get("tab");

  const { isPending, error, data, isError } = useQuery({
    queryKey: ["store"],
    queryFn: async () => await fetchStoreProfile(),
  });

  async function fetchStoreProfile() {
    if (!isLoaded || !userId || !isSignedIn) {
      return null;
    }
    try {
      const response = await axios.get(`${apiurl}/user/store`, {
        headers: {
          "Content-Type": "application/json",
          apikey: env.NEXT_PUBLIC_NODE_API_KEY,
          userid: userId,
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

  if (isPending) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <CircularLoader />
      </div>
    );
  }

  if (isError) {
    console.error(error);
  }

  return (
    <main>
      {data && (
        <Suspense fallback={<CircularLoader />}>
          <Dashboard store={data} />
        </Suspense>
      )}
      {isError && (
        <Suspense fallback={<CircularLoader />}>
          <ProfileFormView message={error.message} />
        </Suspense>
      )}
    </main>
  );
}
