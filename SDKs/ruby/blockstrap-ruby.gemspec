# coding: utf-8
lib = File.expand_path('../lib', __FILE__)
$LOAD_PATH.unshift(lib) unless $LOAD_PATH.include?(lib)
require 'blockstrap/ruby/version'

Gem::Specification.new do |spec|
  spec.name          = "blockstrap-ruby"
  spec.version       = Blockstrap::Ruby::VERSION
  spec.authors       = ["parasquid"]
  spec.email         = ["tristan.gomez@gmail.com"]

  spec.summary       = %q{Ruby wrapper around the blockstrap API}
  spec.description   = %q{Ruby wrapper around the blockstrap API}
  spec.homepage      = "https://github.com/blockstrap/blockstrap-ruby"
  spec.license       = "MIT"

  spec.files         = `git ls-files -z`.split("\x0").reject { |f| f.match(%r{^(test|spec|features)/}) }
  spec.bindir        = "exe"
  spec.executables   = spec.files.grep(%r{^exe/}) { |f| File.basename(f) }
  spec.require_paths = ["lib"]

  if spec.respond_to?(:metadata)
    spec.metadata['allowed_push_host'] = "TODO: Set to 'http://mygemserver.com' to prevent pushes to rubygems.org, or delete to allow pushes to any server."
  end

  spec.add_dependency "httparty"

  spec.add_development_dependency "bundler", "~> 1.9"
  spec.add_development_dependency "rake", "~> 10.0"
  spec.add_development_dependency "guard-rspec"
  spec.add_development_dependency "rspec"
  spec.add_development_dependency "pry"
  spec.add_development_dependency "webmock"

end
