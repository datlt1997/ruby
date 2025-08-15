module Admin
  class PrizesController < BaseController
  before_action :set_prize, only: %i[ show edit update destroy ]

  # GET /prizes or /prizes.json
  def index
    @prizes = Prize.order(created_at: :desc).page(params[:page]).per(10)
    
  end

  # GET /prizes/1 or /prizes/1.json
  def show
  end

  # GET /prizes/new
  def new
    @prize = Prize.new
  end

  # GET /prizes/1/edit
  def edit
  end

  # POST /prizes or /prizes.json
  def create
    @prize = Prize.new(prize_params)

    respond_to do |format|
      if @prize.save
        format.html { redirect_to admin_prizes_url, notice: "Prizes was successfully created." }
        format.json { render :index, status: :created, location: @prize }
      else
        format.html { render :new, status: :unprocessable_entity }
        format.json { render json: @prize.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /prizes/1 or /prizes/1.json
  def update
    respond_to do |format|
      if @prize.update(prize_params)
        format.html { redirect_to admin_prizes_url, notice: "Prizes was successfully updated." }
        format.json { render :index, status: :ok, location: @prize }
      else
        format.html { render :edit, status: :unprocessable_entity }
        format.json { render json: @prize.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /prizes/1 or /prizes/1.json
  def destroy
    @prize.destroy!

    respond_to do |format|
      format.html { redirect_to admin_prizes_url, notice: "Prizes was successfully destroyed." }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_prize
      @prize = Prize.find(params[:id])
    end

    # Only allow a list of trusted parameters through.
    def prize_params
      params.require(:prize).permit(:name, :quantity, :description, :image)
    end
  end
end
