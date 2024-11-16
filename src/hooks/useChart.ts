import { theme } from "antd";
import {
  CandlestickSeriesPartialOptions,
  ChartOptions,
  ColorType,
  DeepPartial,
  IChartApi,
  ISeriesApi,
  Time,
  createChart,
} from "lightweight-charts";
import { RefObject, useEffect, useRef } from "react";

import { axiosInstance } from "../lib/instance";
import { useChartStore } from "../store/chartStore";
import { IKline, KlineData } from "../types/types";

export const useChart = (ref: RefObject<HTMLDivElement> | null) => {
  const { useToken } = theme;
  const { token } = useToken();

  const chartRef = useRef<IChartApi | null>(null);
  let candlestickSeries = useRef<ISeriesApi<"Candlestick"> | null>(null);
  const timeFrame = useChartStore((state) => state.activeTimeFrame);
  const symbol = useChartStore((state) => state.activeSymbol);
  const setIsChartRendered = useChartStore((state) => state.setIsChartRendered);

  const chartOptions: DeepPartial<ChartOptions> = {
    layout: {
      textColor: token.colorText,
      background: { type: ColorType.Solid, color: "transparent" },
    },
  };
  const candleSettings: CandlestickSeriesPartialOptions = {
    upColor: "#26a69a",
    downColor: "#ef5350",
    borderVisible: false,
    wickUpColor: "#26a69a",
    wickDownColor: "#ef5350",
  };

  useEffect(() => {
    if (!ref) return;

    chartRef.current = createChart(ref.current!, chartOptions);
    candlestickSeries.current =
      chartRef.current.addCandlestickSeries(candleSettings);
    chartRef.current.timeScale().fitContent();
    return () => {
      chartRef.current?.remove();
    };
  }, [ref]);
  useEffect(() => {
    chartRef.current?.applyOptions(chartOptions);
  }, [token.colorText]);
  useEffect(() => {
    drawChart();
  }, [timeFrame, symbol]);
  const getPairData = async (): Promise<IKline[]> => {
    const data: KlineData[] = (
      await axiosInstance.get(`/klines?symbol=${symbol}&interval=${timeFrame}`)
    ).data;

    const klines: IKline[] = data.map((kline) => ({
      open: parseFloat(kline[1]),
      high: parseFloat(kline[2]),
      low: parseFloat(kline[3]),
      close: parseFloat(kline[4]),
      time: Math.floor(kline[0] / 1000) as Time,
    }));
    return klines;
  };
  const drawChart = async () => {
    const klines = await getPairData();
    setChartData(klines);
  };

  const setChartData = (data: IKline[]) => {
    if (chartRef.current && candlestickSeries.current) {
      candlestickSeries.current.setData(data);
      setIsChartRendered(true);
    }
  };
  const updateLastCandle = (data: IKline) => {
    if (chartRef.current && candlestickSeries.current) {
      candlestickSeries.current.update(data);
    }
  };

  return { setChartData, updateLastCandle };
};
