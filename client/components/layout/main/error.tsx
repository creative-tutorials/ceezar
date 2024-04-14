import { Separator } from "@/components/ui/separator";

type ErrorProps = {
  message: string;
};

export function ErrorComponent(props: ErrorProps) {
  return (
    <div className="flex items-center justify-center">
      <hgroup className="flex items-center gap-1">
        <h1 className="text-xl font-semibold">Error</h1>
        {/* <span>|</span> */}
        <Separator className="h-px rotate-90 bg-zinc-500 w-10" />
        <p className="font-light">{props.message}</p>
      </hgroup>
    </div>
  );
}
