let lastConfig = "";

function convert() {
  const url = document.getElementById("vlessInput").value.trim();
  const output = document.getElementById("output");
  const downloadBtn = document.getElementById("downloadBtn");

  if (!url.startsWith("vless://")) {
    output.textContent = "Ошибка: введите ссылку vless://";
    downloadBtn.disabled = true;
    return;
  }

  try {
    const raw = url.replace("vless://", "");
    const parsed = new URL("scheme://" + raw);

    const uuid = parsed.username;
    const server = parsed.hostname;
    const port = parsed.port;
    const name = decodeURIComponent(parsed.hash.substring(1)) || "VLESS-Server";

    const params = new URLSearchParams(parsed.search);
    const pbk = params.get("pbk") || "";
    const sni = params.get("sni") || "";
    const sid = params.get("sid") || "";
    const spx = params.get("spx") || "/";
    const fp  = params.get("fp") || "chrome";
    const flow = params.get("flow") || "";
    const net = params.get("type") || "tcp";

    lastConfig = `mixed-port: 7890
socks-port: 7891
redir-port: 7892
allow-lan: true
mode: global
log-level: info
external-controller: 127.0.0.1:9090

dns:
  enable: true
  use-hosts: true
  enhanced-mode: fake-ip
  fake-ip-range: 198.18.0.1/16
  default-nameserver:
    - 1.1.1.1
    - 8.8.8.8
  nameserver:
    - 1.1.1.1
    - 8.8.8.8
  fake-ip-filter:
    - "*.lan"
    - stun.*.*.*
    - stun.*.*
    - time.windows.com
    - time.nist.gov
    - time.apple.com
    - time.asia.apple.com
    - "*.openwrt.pool.ntp.org"
    - pool.ntp.org
    - ntp.ubuntu.com
    - time1.apple.com
    - time2.apple.com
    - time3.apple.com
    - time4.apple.com
    - time5.apple.com
    - time6.apple.com
    - time7.apple.com
    - time1.google.com
    - time2.google.com
    - time3.google.com
    - time4.google.com
    - api.joox.com
    - joox.com
    - "*.xiami.com"
    - "*.msftconnecttest.com"
    - "*.msftncsi.com"
    - +.xboxlive.com
    - "*.*.stun.playstation.net"
    - xbox.*.*.microsoft.com
    - "*.ipv6.microsoft.com"
    - speedtest.cros.wr.pvp.net

proxies:
  - name: ${name}
    type: vless
    server: ${server}
    port: ${port}
    uuid: ${uuid}
    network: ${net}
    udp: true
    tls: true
    servername: ${sni}
    reality-opts:
      public-key: ${pbk}
      short-id: "${sid}"
      spider-x: ${spx}
    client-fingerprint: ${fp}
    flow: ${flow}
    packet-encoding: xudp

proxy-groups:
  - name: → Remnawave
    type: select
    proxies:
      - ${name}

rules:
  - MATCH,→ Remnawave
`;

    output.textContent = lastConfig;
    downloadBtn.disabled = false;
  } catch (e) {
    output.textContent = "Ошибка: не удалось разобрать ссылку";
    downloadBtn.disabled = true;
  }
}

function downloadConfig() {
  if (!lastConfig) return;

  const blob = new Blob([lastConfig], { type: "text/yaml" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "clash-config.yaml";
  link.click();
}