#!/usr/bin/env bash
# STAGING POST DEPLOY PIPELINE
set -ex

# VARIABLES AND FUNCTIONS
# -----------------------
# edit the following ones according to your setup
BITBUCKET_REPO_SLUG='%%BITBUCKET_REPO_SLUG%%'
BITBUCKET_DEPLOYMENT_ENVIRONMENT='%%BITBUCKET_DEPLOYMENT_ENVIRONMENT%%'
DEPLOY_DIRECTORY="/root/$BITBUCKET_REPO_SLUG"


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

generate_volume_symlink 'admin-data' "$BITBUCKET_DEPLOYMENT_ENVIRONMENT"
generate_volume_symlink 'admin-db-data' "$BITBUCKET_DEPLOYMENT_ENVIRONMENT"

# DELETE USELESS IMAGES
# ---------------------
# https://nickjanetakis.com/blog/docker-tip-32-automatically-clean-up-after-docker-daily
docker system prune -f