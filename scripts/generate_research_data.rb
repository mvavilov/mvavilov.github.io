#!/usr/bin/env ruby

require 'yaml'
require 'fileutils'

# Script to generate research directions data from the research-directions folder
# This maintains the decoupled design while working with GitHub Pages

def parse_front_matter(content)
  return nil unless content.start_with?('---')
  
  parts = content.split('---', 3)
  return nil if parts.length < 3
  
  begin
    front_matter = YAML.safe_load(parts[1])
    markdown_content = parts[2].strip
    
    return {
      front_matter: front_matter,
      content: markdown_content
    }
  rescue => e
    puts "Error parsing YAML: #{e.message}"
    return nil
  end
end

def generate_research_data
  research_directions = {}
  research_dir = 'research-directions'
  
  return unless Dir.exist?(research_dir)
  
  Dir.glob(File.join(research_dir, '*')).each do |dir_path|
    next unless File.directory?(dir_path)
    
    dir_name = File.basename(dir_path)
    next if dir_name.start_with?('_') || dir_name == 'README.md'
    
    direction_file = File.join(dir_path, 'direction.md')
    next unless File.exist?(direction_file)
    
    begin
      content = File.read(direction_file)
      parsed = parse_front_matter(content)
      
      if parsed
        research_directions[dir_name] = parsed[:front_matter].merge({
          'content' => parsed[:content],
          'path' => dir_name
        })
      end
    rescue => e
      puts "Error processing #{direction_file}: #{e.message}"
    end
  end
  
  # Sort by order field
  sorted_directions = research_directions.sort_by { |k, v| v['order'] || 999 }.to_h
  
  # Write to _data directory
  FileUtils.mkdir_p('_data')
  File.write('_data/research_directions.yml', sorted_directions.to_yaml)
  
  puts "Generated research directions data for #{sorted_directions.keys.join(', ')}"
end

# Run the script
if __FILE__ == $0
  generate_research_data
end 