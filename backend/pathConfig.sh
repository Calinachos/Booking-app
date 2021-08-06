#!/bin/bash
sudo echo "export GOROOT=/usr/local/go"  >> $HOME/.profile
sudo echo "export GOPATH=$HOME/go"  >> $HOME/.profile
sudo echo "export PATH=$GOPATH/bin:$GOROOT/bin:$PATH"  >> $HOME/.profile
source $HOME/.profile
