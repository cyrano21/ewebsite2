import React, { useMemo } from 'react';
import Link from 'next/link';

interface TextTruncateProps {
  text: string;
  maxLength: number;
  url?: string;
}

const TextTruncate = ({ text, maxLength, url = '#!' }: TextTruncateProps) => {
  const isTruncated = useMemo(() => {
    return text.length > maxLength;
  }, [text, maxLength]);

  const displayText = isTruncated ? `${text.slice(0, maxLength)}...` : text;
  return (
    <>
      {displayText}
      {isTruncated && <Link href={url}>Read more</Link>}
    </>
  );
};

export default TextTruncate;


