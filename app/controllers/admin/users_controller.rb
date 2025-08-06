module Admin
  class UsersController < BaseController
    before_action :set_user, only: %i[edit update destroy ]

    def index
      @users = User.all
    end

    def new
      @user = User.new
    end

    def edit
    end

    def create
      @user = User.new(post_params)

      respond_to do |format|
        if @user.save
          format.html { redirect_to admin_users_url, notice: "User was successfully created." }
          format.json { render :index, status: :created, location: @user }
        else
          format.html { render :new, status: :unprocessable_entity }
          format.json { render json: @user.errors, status: :unprocessable_entity }
        end
      end
    end

    def update
      respond_to do |format|
        if @user.update(user_params)
          format.html { redirect_to admin_users_url, notice: "User was successfully updated." }
          format.json { render :index, status: :ok, location: @user }
        else
          format.html { render :edit, status: :unprocessable_entity }
          format.json { render json: @user.errors, status: :unprocessable_entity }
        end
      end
    end

    def destroy
      @user.destroy!

      respond_to do |format|
        format.html { redirect_to admin_users_url, notice: "User was successfully destroyed." }
        format.json { head :no_content }
      end
    end

    private
    # Use callbacks to share common setup or constraints between actions.
    def set_user
      @user = User.find(params[:id])
    end

    # Only allow a list of trusted parameters through.
    def user_params
      params.require(:user).permit(:email)
    end

  end
end