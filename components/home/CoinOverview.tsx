import { fetcher } from "@/lib/coin-gecko-actions";
import { formatCurrency } from "@/lib/utils";
import Image from "next/image";
import { CoinOverviewFallback } from "./fallback";
import CandlestickChart from "../CandlestickChart";

const CoinOverview = async () => {
  let coin;
  let coinOHLCData;

  try {
    const [_coin, _coinOHLCData] = await Promise.all([
      fetcher<CoinDetailsData>("/coins/bitcoin", {
        dex_pair_format: "symbol",
      }),
      fetcher<OHLCData[]>("/coins/bitcoin/ohlc", {
        vs_currency: "usd",
        days: "1",
        precision: "full",
      }),
    ]);
    coin = _coin;
    coinOHLCData = _coinOHLCData;
  } catch (error) {
    console.error("Error while fetching coin data:", error);
    return <CoinOverviewFallback />;
  }
  if (!coin) return <CoinOverviewFallback />;
  return (
    <div id="coin-overview">
      <CandlestickChart data={coinOHLCData} coinId={"bitcoin"}>
        <div className="header pt-2">
          <Image
            src={coin.image.large}
            alt={coin.name}
            width={56}
            height={56}
          />
          <div className="info">
            <p>
              {coin.name} / {coin.symbol.toUpperCase()}
            </p>
            <h1>{formatCurrency(coin.market_data.current_price.usd)}</h1>
          </div>
        </div>
      </CandlestickChart>
    </div>
  );
};

export default CoinOverview;
