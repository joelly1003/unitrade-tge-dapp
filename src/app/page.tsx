'use client';

import { useState, useEffect } from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';
import { useLocalizedPrice } from '@/hooks/useLocalizedPrice';
import toast from 'react-hot-toast';

const TOKEN_PRICE_ETH = 0.005; // 1 UTT = 0.005 ETH
const TOKENS_PER_ETH = 1 / TOKEN_PRICE_ETH;

export default function Home() {
  const { isConnected, chain } = useAccount();
  
  // TGE State
  const [amountEth, setAmountEth] = useState<string>('1');
  const [paymentToken, setPaymentToken] = useState<string>('ETH');
  const [txState, setTxState] = useState<'idle' | 'pending' | 'success' | 'failed'>('idle');
  const [activeTab, setActiveTab] = useState<'tge' | 'dashboard'>('tge');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  
  // Countdown State
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  const parsedEth = parseFloat(amountEth) || 0;
  const receiveTokens = parsedEth * TOKENS_PER_ETH;
  
  // Price hooks for USD and NGN
  const { formattedFiat: usdPrice } = useLocalizedPrice(parsedEth, 'usd');
  const { formattedFiat: ngnPrice } = useLocalizedPrice(parsedEth, 'ngn');

  // Mock data
  const mockRaised = 450;
  const mockGoal = 1000;
  const progress = (mockRaised / mockGoal) * 100;

  useEffect(() => {
    // TGE ends 7 days from now (mock)
    const targetDate = new Date().getTime() + 7 * 24 * 60 * 60 * 1000;
    
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate - now;

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000)
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleBuyClick = () => {
    if (!isConnected) {
      toast.error('Please connect your wallet first.');
      return;
    }
    if (parsedEth <= 0) {
      toast.error('Please enter a valid amount.');
      return;
    }
    setShowConfirmModal(true);
  };

  const executeTransaction = async () => {
    setShowConfirmModal(false);
    setTxState('pending');
    
    const toastId = toast.loading('Transaction Pending: Waiting for confirmation...');
    
    // Simulate transaction delay
    setTimeout(() => {
      // 90% chance of success for demo
      if (Math.random() > 0.1) {
        setTxState('success');
        toast.success('Transaction Successful! Tokens purchased.', { id: toastId });
      } else {
        setTxState('failed');
        toast.error('Transaction Failed: Network congestion or insufficient funds.', { id: toastId });
      }
      
      // Reset state after 3 seconds
      setTimeout(() => setTxState('idle'), 3000);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-[#0B0E14] text-gray-200 font-sans selection:bg-blue-500/30 pb-20">
      
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

            {/* TGE Countdown & Progress Bar */}
            <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50">
              <div className="flex flex-col md:flex-row justify-between md:items-end mb-4 gap-4">
                <div>
                  <span className="text-gray-400 text-sm block mb-1">TGE Ends In</span>
                  <div className="flex gap-3 text-white font-mono text-xl">
                    <div className="bg-gray-900 px-3 py-1 rounded-lg border border-gray-700">{timeLeft.days}d</div>
                    <div className="bg-gray-900 px-3 py-1 rounded-lg border border-gray-700">{timeLeft.hours}h</div>
                    <div className="bg-gray-900 px-3 py-1 rounded-lg border border-gray-700">{timeLeft.minutes}m</div>
                    <div className="bg-gray-900 px-3 py-1 rounded-lg border border-gray-700">{timeLeft.seconds}s</div>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-gray-400 text-sm block mb-1">Progress</span>
                  <span className="text-white font-mono text-xl">{progress.toFixed(1)}%</span>
                </div>
              </div>
              <div className="w-full h-3 bg-gray-900 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-blue-600 to-blue-400 rounded-full"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="text-right mt-2 text-xs text-gray-500 font-mono">
                {mockRaised} / {mockGoal} ETH
              </div>
            </div>
          </section>

          {/* Tokenomics & Allocation Chart */}
          <section className="space-y-6">
            <h2 className="text-2xl font-bold text-white">Tokenomics & Vesting</h2>
            <div className="bg-gray-800/30 rounded-2xl border border-gray-800 p-6 flex flex-col md:flex-row gap-8 items-center">
              
              {/* CSS Pie Chart */}
              <div className="shrink-0 relative w-48 h-48 rounded-full shadow-2xl" 
                   style={{
                     background: 'conic-gradient(#3b82f6 0% 30%, #10b981 30% 70%, #f59e0b 70% 85%, #8b5cf6 85% 100%)'
                   }}>
                <div className="absolute inset-0 m-auto w-32 h-32 bg-[#0d1117] rounded-full flex items-center justify-center">
                  <span className="text-gray-400 text-sm font-bold">100M UTT</span>
                </div>
              </div>

              {/* Allocation List */}
              <div className="w-full space-y-3">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                    <span className="text-gray-400 text-sm">TGE Allocation (Public)</span>
                  </div>
                  <span className="font-mono text-white text-sm">30%</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <span className="text-gray-400 text-sm">Community & Rewards</span>
                  </div>
                  <span className="font-mono text-white text-sm">40%</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <span className="text-gray-400 text-sm">Team & Advisors</span>
                  </div>
                  <span className="font-mono text-white text-sm">15%</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                    <span className="text-gray-400 text-sm">Liquidity Pool</span>
                  </div>
                  <span className="font-mono text-white text-sm">15%</span>
                </div>
              </div>
            </div>
            
            <p className="text-sm text-blue-400 bg-blue-900/20 p-4 rounded-xl border border-blue-900/50">
              <strong className="text-blue-300">Vesting Information:</strong> TGE participants receive 50% at launch (TGE). The remaining 50% vests linearly over 6 months. Team tokens are locked for 12 months.
            </p>
          </section>

          {/* FAQ */}
          <section className="space-y-4 pt-4">
            <h2 className="text-2xl font-bold text-white mb-4">Frequently Asked Questions</h2>
            {[
              { q: 'What is this token?', a: 'UTT is the native utility token for the Unitrade ecosystem, providing governance rights, fee discounts, and staking rewards for localized trading pools.' },
              { q: 'How do I participate?', a: 'Connect your Web3 wallet using the button above, enter the amount of ETH you wish to contribute, and click \'Buy\'. Ensure you have enough ETH to cover network gas fees.' },
              { q: 'Which wallets are supported?', a: 'We support MetaMask, Coinbase Wallet, Rainbow, Trust Wallet, and hundreds of others via WalletConnect.' },
              { q: 'When can I claim?', a: 'The initial 50% claim will be available exactly 24 hours after the TGE concludes. The remaining tokens can be claimed continuously via the Dashboard as they vest.' }
            ].map((faq, idx) => (
              <details key={idx} className="group bg-gray-800/30 rounded-xl border border-gray-800 [&_summary::-webkit-details-marker]:hidden">
                <summary className="flex cursor-pointer items-center justify-between p-4 text-white font-medium">
                  {faq.q}
                  <span className="transition group-open:rotate-180">▼</span>
                </summary>
                <div className="px-4 pb-4 text-sm text-gray-400">{faq.a}</div>
              </details>
            ))}
          </section>

        </div>

        {/* RIGHT COLUMN: Interaction Cards */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Tab Switcher */}
          <div className="flex bg-gray-900 rounded-xl p-1 border border-gray-800">
            <button 
              onClick={() => setActiveTab('tge')}
              className={`flex-1 py-3 text-sm font-medium rounded-lg transition-colors ${activeTab === 'tge' ? 'bg-gray-800 text-white shadow border border-gray-700/50' : 'text-gray-400 hover:text-white'}`}
            >
              Participate
            </button>
            <button 
              onClick={() => setActiveTab('dashboard')}
              className={`flex-1 py-3 text-sm font-medium rounded-lg transition-colors ${activeTab === 'dashboard' ? 'bg-gray-800 text-white shadow border border-gray-700/50' : 'text-gray-400 hover:text-white'}`}
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
                      onClick={handleBuyClick}
                      disabled={txState === 'pending' || parsedEth <= 0}
                      className={`w-full py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2
                        ${txState === 'idle' ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-900/20' : ''}
                        ${txState === 'pending' ? 'bg-yellow-600/80 text-white cursor-not-allowed' : ''}
                        ${txState === 'success' ? 'bg-green-600 text-white' : ''}
                        ${txState === 'failed' ? 'bg-red-600 text-white' : ''}
                        ${parsedEth <= 0 ? 'opacity-50 cursor-not-allowed' : ''}
                      `}
                    >
                      {txState === 'idle' && 'Buy UTT'}
                      {txState === 'pending' && (
                        <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"/> Processing...</>
                      )}
                      {txState === 'success' && 'Transaction Successful! 🎉'}
                      {txState === 'failed' && 'Transaction Failed.'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'dashboard' && (
            <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700 shadow-2xl space-y-8">
              <div>
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
                  <div className="space-y-8">
                    
                    {/* Portfolio Summary */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-gray-900/50 p-4 rounded-xl border border-gray-700/50">
                        <p className="text-xs text-gray-400 mb-1 uppercase tracking-wider">Total Allocation</p>
                        <p className="font-mono text-lg text-white">25,000 UTT</p>
                      </div>
                      <div className="bg-gray-900/50 p-4 rounded-xl border border-gray-700/50">
                        <p className="text-xs text-gray-400 mb-1 uppercase tracking-wider">Total Invested</p>
                        <p className="font-mono text-lg text-blue-400">50.0 ETH</p>
                      </div>
                    </div>

                    {/* Claim Tokens Section */}
                    <div className="bg-gray-900/30 p-5 rounded-xl border border-gray-700/50">
                      <h4 className="text-sm font-bold text-gray-300 mb-4 uppercase tracking-wider">Claim Tokens</h4>
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Available to Claim</p>
                          <p className="font-mono text-2xl text-green-400">12,500 UTT</p>
                        </div>
                        <button className="bg-green-600 hover:bg-green-500 text-white px-6 py-2 rounded-lg font-medium transition-colors shadow-lg shadow-green-900/20">
                          Claim Now
                        </button>
                      </div>
                    </div>

                    {/* Personal Vesting Schedule */}
                    <div>
                      <h4 className="text-sm font-bold text-gray-300 mb-4 uppercase tracking-wider">Vesting Schedule</h4>
                      <div className="bg-gray-900/30 rounded-xl border border-gray-700/50 overflow-hidden">
                        <table className="w-full text-left text-sm text-gray-400">
                          <thead className="bg-gray-900/50 border-b border-gray-700/50 text-xs uppercase">
                            <tr>
                              <th className="px-4 py-3">Date</th>
                              <th className="px-4 py-3">Amount</th>
                              <th className="px-4 py-3 text-right">Status</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-800">
                            <tr>
                              <td className="px-4 py-3 text-white">TGE Launch</td>
                              <td className="px-4 py-3 font-mono">12,500 UTT</td>
                              <td className="px-4 py-3 text-right"><span className="text-green-400 bg-green-400/10 px-2 py-1 rounded text-xs">Unlocked</span></td>
                            </tr>
                            <tr>
                              <td className="px-4 py-3">Month 1</td>
                              <td className="px-4 py-3 font-mono">2,500 UTT</td>
                              <td className="px-4 py-3 text-right"><span className="text-yellow-500 bg-yellow-500/10 px-2 py-1 rounded text-xs">Locked</span></td>
                            </tr>
                            <tr>
                              <td className="px-4 py-3">Month 2</td>
                              <td className="px-4 py-3 font-mono">2,500 UTT</td>
                              <td className="px-4 py-3 text-right"><span className="text-yellow-500 bg-yellow-500/10 px-2 py-1 rounded text-xs">Locked</span></td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Full Transaction History */}
                    <div>
                      <h4 className="text-sm font-bold text-gray-300 mb-4 uppercase tracking-wider">Transaction History</h4>
                      <div className="space-y-3">
                        {[
                          { action: 'Buy UTT', date: 'Today, 14:32', amount: '+5,000 UTT', eth: '-25.0 ETH', status: 'Success' },
                          { action: 'Buy UTT', date: 'Yesterday, 09:15', amount: '+20,000 UTT', eth: '-25.0 ETH', status: 'Success' },
                        ].map((tx, idx) => (
                          <div key={idx} className="flex items-center justify-between bg-gray-900/30 p-3 rounded-lg border border-gray-800">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-green-900/50 text-green-400 flex items-center justify-center text-xs">✓</div>
                              <div>
                                <p className="text-sm text-white">{tx.action}</p>
                                <p className="text-xs text-gray-500">{tx.date}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-mono text-white">{tx.amount}</p>
                              <p className="text-xs font-mono text-gray-500">{tx.eth}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>
                )}
              </div>
            </div>
          )}

        </div>
      </main>

      {/* Transaction Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-gray-800 rounded-2xl p-6 w-full max-w-md border border-gray-700 shadow-2xl">
            <h3 className="text-xl font-bold text-white mb-4">Confirm Transaction</h3>
            
            <div className="space-y-4 mb-6">
              <div className="bg-gray-900/50 p-4 rounded-xl border border-gray-700/50 flex justify-between items-center">
                <span className="text-gray-400 text-sm">You are paying</span>
                <span className="text-white font-mono">{parsedEth} {paymentToken}</span>
              </div>
              <div className="flex justify-center text-gray-500">
                ↓
              </div>
              <div className="bg-gray-900/50 p-4 rounded-xl border border-gray-700/50 flex justify-between items-center">
                <span className="text-gray-400 text-sm">You will receive</span>
                <span className="text-blue-400 font-mono font-bold">{receiveTokens.toLocaleString()} UTT</span>
              </div>

              <div className="pt-4 border-t border-gray-700/50 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Estimated Gas</span>
                  <span className="text-white font-mono">~ $2.45</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Network</span>
                  <span className="text-white capitalize">{chain?.name || 'Unknown'}</span>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button 
                onClick={() => setShowConfirmModal(false)}
                className="flex-1 py-3 rounded-xl font-medium bg-gray-700 text-white hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={executeTransaction}
                className="flex-1 py-3 rounded-xl font-medium bg-blue-600 text-white hover:bg-blue-500 transition-colors shadow-lg shadow-blue-900/20"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
