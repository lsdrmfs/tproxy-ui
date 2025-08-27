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

echo "Tproxy Stopped"