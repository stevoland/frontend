module World
  module Pages
    def current_page
      UI::Page.new
    end

    pages = %w(
      account
      article
      article_feedback
      home
      action_plan
      category
      partners
      search_results
      static
      technical_feedback
      news_article
      news
      sign_up
      sign_in
      profile
      forgot_password
    )

    pages.each do |page|
      define_method("#{page}_page") do
        "UI::Pages::#{page.camelize}".constantize.new
      end
    end
  end
end

World(World::Pages)
