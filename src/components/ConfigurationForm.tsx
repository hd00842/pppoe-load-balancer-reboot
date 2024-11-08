import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { generateBasicConfig, generateIpRouting, generateMangleRules, generateNatRules, generatePPPoEConfig } from "@/utils/configGenerators";

interface IpRoute {
  ip: string;
  wan: number;
}

const ConfigurationForm = () => {
  const [numConnections, setNumConnections] = useState<number>(2);
  const [numMacvlans, setNumMacvlans] = useState<number>(2);
  const [ethernetInterface, setEthernetInterface] = useState("ether1");
  const [username, setUsername] = useState("user1");
  const [password, setPassword] = useState("password1");
  const [ipRoutes, setIpRoutes] = useState<IpRoute[]>([]);
  const [newIp, setNewIp] = useState("");
  const [selectedWan, setSelectedWan] = useState(1);

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

    const basicConfig = generateBasicConfig(numMacvlans, ethernetInterface);
    const pppoeConfig = generatePPPoEConfig(numConnections, username, password);
    const routingConfig = generateIpRouting(numConnections, ipRoutes);
    const mangleConfig = generateMangleRules(numConnections);
    const natConfig = generateNatRules(numConnections);

    setGeneratedConfigs({
      basic: basicConfig,
      pppoe: pppoeConfig,
      routing: routingConfig,
      mangle: mangleConfig,
      nat: natConfig
    });
    
    toast.success("Đã tạo cấu hình thành công!");
  };

  const [generatedConfigs, setGeneratedConfigs] = useState({
    basic: '',
    pppoe: '',
    routing: '',
    mangle: '',
    nat: ''
  });

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
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

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Ethernet Interface</label>
                <Input
                  placeholder="Ethernet Interface"
                  value={ethernetInterface}
                  onChange={(e) => setEthernetInterface(e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">PPPoE Username</label>
                <Input
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">PPPoE Password</label>
                <Input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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
          
          <Button onClick={generateConfig}>Tạo cấu hình</Button>

          {Object.keys(generatedConfigs).some(key => generatedConfigs[key as keyof typeof generatedConfigs]) && (
            <Tabs defaultValue="basic" className="w-full">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="basic">Interface</TabsTrigger>
                <TabsTrigger value="pppoe">PPPoE</TabsTrigger>
                <TabsTrigger value="routing">Route</TabsTrigger>
                <TabsTrigger value="mangle">Mangle</TabsTrigger>
                <TabsTrigger value="nat">NAT</TabsTrigger>
              </TabsList>
              {Object.entries(generatedConfigs).map(([key, config]) => (
                <TabsContent key={key} value={key} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium">Cấu hình {key.toUpperCase()}</h3>
                    <Button variant="outline" onClick={() => copyToClipboard(config)}>
                      Sao chép
                    </Button>
                  </div>
                  <Textarea
                    value={config}
                    readOnly
                    className="h-[200px] font-mono"
                  />
                </TabsContent>
              ))}
            </Tabs>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ConfigurationForm;