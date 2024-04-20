import { lazy, useState } from "react";
import axios from "axios";
import { env } from "@/env";
const BubbleLoader = lazy(() => import("./loaders/bubble-loader"));
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useUser, useAuth } from "@clerk/nextjs";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function ProfileFormView(props: { message: string }) {
  const { isLoaded, isSignedIn, userId } = useAuth();
  const { user } = useUser();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });
  const [isDisabled, setIsDisabled] = useState(false);
  const createStore = async () => {
    if (!isLoaded || !userId || !isSignedIn) {
      return null;
    }
    try {
      setIsDisabled(true);
      const response = await axios.post(
        "http://localhost:8080/store",
        {
          name: formData.name,
          description: formData.description,
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

      return response.data;
    } catch (error: any) {
      console.error(error);
      const { data } = error.response;
      throw new Error(data.error);
    }
  };

  const mutation = useMutation({
    mutationFn: createStore,
    onSuccess: () => {
      toast.success("201 - Created", {
        description: "Store created successfully",
        action: {
          label: "Close",
          onClick: () => console.log("Toast dismissed"),
        },
      });
      queryClient.invalidateQueries({ queryKey: ["store"] }); // refetch store
    },
    onError: async (err: any) => {
      setIsDisabled(false);
      toast.error("Error creating store", {
        description: err,
        action: {
          label: "Close",
          onClick: () => console.log("Toast dismissed"),
        },
      });
    },
  });

  return (
    <section className="flex items-center justify-center flex-col text-center min-h-screen gap-6 md:p-0 lg:p-0 p-8">
      <div id="content" className="flex flex-col gap-4">
        <hgroup>
          <h3 className="text-2xl font-semibold">Error: {props.message}</h3>
        </hgroup>
        <Dialog>
          <DialogTrigger asChild>
            {props.message.includes("create") && (
              <Button className=" p-6 text-base bg-indigo-500 hover:bg-indigo-600 shadow-xs hover:shadow-black">
                Create Store
              </Button>
            )}
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] bg-zinc-950 border border-zinc-900">
            <DialogHeader>
              <DialogTitle>Create Store</DialogTitle>
              <DialogDescription>
                Fill in the details to create your store.
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
                <Label htmlFor="username" className="text-right">
                  Description
                </Label>
                <Textarea
                  placeholder="Acme Labs is a digital store..."
                  disabled={isDisabled}
                  value={formData.description}
                  className="col-span-3 border border-zinc-800 max-h-52 placeholder:text-zinc-300"
                  autoComplete="off"
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                type="submit"
                className="bg-zinc-900 hover:bg-zinc-800"
                onClick={() => {
                  mutation.mutate();
                }}
                disabled={isDisabled}
              >
                {isDisabled ? <BubbleLoader /> : <>Create Store</>}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
}
