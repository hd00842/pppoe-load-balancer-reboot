import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface FirewallFormProps {
  portForwardIps: string[];
  setPortForwardIps: (ips: string[]) => void;
  lanNetworks: string[];
  setLanNetworks: (networks: string[]) => void;
}

export const FirewallForm = ({
  portForwardIps,
  setPortForwardIps,
  lanNetworks,
  setLanNetworks
}: FirewallFormProps) => {
  const [newPortForwardIp, setNewPortForwardIp] = useState("");
  const [newLanNetwork, setNewLanNetwork] = useState("");

  const addPortForwardIp = () => {
    if (newPortForwardIp && !portForwardIps.includes(newPortForwardIp)) {
      setPortForwardIps([...portForwardIps, newPortForwardIp]);
      setNewPortForwardIp("");
    }
  };

  const removePortForwardIp = (ip: string) => {
    setPortForwardIps(portForwardIps.filter(item => item !== ip));
  };

  const addLanNetwork = () => {
    if (newLanNetwork && !lanNetworks.includes(newLanNetwork)) {
      setLanNetworks([...lanNetworks, newLanNetwork]);
      setNewLanNetwork("");
    }
  };

  const removeLanNetwork = (network: string) => {
    setLanNetworks(lanNetworks.filter(item => item !== network));
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h3 className="text-lg font-medium">Port Forward IPs</h3>
        <div className="flex gap-2">
          <Input
            placeholder="Nhập địa chỉ IP (vd: 192.168.1.100)"
            value={newPortForwardIp}
            onChange={(e) => setNewPortForwardIp(e.target.value)}
          />
          <Button onClick={addPortForwardIp}>Thêm</Button>
        </div>
        {portForwardIps.length > 0 && (
          <div className="space-y-2">
            {portForwardIps.map((ip, index) => (
              <div key={index} className="flex justify-between items-center bg-gray-50 p-2 rounded">
                <span>{ip}</span>
                <Button variant="destructive" size="sm" onClick={() => removePortForwardIp(ip)}>
                  Xóa
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="space-y-2">
        <h3 className="text-lg font-medium">LAN Networks</h3>
        <div className="flex gap-2">
          <Input
            placeholder="Nhập dải địa chỉ LAN (vd: 192.168.0.0/24)"
            value={newLanNetwork}
            onChange={(e) => setNewLanNetwork(e.target.value)}
          />
          <Button onClick={addLanNetwork}>Thêm</Button>
        </div>
        {lanNetworks.length > 0 && (
          <div className="space-y-2">
            {lanNetworks.map((network, index) => (
              <div key={index} className="flex justify-between items-center bg-gray-50 p-2 rounded">
                <span>{network}</span>
                <Button variant="destructive" size="sm" onClick={() => removeLanNetwork(network)}>
                  Xóa
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};