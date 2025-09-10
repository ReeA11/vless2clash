let lastConfig = "";

function updateStatus(type, message) {
  const indicator = document.getElementById("statusIndicator");
  const statusClass = type === 'success' ? 'status-success' : 'status-error';

  indicator.innerHTML = `
    <div class="status-message ${statusClass}">
      <div class="status-dot"></div>
      ${message}
    </div>
  `;

  setTimeout(() => {
    indicator.innerHTML = '';
  }, 5000);
}

function convert() {
  const url = document.getElementById("vlessInput").value.trim();
  const output = document.getElementById("output");
  const downloadBtn = document.getElementById("downloadBtn");

  if (!url) {
    output.className = "output-placeholder";
    output.textContent = "# Enter VLESS link to start conversion\n# Your Clash.Meta configuration will appear here\n# \n# ┌─ Ready to convert ─┐\n# │                    │\n# │  Paste VLESS URL   │\n# │  in the sidebar    │\n# │                    │\n# └────────────────────┘";
    downloadBtn.disabled = true;
    updateStatus('error', 'Please enter VLESS link');
    return;
  }

  if (!url.startsWith("vless://")) {
    output.className = "output-placeholder";
    output.textContent = "# Error: Please enter a valid vless:// link\n# \n# ┌─ Invalid format ─┐\n# │                  │\n# │   Check your     │\n# │   VLESS URL      │\n# │                  │\n# └──────────────────┘";
    downloadBtn.disabled = true;
    updateStatus('error', 'Incorrect link format');
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
  - name: → VLESS
    type: select
    proxies:
      - ${name}

rules:
  - MATCH,→ VLESS
`;

    output.className = "output-result";
    output.textContent = lastConfig;
    downloadBtn.disabled = false;
    updateStatus('success', 'Configuration successfully created!');
  } catch (e) {
    output.className = "output-placeholder";
    output.textContent = "# Error: Failed to parse VLESS link\n# Check the format is correct\n# \n# ┌─ Parse error ─┐\n# │               │\n# │   Check URL   │\n# │   format      │\n# │               │\n# └───────────────┘";
    downloadBtn.disabled = true;
    updateStatus('error', 'Failed to process link');
  }
}

function downloadConfig() {
  if (!lastConfig) return;

  const blob = new Blob([lastConfig], { type: "text/yaml" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "clash-config.yaml";
  link.click();

  updateStatus('success', 'Configuration file loaded!');
}

// Auto-convert on paste
document.addEventListener('DOMContentLoaded', function() {
  const vlessInput = document.getElementById('vlessInput');
  if (vlessInput) {
    vlessInput.addEventListener('paste', function() {
      setTimeout(() => {
        if (this.value.startsWith('vless://')) {
          convert();
        }
      }, 100);
    });
  }
});