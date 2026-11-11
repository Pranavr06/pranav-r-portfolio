# 🛡️ Hardened Nginx Reverse Proxy Architecture

A high-performance, security-hardened **Nginx Reverse Proxy** tailored for the **Pranav R Full-Stack Next.js Portfolio & CMS Platform**.

This reverse proxy sits in front of the Next.js application, intercepting all inbound web traffic to provide robust network-level defense, automated SSL/TLS termination, distributed denial-of-service (DDoS) mitigation, and aggressive static asset caching.

---

## 🌟 Security Features & Protections

| Security Layer | Implementation & Protection |
| :--- | :--- |
| **Information Disclosure Prevention** | `server_tokens off;` and `proxy_hide_header X-Powered-By;` strip internal server versions and framework identifiers (Next.js, Node.js, Express) from response headers. |
| **HTTP Security Headers** | Injects `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `X-XSS-Protection: 1; mode=block`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy`, and modern `Content-Security-Policy (CSP)`. |
| **HSTS (Strict-Transport-Security)** | Enforces HTTPS with `max-age=63072000; includeSubDomains; preload` for two-year defense against SSL stripping and man-in-the-middle attacks. |
| **Modern TLS/SSL Hardening** | Limits protocols to **TLSv1.2** and **TLSv1.3** only. Configured with Mozilla-recommended forward-secrecy ECDHE cipher suites, OCSP stapling, and SSL session caching. |
| **Multi-Tier Rate Limiting** | **General traffic:** 20 req/s with burst of 30.<br>**Dynamic API routes (`/api/`):** 5 req/s with burst of 10.<br>**Admin Authentication (`/admin/login`):** 2 req/s with burst of 5 to stop brute-force attacks. Returns `429 Too Many Requests`. |
| **Slowloris & Buffer Overflow Mitigation** | Strict buffer ceilings (`client_body_buffer_size 128k`, `client_header_buffer_size 2k`) and timeouts (`client_body_timeout 10s`, `client_header_timeout 10s`, `send_timeout 10s`) prevent attackers from exhausting server connection pools. |
| **Exploit & Bot Probing Mitigation** | Instantly denies hidden dot-files (`.git`, `.env`, `.htaccess`), sensitive extensions (`.sql`, `.bak`, `.log`), and common CMS scanner probes (`wp-admin`, `phpmyadmin`, `cgi-bin`). |
| **High-Performance Asset Caching** | Direct cache headers for Next.js immutable build files (`/_next/static/` 1-year cache), public portfolio graphics (`/assets/` 30-day cache), and AI discovery files (`/llms.txt`). |

---

## 📁 Configuration Directory Structure

```text
nginx/
├── nginx.conf                         # Main global Nginx configuration (event loop, rate limit zones, gzip)
├── conf.d/
│   └── pranavr-portfolio.conf         # Virtual host server block (Port 80 redirect & Port 443 SSL proxy)
├── snippets/
│   ├── block-exploits.conf            # Exploit mitigation & bot scanner blocker rules
│   ├── proxy-params.conf              # Upstream proxy headers, real IP forwarding, & WebSockets
│   ├── security-headers.conf          # HTTP defense-in-depth security headers
│   └── ssl-params.conf                # Mozilla modern TLS 1.2/1.3 cipher suite parameters
├── ssl/                               # Directory for production SSL certificates (fullchain.pem, privkey.pem)
├── generate-ssl.sh                    # Helper script to generate temporary self-signed dev certificates
└── README.md                          # This architecture and deployment manual
```

---

## 🚀 Deployment Options

### Option A: Deployment via Docker Compose (Recommended)

1. **Place your SSL certificates** in `nginx/ssl/`:
   ```bash
   # Files needed:
   # nginx/ssl/fullchain.pem
   # nginx/ssl/privkey.pem
   ```
   *(For testing locally without production certs, run `./nginx/generate-ssl.sh` to generate self-signed dev certificates).*

2. **Ensure your environment file is configured**:
   ```bash
   cp .env.example .env.local
   # Populate with your Supabase credentials
   ```

3. **Start the multi-container stack**:
   ```bash
   docker compose up -d --build
   ```

4. **Verify the services are running**:
   ```bash
   docker compose ps
   docker compose logs -f nginx
   ```

---

### Option B: Deployment on Standalone Linux Server (Ubuntu / Debian / VPS / EC2)

1. **Install Nginx**:
   ```bash
   sudo apt update && sudo apt install nginx -y
   ```

2. **Copy the configuration files**:
   ```bash
   sudo cp nginx/nginx.conf /etc/nginx/nginx.conf
   sudo cp -r nginx/snippets /etc/nginx/
   sudo cp nginx/conf.d/pranavr-portfolio.conf /etc/nginx/conf.d/
   ```

3. **Update upstream IP in `/etc/nginx/nginx.conf`**:
   Change `server nextjs:3000;` to:
   ```nginx
   upstream nextjs_upstream {
       server 127.0.0.1:3000;
       keepalive 64;
   }
   ```

4. **Obtain Free SSL Certificate via Let's Encrypt Certbot**:
   ```bash
   sudo apt install certbot python3-certbot-nginx -y
   sudo certbot --nginx -d pranavr.in -d www.pranavr.in
   ```

5. **Test and reload Nginx**:
   ```bash
   sudo nginx -t
   sudo systemctl reload nginx
   ```

6. **Run Next.js with PM2**:
   ```bash
   npm run build
   pm2 start npm --name "pranavr-portfolio" -- start
   pm2 save
   pm2 startup
   ```

---

## 🔍 Verification & Security Auditing

### 1. Test Nginx Configuration Syntax
```bash
nginx -t
```

### 2. Verify Security Headers
```bash
curl -I https://localhost/
```
Expected output includes:
```http
HTTP/2 200
server: nginx
x-frame-options: DENY
x-content-type-options: nosniff
x-xss-protection: 1; mode=block
referrer-policy: strict-origin-when-cross-origin
strict-transport-security: max-age=63072000; includeSubDomains; preload
```
*(Notice that `x-powered-by` is completely hidden).*

### 3. Verify Rate Limiting
Run 10 rapid concurrent curl calls against the API:
```bash
for i in {1..15}; do curl -I https://localhost/api/contact; done
```
Requests exceeding the rate limit threshold will receive `HTTP/2 429 Too Many Requests`.
