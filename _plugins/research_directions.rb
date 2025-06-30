require 'yaml'

module Jekyll
  class ResearchDirectionsGenerator < Generator
    safe true
    priority :high

    def generate(site)
      research_directions = {}
      research_dir = File.join(site.source, 'research-directions')
      
      return unless Dir.exist?(research_dir)

      Dir.glob(File.join(research_dir, '*')).each do |dir_path|
        next unless File.directory?(dir_path)
        
        dir_name = File.basename(dir_path)
        next if dir_name.start_with?('_') || dir_name == 'README.md'
        
        direction_file = File.join(dir_path, 'direction.md')
        next unless File.exist?(direction_file)
        
        begin
          content = File.read(direction_file)
          if content =~ /\A(---\s*\n.*?\n?)^((---|\.\.\.)\s*$\n?)/m
            front_matter = YAML.safe_load($1)
            body = content[($1.size + $2.size)..-1]
            
            research_directions[dir_name] = front_matter.merge({
              'content' => body,
              'path' => dir_name
            })
          end
        rescue => e
          Jekyll.logger.warn "Research Directions:", "Error processing #{direction_file}: #{e.message}"
        end
      end
      
      # Sort by order field
      research_directions = research_directions.sort_by { |k, v| v['order'] || 999 }.to_h
      
      site.data['research_directions'] = research_directions
    end
  end
end 