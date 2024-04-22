import React from 'react';

interface Props {
  className?: string;
  onClick?: () => void;
}

export const IconInfo = ({ className, onClick, ...other }: Props) => (
  <span className={className} onClick={onClick}>
    <svg
      width='100%'
      height='100%'
      viewBox='0 0 37 36'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      {...other}
    >
      <circle cx='18.5' cy='18' r='17' stroke='#F4F6F8' strokeWidth='2' />
      <circle
        cx='18.5'
        cy='18'
        r='17'
        stroke='black'
        strokeOpacity='0.1'
        strokeWidth='2'
      />
      <ellipse cx='18.5' cy='25.8' rx='1.8' ry='1.8' fill='#F4F6F8' />
      <ellipse
        cx='18.5'
        cy='25.8'
        rx='1.8'
        ry='1.8'
        fill='black'
        fillOpacity='0.1'
      />
      <path
        fillRule='evenodd'
        clipRule='evenodd'
        d='M20.3 8.5V22.1H16.7V8.5H20.3Z'
        fill='#F4F6F8'
      />
      <path
        fillRule='evenodd'
        clipRule='evenodd'
        d='M20.3 8.5V22.1H16.7V8.5H20.3Z'
        fill='black'
        fillOpacity='0.1'
      />
    </svg>
  </span>
);
