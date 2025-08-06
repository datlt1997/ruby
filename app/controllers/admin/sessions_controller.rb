class Admin::SessionsController < ApplicationController
  def new
  end

  def create
    user = User.find_by(email: params[:email], role: :admin)
    if user&.authenticate(params['password'])
      session[:user_id] = user.id
      redirect_to admin_root_path, notice: "Đăng nhập thành công"
    else
      flash.now[:alert] = "Email hoặc mật khẩu không đúng"
      render :new
    end
  end

  def destroy
    session[:user_id] = nil
    redirect_to admin_login_path, notice: "Đã đăng xuất"
  end
end
