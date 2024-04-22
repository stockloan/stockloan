import React from 'react';

interface Props {
  className?: string;
  circleFill?: string;
  pathFill?: string;
  onClick?: () => void;
}

export const IconMore = ({
  onClick,
  className,
  circleFill,
  pathFill,
  ...other
}: Props) => (
  <span className={className} onClick={onClick} {...other}>
    <svg
      width='100%'
      height='100%'
      viewBox='0 0 60 60'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
    >
      <circle
        cx='30'
        cy='30'
        r='30'
        fill={circleFill ? circleFill : '#F8F8F8'}
      />
      <path
        d='M32 23H29V29H23V32H29V38H32V32H38V29H32V23Z'
        fill={pathFill ? pathFill : '#666666'}
      />
    </svg>
  </span>
);
