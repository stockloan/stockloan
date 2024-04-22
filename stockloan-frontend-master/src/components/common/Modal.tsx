import * as React from 'react';

import { IconClose } from '@/assets/icon/IconClose';
// ----------------------------------------------------------------------
interface IProps {
  open: boolean;
  close: (isOpen: boolean) => void;
  header?: string;
  children: JSX.Element;
}

export default function Modal({ open, close, header, children }: IProps) {
  return (
    <div className={open ? 'openModal modal' : 'modal'}>
      {open ? (
        <section>
          <header>
            {header}
            <button
              className='close'
              onClick={() => {
                close(false);
              }}
            >
              <IconClose />
            </button>
          </header>
          <main>{children}</main>
        </section>
      ) : null}
    </div>
  );
}
