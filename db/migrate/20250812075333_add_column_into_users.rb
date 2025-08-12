class AddColumnIntoUsers < ActiveRecord::Migration[7.1]
  def change
    add_column :users, :full_name, :text
    add_column :users, :phone, :text
  end
end
