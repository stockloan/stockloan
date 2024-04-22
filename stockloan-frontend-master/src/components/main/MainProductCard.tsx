import Image from 'next/image';
import Link from 'next/link';
import * as React from 'react';
import tw from 'tailwind-styled-components';

// test json
import { IProduct } from '@/types/product';

// ----------------------------------------------------------------------

interface IMainProductCardProps {
  mainProducts: IProduct[];
}

export default function MainProductCard({
  mainProducts,
}: IMainProductCardProps) {
  return (
    <MainProductCardContainer>
      {mainProducts.map((item: IProduct, index) => (
        <Link
          href={'/product?searchType=product&productId=' + item.productId}
          key={index}
        >
          <MainProductCardItem
            key={index}
            className={
              index % 2 === 0
                ? 'hover:translate-y-[-15px]'
                : 'translate-y-[40px] hover:translate-y-[30px]'
            }
          >
            <Image
              src={item.imgUrl}
              width={220}
              height={85}
              alt={item.financialCompany}
              objectFit='contain'
            />
            <MainProductCardTitle>{item.productName}</MainProductCardTitle>
            <MainProductCardBank>
              {item.stockCompany}
              <ItemTextOr></ItemTextOr> {item.financialCompany}
            </MainProductCardBank>
            <MainProductCardLimit>
              금리 <LimitPoint>{item.initInterestRate}%</LimitPoint>
            </MainProductCardLimit>
          </MainProductCardItem>
        </Link>
      ))}
    </MainProductCardContainer>
  );
}

// style
const MainProductCardContainer = tw.div`
flex flex-wrap justify-between w-[768px] md:w-auto
md:w-[1180px]
`;
const MainProductCardItem = tw.div`
w-[24%] h-[200px] px-[10px] py-[15px] bg-white relative mb-[20px]
rounded-[10px] cursor-pointer shadow-[5px_10px_25px_rgb(38,73,157,0.4)] duration-[0.3s]
md:h-[300px] md:px-[30px] md:py-[40px]
`;
const MainProductCardTitle = tw.p`
text-[18px] text-[#222] font-semibold leading-1 overflow-hidden text-ellipsis whitespace-nowrap
md:text-[22px] md:leading-[30px]
`;
const MainProductCardBank = tw.p`
text-[12px] text-[#666] font-normal leading-1 flex item-center mt-[14px] overflow-hidden text-ellipsis whitespace-nowrap
md:text-[15px] md:leading-[24px]
`;
const ItemTextOr = tw.span`
after:inline-block after:content-['|'] after:text-[13px] after:mx-[4px] after:text-[#ccc] after:leading-[24px]
md:after:mx-[12px]
`;
const MainProductCardLimit = tw.p`
absolute right-[10px] bottom-[20px] text-right text-[15px] font-normal text-[#222] leading-[24px]
md:bottom-[40px] md:right-[30px]
`;
const LimitPoint = tw.span`
ml-[4px] text-[24px] font-bold text-[#FF3B77]
md:ml-[13px]
`;
