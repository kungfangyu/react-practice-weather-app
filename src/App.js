/*
 * @Date: 2021-01-18 11:52:12
 * @LastEditors: Fane Kung
 * @LastEditTime: 2021-01-19 14:16:15
 * @FilePath: /weather-app/src/App.js
 */
import React, { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import { ThemeProvider } from '@emotion/react';
import './App.css';
import dayjs from 'dayjs';
import { ReactComponent as DayCloudyIcon } from './images/day-cloudy.svg';
import { ReactComponent as AirFlowIcon } from './images/airFlow.svg';
import { ReactComponent as RainIcon } from './images/rain.svg';
import { ReactComponent as RefreshIcon } from './images/refresh.svg';
import { ReactComponent as LoadingIcon } from './images/loading.svg';




const Container = styled.div`
    background-color: ${({theme}) => theme.backgroundColor};
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  `;

const WeatherCard = styled.div`
  position: relative;
  min-width: 360px;
  box-shadow: ${({ theme }) => theme.boxShadow};
  background-color: ${({ theme }) => theme.foregroundColor};
  box-sizing: border-box;
  padding: 30px 15px;
`;


const theme = {
  light: {
    backgroundColor: '#ededed',
    foregroundColor: '#f9f9f9',
    boxShadow: '0 1px 3px 0 #999999',
    titleColor: '#212121',
    temperatureColor: '#757575',
    textColor: '#828282',
  },
  dark: {
    backgroundColor: '#1F2022',
    foregroundColor: '#121416',
    boxShadow:
      '0 1px 4px 0 rgba(12, 12, 13, 0.2), 0 0 0 1px rgba(0, 0, 0, 0.15)',
    titleColor: '#f9f9fa',
    temperatureColor: '#dddddd',
    textColor: '#cccccc',
  },
};

// 透過 props 取得傳進來的資料
// props 會是 {theme: "dark", children: "台北市"}
const Location = styled.div`
  ${(props) => console.log(props)}
  font-size: 28px;
  color: ${({ theme }) => theme.titleColor};
  margin-bottom: 20px;
`;



const Description = styled.div`
  font-size: 16px;
  color: ${({ theme }) => theme.textColor};
  margin-bottom: 30px;
`;

const CurrentWeather = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
`;

const Temperature = styled.div`
  color: ${({ theme }) => theme.temperatureColor};
  font-size: 96px;
  font-weight: 300;
  display: flex;
  
`;

const Celsius = styled.div`
  font-weight: normal;
  font-size: 42px;
`;

const AirFlow = styled.div`
  display: flex;
  align-items: center;
  font-size: 16x;
  font-weight: 300;
  color: ${({ theme }) => theme.textColor};
  margin-bottom: 20px;
  svg{
    width: 25px;
    height: auto;
    margin-right: 30px;
  }
`;

const Rain = styled.div`
  display: flex;
  align-items: center;
  font-size: 16x;
  font-weight: 300;
  color: ${({ theme }) => theme.textColor};
  svg{
    width: 25px;
    height: auto;
    margin-right: 30px;
  }
`;

const Refresh = styled.div`
  position: absolute;
  right: 15px;
  bottom: 15px;
  font-size: 12px;
  display: inline-flex;
  align-items: flex-end;
  color: ${({ theme }) => theme.textColor};
  svg{
    width: 15px;
    height: 15px;
    cursor: pointer;
    margin-left: 15px;
    animation: rotate infinite 1.5s linear;
    animation-duration: ${({ isLoading }) => (isLoading ? '1.5s' : '0s')}; 
  }
  @keyframes rotate {
    from {
      transform: rotate(360deg);
    }
    to {
      transform: rotate(0deg);
    }
  }
`;

const DayCloudy = styled(DayCloudyIcon)`
  flex-basis: 30%;
`;
// 將之前取得的授權碼存成一個常數
const AUTHORIZATION_KEY = 'CWB-B4674869-76B7-4450-9330-CE848FAA909C';
const LOCATION_NAME = '臺中';

const App = () => {
  console.log('invoke function component');
  // 使用 useState 並定義 currentTheme 的預設值為 light
  const [currentTheme, setCurrentTheme] = useState('dark');
  // 定義會使用到的資料初始狀態
  const [currentWeather, setCurrentWeather] = useState({
    locationName: '臺中市',
    description: '多雲時晴',
    windSpeed: 1.1,
    temperature: 22.9,
    rainPossibility: 0,
    observationTime: '2021-01-18 12:00:00',
    isLoading: true,
  });

  

  //  加入useEffect 參數式需要放入函式
  useEffect(() => {
    console.log('execute function in useEffect');
    fetchCurrentWeather()
  }, []);



  const fetchCurrentWeather = () => {
    setCurrentWeather((prevState) => ({
        ...prevState,
        isLoading: true,
    }));
    fetch(/* 中央氣象局 API */
      `https://opendata.cwb.gov.tw/api/v1/rest/datastore/O-A0003-001?Authorization=${AUTHORIZATION_KEY}&locationName=${LOCATION_NAME}`
    )
      .then((response) => response.json())
      .then((data) => {
        console.log('data', data);
        //STEP 1 定義 `locationData` 把回傳的資料中會用到的部分取出來
        const locationData = data.records.location[0];

        //將風速（WDSD）和氣溫（TEMP）的資料取出
        // STEP 2：過濾資料
        const weatherElements = locationData.weatherElement.reduce(
          (neededElement, item) => {
            if (['WDSD', 'TEMP', 'Weather'].includes(item.elementName)) {
              neededElement[item.elementName] = item.elementValue;
            }
            return neededElement;
          },
          {}
        );
        //更新 React 資料狀態
        setCurrentWeather({
          ...currentWeather,
          observationTime: locationData.time.obsTime,
          locationName: locationData.locationName,
          temperature: weatherElements.TEMP,
          windSpeed: weatherElements.WDSD,
          description: weatherElements.Weather,
          rainPossibility: 60,
          isLoading: false,
        });
      })
  };
  
  const {
    observationTime,
    locationName,
    description,
    windSpeed,
    temperature,
    rainPossibility,
    isLoading,
  } = currentWeather;
  return (
    <ThemeProvider theme={theme[currentTheme]}>
      <Container>
        {console.log('render, isLoading: ', isLoading)}
        <WeatherCard>
          <Location>{locationName}</Location>
          <Description>{description}</Description>
          <CurrentWeather>
            <Temperature>
              {Math.round(temperature)}<Celsius>°C</Celsius>
            </Temperature>
            <DayCloudy />
          </CurrentWeather>
          <AirFlow>
            <AirFlowIcon />
          {windSpeed} m/h
        </AirFlow>
          <Rain>
            <RainIcon />{rainPossibility}%
          </Rain>
          <Refresh onClick={fetchCurrentWeather} isLoading={isLoading}>
            最後觀測時間：{new Intl.DateTimeFormat('zh-TW', {
            hour: 'numeric',
            minute: 'numeric',
          }).format(dayjs(observationTime))} {''}
          {/* 當 isLoading 為 true 時顯示 LoadingIcon 否則顯示 RefreshIcon */}
          {isLoading ? <LoadingIcon/> : <RefreshIcon />}
          </Refresh>
        </WeatherCard>
      </Container>
    </ThemeProvider>
    
  );
}

export default App;
