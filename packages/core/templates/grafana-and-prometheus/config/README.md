# LaColonia-Cloud

## Setup

Create a swarm with a fixed ip address.
`docker swarm join --advertise-address your-machine-ip`

Find out hostname of the swarm manager.
`docker node ls`

Replace `%%MANAGER_NODE_HOSTNAME%%` with the host name of the first item.

## Template variables

Full domain name of your machine:  
`%%SERVER_DOMAIN%%`

Host name of the manager node of your swarm:
`%%MANAGER_NODE_HOSTNAME%%`



