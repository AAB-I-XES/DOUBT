import React, { useState } from 'react';

interface AvatarProps {
  src: string;
  alt: string;
  initials: string;
  sizeClass?: string;
  roundedClass?: string;
}

export const Avatar: React.FC<AvatarProps> = ({
  src,
  alt,
  initials,
  sizeClass = 'w-10 h-10',
  roundedClass = 'rounded-full',
}) => {
  const [failed, setFailed] = useState(false);

  if (failed || !src) {
    return (
      <div
        aria-label={alt}
        className={`${sizeClass} shrink-0 ${roundedClass} border border-[#EFE2E2] bg-[#FFE4E1] flex items-center justify-center text-xs font-semibold text-[#A64258] select-none`}
      >
        {initials}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
      className={`${sizeClass} shrink-0 ${roundedClass} border border-[#EFE2E2] object-cover bg-[#FFE4E1]`}
    />
  );
};
