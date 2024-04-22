import { useRouter } from 'next/router';
import * as React from 'react';
import { useEffect, useState } from 'react';

import useStockloanAlert from '@/hooks/useStockloanAlert';

import Footer from '@/components/layout/Footer';
import Header from '@/components/layout/Header';

import { useAppDispatch, useAppSelector } from '@/store/hook';
import { setStoreAlliance } from '@/store/slice/alliance';
import { setIsEnterBetter } from '@/store/slice/better';

import { getStockloanAlliance, Ialliance } from '@/api/AllianceApi';

// ----------------------------------------------------------------------

export default function Layout({ children }: { children: React.ReactNode }) {
  const [alliance, setAlliance] = useState<Ialliance>();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const showAlert = useStockloanAlert();
  const { isEnter: isEnterBetter } = useAppSelector(
    (state) => state.betterReducer
  );
  const getAllianceData = async (code: string) => {
    const { data } = await getStockloanAlliance(code);
    const dataAlliance = data.attributes;
    if (!data.id) return;
    if (
      dataAlliance.attributes.CODE === '2583' ||
      dataAlliance.attributes.CODE === '2582'
    ) {
      dispatch(setIsEnterBetter(true));
    }
    setAlliance(dataAlliance);
    await dispatch(setStoreAlliance(dataAlliance));
  };
  useEffect(() => {
    if (typeof window !== undefined) {
      window.showErrorAlert = (msg: string) => showAlert.errorAlert(msg);
    }
    const allianceId = router.query.alliance;
    if (allianceId && !alliance) {
      getAllianceData(allianceId.toString());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showAlert, alliance, router]);
  // Put Header or Footer Here
  return (
    <>
      {!isEnterBetter && !window.location.search.includes('2583') && <Header />}
      {children}
      {!isEnterBetter && !window.location.search.includes('2583') && <Footer />}
    </>
  );
}
