import { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/footer';
import Container from '../components/ui/Container';
import Button from '../components/ui/Button';
import FilterDropdown from '../components/ui/FilterDropdown';

const FALLBACK_GHS = 16.5;
const COIN_META = [
	{ binance: 'BTCUSDT', name: 'Bitcoin', symbol: 'BTC', supply: 19700000 },
	{ binance: 'ETHUSDT', name: 'Ethereum', symbol: 'ETH', supply: 120200000 },
	{ binance: 'BNBUSDT', name: 'BNB', symbol: 'BNB', supply: 145900000 },
	{ binance: 'SOLUSDT', name: 'Solana', symbol: 'SOL', supply: 441000000 },
	{ binance: 'XRPUSDT', name: 'XRP', symbol: 'XRP', supply: 56600000000 },
	{ binance: 'ADAUSDT', name: 'Cardano', symbol: 'ADA', supply: 37100000000 },
	{ binance: 'DOGEUSDT', name: 'Dogecoin', symbol: 'DOGE', supply: 143600000000 },
	{ binance: 'DOTUSDT', name: 'Polkadot', symbol: 'DOT', supply: 1400000000 },
	{ binance: 'LTCUSDT', name: 'Litecoin', symbol: 'LTC', supply: 73800000 },
	{ binance: 'AVAXUSDT', name: 'Avalanche', symbol: 'AVAX', supply: 403000000 },
	{ binance: 'LINKUSDT', name: 'Chainlink', symbol: 'LINK', supply: 608000000 },
	{ binance: 'UNIUSDT', name: 'Uniswap', symbol: 'UNI', supply: 600000000 },
	{ binance: 'ATOMUSDT', name: 'Cosmos', symbol: 'ATOM', supply: 292000000 },
	{ binance: 'XLMUSDT', name: 'Stellar', symbol: 'XLM', supply: 29600000000 },
	{ binance: 'ETCUSDT', name: 'Ethereum Classic', symbol: 'ETC', supply: 147000000 },
	{ binance: 'AAVEUSDT', name: 'Aave', symbol: 'AAVE', supply: 15100000 },
	{ binance: 'ALGOUSDT', name: 'Algorand', symbol: 'ALGO', supply: 8100000000 },
	{ binance: 'FILUSDT', name: 'Filecoin', symbol: 'FIL', supply: 530000000 },
	{ binance: 'TRXUSDT', name: 'TRON', symbol: 'TRX', supply: 86200000000 },
	{ binance: 'XTZUSDT', name: 'Tezos', symbol: 'XTZ', supply: 983000000 },
	{ binance: 'MKRUSDT', name: 'Maker', symbol: 'MKR', supply: 900000 },
	{ binance: 'COMPUSDT', name: 'Compound', symbol: 'COMP', supply: 8300000 },
	{ binance: 'DASHUSDT', name: 'Dash', symbol: 'DASH', supply: 11500000 },
	{ binance: 'EOSUSDT', name: 'EOS', symbol: 'EOS', supply: 1100000000 },
	{ binance: 'BATUSDT', name: 'Basic Attention', symbol: 'BAT', supply: 1500000000 },
	{ binance: 'VETUSDT', name: 'VeChain', symbol: 'VET', supply: 72700000000 },
	{ binance: 'NEOUSDT', name: 'NEO', symbol: 'NEO', supply: 70500000 },
	{ binance: 'WAVESUSDT', name: 'Waves', symbol: 'WAVES', supply: 100000000 },
	{ binance: 'SHIBUSDT', name: 'Shiba Inu', symbol: 'SHIB', supply: 589000000000000 },
	{ binance: 'MATICUSDT', name: 'Polygon', symbol: 'MATIC', supply: 9900000000 },
];

const COIN_META_MAP = Object.fromEntries(COIN_META.map((c) => [c.binance, c]));
const BINANCE_SYMBOLS = encodeURIComponent(JSON.stringify(COIN_META.map((c) => c.binance)));
const getCoinIcon = (symbol) => `https://cdn.jsdelivr.net/gh/spothq/cryptocurrency-icons@master/32/color/${symbol.toLowerCase()}.png`;

const CURRENCIES = [
	{ value: 'usd', label: 'USD', sublabel: 'US Dollar' },
	{ value: 'ghs', label: 'GHS', sublabel: 'Ghanaian Cedi' },
	{ value: 'eur', label: 'EUR', sublabel: 'Euro' },
	{ value: 'gbp', label: 'GBP', sublabel: 'British Pound' },
	{ value: 'jpy', label: 'JPY', sublabel: 'Japanese Yen' },
];

const ASSET_FILTERS = [
	{ value: 'all', label: 'All assets', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M2 12h20" /></svg> },
	{ value: 'tradeable', label: 'Tradeable' },
	{ value: 'new', label: 'New' },
	{ value: 'gainers', label: 'Gainers' },
	{ value: 'losers', label: 'Losers' },
];

const TIME_PERIODS = [
	{ value: '1h', label: '1H' },
	{ value: '24h', label: '1D' },
	{ value: '7d', label: '1W' },
	{ value: '30d', label: '1M' },
	{ value: '1y', label: '1Y' },
];

const ROWS_OPTIONS = [
	{ value: 10, label: '10 rows' },
	{ value: 30, label: '30 rows' },
	{ value: 50, label: '50 rows' },
];

const fmtCompact = (val, currLabel) => {
	if (val == null) return '--';
	if (val >= 1e12) return `${currLabel} ${(val / 1e12).toFixed(2)}T`;
	if (val >= 1e9) return `${currLabel} ${(val / 1e9).toFixed(1)}B`;
	if (val >= 1e6) return `${currLabel} ${(val / 1e6).toFixed(1)}M`;
	return `${currLabel} ${val.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};
const fmtPrice = (val, currLabel) => (val == null ? '--' : `${currLabel} ${val.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`);
const fmtPct = (pct) => (pct == null ? '0.00' : Math.abs(pct).toFixed(2));

const ChangeIndicator = ({ value, className = '' }) => {
	if (value == null) return <span className={`text-gray-40 ${className}`}>0.00%</span>;
	const isNeg = value < 0;
	const color = isNeg ? 'text-red-60' : value > 0 ? 'text-green-60' : 'text-gray-60';
	return (
		<span className={`inline-flex items-center gap-0.5 ${color} ${className}`}>
			{isNeg ? <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M9.5 8.5L2.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /><path d="M9.5 3.5V8.5H4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg> : <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2.5 3.5L9.5 8.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /><path d="M2.5 8.5V3.5H7.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>}
			{fmtPct(value)}%
		</span>
	);
};

const Explore = () => {
	const [coins, setCoins] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [searchQuery, setSearchQuery] = useState('');
	const fxRates = useRef({ ghs: FALLBACK_GHS });

	const [assetFilter, setAssetFilter] = useState('all');
	const [timePeriod, setTimePeriod] = useState('24h');
	const [currency, setCurrency] = useState('ghs');
	const [rowsPerPage, setRowsPerPage] = useState(10);
	const [currentPage, setCurrentPage] = useState(1);
	const [sortField, setSortField] = useState('market_cap');
	const [sortDir, setSortDir] = useState('desc');

	const currLabel = currency.toUpperCase();
	const getRate = useCallback(() => (currency === 'usd' ? 1 : fxRates.current[currency] ?? FALLBACK_GHS), [currency]);

	useEffect(() => {
		(async () => {
			try {
				const res = await fetch('https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/usd.json');
				if (res.ok) {
					const data = await res.json();
					if (data?.usd) fxRates.current = data.usd;
				}
			} catch {}
		})();
	}, []);

	const fetchPrices = useCallback(async () => {
		const res = await fetch(`https://api.binance.com/api/v3/ticker/24hr?symbols=${BINANCE_SYMBOLS}`);
		if (!res.ok) throw new Error(`Binance ${res.status}`);
		return res.json();
	}, []);

	const buildCoins = useCallback((tickers) => {
		const rate = getRate();
		return tickers
			.map((t) => {
				const meta = COIN_META_MAP[t.symbol];
				if (!meta) return null;
				const priceUsd = parseFloat(t.lastPrice);
				const price = priceUsd * rate;
				const change24h = parseFloat(t.priceChangePercent);
				const mktCap = priceUsd * (meta.supply || 1) * rate;
				return {
					id: t.symbol,
					name: meta.name,
					symbol: meta.symbol,
					image: getCoinIcon(meta.symbol),
					current_price: price,
					price_change_percentage_24h: change24h,
					market_cap: mktCap,
					total_volume: parseFloat(t.quoteVolume) * rate,
				};
			})
			.filter(Boolean)
			.sort((a, b) => b.market_cap - a.market_cap);
	}, [getRate]);

	useEffect(() => {
		let cancelled = false;
		(async () => {
			try {
				const tickers = await fetchPrices();
				if (!cancelled) { setCoins(buildCoins(tickers)); setLoading(false); }
			} catch (err) {
				if (!cancelled) { setError(err.message); setLoading(false); }
			}
		})();
		const id = setInterval(async () => {
			try {
				const tickers = await fetchPrices();
				if (!cancelled) setCoins(buildCoins(tickers));
			} catch {}
		}, 5000);
		return () => { cancelled = true; clearInterval(id); };
	}, [fetchPrices, buildCoins]);

	useEffect(() => { setCurrentPage(1); }, [assetFilter, timePeriod, currency, rowsPerPage, searchQuery]);

	const getCoinChange = (coin) => coin.price_change_percentage_24h ?? null;
	const applyAssetFilter = (list) => {
		switch (assetFilter) {
			case 'tradeable': return [...list].sort((a, b) => b.market_cap - a.market_cap).slice(0, 20);
			case 'new': return list.slice(-10);
			case 'gainers': return [...list].filter((c) => getCoinChange(c) > 0).sort((a, b) => (getCoinChange(b) ?? 0) - (getCoinChange(a) ?? 0));
			case 'losers': return [...list].filter((c) => getCoinChange(c) < 0).sort((a, b) => (getCoinChange(a) ?? 0) - (getCoinChange(b) ?? 0));
			default: return list;
		}
	};

	const topGainers = [...coins].filter((c) => c.price_change_percentage_24h != null).sort((a, b) => b.price_change_percentage_24h - a.price_change_percentage_24h).slice(0, 6);
	const newCoins = coins.slice(-3);
	const searchFiltered = coins.filter((c) => c.name.toLowerCase().includes(searchQuery.toLowerCase()) || c.symbol.toLowerCase().includes(searchQuery.toLowerCase()));
	const categoryFiltered = applyAssetFilter(searchFiltered);
	const sortedCoins = [...categoryFiltered].sort((a, b) => {
		let valA, valB;
		if (sortField === 'change') { valA = getCoinChange(a) ?? 0; valB = getCoinChange(b) ?? 0; }
		else if (sortField === 'name') { return sortDir === 'asc' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name); }
		else { valA = a[sortField] ?? 0; valB = b[sortField] ?? 0; }
		return sortDir === 'asc' ? valA - valB : valB - valA;
	});
	const totalPages = Math.ceil(sortedCoins.length / rowsPerPage);
	const pageCoins = sortedCoins.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);
	const handleSort = (field) => { if (sortField === field) setSortDir(sortDir === 'asc' ? 'desc' : 'asc'); else { setSortField(field); setSortDir('desc'); } setCurrentPage(1); };

	const totalMktCap = coins.reduce((s, c) => s + (c.market_cap || 0), 0);
	const totalVol = coins.reduce((s, c) => s + (c.total_volume || 0), 0);
	const btcCoin = coins.find((c) => c.symbol === 'BTC');
	const btcDom = btcCoin && totalMktCap > 0 ? ((btcCoin.market_cap / totalMktCap) * 100) : 0;
	const marketStats = [
		{ label: 'Total market cap', value: fmtCompact(totalMktCap, currLabel), change: -1.20 },
		{ label: 'Trade volume', value: fmtCompact(totalVol, currLabel), change: -3.46 },
		{ label: 'Buy-sell ratio', value: `${currLabel} 0.76`, change: -3.36 },
		{ label: 'BTC dominance', value: `${btcDom.toFixed(2)}%`, change: 0.01 },
	];

	return (
		<div className="min-h-screen flex flex-col bg-white">
			<Navbar />
			<main className="flex-1">
				<Container className="py-8 md:py-12">
					<div className="flex flex-col lg:flex-row gap-8">
						<div className="flex-1 min-w-0">
							<div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-6 border-b border-gray-10 mb-8 mt-2">
								<div>
									<h1 className="text-[32px] font-bold leading-tight text-gray-100">Explore crypto</h1>
									<p className="text-body text-gray-60 mt-1">Coinbase 50 Index is down <span className="text-red-60">↘ 1.23%</span> (24hrs)</p>
								</div>
								<div className="relative w-full md:w-[360px]">
									<div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-100">
										<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
									</div>
									<input type="text" placeholder="Search for an asset" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-11 pr-4 py-3 rounded-full bg-gray-5 text-body text-gray-100 outline-none hover:bg-gray-10 focus:bg-white focus:border focus:border-blue-60 transition-colors duration-200 placeholder:text-gray-60"/>
								</div>
							</div>

							<section className="pb-8 border-b border-gray-10 mb-8">
								<div className="flex items-center justify-between mb-2">
									<h2 className="text-title-1 text-gray-100">Market stats</h2>
								</div>
								<div className="flex gap-4 overflow-x-auto pb-2">
									{loading ? (<><div className="flex-1 min-w-[240px] h-[140px] bg-gray-5 rounded-lg"/><div className="flex-1 min-w-[240px] h-[140px] bg-gray-5 rounded-lg"/><div className="flex-1 min-w-[240px] h-[140px] bg-gray-5 rounded-lg"/></>) : (
										marketStats.map((stat) => (
											<div key={stat.label} className="flex-1 min-w-[240px] bg-gray-5 rounded-lg p-4">
												<p className="text-body text-gray-60 mb-1">{stat.label}</p>
												<p className="text-headline text-gray-100">{stat.value}</p>
												<span className="text-label-1">{stat.change > 0 ? '↗' : '↘'} {Math.abs(stat.change).toFixed(2)}%</span>
											</div>
										))
									)}
								</div>
							</section>

							<section>
								<div className="flex gap-2 mb-6 mt-4 flex-wrap">
									<FilterDropdown label="All assets" value={assetFilter} options={ASSET_FILTERS} onChange={setAssetFilter}/>
									<FilterDropdown label="1D" value={timePeriod} options={TIME_PERIODS} onChange={setTimePeriod}/>
									<FilterDropdown label="GHS" value={currency} options={CURRENCIES} onChange={setCurrency} searchable/>
									<FilterDropdown label="10 rows" value={rowsPerPage} options={ROWS_OPTIONS} onChange={setRowsPerPage}/>
								</div>
								<div className="overflow-x-auto border-t border-gray-10">
									<table className="w-full text-left">
										<thead>
											<tr className="border-b border-gray-10">
												<th className="py-3 px-3 w-10"></th>
												<th className="py-3 px-3 text-label-2 text-gray-60 cursor-pointer hover:text-gray-100 transition-colors select-none" onClick={() => handleSort('name')}><span className="inline-flex items-center gap-1">Asset</span></th>
												<th className="py-3 px-3 text-label-2 text-gray-60 cursor-pointer hover:text-gray-100 transition-colors select-none" onClick={() => handleSort('current_price')}><span className="inline-flex items-center gap-1">Market price</span></th>
												<th className="py-3 px-3 text-label-2 text-gray-60">Change</th>
												<th className={`py-3 px-3 text-label-2 cursor-pointer hover:text-gray-100 transition-colors select-none ${sortField === 'market_cap' ? 'text-blue-60' : 'text-gray-60'}`} onClick={() => handleSort('market_cap')}><span className="inline-flex items-center gap-1">Mkt cap</span></th>
												<th className="py-3 px-3 text-label-2 text-gray-60 cursor-pointer hover:text-gray-100 transition-colors select-none" onClick={() => handleSort('total_volume')}><span className="inline-flex items-center gap-1">Volume</span></th>
												<th className="py-3 px-3 text-label-2 text-gray-60">Actions</th>
											</tr>
										</thead>
										<tbody>
											{loading ? (Array.from({ length: rowsPerPage }).map((_, i) => <tr key={i}><td colSpan="7" className="py-4 px-3"><div className="w-full h-6 bg-gray-5 rounded"/></td></tr>)) : pageCoins.length === 0 ? (<tr><td colSpan="7" className="py-12 text-center text-body text-gray-40">No assets found</td></tr>) : (
												pageCoins.map((coin) => {
													const changeVal = getCoinChange(coin);
													return (
														<tr key={coin.id} className="border-b border-gray-10 hover:bg-gray-5 transition-colors cursor-pointer group">
															<td className="py-4 px-3">
																<button className="text-gray-20 hover:text-yellow-30 transition-colors"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg></button>
															</td>
															<td className="py-4 px-3">
																<div className="flex items-center gap-3">
																	<img src={coin.image} alt={coin.symbol} className="w-8 h-8 rounded-full bg-gray-10" onError={(e) => { e.currentTarget.src = `https://placehold.co/32x32/e5e7eb/666?text=${coin.symbol.slice(0, 2)}`; }} />
																	<div>
																		<p className="text-headline text-gray-100">{coin.name}</p>
																		<p className="text-label-2 text-gray-40 uppercase">{coin.symbol}</p>
																	</div>
																</div>
															</td>
															<td className="py-4 px-3 text-body text-gray-100">{fmtPrice(coin.current_price, currLabel)}</td>
															<td className="py-4 px-3"><ChangeIndicator value={changeVal} className="text-body" /></td>
															<td className="py-4 px-3 text-body text-gray-100">{fmtCompact(coin.market_cap, currLabel)}</td>
															<td className="py-4 px-3 text-body text-gray-100">{fmtCompact(coin.total_volume, currLabel)}</td>
															<td className="py-4 px-3">
																<Link to="/signup" className="inline-flex items-center justify-center px-5 py-2 rounded-full bg-blue-60 text-white text-label-1 hover:opacity-90 transition-opacity">Trade</Link>
															</td>
														</tr>
													);
												})
											)}
										</tbody>
									</table>
								</div>

								{!loading && totalPages > 1 && (
									<div className="flex flex-col items-center gap-3 mt-6">
										<div className="flex items-center gap-1">
											<button onClick={() => setCurrentPage(Math.max(1, currentPage - 1))} disabled={currentPage === 1} className="w-8 h-8 rounded-full flex items-center justify-center text-gray-60 hover:bg-gray-5 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg></button>
											<button onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))} disabled={currentPage === totalPages} className="w-8 h-8 rounded-full flex items-center justify-center text-gray-60 hover:bg-gray-5 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg></button>
										</div>
										<p className="text-label-2 text-gray-40">{(currentPage - 1) * rowsPerPage + 1}-{Math.min(currentPage * rowsPerPage, sortedCoins.length)} of {sortedCoins.length.toLocaleString()} assets</p>
									</div>
								)}
							</section>

							<div className="bg-blue-60 mt-8 mb-8 rounded-xl overflow-hidden">
								<div className="py-8 md:py-12 px-6 md:px-12 flex flex-col md:flex-row items-center justify-between gap-8">
									<div className="flex-1">
										<h2 className="text-3xl text-white mb-6 max-w-lg">Create a Coinbase account to trade crypto. It's quick, easy, and secure.</h2>
										<Link to="/signup"><Button variant="outline" size="lg" className="bg-white text-gray-100 border-white hover:bg-gray-5">Start Trading</Button></Link>
									</div>
									<div className="shrink-0">
										<img src="https://static-assets.coinbase.com/ui-infra/illustration/v1/spotRectangle/svg/light/accessToAdvancedCharts-5.svg" alt="Advanced charts illustration" className="w-[240px] md:w-[280px] h-auto"/>
									</div>
								</div>
							</div>
						</div>

						<aside className="w-full lg:w-[320px] shrink-0 flex flex-col gap-6 lg:pl-8 lg:border-l lg:border-gray-10">
							<div className="bg-blue-60 rounded-2xl p-5 relative overflow-hidden min-h-[160px]">
								<div className="relative z-10 w-[65%] shrink-0">
									<h3 className="text-[17px] leading-[24px] font-semibold text-white mb-1">Get started</h3>
									<p className="text-[15px] leading-[20px] text-white mb-5">Create your account today</p>
									<Link to="/signup"><button className="bg-white text-black px-4 py-2 rounded-full font-medium text-[15px] transition-opacity hover:opacity-90">Sign up</button></Link>
								</div>
								<div className="absolute right-0 top-1/2 -translate-y-1/2 h-full flex items-center justify-end pointer-events-none">
									<img src="https://static-assets.coinbase.com/ui-infra/illustration/v1/spotSquare/svg/light/nuxPopularAssets-5.svg" alt="Get started illustration" className="w-[124px] h-[124px] object-contain translate-x-2"/>
								</div>
							</div>
						</aside>
					</div>
				</Container>
			</main>
			<Footer />
		</div>
	);
};

export default Explore;
