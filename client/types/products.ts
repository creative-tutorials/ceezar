import { Dispatch, SetStateAction } from "react";

export type ProductInfo = {
  id: string;
  productID: string;
  name: string;
  description: string;
  price: number;
  code: string;
};

export type ProductsTableData = {
  products: ProductInfo[];
  apiUrl: "http://localhost:8080" | "https://ceezar-server.vercel.app";
  isLoaded: boolean;
  userId: string | null | undefined;
  editButtonRef?: React.RefObject<HTMLButtonElement>;
  setPID: Dispatch<SetStateAction<string>>;
  isSignedIn: boolean;
  email: string;
};
