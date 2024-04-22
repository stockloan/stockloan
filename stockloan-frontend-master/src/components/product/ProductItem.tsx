import clsx from 'clsx';
import Image from 'next/image';
import * as React from 'react';
import { useEffect, useState } from 'react';
import tw from 'tailwind-styled-components';

import UnstyledLink from '@/components/links/UnstyledLink';

import { IconArrowDown } from '@/assets/icon/IconArrowDown';
import { IconArrowUp } from '@/assets/icon/IconArrowUp';

import { IProduct } from '@/types/product';

interface IProps {
  product: IProduct;
}

// ----------------------------------------------------------------------

export default function ProductItem({ product }: IProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const item = product;

  useEffect(() => {
    setIsOpen(false);
  }, [product]);

  return (
    <ItemContainer
      className={clsx({
        'shadow-[5px_5px_20px_rgb(161,168,187,35%)]': isOpen,
      })}
    >
      <div
        className='relative flex cursor-pointer flex-col items-start justify-between md:flex-row md:items-center'
        onClick={() => {
          setIsOpen(!isOpen);
        }}
      >
        <ItemCompanyLogo>
          <Image
            src={item.imgUrl}
            layout='fill'
            objectFit='contain'
            alt={`product_${item.stockCompany}`}
          />
        </ItemCompanyLogo>
        <div className='w-full max-w-[930px]'>
          <strong className='md:leading-1 text-[16px] font-medium leading-[24px] text-[#222] md:text-[20px] md:font-semibold'>
            {item.productName}
          </strong>
          <div className='relative mt-[2px] flex md:mt-[16px]'>
            <ItemCompanyName>{item.stockCompany}</ItemCompanyName>
            <ItemCompanyName className='after:content-[""] md:after:content-["|"]'>
              {item.financialCompany}
            </ItemCompanyName>
            <ItemLimitAmount>금리 {item.initInterestRate}%</ItemLimitAmount>
          </div>
        </div>
        <div className='absolute top-[20px] right-0 h-[6px] w-[10px] md:relative md:top-0 md:h-[12px] md:w-[20px]'>
          <span>{isOpen ? <IconArrowUp /> : <IconArrowDown />}</span>
        </div>
      </div>
      <div
        className={clsx('pt-[24px] pb-[0px] md:pb-[69px] md:pt-[40px]', {
          block: isOpen,
          hidden: !isOpen,
        })}
      >
        <div className='w-full overflow-x-scroll'>
          <table className='w-full min-w-[720px] table-auto border-t border-b border-t-[#e8e8e8] border-b-[#e8e8e8] text-[14px] font-semibold text-[#666]'>
            <caption className='hidden'>상품안내 테이블</caption>
            <colgroup>
              <col className='w-[11%]' />
              <col className='w-[11%]' />
              <col className='w-[11%]' />
              <col className='w-[11.3%]' />
              <col className='w-[5.5%]' />
              <col className='w-[5.5%]' />
              <col className='w-[11%]' />
              <col className='w-[11.3%]' />
              <col className='w-[5.5%]' />
              <col className='w-[5.5%]' />
              <col className='w-[11.3%]' />
            </colgroup>
            <thead>
              <tr>
                <Th scope='col' colSpan={3} className='border-l-0'>
                  상품명
                </Th>
                <Th scope='col' colSpan={2}>
                  증권사
                </Th>
                <Th scope='col' colSpan={2}>
                  금융사
                </Th>
                <Th scope='col' colSpan={2}>
                  상품구분
                </Th>
                <Th scope='col' colSpan={2}>
                  한도금액
                </Th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <Td scope='row' colSpan={3} className='border-l-0 border-t-0'>
                  {item.productName}
                </Td>
                <Td className='border-t-0' colSpan={2}>
                  {item.stockCompany}
                </Td>
                <Td className='border-t-0' colSpan={2}>
                  {item.financialCompany}
                </Td>
                <Td className='border-t-0' colSpan={2}>
                  {item.productType}
                </Td>
                <Td className='border-t-0' colSpan={2}>
                  {item.limitAmount}억원
                </Td>
              </tr>
              <tr>
                <Th
                  scope='col'
                  colSpan={3}
                  className='border-l-0 border-t border-b border-t-[#e8e8e8] border-b-[#e8e8e8]'
                >
                  금리
                </Th>
                <Th
                  scope='col'
                  className='border-t border-b border-t-[#e8e8e8] border-b-[#e8e8e8]'
                  colSpan={4}
                >
                  조건
                </Th>
                <Th
                  scope='col'
                  className='border-t border-b border-t-[#e8e8e8] border-b-[#e8e8e8]'
                  colSpan={4}
                >
                  상품비율
                </Th>
              </tr>
              <tr>
                <Th scope='col' className='border-l-0'>
                  구분
                </Th>
                <Th scope='col'>최초금리</Th>
                <Th scope='col'>연장금리</Th>
                <Th scope='col' colSpan={4}>
                  대출기간
                </Th>
                <Th scope='col'>집중투자율</Th>
                <Th scope='col' colSpan={2}>
                  로스컷비율
                </Th>
                <Th scope='col'>현금인출비율</Th>
              </tr>
              <tr>
                <Td className='border-l-0 border-t-0'>
                  {item.interestRateType}
                </Td>
                <Td className='border-t-0'>{item.initInterestRate}%</Td>
                <Td className='border-t-0'>{item.extendInterestRate}%</Td>
                <Td className='border-t-0' colSpan={4}>
                  {item.loanTerm}
                </Td>
                <Td className='border-t-0'>{item.focusInvestRate}</Td>
                <Td className='border-t-0' colSpan={2}>
                  {item.lossCutRate}%
                </Td>
                <Td className='border-t-0'>{item.cashDrawRate}%</Td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className='mb:mt-[40px] mt-[24px] flex justify-center'>
          <UnstyledLink href={item.linkUrl || ''} className='hidden'>
            <ItemButton className='border border-[#aaa] bg-white text-[#666]'>
              금융사홈
            </ItemButton>
          </UnstyledLink>
          <UnstyledLink href='/consulting'>
            <ItemButton className='ml-[0px] border border-[#26499D] bg-[#26499D] text-white'>
              상담신청
            </ItemButton>
          </UnstyledLink>
        </div>
      </div>
    </ItemContainer>
  );
}

// style
const ItemContainer = tw.div`
relative mb-[30px] rounded-[12px] border border-[#E8E8E8] bg-white p-[16px]
md:p-[40px] md:rounded-[20px]
`;
const ItemCompanyLogo = tw.div`
relative mr-[30px] h-[40px] min-w-[80px] rounded-[10px] border border-[#E8E8E8] mb-[16px] overflow-hidden
md:min-w-[200px] md:h-[100px] md:mb-0
`;
const ItemCompanyName = tw.span`
text-[12px] font-normal text-[#858794] leading-[18px] 
after:content-['|'] after:inline-block after:mx-[8px] after:mt-[-4px] after:text-[#ddd] after:text-[13px] after:align-middle
md:text-[16px] md:text-[#666] md:leading-1 md:after:mx-[12px] after:mt-[-1px]
`;
const ItemLimitAmount = tw.span`
text-[13px] font-normal text-[#F56700] absolute top-0 right-0
md:relative md:top-[-3px] md:text-[16px] md:text-[#FF2B77] md:font-semibold
`;
const Th = tw.th`
h-[50px] bg-[#F7F8F9] text-center border-l border-l-[#e8e8e8]
`;
const Td = tw.td`
h-[50px] bg-white text-center font-normal text-[#222] border-l border-l-[#e8e8e8] border-t border-t-[#e8e8e8]
`;
const ItemButton = tw.span`
inline-block  text-center text-[16px] font-bold leading-[24px] rounded-[4px] w-[120px] py-[6px]
md:w-[180px] md:h-[55px] md:leading-[55px] md:py-0
`;
