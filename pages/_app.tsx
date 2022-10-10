import "../styles/globals.css";
import "react-tabs/style/react-tabs.css";

import type { AppProps } from "next/app";
import Layout from "organisms/Layout";
import AuthProvider from "Auth/AuthProvider";
import MyListWrapper from "../firebase/MyListWrapper";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <AuthProvider>
        <MyListWrapper>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </MyListWrapper>
      </AuthProvider>
    </>
  );
}

export default MyApp;
