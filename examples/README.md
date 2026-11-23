# API examples

Copyable clients for every public AI endpoint, plus thin demos that call them.

## Copy into your project

| Language | Copy these files |
|----------|------------------|
| TypeScript | [`typescript/src/client.ts`](./typescript/src/client.ts) + [`typescript/src/types.ts`](./typescript/src/types.ts) |
| Python | [`python/src/client.py`](./python/src/client.py) + [`python/src/api_types.py`](./python/src/api_types.py) |

Example usage after copying:

```ts
import { planningTutor } from './client.js';

const result = await planningTutor('http://localhost:3001', {
  problem: { /* ... */ },
  studentMessage: 'Where do I start?',
});

if (result.success) {
  console.log(result.data.chatbotResponse);
}
```

```python
from client import planning_tutor

result = planning_tutor("http://localhost:3001", {
    "problem": { ... },  # see fixtures/planning-tutor.request.json
    "studentMessage": "Where do I start?",
})

if result.get("success"):
    print(result["data"]["chatbotResponse"])
```

## Prerequisites

1. Start the NestJS server with a valid `OPENAI_API_KEY` in `.env`.
2. Default base URL is `http://localhost:3001`. Override with `BASE_URL` if needed.

Interactive docs: `/api` (Swagger).

## Endpoints

| Method | Path | Client function | Fixture |
|--------|------|-----------------|---------|
| `POST` | `/ai/cowrite-problem` | `cowriteProblem` / `cowrite_problem` | [`fixtures/cowrite-problem.request.json`](./fixtures/cowrite-problem.request.json) |
| `POST` | `/ai/planning-response` | `planningTutor` / `planning_tutor` | [`fixtures/planning-tutor.request.json`](./fixtures/planning-tutor.request.json) |

## Run demos

### TypeScript

```bash
cd examples/typescript
npm install
npm run cowrite-problem
npm run planning-tutor
```

### Python

```bash
cd examples/python
pip install -r requirements.txt
python src/cowrite_problem.py
python src/planning_tutor.py
```
