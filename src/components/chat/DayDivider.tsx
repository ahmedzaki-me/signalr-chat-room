import { Separator } from "@/components/ui/separator";

export function DayDivider({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3 px-5 py-3">
      <Separator className="flex-1" />
      <span className="shrink-0 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </span>
      <Separator className="flex-1" />
    </div>
  );
}
