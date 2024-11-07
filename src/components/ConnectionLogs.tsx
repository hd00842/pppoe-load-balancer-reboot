import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const logs = [
  {
    time: "2024-02-20 15:45:23",
    interface: "pppoe-out1",
    event: "connected",
    message: "Connection established",
  },
  {
    time: "2024-02-20 15:43:12", 
    interface: "pppoe-out2",
    event: "disconnected",
    message: "Connection lost",
  },
  {
    time: "2024-02-20 15:42:55",
    interface: "pppoe-out1", 
    event: "error",
    message: "Authentication failed",
  },
  {
    time: "2024-02-20 15:40:21",
    interface: "pppoe-out3",
    event: "connected",
    message: "Connection established",
  },
];

const ConnectionLogs = () => {
  return (
    <Card className="col-span-4">
      <CardHeader>
        <CardTitle className="text-base font-medium">Connection Logs</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {logs.map((log, i) => (
            <div key={i} className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none">
                  {log.interface}
                </p>
                <p className="text-sm text-muted-foreground">
                  {log.message}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Badge
                  variant={
                    log.event === "connected"
                      ? "default"
                      : log.event === "disconnected"
                      ? "secondary"
                      : "destructive"
                  }
                >
                  {log.event}
                </Badge>
                <span className="text-xs text-muted-foreground font-mono">
                  {log.time}
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ConnectionLogs;