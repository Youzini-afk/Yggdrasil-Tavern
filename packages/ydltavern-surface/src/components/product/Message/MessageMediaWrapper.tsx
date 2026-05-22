import React from 'react';

export interface MessageMediaWrapperProps {
  items: { kind: 'image' | 'file'; url: string; alt?: string }[];
}

// Mirrors SillyTavern .mes_media_wrapper / .mes_file_wrapper
// @see SillyTavern/public/index.html lines 7448-7449
export function MessageMediaWrapper({ items }: MessageMediaWrapperProps) {
  return (
    <div className="mes_media_wrapper">
      {items.map((item, i) => {
        if (item.kind === 'image') {
          return <img key={i} src={item.url} alt={item.alt ?? ''} className="mes_media_image" />;
        }
        return (
          <a key={i} href={item.url} className="mes_media_file" target="_blank" rel="noreferrer">
            <i className="fa-solid fa-paperclip" /> {item.alt ?? item.url}
          </a>
        );
      })}
    </div>
  );
}
