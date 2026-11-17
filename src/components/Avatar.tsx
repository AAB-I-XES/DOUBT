import React, { useState } from 'react';

interface AvatarProps {
  src: string;
  alt: string;
  initials: string;
  sizeClass?: string;
}

export const Avatar: React.FC<AvatarProps> = ({
  src,
  alt,
  initials,
  sizeClass = 'w-9 h-9',
}) => {
  const [failed, setFailed] = useState(false);

  if (failed || !src) {
    return (
      <div
        aria-label={alt}
        className={`${sizeClass} shrink-0 rounded-md border border-[#EAE8E5] bg-[#F3E8E7] flex items-center justify-center text-xs font-medium text-[#222222] select-none`}
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
      className={`${sizeClass} shrink-0 rounded-md border border-[#EAE8E5] object-cover bg-[#F3E8E7]`}
    />
  );
};
