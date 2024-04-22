import React from 'react';

interface Props {
  className?: string;
  onClick?: () => void;
}

export const IconSearch = ({ className, onClick, ...other }: Props) => (
  <svg
    width='100%'
    height='100%'
    viewBox='0 0 28 28'
    fill='none'
    xmlns='http://www.w3.org/2000/svg'
    onClick={onClick}
    className={className}
    {...other}
  >
    <path
      d='M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z'
      strokeWidth='4'
      strokeLinecap='round'
      strokeLinejoin='round'
    />
    <path
      d='M26 26L20 20'
      strokeWidth='4'
      strokeLinecap='round'
      strokeLinejoin='round'
    />
  </svg>
);
