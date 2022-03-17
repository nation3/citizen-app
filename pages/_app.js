import { Provider } from 'wagmi'
import { connectors } from '../lib/connectors'
import Layout from '../components/Layout'
import '../styles/globals.css'

function App({ Component, pageProps }) {
  return (
    <Provider autoConnect connectors={connectors}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </Provider>
  )
}

export default App
