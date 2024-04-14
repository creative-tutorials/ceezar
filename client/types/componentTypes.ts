import { CountryCode } from "@/hooks/country-codes";
import { ProductData, ImageData } from "./formProps";
import { Dispatch, RefObject, SetStateAction } from "react";
export type DashboardProps = {
  store: {
    name: string;
    description: string;
    totalLikes: number;
    totalProducts: number;
    reputations: number;
    imageURL: string;
  };
};
export type TDialogProp = {
  codes: CountryCode;
  editButtonRef: RefObject<HTMLButtonElement>;
  pID: string;
  fileData: ImageData;
  setFileData: Dispatch<SetStateAction<ImageData>>;
  productForm: ProductData;
  setProductForm: Dispatch<SetStateAction<ProductData>>;
  setIsDisabled: Dispatch<SetStateAction<boolean>>;
  isDisabled: boolean;
};
