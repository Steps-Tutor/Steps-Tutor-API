# STEPS Public - Setup Guide

This guide helps you get the STEPS Public AI project up and running locally.

## Prerequisites

Before you start, ensure you have:
- **Node.js** version 18 or higher ([Download](https://nodejs.org/))
- **npm** version 8 or higher (comes with Node.js)
- **OpenAI API Key** ([Get one here](https://platform.openai.com/account/api-keys))

## Installation Steps

### 1. Install Dependencies

```bash
npm install
```

This will install all required NestJS packages and dependencies.

### 2. Configure Environment Variables

Create a `.env` file in the project root (or copy from `.env.example`):

```bash
cp .env.example .env
```

Edit the `.env` file and update the following variables:

```env
# Your OpenAI API configuration
OPENAI_API_URL=https://api.openai.com/v1
OPENAI_API_KEY=sk-your-actual-api-key-here
OPENAI_MODEL_NAME=gpt-4

# Server port (optional, defaults to 3000)
PORT=3001

# Frontend URL for CORS (optional)
SITE_URL=http://localhost:3000
```

### 3. Start the Application

#### Development Mode
```bash
npm run start:dev
```

This will start the server with auto-reload on file changes.

#### Production Mode
```bash
npm run build
npm run start:prod
```

### 4. Verify It's Running

Once started, you should see:
```
[Nest] ... - 01/15/2025, 10:30:00 AM     LOG [NestFactory] Starting Nest application...
...
[Nest] ... - 01/15/2025, 10:30:05 AM     LOG [NestApplication] Nest application successfully started
```

The application will listen on `http://localhost:3001` (or your configured PORT).

## Accessing the API

### Swagger Documentation
Visit `http://localhost:3001/api` to see interactive API documentation.

### Example API Calls

#### 1. Generate Problem Components

```bash
curl -X POST http://localhost:3001/ai/cowrite-problem \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Quadratic Equations",
    "description": "Understanding the quadratic formula",
    "discipline": "Mathematics",
    "statement": "Solve the equation: x² + 5x + 6 = 0"
  }'
```

#### 2. Generate Solution Key

```bash
curl -X POST http://localhost:3001/ai/solution-key \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Quadratic Equations",
    "description": "Understanding the quadratic formula",
    "discipline": "Mathematics",
    "statement": "Solve the equation: x² + 5x + 6 = 0",
    "commonMistakes": "Forgetting to factor properly",
    "additionalInformation": "The equation can be factored",
    "instructorPlan": "Factor first, then solve"
  }'
```

#### 3. Get Chatbot Guidance

```bash
curl -X POST http://localhost:3001/ai/planning-response \
  -H "Content-Type: application/json" \
  -d '{
    "problem": {
      "id": "123",
      "discipline": "Mathematics",
      "title": "Quadratic Equations",
      "description": "Understanding the quadratic formula",
      "statement": "Solve the equation: x² + 5x + 6 = 0",
      "essentialConcepts": "Factoring, roots",
      "conceptsConnection": "Factoring helps find roots",
      "assumptions": "Real roots exist",
      "commonMistakes": "Sign errors",
      "additionalInformation": "The discriminant is positive",
      "instructorPlan": "Factor and solve"
    },
    "studentMessage": "How do I start solving this?"
  }'
```

## Development Commands

### Code Linting
```bash
npm run lint
```

### Code Formatting
```bash
npm run format
```

### Running Tests
```bash
npm run test
npm run test:watch
npm run test:cov
```

### Building for Production
```bash
npm run build
```

The build output will be in the `dist/` directory.

## Troubleshooting

### Issue: "Cannot find module '@nestjs/core'"
**Solution**: Ensure all dependencies are installed:
```bash
npm install
```

### Issue: "OPENAI_API_KEY is missing"
**Solution**: Make sure you've created the `.env` file and set `OPENAI_API_KEY`:
```bash
cat .env | grep OPENAI_API_KEY
```

### Issue: "OpenAI API error: 401 Unauthorized"
**Solution**: Your API key is invalid or expired. Get a new one from https://platform.openai.com/account/api-keys

### Issue: "Port 3001 is already in use"
**Solution**: Change the PORT in your `.env` file or kill the process using that port.

## Project Structure

```
steps-public/
├── src/
│   ├── modules/
│   │   ├── ai/              # AI service and controller
│   │   └── prompts/         # Prompt management
│   ├── common/              # Shared utilities and filters
│   ├── app.module.ts        # Application root module
│   └── main.ts              # Application entry point
├── dist/                    # Compiled output (created after build)
├── .env                     # Environment variables (local)
├── .env.example             # Environment template
├── package.json
├── README.md
└── tsconfig.json
```

## Next Steps

1. **Explore the API**: Visit http://localhost:3001/api
2. **Read the README**: Check [README.md](./README.md) for detailed documentation
3. **Review the Code**: Start with `src/modules/ai/ai.controller.ts` to understand the API endpoints
4. **Integrate with Frontend**: Use the APIs in your frontend application

## Support

For issues or questions:
1. Check the [README.md](./README.md) for detailed documentation
2. Review error messages in the console
3. Ensure all environment variables are properly set
4. Check OpenAI API status at https://status.openai.com/

## Additional Resources

- [NestJS Documentation](https://docs.nestjs.com/)
- [OpenAI API Documentation](https://platform.openai.com/docs/)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
