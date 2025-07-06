import { cn } from "@/lib/utils"

export function Footer({ className }: { className?: string }) {
  return (
    <footer className={cn("border-t", className)}>
      <div className="container flex flex-col items-center justify-center gap-4 py-10 md:h-24 md:py-0">
        <div className="flex flex-col items-center gap-4 px-8 md:gap-2 md:px-0">
          <p className="text-center text-sm leading-loose text-muted-foreground">
            WASP — Wartime Accounting of Service Personnel
          </p>
          <p className="text-center text-sm leading-loose text-muted-foreground">
            Built with care for those who serve. All rights reserved © {new Date().getFullYear()}
          </p>
          <a 
            href="https://github.com/HELHokage" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-center text-sm leading-loose text-muted-foreground hover:text-primary transition-colors"
          >
            GitHub: @HELHokage
          </a>
        </div>
      </div>
    </footer>
  )
}