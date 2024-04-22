import React from 'react';

interface Props {
  className?: string;
  onClick?: () => void;
}

export const IconFilter = ({ className, onClick, ...other }: Props) => (
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
    <ellipse
      cx='15.3333'
      cy='7.49998'
      rx='1.66667'
      ry='1.66667'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
    />
    <ellipse
      cx='8.66667'
      cy='12.5'
      rx='1.66667'
      ry='1.66667'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
    />
    <circle
      cx='15.3333'
      cy='17.5'
      r='1.66667'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
    />
    <path
      d='M5.33333 7.5H13.6667'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
    />
    <path
      d='M10.3333 12.5H18.6667'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
    />
    <path
      d='M5.33333 12.5H6.99999'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
    />
    <path
      d='M17 7.5H18.6667'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
    />
    <path
      d='M17 17.5H18.6667'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
    />
    <path
      d='M5.33333 17.5H13.6667'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
    />
  </svg>
);
