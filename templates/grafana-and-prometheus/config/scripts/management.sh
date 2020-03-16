#!/usr/bin/env bash

docker stack deploy -c ../management/traefik/docker-compose.yml management_traefik
docker stack deploy -c ../management/swarmpit/docker-compose.yml management_swarmpit
docker stack deploy -c ../management/monitoring/docker-compose.yml management_monitoring