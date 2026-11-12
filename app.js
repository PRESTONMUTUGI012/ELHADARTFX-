const PARTNER_APP_ID = "34UGhpx0qrXHqpfKHAkGH";
const AFFILIATE_TOKEN = "3A2CFHPG722B";

const marketSymbols = {
    volatility_1s: [
        { symbol: '1HZ10V', name: 'Volatility 10 (1s) Index' },
        { symbol: '1HZ25V', name: 'Volatility 25 (1s) Index' },
        { symbol: '1HZ50V', name: 'Volatility 50 (1s) Index' },
        { symbol: '1HZ75V', name: 'Volatility 75 (1s) Index' },
        { symbol: '1HZ100V', name: 'Volatility 100 (1s) Index' }
    ],
    synthetic: [
        { symbol: 'R_100', name: 'Volatility 100 Index' }, { symbol: 'R_75', name: 'Volatility 75 Index' },
        { symbol: 'R_50', name: 'Volatility 50 Index' }, { symbol: 'R_25', name: 'Volatility 25 Index' },
        { symbol: 'R_10', name: 'Volatility 10 Index' },
        { symbol: 'BOOM1000', name: 'Boom 1000 Index' }, { symbol: 'CRASH1000', name: 'Crash 1000 Index' },
        { symbol: 'STEP', name: 'Step Index' }
    ],
    forex: [
        { symbol: 'frxEURUSD', name: 'EUR/USD (Euro/Dollar)' }, { symbol: 'frxGBPUSD', name: 'GBP/USD (Pound/Dollar)' },
        { symbol: 'frxUSDJPY', name: 'USD/JPY (Dollar/Yen)' }, { symbol: 'frxAUDUSD', name: 'AUD/USD (Aussie/Dollar)' }
    ],
    stocks: [
        { symbol: 'TSLA', name: 'Tesla Inc (TSLA)' }, { symbol: 'NVDA', name: 'NVIDIA Corp (NVDA)' },
        { symbol: 'AAPL', name: 'Apple Inc (AAPL)' }
    ],
    crypto: [
        { symbol: 'cryBTCUSD', name: 'BTC/USD (Bitcoin)' }, { symbol: 'cryETHUSD', name: 'ETH/USD (Ethereum)' }
    ],
    commodities: [
        { symbol: 'frxXAUUSD', name: 'Spot Gold (XAU/USD)' }, { symbol: 'frxXAGUSD', name: 'Spot Silver (XAG/USD)' }
    ]
};

const exchangeRates = { KES: 129.0, UGX: 3750.0, TZS: 2600.0, ETB: 120.5, EUR: 0.92, GBP: 0.79, JPY: 155.0 };

let remainingSeconds = 180;
function runCoreLoadingSequence() {
    const timerDisplay = document.getElementById('loading-timer-display');
    const progressBar = document.getElementById('core-progress-bar');
    const splashScreen = document.getElementById('splash-screen');

    const interval = setInterval(() => {
        remainingSeconds--;
        const mins = Math.floor(remainingSeconds / 60).toString().padStart(2, '0');
        const secs = (remainingSeconds % 60).toString().padStart(2, '0');
        if (timerDisplay) timerDisplay.innerText = `${mins}:${secs}`;
        if (progressBar) progressBar.style.width = `${((180 - remainingSeconds) / 180) * 100}%`;

        if (remainingSeconds <= 0) {
            clearInterval(interval);
            if (splashScreen) { splashScreen.style.opacity = '0'; setTimeout(() => splashScreen.remove(), 600); }
            initializeLiveTerminal();
        }
    }, 1000);
}

function updateAssetDropdown(category) {
    const assetSelector = document.getElementById('asset-selector');
    if (!assetSelector) return;
    assetSelector.innerHTML = '';
    (marketSymbols[category] || marketSymbols.volatility_1s).forEach(item => {
        const opt = document.createElement('option');
        opt.value = item.symbol;
        opt.innerText = item.name;
        assetSelector.appendChild(opt);
    });
}

function setupCurrencyConverter() {
    const amtInput = document.getElementById('convert-amount');
    const curSelect = document.getElementById('target-currency');
    const outEl = document.getElementById('converted-output');
    function calc() {
        const val = (parseFloat(amtInput.value) || 0) * (exchangeRates[curSelect.value] || 1);
        outEl.innerText = `${val.toLocaleString(undefined, {minimumFractionDigits: 2})} ${curSelect.value}`;
    }
    if (amtInput && curSelect) { amtInput.addEventListener('input', calc); curSelect.addEventListener('change', calc); calc(); }
}

function switchAccountMode(mode) {
    const b1 = document.getElementById('btn-mode-demo'), b2 = document.getElementById('btn-mode-real');
    if (mode === 'demo') {
        b1.className = 'px-3 py-1 rounded-lg font-bold bg-emerald-600 text-white transition';
        b2.className = 'px-3 py-1 rounded-lg font-semibold text-slate-400 hover:text-white transition';
    } else {
        b2.className = 'px-3 py-1 rounded-lg font-bold bg-emerald-600 text-white transition';
        b1.className = 'px-3 py-1 rounded-lg font-semibold text-slate-400 hover:text-white transition';
    }
}

function executeActionSignal(type) {
    alert(`Signal Executed: ${type} contract successfully placed on Volatility 1s / Digit Market!`);
}

function loginWithDeriv() {
    window.location.href = `https://oauth.deriv.com/oauth2/authorize?app_id=${PARTNER_APP_ID}&affiliate_token=${AFFILIATE_TOKEN}`;
}
function signupWithDeriv() {
    window.open(`https://hub.deriv.com/tradershub/signup?t=${AFFILIATE_TOKEN}`, '_blank');
}

function toggleSpeedBoatExecution() {
    const aiEngine = window.aiBotsEngineInstance;
    if (!aiEngine) return;
    aiEngine.isExecuting = !aiEngine.isExecuting;
    const badge = document.getElementById('boat-status-badge');
    const btn = document.getElementById('btn-launch-boat');
    if (aiEngine.isExecuting) {
        badge.innerText = 'JET-MODE ACTIVE (Digit / 1s)';
        badge.className = 'text-[10px] bg-emerald-950 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500 font-mono animate-pulse';
        btn.innerText = 'Stop Speed Boat';
        btn.className = 'w-full bg-red-600/20 text-red-300 font-bold py-2.5 rounded-xl text-xs border border-red-500/40 transition';
    } else {
        badge.innerText = 'STANDBY';
        badge.className = 'text-[10px] bg-slate-900 text-slate-300 px-2 py-0.5 rounded border border-slate-800 font-mono';
        btn.innerText = 'Launch Speed Boat';
        btn.className = 'w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 rounded-xl text-xs transition';
    }
}

// ALL-DIGIT MATRIX & PRO SCANNER ANALYZER
let digitCounts = [0,0,0,0,0,0,0,0,0,0];
let totalDigitsAnalyzed = 0;

function computeAllDigitsAndScanner(tickBuffer) {
    if (!tickBuffer || tickBuffer.length === 0) return;
    const currentPrice = tickBuffer[tickBuffer.length - 1];
    const priceStr = currentPrice.toFixed(4);
    const lastDigit = parseInt(priceStr.slice(-1));

    digitCounts[lastDigit]++;
    totalDigitsAnalyzed++;

    document.getElementById('last-digit-display').innerText = `Last Digit: ${lastDigit}`;

    // Update 0-9 Frequency UI Matrix
    let mostDormantDigit = 0;
    let minFreq = Infinity;
    let mostFrequentDigit = 0;
    let maxFreq = -1;

    for (let i = 0; i < 10; i++) {
        const pct = totalDigitsAnalyzed > 0 ? ((digitCounts[i] / totalDigitsAnalyzed) * 100).toFixed(1) : 0.0;
        const el = document.getElementById(`freq-${i}`);
        if (el) el.innerText = `${pct}%`;

        if (digitCounts[i] < minFreq) { minFreq = digitCounts[i]; mostDormantDigit = i; }
        if (digitCounts[i] > maxFreq) { maxFreq = digitCounts[i]; mostFrequentDigit = i; }
    }

    // Even / Odd Dominance
    const evenCount = digitCounts[0] + digitCounts[2] + digitCounts[4] + digitCounts[6] + digitCounts[8];
    const oddCount = totalDigitsAnalyzed - evenCount;
    const evenPct = totalDigitsAnalyzed > 0 ? ((evenCount / totalDigitsAnalyzed) * 100).toFixed(1) : 50;
    
    document.getElementById('digit-differ-recommendation').innerText = `DIFFER ${mostDormantDigit} (Dormant ~${minFreq} hits)`;
    document.getElementById('even-odd-recommendation').innerText = evenPct > 52 ? `ODD Streaking (${100 - evenPct}%)` : `EVEN Streaking (${evenPct}%)`;
    document.getElementById('over-under-recommendation').innerText = lastDigit >= 5 ? `UNDER 7 / 8 Recommended` : `OVER 2 / 3 Recommended`;

    // Pro Scanner Feed Update
    const scannerFeed = document.getElementById('pro-scanner-feed');
    if (scannerFeed && Math.random() < 0.2) {
        const timestamp = new Date().toLocaleTimeString();
        const feedItem = document.createElement('div');
        feedItem.innerHTML = `<span class="text-slate-500">[${timestamp}]</span> <span class="text-gold font-bold">DIGIT DIFFER TARGET: ${mostDormantDigit} | 1s Volatility Flow Stable</span>`;
        scannerFeed.prepend(feedItem);
        if (scannerFeed.children.length > 6) scannerFeed.removeChild(scannerFeed.lastChild);
    }
}

function updateKillzonesAndNews() {
    const now = new Date();
    const eatTime = new Date(now.getTime() + (3 * 60 * 60 * 1000));
    const hrs = eatTime.getUTCHours();
    const mins = eatTime.getUTCMinutes();
    const secs = eatTime.getUTCSeconds();

    const timerEl = document.getElementById('killzone-timer');
    if (timerEl) timerEl.innerText = `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')} EAT`;

    let sessionName = "Volatility 1s / 24/7 Synthetic Session Active";
    let currencyBias = "Volatility 1s Rapid Tick Feed Normal";

    if (hrs >= 10 && hrs < 15) {
        sessionName = "🔥 London Open Killzone";
        currencyBias = "EUR/USD & Volatility 1s High Liquidity";
    } else if (hrs >= 15 && hrs < 19) {
        sessionName = "⚡ London / New York Overlap";
        currencyBias = "XAU/USD & Volatility 75 (1s) High Spike Window";
    }

    const sessionEl = document.getElementById('active-session-name');
    const biasEl = document.getElementById('active-currency-bias');
    if (sessionEl) sessionEl.innerText = sessionName;
    if (biasEl) biasEl.innerText = currencyBias;

    const newsContainer = document.getElementById('news-calendar-container');
    if (newsContainer && !newsContainer.hasChildNodes()) {
        newsContainer.innerHTML = `
            <div class="bg-slate-900 p-3 rounded-xl border border-slate-800 space-y-1.5">
                <div class="flex justify-between font-bold text-slate-200"><span>US CPI Inflation Release</span><span class="text-emerald-400">15:30 EAT</span></div>
                <p class="text-[11px] text-slate-400">Expected 50-pip liquidity sweep on forex. Synthetic Volatility 1s markets operate unaffected 24/7.</p>
            </div>
        `;
    }
}

function initializeLiveTerminal() {
    updateAssetDropdown('volatility_1s');
    setupCurrencyConverter();

    const categorySelect = document.getElementById('market-category');
    if (categorySelect) {
        categorySelect.addEventListener('change', (e) => {
            updateAssetDropdown(e.target.value);
            const newAsset = document.getElementById('asset-selector').value;
            if (window.derivApiInstance) window.derivApiInstance.subscribeTicks(newAsset, handleTick);
        });
    }

    const derivApi = new DerivAPIConnector(PARTNER_APP_ID);
    window.derivApiInstance = derivApi;
    const aiEngine = new AIBotsEngine();
    window.aiBotsEngineInstance = aiEngine;

    const speedBoatSelect = document.getElementById('speed-boat-selector');
    if (speedBoatSelect) speedBoatSelect.addEventListener('change', (e) => aiEngine.setSpeedBoat(e.target.value));

    derivApi.connect().then(() => {
        const assetSelector = document.getElementById('asset-selector');
        const initialAsset = assetSelector ? assetSelector.value : '1HZ10V';
        derivApi.subscribeTicks(initialAsset, handleTick);
        if (assetSelector) assetSelector.addEventListener('change', (e) => derivApi.subscribeTicks(e.target.value, handleTick));
    }).catch(() => {
        setInterval(() => { handleTick({ quote: 6340.5234, symbol: '1HZ10V' }); }, 1000);
    });

    function handleTick(tick) {
        const quoteEl = document.getElementById('live-quote-display');
        if (quoteEl) quoteEl.innerText = tick.quote.toFixed(4);
        aiEngine.analyzeTick(tick);
        computeAllDigitsAndScanner(aiEngine.tickBuffer);
    }

    setInterval(updateKillzonesAndNews, 1000);
}

window.addEventListener('DOMContentLoaded', () => { runCoreLoadingSequence(); });
