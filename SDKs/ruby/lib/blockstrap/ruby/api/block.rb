module Blockstrap::Ruby::API
  class Block < BlockstrapAPI
    def id(address)
      self.class.get("/#{VERSION}/#{@chain}/block/id/#{address}")
    end

    def height(address)
      self.class.get("/#{VERSION}/#{@chain}/block/height/#{address}")
    end

    # TODO: support INT_COUNT
    def latest(int_count = nil)
      self.class.get("/#{VERSION}/#{@chain}/block/latest/")
    end

  end
end