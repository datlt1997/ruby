class CreateWinners < ActiveRecord::Migration[7.1]
  def change
    create_table :winners do |t|
      t.references :select_number, null: false, foreign_key: true
      t.references :prize, null: false, foreign_key: true

      t.timestamps
    end
  end
end
