Rails.application.routes.draw do
  scope "(:locale)", locale: /en|vi/ do
    scope '/user', module: 'client', as: 'user' do
      get  'login',  to: 'sessions#new'
      post 'login',  to: 'sessions#create'
      delete 'logout', to: 'sessions#destroy'

      resources :posts, only: [ :show]

      get '/select-number', to: 'dashboard#select_number'
      post '/choose-number', to: 'dashboard#choose_number'
      get '/results', to: 'dashboard#results'
      post 'spin-lucky-number', to: 'dashboard#spin_lucky_number'
      root 'dashboard#select_number'
    end

  namespace :admin do
    get  'login',  to: 'sessions#new'
    post 'login',  to: 'sessions#create'
    delete 'logout', to: 'sessions#destroy'

    get '/', to: 'dashboard#index'
    root 'dashboard#index'

    resources :posts, :users, :tags, :prizes, :winners
    resources :select_numbers, only: [ :index]
    get "/select_numbers/available", to: "select_numbers#available"
    resources :winners, only: [:index] do
      post :spin, on: :collection
    end

  end

  
    get 'home', to: 'pages#home'

    resources :posts, only: [ :show]

    root 'pages#home'
  end
end
