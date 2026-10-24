import * as React from "react"
import { cn } from "@/lib/utils"

const Textarea = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <textarea
      className={cn(
        "flex min-h-[80px] w-full rounded-xl border border-input/80 bg-background/80 px-3.5 py-2.5 text-sm text-foreground shadow-2xs backdrop-blur-xs placeholder:text-muted-foreground/70",
        "transition-[border-color,box-shadow,background-color] duration-140 ease-emil-out",
        "focus-visible:outline-none focus-visible:border-primary/80 focus-visible:ring-3 focus-visible:ring-primary/15",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      ref={ref}
      {...props}
    />
  )
})
Textarea.displayName = "Textarea"

export { Textarea }
