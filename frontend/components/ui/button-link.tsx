import * as React from "react";
import Link from "next/link";
import { buttonVariants, type ButtonProps } from "./button";
import { cn } from "../../lib/utils";

export interface ButtonLinkProps
  extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "color"> {
  href: string;
  variant?: ButtonProps["variant"];
  size?: ButtonProps["size"];
  fullWidth?: ButtonProps["fullWidth"];
  className?: string;
}

const ButtonLink = React.forwardRef<HTMLAnchorElement, ButtonLinkProps>(
  ({ className, variant, size, href, children, ...props }, ref) => {
    return (
      <Link 
        href={href}
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      >
        {children}
      </Link>
    );
  }
);
ButtonLink.displayName = "ButtonLink";

export { ButtonLink };
