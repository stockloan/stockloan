export interface IProduct {
  productName: string; // 상품명
  productId: string; // 상품 ID
  stockCompany: string; // 증권사
  financialCompany: string; // 금융사
  productType: string; // 상품구분
  limitAmount: number; // 한도금액
  interestRateType: string; // 금리타입
  initInterestRate: number; // 최초금리
  extendInterestRate: number; // 연장금리
  loanTerm: string; // 대출기간
  focusInvestRate: number; // 집중투자율
  lossCutRate: number; // 로스컷비율
  cashDrawRate: number; // 현금인출비율
  linkUrl: string; // 링크 url
  imgUrl: string; // 이미지 url
  tagIds: string[];
}

export interface IKeyValue {
  type: string;
  id: string;
  name: string;
}

export interface ISearchParams {
  keyword: string;
  page: number;
  countPerPage: number;
  tagId: string;
  productId: string;
  isMnFrqntly: string;
  isMnGds: string; // 태그검색 노출 유무 (y, n)
  stockCompanyIds: number[];
  financialCompanyIds: number[];
  productTypeIds: number[];
  interestRateTypeIds: number[];
  focusInvestRateIds: number[];
  loanTermIds: number[];
  tagIds: string[];
}

export interface ISearchItem {
  id: number;
  itemName: string;
  checked: boolean;
}
export interface ISerachItemList {
  items: ISearchItem[];
  label: string;
  labelName: string;
}

export const COUNT_PER_PAGE = 5;
export const INIT_PAGE = 1;

export const initSearchParams: ISearchParams = {
  keyword: '',
  page: INIT_PAGE,
  countPerPage: COUNT_PER_PAGE,
  tagId: '',
  productId: '',
  isMnFrqntly: '',
  isMnGds: '',
  stockCompanyIds: [],
  financialCompanyIds: [],
  productTypeIds: [],
  interestRateTypeIds: [],
  focusInvestRateIds: [],
  loanTermIds: [],
  tagIds: [],
};

export interface ITagProduct {
  tagId: string;
  tagNm: string;
  tagTitle: string | undefined;
  tagDetail: string | undefined;
  productInfo: IProduct[];
}

export interface ITagDisplayInfo {
  title: string;
  detail: string;
}

export interface ITagMappingTable {
  [key: string]: ITagDisplayInfo;
}

export const tagMappingTable: ITagMappingTable = {
  Best인기상품: {
    title: '인기상품',
    detail: '이미 많은 분들이 선택하고 있어요.',
  },
  단기투자상품: {
    title: '단기 투자',
    detail: '빠른 투자수익 기대할 때 가장 좋아요.',
  },
  '100%집중 투자상품': {
    title: '레버리지 극대화',
    detail: '한 종목 최고 100%까지 집중투자할 수 있어요.',
  },
  '신용/미수 대환상품': {
    title: '신용/미수 대환',
    detail: '지금 계좌 그대로 더 좋은 조건으로 갈아타세요.',
  },
  업계최저금리: {
    title: '',
    detail: '',
  },
};
