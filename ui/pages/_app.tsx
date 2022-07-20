import { Nation3Provider } from '@nation3/utils'
import React from 'react'
import Layout from '../components/Layout'
import '../styles/globals.css'

function App({ Component, pageProps }: any) {
  return (
    <>
      <Nation3Provider>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </Nation3Provider>
    </>
  )
}

export default App
