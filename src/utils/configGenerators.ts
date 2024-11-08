interface IpRoute {
  ip: string;
  wan: number;
}

export const generateBasicConfig = (numMacvlans: number, ethernetInterface: string) => {
  return `/interface ethernet
set [ find default-name=${ethernetInterface} ] name=${ethernetInterface}-wan

/interface macvlan
${Array.from({ length: numMacvlans }, (_, i) => 
  `add interface=${ethernetInterface}-wan name=macvlan${i + 1}`
).join('\n')}`;
};

export const generatePPPoEConfig = (numConnections: number, username: string, password: string) => {
  return `/interface pppoe-client
${Array.from({ length: numConnections }, (_, i) => 
  `add add-default-route=no interface=macvlan${i + 1} name=pppoe-out${i + 1} user="${username}" password="${password}" disabled=no`
).join('\n')}`;
};

export const generateIpRouting = (numConnections: number, ipRoutes: IpRoute[]) => {
  const mainTable = Array.from({ length: numConnections }, (_, i) => 
    `add check-gateway=ping distance=${i + 1} gateway=pppoe-out${i + 1} routing-mark=to_wan${i + 1}`
  );

  const customRoutes = ipRoutes.map(route => 
    `add distance=1 dst-address=${route.ip} gateway=pppoe-out${route.wan}`
  );

  const loadBalancingRoutes = Array.from({ length: numConnections }, (_, i) => 
    `add check-gateway=ping distance=${i + 1} gateway=pppoe-out${i + 1}`
  );

  return `/ip route
${mainTable.join('\n')}
${customRoutes.length > 0 ? '\n' + customRoutes.join('\n') : ''}

# Load Balancing Routes
${loadBalancingRoutes.join('\n')}`;
};

export const generateMangleRules = (numConnections: number, lanNetworks: string[]) => {
  const lanAcceptRules = lanNetworks.map(network => 
    `add action=accept chain=prerouting src-address=${network}`
  );

  const markConnections = Array.from({ length: numConnections }, (_, i) => 
    `add action=mark-connection chain=prerouting new-connection-mark=wan${i + 1}_conn passthrough=yes per-connection-classifier=both-addresses-and-ports:${numConnections}/${i + 1}`
  );

  const markRouting = Array.from({ length: numConnections }, (_, i) => 
    `add action=mark-routing chain=prerouting connection-mark=wan${i + 1}_conn new-routing-mark=to_wan${i + 1}`
  );

  return `/ip firewall mangle
${lanAcceptRules.join('\n')}

# Connection Classification
${markConnections.join('\n')}

# Routing Marks
${markRouting.join('\n')}`;
};

export const generateNatRules = (numConnections: number, portForwardIps: string[]) => {
  const masqueradeRules = Array.from({ length: numConnections }, (_, i) => 
    `add action=masquerade chain=srcnat out-interface=pppoe-out${i + 1}`
  );

  const portForwardRules = portForwardIps.map(ip => 
    `add action=dst-nat chain=dstnat dst-address=${ip} protocol=tcp to-addresses=${ip}`
  );

  return `/ip firewall nat
# Masquerade Rules for Load Balancing
${masqueradeRules.join('\n')}

${portForwardRules.length > 0 ? '# Port Forwarding Rules\n' + portForwardRules.join('\n') : ''}`;
};