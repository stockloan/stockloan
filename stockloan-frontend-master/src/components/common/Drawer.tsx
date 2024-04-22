import { SwipeableDrawer } from '@mui/material';
import * as React from 'react';

import { IconClose } from '@/assets/icon/IconClose';
// ----------------------------------------------------------------------
interface IProps {
  open: boolean;
  close: (isOpen: boolean) => void;
  header?: string;
  children: JSX.Element;
}

export default function Drawer({ open, close, header, children }: IProps) {
  const toggleDrawer =
    (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event &&
        event.type === 'keydown' &&
        ((event as React.KeyboardEvent).key === 'Tab' ||
          (event as React.KeyboardEvent).key === 'Shift')
      ) {
        return;
      }

      close(open);
    };
  return (
    <SwipeableDrawer
      anchor='bottom'
      open={open}
      onOpen={toggleDrawer(true)}
      onClose={toggleDrawer(false)}
      className='z-[99]'
      sx={{
        ...{
          '& .MuiPaper-root': {
            borderRadius: '20px 20px 0px 0px !important',
            borderTop: 'none',
          },
        },
      }}
    >
      <div className='relative mb-[12px] w-full pt-[24px]'>
        <span
          className='absolute top-[24px] left-[20px]'
          onClick={toggleDrawer(false)}
        >
          <IconClose />
        </span>
        <p className='text-center text-[17px] text-[#33374D]'>{header}</p>
      </div>
      <div>{children}</div>
    </SwipeableDrawer>
  );
}
