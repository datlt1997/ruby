class AddColumnIntoPost < ActiveRecord::Migration[7.1]
  def change
      add_column :posts, :image, :string
      add_column :posts, :views_count, :integer
  end
end
