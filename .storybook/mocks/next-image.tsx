import React from "react";

type MockImageProps = React.ImgHTMLAttributes<HTMLImageElement> & {
  src: string;
  alt?: string;
  fill?: boolean;
  priority?: boolean;
};

// Mock Next.js Image component for Storybook
const Image = ({ src, alt, fill, className, ...props }: MockImageProps) => {
  if (fill) {
    return (
      <img
        src={src}
        alt={alt}
        className={className}
        style={{ position: "absolute", inset: 0, objectFit: "contain" }}
        {...props}
      />
    );
  }
  return <img src={src} alt={alt} className={className} {...props} />;
};

export default Image;
