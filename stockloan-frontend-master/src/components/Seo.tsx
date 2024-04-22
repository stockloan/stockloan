import Head from 'next/head';
import { useRouter } from 'next/router';
import Script from 'next/script';

// ----------------------------------------------------------------------

// !STARTERCONF Change these default meta
const defaultMeta = {
  title: '코넥스탁론 | 쉽고 안전한 성공투자',
  siteName: '코넥스탁론',
  description:
    '팍스넷 스탁론의 새로운 시작 코넥 스탁론 대출기간은 더 길게, 대출한도는 더 크게 수수료 부담없이 이용하세요',
  /** Without additional '/' on the end, e.g. https://theodorusclarence.com */
  url: 'https://stockloan.gitple.com/',
  type: 'website',
  robots: 'follow, index',
  /**
   * No need to be filled, will be populated with openGraph function
   * If you wish to use a normal image, just specify the path below
   */
  image: '',
};

type SeoProps = {
  date?: string;
  templateTitle?: string;
} & Partial<typeof defaultMeta>;

export default function Seo(props: SeoProps) {
  const router = useRouter();
  const meta = {
    ...defaultMeta,
    ...props,
  };
  // Use siteName if there is templateTitle
  // but show full title if there is none
  // !STARTERCONF Follow config for opengraph, by deploying one on https://github.com/theodorusclarence/og
  // ? Uncomment code below if you want to use default open graph
  // meta['image'] = openGraph({
  //   description: meta.description,
  //   siteName: props.templateTitle ? meta.siteName : meta.title,
  //   templateTitle: props.templateTitle,
  // });

  return (
    <>
      <Head>
        <title>{meta.title}</title>
        <meta name='robots' content={meta.robots} />
        <meta content={meta.description} name='description' />
        <meta property='og:url' content={`${meta.url}${router.asPath}`} />
        <link rel='canonical' href={`${meta.url}${router.asPath}`} />
        {/* Open Graph */}
        <meta property='og:type' content={meta.type} />
        <meta property='og:site_name' content={meta.siteName} />
        <meta property='og:description' content={meta.description} />
        <meta property='og:title' content={meta.title} />
        <meta name='image' property='og:image' content={meta.image} />
        {/* Twitter */}
        <meta name='twitter:card' content='summary_large_image' />
        <meta name='twitter:site' content='@th_clarence' />
        <meta name='twitter:title' content={meta.title} />
        <meta name='twitter:description' content={meta.description} />
        <meta name='twitter:image' content={meta.image} />
        {meta.date && (
          <>
            <meta property='article:published_time' content={meta.date} />
            <meta
              name='publish_date'
              property='og:publish_date'
              content={meta.date}
            />
            <meta
              name='author'
              property='article:author'
              content='Theodorus Clarence'
            />
          </>
        )}

        {/* Favicons */}
        {favicons.map((linkProps) => (
          <link key={linkProps.href} {...linkProps} />
        ))}
        <meta name='msapplication-TileColor' content='#ffffff' />
        <meta
          name='msapplication-TileImage'
          content='/favicon/ms-icon-144x144.png'
        />
        <meta name='theme-color' content='#ffffff' />

        {/* Meta Naver */}
        <meta
          name='naver-site-verification'
          content='23f0c2efba941937b520f6d8a361196eb35a33b3'
        />
        {/* Meta Google */}
        <meta
          name='google-site-verification'
          content='M5Zq8Tz8e3-xYM-cCanWUWqTGrBlaBE0NVxptG30vug'
        />
      </Head>
      {/* Global site tag (gtag.js) - Google Analytics */}
      <Script
        strategy='afterInteractive'
        async
        src='https://www.googletagmanager.com/gtag/js?id=UA-232877984-1'
      />
      <Script
        id='gtm-script'
        strategy='afterInteractive'
        dangerouslySetInnerHTML={{
          __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
             
              gtag('config', 'UA-232877984-1');
          `,
        }}
      />
      {/* End Google Tag Manager */}
    </>
  );
}

type Favicons = {
  rel: string;
  href: string;
  sizes?: string;
  type?: string;
};

// !STARTERCONF this is the default favicon, you can generate your own from https://www.favicon-generator.org/ then replace the whole /public/favicon folder
const favicons: Array<Favicons> = [
  {
    rel: 'icon',
    type: 'image/png',
    href: '/favicon/stockloan_favicon.png',
  },
];
