import clsx from 'clsx';
import * as React from 'react';
import tw from 'tailwind-styled-components';

import { ISerachItemList } from '@/types/product';

// ----------------------------------------------------------------------
interface IProps {
  searchItemList: ISerachItemList[];
}

export default function ProductResultFilter({ searchItemList }: IProps) {
  return (
    <div className='flex w-full flex-wrap px-[40px] pt-[30px] pb-[40px]'>
      {searchItemList.map((list, index) => (
        <div key={index} className='w-[50%]'>
          <strong className='text-[15px] font-semibold text-[#222]'>
            {list.labelName}
          </strong>
          <div className='mt-[12px]'>
            {list.items.map((item) => (
              <FilterItem
                key={item.id}
                className={clsx({ 'inline-block': item.checked })}
              >
                {item.itemName}
              </FilterItem>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

//style
const FilterItem = tw.label`
mr-[9px] mb-[10px] hidden rounded-[4px] border border-[#E8E8E8] bg-white px-[10px] text-center text-[15px] font-normal leading-[30px] text-[#222]
before:mr-[5px] before:mt-[-3px] before:inline-block before:h-[9px] before:w-[12px] before:bg-[url('/images/product/filter_chk_ico.png')] before:bg-cover before:content-['']
`;
