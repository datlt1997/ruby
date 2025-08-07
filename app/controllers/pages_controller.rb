class PagesController < ApplicationController
  def home
    @posts = Post.order(created_at: :desc).page(params[:page]).per(6)
  end

  def about
  end
end
