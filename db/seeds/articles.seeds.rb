ArticleDetail.destroy_all

50.times do |index|
    ArticleDetail.create!(
        title: Faker::Book.title
    )
end
