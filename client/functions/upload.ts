import { ChangeEvent, Dispatch, SetStateAction } from "react";
import { toast } from "sonner";
import { createClient } from "@supabase/supabase-js";

type UploadProp = {
  event: ChangeEvent<HTMLInputElement>;
  setFileData: Dispatch<
    SetStateAction<{
      imageURL: string;
      isUploading: boolean;
    }>
  >;
};

const supabaseConfig = {
  url: process.env.NEXT_PUBLIC_PROJECT_URL as string,
  clientKey: process.env.NEXT_PUBLIC_CLIENT_API_KEY as string,
};

const supabase = createClient(supabaseConfig.url, supabaseConfig.clientKey);

export const createUpload = async ({ event, setFileData }: UploadProp) => {
  const files = event.target.files; // FileList object

  if (!files) {
    setFileData((prev) => {
      return {
        ...prev,
        isUploading: false,
      };
    });
    return;
  }

  setFileData((prev) => {
    return {
      ...prev,
      isUploading: true,
    };
  });

  const file = files[0];

  const { data, error } = await supabase.storage
    .from("stores")
    .upload(`photos/${file.name}`, file, {
      cacheControl: "3600",
      upsert: true,
    });

  if (error) {
    console.error(error);
    event.target.value = "";
    return;
  }

  await updateImageURL(file.name)
    .then((url) => {
      setFileData((prev) => {
        return {
          ...prev,
          imageURL: url,
          isUploading: false,
        };
      });
      toast.success("201 - Created", {
        description: "Image uploaded successfully",
        action: {
          label: "Close",
          onClick: () => console.log("Toast dismissed"),
        },
      });
      event.target.value = "";
    })
    .catch((err) => {
      console.error(err);
    });
};

const updateImageURL = async (fileName: string) => {
  const { data } = supabase.storage
    .from("stores")
    .getPublicUrl(`photos/${fileName}`);

  if (!data) {
    throw new Error("Erorr while updating image URL");
  }

  const publicURL = data.publicUrl as string;

  return publicURL;
};
