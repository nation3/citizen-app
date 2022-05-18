import Head from 'next/head'

export default function WebsiteHead({
  title
}: any) {
  const description = 'Citizen app for the citizens of Nation3'
  const image = 'https://app.nation3.org/social.jpg'

  return (
    // @ts-expect-error ts-migrate(2749) FIXME: 'Head' refers to a value, but is being used as a t... Remove this comment to see the full error message
    <Head>
      // @ts-expect-error ts-migrate(2749) FIXME: 'title' refers to a value, but is being used as a ... Remove this comment to see the full error message
      <title>Nation3 | {title}</title>
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'meta'.
      <meta name="description" content={description} />
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'meta'.
      <meta property="og:title" content={`Nation3 | ${title}`} />
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'meta'.
      <meta property="og:description" content={description} />
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'meta'.
      <meta property="og:image" content={image} />
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'meta'.
      <meta property="og:type" content="website" />
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'meta'.
      <meta name="twitter:title" content={`Nation3 | ${title}`} />
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'meta'.
      <meta name="twitter:description" content={description} />
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'meta'.
      <meta name="twitter:image" content={image} />
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'meta'.
      <meta name="twitter:card" content="summary" />
    </Head>
  )
}
