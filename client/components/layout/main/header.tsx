"use client";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import { useUser, useAuth } from "@clerk/nextjs";
import { useClerk } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuGroup,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import {
  CreditCard,
  Keyboard,
  LifeBuoy,
  LogOut,
  Search,
  Settings,
  User,
  Menu,
  Github,
  MousePointer2,
  Store,
  TextSelect,
  UserCheck,
  Compass,
  Bookmark,
  Rss,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { UserProfile } from "@clerk/nextjs";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

const linkClass =
  "flex items-center gap-4 bg-transparent transition-all hover:bg-darklink hover:text-zinc-200 hover:pl-4 p-[0.5rem] rounded-lg";
export default function Header() {
  const { user } = useUser();
  const { isSignedIn } = useAuth();
  const { signOut } = useClerk();
  const [open, setOpen] = useState(false);
  const router = useRouter();

  return (
    <>
      <header className="w-full fixed top-0 z-10 flex md:gap-0 lg:gap-0 gap-3 items-center justify-between bg-zinc-950/50 backdrop-blur-md border-b border-zinc-700 p-8 md:pl-64 lg:pl-64">
        <Sheet>
          <SheetTrigger asChild>
            <div id="harmburger-menu" className="md:hidden lg:hidden block">
              <Menu />
            </div>
          </SheetTrigger>
          <SheetContent
            side={"left"}
            className="bg-darkmid border-r border-zinc-900"
          >
            <div id="links" className="flex flex-col gap-8">
              <div id="link favorite" className="flex flex-col gap-3">
                <Link href="/" className={linkClass}>
                  <TextSelect className="w-5 h-5" /> Feed
                </Link>
                <Link href="/subscribed" className={linkClass}>
                  <UserCheck className="w-5 h-5" /> Subscribed
                </Link>
              </div>
              <Separator className="bg-zinc-700" />
              <div id="link important" className="flex flex-col gap-3">
                <p className="flex items-center font-medium gap-2">
                  You <MousePointer2 className="w-4 h-4" />
                </p>
                <Link href="/store" className={linkClass}>
                  <Store className="w-5 h-5" /> Your store
                </Link>
                <Link href="/products" className={linkClass}>
                  <Compass className="w-5 h-5" /> Explore
                </Link>
                <Link href="/saved" className={linkClass}>
                  <Bookmark className="w-5 h-5" /> Bookmarked
                </Link>
              </div>
              <Separator className="bg-zinc-700" />
              <div id="link subscriptions" className="flex flex-col gap-3">
                <p className="flex items-center font-medium gap-2">
                  Subscriptions <Rss className="w-4 h-4" />
                </p>
                <Link href="/" className={linkClass}>
                  <Image
                    src={"https://source.unsplash.com/random/500x500"}
                    width={30}
                    height={30}
                    alt="Random image from unsplash"
                    className="rounded-full"
                  />{" "}
                  Acme Inc
                </Link>
              </div>
            </div>
          </SheetContent>
        </Sheet>

        <div id="unknown-text" className="md:block lg:block hidden">
          <div className="flex items-center gap-1">
            <div className="flex items-center gap-1">
              <Image
                src="/logo.png"
                width={50}
                height={50}
                alt="ceezar [beta]"
              />
              <span className="font-semibold">Ceezar</span>
            </div>
            <sup className="text-xs font-semibold">[BETA]</sup>
          </div>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <div
              id="input-wrapper"
              className="w-full md:max-w-4xl lg:max-w-4xl relative"
            >
              <Input
                type="text"
                placeholder="Search products..."
                className="border border-zinc-800 bg-zinc-900 cursor-pointer"
                aria-readonly
                aria-label="Search for products"
                title="Search for products"
                readOnly
              />
              <Search className="absolute top-2 right-4 w-5 h-5 text-neutral-500" />
            </div>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] bg-zinc-950/30 backdrop-blur border border-zinc-900">
            <DialogHeader>
              <DialogTitle>Search for products</DialogTitle>
              <DialogDescription className="text-zinc-400 text-sm">
                Lookup a product by name. Hit enter or click the search button
                to bring up the results.
              </DialogDescription>
            </DialogHeader>
            <Separator className="bg-zinc-800" />
            <div id="input-wrapper" className="flex items-center gap-3">
              <Input
                type="text"
                placeholder="Search for products"
                className="border border-zinc-800 bg-zinc-950 p-5"
                onKeyUp={(e) => {
                  if (e.key === "Enter") {
                    toast.info("Search feature coming soon", {
                      position: "top-center",
                      action: {
                        label: "Close",
                        onClick: () => console.log("Toast dismissed"),
                      },
                    });
                  }
                }}
              />
              <Button
                className="bg-white text-black hover:bg-zinc-200"
                onClick={() => {
                  toast.info("Search feature coming soon", {
                    position: "top-center",
                    action: {
                      label: "Close",
                      onClick: () => console.log("Toast dismissed"),
                    },
                  });
                }}
              >
                Search
              </Button>
            </div>
          </DialogContent>
        </Dialog>
        {isSignedIn && user && (
          <div id="profile" className="bg-indigo-500 rounded-full p-px">
            <DropdownMenu>
              <DropdownMenuTrigger asChild className="cursor-pointer">
                <Image
                  src={user.imageUrl ?? "/acme logo.png"}
                  width={32}
                  height={32}
                  alt={user.username ?? "acme logo"}
                  className="rounded-full w-auto h-auto"
                />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 bg-zinc-950">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <p className="text-xs pl-2 text-zinc-400 ">
                  {user.emailAddresses[0].emailAddress}
                </p>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <Link href="#profile" onClick={() => setOpen(true)}>
                    <DropdownMenuItem className="cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </DropdownMenuItem>
                  </Link>
                  <Link href="/billing" className="pointer-events-none">
                    <DropdownMenuItem className="cursor-pointer" disabled>
                      <CreditCard className="mr-2 h-4 w-4" />
                      <span>Billing</span>
                    </DropdownMenuItem>
                  </Link>
                  <Link href="/settings">
                    <DropdownMenuItem className="cursor-pointer">
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Settings</span>
                    </DropdownMenuItem>
                  </Link>
                  <DropdownMenuItem className="cursor-pointer" disabled>
                    <Keyboard className="mr-2 h-4 w-4" />
                    <span>Keyboard shortcuts</span>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <Link href="https://www.patreon.com/DevKid" target="_blank">
                    <DropdownMenuItem className="cursor-pointer">
                      <LifeBuoy className="mr-2 h-4 w-4" />
                      <span>Support</span>
                    </DropdownMenuItem>
                  </Link>
                  <Link
                    href="https://github.com/creative-tutorials/ceezar"
                    target="_blank"
                  >
                    <DropdownMenuItem className="cursor-pointer">
                      <Github className="mr-2 h-4 w-4" />
                      <span>GitHub</span>
                    </DropdownMenuItem>
                  </Link>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={() => signOut(() => router.push("/"))}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </header>
      {isSignedIn && user && (
        <ProfileComponent open={open} setOpen={setOpen} router={router} />
      )}
    </>
  );
}

type ProfileProps = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  router: AppRouterInstance;
};

function ProfileComponent(props: ProfileProps) {
  return (
    <section
      id="profile-wrapper"
      onClick={() => {
        props.setOpen(false); // close profile modal
        props.router.back(); // go back to previous page
      }}
      className={
        props.open
          ? "fixed transition-all duration-200 opacity-100 pointer-events-auto z-30 md:pt-0 lg:pt-0 pt-24 flex items-center justify-center top-0 w-full h-full bg-black/30 backdrop-blur"
          : "fixed transition-all duration-200 opacity-0 pointer-events-none z-30 md:pt-0 lg:pt-0 pt-24 flex items-center justify-center top-0 w-full h-full bg-black/30 backdrop-blur"
      }
    >
      <div
        className="h-full overflow-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <UserProfile routing="hash" />
      </div>
    </section>
  );
}
