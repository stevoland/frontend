source 'https://rubygems.org'

gem 'rails', '4.1.0.beta1'

gem 'activeresource', '~> 4.0.0'
gem 'autoprefixer-rails'
gem 'coffee-rails', '~> 4.0.0'
gem 'compass-rails'
gem 'draper', '~> 1.3.0'
gem 'foreman'
gem 'jquery-rails'
gem 'kss'
gem 'meta-tags', require: 'meta_tags'
gem 'nokogiri'
gem 'rouge'
gem 'sass-rails', '~> 4.0.0.rc1'
gem 'turbolinks'
gem 'uglifier', '>= 1.3.0'
gem 'unicorn-rails'
gem 'singularitygs'
gem 'syslog-logger'

group :development do
  gem 'guard-cucumber'
  gem 'guard-livereload'
  gem 'guard-rails'
  gem 'guard-rspec'
  gem 'guard-sass'
  gem 'spring'
end

group :test do
  gem 'faker'
  gem 'mas-development_dependencies',
      git: 'https://github.com/moneyadviceservice/mas-development_dependencies.git'

  gem 'rspec_junit_formatter'
  gem 'vcr'
  gem 'webmock'
end

group :test, :development do
  gem 'ejs'
  gem 'dotenv-rails'
  gem 'konacha'
end

group :doc do
  gem 'sdoc', require: false
end
