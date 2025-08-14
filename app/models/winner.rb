class Winner < ApplicationRecord
  belongs_to :prize
  belongs_to :select_number
  has_one :user, through: :select_number
end