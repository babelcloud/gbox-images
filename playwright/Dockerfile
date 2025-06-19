ARG TAG=latest \
    PLAYWRIGHT_VERSION=1.52.0

FROM ghcr.io/babelcloud/gbox-base:${TAG}

LABEL org.opencontainers.image.title="Gbox Playwright image" \
    org.opencontainers.image.description="The Gbox Playwright image includes a persistent Chromium browser with the CDP port enabled."

# Install browser dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    libnss3 \
    libxss1 \
    libasound2t64 \
    fonts-liberation \
    libatk-bridge2.0-0 \
    libatk1.0-0 \
    libatspi2.0-0 \
    libcups2 \
    libdrm2 \
    libgbm1 \
    libgtk-3-0 \
    libxcomposite1 \
    libxdamage1 \
    libxkbcommon0 \
    libxrandr2 \
    xdg-utils \
    socat \
    chromium \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Install Node.js and npm
# Using ARG for Node version consistency
RUN curl -fsSL https://deb.nodesource.com/setup_22.x | bash - \
    && apt-get install -y nodejs \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Set Playwright environment variables
ENV PLAYWRIGHT_BROWSERS_PATH=/root/.cache/ms-playwright \
    PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1

# Install Playwright dependencies and browser
RUN npx playwright@${PLAYWRIGHT_VERSION} install --with-deps chromium

WORKDIR /opt/playwright/server
COPY server/ ./

# Install dependencies
RUN npm install

# Copy playwright supervisord config
COPY supervisord.conf /etc/supervisor/conf.d/playwright.conf

# Expose Chrome DevTools Protocol port
EXPOSE 9222

# Add health check for CDP endpoint
HEALTHCHECK --interval=10s --timeout=5s --start-period=10s --retries=3 \
    CMD curl -sf http://0.0.0.0:9222/json/version > /dev/null || exit 1

# Inherit ENTRYPOINT and CMD from base image
