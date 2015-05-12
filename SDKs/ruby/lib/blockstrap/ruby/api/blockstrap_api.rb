module Blockstrap::Ruby::API
  class BlockstrapAPI
    include HTTParty
    VERSION = 'v0'
    base_uri 'api.blockstrap.com'

    def initialize(chain = 'btc')
      @chain = chain.to_s
    end

  end
end
