class Admin::SessionsController < ApplicationController
  def new
    @user = User.new
  end

  def create
    @user = User.new(user_params)
    if @user.valid?
      user = User.find_by(email: user_params[:email], role: :admin)
      if user&.authenticate(user_params['password'])
        session[:user_id] = user.id
        redirect_to admin_users_path, notice: "Đăng nhập thành công"
      else
        redirect_to admin_login_path, alert: "Email hoặc mật khẩu không đúng"
      end
    else
      flash.now[:errors] = @user.errors.to_hash(true)
      render :new, status: :unprocessable_entity
    end
  end

  def destroy
    session[:user_id] = nil
    redirect_to admin_login_path, notice: "Đã đăng xuất"
  end

  private

  def user_params
    params.require(:user).permit(:email, :password)
  end
end
