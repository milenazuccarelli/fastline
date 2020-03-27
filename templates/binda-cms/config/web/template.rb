# Add gems
gem 'binda', '~> 0.1.11'

# Remove git repository
run "rm -rf .git"

# Override database.yml
# Note: yaml files should use spaces over tabs
file 'config/database.yml', <<-YAML
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
YAML
