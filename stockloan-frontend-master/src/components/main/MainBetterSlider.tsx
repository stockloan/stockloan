/* eslint-disable react-hooks/exhaustive-deps */
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import Slider from 'react-slick';
import tw from 'tailwind-styled-components';

import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

import UnstyledLink from '@/components/links/UnstyledLink';

// icon
import { CommonUtil } from '@/utils/commonUtil';

import { IProduct, ITagProduct } from '@/types/product';

// ----------------------------------------------------------------------

const SlickSettings = {
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
};

interface MainSliderProps {
  tagProduct: ITagProduct[];
}

export default function MainBetterSlider({ tagProduct }: MainSliderProps) {
  const slickRef = useRef<Slider | null>(null);
  const productBaseUrl = '/product?searchType=tag&tagId=';
  const [tagProductIndex, setTagProductIndex] = useState<number>(0);
  const [redirectUrl, setRedirectUrl] = useState<string>(productBaseUrl);

  const setTagProductOrder = (index: number) => {
    if (index < 0) {
      setTagProductIndex(tagProduct.length - 1);
      return;
    }
    if (index >= tagProduct.length) {
      setTagProductIndex(0);
      return;
    }
    setTagProductIndex(index);
  };

  const beforeSlideChange = (currentSlide: number, nextSlide: number) => {
    setTagProductOrder(nextSlide);
  };

  useEffect(() => {
    if (CommonUtil.isEmpty(tagProduct)) return;
    setRedirectUrl(
      productBaseUrl +
        tagProduct[tagProductIndex].tagId +
        '&tagNm=' +
        tagProduct[tagProductIndex].tagNm
    );
  }, [tagProductIndex, tagProduct.length]);

  return (
    <>
      {CommonUtil.isNotEmpty(tagProduct) && (
        <div className='betterSlider-container'>
          <div className='rounded-[12px] px-[16px] py-[20px] shadow-[0_0_0_1px_#E0E0E0]'>
            <Slider
              beforeChange={beforeSlideChange}
              ref={slickRef}
              {...SlickSettings}
              arrows={false}
            >
              {tagProduct.map(({ tagId, tagDetail, tagTitle, productInfo }) => (
                <div key={tagId} className={`w-[${100 / tagProduct.length}%]`}>
                  <div>
                    <h1 className='mb-[8px] text-center text-[22px] text-[#33374D]'>
                      {tagTitle}
                    </h1>
                    <p className='mb-[28px] text-center text-[16px] text-[#858794]'>
                      {tagDetail}
                    </p>
                    <SliderItem productInfo={productInfo} />
                  </div>
                  <span className='mt-[21px] inline-block w-full text-center text-[14px] text-[#2E9BFF]'>
                    <UnstyledLink href={redirectUrl}>
                      상품 전체 보기 &gt;
                    </UnstyledLink>
                  </span>
                </div>
              ))}
            </Slider>
          </div>
        </div>
      )}
    </>
  );
}

function SliderItem({ productInfo }: { productInfo: IProduct[] }) {
  const itemList: IProduct[] = productInfo;
  return (
    <div>
      {itemList.map((item: IProduct, index) => (
        <UnstyledLink
          key={index}
          href={`/product?searchType=product&productId=${item.productId}`}
        >
          <SliderItemBox>
            <ItemImage>
              <Image
                src={item.imgUrl}
                alt={item.financialCompany}
                layout='fill'
                objectFit='contain'
                className='trans'
              />
            </ItemImage>
            <div className='h-[65px] w-full min-w-[100px]'>
              <ItemText1>{item.productName}</ItemText1>
              <ItemText2>
                {item.stockCompany}
                <ItemTextOr></ItemTextOr> {item.financialCompany}
              </ItemText2>
              <ItemText3>금리 {item.initInterestRate}%</ItemText3>
            </div>
          </SliderItemBox>
        </UnstyledLink>
      ))}
    </div>
  );
}

// style
const SliderItemBox = tw.div`
flex mt-[16px] items-center justify-center border-b border-b-[#F1F5F9] pb-[16px]
`;
const ItemImage = tw.div`
min-w-[130px] w-full h-[65px] mr-[12px] border border-[#E8E8E8] rounded-[5px] relative
`;
const ItemText1 = tw.p`
text-[16px] text-[#33374D] font-semibold leading-[24px] overflow-hidden text-ellipsis whitespace-nowrap
`;
const ItemText2 = tw.p`
text-[12px] text-[#858794] font-normal flex items-center whitespace-nowrap  overflow-hidden text-ellipsis
`;
const ItemText3 = tw.p`
text-[13px] text-[#f56700] font-normal leading-[20px]
`;
const ItemTextOr = tw.span`
after:inline-block after:content-['|'] after:text-[13px] after:mx-[4px] after:text-[#ccc] after:leading-[24px]
md:after:mx-[12px]
`;
