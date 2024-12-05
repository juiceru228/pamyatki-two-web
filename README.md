# What is that?
Simple forum
# Why?
Why not?
# Requirements
- Docker.
# How to
In the root directory, where docker-compose.yml, in the terminal write the following:<br />
```console
docker-compose up -d
```
Copy nginx_cfg file to the nginx path: /etc/nginx/sites-available/p2w.pro by command:<br />
```console
sudo cp .nginx_cfg/p2w.pro /etc/nginx/sites-available/p2w.pro
```
Then create certs:
```console
sudo certbot certonly --standalone --agree-tos --email EMAIL -d DOMAIN
```
And finaly:
```console
sudo systemctl start nginx
```
# Enjoy!
**LINKs**:
- Client: http://127.0.0.1:25252;
- Server: http://127.0.0.1:4000;
- All: https://DOMAIN.
