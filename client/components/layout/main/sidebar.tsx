import Link from "next/link";
import { lazy } from "react";
import Image from "next/image";
import {
  MousePointer2,
  Store,
  TextSelect,
  UserCheck,
  Compass,
  Bookmark,
  Rss,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
// import CircularLoader from './loaders/circular-loader';
const CircularLoader = lazy(() => import("../loaders/circular-loader"));

const linkClass =
  "flex items-center gap-4 bg-transparent transition-all hover:bg-darklink hover:text-zinc-200 hover:pl-4 p-[0.5rem] rounded-lg";

export default function Sidebar() {
  return (
    <div
      id="sidebar"
      className="fixed z-20 md:block lg:block hidden top-0 left-0 h-full p-10 px-4 w-full max-w-60 bg-darkmid border-r border-zinc-900 overflow-hidden"
    >
      <div id="sidebar-logo"></div>
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
              alt="Picture of the author"
              // loader={() => "./infinite-spinner.png"}
              // blurDataURL="https://source.unsplash.com/random/500x500"
              // placeholder="blur"
              className="rounded-full"
            />{" "}
            Acme Inc
          </Link>
        </div>
      </div>
    </div>
  );
}
