# Wordpress and Traefik

## Setup

Please make sure the following points are in place:  
- Your tls certificate address is correct  
- You are interally exposing the correct port  
- If you are using a port other than `:80` and `:443` you will need to add it to the ports exposed by the Traefik service.

## Bitbucket pipelines

1. settings > settings
make sure pipelines is enabled

2. go to settings > deployments
for each deployment and a env-build so it should look something like this:
Staging
staging-build

Production
production-build

3. go to settings > repository variables
add your variables. For your gcr key you will need to do the following:

4. go to settings > SSH keys
add your public key, private key, and fingerprint. make sure to add the public key to the known hosts of the server if it is not already.

