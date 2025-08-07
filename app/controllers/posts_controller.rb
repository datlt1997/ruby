class PostsController < ApplicationController
  def show
    @post = Post.find(params[:id])

    unless session["viewed_post_#{@post.id}"]
      @post.increment!(:views_count)
      session["viewed_post_#{@post.id}"] = true
    end
  end
end
