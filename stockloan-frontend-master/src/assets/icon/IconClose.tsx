import React from 'react';

interface Props {
  className?: string;
  onClick?: () => void;
}

export const IconClose = ({ className, onClick, ...other }: Props) => (
  <span className={className} onClick={onClick} {...other}>
    <svg
      width='18'
      height='18'
      viewBox='0 0 18 18'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
    >
      <path
        d='M10.9704 8.84924L17.3344 2.48528L15.2131 0.363961L8.84912 6.72792L2.48516 0.363961L0.36384 2.48528L6.7278 8.84924L0.36384 15.2132L2.48516 17.3345L8.84912 10.9706L15.2131 17.3345L17.3344 15.2132L10.9704 8.84924Z'
        fill='#222222'
      />
    </svg>
  </span>
);
