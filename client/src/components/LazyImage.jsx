import React, { useState, useEffect, useRef } from 'react';

export default function LazyImage({ src, alt, className = '', style = {}, onLoad = null }) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [imageSrc, setImageSrc] = useState(null);
  const imgRef = useRef(null);

  useEffect(() => {
    // Eager load: set the image src immediately without waiting for intersection
    // This bypasses intersection observer to diagnose if that's causing issues
    if (!src) return;
    setImageSrc(src);
  }, [src]);

  const handleLoad = () => {
    setIsLoaded(true);
    if (onLoad) onLoad();
  };

  return (
    <img
      ref={imgRef}
      src={imageSrc}
      alt={alt}
      loading="lazy"
      className={`${className} ${isLoaded ? 'opacity-100' : 'opacity-50'} transition-opacity duration-300`}
      style={style}
      onLoad={handleLoad}
    />
  );
}
