import { Time } from "lightweight-charts";

export type KlineData = [
  number, // Open time
  string, // Open
  string, // High
  string, // Low
  string, // Close
  string, // Volume
  number, // Close time
  string, // Quote asset volume
  number, // Number of trades
  string, // Taker buy base asset volume
  string, // Taker buy quote asset volume
  string, // Ignore
];
export enum Timeframe {
  OneMinute = "1m",
  FiveMinutes = "5m",
  FifteenMinutes = "15m",
  ThirtyMinutes = "30m",
  OneHour = "1h",
  FourHours = "4h",
  OneDay = "1d",
}
export interface ISymbol {
  symbol: string;
  baseAsset: string;
  quoteAsset: string;
}
export interface IKline {
  open: number;
  close: number;
  time: Time;
  high: number;
  low: number;
}
