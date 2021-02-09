Netuitive StatsD Backend Plugin
==========================

Netuitive offers a backend plugin for [StatsD](https://github.com/etsy/statsd) that allows you to monitor your StatsD metric data with [Virtana](https://www.virtana.com/products/cloudwisdom/). 

For more information on the StatsD integration with Netuitive, see our [help docs](https://docs.virtana.com/en/etsy-statsd.html), or contact Netuitive support at [cloudwisdom.support@virtana.com](mailto:cloudwisdom.support@virtana.com).

Installing the Plugin
----------------------

1. Create a StatsD datasource in Netuitive (you'll need a Netuitive account).

1. Clone netuitive.js and the netuitive directory from this project.

1. Save both in your StatsD `backends` directory.

1. Add `./backends/netuitive` to the `backends` section of your StatsD configuration file as shown in the code below.

            {
                backends:[
                    "./backends/netuitive"
                ]
            }

1. Add the API key generated from creating a StatsD datasource in Netuitive as well as the API Host and API port shown in the code below to your configuration file.

        {
            backends:[
                "./backends/netuitive"
            ],
            netuitive: {
                apiKey: "YOUR_API_KEY",
                apiHost: "YOUR_NETUITIVE_API_HOST",
                apiPort: 443,
            }
        }

1. Add at least one mapping for Netuitive in the `mappings` section of your configuration file.

        {
            backends:["./backends/netuitive"],
            netuitive: {
                apiKey: "YOUR_API_KEY",
                apiHost: "YOUR_NETUITIVE_API_HOST",
                apiPort: 443,
                mappings: [
                    {
                      pattern: "(.*?app.*?)\\.(.*?\\.mean)\\.gauge",
                      element: {
                        type: "APP Server",
                        name: "$1",
                        metric: {
                          name: "$2"
                        }
                      }
                    },
                    {
                      pattern: "(.*?app.*?)\\.(service.utilization)\\.gauge",
                        element: {
                          type: "APP Server",
                          name: "$1",
                          metric: {
                            name: "$2",
                            tags: [
                                {"name": "utilization", "value":"true"}
                            ]
                          }
                        }
                     },
                    {
                      pattern: "\^(statsd\\..*)",
                      element: {
                        type: "StatsD",
                        name: "StatsD",
                        metric: {
                          name: "$1"
                        }
                      }
                    },
                    {
                      pattern: "\^(timestamp_lag.*)",
                      element: {
                        type: "StatsD",
                        name: "StatsD",
                        metric: {
                          name: "statsd.$1"
                        }
                      }
                    }
                ]
            }
        }

1. Set the flush interval to 60000 milliseconds.

1. Save the configuration file and restart StatsD.
