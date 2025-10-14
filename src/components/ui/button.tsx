import { cva, type VariantProps } from "class-variance-authority";
import clsx from "clsx";
import Link from "next/link";
import React from "react";

const buttonVariants = cva(
    "flex items-center justify-center rounded-lg font-medium cursor-pointer py-3 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2",
    {
        variants: {
            variant: {
                primary:
                    "bg-green-400 text-white hover:bg-green-500 focus-visible:outline-green-500 active:bg-green-600",
                outline:
                    "border-2 border-white text-white hover:bg-green-800 active:bg-green-900",
                cancel: "text-white bg-red-600 hover:bg-red-700",
            },
            size: {
                sm: "w-25 text-base",
                md: "w-xs text-lg",
                lg: "w-113 text-lg",
            },
        },
        defaultVariants: {
            variant: "primary",
            size: "md",
        },
    }
);

interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
        VariantProps<typeof buttonVariants> {
    href?: string;
    children: React.ReactNode;
}

export default function Button({
    href,
    children,
    className,
    variant,
    size,
    ...props
}: ButtonProps) {
    const classes = clsx(buttonVariants({ variant, size }), className);

    if (href) {
        return (
            <Link href={href} className={classes}>
                {children}
            </Link>
        );
    }

    return (
        <button {...props} className={classes}>
            {children}
        </button>
    );
}
