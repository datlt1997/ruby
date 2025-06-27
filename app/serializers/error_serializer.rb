module ErrorSerializer
    class << self
        def serialize(errors)
            return if errors.nil?

            json = {}
            json[:errors] = errors.to_hash.map { |key, val| render_errors(errors: val, type: key) }.flatten
            json
        end
  
        def render_errors(errors:, type:)
            errors.map do |msg|
                normalized_type = type.to_s.humanize
                msg = "#{normalized_type} #{msg}"
                { type: type, detail: msg }
            end
        end
    end
end
