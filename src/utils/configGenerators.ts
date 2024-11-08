interface IpRoute {
  ip: string;
  wan: number;
}

export const generateBasicConfig = (numMacvlans: number) => {
  return `/interface ethernet
set [ find default-name=ether1 ] name=ether1-wan

/interface macvlan
${Array.from({ length: numMacvlans }, (_, i) => 
  `add interface=ether1-wan name=macvlan${i + 1}`
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

export const generateMangleRules = (numConnections: number) => {
  const connectionMarks = Array.from({ length: numConnections }, (_, i) => 
    `add action=mark-connection chain=prerouting in-interface=ether1-wan new-connection-mark=WAN${i + 1}_conn passthrough=yes per-connection-classifier=both-addresses-and-ports:${numConnections}/${i + 1}`
  );

  const routingMarks = Array.from({ length: numConnections }, (_, i) => 
    `add action=mark-routing chain=prerouting connection-mark=WAN${i + 1}_conn new-routing-mark=WAN${i + 1}`
  );

  return `/ip firewall mangle
${connectionMarks.join('\n')}

${routingMarks.join('\n')}`;
};

export const generateNatRules = (numConnections: number) => {
  return `/ip firewall nat
${Array.from({ length: numConnections }, (_, i) => 
  `add action=masquerade chain=srcnat out-interface=pppoe-out${i + 1}`
).join('\n')}`;
};