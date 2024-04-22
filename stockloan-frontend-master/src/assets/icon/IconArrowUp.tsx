import React from 'react';

interface Props {
  className?: string;
  fill?: string;
  onClick?: () => void;
}

export const IconArrowUp = ({ className, onClick, fill, ...other }: Props) => (
  <span className={className} onClick={onClick} {...other}>
    <svg
      width='100%'
      height='100%'
      viewBox='0 0 20 12'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
    >
      <path
        d='M19.8996 10.3848L18.4854 11.799L10.0001 3.31373L1.5148 11.799L0.100586 10.3848L10.0001 0.485303L19.8996 10.3848Z'
        fill={fill ? fill : '#666666'}
      />
    </svg>
  </span>
);
