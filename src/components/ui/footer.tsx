import { cn } from "@/lib/utils";

export function Footer({ className }: { className?: string }) {
  return (
    <footer className={cn("border-t", className)}>
      <div className="container flex flex-col items-center justify-center gap-4 py-10 md:h-24 md:py-0">
        <div className="flex flex-col items-center gap-4 px-8 md:gap-2 md:px-0">
          <p className="text-center text-sm leading-loose text-muted-foreground">
            OSA — Organizational Service Accounting
          </p>
          <p className="text-center text-sm leading-loose text-muted-foreground">
            Built with care for those who serve. All rights reserved ©{" "}
            {new Date().getFullYear()}
          </p>
        </div>
      </div>
    </footer>
  );
}
