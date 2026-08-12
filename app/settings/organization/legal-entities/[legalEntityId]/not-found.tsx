import { Building2Icon } from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { cn } from "@/lib/utils";

export default function LegalEntityNotFound() {
  return (
    <Empty className="border">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <Building2Icon aria-hidden="true" />
        </EmptyMedia>
        <EmptyTitle>Legal entity not found</EmptyTitle>
        <EmptyDescription>
          This record does not exist in the active organization or you cannot
          access it.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Link href="/settings/organization" className={cn(buttonVariants())}>
          Return to organization
        </Link>
      </EmptyContent>
    </Empty>
  );
}
