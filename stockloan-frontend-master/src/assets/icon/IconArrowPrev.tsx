import React from 'react';

interface Props {
  className?: string;
  onClick?: () => void;
}

export const IconArrowPrev = ({ className, onClick, ...other }: Props) => (
  <span className={className}>
    <svg
      width='100%'
      height='100%'
      viewBox='0 0 18 29'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      onClick={onClick}
      {...other}
      className='cursor-pointer'
    >
      <path
        d='M5.10051 14.1421L17.1213 2.12132L15 0L0.857865 14.1421L15 28.2843L17.1213 26.163L5.10051 14.1421Z'
        fill='#222222'
      />
    </svg>
  </span>
);
