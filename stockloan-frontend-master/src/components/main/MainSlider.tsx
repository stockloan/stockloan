/* eslint-disable react-hooks/exhaustive-deps */
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import Slider from 'react-slick';
import tw from 'tailwind-styled-components';

import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

import UnstyledLink from '@/components/links/UnstyledLink';

// icon
import { IconArrowNext } from '@/assets/icon/IconArrowNext';
import { IconArrowPrev } from '@/assets/icon/IconArrowPrev';
import { IconMore } from '@/assets/icon/IconMore';
import { CommonUtil } from '@/utils/commonUtil';

// test json
import { IProduct, ITagProduct } from '@/types/product';

// ----------------------------------------------------------------------
/* const sliderHeader = [
  { id: 1, title: '인기상품', description: '이미 많은분들이 선택하고 있어요.' },
  {
    id: 2,
    title: '단기 투자',
    description: '빠른 투자수익 기대할 때 가장 좋아요.',
  },
  {
    id: 3,
    title: '레버리지 극대화',
    description: '한 종목 최고 100%까지 집중투자할 수 있어요.',
  },
  {
    id: 4,
    title: '신용/미수 대환',
    description: '지금 께좌 그대로 더 좋은 조건으로 갈아타세요.',
  },
]; */

const SlickSettings = {
  dots: false,
  infinite: true,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
};

interface MainSliderProps {
  tagProduct: ITagProduct[];
}

export default function MainSlider({ tagProduct }: MainSliderProps) {
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
        <MainSliderContainer>
          <IconArrowPrev
            onClick={() => {
              slickRef?.current?.slickPrev();
              setTagProductOrder(tagProductIndex - 1);
            }}
            className='hidden h-[29px] w-[17px] md:block'
          />
          <SliderContainer>
            <SliderHeader>자주 찾는 조건별 대출상품</SliderHeader>
            <Slider
              beforeChange={beforeSlideChange}
              ref={slickRef}
              {...SlickSettings}
            >
              {tagProduct.map(({ tagId, tagDetail, tagTitle, productInfo }) => (
                <SliderItemContainer
                  key={tagId}
                  className={`w-[${100 / tagProduct.length}%]`}
                >
                  <div>
                    <SliderItemDescription>{tagDetail}</SliderItemDescription>
                    <SliderItemTitle>{tagTitle}</SliderItemTitle>
                    <SliderItem productInfo={productInfo} />
                  </div>
                </SliderItemContainer>
              ))}
            </Slider>
            <IconMoreContainer>
              <UnstyledLink href={redirectUrl}>
                <IconMore className='block h-[55px] w-[55px]' />
              </UnstyledLink>
            </IconMoreContainer>
          </SliderContainer>
          <IconArrowNext
            onClick={() => {
              slickRef?.current?.slickNext();
              setTagProductOrder(tagProductIndex + 1);
            }}
            className='hidden h-[29px] w-[17px] md:block'
          />
        </MainSliderContainer>
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
            <div className='w-full min-w-[100px] py-3'>
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
const MainSliderContainer = tw.div`
w-[100%] flex items-center justify-center
md:w-[50%] md:justify-between
`;
const SliderContainer = tw.div`
max-w-[500px] w-full h-[650px] bg-white rounded-[30px] shadow-[5px_15px_30px_rgb(38,73,157,0.25)] relative overflow-x-hidden
md:h-[700px]
`;
const SliderHeader = tw.h2`
text-center py-[12px] bg-[#26499D] rounded-t-[30px] text-white text-[18px]
md:text-[20px]
`;
const SliderItemContainer = tw.div`
 float-left pt-[36px] pb-[24px] px-[8px]
 md:pt-[44px] md:px-[40px]
`;
const SliderItemDescription = tw.p`
text-[12px] font-medium text-center leading-none
md:text-[20px] md:leading-[24px]
`;
const SliderItemTitle = tw.h1`
mt-[12px] pb-[43px] text-[36px] font-extrabold text-[#26499D] text-center leading-none 
md:text-[42px] md:leading-[48px] md:mt-[5px]
`;
const SliderItemBox = tw.div`
flex mb-[30px] items-center justify-center
`;
const ItemImage = tw.div`
max-w-[200px] w-full h-[70px] mr-[20px] border border-[#E8E8E8] rounded-[10px] relative
md:h-[100px] md:w-full md:max-w-[50%]
`;
const ItemText1 = tw.p`
text-[16px] font-semibold leading-none mb-[4px] overflow-hidden text-ellipsis whitespace-nowrap
md:text-[18px] md:leading-[22px] md:mb-[10px]
`;
const ItemText2 = tw.p`
text-[8px] text-[#666] font-normal leading-[24px] flex item-center whitespace-nowrap
md:text-[15px]
`;
const ItemText3 = tw.p`
text-[12px] text-[#ff2b77] font-semibold leading-[24px]
md:text-[15px]
`;
const ItemTextOr = tw.span`
after:inline-block after:content-['|'] after:text-[13px] after:mx-[4px] after:text-[#ccc] after:leading-[24px]
md:after:mx-[12px]
`;
const IconMoreContainer = tw.div`
absolute bottom-[30px] left-[50%] translate-x-[-50%]
`;
