# WatchAsset

WatchAsset API with SSO authentication integration.

## Setup

### Prerequisites
- Node.js 18+ 
- npm

### Installation

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables:
```bash
cp .env.example .env
```

3. Edit `.env` and set your SSO credentials:
```env
SSO_CLIENT_SECRET=your_actual_client_secret_here
```

**Important:** The `SSO_CLIENT_SECRET` must match the client secret configured in your SSO provider (running on `http://localhost:3000` by default). The error "invalid_client" means the client secret is incorrect or not set.

### Development

Start the development server:
```bash
npm run dev
```

The API will be available at `http://localhost:3001`

### Frontend Development

To run the frontend in development mode:

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install frontend dependencies:
```bash
npm install
```

3. Start the frontend development server:
```bash
npm run dev
```

The frontend will be available at `http://localhost:3000`

### Build

Build the TypeScript code:
```bash
npm run build
```

### Production

Start the production server:
```bash
npm start
```

## Environment Variables

See `.env.example` for all required environment variables:

- `PORT` - Server port (default: 3001)
- `FRONTEND_URL` - Frontend URL for redirects (default: http://localhost:3000)
- `SSO_BASE_URL` - SSO server URL (default: http://localhost:3000)
- `SSO_CLIENT_ID` - OAuth client ID (default: watch-asset-app)
- `SSO_CLIENT_SECRET` - OAuth client secret (**required**)
- `SSO_REDIRECT_URI` - OAuth redirect URI (default: http://localhost:3001/auth/callback)

## API Endpoints

- `GET /health` - Health check endpoint
- `GET /auth/login` - Initiate SSO login
- `GET /auth/callback` - SSO callback endpoint

## Troubleshooting

### "invalid_client" error

This error occurs when the `SSO_CLIENT_SECRET` environment variable is not set or doesn't match the client secret configured in your SSO provider.

**Solution:**
1. Ensure you have a `.env` file in the project root
2. Set `SSO_CLIENT_SECRET` to the correct value from your SSO provider
3. Restart the server
