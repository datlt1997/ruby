class CreatePrizes < ActiveRecord::Migration[7.1]
  def change
    create_table :prizes do |t|
      t.string :name, null: false
      t.integer :quantity, null: false
      t.text :description

      t.timestamps
    end
  end
end
