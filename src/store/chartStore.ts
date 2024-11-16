import { create } from "zustand";

import { Timeframe } from "../types/types";

interface State {
  activeSymbol: string;
  activeTimeFrame: Timeframe;
  isChartRendered: boolean;
  setActiveSymbol: (symbol: string) => void;
  setActiveTimeFrame: (timeframe: Timeframe) => void;
  setIsChartRendered: (value: boolean) => void;
}

export const useChartStore = create<State>()((set) => ({
  activeSymbol: "BTCUSDT",
  activeTimeFrame: Timeframe.OneMinute,
  isChartRendered: false,
  setIsChartRendered: (value: boolean) => set({ isChartRendered: value }),
  setActiveSymbol: (symbol: string) => set({ activeSymbol: symbol }),
  setActiveTimeFrame: (timeframe: Timeframe) =>
    set({ activeTimeFrame: timeframe }),
}));
