// TODO: move this in each separate template
export const templates = {
  "wordpress-and-node-app": {
    repositoryName: "repo",
    environment: "staging",
    WORDPRESS_API_URL: "%WORDPRESS_API_URL%",
    MYSQL_DATABASE: "%%MYSQL_DATABASE"
  },
  "wordpress-and-traefik": {
    repositoryName: "repo",
    environment: "staging",
    WORDPRESS_API_URL: "%WORDPRESS_API_URL%",
    MYSQL_DATABASE: "%%MYSQL_DATABASE"
  }
};
