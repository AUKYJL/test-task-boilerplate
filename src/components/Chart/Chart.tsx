import { Time } from "lightweight-charts";
import { useEffect, useRef } from "react";

import { useChart } from "../../hooks/useChart";
import { useChartStore } from "../../store/chartStore";
import { IKline } from "../../types/types";

import "./Chart.css";

const Chart = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const activeSymbol = useChartStore((state) => state.activeSymbol);
  const activeTimeFrame = useChartStore((state) => state.activeTimeFrame);
  const isChartRendered = useChartStore((state) => state.isChartRendered);
  const socket = useRef<WebSocket | null>(null);
  const { updateLastCandle } = useChart(containerRef);

  useEffect(() => {
    if (socket.current) socket.current.close();
    socket.current = new WebSocket(
      `wss://fstream.binance.com/ws/${activeSymbol.toLowerCase()}@kline_${activeTimeFrame}`,
    );
    socket.current.onmessage = (data) => {
      const message = JSON.parse(data.data);
      const kline: IKline = {
        time: Math.floor(message.k.t / 1000) as Time,
        open: parseFloat(message.k.o),
        high: parseFloat(message.k.h),
        low: parseFloat(message.k.l),
        close: parseFloat(message.k.c),
      };

      if (isChartRendered) updateLastCandle(kline);
    };
  }, [activeSymbol, activeTimeFrame, isChartRendered]);

  return (
    <div className="chart">
      <div ref={containerRef} style={{ width: "100%", height: "100%" }}></div>
      {!isChartRendered && <div className="loading">Loading...</div>}
    </div>
  );
};

export default Chart;
