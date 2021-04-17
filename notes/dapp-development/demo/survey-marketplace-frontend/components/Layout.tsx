import React, { ReactNode } from 'react'
import {ThemeProvider} from "@chakra-ui/core";
import {Web3ReactProvider, useWeb3React} from "@web3-react/core";
import {Web3Provider} from "@ethersproject/providers"
import Link from 'next/link'
import Head from 'next/head'

type Props = {
  children?: ReactNode
  title?: string
}

function getLibrary(provider:any):Web3Provider {
  return new Web3Provider(provider)
}

const Layout = ({ children, title = 'This is the default title' }: Props) => (
  <Web3ReactProvider getLibrary={getLibrary}>
<ThemeProvider>
  <div>
    <Head>
      <title>{title}</title>
      <meta charSet="utf-8" />
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
    </Head>
    <header>
      <nav>
        <Link href="/">
          <a>Home</a>
        </Link>{' '}
        |{' '}
        <Link href="/about">
          <a>About</a>
        </Link>{' '}
        |{' '}
        <Link href="/dapp">
          <a>DApp</a>
        </Link>{' '}
        |{' '}
        <Link href="/users">
          <a>Users List</a>
        </Link>{' '}
        | <a href="/api/users">Users API</a>
      </nav>
    </header>
    {children}
    <footer>
      <hr />
      <span>I'm here to stay (Footer)</span>
    </footer>
  </div>
  </ThemeProvider>
  </Web3ReactProvider>
)

export default Layout
