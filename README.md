# STEPS-Tutor API

Open-source API for bringing [STEPS](https://steps.stanford.edu/) (Science Tutor for Effective Problem Solving) tutoring into your own courses and learning platforms.

The STEPS-Tutor API supports:
- running STEPS tutoring sessions from your own tools,
- creating, adapting and managing problems,
- self-hosting with your own OpenAI API key.

Built with Node.js and TypeScript. You run it on your own machine or server, either directly or with Docker.

## Table Of Contents

- [Why STEPS-Tutor API](#why-steps-tutor-api)
- [Core Features](#core-features)
- [How It Works](#how-it-works)
- [Prerequisites](#prerequisites)
- [Environment Variables](#environment-variables)
- [Running With Docker](#running-with-docker)
- [Running Locally](#running-locally)
- [Endpoints Overview](#endpoints-overview)
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

<!-- TODO (dev team): Fill in specifics and endpoint names for each area. -->

- **Tutoring sessions**
  - [Send a student's work and receive STEPS guidance on planning, checking and reflecting]
  - [Key endpoint(s)]

- **Problem management**
  - [Create, adapt and retrieve problems]
  - [Key endpoint(s)]

- **Bring your own OpenAI key**
  - The API uses your OpenAI key to process requests, so you control your own usage and costs.

## How It Works

- You download this repository and run the API yourself.
- The API needs no API key or account of its own.
- Requests that need AI processing are sent to OpenAI using **your** OpenAI API key, which you set in a `.env` file.
- Nothing is stored by the API itself; it only needs your OpenAI key to run.

<!-- TODO (dev team): Confirm the default port and request format. -->
- **Default address**: `http://localhost:[PORT]`
- **Format**: JSON request and response bodies

## Prerequisites

Before running the API, make sure you have:

- An OpenAI API key ([OpenAI account](https://platform.openai.com/) with billing set up)
- **For Docker:** [Docker](https://www.docker.com/) [and Docker Compose]
- **To run directly:** Node.js [version] or later, and npm [version] or later

## Environment Variables

Copy the example file and fill in your values:

```bash
cp .env.example .env
```

<!-- TODO (dev team): List every variable the API reads, and mark which are required. -->

```bash
# Required: used to process requests through OpenAI
OPENAI_API_KEY="sk-..."

# [Other variables, e.g. PORT, model name, log level]
```

Never commit your `.env` file or share your OpenAI key in a GitHub issue.

## Running With Docker

<!-- TODO (dev team): Confirm commands. -->

```bash
git clone [REPO_URL]
cd [REPO_FOLDER]
cp .env.example .env   # then add your OpenAI key
[docker compose up]
```

The API will be available at `http://localhost:[PORT]`.

## Running Locally

<!-- TODO (dev team): Confirm commands and script names. -->

1) Install dependencies

```bash
npm install
```

2) Set up your `.env` file (see [Environment Variables](#environment-variables))

3) Start the API

```bash
[npm run dev]     # development
[npm run build]   # build for production
[npm start]       # run the production build
```

## Endpoints Overview

<!-- TODO (dev team): Replace with real endpoints. -->

| Method | Endpoint | Description |
| ------ | -------- | ----------- |
| `[METHOD]` | `[/endpoint]` | [Start or continue a tutoring session] |
| `[METHOD]` | `[/endpoint]` | [Create or update a problem] |
| `[METHOD]` | `[/endpoint]` | [Get a problem] |

[Link to full endpoint documentation, if any]

## Errors

<!-- TODO (dev team): Describe the error format and common error codes. -->

[How errors are returned, e.g. status codes and response body format.]

## Data And Privacy

- The STEPS-Tutor API does not store data.
- Student work sent to the API is passed to OpenAI using your key, so OpenAI's data and usage policies apply. Check that this fits your institution's privacy requirements (for example, rules on student records) before using it with real student data.

## Troubleshooting

<!-- TODO (dev team): Add common problems as they come up. -->

- **The API won't start**
  - Check that `.env` exists and that `OPENAI_API_KEY` is set.

- **Errors mentioning OpenAI authentication**
  - Check that your OpenAI key is valid and that billing is set up on your OpenAI account.

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
- <!-- TODO: Add other planned features. -->

## License

This project is licensed under the Apache License 2.0. See `LICENSE` for full text.
