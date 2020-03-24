# Add gems
gem "binda"

# Install dependencies
run "bundle install"

# Remove git repository
run "rm -rf .git"

# Override database.yml
file 'config/database.yml', <<-CODE
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
CODE