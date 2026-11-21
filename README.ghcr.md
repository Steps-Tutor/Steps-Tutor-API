# Publish the Docker image to GHCR

The workflow [`.github/workflows/publish-image.yml`](.github/workflows/publish-image.yml) builds the STEPS-Tutor API image from the root [`Dockerfile`](Dockerfile) and pushes it to GitHub Container Registry (GHCR).

It runs only when someone starts it from the Actions tab. Pushes and pull requests do not start it.

## What a run does

1. Checks out the branch you select.
2. Builds the image on the GitHub-hosted runner (linux/amd64).
3. Pushes two tags to `ghcr.io/steps-tutor/steps-tutor-api`:
   - the next patch version, starting at `1.0.0`
   - `latest`, pointing at that same image

The image name follows the repository, in lowercase: `ghcr.io/<owner>/steps-tutor-api`. For this repository that is `ghcr.io/steps-tutor/steps-tutor-api`.

## Version tags

The workflow reads tags already published on GHCR. It keeps the `1.0` prefix and adds one to the highest patch number it finds. The first publish, when no `1.0.x` tag exists, uses `1.0.0`.

| Run | Version tag | Also pushed |
| --- | --- | --- |
| First | `1.0.0` | `latest` |
| Second | `1.0.1` | `latest` |
| Third | `1.0.2` | `latest` |

`latest` always moves to the image from the run that just finished. Older version tags stay on the images they were published with.

Start the next run only after the previous one has finished. Two runs at the same time can choose the same version tag.

## Run it

The workflow file has to be on the repository’s default branch before it appears in the Actions tab.

1. Open this repository on GitHub.
2. Open **Actions**.
3. Choose **Publish Docker image** in the left sidebar.
4. Click **Run workflow**.
5. Select the branch to build and click **Run workflow**.

You need permission to run workflows in this repository. The workflow uses the built-in `GITHUB_TOKEN` with permission to publish packages. No extra secret is required.

When the job finishes, the run summary lists both tags. The package page for this repository is:

https://github.com/Steps-Tutor/Steps-Tutor-API/pkgs/container/steps-tutor-api

A newly created package may be private. Open that package, then **Package settings**, and change the visibility if people outside the organization should be able to pull it.

## Pull and run

Pull a specific version, or the tag that tracks the newest publish:

```bash
docker pull ghcr.io/steps-tutor/steps-tutor-api:1.0.0
docker pull ghcr.io/steps-tutor/steps-tutor-api:latest
```

Run it with your own env file, the same way as a locally built image. The OpenAI key is passed when the container starts and is not stored in the image.

```bash
docker run --rm -p 3001:3001 --env-file .env ghcr.io/steps-tutor/steps-tutor-api:latest
```

The API listens on port 3001 inside the container. If `PORT` in `.env` is different, publish that port instead (`-p <PORT>:<PORT>`).

A private package asks you to log in before `docker pull`:

```bash
echo "$GITHUB_TOKEN" | docker login ghcr.io -u YOUR_GITHUB_USERNAME --password-stdin
```

Use a personal access token with the `read:packages` scope. A public package can be pulled without logging in.
