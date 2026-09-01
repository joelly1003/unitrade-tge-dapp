'use client';

import { useState } from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';
import { useLocalizedPrice } from '@/hooks/useLocalizedPrice';

const TOKEN_PRICE_ETH = 0.005; // 1 RTT = 0.005 ETH
const TOKENS_PER_ETH = 1 / TOKEN_PRICE_ETH;

export default function Home() {
  const { isConnected } = useAccount();
  
  // TGE State
  const [amountEth, setAmountEth] = useState<string>('1');
  const [paymentToken, setPaymentToken] = useState<string>('ETH');
  const [txState, setTxState] = useState<'idle' | 'pending' | 'success' | 'failed'>('idle');
  const [activeTab, setActiveTab] = useState<'tge' | 'dashboard'>('tge');

  const parsedEth = parseFloat(amountEth) || 0;
  const receiveTokens = parsedEth * TOKENS_PER_ETH;
  
  // Price hooks for USD and NGN
  const { formattedFiat: usdPrice } = useLocalizedPrice(parsedEth, 'usd');
  const { formattedFiat: ngnPrice } = useLocalizedPrice(parsedEth, 'ngn');

  // Mock data
  const mockRaised = 450;
  const mockGoal = 1000;
  const progress = (mockRaised / mockGoal) * 100;

  const handleBuy = async () => {
    if (!isConnected || parsedEth <= 0) return;
    setTxState('pending');
    
    // Simulate transaction delay
    setTimeout(() => {
      // 90% chance of success for demo
      if (Math.random() > 0.1) {
        setTxState('success');
      } else {
        setTxState('failed');
      }
      
      // Reset state after 3 seconds
      setTimeout(() => setTxState('idle'), 3000);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-[#0B0E14] text-gray-200 font-sans selection:bg-blue-500/30">
      
      {/* Navigation Header */}
      <nav className="sticky top-0 z-50 border-b border-gray-800 bg-[#0B0E14]/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-12">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center font-bold text-white">
                U
              </div>
              <span className="text-xl font-bold text-white tracking-tight">Unitrade</span>
            </div>
            
            <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-400">
              <a href="/" className="hover:text-white transition-colors">Home</a>
              <a href="#" className="text-blue-400">Trade/TGE</a>
              <a href="#" onClick={(e) => { e.preventDefault(); setActiveTab('dashboard'); }} className="hover:text-white transition-colors">Dashboard</a>
              <a href="/docs" className="hover:text-white transition-colors">Docs</a>
            </div>
          </div>
          
          <ConnectButton />
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* LEFT COLUMN: Project Info & Tokenomics */}
        <div className="lg:col-span-7 space-y-12">
          
          {/* Token Stats Header */}
          <section className="space-y-6">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">Unitrade Token (UTT)</h1>
              <p className="text-gray-400 text-lg">The localized liquidity engine for regional markets.</p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/50">
                <p className="text-sm text-gray-400 mb-1">Token Price</p>
                <p className="text-xl font-mono text-white">{TOKEN_PRICE_ETH} ETH</p>
              </div>
              <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/50">
                <p className="text-sm text-gray-400 mb-1">Symbol</p>
                <p className="text-xl font-bold text-white">$UTT</p>
              </div>
              <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/50">
                <p className="text-sm text-gray-400 mb-1">Total Supply</p>
                <p className="text-xl font-mono text-white">100M</p>
              </div>
              <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/50">
                <p className="text-sm text-gray-400 mb-1">Amount Raised</p>
                <p className="text-xl font-mono text-blue-400">{mockRaised} ETH</p>
              </div>
            </div>

            {/* TGE Progress Bar */}
            <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-400">TGE Progress</span>
                <span className="text-white font-mono">{progress.toFixed(1)}% ({mockRaised} / {mockGoal} ETH)</span>
              </div>
              <div className="w-full h-3 bg-gray-900 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-blue-600 to-blue-400 rounded-full"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </section>

          {/* Tokenomics */}
          <section className="space-y-6">
            <h2 className="text-2xl font-bold text-white">Tokenomics & Vesting</h2>
            <div className="bg-gray-800/30 rounded-2xl border border-gray-800 p-6 space-y-4">
              <div className="flex justify-between py-2 border-b border-gray-800/50">
                <span className="text-gray-400">TGE Allocation (Public)</span>
                <span className="font-mono text-white">30% (30,000,000 UTT)</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-800/50">
                <span className="text-gray-400">Community & Rewards</span>
                <span className="font-mono text-white">40% (40,000,000 UTT)</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-800/50">
                <span className="text-gray-400">Team & Advisors</span>
                <span className="font-mono text-white">15% (15,000,000 UTT)</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-800/50">
                <span className="text-gray-400">Liquidity Pool</span>
                <span className="font-mono text-white">15% (15,000,000 UTT)</span>
              </div>
              <div className="pt-4">
                <p className="text-sm text-blue-400 bg-blue-900/20 p-3 rounded-lg border border-blue-900/50">
                  <strong className="text-blue-300">Vesting Information:</strong> TGE participants receive 50% at launch (TGE). The remaining 50% vests linearly over 6 months. Team tokens are locked for 12 months.
                </p>
              </div>
            </div>
          </section>

          {/* FAQ */}
          <section className="space-y-6">
            <h2 className="text-2xl font-bold text-white">Frequently Asked Questions</h2>
            <div className="space-y-4">
              <details className="group bg-gray-800/30 rounded-xl border border-gray-800 [&_summary::-webkit-details-marker]:hidden">
                <summary className="flex cursor-pointer items-center justify-between p-4 text-white font-medium">
                  What is this token?
                  <span className="transition group-open:rotate-180">▼</span>
                </summary>
                <div className="px-4 pb-4 text-sm text-gray-400">
                  UTT is the native utility token for the Unitrade ecosystem, providing governance rights, fee discounts, and staking rewards for localized trading pools.
                </div>
              </details>
              <details className="group bg-gray-800/30 rounded-xl border border-gray-800 [&_summary::-webkit-details-marker]:hidden">
                <summary className="flex cursor-pointer items-center justify-between p-4 text-white font-medium">
                  How do I participate?
                  <span className="transition group-open:rotate-180">▼</span>
                </summary>
                <div className="px-4 pb-4 text-sm text-gray-400">
                  Connect your Web3 wallet using the button above, enter the amount of ETH you wish to contribute, and click 'Buy'. Ensure you have enough ETH to cover network gas fees.
                </div>
              </details>
              <details className="group bg-gray-800/30 rounded-xl border border-gray-800 [&_summary::-webkit-details-marker]:hidden">
                <summary className="flex cursor-pointer items-center justify-between p-4 text-white font-medium">
                  Which wallets are supported?
                  <span className="transition group-open:rotate-180">▼</span>
                </summary>
                <div className="px-4 pb-4 text-sm text-gray-400">
                  We support MetaMask, Coinbase Wallet, Rainbow, Trust Wallet, and hundreds of others via WalletConnect.
                </div>
              </details>
              <details className="group bg-gray-800/30 rounded-xl border border-gray-800 [&_summary::-webkit-details-marker]:hidden">
                <summary className="flex cursor-pointer items-center justify-between p-4 text-white font-medium">
                  When can I claim?
                  <span className="transition group-open:rotate-180">▼</span>
                </summary>
                <div className="px-4 pb-4 text-sm text-gray-400">
                  The initial 50% claim will be available exactly 24 hours after the TGE concludes. The remaining tokens can be claimed continuously via the Dashboard as they vest.
                </div>
              </details>
            </div>
          </section>

        </div>

        {/* RIGHT COLUMN: Interaction Cards */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Tab Switcher (Optional mobile/tablet optimization, but we'll show both or switch context based on selection) */}
          <div className="flex bg-gray-900 rounded-xl p-1 border border-gray-800">
            <button 
              onClick={() => setActiveTab('tge')}
              className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${activeTab === 'tge' ? 'bg-gray-800 text-white shadow' : 'text-gray-400 hover:text-white'}`}
            >
              Participate
            </button>
            <button 
              onClick={() => setActiveTab('dashboard')}
              className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${activeTab === 'dashboard' ? 'bg-gray-800 text-white shadow' : 'text-gray-400 hover:text-white'}`}
            >
              My Dashboard
            </button>
          </div>

          {activeTab === 'tge' && (
            <div className="bg-gradient-to-b from-gray-800 to-gray-900 rounded-2xl p-6 border border-gray-700 shadow-2xl relative overflow-hidden">
              <h3 className="text-xl font-bold text-white mb-6">Join the TGE</h3>
              
              <div className="space-y-6 relative z-10">
                {/* Input Amount */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">Pay Amount</label>
                  <div className="flex bg-gray-950 rounded-xl border border-gray-800 focus-within:border-blue-500 transition-colors p-1">
                    <input 
                      type="number"
                      value={amountEth}
                      onChange={(e) => setAmountEth(e.target.value)}
                      className="w-full bg-transparent text-white p-3 outline-none font-mono text-lg"
                      placeholder="0.0"
                    />
                    <select 
                      value={paymentToken}
                      onChange={(e) => setPaymentToken(e.target.value)}
                      className="bg-gray-800 text-white px-4 rounded-lg font-medium outline-none cursor-pointer border-none"
                    >
                      <option value="ETH">ETH</option>
                      <option value="USDC">USDC</option>
                    </select>
                  </div>
                </div>

                {/* Receive Amount */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">You Receive</label>
                  <div className="flex bg-gray-900/50 rounded-xl border border-gray-800 p-4">
                    <span className="w-full text-white font-mono text-xl">{receiveTokens.toLocaleString()}</span>
                    <span className="font-bold text-gray-400">UTT</span>
                  </div>
                </div>

                {/* Localized Price Display (USD & NGN) */}
                <div className="bg-gray-800/50 rounded-xl p-4 space-y-3 border border-gray-700/50">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-400">Total Value (USD)</span>
                    <span className="font-mono text-white font-medium">{usdPrice}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-400">Total Value (NGN)</span>
                    <span className="font-mono text-green-400 font-medium">{ngnPrice}</span>
                  </div>
                </div>

                {/* Buy Button & States */}
                <div className="pt-2">
                  {!isConnected ? (
                    <div className="flex justify-center w-full">
                       <ConnectButton.Custom>
                        {({ openConnectModal }) => (
                          <button onClick={openConnectModal} className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold transition-all shadow-lg shadow-blue-900/20">
                            Connect Wallet to Buy
                          </button>
                        )}
                      </ConnectButton.Custom>
                    </div>
                  ) : (
                    <button 
                      onClick={handleBuy}
                      disabled={txState === 'pending' || parsedEth <= 0}
                      className={`w-full py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2
                        ${txState === 'idle' ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-900/20' : ''}
                        ${txState === 'pending' ? 'bg-yellow-600/80 text-white cursor-not-allowed' : ''}
                        ${txState === 'success' ? 'bg-green-600 text-white' : ''}
                        ${txState === 'failed' ? 'bg-red-600 text-white' : ''}
                        ${parsedEth <= 0 ? 'opacity-50 cursor-not-allowed' : ''}
                      `}
                    >
                      {txState === 'idle' && 'Buy'}
                      {txState === 'pending' && (
                        <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"/> Transaction Pending...</>
                      )}
                      {txState === 'success' && 'Transaction Successful! 🎉'}
                      {txState === 'failed' && 'Transaction Failed. Try Again.'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'dashboard' && (
            <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700 shadow-2xl">
              <h3 className="text-xl font-bold text-white mb-6">Your Portfolio</h3>
              
              {!isConnected ? (
                <div className="text-center py-12 space-y-4">
                  <div className="w-16 h-16 bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">🔒</span>
                  </div>
                  <p className="text-gray-400">Connect your wallet to view your TGE allocation and purchase history.</p>
                  <div className="flex justify-center pt-4">
                    <ConnectButton />
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-900/50 p-4 rounded-xl border border-gray-700/50">
                      <p className="text-xs text-gray-400 mb-1 uppercase tracking-wider">Allocation</p>
                      <p className="font-mono text-lg text-white">25,000 UTT</p>
                    </div>
                    <div className="bg-gray-900/50 p-4 rounded-xl border border-gray-700/50">
                      <p className="text-xs text-gray-400 mb-1 uppercase tracking-wider">Tokens Purchased</p>
                      <p className="font-mono text-lg text-blue-400">10,000 UTT</p>
                    </div>
                    <div className="bg-gray-900/50 p-4 rounded-xl border border-gray-700/50 col-span-2 flex justify-between items-center">
                      <div>
                        <p className="text-xs text-gray-400 mb-1 uppercase tracking-wider">Total Invested</p>
                        <p className="font-mono text-lg text-white">50.0 ETH</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-400 mb-1 uppercase tracking-wider">Claim Status</p>
                        <p className="text-sm text-yellow-500 bg-yellow-900/20 px-3 py-1 rounded-full border border-yellow-700/50 inline-block">Locked</p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-gray-700/50">
                    <h4 className="text-sm font-bold text-gray-300 mb-4 uppercase tracking-wider">Recent Transactions</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between bg-gray-900/30 p-3 rounded-lg border border-gray-800">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-green-900/50 text-green-400 flex items-center justify-center text-xs">✓</div>
                          <div>
                            <p className="text-sm text-white">Buy UTT</p>
                            <p className="text-xs text-gray-500">Today, 14:32</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-mono text-white">+5,000 UTT</p>
                          <p className="text-xs font-mono text-gray-500">-25.0 ETH</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between bg-gray-900/30 p-3 rounded-lg border border-gray-800">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-green-900/50 text-green-400 flex items-center justify-center text-xs">✓</div>
                          <div>
                            <p className="text-sm text-white">Buy UTT</p>
                            <p className="text-xs text-gray-500">Yesterday, 09:15</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-mono text-white">+5,000 UTT</p>
                          <p className="text-xs font-mono text-gray-500">-25.0 ETH</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

        </div>
      </main>
    </div>
  );
}
