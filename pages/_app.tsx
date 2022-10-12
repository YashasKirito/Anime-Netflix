import "../styles/globals.css";
import "react-tabs/style/react-tabs.css";

import type { AppProps } from "next/app";
import Layout from "organisms/Layout";
import AuthProvider from "Auth/AuthProvider";
import MyListWrapper from "../firebase/MyListFireStore/MyListWrapper";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <MyListWrapper>
            <Layout>
              <Component {...pageProps} />
            </Layout>
          </MyListWrapper>
        </AuthProvider>
      </QueryClientProvider>
    </>
  );
}

export default MyApp;
