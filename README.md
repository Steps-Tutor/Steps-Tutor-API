# STEPS-Tutor API

Open-source API for bringing [STEPS](https://steps.stanford.edu/) (Science Tutor for Effective Problem Solving) tutoring into your own courses and learning platforms.

The STEPS-Tutor API supports:
- running STEPS tutoring sessions from your own tools,
- creating, adapting and managing problems,
- self-hosting with your own OpenAI API key.

Built with Node.js and TypeScript. You run it on your own machine or server, either directly or with Docker.

**Quick start:** follow [Running With Docker](#running-with-docker) (no Node.js needed) or [Running Locally](#running-locally). Either way, the API runs at `http://localhost:3001` and Swagger UI is at `http://localhost:3001/api`.

## Table Of Contents

- [Why STEPS-Tutor API](#why-steps-tutor-api)
- [Core Features](#core-features)
- [How It Works](#how-it-works)
- [Prerequisites](#prerequisites)
- [Environment Variables](#environment-variables)
- [Running With Docker](#running-with-docker)
- [Running Locally](#running-locally)
- [Endpoints Overview](#endpoints-overview)
- [Examples](#examples)
- [Errors](#errors)
- [Data And Privacy](#data-and-privacy)
- [Troubleshooting](#troubleshooting)
- [Getting Help](#getting-help)
- [Contributing](#contributing)
- [Security](#security)
- [Roadmap](#roadmap)
- [License](#license)

## Why STEPS-Tutor API

[STEPS](https://steps.stanford.edu/) is a Stanford University platform from the Ideal Learning Lab. Its tutor guides students through planning, checking and reflecting on their solutions, so they learn how to solve problems rather than just reach the right answer.

The STEPS-Tutor API is designed for:
- **Instructors and course teams** who want STEPS-style tutoring inside their own course materials or tools,
- **LMS and ed-tech platforms** that want to offer STEPS tutoring to their users.

<!-- TODO: Add a sentence or two on why the API exists, e.g. what it makes possible beyond the STEPS web app. -->

Learn more about the STEPS project at **https://steps.stanford.edu/**.

## Core Features

- **Planning tutor**
  - Send a problem, the student's latest message, and the conversation so far. The API returns the next tutor turn: a short question that helps the student build their own plan, without solving the problem for them.
  - The response also reports whether the plan is complete, the current planning phase, and how many attempts the student has made on the current question.
  - Endpoint: `POST /ai/planning-response`

- **Problem co-writing**
  - Send a title, description, discipline, and problem statement. The API returns the components an instructor uses to set up that problem: essential concepts, how those concepts connect, assumptions, common mistakes, extra information, and a step-by-step instructor plan.
  - Nothing is stored. Your application keeps the result and sends those fields back on later planning requests.
  - Endpoint: `POST /ai/cowrite-problem`

- **Bring your own OpenAI key**
  - The API uses your OpenAI key to process requests, so you control your own usage and costs.

## How It Works

- You download this repository and run the API yourself.
- The API needs no API key or account of its own.
- Requests that need AI processing are sent to OpenAI using **your** OpenAI API key, which you set in a `.env` file.
- Nothing is stored by the API itself; it only needs your OpenAI key to run.

- **Default address**: `http://localhost:3001` when `PORT=3001` (the value in `.env.example`). If `PORT` is unset, the process listens on port 3000.
- **Format**: JSON request and response bodies

## Prerequisites

Before running the API, make sure you have:

- An OpenAI API key ([OpenAI account](https://platform.openai.com/) with billing set up)
- **For Docker:** [Docker](https://www.docker.com/) 24 or later (Docker Desktop on macOS and Windows includes this)
- **To run directly:** Node.js 22 or later, and npm 10 or later
- **On Windows:** run the commands in this README from Git Bash or WSL. They are written for a Unix-style shell and some do not work in PowerShell or Command Prompt.

## Environment Variables

Copy the example file and fill in your values:

```bash
cp .env.example .env
```

The process reads these variables. `OPENAI_API_KEY` and `OPENAI_MODEL_NAME` are required for AI requests. The server can start without them; those requests then fail.

```bash
# Required for AI requests. Your OpenAI key.
OPENAI_API_KEY=sk-...

# Required for AI requests. Model sent to OpenAI.
OPENAI_MODEL_NAME=gpt-5.2

# Optional. Defaults to the OpenAI API. Set this for Azure OpenAI or another compatible endpoint.
OPENAI_API_URL=https://api.openai.com/v1

# Optional. Port the process listens on inside the container and, when you run Node directly, on your machine.
# .env.example uses 3001. If this is unset, the process listens on 3000.
PORT=3001
```

Never commit your `.env` file or share your OpenAI key in a GitHub issue.

## Running With Docker

These steps build a local image with the Docker CLI and run it on your machine. Configuration is passed when the container starts, from your `.env` file. The key is not written into the image.

From the repository root:

### 1. Create your env file

```bash
cp .env.example .env
```

Edit `.env` and set `OPENAI_API_KEY` to your key. Leave `PORT=3001` unless you want a different port. If you change `PORT`, use that same port in the `-p` flag below (`-p <PORT>:<PORT>`).

### 2. Build the image

```bash
docker build -t steps-tutor-api:local .
```

This compiles the API inside the image. Rebuild with the same command after you change the source.

### 3. Run the container

Foreground (logs in this terminal; Ctrl+C stops and removes the container):

```bash
docker run --rm --init -p 3001:3001 --env-file .env --name steps-tutor-api steps-tutor-api:local
```

Keep `--init`. Without it, Ctrl+C does not stop the container.

Detached:

```bash
docker run -d --init -p 3001:3001 --env-file .env --name steps-tutor-api steps-tutor-api:local
docker logs -f steps-tutor-api
```

The API is at `http://localhost:3001`. Swagger UI is at `http://localhost:3001/api`.

### 4. Test it

Wait until the logs include `Nest application successfully started`.

Swagger (no OpenAI call). A `200` means the container is serving:

```bash
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3001/api
```

Request validation (no OpenAI call). An empty body should return `400`:

```bash
curl -s -o /dev/null -w "%{http_code}\n" \
  -X POST http://localhost:3001/ai/cowrite-problem \
  -H "Content-Type: application/json" \
  -d '{}'
```

Co-write a problem (calls OpenAI with your key):

```bash
curl -s -X POST http://localhost:3001/ai/cowrite-problem \
  -H "Content-Type: application/json" \
  -d @examples/fixtures/cowrite-problem.request.json
```

Planning tutor (calls OpenAI with your key):

```bash
curl -s -X POST http://localhost:3001/ai/planning-response \
  -H "Content-Type: application/json" \
  -d @examples/fixtures/planning-tutor.request.json
```

A successful AI response is JSON with `success: true`, `status: 200`, and a `data` object.

Container health, as reported by Docker:

```bash
docker ps --filter name=steps-tutor-api
```

The `STATUS` column shows `healthy` after the first successful check against `/api`.

### 5. Stop the container

If you started it in the foreground, press Ctrl+C. If `docker ps` still lists `steps-tutor-api` afterwards (for example, it was started without `--init`), run `docker stop steps-tutor-api`.

If you started it detached:

```bash
docker stop steps-tutor-api
docker rm steps-tutor-api
```

Remove the local image when you no longer need it:

```bash
docker rmi steps-tutor-api:local
```

## Running Locally

1) Install dependencies

```bash
npm install
```

2) Set up your `.env` file (see [Environment Variables](#environment-variables))

3) Build and start the API

```bash
npm run build
npm start
```

When the log shows `Nest application successfully started`, open **http://localhost:3001/api** (Swagger UI). To check that it works, run the commands in [Test it](#4-test-it).

> **Editing the code?** Use `npm run start:dev` instead of step 3. It compiles and restarts the API automatically whenever you save a file.

## Endpoints Overview

Interactive documentation is served at `/api` (Swagger UI) while the process is running.

| Method | Endpoint | Description |
| ------ | -------- | ----------- |
| `GET` | `/api` | Swagger UI |
| `POST` | `/ai/cowrite-problem` | Generate problem components (concepts, assumptions, mistakes, instructor plan) from a title, description, discipline, and statement |
| `POST` | `/ai/planning-response` | Planning-tutor turn: send the problem, the student message, and conversation history |

Example bodies are in `examples/fixtures/cowrite-problem.request.json` and `examples/fixtures/planning-tutor.request.json`.

## Examples

[`examples/`](examples/README.md) has copyable clients for both endpoints, the JSON bodies those clients send, and small demos that call a running API.

| What | Where |
| ---- | ----- |
| TypeScript client | [`examples/typescript/src/client.ts`](examples/typescript/src/client.ts) and [`types.ts`](examples/typescript/src/types.ts) |
| Python client | [`examples/python/src/client.py`](examples/python/src/client.py) and [`api_types.py`](examples/python/src/api_types.py) |
| Request bodies | [`examples/fixtures/cowrite-problem.request.json`](examples/fixtures/cowrite-problem.request.json), [`examples/fixtures/planning-tutor.request.json`](examples/fixtures/planning-tutor.request.json) |

Start the API first (see [Running Locally](#running-locally) or [Running With Docker](#running-with-docker)). Then, from `examples/typescript`:

```bash
npm install
npm run cowrite-problem
npm run planning-tutor
```

From `examples/python`:

```bash
pip install -r requirements.txt
python src/cowrite_problem.py
python src/planning_tutor.py
```

Both demos use `http://localhost:3001` unless you set `BASE_URL`. Full setup is in [`examples/README.md`](examples/README.md).

## Errors

A successful call returns HTTP `200`:

```json
{
  "data": {},
  "status": 200,
  "success": true
}
```

`data` is the result for that endpoint. `success` is `true` only when the status is in the 200–299 range.

Failed calls are not wrapped this way. Use the HTTP status. The body has `statusCode`, `message`, and `error`.

| Status | When |
| ------ | ---- |
| `400` | A required field is missing, or a field has the wrong type. `message` is a list of validation errors. |
| `404` | The path does not match an endpoint. |
| `500` | The body was valid, but the API could not finish the request. |

Validation error (`400`):

```json
{
  "statusCode": 400,
  "message": [
    "title must be a string",
    "statement must be a string"
  ],
  "error": "Bad Request"
}
```

`500` has two body shapes.

When the API itself rejects the result (OpenAI returned nothing the API could parse), the body is:

```json
{
  "statusCode": 500,
  "message": "No tool call response from OpenAI",
  "error": "Internal Server Error"
}
```

When something else fails, including a missing `OPENAI_MODEL_NAME` or an error from OpenAI, the body also includes `timestamp` and `path`:

```json
{
  "statusCode": 500,
  "timestamp": "2026-11-23T15:00:00.000Z",
  "path": "/ai/planning-response",
  "error": "Internal server error",
  "message": "The error text from OpenAI or from configuration."
}
```

OpenAI's own status, such as `401` or `429`, is not forwarded. Those failures are `500` here, and `message` carries the underlying reason. The stack trace is written to the server log and is not included in the response.

## Data And Privacy

- The STEPS-Tutor API does not store data.
- Student work sent to the API is passed to OpenAI using your key, so OpenAI's data and usage policies apply. Check that this fits your institution's privacy requirements (for example, rules on student records) before using it with real student data.

## Troubleshooting

<!-- TODO (dev team): Add common problems as they come up. -->

- **The API won't start**
  - Check that `.env` exists and that `OPENAI_API_KEY` is set.
  - For Docker, confirm the container is running with `docker ps` and read `docker logs steps-tutor-api`.

- **`Cannot GET /` in the browser or the logs**
  - This is expected. The API has no page at `/`. Open `/api` for Swagger UI.

- **`docker rmi` fails with "container … is using its referenced image"**
  - A container from this image still exists. Run `docker rm -f steps-tutor-api`, then `docker rmi steps-tutor-api:local` again.

- **`docker build` fails**
  - Run the command from the repository root (the directory that contains the `Dockerfile`).
  - Confirm Docker is running.

- **Port already allocated**
  - Another process is using the host port in `-p`. Stop that container (`docker stop steps-tutor-api`) or publish a different host port, for example `-p 3002:3001`. The number on the right is the port inside the container and must match `PORT` in `.env`.

- **Swagger or curl cannot connect**
  - The host port in the URL must be the left-hand side of `-p`. With `-p 3001:3001` and `PORT=3001`, use `http://localhost:3001`.

- **Errors mentioning OpenAI authentication**
  - Check that your OpenAI key is valid and that billing is set up on your OpenAI account.
  - If the container was already running, recreate it after editing `.env` so it picks up the new values: `docker stop steps-tutor-api`, `docker rm steps-tutor-api`, then `docker run` again.

- **Rate limit or quota errors**
  - These come from your OpenAI account's limits. Check your usage and limits in the OpenAI dashboard.

## Getting Help

The [**Issues**](../../issues) tab is the main way to reach the STEPS-Tutor API team. Before opening an issue, search existing ones to see if your question has already been answered.

When you open an issue, prefix the title with `[Bug]`, `[Question]`, or `[Feature]`. See [CONTRIBUTING.md](CONTRIBUTING.md) for what to include in each.

## Contributing

We welcome feedback through GitHub Issues. We are currently not accepting pull requests from outside contributors, and pull requests are turned off for this repository.

You can contribute by:
1. Reporting bugs
2. Asking questions that help us improve the documentation
3. Suggesting features or improvements

If you've spotted a fix, such as a typo, a broken example or a bug in the code, describe it in an issue. We'll make the change and credit you.

To contribute:
1. Search [existing issues](../../issues) to avoid duplicates
2. Open a new issue using the `[Bug]`, `[Question]`, or `[Feature]` title prefix
3. Include the details listed in [CONTRIBUTING.md](CONTRIBUTING.md)
4. Remove your OpenAI key and any personal data (including student information) before posting

Checklist before submitting an issue:
- [ ] searched existing issues
- [ ] removed secrets and personal data
- [ ] included steps to reproduce, and your Node.js version or Docker setup (for bugs)
- [ ] used the correct title prefix

You're also free to fork the project and adapt it for your own use under the terms of the Apache 2.0 license.

## Security

**Do not report security vulnerabilities in public issues.** Use the repository's **Security** tab and click **Report a vulnerability**. See [SECURITY.md](SECURITY.md) for details.

## Roadmap

- **Assessments** (coming later)

## License

This project is licensed under the Apache License 2.0. See `LICENSE` for full text.
