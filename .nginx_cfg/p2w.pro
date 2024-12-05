server
    { 
        server_name p2w.pro www.p2w.pro;
        charset utf-8;
        root /home/webuser/www/p2w.pro/p2w;
        index index.php index.html index.htm;
        location /
        {
                proxy_pass http://127.0.0.1:4050;
                proxy_set_header Host $host;
                proxy_set_header X-Real-IP $remote_addr;
                proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
                proxy_set_header X-Forwarded-Proto $scheme;
        }
#         location /api {
#               add_header X-Debug-Message "Request received by nginx"; # Добавляем заголовок
#               proxy_pass http://localhost:4000/; # Проверьте адрес и порт!
#               proxy_set_header Host $host;
#               proxy_set_header X-Real-IP $remote_addr;
#               proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
#               proxy_set_header X-Forwarded-Proto $scheme;
#           }
	   location /.well-known/acme-challenge/ {
	   	allow all;
	   }
    listen 443 ssl; # managed by Certbot
    ssl_certificate /etc/letsencrypt/live/p2w.pro/fullchain.pem; # managed by Certbot
    ssl_certificate_key /etc/letsencrypt/live/p2w.pro/privkey.pem; # managed by Certbot
    #include /etc/letsencrypt/options-ssl-nginx.conf; # managed by Certbot
    location /uploads
        {
                proxy_pass http://localhost:4050/api/uploads/;
                proxy_http_version 1.1;
                proxy_set_header Upgrade $http_upgrade;
                proxy_set_header Connection 'upgrade';
                proxy_set_header Host $host;
                proxy_cache_bypass $http_upgrade;
        }
    #ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem; # managed by Certbot

}
server
    { 
    if ($host = p2w.pro) {
        return 301 https://$host$request_uri;
    } # managed by Certbot


        listen *:80;
        server_name p2w.pro www.p2w.pro;
    return 404; # managed by Certbot


}
