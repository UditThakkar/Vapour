# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).
#
# Examples:
#
#   cities = City.create([{ name: 'Chicago' }, { name: 'Copenhagen' }])
#   Mayor.create(name: 'Emanuel', city: cities.first)

TYPICAL_TAGS = %w(role-playing action adventure simulation strategy sports
   first-person third-person puzzle survival singleplayer multiplayer
   co-op indie casual horror)

TYPICAL_TAGS.each do |tag_type|
  Tag.create(name: tag_type)
end

seeded_users = []
5.times do
  user = User.new({
    username: Faker::Internet.user_name,
    password: "password",
    email: Faker::Internet.safe_email
  })
  user.save
  seeded_users.push(user)
end

TYPICAL_GAME_NAMES = %w(Slayer Dragon Keyboard Hero Resident-Evil Mario-Kart
  Super-Smash-Bros James-Bond Water Binding-Of-Isaac Dota2 Hearthstone)

TYPICAL_GAME_NAMES.each do |game_name|
  game = Game.create({
    title: game_name,
    synopsis: Faker::Lorem.sentence,
    description: Faker::Lorem.paragraph,
    author_id: seeded_users.sample.id,
    price: Faker::Commerce.price
  })
  rand(1..3).floor.times do
    Tagging.create({
      game_id: game.id,
      tag_id: rand(1..TYPICAL_TAGS.length).floor
    })
  end
end
