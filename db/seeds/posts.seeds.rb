Post.destroy_all

50.times do |index|
    Post.create!(
        title: Faker::Book.title,
        description: Faker::Markdown.emphasis
    )
end
