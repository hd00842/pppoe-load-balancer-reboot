import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const ConfigurationForm = () => {
  const [ips, setIps] = useState<string[]>(['']);
  const [generatedConfig, setGeneratedConfig] = useState('');

  const handleAddIP = () => {
    setIps([...ips, '']);
  };

  const handleRemoveIP = (index: number) => {
    const newIps = ips.filter((_, i) => i !== index);
    setIps(newIps);
  };

  const handleIpChange = (index: number, value: string) => {
    const newIps = [...ips];
    newIps[index] = value;
    setIps(newIps);
  };

  const generateConfig = () => {
    if (ips.some(ip => !ip)) {
      toast.error("Vui lòng điền đầy đủ địa chỉ IP");
      return;
    }

    const config = `/ip route
add check-gateway=ping distance=1 gateway=${ips[0]} routing-mark=to_wan1
${ips.slice(1).map((ip, index) => `add check-gateway=ping distance=1 gateway=${ip} routing-mark=to_wan${index + 2}`).join('\n')}

/ip firewall mangle
add action=mark-connection chain=prerouting in-interface=ether1 new-connection-mark=wan1_conn passthrough=yes per-connection-classifier=both-addresses-and-ports:${ips.length}/${ips.length}
${ips.slice(1).map((_, index) => `add action=mark-connection chain=prerouting in-interface=ether1 new-connection-mark=wan${index + 2}_conn passthrough=yes per-connection-classifier=both-addresses-and-ports:${ips.length}/${index + 1}`).join('\n')}

${ips.map((_, index) => `add action=mark-routing chain=prerouting connection-mark=wan${index + 1}_conn new-routing-mark=to_wan${index + 1}`).join('\n')}

/ip firewall nat
${ips.map((ip, index) => `add action=masquerade chain=srcnat out-interface=pppoe-wan${index + 1}`).join('\n')}`;

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
          <CardTitle>Cấu hình cân bằng tải Mikrotik</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            {ips.map((ip, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  placeholder={`Địa chỉ IP WAN ${index + 1}`}
                  value={ip}
                  onChange={(e) => handleIpChange(index, e.target.value)}
                />
                {index > 0 && (
                  <Button
                    variant="destructive"
                    onClick={() => handleRemoveIP(index)}
                  >
                    Xóa
                  </Button>
                )}
              </div>
            ))}
          </div>
          
          <div className="flex gap-2">
            <Button onClick={handleAddIP}>Thêm IP WAN</Button>
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