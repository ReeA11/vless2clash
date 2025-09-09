#!/usr/bin/env python3
import sys
import urllib.parse as urlparse

BASE_CONFIG = """mixed-port: 7890
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
"""

def vless_to_clash(vless_url: str) -> str:
    # Убираем vless://
    raw = vless_url.replace("vless://", "")

    # Парсим ссылку
    parsed = urlparse.urlparse("scheme://" + raw)
    uuid, server = parsed.username, parsed.hostname
    port = parsed.port
    name = parsed.fragment if parsed.fragment else "VLESS-Server"

    # query-параметры
    params = urlparse.parse_qs(parsed.query)

    pbk = params.get("pbk", [""])[0]
    sni = params.get("sni", [""])[0]
    sid = params.get("sid", [""])[0]
    spx = params.get("spx", [""])[0]
    fp  = params.get("fp", ["chrome"])[0]
    flow = params.get("flow", [""])[0]
    net = params.get("type", ["tcp"])[0]

    # Прокси-блок
    proxy_block = f"""proxies:
  - name: {name}
    type: vless
    server: {server}
    port: {port}
    uuid: {uuid}
    network: {net}
    udp: true
    tls: true
    servername: {sni}
    reality-opts:
      public-key: {pbk}
      short-id: "{sid}"
      spider-x: {spx if spx else "/"}
    client-fingerprint: {fp}
    flow: {flow}
    packet-encoding: xudp
"""

    # Proxy-group и rules
    groups_rules = f"""
proxy-groups:
  - name: → Remnawave
    type: select
    proxies:
      - {name}

rules:
  - MATCH,→ Remnawave
"""

    return BASE_CONFIG + "\n" + proxy_block + groups_rules


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python vless2clash.py <vless://...>")
        sys.exit(1)

    vless_url = sys.argv[1]
    print(vless_to_clash(vless_url))