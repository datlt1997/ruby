FROM ruby:3.2.2

WORKDIR /var/www

RUN apt-get update && \
    apt-get install -y \
    build-essential \
    nodejs && \
    rm -rf /var/lib/apt/lists/*

# Install gems
COPY Gemfile Gemfile.lock ./
RUN gem install bundler && \
    bundle install --jobs 4

EXPOSE 3000

CMD ["rails", "server", "-b", "0.0.0.0"]
