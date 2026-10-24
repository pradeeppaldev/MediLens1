import * as React from "react"
import { cn } from "@/lib/utils"

const Input = React.forwardRef(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(
        "flex h-10 w-full rounded-xl border border-input/80 bg-background/80 px-3.5 py-2 text-sm text-foreground shadow-2xs backdrop-blur-xs placeholder:text-muted-foreground/70",
        "transition-[border-color,box-shadow,background-color] duration-140 ease-emil-out",
        "focus-visible:outline-none focus-visible:border-primary/80 focus-visible:ring-3 focus-visible:ring-primary/15",
        "disabled:cursor-not-allowed disabled:opacity-50 file:border-0 file:bg-transparent file:text-sm file:font-medium",
        className
      )}
      ref={ref}
      {...props}
    />
  )
})
Input.displayName = "Input"

export { Input }
