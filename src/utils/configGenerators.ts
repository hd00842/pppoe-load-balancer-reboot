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
  const defaultRoutes = Array.from({ length: numConnections }, (_, i) => 
    `add check-gateway=ping distance=1 gateway=pppoe-out${i + 1} routing-mark=WAN${i + 1}`
  );

  const customRoutes = ipRoutes.map(route => 
    `add distance=1 dst-address=${route.ip} gateway=pppoe-out${route.wan}`
  );

  return `/ip route
${defaultRoutes.join('\n')}
${customRoutes.length > 0 ? '\n' + customRoutes.join('\n') : ''}`;
};

export const generateMangleRules = (numConnections: number, lanNetworks: string[]) => {
  const connectionMarks = Array.from({ length: numConnections }, (_, i) => 
    `add action=mark-connection chain=prerouting in-interface=ether1-wan new-connection-mark=WAN${i + 1}_conn passthrough=yes per-connection-classifier=both-addresses-and-ports:${numConnections}/${i + 1}`
  );

  const routingMarks = Array.from({ length: numConnections }, (_, i) => 
    `add action=mark-routing chain=prerouting connection-mark=WAN${i + 1}_conn new-routing-mark=WAN${i + 1}`
  );

  const lanAcceptRules = lanNetworks.map(network => 
    `add action=accept chain=prerouting src-address=${network}`
  );

  return `/ip firewall mangle
${lanAcceptRules.join('\n')}

${connectionMarks.join('\n')}

${routingMarks.join('\n')}`;
};

export const generateNatRules = (numConnections: number, portForwardIps: string[]) => {
  const masqueradeRules = Array.from({ length: numConnections }, (_, i) => 
    `add action=masquerade chain=srcnat out-interface=pppoe-out${i + 1}`
  );

  const portForwardRules = portForwardIps.map(ip => 
    `add action=dst-nat chain=dstnat dst-address=${ip} protocol=tcp to-addresses=${ip}`
  );

  return `/ip firewall nat
${masqueradeRules.join('\n')}

${portForwardRules.length > 0 ? portForwardRules.join('\n') : ''}`;
};