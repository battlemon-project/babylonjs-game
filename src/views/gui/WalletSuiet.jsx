import React from 'react'
import { createRoot } from 'react-dom/client'
import { ConnectButton, WalletProvider } from '@suiet/wallet-kit'
import '@suiet/wallet-kit/style.css'
import '../../styles/suiet.sass'

const App = () => {
  return (
    <div style={{
      zIndex: 1000,
      position: 'absolute',
      top: '5%',
      right: '2%',
    }}>
      <WalletProvider>
        <ConnectButton>Connect Wallet</ConnectButton>
      </WalletProvider>
    </div>
  );
};

export default function MountDoom () {
  const root = createRoot(document.getElementById('wallet_suiet'))

  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}
