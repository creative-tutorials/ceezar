"use client";
import { useAuth } from "@clerk/nextjs";

export default function Footer() {
  const { isSignedIn } = useAuth();
  return (
    <>
      {!isSignedIn && (
        <footer className="w-full fixed bottom-0 bg-zinc-900 p-10 md:px-10 lg:px-10">
          <hgroup className="">
            <h3 className="md:text-2xl lg:text-2xl text-xl font-semibold text-white">
              Please sign in
            </h3>
            <p className="text-sm text-zinc-400">Sign in to see your feed</p>
          </hgroup>
        </footer>
      )}
    </>
  );
}
