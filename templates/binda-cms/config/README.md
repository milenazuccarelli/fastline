# %%PROJECT_NAME%%

A Rails application with Binda CMS.

## Installation

Generate a fresh rails app:
```
docker-compose run web rails new . --force --no-deps --database=postgresql
```

Now that you’ve got a new Gemfile, you need to build the image again. (This, and changes to the Gemfile or the Dockerfile, should be the only times you’ll need to rebuild.)

```
docker-compose build
```

### Connect to the Database

The app is now bootable, but you’re not quite there yet. By default, Rails expects a database to be running on localhost - so you need to point it at the db container instead. You also need to change the database and username to align with the defaults set by the postgres image.

Replace the contents of config/database.yml with the following:

```yml
default: &default
  adapter: postgresql
  encoding: unicode
  pool: <%= ENV.fetch("RAILS_MAX_THREADS") { 5 } %>
  host: <%= ENV['POSTGRES_HOST'] %>
  username: postgres

development:
  <<: *default
  database: myapp_development
  password: <%= ENV['POSTGRES_PASSWORD'] %>

test:
  <<: *default
  database: myapp_test
  password: <%= ENV['POSTGRES_PASSWORD'] %>

production:
  <<: *default
  database: myapp_production
  password: <%= ENV['POSTGRES_PASSWORD'] %>
```

You can now boot the app with docker-compose up:

```
docker-compose up
```

If all’s well, you should see some PostgreSQL output.
```
rails_db_1 is up-to-date
Creating rails_web_1 ... done
Attaching to rails_db_1, rails_web_1
db_1   | PostgreSQL init process complete; ready for start up.
db_1   |
db_1   | 2018-03-21 20:18:37.437 UTC [1] LOG:  listening on IPv4 address "0.0.0.0", port 5432
db_1   | 2018-03-21 20:18:37.437 UTC [1] LOG:  listening on IPv6 address "::", port 5432
db_1   | 2018-03-21 20:18:37.443 UTC [1] LOG:  listening on Unix socket "/var/run/postgresql/.s.PGSQL.5432"
db_1   | 2018-03-21 20:18:37.726 UTC [55] LOG:  database system was shut down at 2018-03-21 20:18:37 UTC
db_1   | 2018-03-21 20:18:37.772 UTC [1] LOG:  database system is ready to accept connections
```

Finally, you need to create the database. In another terminal, run:

```
docker-compose run web rails db:create
```

Here is an example of the output from that command:

```
$ docker-compose run web rails db:create
Starting rails_db_1 ... done
Created database 'myapp_development'
Created database 'myapp_test'
```

### View the Rails welcome page!
Your app should now be running on port 3000 on your Docker daemon.
On Docker Desktop for Mac and Docker Desktop for Windows, go to http://localhost:3000 on a web browser to see the Rails Welcome.  

<p align="center">
  <img alt="Yay! your're on Rails!" src="./doc/rails_welcome.png" width="500px">
</p>

### Install Binda

Stop running containers:
```
docker-compose down
```

Add this line to `web/Gemfile`

```
gem 'binda'
```

Then rebuild the web service and restart containers:
```
docker-compose build web && docker-compose up
```

Before completing the installation you need to setup the database. If you are going to use Postgres set it up now.

To complete binda installation run the installer inside the web container. Binda will take you through a short configuration process where you will setup the first user and some basic details.
```
docker container exec -it %%REPOSITORY_NAME%%_web_1 rails generate binda:install
```

When it's done you can go to http://localhost:3000/admin_panel and insert the credentials you just created.