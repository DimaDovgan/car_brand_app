import React from 'react';

const Image = (props: any) => {
  return <img {...props} alt={props.alt || 'mocked image'} />;
};

export default Image;