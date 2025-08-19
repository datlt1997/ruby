module Admin
  class BaseController < ApplicationController
    layout 'admin'
    
    before_action :require_login
    before_action :require_admin
    before_action :require_admin_namespace_access

    private

    def require_admin_namespace_access
      unless current_user&.admin?
        reset_session
        redirect_to admin_login_path(locale: I18n.locale), alert: "Không có quyền truy cập admin."
      end
    end
  end
end
