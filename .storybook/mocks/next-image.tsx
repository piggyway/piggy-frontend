import React from 'react';

// Mock Next.js Image component for Storybook
const Image = ({ src, alt, fill, priority, className, ...props }: any) => {
  if (fill) {
    return (
      <img
        src={src}
        alt={alt}
        className={className}
        style={{ position: 'absolute', inset: 0, objectFit: 'contain' }}
        {...props}
      />
    );
  }
  return <img src={src} alt={alt} className={className} {...props} />;
};

export default Image;

