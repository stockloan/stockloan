import React from 'react';

interface Props {
  className?: string;
  onClick?: () => void;
}

export const IconInputCancel = ({ className, onClick, ...other }: Props) => (
  <svg
    width='100%'
    height='100%'
    viewBox='0 0 24 25'
    fill='none'
    xmlns='http://www.w3.org/2000/svg'
    onClick={onClick}
    className={className}
    {...other}
  >
    <g clipPath='url(#clip0_29210_24092)'>
      <circle cx='12' cy='12.5' r='10' fill='#F4F6F8' />
      <circle cx='12' cy='12.5' r='10' fill='black' fillOpacity='0.1' />
      <path
        d='M15.3334 9.16669L8.80624 15.6938'
        stroke='white'
        strokeOpacity='0.95'
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
      <path
        d='M8.66669 9.16669L15.1938 15.6938'
        stroke='white'
        strokeOpacity='0.95'
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </g>
    <defs>
      <clipPath id='clip0_29210_24092'>
        <rect
          width='20'
          height='20'
          fill='white'
          transform='translate(2 2.5)'
        />
      </clipPath>
    </defs>
  </svg>
);
