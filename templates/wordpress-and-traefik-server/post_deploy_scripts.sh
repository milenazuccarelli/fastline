#!/usr/bin/env bash
# STAGING POST DEPLOY PIPELINE
set -ex

# VARIABLES AND FUNCTIONS
# -----------------------
# edit the following ones according to your setup
BITBUCKET_REPO_SLUG='%%BITBUCKET_REPO_SLUG%%'
BITBUCKET_DEPLOYMENT_ENVIRONMENT='%%BITBUCKET_DEPLOYMENT_ENVIRONMENT%%'
DEPLOY_DIRECTORY="/root/$BITBUCKET_REPO_SLUG"


# Compiled variables
NGINX_CONTAINER=$(docker network inspect --verbose "${BITBUCKET_REPO_SLUG}_default" |
                  jq --raw-output  ".[0]|.Services|.${BITBUCKET_REPO_SLUG}_nginx|.Tasks|.[0]|.Name" -)
NGINX_NETWORKS=$(docker container inspect "$NGINX_CONTAINER" |
                 jq ".[0]|.NetworkSettings|.Networks" - | jq 'keys')
NETWORK_NAME="${BITBUCKET_REPO_SLUG}_${BITBUCKET_DEPLOYMENT_ENVIRONMENT}"

# Functions
nginx_is_in_staging_network(){
  printf '%s\n' "${NGINX_NETWORKS[@]}" | grep -q -P "\"$NETWORK_NAME\""
}


# VOLUME SYMLINKS
# ---------------
generate_volume_symlink () {
  VOLUME_BASIC_NAME=$1
  if $2; then
    VOLUME_COMPOSED_NAME="${BITBUCKET_REPO_SLUG}_${VOLUME_BASIC_NAME}"
  else
    BITBUCKET_DEPLOYMENT_ENVIRONMENT=$2
    VOLUME_COMPOSED_NAME="${BITBUCKET_REPO_SLUG}_${BITBUCKET_DEPLOYMENT_ENVIRONMENT}_${VOLUME_BASIC_NAME}"
  fi
  SYMLINK_PATH="${DEPLOY_DIRECTORY}/symlinks/${VOLUME_COMPOSED_NAME}"

  # If volume symlink doesn't exists:
  #   Create it.
  if [ -L "$SYMLINK_PATH" ]; then
    echo "Volume symlink for $VOLUME_COMPOSED_NAME already exists."
  else
    echo "Symlink for $VOLUME_COMPOSED_NAME volume doens't exist. Let's create it."
    VOLUME_PATH=$(docker volume inspect "$VOLUME_COMPOSED_NAME" | jq --compact-output --raw-output ".[0]|.Mountpoint")
    if [ -z "${VOLUME_PATH}" ]; then
      >&2 echo "Something went wrong. Volume path for $VOLUME_COMPOSED_NAME is not set. Please rerun pipeline later."
      exit 1
    fi
    cd $DEPLOY_DIRECTORY
    mkdir -p symlinks
    cd symlinks
    ln -s "$VOLUME_PATH" "$VOLUME_COMPOSED_NAME"
    if [ -L "$SYMLINK_PATH" ]; then
      echo "Volume symlink for $VOLUME_COMPOSED_NAME created."
    else
      >&2 echo "Something went wrong. Volume symlink for $VOLUME_COMPOSED_NAME could not be created"
      exit 1
    fi
  fi
}

generate_volume_symlink 'wp_data' "$BITBUCKET_DEPLOYMENT_ENVIRONMENT"
generate_volume_symlink 'nginx_auth'
generate_volume_symlink 'nginx_conf'
generate_volume_symlink 'nginx_vhost'

# NGINX NETWORK CONNECTION
# ------------------------
if nginx_is_in_staging_network; then
  echo "Nginx is already connected to $NETWORK_NAME."
else
  echo "Nginx is not connected to $NETWORK_NAME network. Let's connect it"
  docker network connect "${BITBUCKET_REPO_SLUG}_${BITBUCKET_DEPLOYMENT_ENVIRONMENT}" "$NGINX_CONTAINER"
  APP_CONTAINER=$(docker network inspect --verbose "${BITBUCKET_REPO_SLUG}_default" |
                  jq --raw-output  ".[0]|.Services|.${BITBUCKET_REPO_SLUG}_whoami|.Tasks|.[0]|.Name" -)
  docker container restart "$APP_CONTAINER"
  # Update nginx networks to check them again
  NGINX_NETWORKS=$(docker container inspect "$NGINX_CONTAINER" |
                 jq ".[0]|.NetworkSettings|.Networks" - | jq 'keys')
  if nginx_is_in_staging_network; then
    echo "Nginx is now connected to $NETWORK_NAME network."
  else
    >&2 echo "Something went wrong. Nginx is still not connected to $NETWORK_NAME network."
    exit 1
  fi
fi

# LETSENCRYPT_CONTAINER=$(docker network inspect --verbose patriciaurquiola_staging_default |
# jq --raw-output  ".[0]|.Services|.${BITBUCKET_REPO_SLUG}_${BITBUCKET_DEPLOYMENT_ENVIRONMENT}_letsencrypt|.Tasks|.[0]|.Name" -)
# docker container restart "$LETSENCRYPT_CONTAINER"

# Delete useless images
# https://stackoverflow.com/questions/32723111/how-to-remove-old-and-unused-docker-images
# https://docs.docker.com/engine/reference/commandline/images/#filtering
# docker rmi $(docker images -f "dangling=true" -q)
