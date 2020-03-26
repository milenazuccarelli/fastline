# %%PROJECT_NAME%%

A Rails application with Binda CMS.

## Installation

Generate a rails skeleton using the provided template file.

```
docker-compose run web rails new . \
  --force \
  --template=template.rb \
  --database=postgresql \
  --skip-bundle
```

Now that every file is in place you can rebuild the web image and create the containers
with this command:

```
docker-compose build web && docker-compose up --detach
```

Finally, you need to enter inside the web container and run a few commands:

Create the development database
```
docker container exec %%REPOSITORY_NAME%%_web_1 rails db:create
```

At this point you should see the rails welcome page at http://localhost:3000, but we are not done yet:

Enter inside the web container with bash:
```
docker container exec --tty --interactive %%REPOSITORY_NAME%%_web_1 bash
```

Then run the following command to install Binda CMS:
```
rails generate binda:install
```

Finally you may need to update your dependencies and reboot the rails application:
```
bundle install && touch tmp/restart.txt
```

Now you should be able to log into the cms at http://localhost:3000/admin_panel.