/* eslint-disable unused-imports/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Tab, Tabs } from '@mui/material';
import { styled } from '@mui/material/styles';
import clsx from 'clsx';
import _ from 'lodash';
import { useRouter } from 'next/router';
import { ChangeEvent, KeyboardEvent, useEffect, useRef, useState } from 'react';
import * as React from 'react';
import Pagination from 'react-js-pagination';
import tw from 'tailwind-styled-components';

import { useMediaQuery } from '@/hooks/useMediaQuery';

import Drawer from '@/components/common/Drawer';
// component
import Modal from '@/components/common/Modal';
import Layout from '@/components/layout/Layout';
import ProductItem from '@/components/product/ProductItem';
import ProductResultFilter from '@/components/product/ProductResultFilter';
import ProductSearchItem from '@/components/product/ProductSearchItem';

import {
  getCodeList,
  getStockList,
  getStockloanProducts,
  getTagList,
} from '@/api/BetterApi';
import { IconFilter } from '@/assets/icon/IconFilter';
import { IconRefresh } from '@/assets/icon/IconRefresh';
import { IconSearch } from '@/assets/icon/IconSearch';
import { CommonUtil } from '@/utils/commonUtil';

// interface
import {
  COUNT_PER_PAGE,
  IKeyValue,
  INIT_PAGE,
  initSearchParams,
  IProduct,
  ISearchItem,
  ISearchParams,
  ISerachItemList,
} from '@/types/product';

// image, icon

export interface ITag {
  id: string;
  title: string;
}

export const apiResponseMapping = (response: any) => {
  return response.data.map((item: any) => {
    const product: IProduct = {
      productName: item.attributes?.GDS_NM, // 상품명
      productId: item.id,
      stockCompany: item.attributes?.stock_org?.data?.attributes.ORG_NM, // 증권사
      financialCompany: item.attributes?.finance_org?.data?.attributes.CD_NM, // 금융사
      productType: item.attributes?.gds_type?.data?.attributes.CD_NM, // 상품구분
      limitAmount: item.attributes?.LMT_AMNT, // 한도금액
      interestRateType: item.attributes?.rate_type?.data?.attributes.CD_NM, // 금리타입
      initInterestRate: CommonUtil.round(
        item.attributes?.INTL_INTRST_RT * 100,
        3
      ), // 최초금리
      extendInterestRate: CommonUtil.round(
        item.attributes?.EXTND_INTRST_RT * 100,
        3
      ), // 연장금리
      loanTerm: item.attributes?.period?.data?.attributes.CD_NM, // 대출기간
      focusInvestRate: item.attributes?.con_rate?.data?.attributes.CD_NM, // 집중투자율
      lossCutRate: CommonUtil.round(item.attributes?.LSS_CT_RT * 100, 3), // 로스컷비율
      cashDrawRate: CommonUtil.round(item.attributes?.CSH_WTHDWL_RT * 100, 3), // 현금인출비율
      linkUrl: item.attributes?.LNK_URL, // 링크 url
      imgUrl: item.attributes?.stock_org?.data?.attributes.ORG_IMG_URL, // 이미지 url
      tagIds: item.attributes?.gds_grp?.data.map((item: any) => item.id),
    };
    return product;
  });
};

export default function Product() {
  const router = useRouter();
  const isMobile = useMediaQuery(768);
  const [products, setProducts] = useState<IProduct[]>([]);
  const [totalItemsCount, setTotalItemsCount] = useState<number>(0);
  const [searchParams, setSearchParams] =
    useState<ISearchParams>(initSearchParams);
  const [searchTitle, setSerachTitle] = useState<string>('전체리스트');
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [tagIndex, setTagIndex] = useState<number>(0);
  const inputKeyword = useRef<HTMLInputElement>(null);

  // 각 항목 별 ID 리스트
  const [stockKeyValueMapList, setStockKeyValueMapList] = useState<IKeyValue[]>(
    []
  );
  const [financialKeyValueMapList, setFinancialKeyValueMapList] = useState<
    IKeyValue[]
  >([]);
  const [productTypeKeyValueMapList, setProductTypeKeyValueMapList] = useState<
    IKeyValue[]
  >([]);
  const [rateTypeKeyValueMapList, setRateTypeKeyValueMapList] = useState<
    IKeyValue[]
  >([]);
  const [focusInvestRateKeyValueMapList, setFocusInvestRateKeyValueMapList] =
    useState<IKeyValue[]>([]);
  const [loanTermKeyValueMapList, setLoanTermKeyValueMapList] = useState<
    IKeyValue[]
  >([]);
  const [tagKeyValueList, setTagKeyValueList] = useState<IKeyValue[]>([]);

  // 화면 출력 태그 리스트
  const [tagDisplayList, setTagDisplayList] = useState<ITag[]>([]);
  // 조건 검색 아이템 리스트
  const [searchItemList, setSearchItemList] = useState<ISerachItemList[]>([]);

  const getProducts = async (params: ISearchParams) => {
    return await getStockloanProducts(params);
  };

  const handleSearchParams = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSearchParams({
      ...searchParams,
      [name]: value,
    });
  };

  const handleEnterKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      inputKeyword.current?.blur();
      handleSubmit();
    }
  };

  const resetIdList = (searchParams: ISearchParams) => {
    searchParams.stockCompanyIds = [];
    searchParams.financialCompanyIds = [];
    searchParams.productTypeIds = [];
    searchParams.interestRateTypeIds = [];
    searchParams.focusInvestRateIds = [];
    searchParams.loanTermIds = [];
    searchParams.tagId = '';
    searchParams.productId = '';
  };

  const resetCheckList = () => {
    setSearchItemList(
      searchItemList.map((label) => ({
        ...label,
        items: label.items.map((item: any) => ({
          ...item,
          checked: item.id == 0 ? true : false,
        })),
      }))
    );
  };

  const handleSubmit = async () => {
    const newSearchParams = _.cloneDeep(searchParams);
    resetIdList(newSearchParams);
    newSearchParams.isMnFrqntly = '';
    newSearchParams.isMnGds = '';
    newSearchParams.page = INIT_PAGE;
    drawProducts(newSearchParams);
    const title = searchParams.keyword
      ? '증권사/금융사 검색 : ' + searchParams.keyword
      : '전체리스트';
    setSerachTitle(title);
    resetCheckList();
  };

  const handleSearchParamsSubmit = async (
    searchParams: ISearchParams,
    title: string
  ) => {
    drawProducts(searchParams);
    setSerachTitle(title);
    resetCheckList();
  };

  const handleSubmitFromIndex = async (searchObject: any) => {
    const searchType = searchObject.searchType;
    const newSearchParams = _.cloneDeep(initSearchParams);
    switch (searchType) {
      case 'stock':
        newSearchParams.keyword = searchObject.stockNm;
        handleSearchParamsSubmit(
          newSearchParams,
          '증권사/금융사 검색 : ' + newSearchParams.keyword
        );
        break;
      case 'tag':
        handleTagSubmit({
          id: searchObject.tagId,
          title: searchObject.tagNm,
        });
        break;
      case 'product':
        newSearchParams.productId = searchObject.productId;
        handleSearchParamsSubmit(newSearchParams, '');
        break;
      default:
        break;
    }
  };

  const handlePagingSubmit = async (page: number) => {
    const newSearchParams = _.cloneDeep(searchParams);
    newSearchParams.page = page;
    drawProducts(newSearchParams);
  };

  const handleFilterSubmit = async (searchParams: ISearchParams) => {
    drawProducts(searchParams);
    setSerachTitle('조건 검색');
  };

  const handleTagSubmit = async (tag: ITag) => {
    const newSearchParams = _.cloneDeep(initSearchParams);
    newSearchParams.tagId = tag.id;
    newSearchParams.isMnFrqntly = 'y';
    if (parseInt(newSearchParams.tagId) === 0) {
      handleSubmit();
      setSerachTitle('전체리스트');
    } else {
      drawProducts(newSearchParams);
      setSerachTitle(tag.title);
    }
    resetCheckList();
  };
  const handleMobileTagChange = (
    event: React.SyntheticEvent,
    index: number
  ) => {
    setTagIndex(index);
    handleTagSubmit(tagDisplayList[index]);
  };

  const drawProducts = async (searchParams: ISearchParams) => {
    const apiResponse = await getProducts(searchParams);
    const products: IProduct[] = apiResponseMapping(apiResponse);
    const totalItemsCount = apiResponse.meta.pagination.total;
    setProducts(products);
    setTotalItemsCount(totalItemsCount);
    setSearchParams(searchParams);
  };

  const setStockKeyList = async () => {
    const stockList = await getStockList();
    const stockKeyValueMapList: IKeyValue[] = stockList.data.map(
      (item: any) => {
        const stockKeyValueMap: IKeyValue = {
          type: 'stock_org',
          id: item.id,
          name: item.attributes.ORG_NM,
        };
        return stockKeyValueMap;
      }
    );
    setStockKeyValueMapList(stockKeyValueMapList);
  };

  const setTagKeyList = async () => {
    const tagList = await getTagList();
    const tagKeyValueList: IKeyValue[] = tagList.data.map((item: any) => {
      const tagKeyValueMap: IKeyValue = {
        type: 'tag',
        id: item.id,
        name: item.attributes.GRP_NM,
      };
      return tagKeyValueMap;
    });
    tagKeyValueList.unshift({
      type: 'tag',
      id: '0',
      name: '전체',
    });
    setTagKeyValueList(tagKeyValueList);
  };

  const setOtherKeyList = async () => {
    const otherKeyList = await getCodeList();
    const financialKeyValueMapList: IKeyValue[] = [];
    const productTypeKeyValueMapList: IKeyValue[] = [];
    const rateTypeKeyValueMapList: IKeyValue[] = [];
    const focusInvestRateKeyValueMapList: IKeyValue[] = [];
    const loanTermKeyValueMapList: IKeyValue[] = [];

    otherKeyList.data.forEach((item: any) => {
      const keyValueMap: IKeyValue = {
        type: '',
        id: item.id,
        name: item.attributes.CD_NM,
      };
      const codeType = item.attributes.CD_TYP;
      switch (codeType) {
        case 'code_2':
          keyValueMap.type = 'fin_org';
          financialKeyValueMapList.push(keyValueMap);
          break;
        case 'goods_type':
          keyValueMap.type = 'goods_type';
          productTypeKeyValueMapList.push(keyValueMap);
          break;
        case 'period':
          keyValueMap.type = 'period';
          loanTermKeyValueMapList.push(keyValueMap);
          break;
        case 'rate_type':
          keyValueMap.type = 'rate_type';
          rateTypeKeyValueMapList.push(keyValueMap);
          break;
        case 'con_rate':
          keyValueMap.type = 'con_rate';
          focusInvestRateKeyValueMapList.push(keyValueMap);
          break;
        default:
          break;
      }
    });
    setFinancialKeyValueMapList(financialKeyValueMapList);
    setProductTypeKeyValueMapList(productTypeKeyValueMapList);
    setRateTypeKeyValueMapList(rateTypeKeyValueMapList);
    setFocusInvestRateKeyValueMapList(focusInvestRateKeyValueMapList);
    setLoanTermKeyValueMapList(loanTermKeyValueMapList);
  };

  const setKeyList = () => {
    // 금융사 키 리스트
    setStockKeyList();
    // 태그 키 리스트
    setTagKeyList();
    // 그 외 나머지 키 리스트
    setOtherKeyList();
  };

  const isKeyInitCompleted = () => {
    if (
      CommonUtil.isExistAll(
        stockKeyValueMapList,
        financialKeyValueMapList,
        productTypeKeyValueMapList,
        rateTypeKeyValueMapList,
        focusInvestRateKeyValueMapList,
        loanTermKeyValueMapList,
        tagKeyValueList
      )
    ) {
      return true;
    } else {
      return false;
    }
  };

  const initSearchItemList = () => {
    const searchItemList = [];
    const commonItem = [{ id: 0, itemName: '전체', checked: true }];
    const stockSearchItem = {
      label: 'org_nm',
      labelName: '증권사',
      items: _.cloneDeep(commonItem),
    };
    stockKeyValueMapList.forEach((item: any) => {
      stockSearchItem.items.push({
        id: item.id,
        itemName: item.name,
        checked: false,
      });
    });
    searchItemList.push(stockSearchItem);

    const financialSearchItem = {
      label: 'fin',
      labelName: '금융사',
      items: _.cloneDeep(commonItem),
    };
    financialKeyValueMapList.forEach((item: any) => {
      financialSearchItem.items.push({
        id: item.id,
        itemName: item.name,
        checked: false,
      });
    });
    searchItemList.push(financialSearchItem);

    const productTypeSearchItem = {
      label: 'prod',
      labelName: '상품',
      items: _.cloneDeep(commonItem),
    };
    productTypeKeyValueMapList.forEach((item: any) => {
      productTypeSearchItem.items.push({
        id: item.id,
        itemName: item.name,
        checked: false,
      });
    });
    searchItemList.push(productTypeSearchItem);

    const rateSearchItem = {
      label: 'rate',
      labelName: '금리',
      items: _.cloneDeep(commonItem),
    };
    rateTypeKeyValueMapList.forEach((item: any) => {
      rateSearchItem.items.push({
        id: item.id,
        itemName: item.name,
        checked: false,
      });
    });
    searchItemList.push(rateSearchItem);

    const focusInvestSearchItem = {
      label: 'commi',
      labelName: '집중투자율',
      items: _.cloneDeep(commonItem),
    };
    focusInvestRateKeyValueMapList.forEach((item: any) => {
      focusInvestSearchItem.items.push({
        id: item.id,
        itemName: item.name,
        checked: false,
      });
    });
    searchItemList.push(focusInvestSearchItem);

    const loanTermSearchItem = {
      label: 'period',
      labelName: '대출기간',
      items: _.cloneDeep(commonItem),
    };
    loanTermKeyValueMapList.forEach((item: any) => {
      loanTermSearchItem.items.push({
        id: item.id,
        itemName: item.name,
        checked: false,
      });
    });
    searchItemList.push(loanTermSearchItem);
    setSearchItemList(searchItemList);
  };

  const checkSearchFilter = () => {
    const checkEntire: ISearchItem[] = [];
    searchItemList.forEach((list) => {
      if (!list.items[0].checked) {
        checkEntire.push(list.items[0]);
      }
    });
    if (checkEntire.length === 0) return false;
    else return true;
  };

  useEffect(() => {
    if (isKeyInitCompleted()) {
      setTagDisplayList(
        tagKeyValueList.map((item: any) => {
          return {
            id: item.id.toString(),
            title: item.name,
          };
        })
      );
      initSearchItemList();
    }

    // eslint-disable-next-line
  }, [
    stockKeyValueMapList,
    financialKeyValueMapList,
    productTypeKeyValueMapList,
    rateTypeKeyValueMapList,
    focusInvestRateKeyValueMapList,
    loanTermKeyValueMapList,
    tagKeyValueList,
  ]);

  useEffect(() => {
    if (!router.isReady) return;
    const routerQuery = router.query;
    if (CommonUtil.isNotEmpty(routerQuery)) {
      handleSubmitFromIndex(routerQuery);
    } else {
      handleSubmit();
    }
    setKeyList();
    // eslint-disable-next-line
  }, [router.isReady]);

  return (
    <Layout>
      {/* Header */}
      <ProductHeaderContainer>
        <ProductHeaderTitle>상품안내</ProductHeaderTitle>
        <div className='relative mx-auto mt-[16px] w-full max-w-[780px] bg-[#F1F5F9] px-[24px] py-[32px] md:mt-[47px] md:flex md:bg-transparent md:px-0 md:py-[32px]'>
          <p
            className={clsx(
              'mb-[17px] inline-block text-[15px] text-[#33374D] md:hidden',
              { 'text-[#2E9BFF]': searchParams.keyword.length > 0 }
            )}
          >
            증권사/금융사명
          </p>
          <div
            className={clsx(
              'relative flex h-[38px] w-full max-w-[700px] border-b border-b-[#E6E7EA] md:h-[70px] md:border-b-0',
              { 'border-b-[#2E9BFF]': searchParams.keyword.length > 0 }
            )}
          >
            <ProductSearchInput
              name='keyword'
              value={searchParams.keyword}
              type='text'
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                handleSearchParams(e)
              }
              onKeyPress={(e: KeyboardEvent<HTMLInputElement>) =>
                handleEnterKeyPress(e)
              }
              placeholder={
                isMobile ? '검색해보세요' : '증권사/금융사명을 입력하세요.'
              }
              ref={inputKeyword}
            />
            <ProductSearchButton onClick={() => handleSubmit()}>
              <IconSearch className='stroke-[#33374D] md:stroke-[#26499D]' />
            </ProductSearchButton>
          </div>
          <ProductFilterIcon
            onClick={() => {
              setOpenModal(true);
            }}
          >
            <span className='relative mx-auto mt-[4px] block h-[24px] w-[24px] md:mt-0 md:h-[45px] md:w-[45px]'>
              <IconFilter className='stroke-[#33374D] md:stroke-white' />
            </span>
          </ProductFilterIcon>
        </div>
        {/* 상품 태그 */}
        {isMobile ? (
          <div className='mt-[32px]'>
            <MobileTabs
              value={tagIndex}
              onChange={handleMobileTagChange}
              variant='scrollable'
              scrollButtons='auto'
              aria-label='scrollable auto tabs example'
              TabIndicatorProps={{
                children: <span className='MuiTabs-indicatorSpan' />,
              }}
            >
              {tagDisplayList.map((tag) => (
                <MobileTab key={tag.id} label={tag.title} />
              ))}
            </MobileTabs>
          </div>
        ) : (
          <div className='mt-[30px]  flex justify-center overflow-x-scroll scrollbar-hide'>
            {tagDisplayList.map((tag) => (
              <ProductTagButton
                key={tag.id}
                onClick={() => {
                  handleTagSubmit(tag);
                  initSearchItemList();
                }}
                className={clsx({
                  'bg-[#26499D] text-white shadow-[4px_4px_15px_rgb(38,73,157,0.25)]':
                    searchParams.tagId === tag.id,
                })}
              >
                {tag.title}
              </ProductTagButton>
            ))}
          </div>
        )}
      </ProductHeaderContainer>
      <div className='relative mx-auto w-full max-w-[1180px] pt-[40px] md:pt-[50px]'>
        {/* 상품 조건 검색 리스트 */}
        {checkSearchFilter() ? (
          <div className='mb-[55px] hidden rounded-t-[50px] border border-[#E8E8E8] md:block'>
            <ProductResultFilter searchItemList={searchItemList} />
            <div className='flex w-full'>
              <ProductResultFilterButton
                className='flex items-center justify-center bg-[#E8E8E8]'
                onClick={() => {
                  handleSubmit();
                  initSearchItemList();
                  setSerachTitle('전체리스트');
                }}
              >
                <IconRefresh />
                &nbsp;조건 초기화
              </ProductResultFilterButton>
              <ProductResultFilterButton
                className='bg-[#FF2B77] text-white'
                onClick={() => {
                  setOpenModal(true);
                }}
              >
                조건 검색 수정
              </ProductResultFilterButton>
            </div>
          </div>
        ) : (
          ''
        )}
        {/* 상품리스트 */}
        <h3 className='px-[20px] text-[24px] font-semibold leading-[29px] text-[#222]'>
          {isMobile ? `총 ${totalItemsCount}건` : searchTitle}
        </h3>
        <div className='mt-[24px] px-[20px] pb-[119px] md:mt-0 md:px-0 md:pt-[39px]'>
          {products.map((item, index) => (
            <ProductItem key={index} product={item} />
          ))}
          <Pagination
            activePage={searchParams.page}
            itemsCountPerPage={COUNT_PER_PAGE}
            totalItemsCount={totalItemsCount}
            pageRangeDisplayed={5}
            prevPageText='‹'
            nextPageText='›'
            onChange={handlePagingSubmit}
            innerClass='flex justify-center items-center text-[18px] text-[#666] ml-[-20px] md:ml-[-40px]'
            itemClass='text-red ml-[20px] md:ml-[40px]'
            disabledClass='text-[#bbcfd8]'
            activeClass='text-[#26499D] font-bold border-b border-b-[#26499d]'
          />
        </div>
      </div>
      {isMobile ? (
        <ProductDrawer
          openDrawer={openModal}
          onDrawerClose={setOpenModal}
          searchItemList={searchItemList}
          handleSubmit={handleFilterSubmit}
        />
      ) : (
        <ProductModal
          openModal={openModal}
          onModalClose={setOpenModal}
          searchItemList={searchItemList}
          handleSubmit={handleFilterSubmit}
        />
      )}
    </Layout>
  );
}

interface ModalProps {
  openModal: boolean;
  onModalClose: (isOpen: boolean) => void;
  searchItemList: any[];
  handleSubmit: (searchParams: ISearchParams) => void;
}
function ProductModal({
  openModal,
  onModalClose,
  searchItemList,
  handleSubmit,
}: ModalProps) {
  const setModalSearchParams = (searchParams: ISearchParams) => {
    onModalClose(false);
    handleSubmit(searchParams);
  };
  return (
    <>
      {/* Modal */}
      <Modal open={openModal} close={onModalClose} header='조건검색'>
        <>
          <div className=' pt-[30px]'>
            <p className='px-[30px] text-[16px] text-[#666]'>
              ※ 원하시는 조건을 선택해주세요. (다중선택 가능)
            </p>
            <ProductSearchItem
              setParamsModal={setModalSearchParams}
              searchItemList={searchItemList}
            />
          </div>
        </>
      </Modal>
    </>
  );
}

interface DrawerProps {
  openDrawer: boolean;
  onDrawerClose: (isOpen: boolean) => void;
  searchItemList: any[];
  handleSubmit: (searchParams: ISearchParams) => void;
}
function ProductDrawer({
  openDrawer,
  onDrawerClose,
  searchItemList,
  handleSubmit,
}: DrawerProps) {
  const [tabIndex, setTabIndex] = useState<number>(0);
  const setModalSearchParams = (searchParams: ISearchParams) => {
    onDrawerClose(false);
    handleSubmit(searchParams);
  };
  const handleTab = (event: React.SyntheticEvent, index: number) => {
    setTabIndex(index);
  };
  return (
    <Drawer open={openDrawer} close={onDrawerClose} header='조건검색'>
      <div>
        <p className='mb-[16px] bg-[#F5F6F9] py-[12px] text-center text-[14px] text-[#858794] '>
          원하시는 조건을 선택해주세요. (다중선택 가능)
        </p>
        <FilterTabs
          value={tabIndex}
          onChange={handleTab}
          variant='scrollable'
          scrollButtons='auto'
          aria-label='scrollable auto tabs example'
          className='mb-[16px] pl-[20px]'
        >
          {searchItemList.map((item, index) => (
            <FilterTab key={index} label={item.labelName} />
          ))}
        </FilterTabs>
        <ProductSearchItem
          setParamsModal={setModalSearchParams}
          searchItemList={searchItemList}
          tabIndex={tabIndex}
        />
      </div>
    </Drawer>
  );
}

// style

// Header
const ProductHeaderContainer = tw.div`
w-full pt-[20px] h-auto
md:h-[480px] md:bg-[url('/images/product/bg_sub_product.jpeg')] md:bg-center md:pt-[95px] 
`;
const ProductResultFilterButton = tw.button`
h-[70px] w-[50%] text-center text-[18px] font-bold
`;
const ProductHeaderTitle = tw.h2`
text-[22px] font-bold text-[#33374D] text-left leading-[32px] px-[16px]
md:after:inline-block md:text-[48px] md:text-[#222] md:text-center md:leading-[58px] md:px-0
`;
const ProductSearchInput = tw.input`
h-[28px] w-[100%] mt-[5px] border-none pr-[60px] indent-[15px] text-[24px]  text-[#858794] leading-[28px] bg-transparent py-0 
md:h-[70px] md:rounded-[50px] md:bg-white md:text-[18px] md:text-[#aaa] md:leadint-[22px] md:mt-0 md:indent-[35px]
`;
const ProductSearchButton = tw.button`
absolute top-[50%] left-[0] h-[15px] w-[15px] translate-y-[-50%]
md:top-[50%] md:right-[29px] md:left-auto md:h-[28px] md:w-[28px] md:translate-y-[-50%]
`;
const ProductFilterIcon = tw.div`
absolute  h-[24px] w-[24px] cursor-pointer rounded-[50px] bg-transparent  text-center
bottom-[42px] right-[24px]
md:relative md:w-[70px] md:h-[70px] md:ml-[10px] md:pt-[12px] md:bottom-auto md:right-auto md:bg-[#FF2B77]
`;
const ProductTagButton = tw.button`
mr-[10px] w-auto whitespace-nowrap  bg-[rgba(255,255,255,0.6)] px-[15px] py-[10px] font-semibold rounded-[50px] text-[16px] text-[#666] leading-1
before:content-['#']
`;

// Tabs
interface StyledTabProps {
  label: string;
}
const MobileTabs = styled(Tabs)({
  '& .MuiTabs-indicator': {
    display: 'flex',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  '& .MuiTabs-indicatorSpan': {
    marginLeft: 16,
    marginRight: 16,
    width: '100%',
    backgroundColor: '#33374D',
  },
});
const MobileTab = styled((props: StyledTabProps) => (
  <Tab disableRipple {...props} />
))(({ theme }) => ({
  fontSize: '17px',
  color: '#B8B9C1',
  '&.Mui-selected': {
    color: '#33374D',
    fontWeight: theme.typography.fontWeightBold,
  },
  '&.Mui-focusVisible': {
    backgroundColor: '#33374D',
  },
}));

const FilterTabs = styled(Tabs)({
  '& .MuiTabs-indicator': {
    display: 'flex',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
});
const FilterTab = styled((props: StyledTabProps) => (
  <Tab disableRipple {...props} />
))(({ theme }) => ({
  fontSize: '14px',
  color: '#858794',
  padding: '6px 12px',
  border: '1px solid #DDE4EE',
  marginRight: '4px',
  borderRadius: '20px',
  minWidth: 'auto',
  minHeight: 'auto',
  lineHeight: '22px',
  '&.Mui-selected': {
    color: '#ffffff',
    boxShadow:
      '0px 4px 16px rgba(112, 144, 176, 0.12), 0px 2px 8px rgba(112, 144, 176, 0.12)',
    backgroundColor: '#33AAFF',
    border: 'unset',
  },
  '&.Mui-focusVisible': {
    backgroundColor: '#33374D',
  },
}));
