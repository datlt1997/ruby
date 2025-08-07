class Post < ApplicationRecord
    has_many :post_tags, dependent: :destroy
    has_many :tags, through: :post_tags

    has_one_attached :image, dependent: :purge_later

    before_destroy :purge_image

    private

    def purge_image
        image.purge_later if image.attached?
    end
end
