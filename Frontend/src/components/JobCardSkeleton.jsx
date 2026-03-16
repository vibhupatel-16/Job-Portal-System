import React from "react";
import { Skeleton } from "./ui/skeleton";

export function JobCardSkeleton() {
  return (
    <div className="p-6 rounded-2xl bg-white border border-gray-100 shadow-sm">
      <div className="flex justify-between items-start">
        <div>
          <Skeleton className="h-5 w-32 mb-2" />
          <Skeleton className="h-3 w-24" />
        </div>
        <Skeleton className="h-9 w-9 rounded-full" />
      </div>
      <Skeleton className="h-6 w-3/4 mt-4" />
      <Skeleton className="h-4 w-full mt-2" />
      <Skeleton className="h-4 w-2/3 mt-2" />
      <div className="flex gap-2 mt-5">
        <Skeleton className="h-6 w-20 rounded-full" />
        <Skeleton className="h-6 w-16 rounded-full" />
        <Skeleton className="h-6 w-14 rounded-full" />
      </div>
    </div>
  );
}

export default JobCardSkeleton;
