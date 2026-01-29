# Setup Development

## Prerequisites

- Node.js 18+
- pnpm
- MongoDB (local hoặc Atlas)

## Installation

```bash
# Clone repo
git clone <repo-url>
cd prj-aloha-v17

# Install dependencies
pnpm install

# Setup MongoDB
# Tạo database 'aloha'

# Run admin
cd apps/admin
pnpm dev

# Run backend (khi có)
cd apps/backend
pnpm dev
```

## Environment Variables

```env
MONGODB_URI=mongodb://localhost:27017/aloha
JWT_SECRET=your-secret
```
