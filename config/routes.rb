Rails.application.routes.draw do
  scope '/user', module: 'client', as: 'user' do
    get  'login',  to: 'sessions#new'
    post 'login',  to: 'sessions#create'
    delete 'logout', to: 'sessions#destroy'

    get '/', to: 'dashboard#index'
    root 'dashboard#index'
  end

  namespace :admin do
    get  'login',  to: 'sessions#new'
    post 'login',  to: 'sessions#create'
    delete 'logout', to: 'sessions#destroy'

    get '/', to: 'dashboard#index'
    root 'dashboard#index'

    resources :posts
    resources :users
    resources :tags
  end

  
  get 'home', to: 'pages#home'
  get 'about', to: 'pages#about'

  resources :posts, only: [ :show]

  root 'pages#home'
end
