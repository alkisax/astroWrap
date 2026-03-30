### προσθήκη nginx
```nginx
# Biased Tarot → /biased-tarot
location /biased-tarot/ {
  rewrite ^/biased-tarot(/.*)$ $1 break;
  proxy_pass http://localhost:3011;
  proxy_http_version 1.1;
  proxy_set_header Upgrade $http_upgrade;
  proxy_set_header Connection 'upgrade';
  proxy_set_header Host $host;
  proxy_cache_bypass $http_upgrade;
}
```

### hetzner cmd
```bash
cd /var/www
mkdir biased-tarot
cd biased-tarot
git clone git@github.com:alkisax/revistedTarotBiasApp.git .
# ή git pull origin main
cd /var/www/biased-tarot/frontend
npm install
nano .env
npm run build
cd ../backend
npm install
nano .env
pm2 start server.js --name biased-tarot
pm2 save
# ή pm2 restart biased-tarot --update-env
curl http://localhost:3011
cat /etc/nginx/sites-available/portfolio-projects.space
nano /etc/nginx/sites-available/portfolio-projects.space
nginx -t
systemctl reload nginx
```

```bash
cd /var/www/biased-tarot && git pull origin main && cd frontend && npm install --legacy-peer-deps && npm run build && cd ../backend && npm install && pm2 restart biased-tarot && sleep 2 && curl -s https://portfolio-projects.space/biased-tarot/ | head -n 5 && echo "✓ biased-tarot deploy OK"
```


pm2 flush biased-tarot
pm2 logs biased-tarot --lines 50