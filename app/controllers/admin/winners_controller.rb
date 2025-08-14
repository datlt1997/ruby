module Admin
  class WinnersController < BaseController
    def index
      @winners = Winner.includes(:user, :prize, :select_number).order(created_at: :desc).page(params[:page]).per(5)
      @prizes = Prize
                  .left_joins(:winners)
                  .group("prizes.id")
                  .having("COUNT(winners.id) < prizes.quantity")
    end

    def spin
      @prize = Prize.find(params[:prize_id])

      remaining_quantity = @prize.quantity - Winner.where(prize_id: @prize.id).count
      if remaining_quantity <= 0
        return render json: { error: "Giải thưởng đã hết" }, status: :unprocessable_entity
      end

      available_numbers = SelectNumber
                            .left_joins(:winner)
                            .where(winner: { id: nil })
                            .pluck(:id)

      if available_numbers.empty?
        return render json: { error: "Không còn số nào để quay" }, status: :unprocessable_entity
      end

      selected_id = available_numbers.sample

      # Tạo winner
      winner = Winner.create!(
        prize_id: @prize.id,
        select_number_id: selected_id
      )

      render json: {
        id: winner.id,
        name: winner.user.full_name,
        number: winner.select_number.number,
        prize: winner.prize.name,
        remaining_quantity: remaining_quantity
      }
    end
  end
end
