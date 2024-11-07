import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const ConfigurationForm = () => {
  const [numConnections, setNumConnections] = useState<number>(2);
  const [generatedConfig, setGeneratedConfig] = useState('');

  const generateConfig = () => {
    if (numConnections < 2) {
      toast.error("Số lượng kết nối phải từ 2 trở lên");
      return;
    }

    const config = `/ip route
${Array.from({ length: numConnections }, (_, i) => 
  `add check-gateway=ping distance=1 gateway=pppoe-out${i + 1} routing-mark=WAN${i + 1}`
).join('\n')}

/ip firewall mangle
${Array.from({ length: numConnections }, (_, i) => 
  `add action=mark-connection chain=prerouting in-interface=ether1 new-connection-mark=WAN${i + 1}_conn passthrough=yes per-connection-classifier=both-addresses-and-ports:${numConnections}/${i + 1}`
).join('\n')}

${Array.from({ length: numConnections }, (_, i) => 
  `add action=mark-routing chain=prerouting connection-mark=WAN${i + 1}_conn new-routing-mark=WAN${i + 1}`
).join('\n')}

/ip firewall nat
${Array.from({ length: numConnections }, (_, i) => 
  `add action=masquerade chain=srcnat out-interface=pppoe-out${i + 1}`
).join('\n')}`;

    setGeneratedConfig(config);
    toast.success("Đã tạo cấu hình thành công!");
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedConfig);
    toast.success("Đã sao chép vào clipboard!");
  };

  return (
    <div className="container max-w-3xl mx-auto py-8 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Cấu hình cân bằng tải PPPoE Mikrotik</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div className="flex gap-2">
              <Input
                type="number"
                min={2}
                placeholder="Số lượng kết nối PPPoE"
                value={numConnections}
                onChange={(e) => setNumConnections(parseInt(e.target.value) || 2)}
              />
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button onClick={generateConfig}>Tạo cấu hình</Button>
          </div>

          {generatedConfig && (
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Cấu hình RouterOS</h3>
                <Button variant="outline" onClick={copyToClipboard}>
                  Sao chép
                </Button>
              </div>
              <Textarea
                value={generatedConfig}
                readOnly
                className="h-[400px] font-mono"
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ConfigurationForm;