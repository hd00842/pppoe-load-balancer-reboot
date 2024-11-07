import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RefreshCcw, Settings } from "lucide-react";
import InterfaceCard from "@/components/InterfaceCard";
import BandwidthChart from "@/components/BandwidthChart";
import ConnectionLogs from "@/components/ConnectionLogs";

const interfaces = [
  {
    name: "pppoe-out1",
    status: "connected",
    uptime: "15:23:45",
    download: "45.2 Mbps",
    upload: "12.8 Mbps",
  },
  {
    name: "pppoe-out2",
    status: "disconnected",
    uptime: "00:00:00",
    download: "0 Mbps",
    upload: "0 Mbps",
  },
  {
    name: "pppoe-out3",
    status: "connected",
    uptime: "08:15:30",
    download: "38.6 Mbps", 
    upload: "15.2 Mbps",
  },
] as const;

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-50/90">
      <div className="container py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">PPPoE Load Balancer</h1>
            <p className="text-sm text-muted-foreground">
              Monitor and manage your PPPoE connections
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="icon">
              <RefreshCcw className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon">
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid gap-4 md:grid-cols-3 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Bandwidth
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">83.8 Mbps</div>
              <p className="text-xs text-muted-foreground">
                28 Mbps upload
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Active Connections
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2/3</div>
              <p className="text-xs text-muted-foreground">
                Interfaces online
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Uptime
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">15:23:45</div>
              <p className="text-xs text-muted-foreground">
                Since last restart
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Interfaces */}
        <div className="grid gap-4 md:grid-cols-3 mb-8">
          {interfaces.map((int) => (
            <InterfaceCard key={int.name} {...int} />
          ))}
        </div>

        {/* Charts & Logs */}
        <div className="grid gap-4 md:grid-cols-4">
          <BandwidthChart />
          <ConnectionLogs />
        </div>
      </div>
    </div>
  );
};

export default Index;