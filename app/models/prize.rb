class Prize < ApplicationRecord
  has_many :winners

  has_one_attached :image, dependent: :purge_later

  before_destroy :purge_image

  private

  def purge_image
    image.purge_later if image.attached?
  end
end