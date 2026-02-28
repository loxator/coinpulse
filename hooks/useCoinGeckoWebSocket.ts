"use client";
import { useEffect, useRef, useState } from "react";

const WS_BASE = `${process.env.NEXT_PUBLIC_COINGECKO_WEBSOCKET_URL}?x_cg_pro_api_key=${process.env.NEXT_PUBLIC_COINGECKO_PRO_API_KEY}`;
export const useCoinGeckoWebSocket = ({
  coinId,
  poolId,
  liveInterval,
}: UseCoinGeckoWebSocketProps): UseCoinGeckoWebSocketReturn => {
  const wsRef = useRef<WebSocket | null>(null);
  const subscribed = useRef(<Set<string>>new Set());

  const [price, setPrice] = useState<ExtendedPriceData | null>(null);
  const [trades, setTrades] = useState<Trade[]>([]);
  const [olhlcv, setOhlcv] = useState<OHLCData | null>(null);

  const [isWsReady, setIsWsReady] = useState(false);

  useEffect(() => {
    const ws = new WebSocket(WS_BASE);
    wsRef.current = ws;

    const send = (payload: Record<string, unknown>) => {
      // Only send if the WebSocket is in the OPEN state.
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify(payload));
      } else {
        console.warn(
          "Attempted to send data while WebSocket is not open. Current state:",
          ws.readyState,
        );
        // Optionally, handle the case where the WS is not open (e.g., queue messages, retry, or simply ignore)
      }
    };

    const handleMessage = (event: MessageEvent) => {
      const msg: WebSocketMessage = JSON.parse(event.data);

      if (msg.type === "ping") {
        send({ type: "pong" });
        return;
      }

      if (msg.type === "confirm_subscription") {
        const { channel } = JSON.parse(msg?.identifier ?? "");
        subscribed.current.add(channel);
      }

      if (msg.c === "C1") {
        setPrice({
          usd: msg.p ?? 0,
          coin: msg.i,
          price: msg.p,
          change24h: msg.pp,
          marketCap: msg.m,
          volume24h: msg.v,
          timestamp: msg.t,
        });
      }

      if (msg.c === "G2") {
        const newTrade: Trade = {
          price: msg.pu,
          value: msg.vo,
          timestamp: msg.t ?? 0,
          type: msg.ty,
          amount: msg.to,
        };

        setTrades((prev) => [newTrade, ...prev].slice(0, 7));
      }

      if (msg.ch == "G3") {
        const timestamp = msg.t ?? 0;
        const candle: OHLCData = [
          timestamp,
          Number(msg.o ?? 0),
          Number(msg.h ?? 0),
          Number(msg.l ?? 0),
          Number(msg.c ?? 0),
        ];

        setOhlcv(candle);
      }
    };

    ws.onopen = () => setIsWsReady(true);
    ws.onmessage = handleMessage;
    ws.onclose = () => setIsWsReady(false);

    ws.onerror = (_error) => {
      setIsWsReady(false);
    };

    return () => ws.close();
  }, []);

  useEffect(() => {
    if (!isWsReady) return;

    const ws = wsRef.current;
    if (!ws) return;

    const send = (payload: Record<string, unknown>) => {
      // Only send if the WebSocket is in the OPEN state.
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify(payload));
      } else {
        console.warn(
          "Attempted to send data while WebSocket is not open. Current state:",
          ws.readyState,
        );
        // Optionally, handle the case where the WS is not open (e.g., queue messages, retry, or simply ignore)
      }
    };

    const unsubscribeAll = () => {
      subscribed.current.forEach((channel) => {
        send({
          command: "unsubscribe",
          identifier: JSON.stringify({ channel }),
        });
      });
      subscribed.current.clear();
    };

    const subscribe = (channel: string, data?: Record<string, unknown>) => {
      if (subscribed.current.has(channel)) return;

      send({
        command: "subscribe",
        identifier: JSON.stringify({ channel }),
      });

      if (data) {
        send({
          command: "message",
          identifier: JSON.stringify({ channel }),
          data: JSON.stringify(data),
        });
      }
    };

    // reset local state after the current callstack to avoid mid render updates
    queueMicrotask(() => {
      setPrice(null);
      setTrades([]);
      setOhlcv(null);

      // remove existing channel subscriptions before subscribing to new ones

      unsubscribeAll();
      subscribe("CGSimplePrice", { coin_id: [coinId], action: "set_tokens" });
    });

    //subscribing to on chain trades
    const poolAddress = poolId.replace("_", ":") ?? "";
    if (poolAddress) {
      subscribe("OnchainTrade", {
        "network_id:pool_addresses": [poolAddress],
        action: "set_pools",
      });

      //subscribe to candle stick chart
      subscribe("OnchainOHLCV", {
        "network_id:pool_addresses": [poolAddress],
        interval: liveInterval,
        action: "set_pools",
      });
    }
  }, [coinId, poolId, isWsReady, liveInterval]);

  return { price, trades: trades, ohlcv: olhlcv, isConnected: isWsReady };
};
