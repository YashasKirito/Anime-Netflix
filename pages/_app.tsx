import "../styles/globals.css";
import "react-tabs/style/react-tabs.css";

import type { AppProps } from "next/app";
import Layout from "organisms/Layout";
import AuthProvider from "Auth/AuthProvider";
import MyListWrapper from "../firebase/MyListFireStore/MyListWrapper";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ContinueWatchingWrapper from "../firebase/ContinueWatching/ContinueWatchingWrapper";

const queryClient = new QueryClient();

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <MyListWrapper>
            <ContinueWatchingWrapper>
              <Layout>
                <Component {...pageProps} />
              </Layout>
            </ContinueWatchingWrapper>
          </MyListWrapper>
        </AuthProvider>
      </QueryClientProvider>
    </>
  );
}

export default MyApp;
