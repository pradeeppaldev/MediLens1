import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-[transform,background-color,border-color,color,box-shadow,opacity] duration-160 ease-emil-out active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 disabled:pointer-events-none disabled:opacity-50 select-none [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 will-change-transform",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-sm hover:bg-primary/95 hover:shadow active:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90 hover:shadow active:bg-destructive/80",
        outline:
          "border border-border/80 bg-background/80 backdrop-blur-sm shadow-xs hover:bg-muted/80 hover:text-foreground hover:border-border active:bg-muted",
        secondary:
          "bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/90 active:bg-secondary/80",
        ghost:
          "hover:bg-muted/70 hover:text-foreground active:bg-muted",
        link:
          "text-primary underline-offset-4 hover:underline active:scale-100",
        glass:
          "bg-background/60 backdrop-blur-md border border-border/60 shadow-xs hover:bg-background/90 hover:border-border active:bg-background/70 text-foreground",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-11 rounded-xl px-6 text-base font-semibold",
        icon: "h-9 w-9 p-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

const Button = React.forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "button"
  return (
    <Comp
      className={cn(buttonVariants({ variant, size, className }))}
      ref={ref}
      {...props}
    />
  )
})
Button.displayName = "Button"

export { Button, buttonVariants }
