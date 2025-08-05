import React from "react";
import { cn } from "../../lib/utils";

// Base icon component interface
interface IconProps extends React.HTMLAttributes<HTMLElement> {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
}

// Base icon component that handles common styling and sizing
const BaseIcon: React.FC<IconProps & { src: string; alt: string }> = ({
  src,
  alt,
  className,
  size = "md",
  ...props
}) => {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-5 h-5", 
    lg: "w-6 h-6",
    xl: "w-8 h-8"
  };

  return (
    <img
      src={src}
      alt={alt}
      className={cn(sizeClasses[size], className)}
      {...props}
    />
  );
};

// SVG icon component for scalable icons
const BaseSVGIcon: React.FC<IconProps & { children: React.ReactNode }> = ({
  children,
  className,
  size = "md",
  ...props
}) => {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6", 
    xl: "w-8 h-8"
  };

  return (
    <div 
      className={cn(sizeClasses[size], "inline-flex items-center justify-center", className)}
      {...props}
    >
      {children}
    </div>
  );
};

// WK Icons collection
export const WKIcons = {
  // Navigation Icons
  ChevronDouble: (props: IconProps) => (
    <BaseIcon
      src="/src/styles/WK Icons/chevron-double.png"
      alt="Chevron Double"
      {...props}
    />
  ),

  ChevronUp: (props: IconProps) => (
    <BaseIcon
      src="/src/styles/WK Icons/chevron-up.png"
      alt="Chevron Up"
      {...props}
    />
  ),

  Search: (props: IconProps) => (
    <BaseIcon
      src="/src/styles/WK Icons/search.png"
      alt="Search"
      {...props}
    />
  ),

  Plus: (props: IconProps) => (
    <BaseIcon
      src="/src/styles/WK Icons/plus.png"
      alt="Plus"
      {...props}
    />
  ),

  // Sidebar Menu Icons
  User: (props: IconProps) => (
    <BaseIcon
      src="/src/styles/WK Icons/user.png"
      alt="User"
      {...props}
    />
  ),

  Privacy: (props: IconProps) => (
    <BaseIcon
      src="/src/styles/WK Icons/shield.png"
      alt="Privacy"
      {...props}
    />
  ),

  About: (props: IconProps) => (
    <BaseIcon
      src="/src/styles/WK Icons/notification.png"
      alt="About"
      {...props}
    />
  ),

  // Message Input Icons
  PlusCircle: (props: IconProps) => (
    <BaseIcon
      src="/src/styles/WK Icons/plus-circle.png"
      alt="Add"
      {...props}
    />
  ),

  Attach: (props: IconProps) => (
    <BaseIcon
      src="/src/styles/WK Icons/attach.png"
      alt="Attach"
      {...props}
    />
  ),

  Send: (props: IconProps & { isActive?: boolean }) => {
    const { isActive, className, ...restProps } = props;
    return (
      <BaseIcon
        src="/src/styles/WK Icons/send.png"
        alt="Send"
        className={cn(
          isActive ? "text-[#005B92]" : "text-[#353535]",
          "transition-colors",
          className
        )}
        {...restProps}
      />
    );
  },

  // Branded Icon
  ColorfulIcon: (props: IconProps) => (
    <BaseSVGIcon {...props}>
      <svg width="112" height="112" viewBox="0 0 112 112" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g clipPath="url(#clip0_13_115)">
          <path d="M97.7 18.6L96.2 20C104.8 29.6 110 42.2 110 56C110 69.8 104.8 82.4 96.2 92L97.6 93.4C106.5 83.5 111.9 70.4 111.9 56C111.9 41.6 106.6 28.5 97.7 18.6Z" fill="#85BC20"/>
          <path d="M92 96.2C82.4 104.8 69.8 110 56 110C42.2 110 29.6 104.8 20 96.2L18.6 97.6C28.5 106.5 41.6 111.9 56 111.9C70.4 111.9 83.5 106.5 93.4 97.6L92 96.2Z" fill="black"/>
          <path d="M20 15.8C29.6 7.2 42.2 2 56 2C69.8 2 82.4 7.2 92 15.8L93.4 14.4C83.5 5.4 70.4 0 56 0C41.6 0 28.5 5.4 18.6 14.3L20 15.8Z" fill="#E5202E"/>
          <path d="M15.8 92C7.2 82.4 2 69.8 2 56C2 42.2 7.2 29.6 15.8 20L14.4 18.6C5.4 28.5 0 41.6 0 56C0 70.4 5.4 83.5 14.3 93.4L15.8 92Z" fill="#007AC3"/>
          <path d="M47.7727 80.3453L43.1942 66.7092C41.8007 62.5288 38.4166 59.1446 34.2362 57.7512L20.6001 53.1726L34.2362 48.5941C38.4166 47.2006 41.8007 43.8165 43.1942 39.6361L47.7727 26L52.3513 39.6361C53.7447 43.8165 57.1289 47.2006 61.3093 48.5941L74.9454 53.1726L61.3093 57.7512C57.1289 59.1446 53.7447 62.5288 52.3513 66.7092L47.7727 80.3453ZM26.9702 53.1726L34.9329 55.86C39.7105 57.4526 43.5923 61.3344 45.1849 66.112L47.8723 74.0746L50.5597 66.112C52.1522 61.3344 56.034 57.4526 60.8116 55.86L68.7743 53.1726L60.8116 50.4852C56.034 48.8927 52.1522 45.0109 50.5597 40.2333L47.8723 32.2706L45.1849 40.2333C43.5923 45.0109 39.7105 48.8927 34.9329 50.4852L26.9702 53.1726Z" fill="black"/>
          <path d="M70.367 90.0002L68.2768 82.9333C67.5801 80.445 65.5894 78.5538 63.2006 77.8571L56.1337 75.7669L63.2006 73.6767C65.6889 72.98 67.5801 70.9893 68.2768 68.6005L70.367 61.5336L72.4572 68.6005C73.1539 71.0888 75.1446 72.98 77.5334 73.6767L84.6003 75.7669L77.5334 77.8571C75.0451 78.5538 73.1539 80.5445 72.4572 82.9333L70.367 90.0002ZM63.1011 75.7669L63.6983 75.966C66.7838 76.8618 69.1726 79.2506 70.1679 82.4357L70.367 83.0329L70.5661 82.4357C71.4619 79.3501 73.8507 76.9613 77.0358 75.966L77.633 75.7669L77.0358 75.5678C73.9502 74.672 71.5614 72.2832 70.5661 69.0982L70.367 68.501L70.1679 69.0982C69.2721 72.1837 66.8833 74.5725 63.6983 75.5678L63.1011 75.7669Z" fill="black"/>
          <path d="M73.9501 44.8117L72.9548 41.6267C72.3576 39.5365 70.6655 37.9439 68.6749 37.3467L65.4898 36.3514L68.6749 35.3561C70.7651 34.7589 72.3576 33.0668 72.9548 31.0761L73.9501 27.8911L74.9455 31.0761C75.5427 33.1663 77.2347 34.7589 79.2254 35.3561L82.4105 36.3514L79.2254 37.3467C77.1352 37.9439 75.5427 39.636 74.9455 41.6267L73.9501 44.8117ZM71.3623 36.3514C72.4571 37.0481 73.3529 37.9439 73.9501 38.9393C74.6469 37.8444 75.5427 36.9486 76.538 36.3514C75.4431 35.6547 74.5473 34.7589 73.9501 33.7635C73.2534 34.8584 72.3576 35.7542 71.3623 36.3514Z" fill="black"/>
        </g>
        <defs>
          <clipPath id="clip0_13_115">
            <rect width="112" height="112" fill="white"/>
          </clipPath>
        </defs>
      </svg>
    </BaseSVGIcon>
  ),

  // Sparkles Icons
  LargeSparkles: (props: IconProps) => (
    <BaseSVGIcon {...props}>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g clipPath="url(#clip0_13_3382)">
          <path d="M8.13182 17.8801C7.71364 16.9434 6.98182 16.1109 5.93636 15.6946L0.5 13.509L6.04091 11.2195C6.98182 10.8032 7.81818 10.0747 8.23636 9.03394L10.5364 3.5181L12.8364 9.03394C13.2545 9.97059 13.9864 10.8032 15.0318 11.2195L20.5727 13.509L15.0318 15.7986C14.0909 16.2149 13.2545 16.9434 12.8364 17.9842L10.5364 23.5L8.13182 17.8801ZM4.68182 13.509L6.66818 14.3416C8.02727 14.862 9.07273 16.0068 9.7 17.3597L10.5364 19.3371L11.3727 17.3597C11.8955 16.0068 13.0455 14.9661 14.4045 14.3416L16.3909 13.509L14.4045 12.6765C13.0455 12.1561 12 11.0113 11.3727 9.65837L10.5364 7.68099L9.7 9.65837C9.17727 11.0113 8.02727 12.052 6.66818 12.6765L4.68182 13.509ZM16.4955 4.45475L14.0909 5.18326L16.4955 5.91176C17.2273 6.11991 17.8545 6.74434 18.0636 7.47285L18.7955 9.86652L19.5273 7.47285C19.7364 6.74434 20.3636 6.11991 21.0955 5.91176L23.5 5.18326L21.0955 4.45475C20.3636 4.24661 19.7364 3.62217 19.5273 2.89367L18.7955 0.5L18.0636 2.89367C17.8545 3.62217 17.2273 4.24661 16.4955 4.45475Z" fill="#353535"/>
        </g>
        <defs>
          <clipPath id="clip0_13_3382">
            <rect width="24" height="24" fill="white"/>
          </clipPath>
        </defs>
      </svg>
    </BaseSVGIcon>
  ),

  // Existing icons that are already being used in the codebase
  AIGenerate: (props: IconProps) => (
    <BaseIcon
      src="/src/styles/WK Icons/ai-generate.png"
      alt="AI Generate"
      {...props}
    />
  ),

  Chat: (props: IconProps) => (
    <BaseIcon
      src="/src/styles/WK Icons/plus.png"
      alt="Chat"
      {...props}
    />
  ),

  Close: (props: IconProps) => (
    <BaseIcon
      src="/src/styles/WK Icons/chevron-up.png"
      alt="Close"
      {...props}
    />
  ),

  Document: (props: IconProps) => (
    <BaseIcon
      src="/src/styles/WK Icons/text.png"
      alt="Document"
      {...props}
    />
  ),

  Excel: (props: IconProps) => (
    <BaseIcon
      src="/src/styles/WK Icons/excel.png"
      alt="Excel"
      {...props}
    />
  ),

  Help: (props: IconProps) => (
    <BaseIcon
      src="/src/styles/WK Icons/notification.png"
      alt="Help"
      {...props}
    />
  ),

  Menu: (props: IconProps) => (
    <BaseIcon
      src="/src/styles/WK Icons/menu.png"
      alt="Menu"
      {...props}
    />
  ),

  Note: (props: IconProps) => (
    <BaseIcon
      src="/src/styles/WK Icons/text.png"
      alt="Note"
      {...props}
    />
  ),

  PDF: (props: IconProps) => (
    <BaseIcon
      src="/src/styles/WK Icons/pdf.png"
      alt="PDF"
      {...props}
    />
  ),

  Refresh: (props: IconProps) => (
    <BaseIcon
      src="/src/styles/WK Icons/refresh.png"
      alt="Refresh"
      {...props}
    />
  ),

  Settings: (props: IconProps) => (
    <BaseIcon
      src="/src/styles/WK Icons/sliders.png"
      alt="Settings"
      {...props}
    />
  ),

  Clock: (props: IconProps) => (
    <BaseIcon
      src="/src/styles/WK Icons/clock-back.png"
      alt="Clock"
      {...props}
    />
  ),

  // Theme Toggle Icons
  Sun: (props: IconProps) => (
    <BaseIcon
      src="/src/styles/WK Icons/sun.png"
      alt="Light Mode"
      {...props}
    />
  ),

  Moon: (props: IconProps) => (
    <BaseIcon
      src="/src/styles/WK Icons/moon.png"
      alt="Dark Mode"
      {...props}
    />
  ),
};

export default WKIcons;