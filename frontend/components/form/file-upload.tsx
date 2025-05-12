import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";

const fileUploadVariants = cva(
  "relative flex flex-col items-center justify-center w-full rounded-lg border-2 border-dashed border-secondary-300 bg-white transition-colors",
  {
    variants: {
      variant: {
        default: "hover:bg-secondary-50",
        filled: "bg-secondary-50 hover:bg-secondary-100",
        outline: "border-secondary-400 hover:border-primary-400 hover:bg-secondary-50",
        ghost: "border-transparent bg-transparent hover:bg-secondary-50",
      },
      size: {
        sm: "p-2 min-h-[100px]",
        md: "p-4 min-h-[150px]",
        lg: "p-6 min-h-[200px]",
      },
      disabled: {
        true: "opacity-50 cursor-not-allowed",
        false: "",
      },
      error: {
        true: "border-destructive-300 bg-destructive-50 hover:bg-destructive-100",
        false: "",
      },
      success: {
        true: "border-success-300 bg-success-50 hover:bg-success-100",
        false: "",
      },
      isDragging: {
        true: "border-primary-400 bg-primary-50",
        false: "",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
      disabled: false,
      error: false,
      success: false,
      isDragging: false,
    },
  }
);

const fileItemVariants = cva(
  "flex items-center justify-between w-full p-2 mt-2 rounded-md border",
  {
    variants: {
      variant: {
        default: "border-secondary-200 bg-white",
        error: "border-destructive-200 bg-destructive-50",
        success: "border-success-200 bg-success-50",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface FileUploadProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size" | "value" | "onChange" | "disabled" | "error" | "success"> {
  variant?: VariantProps<typeof fileUploadVariants>["variant"];
  size?: VariantProps<typeof fileUploadVariants>["size"];
  disabled?: boolean;
  error?: boolean;
  success?: boolean;
  isDragging?: boolean;
  icon?: React.ReactNode;
  label?: React.ReactNode;
  description?: React.ReactNode;
  errorMessage?: string;
  successMessage?: string;
  value?: File | File[];
  onChange?: (files: File | File[] | null) => void;
  onRemove?: (file: File) => void;
  maxFiles?: number;
  maxSize?: number; // in bytes
  acceptedFileTypes?: string[];
  showFileList?: boolean;
  dropzoneProps?: React.HTMLAttributes<HTMLDivElement>;
  renderFile?: (file: File, onRemove: () => void) => React.ReactNode;
}

const FileUpload = React.forwardRef<HTMLInputElement, FileUploadProps>(
  (
    {
      className,
      variant,
      size,
      disabled,
      error,
      success,
      isDragging,
      icon,
      label,
      description,
      errorMessage,
      successMessage,
      value,
      onChange,
      onRemove,
      maxFiles = 1,
      maxSize,
      acceptedFileTypes,
      showFileList = true,
      dropzoneProps,
      renderFile,
      id,
      ...props
    },
    ref
  ) => {
    const [dragOver, setDragOver] = React.useState(false);
    const [files, setFiles] = React.useState<File[]>([]);
    const [validationError, setValidationError] = React.useState<string | null>(null);
    const fileInputRef = React.useRef<HTMLInputElement>(null);
    
    React.useEffect(() => {
      if (value) {
        if (Array.isArray(value)) {
          setFiles(value);
        } else {
          setFiles([value]);
        }
      } else {
        setFiles([]);
      }
    }, [value]);
    
    const hasError = error || !!validationError || !!errorMessage;
    const hasSuccess = success || !!successMessage;
    
    const validateFiles = (filesToValidate: File[]): boolean => {
      if (maxFiles && filesToValidate.length > maxFiles) {
        setValidationError(`最多只能上传 ${maxFiles} 个文件`);
        return false;
      }
      
      if (acceptedFileTypes && acceptedFileTypes.length > 0) {
        const invalidFiles = filesToValidate.filter(
          (file) => !acceptedFileTypes.some((type) => {
            if (type.startsWith(".")) {
              return file.name.toLowerCase().endsWith(type.toLowerCase());
            }
            return file.type.match(new RegExp(type.replace("*", ".*")));
          })
        );
        
        if (invalidFiles.length > 0) {
          setValidationError(
            `不支持的文件类型: ${invalidFiles.map((f) => f.name).join(", ")}`
          );
          return false;
        }
      }
      
      if (maxSize) {
        const oversizedFiles = filesToValidate.filter((file) => file.size > maxSize);
        if (oversizedFiles.length > 0) {
          const maxSizeMB = (maxSize / (1024 * 1024)).toFixed(2);
          setValidationError(
            `文件大小超过限制 (${maxSizeMB}MB): ${oversizedFiles
              .map((f) => f.name)
              .join(", ")}`
          );
          return false;
        }
      }
      
      setValidationError(null);
      return true;
    };
    
    const handleFileChange = (selectedFiles: FileList | null) => {
      if (!selectedFiles || selectedFiles.length === 0) return;
      
      const newFiles = Array.from(selectedFiles);
      const allFiles = maxFiles === 1 ? newFiles : [...files, ...newFiles].slice(0, maxFiles);
      
      if (validateFiles(allFiles)) {
        setFiles(allFiles);
        
        if (onChange) {
          onChange(maxFiles === 1 ? allFiles[0] : allFiles);
        }
      }
    };
    
    const handleRemoveFile = (fileToRemove: File) => {
      const updatedFiles = files.filter((f) => f !== fileToRemove);
      setFiles(updatedFiles);
      
      if (onRemove) {
        onRemove(fileToRemove);
      }
      
      if (onChange) {
        if (updatedFiles.length === 0) {
          onChange(null);
        } else {
          onChange(maxFiles === 1 ? updatedFiles[0] : updatedFiles);
        }
      }
      
      setValidationError(null);
    };
    
    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      if (!disabled) {
        setDragOver(true);
      }
    };
    
    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setDragOver(false);
    };
    
    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setDragOver(false);
      
      if (!disabled && e.dataTransfer.files) {
        handleFileChange(e.dataTransfer.files);
      }
    };
    
    const handleClick = () => {
      if (!disabled && fileInputRef.current) {
        fileInputRef.current.click();
      }
    };
    
    const defaultIcon = (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-secondary-500"
      >
        <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242" />
        <path d="M12 12v9" />
        <path d="m16 16-4-4-4 4" />
      </svg>
    );
    
    const renderDefaultFile = (file: File, onRemove: () => void) => (
      <div
        key={`${file.name}-${file.size}`}
        className={cn(fileItemVariants({ variant: hasError ? "error" : hasSuccess ? "success" : "default" }))}
      >
        <div className="flex items-center space-x-2 overflow-hidden">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="flex-shrink-0 text-secondary-500"
          >
            <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
            <polyline points="14 2 14 8 20 8" />
          </svg>
          <span className="truncate text-sm">{file.name}</span>
          <span className="text-xs text-secondary-500">
            {(file.size / 1024).toFixed(0)} KB
          </span>
        </div>
        <button
          type="button"
          onClick={onRemove}
          className="ml-2 text-secondary-500 hover:text-destructive-500 focus:outline-none"
          disabled={disabled}
          aria-label="移除文件"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
          </svg>
        </button>
      </div>
    );
    
    return (
      <div className="w-full">
        <div
          className={cn(
            fileUploadVariants({
              variant,
              size,
              disabled,
              error: hasError,
              success: hasSuccess,
              isDragging: dragOver || isDragging,
            }),
            className
          )}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={handleClick}
          {...dropzoneProps}
        >
          <input
            type="file"
            className="sr-only"
            ref={(node) => {
              if (typeof ref === "function") {
                ref(node);
              } else if (ref) {
                ref.current = node;
              }
              fileInputRef.current = node;
            }}
            onChange={(e) => handleFileChange(e.target.files)}
            disabled={disabled}
            multiple={maxFiles > 1}
            accept={acceptedFileTypes?.join(",")}
            id={id}
            {...props}
          />
          
          <div className="flex flex-col items-center justify-center text-center p-4">
            {icon || defaultIcon}
            
            {label && (
              <p className="mt-2 text-sm font-medium text-foreground">{label}</p>
            )}
            
            {description && (
              <p className="mt-1 text-xs text-secondary-500">{description}</p>
            )}
            
            <button
              type="button"
              className="mt-2 inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-md bg-primary-50 text-primary-600 hover:bg-primary-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-400"
              onClick={(e) => {
                e.stopPropagation();
                handleClick();
              }}
              disabled={disabled}
            >
              选择文件
              {maxFiles > 1 ? "们" : ""}
            </button>
          </div>
        </div>
        
        {validationError && (
          <p className="mt-1 text-xs text-destructive-500">{validationError}</p>
        )}
        
        {errorMessage && !validationError && (
          <p className="mt-1 text-xs text-destructive-500">{errorMessage}</p>
        )}
        
        {successMessage && !hasError && (
          <p className="mt-1 text-xs text-success-500">{successMessage}</p>
        )}
        
        {showFileList && files.length > 0 && (
          <div className="mt-2 space-y-2">
            {files.map((file) =>
              renderFile
                ? renderFile(file, () => handleRemoveFile(file))
                : renderDefaultFile(file, () => handleRemoveFile(file))
            )}
          </div>
        )}
      </div>
    );
  }
);
FileUpload.displayName = "FileUpload";

export { FileUpload, fileUploadVariants, fileItemVariants };
