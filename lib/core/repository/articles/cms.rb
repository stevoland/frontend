module Core::Repository
  module Articles
    class Cms < Core::Repository::Base
      def initialize(options={})
        self.connection = Core::Registry::Connection[:cms]
        self.fallback_repository = options[:fallback]
      end

      def find(id)
        response = connection.get('/articles/%{id}.json' %
                                    { locale: I18n.locale, id: id })

        attributes = response.body
        links      = response.headers['link'].try(:links) || []

        attributes['alternates'] = []
        links.each do |link|
          next unless link['rel'] == 'alternate'

          attributes['alternates'] << { url: link.href, title: link['title'], hreflang: link['hreflang'] }
        end

        attributes

      rescue
        fallback_repository.find(id)
      end

      private

      attr_accessor :connection, :fallback_repository

    end
  end
end
