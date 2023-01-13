# Vultr.com > Products > Marketplace App > LAMP Ubuntu 20.04 > DEPLOY

## Firewall CMD
### first: https://github.com/kollein/payment-backend#install-firewall-cmd-httpscomputingforgeekscominstall-and-use-firewalld-on-ubuntu

## User
### first: https://github.com/kollein/payment-backend#in-order-to-use-github-action-runner-we-will-create-a-group-with-rwx-permissions-then-create-a-user-to-be-added-to-that-group-for-executing-the-commands-on-vps

```
vinhadmin
Lovelymonster!23
```

## Nodejs:
```
cd ~
```
```
wget -qO- https://raw.githubusercontent.com/creationix/nvm/v0.39.0/install.sh | bash
source ~/.profile
```
```
nvm install v12.22.12
```

## MongoDB
https://www.digitalocean.com/community/tutorials/how-to-install-mongodb-on-ubuntu-20-04
### download
```
curl -fsSL https://www.mongodb.org/static/pgp/server-4.4.asc | sudo apt-key add -
```
### check download
```
apt-key list
```
```
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/4.4 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-4.4.list
```
### install
```
sudo apt update
```
```
sudo apt install mongodb-org
```
### check database connection
```
sudo systemctl start mongod.service

sudo systemctl status mongod

sudo systemctl enable mongod

mongo --eval 'db.runCommand({ connectionStatus: 1 })'
```

## Domain under the specific port in Apache 2
### first: https://github.com/kollein/payment-backend#create-apache2-config-domain

### example: klg86.com will serve the port 3000
```
<VirtualHost *:80> 
  ProxyPreserveHost On
  ProxyRequests Off
  ServerName www.klg86.com
  ServerAlias klg86.com
  ProxyPass / http://localhost:3000/
  ProxyPassReverse / http://localhost:3000/
</VirtualHost>
```
### enable modules
```
sudo a2enmod proxy && sudo a2enmod proxy_http && sudo service apache2 restart
```

### SSL: https://github.com/kollein/payment-backend#install-lets-encrypt-ssl

## Config
### App
Open:
```
public/web/src/project.js
public/admin/src/project.js
```
Find: 
```
this.connect("127.0.0.1",
```
Change to:
```
this.connect("klg86.com:3000",
```