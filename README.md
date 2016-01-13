StatsD integration
==========================

Netuitive offers a backend plugin for [StatsD](https://github.com/etsy/statsd) that allows you to monitor your StatsD metric data with Netuitive Cloud. Setting up a StatsD integration is a 3-step process:

### 1. Create a StatsD datasource in Netuitive Cloud.
**1.1** On the Account Profile page, select Datasources.

**1.2** Click New Datasource, then choose StatsD.

**1.3** Type a name for the datasource. Ensure that the Enabled checkbox is selected.

**1.4** Click Generate to save the datasource and generate an API key.

### 2. Save netuitive.js and the netuitive directory in your StatsD backends directory.
**2.1** Clone netuitive.js and the netuitive directory found [here](https://github.com/Netuitive/statsd-netuitive-backend).

**2.2** Save both in your StatsD backends directory.

### 3. Edit your StatsD configuration file.
**3.1** Add "./backends/netuitive" to the backends section of your StatsD configuration file, as shown in the code below.

```js
{
    backends:[
        "./backends/netuitive"
    ]
}
```

**3.2** Add the API key generated in Step 1, as well as the API Host and API Port shown in the code below, to your configuration file.

```js
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
```

**3.3** In order to associate StatsD metrics with an element in Netuitive, add at least one mapping for Netuitive in the mappings section of your configuration file. Each mapping uses a regular expression (regex) that corresponds to a set of keys in StatsD. If the element or metric name is in the StatsD key, it can be represented by $(regex-captured-group-number), demonstrated in the code below. Element and metric names can also be written as string literals.

**Note:** You can define more than one mapping to capture multiple metrics that belong to the same element, or to capture different elements. There are many online regex tools available that can help you with this mapping process, e.g. [regex101](https://www.regex101.com).
**Note:** You can add tags to metric, for each tag block, name is required; both name and value can use either $(regex-captured-group-number) or string literal

```js
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
          name: "$2",
          tags: [
            {name: "$3", value: "tagValue"}
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
```

**Note:** Each element requires a type, which is written as a string literal. In the example above, the element type is "ANA Server."

**Note:** Each metric name has its metric type appended before matching against pattern, i.e. ".counter", ".gauge", ".timer.<timer-key>".

**3.4** We recommend setting the flush interval to 60000 milliseconds. This will ensure that your StatsD data is collected by Netuitive every 1 minute.

**3.5** After saving the configuration file, restart StatsD to begin monitoring your data with Netuitive Cloud.
