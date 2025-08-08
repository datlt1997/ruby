module Client
  class DashboardController < BaseController
    def index
      @posts = Post.order(created_at: :desc).page(params[:page]).per(6)
      render 'pages/home'
    end
  end
end
