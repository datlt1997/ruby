class User < ApplicationRecord
  has_secure_password

  enum role: { user: 0, admin: 1 }

  has_many :select_numbers
  has_many :winners

  validates :email,
            presence: true,
            format: { with: URI::MailTo::EMAIL_REGEXP, message: "không hợp lệ" }

  validates :password,
            length: { minimum: 6, message: "phải có ít nhất 6 ký tự" },
            if: -> { new_record? || !password.nil? }

  has_one_attached :avatar, dependent: :purge_later

  before_destroy :purge_avatar

  private

  def purge_avatar
    image.purge_later if image.attached?
  end
end
