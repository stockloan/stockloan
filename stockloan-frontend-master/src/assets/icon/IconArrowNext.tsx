import React from 'react';

interface Props {
  className?: string;
  fill?: string;
  onClick?: () => void;
}

export const IconArrowNext = ({
  className,
  onClick,
  fill,
  ...other
}: Props) => (
  <span className={className}>
    <svg
      width='100%'
      height='100%'
      viewBox='0 0 17 29'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      onClick={onClick}
      {...other}
      className='cursor-pointer'
    >
      <path
        d='M12.0416 14.1421L0.0207695 2.12132L2.14209 0L16.2842 14.1421L2.14209 28.2843L0.0207695 26.163L12.0416 14.1421Z'
        fill={fill ? fill : '#222222'}
      />
    </svg>
  </span>
);
