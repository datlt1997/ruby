class User < ApplicationRecord
  has_secure_password

  enum role: { user: 0, admin: 1 }

  validates :email, presence: true, uniqueness: true, length: { in: 6..50}
  validates :password, presence: true, length: {minimum: 6}
end
