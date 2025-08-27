chmod -R 777 /usr/bin/tproxy
chmod -R 777 /root
# netstat -tulnp

#!/bin/sh
clear
killall tproxy

# Filer
rm -f /etc/nftables.d/Tproxy.nft
rm -rf /etc/xd

# Router
nft delete table ip nft_tproxy
ip -4 rule del fwmark 8 table 8
ip -4 route flush table 8

# Nftable
cat > /etc/nftables.d/Tproxy.nft << EOF
#!/usr/sbin/nft -f
table ip nft_tproxy {
    chain pre_tproxy {
        type filter hook prerouting priority mangle; policy accept
        meta l4proto {tcp,udp} th dport {22,77} accept
        meta l4proto udp th dport 53 tproxy to :88 meta mark set 8 accept
        ip daddr {10.0.0.0/8,127.0.0.0/8,192.168.0.0/16,224.0.0.0/3} accept
        meta l4proto {tcp,udp} tproxy to :88 meta mark set 8 accept
    }
}
EOF
chmod 777 /etc/nftables.d/Tproxy.nft

# Router
nft -f /etc/nftables.d/Tproxy.nft
ip -4 rule add fwmark 8 table 8
ip -4 route add local default dev lo table 8

echo "Tproxy Starting"

# Start
tproxy run -c "/root/t.json"