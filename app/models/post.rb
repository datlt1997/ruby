class Post < ApplicationRecord
    has_one_attached :thumbnail

    validates :title, presence: true
    validates :thumbnail, presence: false, content_type: [:gif, :png, :jpg, :jpeg], size: { less_than: 5.megabytes , message: 'must be less than 5MB in size' }
end
