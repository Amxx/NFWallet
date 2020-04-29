#!/bin/#!/usr/bin/env bash

graph deploy --debug --node https://api.thegraph.com/deploy/ --ipfs https://api.thegraph.com/ipfs/ amxx/non-fungible-wallets-ropsten subgraph.ropsten.yaml &&
graph deploy --debug --node https://api.thegraph.com/deploy/ --ipfs https://api.thegraph.com/ipfs/ amxx/non-fungible-wallets-rinkeby subgraph.rinkeby.yaml &&
graph deploy --debug --node https://api.thegraph.com/deploy/ --ipfs https://api.thegraph.com/ipfs/ amxx/non-fungible-wallets-goerli  subgraph.goerli.yaml  &&
graph deploy --debug --node https://api.thegraph.com/deploy/ --ipfs https://api.thegraph.com/ipfs/ amxx/non-fungible-wallets-kovan   subgraph.kovan.yaml   &&
echo 'done.'
