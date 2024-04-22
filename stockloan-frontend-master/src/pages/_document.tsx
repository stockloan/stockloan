import Document, {
  DocumentContext,
  Head,
  Html,
  Main,
  NextScript,
} from 'next/document';

// ----------------------------------------------------------------------

class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps };
  }

  render() {
    return (
      <Html lang='en'>
        <Head>
          <link
            rel='stylesheet'
            as='style'
            href='https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.5/dist/web/static/pretendard.css'
          />
          {/* GitpleChat */}
          {/* <Script
            id='gitplechat-script'
            strategy='afterInteractive'
            dangerouslySetInnerHTML={{
              __html: `
              window.GitpleConfig = {"appCode":"5vve2a5sCx02zrhwaiwaQitvTzCbh1","url":"https://app.cs.finset.io"};
              !function(){function e(){function e(){var e=t.contentDocument,a=e.createElement("script");a.type="text/javascript",a.async=!0,a.src=window[n]&&window[n].url?window[n].url+"/inapp-web/gitple-loader.js":"https://app.gitple.io/inapp-web/gitple-loader.js",a.charset="UTF-8",e.head&&e.head.appendChild(a)}var t=document.getElementById(a);t||((t=document.createElement("iframe")).id=a,t.style.display="none",t.style.width="0",t.style.height="0",t.addEventListener?t.addEventListener("load",e,!1):t.attachEvent?t.attachEvent("onload",e):t.onload=e,document.body.appendChild(t))}var t=window,n="GitpleConfig",a="gitple-loader-frame";if(!window.Gitple){document;var i=function(){i.ex&&i.ex(arguments)};i.q=[],i.ex=function(e){i.processApi?i.processApi.apply(void 0,e):i.q&&i.q.push(e)},window.Gitple=i,t.attachEvent?t.attachEvent("onload",e):t.addEventListener("load",e,!1)}}();
              Gitple('boot');
             `,
            }}
          /> */}
        </Head>
        <body>
          <Main />
          <NextScript />
          {/* Google Tag Manager (noscript) */}
          <noscript>
            <iframe
              src='https://www.googletagmanager.com/ns.html?id=GTM-KP7QFB9'
              height='0'
              width='0'
              style={{ display: 'none', visibility: 'hidden' }}
            ></iframe>
          </noscript>
          {/* End Google Tag Manager (noscript) */}
        </body>
      </Html>
    );
  }
}

export default MyDocument;
