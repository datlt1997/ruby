class RequestTimer
  def initialize(app)
    @app = app
  end

  def call(env)
    start_time = Time.now

    # Gọi request tiếp theo trong stack
    status, headers, response = @app.call(env)

    duration = ((Time.now - start_time) * 1000).round(2)
    Rails.logger.info "Request took #{duration} ms"

    [status, headers, response]
  end
end
