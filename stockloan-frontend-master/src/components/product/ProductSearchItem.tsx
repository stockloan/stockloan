/* eslint-disable @typescript-eslint/no-explicit-any */
import clsx from 'clsx';
import _ from 'lodash';
import * as React from 'react';
import { useEffect, useState } from 'react';
import tw from 'tailwind-styled-components';

import { useMediaQuery } from '@/hooks/useMediaQuery';

import { IconRefresh } from '@/assets/icon/IconRefresh';

import { initSearchParams, ISearchParams } from '@/types/product';

// ----------------------------------------------------------------------
interface IProps {
  setParamsModal: (params: ISearchParams) => void;
  searchItemList: any[];
  tabIndex?: number;
}
interface ISearchList {
  label: string;
  labelName: string;
  items: ISearchItem[];
}
interface ISearchItem {
  id: number;
  itemName: string;
  checked: boolean;
}

export default function ProductSearchItem({
  setParamsModal,
  searchItemList,
  tabIndex,
}: IProps) {
  const isMobile = useMediaQuery(768);
  const [itemList, setItemList] = useState<ISearchList[]>(searchItemList);
  const [filterIndex, setFilterIndex] = useState<number>(
    tabIndex === undefined ? -1 : tabIndex
  );
  const handelAllCheck = (items: ISearchItem[], isOnClickAll: boolean) => {
    items.forEach((item) => {
      if (isOnClickAll) {
        if (item.itemName !== '전체') item.checked = false;
        else item.checked = true;
      } else {
        if (item.itemName === '전체') item.checked = false;
      }
      setItemList((list) => [...list]);
    });
  };

  useEffect(() => {
    setFilterIndex(tabIndex === undefined ? -1 : tabIndex);
    // 선택된게 없을때 전체 선택 활성화
    itemList.forEach((list) => {
      const isChecked = list.items.find((item) => item.checked === true);
      if (!isChecked) {
        list.items.forEach((item) => {
          if (item.itemName === '전체') item.checked = true;
        });
        setItemList((list) => [...list]);
      }
    });
  }, [itemList, filterIndex, tabIndex]);

  const onClickSubmitSearch = () => {
    const searchParams: ISearchParams = _.cloneDeep(initSearchParams);
    const stockCompanyIds: number[] = [];
    const financialCompanyIds: number[] = [];
    const productTypeIds: number[] = [];
    const interestRateTypeIds: number[] = [];
    const focusInvestRateIds: number[] = [];
    const loanTermIds: number[] = [];

    itemList.forEach((list) => {
      const label = list.label;
      list.items.forEach((item) => {
        // if (item.checked) paramsData.push(item.id);
        if (item.checked) {
          if (item.itemName !== '전체') {
            switch (label) {
              case 'org_nm':
                stockCompanyIds.push(item.id);
                break;
              case 'fin':
                financialCompanyIds.push(item.id);
                break;
              case 'prod':
                productTypeIds.push(item.id);
                break;
              case 'rate':
                interestRateTypeIds.push(item.id);
                break;
              case 'commi':
                focusInvestRateIds.push(item.id);
                break;
              case 'period':
                loanTermIds.push(item.id);
                break;
              default:
                break;
            }
          }
        }
      });
    });
    searchParams.stockCompanyIds = stockCompanyIds;
    searchParams.financialCompanyIds = financialCompanyIds;
    searchParams.productTypeIds = productTypeIds;
    searchParams.interestRateTypeIds = interestRateTypeIds;
    searchParams.focusInvestRateIds = focusInvestRateIds;
    searchParams.loanTermIds = loanTermIds;
    setParamsModal(searchParams);
  };

  return (
    <>
      <div>
        {itemList.map((list, index) => {
          if (isMobile) {
            if (index === filterIndex) {
              return (
                <dl
                  key={index}
                  className='h-[30vh] overflow-y-scroll px-[16px]'
                >
                  <dd className='w-full pt-[16px]'>
                    <ul className='flex flex-wrap justify-between'>
                      {list.items.map((item, index) => (
                        <MobileSearchItemLabel
                          key={index}
                          className={clsx({
                            'border-[#2E9BFF] text-[#2E9BFF]': item.checked,
                          })}
                          onClick={() => {
                            if (item.itemName === '전체') {
                              handelAllCheck(list.items, true);
                            } else {
                              item.checked = !item.checked;
                              handelAllCheck(list.items, false);
                            }
                          }}
                        >
                          {item.itemName}
                        </MobileSearchItemLabel>
                      ))}
                    </ul>
                  </dd>
                </dl>
              );
            }
          } else {
            return (
              <dl key={index} className='mt-[30px] px-[30px] '>
                <dt className='text-[16px] font-semibold text-[#222]'>
                  {list.labelName}
                </dt>
                <dd className='w-full pt-[5px]'>
                  <ul className='flex flex-wrap'>
                    {list.items.map((item, index) => (
                      <SearchItemLabel
                        key={index}
                        className={clsx('mx-[6px] mt-[12px]', {
                          'border-[#FF2B77] text-[#FF2B77]': item.checked,
                        })}
                        onClick={() => {
                          if (item.itemName === '전체') {
                            handelAllCheck(list.items, true);
                          } else {
                            item.checked = !item.checked;
                            handelAllCheck(list.items, false);
                          }
                        }}
                      >
                        {item.itemName}
                      </SearchItemLabel>
                    ))}
                  </ul>
                </dd>
              </dl>
            );
          }
        })}
      </div>
      <div className='mt-[25px] flex justify-between px-[16px] pb-[8px] md:justify-start md:px-0 md:pb-0'>
        <ProductModalFooterButton
          className='bg-[#E8E8E8] text-[#222]'
          onClick={() => {
            itemList.forEach((list) => {
              handelAllCheck(list.items, true);
            });
          }}
        >
          <span className='mr-[8px] hidden md:inline'>
            <IconRefresh />
          </span>
          조건 초기화
        </ProductModalFooterButton>
        <ProductModalFooterButton
          className='bg-[#2E9BFF] text-white md:bg-[#FF2B77]'
          onClick={onClickSubmitSearch}
        >
          선택 조건 검색
        </ProductModalFooterButton>
      </div>
    </>
  );
}

// style
const MobileSearchItemLabel = tw.div`
flex items-center justify-center w-[49%] min-h-[40px] border border-[#DDE4EE] rounded-[8px] mb-[16px] text-[14px] text-[#33374D] text-center leading-[22px]
`;
const SearchItemLabel = tw.div`
block border border-[#E8E8E8] w-[186px] h-[40px] text-[15px] font-medium text-[#666] bg-white leading-[40px] rounded-[4px] text-center cursor-pointer
`;
const ProductModalFooterButton = tw.button`
w-[49%] flex justify-center items-center h-[52px] text-[17px] font-semibold rounded-[12px]
md:w-[50%] md:h-[70px] md:rounded-0 md:text-[18px] md:font-bold
`;
