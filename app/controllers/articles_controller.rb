class ArticlesController < ApplicationController
    def index
        @article_details = ArticleDetail.paginate(page: params[:page], per_page: 555)
    end
end
