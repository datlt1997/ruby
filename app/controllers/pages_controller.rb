class PagesController < ApplicationController
  def home
    @numbers = (1..105).to_a
  end
end
