import { yupResolver } from '@hookform/resolvers/yup';
import Image from 'next/image';
import { useRouter } from 'next/router';
import * as React from 'react';
import { ChangeEvent, useState } from 'react';
import { useForm } from 'react-hook-form';
import tw from 'tailwind-styled-components';
import * as Yup from 'yup';

// component
import { CheckBox, FormProvider, TextField } from '@/components/form-provider';
import Layout from '@/components/layout/Layout';

import { useAppSelector } from '@/store/hook';

import { requestConsulting } from '@/api/PaxnetApi';
// image, icon
import consultingImage from '@/assets/common/consulting.png';

type FormValuesProps = {
  userName: string;
  mobile: string;
  allAgree: boolean;
  termsCollecting: {
    allAgree: boolean;
    isCollectingMobileAgree: boolean;
    isCollectingSmsAgree: boolean;
  };
  termsConsignment: {
    allAgree: boolean;
    isConsignmentMobileAgree: boolean;
    isConsignmentSmsAgree: boolean;
  };
  isMarketingAgree: boolean;
};

const mobileNumberRegex = /^01([0|1|6|7|8|9])-?([0-9]{3,4})-?([0-9]{4})$/;

const ValidationSchema = Yup.object().shape({
  userName: Yup.string().required('성함을 입력해주세요.'),
  mobile: Yup.string()
    .required('휴대폰번호를 입력해주세요.')
    .matches(mobileNumberRegex, '올바른 형식의 휴대폰번호를 입력해주세요.'),

  termsCollecting: Yup.object().shape(
    {
      isCollectingMobileAgree: Yup.bool().when('isCollectingSmsAgree', {
        is: (isCollectingSmsAgree: boolean) => !isCollectingSmsAgree,
        then: Yup.bool().oneOf(
          [true],
          '개인정보 수집 · 이용에 대하여 동의해 주시기 바랍니다.'
        ),
      }),
      isCollectingSmsAgree: Yup.bool().when('isCollectingMobileAgree', {
        is: (isCollectingMobileAgree: boolean) => !isCollectingMobileAgree,
        then: Yup.bool().oneOf(
          [true],
          '개인정보 수집 · 이용에 대하여 동의해 주시기 바랍니다.'
        ),
      }),
    },
    [
      ['isCollectingMobileAgree', 'isCollectingSmsAgree'],
      ['isCollectingSmsAgree', 'isCollectingMobileAgree'],
    ]
  ),

  termsConsignment: Yup.object().shape(
    {
      isConsignmentMobileAgree: Yup.bool().when('isConsignmentSmsAgree', {
        is: (isConsignmentSmsAgree: boolean) => !isConsignmentSmsAgree,
        then: Yup.bool().oneOf(
          [true],
          '개인정보 제3자 제공 및 위탁에 동의해 주시기 바랍니다.'
        ),
      }),
      isConsignmentSmsAgree: Yup.bool().when('isConsignmentMobileAgree', {
        is: (isConsignmentMobileAgree: boolean) => !isConsignmentMobileAgree,
        then: Yup.bool().oneOf(
          [true],
          '개인정보 제3자 제공 및 위탁에 동의해 주시기 바랍니다.'
        ),
      }),
    },
    [
      ['isConsignmentMobileAgree', 'isConsignmentSmsAgree'],
      ['isConsignmentSmsAgree', 'isConsignmentMobileAgree'],
    ]
  ),
});

const initialValues: FormValuesProps = {
  userName: '',
  mobile: '',
  allAgree: false,
  termsCollecting: {
    allAgree: false,
    isCollectingMobileAgree: false,
    isCollectingSmsAgree: false,
  },
  termsConsignment: {
    allAgree: false,
    isConsignmentMobileAgree: false,
    isConsignmentSmsAgree: false,
  },
  isMarketingAgree: false,
};

export interface ConsultingRequest {
  userNm: string;
  hp: string;
  tm: string;
  sms: string;
  path: string;
}

export default function Consulting() {
  const [formValue, setFormValue] = useState(initialValues);
  const methods = useForm<FormValuesProps>({
    resolver: yupResolver(ValidationSchema),
    defaultValues: formValue,
  });
  const router = useRouter();

  const { CODE } = useAppSelector((state) => state.allianceReducer);
  const { handleSubmit, reset, getValues } = methods;

  const onSubmit = async (data: FormValuesProps) => {
    const request: ConsultingRequest = {
      userNm: data.userName,
      hp: data.mobile,
      tm: data.termsCollecting.isCollectingMobileAgree ? 'Y' : 'N',
      sms: data.termsCollecting.isCollectingSmsAgree ? 'Y' : 'N',
      path: CODE,
    };
    const res = await requestConsulting(request);
    if (res) {
      router.push('/completeConsulting');
    }
  };

  const resetFormValue = () => {
    formValue.userName = getValues('userName');
    formValue.mobile = getValues('mobile');
    setFormValue({ ...formValue });
    reset(formValue);
  };

  const handelAllAgree = (checked: boolean) => {
    formValue.termsCollecting.allAgree = checked;
    formValue.termsCollecting.isCollectingMobileAgree = checked;
    formValue.termsCollecting.isCollectingSmsAgree = checked;
    formValue.termsConsignment.allAgree = checked;
    formValue.termsConsignment.isConsignmentMobileAgree = checked;
    formValue.termsConsignment.isConsignmentSmsAgree = checked;
    formValue.isMarketingAgree = checked;
    setFormValue({ ...formValue });
    resetFormValue();
  };
  const checkIsAllAgree = () => {
    const isAllAgree =
      formValue.termsCollecting.isCollectingMobileAgree &&
      formValue.termsCollecting.isCollectingSmsAgree &&
      formValue.termsConsignment.isConsignmentMobileAgree &&
      formValue.termsConsignment.isConsignmentSmsAgree &&
      formValue.isMarketingAgree;
    if (isAllAgree) formValue.allAgree = true;
    else formValue.allAgree = false;
    setFormValue({ ...formValue });
    resetFormValue();
  };

  return (
    <Layout>
      <ConsultingHeader>
        <ConsultingHeaderH2>상담신청</ConsultingHeaderH2>
        <Image src={consultingImage} width={124} height={91} alt='consulting' />
        <p className='ml-[-30px] mt-[10px]'>
          <ConsultingHeaderStrong>
            지금 바로 상담신청 하세요!
          </ConsultingHeaderStrong>
          <br />
          <ConsultingHeaderSpan>
            상담신청 남기시면, 실시간 상담이 가능합니다.
          </ConsultingHeaderSpan>
        </p>
      </ConsultingHeader>
      <ConsultingFormContainer>
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
          <div>
            <TextField inputName='userName' labelName='성함' />
            <TextField
              inputName='mobile'
              labelName='휴대전화'
              placeHolder='휴대전화번호 &#39;-&#39; 입력 제외'
            />

            <ConsultingCheckboxContainer>
              <div className='mb-[30px]'>
                <CheckBox
                  inputName='allAgree'
                  labelName='전체약관 동의'
                  inputValue={formValue.allAgree}
                  handleChange={(e: ChangeEvent<HTMLInputElement>) => {
                    formValue.allAgree = e.target.checked;
                    handelAllAgree(e.target.checked);
                  }}
                />
              </div>
              <div className='mb-[10px] flex'>
                <CheckBox
                  inputName='termsCollecting.allAgree'
                  labelName='개인정보 수집이용동의'
                  inputValue={formValue.termsCollecting.allAgree}
                  handleChange={(e: ChangeEvent<HTMLInputElement>) => {
                    const termsCollecting = formValue.termsCollecting;
                    termsCollecting.allAgree = e.target.checked;
                    if (e.target.checked) {
                      termsCollecting.isCollectingMobileAgree = true;
                      termsCollecting.isCollectingSmsAgree = true;
                    } else {
                      termsCollecting.isCollectingMobileAgree = false;
                      termsCollecting.isCollectingSmsAgree = false;
                    }
                    setFormValue({ ...formValue, termsCollecting });
                    checkIsAllAgree();
                  }}
                />
                <ConsultingCheckMobileSMS>
                  <CheckBox
                    inputName='termsCollecting.isCollectingMobileAgree'
                    labelName='전화'
                    inputValue={
                      formValue.termsCollecting.isCollectingMobileAgree
                    }
                    handleChange={(e: ChangeEvent<HTMLInputElement>) => {
                      const termsCollecting = formValue.termsCollecting;
                      termsCollecting.isCollectingMobileAgree =
                        e.target.checked;
                      if (
                        !termsCollecting.isCollectingMobileAgree &&
                        !termsCollecting.isCollectingSmsAgree
                      ) {
                        termsCollecting.allAgree = false;
                      } else {
                        termsCollecting.allAgree = true;
                      }
                      setFormValue({ ...formValue, termsCollecting });
                      checkIsAllAgree();
                    }}
                  />
                  <CheckBox
                    inputName='termsCollecting.isCollectingSmsAgree'
                    labelName='SMS'
                    inputValue={formValue.termsCollecting.isCollectingSmsAgree}
                    handleChange={(e: ChangeEvent<HTMLInputElement>) => {
                      const termsCollecting = formValue.termsCollecting;
                      termsCollecting.isCollectingSmsAgree = e.target.checked;
                      if (
                        !termsCollecting.isCollectingMobileAgree &&
                        !termsCollecting.isCollectingSmsAgree
                      ) {
                        termsCollecting.allAgree = false;
                      } else {
                        termsCollecting.allAgree = true;
                      }
                      setFormValue({ ...formValue, termsCollecting });
                      checkIsAllAgree();
                    }}
                  />
                </ConsultingCheckMobileSMS>
              </div>

              <ConsultingTermsContents>
                1. 수집주체 : (주)에이티코넥 <br />
                2. 수집항목 : 이름, 연락처
                <br /> 3. 수집목적
                <br />
                서비스운영 : 스탁론 상품안내, 고객 불만 및 민원 처리, 고지사항
                전달
                <br /> 4. 보유기간 : 1년
              </ConsultingTermsContents>

              <div className='mt-[30px] mb-[10px] flex'>
                <CheckBox
                  inputName='termsConsignment.allAgree'
                  labelName='개인정보 위탁정보'
                  inputValue={formValue.termsConsignment.allAgree}
                  handleChange={(e: ChangeEvent<HTMLInputElement>) => {
                    const termsConsignment = formValue.termsConsignment;
                    termsConsignment.allAgree = e.target.checked;
                    if (e.target.checked) {
                      termsConsignment.isConsignmentMobileAgree = true;
                      termsConsignment.isConsignmentSmsAgree = true;
                    } else {
                      termsConsignment.isConsignmentMobileAgree = false;
                      termsConsignment.isConsignmentSmsAgree = false;
                    }
                    setFormValue({ ...formValue, termsConsignment });
                    checkIsAllAgree();
                  }}
                />
                <ConsultingCheckMobileSMS>
                  <CheckBox
                    inputName='termsConsignment.isConsignmentMobileAgree'
                    labelName='전화'
                    inputValue={
                      formValue.termsConsignment.isConsignmentMobileAgree
                    }
                    handleChange={(e: ChangeEvent<HTMLInputElement>) => {
                      const termsConsignment = formValue.termsConsignment;
                      termsConsignment.isConsignmentMobileAgree =
                        e.target.checked;
                      if (
                        !termsConsignment.isConsignmentMobileAgree &&
                        !termsConsignment.isConsignmentSmsAgree
                      ) {
                        termsConsignment.allAgree = false;
                      } else {
                        termsConsignment.allAgree = true;
                      }
                      setFormValue({ ...formValue, termsConsignment });
                      checkIsAllAgree();
                    }}
                  />
                  <CheckBox
                    inputName='termsConsignment.isConsignmentSmsAgree'
                    labelName='SMS'
                    inputValue={
                      formValue.termsConsignment.isConsignmentSmsAgree
                    }
                    handleChange={(e: ChangeEvent<HTMLInputElement>) => {
                      const termsConsignment = formValue.termsConsignment;
                      termsConsignment.isConsignmentSmsAgree = e.target.checked;
                      if (
                        !termsConsignment.isConsignmentMobileAgree &&
                        !termsConsignment.isConsignmentSmsAgree
                      ) {
                        termsConsignment.allAgree = false;
                      } else {
                        termsConsignment.allAgree = true;
                      }
                      setFormValue({ ...formValue, termsConsignment });
                      checkIsAllAgree();
                    }}
                  />
                </ConsultingCheckMobileSMS>
              </div>

              <ConsultingTermsContents>
                1. 개인정보의 위탁 <br />① 활용범위 : 주식매입자금대출 서비스를
                제공 하는 과정에서 대출 안내 등 고객응대를 위해 정보 공유
                <br /> ② 개인정보취급 위탁을 받는자: (주)팍스넷
              </ConsultingTermsContents>
              <div className='mt-[30px] mb-[10px] flex'>
                <CheckBox
                  inputName='isMarketingAgree'
                  labelName='마케팅 활용 동의 (선택 동의)'
                  inputValue={formValue.isMarketingAgree}
                  handleChange={(e: ChangeEvent<HTMLInputElement>) => {
                    formValue.isMarketingAgree = e.target.checked;
                    setFormValue({ ...formValue });
                    checkIsAllAgree();
                  }}
                />
              </div>
              <ConsultingTermsContents>
                1. 수집주체 : (주)에이티코넥
                <br /> 2. 수집항목 : 이름, 연락처 <br />
                3. 수집목적
                <br /> ① 마케팅활용 : 금융상품 안내 및 권유, 이벤트
                경품지급(코넥스탁론 프로모션), 광고성 정보 전달 <br />
                4. 보유기간 : 1년 <br />※ 동의를 거부하시는 경우에도 스탁론
                서비스를 이용하실 수 있습니다.
              </ConsultingTermsContents>
            </ConsultingCheckboxContainer>
            <div className='mt-[41px] text-center'>
              <ConsultingSubmit type='submit'>신청하기</ConsultingSubmit>
            </div>
          </div>
        </FormProvider>
      </ConsultingFormContainer>
    </Layout>
  );
}

// style
const ConsultingHeader = tw.div`
overflow-hidden h-[300px] max-h-[300px] min-h-[101px] bg-[#E3E9F6] text-center pt-[35px] pl-[30px]
`;
const ConsultingHeaderH2 = tw.h2`
leading-[31px] text-[26px] font-bold text-[#26499D] tracking[-0.02em] mb-[19px] ml-[-30px]
`;
const ConsultingHeaderStrong = tw.strong`
text-2xl font-semibold leading-[29px] text-[#222] tracking-[-0.02em]
`;
const ConsultingHeaderSpan = tw.span`
text-base font-noraml leading-[39px] text-[#222] tracking-[-0.02em]
`;
const ConsultingFormContainer = tw.div`
max-w-[650px] mx-auto pb-[100px] px-[20px] md:px-[40px] pt-[25px]
`;
const ConsultingCheckboxContainer = tw.div`
pt-[30px]
`;
const ConsultingCheckMobileSMS = tw.div`
text-[#666] flex 
before:content-['('] before:mr-[3px]
after:content-[')'] after:ml-[3px]
`;
const ConsultingTermsContents = tw.div`
h-[70px] overflow-y-scroll rounded-[4px] border border-[#EAECF1] py-[11px] px-[14px] text-[13px] font-normal leading-[20px] text-[#666]
`;
const ConsultingSubmit = tw.button`
w-[55%] h-[60px] text-[16px] font-bold text-white leading-[60px] bg-[#26499D]
`;
