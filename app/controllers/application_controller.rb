class ApplicationController < ActionController::Base

  before_action :redirect_if_wrong_namespace
  
  helper_method :current_user, :logged_in?, :admin?, :normal_user?

  private

  def current_user
    @current_user ||= User.find_by(id: session[:user_id]) if session[:user_id]
  end

  def logged_in?
    current_user.present?
  end

  def admin?
    current_user&.admin?
  end

  def normal_user?
    current_user&.user?
  end

  def require_login
    unless logged_in?
      redirect_to login_redirect_path, alert: "Bạn cần đăng nhập trước."
    end
  end

  def require_admin
    unless admin?
      redirect_to root_path, alert: "Bạn không có quyền truy cập (admin)."
    end
  end

  def require_user
    unless normal_user?
      redirect_to root_path, alert: "Bạn không có quyền truy cập (user)."
    end
  end

  def login_redirect_path
    if request.path.start_with?("/admin")
      admin_login_path
    else
      user_login_path
    end
  end

  def redirect_if_wrong_namespace
    return unless logged_in?

    path = request.path

    if admin? && !path.start_with?('/admin') && !path.start_with?('/logout')
      redirect_to admin_root_path
    elsif normal_user? && !path.start_with?('/user') && !path.start_with?('/logout')
      redirect_to user_root_path
    end
  end
end

