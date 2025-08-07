class User < ApplicationRecord
  has_secure_password

  enum role: { user: 0, admin: 1 }

  validates :email,
            presence: true,
            format: { with: URI::MailTo::EMAIL_REGEXP, message: "không hợp lệ" }

  validates :password,
            length: { minimum: 6, message: "phải có ít nhất 6 ký tự" },
            if: -> { new_record? || !password.nil? }
end
