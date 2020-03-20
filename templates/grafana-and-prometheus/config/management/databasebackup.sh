#! /bin/bash

# Author: Milena Zuccarelli
# Date: 17/03/2020

# databasebackup.sh
# This file iterates through the database containers and stores their databases
# into a mounted directory set up in the docker-compose file. Current supported databases
# are mariadb/mysql and postgres

# set -x

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
        # Inspect the container and find the image it's created from
        findImages=$(docker container inspect ${d} --format='{{.Config.Image}}')
        # Get the date to append to the image
        newFileDate=$(date '+%Y%m%d-%H%M%S')
        # Check if image is postgres or mariadb
        if [[ "$findImages" == *"postgres"* ]]
        then
            echo "Processing ${d}"
            # Inspect the image and get the envar `POSTGRES_PASSWORD` if needed
            postgresPassword=$(docker container inspect $d  | grep POSTGRES_PASSWORD | cut -f2 -d '=' | sed 's/",//')
            # Exec into the container, get a list of the database names and clean up
            postgresDatabaseNames=$(docker container exec $d sh -c 'exec psql -U postgres -lqt | cut -d \| -f 1 | sed "/^[[:space:]]*$/d"')
            for databaseName in ${postgresDatabaseNames}
            do
                echo "${databaseName}"
                # Get the container name and cut it from the first dot
                serviceName=$(echo "${d}" | cut -f1 -d'.')
                # Ignore postgres' `template0` and `template1`
                if [[ ${databaseName} != "template0" ]] && [[ ${databaseName} != "template1" ]]
                then
                    docker container exec $d sh -c "exec pg_dump -U postgres ${databaseName} > /backups/${serviceName}-${databaseName}-${newFileDate}.sql"
                fi
            done
        elif [[ "$findImages" == *"mariadb"* ]] || [[ "$findImages" == *"mysql"* ]]
        then
            echo "Processing ${d}"
            # Inspect the image and get the envar `MYSQL_ROOT_PASSWORD_FILE`. We are assuming the compose file is using a file.
            mysqlPasswordFile=$(docker container inspect $d  | grep MYSQL_ROOT_PASSWORD_FILE | cut -f2 -d '=' | sed 's/",//')
            mysqlPassword=$(docker container exec $d sh -c "cat ${mysqlPasswordFile}")
            mysqlDatabaseNames=$(docker container exec $d sh -c "exec mysql -N -u root -p${mysqlPassword} -e 'show databases;'")
            for databaseName in ${mysqlDatabaseNames}
            do
                echo "${databaseName}"
                # Get the container name and cut it from the first dot
                serviceName=$(echo "${d}" | cut -f1 -d'.')
                # Ignore mysql `information_schema` and `performance_schema`
                if [[ ${databaseName} != "information_schema" ]] && [[ ${databaseName} != "performance_schema" ]]
                then
                    docker container exec $d sh -c "exec mysqldump -u root -p${mysqlPassword} ${databaseName} > /backups/${serviceName}-${databaseName}-${newFileDate}.sql"
                fi
            done
        fi
    fi
done
