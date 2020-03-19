#! /bin/bash

# Author: Milena Zuccarelli
# Date: 17/03/2020

# databasebackup.sh
# This file iterates through the database containers and stores their databases
# into a mounted directory set up in the docker-compose file

# set -x

# Set envars
CONTAINER=db
IMAGE=postgres

# Parse YML: future reference
parse_yaml() {
   local prefix=$2
   local s='[[:space:]]*' w='[a-zA-Z0-9_]*' fs=$(echo @|tr @ '\034')
   sed -ne "s|^\($s\)\($w\)$s:$s\"\(.*\)\"$s\$|\1$fs\2$fs\3|p" \
        -e "s|^\($s\)\($w\)$s:$s\(.*\)$s\$|\1$fs\2$fs\3|p"  $1 |
   awk -F$fs '{
      indent = length($1)/2;
      vname[indent] = $2;
      for (i in vname) {if (i > indent) {delete vname[i]}}
      if (length($3) > 0) {
         vn=""; for (i=0; i<indent; i++) {vn=(vn)(vname[i])("_")}
         printf("%s%s%s=\"%s\"\n", "'$prefix'",vn, $2, $3);
      }
   }'
}

# Get a list of our containers
databaseContainers=$(docker container ls --format={{.Names}})
# Iterate through
for d in ${databaseContainers}
do
  # Currently checking for container names which have a substring of `db` or `database`
  if [[ "$d" == *"db"* ]] || [[ "$d" == *"database"* ]]
  then
    # echo "Processing ${d}"
    findImages=$(docker container inspect ${d} --format='{{.Config.Image}}') 
    # echo "try $findImages"
    if [[ "$findImages" == *"$IMAGE"* ]]
    then
      echo "Next processing ${d}"
      
      newFileDate=$(date '+%Y%m%d-%H%M%S')
      password=$(docker container inspect $d  | grep POSTGRES_PASSWORD | cut -f2 -d '=' | sed 's/",//')
      databaseNames=$(docker container exec $d sh -c 'exec psql -U postgres -lqt | cut -d \| -f 1 | sed "/^[[:space:]]*$/d"') 
      for databaseName in ${databaseNames} 
        do
	  echo "${databaseName}" 
	  #echo "exec pg_dump -U postgres -W -d ${databaseName} > /TEST/${databaseName}-${newFileDate}.sql"
	  serviceName=$(echo "${d}" | cut -f1 -d'.')
	  #echo ${serviceName}
	  if [[ ${databaseName} != "template0" ]] && [[ ${databaseName} != "template1" ]]
	  then 
	    #myCommand="docker container exec $d sh -c 'exec pg_dump -U postgres ${databaseName} > /TEST/${serviceName}-${databaseName}-${newFileDate}.sql'"
            docker container exec $d sh -c "exec pg_dump -U postgres ${databaseName} > /TEST/${serviceName}-${databaseName}-${newFileDate}.sql"
          fi
        
        done
    fi
  fi
done
#newFileDate=$(date '+%Y%m%d-%H%M%S')
#/usr/bin/docker exec $CONTAINER sh -c 'exec mysqldump --all-databases -uroot -p""' > /root/management/backups/all-databases-${newFileDate}.sql
