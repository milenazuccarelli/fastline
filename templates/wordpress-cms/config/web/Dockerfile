FROM wordpress

RUN sed -i 's/80/8080/' /etc/apache2/ports.conf /etc/apache2/sites-enabled/000-default.conf

RUN mv "$PHP_INI_DIR"/php.ini-development "$PHP_INI_DIR"/php.ini

# get various dependencies
RUN apt-get update; \
	apt-get install -yq mariadb-client netcat sudo less

# ensure wordpress has write permission on linux host https://github.com/postlight/headless-wp-starter/issues/202
RUN chown -R www-data:www-data /var/www/html

# include composer-installed executables in $PATH
ENV PATH="/var/www/.composer/vendor/bin:${PATH}"

EXPOSE 8080