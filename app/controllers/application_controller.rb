class ApplicationController < ActionController::Base
  protect_from_forgery with: :exception
  add_flash_types :success

  include Authentication
  include Chat
  include Localisation

  COOKIE_MESSAGE_COOKIE_NAME  = '_cookie_notice'
  COOKIE_MESSAGE_COOKIE_VALUE = 'y'

  def syndicated_tool_request?
    !!request.headers['X-Syndicated-Tool']
  end

  helper_method :syndicated_tool_request?

  def parent_template
    if syndicated_tool_request?
      response.headers['X-Frame-Options'] = 'ALLOWALL'
      'layouts/engine_syndicated'
    else
      'layouts/engine'
    end
  end

  helper_method :parent_template

  def not_found
    fail ActionController::RoutingError.new('Not Found')
  end

  def cookies_not_accepted?
    cookies.permanent[COOKIE_MESSAGE_COOKIE_NAME] != COOKIE_MESSAGE_COOKIE_VALUE
  end

  helper_method :cookies_not_accepted?

  def display_search_box_in_header?
    true
  end

  helper_method :display_search_box_in_header?

  def display_menu_button_in_header?
    true
  end

  helper_method :display_menu_button_in_header?

  def contact_panels_border_top?
    false
  end

  helper_method :contact_panels_border_top?

  def display_skip_to_main_navigation?
    true
  end

  helper_method :display_skip_to_main_navigation?

  def alerts?
    flash.keys.any?
  end

  helper_method :alerts?

  private

  def category_tree
    @category_tree ||= Core::CategoryTreeReader.new.call
  end

  def category_navigation
    @category_navigation ||= CategoryNavigationDecorator.decorate_collection(category_tree.children)
  end

  helper_method :category_navigation

  def hide_elements_irrelevant_for_third_parties?
    false
  end

  helper_method :hide_elements_irrelevant_for_third_parties?
end
