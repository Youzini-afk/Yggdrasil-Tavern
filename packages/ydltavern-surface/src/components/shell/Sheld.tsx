import React from 'react';

export function Sheld({ children }: { children: React.ReactNode }) {
  return (
    <main id="sheld" className="sheld" role="main">
      {children}
    </main>
  );
}
