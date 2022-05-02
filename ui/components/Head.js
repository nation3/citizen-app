import Head from 'next/head'

export default function WebsiteHead({ title }) {
  const description = 'Citizen app for the citizens of Nation3'
  const image = 'https://app.nation3.org/social.jpg'

  return (
    <Head>
      <title>Nation3 | {title}</title>
      <meta name="description" content={description} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:type" content="website" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      <meta name="twitter:card" content="summary" />
    </Head>
  )
}
