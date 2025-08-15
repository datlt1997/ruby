module Client
  class DashboardController < BaseController
    def index
      @posts = Post.order(created_at: :desc).page(params[:page]).per(6)
      render 'pages/home'
    end

    def select_number
      @numbers = (1..105).to_a
      @selected_numbers = SelectNumber.pluck(:number)
      @user_number = current_user.select_numbers.first
    end

    def choose_number
      number = params[:number].to_i
      if current_user.select_numbers.exists?
        render json: { success: false, message: "Bạn đã chọn số rồi" }
        return
      end

      if SelectNumber.exists?(number: number)
        render json: { success: false, message: "Số này đã được chọn" }
      else
        SelectNumber.create!(user: current_user, number: number)
        render json: { success: true }
      end
    end

    def results
      @results = Winner.includes(:user, :prize, :select_number)
      @prizeNext = Prize.order(:id).find do |prize|
        prize.winners.count < prize.quantity
      end
    end

    def spin_lucky_number
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
