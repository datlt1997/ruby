class PostsController < ApplicationController
    before_action :set_post, only: [:edit, :update, :destroy]

    def index
        @posts = Post.paginate(page: params[:page], per_page: 10)
    end

    def new
        @post = Post.new
    end

    def create
        @post = Post.new(post_params)

        if @post.save
            return redirect_to posts_path, notice: 'Post was successfully created.'
        else
            render json: ErrorSerializer.serialize(@post.errors), status: :unprocessable_entity
        end
    end

    def edit
    end

    def update
        if @post.thumbnail.attached? && params[:thumbnail]
            @post.thumbnail.purge
        end

        if @post.update(post_params)
            return redirect_to posts_path, notice: 'Post was successfully updated.'
        else
            render json: ErrorSerializer.serialize(@post.errors), status: :unprocessable_entity
        end
    end

    def destroy
        @post.destroy

        redirect_to posts_path, notice: 'Post was successfully destroyed.'
    end

    private

    def set_post
        @post = Post.find(params[:id])
    end

    def post_params
        params.require(:post).permit(:title, :description, :thumbnail)
    end
end
