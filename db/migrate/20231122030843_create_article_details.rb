class CreateArticleDetails < ActiveRecord::Migration[7.1]
  def change
    create_table :article_details do |t|
      t.string :title, null: false
      t.timestamps
    end
  end
end
