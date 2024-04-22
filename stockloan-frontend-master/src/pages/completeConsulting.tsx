import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import HomeIcon from '@mui/icons-material/Home';
import { useRouter } from 'next/router';
import tw from 'tailwind-styled-components';

import Layout from '@/components/layout/Layout';

import { useAppSelector } from '@/store/hook';

import { IconArrowNext } from '@/assets/icon/IconArrowNext';

export default function CompleteConsulting() {
  const router = useRouter();
  const { isEnter: isEnterBetter } = useAppSelector(
    (state) => state.betterReducer
  );
  const goToHome = () => {
    if (isEnterBetter) {
      router.push('/better/main');
    } else {
      router.push('/');
    }
  };

  return (
    <Layout>
      <div className='my-[60px] flex h-[70vh] flex-col items-center justify-center'>
        <div className='text-[#26499D]'>
          <CheckCircleIcon sx={{ width: 120, height: 120 }} />
        </div>
        <h1 className='my-[30px] font-normal'>상담신청이 완료되었습니다.</h1>
        <div className='flex flex-row'>
          <ButtonLink
            className='w-[200px] text-[#26499D]  md:justify-between'
            onClick={() => {
              goToHome();
            }}
          >
            <div className='flex items-center'>
              <div className='hidden md:block'>
                <HomeIcon sx={{ mr: 1 }} />
              </div>
              홈으로 가기{' '}
            </div>
            <IconArrowNext
              className='ml-[5px] h-[7px] w-[7px] md:h-[11px] md:w-[11px]'
              fill='#26499D'
            />
          </ButtonLink>
        </div>
      </div>
    </Layout>
  );
}

const ButtonLink = tw.button`
w-[100%] h-[28px] mb-[15px] px-[10px] py-[6px] mx-[4px]
flex justify-center items-center
text-[#274A9E] text-[13px] font-semibold leading-[16px]
bg-[rgba(255,255,255,0.6)] rounded-[60px] duration-[0.3s]
md:h-[51px]  md:text-[18px] md:p-[15px] md:shadow-[4px_4px_15px_rgba(38,73,157,0.25)]
`;
