def dd(*args)
  puts "\n=== dd() output ==="
  args.each { |a| pp a } # pretty-print
  puts "=== end dd() ===\n"
  exit
end
