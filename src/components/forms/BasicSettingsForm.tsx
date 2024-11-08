import { Input } from "@/components/ui/input";

interface BasicSettingsFormProps {
  numConnections: number;
  setNumConnections: (value: number) => void;
  numMacvlans: number;
  setNumMacvlans: (value: number) => void;
  ethernetInterface: string;
  setEthernetInterface: (value: string) => void;
  username: string;
  setUsername: (value: string) => void;
  password: string;
  setPassword: (value: string) => void;
}

export const BasicSettingsForm = ({
  numConnections,
  setNumConnections,
  numMacvlans,
  setNumMacvlans,
  ethernetInterface,
  setEthernetInterface,
  username,
  setUsername,
  password,
  setPassword,
}: BasicSettingsFormProps) => {
  return (
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
    </div>
  );
};