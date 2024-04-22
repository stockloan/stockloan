import React from 'react';

interface Props {
  className?: string;
  fill?: string;
  onClick?: () => void;
}

export const IconArrowDown = ({
  className,
  onClick,
  fill,
  ...other
}: Props) => (
  <span className={className} onClick={onClick} {...other}>
    <svg
      width='100%'
      height='100%'
      viewBox='0 0 20 12'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
    >
      <path
        d='M19.8996 1.89957L18.4854 0.485352L10.0001 8.97063L1.5148 0.485352L0.100586 1.89957L10.0001 11.7991L19.8996 1.89957Z'
        fill={fill ? fill : '#666666'}
      />
    </svg>
  </span>
);
