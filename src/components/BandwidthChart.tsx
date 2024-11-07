import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const data = [
  { time: "00:00", download: 2.4, upload: 1.2 },
  { time: "03:00", download: 1.8, upload: 0.8 },
  { time: "06:00", download: 3.2, upload: 2.1 },
  { time: "09:00", download: 5.6, upload: 3.2 },
  { time: "12:00", download: 4.2, upload: 2.8 },
  { time: "15:00", download: 6.8, upload: 4.1 },
  { time: "18:00", download: 7.2, upload: 4.8 },
  { time: "21:00", download: 5.1, upload: 3.2 },
];

const BandwidthChart = () => {
  return (
    <Card className="col-span-4">
      <CardHeader>
        <CardTitle className="text-base font-medium">Bandwidth Usage</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="download" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="upload" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#64748b" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#64748b" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="time"
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${value}MB`}
              />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="download"
                stroke="#2563eb"
                fillOpacity={1}
                fill="url(#download)"
                strokeWidth={2}
              />
              <Area
                type="monotone"
                dataKey="upload"
                stroke="#64748b"
                fillOpacity={1}
                fill="url(#upload)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default BandwidthChart;