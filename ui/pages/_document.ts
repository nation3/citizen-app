import Document, { Html, Head, Main, NextScript } from 'next/document'

class WebsiteDocument extends Document {
  render() {
    return (
      // @ts-expect-error ts-migrate(2749) FIXME: 'Html' refers to a value, but is being used as a t... Remove this comment to see the full error message
      <Html>
        <Head>
          // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'link'.
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'link'.
          <link rel="preconnect" href="https://fonts.gstatic.com" />
          // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'link'.
          <link
            // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'rel'.
            rel="stylesheet"
            // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'href'.
            href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap"
          />
          // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'link'.
          <link
            // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'rel'.
            rel="stylesheet"
            // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'href'.
            href="https://fonts.googleapis.com/css2?family=Poppins:wght@200;300;400;500&display=swap"
          />
          // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'meta'.
          <meta name="theme-color" content="#54c3ff" />
          // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'link'.
          <link rel="icon" href="/favicon.ico" />
        </Head>
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'body'.
        <body className="overflow-hidden">
          // @ts-expect-error ts-migrate(2749) FIXME: 'Main' refers to a value, but is being used as a t... Remove this comment to see the full error message
          <Main />
          // @ts-expect-error ts-migrate(2362) FIXME: The left-hand side of an arithmetic operation must... Remove this comment to see the full error message
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default WebsiteDocument
