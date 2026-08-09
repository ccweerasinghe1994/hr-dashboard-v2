import { Skeleton } from "@/components/ui/skeleton";

export default function OrganizationLoading() {
  return (
    <output
      className="flex flex-col gap-8"
      aria-label="Loading organization settings"
    >
      <div className="flex flex-col gap-3">
        <Skeleton className="h-4 w-36" />
        <Skeleton className="h-9 w-72" />
        <Skeleton className="h-5 w-full max-w-xl" />
      </div>
      <Skeleton className="h-80 w-full" />
      <Skeleton className="h-72 w-full" />
    </output>
  );
}
