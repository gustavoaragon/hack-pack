## Blockstrap PHP SDK

The long-term plan for all of our SDKs is to recreate the full-functionality of our [HTML5 Framework](http://github.com/blockstrap/framework).

For now, the following PHP modules exist:

* __blockstrap__ (core)
* __api__ (requires blockstrap and cache)
* __blockauth__ (authentication via blockchains)
* __cache__ (uses simple session storage)
* __dnkey__ (support for [DNKey](http://dnkey.org) and [BlockAuth](http://blockauth.org)

### Blockstrap Core

Blockstrap core currently provides the following __public__ functions:

* __debug__ (prettier object prints)
* __get_var__ (better $_POST / $_GET functionality)

### API Module

The API module currently provides the following __public__ functions:

* __address__ (mapped to address/transactions)
* __block__ (mapped to block)
* __blocks__ (mapped to block/latest)
* __decode__ (mapped to transaction/decode)
* __dnkey__ (mapped to transaction/decode)
* __height__ (mapped to block/height)
* __market__ (mapped to market/stats)
* __relay__ (mapped to transaction/relay)
* __transaction__ (mapped to transaction/id)

The Cache Module is required for all external API calls.

### BlockAuth Module

The BlockAuth module currently provides the following __public__ functions:

* __check__ (checks the supplied transaction to verify the supplied password)
* __login__ (basic wrapper to first collect DNKey info if supplied before checking credentials)

The API Module is required for the __check__ function to work.

The DNKey Module s required for the __login__ function to work.

### Cache Module

The cache module currently provides the following __public__ functions:

* __read__ (read from session storage)
* __write__ (write to session storage)

### DNKey Module

The DNKey module currently provides the following __public__ functions:

* __api__ (used if accessed via api module)
* __get__ (used if from standalone include)

--------------------------

For more information, please visit - [docs.blockstrap.com](http://docs.blockstrap.com)