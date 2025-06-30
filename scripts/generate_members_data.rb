#!/usr/bin/env ruby

require 'json'
require 'yaml'
require 'fileutils'

# Script to generate members data from the centralized /members/ directory
# This maintains the decoupled design with centralized member management

def generate_members_data
  members = {}
  members_dir = 'members'
  
  unless Dir.exist?(members_dir)
    puts "Members directory not found. Creating empty members data."
    FileUtils.mkdir_p('_data')
    File.write('_data/members.yml', {}.to_yaml)
    return
  end
  
  # Find all JSON files in members directory
  Dir.glob(File.join(members_dir, '*.json')).each do |json_file|
    member_name = File.basename(json_file, '.json')
    
    begin
      # Read member data
      member_data = JSON.parse(File.read(json_file))
      
      # Look for corresponding image file
      image_extensions = ['.jpg', '.jpeg', '.png', '.webp']
      image_file = nil
      
      image_extensions.each do |ext|
        potential_image = File.join(members_dir, "#{member_name}#{ext}")
        if File.exist?(potential_image)
          image_file = "#{member_name}#{ext}"
          break
        end
      end
      
      # If no image found, use default.jpg
      image_file = 'default.jpg' unless image_file
      
      # Store member data
      members[member_name] = {
        'name' => member_data['name'] || member_name.gsub('-', ' ').split.map(&:capitalize).join(' '),
        'image' => image_file,
        'personal_website' => member_data['personal_website'],
        'social_media' => member_data['social_media'] || {},
        'bio' => member_data['bio'],
        'position' => member_data['position'] || 'Graduate Student',
        'email' => member_data['email']
      }
      
    rescue JSON::ParserError => e
      puts "Error parsing JSON for #{member_name}: #{e.message}"
    rescue => e
      puts "Error processing member #{member_name}: #{e.message}"
    end
  end
  
  # Write to _data directory
  FileUtils.mkdir_p('_data')
  File.write('_data/members.yml', members.to_yaml)
  
  puts "Generated members data for #{members.keys.join(', ')}"
end

# Run the script
if __FILE__ == $0
  generate_members_data
end 