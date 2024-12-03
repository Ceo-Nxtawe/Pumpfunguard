import { cn } from "@/lib/utils";

export function BackgroundGradient({ className }: { className?: string }) {
  return (
    <div className="fixed inset-0 -z-10">
      <div className={cn(
        "absolute inset-0 bg-grid-white opacity-10",
        className
      )} />
      <div className="absolute inset-0 bg-gradient-to-tr from-background via-background/90 to-background/80" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background" />
      <div className="absolute left-1/3 top-1/4 -translate-y-1/2 translate-x-1/2">
        <div className="h-[400px] w-[400px] bg-violet-500/30 blur-[100px]" />
      </div>
      <div className="absolute right-1/3 bottom-1/4 translate-y-1/2 -translate-x-1/2">
        <div className="h-[400px] w-[400px] bg-blue-500/30 blur-[100px]" />
      </div>
    </div>
  );
}