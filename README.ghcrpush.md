# Publish and deploy the STEPS-Tutor API image on GHCR

This guide pushes the local Docker image to GitHub Container Registry (`ghcr.io`), then pulls that image on a machine and tests it. It uses the Docker CLI.

Build the image first by following [Running With Docker](README.md#running-with-docker) in `README.md`. The local tag from that guide is `steps-tutor-api:local`.

The registry image for this repository is:

```text
ghcr.io/steps-tutor/steps-tutor-api
```

`ghcr.io` requires the owner and image name in lowercase. The OpenAI key stays in a `.env` file on the machine that runs the container. It is not stored in the image.

## Prerequisites

- Docker, with the local image already built (`steps-tutor-api:local`)
- A GitHub account that can publish packages for the [Steps-Tutor](https://github.com/Steps-Tutor) organization
- A GitHub personal access token for the registry

Create a classic token at [Fine-grained tokens / Personal access tokens](https://github.com/settings/tokens) with these scopes:

- `write:packages` to push
- `read:packages` to pull a private package
- `repo` when the package is private and tied to this repository

A fine-grained token also works. Give it read and write access to packages on `Steps-Tutor/Steps-Tutor-API`.

## 1. Log in to ghcr.io

Use your GitHub username. The token is the password. The owner in the image name (`steps-tutor`) stays the organization.

```bash
export CR_PAT=your-github-token
echo "$CR_PAT" | docker login ghcr.io -u YOUR_GITHUB_USERNAME --password-stdin
```

A successful login prints `Login Succeeded`.

## 2. Tag the local image

Pick a version tag. Tag `latest` as well when this build is the one you want servers to pull by default.

```bash
docker tag steps-tutor-api:local ghcr.io/steps-tutor/steps-tutor-api:0.0.1
docker tag steps-tutor-api:local ghcr.io/steps-tutor/steps-tutor-api:latest
```

Replace `0.0.1` with the version you are publishing.

The source label connects the package to this repository in GitHub. Add it when you build, before tagging:

```bash
docker build \
  --label org.opencontainers.image.source=https://github.com/Steps-Tutor/Steps-Tutor-API \
  -t steps-tutor-api:local .
```

Tag that image with the commands above, then push.

## 3. Push the image

```bash
docker push ghcr.io/steps-tutor/steps-tutor-api:0.0.1
docker push ghcr.io/steps-tutor/steps-tutor-api:latest
```

Confirm the package on GitHub:

- Repository packages: [github.com/Steps-Tutor/Steps-Tutor-API/pkgs/container/steps-tutor-api](https://github.com/Steps-Tutor/Steps-Tutor-API/pkgs/container/steps-tutor-api)
- Organization packages: [github.com/orgs/Steps-Tutor/packages](https://github.com/orgs/Steps-Tutor/packages)

A new package is private. Open the package, choose **Package settings**, then **Change visibility** if other machines should pull it without a token. Leave it private if only authenticated pulls are allowed.

## 4. Deploy from ghcr.io

On the machine that will run the API:

1. Install Docker.
2. Create the env file. Copy `.env.example` from this repository to `.env` and set `OPENAI_API_KEY`. Leave `PORT=3001` unless you change the published port to match.
3. Log in when the package is private:

```bash
echo "$CR_PAT" | docker login ghcr.io -u YOUR_GITHUB_USERNAME --password-stdin
```

A public package can be pulled without logging in.

4. Pull the version you pushed:

```bash
docker pull ghcr.io/steps-tutor/steps-tutor-api:0.0.1
```

5. Start the container:

```bash
docker run -d -p 3001:3001 --env-file .env --name steps-tutor-api ghcr.io/steps-tutor/steps-tutor-api:0.0.1
```

`-p 3001:3001` publishes host port 3001 to container port 3001. The right-hand port must match `PORT` in `.env`. To publish a different host port, change only the left side, for example `-p 8080:3001`.

Follow the logs until the process is up:

```bash
docker logs -f steps-tutor-api
```

Stop following logs with Ctrl+C. The container keeps running.

The API is at `http://localhost:3001` on that machine. From another computer, use the server's host name or IP instead of `localhost`. Swagger UI is at `/api`.

## 5. Test the deployed container

Wait until the logs include `Nest application successfully started`. The commands below use `localhost` and port `3001`. Change the host and port if you published the container elsewhere.

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

Co-write a problem (calls OpenAI with the key in `.env`). Run this from a checkout of the repository so the fixture path exists:

```bash
curl -s -X POST http://localhost:3001/ai/cowrite-problem \
  -H "Content-Type: application/json" \
  -d @examples/fixtures/cowrite-problem.request.json
```

Planning tutor (calls OpenAI with the key in `.env`):

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

## 6. Stop the deployed container

```bash
docker stop steps-tutor-api
docker rm steps-tutor-api
```

Pull and run again when you publish a newer tag. If a container named `steps-tutor-api` is already present, stop and remove it before `docker run`.

## Troubleshooting

- **`denied` on `docker push` or `docker pull`**
  - Log in again. The token needs `write:packages` to push and `read:packages` to pull a private package.
  - The GitHub user must be allowed to publish packages for the `Steps-Tutor` organization.
  - The image name must be lowercase: `ghcr.io/steps-tutor/steps-tutor-api`.

- **`manifest unknown` on pull**
  - Push finished for that exact tag. Check the tag on the package page, then pull the same tag.

- **The container starts and AI requests fail**
  - `.env` on the server must contain a valid `OPENAI_API_KEY` and `OPENAI_MODEL_NAME`.
  - Recreate the container after changing `.env`: `docker stop`, `docker rm`, then `docker run` again.
