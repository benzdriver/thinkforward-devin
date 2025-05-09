import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";

const formFieldVariants = cva("space-y-2", {
  variants: {
    layout: {
      vertical: "space-y-2",
      horizontal: "sm:flex sm:items-start sm:gap-4",
      inline: "flex items-center gap-3",
    },
    labelWidth: {
      auto: "",
      sm: "sm:w-24",
      md: "sm:w-32",
      lg: "sm:w-40",
      xl: "sm:w-48",
    },
  },
  defaultVariants: {
    layout: "vertical",
    labelWidth: "auto",
  },
});

const formLabelVariants = cva("block text-sm font-medium text-foreground", {
  variants: {
    size: {
      sm: "text-xs",
      md: "text-sm",
      lg: "text-base",
    },
    required: {
      true: "after:content-['*'] after:ml-0.5 after:text-destructive-500",
      false: "",
    },
    disabled: {
      true: "opacity-50 cursor-not-allowed",
      false: "",
    },
    layout: {
      vertical: "",
      horizontal: "sm:pt-1.5",
      inline: "pt-0",
    },
  },
  defaultVariants: {
    size: "md",
    required: false,
    disabled: false,
    layout: "vertical",
  },
});

const formDescriptionVariants = cva("text-sm text-neutral-500", {
  variants: {
    size: {
      sm: "text-xs",
      md: "text-sm",
      lg: "text-base",
    },
    disabled: {
      true: "opacity-50",
      false: "",
    },
  },
  defaultVariants: {
    size: "md",
    disabled: false,
  },
});

const formMessageVariants = cva("text-sm", {
  variants: {
    variant: {
      error: "text-destructive-500",
      warning: "text-warning-500",
      success: "text-success-500",
      info: "text-info-500",
    },
    size: {
      sm: "text-xs",
      md: "text-sm",
      lg: "text-base",
    },
    icon: {
      true: "flex items-center gap-1",
      false: "",
    },
  },
  defaultVariants: {
    variant: "error",
    size: "md",
    icon: false,
  },
});

export interface FormFieldProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof formFieldVariants> {
  id: string;
  label?: React.ReactNode;
  labelFor?: string;
  description?: React.ReactNode;
  message?: React.ReactNode;
  messageVariant?: VariantProps<typeof formMessageVariants>["variant"];
  messageIcon?: React.ReactNode;
  required?: boolean;
  disabled?: boolean;
  labelSize?: VariantProps<typeof formLabelVariants>["size"];
  descriptionSize?: VariantProps<typeof formDescriptionVariants>["size"];
  messageSize?: VariantProps<typeof formMessageVariants>["size"];
  hideLabel?: boolean;
  hideMessage?: boolean;
  hideDescription?: boolean;
}

const FormField = React.forwardRef<HTMLDivElement, FormFieldProps>(
  (
    {
      id,
      className,
      children,
      label,
      labelFor = id,
      description,
      message,
      messageVariant = "error",
      messageIcon,
      required = false,
      disabled = false,
      layout = "vertical",
      labelWidth = "auto",
      labelSize = "md",
      descriptionSize = "md",
      messageSize = "md",
      hideLabel = false,
      hideMessage = false,
      hideDescription = false,
      ...props
    },
    ref
  ) => {
    const fieldId = id;
    const descriptionId = `${fieldId}-description`;
    const messageId = `${fieldId}-message`;
    
    const hasMessage = !!message && !hideMessage;
    const hasDescription = !!description && !hideDescription;
    
    return (
      <div
        ref={ref}
        className={cn(formFieldVariants({ layout, labelWidth }), className)}
        {...props}
      >
        {!hideLabel && label && (
          <div className={layout === "horizontal" ? labelWidth || undefined : undefined}>
            <label
              htmlFor={labelFor}
              className={cn(
                formLabelVariants({
                  size: labelSize,
                  required,
                  disabled,
                  layout,
                })
              )}
            >
              {label}
            </label>
          </div>
        )}
        
        <div className="flex-1">
          <div
            className={cn({
              "flex flex-col gap-1": hasDescription || hasMessage,
            })}
          >
            {React.isValidElement(children)
              ? React.cloneElement(children as React.ReactElement<any>, {
                  id: fieldId,
                  "aria-describedby": hasDescription ? descriptionId : undefined,
                  "aria-invalid": hasMessage ? true : undefined,
                  "aria-errormessage": hasMessage ? messageId : undefined,
                  disabled: disabled || (children as React.ReactElement<any>).props.disabled,
                  required: required || (children as React.ReactElement<any>).props.required,
                })
              : children}
              
            {hasDescription && (
              <p
                id={descriptionId}
                className={cn(
                  formDescriptionVariants({
                    size: descriptionSize,
                    disabled,
                  })
                )}
              >
                {description}
              </p>
            )}
            
            {hasMessage && (
              <p
                id={messageId}
                className={cn(
                  formMessageVariants({
                    variant: messageVariant,
                    size: messageSize,
                    icon: !!messageIcon,
                  })
                )}
                role="alert"
              >
                {messageIcon && <span className="shrink-0">{messageIcon}</span>}
                <span>{message}</span>
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }
);
FormField.displayName = "FormField";

export { FormField, formFieldVariants, formLabelVariants, formDescriptionVariants, formMessageVariants };
