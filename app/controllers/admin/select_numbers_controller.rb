module Admin
  class SelectNumbersController < BaseController
    def index
      @selectNumbers = SelectNumber.includes(:user).order(created_at: :desc).page(params[:page]).per(5)

    end
  end

end
