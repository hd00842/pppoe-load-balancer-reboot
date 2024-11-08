import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { generateBasicConfig, generateIpRouting, generateMangleRules, generateNatRules } from "@/utils/configGenerators";

interface IpRoute {
  ip: string;
  wan: number;
}

const ConfigurationForm = () => {
  const [numConnections, setNumConnections] = useState<number>(2);
  const [numMacvlans, setNumMacvlans] = useState<number>(2);
  const [ipRoutes, setIpRoutes] = useState<IpRoute[]>([]);
  const [newIp, setNewIp] = useState("");
  const [selectedWan, setSelectedWan] = useState(1);
  const [generatedConfig, setGeneratedConfig] = useState('');

  const addIpRoute = () => {
    if (!newIp) {
      toast.error("Vui lòng nhập địa chỉ IP");
      return;
    }
    setIpRoutes([...ipRoutes, { ip: newIp, wan: selectedWan }]);
    setNewIp("");
    setSelectedWan(1);
  };

  const removeIpRoute = (index: number) => {
    const newRoutes = [...ipRoutes];
    newRoutes.splice(index, 1);
    setIpRoutes(newRoutes);
  };

  const generateConfig = () => {
    if (numConnections < 2) {
      toast.error("Số lượng kết nối phải từ 2 trở lên");
      return;
    }

    if (numMacvlans < numConnections) {
      toast.error("Số lượng MacVLAN phải lớn hơn hoặc bằng số kết nối PPPoE");
      return;
    }

    const config = [
      generateBasicConfig(numMacvlans),
      generateIpRouting(numConnections, ipRoutes),
      generateMangleRules(numConnections),
      generateNatRules(numConnections)
    ].join('\n\n');

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
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Số lượng kết nối PPPoE</label>
                <Input
                  type="number"
                  min={2}
                  placeholder="Số lượng kết nối PPPoE"
                  value={numConnections}
                  onChange={(e) => setNumConnections(parseInt(e.target.value) || 2)}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Số lượng MacVLAN</label>
                <Input
                  type="number"
                  min={2}
                  placeholder="Số lượng MacVLAN"
                  value={numMacvlans}
                  onChange={(e) => setNumMacvlans(parseInt(e.target.value) || 2)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-medium">Định tuyến IP</h3>
              <div className="flex gap-2">
                <Input
                  placeholder="Nhập địa chỉ IP (vd: 192.168.1.0/24)"
                  value={newIp}
                  onChange={(e) => setNewIp(e.target.value)}
                />
                <select
                  className="border rounded px-3 py-2"
                  value={selectedWan}
                  onChange={(e) => setSelectedWan(parseInt(e.target.value))}
                >
                  {Array.from({ length: numConnections }, (_, i) => (
                    <option key={i + 1} value={i + 1}>WAN {i + 1}</option>
                  ))}
                </select>
                <Button onClick={addIpRoute}>Thêm</Button>
              </div>

              {ipRoutes.length > 0 && (
                <div className="space-y-2">
                  {ipRoutes.map((route, index) => (
                    <div key={index} className="flex justify-between items-center bg-gray-50 p-2 rounded">
                      <span>{route.ip} → WAN {route.wan}</span>
                      <Button variant="destructive" size="sm" onClick={() => removeIpRoute(index)}>
                        Xóa
                      </Button>
                    </div>
                  ))}
                </div>
              )}
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