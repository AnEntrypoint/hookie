import React from 'react';

export function Section(props = {}, children) {
  return (
    <div className="Section" data-component="Section">
      {children}
    </div>
  );
}

export default Section;