# Triển khai Production

## Build

```bash
# Build admin
cd apps/admin
pnpm build

# Build backend
cd apps/backend
pnpm build
```

## Docker

```dockerfile
# Dockerfile cho backend
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3001
CMD ["npm", "start"]
```

## Deployment Options

- Vercel/Netlify cho frontend
- Railway/Render cho backend + DB
- AWS/GCP cho scale

## CI/CD

- GitHub Actions cho build/test
- Auto deploy on push to main
