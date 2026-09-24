import { useState } from 'react';
import { useWikiImage } from '../../hooks/useWikiImage';

interface EntityImageProps {
  localSrc?: string;
  wikiUrl?: string;
  alt: string;
  placeholder: string;
  className?: string;
  placeholderClassName?: string;
}

// Local asset -> Wikipedia thumbnail -> text placeholder (number or initials)
const EntityImage = ({ localSrc, wikiUrl, alt, placeholder, className = '', placeholderClassName = '' }: EntityImageProps) => {
  const wikiImage = useWikiImage(wikiUrl, !localSrc);
  const [failed, setFailed] = useState(false);
  const src = localSrc || wikiImage;

  if (!src || failed) {
    return <div className={`${styles.placeholder} ${placeholderClassName}`}>{placeholder}</div>;
  }

  return <img src={src} alt={alt} className={className} loading="lazy" onError={() => setFailed(true)} />;
};

const styles = {
  placeholder: "w-full h-full flex items-center justify-center font-orbitron font-bold text-gray-400 dark:text-gray-600 bg-gray-100 dark:bg-[#1a1a1a]",
};

export default EntityImage;
