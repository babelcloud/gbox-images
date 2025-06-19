FROM ubuntu:24.04

ARG TTYD_VERSION=1.7.7 \
    PYTHON_VENV_PATH=/opt/python/venv \
    DEBIAN_FRONTEND=noninteractive

LABEL org.opencontainers.image.authors="BabelCloud <connect@gru.ai>" \
    org.opencontainers.image.source="https://github.com/babelcloud/gbox" \
    org.opencontainers.image.description="Gbox base image" \
    org.opencontainers.image.title="Gbox base image" \
    org.opencontainers.image.version="1.0.0"

WORKDIR /root

# Set base environment variables
ENV PATH="/root/.local/bin:/opt/python/venv/bin:${PATH}" \
    LANG=en_US.UTF-8 \
    LC_ALL=en_US.UTF-8 \
    VIRTUAL_ENV=${PYTHON_VENV_PATH}

# Install base system dependencies
RUN apt update && apt install -qy --no-install-recommends \
    # Basic tools
    tini \
    wget \
    gnupg \
    ca-certificates \
    curl \
    git \
    pwgen \
    locales && \
    # Set locales
    sed -i -e 's/# en_US.UTF-8 UTF-8/en_US.UTF-8 UTF-8/' /etc/locale.gen && locale-gen && \
    # Install ttyd
    curl -LsSf "https://github.com/tsl0922/ttyd/releases/download/${TTYD_VERSION}/ttyd.$(uname -m)" -o /usr/local/bin/ttyd && \
    chmod +x /usr/local/bin/ttyd    

# Setup python environment
RUN apt install -qy --no-install-recommends \
    supervisor \
    python3-venv && \
    # Clean up
    apt clean && rm -rf /var/lib/apt/lists/* && \
    # Create directory for supervisord log file
    mkdir -p /var/log/supervisor && chmod 755 /var/log/supervisor && \
    # Install Python packages using uv in a virtual environment
    curl -LsSf https://astral.sh/uv/install.sh | sh && \
    # Create virtual environment
    python3 -m venv ${PYTHON_VENV_PATH} && \
    # Install Python packages in the virtual environment
    ${PYTHON_VENV_PATH}/bin/python -m pip install --upgrade pip && \
    uv pip install \
        --python ${PYTHON_VENV_PATH}/bin/python \
        numpy \
        scipy \
        pandas \
        scikit-learn \
        requests \
        beautifulsoup4 \
        pillow \
        matplotlib \
        reportlab

# Copy base supervisord config (includes ttyd)
COPY supervisord.conf /etc/supervisor/supervisord.conf

# Copy base entrypoint script
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

ENTRYPOINT ["/usr/bin/tini", "--", "/entrypoint.sh"]

# Expose ttyd port
EXPOSE 7681

# Default command
CMD ["sleep", "infinity"]
