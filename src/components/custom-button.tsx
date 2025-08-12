import { Button as HeroUIButton } from "@heroui/react";
import type { ButtonProps } from "@heroui/react";
import { ReactNode } from "react";

interface CustomButtonProps extends ButtonProps {
  children: ReactNode;
  className?: string;
}

function CustomButton({
  children,
  variant = "bordered",
  className = "",
  ...props
}: CustomButtonProps) {
  return (
    <HeroUIButton
      variant={variant}
      className={`font-manrope flex items-center justify-center gap-2 rounded-full w-full py-3 ${
        variant === "bordered" ? "border-primary-black border-2" : ""
      } ${className}`}
      {...props}
    >
      {children}
    </HeroUIButton>
  );
}

export default CustomButton;
