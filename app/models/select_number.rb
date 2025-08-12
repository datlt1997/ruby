class SelectNumber < ApplicationRecord
  belongs_to :user
  has_one :winner
end