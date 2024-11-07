import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowUpDown, Wifi } from "lucide-react";

interface InterfaceCardProps {
  name: string;
  status: "connected" | "disconnected";
  uptime: string;
  download: string;
  upload: string;
}

const InterfaceCard = ({ name, status, uptime, download, upload }: InterfaceCardProps) => {
  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          <div className="flex items-center gap-2">
            <Wifi className="h-4 w-4" />
            {name}
          </div>
        </CardTitle>
        <Badge 
          variant={status === "connected" ? "default" : "secondary"}
          className="capitalize"
        >
          {status}
        </Badge>
      </CardHeader>
      <CardContent>
        <div className="text-xs text-muted-foreground">Uptime</div>
        <div className="font-mono text-sm mb-4">{uptime}</div>
        
        <div className="flex justify-between items-center">
          <div>
            <div className="text-xs text-muted-foreground">Download</div>
            <div className="font-mono text-sm">{download}</div>
          </div>
          <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
          <div>
            <div className="text-xs text-muted-foreground">Upload</div>
            <div className="font-mono text-sm">{upload}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default InterfaceCard;