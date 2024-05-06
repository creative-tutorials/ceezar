"use client";
import axios from "axios";
import { env } from "@/env";
import { useAuth, useUser } from "@clerk/nextjs";
import { getAPIURL } from "@/hooks/apiUtils";

/**
 * The function `fetchProducts` asynchronously fetches product data from an API using Axios with
 * specific headers and returns the data if the response status is 200.
 * @returns If the conditions `!isLoaded` or `!userId` are met, `null` will be returned. Otherwise, if
 * the API call is successful and the response status is 200, the data from the response will be
 * returned. If there is an error during the API call, the error will be logged and rethrown.
 */
export const fetchProducts = async () => {
  const { isLoaded, isSignedIn, userId } = useAuth();
  const { user } = useUser();
  const apiurl = getAPIURL();

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
