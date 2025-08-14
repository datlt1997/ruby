module Admin
  class SelectNumbersController < BaseController
    def index
      @selectNumbers = SelectNumber.includes(:user).order(created_at: :desc).page(params[:page]).per(5)

    end

    def available
      prize = Prize.find(params[:prize_id])
      taken_ids = Winner.pluck(:select_number_id)
      numbers = SelectNumber.where.not(id: taken_ids).pluck(:number)

      render json: { numbers: numbers }
    end
  end

end
