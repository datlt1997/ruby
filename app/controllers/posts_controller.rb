class PostsController < ApplicationController
  def show
    @post = Post.find(params[:id])

    session_key = "viewed_post_#{@post.id}_at"
    last_viewed_at = session[session_key]

    if last_viewed_at.nil? || Time.now - Time.parse(last_viewed_at) > 1.minute
      @post.increment!(:views_count)
      session[session_key] = Time.now.to_s
    end
  end
end
