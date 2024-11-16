import { MoonOutlined, SunOutlined } from "@ant-design/icons";
import { Button, Segmented, Select, Space } from "antd";
import { useEffect, useState } from "react";

import { useTheme } from "../../contexts/ThemeConfigProvider";
import { axiosInstance } from "../../lib/instance";
import { useChartStore } from "../../store/chartStore";
import { ISymbol, Timeframe } from "../../types/types";

import "./Header.css";

const Header = () => {
  const { isDarkMode, toggleDarkMode } = useTheme();
  const [options, setOptions] = useState<ISymbol[]>([]);
  const setActiveTimeFrame = useChartStore((state) => state.setActiveTimeFrame);
  const setActiveSymbol = useChartStore((state) => state.setActiveSymbol);
  const setIsChartRendered = useChartStore((state) => state.setIsChartRendered);

  const getAllPairs = async () => {
    const data = (await axiosInstance.get("/exchangeInfo")).data;
    const pairs: ISymbol[] = data.symbols.map((item: ISymbol) => ({
      symbol: item.symbol,
      baseAsset: item.baseAsset,
      quoteAsset: item.quoteAsset,
    }));
    return pairs;
  };
  const setAllPairs = async () => {
    const pairs = await getAllPairs();
    setOptions(pairs);
  };
  const handleChangePair = (value: string) => {
    setActiveSymbol(value);
    setIsChartRendered(false);
  };

  const handleChangeTimeframe = (value: Timeframe) => {
    setActiveTimeFrame(value);
    setIsChartRendered(false);
  };

  useEffect(() => {
    setAllPairs();
  }, []);

  return (
    <div className="header">
      <div className="header-left">
        <Space wrap>
          <Select
            defaultValue="BTCUSDT"
            style={{ width: 120 }}
            onChange={handleChangePair}
            options={options.map((item) => ({
              value: item.symbol,
              label: `${item.baseAsset}/${item.quoteAsset}`,
            }))}
          />

          <Segmented<Timeframe>
            options={Object.values(Timeframe)}
            onChange={handleChangeTimeframe}
          />
        </Space>
      </div>
      <Button
        type="text"
        onClick={toggleDarkMode}
        icon={isDarkMode ? <SunOutlined /> : <MoonOutlined />}
        size="large"
      />
    </div>
  );
};

export default Header;
