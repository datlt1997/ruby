module Client
  class BaseController < ApplicationController
    before_action :require_login
    before_action :require_user
    before_action :require_user_namespace_access  

    private

    def require_user_namespace_access
      unless current_user&.user?
        reset_session
        redirect_to user_login_path, alert: "Không có quyền truy cập user."
      end
    end
  end
end