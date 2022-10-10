import "../styles/globals.css";
import "react-tabs/style/react-tabs.css";

import type { AppProps } from "next/app";
import Layout from "organisms/Layout";
import AuthProvider from "Auth/AuthProvider";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <AuthProvider>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </AuthProvider>
    </>
  );
}

export default MyApp;
