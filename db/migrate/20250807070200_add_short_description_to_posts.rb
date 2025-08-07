class AddShortDescriptionToPosts < ActiveRecord::Migration[7.1]
  def change
    add_column :posts, :short_description, :text
  end
end
