import React from 'react';
import { 
  BsFillArchiveFill, 
  BsFillGrid3X3GapFill, 
  BsPeopleFill, 

} from 'react-icons/bs';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer, 
  LineChart, 
  Line 
} from 'recharts';



interface DataPoint {
  name: string;
  baht2023: number;
  baht2024: number;
  pageViews: number;
}

const Home: React.FC = () => {

  const data: DataPoint[] = [
    { name: 'Jan', baht2023: 3000, baht2024: 4000, pageViews: 2400 },
    { name: 'Feb', baht2023: 5000, baht2024: 6000, pageViews: 1398 },
    { name: 'Mar', baht2023: 7000, baht2024: 8000, pageViews: 9800 },
    { name: 'Apr', baht2023: 2000, baht2024: 12000, pageViews: 3908 },
    { name: 'May', baht2023: 5000, baht2024: 9000, pageViews: 4800 },
    { name: 'Jun', baht2023: 12000, baht2024: 15000, pageViews: 3800 },
    { name: 'Jul', baht2023: 4000, baht2024: 17000, pageViews: 4300 },
    { name: 'Aug', baht2023: 18000, baht2024: 20000, pageViews: 4300 },
    { name: 'Sept', baht2023: 10000, baht2024: 25000, pageViews: 4300 },
    { name: 'Oct', baht2023: 22000, baht2024: 28000, pageViews: 4300 },
    { name: 'Nov', baht2023: 25000, baht2024: 30000, pageViews: 4300 },
    { name: 'Dec', baht2023: 20000, baht2024: 32000, pageViews: 4300 },
  ];

  const dataWeek: DataPoint[] = [
    { name: 'วันที่ 9', baht2023: 1000, baht2024: 1500, pageViews: 800 },
    { name: 'วันที่ 10', baht2023: 1200, baht2024: 1700, pageViews: 900 },
    { name: 'วันที่ 11', baht2023: 1100, baht2024: 1600, pageViews: 700 },
    { name: 'วันที่ 12', baht2023: 1300, baht2024: 1800, pageViews: 950 },
    { name: 'วันที่ 13', baht2023: 1400, baht2024: 1900, pageViews: 1000 },
    { name: 'วันที่ 14', baht2023: 1500, baht2024: 2000, pageViews: 1200 },
    { name: 'วันที่ 15', baht2023: 1600, baht2024: 2100, pageViews: 1100 },
  ];

  return (
    <main className='main-container'>
      <div className='main-title'>
        <h3>DASHBOARD</h3>
      </div>
      <div className='main-cards'>
        <div className='card'>
          <div className='card-inner'>
            <h4>EARNING (MONTHLY)</h4>
            <BsFillArchiveFill className='card_icon' />
          </div>
        
          <h1>20,000 ฿</h1>
        </div>  
        <div className='card'>
          <div className='card-inner'>
            <h4>EARNING (ANNUAL)</h4>
            <BsFillGrid3X3GapFill className='card_icon' />
          </div>
          <h1>250,000 ฿</h1>
        </div>
        <div className='card'>
          <div className='card-inner'>
            <h4>TUTOR</h4>
            <BsPeopleFill className='card_icon' />
          </div>
          <h1>109</h1>
        </div>
      </div>

      <div className='charts'>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={dataWeek}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="name" 
              interval="preserveStartEnd" 
              padding={{ left: 10, right: 10 }} 
            />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="baht2023" fill="#8884d8" name="Jan" />
            <Bar dataKey="baht2024" fill="#82ca9d" name="Feb" />
          </BarChart>
        </ResponsiveContainer>

        <ResponsiveContainer width="100%" height={300}>
          <LineChart
            data={data}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="name" 
              interval="preserveStartEnd" 
              padding={{ left: 10, right: 10 }} 
            />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="baht2023" stroke="#8884d8" name="2023" activeDot={{ r: 8 }} />
            <Line type="monotone" dataKey="baht2024" stroke="#82ca9d" name="2024" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </main>
  );
}

export default Home;
