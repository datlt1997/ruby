class CreateSelectNumbers < ActiveRecord::Migration[7.1]
  def change
    create_table :select_numbers do |t|
      t.references :user, null: false, foreign_key: true
      t.integer :number

      t.timestamps
    end
  end
end
