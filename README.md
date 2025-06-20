# Gbox Container Images

[![Build Gbox Images](https://github.com/babelcloud/gbox-images/actions/workflows/build-images.yaml/badge.svg)](https://github.com/babelcloud/gbox-images/actions/workflows/build-images.yaml)

> Multi-arch container images that power the <a href="https://gbox.ai" target="_blank">Gbox</a> sandbox.

---

## Overview

This repository contains the official Dockerfiles used to build the container images that back Gbox modules.  
Every image is published to the GitHub Container Registry (GHCR) under the namespace:

```
ghcr.io/babelcloud/gbox-<module>:<tag>
```

The images are built for `linux/amd64` and `linux/arm64` and are suitable for local development as well as production workloads.

### Available modules

| Module      | Base image | Main purpose                                                                     |
|-------------|------------|---------------------------------------------------------------------------------|
| **base**    | `ubuntu:24.04` | Generic sandbox image with Python 3, a virtual env and a web-based terminal (`ttyd`). |
| **playwright** | `gbox-base` | Headless Chromium + Node.js + Playwright server for browser automation via CDP. |

Additional modules will be added as Gbox grows.

---

## Quick start

### Prerequisites

* Docker 24+ with Buildx enabled (or Docker Desktop)
* (optional) `make` for the supplied build targets

### Pull a pre-built image

```bash
# Base sandbox
docker pull ghcr.io/babelcloud/gbox-base:main

# Browser sandbox
docker pull ghcr.io/babelcloud/gbox-playwright:main
```

### Run

```bash
# 1. Base image – exposes ttyd on :7681
docker run --rm -it -p 7681:7681 ghcr.io/babelcloud/gbox-base:main
# Open http://localhost:7681 for a web terminal.

# 2. Playwright image – exposes Chrome DevTools Protocol on :9222
docker run --rm -it -p 9222:9222 ghcr.io/babelcloud/gbox-playwright:main
# Connect a Playwright / Puppeteer client to ws://localhost:9222
```

---

## Building the images locally

All modules share a common make interface:

```bash
# Build for the host architecture
make build-base                   # => ghcr.io/babelcloud/gbox-base:latest
make TAG=v1.0.0 build-playwright  # => ghcr.io/babelcloud/gbox-playwright:v1.0.0

# Build multi-arch and push (requires login to ghcr.io)
make buildx-base                  # linux/amd64 + linux/arm64
```

The resulting image is tagged as shown above.  Set the `TAG` variable to override the default `latest` tag.

---

## Continuous delivery

A GitHub Actions workflow (`.github/workflows/build-images.yaml`) automatically builds every module for both `amd64` and `arm64`:

* **Pull requests / commits** – build only, used as a PR smoke test.
* **Push to `main`** – build **and** push, tags the image with the commit SHA and the floating `main` tag.
* **Manual dispatch** – allows maintainers to pick the modules, tag and whether or not to push.

