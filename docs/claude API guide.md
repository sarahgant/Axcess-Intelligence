# Overview

## Accessing the API

The API is made available via our web [Console](https://console.anthropic.com/). You can use the [Workbench](https://console.anthropic.com/workbench) to try out the API in the browser and then generate API keys in [Account Settings](https://console.anthropic.com/account/keys). Use [workspaces](https://console.anthropic.com/settings/workspaces) to segment your API keys and [control spend](/en/api/rate-limits) by use case.

## Authentication

All requests to the Anthropic API must include an `x-api-key` header with your API key. If you are using the Client SDKs, you will set the API when constructing a client, and then the SDK will send the header on your behalf with every request. If integrating directly with the API, you'll need to send this header yourself.

## Content types

The Anthropic API always accepts JSON in request bodies and returns JSON in response bodies. You will need to send the `content-type: application/json` header in requests. If you are using the Client SDKs, this will be taken care of automatically.

## Request size limits

The API has a maximum request size of 32 MB for standard endpoints, including the Messages API and Token Counting API. If you exceed this limit, you'll receive a 413 `request_too_large` error from Cloudflare. Specific endpoints have different limits:

* **Standard endpoints** (Messages, Token Counting): 32 MB
* **[Batch API](/en/docs/build-with-claude/batch-processing)**: 256 MB
* **[Files API](/en/docs/build-with-claude/files)**: 500 MB

## Response Headers

The Anthropic API includes the following headers in every response:

* `request-id`: A globally unique identifier for the request.

* `anthropic-organization-id`: The organization ID associated with the API key used in the request.

## Examples

<Tabs>
  <Tab title="curl">
    ```bash Shell
    curl https://api.anthropic.com/v1/messages \
         --header "x-api-key: $ANTHROPIC_API_KEY" \
         --header "anthropic-version: 2023-06-01" \
         --header "content-type: application/json" \
         --data \
    '{
        "model": "claude-opus-4-20250514",
        "max_tokens": 1024,
        "messages": [
            {"role": "user", "content": "Hello, world"}
        ]
    }'
    ```
  </Tab>

  <Tab title="Python">
    Install via PyPI:

    ```bash
    pip install anthropic
    ```

    ```Python Python
    import anthropic

    client = anthropic.Anthropic(
        # defaults to os.environ.get("ANTHROPIC_API_KEY")
        api_key="my_api_key",
    )
    message = client.messages.create(
        model="claude-opus-4-20250514",
        max_tokens=1024,
        messages=[
            {"role": "user", "content": "Hello, Claude"}
        ]
    )
    print(message.content)
    ```
  </Tab>

  <Tab title="TypeScript">
    Install via npm:

    ```bash
    npm install @anthropic-ai/sdk
    ```

    ```TypeScript TypeScript
    import Anthropic from '@anthropic-ai/sdk';

    const anthropic = new Anthropic({
      apiKey: 'my_api_key', // defaults to process.env["ANTHROPIC_API_KEY"]
    });

    const msg = await anthropic.messages.create({
      model: "claude-opus-4-20250514",
      max_tokens: 1024,
      messages: [{ role: "user", content: "Hello, Claude" }],
    });
    console.log(msg);
    ```
  </Tab>
</Tabs>


# Rate limits

> To mitigate misuse and manage capacity on our API, we have implemented limits on how much an organization can use the Claude API.

We have two types of limits:

1. **Spend limits** set a maximum monthly cost an organization can incur for API usage.
2. **Rate limits** set the maximum number of API requests an organization can make over a defined period of time.

We enforce service-configured limits at the organization level, but you may also set user-configurable limits for your organization's workspaces.

These limits apply to both Standard and Priority Tier usage. For more information about Priority Tier, which offers enhanced service levels in exchange for committed spend, see [Service Tiers](/en/api/service-tiers).

## About our limits

* Limits are designed to prevent API abuse, while minimizing impact on common customer usage patterns.
* Limits are defined by usage tier, where each tier is associated with a different set of spend and rate limits.
* Your organization will increase tiers automatically as you reach certain thresholds while using the API.
  Limits are set at the organization level. You can see your organization's limits in the [Limits page](https://console.anthropic.com/settings/limits) in the [Anthropic Console](https://console.anthropic.com/).
* You may hit rate limits over shorter time intervals. For instance, a rate of 60 requests per minute (RPM) may be enforced as 1 request per second. Short bursts of requests at a high volume can surpass the rate limit and result in rate limit errors.
* The limits outlined below are our standard tier limits. If you're seeking higher, custom limits or Priority Tier for enhanced service levels, contact sales through the [Anthropic Console](https://console.anthropic.com/settings/limits).
* We use the [token bucket algorithm](https://en.wikipedia.org/wiki/Token_bucket) to do rate limiting. This means that your capacity is continuously replenished up to your maximum limit, rather than being reset at fixed intervals.
* All limits described here represent maximum allowed usage, not guaranteed minimums. These limits are intended to reduce unintentional overspend and ensure fair distribution of resources among users.

## Spend limits

Each usage tier has a limit on how much you can spend on the API each calendar month. Once you reach the spend limit of your tier, until you qualify for the next tier, you will have to wait until the next month to be able to use the API again.

To qualify for the next tier, you must meet a deposit requirement. To minimize the risk of overfunding your account, you cannot deposit more than your monthly spend limit.

### Requirements to advance tier

<table>
  <thead>
    <tr><th>Usage Tier</th><th>Credit Purchase</th><th>Max Usage per Month</th></tr>
  </thead>

  <tbody>
    <tr><td>Tier 1</td><td>\$5</td><td>\$100</td></tr>
    <tr><td>Tier 2</td><td>\$40</td><td>\$500</td></tr>
    <tr><td>Tier 3</td><td>\$200</td><td>\$1,000</td></tr>
    <tr><td>Tier 4</td><td>\$400</td><td>\$5,000</td></tr>
    <tr><td>Monthly Invoicing</td><td>N/A</td><td>N/A</td></tr>
  </tbody>
</table>

## Rate limits

Our rate limits for the Messages API are measured in requests per minute (RPM), input tokens per minute (ITPM), and output tokens per minute (OTPM) for each model class.
If you exceed any of the rate limits you will get a [429 error](/en/api/errors) describing which rate limit was exceeded, along with a `retry-after` header indicating how long to wait.

ITPM rate limits are estimated at the beginning of each request, and the estimate is adjusted during the request to reflect the actual number of input tokens used.
The final adjustment counts `input_tokens` and `cache_creation_input_tokens` towards ITPM rate limits, while `cache_read_input_tokens` are not (though they are still billed).
In some instances, `cache_read_input_tokens` are counted towards ITPM rate limits.

OTPM rate limits are estimated based on `max_tokens` at the beginning of each request, and the estimate is adjusted at the end of the request to reflect the actual number of output tokens used.
If you're hitting OTPM limits earlier than expected, try reducing `max_tokens` to better approximate the size of your completions.

Rate limits are applied separately for each model; therefore you can use different models up to their respective limits simultaneously.
You can check your current rate limits and behavior in the [Anthropic Console](https://console.anthropic.com/settings/limits).

<Tabs>
  <Tab title="Tier 1">
    | Model                               | Maximum requests per minute (RPM) | Maximum input tokens per minute (ITPM) | Maximum output tokens per minute (OTPM) |
    | ----------------------------------- | --------------------------------- | -------------------------------------- | --------------------------------------- |
    | Claude Opus 4                       | 50                                | 30,000                                 | 8,000                                   |
    | Claude Sonnet 4                     | 50                                | 30,000                                 | 8,000                                   |
    | Claude Sonnet 3.7                   | 50                                | 20,000                                 | 8,000                                   |
    | Claude Sonnet 3.5 <br /> 2024-10-22 | 50                                | 40,000\*                               | 8,000                                   |
    | Claude Sonnet 3.5 <br /> 2024-06-20 | 50                                | 40,000\*                               | 8,000                                   |
    | Claude Haiku 3.5                    | 50                                | 50,000\*                               | 10,000                                  |
    | Claude Opus 3                       | 50                                | 20,000\*                               | 4,000                                   |
    | Claude Sonnet 3                     | 50                                | 40,000\*                               | 8,000                                   |
    | Claude Haiku 3                      | 50                                | 50,000\*                               | 10,000                                  |

    Limits marked with asterisks (\*) count `cache_read_input_tokens` towards ITPM usage.
  </Tab>

  <Tab title="Tier 2">
    | Model                               | Maximum requests per minute (RPM) | Maximum input tokens per minute (ITPM) | Maximum output tokens per minute (OTPM) |
    | ----------------------------------- | --------------------------------- | -------------------------------------- | --------------------------------------- |
    | Claude Opus 4                       | 1,000                             | 450,000                                | 90,000                                  |
    | Claude Sonnet 4                     | 1,000                             | 450,000                                | 90,000                                  |
    | Claude Sonnet 3.7                   | 1,000                             | 40,000                                 | 16,000                                  |
    | Claude Sonnet 3.5 <br /> 2024-10-22 | 1,000                             | 80,000\*                               | 16,000                                  |
    | Claude Sonnet 3.5 <br /> 2024-06-20 | 1,000                             | 80,000\*                               | 16,000                                  |
    | Claude Haiku 3.5                    | 1,000                             | 100,000\*                              | 20,000                                  |
    | Claude Opus 3                       | 1,000                             | 40,000\*                               | 8,000                                   |
    | Claude Sonnet 3                     | 1,000                             | 80,000\*                               | 16,000                                  |
    | Claude Haiku 3                      | 1,000                             | 100,000\*                              | 20,000                                  |

    Limits marked with asterisks (\*) count `cache_read_input_tokens` towards ITPM usage.
  </Tab>

  <Tab title="Tier 3">
    | Model                               | Maximum requests per minute (RPM) | Maximum input tokens per minute (ITPM) | Maximum output tokens per minute (OTPM) |
    | ----------------------------------- | --------------------------------- | -------------------------------------- | --------------------------------------- |
    | Claude Opus 4                       | 2,000                             | 800,000                                | 160,000                                 |
    | Claude Sonnet 4                     | 2,000                             | 800,000                                | 160,000                                 |
    | Claude Sonnet 3.7                   | 2,000                             | 80,000                                 | 32,000                                  |
    | Claude Sonnet 3.5 <br /> 2024-10-22 | 2,000                             | 160,000\*                              | 32,000                                  |
    | Claude Sonnet 3.5 <br /> 2024-06-20 | 2,000                             | 160,000\*                              | 32,000                                  |
    | Claude Haiku 3.5                    | 2,000                             | 200,000\*                              | 40,000                                  |
    | Claude Opus 3                       | 2,000                             | 80,000\*                               | 16,000                                  |
    | Claude Sonnet 3                     | 2,000                             | 160,000\*                              | 32,000                                  |
    | Claude Haiku 3                      | 2,000                             | 200,000\*                              | 40,000                                  |

    Limits marked with asterisks (\*) count `cache_read_input_tokens` towards ITPM usage.
  </Tab>

  <Tab title="Tier 4">
    | Model                               | Maximum requests per minute (RPM) | Maximum input tokens per minute (ITPM) | Maximum output tokens per minute (OTPM) |
    | ----------------------------------- | --------------------------------- | -------------------------------------- | --------------------------------------- |
    | Claude Opus 4                       | 4,000                             | 2,000,000                              | 400,000                                 |
    | Claude Sonnet 4                     | 4,000                             | 2,000,000                              | 400,000                                 |
    | Claude Sonnet 3.7                   | 4,000                             | 200,000                                | 80,000                                  |
    | Claude Sonnet 3.5 <br /> 2024-10-22 | 4,000                             | 400,000\*                              | 80,000                                  |
    | Claude Sonnet 3.5 <br /> 2024-06-20 | 4,000                             | 400,000\*                              | 80,000                                  |
    | Claude Haiku 3.5                    | 4,000                             | 400,000\*                              | 80,000                                  |
    | Claude Opus 3                       | 4,000                             | 400,000\*                              | 80,000                                  |
    | Claude Sonnet 3                     | 4,000                             | 400,000\*                              | 80,000                                  |
    | Claude Haiku 3                      | 4,000                             | 400,000\*                              | 80,000                                  |

    Limits marked with asterisks (\*) count `cache_read_input_tokens` towards ITPM usage.
  </Tab>

  <Tab title="Custom">
    If you're seeking higher limits for an Enterprise use case, contact sales through the [Anthropic Console](https://console.anthropic.com/settings/limits).
  </Tab>
</Tabs>

### Message Batches API

The Message Batches API has its own set of rate limits which are shared across all models. These include a requests per minute (RPM) limit to all API endpoints and a limit on the number of batch requests that can be in the processing queue at the same time. A "batch request" here refers to part of a Message Batch. You may create a Message Batch containing thousands of batch requests, each of which count towards this limit. A batch request is considered part of the processing queue when it has yet to be successfully processed by the model.

<Tabs>
  <Tab title="Tier 1">
    | Maximum requests per minute (RPM) | Maximum batch requests in processing queue | Maximum batch requests per batch |
    | --------------------------------- | ------------------------------------------ | -------------------------------- |
    | 50                                | 100,000                                    | 100,000                          |
  </Tab>

  <Tab title="Tier 2">
    | Maximum requests per minute (RPM) | Maximum batch requests in processing queue | Maximum batch requests per batch |
    | --------------------------------- | ------------------------------------------ | -------------------------------- |
    | 1,000                             | 200,000                                    | 100,000                          |
  </Tab>

  <Tab title="Tier 3">
    | Maximum requests per minute (RPM) | Maximum batch requests in processing queue | Maximum batch requests per batch |
    | --------------------------------- | ------------------------------------------ | -------------------------------- |
    | 2,000                             | 300,000                                    | 100,000                          |
  </Tab>

  <Tab title="Tier 4">
    | Maximum requests per minute (RPM) | Maximum batch requests in processing queue | Maximum batch requests per batch |
    | --------------------------------- | ------------------------------------------ | -------------------------------- |
    | 4,000                             | 500,000                                    | 100,000                          |
  </Tab>

  <Tab title="Custom">
    If you're seeking higher limits for an Enterprise use case, contact sales through the [Anthropic Console](https://console.anthropic.com/settings/limits).
  </Tab>
</Tabs>

## Setting lower limits for Workspaces

In order to protect Workspaces in your Organization from potential overuse, you can set custom spend and rate limits per Workspace.

Example: If your Organization's limit is 40,000 input tokens per minute and 8,000 output tokens per minute, you might limit one Workspace to 30,000 total tokens per minute. This protects other Workspaces from potential overuse and ensures a more equitable distribution of resources across your Organization. The remaining unused tokens per minute (or more, if that Workspace doesn't use the limit) are then available for other Workspaces to use.

Note:

* You can't set limits on the default Workspace.
* If not set, Workspace limits match the Organization's limit.
* Organization-wide limits always apply, even if Workspace limits add up to more.
* Support for input and output token limits will be added to Workspaces in the future.

## Response headers

The API response includes headers that show you the rate limit enforced, current usage, and when the limit will be reset.

The following headers are returned:

| Header                                        | Description                                                                                                                           |
| --------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| `retry-after`                                 | The number of seconds to wait until you can retry the request. Earlier retries will fail.                                             |
| `anthropic-ratelimit-requests-limit`          | The maximum number of requests allowed within any rate limit period.                                                                  |
| `anthropic-ratelimit-requests-remaining`      | The number of requests remaining before being rate limited.                                                                           |
| `anthropic-ratelimit-requests-reset`          | The time when the request rate limit will be fully replenished, provided in RFC 3339 format.                                          |
| `anthropic-ratelimit-tokens-limit`            | The maximum number of tokens allowed within any rate limit period.                                                                    |
| `anthropic-ratelimit-tokens-remaining`        | The number of tokens remaining (rounded to the nearest thousand) before being rate limited.                                           |
| `anthropic-ratelimit-tokens-reset`            | The time when the token rate limit will be fully replenished, provided in RFC 3339 format.                                            |
| `anthropic-ratelimit-input-tokens-limit`      | The maximum number of input tokens allowed within any rate limit period.                                                              |
| `anthropic-ratelimit-input-tokens-remaining`  | The number of input tokens remaining (rounded to the nearest thousand) before being rate limited.                                     |
| `anthropic-ratelimit-input-tokens-reset`      | The time when the input token rate limit will be fully replenished, provided in RFC 3339 format.                                      |
| `anthropic-ratelimit-output-tokens-limit`     | The maximum number of output tokens allowed within any rate limit period.                                                             |
| `anthropic-ratelimit-output-tokens-remaining` | The number of output tokens remaining (rounded to the nearest thousand) before being rate limited.                                    |
| `anthropic-ratelimit-output-tokens-reset`     | The time when the output token rate limit will be fully replenished, provided in RFC 3339 format.                                     |
| `anthropic-priority-input-tokens-limit`       | The maximum number of Priority Tier input tokens allowed within any rate limit period. (Priority Tier only)                           |
| `anthropic-priority-input-tokens-remaining`   | The number of Priority Tier input tokens remaining (rounded to the nearest thousand) before being rate limited. (Priority Tier only)  |
| `anthropic-priority-input-tokens-reset`       | The time when the Priority Tier input token rate limit will be fully replenished, provided in RFC 3339 format. (Priority Tier only)   |
| `anthropic-priority-output-tokens-limit`      | The maximum number of Priority Tier output tokens allowed within any rate limit period. (Priority Tier only)                          |
| `anthropic-priority-output-tokens-remaining`  | The number of Priority Tier output tokens remaining (rounded to the nearest thousand) before being rate limited. (Priority Tier only) |
| `anthropic-priority-output-tokens-reset`      | The time when the Priority Tier output token rate limit will be fully replenished, provided in RFC 3339 format. (Priority Tier only)  |

The `anthropic-ratelimit-tokens-*` headers display the values for the most restrictive limit currently in effect. For instance, if you have exceeded the Workspace per-minute token limit, the headers will contain the Workspace per-minute token rate limit values. If Workspace limits do not apply, the headers will return the total tokens remaining, where total is the sum of input and output tokens. This approach ensures that you have visibility into the most relevant constraint on your current API usage.


# Service tiers

> Different tiers of service allow you to balance availability, performance, and predictable costs based on your application's needs.

We offer three service tiers:

* **Priority Tier:** Best for workflows deployed in production where time, availability, and predictable pricing are important
* **Standard:** Default tier for both piloting and scaling everyday use cases
* **Batch:** Best for asynchronous workflows which can wait or benefit from being outside your normal capacity

## Standard Tier

The standard tier is the default service tier for all API requests. Requests in this tier are prioritized alongside all other requests and observe best-effort availability.

## Priority Tier

Requests in this tier are prioritized over all other requests to Anthropic. This prioritization helps minimize ["server overloaded" errors](/en/api/errors#http-errors), even during peak times.

For more information, see [Get started with Priority Tier](#get-started-with-priority-tier)

## How requests get assigned tiers

When handling a request, Anthropic decides to assign a request to Priority Tier in the following scenarios:

* Your organization has sufficient priority tier capacity **input** tokens per minute
* Your organization has sufficient priority tier capacity **output** tokens per minute

Anthropic counts usage against Priority Tier capacity as follows:

**Input Tokens**

* Cache reads as 0.1 tokens per token read from the cache
* Cache writes as 1.25 tokens per token written to the cache with a 5 minute TTL
* Cache writes as 2.00 tokens per token written to the cache with a 1 hour TTL
* All other input tokens are 1 token per token

**Output Tokens**

* 1 token per token

Otherwise, requests proceed at standard tier.

<Note>
  Requests assigned Priority Tier pull from both the Priority Tier capacity and the regular rate limits.
  If servicing the request would exceed the rate limits, the request is declined.
</Note>

## Using service tiers

You can control which service tiers can be used for a request by setting the `service_tier` parameter:

```python
message = client.messages.create(
    model="claude-opus-4-20250514",
    max_tokens=1024,
    messages=[{"role": "user", "content": "Hello, Claude!"}],
    service_tier="auto"  # Automatically use Priority Tier when available, fallback to standard
)
```

The `service_tier` parameter accepts the following values:

* `"auto"` (default) - Uses the Priority Tier capacity if available, falling back to your other capacity if not
* `"standard_only"` - Only use standard tier capacity, useful if you don't want to use your Priority Tier capacity

The response `usage` object also includes the service tier assigned to the request:

```json
{
  "usage": {
    "input_tokens": 410,
    "cache_creation_input_tokens": 0,
    "cache_read_input_tokens": 0,
    "output_tokens": 585,
    "service_tier": "priority"
  }
}
```

This allows you to determine which service tier was assigned to the request.

When requesting `service_tier="auto"` with a model with a Priority Tier commitment, these response headers provide insights:

```
anthropic-priority-input-tokens-limit: 10000
anthropic-priority-input-tokens-remaining: 9618
anthropic-priority-input-tokens-reset: 2025-01-12T23:11:59Z
anthropic-priority-output-tokens-limit: 10000
anthropic-priority-output-tokens-remaining: 6000
anthropic-priority-output-tokens-reset: 2025-01-12T23:12:21Z
```

You can use the presence of these headers to detect if your request was eligible for Priority Tier, even if it was over the limit.

## Get started with Priority Tier

You may want to commit to Priority Tier capacity if you are interested in:

* **Higher availability**: Target 99.5% uptime with prioritized computational resources
* **Cost Control**: Predictable spend and discounts for longer commitments
* **Flexible overflow**: Automatically falls back to standard tier when you exceed your committed capacity

Committing to Priority Tier will involve deciding:

* A number of input tokens per minute
* A number of output tokens per minute
* A commitment duration (1, 3, 6, or 12 months)
* A specific model version

<Note>
  The ratio of input to output tokens you purchase matters. Sizing your Priority Tier capacity to align with your actual traffic patterns helps you maximize utilization of your purchased tokens.
</Note>

### Supported models

Priority Tier is supported by:

* Claude Opus 4
* Claude Sonnet 4
* Claude Sonnet 3.7
* Claude Sonnet 3.5 (both versions)
* Claude Haiku 3.5

Check the [model overview page](/en/docs/about-claude/models/overview) for more details on our models.

### How to access Priority Tier

To begin using Priority Tier:

1. [Contact sales](https://www.anthropic.com/contact-sales/priority-tier) to complete provisioning
2. (Optional) Update your API requests to optionally set the `service_tier` parameter to `auto`
3. Monitor your usage through response headers and the Anthropic Console


# Errors

## HTTP errors

Our API follows a predictable HTTP error code format:

* 400 - `invalid_request_error`: There was an issue with the format or content of your request. We may also use this error type for other 4XX status codes not listed below.
* 401 - `authentication_error`: There's an issue with your API key.
* 403 - `permission_error`: Your API key does not have permission to use the specified resource.
* 404 - `not_found_error`: The requested resource was not found.
* 413 - `request_too_large`: Request exceeds the maximum allowed number of bytes. The maximum request size is 32 MB for standard API endpoints.
* 429 - `rate_limit_error`: Your account has hit a rate limit.
* 500 - `api_error`: An unexpected error has occurred internal to Anthropic's systems.
* 529 - `overloaded_error`: Anthropic's API is temporarily overloaded.

  <Warning>
    529 errors can occur when Anthropic APIs experience high traffic across all users.  In rare cases, if your organization has a sharp increase in usage, you might see this type of error.
    To avoid 529 errors, ramp up your traffic gradually and maintain consistent usage patterns.
  </Warning>

When receiving a [streaming](/en/docs/build-with-claude/streaming) response via SSE, it's possible that an error can occur after returning a 200 response, in which case error handling wouldn't follow these standard mechanisms.

## Request size limits

The API enforces request size limits to ensure optimal performance:

| Endpoint Type                                            | Maximum Request Size |
| :------------------------------------------------------- | :------------------- |
| Messages API                                             | 32 MB                |
| Token Counting API                                       | 32 MB                |
| [Batch API](/en/docs/build-with-claude/batch-processing) | 256 MB               |
| [Files API](/en/docs/build-with-claude/files)            | 500 MB               |

If you exceed these limits, you'll receive a 413 `request_too_large` error. The error is returned from Cloudflare before the request reaches Anthropic's API servers.

## Error shapes

Errors are always returned as JSON, with a top-level `error` object that always includes a `type` and `message` value. For example:

```JSON JSON
{
  "type": "error",
  "error": {
    "type": "not_found_error",
    "message": "The requested resource could not be found."
  }
}
```

In accordance with our [versioning](/en/api/versioning) policy, we may expand the values within these objects, and it is possible that the `type` values will grow over time.

## Request id

Every API response includes a unique `request-id` header. This header contains a value such as `req_018EeWyXxfu5pfWkrYcMdjWG`. When contacting support about a specific request, please include this ID to help us quickly resolve your issue.

Our official SDKs provide this value as a property on top-level response objects, containing the value of the `request-id` header:

<CodeGroup>
  ```Python Python
  import anthropic

  client = anthropic.Anthropic()

  message = client.messages.create(
      model="claude-opus-4-20250514",
      max_tokens=1024,
      messages=[
          {"role": "user", "content": "Hello, Claude"}
      ]
  )
  print(f"Request ID: {message._request_id}")
  ```

  ```TypeScript TypeScript
  import Anthropic from '@anthropic-ai/sdk';

  const client = new Anthropic();

  const message = await client.messages.create({
    model: 'claude-opus-4-20250514',
    max_tokens: 1024,
    messages: [
      {"role": "user", "content": "Hello, Claude"}
    ]
  });
  console.log('Request ID:', message._request_id);
  ```
</CodeGroup>

## Long requests

<Warning>
  We highly encourage using the [streaming Messages API](/en/docs/build-with-claude/streaming) or [Message Batches API](/en/api/creating-message-batches) for long running requests, especially those over 10 minutes.
</Warning>

We do not recommend setting a large `max_tokens` values without using our [streaming Messages API](/en/docs/build-with-claude/streaming)
or [Message Batches API](/en/api/creating-message-batches):

* Some networks may drop idle connections after a variable period of time, which
  can cause the request to fail or timeout without receiving a response from Anthropic.
* Networks differ in reliability; our [Message Batches API](/en/api/creating-message-batches) can help you
  manage the risk of network issues by allowing you to poll for results rather than requiring an uninterrupted network connection.

If you are building a direct API integration, you should be aware that setting a [TCP socket keep-alive](https://tldp.org/HOWTO/TCP-Keepalive-HOWTO/programming.html) can reduce the impact of idle connection timeouts on some networks.

Our [SDKs](/en/api/client-sdks) will validate that your non-streaming Messages API requests are not expected to exceed a 10 minute timeout and
also will set a socket option for TCP keep-alive.


# Handling stop reasons

When you make a request to the Messages API, Claude's response includes a `stop_reason` field that indicates why the model stopped generating its response. Understanding these values is crucial for building robust applications that handle different response types appropriately.

For details about `stop_reason` in the API response, see the [Messages API reference](/en/api/messages).

## What is stop\_reason?

The `stop_reason` field is part of every successful Messages API response. Unlike errors, which indicate failures in processing your request, `stop_reason` tells you why Claude successfully completed its response generation.

```json Example response
{
  "id": "msg_01234",
  "type": "message",
  "role": "assistant",
  "content": [
    {
      "type": "text",
      "text": "Here's the answer to your question..."
    }
  ],
  "stop_reason": "end_turn",
  "stop_sequence": null,
  "usage": {
    "input_tokens": 100,
    "output_tokens": 50
  }
}
```

## Stop reason values

### end\_turn

The most common stop reason. Indicates Claude finished its response naturally.

```python
if response.stop_reason == "end_turn":
    # Process the complete response
    print(response.content[0].text)
```

### max\_tokens

Claude stopped because it reached the `max_tokens` limit specified in your request.

```python
# Request with limited tokens
response = client.messages.create(
    model="claude-sonnet-4-20250514",
    max_tokens=10,
    messages=[{"role": "user", "content": "Explain quantum physics"}]
)

if response.stop_reason == "max_tokens":
    # Response was truncated
    print("Response was cut off at token limit")
    # Consider making another request to continue
```

### stop\_sequence

Claude encountered one of your custom stop sequences.

```python
response = client.messages.create(
    model="claude-sonnet-4-20250514",
    max_tokens=1024,
    stop_sequences=["END", "STOP"],
    messages=[{"role": "user", "content": "Generate text until you say END"}]
)

if response.stop_reason == "stop_sequence":
    print(f"Stopped at sequence: {response.stop_sequence}")
```

### tool\_use

Claude is calling a tool and expects you to execute it.

```python
response = client.messages.create(
    model="claude-sonnet-4-20250514",
    max_tokens=1024,
    tools=[weather_tool],
    messages=[{"role": "user", "content": "What's the weather?"}]
)

if response.stop_reason == "tool_use":
    # Extract and execute the tool
    for content in response.content:
        if content.type == "tool_use":
            result = execute_tool(content.name, content.input)
            # Return result to Claude for final response
```

### pause\_turn

Used with server tools like web search when Claude needs to pause a long-running operation.

```python
response = client.messages.create(
    model="claude-sonnet-4-20250514",
    max_tokens=1024,
    tools=[{"type": "web_search_20250305", "name": "web_search"}],
    messages=[{"role": "user", "content": "Search for latest AI news"}]
)

if response.stop_reason == "pause_turn":
    # Continue the conversation
    messages = [
        {"role": "user", "content": original_query},
        {"role": "assistant", "content": response.content}
    ]
    continuation = client.messages.create(
        model="claude-sonnet-4-20250514",
        messages=messages,
        tools=[{"type": "web_search_20250305", "name": "web_search"}]
    )
```

### refusal

Claude refused to generate a response due to safety concerns.

```python
response = client.messages.create(
    model="claude-sonnet-4-20250514",
    max_tokens=1024,
    messages=[{"role": "user", "content": "[Unsafe request]"}]
)

if response.stop_reason == "refusal":
    # Claude declined to respond
    print("Claude was unable to process this request")
    # Consider rephrasing or modifying the request
```

## Best practices for handling stop reasons

### 1. Always check stop\_reason

Make it a habit to check the `stop_reason` in your response handling logic:

```python
def handle_response(response):
    if response.stop_reason == "tool_use":
        return handle_tool_use(response)
    elif response.stop_reason == "max_tokens":
        return handle_truncation(response)
    elif response.stop_reason == "pause_turn":
        return handle_pause(response)
    elif response.stop_reason == "refusal":
        return handle_refusal(response)
    else:
        # Handle end_turn and other cases
        return response.content[0].text
```

### 2. Handle max\_tokens gracefully

When a response is truncated due to token limits:

```python
def handle_truncated_response(response):
    if response.stop_reason == "max_tokens":
        # Option 1: Warn the user
        return f"{response.content[0].text}\n\n[Response truncated due to length]"
        
        # Option 2: Continue generation
        messages = [
            {"role": "user", "content": original_prompt},
            {"role": "assistant", "content": response.content[0].text}
        ]
        continuation = client.messages.create(
            model="claude-sonnet-4-20250514",
            max_tokens=1024,
            messages=messages + [{"role": "user", "content": "Please continue"}]
        )
        return response.content[0].text + continuation.content[0].text
```

### 3. Implement retry logic for pause\_turn

For server tools that may pause:

```python
def handle_paused_conversation(initial_response, max_retries=3):
    response = initial_response
    messages = [{"role": "user", "content": original_query}]
    
    for attempt in range(max_retries):
        if response.stop_reason != "pause_turn":
            break
            
        messages.append({"role": "assistant", "content": response.content})
        response = client.messages.create(
            model="claude-sonnet-4-20250514",
            messages=messages,
            tools=original_tools
        )
    
    return response
```

## Stop reasons vs. errors

It's important to distinguish between `stop_reason` values and actual errors:

### Stop reasons (successful responses)

* Part of the response body
* Indicate why generation stopped normally
* Response contains valid content

### Errors (failed requests)

* HTTP status codes 4xx or 5xx
* Indicate request processing failures
* Response contains error details

```python
try:
    response = client.messages.create(...)
    
    # Handle successful response with stop_reason
    if response.stop_reason == "max_tokens":
        print("Response was truncated")
    
except anthropic.APIError as e:
    # Handle actual errors
    if e.status_code == 429:
        print("Rate limit exceeded")
    elif e.status_code == 500:
        print("Server error")
```

## Streaming considerations

When using streaming, `stop_reason` is:

* `null` in the initial `message_start` event
* Provided in the `message_delta` event
* Not provided in any other events

```python
with client.messages.stream(...) as stream:
    for event in stream:
        if event.type == "message_delta":
            stop_reason = event.delta.stop_reason
            if stop_reason:
                print(f"Stream ended with: {stop_reason}")
```

## Common patterns

### Handling tool use workflows

```python
def complete_tool_workflow(client, user_query, tools):
    messages = [{"role": "user", "content": user_query}]
    
    while True:
        response = client.messages.create(
            model="claude-sonnet-4-20250514",
            messages=messages,
            tools=tools
        )
        
        if response.stop_reason == "tool_use":
            # Execute tools and continue
            tool_results = execute_tools(response.content)
            messages.append({"role": "assistant", "content": response.content})
            messages.append({"role": "user", "content": tool_results})
        else:
            # Final response
            return response
```

### Ensuring complete responses

```python
def get_complete_response(client, prompt, max_attempts=3):
    messages = [{"role": "user", "content": prompt}]
    full_response = ""
    
    for _ in range(max_attempts):
        response = client.messages.create(
            model="claude-sonnet-4-20250514",
            messages=messages,
            max_tokens=4096
        )
        
        full_response += response.content[0].text
        
        if response.stop_reason != "max_tokens":
            break
            
        # Continue from where it left off
        messages = [
            {"role": "user", "content": prompt},
            {"role": "assistant", "content": full_response},
            {"role": "user", "content": "Please continue from where you left off."}
        ]
    
    return full_response
```

By properly handling `stop_reason` values, you can build more robust applications that gracefully handle different response scenarios and provide better user experiences.


# Beta headers

> Documentation for using beta headers with the Anthropic API

Beta headers allow you to access experimental features and new model capabilities before they become part of the standard API.

These features are subject to change and may be modified or removed in future releases.

<Info>
  Beta headers are often used in conjunction with the [beta namespace in the client SDKs](/en/api/client-sdks#beta-namespace-in-client-sdks)
</Info>

## How to use beta headers

To access beta features, include the `anthropic-beta` header in your API requests:

```http
POST /v1/messages
Content-Type: application/json
X-API-Key: YOUR_API_KEY
anthropic-beta: BETA_FEATURE_NAME
```

When using the SDK, you can specify beta headers in the request options:

<CodeGroup>
  ```python Python
  from anthropic import Anthropic

  client = Anthropic()

  response = client.beta.messages.create(
      model="claude-sonnet-4-20250514",
      max_tokens=1024,
      messages=[
          {"role": "user", "content": "Hello, Claude"}
      ],
      betas=["beta-feature-name"]
  )
  ```

  ```typescript TypeScript
  import Anthropic from '@anthropic-ai/sdk';

  const anthropic = new Anthropic();

  const msg = await anthropic.beta.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 1024,
    messages: [
      { role: 'user', content: 'Hello, Claude' }
    ],
    betas: ['beta-feature-name']
  });
  ```

  ```curl cURL
  curl https://api.anthropic.com/v1/messages \
    -H "x-api-key: $ANTHROPIC_API_KEY" \
    -H "anthropic-version: 2023-06-01" \
    -H "anthropic-beta: beta-feature-name" \
    -H "content-type: application/json" \
    -d '{
      "model": "claude-sonnet-4-20250514",
      "max_tokens": 1024,
      "messages": [
        {"role": "user", "content": "Hello, Claude"}
      ]
    }'
  ```
</CodeGroup>

<Warning>
  Beta features are experimental and may:

  * Have breaking changes without notice
  * Be deprecated or removed
  * Have different rate limits or pricing
  * Not be available in all regions
</Warning>

### Multiple beta features

To use multiple beta features in a single request, include all feature names in the header separated by commas:

```http
anthropic-beta: feature1,feature2,feature3
```

### Version naming conventions

Beta feature names typically follow the pattern: `feature-name-YYYY-MM-DD`, where the date indicates when the beta version was released. Always use the exact beta feature name as documented.

## Error handling

If you use an invalid or unavailable beta header, you'll receive an error response:

```json
{
  "type": "error",
  "error": {
    "type": "invalid_request_error",
    "message": "Unsupported beta header: invalid-beta-name"
  }
}
```

## Getting help

For questions about beta features:

1. Check the documentation for the specific feature
2. Review the [API changelog](/en/api/versioning) for updates
3. Contact support for assistance with production usage

Remember that beta features are provided "as-is" and may not have the same SLA guarantees as stable API features.


API Reference

# Messages

> Send a structured list of input messages with text and/or image content, and the model will generate the next message in the conversation.

The Messages API can be used for either single queries or stateless multi-turn conversations.

Learn more about the Messages API in our [user guide](/en/docs/initial-setup)

## OpenAPI

````yaml post /v1/messages
paths:
  path: /v1/messages
  method: post
  servers:
    - url: https://api.anthropic.com
  request:
    security: []
    parameters:
      path: {}
      query: {}
      header:
        anthropic-beta:
          schema:
            - type: array
              items:
                allOf:
                  - type: string
              required: false
              title: Anthropic-Beta
              description: >-
                Optional header to specify the beta version(s) you want to use.


                To use multiple betas, use a comma separated list like
                `beta1,beta2` or specify the header multiple times for each
                beta.
        anthropic-version:
          schema:
            - type: string
              required: true
              title: Anthropic-Version
              description: >-
                The version of the Anthropic API you want to use.


                Read more about versioning and our version history
                [here](https://docs.anthropic.com/en/api/versioning).
        x-api-key:
          schema:
            - type: string
              required: true
              title: X-Api-Key
              description: >-
                Your unique API key for authentication.


                This key is required in the header of all API requests, to
                authenticate your account and access Anthropic's services. Get
                your API key through the
                [Console](https://console.anthropic.com/settings/keys). Each key
                is scoped to a Workspace.
      cookie: {}
    body:
      application/json:
        schemaArray:
          - type: object
            properties:
              model:
                allOf:
                  - description: >-
                      The model that will complete your prompt.


                      See
                      [models](https://docs.anthropic.com/en/docs/models-overview)
                      for additional details and options.
                    examples:
                      - claude-sonnet-4-20250514
                    maxLength: 256
                    minLength: 1
                    title: Model
                    type: string
              messages:
                allOf:
                  - description: >-
                      Input messages.


                      Our models are trained to operate on alternating `user`
                      and `assistant` conversational turns. When creating a new
                      `Message`, you specify the prior conversational turns with
                      the `messages` parameter, and the model then generates the
                      next `Message` in the conversation. Consecutive `user` or
                      `assistant` turns in your request will be combined into a
                      single turn.


                      Each input message must be an object with a `role` and
                      `content`. You can specify a single `user`-role message,
                      or you can include multiple `user` and `assistant`
                      messages.


                      If the final message uses the `assistant` role, the
                      response content will continue immediately from the
                      content in that message. This can be used to constrain
                      part of the model's response.


                      Example with a single `user` message:


                      ```json

                      [{"role": "user", "content": "Hello, Claude"}]

                      ```


                      Example with multiple conversational turns:


                      ```json

                      [
                        {"role": "user", "content": "Hello there."},
                        {"role": "assistant", "content": "Hi, I'm Claude. How can I help you?"},
                        {"role": "user", "content": "Can you explain LLMs in plain English?"},
                      ]

                      ```


                      Example with a partially-filled response from Claude:


                      ```json

                      [
                        {"role": "user", "content": "What's the Greek name for Sun? (A) Sol (B) Helios (C) Sun"},
                        {"role": "assistant", "content": "The best answer is ("},
                      ]

                      ```


                      Each input message `content` may be either a single
                      `string` or an array of content blocks, where each block
                      has a specific `type`. Using a `string` for `content` is
                      shorthand for an array of one content block of type
                      `"text"`. The following input messages are equivalent:


                      ```json

                      {"role": "user", "content": "Hello, Claude"}

                      ```


                      ```json

                      {"role": "user", "content": [{"type": "text", "text":
                      "Hello, Claude"}]}

                      ```


                      Starting with Claude 3 models, you can also send image
                      content blocks:


                      ```json

                      {"role": "user", "content": [
                        {
                          "type": "image",
                          "source": {
                            "type": "base64",
                            "media_type": "image/jpeg",
                            "data": "/9j/4AAQSkZJRg...",
                          }
                        },
                        {"type": "text", "text": "What is in this image?"}
                      ]}

                      ```


                      We currently support the `base64` source type for images,
                      and the `image/jpeg`, `image/png`, `image/gif`, and
                      `image/webp` media types.


                      See
                      [examples](https://docs.anthropic.com/en/api/messages-examples#vision)
                      for more input examples.


                      Note that if you want to include a [system
                      prompt](https://docs.anthropic.com/en/docs/system-prompts),
                      you can use the top-level `system` parameter — there is no
                      `"system"` role for input messages in the Messages API.


                      There is a limit of 100,000 messages in a single request.
                    items:
                      $ref: '#/components/schemas/InputMessage'
                    title: Messages
                    type: array
              container:
                allOf:
                  - anyOf:
                      - type: string
                      - type: 'null'
                    description: Container identifier for reuse across requests.
                    title: Container
              max_tokens:
                allOf:
                  - description: >-
                      The maximum number of tokens to generate before stopping.


                      Note that our models may stop _before_ reaching this
                      maximum. This parameter only specifies the absolute
                      maximum number of tokens to generate.


                      Different models have different maximum values for this
                      parameter.  See
                      [models](https://docs.anthropic.com/en/docs/models-overview)
                      for details.
                    examples:
                      - 1024
                    minimum: 1
                    title: Max Tokens
                    type: integer
              mcp_servers:
                allOf:
                  - description: MCP servers to be utilized in this request
                    items:
                      $ref: '#/components/schemas/RequestMCPServerURLDefinition'
                    maxItems: 20
                    title: Mcp Servers
                    type: array
              metadata:
                allOf:
                  - $ref: '#/components/schemas/Metadata'
                    description: An object describing metadata about the request.
              service_tier:
                allOf:
                  - description: >-
                      Determines whether to use priority capacity (if available)
                      or standard capacity for this request.


                      Anthropic offers different levels of service for your API
                      requests. See
                      [service-tiers](https://docs.anthropic.com/en/api/service-tiers)
                      for details.
                    enum:
                      - auto
                      - standard_only
                    title: Service Tier
                    type: string
              stop_sequences:
                allOf:
                  - description: >-
                      Custom text sequences that will cause the model to stop
                      generating.


                      Our models will normally stop when they have naturally
                      completed their turn, which will result in a response
                      `stop_reason` of `"end_turn"`.


                      If you want the model to stop generating when it
                      encounters custom strings of text, you can use the
                      `stop_sequences` parameter. If the model encounters one of
                      the custom sequences, the response `stop_reason` value
                      will be `"stop_sequence"` and the response `stop_sequence`
                      value will contain the matched stop sequence.
                    items:
                      type: string
                    title: Stop Sequences
                    type: array
              stream:
                allOf:
                  - description: >-
                      Whether to incrementally stream the response using
                      server-sent events.


                      See
                      [streaming](https://docs.anthropic.com/en/api/messages-streaming)
                      for details.
                    title: Stream
                    type: boolean
              system:
                allOf:
                  - anyOf:
                      - type: string
                      - items:
                          $ref: '#/components/schemas/RequestTextBlock'
                        type: array
                    description: >-
                      System prompt.


                      A system prompt is a way of providing context and
                      instructions to Claude, such as specifying a particular
                      goal or role. See our [guide to system
                      prompts](https://docs.anthropic.com/en/docs/system-prompts).
                    examples:
                      - - text: Today's date is 2024-06-01.
                          type: text
                      - Today's date is 2023-01-01.
                    title: System
              temperature:
                allOf:
                  - description: >-
                      Amount of randomness injected into the response.


                      Defaults to `1.0`. Ranges from `0.0` to `1.0`. Use
                      `temperature` closer to `0.0` for analytical / multiple
                      choice, and closer to `1.0` for creative and generative
                      tasks.


                      Note that even with `temperature` of `0.0`, the results
                      will not be fully deterministic.
                    examples:
                      - 1
                    maximum: 1
                    minimum: 0
                    title: Temperature
                    type: number
              thinking:
                allOf:
                  - description: >-
                      Configuration for enabling Claude's extended thinking. 


                      When enabled, responses include `thinking` content blocks
                      showing Claude's thinking process before the final answer.
                      Requires a minimum budget of 1,024 tokens and counts
                      towards your `max_tokens` limit.


                      See [extended
                      thinking](https://docs.anthropic.com/en/docs/build-with-claude/extended-thinking)
                      for details.
                    discriminator:
                      mapping:
                        disabled: '#/components/schemas/ThinkingConfigDisabled'
                        enabled: '#/components/schemas/ThinkingConfigEnabled'
                      propertyName: type
                    oneOf:
                      - $ref: '#/components/schemas/ThinkingConfigEnabled'
                      - $ref: '#/components/schemas/ThinkingConfigDisabled'
              tool_choice:
                allOf:
                  - description: >-
                      How the model should use the provided tools. The model can
                      use a specific tool, any available tool, decide by itself,
                      or not use tools at all.
                    discriminator:
                      mapping:
                        any: '#/components/schemas/ToolChoiceAny'
                        auto: '#/components/schemas/ToolChoiceAuto'
                        none: '#/components/schemas/ToolChoiceNone'
                        tool: '#/components/schemas/ToolChoiceTool'
                      propertyName: type
                    oneOf:
                      - $ref: '#/components/schemas/ToolChoiceAuto'
                      - $ref: '#/components/schemas/ToolChoiceAny'
                      - $ref: '#/components/schemas/ToolChoiceTool'
                      - $ref: '#/components/schemas/ToolChoiceNone'
              tools:
                allOf:
                  - description: >-
                      Definitions of tools that the model may use.


                      If you include `tools` in your API request, the model may
                      return `tool_use` content blocks that represent the
                      model's use of those tools. You can then run those tools
                      using the tool input generated by the model and then
                      optionally return results back to the model using
                      `tool_result` content blocks.


                      There are two types of tools: **client tools** and
                      **server tools**. The behavior described below applies to
                      client tools. For [server
                      tools](https://docs.anthropic.com/en/docs/agents-and-tools/tool-use/overview\#server-tools),
                      see their individual documentation as each has its own
                      behavior (e.g., the [web search
                      tool](https://docs.anthropic.com/en/docs/agents-and-tools/tool-use/web-search-tool)).


                      Each tool definition includes:


                      * `name`: Name of the tool.

                      * `description`: Optional, but strongly-recommended
                      description of the tool.

                      * `input_schema`: [JSON
                      schema](https://json-schema.org/draft/2020-12) for the
                      tool `input` shape that the model will produce in
                      `tool_use` output content blocks.


                      For example, if you defined `tools` as:


                      ```json

                      [
                        {
                          "name": "get_stock_price",
                          "description": "Get the current stock price for a given ticker symbol.",
                          "input_schema": {
                            "type": "object",
                            "properties": {
                              "ticker": {
                                "type": "string",
                                "description": "The stock ticker symbol, e.g. AAPL for Apple Inc."
                              }
                            },
                            "required": ["ticker"]
                          }
                        }
                      ]

                      ```


                      And then asked the model "What's the S&P 500 at today?",
                      the model might produce `tool_use` content blocks in the
                      response like this:


                      ```json

                      [
                        {
                          "type": "tool_use",
                          "id": "toolu_01D7FLrfh4GYq7yT1ULFeyMV",
                          "name": "get_stock_price",
                          "input": { "ticker": "^GSPC" }
                        }
                      ]

                      ```


                      You might then run your `get_stock_price` tool with
                      `{"ticker": "^GSPC"}` as an input, and return the
                      following back to the model in a subsequent `user`
                      message:


                      ```json

                      [
                        {
                          "type": "tool_result",
                          "tool_use_id": "toolu_01D7FLrfh4GYq7yT1ULFeyMV",
                          "content": "259.75 USD"
                        }
                      ]

                      ```


                      Tools can be used for workflows that include running
                      client-side tools and functions, or more generally
                      whenever you want the model to produce a particular JSON
                      structure of output.


                      See our
                      [guide](https://docs.anthropic.com/en/docs/tool-use) for
                      more details.
                    examples:
                      - description: Get the current weather in a given location
                        input_schema:
                          properties:
                            location:
                              description: The city and state, e.g. San Francisco, CA
                              type: string
                            unit:
                              description: >-
                                Unit for the output - one of (celsius,
                                fahrenheit)
                              type: string
                          required:
                            - location
                          type: object
                        name: get_weather
                    items:
                      oneOf:
                        - $ref: '#/components/schemas/Tool'
                        - $ref: '#/components/schemas/BashTool_20241022'
                        - $ref: '#/components/schemas/BashTool_20250124'
                        - $ref: '#/components/schemas/CodeExecutionTool_20250522'
                        - $ref: '#/components/schemas/ComputerUseTool_20241022'
                        - $ref: '#/components/schemas/ComputerUseTool_20250124'
                        - $ref: '#/components/schemas/TextEditor_20241022'
                        - $ref: '#/components/schemas/TextEditor_20250124'
                        - $ref: '#/components/schemas/TextEditor_20250429'
                        - $ref: '#/components/schemas/WebSearchTool_20250305'
                    title: Tools
                    type: array
              top_k:
                allOf:
                  - description: >-
                      Only sample from the top K options for each subsequent
                      token.


                      Used to remove "long tail" low probability responses.
                      [Learn more technical details
                      here](https://towardsdatascience.com/how-to-sample-from-language-models-682bceb97277).


                      Recommended for advanced use cases only. You usually only
                      need to use `temperature`.
                    examples:
                      - 5
                    minimum: 0
                    title: Top K
                    type: integer
              top_p:
                allOf:
                  - description: >-
                      Use nucleus sampling.


                      In nucleus sampling, we compute the cumulative
                      distribution over all the options for each subsequent
                      token in decreasing probability order and cut it off once
                      it reaches a particular probability specified by `top_p`.
                      You should either alter `temperature` or `top_p`, but not
                      both.


                      Recommended for advanced use cases only. You usually only
                      need to use `temperature`.
                    examples:
                      - 0.7
                    maximum: 1
                    minimum: 0
                    title: Top P
                    type: number
            required: true
            title: CreateMessageParams
            requiredProperties:
              - model
              - messages
              - max_tokens
            additionalProperties: false
            example:
              max_tokens: 1024
              messages:
                - content: Hello, world
                  role: user
              model: claude-sonnet-4-20250514
        examples:
          example:
            value:
              max_tokens: 1024
              messages:
                - content: Hello, world
                  role: user
              model: claude-sonnet-4-20250514
    codeSamples:
      - lang: bash
        source: |-
          curl https://api.anthropic.com/v1/messages \
               --header "x-api-key: $ANTHROPIC_API_KEY" \
               --header "anthropic-version: 2023-06-01" \
               --header "content-type: application/json" \
               --data \
          '{
              "model": "claude-sonnet-4-20250514",
              "max_tokens": 1024,
              "messages": [
                  {"role": "user", "content": "Hello, world"}
              ]
          }'
      - lang: python
        source: |-
          import anthropic

          anthropic.Anthropic().messages.create(
              model="claude-sonnet-4-20250514",
              max_tokens=1024,
              messages=[
                  {"role": "user", "content": "Hello, world"}
              ]
          )
      - lang: javascript
        source: |-
          import { Anthropic } from '@anthropic-ai/sdk';

          const anthropic = new Anthropic();

          await anthropic.messages.create({
            model: "claude-sonnet-4-20250514",
            max_tokens: 1024,
            messages: [
              {"role": "user", "content": "Hello, world"}
            ]
          });
  response:
    '200':
      application/json:
        schemaArray:
          - type: object
            properties:
              id:
                allOf:
                  - description: |-
                      Unique object identifier.

                      The format and length of IDs may change over time.
                    examples:
                      - msg_013Zva2CMHLNnXjNJJKqJ2EF
                    title: Id
                    type: string
              type:
                allOf:
                  - const: message
                    default: message
                    description: |-
                      Object type.

                      For Messages, this is always `"message"`.
                    enum:
                      - message
                    title: Type
                    type: string
              role:
                allOf:
                  - const: assistant
                    default: assistant
                    description: |-
                      Conversational role of the generated message.

                      This will always be `"assistant"`.
                    enum:
                      - assistant
                    title: Role
                    type: string
              content:
                allOf:
                  - description: >-
                      Content generated by the model.


                      This is an array of content blocks, each of which has a
                      `type` that determines its shape.


                      Example:


                      ```json

                      [{"type": "text", "text": "Hi, I'm Claude."}]

                      ```


                      If the request input `messages` ended with an `assistant`
                      turn, then the response `content` will continue directly
                      from that last turn. You can use this to constrain the
                      model's output.


                      For example, if the input `messages` were:

                      ```json

                      [
                        {"role": "user", "content": "What's the Greek name for Sun? (A) Sol (B) Helios (C) Sun"},
                        {"role": "assistant", "content": "The best answer is ("}
                      ]

                      ```


                      Then the response `content` might be:


                      ```json

                      [{"type": "text", "text": "B)"}]

                      ```
                    examples:
                      - - text: Hi! My name is Claude.
                          type: text
                    items:
                      discriminator:
                        mapping:
                          code_execution_tool_result: >-
                            #/components/schemas/ResponseCodeExecutionToolResultBlock
                          container_upload: '#/components/schemas/ResponseContainerUploadBlock'
                          mcp_tool_result: '#/components/schemas/ResponseMCPToolResultBlock'
                          mcp_tool_use: '#/components/schemas/ResponseMCPToolUseBlock'
                          redacted_thinking: '#/components/schemas/ResponseRedactedThinkingBlock'
                          server_tool_use: '#/components/schemas/ResponseServerToolUseBlock'
                          text: '#/components/schemas/ResponseTextBlock'
                          thinking: '#/components/schemas/ResponseThinkingBlock'
                          tool_use: '#/components/schemas/ResponseToolUseBlock'
                          web_search_tool_result: >-
                            #/components/schemas/ResponseWebSearchToolResultBlock
                        propertyName: type
                      oneOf:
                        - $ref: '#/components/schemas/ResponseTextBlock'
                        - $ref: '#/components/schemas/ResponseThinkingBlock'
                        - $ref: '#/components/schemas/ResponseRedactedThinkingBlock'
                        - $ref: '#/components/schemas/ResponseToolUseBlock'
                        - $ref: '#/components/schemas/ResponseServerToolUseBlock'
                        - $ref: >-
                            #/components/schemas/ResponseWebSearchToolResultBlock
                        - $ref: >-
                            #/components/schemas/ResponseCodeExecutionToolResultBlock
                        - $ref: '#/components/schemas/ResponseMCPToolUseBlock'
                        - $ref: '#/components/schemas/ResponseMCPToolResultBlock'
                        - $ref: '#/components/schemas/ResponseContainerUploadBlock'
                    title: Content
                    type: array
              model:
                allOf:
                  - description: The model that handled the request.
                    examples:
                      - claude-sonnet-4-20250514
                    maxLength: 256
                    minLength: 1
                    title: Model
                    type: string
              stop_reason:
                allOf:
                  - anyOf:
                      - enum:
                          - end_turn
                          - max_tokens
                          - stop_sequence
                          - tool_use
                          - pause_turn
                          - refusal
                        type: string
                      - type: 'null'
                    description: >-
                      The reason that we stopped.


                      This may be one the following values:

                      * `"end_turn"`: the model reached a natural stopping point

                      * `"max_tokens"`: we exceeded the requested `max_tokens`
                      or the model's maximum

                      * `"stop_sequence"`: one of your provided custom
                      `stop_sequences` was generated

                      * `"tool_use"`: the model invoked one or more tools

                      * `"pause_turn"`: we paused a long-running turn. You may
                      provide the response back as-is in a subsequent request to
                      let the model continue.

                      * `"refusal"`: when streaming classifiers intervene to
                      handle potential policy violations


                      In non-streaming mode this value is always non-null. In
                      streaming mode, it is null in the `message_start` event
                      and non-null otherwise.
                    title: Stop Reason
              stop_sequence:
                allOf:
                  - anyOf:
                      - type: string
                      - type: 'null'
                    default: null
                    description: >-
                      Which custom stop sequence was generated, if any.


                      This value will be a non-null string if one of your custom
                      stop sequences was generated.
                    title: Stop Sequence
              usage:
                allOf:
                  - $ref: '#/components/schemas/Usage'
                    description: >-
                      Billing and rate-limit usage.


                      Anthropic's API bills and rate-limits by token counts, as
                      tokens represent the underlying cost to our systems.


                      Under the hood, the API transforms requests into a format
                      suitable for the model. The model's output then goes
                      through a parsing stage before becoming an API response.
                      As a result, the token counts in `usage` will not match
                      one-to-one with the exact visible content of an API
                      request or response.


                      For example, `output_tokens` will be non-zero, even for an
                      empty string response from Claude.


                      Total input tokens in a request is the summation of
                      `input_tokens`, `cache_creation_input_tokens`, and
                      `cache_read_input_tokens`.
                    examples:
                      - input_tokens: 2095
                        output_tokens: 503
              container:
                allOf:
                  - anyOf:
                      - $ref: '#/components/schemas/Container'
                      - type: 'null'
                    default: null
                    description: >-
                      Information about the container used in this request.


                      This will be non-null if a container tool (e.g. code
                      execution) was used.
            title: Message
            examples:
              - content: &ref_0
                  - text: Hi! My name is Claude.
                    type: text
                id: msg_013Zva2CMHLNnXjNJJKqJ2EF
                model: claude-sonnet-4-20250514
                role: assistant
                stop_reason: end_turn
                stop_sequence: null
                type: message
                usage: &ref_1
                  input_tokens: 2095
                  output_tokens: 503
            requiredProperties:
              - id
              - type
              - role
              - content
              - model
              - stop_reason
              - stop_sequence
              - usage
              - container
            example:
              content: *ref_0
              id: msg_013Zva2CMHLNnXjNJJKqJ2EF
              model: claude-sonnet-4-20250514
              role: assistant
              stop_reason: end_turn
              stop_sequence: null
              type: message
              usage: *ref_1
        examples:
          example:
            value:
              content:
                - text: Hi! My name is Claude.
                  type: text
              id: msg_013Zva2CMHLNnXjNJJKqJ2EF
              model: claude-sonnet-4-20250514
              role: assistant
              stop_reason: end_turn
              stop_sequence: null
              type: message
              usage:
                input_tokens: 2095
                output_tokens: 503
        description: Message object.
    4XX:
      application/json:
        schemaArray:
          - type: object
            properties:
              error:
                allOf:
                  - discriminator:
                      mapping:
                        api_error: '#/components/schemas/APIError'
                        authentication_error: '#/components/schemas/AuthenticationError'
                        billing_error: '#/components/schemas/BillingError'
                        invalid_request_error: '#/components/schemas/InvalidRequestError'
                        not_found_error: '#/components/schemas/NotFoundError'
                        overloaded_error: '#/components/schemas/OverloadedError'
                        permission_error: '#/components/schemas/PermissionError'
                        rate_limit_error: '#/components/schemas/RateLimitError'
                        timeout_error: '#/components/schemas/GatewayTimeoutError'
                      propertyName: type
                    oneOf:
                      - $ref: '#/components/schemas/InvalidRequestError'
                      - $ref: '#/components/schemas/AuthenticationError'
                      - $ref: '#/components/schemas/BillingError'
                      - $ref: '#/components/schemas/PermissionError'
                      - $ref: '#/components/schemas/NotFoundError'
                      - $ref: '#/components/schemas/RateLimitError'
                      - $ref: '#/components/schemas/GatewayTimeoutError'
                      - $ref: '#/components/schemas/APIError'
                      - $ref: '#/components/schemas/OverloadedError'
                    title: Error
              type:
                allOf:
                  - const: error
                    default: error
                    enum:
                      - error
                    title: Type
                    type: string
            title: ErrorResponse
            requiredProperties:
              - error
              - type
        examples:
          example:
            value:
              error:
                message: Invalid request
                type: invalid_request_error
              type: error
        description: >-
          Error response.


          See our [errors
          documentation](https://docs.anthropic.com/en/api/errors) for more
          details.
  deprecated: false
  type: path
components:
  schemas:
    APIError:
      properties:
        message:
          default: Internal server error
          title: Message
          type: string
        type:
          const: api_error
          default: api_error
          enum:
            - api_error
          title: Type
          type: string
      required:
        - message
        - type
      title: APIError
      type: object
    AuthenticationError:
      properties:
        message:
          default: Authentication error
          title: Message
          type: string
        type:
          const: authentication_error
          default: authentication_error
          enum:
            - authentication_error
          title: Type
          type: string
      required:
        - message
        - type
      title: AuthenticationError
      type: object
    Base64ImageSource:
      additionalProperties: false
      properties:
        data:
          format: byte
          title: Data
          type: string
        media_type:
          enum:
            - image/jpeg
            - image/png
            - image/gif
            - image/webp
          title: Media Type
          type: string
        type:
          const: base64
          enum:
            - base64
          title: Type
          type: string
      required:
        - data
        - media_type
        - type
      title: Base64ImageSource
      type: object
    Base64PDFSource:
      additionalProperties: false
      properties:
        data:
          format: byte
          title: Data
          type: string
        media_type:
          const: application/pdf
          enum:
            - application/pdf
          title: Media Type
          type: string
        type:
          const: base64
          enum:
            - base64
          title: Type
          type: string
      required:
        - data
        - media_type
        - type
      title: PDF (base64)
      type: object
    BashTool_20241022:
      additionalProperties: false
      properties:
        cache_control:
          anyOf:
            - discriminator:
                mapping:
                  ephemeral: '#/components/schemas/CacheControlEphemeral'
                propertyName: type
              oneOf:
                - $ref: '#/components/schemas/CacheControlEphemeral'
            - type: 'null'
          description: Create a cache control breakpoint at this content block.
          title: Cache Control
        name:
          const: bash
          description: >-
            Name of the tool.


            This is how the tool will be called by the model and in `tool_use`
            blocks.
          enum:
            - bash
          title: Name
          type: string
        type:
          const: bash_20241022
          enum:
            - bash_20241022
          title: Type
          type: string
      required:
        - name
        - type
      title: Bash tool (2024-10-22)
      type: object
    BashTool_20250124:
      additionalProperties: false
      properties:
        cache_control:
          anyOf:
            - discriminator:
                mapping:
                  ephemeral: '#/components/schemas/CacheControlEphemeral'
                propertyName: type
              oneOf:
                - $ref: '#/components/schemas/CacheControlEphemeral'
            - type: 'null'
          description: Create a cache control breakpoint at this content block.
          title: Cache Control
        name:
          const: bash
          description: >-
            Name of the tool.


            This is how the tool will be called by the model and in `tool_use`
            blocks.
          enum:
            - bash
          title: Name
          type: string
        type:
          const: bash_20250124
          enum:
            - bash_20250124
          title: Type
          type: string
      required:
        - name
        - type
      title: Bash tool (2025-01-24)
      type: object
    BillingError:
      properties:
        message:
          default: Billing error
          title: Message
          type: string
        type:
          const: billing_error
          default: billing_error
          enum:
            - billing_error
          title: Type
          type: string
      required:
        - message
        - type
      title: BillingError
      type: object
    CacheControlEphemeral:
      additionalProperties: false
      properties:
        ttl:
          description: |-
            The time-to-live for the cache control breakpoint.

            This may be one the following values:
            - `5m`: 5 minutes
            - `1h`: 1 hour

            Defaults to `5m`.
          enum:
            - 5m
            - 1h
          title: Ttl
          type: string
        type:
          const: ephemeral
          enum:
            - ephemeral
          title: Type
          type: string
      required:
        - type
      title: CacheControlEphemeral
      type: object
    CacheCreation:
      properties:
        ephemeral_1h_input_tokens:
          default: 0
          description: The number of input tokens used to create the 1 hour cache entry.
          minimum: 0
          title: Ephemeral 1H Input Tokens
          type: integer
        ephemeral_5m_input_tokens:
          default: 0
          description: The number of input tokens used to create the 5 minute cache entry.
          minimum: 0
          title: Ephemeral 5M Input Tokens
          type: integer
      required:
        - ephemeral_1h_input_tokens
        - ephemeral_5m_input_tokens
      title: CacheCreation
      type: object
    CodeExecutionToolResultErrorCode:
      enum:
        - invalid_tool_input
        - unavailable
        - too_many_requests
        - execution_time_exceeded
      title: CodeExecutionToolResultErrorCode
      type: string
    CodeExecutionTool_20250522:
      additionalProperties: false
      properties:
        cache_control:
          anyOf:
            - discriminator:
                mapping:
                  ephemeral: '#/components/schemas/CacheControlEphemeral'
                propertyName: type
              oneOf:
                - $ref: '#/components/schemas/CacheControlEphemeral'
            - type: 'null'
          description: Create a cache control breakpoint at this content block.
          title: Cache Control
        name:
          const: code_execution
          description: >-
            Name of the tool.


            This is how the tool will be called by the model and in `tool_use`
            blocks.
          enum:
            - code_execution
          title: Name
          type: string
        type:
          const: code_execution_20250522
          enum:
            - code_execution_20250522
          title: Type
          type: string
      required:
        - name
        - type
      title: Code execution tool (2025-05-22)
      type: object
    ComputerUseTool_20241022:
      additionalProperties: false
      properties:
        cache_control:
          anyOf:
            - discriminator:
                mapping:
                  ephemeral: '#/components/schemas/CacheControlEphemeral'
                propertyName: type
              oneOf:
                - $ref: '#/components/schemas/CacheControlEphemeral'
            - type: 'null'
          description: Create a cache control breakpoint at this content block.
          title: Cache Control
        display_height_px:
          description: The height of the display in pixels.
          minimum: 1
          title: Display Height Px
          type: integer
        display_number:
          anyOf:
            - minimum: 0
              type: integer
            - type: 'null'
          description: The X11 display number (e.g. 0, 1) for the display.
          title: Display Number
        display_width_px:
          description: The width of the display in pixels.
          minimum: 1
          title: Display Width Px
          type: integer
        name:
          const: computer
          description: >-
            Name of the tool.


            This is how the tool will be called by the model and in `tool_use`
            blocks.
          enum:
            - computer
          title: Name
          type: string
        type:
          const: computer_20241022
          enum:
            - computer_20241022
          title: Type
          type: string
      required:
        - display_height_px
        - display_width_px
        - name
        - type
      title: Computer use tool (2024-01-22)
      type: object
    ComputerUseTool_20250124:
      additionalProperties: false
      properties:
        cache_control:
          anyOf:
            - discriminator:
                mapping:
                  ephemeral: '#/components/schemas/CacheControlEphemeral'
                propertyName: type
              oneOf:
                - $ref: '#/components/schemas/CacheControlEphemeral'
            - type: 'null'
          description: Create a cache control breakpoint at this content block.
          title: Cache Control
        display_height_px:
          description: The height of the display in pixels.
          minimum: 1
          title: Display Height Px
          type: integer
        display_number:
          anyOf:
            - minimum: 0
              type: integer
            - type: 'null'
          description: The X11 display number (e.g. 0, 1) for the display.
          title: Display Number
        display_width_px:
          description: The width of the display in pixels.
          minimum: 1
          title: Display Width Px
          type: integer
        name:
          const: computer
          description: >-
            Name of the tool.


            This is how the tool will be called by the model and in `tool_use`
            blocks.
          enum:
            - computer
          title: Name
          type: string
        type:
          const: computer_20250124
          enum:
            - computer_20250124
          title: Type
          type: string
      required:
        - display_height_px
        - display_width_px
        - name
        - type
      title: Computer use tool (2025-01-24)
      type: object
    Container:
      description: >-
        Information about the container used in the request (for the code
        execution tool)
      properties:
        expires_at:
          description: The time at which the container will expire.
          format: date-time
          title: Expires At
          type: string
        id:
          description: Identifier for the container used in this request
          title: Id
          type: string
      required:
        - expires_at
        - id
      title: Container
      type: object
    ContentBlockSource:
      additionalProperties: false
      properties:
        content:
          anyOf:
            - type: string
            - items:
                discriminator:
                  mapping:
                    image: '#/components/schemas/RequestImageBlock'
                    text: '#/components/schemas/RequestTextBlock'
                  propertyName: type
                oneOf:
                  - $ref: '#/components/schemas/RequestTextBlock'
                  - $ref: '#/components/schemas/RequestImageBlock'
              type: array
          title: Content
        type:
          const: content
          enum:
            - content
          title: Type
          type: string
      required:
        - content
        - type
      title: Content block
      type: object
    FileDocumentSource:
      additionalProperties: false
      properties:
        file_id:
          title: File Id
          type: string
        type:
          const: file
          enum:
            - file
          title: Type
          type: string
      required:
        - file_id
        - type
      title: File document
      type: object
    FileImageSource:
      additionalProperties: false
      properties:
        file_id:
          title: File Id
          type: string
        type:
          const: file
          enum:
            - file
          title: Type
          type: string
      required:
        - file_id
        - type
      title: FileImageSource
      type: object
    GatewayTimeoutError:
      properties:
        message:
          default: Request timeout
          title: Message
          type: string
        type:
          const: timeout_error
          default: timeout_error
          enum:
            - timeout_error
          title: Type
          type: string
      required:
        - message
        - type
      title: GatewayTimeoutError
      type: object
    InputMessage:
      additionalProperties: false
      properties:
        content:
          anyOf:
            - type: string
            - items:
                discriminator:
                  mapping:
                    code_execution_tool_result: '#/components/schemas/RequestCodeExecutionToolResultBlock'
                    container_upload: '#/components/schemas/RequestContainerUploadBlock'
                    document: '#/components/schemas/RequestDocumentBlock'
                    image: '#/components/schemas/RequestImageBlock'
                    mcp_tool_result: '#/components/schemas/RequestMCPToolResultBlock'
                    mcp_tool_use: '#/components/schemas/RequestMCPToolUseBlock'
                    redacted_thinking: '#/components/schemas/RequestRedactedThinkingBlock'
                    search_result: '#/components/schemas/RequestSearchResultBlock'
                    server_tool_use: '#/components/schemas/RequestServerToolUseBlock'
                    text: '#/components/schemas/RequestTextBlock'
                    thinking: '#/components/schemas/RequestThinkingBlock'
                    tool_result: '#/components/schemas/RequestToolResultBlock'
                    tool_use: '#/components/schemas/RequestToolUseBlock'
                    web_search_tool_result: '#/components/schemas/RequestWebSearchToolResultBlock'
                  propertyName: type
                oneOf:
                  - $ref: '#/components/schemas/RequestTextBlock'
                    description: Regular text content.
                  - $ref: '#/components/schemas/RequestImageBlock'
                    description: >-
                      Image content specified directly as base64 data or as a
                      reference via a URL.
                  - $ref: '#/components/schemas/RequestDocumentBlock'
                    description: >-
                      Document content, either specified directly as base64
                      data, as text, or as a reference via a URL.
                  - $ref: '#/components/schemas/RequestSearchResultBlock'
                    description: >-
                      A search result block containing source, title, and
                      content from search operations.
                  - $ref: '#/components/schemas/RequestThinkingBlock'
                    description: A block specifying internal thinking by the model.
                  - $ref: '#/components/schemas/RequestRedactedThinkingBlock'
                    description: >-
                      A block specifying internal, redacted thinking by the
                      model.
                  - $ref: '#/components/schemas/RequestToolUseBlock'
                    description: A block indicating a tool use by the model.
                  - $ref: '#/components/schemas/RequestToolResultBlock'
                    description: A block specifying the results of a tool use by the model.
                  - $ref: '#/components/schemas/RequestServerToolUseBlock'
                  - $ref: '#/components/schemas/RequestWebSearchToolResultBlock'
                  - $ref: '#/components/schemas/RequestCodeExecutionToolResultBlock'
                  - $ref: '#/components/schemas/RequestMCPToolUseBlock'
                  - $ref: '#/components/schemas/RequestMCPToolResultBlock'
                  - $ref: '#/components/schemas/RequestContainerUploadBlock'
              type: array
          title: Content
        role:
          enum:
            - user
            - assistant
          title: Role
          type: string
      required:
        - content
        - role
      title: InputMessage
      type: object
    InputSchema:
      additionalProperties: true
      properties:
        properties:
          anyOf:
            - type: object
            - type: 'null'
          title: Properties
        required:
          anyOf:
            - items:
                type: string
              type: array
            - type: 'null'
          title: Required
        type:
          const: object
          enum:
            - object
          title: Type
          type: string
      required:
        - type
      title: InputSchema
      type: object
    InvalidRequestError:
      properties:
        message:
          default: Invalid request
          title: Message
          type: string
        type:
          const: invalid_request_error
          default: invalid_request_error
          enum:
            - invalid_request_error
          title: Type
          type: string
      required:
        - message
        - type
      title: InvalidRequestError
      type: object
    Metadata:
      additionalProperties: false
      properties:
        user_id:
          anyOf:
            - maxLength: 256
              type: string
            - type: 'null'
          description: >-
            An external identifier for the user who is associated with the
            request.


            This should be a uuid, hash value, or other opaque identifier.
            Anthropic may use this id to help detect abuse. Do not include any
            identifying information such as name, email address, or phone
            number.
          examples:
            - 13803d75-b4b5-4c3e-b2a2-6f21399b021b
          title: User Id
      title: Metadata
      type: object
    NotFoundError:
      properties:
        message:
          default: Not found
          title: Message
          type: string
        type:
          const: not_found_error
          default: not_found_error
          enum:
            - not_found_error
          title: Type
          type: string
      required:
        - message
        - type
      title: NotFoundError
      type: object
    OverloadedError:
      properties:
        message:
          default: Overloaded
          title: Message
          type: string
        type:
          const: overloaded_error
          default: overloaded_error
          enum:
            - overloaded_error
          title: Type
          type: string
      required:
        - message
        - type
      title: OverloadedError
      type: object
    PermissionError:
      properties:
        message:
          default: Permission denied
          title: Message
          type: string
        type:
          const: permission_error
          default: permission_error
          enum:
            - permission_error
          title: Type
          type: string
      required:
        - message
        - type
      title: PermissionError
      type: object
    PlainTextSource:
      additionalProperties: false
      properties:
        data:
          title: Data
          type: string
        media_type:
          const: text/plain
          enum:
            - text/plain
          title: Media Type
          type: string
        type:
          const: text
          enum:
            - text
          title: Type
          type: string
      required:
        - data
        - media_type
        - type
      title: Plain text
      type: object
    RateLimitError:
      properties:
        message:
          default: Rate limited
          title: Message
          type: string
        type:
          const: rate_limit_error
          default: rate_limit_error
          enum:
            - rate_limit_error
          title: Type
          type: string
      required:
        - message
        - type
      title: RateLimitError
      type: object
    RequestCharLocationCitation:
      additionalProperties: false
      properties:
        cited_text:
          title: Cited Text
          type: string
        document_index:
          minimum: 0
          title: Document Index
          type: integer
        document_title:
          anyOf:
            - maxLength: 255
              minLength: 1
              type: string
            - type: 'null'
          title: Document Title
        end_char_index:
          title: End Char Index
          type: integer
        start_char_index:
          minimum: 0
          title: Start Char Index
          type: integer
        type:
          const: char_location
          enum:
            - char_location
          title: Type
          type: string
      required:
        - cited_text
        - document_index
        - document_title
        - end_char_index
        - start_char_index
        - type
      title: Character location
      type: object
    RequestCitationsConfig:
      additionalProperties: false
      properties:
        enabled:
          title: Enabled
          type: boolean
      title: RequestCitationsConfig
      type: object
    RequestCodeExecutionOutputBlock:
      additionalProperties: false
      properties:
        file_id:
          title: File Id
          type: string
        type:
          const: code_execution_output
          enum:
            - code_execution_output
          title: Type
          type: string
      required:
        - file_id
        - type
      title: RequestCodeExecutionOutputBlock
      type: object
    RequestCodeExecutionResultBlock:
      additionalProperties: false
      properties:
        content:
          items:
            $ref: '#/components/schemas/RequestCodeExecutionOutputBlock'
          title: Content
          type: array
        return_code:
          title: Return Code
          type: integer
        stderr:
          title: Stderr
          type: string
        stdout:
          title: Stdout
          type: string
        type:
          const: code_execution_result
          enum:
            - code_execution_result
          title: Type
          type: string
      required:
        - content
        - return_code
        - stderr
        - stdout
        - type
      title: Code execution result
      type: object
    RequestCodeExecutionToolResultBlock:
      additionalProperties: false
      properties:
        cache_control:
          anyOf:
            - discriminator:
                mapping:
                  ephemeral: '#/components/schemas/CacheControlEphemeral'
                propertyName: type
              oneOf:
                - $ref: '#/components/schemas/CacheControlEphemeral'
            - type: 'null'
          description: Create a cache control breakpoint at this content block.
          title: Cache Control
        content:
          anyOf:
            - $ref: '#/components/schemas/RequestCodeExecutionToolResultError'
            - $ref: '#/components/schemas/RequestCodeExecutionResultBlock'
          title: Content
        tool_use_id:
          pattern: ^srvtoolu_[a-zA-Z0-9_]+$
          title: Tool Use Id
          type: string
        type:
          const: code_execution_tool_result
          enum:
            - code_execution_tool_result
          title: Type
          type: string
      required:
        - content
        - tool_use_id
        - type
      title: Code execution tool result
      type: object
    RequestCodeExecutionToolResultError:
      additionalProperties: false
      properties:
        error_code:
          $ref: '#/components/schemas/CodeExecutionToolResultErrorCode'
        type:
          const: code_execution_tool_result_error
          enum:
            - code_execution_tool_result_error
          title: Type
          type: string
      required:
        - error_code
        - type
      title: Code execution tool error
      type: object
    RequestContainerUploadBlock:
      additionalProperties: false
      description: >-
        A content block that represents a file to be uploaded to the container

        Files uploaded via this block will be available in the container's input
        directory.
      properties:
        cache_control:
          anyOf:
            - discriminator:
                mapping:
                  ephemeral: '#/components/schemas/CacheControlEphemeral'
                propertyName: type
              oneOf:
                - $ref: '#/components/schemas/CacheControlEphemeral'
            - type: 'null'
          description: Create a cache control breakpoint at this content block.
          title: Cache Control
        file_id:
          title: File Id
          type: string
        type:
          const: container_upload
          enum:
            - container_upload
          title: Type
          type: string
      required:
        - file_id
        - type
      title: Container upload
      type: object
    RequestContentBlockLocationCitation:
      additionalProperties: false
      properties:
        cited_text:
          title: Cited Text
          type: string
        document_index:
          minimum: 0
          title: Document Index
          type: integer
        document_title:
          anyOf:
            - maxLength: 255
              minLength: 1
              type: string
            - type: 'null'
          title: Document Title
        end_block_index:
          title: End Block Index
          type: integer
        start_block_index:
          minimum: 0
          title: Start Block Index
          type: integer
        type:
          const: content_block_location
          enum:
            - content_block_location
          title: Type
          type: string
      required:
        - cited_text
        - document_index
        - document_title
        - end_block_index
        - start_block_index
        - type
      title: Content block location
      type: object
    RequestDocumentBlock:
      additionalProperties: false
      properties:
        cache_control:
          anyOf:
            - discriminator:
                mapping:
                  ephemeral: '#/components/schemas/CacheControlEphemeral'
                propertyName: type
              oneOf:
                - $ref: '#/components/schemas/CacheControlEphemeral'
            - type: 'null'
          description: Create a cache control breakpoint at this content block.
          title: Cache Control
        citations:
          $ref: '#/components/schemas/RequestCitationsConfig'
        context:
          anyOf:
            - minLength: 1
              type: string
            - type: 'null'
          title: Context
        source:
          discriminator:
            mapping:
              base64: '#/components/schemas/Base64PDFSource'
              content: '#/components/schemas/ContentBlockSource'
              file: '#/components/schemas/FileDocumentSource'
              text: '#/components/schemas/PlainTextSource'
              url: '#/components/schemas/URLPDFSource'
            propertyName: type
          oneOf:
            - $ref: '#/components/schemas/Base64PDFSource'
            - $ref: '#/components/schemas/PlainTextSource'
            - $ref: '#/components/schemas/ContentBlockSource'
            - $ref: '#/components/schemas/URLPDFSource'
            - $ref: '#/components/schemas/FileDocumentSource'
        title:
          anyOf:
            - maxLength: 500
              minLength: 1
              type: string
            - type: 'null'
          title: Title
        type:
          const: document
          enum:
            - document
          title: Type
          type: string
      required:
        - source
        - type
      title: Document
      type: object
    RequestImageBlock:
      additionalProperties: false
      properties:
        cache_control:
          anyOf:
            - discriminator:
                mapping:
                  ephemeral: '#/components/schemas/CacheControlEphemeral'
                propertyName: type
              oneOf:
                - $ref: '#/components/schemas/CacheControlEphemeral'
            - type: 'null'
          description: Create a cache control breakpoint at this content block.
          title: Cache Control
        source:
          discriminator:
            mapping:
              base64: '#/components/schemas/Base64ImageSource'
              file: '#/components/schemas/FileImageSource'
              url: '#/components/schemas/URLImageSource'
            propertyName: type
          oneOf:
            - $ref: '#/components/schemas/Base64ImageSource'
            - $ref: '#/components/schemas/URLImageSource'
            - $ref: '#/components/schemas/FileImageSource'
          title: Source
        type:
          const: image
          enum:
            - image
          title: Type
          type: string
      required:
        - source
        - type
      title: Image
      type: object
    RequestMCPServerToolConfiguration:
      additionalProperties: false
      properties:
        allowed_tools:
          anyOf:
            - items:
                type: string
              type: array
            - type: 'null'
          title: Allowed Tools
        enabled:
          anyOf:
            - type: boolean
            - type: 'null'
          title: Enabled
      title: RequestMCPServerToolConfiguration
      type: object
    RequestMCPServerURLDefinition:
      additionalProperties: false
      properties:
        authorization_token:
          anyOf:
            - type: string
            - type: 'null'
          title: Authorization Token
        name:
          title: Name
          type: string
        tool_configuration:
          anyOf:
            - $ref: '#/components/schemas/RequestMCPServerToolConfiguration'
            - type: 'null'
        type:
          const: url
          enum:
            - url
          title: Type
          type: string
        url:
          title: Url
          type: string
      required:
        - name
        - type
        - url
      title: RequestMCPServerURLDefinition
      type: object
    RequestMCPToolResultBlock:
      additionalProperties: false
      properties:
        cache_control:
          anyOf:
            - discriminator:
                mapping:
                  ephemeral: '#/components/schemas/CacheControlEphemeral'
                propertyName: type
              oneOf:
                - $ref: '#/components/schemas/CacheControlEphemeral'
            - type: 'null'
          description: Create a cache control breakpoint at this content block.
          title: Cache Control
        content:
          anyOf:
            - type: string
            - items:
                $ref: '#/components/schemas/RequestTextBlock'
              type: array
          title: Content
        is_error:
          title: Is Error
          type: boolean
        tool_use_id:
          pattern: ^[a-zA-Z0-9_-]+$
          title: Tool Use Id
          type: string
        type:
          const: mcp_tool_result
          enum:
            - mcp_tool_result
          title: Type
          type: string
      required:
        - tool_use_id
        - type
      title: MCP tool result
      type: object
    RequestMCPToolUseBlock:
      additionalProperties: false
      properties:
        cache_control:
          anyOf:
            - discriminator:
                mapping:
                  ephemeral: '#/components/schemas/CacheControlEphemeral'
                propertyName: type
              oneOf:
                - $ref: '#/components/schemas/CacheControlEphemeral'
            - type: 'null'
          description: Create a cache control breakpoint at this content block.
          title: Cache Control
        id:
          pattern: ^[a-zA-Z0-9_-]+$
          title: Id
          type: string
        input:
          title: Input
          type: object
        name:
          title: Name
          type: string
        server_name:
          description: The name of the MCP server
          title: Server Name
          type: string
        type:
          const: mcp_tool_use
          enum:
            - mcp_tool_use
          title: Type
          type: string
      required:
        - id
        - input
        - name
        - server_name
        - type
      title: MCP tool use
      type: object
    RequestPageLocationCitation:
      additionalProperties: false
      properties:
        cited_text:
          title: Cited Text
          type: string
        document_index:
          minimum: 0
          title: Document Index
          type: integer
        document_title:
          anyOf:
            - maxLength: 255
              minLength: 1
              type: string
            - type: 'null'
          title: Document Title
        end_page_number:
          title: End Page Number
          type: integer
        start_page_number:
          minimum: 1
          title: Start Page Number
          type: integer
        type:
          const: page_location
          enum:
            - page_location
          title: Type
          type: string
      required:
        - cited_text
        - document_index
        - document_title
        - end_page_number
        - start_page_number
        - type
      title: Page location
      type: object
    RequestRedactedThinkingBlock:
      additionalProperties: false
      properties:
        data:
          title: Data
          type: string
        type:
          const: redacted_thinking
          enum:
            - redacted_thinking
          title: Type
          type: string
      required:
        - data
        - type
      title: Redacted thinking
      type: object
    RequestSearchResultBlock:
      additionalProperties: false
      properties:
        cache_control:
          anyOf:
            - discriminator:
                mapping:
                  ephemeral: '#/components/schemas/CacheControlEphemeral'
                propertyName: type
              oneOf:
                - $ref: '#/components/schemas/CacheControlEphemeral'
            - type: 'null'
          description: Create a cache control breakpoint at this content block.
          title: Cache Control
        citations:
          $ref: '#/components/schemas/RequestCitationsConfig'
        content:
          items:
            $ref: '#/components/schemas/RequestTextBlock'
          title: Content
          type: array
        source:
          title: Source
          type: string
        title:
          title: Title
          type: string
        type:
          const: search_result
          enum:
            - search_result
          title: Type
          type: string
      required:
        - content
        - source
        - title
        - type
      title: RequestSearchResultBlock
      type: object
    RequestSearchResultLocationCitation:
      properties:
        cited_text:
          title: Cited Text
          type: string
        end_block_index:
          title: End Block Index
          type: integer
        search_result_index:
          minimum: 0
          title: Search Result Index
          type: integer
        source:
          title: Source
          type: string
        start_block_index:
          minimum: 0
          title: Start Block Index
          type: integer
        title:
          anyOf:
            - type: string
            - type: 'null'
          title: Title
        type:
          const: search_result_location
          default: search_result_location
          enum:
            - search_result_location
          title: Type
          type: string
      required:
        - cited_text
        - end_block_index
        - search_result_index
        - source
        - start_block_index
        - title
        - type
      title: RequestSearchResultLocationCitation
      type: object
    RequestServerToolUseBlock:
      additionalProperties: false
      properties:
        cache_control:
          anyOf:
            - discriminator:
                mapping:
                  ephemeral: '#/components/schemas/CacheControlEphemeral'
                propertyName: type
              oneOf:
                - $ref: '#/components/schemas/CacheControlEphemeral'
            - type: 'null'
          description: Create a cache control breakpoint at this content block.
          title: Cache Control
        id:
          pattern: ^srvtoolu_[a-zA-Z0-9_]+$
          title: Id
          type: string
        input:
          title: Input
          type: object
        name:
          enum:
            - web_search
            - code_execution
          title: Name
          type: string
        type:
          const: server_tool_use
          enum:
            - server_tool_use
          title: Type
          type: string
      required:
        - id
        - input
        - name
        - type
      title: Server tool use
      type: object
    RequestTextBlock:
      additionalProperties: false
      properties:
        cache_control:
          anyOf:
            - discriminator:
                mapping:
                  ephemeral: '#/components/schemas/CacheControlEphemeral'
                propertyName: type
              oneOf:
                - $ref: '#/components/schemas/CacheControlEphemeral'
            - type: 'null'
          description: Create a cache control breakpoint at this content block.
          title: Cache Control
        citations:
          anyOf:
            - items:
                discriminator:
                  mapping:
                    char_location: '#/components/schemas/RequestCharLocationCitation'
                    content_block_location: '#/components/schemas/RequestContentBlockLocationCitation'
                    page_location: '#/components/schemas/RequestPageLocationCitation'
                    search_result_location: '#/components/schemas/RequestSearchResultLocationCitation'
                    web_search_result_location: >-
                      #/components/schemas/RequestWebSearchResultLocationCitation
                  propertyName: type
                oneOf:
                  - $ref: '#/components/schemas/RequestCharLocationCitation'
                  - $ref: '#/components/schemas/RequestPageLocationCitation'
                  - $ref: '#/components/schemas/RequestContentBlockLocationCitation'
                  - $ref: >-
                      #/components/schemas/RequestWebSearchResultLocationCitation
                  - $ref: '#/components/schemas/RequestSearchResultLocationCitation'
              type: array
            - type: 'null'
          title: Citations
        text:
          minLength: 1
          title: Text
          type: string
        type:
          const: text
          enum:
            - text
          title: Type
          type: string
      required:
        - text
        - type
      title: Text
      type: object
    RequestThinkingBlock:
      additionalProperties: false
      properties:
        signature:
          title: Signature
          type: string
        thinking:
          title: Thinking
          type: string
        type:
          const: thinking
          enum:
            - thinking
          title: Type
          type: string
      required:
        - signature
        - thinking
        - type
      title: Thinking
      type: object
    RequestToolResultBlock:
      additionalProperties: false
      properties:
        cache_control:
          anyOf:
            - discriminator:
                mapping:
                  ephemeral: '#/components/schemas/CacheControlEphemeral'
                propertyName: type
              oneOf:
                - $ref: '#/components/schemas/CacheControlEphemeral'
            - type: 'null'
          description: Create a cache control breakpoint at this content block.
          title: Cache Control
        content:
          anyOf:
            - type: string
            - items:
                discriminator:
                  mapping:
                    image: '#/components/schemas/RequestImageBlock'
                    search_result: '#/components/schemas/RequestSearchResultBlock'
                    text: '#/components/schemas/RequestTextBlock'
                  propertyName: type
                oneOf:
                  - $ref: '#/components/schemas/RequestTextBlock'
                  - $ref: '#/components/schemas/RequestImageBlock'
                  - $ref: '#/components/schemas/RequestSearchResultBlock'
              type: array
          title: Content
        is_error:
          title: Is Error
          type: boolean
        tool_use_id:
          pattern: ^[a-zA-Z0-9_-]+$
          title: Tool Use Id
          type: string
        type:
          const: tool_result
          enum:
            - tool_result
          title: Type
          type: string
      required:
        - tool_use_id
        - type
      title: Tool result
      type: object
    RequestToolUseBlock:
      additionalProperties: false
      properties:
        cache_control:
          anyOf:
            - discriminator:
                mapping:
                  ephemeral: '#/components/schemas/CacheControlEphemeral'
                propertyName: type
              oneOf:
                - $ref: '#/components/schemas/CacheControlEphemeral'
            - type: 'null'
          description: Create a cache control breakpoint at this content block.
          title: Cache Control
        id:
          pattern: ^[a-zA-Z0-9_-]+$
          title: Id
          type: string
        input:
          title: Input
          type: object
        name:
          maxLength: 200
          minLength: 1
          title: Name
          type: string
        type:
          const: tool_use
          enum:
            - tool_use
          title: Type
          type: string
      required:
        - id
        - input
        - name
        - type
      title: Tool use
      type: object
    RequestWebSearchResultBlock:
      additionalProperties: false
      properties:
        encrypted_content:
          title: Encrypted Content
          type: string
        page_age:
          anyOf:
            - type: string
            - type: 'null'
          title: Page Age
        title:
          title: Title
          type: string
        type:
          const: web_search_result
          enum:
            - web_search_result
          title: Type
          type: string
        url:
          title: Url
          type: string
      required:
        - encrypted_content
        - title
        - type
        - url
      title: RequestWebSearchResultBlock
      type: object
    RequestWebSearchResultLocationCitation:
      additionalProperties: false
      properties:
        cited_text:
          title: Cited Text
          type: string
        encrypted_index:
          title: Encrypted Index
          type: string
        title:
          anyOf:
            - maxLength: 512
              minLength: 1
              type: string
            - type: 'null'
          title: Title
        type:
          const: web_search_result_location
          enum:
            - web_search_result_location
          title: Type
          type: string
        url:
          maxLength: 2048
          minLength: 1
          title: Url
          type: string
      required:
        - cited_text
        - encrypted_index
        - title
        - type
        - url
      title: RequestWebSearchResultLocationCitation
      type: object
    RequestWebSearchToolResultBlock:
      additionalProperties: false
      properties:
        cache_control:
          anyOf:
            - discriminator:
                mapping:
                  ephemeral: '#/components/schemas/CacheControlEphemeral'
                propertyName: type
              oneOf:
                - $ref: '#/components/schemas/CacheControlEphemeral'
            - type: 'null'
          description: Create a cache control breakpoint at this content block.
          title: Cache Control
        content:
          anyOf:
            - items:
                $ref: '#/components/schemas/RequestWebSearchResultBlock'
              type: array
            - $ref: '#/components/schemas/RequestWebSearchToolResultError'
          title: Content
        tool_use_id:
          pattern: ^srvtoolu_[a-zA-Z0-9_]+$
          title: Tool Use Id
          type: string
        type:
          const: web_search_tool_result
          enum:
            - web_search_tool_result
          title: Type
          type: string
      required:
        - content
        - tool_use_id
        - type
      title: Web search tool result
      type: object
    RequestWebSearchToolResultError:
      additionalProperties: false
      properties:
        error_code:
          $ref: '#/components/schemas/WebSearchToolResultErrorCode'
        type:
          const: web_search_tool_result_error
          enum:
            - web_search_tool_result_error
          title: Type
          type: string
      required:
        - error_code
        - type
      title: RequestWebSearchToolResultError
      type: object
    ResponseCharLocationCitation:
      properties:
        cited_text:
          title: Cited Text
          type: string
        document_index:
          minimum: 0
          title: Document Index
          type: integer
        document_title:
          anyOf:
            - type: string
            - type: 'null'
          title: Document Title
        end_char_index:
          title: End Char Index
          type: integer
        start_char_index:
          minimum: 0
          title: Start Char Index
          type: integer
        type:
          const: char_location
          default: char_location
          enum:
            - char_location
          title: Type
          type: string
      required:
        - cited_text
        - document_index
        - document_title
        - end_char_index
        - start_char_index
        - type
      title: Character location
      type: object
    ResponseCodeExecutionOutputBlock:
      properties:
        file_id:
          title: File Id
          type: string
        type:
          const: code_execution_output
          default: code_execution_output
          enum:
            - code_execution_output
          title: Type
          type: string
      required:
        - file_id
        - type
      title: ResponseCodeExecutionOutputBlock
      type: object
    ResponseCodeExecutionResultBlock:
      properties:
        content:
          items:
            $ref: '#/components/schemas/ResponseCodeExecutionOutputBlock'
          title: Content
          type: array
        return_code:
          title: Return Code
          type: integer
        stderr:
          title: Stderr
          type: string
        stdout:
          title: Stdout
          type: string
        type:
          const: code_execution_result
          default: code_execution_result
          enum:
            - code_execution_result
          title: Type
          type: string
      required:
        - content
        - return_code
        - stderr
        - stdout
        - type
      title: Code execution result
      type: object
    ResponseCodeExecutionToolResultBlock:
      properties:
        content:
          anyOf:
            - $ref: '#/components/schemas/ResponseCodeExecutionToolResultError'
            - $ref: '#/components/schemas/ResponseCodeExecutionResultBlock'
          title: Content
        tool_use_id:
          pattern: ^srvtoolu_[a-zA-Z0-9_]+$
          title: Tool Use Id
          type: string
        type:
          const: code_execution_tool_result
          default: code_execution_tool_result
          enum:
            - code_execution_tool_result
          title: Type
          type: string
      required:
        - content
        - tool_use_id
        - type
      title: Code execution tool result
      type: object
    ResponseCodeExecutionToolResultError:
      properties:
        error_code:
          $ref: '#/components/schemas/CodeExecutionToolResultErrorCode'
        type:
          const: code_execution_tool_result_error
          default: code_execution_tool_result_error
          enum:
            - code_execution_tool_result_error
          title: Type
          type: string
      required:
        - error_code
        - type
      title: Code execution tool error
      type: object
    ResponseContainerUploadBlock:
      description: Response model for a file uploaded to the container.
      properties:
        file_id:
          title: File Id
          type: string
        type:
          const: container_upload
          default: container_upload
          enum:
            - container_upload
          title: Type
          type: string
      required:
        - file_id
        - type
      title: Container upload
      type: object
    ResponseContentBlockLocationCitation:
      properties:
        cited_text:
          title: Cited Text
          type: string
        document_index:
          minimum: 0
          title: Document Index
          type: integer
        document_title:
          anyOf:
            - type: string
            - type: 'null'
          title: Document Title
        end_block_index:
          title: End Block Index
          type: integer
        start_block_index:
          minimum: 0
          title: Start Block Index
          type: integer
        type:
          const: content_block_location
          default: content_block_location
          enum:
            - content_block_location
          title: Type
          type: string
      required:
        - cited_text
        - document_index
        - document_title
        - end_block_index
        - start_block_index
        - type
      title: Content block location
      type: object
    ResponseMCPToolResultBlock:
      properties:
        content:
          anyOf:
            - type: string
            - items:
                $ref: '#/components/schemas/ResponseTextBlock'
              type: array
          title: Content
        is_error:
          default: false
          title: Is Error
          type: boolean
        tool_use_id:
          pattern: ^[a-zA-Z0-9_-]+$
          title: Tool Use Id
          type: string
        type:
          const: mcp_tool_result
          default: mcp_tool_result
          enum:
            - mcp_tool_result
          title: Type
          type: string
      required:
        - content
        - is_error
        - tool_use_id
        - type
      title: MCP tool result
      type: object
    ResponseMCPToolUseBlock:
      properties:
        id:
          pattern: ^[a-zA-Z0-9_-]+$
          title: Id
          type: string
        input:
          title: Input
          type: object
        name:
          description: The name of the MCP tool
          title: Name
          type: string
        server_name:
          description: The name of the MCP server
          title: Server Name
          type: string
        type:
          const: mcp_tool_use
          default: mcp_tool_use
          enum:
            - mcp_tool_use
          title: Type
          type: string
      required:
        - id
        - input
        - name
        - server_name
        - type
      title: MCP tool use
      type: object
    ResponsePageLocationCitation:
      properties:
        cited_text:
          title: Cited Text
          type: string
        document_index:
          minimum: 0
          title: Document Index
          type: integer
        document_title:
          anyOf:
            - type: string
            - type: 'null'
          title: Document Title
        end_page_number:
          title: End Page Number
          type: integer
        start_page_number:
          minimum: 1
          title: Start Page Number
          type: integer
        type:
          const: page_location
          default: page_location
          enum:
            - page_location
          title: Type
          type: string
      required:
        - cited_text
        - document_index
        - document_title
        - end_page_number
        - start_page_number
        - type
      title: Page location
      type: object
    ResponseRedactedThinkingBlock:
      properties:
        data:
          title: Data
          type: string
        type:
          const: redacted_thinking
          default: redacted_thinking
          enum:
            - redacted_thinking
          title: Type
          type: string
      required:
        - data
        - type
      title: Redacted thinking
      type: object
    ResponseSearchResultLocationCitation:
      properties:
        cited_text:
          title: Cited Text
          type: string
        end_block_index:
          title: End Block Index
          type: integer
        search_result_index:
          minimum: 0
          title: Search Result Index
          type: integer
        source:
          title: Source
          type: string
        start_block_index:
          minimum: 0
          title: Start Block Index
          type: integer
        title:
          anyOf:
            - type: string
            - type: 'null'
          title: Title
        type:
          const: search_result_location
          default: search_result_location
          enum:
            - search_result_location
          title: Type
          type: string
      required:
        - cited_text
        - end_block_index
        - search_result_index
        - source
        - start_block_index
        - title
        - type
      title: ResponseSearchResultLocationCitation
      type: object
    ResponseServerToolUseBlock:
      properties:
        id:
          pattern: ^srvtoolu_[a-zA-Z0-9_]+$
          title: Id
          type: string
        input:
          title: Input
          type: object
        name:
          enum:
            - web_search
            - code_execution
          title: Name
          type: string
        type:
          const: server_tool_use
          default: server_tool_use
          enum:
            - server_tool_use
          title: Type
          type: string
      required:
        - id
        - input
        - name
        - type
      title: Server tool use
      type: object
    ResponseTextBlock:
      properties:
        citations:
          anyOf:
            - items:
                discriminator:
                  mapping:
                    char_location: '#/components/schemas/ResponseCharLocationCitation'
                    content_block_location: '#/components/schemas/ResponseContentBlockLocationCitation'
                    page_location: '#/components/schemas/ResponsePageLocationCitation'
                    search_result_location: '#/components/schemas/ResponseSearchResultLocationCitation'
                    web_search_result_location: >-
                      #/components/schemas/ResponseWebSearchResultLocationCitation
                  propertyName: type
                oneOf:
                  - $ref: '#/components/schemas/ResponseCharLocationCitation'
                  - $ref: '#/components/schemas/ResponsePageLocationCitation'
                  - $ref: '#/components/schemas/ResponseContentBlockLocationCitation'
                  - $ref: >-
                      #/components/schemas/ResponseWebSearchResultLocationCitation
                  - $ref: '#/components/schemas/ResponseSearchResultLocationCitation'
              type: array
            - type: 'null'
          default: null
          description: >-
            Citations supporting the text block.


            The type of citation returned will depend on the type of document
            being cited. Citing a PDF results in `page_location`, plain text
            results in `char_location`, and content document results in
            `content_block_location`.
          title: Citations
        text:
          maxLength: 5000000
          minLength: 0
          title: Text
          type: string
        type:
          const: text
          default: text
          enum:
            - text
          title: Type
          type: string
      required:
        - citations
        - text
        - type
      title: Text
      type: object
    ResponseThinkingBlock:
      properties:
        signature:
          title: Signature
          type: string
        thinking:
          title: Thinking
          type: string
        type:
          const: thinking
          default: thinking
          enum:
            - thinking
          title: Type
          type: string
      required:
        - signature
        - thinking
        - type
      title: Thinking
      type: object
    ResponseToolUseBlock:
      properties:
        id:
          pattern: ^[a-zA-Z0-9_-]+$
          title: Id
          type: string
        input:
          title: Input
          type: object
        name:
          minLength: 1
          title: Name
          type: string
        type:
          const: tool_use
          default: tool_use
          enum:
            - tool_use
          title: Type
          type: string
      required:
        - id
        - input
        - name
        - type
      title: Tool use
      type: object
    ResponseWebSearchResultBlock:
      properties:
        encrypted_content:
          title: Encrypted Content
          type: string
        page_age:
          anyOf:
            - type: string
            - type: 'null'
          default: null
          title: Page Age
        title:
          title: Title
          type: string
        type:
          const: web_search_result
          default: web_search_result
          enum:
            - web_search_result
          title: Type
          type: string
        url:
          title: Url
          type: string
      required:
        - encrypted_content
        - page_age
        - title
        - type
        - url
      title: ResponseWebSearchResultBlock
      type: object
    ResponseWebSearchResultLocationCitation:
      properties:
        cited_text:
          title: Cited Text
          type: string
        encrypted_index:
          title: Encrypted Index
          type: string
        title:
          anyOf:
            - maxLength: 512
              type: string
            - type: 'null'
          title: Title
        type:
          const: web_search_result_location
          default: web_search_result_location
          enum:
            - web_search_result_location
          title: Type
          type: string
        url:
          title: Url
          type: string
      required:
        - cited_text
        - encrypted_index
        - title
        - type
        - url
      title: ResponseWebSearchResultLocationCitation
      type: object
    ResponseWebSearchToolResultBlock:
      properties:
        content:
          anyOf:
            - $ref: '#/components/schemas/ResponseWebSearchToolResultError'
            - items:
                $ref: '#/components/schemas/ResponseWebSearchResultBlock'
              type: array
          title: Content
        tool_use_id:
          pattern: ^srvtoolu_[a-zA-Z0-9_]+$
          title: Tool Use Id
          type: string
        type:
          const: web_search_tool_result
          default: web_search_tool_result
          enum:
            - web_search_tool_result
          title: Type
          type: string
      required:
        - content
        - tool_use_id
        - type
      title: Web search tool result
      type: object
    ResponseWebSearchToolResultError:
      properties:
        error_code:
          $ref: '#/components/schemas/WebSearchToolResultErrorCode'
        type:
          const: web_search_tool_result_error
          default: web_search_tool_result_error
          enum:
            - web_search_tool_result_error
          title: Type
          type: string
      required:
        - error_code
        - type
      title: ResponseWebSearchToolResultError
      type: object
    ServerToolUsage:
      properties:
        web_search_requests:
          default: 0
          description: The number of web search tool requests.
          examples:
            - 0
          minimum: 0
          title: Web Search Requests
          type: integer
      required:
        - web_search_requests
      title: ServerToolUsage
      type: object
    TextEditor_20241022:
      additionalProperties: false
      properties:
        cache_control:
          anyOf:
            - discriminator:
                mapping:
                  ephemeral: '#/components/schemas/CacheControlEphemeral'
                propertyName: type
              oneOf:
                - $ref: '#/components/schemas/CacheControlEphemeral'
            - type: 'null'
          description: Create a cache control breakpoint at this content block.
          title: Cache Control
        name:
          const: str_replace_editor
          description: >-
            Name of the tool.


            This is how the tool will be called by the model and in `tool_use`
            blocks.
          enum:
            - str_replace_editor
          title: Name
          type: string
        type:
          const: text_editor_20241022
          enum:
            - text_editor_20241022
          title: Type
          type: string
      required:
        - name
        - type
      title: Text editor tool (2024-10-22)
      type: object
    TextEditor_20250124:
      additionalProperties: false
      properties:
        cache_control:
          anyOf:
            - discriminator:
                mapping:
                  ephemeral: '#/components/schemas/CacheControlEphemeral'
                propertyName: type
              oneOf:
                - $ref: '#/components/schemas/CacheControlEphemeral'
            - type: 'null'
          description: Create a cache control breakpoint at this content block.
          title: Cache Control
        name:
          const: str_replace_editor
          description: >-
            Name of the tool.


            This is how the tool will be called by the model and in `tool_use`
            blocks.
          enum:
            - str_replace_editor
          title: Name
          type: string
        type:
          const: text_editor_20250124
          enum:
            - text_editor_20250124
          title: Type
          type: string
      required:
        - name
        - type
      title: Text editor tool (2025-01-24)
      type: object
    TextEditor_20250429:
      additionalProperties: false
      properties:
        cache_control:
          anyOf:
            - discriminator:
                mapping:
                  ephemeral: '#/components/schemas/CacheControlEphemeral'
                propertyName: type
              oneOf:
                - $ref: '#/components/schemas/CacheControlEphemeral'
            - type: 'null'
          description: Create a cache control breakpoint at this content block.
          title: Cache Control
        name:
          const: str_replace_based_edit_tool
          description: >-
            Name of the tool.


            This is how the tool will be called by the model and in `tool_use`
            blocks.
          enum:
            - str_replace_based_edit_tool
          title: Name
          type: string
        type:
          const: text_editor_20250429
          enum:
            - text_editor_20250429
          title: Type
          type: string
      required:
        - name
        - type
      title: Text editor tool (2025-04-29)
      type: object
    ThinkingConfigDisabled:
      additionalProperties: false
      properties:
        type:
          const: disabled
          enum:
            - disabled
          title: Type
          type: string
      required:
        - type
      title: Disabled
      type: object
    ThinkingConfigEnabled:
      additionalProperties: false
      properties:
        budget_tokens:
          description: >-
            Determines how many tokens Claude can use for its internal reasoning
            process. Larger budgets can enable more thorough analysis for
            complex problems, improving response quality. 


            Must be ≥1024 and less than `max_tokens`.


            See [extended
            thinking](https://docs.anthropic.com/en/docs/build-with-claude/extended-thinking)
            for details.
          minimum: 1024
          title: Budget Tokens
          type: integer
        type:
          const: enabled
          enum:
            - enabled
          title: Type
          type: string
      required:
        - budget_tokens
        - type
      title: Enabled
      type: object
    Tool:
      additionalProperties: false
      properties:
        type:
          anyOf:
            - type: 'null'
            - const: custom
              enum:
                - custom
              type: string
          title: Type
        description:
          description: >-
            Description of what this tool does.


            Tool descriptions should be as detailed as possible. The more
            information that the model has about what the tool is and how to use
            it, the better it will perform. You can use natural language
            descriptions to reinforce important aspects of the tool input JSON
            schema.
          examples:
            - Get the current weather in a given location
          title: Description
          type: string
        name:
          description: >-
            Name of the tool.


            This is how the tool will be called by the model and in `tool_use`
            blocks.
          maxLength: 128
          minLength: 1
          pattern: ^[a-zA-Z0-9_-]{1,128}$
          title: Name
          type: string
        input_schema:
          $ref: '#/components/schemas/InputSchema'
          description: >-
            [JSON schema](https://json-schema.org/draft/2020-12) for this tool's
            input.


            This defines the shape of the `input` that your tool accepts and
            that the model will produce.
          examples:
            - properties:
                location:
                  description: The city and state, e.g. San Francisco, CA
                  type: string
                unit:
                  description: Unit for the output - one of (celsius, fahrenheit)
                  type: string
              required:
                - location
              type: object
        cache_control:
          anyOf:
            - discriminator:
                mapping:
                  ephemeral: '#/components/schemas/CacheControlEphemeral'
                propertyName: type
              oneOf:
                - $ref: '#/components/schemas/CacheControlEphemeral'
            - type: 'null'
          description: Create a cache control breakpoint at this content block.
          title: Cache Control
      required:
        - name
        - input_schema
      title: Custom tool
      type: object
    ToolChoiceAny:
      additionalProperties: false
      description: The model will use any available tools.
      properties:
        disable_parallel_tool_use:
          description: >-
            Whether to disable parallel tool use.


            Defaults to `false`. If set to `true`, the model will output exactly
            one tool use.
          title: Disable Parallel Tool Use
          type: boolean
        type:
          const: any
          enum:
            - any
          title: Type
          type: string
      required:
        - type
      title: Any
      type: object
    ToolChoiceAuto:
      additionalProperties: false
      description: The model will automatically decide whether to use tools.
      properties:
        disable_parallel_tool_use:
          description: >-
            Whether to disable parallel tool use.


            Defaults to `false`. If set to `true`, the model will output at most
            one tool use.
          title: Disable Parallel Tool Use
          type: boolean
        type:
          const: auto
          enum:
            - auto
          title: Type
          type: string
      required:
        - type
      title: Auto
      type: object
    ToolChoiceNone:
      additionalProperties: false
      description: The model will not be allowed to use tools.
      properties:
        type:
          const: none
          enum:
            - none
          title: Type
          type: string
      required:
        - type
      title: None
      type: object
    ToolChoiceTool:
      additionalProperties: false
      description: The model will use the specified tool with `tool_choice.name`.
      properties:
        disable_parallel_tool_use:
          description: >-
            Whether to disable parallel tool use.


            Defaults to `false`. If set to `true`, the model will output exactly
            one tool use.
          title: Disable Parallel Tool Use
          type: boolean
        name:
          description: The name of the tool to use.
          title: Name
          type: string
        type:
          const: tool
          enum:
            - tool
          title: Type
          type: string
      required:
        - name
        - type
      title: Tool
      type: object
    URLImageSource:
      additionalProperties: false
      properties:
        type:
          const: url
          enum:
            - url
          title: Type
          type: string
        url:
          title: Url
          type: string
      required:
        - type
        - url
      title: URLImageSource
      type: object
    URLPDFSource:
      additionalProperties: false
      properties:
        type:
          const: url
          enum:
            - url
          title: Type
          type: string
        url:
          title: Url
          type: string
      required:
        - type
        - url
      title: PDF (URL)
      type: object
    Usage:
      properties:
        cache_creation:
          anyOf:
            - $ref: '#/components/schemas/CacheCreation'
            - type: 'null'
          default: null
          description: Breakdown of cached tokens by TTL
        cache_creation_input_tokens:
          anyOf:
            - minimum: 0
              type: integer
            - type: 'null'
          default: null
          description: The number of input tokens used to create the cache entry.
          examples:
            - 2051
          title: Cache Creation Input Tokens
        cache_read_input_tokens:
          anyOf:
            - minimum: 0
              type: integer
            - type: 'null'
          default: null
          description: The number of input tokens read from the cache.
          examples:
            - 2051
          title: Cache Read Input Tokens
        input_tokens:
          description: The number of input tokens which were used.
          examples:
            - 2095
          minimum: 0
          title: Input Tokens
          type: integer
        output_tokens:
          description: The number of output tokens which were used.
          examples:
            - 503
          minimum: 0
          title: Output Tokens
          type: integer
        server_tool_use:
          anyOf:
            - $ref: '#/components/schemas/ServerToolUsage'
            - type: 'null'
          default: null
          description: The number of server tool requests.
        service_tier:
          anyOf:
            - enum:
                - standard
                - priority
                - batch
              type: string
            - type: 'null'
          default: null
          description: If the request used the priority, standard, or batch tier.
          title: Service Tier
      required:
        - cache_creation
        - cache_creation_input_tokens
        - cache_read_input_tokens
        - input_tokens
        - output_tokens
        - server_tool_use
        - service_tier
      title: Usage
      type: object
    UserLocation:
      additionalProperties: false
      properties:
        city:
          anyOf:
            - maxLength: 255
              minLength: 1
              type: string
            - type: 'null'
          description: The city of the user.
          examples:
            - New York
            - Tokyo
            - Los Angeles
          title: City
        country:
          anyOf:
            - maxLength: 2
              minLength: 2
              type: string
            - type: 'null'
          description: >-
            The two letter [ISO country
            code](https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2) of the user.
          examples:
            - US
            - JP
            - GB
          title: Country
        region:
          anyOf:
            - maxLength: 255
              minLength: 1
              type: string
            - type: 'null'
          description: The region of the user.
          examples:
            - California
            - Ontario
            - Wales
          title: Region
        timezone:
          anyOf:
            - maxLength: 255
              minLength: 1
              type: string
            - type: 'null'
          description: The [IANA timezone](https://nodatime.org/TimeZones) of the user.
          examples:
            - America/New_York
            - Asia/Tokyo
            - Europe/London
          title: Timezone
        type:
          const: approximate
          enum:
            - approximate
          title: Type
          type: string
      required:
        - type
      title: UserLocation
      type: object
    WebSearchToolResultErrorCode:
      enum:
        - invalid_tool_input
        - unavailable
        - max_uses_exceeded
        - too_many_requests
        - query_too_long
      title: WebSearchToolResultErrorCode
      type: string
    WebSearchTool_20250305:
      additionalProperties: false
      properties:
        allowed_domains:
          anyOf:
            - items:
                type: string
              type: array
            - type: 'null'
          description: >-
            If provided, only these domains will be included in results. Cannot
            be used alongside `blocked_domains`.
          title: Allowed Domains
        blocked_domains:
          anyOf:
            - items:
                type: string
              type: array
            - type: 'null'
          description: >-
            If provided, these domains will never appear in results. Cannot be
            used alongside `allowed_domains`.
          title: Blocked Domains
        cache_control:
          anyOf:
            - discriminator:
                mapping:
                  ephemeral: '#/components/schemas/CacheControlEphemeral'
                propertyName: type
              oneOf:
                - $ref: '#/components/schemas/CacheControlEphemeral'
            - type: 'null'
          description: Create a cache control breakpoint at this content block.
          title: Cache Control
        max_uses:
          anyOf:
            - exclusiveMinimum: 0
              type: integer
            - type: 'null'
          description: Maximum number of times the tool can be used in the API request.
          title: Max Uses
        name:
          const: web_search
          description: >-
            Name of the tool.


            This is how the tool will be called by the model and in `tool_use`
            blocks.
          enum:
            - web_search
          title: Name
          type: string
        type:
          const: web_search_20250305
          enum:
            - web_search_20250305
          title: Type
          type: string
        user_location:
          anyOf:
            - $ref: '#/components/schemas/UserLocation'
            - type: 'null'
          description: >-
            Parameters for the user's location. Used to provide more relevant
            search results.
      required:
        - name
        - type
      title: Web search tool (2025-03-05)
      type: object

````

# Count Message tokens

> Count the number of tokens in a Message.

The Token Count API can be used to count the number of tokens in a Message, including tools, images, and documents, without creating it.

Learn more about token counting in our [user guide](/en/docs/build-with-claude/token-counting)

## OpenAPI

````yaml post /v1/messages/count_tokens
paths:
  path: /v1/messages/count_tokens
  method: post
  servers:
    - url: https://api.anthropic.com
  request:
    security: []
    parameters:
      path: {}
      query: {}
      header:
        anthropic-beta:
          schema:
            - type: array
              items:
                allOf:
                  - type: string
              required: false
              title: Anthropic-Beta
              description: >-
                Optional header to specify the beta version(s) you want to use.


                To use multiple betas, use a comma separated list like
                `beta1,beta2` or specify the header multiple times for each
                beta.
        anthropic-version:
          schema:
            - type: string
              required: true
              title: Anthropic-Version
              description: >-
                The version of the Anthropic API you want to use.


                Read more about versioning and our version history
                [here](https://docs.anthropic.com/en/api/versioning).
        x-api-key:
          schema:
            - type: string
              required: true
              title: X-Api-Key
              description: >-
                Your unique API key for authentication.


                This key is required in the header of all API requests, to
                authenticate your account and access Anthropic's services. Get
                your API key through the
                [Console](https://console.anthropic.com/settings/keys). Each key
                is scoped to a Workspace.
      cookie: {}
    body:
      application/json:
        schemaArray:
          - type: object
            properties:
              mcp_servers:
                allOf:
                  - description: MCP servers to be utilized in this request
                    items:
                      $ref: '#/components/schemas/RequestMCPServerURLDefinition'
                    maxItems: 20
                    title: Mcp Servers
                    type: array
              messages:
                allOf:
                  - description: >-
                      Input messages.


                      Our models are trained to operate on alternating `user`
                      and `assistant` conversational turns. When creating a new
                      `Message`, you specify the prior conversational turns with
                      the `messages` parameter, and the model then generates the
                      next `Message` in the conversation. Consecutive `user` or
                      `assistant` turns in your request will be combined into a
                      single turn.


                      Each input message must be an object with a `role` and
                      `content`. You can specify a single `user`-role message,
                      or you can include multiple `user` and `assistant`
                      messages.


                      If the final message uses the `assistant` role, the
                      response content will continue immediately from the
                      content in that message. This can be used to constrain
                      part of the model's response.


                      Example with a single `user` message:


                      ```json

                      [{"role": "user", "content": "Hello, Claude"}]

                      ```


                      Example with multiple conversational turns:


                      ```json

                      [
                        {"role": "user", "content": "Hello there."},
                        {"role": "assistant", "content": "Hi, I'm Claude. How can I help you?"},
                        {"role": "user", "content": "Can you explain LLMs in plain English?"},
                      ]

                      ```


                      Example with a partially-filled response from Claude:


                      ```json

                      [
                        {"role": "user", "content": "What's the Greek name for Sun? (A) Sol (B) Helios (C) Sun"},
                        {"role": "assistant", "content": "The best answer is ("},
                      ]

                      ```


                      Each input message `content` may be either a single
                      `string` or an array of content blocks, where each block
                      has a specific `type`. Using a `string` for `content` is
                      shorthand for an array of one content block of type
                      `"text"`. The following input messages are equivalent:


                      ```json

                      {"role": "user", "content": "Hello, Claude"}

                      ```


                      ```json

                      {"role": "user", "content": [{"type": "text", "text":
                      "Hello, Claude"}]}

                      ```


                      Starting with Claude 3 models, you can also send image
                      content blocks:


                      ```json

                      {"role": "user", "content": [
                        {
                          "type": "image",
                          "source": {
                            "type": "base64",
                            "media_type": "image/jpeg",
                            "data": "/9j/4AAQSkZJRg...",
                          }
                        },
                        {"type": "text", "text": "What is in this image?"}
                      ]}

                      ```


                      We currently support the `base64` source type for images,
                      and the `image/jpeg`, `image/png`, `image/gif`, and
                      `image/webp` media types.


                      See
                      [examples](https://docs.anthropic.com/en/api/messages-examples#vision)
                      for more input examples.


                      Note that if you want to include a [system
                      prompt](https://docs.anthropic.com/en/docs/system-prompts),
                      you can use the top-level `system` parameter — there is no
                      `"system"` role for input messages in the Messages API.


                      There is a limit of 100,000 messages in a single request.
                    items:
                      $ref: '#/components/schemas/InputMessage'
                    title: Messages
                    type: array
              model:
                allOf:
                  - description: >-
                      The model that will complete your prompt.


                      See
                      [models](https://docs.anthropic.com/en/docs/models-overview)
                      for additional details and options.
                    examples:
                      - claude-sonnet-4-20250514
                    maxLength: 256
                    minLength: 1
                    title: Model
                    type: string
              system:
                allOf:
                  - anyOf:
                      - type: string
                      - items:
                          $ref: '#/components/schemas/RequestTextBlock'
                        type: array
                    description: >-
                      System prompt.


                      A system prompt is a way of providing context and
                      instructions to Claude, such as specifying a particular
                      goal or role. See our [guide to system
                      prompts](https://docs.anthropic.com/en/docs/system-prompts).
                    examples:
                      - - text: Today's date is 2024-06-01.
                          type: text
                      - Today's date is 2023-01-01.
                    title: System
              thinking:
                allOf:
                  - description: >-
                      Configuration for enabling Claude's extended thinking. 


                      When enabled, responses include `thinking` content blocks
                      showing Claude's thinking process before the final answer.
                      Requires a minimum budget of 1,024 tokens and counts
                      towards your `max_tokens` limit.


                      See [extended
                      thinking](https://docs.anthropic.com/en/docs/build-with-claude/extended-thinking)
                      for details.
                    discriminator:
                      mapping:
                        disabled: '#/components/schemas/ThinkingConfigDisabled'
                        enabled: '#/components/schemas/ThinkingConfigEnabled'
                      propertyName: type
                    oneOf:
                      - $ref: '#/components/schemas/ThinkingConfigEnabled'
                      - $ref: '#/components/schemas/ThinkingConfigDisabled'
              tool_choice:
                allOf:
                  - description: >-
                      How the model should use the provided tools. The model can
                      use a specific tool, any available tool, decide by itself,
                      or not use tools at all.
                    discriminator:
                      mapping:
                        any: '#/components/schemas/ToolChoiceAny'
                        auto: '#/components/schemas/ToolChoiceAuto'
                        none: '#/components/schemas/ToolChoiceNone'
                        tool: '#/components/schemas/ToolChoiceTool'
                      propertyName: type
                    oneOf:
                      - $ref: '#/components/schemas/ToolChoiceAuto'
                      - $ref: '#/components/schemas/ToolChoiceAny'
                      - $ref: '#/components/schemas/ToolChoiceTool'
                      - $ref: '#/components/schemas/ToolChoiceNone'
              tools:
                allOf:
                  - description: >-
                      Definitions of tools that the model may use.


                      If you include `tools` in your API request, the model may
                      return `tool_use` content blocks that represent the
                      model's use of those tools. You can then run those tools
                      using the tool input generated by the model and then
                      optionally return results back to the model using
                      `tool_result` content blocks.


                      There are two types of tools: **client tools** and
                      **server tools**. The behavior described below applies to
                      client tools. For [server
                      tools](https://docs.anthropic.com/en/docs/agents-and-tools/tool-use/overview\#server-tools),
                      see their individual documentation as each has its own
                      behavior (e.g., the [web search
                      tool](https://docs.anthropic.com/en/docs/agents-and-tools/tool-use/web-search-tool)).


                      Each tool definition includes:


                      * `name`: Name of the tool.

                      * `description`: Optional, but strongly-recommended
                      description of the tool.

                      * `input_schema`: [JSON
                      schema](https://json-schema.org/draft/2020-12) for the
                      tool `input` shape that the model will produce in
                      `tool_use` output content blocks.


                      For example, if you defined `tools` as:


                      ```json

                      [
                        {
                          "name": "get_stock_price",
                          "description": "Get the current stock price for a given ticker symbol.",
                          "input_schema": {
                            "type": "object",
                            "properties": {
                              "ticker": {
                                "type": "string",
                                "description": "The stock ticker symbol, e.g. AAPL for Apple Inc."
                              }
                            },
                            "required": ["ticker"]
                          }
                        }
                      ]

                      ```


                      And then asked the model "What's the S&P 500 at today?",
                      the model might produce `tool_use` content blocks in the
                      response like this:


                      ```json

                      [
                        {
                          "type": "tool_use",
                          "id": "toolu_01D7FLrfh4GYq7yT1ULFeyMV",
                          "name": "get_stock_price",
                          "input": { "ticker": "^GSPC" }
                        }
                      ]

                      ```


                      You might then run your `get_stock_price` tool with
                      `{"ticker": "^GSPC"}` as an input, and return the
                      following back to the model in a subsequent `user`
                      message:


                      ```json

                      [
                        {
                          "type": "tool_result",
                          "tool_use_id": "toolu_01D7FLrfh4GYq7yT1ULFeyMV",
                          "content": "259.75 USD"
                        }
                      ]

                      ```


                      Tools can be used for workflows that include running
                      client-side tools and functions, or more generally
                      whenever you want the model to produce a particular JSON
                      structure of output.


                      See our
                      [guide](https://docs.anthropic.com/en/docs/tool-use) for
                      more details.
                    examples:
                      - description: Get the current weather in a given location
                        input_schema:
                          properties:
                            location:
                              description: The city and state, e.g. San Francisco, CA
                              type: string
                            unit:
                              description: >-
                                Unit for the output - one of (celsius,
                                fahrenheit)
                              type: string
                          required:
                            - location
                          type: object
                        name: get_weather
                    items:
                      oneOf:
                        - $ref: '#/components/schemas/Tool'
                        - $ref: '#/components/schemas/BashTool_20241022'
                        - $ref: '#/components/schemas/BashTool_20250124'
                        - $ref: '#/components/schemas/CodeExecutionTool_20250522'
                        - $ref: '#/components/schemas/ComputerUseTool_20241022'
                        - $ref: '#/components/schemas/ComputerUseTool_20250124'
                        - $ref: '#/components/schemas/TextEditor_20241022'
                        - $ref: '#/components/schemas/TextEditor_20250124'
                        - $ref: '#/components/schemas/TextEditor_20250429'
                        - $ref: '#/components/schemas/WebSearchTool_20250305'
                    title: Tools
                    type: array
            required: true
            title: CountMessageTokensParams
            examples:
              - messages: &ref_0
                  - content: Hello, world
                    role: user
                model: claude-sonnet-4-20250514
            requiredProperties:
              - messages
              - model
            additionalProperties: false
            example:
              messages: *ref_0
              model: claude-sonnet-4-20250514
        examples:
          example:
            value:
              messages:
                - content: Hello, world
                  role: user
              model: claude-sonnet-4-20250514
    codeSamples:
      - lang: bash
        source: |-
          curl https://api.anthropic.com/v1/messages/count_tokens \
               --header "x-api-key: $ANTHROPIC_API_KEY" \
               --header "anthropic-version: 2023-06-01" \
               --header "content-type: application/json" \
               --data \
          '{
              "model": "claude-3-7-sonnet-20250219",
              "messages": [
                  {"role": "user", "content": "Hello, world"}
              ]
          }'
      - lang: python
        source: |-
          import anthropic

          anthropic.Anthropic().messages.count_tokens(
              model="claude-3-7-sonnet-20250219",
              messages=[
                  {"role": "user", "content": "Hello, world"}
              ]
          )
      - lang: javascript
        source: |-
          import { Anthropic } from '@anthropic-ai/sdk';

          const anthropic = new Anthropic();

          await anthropic.messages.countTokens({
            model: "claude-3-7-sonnet-20250219",
            messages: [
              {"role": "user", "content": "Hello, world"}
            ]
          });
  response:
    '200':
      application/json:
        schemaArray:
          - type: object
            properties:
              input_tokens:
                allOf:
                  - type: integer
                    title: Input Tokens
                    description: >-
                      The total number of tokens across the provided list of
                      messages, system prompt, and tools.
                    examples:
                      - 2095
            title: CountMessageTokensResponse
            examples:
              - input_tokens: 2095
            requiredProperties:
              - input_tokens
            example:
              input_tokens: 2095
        examples:
          example:
            value:
              input_tokens: 2095
        description: Successful Response
    4XX:
      application/json:
        schemaArray:
          - type: object
            properties:
              error:
                allOf:
                  - discriminator:
                      mapping:
                        api_error: '#/components/schemas/APIError'
                        authentication_error: '#/components/schemas/AuthenticationError'
                        billing_error: '#/components/schemas/BillingError'
                        invalid_request_error: '#/components/schemas/InvalidRequestError'
                        not_found_error: '#/components/schemas/NotFoundError'
                        overloaded_error: '#/components/schemas/OverloadedError'
                        permission_error: '#/components/schemas/PermissionError'
                        rate_limit_error: '#/components/schemas/RateLimitError'
                        timeout_error: '#/components/schemas/GatewayTimeoutError'
                      propertyName: type
                    oneOf:
                      - $ref: '#/components/schemas/InvalidRequestError'
                      - $ref: '#/components/schemas/AuthenticationError'
                      - $ref: '#/components/schemas/BillingError'
                      - $ref: '#/components/schemas/PermissionError'
                      - $ref: '#/components/schemas/NotFoundError'
                      - $ref: '#/components/schemas/RateLimitError'
                      - $ref: '#/components/schemas/GatewayTimeoutError'
                      - $ref: '#/components/schemas/APIError'
                      - $ref: '#/components/schemas/OverloadedError'
                    title: Error
              type:
                allOf:
                  - const: error
                    default: error
                    enum:
                      - error
                    title: Type
                    type: string
            title: ErrorResponse
            requiredProperties:
              - error
              - type
        examples:
          example:
            value:
              error:
                message: Invalid request
                type: invalid_request_error
              type: error
        description: >-
          Error response.


          See our [errors
          documentation](https://docs.anthropic.com/en/api/errors) for more
          details.
  deprecated: false
  type: path
components:
  schemas:
    APIError:
      properties:
        message:
          default: Internal server error
          title: Message
          type: string
        type:
          const: api_error
          default: api_error
          enum:
            - api_error
          title: Type
          type: string
      required:
        - message
        - type
      title: APIError
      type: object
    AuthenticationError:
      properties:
        message:
          default: Authentication error
          title: Message
          type: string
        type:
          const: authentication_error
          default: authentication_error
          enum:
            - authentication_error
          title: Type
          type: string
      required:
        - message
        - type
      title: AuthenticationError
      type: object
    Base64ImageSource:
      additionalProperties: false
      properties:
        data:
          format: byte
          title: Data
          type: string
        media_type:
          enum:
            - image/jpeg
            - image/png
            - image/gif
            - image/webp
          title: Media Type
          type: string
        type:
          const: base64
          enum:
            - base64
          title: Type
          type: string
      required:
        - data
        - media_type
        - type
      title: Base64ImageSource
      type: object
    Base64PDFSource:
      additionalProperties: false
      properties:
        data:
          format: byte
          title: Data
          type: string
        media_type:
          const: application/pdf
          enum:
            - application/pdf
          title: Media Type
          type: string
        type:
          const: base64
          enum:
            - base64
          title: Type
          type: string
      required:
        - data
        - media_type
        - type
      title: PDF (base64)
      type: object
    BashTool_20241022:
      additionalProperties: false
      properties:
        cache_control:
          anyOf:
            - discriminator:
                mapping:
                  ephemeral: '#/components/schemas/CacheControlEphemeral'
                propertyName: type
              oneOf:
                - $ref: '#/components/schemas/CacheControlEphemeral'
            - type: 'null'
          description: Create a cache control breakpoint at this content block.
          title: Cache Control
        name:
          const: bash
          description: >-
            Name of the tool.


            This is how the tool will be called by the model and in `tool_use`
            blocks.
          enum:
            - bash
          title: Name
          type: string
        type:
          const: bash_20241022
          enum:
            - bash_20241022
          title: Type
          type: string
      required:
        - name
        - type
      title: Bash tool (2024-10-22)
      type: object
    BashTool_20250124:
      additionalProperties: false
      properties:
        cache_control:
          anyOf:
            - discriminator:
                mapping:
                  ephemeral: '#/components/schemas/CacheControlEphemeral'
                propertyName: type
              oneOf:
                - $ref: '#/components/schemas/CacheControlEphemeral'
            - type: 'null'
          description: Create a cache control breakpoint at this content block.
          title: Cache Control
        name:
          const: bash
          description: >-
            Name of the tool.


            This is how the tool will be called by the model and in `tool_use`
            blocks.
          enum:
            - bash
          title: Name
          type: string
        type:
          const: bash_20250124
          enum:
            - bash_20250124
          title: Type
          type: string
      required:
        - name
        - type
      title: Bash tool (2025-01-24)
      type: object
    BillingError:
      properties:
        message:
          default: Billing error
          title: Message
          type: string
        type:
          const: billing_error
          default: billing_error
          enum:
            - billing_error
          title: Type
          type: string
      required:
        - message
        - type
      title: BillingError
      type: object
    CacheControlEphemeral:
      additionalProperties: false
      properties:
        ttl:
          description: |-
            The time-to-live for the cache control breakpoint.

            This may be one the following values:
            - `5m`: 5 minutes
            - `1h`: 1 hour

            Defaults to `5m`.
          enum:
            - 5m
            - 1h
          title: Ttl
          type: string
        type:
          const: ephemeral
          enum:
            - ephemeral
          title: Type
          type: string
      required:
        - type
      title: CacheControlEphemeral
      type: object
    CodeExecutionToolResultErrorCode:
      enum:
        - invalid_tool_input
        - unavailable
        - too_many_requests
        - execution_time_exceeded
      title: CodeExecutionToolResultErrorCode
      type: string
    CodeExecutionTool_20250522:
      additionalProperties: false
      properties:
        cache_control:
          anyOf:
            - discriminator:
                mapping:
                  ephemeral: '#/components/schemas/CacheControlEphemeral'
                propertyName: type
              oneOf:
                - $ref: '#/components/schemas/CacheControlEphemeral'
            - type: 'null'
          description: Create a cache control breakpoint at this content block.
          title: Cache Control
        name:
          const: code_execution
          description: >-
            Name of the tool.


            This is how the tool will be called by the model and in `tool_use`
            blocks.
          enum:
            - code_execution
          title: Name
          type: string
        type:
          const: code_execution_20250522
          enum:
            - code_execution_20250522
          title: Type
          type: string
      required:
        - name
        - type
      title: Code execution tool (2025-05-22)
      type: object
    ComputerUseTool_20241022:
      additionalProperties: false
      properties:
        cache_control:
          anyOf:
            - discriminator:
                mapping:
                  ephemeral: '#/components/schemas/CacheControlEphemeral'
                propertyName: type
              oneOf:
                - $ref: '#/components/schemas/CacheControlEphemeral'
            - type: 'null'
          description: Create a cache control breakpoint at this content block.
          title: Cache Control
        display_height_px:
          description: The height of the display in pixels.
          minimum: 1
          title: Display Height Px
          type: integer
        display_number:
          anyOf:
            - minimum: 0
              type: integer
            - type: 'null'
          description: The X11 display number (e.g. 0, 1) for the display.
          title: Display Number
        display_width_px:
          description: The width of the display in pixels.
          minimum: 1
          title: Display Width Px
          type: integer
        name:
          const: computer
          description: >-
            Name of the tool.


            This is how the tool will be called by the model and in `tool_use`
            blocks.
          enum:
            - computer
          title: Name
          type: string
        type:
          const: computer_20241022
          enum:
            - computer_20241022
          title: Type
          type: string
      required:
        - display_height_px
        - display_width_px
        - name
        - type
      title: Computer use tool (2024-01-22)
      type: object
    ComputerUseTool_20250124:
      additionalProperties: false
      properties:
        cache_control:
          anyOf:
            - discriminator:
                mapping:
                  ephemeral: '#/components/schemas/CacheControlEphemeral'
                propertyName: type
              oneOf:
                - $ref: '#/components/schemas/CacheControlEphemeral'
            - type: 'null'
          description: Create a cache control breakpoint at this content block.
          title: Cache Control
        display_height_px:
          description: The height of the display in pixels.
          minimum: 1
          title: Display Height Px
          type: integer
        display_number:
          anyOf:
            - minimum: 0
              type: integer
            - type: 'null'
          description: The X11 display number (e.g. 0, 1) for the display.
          title: Display Number
        display_width_px:
          description: The width of the display in pixels.
          minimum: 1
          title: Display Width Px
          type: integer
        name:
          const: computer
          description: >-
            Name of the tool.


            This is how the tool will be called by the model and in `tool_use`
            blocks.
          enum:
            - computer
          title: Name
          type: string
        type:
          const: computer_20250124
          enum:
            - computer_20250124
          title: Type
          type: string
      required:
        - display_height_px
        - display_width_px
        - name
        - type
      title: Computer use tool (2025-01-24)
      type: object
    ContentBlockSource:
      additionalProperties: false
      properties:
        content:
          anyOf:
            - type: string
            - items:
                discriminator:
                  mapping:
                    image: '#/components/schemas/RequestImageBlock'
                    text: '#/components/schemas/RequestTextBlock'
                  propertyName: type
                oneOf:
                  - $ref: '#/components/schemas/RequestTextBlock'
                  - $ref: '#/components/schemas/RequestImageBlock'
              type: array
          title: Content
        type:
          const: content
          enum:
            - content
          title: Type
          type: string
      required:
        - content
        - type
      title: Content block
      type: object
    FileDocumentSource:
      additionalProperties: false
      properties:
        file_id:
          title: File Id
          type: string
        type:
          const: file
          enum:
            - file
          title: Type
          type: string
      required:
        - file_id
        - type
      title: File document
      type: object
    FileImageSource:
      additionalProperties: false
      properties:
        file_id:
          title: File Id
          type: string
        type:
          const: file
          enum:
            - file
          title: Type
          type: string
      required:
        - file_id
        - type
      title: FileImageSource
      type: object
    GatewayTimeoutError:
      properties:
        message:
          default: Request timeout
          title: Message
          type: string
        type:
          const: timeout_error
          default: timeout_error
          enum:
            - timeout_error
          title: Type
          type: string
      required:
        - message
        - type
      title: GatewayTimeoutError
      type: object
    InputMessage:
      additionalProperties: false
      properties:
        content:
          anyOf:
            - type: string
            - items:
                discriminator:
                  mapping:
                    code_execution_tool_result: '#/components/schemas/RequestCodeExecutionToolResultBlock'
                    container_upload: '#/components/schemas/RequestContainerUploadBlock'
                    document: '#/components/schemas/RequestDocumentBlock'
                    image: '#/components/schemas/RequestImageBlock'
                    mcp_tool_result: '#/components/schemas/RequestMCPToolResultBlock'
                    mcp_tool_use: '#/components/schemas/RequestMCPToolUseBlock'
                    redacted_thinking: '#/components/schemas/RequestRedactedThinkingBlock'
                    search_result: '#/components/schemas/RequestSearchResultBlock'
                    server_tool_use: '#/components/schemas/RequestServerToolUseBlock'
                    text: '#/components/schemas/RequestTextBlock'
                    thinking: '#/components/schemas/RequestThinkingBlock'
                    tool_result: '#/components/schemas/RequestToolResultBlock'
                    tool_use: '#/components/schemas/RequestToolUseBlock'
                    web_search_tool_result: '#/components/schemas/RequestWebSearchToolResultBlock'
                  propertyName: type
                oneOf:
                  - $ref: '#/components/schemas/RequestTextBlock'
                    description: Regular text content.
                  - $ref: '#/components/schemas/RequestImageBlock'
                    description: >-
                      Image content specified directly as base64 data or as a
                      reference via a URL.
                  - $ref: '#/components/schemas/RequestDocumentBlock'
                    description: >-
                      Document content, either specified directly as base64
                      data, as text, or as a reference via a URL.
                  - $ref: '#/components/schemas/RequestSearchResultBlock'
                    description: >-
                      A search result block containing source, title, and
                      content from search operations.
                  - $ref: '#/components/schemas/RequestThinkingBlock'
                    description: A block specifying internal thinking by the model.
                  - $ref: '#/components/schemas/RequestRedactedThinkingBlock'
                    description: >-
                      A block specifying internal, redacted thinking by the
                      model.
                  - $ref: '#/components/schemas/RequestToolUseBlock'
                    description: A block indicating a tool use by the model.
                  - $ref: '#/components/schemas/RequestToolResultBlock'
                    description: A block specifying the results of a tool use by the model.
                  - $ref: '#/components/schemas/RequestServerToolUseBlock'
                  - $ref: '#/components/schemas/RequestWebSearchToolResultBlock'
                  - $ref: '#/components/schemas/RequestCodeExecutionToolResultBlock'
                  - $ref: '#/components/schemas/RequestMCPToolUseBlock'
                  - $ref: '#/components/schemas/RequestMCPToolResultBlock'
                  - $ref: '#/components/schemas/RequestContainerUploadBlock'
              type: array
          title: Content
        role:
          enum:
            - user
            - assistant
          title: Role
          type: string
      required:
        - content
        - role
      title: InputMessage
      type: object
    InputSchema:
      additionalProperties: true
      properties:
        properties:
          anyOf:
            - type: object
            - type: 'null'
          title: Properties
        required:
          anyOf:
            - items:
                type: string
              type: array
            - type: 'null'
          title: Required
        type:
          const: object
          enum:
            - object
          title: Type
          type: string
      required:
        - type
      title: InputSchema
      type: object
    InvalidRequestError:
      properties:
        message:
          default: Invalid request
          title: Message
          type: string
        type:
          const: invalid_request_error
          default: invalid_request_error
          enum:
            - invalid_request_error
          title: Type
          type: string
      required:
        - message
        - type
      title: InvalidRequestError
      type: object
    NotFoundError:
      properties:
        message:
          default: Not found
          title: Message
          type: string
        type:
          const: not_found_error
          default: not_found_error
          enum:
            - not_found_error
          title: Type
          type: string
      required:
        - message
        - type
      title: NotFoundError
      type: object
    OverloadedError:
      properties:
        message:
          default: Overloaded
          title: Message
          type: string
        type:
          const: overloaded_error
          default: overloaded_error
          enum:
            - overloaded_error
          title: Type
          type: string
      required:
        - message
        - type
      title: OverloadedError
      type: object
    PermissionError:
      properties:
        message:
          default: Permission denied
          title: Message
          type: string
        type:
          const: permission_error
          default: permission_error
          enum:
            - permission_error
          title: Type
          type: string
      required:
        - message
        - type
      title: PermissionError
      type: object
    PlainTextSource:
      additionalProperties: false
      properties:
        data:
          title: Data
          type: string
        media_type:
          const: text/plain
          enum:
            - text/plain
          title: Media Type
          type: string
        type:
          const: text
          enum:
            - text
          title: Type
          type: string
      required:
        - data
        - media_type
        - type
      title: Plain text
      type: object
    RateLimitError:
      properties:
        message:
          default: Rate limited
          title: Message
          type: string
        type:
          const: rate_limit_error
          default: rate_limit_error
          enum:
            - rate_limit_error
          title: Type
          type: string
      required:
        - message
        - type
      title: RateLimitError
      type: object
    RequestCharLocationCitation:
      additionalProperties: false
      properties:
        cited_text:
          title: Cited Text
          type: string
        document_index:
          minimum: 0
          title: Document Index
          type: integer
        document_title:
          anyOf:
            - maxLength: 255
              minLength: 1
              type: string
            - type: 'null'
          title: Document Title
        end_char_index:
          title: End Char Index
          type: integer
        start_char_index:
          minimum: 0
          title: Start Char Index
          type: integer
        type:
          const: char_location
          enum:
            - char_location
          title: Type
          type: string
      required:
        - cited_text
        - document_index
        - document_title
        - end_char_index
        - start_char_index
        - type
      title: Character location
      type: object
    RequestCitationsConfig:
      additionalProperties: false
      properties:
        enabled:
          title: Enabled
          type: boolean
      title: RequestCitationsConfig
      type: object
    RequestCodeExecutionOutputBlock:
      additionalProperties: false
      properties:
        file_id:
          title: File Id
          type: string
        type:
          const: code_execution_output
          enum:
            - code_execution_output
          title: Type
          type: string
      required:
        - file_id
        - type
      title: RequestCodeExecutionOutputBlock
      type: object
    RequestCodeExecutionResultBlock:
      additionalProperties: false
      properties:
        content:
          items:
            $ref: '#/components/schemas/RequestCodeExecutionOutputBlock'
          title: Content
          type: array
        return_code:
          title: Return Code
          type: integer
        stderr:
          title: Stderr
          type: string
        stdout:
          title: Stdout
          type: string
        type:
          const: code_execution_result
          enum:
            - code_execution_result
          title: Type
          type: string
      required:
        - content
        - return_code
        - stderr
        - stdout
        - type
      title: Code execution result
      type: object
    RequestCodeExecutionToolResultBlock:
      additionalProperties: false
      properties:
        cache_control:
          anyOf:
            - discriminator:
                mapping:
                  ephemeral: '#/components/schemas/CacheControlEphemeral'
                propertyName: type
              oneOf:
                - $ref: '#/components/schemas/CacheControlEphemeral'
            - type: 'null'
          description: Create a cache control breakpoint at this content block.
          title: Cache Control
        content:
          anyOf:
            - $ref: '#/components/schemas/RequestCodeExecutionToolResultError'
            - $ref: '#/components/schemas/RequestCodeExecutionResultBlock'
          title: Content
        tool_use_id:
          pattern: ^srvtoolu_[a-zA-Z0-9_]+$
          title: Tool Use Id
          type: string
        type:
          const: code_execution_tool_result
          enum:
            - code_execution_tool_result
          title: Type
          type: string
      required:
        - content
        - tool_use_id
        - type
      title: Code execution tool result
      type: object
    RequestCodeExecutionToolResultError:
      additionalProperties: false
      properties:
        error_code:
          $ref: '#/components/schemas/CodeExecutionToolResultErrorCode'
        type:
          const: code_execution_tool_result_error
          enum:
            - code_execution_tool_result_error
          title: Type
          type: string
      required:
        - error_code
        - type
      title: Code execution tool error
      type: object
    RequestContainerUploadBlock:
      additionalProperties: false
      description: >-
        A content block that represents a file to be uploaded to the container

        Files uploaded via this block will be available in the container's input
        directory.
      properties:
        cache_control:
          anyOf:
            - discriminator:
                mapping:
                  ephemeral: '#/components/schemas/CacheControlEphemeral'
                propertyName: type
              oneOf:
                - $ref: '#/components/schemas/CacheControlEphemeral'
            - type: 'null'
          description: Create a cache control breakpoint at this content block.
          title: Cache Control
        file_id:
          title: File Id
          type: string
        type:
          const: container_upload
          enum:
            - container_upload
          title: Type
          type: string
      required:
        - file_id
        - type
      title: Container upload
      type: object
    RequestContentBlockLocationCitation:
      additionalProperties: false
      properties:
        cited_text:
          title: Cited Text
          type: string
        document_index:
          minimum: 0
          title: Document Index
          type: integer
        document_title:
          anyOf:
            - maxLength: 255
              minLength: 1
              type: string
            - type: 'null'
          title: Document Title
        end_block_index:
          title: End Block Index
          type: integer
        start_block_index:
          minimum: 0
          title: Start Block Index
          type: integer
        type:
          const: content_block_location
          enum:
            - content_block_location
          title: Type
          type: string
      required:
        - cited_text
        - document_index
        - document_title
        - end_block_index
        - start_block_index
        - type
      title: Content block location
      type: object
    RequestDocumentBlock:
      additionalProperties: false
      properties:
        cache_control:
          anyOf:
            - discriminator:
                mapping:
                  ephemeral: '#/components/schemas/CacheControlEphemeral'
                propertyName: type
              oneOf:
                - $ref: '#/components/schemas/CacheControlEphemeral'
            - type: 'null'
          description: Create a cache control breakpoint at this content block.
          title: Cache Control
        citations:
          $ref: '#/components/schemas/RequestCitationsConfig'
        context:
          anyOf:
            - minLength: 1
              type: string
            - type: 'null'
          title: Context
        source:
          discriminator:
            mapping:
              base64: '#/components/schemas/Base64PDFSource'
              content: '#/components/schemas/ContentBlockSource'
              file: '#/components/schemas/FileDocumentSource'
              text: '#/components/schemas/PlainTextSource'
              url: '#/components/schemas/URLPDFSource'
            propertyName: type
          oneOf:
            - $ref: '#/components/schemas/Base64PDFSource'
            - $ref: '#/components/schemas/PlainTextSource'
            - $ref: '#/components/schemas/ContentBlockSource'
            - $ref: '#/components/schemas/URLPDFSource'
            - $ref: '#/components/schemas/FileDocumentSource'
        title:
          anyOf:
            - maxLength: 500
              minLength: 1
              type: string
            - type: 'null'
          title: Title
        type:
          const: document
          enum:
            - document
          title: Type
          type: string
      required:
        - source
        - type
      title: Document
      type: object
    RequestImageBlock:
      additionalProperties: false
      properties:
        cache_control:
          anyOf:
            - discriminator:
                mapping:
                  ephemeral: '#/components/schemas/CacheControlEphemeral'
                propertyName: type
              oneOf:
                - $ref: '#/components/schemas/CacheControlEphemeral'
            - type: 'null'
          description: Create a cache control breakpoint at this content block.
          title: Cache Control
        source:
          discriminator:
            mapping:
              base64: '#/components/schemas/Base64ImageSource'
              file: '#/components/schemas/FileImageSource'
              url: '#/components/schemas/URLImageSource'
            propertyName: type
          oneOf:
            - $ref: '#/components/schemas/Base64ImageSource'
            - $ref: '#/components/schemas/URLImageSource'
            - $ref: '#/components/schemas/FileImageSource'
          title: Source
        type:
          const: image
          enum:
            - image
          title: Type
          type: string
      required:
        - source
        - type
      title: Image
      type: object
    RequestMCPServerToolConfiguration:
      additionalProperties: false
      properties:
        allowed_tools:
          anyOf:
            - items:
                type: string
              type: array
            - type: 'null'
          title: Allowed Tools
        enabled:
          anyOf:
            - type: boolean
            - type: 'null'
          title: Enabled
      title: RequestMCPServerToolConfiguration
      type: object
    RequestMCPServerURLDefinition:
      additionalProperties: false
      properties:
        authorization_token:
          anyOf:
            - type: string
            - type: 'null'
          title: Authorization Token
        name:
          title: Name
          type: string
        tool_configuration:
          anyOf:
            - $ref: '#/components/schemas/RequestMCPServerToolConfiguration'
            - type: 'null'
        type:
          const: url
          enum:
            - url
          title: Type
          type: string
        url:
          title: Url
          type: string
      required:
        - name
        - type
        - url
      title: RequestMCPServerURLDefinition
      type: object
    RequestMCPToolResultBlock:
      additionalProperties: false
      properties:
        cache_control:
          anyOf:
            - discriminator:
                mapping:
                  ephemeral: '#/components/schemas/CacheControlEphemeral'
                propertyName: type
              oneOf:
                - $ref: '#/components/schemas/CacheControlEphemeral'
            - type: 'null'
          description: Create a cache control breakpoint at this content block.
          title: Cache Control
        content:
          anyOf:
            - type: string
            - items:
                $ref: '#/components/schemas/RequestTextBlock'
              type: array
          title: Content
        is_error:
          title: Is Error
          type: boolean
        tool_use_id:
          pattern: ^[a-zA-Z0-9_-]+$
          title: Tool Use Id
          type: string
        type:
          const: mcp_tool_result
          enum:
            - mcp_tool_result
          title: Type
          type: string
      required:
        - tool_use_id
        - type
      title: MCP tool result
      type: object
    RequestMCPToolUseBlock:
      additionalProperties: false
      properties:
        cache_control:
          anyOf:
            - discriminator:
                mapping:
                  ephemeral: '#/components/schemas/CacheControlEphemeral'
                propertyName: type
              oneOf:
                - $ref: '#/components/schemas/CacheControlEphemeral'
            - type: 'null'
          description: Create a cache control breakpoint at this content block.
          title: Cache Control
        id:
          pattern: ^[a-zA-Z0-9_-]+$
          title: Id
          type: string
        input:
          title: Input
          type: object
        name:
          title: Name
          type: string
        server_name:
          description: The name of the MCP server
          title: Server Name
          type: string
        type:
          const: mcp_tool_use
          enum:
            - mcp_tool_use
          title: Type
          type: string
      required:
        - id
        - input
        - name
        - server_name
        - type
      title: MCP tool use
      type: object
    RequestPageLocationCitation:
      additionalProperties: false
      properties:
        cited_text:
          title: Cited Text
          type: string
        document_index:
          minimum: 0
          title: Document Index
          type: integer
        document_title:
          anyOf:
            - maxLength: 255
              minLength: 1
              type: string
            - type: 'null'
          title: Document Title
        end_page_number:
          title: End Page Number
          type: integer
        start_page_number:
          minimum: 1
          title: Start Page Number
          type: integer
        type:
          const: page_location
          enum:
            - page_location
          title: Type
          type: string
      required:
        - cited_text
        - document_index
        - document_title
        - end_page_number
        - start_page_number
        - type
      title: Page location
      type: object
    RequestRedactedThinkingBlock:
      additionalProperties: false
      properties:
        data:
          title: Data
          type: string
        type:
          const: redacted_thinking
          enum:
            - redacted_thinking
          title: Type
          type: string
      required:
        - data
        - type
      title: Redacted thinking
      type: object
    RequestSearchResultBlock:
      additionalProperties: false
      properties:
        cache_control:
          anyOf:
            - discriminator:
                mapping:
                  ephemeral: '#/components/schemas/CacheControlEphemeral'
                propertyName: type
              oneOf:
                - $ref: '#/components/schemas/CacheControlEphemeral'
            - type: 'null'
          description: Create a cache control breakpoint at this content block.
          title: Cache Control
        citations:
          $ref: '#/components/schemas/RequestCitationsConfig'
        content:
          items:
            $ref: '#/components/schemas/RequestTextBlock'
          title: Content
          type: array
        source:
          title: Source
          type: string
        title:
          title: Title
          type: string
        type:
          const: search_result
          enum:
            - search_result
          title: Type
          type: string
      required:
        - content
        - source
        - title
        - type
      title: RequestSearchResultBlock
      type: object
    RequestSearchResultLocationCitation:
      properties:
        cited_text:
          title: Cited Text
          type: string
        end_block_index:
          title: End Block Index
          type: integer
        search_result_index:
          minimum: 0
          title: Search Result Index
          type: integer
        source:
          title: Source
          type: string
        start_block_index:
          minimum: 0
          title: Start Block Index
          type: integer
        title:
          anyOf:
            - type: string
            - type: 'null'
          title: Title
        type:
          const: search_result_location
          default: search_result_location
          enum:
            - search_result_location
          title: Type
          type: string
      required:
        - cited_text
        - end_block_index
        - search_result_index
        - source
        - start_block_index
        - title
        - type
      title: RequestSearchResultLocationCitation
      type: object
    RequestServerToolUseBlock:
      additionalProperties: false
      properties:
        cache_control:
          anyOf:
            - discriminator:
                mapping:
                  ephemeral: '#/components/schemas/CacheControlEphemeral'
                propertyName: type
              oneOf:
                - $ref: '#/components/schemas/CacheControlEphemeral'
            - type: 'null'
          description: Create a cache control breakpoint at this content block.
          title: Cache Control
        id:
          pattern: ^srvtoolu_[a-zA-Z0-9_]+$
          title: Id
          type: string
        input:
          title: Input
          type: object
        name:
          enum:
            - web_search
            - code_execution
          title: Name
          type: string
        type:
          const: server_tool_use
          enum:
            - server_tool_use
          title: Type
          type: string
      required:
        - id
        - input
        - name
        - type
      title: Server tool use
      type: object
    RequestTextBlock:
      additionalProperties: false
      properties:
        cache_control:
          anyOf:
            - discriminator:
                mapping:
                  ephemeral: '#/components/schemas/CacheControlEphemeral'
                propertyName: type
              oneOf:
                - $ref: '#/components/schemas/CacheControlEphemeral'
            - type: 'null'
          description: Create a cache control breakpoint at this content block.
          title: Cache Control
        citations:
          anyOf:
            - items:
                discriminator:
                  mapping:
                    char_location: '#/components/schemas/RequestCharLocationCitation'
                    content_block_location: '#/components/schemas/RequestContentBlockLocationCitation'
                    page_location: '#/components/schemas/RequestPageLocationCitation'
                    search_result_location: '#/components/schemas/RequestSearchResultLocationCitation'
                    web_search_result_location: >-
                      #/components/schemas/RequestWebSearchResultLocationCitation
                  propertyName: type
                oneOf:
                  - $ref: '#/components/schemas/RequestCharLocationCitation'
                  - $ref: '#/components/schemas/RequestPageLocationCitation'
                  - $ref: '#/components/schemas/RequestContentBlockLocationCitation'
                  - $ref: >-
                      #/components/schemas/RequestWebSearchResultLocationCitation
                  - $ref: '#/components/schemas/RequestSearchResultLocationCitation'
              type: array
            - type: 'null'
          title: Citations
        text:
          minLength: 1
          title: Text
          type: string
        type:
          const: text
          enum:
            - text
          title: Type
          type: string
      required:
        - text
        - type
      title: Text
      type: object
    RequestThinkingBlock:
      additionalProperties: false
      properties:
        signature:
          title: Signature
          type: string
        thinking:
          title: Thinking
          type: string
        type:
          const: thinking
          enum:
            - thinking
          title: Type
          type: string
      required:
        - signature
        - thinking
        - type
      title: Thinking
      type: object
    RequestToolResultBlock:
      additionalProperties: false
      properties:
        cache_control:
          anyOf:
            - discriminator:
                mapping:
                  ephemeral: '#/components/schemas/CacheControlEphemeral'
                propertyName: type
              oneOf:
                - $ref: '#/components/schemas/CacheControlEphemeral'
            - type: 'null'
          description: Create a cache control breakpoint at this content block.
          title: Cache Control
        content:
          anyOf:
            - type: string
            - items:
                discriminator:
                  mapping:
                    image: '#/components/schemas/RequestImageBlock'
                    search_result: '#/components/schemas/RequestSearchResultBlock'
                    text: '#/components/schemas/RequestTextBlock'
                  propertyName: type
                oneOf:
                  - $ref: '#/components/schemas/RequestTextBlock'
                  - $ref: '#/components/schemas/RequestImageBlock'
                  - $ref: '#/components/schemas/RequestSearchResultBlock'
              type: array
          title: Content
        is_error:
          title: Is Error
          type: boolean
        tool_use_id:
          pattern: ^[a-zA-Z0-9_-]+$
          title: Tool Use Id
          type: string
        type:
          const: tool_result
          enum:
            - tool_result
          title: Type
          type: string
      required:
        - tool_use_id
        - type
      title: Tool result
      type: object
    RequestToolUseBlock:
      additionalProperties: false
      properties:
        cache_control:
          anyOf:
            - discriminator:
                mapping:
                  ephemeral: '#/components/schemas/CacheControlEphemeral'
                propertyName: type
              oneOf:
                - $ref: '#/components/schemas/CacheControlEphemeral'
            - type: 'null'
          description: Create a cache control breakpoint at this content block.
          title: Cache Control
        id:
          pattern: ^[a-zA-Z0-9_-]+$
          title: Id
          type: string
        input:
          title: Input
          type: object
        name:
          maxLength: 200
          minLength: 1
          title: Name
          type: string
        type:
          const: tool_use
          enum:
            - tool_use
          title: Type
          type: string
      required:
        - id
        - input
        - name
        - type
      title: Tool use
      type: object
    RequestWebSearchResultBlock:
      additionalProperties: false
      properties:
        encrypted_content:
          title: Encrypted Content
          type: string
        page_age:
          anyOf:
            - type: string
            - type: 'null'
          title: Page Age
        title:
          title: Title
          type: string
        type:
          const: web_search_result
          enum:
            - web_search_result
          title: Type
          type: string
        url:
          title: Url
          type: string
      required:
        - encrypted_content
        - title
        - type
        - url
      title: RequestWebSearchResultBlock
      type: object
    RequestWebSearchResultLocationCitation:
      additionalProperties: false
      properties:
        cited_text:
          title: Cited Text
          type: string
        encrypted_index:
          title: Encrypted Index
          type: string
        title:
          anyOf:
            - maxLength: 512
              minLength: 1
              type: string
            - type: 'null'
          title: Title
        type:
          const: web_search_result_location
          enum:
            - web_search_result_location
          title: Type
          type: string
        url:
          maxLength: 2048
          minLength: 1
          title: Url
          type: string
      required:
        - cited_text
        - encrypted_index
        - title
        - type
        - url
      title: RequestWebSearchResultLocationCitation
      type: object
    RequestWebSearchToolResultBlock:
      additionalProperties: false
      properties:
        cache_control:
          anyOf:
            - discriminator:
                mapping:
                  ephemeral: '#/components/schemas/CacheControlEphemeral'
                propertyName: type
              oneOf:
                - $ref: '#/components/schemas/CacheControlEphemeral'
            - type: 'null'
          description: Create a cache control breakpoint at this content block.
          title: Cache Control
        content:
          anyOf:
            - items:
                $ref: '#/components/schemas/RequestWebSearchResultBlock'
              type: array
            - $ref: '#/components/schemas/RequestWebSearchToolResultError'
          title: Content
        tool_use_id:
          pattern: ^srvtoolu_[a-zA-Z0-9_]+$
          title: Tool Use Id
          type: string
        type:
          const: web_search_tool_result
          enum:
            - web_search_tool_result
          title: Type
          type: string
      required:
        - content
        - tool_use_id
        - type
      title: Web search tool result
      type: object
    RequestWebSearchToolResultError:
      additionalProperties: false
      properties:
        error_code:
          $ref: '#/components/schemas/WebSearchToolResultErrorCode'
        type:
          const: web_search_tool_result_error
          enum:
            - web_search_tool_result_error
          title: Type
          type: string
      required:
        - error_code
        - type
      title: RequestWebSearchToolResultError
      type: object
    TextEditor_20241022:
      additionalProperties: false
      properties:
        cache_control:
          anyOf:
            - discriminator:
                mapping:
                  ephemeral: '#/components/schemas/CacheControlEphemeral'
                propertyName: type
              oneOf:
                - $ref: '#/components/schemas/CacheControlEphemeral'
            - type: 'null'
          description: Create a cache control breakpoint at this content block.
          title: Cache Control
        name:
          const: str_replace_editor
          description: >-
            Name of the tool.


            This is how the tool will be called by the model and in `tool_use`
            blocks.
          enum:
            - str_replace_editor
          title: Name
          type: string
        type:
          const: text_editor_20241022
          enum:
            - text_editor_20241022
          title: Type
          type: string
      required:
        - name
        - type
      title: Text editor tool (2024-10-22)
      type: object
    TextEditor_20250124:
      additionalProperties: false
      properties:
        cache_control:
          anyOf:
            - discriminator:
                mapping:
                  ephemeral: '#/components/schemas/CacheControlEphemeral'
                propertyName: type
              oneOf:
                - $ref: '#/components/schemas/CacheControlEphemeral'
            - type: 'null'
          description: Create a cache control breakpoint at this content block.
          title: Cache Control
        name:
          const: str_replace_editor
          description: >-
            Name of the tool.


            This is how the tool will be called by the model and in `tool_use`
            blocks.
          enum:
            - str_replace_editor
          title: Name
          type: string
        type:
          const: text_editor_20250124
          enum:
            - text_editor_20250124
          title: Type
          type: string
      required:
        - name
        - type
      title: Text editor tool (2025-01-24)
      type: object
    TextEditor_20250429:
      additionalProperties: false
      properties:
        cache_control:
          anyOf:
            - discriminator:
                mapping:
                  ephemeral: '#/components/schemas/CacheControlEphemeral'
                propertyName: type
              oneOf:
                - $ref: '#/components/schemas/CacheControlEphemeral'
            - type: 'null'
          description: Create a cache control breakpoint at this content block.
          title: Cache Control
        name:
          const: str_replace_based_edit_tool
          description: >-
            Name of the tool.


            This is how the tool will be called by the model and in `tool_use`
            blocks.
          enum:
            - str_replace_based_edit_tool
          title: Name
          type: string
        type:
          const: text_editor_20250429
          enum:
            - text_editor_20250429
          title: Type
          type: string
      required:
        - name
        - type
      title: Text editor tool (2025-04-29)
      type: object
    ThinkingConfigDisabled:
      additionalProperties: false
      properties:
        type:
          const: disabled
          enum:
            - disabled
          title: Type
          type: string
      required:
        - type
      title: Disabled
      type: object
    ThinkingConfigEnabled:
      additionalProperties: false
      properties:
        budget_tokens:
          description: >-
            Determines how many tokens Claude can use for its internal reasoning
            process. Larger budgets can enable more thorough analysis for
            complex problems, improving response quality. 


            Must be ≥1024 and less than `max_tokens`.


            See [extended
            thinking](https://docs.anthropic.com/en/docs/build-with-claude/extended-thinking)
            for details.
          minimum: 1024
          title: Budget Tokens
          type: integer
        type:
          const: enabled
          enum:
            - enabled
          title: Type
          type: string
      required:
        - budget_tokens
        - type
      title: Enabled
      type: object
    Tool:
      additionalProperties: false
      properties:
        type:
          anyOf:
            - type: 'null'
            - const: custom
              enum:
                - custom
              type: string
          title: Type
        description:
          description: >-
            Description of what this tool does.


            Tool descriptions should be as detailed as possible. The more
            information that the model has about what the tool is and how to use
            it, the better it will perform. You can use natural language
            descriptions to reinforce important aspects of the tool input JSON
            schema.
          examples:
            - Get the current weather in a given location
          title: Description
          type: string
        name:
          description: >-
            Name of the tool.


            This is how the tool will be called by the model and in `tool_use`
            blocks.
          maxLength: 128
          minLength: 1
          pattern: ^[a-zA-Z0-9_-]{1,128}$
          title: Name
          type: string
        input_schema:
          $ref: '#/components/schemas/InputSchema'
          description: >-
            [JSON schema](https://json-schema.org/draft/2020-12) for this tool's
            input.


            This defines the shape of the `input` that your tool accepts and
            that the model will produce.
          examples:
            - properties:
                location:
                  description: The city and state, e.g. San Francisco, CA
                  type: string
                unit:
                  description: Unit for the output - one of (celsius, fahrenheit)
                  type: string
              required:
                - location
              type: object
        cache_control:
          anyOf:
            - discriminator:
                mapping:
                  ephemeral: '#/components/schemas/CacheControlEphemeral'
                propertyName: type
              oneOf:
                - $ref: '#/components/schemas/CacheControlEphemeral'
            - type: 'null'
          description: Create a cache control breakpoint at this content block.
          title: Cache Control
      required:
        - name
        - input_schema
      title: Custom tool
      type: object
    ToolChoiceAny:
      additionalProperties: false
      description: The model will use any available tools.
      properties:
        disable_parallel_tool_use:
          description: >-
            Whether to disable parallel tool use.


            Defaults to `false`. If set to `true`, the model will output exactly
            one tool use.
          title: Disable Parallel Tool Use
          type: boolean
        type:
          const: any
          enum:
            - any
          title: Type
          type: string
      required:
        - type
      title: Any
      type: object
    ToolChoiceAuto:
      additionalProperties: false
      description: The model will automatically decide whether to use tools.
      properties:
        disable_parallel_tool_use:
          description: >-
            Whether to disable parallel tool use.


            Defaults to `false`. If set to `true`, the model will output at most
            one tool use.
          title: Disable Parallel Tool Use
          type: boolean
        type:
          const: auto
          enum:
            - auto
          title: Type
          type: string
      required:
        - type
      title: Auto
      type: object
    ToolChoiceNone:
      additionalProperties: false
      description: The model will not be allowed to use tools.
      properties:
        type:
          const: none
          enum:
            - none
          title: Type
          type: string
      required:
        - type
      title: None
      type: object
    ToolChoiceTool:
      additionalProperties: false
      description: The model will use the specified tool with `tool_choice.name`.
      properties:
        disable_parallel_tool_use:
          description: >-
            Whether to disable parallel tool use.


            Defaults to `false`. If set to `true`, the model will output exactly
            one tool use.
          title: Disable Parallel Tool Use
          type: boolean
        name:
          description: The name of the tool to use.
          title: Name
          type: string
        type:
          const: tool
          enum:
            - tool
          title: Type
          type: string
      required:
        - name
        - type
      title: Tool
      type: object
    URLImageSource:
      additionalProperties: false
      properties:
        type:
          const: url
          enum:
            - url
          title: Type
          type: string
        url:
          title: Url
          type: string
      required:
        - type
        - url
      title: URLImageSource
      type: object
    URLPDFSource:
      additionalProperties: false
      properties:
        type:
          const: url
          enum:
            - url
          title: Type
          type: string
        url:
          title: Url
          type: string
      required:
        - type
        - url
      title: PDF (URL)
      type: object
    UserLocation:
      additionalProperties: false
      properties:
        city:
          anyOf:
            - maxLength: 255
              minLength: 1
              type: string
            - type: 'null'
          description: The city of the user.
          examples:
            - New York
            - Tokyo
            - Los Angeles
          title: City
        country:
          anyOf:
            - maxLength: 2
              minLength: 2
              type: string
            - type: 'null'
          description: >-
            The two letter [ISO country
            code](https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2) of the user.
          examples:
            - US
            - JP
            - GB
          title: Country
        region:
          anyOf:
            - maxLength: 255
              minLength: 1
              type: string
            - type: 'null'
          description: The region of the user.
          examples:
            - California
            - Ontario
            - Wales
          title: Region
        timezone:
          anyOf:
            - maxLength: 255
              minLength: 1
              type: string
            - type: 'null'
          description: The [IANA timezone](https://nodatime.org/TimeZones) of the user.
          examples:
            - America/New_York
            - Asia/Tokyo
            - Europe/London
          title: Timezone
        type:
          const: approximate
          enum:
            - approximate
          title: Type
          type: string
      required:
        - type
      title: UserLocation
      type: object
    WebSearchToolResultErrorCode:
      enum:
        - invalid_tool_input
        - unavailable
        - max_uses_exceeded
        - too_many_requests
        - query_too_long
      title: WebSearchToolResultErrorCode
      type: string
    WebSearchTool_20250305:
      additionalProperties: false
      properties:
        allowed_domains:
          anyOf:
            - items:
                type: string
              type: array
            - type: 'null'
          description: >-
            If provided, only these domains will be included in results. Cannot
            be used alongside `blocked_domains`.
          title: Allowed Domains
        blocked_domains:
          anyOf:
            - items:
                type: string
              type: array
            - type: 'null'
          description: >-
            If provided, these domains will never appear in results. Cannot be
            used alongside `allowed_domains`.
          title: Blocked Domains
        cache_control:
          anyOf:
            - discriminator:
                mapping:
                  ephemeral: '#/components/schemas/CacheControlEphemeral'
                propertyName: type
              oneOf:
                - $ref: '#/components/schemas/CacheControlEphemeral'
            - type: 'null'
          description: Create a cache control breakpoint at this content block.
          title: Cache Control
        max_uses:
          anyOf:
            - exclusiveMinimum: 0
              type: integer
            - type: 'null'
          description: Maximum number of times the tool can be used in the API request.
          title: Max Uses
        name:
          const: web_search
          description: >-
            Name of the tool.


            This is how the tool will be called by the model and in `tool_use`
            blocks.
          enum:
            - web_search
          title: Name
          type: string
        type:
          const: web_search_20250305
          enum:
            - web_search_20250305
          title: Type
          type: string
        user_location:
          anyOf:
            - $ref: '#/components/schemas/UserLocation'
            - type: 'null'
          description: >-
            Parameters for the user's location. Used to provide more relevant
            search results.
      required:
        - name
        - type
      title: Web search tool (2025-03-05)
      type: object

````

# List Models

> List available models.

The Models API response can be used to determine which models are available for use in the API. More recently released models are listed first.

## OpenAPI

````yaml get /v1/models
paths:
  path: /v1/models
  method: get
  servers:
    - url: https://api.anthropic.com
  request:
    security: []
    parameters:
      path: {}
      query:
        before_id:
          schema:
            - type: string
              required: false
              title: Before Id
              description: >-
                ID of the object to use as a cursor for pagination. When
                provided, returns the page of results immediately before this
                object.
        after_id:
          schema:
            - type: string
              required: false
              title: After Id
              description: >-
                ID of the object to use as a cursor for pagination. When
                provided, returns the page of results immediately after this
                object.
        limit:
          schema:
            - type: integer
              required: false
              title: Limit
              description: |-
                Number of items to return per page.

                Defaults to `20`. Ranges from `1` to `1000`.
              maximum: 1000
              minimum: 1
              default: 20
      header:
        anthropic-version:
          schema:
            - type: string
              required: true
              title: Anthropic-Version
              description: >-
                The version of the Anthropic API you want to use.


                Read more about versioning and our version history
                [here](https://docs.anthropic.com/en/api/versioning).
        x-api-key:
          schema:
            - type: string
              required: true
              title: X-Api-Key
              description: >-
                Your unique API key for authentication.


                This key is required in the header of all API requests, to
                authenticate your account and access Anthropic's services. Get
                your API key through the
                [Console](https://console.anthropic.com/settings/keys). Each key
                is scoped to a Workspace.
        anthropic-beta:
          schema:
            - type: array
              items:
                allOf:
                  - type: string
              required: false
              title: Anthropic-Beta
              description: >-
                Optional header to specify the beta version(s) you want to use.


                To use multiple betas, use a comma separated list like
                `beta1,beta2` or specify the header multiple times for each
                beta.
      cookie: {}
    body: {}
    codeSamples:
      - lang: bash
        source: |-
          curl https://api.anthropic.com/v1/models \
               --header "x-api-key: $ANTHROPIC_API_KEY" \
               --header "anthropic-version: 2023-06-01"
      - lang: python
        source: |-
          import anthropic

          client = anthropic.Anthropic()

          client.models.list(limit=20)
      - lang: javascript
        source: |-
          import Anthropic from '@anthropic-ai/sdk';

          const anthropic = new Anthropic();

          await anthropic.models.list({
            limit: 20,
          });
  response:
    '200':
      application/json:
        schemaArray:
          - type: object
            properties:
              data:
                allOf:
                  - items:
                      $ref: '#/components/schemas/ModelInfo'
                    type: array
                    title: Data
              first_id:
                allOf:
                  - anyOf:
                      - type: string
                      - type: 'null'
                    title: First Id
                    description: >-
                      First ID in the `data` list. Can be used as the
                      `before_id` for the previous page.
              has_more:
                allOf:
                  - type: boolean
                    title: Has More
                    description: >-
                      Indicates if there are more results in the requested page
                      direction.
              last_id:
                allOf:
                  - anyOf:
                      - type: string
                      - type: 'null'
                    title: Last Id
                    description: >-
                      Last ID in the `data` list. Can be used as the `after_id`
                      for the next page.
            title: ListResponse[ModelInfo]
            requiredProperties:
              - data
              - first_id
              - has_more
              - last_id
        examples:
          example:
            value:
              data:
                - created_at: '2025-02-19T00:00:00Z'
                  display_name: Claude Sonnet 4
                  id: claude-sonnet-4-20250514
                  type: model
              first_id: <string>
              has_more: true
              last_id: <string>
        description: Successful Response
    4XX:
      application/json:
        schemaArray:
          - type: object
            properties:
              error:
                allOf:
                  - discriminator:
                      mapping:
                        api_error: '#/components/schemas/APIError'
                        authentication_error: '#/components/schemas/AuthenticationError'
                        billing_error: '#/components/schemas/BillingError'
                        invalid_request_error: '#/components/schemas/InvalidRequestError'
                        not_found_error: '#/components/schemas/NotFoundError'
                        overloaded_error: '#/components/schemas/OverloadedError'
                        permission_error: '#/components/schemas/PermissionError'
                        rate_limit_error: '#/components/schemas/RateLimitError'
                        timeout_error: '#/components/schemas/GatewayTimeoutError'
                      propertyName: type
                    oneOf:
                      - $ref: '#/components/schemas/InvalidRequestError'
                      - $ref: '#/components/schemas/AuthenticationError'
                      - $ref: '#/components/schemas/BillingError'
                      - $ref: '#/components/schemas/PermissionError'
                      - $ref: '#/components/schemas/NotFoundError'
                      - $ref: '#/components/schemas/RateLimitError'
                      - $ref: '#/components/schemas/GatewayTimeoutError'
                      - $ref: '#/components/schemas/APIError'
                      - $ref: '#/components/schemas/OverloadedError'
                    title: Error
              type:
                allOf:
                  - const: error
                    default: error
                    enum:
                      - error
                    title: Type
                    type: string
            title: ErrorResponse
            requiredProperties:
              - error
              - type
        examples:
          example:
            value:
              error:
                message: Invalid request
                type: invalid_request_error
              type: error
        description: >-
          Error response.


          See our [errors
          documentation](https://docs.anthropic.com/en/api/errors) for more
          details.
  deprecated: false
  type: path
components:
  schemas:
    APIError:
      properties:
        message:
          default: Internal server error
          title: Message
          type: string
        type:
          const: api_error
          default: api_error
          enum:
            - api_error
          title: Type
          type: string
      required:
        - message
        - type
      title: APIError
      type: object
    AuthenticationError:
      properties:
        message:
          default: Authentication error
          title: Message
          type: string
        type:
          const: authentication_error
          default: authentication_error
          enum:
            - authentication_error
          title: Type
          type: string
      required:
        - message
        - type
      title: AuthenticationError
      type: object
    BillingError:
      properties:
        message:
          default: Billing error
          title: Message
          type: string
        type:
          const: billing_error
          default: billing_error
          enum:
            - billing_error
          title: Type
          type: string
      required:
        - message
        - type
      title: BillingError
      type: object
    GatewayTimeoutError:
      properties:
        message:
          default: Request timeout
          title: Message
          type: string
        type:
          const: timeout_error
          default: timeout_error
          enum:
            - timeout_error
          title: Type
          type: string
      required:
        - message
        - type
      title: GatewayTimeoutError
      type: object
    InvalidRequestError:
      properties:
        message:
          default: Invalid request
          title: Message
          type: string
        type:
          const: invalid_request_error
          default: invalid_request_error
          enum:
            - invalid_request_error
          title: Type
          type: string
      required:
        - message
        - type
      title: InvalidRequestError
      type: object
    ModelInfo:
      properties:
        created_at:
          type: string
          format: date-time
          title: Created At
          description: >-
            RFC 3339 datetime string representing the time at which the model
            was released. May be set to an epoch value if the release date is
            unknown.
          examples:
            - '2025-02-19T00:00:00Z'
        display_name:
          type: string
          title: Display Name
          description: A human-readable name for the model.
          examples:
            - Claude Sonnet 4
        id:
          type: string
          title: Id
          description: Unique model identifier.
          examples:
            - claude-sonnet-4-20250514
        type:
          type: string
          enum:
            - model
          const: model
          title: Type
          description: |-
            Object type.

            For Models, this is always `"model"`.
          default: model
      type: object
      required:
        - created_at
        - display_name
        - id
        - type
      title: ModelInfo
    NotFoundError:
      properties:
        message:
          default: Not found
          title: Message
          type: string
        type:
          const: not_found_error
          default: not_found_error
          enum:
            - not_found_error
          title: Type
          type: string
      required:
        - message
        - type
      title: NotFoundError
      type: object
    OverloadedError:
      properties:
        message:
          default: Overloaded
          title: Message
          type: string
        type:
          const: overloaded_error
          default: overloaded_error
          enum:
            - overloaded_error
          title: Type
          type: string
      required:
        - message
        - type
      title: OverloadedError
      type: object
    PermissionError:
      properties:
        message:
          default: Permission denied
          title: Message
          type: string
        type:
          const: permission_error
          default: permission_error
          enum:
            - permission_error
          title: Type
          type: string
      required:
        - message
        - type
      title: PermissionError
      type: object
    RateLimitError:
      properties:
        message:
          default: Rate limited
          title: Message
          type: string
        type:
          const: rate_limit_error
          default: rate_limit_error
          enum:
            - rate_limit_error
          title: Type
          type: string
      required:
        - message
        - type
      title: RateLimitError
      type: object

````

# Get a Model

> Get a specific model.

The Models API response can be used to determine information about a specific model or resolve a model alias to a model ID.

## OpenAPI

````yaml get /v1/models/{model_id}
paths:
  path: /v1/models/{model_id}
  method: get
  servers:
    - url: https://api.anthropic.com
  request:
    security: []
    parameters:
      path:
        model_id:
          schema:
            - type: string
              required: true
              title: Model Id
              description: Model identifier or alias.
      query: {}
      header:
        anthropic-version:
          schema:
            - type: string
              required: true
              title: Anthropic-Version
              description: >-
                The version of the Anthropic API you want to use.


                Read more about versioning and our version history
                [here](https://docs.anthropic.com/en/api/versioning).
        x-api-key:
          schema:
            - type: string
              required: true
              title: X-Api-Key
              description: >-
                Your unique API key for authentication.


                This key is required in the header of all API requests, to
                authenticate your account and access Anthropic's services. Get
                your API key through the
                [Console](https://console.anthropic.com/settings/keys). Each key
                is scoped to a Workspace.
        anthropic-beta:
          schema:
            - type: array
              items:
                allOf:
                  - type: string
              required: false
              title: Anthropic-Beta
              description: >-
                Optional header to specify the beta version(s) you want to use.


                To use multiple betas, use a comma separated list like
                `beta1,beta2` or specify the header multiple times for each
                beta.
      cookie: {}
    body: {}
    codeSamples:
      - lang: bash
        source: |-
          curl https://api.anthropic.com/v1/models/claude-sonnet-4-20250514 \
               --header "x-api-key: $ANTHROPIC_API_KEY" \
               --header "anthropic-version: 2023-06-01"
      - lang: python
        source: |-
          import anthropic

          client = anthropic.Anthropic()

          client.models.get("claude-sonnet-4-20250514")
      - lang: javascript
        source: |-
          import Anthropic from '@anthropic-ai/sdk';

          const anthropic = new Anthropic();

          await anthropic.models.get("claude-sonnet-4-20250514");
  response:
    '200':
      application/json:
        schemaArray:
          - type: object
            properties:
              created_at:
                allOf:
                  - type: string
                    format: date-time
                    title: Created At
                    description: >-
                      RFC 3339 datetime string representing the time at which
                      the model was released. May be set to an epoch value if
                      the release date is unknown.
                    examples:
                      - '2025-02-19T00:00:00Z'
              display_name:
                allOf:
                  - type: string
                    title: Display Name
                    description: A human-readable name for the model.
                    examples:
                      - Claude Sonnet 4
              id:
                allOf:
                  - type: string
                    title: Id
                    description: Unique model identifier.
                    examples:
                      - claude-sonnet-4-20250514
              type:
                allOf:
                  - type: string
                    enum:
                      - model
                    const: model
                    title: Type
                    description: |-
                      Object type.

                      For Models, this is always `"model"`.
                    default: model
            title: ModelInfo
            requiredProperties:
              - created_at
              - display_name
              - id
              - type
        examples:
          example:
            value:
              created_at: '2025-02-19T00:00:00Z'
              display_name: Claude Sonnet 4
              id: claude-sonnet-4-20250514
              type: model
        description: Successful Response
    4XX:
      application/json:
        schemaArray:
          - type: object
            properties:
              error:
                allOf:
                  - discriminator:
                      mapping:
                        api_error: '#/components/schemas/APIError'
                        authentication_error: '#/components/schemas/AuthenticationError'
                        billing_error: '#/components/schemas/BillingError'
                        invalid_request_error: '#/components/schemas/InvalidRequestError'
                        not_found_error: '#/components/schemas/NotFoundError'
                        overloaded_error: '#/components/schemas/OverloadedError'
                        permission_error: '#/components/schemas/PermissionError'
                        rate_limit_error: '#/components/schemas/RateLimitError'
                        timeout_error: '#/components/schemas/GatewayTimeoutError'
                      propertyName: type
                    oneOf:
                      - $ref: '#/components/schemas/InvalidRequestError'
                      - $ref: '#/components/schemas/AuthenticationError'
                      - $ref: '#/components/schemas/BillingError'
                      - $ref: '#/components/schemas/PermissionError'
                      - $ref: '#/components/schemas/NotFoundError'
                      - $ref: '#/components/schemas/RateLimitError'
                      - $ref: '#/components/schemas/GatewayTimeoutError'
                      - $ref: '#/components/schemas/APIError'
                      - $ref: '#/components/schemas/OverloadedError'
                    title: Error
              type:
                allOf:
                  - const: error
                    default: error
                    enum:
                      - error
                    title: Type
                    type: string
            title: ErrorResponse
            requiredProperties:
              - error
              - type
        examples:
          example:
            value:
              error:
                message: Invalid request
                type: invalid_request_error
              type: error
        description: >-
          Error response.


          See our [errors
          documentation](https://docs.anthropic.com/en/api/errors) for more
          details.
  deprecated: false
  type: path
components:
  schemas:
    APIError:
      properties:
        message:
          default: Internal server error
          title: Message
          type: string
        type:
          const: api_error
          default: api_error
          enum:
            - api_error
          title: Type
          type: string
      required:
        - message
        - type
      title: APIError
      type: object
    AuthenticationError:
      properties:
        message:
          default: Authentication error
          title: Message
          type: string
        type:
          const: authentication_error
          default: authentication_error
          enum:
            - authentication_error
          title: Type
          type: string
      required:
        - message
        - type
      title: AuthenticationError
      type: object
    BillingError:
      properties:
        message:
          default: Billing error
          title: Message
          type: string
        type:
          const: billing_error
          default: billing_error
          enum:
            - billing_error
          title: Type
          type: string
      required:
        - message
        - type
      title: BillingError
      type: object
    GatewayTimeoutError:
      properties:
        message:
          default: Request timeout
          title: Message
          type: string
        type:
          const: timeout_error
          default: timeout_error
          enum:
            - timeout_error
          title: Type
          type: string
      required:
        - message
        - type
      title: GatewayTimeoutError
      type: object
    InvalidRequestError:
      properties:
        message:
          default: Invalid request
          title: Message
          type: string
        type:
          const: invalid_request_error
          default: invalid_request_error
          enum:
            - invalid_request_error
          title: Type
          type: string
      required:
        - message
        - type
      title: InvalidRequestError
      type: object
    NotFoundError:
      properties:
        message:
          default: Not found
          title: Message
          type: string
        type:
          const: not_found_error
          default: not_found_error
          enum:
            - not_found_error
          title: Type
          type: string
      required:
        - message
        - type
      title: NotFoundError
      type: object
    OverloadedError:
      properties:
        message:
          default: Overloaded
          title: Message
          type: string
        type:
          const: overloaded_error
          default: overloaded_error
          enum:
            - overloaded_error
          title: Type
          type: string
      required:
        - message
        - type
      title: OverloadedError
      type: object
    PermissionError:
      properties:
        message:
          default: Permission denied
          title: Message
          type: string
        type:
          const: permission_error
          default: permission_error
          enum:
            - permission_error
          title: Type
          type: string
      required:
        - message
        - type
      title: PermissionError
      type: object
    RateLimitError:
      properties:
        message:
          default: Rate limited
          title: Message
          type: string
        type:
          const: rate_limit_error
          default: rate_limit_error
          enum:
            - rate_limit_error
          title: Type
          type: string
      required:
        - message
        - type
      title: RateLimitError
      type: object

````

# Get a Model

> Get a specific model.

The Models API response can be used to determine information about a specific model or resolve a model alias to a model ID.

## OpenAPI

````yaml get /v1/models/{model_id}
paths:
  path: /v1/models/{model_id}
  method: get
  servers:
    - url: https://api.anthropic.com
  request:
    security: []
    parameters:
      path:
        model_id:
          schema:
            - type: string
              required: true
              title: Model Id
              description: Model identifier or alias.
      query: {}
      header:
        anthropic-version:
          schema:
            - type: string
              required: true
              title: Anthropic-Version
              description: >-
                The version of the Anthropic API you want to use.


                Read more about versioning and our version history
                [here](https://docs.anthropic.com/en/api/versioning).
        x-api-key:
          schema:
            - type: string
              required: true
              title: X-Api-Key
              description: >-
                Your unique API key for authentication.


                This key is required in the header of all API requests, to
                authenticate your account and access Anthropic's services. Get
                your API key through the
                [Console](https://console.anthropic.com/settings/keys). Each key
                is scoped to a Workspace.
        anthropic-beta:
          schema:
            - type: array
              items:
                allOf:
                  - type: string
              required: false
              title: Anthropic-Beta
              description: >-
                Optional header to specify the beta version(s) you want to use.


                To use multiple betas, use a comma separated list like
                `beta1,beta2` or specify the header multiple times for each
                beta.
      cookie: {}
    body: {}
    codeSamples:
      - lang: bash
        source: |-
          curl https://api.anthropic.com/v1/models/claude-sonnet-4-20250514 \
               --header "x-api-key: $ANTHROPIC_API_KEY" \
               --header "anthropic-version: 2023-06-01"
      - lang: python
        source: |-
          import anthropic

          client = anthropic.Anthropic()

          client.models.get("claude-sonnet-4-20250514")
      - lang: javascript
        source: |-
          import Anthropic from '@anthropic-ai/sdk';

          const anthropic = new Anthropic();

          await anthropic.models.get("claude-sonnet-4-20250514");
  response:
    '200':
      application/json:
        schemaArray:
          - type: object
            properties:
              created_at:
                allOf:
                  - type: string
                    format: date-time
                    title: Created At
                    description: >-
                      RFC 3339 datetime string representing the time at which
                      the model was released. May be set to an epoch value if
                      the release date is unknown.
                    examples:
                      - '2025-02-19T00:00:00Z'
              display_name:
                allOf:
                  - type: string
                    title: Display Name
                    description: A human-readable name for the model.
                    examples:
                      - Claude Sonnet 4
              id:
                allOf:
                  - type: string
                    title: Id
                    description: Unique model identifier.
                    examples:
                      - claude-sonnet-4-20250514
              type:
                allOf:
                  - type: string
                    enum:
                      - model
                    const: model
                    title: Type
                    description: |-
                      Object type.

                      For Models, this is always `"model"`.
                    default: model
            title: ModelInfo
            requiredProperties:
              - created_at
              - display_name
              - id
              - type
        examples:
          example:
            value:
              created_at: '2025-02-19T00:00:00Z'
              display_name: Claude Sonnet 4
              id: claude-sonnet-4-20250514
              type: model
        description: Successful Response
    4XX:
      application/json:
        schemaArray:
          - type: object
            properties:
              error:
                allOf:
                  - discriminator:
                      mapping:
                        api_error: '#/components/schemas/APIError'
                        authentication_error: '#/components/schemas/AuthenticationError'
                        billing_error: '#/components/schemas/BillingError'
                        invalid_request_error: '#/components/schemas/InvalidRequestError'
                        not_found_error: '#/components/schemas/NotFoundError'
                        overloaded_error: '#/components/schemas/OverloadedError'
                        permission_error: '#/components/schemas/PermissionError'
                        rate_limit_error: '#/components/schemas/RateLimitError'
                        timeout_error: '#/components/schemas/GatewayTimeoutError'
                      propertyName: type
                    oneOf:
                      - $ref: '#/components/schemas/InvalidRequestError'
                      - $ref: '#/components/schemas/AuthenticationError'
                      - $ref: '#/components/schemas/BillingError'
                      - $ref: '#/components/schemas/PermissionError'
                      - $ref: '#/components/schemas/NotFoundError'
                      - $ref: '#/components/schemas/RateLimitError'
                      - $ref: '#/components/schemas/GatewayTimeoutError'
                      - $ref: '#/components/schemas/APIError'
                      - $ref: '#/components/schemas/OverloadedError'
                    title: Error
              type:
                allOf:
                  - const: error
                    default: error
                    enum:
                      - error
                    title: Type
                    type: string
            title: ErrorResponse
            requiredProperties:
              - error
              - type
        examples:
          example:
            value:
              error:
                message: Invalid request
                type: invalid_request_error
              type: error
        description: >-
          Error response.


          See our [errors
          documentation](https://docs.anthropic.com/en/api/errors) for more
          details.
  deprecated: false
  type: path
components:
  schemas:
    APIError:
      properties:
        message:
          default: Internal server error
          title: Message
          type: string
        type:
          const: api_error
          default: api_error
          enum:
            - api_error
          title: Type
          type: string
      required:
        - message
        - type
      title: APIError
      type: object
    AuthenticationError:
      properties:
        message:
          default: Authentication error
          title: Message
          type: string
        type:
          const: authentication_error
          default: authentication_error
          enum:
            - authentication_error
          title: Type
          type: string
      required:
        - message
        - type
      title: AuthenticationError
      type: object
    BillingError:
      properties:
        message:
          default: Billing error
          title: Message
          type: string
        type:
          const: billing_error
          default: billing_error
          enum:
            - billing_error
          title: Type
          type: string
      required:
        - message
        - type
      title: BillingError
      type: object
    GatewayTimeoutError:
      properties:
        message:
          default: Request timeout
          title: Message
          type: string
        type:
          const: timeout_error
          default: timeout_error
          enum:
            - timeout_error
          title: Type
          type: string
      required:
        - message
        - type
      title: GatewayTimeoutError
      type: object
    InvalidRequestError:
      properties:
        message:
          default: Invalid request
          title: Message
          type: string
        type:
          const: invalid_request_error
          default: invalid_request_error
          enum:
            - invalid_request_error
          title: Type
          type: string
      required:
        - message
        - type
      title: InvalidRequestError
      type: object
    NotFoundError:
      properties:
        message:
          default: Not found
          title: Message
          type: string
        type:
          const: not_found_error
          default: not_found_error
          enum:
            - not_found_error
          title: Type
          type: string
      required:
        - message
        - type
      title: NotFoundError
      type: object
    OverloadedError:
      properties:
        message:
          default: Overloaded
          title: Message
          type: string
        type:
          const: overloaded_error
          default: overloaded_error
          enum:
            - overloaded_error
          title: Type
          type: string
      required:
        - message
        - type
      title: OverloadedError
      type: object
    PermissionError:
      properties:
        message:
          default: Permission denied
          title: Message
          type: string
        type:
          const: permission_error
          default: permission_error
          enum:
            - permission_error
          title: Type
          type: string
      required:
        - message
        - type
      title: PermissionError
      type: object
    RateLimitError:
      properties:
        message:
          default: Rate limited
          title: Message
          type: string
        type:
          const: rate_limit_error
          default: rate_limit_error
          enum:
            - rate_limit_error
          title: Type
          type: string
      required:
        - message
        - type
      title: RateLimitError
      type: object

````

# Get a Model

> Get a specific model.

The Models API response can be used to determine information about a specific model or resolve a model alias to a model ID.

## OpenAPI

````yaml get /v1/models/{model_id}
paths:
  path: /v1/models/{model_id}
  method: get
  servers:
    - url: https://api.anthropic.com
  request:
    security: []
    parameters:
      path:
        model_id:
          schema:
            - type: string
              required: true
              title: Model Id
              description: Model identifier or alias.
      query: {}
      header:
        anthropic-version:
          schema:
            - type: string
              required: true
              title: Anthropic-Version
              description: >-
                The version of the Anthropic API you want to use.


                Read more about versioning and our version history
                [here](https://docs.anthropic.com/en/api/versioning).
        x-api-key:
          schema:
            - type: string
              required: true
              title: X-Api-Key
              description: >-
                Your unique API key for authentication.


                This key is required in the header of all API requests, to
                authenticate your account and access Anthropic's services. Get
                your API key through the
                [Console](https://console.anthropic.com/settings/keys). Each key
                is scoped to a Workspace.
        anthropic-beta:
          schema:
            - type: array
              items:
                allOf:
                  - type: string
              required: false
              title: Anthropic-Beta
              description: >-
                Optional header to specify the beta version(s) you want to use.


                To use multiple betas, use a comma separated list like
                `beta1,beta2` or specify the header multiple times for each
                beta.
      cookie: {}
    body: {}
    codeSamples:
      - lang: bash
        source: |-
          curl https://api.anthropic.com/v1/models/claude-sonnet-4-20250514 \
               --header "x-api-key: $ANTHROPIC_API_KEY" \
               --header "anthropic-version: 2023-06-01"
      - lang: python
        source: |-
          import anthropic

          client = anthropic.Anthropic()

          client.models.get("claude-sonnet-4-20250514")
      - lang: javascript
        source: |-
          import Anthropic from '@anthropic-ai/sdk';

          const anthropic = new Anthropic();

          await anthropic.models.get("claude-sonnet-4-20250514");
  response:
    '200':
      application/json:
        schemaArray:
          - type: object
            properties:
              created_at:
                allOf:
                  - type: string
                    format: date-time
                    title: Created At
                    description: >-
                      RFC 3339 datetime string representing the time at which
                      the model was released. May be set to an epoch value if
                      the release date is unknown.
                    examples:
                      - '2025-02-19T00:00:00Z'
              display_name:
                allOf:
                  - type: string
                    title: Display Name
                    description: A human-readable name for the model.
                    examples:
                      - Claude Sonnet 4
              id:
                allOf:
                  - type: string
                    title: Id
                    description: Unique model identifier.
                    examples:
                      - claude-sonnet-4-20250514
              type:
                allOf:
                  - type: string
                    enum:
                      - model
                    const: model
                    title: Type
                    description: |-
                      Object type.

                      For Models, this is always `"model"`.
                    default: model
            title: ModelInfo
            requiredProperties:
              - created_at
              - display_name
              - id
              - type
        examples:
          example:
            value:
              created_at: '2025-02-19T00:00:00Z'
              display_name: Claude Sonnet 4
              id: claude-sonnet-4-20250514
              type: model
        description: Successful Response
    4XX:
      application/json:
        schemaArray:
          - type: object
            properties:
              error:
                allOf:
                  - discriminator:
                      mapping:
                        api_error: '#/components/schemas/APIError'
                        authentication_error: '#/components/schemas/AuthenticationError'
                        billing_error: '#/components/schemas/BillingError'
                        invalid_request_error: '#/components/schemas/InvalidRequestError'
                        not_found_error: '#/components/schemas/NotFoundError'
                        overloaded_error: '#/components/schemas/OverloadedError'
                        permission_error: '#/components/schemas/PermissionError'
                        rate_limit_error: '#/components/schemas/RateLimitError'
                        timeout_error: '#/components/schemas/GatewayTimeoutError'
                      propertyName: type
                    oneOf:
                      - $ref: '#/components/schemas/InvalidRequestError'
                      - $ref: '#/components/schemas/AuthenticationError'
                      - $ref: '#/components/schemas/BillingError'
                      - $ref: '#/components/schemas/PermissionError'
                      - $ref: '#/components/schemas/NotFoundError'
                      - $ref: '#/components/schemas/RateLimitError'
                      - $ref: '#/components/schemas/GatewayTimeoutError'
                      - $ref: '#/components/schemas/APIError'
                      - $ref: '#/components/schemas/OverloadedError'
                    title: Error
              type:
                allOf:
                  - const: error
                    default: error
                    enum:
                      - error
                    title: Type
                    type: string
            title: ErrorResponse
            requiredProperties:
              - error
              - type
        examples:
          example:
            value:
              error:
                message: Invalid request
                type: invalid_request_error
              type: error
        description: >-
          Error response.


          See our [errors
          documentation](https://docs.anthropic.com/en/api/errors) for more
          details.
  deprecated: false
  type: path
components:
  schemas:
    APIError:
      properties:
        message:
          default: Internal server error
          title: Message
          type: string
        type:
          const: api_error
          default: api_error
          enum:
            - api_error
          title: Type
          type: string
      required:
        - message
        - type
      title: APIError
      type: object
    AuthenticationError:
      properties:
        message:
          default: Authentication error
          title: Message
          type: string
        type:
          const: authentication_error
          default: authentication_error
          enum:
            - authentication_error
          title: Type
          type: string
      required:
        - message
        - type
      title: AuthenticationError
      type: object
    BillingError:
      properties:
        message:
          default: Billing error
          title: Message
          type: string
        type:
          const: billing_error
          default: billing_error
          enum:
            - billing_error
          title: Type
          type: string
      required:
        - message
        - type
      title: BillingError
      type: object
    GatewayTimeoutError:
      properties:
        message:
          default: Request timeout
          title: Message
          type: string
        type:
          const: timeout_error
          default: timeout_error
          enum:
            - timeout_error
          title: Type
          type: string
      required:
        - message
        - type
      title: GatewayTimeoutError
      type: object
    InvalidRequestError:
      properties:
        message:
          default: Invalid request
          title: Message
          type: string
        type:
          const: invalid_request_error
          default: invalid_request_error
          enum:
            - invalid_request_error
          title: Type
          type: string
      required:
        - message
        - type
      title: InvalidRequestError
      type: object
    NotFoundError:
      properties:
        message:
          default: Not found
          title: Message
          type: string
        type:
          const: not_found_error
          default: not_found_error
          enum:
            - not_found_error
          title: Type
          type: string
      required:
        - message
        - type
      title: NotFoundError
      type: object
    OverloadedError:
      properties:
        message:
          default: Overloaded
          title: Message
          type: string
        type:
          const: overloaded_error
          default: overloaded_error
          enum:
            - overloaded_error
          title: Type
          type: string
      required:
        - message
        - type
      title: OverloadedError
      type: object
    PermissionError:
      properties:
        message:
          default: Permission denied
          title: Message
          type: string
        type:
          const: permission_error
          default: permission_error
          enum:
            - permission_error
          title: Type
          type: string
      required:
        - message
        - type
      title: PermissionError
      type: object
    RateLimitError:
      properties:
        message:
          default: Rate limited
          title: Message
          type: string
        type:
          const: rate_limit_error
          default: rate_limit_error
          enum:
            - rate_limit_error
          title: Type
          type: string
      required:
        - message
        - type
      title: RateLimitError
      type: object

````

# Get a Model

> Get a specific model.

The Models API response can be used to determine information about a specific model or resolve a model alias to a model ID.

## OpenAPI

````yaml get /v1/models/{model_id}
paths:
  path: /v1/models/{model_id}
  method: get
  servers:
    - url: https://api.anthropic.com
  request:
    security: []
    parameters:
      path:
        model_id:
          schema:
            - type: string
              required: true
              title: Model Id
              description: Model identifier or alias.
      query: {}
      header:
        anthropic-version:
          schema:
            - type: string
              required: true
              title: Anthropic-Version
              description: >-
                The version of the Anthropic API you want to use.


                Read more about versioning and our version history
                [here](https://docs.anthropic.com/en/api/versioning).
        x-api-key:
          schema:
            - type: string
              required: true
              title: X-Api-Key
              description: >-
                Your unique API key for authentication.


                This key is required in the header of all API requests, to
                authenticate your account and access Anthropic's services. Get
                your API key through the
                [Console](https://console.anthropic.com/settings/keys). Each key
                is scoped to a Workspace.
        anthropic-beta:
          schema:
            - type: array
              items:
                allOf:
                  - type: string
              required: false
              title: Anthropic-Beta
              description: >-
                Optional header to specify the beta version(s) you want to use.


                To use multiple betas, use a comma separated list like
                `beta1,beta2` or specify the header multiple times for each
                beta.
      cookie: {}
    body: {}
    codeSamples:
      - lang: bash
        source: |-
          curl https://api.anthropic.com/v1/models/claude-sonnet-4-20250514 \
               --header "x-api-key: $ANTHROPIC_API_KEY" \
               --header "anthropic-version: 2023-06-01"
      - lang: python
        source: |-
          import anthropic

          client = anthropic.Anthropic()

          client.models.get("claude-sonnet-4-20250514")
      - lang: javascript
        source: |-
          import Anthropic from '@anthropic-ai/sdk';

          const anthropic = new Anthropic();

          await anthropic.models.get("claude-sonnet-4-20250514");
  response:
    '200':
      application/json:
        schemaArray:
          - type: object
            properties:
              created_at:
                allOf:
                  - type: string
                    format: date-time
                    title: Created At
                    description: >-
                      RFC 3339 datetime string representing the time at which
                      the model was released. May be set to an epoch value if
                      the release date is unknown.
                    examples:
                      - '2025-02-19T00:00:00Z'
              display_name:
                allOf:
                  - type: string
                    title: Display Name
                    description: A human-readable name for the model.
                    examples:
                      - Claude Sonnet 4
              id:
                allOf:
                  - type: string
                    title: Id
                    description: Unique model identifier.
                    examples:
                      - claude-sonnet-4-20250514
              type:
                allOf:
                  - type: string
                    enum:
                      - model
                    const: model
                    title: Type
                    description: |-
                      Object type.

                      For Models, this is always `"model"`.
                    default: model
            title: ModelInfo
            requiredProperties:
              - created_at
              - display_name
              - id
              - type
        examples:
          example:
            value:
              created_at: '2025-02-19T00:00:00Z'
              display_name: Claude Sonnet 4
              id: claude-sonnet-4-20250514
              type: model
        description: Successful Response
    4XX:
      application/json:
        schemaArray:
          - type: object
            properties:
              error:
                allOf:
                  - discriminator:
                      mapping:
                        api_error: '#/components/schemas/APIError'
                        authentication_error: '#/components/schemas/AuthenticationError'
                        billing_error: '#/components/schemas/BillingError'
                        invalid_request_error: '#/components/schemas/InvalidRequestError'
                        not_found_error: '#/components/schemas/NotFoundError'
                        overloaded_error: '#/components/schemas/OverloadedError'
                        permission_error: '#/components/schemas/PermissionError'
                        rate_limit_error: '#/components/schemas/RateLimitError'
                        timeout_error: '#/components/schemas/GatewayTimeoutError'
                      propertyName: type
                    oneOf:
                      - $ref: '#/components/schemas/InvalidRequestError'
                      - $ref: '#/components/schemas/AuthenticationError'
                      - $ref: '#/components/schemas/BillingError'
                      - $ref: '#/components/schemas/PermissionError'
                      - $ref: '#/components/schemas/NotFoundError'
                      - $ref: '#/components/schemas/RateLimitError'
                      - $ref: '#/components/schemas/GatewayTimeoutError'
                      - $ref: '#/components/schemas/APIError'
                      - $ref: '#/components/schemas/OverloadedError'
                    title: Error
              type:
                allOf:
                  - const: error
                    default: error
                    enum:
                      - error
                    title: Type
                    type: string
            title: ErrorResponse
            requiredProperties:
              - error
              - type
        examples:
          example:
            value:
              error:
                message: Invalid request
                type: invalid_request_error
              type: error
        description: >-
          Error response.


          See our [errors
          documentation](https://docs.anthropic.com/en/api/errors) for more
          details.
  deprecated: false
  type: path
components:
  schemas:
    APIError:
      properties:
        message:
          default: Internal server error
          title: Message
          type: string
        type:
          const: api_error
          default: api_error
          enum:
            - api_error
          title: Type
          type: string
      required:
        - message
        - type
      title: APIError
      type: object
    AuthenticationError:
      properties:
        message:
          default: Authentication error
          title: Message
          type: string
        type:
          const: authentication_error
          default: authentication_error
          enum:
            - authentication_error
          title: Type
          type: string
      required:
        - message
        - type
      title: AuthenticationError
      type: object
    BillingError:
      properties:
        message:
          default: Billing error
          title: Message
          type: string
        type:
          const: billing_error
          default: billing_error
          enum:
            - billing_error
          title: Type
          type: string
      required:
        - message
        - type
      title: BillingError
      type: object
    GatewayTimeoutError:
      properties:
        message:
          default: Request timeout
          title: Message
          type: string
        type:
          const: timeout_error
          default: timeout_error
          enum:
            - timeout_error
          title: Type
          type: string
      required:
        - message
        - type
      title: GatewayTimeoutError
      type: object
    InvalidRequestError:
      properties:
        message:
          default: Invalid request
          title: Message
          type: string
        type:
          const: invalid_request_error
          default: invalid_request_error
          enum:
            - invalid_request_error
          title: Type
          type: string
      required:
        - message
        - type
      title: InvalidRequestError
      type: object
    NotFoundError:
      properties:
        message:
          default: Not found
          title: Message
          type: string
        type:
          const: not_found_error
          default: not_found_error
          enum:
            - not_found_error
          title: Type
          type: string
      required:
        - message
        - type
      title: NotFoundError
      type: object
    OverloadedError:
      properties:
        message:
          default: Overloaded
          title: Message
          type: string
        type:
          const: overloaded_error
          default: overloaded_error
          enum:
            - overloaded_error
          title: Type
          type: string
      required:
        - message
        - type
      title: OverloadedError
      type: object
    PermissionError:
      properties:
        message:
          default: Permission denied
          title: Message
          type: string
        type:
          const: permission_error
          default: permission_error
          enum:
            - permission_error
          title: Type
          type: string
      required:
        - message
        - type
      title: PermissionError
      type: object
    RateLimitError:
      properties:
        message:
          default: Rate limited
          title: Message
          type: string
        type:
          const: rate_limit_error
          default: rate_limit_error
          enum:
            - rate_limit_error
          title: Type
          type: string
      required:
        - message
        - type
      title: RateLimitError
      type: object

````

# Get a Model

> Get a specific model.

The Models API response can be used to determine information about a specific model or resolve a model alias to a model ID.

## OpenAPI

````yaml get /v1/models/{model_id}
paths:
  path: /v1/models/{model_id}
  method: get
  servers:
    - url: https://api.anthropic.com
  request:
    security: []
    parameters:
      path:
        model_id:
          schema:
            - type: string
              required: true
              title: Model Id
              description: Model identifier or alias.
      query: {}
      header:
        anthropic-version:
          schema:
            - type: string
              required: true
              title: Anthropic-Version
              description: >-
                The version of the Anthropic API you want to use.


                Read more about versioning and our version history
                [here](https://docs.anthropic.com/en/api/versioning).
        x-api-key:
          schema:
            - type: string
              required: true
              title: X-Api-Key
              description: >-
                Your unique API key for authentication.


                This key is required in the header of all API requests, to
                authenticate your account and access Anthropic's services. Get
                your API key through the
                [Console](https://console.anthropic.com/settings/keys). Each key
                is scoped to a Workspace.
        anthropic-beta:
          schema:
            - type: array
              items:
                allOf:
                  - type: string
              required: false
              title: Anthropic-Beta
              description: >-
                Optional header to specify the beta version(s) you want to use.


                To use multiple betas, use a comma separated list like
                `beta1,beta2` or specify the header multiple times for each
                beta.
      cookie: {}
    body: {}
    codeSamples:
      - lang: bash
        source: |-
          curl https://api.anthropic.com/v1/models/claude-sonnet-4-20250514 \
               --header "x-api-key: $ANTHROPIC_API_KEY" \
               --header "anthropic-version: 2023-06-01"
      - lang: python
        source: |-
          import anthropic

          client = anthropic.Anthropic()

          client.models.get("claude-sonnet-4-20250514")
      - lang: javascript
        source: |-
          import Anthropic from '@anthropic-ai/sdk';

          const anthropic = new Anthropic();

          await anthropic.models.get("claude-sonnet-4-20250514");
  response:
    '200':
      application/json:
        schemaArray:
          - type: object
            properties:
              created_at:
                allOf:
                  - type: string
                    format: date-time
                    title: Created At
                    description: >-
                      RFC 3339 datetime string representing the time at which
                      the model was released. May be set to an epoch value if
                      the release date is unknown.
                    examples:
                      - '2025-02-19T00:00:00Z'
              display_name:
                allOf:
                  - type: string
                    title: Display Name
                    description: A human-readable name for the model.
                    examples:
                      - Claude Sonnet 4
              id:
                allOf:
                  - type: string
                    title: Id
                    description: Unique model identifier.
                    examples:
                      - claude-sonnet-4-20250514
              type:
                allOf:
                  - type: string
                    enum:
                      - model
                    const: model
                    title: Type
                    description: |-
                      Object type.

                      For Models, this is always `"model"`.
                    default: model
            title: ModelInfo
            requiredProperties:
              - created_at
              - display_name
              - id
              - type
        examples:
          example:
            value:
              created_at: '2025-02-19T00:00:00Z'
              display_name: Claude Sonnet 4
              id: claude-sonnet-4-20250514
              type: model
        description: Successful Response
    4XX:
      application/json:
        schemaArray:
          - type: object
            properties:
              error:
                allOf:
                  - discriminator:
                      mapping:
                        api_error: '#/components/schemas/APIError'
                        authentication_error: '#/components/schemas/AuthenticationError'
                        billing_error: '#/components/schemas/BillingError'
                        invalid_request_error: '#/components/schemas/InvalidRequestError'
                        not_found_error: '#/components/schemas/NotFoundError'
                        overloaded_error: '#/components/schemas/OverloadedError'
                        permission_error: '#/components/schemas/PermissionError'
                        rate_limit_error: '#/components/schemas/RateLimitError'
                        timeout_error: '#/components/schemas/GatewayTimeoutError'
                      propertyName: type
                    oneOf:
                      - $ref: '#/components/schemas/InvalidRequestError'
                      - $ref: '#/components/schemas/AuthenticationError'
                      - $ref: '#/components/schemas/BillingError'
                      - $ref: '#/components/schemas/PermissionError'
                      - $ref: '#/components/schemas/NotFoundError'
                      - $ref: '#/components/schemas/RateLimitError'
                      - $ref: '#/components/schemas/GatewayTimeoutError'
                      - $ref: '#/components/schemas/APIError'
                      - $ref: '#/components/schemas/OverloadedError'
                    title: Error
              type:
                allOf:
                  - const: error
                    default: error
                    enum:
                      - error
                    title: Type
                    type: string
            title: ErrorResponse
            requiredProperties:
              - error
              - type
        examples:
          example:
            value:
              error:
                message: Invalid request
                type: invalid_request_error
              type: error
        description: >-
          Error response.


          See our [errors
          documentation](https://docs.anthropic.com/en/api/errors) for more
          details.
  deprecated: false
  type: path
components:
  schemas:
    APIError:
      properties:
        message:
          default: Internal server error
          title: Message
          type: string
        type:
          const: api_error
          default: api_error
          enum:
            - api_error
          title: Type
          type: string
      required:
        - message
        - type
      title: APIError
      type: object
    AuthenticationError:
      properties:
        message:
          default: Authentication error
          title: Message
          type: string
        type:
          const: authentication_error
          default: authentication_error
          enum:
            - authentication_error
          title: Type
          type: string
      required:
        - message
        - type
      title: AuthenticationError
      type: object
    BillingError:
      properties:
        message:
          default: Billing error
          title: Message
          type: string
        type:
          const: billing_error
          default: billing_error
          enum:
            - billing_error
          title: Type
          type: string
      required:
        - message
        - type
      title: BillingError
      type: object
    GatewayTimeoutError:
      properties:
        message:
          default: Request timeout
          title: Message
          type: string
        type:
          const: timeout_error
          default: timeout_error
          enum:
            - timeout_error
          title: Type
          type: string
      required:
        - message
        - type
      title: GatewayTimeoutError
      type: object
    InvalidRequestError:
      properties:
        message:
          default: Invalid request
          title: Message
          type: string
        type:
          const: invalid_request_error
          default: invalid_request_error
          enum:
            - invalid_request_error
          title: Type
          type: string
      required:
        - message
        - type
      title: InvalidRequestError
      type: object
    NotFoundError:
      properties:
        message:
          default: Not found
          title: Message
          type: string
        type:
          const: not_found_error
          default: not_found_error
          enum:
            - not_found_error
          title: Type
          type: string
      required:
        - message
        - type
      title: NotFoundError
      type: object
    OverloadedError:
      properties:
        message:
          default: Overloaded
          title: Message
          type: string
        type:
          const: overloaded_error
          default: overloaded_error
          enum:
            - overloaded_error
          title: Type
          type: string
      required:
        - message
        - type
      title: OverloadedError
      type: object
    PermissionError:
      properties:
        message:
          default: Permission denied
          title: Message
          type: string
        type:
          const: permission_error
          default: permission_error
          enum:
            - permission_error
          title: Type
          type: string
      required:
        - message
        - type
      title: PermissionError
      type: object
    RateLimitError:
      properties:
        message:
          default: Rate limited
          title: Message
          type: string
        type:
          const: rate_limit_error
          default: rate_limit_error
          enum:
            - rate_limit_error
          title: Type
          type: string
      required:
        - message
        - type
      title: RateLimitError
      type: object

````

# Get a Model

> Get a specific model.

The Models API response can be used to determine information about a specific model or resolve a model alias to a model ID.

## OpenAPI

````yaml get /v1/models/{model_id}
paths:
  path: /v1/models/{model_id}
  method: get
  servers:
    - url: https://api.anthropic.com
  request:
    security: []
    parameters:
      path:
        model_id:
          schema:
            - type: string
              required: true
              title: Model Id
              description: Model identifier or alias.
      query: {}
      header:
        anthropic-version:
          schema:
            - type: string
              required: true
              title: Anthropic-Version
              description: >-
                The version of the Anthropic API you want to use.


                Read more about versioning and our version history
                [here](https://docs.anthropic.com/en/api/versioning).
        x-api-key:
          schema:
            - type: string
              required: true
              title: X-Api-Key
              description: >-
                Your unique API key for authentication.


                This key is required in the header of all API requests, to
                authenticate your account and access Anthropic's services. Get
                your API key through the
                [Console](https://console.anthropic.com/settings/keys). Each key
                is scoped to a Workspace.
        anthropic-beta:
          schema:
            - type: array
              items:
                allOf:
                  - type: string
              required: false
              title: Anthropic-Beta
              description: >-
                Optional header to specify the beta version(s) you want to use.


                To use multiple betas, use a comma separated list like
                `beta1,beta2` or specify the header multiple times for each
                beta.
      cookie: {}
    body: {}
    codeSamples:
      - lang: bash
        source: |-
          curl https://api.anthropic.com/v1/models/claude-sonnet-4-20250514 \
               --header "x-api-key: $ANTHROPIC_API_KEY" \
               --header "anthropic-version: 2023-06-01"
      - lang: python
        source: |-
          import anthropic

          client = anthropic.Anthropic()

          client.models.get("claude-sonnet-4-20250514")
      - lang: javascript
        source: |-
          import Anthropic from '@anthropic-ai/sdk';

          const anthropic = new Anthropic();

          await anthropic.models.get("claude-sonnet-4-20250514");
  response:
    '200':
      application/json:
        schemaArray:
          - type: object
            properties:
              created_at:
                allOf:
                  - type: string
                    format: date-time
                    title: Created At
                    description: >-
                      RFC 3339 datetime string representing the time at which
                      the model was released. May be set to an epoch value if
                      the release date is unknown.
                    examples:
                      - '2025-02-19T00:00:00Z'
              display_name:
                allOf:
                  - type: string
                    title: Display Name
                    description: A human-readable name for the model.
                    examples:
                      - Claude Sonnet 4
              id:
                allOf:
                  - type: string
                    title: Id
                    description: Unique model identifier.
                    examples:
                      - claude-sonnet-4-20250514
              type:
                allOf:
                  - type: string
                    enum:
                      - model
                    const: model
                    title: Type
                    description: |-
                      Object type.

                      For Models, this is always `"model"`.
                    default: model
            title: ModelInfo
            requiredProperties:
              - created_at
              - display_name
              - id
              - type
        examples:
          example:
            value:
              created_at: '2025-02-19T00:00:00Z'
              display_name: Claude Sonnet 4
              id: claude-sonnet-4-20250514
              type: model
        description: Successful Response
    4XX:
      application/json:
        schemaArray:
          - type: object
            properties:
              error:
                allOf:
                  - discriminator:
                      mapping:
                        api_error: '#/components/schemas/APIError'
                        authentication_error: '#/components/schemas/AuthenticationError'
                        billing_error: '#/components/schemas/BillingError'
                        invalid_request_error: '#/components/schemas/InvalidRequestError'
                        not_found_error: '#/components/schemas/NotFoundError'
                        overloaded_error: '#/components/schemas/OverloadedError'
                        permission_error: '#/components/schemas/PermissionError'
                        rate_limit_error: '#/components/schemas/RateLimitError'
                        timeout_error: '#/components/schemas/GatewayTimeoutError'
                      propertyName: type
                    oneOf:
                      - $ref: '#/components/schemas/InvalidRequestError'
                      - $ref: '#/components/schemas/AuthenticationError'
                      - $ref: '#/components/schemas/BillingError'
                      - $ref: '#/components/schemas/PermissionError'
                      - $ref: '#/components/schemas/NotFoundError'
                      - $ref: '#/components/schemas/RateLimitError'
                      - $ref: '#/components/schemas/GatewayTimeoutError'
                      - $ref: '#/components/schemas/APIError'
                      - $ref: '#/components/schemas/OverloadedError'
                    title: Error
              type:
                allOf:
                  - const: error
                    default: error
                    enum:
                      - error
                    title: Type
                    type: string
            title: ErrorResponse
            requiredProperties:
              - error
              - type
        examples:
          example:
            value:
              error:
                message: Invalid request
                type: invalid_request_error
              type: error
        description: >-
          Error response.


          See our [errors
          documentation](https://docs.anthropic.com/en/api/errors) for more
          details.
  deprecated: false
  type: path
components:
  schemas:
    APIError:
      properties:
        message:
          default: Internal server error
          title: Message
          type: string
        type:
          const: api_error
          default: api_error
          enum:
            - api_error
          title: Type
          type: string
      required:
        - message
        - type
      title: APIError
      type: object
    AuthenticationError:
      properties:
        message:
          default: Authentication error
          title: Message
          type: string
        type:
          const: authentication_error
          default: authentication_error
          enum:
            - authentication_error
          title: Type
          type: string
      required:
        - message
        - type
      title: AuthenticationError
      type: object
    BillingError:
      properties:
        message:
          default: Billing error
          title: Message
          type: string
        type:
          const: billing_error
          default: billing_error
          enum:
            - billing_error
          title: Type
          type: string
      required:
        - message
        - type
      title: BillingError
      type: object
    GatewayTimeoutError:
      properties:
        message:
          default: Request timeout
          title: Message
          type: string
        type:
          const: timeout_error
          default: timeout_error
          enum:
            - timeout_error
          title: Type
          type: string
      required:
        - message
        - type
      title: GatewayTimeoutError
      type: object
    InvalidRequestError:
      properties:
        message:
          default: Invalid request
          title: Message
          type: string
        type:
          const: invalid_request_error
          default: invalid_request_error
          enum:
            - invalid_request_error
          title: Type
          type: string
      required:
        - message
        - type
      title: InvalidRequestError
      type: object
    NotFoundError:
      properties:
        message:
          default: Not found
          title: Message
          type: string
        type:
          const: not_found_error
          default: not_found_error
          enum:
            - not_found_error
          title: Type
          type: string
      required:
        - message
        - type
      title: NotFoundError
      type: object
    OverloadedError:
      properties:
        message:
          default: Overloaded
          title: Message
          type: string
        type:
          const: overloaded_error
          default: overloaded_error
          enum:
            - overloaded_error
          title: Type
          type: string
      required:
        - message
        - type
      title: OverloadedError
      type: object
    PermissionError:
      properties:
        message:
          default: Permission denied
          title: Message
          type: string
        type:
          const: permission_error
          default: permission_error
          enum:
            - permission_error
          title: Type
          type: string
      required:
        - message
        - type
      title: PermissionError
      type: object
    RateLimitError:
      properties:
        message:
          default: Rate limited
          title: Message
          type: string
        type:
          const: rate_limit_error
          default: rate_limit_error
          enum:
            - rate_limit_error
          title: Type
          type: string
      required:
        - message
        - type
      title: RateLimitError
      type: object

````

# Get a Model

> Get a specific model.

The Models API response can be used to determine information about a specific model or resolve a model alias to a model ID.

## OpenAPI

````yaml get /v1/models/{model_id}
paths:
  path: /v1/models/{model_id}
  method: get
  servers:
    - url: https://api.anthropic.com
  request:
    security: []
    parameters:
      path:
        model_id:
          schema:
            - type: string
              required: true
              title: Model Id
              description: Model identifier or alias.
      query: {}
      header:
        anthropic-version:
          schema:
            - type: string
              required: true
              title: Anthropic-Version
              description: >-
                The version of the Anthropic API you want to use.


                Read more about versioning and our version history
                [here](https://docs.anthropic.com/en/api/versioning).
        x-api-key:
          schema:
            - type: string
              required: true
              title: X-Api-Key
              description: >-
                Your unique API key for authentication.


                This key is required in the header of all API requests, to
                authenticate your account and access Anthropic's services. Get
                your API key through the
                [Console](https://console.anthropic.com/settings/keys). Each key
                is scoped to a Workspace.
        anthropic-beta:
          schema:
            - type: array
              items:
                allOf:
                  - type: string
              required: false
              title: Anthropic-Beta
              description: >-
                Optional header to specify the beta version(s) you want to use.


                To use multiple betas, use a comma separated list like
                `beta1,beta2` or specify the header multiple times for each
                beta.
      cookie: {}
    body: {}
    codeSamples:
      - lang: bash
        source: |-
          curl https://api.anthropic.com/v1/models/claude-sonnet-4-20250514 \
               --header "x-api-key: $ANTHROPIC_API_KEY" \
               --header "anthropic-version: 2023-06-01"
      - lang: python
        source: |-
          import anthropic

          client = anthropic.Anthropic()

          client.models.get("claude-sonnet-4-20250514")
      - lang: javascript
        source: |-
          import Anthropic from '@anthropic-ai/sdk';

          const anthropic = new Anthropic();

          await anthropic.models.get("claude-sonnet-4-20250514");
  response:
    '200':
      application/json:
        schemaArray:
          - type: object
            properties:
              created_at:
                allOf:
                  - type: string
                    format: date-time
                    title: Created At
                    description: >-
                      RFC 3339 datetime string representing the time at which
                      the model was released. May be set to an epoch value if
                      the release date is unknown.
                    examples:
                      - '2025-02-19T00:00:00Z'
              display_name:
                allOf:
                  - type: string
                    title: Display Name
                    description: A human-readable name for the model.
                    examples:
                      - Claude Sonnet 4
              id:
                allOf:
                  - type: string
                    title: Id
                    description: Unique model identifier.
                    examples:
                      - claude-sonnet-4-20250514
              type:
                allOf:
                  - type: string
                    enum:
                      - model
                    const: model
                    title: Type
                    description: |-
                      Object type.

                      For Models, this is always `"model"`.
                    default: model
            title: ModelInfo
            requiredProperties:
              - created_at
              - display_name
              - id
              - type
        examples:
          example:
            value:
              created_at: '2025-02-19T00:00:00Z'
              display_name: Claude Sonnet 4
              id: claude-sonnet-4-20250514
              type: model
        description: Successful Response
    4XX:
      application/json:
        schemaArray:
          - type: object
            properties:
              error:
                allOf:
                  - discriminator:
                      mapping:
                        api_error: '#/components/schemas/APIError'
                        authentication_error: '#/components/schemas/AuthenticationError'
                        billing_error: '#/components/schemas/BillingError'
                        invalid_request_error: '#/components/schemas/InvalidRequestError'
                        not_found_error: '#/components/schemas/NotFoundError'
                        overloaded_error: '#/components/schemas/OverloadedError'
                        permission_error: '#/components/schemas/PermissionError'
                        rate_limit_error: '#/components/schemas/RateLimitError'
                        timeout_error: '#/components/schemas/GatewayTimeoutError'
                      propertyName: type
                    oneOf:
                      - $ref: '#/components/schemas/InvalidRequestError'
                      - $ref: '#/components/schemas/AuthenticationError'
                      - $ref: '#/components/schemas/BillingError'
                      - $ref: '#/components/schemas/PermissionError'
                      - $ref: '#/components/schemas/NotFoundError'
                      - $ref: '#/components/schemas/RateLimitError'
                      - $ref: '#/components/schemas/GatewayTimeoutError'
                      - $ref: '#/components/schemas/APIError'
                      - $ref: '#/components/schemas/OverloadedError'
                    title: Error
              type:
                allOf:
                  - const: error
                    default: error
                    enum:
                      - error
                    title: Type
                    type: string
            title: ErrorResponse
            requiredProperties:
              - error
              - type
        examples:
          example:
            value:
              error:
                message: Invalid request
                type: invalid_request_error
              type: error
        description: >-
          Error response.


          See our [errors
          documentation](https://docs.anthropic.com/en/api/errors) for more
          details.
  deprecated: false
  type: path
components:
  schemas:
    APIError:
      properties:
        message:
          default: Internal server error
          title: Message
          type: string
        type:
          const: api_error
          default: api_error
          enum:
            - api_error
          title: Type
          type: string
      required:
        - message
        - type
      title: APIError
      type: object
    AuthenticationError:
      properties:
        message:
          default: Authentication error
          title: Message
          type: string
        type:
          const: authentication_error
          default: authentication_error
          enum:
            - authentication_error
          title: Type
          type: string
      required:
        - message
        - type
      title: AuthenticationError
      type: object
    BillingError:
      properties:
        message:
          default: Billing error
          title: Message
          type: string
        type:
          const: billing_error
          default: billing_error
          enum:
            - billing_error
          title: Type
          type: string
      required:
        - message
        - type
      title: BillingError
      type: object
    GatewayTimeoutError:
      properties:
        message:
          default: Request timeout
          title: Message
          type: string
        type:
          const: timeout_error
          default: timeout_error
          enum:
            - timeout_error
          title: Type
          type: string
      required:
        - message
        - type
      title: GatewayTimeoutError
      type: object
    InvalidRequestError:
      properties:
        message:
          default: Invalid request
          title: Message
          type: string
        type:
          const: invalid_request_error
          default: invalid_request_error
          enum:
            - invalid_request_error
          title: Type
          type: string
      required:
        - message
        - type
      title: InvalidRequestError
      type: object
    NotFoundError:
      properties:
        message:
          default: Not found
          title: Message
          type: string
        type:
          const: not_found_error
          default: not_found_error
          enum:
            - not_found_error
          title: Type
          type: string
      required:
        - message
        - type
      title: NotFoundError
      type: object
    OverloadedError:
      properties:
        message:
          default: Overloaded
          title: Message
          type: string
        type:
          const: overloaded_error
          default: overloaded_error
          enum:
            - overloaded_error
          title: Type
          type: string
      required:
        - message
        - type
      title: OverloadedError
      type: object
    PermissionError:
      properties:
        message:
          default: Permission denied
          title: Message
          type: string
        type:
          const: permission_error
          default: permission_error
          enum:
            - permission_error
          title: Type
          type: string
      required:
        - message
        - type
      title: PermissionError
      type: object
    RateLimitError:
      properties:
        message:
          default: Rate limited
          title: Message
          type: string
        type:
          const: rate_limit_error
          default: rate_limit_error
          enum:
            - rate_limit_error
          title: Type
          type: string
      required:
        - message
        - type
      title: RateLimitError
      type: object

````

# Create a File

> Upload a file

## OpenAPI

````yaml POST /v1/files
paths:
  path: /v1/files
  method: post
  servers:
    - url: https://api.anthropic.com
  request:
    security: []
    parameters:
      path: {}
      query: {}
      header:
        anthropic-beta:
          schema:
            - type: array
              items:
                allOf:
                  - type: string
              required: false
              title: Anthropic-Beta
              description: >-
                Optional header to specify the beta version(s) you want to use.


                To use multiple betas, use a comma separated list like
                `beta1,beta2` or specify the header multiple times for each
                beta.
        anthropic-version:
          schema:
            - type: string
              required: true
              title: Anthropic-Version
              description: >-
                The version of the Anthropic API you want to use.


                Read more about versioning and our version history
                [here](https://docs.anthropic.com/en/api/versioning).
        x-api-key:
          schema:
            - type: string
              required: true
              title: X-Api-Key
              description: >-
                Your unique API key for authentication.


                This key is required in the header of all API requests, to
                authenticate your account and access Anthropic's services. Get
                your API key through the
                [Console](https://console.anthropic.com/settings/keys). Each key
                is scoped to a Workspace.
      cookie: {}
    body:
      multipart/form-data:
        schemaArray:
          - type: object
            properties:
              file:
                allOf:
                  - type: string
                    format: binary
                    description: The file to upload
            required: true
            requiredProperties:
              - file
        examples:
          example:
            value: {}
    codeSamples:
      - lang: bash
        source: |-
          curl -X POST "https://api.anthropic.com/v1/files" \
               -H "x-api-key: $ANTHROPIC_API_KEY" \
               -H "anthropic-version: 2023-06-01" \
               -H "anthropic-beta: files-api-2025-04-14" \
               -F "file=@/path/to/document.pdf"
      - lang: python
        source: |-
          import anthropic

          client = anthropic.Anthropic()

          client.beta.files.upload(
              file=("document.pdf", open("/path/to/document.pdf", "rb"), "application/pdf"),
          )
      - lang: javascript
        source: |-
          import Anthropic, { toFile } from '@anthropic-ai/sdk';

          const anthropic = new Anthropic();

          await anthropic.beta.files.upload({
            file: await toFile(fs.createReadStream('/path/to/document.pdf'), undefined, { type: 'application/pdf' }),
            betas: ['files-api-2025-04-14'],
          });
  response:
    '200':
      application/json:
        schemaArray:
          - type: object
            properties:
              created_at:
                allOf:
                  - type: string
                    format: date-time
                    title: Created At
                    description: >-
                      RFC 3339 datetime string representing when the file was
                      created.
              downloadable:
                allOf:
                  - type: boolean
                    title: Downloadable
                    description: Whether the file can be downloaded.
                    default: false
              filename:
                allOf:
                  - type: string
                    maxLength: 500
                    minLength: 1
                    title: Filename
                    description: Original filename of the uploaded file.
              id:
                allOf:
                  - type: string
                    title: Id
                    description: |-
                      Unique object identifier.

                      The format and length of IDs may change over time.
              mime_type:
                allOf:
                  - type: string
                    maxLength: 255
                    minLength: 1
                    title: Mime Type
                    description: MIME type of the file.
              size_bytes:
                allOf:
                  - type: integer
                    minimum: 0
                    title: Size Bytes
                    description: Size of the file in bytes.
              type:
                allOf:
                  - type: string
                    enum:
                      - file
                    const: file
                    title: Type
                    description: |-
                      Object type.

                      For files, this is always `"file"`.
            title: FileMetadataSchema
            requiredProperties:
              - created_at
              - filename
              - id
              - mime_type
              - size_bytes
              - type
        examples:
          example:
            value:
              created_at: '2023-11-07T05:31:56Z'
              downloadable: false
              filename: <string>
              id: <string>
              mime_type: <string>
              size_bytes: 1
              type: file
        description: Successful Response
    4XX:
      application/json:
        schemaArray:
          - type: object
            properties:
              error:
                allOf:
                  - discriminator:
                      mapping:
                        api_error: '#/components/schemas/APIError'
                        authentication_error: '#/components/schemas/AuthenticationError'
                        billing_error: '#/components/schemas/BillingError'
                        invalid_request_error: '#/components/schemas/InvalidRequestError'
                        not_found_error: '#/components/schemas/NotFoundError'
                        overloaded_error: '#/components/schemas/OverloadedError'
                        permission_error: '#/components/schemas/PermissionError'
                        rate_limit_error: '#/components/schemas/RateLimitError'
                        timeout_error: '#/components/schemas/GatewayTimeoutError'
                      propertyName: type
                    oneOf:
                      - $ref: '#/components/schemas/InvalidRequestError'
                      - $ref: '#/components/schemas/AuthenticationError'
                      - $ref: '#/components/schemas/BillingError'
                      - $ref: '#/components/schemas/PermissionError'
                      - $ref: '#/components/schemas/NotFoundError'
                      - $ref: '#/components/schemas/RateLimitError'
                      - $ref: '#/components/schemas/GatewayTimeoutError'
                      - $ref: '#/components/schemas/APIError'
                      - $ref: '#/components/schemas/OverloadedError'
                    title: Error
              type:
                allOf:
                  - const: error
                    default: error
                    enum:
                      - error
                    title: Type
                    type: string
            title: ErrorResponse
            requiredProperties:
              - error
              - type
        examples:
          example:
            value:
              error:
                message: Invalid request
                type: invalid_request_error
              type: error
        description: >-
          Error response.


          See our [errors
          documentation](https://docs.anthropic.com/en/api/errors) for more
          details.
  deprecated: false
  type: path
components:
  schemas:
    APIError:
      properties:
        message:
          default: Internal server error
          title: Message
          type: string
        type:
          const: api_error
          default: api_error
          enum:
            - api_error
          title: Type
          type: string
      required:
        - message
        - type
      title: APIError
      type: object
    AuthenticationError:
      properties:
        message:
          default: Authentication error
          title: Message
          type: string
        type:
          const: authentication_error
          default: authentication_error
          enum:
            - authentication_error
          title: Type
          type: string
      required:
        - message
        - type
      title: AuthenticationError
      type: object
    BillingError:
      properties:
        message:
          default: Billing error
          title: Message
          type: string
        type:
          const: billing_error
          default: billing_error
          enum:
            - billing_error
          title: Type
          type: string
      required:
        - message
        - type
      title: BillingError
      type: object
    GatewayTimeoutError:
      properties:
        message:
          default: Request timeout
          title: Message
          type: string
        type:
          const: timeout_error
          default: timeout_error
          enum:
            - timeout_error
          title: Type
          type: string
      required:
        - message
        - type
      title: GatewayTimeoutError
      type: object
    InvalidRequestError:
      properties:
        message:
          default: Invalid request
          title: Message
          type: string
        type:
          const: invalid_request_error
          default: invalid_request_error
          enum:
            - invalid_request_error
          title: Type
          type: string
      required:
        - message
        - type
      title: InvalidRequestError
      type: object
    NotFoundError:
      properties:
        message:
          default: Not found
          title: Message
          type: string
        type:
          const: not_found_error
          default: not_found_error
          enum:
            - not_found_error
          title: Type
          type: string
      required:
        - message
        - type
      title: NotFoundError
      type: object
    OverloadedError:
      properties:
        message:
          default: Overloaded
          title: Message
          type: string
        type:
          const: overloaded_error
          default: overloaded_error
          enum:
            - overloaded_error
          title: Type
          type: string
      required:
        - message
        - type
      title: OverloadedError
      type: object
    PermissionError:
      properties:
        message:
          default: Permission denied
          title: Message
          type: string
        type:
          const: permission_error
          default: permission_error
          enum:
            - permission_error
          title: Type
          type: string
      required:
        - message
        - type
      title: PermissionError
      type: object
    RateLimitError:
      properties:
        message:
          default: Rate limited
          title: Message
          type: string
        type:
          const: rate_limit_error
          default: rate_limit_error
          enum:
            - rate_limit_error
          title: Type
          type: string
      required:
        - message
        - type
      title: RateLimitError
      type: object

````

# List Files

> List files within a workspace

## OpenAPI

````yaml GET /v1/files
paths:
  path: /v1/files
  method: get
  servers:
    - url: https://api.anthropic.com
  request:
    security: []
    parameters:
      path: {}
      query:
        before_id:
          schema:
            - type: string
              required: false
              title: Before Id
              description: >-
                ID of the object to use as a cursor for pagination. When
                provided, returns the page of results immediately before this
                object.
        after_id:
          schema:
            - type: string
              required: false
              title: After Id
              description: >-
                ID of the object to use as a cursor for pagination. When
                provided, returns the page of results immediately after this
                object.
        limit:
          schema:
            - type: integer
              required: false
              title: Limit
              description: |-
                Number of items to return per page.

                Defaults to `20`. Ranges from `1` to `1000`.
              maximum: 1000
              minimum: 1
              default: 20
      header:
        anthropic-beta:
          schema:
            - type: array
              items:
                allOf:
                  - type: string
              required: false
              title: Anthropic-Beta
              description: >-
                Optional header to specify the beta version(s) you want to use.


                To use multiple betas, use a comma separated list like
                `beta1,beta2` or specify the header multiple times for each
                beta.
        anthropic-version:
          schema:
            - type: string
              required: true
              title: Anthropic-Version
              description: >-
                The version of the Anthropic API you want to use.


                Read more about versioning and our version history
                [here](https://docs.anthropic.com/en/api/versioning).
        x-api-key:
          schema:
            - type: string
              required: true
              title: X-Api-Key
              description: >-
                Your unique API key for authentication.


                This key is required in the header of all API requests, to
                authenticate your account and access Anthropic's services. Get
                your API key through the
                [Console](https://console.anthropic.com/settings/keys). Each key
                is scoped to a Workspace.
      cookie: {}
    body: {}
    codeSamples:
      - lang: bash
        source: |-
          curl "https://api.anthropic.com/v1/files" \
               -H "x-api-key: $ANTHROPIC_API_KEY" \
               -H "anthropic-version: 2023-06-01" \
               -H "anthropic-beta: files-api-2025-04-14"
      - lang: python
        source: |-
          import anthropic

          client = anthropic.Anthropic()

          client.beta.files.list()
      - lang: javascript
        source: |-
          import Anthropic from '@anthropic-ai/sdk';

          const anthropic = new Anthropic();

          await anthropic.beta.files.list({
            betas: ['files-api-2025-04-14'],
          });
  response:
    '200':
      application/json:
        schemaArray:
          - type: object
            properties:
              data:
                allOf:
                  - items:
                      $ref: '#/components/schemas/FileMetadataSchema'
                    type: array
                    title: Data
                    description: List of file metadata objects.
              first_id:
                allOf:
                  - anyOf:
                      - type: string
                      - type: 'null'
                    title: First Id
                    description: ID of the first file in this page of results.
              has_more:
                allOf:
                  - type: boolean
                    title: Has More
                    description: Whether there are more results available.
                    default: false
              last_id:
                allOf:
                  - anyOf:
                      - type: string
                      - type: 'null'
                    title: Last Id
                    description: ID of the last file in this page of results.
            title: FileListResponse
            requiredProperties:
              - data
        examples:
          example:
            value:
              data:
                - created_at: '2023-11-07T05:31:56Z'
                  downloadable: false
                  filename: <string>
                  id: <string>
                  mime_type: <string>
                  size_bytes: 1
                  type: file
              first_id: <string>
              has_more: false
              last_id: <string>
        description: Successful Response
    4XX:
      application/json:
        schemaArray:
          - type: object
            properties:
              error:
                allOf:
                  - discriminator:
                      mapping:
                        api_error: '#/components/schemas/APIError'
                        authentication_error: '#/components/schemas/AuthenticationError'
                        billing_error: '#/components/schemas/BillingError'
                        invalid_request_error: '#/components/schemas/InvalidRequestError'
                        not_found_error: '#/components/schemas/NotFoundError'
                        overloaded_error: '#/components/schemas/OverloadedError'
                        permission_error: '#/components/schemas/PermissionError'
                        rate_limit_error: '#/components/schemas/RateLimitError'
                        timeout_error: '#/components/schemas/GatewayTimeoutError'
                      propertyName: type
                    oneOf:
                      - $ref: '#/components/schemas/InvalidRequestError'
                      - $ref: '#/components/schemas/AuthenticationError'
                      - $ref: '#/components/schemas/BillingError'
                      - $ref: '#/components/schemas/PermissionError'
                      - $ref: '#/components/schemas/NotFoundError'
                      - $ref: '#/components/schemas/RateLimitError'
                      - $ref: '#/components/schemas/GatewayTimeoutError'
                      - $ref: '#/components/schemas/APIError'
                      - $ref: '#/components/schemas/OverloadedError'
                    title: Error
              type:
                allOf:
                  - const: error
                    default: error
                    enum:
                      - error
                    title: Type
                    type: string
            title: ErrorResponse
            requiredProperties:
              - error
              - type
        examples:
          example:
            value:
              error:
                message: Invalid request
                type: invalid_request_error
              type: error
        description: >-
          Error response.


          See our [errors
          documentation](https://docs.anthropic.com/en/api/errors) for more
          details.
  deprecated: false
  type: path
components:
  schemas:
    APIError:
      properties:
        message:
          default: Internal server error
          title: Message
          type: string
        type:
          const: api_error
          default: api_error
          enum:
            - api_error
          title: Type
          type: string
      required:
        - message
        - type
      title: APIError
      type: object
    AuthenticationError:
      properties:
        message:
          default: Authentication error
          title: Message
          type: string
        type:
          const: authentication_error
          default: authentication_error
          enum:
            - authentication_error
          title: Type
          type: string
      required:
        - message
        - type
      title: AuthenticationError
      type: object
    BillingError:
      properties:
        message:
          default: Billing error
          title: Message
          type: string
        type:
          const: billing_error
          default: billing_error
          enum:
            - billing_error
          title: Type
          type: string
      required:
        - message
        - type
      title: BillingError
      type: object
    FileMetadataSchema:
      properties:
        created_at:
          type: string
          format: date-time
          title: Created At
          description: RFC 3339 datetime string representing when the file was created.
        downloadable:
          type: boolean
          title: Downloadable
          description: Whether the file can be downloaded.
          default: false
        filename:
          type: string
          maxLength: 500
          minLength: 1
          title: Filename
          description: Original filename of the uploaded file.
        id:
          type: string
          title: Id
          description: |-
            Unique object identifier.

            The format and length of IDs may change over time.
        mime_type:
          type: string
          maxLength: 255
          minLength: 1
          title: Mime Type
          description: MIME type of the file.
        size_bytes:
          type: integer
          minimum: 0
          title: Size Bytes
          description: Size of the file in bytes.
        type:
          type: string
          enum:
            - file
          const: file
          title: Type
          description: |-
            Object type.

            For files, this is always `"file"`.
      type: object
      required:
        - created_at
        - filename
        - id
        - mime_type
        - size_bytes
        - type
      title: FileMetadataSchema
    GatewayTimeoutError:
      properties:
        message:
          default: Request timeout
          title: Message
          type: string
        type:
          const: timeout_error
          default: timeout_error
          enum:
            - timeout_error
          title: Type
          type: string
      required:
        - message
        - type
      title: GatewayTimeoutError
      type: object
    InvalidRequestError:
      properties:
        message:
          default: Invalid request
          title: Message
          type: string
        type:
          const: invalid_request_error
          default: invalid_request_error
          enum:
            - invalid_request_error
          title: Type
          type: string
      required:
        - message
        - type
      title: InvalidRequestError
      type: object
    NotFoundError:
      properties:
        message:
          default: Not found
          title: Message
          type: string
        type:
          const: not_found_error
          default: not_found_error
          enum:
            - not_found_error
          title: Type
          type: string
      required:
        - message
        - type
      title: NotFoundError
      type: object
    OverloadedError:
      properties:
        message:
          default: Overloaded
          title: Message
          type: string
        type:
          const: overloaded_error
          default: overloaded_error
          enum:
            - overloaded_error
          title: Type
          type: string
      required:
        - message
        - type
      title: OverloadedError
      type: object
    PermissionError:
      properties:
        message:
          default: Permission denied
          title: Message
          type: string
        type:
          const: permission_error
          default: permission_error
          enum:
            - permission_error
          title: Type
          type: string
      required:
        - message
        - type
      title: PermissionError
      type: object
    RateLimitError:
      properties:
        message:
          default: Rate limited
          title: Message
          type: string
        type:
          const: rate_limit_error
          default: rate_limit_error
          enum:
            - rate_limit_error
          title: Type
          type: string
      required:
        - message
        - type
      title: RateLimitError
      type: object

````

# List Files

> List files within a workspace

## OpenAPI

````yaml GET /v1/files
paths:
  path: /v1/files
  method: get
  servers:
    - url: https://api.anthropic.com
  request:
    security: []
    parameters:
      path: {}
      query:
        before_id:
          schema:
            - type: string
              required: false
              title: Before Id
              description: >-
                ID of the object to use as a cursor for pagination. When
                provided, returns the page of results immediately before this
                object.
        after_id:
          schema:
            - type: string
              required: false
              title: After Id
              description: >-
                ID of the object to use as a cursor for pagination. When
                provided, returns the page of results immediately after this
                object.
        limit:
          schema:
            - type: integer
              required: false
              title: Limit
              description: |-
                Number of items to return per page.

                Defaults to `20`. Ranges from `1` to `1000`.
              maximum: 1000
              minimum: 1
              default: 20
      header:
        anthropic-beta:
          schema:
            - type: array
              items:
                allOf:
                  - type: string
              required: false
              title: Anthropic-Beta
              description: >-
                Optional header to specify the beta version(s) you want to use.


                To use multiple betas, use a comma separated list like
                `beta1,beta2` or specify the header multiple times for each
                beta.
        anthropic-version:
          schema:
            - type: string
              required: true
              title: Anthropic-Version
              description: >-
                The version of the Anthropic API you want to use.


                Read more about versioning and our version history
                [here](https://docs.anthropic.com/en/api/versioning).
        x-api-key:
          schema:
            - type: string
              required: true
              title: X-Api-Key
              description: >-
                Your unique API key for authentication.


                This key is required in the header of all API requests, to
                authenticate your account and access Anthropic's services. Get
                your API key through the
                [Console](https://console.anthropic.com/settings/keys). Each key
                is scoped to a Workspace.
      cookie: {}
    body: {}
    codeSamples:
      - lang: bash
        source: |-
          curl "https://api.anthropic.com/v1/files" \
               -H "x-api-key: $ANTHROPIC_API_KEY" \
               -H "anthropic-version: 2023-06-01" \
               -H "anthropic-beta: files-api-2025-04-14"
      - lang: python
        source: |-
          import anthropic

          client = anthropic.Anthropic()

          client.beta.files.list()
      - lang: javascript
        source: |-
          import Anthropic from '@anthropic-ai/sdk';

          const anthropic = new Anthropic();

          await anthropic.beta.files.list({
            betas: ['files-api-2025-04-14'],
          });
  response:
    '200':
      application/json:
        schemaArray:
          - type: object
            properties:
              data:
                allOf:
                  - items:
                      $ref: '#/components/schemas/FileMetadataSchema'
                    type: array
                    title: Data
                    description: List of file metadata objects.
              first_id:
                allOf:
                  - anyOf:
                      - type: string
                      - type: 'null'
                    title: First Id
                    description: ID of the first file in this page of results.
              has_more:
                allOf:
                  - type: boolean
                    title: Has More
                    description: Whether there are more results available.
                    default: false
              last_id:
                allOf:
                  - anyOf:
                      - type: string
                      - type: 'null'
                    title: Last Id
                    description: ID of the last file in this page of results.
            title: FileListResponse
            requiredProperties:
              - data
        examples:
          example:
            value:
              data:
                - created_at: '2023-11-07T05:31:56Z'
                  downloadable: false
                  filename: <string>
                  id: <string>
                  mime_type: <string>
                  size_bytes: 1
                  type: file
              first_id: <string>
              has_more: false
              last_id: <string>
        description: Successful Response
    4XX:
      application/json:
        schemaArray:
          - type: object
            properties:
              error:
                allOf:
                  - discriminator:
                      mapping:
                        api_error: '#/components/schemas/APIError'
                        authentication_error: '#/components/schemas/AuthenticationError'
                        billing_error: '#/components/schemas/BillingError'
                        invalid_request_error: '#/components/schemas/InvalidRequestError'
                        not_found_error: '#/components/schemas/NotFoundError'
                        overloaded_error: '#/components/schemas/OverloadedError'
                        permission_error: '#/components/schemas/PermissionError'
                        rate_limit_error: '#/components/schemas/RateLimitError'
                        timeout_error: '#/components/schemas/GatewayTimeoutError'
                      propertyName: type
                    oneOf:
                      - $ref: '#/components/schemas/InvalidRequestError'
                      - $ref: '#/components/schemas/AuthenticationError'
                      - $ref: '#/components/schemas/BillingError'
                      - $ref: '#/components/schemas/PermissionError'
                      - $ref: '#/components/schemas/NotFoundError'
                      - $ref: '#/components/schemas/RateLimitError'
                      - $ref: '#/components/schemas/GatewayTimeoutError'
                      - $ref: '#/components/schemas/APIError'
                      - $ref: '#/components/schemas/OverloadedError'
                    title: Error
              type:
                allOf:
                  - const: error
                    default: error
                    enum:
                      - error
                    title: Type
                    type: string
            title: ErrorResponse
            requiredProperties:
              - error
              - type
        examples:
          example:
            value:
              error:
                message: Invalid request
                type: invalid_request_error
              type: error
        description: >-
          Error response.


          See our [errors
          documentation](https://docs.anthropic.com/en/api/errors) for more
          details.
  deprecated: false
  type: path
components:
  schemas:
    APIError:
      properties:
        message:
          default: Internal server error
          title: Message
          type: string
        type:
          const: api_error
          default: api_error
          enum:
            - api_error
          title: Type
          type: string
      required:
        - message
        - type
      title: APIError
      type: object
    AuthenticationError:
      properties:
        message:
          default: Authentication error
          title: Message
          type: string
        type:
          const: authentication_error
          default: authentication_error
          enum:
            - authentication_error
          title: Type
          type: string
      required:
        - message
        - type
      title: AuthenticationError
      type: object
    BillingError:
      properties:
        message:
          default: Billing error
          title: Message
          type: string
        type:
          const: billing_error
          default: billing_error
          enum:
            - billing_error
          title: Type
          type: string
      required:
        - message
        - type
      title: BillingError
      type: object
    FileMetadataSchema:
      properties:
        created_at:
          type: string
          format: date-time
          title: Created At
          description: RFC 3339 datetime string representing when the file was created.
        downloadable:
          type: boolean
          title: Downloadable
          description: Whether the file can be downloaded.
          default: false
        filename:
          type: string
          maxLength: 500
          minLength: 1
          title: Filename
          description: Original filename of the uploaded file.
        id:
          type: string
          title: Id
          description: |-
            Unique object identifier.

            The format and length of IDs may change over time.
        mime_type:
          type: string
          maxLength: 255
          minLength: 1
          title: Mime Type
          description: MIME type of the file.
        size_bytes:
          type: integer
          minimum: 0
          title: Size Bytes
          description: Size of the file in bytes.
        type:
          type: string
          enum:
            - file
          const: file
          title: Type
          description: |-
            Object type.

            For files, this is always `"file"`.
      type: object
      required:
        - created_at
        - filename
        - id
        - mime_type
        - size_bytes
        - type
      title: FileMetadataSchema
    GatewayTimeoutError:
      properties:
        message:
          default: Request timeout
          title: Message
          type: string
        type:
          const: timeout_error
          default: timeout_error
          enum:
            - timeout_error
          title: Type
          type: string
      required:
        - message
        - type
      title: GatewayTimeoutError
      type: object
    InvalidRequestError:
      properties:
        message:
          default: Invalid request
          title: Message
          type: string
        type:
          const: invalid_request_error
          default: invalid_request_error
          enum:
            - invalid_request_error
          title: Type
          type: string
      required:
        - message
        - type
      title: InvalidRequestError
      type: object
    NotFoundError:
      properties:
        message:
          default: Not found
          title: Message
          type: string
        type:
          const: not_found_error
          default: not_found_error
          enum:
            - not_found_error
          title: Type
          type: string
      required:
        - message
        - type
      title: NotFoundError
      type: object
    OverloadedError:
      properties:
        message:
          default: Overloaded
          title: Message
          type: string
        type:
          const: overloaded_error
          default: overloaded_error
          enum:
            - overloaded_error
          title: Type
          type: string
      required:
        - message
        - type
      title: OverloadedError
      type: object
    PermissionError:
      properties:
        message:
          default: Permission denied
          title: Message
          type: string
        type:
          const: permission_error
          default: permission_error
          enum:
            - permission_error
          title: Type
          type: string
      required:
        - message
        - type
      title: PermissionError
      type: object
    RateLimitError:
      properties:
        message:
          default: Rate limited
          title: Message
          type: string
        type:
          const: rate_limit_error
          default: rate_limit_error
          enum:
            - rate_limit_error
          title: Type
          type: string
      required:
        - message
        - type
      title: RateLimitError
      type: object

````

# List Files

> List files within a workspace

## OpenAPI

````yaml GET /v1/files
paths:
  path: /v1/files
  method: get
  servers:
    - url: https://api.anthropic.com
  request:
    security: []
    parameters:
      path: {}
      query:
        before_id:
          schema:
            - type: string
              required: false
              title: Before Id
              description: >-
                ID of the object to use as a cursor for pagination. When
                provided, returns the page of results immediately before this
                object.
        after_id:
          schema:
            - type: string
              required: false
              title: After Id
              description: >-
                ID of the object to use as a cursor for pagination. When
                provided, returns the page of results immediately after this
                object.
        limit:
          schema:
            - type: integer
              required: false
              title: Limit
              description: |-
                Number of items to return per page.

                Defaults to `20`. Ranges from `1` to `1000`.
              maximum: 1000
              minimum: 1
              default: 20
      header:
        anthropic-beta:
          schema:
            - type: array
              items:
                allOf:
                  - type: string
              required: false
              title: Anthropic-Beta
              description: >-
                Optional header to specify the beta version(s) you want to use.


                To use multiple betas, use a comma separated list like
                `beta1,beta2` or specify the header multiple times for each
                beta.
        anthropic-version:
          schema:
            - type: string
              required: true
              title: Anthropic-Version
              description: >-
                The version of the Anthropic API you want to use.


                Read more about versioning and our version history
                [here](https://docs.anthropic.com/en/api/versioning).
        x-api-key:
          schema:
            - type: string
              required: true
              title: X-Api-Key
              description: >-
                Your unique API key for authentication.


                This key is required in the header of all API requests, to
                authenticate your account and access Anthropic's services. Get
                your API key through the
                [Console](https://console.anthropic.com/settings/keys). Each key
                is scoped to a Workspace.
      cookie: {}
    body: {}
    codeSamples:
      - lang: bash
        source: |-
          curl "https://api.anthropic.com/v1/files" \
               -H "x-api-key: $ANTHROPIC_API_KEY" \
               -H "anthropic-version: 2023-06-01" \
               -H "anthropic-beta: files-api-2025-04-14"
      - lang: python
        source: |-
          import anthropic

          client = anthropic.Anthropic()

          client.beta.files.list()
      - lang: javascript
        source: |-
          import Anthropic from '@anthropic-ai/sdk';

          const anthropic = new Anthropic();

          await anthropic.beta.files.list({
            betas: ['files-api-2025-04-14'],
          });
  response:
    '200':
      application/json:
        schemaArray:
          - type: object
            properties:
              data:
                allOf:
                  - items:
                      $ref: '#/components/schemas/FileMetadataSchema'
                    type: array
                    title: Data
                    description: List of file metadata objects.
              first_id:
                allOf:
                  - anyOf:
                      - type: string
                      - type: 'null'
                    title: First Id
                    description: ID of the first file in this page of results.
              has_more:
                allOf:
                  - type: boolean
                    title: Has More
                    description: Whether there are more results available.
                    default: false
              last_id:
                allOf:
                  - anyOf:
                      - type: string
                      - type: 'null'
                    title: Last Id
                    description: ID of the last file in this page of results.
            title: FileListResponse
            requiredProperties:
              - data
        examples:
          example:
            value:
              data:
                - created_at: '2023-11-07T05:31:56Z'
                  downloadable: false
                  filename: <string>
                  id: <string>
                  mime_type: <string>
                  size_bytes: 1
                  type: file
              first_id: <string>
              has_more: false
              last_id: <string>
        description: Successful Response
    4XX:
      application/json:
        schemaArray:
          - type: object
            properties:
              error:
                allOf:
                  - discriminator:
                      mapping:
                        api_error: '#/components/schemas/APIError'
                        authentication_error: '#/components/schemas/AuthenticationError'
                        billing_error: '#/components/schemas/BillingError'
                        invalid_request_error: '#/components/schemas/InvalidRequestError'
                        not_found_error: '#/components/schemas/NotFoundError'
                        overloaded_error: '#/components/schemas/OverloadedError'
                        permission_error: '#/components/schemas/PermissionError'
                        rate_limit_error: '#/components/schemas/RateLimitError'
                        timeout_error: '#/components/schemas/GatewayTimeoutError'
                      propertyName: type
                    oneOf:
                      - $ref: '#/components/schemas/InvalidRequestError'
                      - $ref: '#/components/schemas/AuthenticationError'
                      - $ref: '#/components/schemas/BillingError'
                      - $ref: '#/components/schemas/PermissionError'
                      - $ref: '#/components/schemas/NotFoundError'
                      - $ref: '#/components/schemas/RateLimitError'
                      - $ref: '#/components/schemas/GatewayTimeoutError'
                      - $ref: '#/components/schemas/APIError'
                      - $ref: '#/components/schemas/OverloadedError'
                    title: Error
              type:
                allOf:
                  - const: error
                    default: error
                    enum:
                      - error
                    title: Type
                    type: string
            title: ErrorResponse
            requiredProperties:
              - error
              - type
        examples:
          example:
            value:
              error:
                message: Invalid request
                type: invalid_request_error
              type: error
        description: >-
          Error response.


          See our [errors
          documentation](https://docs.anthropic.com/en/api/errors) for more
          details.
  deprecated: false
  type: path
components:
  schemas:
    APIError:
      properties:
        message:
          default: Internal server error
          title: Message
          type: string
        type:
          const: api_error
          default: api_error
          enum:
            - api_error
          title: Type
          type: string
      required:
        - message
        - type
      title: APIError
      type: object
    AuthenticationError:
      properties:
        message:
          default: Authentication error
          title: Message
          type: string
        type:
          const: authentication_error
          default: authentication_error
          enum:
            - authentication_error
          title: Type
          type: string
      required:
        - message
        - type
      title: AuthenticationError
      type: object
    BillingError:
      properties:
        message:
          default: Billing error
          title: Message
          type: string
        type:
          const: billing_error
          default: billing_error
          enum:
            - billing_error
          title: Type
          type: string
      required:
        - message
        - type
      title: BillingError
      type: object
    FileMetadataSchema:
      properties:
        created_at:
          type: string
          format: date-time
          title: Created At
          description: RFC 3339 datetime string representing when the file was created.
        downloadable:
          type: boolean
          title: Downloadable
          description: Whether the file can be downloaded.
          default: false
        filename:
          type: string
          maxLength: 500
          minLength: 1
          title: Filename
          description: Original filename of the uploaded file.
        id:
          type: string
          title: Id
          description: |-
            Unique object identifier.

            The format and length of IDs may change over time.
        mime_type:
          type: string
          maxLength: 255
          minLength: 1
          title: Mime Type
          description: MIME type of the file.
        size_bytes:
          type: integer
          minimum: 0
          title: Size Bytes
          description: Size of the file in bytes.
        type:
          type: string
          enum:
            - file
          const: file
          title: Type
          description: |-
            Object type.

            For files, this is always `"file"`.
      type: object
      required:
        - created_at
        - filename
        - id
        - mime_type
        - size_bytes
        - type
      title: FileMetadataSchema
    GatewayTimeoutError:
      properties:
        message:
          default: Request timeout
          title: Message
          type: string
        type:
          const: timeout_error
          default: timeout_error
          enum:
            - timeout_error
          title: Type
          type: string
      required:
        - message
        - type
      title: GatewayTimeoutError
      type: object
    InvalidRequestError:
      properties:
        message:
          default: Invalid request
          title: Message
          type: string
        type:
          const: invalid_request_error
          default: invalid_request_error
          enum:
            - invalid_request_error
          title: Type
          type: string
      required:
        - message
        - type
      title: InvalidRequestError
      type: object
    NotFoundError:
      properties:
        message:
          default: Not found
          title: Message
          type: string
        type:
          const: not_found_error
          default: not_found_error
          enum:
            - not_found_error
          title: Type
          type: string
      required:
        - message
        - type
      title: NotFoundError
      type: object
    OverloadedError:
      properties:
        message:
          default: Overloaded
          title: Message
          type: string
        type:
          const: overloaded_error
          default: overloaded_error
          enum:
            - overloaded_error
          title: Type
          type: string
      required:
        - message
        - type
      title: OverloadedError
      type: object
    PermissionError:
      properties:
        message:
          default: Permission denied
          title: Message
          type: string
        type:
          const: permission_error
          default: permission_error
          enum:
            - permission_error
          title: Type
          type: string
      required:
        - message
        - type
      title: PermissionError
      type: object
    RateLimitError:
      properties:
        message:
          default: Rate limited
          title: Message
          type: string
        type:
          const: rate_limit_error
          default: rate_limit_error
          enum:
            - rate_limit_error
          title: Type
          type: string
      required:
        - message
        - type
      title: RateLimitError
      type: object

````

# List Files

> List files within a workspace

## OpenAPI

````yaml GET /v1/files
paths:
  path: /v1/files
  method: get
  servers:
    - url: https://api.anthropic.com
  request:
    security: []
    parameters:
      path: {}
      query:
        before_id:
          schema:
            - type: string
              required: false
              title: Before Id
              description: >-
                ID of the object to use as a cursor for pagination. When
                provided, returns the page of results immediately before this
                object.
        after_id:
          schema:
            - type: string
              required: false
              title: After Id
              description: >-
                ID of the object to use as a cursor for pagination. When
                provided, returns the page of results immediately after this
                object.
        limit:
          schema:
            - type: integer
              required: false
              title: Limit
              description: |-
                Number of items to return per page.

                Defaults to `20`. Ranges from `1` to `1000`.
              maximum: 1000
              minimum: 1
              default: 20
      header:
        anthropic-beta:
          schema:
            - type: array
              items:
                allOf:
                  - type: string
              required: false
              title: Anthropic-Beta
              description: >-
                Optional header to specify the beta version(s) you want to use.


                To use multiple betas, use a comma separated list like
                `beta1,beta2` or specify the header multiple times for each
                beta.
        anthropic-version:
          schema:
            - type: string
              required: true
              title: Anthropic-Version
              description: >-
                The version of the Anthropic API you want to use.


                Read more about versioning and our version history
                [here](https://docs.anthropic.com/en/api/versioning).
        x-api-key:
          schema:
            - type: string
              required: true
              title: X-Api-Key
              description: >-
                Your unique API key for authentication.


                This key is required in the header of all API requests, to
                authenticate your account and access Anthropic's services. Get
                your API key through the
                [Console](https://console.anthropic.com/settings/keys). Each key
                is scoped to a Workspace.
      cookie: {}
    body: {}
    codeSamples:
      - lang: bash
        source: |-
          curl "https://api.anthropic.com/v1/files" \
               -H "x-api-key: $ANTHROPIC_API_KEY" \
               -H "anthropic-version: 2023-06-01" \
               -H "anthropic-beta: files-api-2025-04-14"
      - lang: python
        source: |-
          import anthropic

          client = anthropic.Anthropic()

          client.beta.files.list()
      - lang: javascript
        source: |-
          import Anthropic from '@anthropic-ai/sdk';

          const anthropic = new Anthropic();

          await anthropic.beta.files.list({
            betas: ['files-api-2025-04-14'],
          });
  response:
    '200':
      application/json:
        schemaArray:
          - type: object
            properties:
              data:
                allOf:
                  - items:
                      $ref: '#/components/schemas/FileMetadataSchema'
                    type: array
                    title: Data
                    description: List of file metadata objects.
              first_id:
                allOf:
                  - anyOf:
                      - type: string
                      - type: 'null'
                    title: First Id
                    description: ID of the first file in this page of results.
              has_more:
                allOf:
                  - type: boolean
                    title: Has More
                    description: Whether there are more results available.
                    default: false
              last_id:
                allOf:
                  - anyOf:
                      - type: string
                      - type: 'null'
                    title: Last Id
                    description: ID of the last file in this page of results.
            title: FileListResponse
            requiredProperties:
              - data
        examples:
          example:
            value:
              data:
                - created_at: '2023-11-07T05:31:56Z'
                  downloadable: false
                  filename: <string>
                  id: <string>
                  mime_type: <string>
                  size_bytes: 1
                  type: file
              first_id: <string>
              has_more: false
              last_id: <string>
        description: Successful Response
    4XX:
      application/json:
        schemaArray:
          - type: object
            properties:
              error:
                allOf:
                  - discriminator:
                      mapping:
                        api_error: '#/components/schemas/APIError'
                        authentication_error: '#/components/schemas/AuthenticationError'
                        billing_error: '#/components/schemas/BillingError'
                        invalid_request_error: '#/components/schemas/InvalidRequestError'
                        not_found_error: '#/components/schemas/NotFoundError'
                        overloaded_error: '#/components/schemas/OverloadedError'
                        permission_error: '#/components/schemas/PermissionError'
                        rate_limit_error: '#/components/schemas/RateLimitError'
                        timeout_error: '#/components/schemas/GatewayTimeoutError'
                      propertyName: type
                    oneOf:
                      - $ref: '#/components/schemas/InvalidRequestError'
                      - $ref: '#/components/schemas/AuthenticationError'
                      - $ref: '#/components/schemas/BillingError'
                      - $ref: '#/components/schemas/PermissionError'
                      - $ref: '#/components/schemas/NotFoundError'
                      - $ref: '#/components/schemas/RateLimitError'
                      - $ref: '#/components/schemas/GatewayTimeoutError'
                      - $ref: '#/components/schemas/APIError'
                      - $ref: '#/components/schemas/OverloadedError'
                    title: Error
              type:
                allOf:
                  - const: error
                    default: error
                    enum:
                      - error
                    title: Type
                    type: string
            title: ErrorResponse
            requiredProperties:
              - error
              - type
        examples:
          example:
            value:
              error:
                message: Invalid request
                type: invalid_request_error
              type: error
        description: >-
          Error response.


          See our [errors
          documentation](https://docs.anthropic.com/en/api/errors) for more
          details.
  deprecated: false
  type: path
components:
  schemas:
    APIError:
      properties:
        message:
          default: Internal server error
          title: Message
          type: string
        type:
          const: api_error
          default: api_error
          enum:
            - api_error
          title: Type
          type: string
      required:
        - message
        - type
      title: APIError
      type: object
    AuthenticationError:
      properties:
        message:
          default: Authentication error
          title: Message
          type: string
        type:
          const: authentication_error
          default: authentication_error
          enum:
            - authentication_error
          title: Type
          type: string
      required:
        - message
        - type
      title: AuthenticationError
      type: object
    BillingError:
      properties:
        message:
          default: Billing error
          title: Message
          type: string
        type:
          const: billing_error
          default: billing_error
          enum:
            - billing_error
          title: Type
          type: string
      required:
        - message
        - type
      title: BillingError
      type: object
    FileMetadataSchema:
      properties:
        created_at:
          type: string
          format: date-time
          title: Created At
          description: RFC 3339 datetime string representing when the file was created.
        downloadable:
          type: boolean
          title: Downloadable
          description: Whether the file can be downloaded.
          default: false
        filename:
          type: string
          maxLength: 500
          minLength: 1
          title: Filename
          description: Original filename of the uploaded file.
        id:
          type: string
          title: Id
          description: |-
            Unique object identifier.

            The format and length of IDs may change over time.
        mime_type:
          type: string
          maxLength: 255
          minLength: 1
          title: Mime Type
          description: MIME type of the file.
        size_bytes:
          type: integer
          minimum: 0
          title: Size Bytes
          description: Size of the file in bytes.
        type:
          type: string
          enum:
            - file
          const: file
          title: Type
          description: |-
            Object type.

            For files, this is always `"file"`.
      type: object
      required:
        - created_at
        - filename
        - id
        - mime_type
        - size_bytes
        - type
      title: FileMetadataSchema
    GatewayTimeoutError:
      properties:
        message:
          default: Request timeout
          title: Message
          type: string
        type:
          const: timeout_error
          default: timeout_error
          enum:
            - timeout_error
          title: Type
          type: string
      required:
        - message
        - type
      title: GatewayTimeoutError
      type: object
    InvalidRequestError:
      properties:
        message:
          default: Invalid request
          title: Message
          type: string
        type:
          const: invalid_request_error
          default: invalid_request_error
          enum:
            - invalid_request_error
          title: Type
          type: string
      required:
        - message
        - type
      title: InvalidRequestError
      type: object
    NotFoundError:
      properties:
        message:
          default: Not found
          title: Message
          type: string
        type:
          const: not_found_error
          default: not_found_error
          enum:
            - not_found_error
          title: Type
          type: string
      required:
        - message
        - type
      title: NotFoundError
      type: object
    OverloadedError:
      properties:
        message:
          default: Overloaded
          title: Message
          type: string
        type:
          const: overloaded_error
          default: overloaded_error
          enum:
            - overloaded_error
          title: Type
          type: string
      required:
        - message
        - type
      title: OverloadedError
      type: object
    PermissionError:
      properties:
        message:
          default: Permission denied
          title: Message
          type: string
        type:
          const: permission_error
          default: permission_error
          enum:
            - permission_error
          title: Type
          type: string
      required:
        - message
        - type
      title: PermissionError
      type: object
    RateLimitError:
      properties:
        message:
          default: Rate limited
          title: Message
          type: string
        type:
          const: rate_limit_error
          default: rate_limit_error
          enum:
            - rate_limit_error
          title: Type
          type: string
      required:
        - message
        - type
      title: RateLimitError
      type: object

````

# Generate a prompt

> Generate a well-written prompt

## OpenAPI

````yaml post /v1/experimental/generate_prompt
paths:
  path: /v1/experimental/generate_prompt
  method: post
  servers:
    - url: https://api.anthropic.com
  request:
    security: []
    parameters:
      path: {}
      query: {}
      header:
        anthropic-beta:
          schema:
            - type: array
              items:
                allOf:
                  - type: string
              required: false
              title: Anthropic-Beta
              description: >-
                Optional header to specify the beta version(s) you want to use.


                To use multiple betas, use a comma separated list like
                `beta1,beta2` or specify the header multiple times for each
                beta.
        x-api-key:
          schema:
            - type: string
              required: true
              title: X-Api-Key
              description: >-
                Your unique API key for authentication.


                This key is required in the header of all API requests, to
                authenticate your account and access Anthropic's services. Get
                your API key through the
                [Console](https://console.anthropic.com/settings/keys). Each key
                is scoped to a Workspace.
      cookie: {}
    body:
      application/json:
        schemaArray:
          - type: object
            properties:
              target_model:
                allOf:
                  - anyOf:
                      - maxLength: 256
                        minLength: 1
                        type: string
                      - type: 'null'
                    default: ''
                    description: >-
                      The model this prompt will be used for. This optional
                      parameter helps us understand which models our prompt
                      tools are being used with, but it doesn't currently affect
                      functionality.


                      Example:

                      ```

                      "claude-3-7-sonnet-20250219"

                      ```
                    examples:
                      - claude-3-7-sonnet-20250219
                    title: Target Model
              task:
                allOf:
                  - description: >-
                      Description of the prompt's purpose.


                      The `task` parameter tells Claude what the prompt should
                      do or what kind of role or functionality you want to
                      create. This helps guide the prompt generation process
                      toward your intended use case.


                      Example:

                      ```json

                      {"task": "a chef for a meal prep planning service"}

                      ```
                    examples:
                      - a chef for a meal prep planning service
                    title: Task
                    type: string
            required: true
            title: GeneratePromptParams
            requiredProperties:
              - task
        examples:
          example:
            value:
              target_model: claude-3-7-sonnet-20250219
              task: a chef for a meal prep planning service
    codeSamples:
      - lang: bash
        source: >-
          curl -X POST https://api.anthropic.com/v1/experimental/generate_prompt
          \
               --header "x-api-key: $ANTHROPIC_API_KEY" \
               --header "anthropic-version: 2023-06-01" \
               --header "anthropic-beta: prompt-tools-2025-04-02" \
               --header "content-type: application/json" \
               --data \
          '{
              "task": "a chef for a meal prep planning service",
              "target_model": "claude-3-7-sonnet-20250219"
          }'
      - lang: python
        source: |-
          import requests

          response = requests.post(
              "https://api.anthropic.com/v1/experimental/generate_prompt",
              headers={
                  "Content-Type": "application/json", 
                  "x-api-key": "$ANTHROPIC_API_KEY",
                  "anthropic-version": "2023-06-01",
                  "anthropic-beta": "prompt-tools-2025-04-02"
              },
              json={
                  "task": "a chef for a meal prep planning service",
                  "target_model": "claude-3-7-sonnet-20250219"
              }
          )
      - lang: javascript
        source: >-
          const response = await
          fetch('https://api.anthropic.com/v1/experimental/generate_prompt', {
            method: 'POST',
            headers: {
              'x-api-key': '$ANTHROPIC_API_KEY',
              'anthropic-version': '2023-06-01',
              'anthropic-beta': 'prompt-tools-2025-04-02',
              'content-type': 'application/json'
            },
            body: JSON.stringify({
              'task': 'a chef for a meal prep planning service',
              'target_model': 'claude-3-7-sonnet-20250219'
            })
          });


          const data = await response.json();
  response:
    '200':
      application/json:
        schemaArray:
          - type: object
            properties:
              messages:
                allOf:
                  - description: >-
                      The response contains a list of message objects in the
                      same format used by the Messages API. Typically includes a
                      user message with the complete generated prompt text, and
                      may include an assistant message with a prefill to guide
                      the model's initial response.


                      These messages can be used directly in a Messages API
                      request to start a conversation with the generated prompt.


                      Example:


                      ```json

                      {
                        "messages": [
                          {
                            "role": "user",
                            "content": [
                              {
                                "type": "text",
                                "text": "You are a chef for a meal prep planning service..."
                              }
                            ]
                          },
                          {
                            "role": "assistant",
                            "content": [
                              {
                                "type": "text",
                                "text": "<recipe_planning>"
                              }
                            ]
                          }
                        ]
                      }

                      ```
                    examples:
                      - - content:
                            - text: <generated prompt>
                              type: text
                          role: user
                    items:
                      $ref: '#/components/schemas/InputMessage'
                    title: Messages
                    type: array
              system:
                allOf:
                  - default: ''
                    description: >-
                      Currently, the `system` field is always returned as an
                      empty string (""). In future iterations, this field may
                      contain generated system prompts.


                      Directions similar to what would normally be included in a
                      system prompt are included in `messages` when generating a
                      prompt.
                    examples:
                      - ''
                    title: System
                    type: string
              usage:
                allOf:
                  - $ref: '#/components/schemas/Usage'
                    description: Usage information
                    examples:
                      - - input_tokens: 490
                          output_tokens: 661
            title: GeneratePromptResponse
            requiredProperties:
              - messages
              - system
              - usage
        examples:
          example:
            value:
              messages:
                - content:
                    - text: <generated prompt>
                      type: text
                  role: user
              system: ''
              usage:
                - input_tokens: 490
                  output_tokens: 661
        description: Successful Response
    4XX:
      application/json:
        schemaArray:
          - type: object
            properties:
              error:
                allOf:
                  - discriminator:
                      mapping:
                        api_error: '#/components/schemas/APIError'
                        authentication_error: '#/components/schemas/AuthenticationError'
                        billing_error: '#/components/schemas/BillingError'
                        invalid_request_error: '#/components/schemas/InvalidRequestError'
                        not_found_error: '#/components/schemas/NotFoundError'
                        overloaded_error: '#/components/schemas/OverloadedError'
                        permission_error: '#/components/schemas/PermissionError'
                        rate_limit_error: '#/components/schemas/RateLimitError'
                        timeout_error: '#/components/schemas/GatewayTimeoutError'
                      propertyName: type
                    oneOf:
                      - $ref: '#/components/schemas/InvalidRequestError'
                      - $ref: '#/components/schemas/AuthenticationError'
                      - $ref: '#/components/schemas/BillingError'
                      - $ref: '#/components/schemas/PermissionError'
                      - $ref: '#/components/schemas/NotFoundError'
                      - $ref: '#/components/schemas/RateLimitError'
                      - $ref: '#/components/schemas/GatewayTimeoutError'
                      - $ref: '#/components/schemas/APIError'
                      - $ref: '#/components/schemas/OverloadedError'
                    title: Error
              type:
                allOf:
                  - const: error
                    default: error
                    enum:
                      - error
                    title: Type
                    type: string
            title: ErrorResponse
            requiredProperties:
              - error
              - type
        examples:
          example:
            value:
              error:
                message: Invalid request
                type: invalid_request_error
              type: error
        description: >-
          Error response.


          See our [errors
          documentation](https://docs.anthropic.com/en/api/errors) for more
          details.
  deprecated: false
  type: path
components:
  schemas:
    APIError:
      properties:
        message:
          default: Internal server error
          title: Message
          type: string
        type:
          const: api_error
          default: api_error
          enum:
            - api_error
          title: Type
          type: string
      required:
        - message
        - type
      title: APIError
      type: object
    AuthenticationError:
      properties:
        message:
          default: Authentication error
          title: Message
          type: string
        type:
          const: authentication_error
          default: authentication_error
          enum:
            - authentication_error
          title: Type
          type: string
      required:
        - message
        - type
      title: AuthenticationError
      type: object
    Base64ImageSource:
      additionalProperties: false
      properties:
        data:
          format: byte
          title: Data
          type: string
        media_type:
          enum:
            - image/jpeg
            - image/png
            - image/gif
            - image/webp
          title: Media Type
          type: string
        type:
          const: base64
          enum:
            - base64
          title: Type
          type: string
      required:
        - data
        - media_type
        - type
      title: Base64ImageSource
      type: object
    Base64PDFSource:
      additionalProperties: false
      properties:
        data:
          format: byte
          title: Data
          type: string
        media_type:
          const: application/pdf
          enum:
            - application/pdf
          title: Media Type
          type: string
        type:
          const: base64
          enum:
            - base64
          title: Type
          type: string
      required:
        - data
        - media_type
        - type
      title: PDF (base64)
      type: object
    BillingError:
      properties:
        message:
          default: Billing error
          title: Message
          type: string
        type:
          const: billing_error
          default: billing_error
          enum:
            - billing_error
          title: Type
          type: string
      required:
        - message
        - type
      title: BillingError
      type: object
    CacheControlEphemeral:
      additionalProperties: false
      properties:
        ttl:
          description: |-
            The time-to-live for the cache control breakpoint.

            This may be one the following values:
            - `5m`: 5 minutes
            - `1h`: 1 hour

            Defaults to `5m`.
          enum:
            - 5m
            - 1h
          title: Ttl
          type: string
        type:
          const: ephemeral
          enum:
            - ephemeral
          title: Type
          type: string
      required:
        - type
      title: CacheControlEphemeral
      type: object
    CacheCreation:
      properties:
        ephemeral_1h_input_tokens:
          default: 0
          description: The number of input tokens used to create the 1 hour cache entry.
          minimum: 0
          title: Ephemeral 1H Input Tokens
          type: integer
        ephemeral_5m_input_tokens:
          default: 0
          description: The number of input tokens used to create the 5 minute cache entry.
          minimum: 0
          title: Ephemeral 5M Input Tokens
          type: integer
      required:
        - ephemeral_1h_input_tokens
        - ephemeral_5m_input_tokens
      title: CacheCreation
      type: object
    CodeExecutionToolResultErrorCode:
      enum:
        - invalid_tool_input
        - unavailable
        - too_many_requests
        - execution_time_exceeded
      title: CodeExecutionToolResultErrorCode
      type: string
    ContentBlockSource:
      additionalProperties: false
      properties:
        content:
          anyOf:
            - type: string
            - items:
                discriminator:
                  mapping:
                    image: '#/components/schemas/RequestImageBlock'
                    text: '#/components/schemas/RequestTextBlock'
                  propertyName: type
                oneOf:
                  - $ref: '#/components/schemas/RequestTextBlock'
                  - $ref: '#/components/schemas/RequestImageBlock'
              type: array
          title: Content
        type:
          const: content
          enum:
            - content
          title: Type
          type: string
      required:
        - content
        - type
      title: Content block
      type: object
    FileDocumentSource:
      additionalProperties: false
      properties:
        file_id:
          title: File Id
          type: string
        type:
          const: file
          enum:
            - file
          title: Type
          type: string
      required:
        - file_id
        - type
      title: File document
      type: object
    FileImageSource:
      additionalProperties: false
      properties:
        file_id:
          title: File Id
          type: string
        type:
          const: file
          enum:
            - file
          title: Type
          type: string
      required:
        - file_id
        - type
      title: FileImageSource
      type: object
    GatewayTimeoutError:
      properties:
        message:
          default: Request timeout
          title: Message
          type: string
        type:
          const: timeout_error
          default: timeout_error
          enum:
            - timeout_error
          title: Type
          type: string
      required:
        - message
        - type
      title: GatewayTimeoutError
      type: object
    InputMessage:
      additionalProperties: false
      properties:
        content:
          anyOf:
            - type: string
            - items:
                discriminator:
                  mapping:
                    code_execution_tool_result: '#/components/schemas/RequestCodeExecutionToolResultBlock'
                    container_upload: '#/components/schemas/RequestContainerUploadBlock'
                    document: '#/components/schemas/RequestDocumentBlock'
                    image: '#/components/schemas/RequestImageBlock'
                    mcp_tool_result: '#/components/schemas/RequestMCPToolResultBlock'
                    mcp_tool_use: '#/components/schemas/RequestMCPToolUseBlock'
                    redacted_thinking: '#/components/schemas/RequestRedactedThinkingBlock'
                    search_result: '#/components/schemas/RequestSearchResultBlock'
                    server_tool_use: '#/components/schemas/RequestServerToolUseBlock'
                    text: '#/components/schemas/RequestTextBlock'
                    thinking: '#/components/schemas/RequestThinkingBlock'
                    tool_result: '#/components/schemas/RequestToolResultBlock'
                    tool_use: '#/components/schemas/RequestToolUseBlock'
                    web_search_tool_result: '#/components/schemas/RequestWebSearchToolResultBlock'
                  propertyName: type
                oneOf:
                  - $ref: '#/components/schemas/RequestTextBlock'
                    description: Regular text content.
                  - $ref: '#/components/schemas/RequestImageBlock'
                    description: >-
                      Image content specified directly as base64 data or as a
                      reference via a URL.
                  - $ref: '#/components/schemas/RequestDocumentBlock'
                    description: >-
                      Document content, either specified directly as base64
                      data, as text, or as a reference via a URL.
                  - $ref: '#/components/schemas/RequestSearchResultBlock'
                    description: >-
                      A search result block containing source, title, and
                      content from search operations.
                  - $ref: '#/components/schemas/RequestThinkingBlock'
                    description: A block specifying internal thinking by the model.
                  - $ref: '#/components/schemas/RequestRedactedThinkingBlock'
                    description: >-
                      A block specifying internal, redacted thinking by the
                      model.
                  - $ref: '#/components/schemas/RequestToolUseBlock'
                    description: A block indicating a tool use by the model.
                  - $ref: '#/components/schemas/RequestToolResultBlock'
                    description: A block specifying the results of a tool use by the model.
                  - $ref: '#/components/schemas/RequestServerToolUseBlock'
                  - $ref: '#/components/schemas/RequestWebSearchToolResultBlock'
                  - $ref: '#/components/schemas/RequestCodeExecutionToolResultBlock'
                  - $ref: '#/components/schemas/RequestMCPToolUseBlock'
                  - $ref: '#/components/schemas/RequestMCPToolResultBlock'
                  - $ref: '#/components/schemas/RequestContainerUploadBlock'
              type: array
          title: Content
        role:
          enum:
            - user
            - assistant
          title: Role
          type: string
      required:
        - content
        - role
      title: InputMessage
      type: object
    InvalidRequestError:
      properties:
        message:
          default: Invalid request
          title: Message
          type: string
        type:
          const: invalid_request_error
          default: invalid_request_error
          enum:
            - invalid_request_error
          title: Type
          type: string
      required:
        - message
        - type
      title: InvalidRequestError
      type: object
    NotFoundError:
      properties:
        message:
          default: Not found
          title: Message
          type: string
        type:
          const: not_found_error
          default: not_found_error
          enum:
            - not_found_error
          title: Type
          type: string
      required:
        - message
        - type
      title: NotFoundError
      type: object
    OverloadedError:
      properties:
        message:
          default: Overloaded
          title: Message
          type: string
        type:
          const: overloaded_error
          default: overloaded_error
          enum:
            - overloaded_error
          title: Type
          type: string
      required:
        - message
        - type
      title: OverloadedError
      type: object
    PermissionError:
      properties:
        message:
          default: Permission denied
          title: Message
          type: string
        type:
          const: permission_error
          default: permission_error
          enum:
            - permission_error
          title: Type
          type: string
      required:
        - message
        - type
      title: PermissionError
      type: object
    PlainTextSource:
      additionalProperties: false
      properties:
        data:
          title: Data
          type: string
        media_type:
          const: text/plain
          enum:
            - text/plain
          title: Media Type
          type: string
        type:
          const: text
          enum:
            - text
          title: Type
          type: string
      required:
        - data
        - media_type
        - type
      title: Plain text
      type: object
    RateLimitError:
      properties:
        message:
          default: Rate limited
          title: Message
          type: string
        type:
          const: rate_limit_error
          default: rate_limit_error
          enum:
            - rate_limit_error
          title: Type
          type: string
      required:
        - message
        - type
      title: RateLimitError
      type: object
    RequestCharLocationCitation:
      additionalProperties: false
      properties:
        cited_text:
          title: Cited Text
          type: string
        document_index:
          minimum: 0
          title: Document Index
          type: integer
        document_title:
          anyOf:
            - maxLength: 255
              minLength: 1
              type: string
            - type: 'null'
          title: Document Title
        end_char_index:
          title: End Char Index
          type: integer
        start_char_index:
          minimum: 0
          title: Start Char Index
          type: integer
        type:
          const: char_location
          enum:
            - char_location
          title: Type
          type: string
      required:
        - cited_text
        - document_index
        - document_title
        - end_char_index
        - start_char_index
        - type
      title: Character location
      type: object
    RequestCitationsConfig:
      additionalProperties: false
      properties:
        enabled:
          title: Enabled
          type: boolean
      title: RequestCitationsConfig
      type: object
    RequestCodeExecutionOutputBlock:
      additionalProperties: false
      properties:
        file_id:
          title: File Id
          type: string
        type:
          const: code_execution_output
          enum:
            - code_execution_output
          title: Type
          type: string
      required:
        - file_id
        - type
      title: RequestCodeExecutionOutputBlock
      type: object
    RequestCodeExecutionResultBlock:
      additionalProperties: false
      properties:
        content:
          items:
            $ref: '#/components/schemas/RequestCodeExecutionOutputBlock'
          title: Content
          type: array
        return_code:
          title: Return Code
          type: integer
        stderr:
          title: Stderr
          type: string
        stdout:
          title: Stdout
          type: string
        type:
          const: code_execution_result
          enum:
            - code_execution_result
          title: Type
          type: string
      required:
        - content
        - return_code
        - stderr
        - stdout
        - type
      title: Code execution result
      type: object
    RequestCodeExecutionToolResultBlock:
      additionalProperties: false
      properties:
        cache_control:
          anyOf:
            - discriminator:
                mapping:
                  ephemeral: '#/components/schemas/CacheControlEphemeral'
                propertyName: type
              oneOf:
                - $ref: '#/components/schemas/CacheControlEphemeral'
            - type: 'null'
          description: Create a cache control breakpoint at this content block.
          title: Cache Control
        content:
          anyOf:
            - $ref: '#/components/schemas/RequestCodeExecutionToolResultError'
            - $ref: '#/components/schemas/RequestCodeExecutionResultBlock'
          title: Content
        tool_use_id:
          pattern: ^srvtoolu_[a-zA-Z0-9_]+$
          title: Tool Use Id
          type: string
        type:
          const: code_execution_tool_result
          enum:
            - code_execution_tool_result
          title: Type
          type: string
      required:
        - content
        - tool_use_id
        - type
      title: Code execution tool result
      type: object
    RequestCodeExecutionToolResultError:
      additionalProperties: false
      properties:
        error_code:
          $ref: '#/components/schemas/CodeExecutionToolResultErrorCode'
        type:
          const: code_execution_tool_result_error
          enum:
            - code_execution_tool_result_error
          title: Type
          type: string
      required:
        - error_code
        - type
      title: Code execution tool error
      type: object
    RequestContainerUploadBlock:
      additionalProperties: false
      description: >-
        A content block that represents a file to be uploaded to the container

        Files uploaded via this block will be available in the container's input
        directory.
      properties:
        cache_control:
          anyOf:
            - discriminator:
                mapping:
                  ephemeral: '#/components/schemas/CacheControlEphemeral'
                propertyName: type
              oneOf:
                - $ref: '#/components/schemas/CacheControlEphemeral'
            - type: 'null'
          description: Create a cache control breakpoint at this content block.
          title: Cache Control
        file_id:
          title: File Id
          type: string
        type:
          const: container_upload
          enum:
            - container_upload
          title: Type
          type: string
      required:
        - file_id
        - type
      title: Container upload
      type: object
    RequestContentBlockLocationCitation:
      additionalProperties: false
      properties:
        cited_text:
          title: Cited Text
          type: string
        document_index:
          minimum: 0
          title: Document Index
          type: integer
        document_title:
          anyOf:
            - maxLength: 255
              minLength: 1
              type: string
            - type: 'null'
          title: Document Title
        end_block_index:
          title: End Block Index
          type: integer
        start_block_index:
          minimum: 0
          title: Start Block Index
          type: integer
        type:
          const: content_block_location
          enum:
            - content_block_location
          title: Type
          type: string
      required:
        - cited_text
        - document_index
        - document_title
        - end_block_index
        - start_block_index
        - type
      title: Content block location
      type: object
    RequestDocumentBlock:
      additionalProperties: false
      properties:
        cache_control:
          anyOf:
            - discriminator:
                mapping:
                  ephemeral: '#/components/schemas/CacheControlEphemeral'
                propertyName: type
              oneOf:
                - $ref: '#/components/schemas/CacheControlEphemeral'
            - type: 'null'
          description: Create a cache control breakpoint at this content block.
          title: Cache Control
        citations:
          $ref: '#/components/schemas/RequestCitationsConfig'
        context:
          anyOf:
            - minLength: 1
              type: string
            - type: 'null'
          title: Context
        source:
          discriminator:
            mapping:
              base64: '#/components/schemas/Base64PDFSource'
              content: '#/components/schemas/ContentBlockSource'
              file: '#/components/schemas/FileDocumentSource'
              text: '#/components/schemas/PlainTextSource'
              url: '#/components/schemas/URLPDFSource'
            propertyName: type
          oneOf:
            - $ref: '#/components/schemas/Base64PDFSource'
            - $ref: '#/components/schemas/PlainTextSource'
            - $ref: '#/components/schemas/ContentBlockSource'
            - $ref: '#/components/schemas/URLPDFSource'
            - $ref: '#/components/schemas/FileDocumentSource'
        title:
          anyOf:
            - maxLength: 500
              minLength: 1
              type: string
            - type: 'null'
          title: Title
        type:
          const: document
          enum:
            - document
          title: Type
          type: string
      required:
        - source
        - type
      title: Document
      type: object
    RequestImageBlock:
      additionalProperties: false
      properties:
        cache_control:
          anyOf:
            - discriminator:
                mapping:
                  ephemeral: '#/components/schemas/CacheControlEphemeral'
                propertyName: type
              oneOf:
                - $ref: '#/components/schemas/CacheControlEphemeral'
            - type: 'null'
          description: Create a cache control breakpoint at this content block.
          title: Cache Control
        source:
          discriminator:
            mapping:
              base64: '#/components/schemas/Base64ImageSource'
              file: '#/components/schemas/FileImageSource'
              url: '#/components/schemas/URLImageSource'
            propertyName: type
          oneOf:
            - $ref: '#/components/schemas/Base64ImageSource'
            - $ref: '#/components/schemas/URLImageSource'
            - $ref: '#/components/schemas/FileImageSource'
          title: Source
        type:
          const: image
          enum:
            - image
          title: Type
          type: string
      required:
        - source
        - type
      title: Image
      type: object
    RequestMCPToolResultBlock:
      additionalProperties: false
      properties:
        cache_control:
          anyOf:
            - discriminator:
                mapping:
                  ephemeral: '#/components/schemas/CacheControlEphemeral'
                propertyName: type
              oneOf:
                - $ref: '#/components/schemas/CacheControlEphemeral'
            - type: 'null'
          description: Create a cache control breakpoint at this content block.
          title: Cache Control
        content:
          anyOf:
            - type: string
            - items:
                $ref: '#/components/schemas/RequestTextBlock'
              type: array
          title: Content
        is_error:
          title: Is Error
          type: boolean
        tool_use_id:
          pattern: ^[a-zA-Z0-9_-]+$
          title: Tool Use Id
          type: string
        type:
          const: mcp_tool_result
          enum:
            - mcp_tool_result
          title: Type
          type: string
      required:
        - tool_use_id
        - type
      title: MCP tool result
      type: object
    RequestMCPToolUseBlock:
      additionalProperties: false
      properties:
        cache_control:
          anyOf:
            - discriminator:
                mapping:
                  ephemeral: '#/components/schemas/CacheControlEphemeral'
                propertyName: type
              oneOf:
                - $ref: '#/components/schemas/CacheControlEphemeral'
            - type: 'null'
          description: Create a cache control breakpoint at this content block.
          title: Cache Control
        id:
          pattern: ^[a-zA-Z0-9_-]+$
          title: Id
          type: string
        input:
          title: Input
          type: object
        name:
          title: Name
          type: string
        server_name:
          description: The name of the MCP server
          title: Server Name
          type: string
        type:
          const: mcp_tool_use
          enum:
            - mcp_tool_use
          title: Type
          type: string
      required:
        - id
        - input
        - name
        - server_name
        - type
      title: MCP tool use
      type: object
    RequestPageLocationCitation:
      additionalProperties: false
      properties:
        cited_text:
          title: Cited Text
          type: string
        document_index:
          minimum: 0
          title: Document Index
          type: integer
        document_title:
          anyOf:
            - maxLength: 255
              minLength: 1
              type: string
            - type: 'null'
          title: Document Title
        end_page_number:
          title: End Page Number
          type: integer
        start_page_number:
          minimum: 1
          title: Start Page Number
          type: integer
        type:
          const: page_location
          enum:
            - page_location
          title: Type
          type: string
      required:
        - cited_text
        - document_index
        - document_title
        - end_page_number
        - start_page_number
        - type
      title: Page location
      type: object
    RequestRedactedThinkingBlock:
      additionalProperties: false
      properties:
        data:
          title: Data
          type: string
        type:
          const: redacted_thinking
          enum:
            - redacted_thinking
          title: Type
          type: string
      required:
        - data
        - type
      title: Redacted thinking
      type: object
    RequestSearchResultBlock:
      additionalProperties: false
      properties:
        cache_control:
          anyOf:
            - discriminator:
                mapping:
                  ephemeral: '#/components/schemas/CacheControlEphemeral'
                propertyName: type
              oneOf:
                - $ref: '#/components/schemas/CacheControlEphemeral'
            - type: 'null'
          description: Create a cache control breakpoint at this content block.
          title: Cache Control
        citations:
          $ref: '#/components/schemas/RequestCitationsConfig'
        content:
          items:
            $ref: '#/components/schemas/RequestTextBlock'
          title: Content
          type: array
        source:
          title: Source
          type: string
        title:
          title: Title
          type: string
        type:
          const: search_result
          enum:
            - search_result
          title: Type
          type: string
      required:
        - content
        - source
        - title
        - type
      title: RequestSearchResultBlock
      type: object
    RequestSearchResultLocationCitation:
      properties:
        cited_text:
          title: Cited Text
          type: string
        end_block_index:
          title: End Block Index
          type: integer
        search_result_index:
          minimum: 0
          title: Search Result Index
          type: integer
        source:
          title: Source
          type: string
        start_block_index:
          minimum: 0
          title: Start Block Index
          type: integer
        title:
          anyOf:
            - type: string
            - type: 'null'
          title: Title
        type:
          const: search_result_location
          default: search_result_location
          enum:
            - search_result_location
          title: Type
          type: string
      required:
        - cited_text
        - end_block_index
        - search_result_index
        - source
        - start_block_index
        - title
        - type
      title: RequestSearchResultLocationCitation
      type: object
    RequestServerToolUseBlock:
      additionalProperties: false
      properties:
        cache_control:
          anyOf:
            - discriminator:
                mapping:
                  ephemeral: '#/components/schemas/CacheControlEphemeral'
                propertyName: type
              oneOf:
                - $ref: '#/components/schemas/CacheControlEphemeral'
            - type: 'null'
          description: Create a cache control breakpoint at this content block.
          title: Cache Control
        id:
          pattern: ^srvtoolu_[a-zA-Z0-9_]+$
          title: Id
          type: string
        input:
          title: Input
          type: object
        name:
          enum:
            - web_search
            - code_execution
          title: Name
          type: string
        type:
          const: server_tool_use
          enum:
            - server_tool_use
          title: Type
          type: string
      required:
        - id
        - input
        - name
        - type
      title: Server tool use
      type: object
    RequestTextBlock:
      additionalProperties: false
      properties:
        cache_control:
          anyOf:
            - discriminator:
                mapping:
                  ephemeral: '#/components/schemas/CacheControlEphemeral'
                propertyName: type
              oneOf:
                - $ref: '#/components/schemas/CacheControlEphemeral'
            - type: 'null'
          description: Create a cache control breakpoint at this content block.
          title: Cache Control
        citations:
          anyOf:
            - items:
                discriminator:
                  mapping:
                    char_location: '#/components/schemas/RequestCharLocationCitation'
                    content_block_location: '#/components/schemas/RequestContentBlockLocationCitation'
                    page_location: '#/components/schemas/RequestPageLocationCitation'
                    search_result_location: '#/components/schemas/RequestSearchResultLocationCitation'
                    web_search_result_location: >-
                      #/components/schemas/RequestWebSearchResultLocationCitation
                  propertyName: type
                oneOf:
                  - $ref: '#/components/schemas/RequestCharLocationCitation'
                  - $ref: '#/components/schemas/RequestPageLocationCitation'
                  - $ref: '#/components/schemas/RequestContentBlockLocationCitation'
                  - $ref: >-
                      #/components/schemas/RequestWebSearchResultLocationCitation
                  - $ref: '#/components/schemas/RequestSearchResultLocationCitation'
              type: array
            - type: 'null'
          title: Citations
        text:
          minLength: 1
          title: Text
          type: string
        type:
          const: text
          enum:
            - text
          title: Type
          type: string
      required:
        - text
        - type
      title: Text
      type: object
    RequestThinkingBlock:
      additionalProperties: false
      properties:
        signature:
          title: Signature
          type: string
        thinking:
          title: Thinking
          type: string
        type:
          const: thinking
          enum:
            - thinking
          title: Type
          type: string
      required:
        - signature
        - thinking
        - type
      title: Thinking
      type: object
    RequestToolResultBlock:
      additionalProperties: false
      properties:
        cache_control:
          anyOf:
            - discriminator:
                mapping:
                  ephemeral: '#/components/schemas/CacheControlEphemeral'
                propertyName: type
              oneOf:
                - $ref: '#/components/schemas/CacheControlEphemeral'
            - type: 'null'
          description: Create a cache control breakpoint at this content block.
          title: Cache Control
        content:
          anyOf:
            - type: string
            - items:
                discriminator:
                  mapping:
                    image: '#/components/schemas/RequestImageBlock'
                    search_result: '#/components/schemas/RequestSearchResultBlock'
                    text: '#/components/schemas/RequestTextBlock'
                  propertyName: type
                oneOf:
                  - $ref: '#/components/schemas/RequestTextBlock'
                  - $ref: '#/components/schemas/RequestImageBlock'
                  - $ref: '#/components/schemas/RequestSearchResultBlock'
              type: array
          title: Content
        is_error:
          title: Is Error
          type: boolean
        tool_use_id:
          pattern: ^[a-zA-Z0-9_-]+$
          title: Tool Use Id
          type: string
        type:
          const: tool_result
          enum:
            - tool_result
          title: Type
          type: string
      required:
        - tool_use_id
        - type
      title: Tool result
      type: object
    RequestToolUseBlock:
      additionalProperties: false
      properties:
        cache_control:
          anyOf:
            - discriminator:
                mapping:
                  ephemeral: '#/components/schemas/CacheControlEphemeral'
                propertyName: type
              oneOf:
                - $ref: '#/components/schemas/CacheControlEphemeral'
            - type: 'null'
          description: Create a cache control breakpoint at this content block.
          title: Cache Control
        id:
          pattern: ^[a-zA-Z0-9_-]+$
          title: Id
          type: string
        input:
          title: Input
          type: object
        name:
          maxLength: 200
          minLength: 1
          title: Name
          type: string
        type:
          const: tool_use
          enum:
            - tool_use
          title: Type
          type: string
      required:
        - id
        - input
        - name
        - type
      title: Tool use
      type: object
    RequestWebSearchResultBlock:
      additionalProperties: false
      properties:
        encrypted_content:
          title: Encrypted Content
          type: string
        page_age:
          anyOf:
            - type: string
            - type: 'null'
          title: Page Age
        title:
          title: Title
          type: string
        type:
          const: web_search_result
          enum:
            - web_search_result
          title: Type
          type: string
        url:
          title: Url
          type: string
      required:
        - encrypted_content
        - title
        - type
        - url
      title: RequestWebSearchResultBlock
      type: object
    RequestWebSearchResultLocationCitation:
      additionalProperties: false
      properties:
        cited_text:
          title: Cited Text
          type: string
        encrypted_index:
          title: Encrypted Index
          type: string
        title:
          anyOf:
            - maxLength: 512
              minLength: 1
              type: string
            - type: 'null'
          title: Title
        type:
          const: web_search_result_location
          enum:
            - web_search_result_location
          title: Type
          type: string
        url:
          maxLength: 2048
          minLength: 1
          title: Url
          type: string
      required:
        - cited_text
        - encrypted_index
        - title
        - type
        - url
      title: RequestWebSearchResultLocationCitation
      type: object
    RequestWebSearchToolResultBlock:
      additionalProperties: false
      properties:
        cache_control:
          anyOf:
            - discriminator:
                mapping:
                  ephemeral: '#/components/schemas/CacheControlEphemeral'
                propertyName: type
              oneOf:
                - $ref: '#/components/schemas/CacheControlEphemeral'
            - type: 'null'
          description: Create a cache control breakpoint at this content block.
          title: Cache Control
        content:
          anyOf:
            - items:
                $ref: '#/components/schemas/RequestWebSearchResultBlock'
              type: array
            - $ref: '#/components/schemas/RequestWebSearchToolResultError'
          title: Content
        tool_use_id:
          pattern: ^srvtoolu_[a-zA-Z0-9_]+$
          title: Tool Use Id
          type: string
        type:
          const: web_search_tool_result
          enum:
            - web_search_tool_result
          title: Type
          type: string
      required:
        - content
        - tool_use_id
        - type
      title: Web search tool result
      type: object
    RequestWebSearchToolResultError:
      additionalProperties: false
      properties:
        error_code:
          $ref: '#/components/schemas/WebSearchToolResultErrorCode'
        type:
          const: web_search_tool_result_error
          enum:
            - web_search_tool_result_error
          title: Type
          type: string
      required:
        - error_code
        - type
      title: RequestWebSearchToolResultError
      type: object
    ServerToolUsage:
      properties:
        web_search_requests:
          default: 0
          description: The number of web search tool requests.
          examples:
            - 0
          minimum: 0
          title: Web Search Requests
          type: integer
      required:
        - web_search_requests
      title: ServerToolUsage
      type: object
    URLImageSource:
      additionalProperties: false
      properties:
        type:
          const: url
          enum:
            - url
          title: Type
          type: string
        url:
          title: Url
          type: string
      required:
        - type
        - url
      title: URLImageSource
      type: object
    URLPDFSource:
      additionalProperties: false
      properties:
        type:
          const: url
          enum:
            - url
          title: Type
          type: string
        url:
          title: Url
          type: string
      required:
        - type
        - url
      title: PDF (URL)
      type: object
    Usage:
      properties:
        cache_creation:
          anyOf:
            - $ref: '#/components/schemas/CacheCreation'
            - type: 'null'
          default: null
          description: Breakdown of cached tokens by TTL
        cache_creation_input_tokens:
          anyOf:
            - minimum: 0
              type: integer
            - type: 'null'
          default: null
          description: The number of input tokens used to create the cache entry.
          examples:
            - 2051
          title: Cache Creation Input Tokens
        cache_read_input_tokens:
          anyOf:
            - minimum: 0
              type: integer
            - type: 'null'
          default: null
          description: The number of input tokens read from the cache.
          examples:
            - 2051
          title: Cache Read Input Tokens
        input_tokens:
          description: The number of input tokens which were used.
          examples:
            - 2095
          minimum: 0
          title: Input Tokens
          type: integer
        output_tokens:
          description: The number of output tokens which were used.
          examples:
            - 503
          minimum: 0
          title: Output Tokens
          type: integer
        server_tool_use:
          anyOf:
            - $ref: '#/components/schemas/ServerToolUsage'
            - type: 'null'
          default: null
          description: The number of server tool requests.
        service_tier:
          anyOf:
            - enum:
                - standard
                - priority
                - batch
              type: string
            - type: 'null'
          default: null
          description: If the request used the priority, standard, or batch tier.
          title: Service Tier
      required:
        - cache_creation
        - cache_creation_input_tokens
        - cache_read_input_tokens
        - input_tokens
        - output_tokens
        - server_tool_use
        - service_tier
      title: Usage
      type: object
    WebSearchToolResultErrorCode:
      enum:
        - invalid_tool_input
        - unavailable
        - max_uses_exceeded
        - too_many_requests
        - query_too_long
      title: WebSearchToolResultErrorCode
      type: string

````

# Improve a prompt

> Create a new-and-improved prompt guided by feedback

## OpenAPI

````yaml post /v1/experimental/improve_prompt
paths:
  path: /v1/experimental/improve_prompt
  method: post
  servers:
    - url: https://api.anthropic.com
  request:
    security: []
    parameters:
      path: {}
      query: {}
      header:
        anthropic-beta:
          schema:
            - type: array
              items:
                allOf:
                  - type: string
              required: false
              title: Anthropic-Beta
              description: >-
                Optional header to specify the beta version(s) you want to use.


                To use multiple betas, use a comma separated list like
                `beta1,beta2` or specify the header multiple times for each
                beta.
        x-api-key:
          schema:
            - type: string
              required: true
              title: X-Api-Key
              description: >-
                Your unique API key for authentication.


                This key is required in the header of all API requests, to
                authenticate your account and access Anthropic's services. Get
                your API key through the
                [Console](https://console.anthropic.com/settings/keys). Each key
                is scoped to a Workspace.
      cookie: {}
    body:
      application/json:
        schemaArray:
          - type: object
            properties:
              feedback:
                allOf:
                  - anyOf:
                      - type: string
                      - type: 'null'
                    default: null
                    description: >-
                      Feedback for improving the prompt.


                      Use this parameter to share specific guidance on what
                      aspects of the prompt should be enhanced or modified.


                      Example:

                      ```json

                      {
                        "messages": [...],
                        "feedback": "Make the recipes shorter"
                      }

                      ```


                      When not set, the API will improve the prompt using
                      general prompt engineering best practices.
                    examples:
                      - Make it more detailed and include cooking times
                    title: Feedback
              messages:
                allOf:
                  - description: >-
                      The prompt to improve, structured as a list of `message`
                      objects.


                      Each message in the `messages` array must:

                      - Contain only text-only content blocks

                      - Not include tool calls, images, or prompt caching blocks


                      As a simple text prompt:


                      ```json

                      [
                        {
                          "role": "user", 
                          "content": [
                            {
                              "type": "text",
                              "text": "Concise recipe for {{food}}"
                            }
                          ]
                        }
                      ]

                      ```


                      With example interactions to guide improvement:


                      ```json

                      [
                        {
                          "role": "user", 
                          "content": [
                            {
                              "type": "text",
                              "text": "Concise for {{food}}.\n\nexample\mandu: Put the mandu in the air fryer at 380F for 7 minutes."
                            }
                          ]
                        }
                      ]

                      ```


                      Note that only contiguous user messages with text content
                      are allowed. Assistant prefill is permitted, but other
                      content types will cause validation errors.
                    examples:
                      - - content:
                            - text: <generated prompt>
                              type: text
                          role: user
                    items:
                      $ref: '#/components/schemas/InputMessage'
                    title: Messages
                    type: array
              system:
                allOf:
                  - anyOf:
                      - type: string
                      - type: 'null'
                    default: null
                    description: >-
                      The existing system prompt to incorporate, if any.


                      ```json

                      {
                        "system": "You are a professional meal prep chef",
                        [...]
                      }

                      ```


                      Note that while system prompts typically appear as
                      separate parameters in standard API calls, in the
                      `improve_prompt` response, the system content will be
                      incorporated directly into the returned user message.
                    examples:
                      - You are a professional chef
                    title: System
              target_model:
                allOf:
                  - anyOf:
                      - maxLength: 256
                        minLength: 1
                        type: string
                      - type: 'null'
                    default: ''
                    description: >-
                      The model this prompt will be used for. This optional
                      parameter helps us understand which models our prompt
                      tools are being used with, but it doesn't currently affect
                      functionality.


                      Example:

                      ```

                      "claude-3-7-sonnet-20250219"

                      ```
                    examples:
                      - claude-3-7-sonnet-20250219
                    title: Target Model
            required: true
            title: ImprovePromptParams
            requiredProperties:
              - messages
        examples:
          example:
            value:
              feedback: Make it more detailed and include cooking times
              messages:
                - content:
                    - text: <generated prompt>
                      type: text
                  role: user
              system: You are a professional chef
              target_model: claude-3-7-sonnet-20250219
    codeSamples:
      - lang: bash
        source: >-
          curl -X POST https://api.anthropic.com/v1/experimental/improve_prompt
          \
               --header "x-api-key: $ANTHROPIC_API_KEY" \
               --header "anthropic-version: 2023-06-01" \
               --header "anthropic-beta: prompt-tools-2025-04-02" \
               --header "content-type: application/json" \
               --data \
          '{
              "messages": [{"role": "user", "content": [{"type": "text", "text": "Create a recipe for {{food}}"}]}],
              "system": "You are a professional chef",
              "feedback": "Make it more detailed and include cooking times",
              "target_model": "claude-3-7-sonnet-20250219"
          }'
      - lang: python
        source: |-
          import requests

          response = requests.post(
              "https://api.anthropic.com/v1/experimental/improve_prompt",
              headers={
                  "Content-Type": "application/json", 
                  "x-api-key": "$ANTHROPIC_API_KEY",
                  "anthropic-version": "2023-06-01",
                  "anthropic-beta": "prompt-tools-2025-04-02"
              },
              json={
                  "messages": [{"role": "user", "content": [{"type": "text", "text": "Create a recipe for {{food}}"}]}],
                  "system": "You are a professional chef",
                  "feedback": "Make it more detailed and include cooking times",
                  "target_model": "claude-3-7-sonnet-20250219"
              }
          )
      - lang: javascript
        source: >-
          const response = await
          fetch('https://api.anthropic.com/v1/experimental/improve_prompt', {
            method: 'POST',
            headers: {
              'x-api-key': '$ANTHROPIC_API_KEY',
              'anthropic-version': '2023-06-01',
              'anthropic-beta': 'prompt-tools-2025-04-02',
              'content-type': 'application/json'
            },
            body: JSON.stringify({
              'messages': [{"role": "user", "content": [{"type": "text", "text": "Create a recipe for {{food}}"}]}],
              'system': "You are a professional chef",
              'feedback': "Make it more detailed and include cooking times",
              'target_model': "claude-3-7-sonnet-20250219"
            })
          });


          const data = await response.json();
  response:
    '200':
      application/json:
        schemaArray:
          - type: object
            properties:
              messages:
                allOf:
                  - description: >-
                      Contains the result of the prompt improvement process in a
                      list of `message` objects.


                      Includes a `user`-role message with the improved prompt
                      text and may optionally include an `assistant`-role
                      message with a prefill. These messages follow the standard
                      Messages API format and can be used directly in subsequent
                      API calls.
                    examples:
                      - - content:
                            - text: <improved prompt>
                              type: text
                          role: user
                        - content:
                            - text: <assistant prefill>
                              type: text
                          role: assistant
                    items:
                      $ref: '#/components/schemas/InputMessage'
                    title: Messages
                    type: array
              system:
                allOf:
                  - description: >-
                      Currently, the `system` field is always returned as an
                      empty string (""). In future iterations, this field may
                      contain generated system prompts.


                      Directions similar to what would normally be included in a
                      system prompt are included in `messages` when improving a
                      prompt.
                    examples:
                      - ''
                    title: System
                    type: string
              usage:
                allOf:
                  - $ref: '#/components/schemas/Usage'
                    description: Usage information
                    examples:
                      - - input_tokens: 490
                          output_tokens: 661
            title: ImprovePromptResponse
            requiredProperties:
              - messages
              - system
              - usage
        examples:
          example:
            value:
              messages:
                - content:
                    - text: <improved prompt>
                      type: text
                  role: user
                - content:
                    - text: <assistant prefill>
                      type: text
                  role: assistant
              system: ''
              usage:
                - input_tokens: 490
                  output_tokens: 661
        description: Successful Response
    4XX:
      application/json:
        schemaArray:
          - type: object
            properties:
              error:
                allOf:
                  - discriminator:
                      mapping:
                        api_error: '#/components/schemas/APIError'
                        authentication_error: '#/components/schemas/AuthenticationError'
                        billing_error: '#/components/schemas/BillingError'
                        invalid_request_error: '#/components/schemas/InvalidRequestError'
                        not_found_error: '#/components/schemas/NotFoundError'
                        overloaded_error: '#/components/schemas/OverloadedError'
                        permission_error: '#/components/schemas/PermissionError'
                        rate_limit_error: '#/components/schemas/RateLimitError'
                        timeout_error: '#/components/schemas/GatewayTimeoutError'
                      propertyName: type
                    oneOf:
                      - $ref: '#/components/schemas/InvalidRequestError'
                      - $ref: '#/components/schemas/AuthenticationError'
                      - $ref: '#/components/schemas/BillingError'
                      - $ref: '#/components/schemas/PermissionError'
                      - $ref: '#/components/schemas/NotFoundError'
                      - $ref: '#/components/schemas/RateLimitError'
                      - $ref: '#/components/schemas/GatewayTimeoutError'
                      - $ref: '#/components/schemas/APIError'
                      - $ref: '#/components/schemas/OverloadedError'
                    title: Error
              type:
                allOf:
                  - const: error
                    default: error
                    enum:
                      - error
                    title: Type
                    type: string
            title: ErrorResponse
            requiredProperties:
              - error
              - type
        examples:
          example:
            value:
              error:
                message: Invalid request
                type: invalid_request_error
              type: error
        description: >-
          Error response.


          See our [errors
          documentation](https://docs.anthropic.com/en/api/errors) for more
          details.
  deprecated: false
  type: path
components:
  schemas:
    APIError:
      properties:
        message:
          default: Internal server error
          title: Message
          type: string
        type:
          const: api_error
          default: api_error
          enum:
            - api_error
          title: Type
          type: string
      required:
        - message
        - type
      title: APIError
      type: object
    AuthenticationError:
      properties:
        message:
          default: Authentication error
          title: Message
          type: string
        type:
          const: authentication_error
          default: authentication_error
          enum:
            - authentication_error
          title: Type
          type: string
      required:
        - message
        - type
      title: AuthenticationError
      type: object
    Base64ImageSource:
      additionalProperties: false
      properties:
        data:
          format: byte
          title: Data
          type: string
        media_type:
          enum:
            - image/jpeg
            - image/png
            - image/gif
            - image/webp
          title: Media Type
          type: string
        type:
          const: base64
          enum:
            - base64
          title: Type
          type: string
      required:
        - data
        - media_type
        - type
      title: Base64ImageSource
      type: object
    Base64PDFSource:
      additionalProperties: false
      properties:
        data:
          format: byte
          title: Data
          type: string
        media_type:
          const: application/pdf
          enum:
            - application/pdf
          title: Media Type
          type: string
        type:
          const: base64
          enum:
            - base64
          title: Type
          type: string
      required:
        - data
        - media_type
        - type
      title: PDF (base64)
      type: object
    BillingError:
      properties:
        message:
          default: Billing error
          title: Message
          type: string
        type:
          const: billing_error
          default: billing_error
          enum:
            - billing_error
          title: Type
          type: string
      required:
        - message
        - type
      title: BillingError
      type: object
    CacheControlEphemeral:
      additionalProperties: false
      properties:
        ttl:
          description: |-
            The time-to-live for the cache control breakpoint.

            This may be one the following values:
            - `5m`: 5 minutes
            - `1h`: 1 hour

            Defaults to `5m`.
          enum:
            - 5m
            - 1h
          title: Ttl
          type: string
        type:
          const: ephemeral
          enum:
            - ephemeral
          title: Type
          type: string
      required:
        - type
      title: CacheControlEphemeral
      type: object
    CacheCreation:
      properties:
        ephemeral_1h_input_tokens:
          default: 0
          description: The number of input tokens used to create the 1 hour cache entry.
          minimum: 0
          title: Ephemeral 1H Input Tokens
          type: integer
        ephemeral_5m_input_tokens:
          default: 0
          description: The number of input tokens used to create the 5 minute cache entry.
          minimum: 0
          title: Ephemeral 5M Input Tokens
          type: integer
      required:
        - ephemeral_1h_input_tokens
        - ephemeral_5m_input_tokens
      title: CacheCreation
      type: object
    CodeExecutionToolResultErrorCode:
      enum:
        - invalid_tool_input
        - unavailable
        - too_many_requests
        - execution_time_exceeded
      title: CodeExecutionToolResultErrorCode
      type: string
    ContentBlockSource:
      additionalProperties: false
      properties:
        content:
          anyOf:
            - type: string
            - items:
                discriminator:
                  mapping:
                    image: '#/components/schemas/RequestImageBlock'
                    text: '#/components/schemas/RequestTextBlock'
                  propertyName: type
                oneOf:
                  - $ref: '#/components/schemas/RequestTextBlock'
                  - $ref: '#/components/schemas/RequestImageBlock'
              type: array
          title: Content
        type:
          const: content
          enum:
            - content
          title: Type
          type: string
      required:
        - content
        - type
      title: Content block
      type: object
    FileDocumentSource:
      additionalProperties: false
      properties:
        file_id:
          title: File Id
          type: string
        type:
          const: file
          enum:
            - file
          title: Type
          type: string
      required:
        - file_id
        - type
      title: File document
      type: object
    FileImageSource:
      additionalProperties: false
      properties:
        file_id:
          title: File Id
          type: string
        type:
          const: file
          enum:
            - file
          title: Type
          type: string
      required:
        - file_id
        - type
      title: FileImageSource
      type: object
    GatewayTimeoutError:
      properties:
        message:
          default: Request timeout
          title: Message
          type: string
        type:
          const: timeout_error
          default: timeout_error
          enum:
            - timeout_error
          title: Type
          type: string
      required:
        - message
        - type
      title: GatewayTimeoutError
      type: object
    InputMessage:
      additionalProperties: false
      properties:
        content:
          anyOf:
            - type: string
            - items:
                discriminator:
                  mapping:
                    code_execution_tool_result: '#/components/schemas/RequestCodeExecutionToolResultBlock'
                    container_upload: '#/components/schemas/RequestContainerUploadBlock'
                    document: '#/components/schemas/RequestDocumentBlock'
                    image: '#/components/schemas/RequestImageBlock'
                    mcp_tool_result: '#/components/schemas/RequestMCPToolResultBlock'
                    mcp_tool_use: '#/components/schemas/RequestMCPToolUseBlock'
                    redacted_thinking: '#/components/schemas/RequestRedactedThinkingBlock'
                    search_result: '#/components/schemas/RequestSearchResultBlock'
                    server_tool_use: '#/components/schemas/RequestServerToolUseBlock'
                    text: '#/components/schemas/RequestTextBlock'
                    thinking: '#/components/schemas/RequestThinkingBlock'
                    tool_result: '#/components/schemas/RequestToolResultBlock'
                    tool_use: '#/components/schemas/RequestToolUseBlock'
                    web_search_tool_result: '#/components/schemas/RequestWebSearchToolResultBlock'
                  propertyName: type
                oneOf:
                  - $ref: '#/components/schemas/RequestTextBlock'
                    description: Regular text content.
                  - $ref: '#/components/schemas/RequestImageBlock'
                    description: >-
                      Image content specified directly as base64 data or as a
                      reference via a URL.
                  - $ref: '#/components/schemas/RequestDocumentBlock'
                    description: >-
                      Document content, either specified directly as base64
                      data, as text, or as a reference via a URL.
                  - $ref: '#/components/schemas/RequestSearchResultBlock'
                    description: >-
                      A search result block containing source, title, and
                      content from search operations.
                  - $ref: '#/components/schemas/RequestThinkingBlock'
                    description: A block specifying internal thinking by the model.
                  - $ref: '#/components/schemas/RequestRedactedThinkingBlock'
                    description: >-
                      A block specifying internal, redacted thinking by the
                      model.
                  - $ref: '#/components/schemas/RequestToolUseBlock'
                    description: A block indicating a tool use by the model.
                  - $ref: '#/components/schemas/RequestToolResultBlock'
                    description: A block specifying the results of a tool use by the model.
                  - $ref: '#/components/schemas/RequestServerToolUseBlock'
                  - $ref: '#/components/schemas/RequestWebSearchToolResultBlock'
                  - $ref: '#/components/schemas/RequestCodeExecutionToolResultBlock'
                  - $ref: '#/components/schemas/RequestMCPToolUseBlock'
                  - $ref: '#/components/schemas/RequestMCPToolResultBlock'
                  - $ref: '#/components/schemas/RequestContainerUploadBlock'
              type: array
          title: Content
        role:
          enum:
            - user
            - assistant
          title: Role
          type: string
      required:
        - content
        - role
      title: InputMessage
      type: object
    InvalidRequestError:
      properties:
        message:
          default: Invalid request
          title: Message
          type: string
        type:
          const: invalid_request_error
          default: invalid_request_error
          enum:
            - invalid_request_error
          title: Type
          type: string
      required:
        - message
        - type
      title: InvalidRequestError
      type: object
    NotFoundError:
      properties:
        message:
          default: Not found
          title: Message
          type: string
        type:
          const: not_found_error
          default: not_found_error
          enum:
            - not_found_error
          title: Type
          type: string
      required:
        - message
        - type
      title: NotFoundError
      type: object
    OverloadedError:
      properties:
        message:
          default: Overloaded
          title: Message
          type: string
        type:
          const: overloaded_error
          default: overloaded_error
          enum:
            - overloaded_error
          title: Type
          type: string
      required:
        - message
        - type
      title: OverloadedError
      type: object
    PermissionError:
      properties:
        message:
          default: Permission denied
          title: Message
          type: string
        type:
          const: permission_error
          default: permission_error
          enum:
            - permission_error
          title: Type
          type: string
      required:
        - message
        - type
      title: PermissionError
      type: object
    PlainTextSource:
      additionalProperties: false
      properties:
        data:
          title: Data
          type: string
        media_type:
          const: text/plain
          enum:
            - text/plain
          title: Media Type
          type: string
        type:
          const: text
          enum:
            - text
          title: Type
          type: string
      required:
        - data
        - media_type
        - type
      title: Plain text
      type: object
    RateLimitError:
      properties:
        message:
          default: Rate limited
          title: Message
          type: string
        type:
          const: rate_limit_error
          default: rate_limit_error
          enum:
            - rate_limit_error
          title: Type
          type: string
      required:
        - message
        - type
      title: RateLimitError
      type: object
    RequestCharLocationCitation:
      additionalProperties: false
      properties:
        cited_text:
          title: Cited Text
          type: string
        document_index:
          minimum: 0
          title: Document Index
          type: integer
        document_title:
          anyOf:
            - maxLength: 255
              minLength: 1
              type: string
            - type: 'null'
          title: Document Title
        end_char_index:
          title: End Char Index
          type: integer
        start_char_index:
          minimum: 0
          title: Start Char Index
          type: integer
        type:
          const: char_location
          enum:
            - char_location
          title: Type
          type: string
      required:
        - cited_text
        - document_index
        - document_title
        - end_char_index
        - start_char_index
        - type
      title: Character location
      type: object
    RequestCitationsConfig:
      additionalProperties: false
      properties:
        enabled:
          title: Enabled
          type: boolean
      title: RequestCitationsConfig
      type: object
    RequestCodeExecutionOutputBlock:
      additionalProperties: false
      properties:
        file_id:
          title: File Id
          type: string
        type:
          const: code_execution_output
          enum:
            - code_execution_output
          title: Type
          type: string
      required:
        - file_id
        - type
      title: RequestCodeExecutionOutputBlock
      type: object
    RequestCodeExecutionResultBlock:
      additionalProperties: false
      properties:
        content:
          items:
            $ref: '#/components/schemas/RequestCodeExecutionOutputBlock'
          title: Content
          type: array
        return_code:
          title: Return Code
          type: integer
        stderr:
          title: Stderr
          type: string
        stdout:
          title: Stdout
          type: string
        type:
          const: code_execution_result
          enum:
            - code_execution_result
          title: Type
          type: string
      required:
        - content
        - return_code
        - stderr
        - stdout
        - type
      title: Code execution result
      type: object
    RequestCodeExecutionToolResultBlock:
      additionalProperties: false
      properties:
        cache_control:
          anyOf:
            - discriminator:
                mapping:
                  ephemeral: '#/components/schemas/CacheControlEphemeral'
                propertyName: type
              oneOf:
                - $ref: '#/components/schemas/CacheControlEphemeral'
            - type: 'null'
          description: Create a cache control breakpoint at this content block.
          title: Cache Control
        content:
          anyOf:
            - $ref: '#/components/schemas/RequestCodeExecutionToolResultError'
            - $ref: '#/components/schemas/RequestCodeExecutionResultBlock'
          title: Content
        tool_use_id:
          pattern: ^srvtoolu_[a-zA-Z0-9_]+$
          title: Tool Use Id
          type: string
        type:
          const: code_execution_tool_result
          enum:
            - code_execution_tool_result
          title: Type
          type: string
      required:
        - content
        - tool_use_id
        - type
      title: Code execution tool result
      type: object
    RequestCodeExecutionToolResultError:
      additionalProperties: false
      properties:
        error_code:
          $ref: '#/components/schemas/CodeExecutionToolResultErrorCode'
        type:
          const: code_execution_tool_result_error
          enum:
            - code_execution_tool_result_error
          title: Type
          type: string
      required:
        - error_code
        - type
      title: Code execution tool error
      type: object
    RequestContainerUploadBlock:
      additionalProperties: false
      description: >-
        A content block that represents a file to be uploaded to the container

        Files uploaded via this block will be available in the container's input
        directory.
      properties:
        cache_control:
          anyOf:
            - discriminator:
                mapping:
                  ephemeral: '#/components/schemas/CacheControlEphemeral'
                propertyName: type
              oneOf:
                - $ref: '#/components/schemas/CacheControlEphemeral'
            - type: 'null'
          description: Create a cache control breakpoint at this content block.
          title: Cache Control
        file_id:
          title: File Id
          type: string
        type:
          const: container_upload
          enum:
            - container_upload
          title: Type
          type: string
      required:
        - file_id
        - type
      title: Container upload
      type: object
    RequestContentBlockLocationCitation:
      additionalProperties: false
      properties:
        cited_text:
          title: Cited Text
          type: string
        document_index:
          minimum: 0
          title: Document Index
          type: integer
        document_title:
          anyOf:
            - maxLength: 255
              minLength: 1
              type: string
            - type: 'null'
          title: Document Title
        end_block_index:
          title: End Block Index
          type: integer
        start_block_index:
          minimum: 0
          title: Start Block Index
          type: integer
        type:
          const: content_block_location
          enum:
            - content_block_location
          title: Type
          type: string
      required:
        - cited_text
        - document_index
        - document_title
        - end_block_index
        - start_block_index
        - type
      title: Content block location
      type: object
    RequestDocumentBlock:
      additionalProperties: false
      properties:
        cache_control:
          anyOf:
            - discriminator:
                mapping:
                  ephemeral: '#/components/schemas/CacheControlEphemeral'
                propertyName: type
              oneOf:
                - $ref: '#/components/schemas/CacheControlEphemeral'
            - type: 'null'
          description: Create a cache control breakpoint at this content block.
          title: Cache Control
        citations:
          $ref: '#/components/schemas/RequestCitationsConfig'
        context:
          anyOf:
            - minLength: 1
              type: string
            - type: 'null'
          title: Context
        source:
          discriminator:
            mapping:
              base64: '#/components/schemas/Base64PDFSource'
              content: '#/components/schemas/ContentBlockSource'
              file: '#/components/schemas/FileDocumentSource'
              text: '#/components/schemas/PlainTextSource'
              url: '#/components/schemas/URLPDFSource'
            propertyName: type
          oneOf:
            - $ref: '#/components/schemas/Base64PDFSource'
            - $ref: '#/components/schemas/PlainTextSource'
            - $ref: '#/components/schemas/ContentBlockSource'
            - $ref: '#/components/schemas/URLPDFSource'
            - $ref: '#/components/schemas/FileDocumentSource'
        title:
          anyOf:
            - maxLength: 500
              minLength: 1
              type: string
            - type: 'null'
          title: Title
        type:
          const: document
          enum:
            - document
          title: Type
          type: string
      required:
        - source
        - type
      title: Document
      type: object
    RequestImageBlock:
      additionalProperties: false
      properties:
        cache_control:
          anyOf:
            - discriminator:
                mapping:
                  ephemeral: '#/components/schemas/CacheControlEphemeral'
                propertyName: type
              oneOf:
                - $ref: '#/components/schemas/CacheControlEphemeral'
            - type: 'null'
          description: Create a cache control breakpoint at this content block.
          title: Cache Control
        source:
          discriminator:
            mapping:
              base64: '#/components/schemas/Base64ImageSource'
              file: '#/components/schemas/FileImageSource'
              url: '#/components/schemas/URLImageSource'
            propertyName: type
          oneOf:
            - $ref: '#/components/schemas/Base64ImageSource'
            - $ref: '#/components/schemas/URLImageSource'
            - $ref: '#/components/schemas/FileImageSource'
          title: Source
        type:
          const: image
          enum:
            - image
          title: Type
          type: string
      required:
        - source
        - type
      title: Image
      type: object
    RequestMCPToolResultBlock:
      additionalProperties: false
      properties:
        cache_control:
          anyOf:
            - discriminator:
                mapping:
                  ephemeral: '#/components/schemas/CacheControlEphemeral'
                propertyName: type
              oneOf:
                - $ref: '#/components/schemas/CacheControlEphemeral'
            - type: 'null'
          description: Create a cache control breakpoint at this content block.
          title: Cache Control
        content:
          anyOf:
            - type: string
            - items:
                $ref: '#/components/schemas/RequestTextBlock'
              type: array
          title: Content
        is_error:
          title: Is Error
          type: boolean
        tool_use_id:
          pattern: ^[a-zA-Z0-9_-]+$
          title: Tool Use Id
          type: string
        type:
          const: mcp_tool_result
          enum:
            - mcp_tool_result
          title: Type
          type: string
      required:
        - tool_use_id
        - type
      title: MCP tool result
      type: object
    RequestMCPToolUseBlock:
      additionalProperties: false
      properties:
        cache_control:
          anyOf:
            - discriminator:
                mapping:
                  ephemeral: '#/components/schemas/CacheControlEphemeral'
                propertyName: type
              oneOf:
                - $ref: '#/components/schemas/CacheControlEphemeral'
            - type: 'null'
          description: Create a cache control breakpoint at this content block.
          title: Cache Control
        id:
          pattern: ^[a-zA-Z0-9_-]+$
          title: Id
          type: string
        input:
          title: Input
          type: object
        name:
          title: Name
          type: string
        server_name:
          description: The name of the MCP server
          title: Server Name
          type: string
        type:
          const: mcp_tool_use
          enum:
            - mcp_tool_use
          title: Type
          type: string
      required:
        - id
        - input
        - name
        - server_name
        - type
      title: MCP tool use
      type: object
    RequestPageLocationCitation:
      additionalProperties: false
      properties:
        cited_text:
          title: Cited Text
          type: string
        document_index:
          minimum: 0
          title: Document Index
          type: integer
        document_title:
          anyOf:
            - maxLength: 255
              minLength: 1
              type: string
            - type: 'null'
          title: Document Title
        end_page_number:
          title: End Page Number
          type: integer
        start_page_number:
          minimum: 1
          title: Start Page Number
          type: integer
        type:
          const: page_location
          enum:
            - page_location
          title: Type
          type: string
      required:
        - cited_text
        - document_index
        - document_title
        - end_page_number
        - start_page_number
        - type
      title: Page location
      type: object
    RequestRedactedThinkingBlock:
      additionalProperties: false
      properties:
        data:
          title: Data
          type: string
        type:
          const: redacted_thinking
          enum:
            - redacted_thinking
          title: Type
          type: string
      required:
        - data
        - type
      title: Redacted thinking
      type: object
    RequestSearchResultBlock:
      additionalProperties: false
      properties:
        cache_control:
          anyOf:
            - discriminator:
                mapping:
                  ephemeral: '#/components/schemas/CacheControlEphemeral'
                propertyName: type
              oneOf:
                - $ref: '#/components/schemas/CacheControlEphemeral'
            - type: 'null'
          description: Create a cache control breakpoint at this content block.
          title: Cache Control
        citations:
          $ref: '#/components/schemas/RequestCitationsConfig'
        content:
          items:
            $ref: '#/components/schemas/RequestTextBlock'
          title: Content
          type: array
        source:
          title: Source
          type: string
        title:
          title: Title
          type: string
        type:
          const: search_result
          enum:
            - search_result
          title: Type
          type: string
      required:
        - content
        - source
        - title
        - type
      title: RequestSearchResultBlock
      type: object
    RequestSearchResultLocationCitation:
      properties:
        cited_text:
          title: Cited Text
          type: string
        end_block_index:
          title: End Block Index
          type: integer
        search_result_index:
          minimum: 0
          title: Search Result Index
          type: integer
        source:
          title: Source
          type: string
        start_block_index:
          minimum: 0
          title: Start Block Index
          type: integer
        title:
          anyOf:
            - type: string
            - type: 'null'
          title: Title
        type:
          const: search_result_location
          default: search_result_location
          enum:
            - search_result_location
          title: Type
          type: string
      required:
        - cited_text
        - end_block_index
        - search_result_index
        - source
        - start_block_index
        - title
        - type
      title: RequestSearchResultLocationCitation
      type: object
    RequestServerToolUseBlock:
      additionalProperties: false
      properties:
        cache_control:
          anyOf:
            - discriminator:
                mapping:
                  ephemeral: '#/components/schemas/CacheControlEphemeral'
                propertyName: type
              oneOf:
                - $ref: '#/components/schemas/CacheControlEphemeral'
            - type: 'null'
          description: Create a cache control breakpoint at this content block.
          title: Cache Control
        id:
          pattern: ^srvtoolu_[a-zA-Z0-9_]+$
          title: Id
          type: string
        input:
          title: Input
          type: object
        name:
          enum:
            - web_search
            - code_execution
          title: Name
          type: string
        type:
          const: server_tool_use
          enum:
            - server_tool_use
          title: Type
          type: string
      required:
        - id
        - input
        - name
        - type
      title: Server tool use
      type: object
    RequestTextBlock:
      additionalProperties: false
      properties:
        cache_control:
          anyOf:
            - discriminator:
                mapping:
                  ephemeral: '#/components/schemas/CacheControlEphemeral'
                propertyName: type
              oneOf:
                - $ref: '#/components/schemas/CacheControlEphemeral'
            - type: 'null'
          description: Create a cache control breakpoint at this content block.
          title: Cache Control
        citations:
          anyOf:
            - items:
                discriminator:
                  mapping:
                    char_location: '#/components/schemas/RequestCharLocationCitation'
                    content_block_location: '#/components/schemas/RequestContentBlockLocationCitation'
                    page_location: '#/components/schemas/RequestPageLocationCitation'
                    search_result_location: '#/components/schemas/RequestSearchResultLocationCitation'
                    web_search_result_location: >-
                      #/components/schemas/RequestWebSearchResultLocationCitation
                  propertyName: type
                oneOf:
                  - $ref: '#/components/schemas/RequestCharLocationCitation'
                  - $ref: '#/components/schemas/RequestPageLocationCitation'
                  - $ref: '#/components/schemas/RequestContentBlockLocationCitation'
                  - $ref: >-
                      #/components/schemas/RequestWebSearchResultLocationCitation
                  - $ref: '#/components/schemas/RequestSearchResultLocationCitation'
              type: array
            - type: 'null'
          title: Citations
        text:
          minLength: 1
          title: Text
          type: string
        type:
          const: text
          enum:
            - text
          title: Type
          type: string
      required:
        - text
        - type
      title: Text
      type: object
    RequestThinkingBlock:
      additionalProperties: false
      properties:
        signature:
          title: Signature
          type: string
        thinking:
          title: Thinking
          type: string
        type:
          const: thinking
          enum:
            - thinking
          title: Type
          type: string
      required:
        - signature
        - thinking
        - type
      title: Thinking
      type: object
    RequestToolResultBlock:
      additionalProperties: false
      properties:
        cache_control:
          anyOf:
            - discriminator:
                mapping:
                  ephemeral: '#/components/schemas/CacheControlEphemeral'
                propertyName: type
              oneOf:
                - $ref: '#/components/schemas/CacheControlEphemeral'
            - type: 'null'
          description: Create a cache control breakpoint at this content block.
          title: Cache Control
        content:
          anyOf:
            - type: string
            - items:
                discriminator:
                  mapping:
                    image: '#/components/schemas/RequestImageBlock'
                    search_result: '#/components/schemas/RequestSearchResultBlock'
                    text: '#/components/schemas/RequestTextBlock'
                  propertyName: type
                oneOf:
                  - $ref: '#/components/schemas/RequestTextBlock'
                  - $ref: '#/components/schemas/RequestImageBlock'
                  - $ref: '#/components/schemas/RequestSearchResultBlock'
              type: array
          title: Content
        is_error:
          title: Is Error
          type: boolean
        tool_use_id:
          pattern: ^[a-zA-Z0-9_-]+$
          title: Tool Use Id
          type: string
        type:
          const: tool_result
          enum:
            - tool_result
          title: Type
          type: string
      required:
        - tool_use_id
        - type
      title: Tool result
      type: object
    RequestToolUseBlock:
      additionalProperties: false
      properties:
        cache_control:
          anyOf:
            - discriminator:
                mapping:
                  ephemeral: '#/components/schemas/CacheControlEphemeral'
                propertyName: type
              oneOf:
                - $ref: '#/components/schemas/CacheControlEphemeral'
            - type: 'null'
          description: Create a cache control breakpoint at this content block.
          title: Cache Control
        id:
          pattern: ^[a-zA-Z0-9_-]+$
          title: Id
          type: string
        input:
          title: Input
          type: object
        name:
          maxLength: 200
          minLength: 1
          title: Name
          type: string
        type:
          const: tool_use
          enum:
            - tool_use
          title: Type
          type: string
      required:
        - id
        - input
        - name
        - type
      title: Tool use
      type: object
    RequestWebSearchResultBlock:
      additionalProperties: false
      properties:
        encrypted_content:
          title: Encrypted Content
          type: string
        page_age:
          anyOf:
            - type: string
            - type: 'null'
          title: Page Age
        title:
          title: Title
          type: string
        type:
          const: web_search_result
          enum:
            - web_search_result
          title: Type
          type: string
        url:
          title: Url
          type: string
      required:
        - encrypted_content
        - title
        - type
        - url
      title: RequestWebSearchResultBlock
      type: object
    RequestWebSearchResultLocationCitation:
      additionalProperties: false
      properties:
        cited_text:
          title: Cited Text
          type: string
        encrypted_index:
          title: Encrypted Index
          type: string
        title:
          anyOf:
            - maxLength: 512
              minLength: 1
              type: string
            - type: 'null'
          title: Title
        type:
          const: web_search_result_location
          enum:
            - web_search_result_location
          title: Type
          type: string
        url:
          maxLength: 2048
          minLength: 1
          title: Url
          type: string
      required:
        - cited_text
        - encrypted_index
        - title
        - type
        - url
      title: RequestWebSearchResultLocationCitation
      type: object
    RequestWebSearchToolResultBlock:
      additionalProperties: false
      properties:
        cache_control:
          anyOf:
            - discriminator:
                mapping:
                  ephemeral: '#/components/schemas/CacheControlEphemeral'
                propertyName: type
              oneOf:
                - $ref: '#/components/schemas/CacheControlEphemeral'
            - type: 'null'
          description: Create a cache control breakpoint at this content block.
          title: Cache Control
        content:
          anyOf:
            - items:
                $ref: '#/components/schemas/RequestWebSearchResultBlock'
              type: array
            - $ref: '#/components/schemas/RequestWebSearchToolResultError'
          title: Content
        tool_use_id:
          pattern: ^srvtoolu_[a-zA-Z0-9_]+$
          title: Tool Use Id
          type: string
        type:
          const: web_search_tool_result
          enum:
            - web_search_tool_result
          title: Type
          type: string
      required:
        - content
        - tool_use_id
        - type
      title: Web search tool result
      type: object
    RequestWebSearchToolResultError:
      additionalProperties: false
      properties:
        error_code:
          $ref: '#/components/schemas/WebSearchToolResultErrorCode'
        type:
          const: web_search_tool_result_error
          enum:
            - web_search_tool_result_error
          title: Type
          type: string
      required:
        - error_code
        - type
      title: RequestWebSearchToolResultError
      type: object
    ServerToolUsage:
      properties:
        web_search_requests:
          default: 0
          description: The number of web search tool requests.
          examples:
            - 0
          minimum: 0
          title: Web Search Requests
          type: integer
      required:
        - web_search_requests
      title: ServerToolUsage
      type: object
    URLImageSource:
      additionalProperties: false
      properties:
        type:
          const: url
          enum:
            - url
          title: Type
          type: string
        url:
          title: Url
          type: string
      required:
        - type
        - url
      title: URLImageSource
      type: object
    URLPDFSource:
      additionalProperties: false
      properties:
        type:
          const: url
          enum:
            - url
          title: Type
          type: string
        url:
          title: Url
          type: string
      required:
        - type
        - url
      title: PDF (URL)
      type: object
    Usage:
      properties:
        cache_creation:
          anyOf:
            - $ref: '#/components/schemas/CacheCreation'
            - type: 'null'
          default: null
          description: Breakdown of cached tokens by TTL
        cache_creation_input_tokens:
          anyOf:
            - minimum: 0
              type: integer
            - type: 'null'
          default: null
          description: The number of input tokens used to create the cache entry.
          examples:
            - 2051
          title: Cache Creation Input Tokens
        cache_read_input_tokens:
          anyOf:
            - minimum: 0
              type: integer
            - type: 'null'
          default: null
          description: The number of input tokens read from the cache.
          examples:
            - 2051
          title: Cache Read Input Tokens
        input_tokens:
          description: The number of input tokens which were used.
          examples:
            - 2095
          minimum: 0
          title: Input Tokens
          type: integer
        output_tokens:
          description: The number of output tokens which were used.
          examples:
            - 503
          minimum: 0
          title: Output Tokens
          type: integer
        server_tool_use:
          anyOf:
            - $ref: '#/components/schemas/ServerToolUsage'
            - type: 'null'
          default: null
          description: The number of server tool requests.
        service_tier:
          anyOf:
            - enum:
                - standard
                - priority
                - batch
              type: string
            - type: 'null'
          default: null
          description: If the request used the priority, standard, or batch tier.
          title: Service Tier
      required:
        - cache_creation
        - cache_creation_input_tokens
        - cache_read_input_tokens
        - input_tokens
        - output_tokens
        - server_tool_use
        - service_tier
      title: Usage
      type: object
    WebSearchToolResultErrorCode:
      enum:
        - invalid_tool_input
        - unavailable
        - max_uses_exceeded
        - too_many_requests
        - query_too_long
      title: WebSearchToolResultErrorCode
      type: string

````

# Templatize a prompt

> Templatize a prompt by indentifying and extracting variables

## OpenAPI

````yaml post /v1/experimental/templatize_prompt
paths:
  path: /v1/experimental/templatize_prompt
  method: post
  servers:
    - url: https://api.anthropic.com
  request:
    security: []
    parameters:
      path: {}
      query: {}
      header:
        anthropic-beta:
          schema:
            - type: array
              items:
                allOf:
                  - type: string
              required: false
              title: Anthropic-Beta
              description: >-
                Optional header to specify the beta version(s) you want to use.


                To use multiple betas, use a comma separated list like
                `beta1,beta2` or specify the header multiple times for each
                beta.
        x-api-key:
          schema:
            - type: string
              required: true
              title: X-Api-Key
              description: >-
                Your unique API key for authentication.


                This key is required in the header of all API requests, to
                authenticate your account and access Anthropic's services. Get
                your API key through the
                [Console](https://console.anthropic.com/settings/keys). Each key
                is scoped to a Workspace.
      cookie: {}
    body:
      application/json:
        schemaArray:
          - type: object
            properties:
              messages:
                allOf:
                  - description: >-
                      The prompt to templatize, structured as a list of
                      `message` objects.


                      Each message in the `messages` array must:

                      - Contain only text-only content blocks

                      - Not include tool calls, images, or prompt caching blocks


                      Example of a simple text prompt:


                      ```json

                      [
                        {
                          "role": "user", 
                          "content": [
                            {
                              "type": "text",
                              "text": "Translate hello to German"
                            }
                          ]
                        }
                      ]

                      ```


                      Note that only contiguous user messages with text content
                      are allowed. Assistant prefill is permitted, but other
                      content types will cause validation errors.
                    examples:
                      - - content:
                            - text: Translate hello to German
                              type: text
                          role: user
                    items:
                      $ref: '#/components/schemas/InputMessage'
                    title: Messages
                    type: array
              system:
                allOf:
                  - anyOf:
                      - type: string
                      - type: 'null'
                    default: null
                    description: >-
                      The existing system prompt to templatize.


                      ```json

                      {
                        "system": "You are a professional English to German translator",
                        [...]
                      }

                      ```


                      Note that this differs from the Messages API; it is
                      strictly a string.
                    examples:
                      - You are a professional English to German translator
                    title: System
            required: true
            title: TemplatizePromptParams
            requiredProperties:
              - messages
        examples:
          example:
            value:
              messages:
                - content:
                    - text: Translate hello to German
                      type: text
                  role: user
              system: You are a professional English to German translator
    codeSamples:
      - lang: bash
        source: >-
          curl -X POST
          https://api.anthropic.com/v1/experimental/templatize_prompt \
               --header "x-api-key: $ANTHROPIC_API_KEY" \
               --header "anthropic-version: 2023-06-01" \
               --header "anthropic-beta: prompt-tools-2025-04-02" \
               --header "content-type: application/json" \
               --data \
          '{
              "messages": [{"role": "user", "content": "Translate hello to German"}],
              "system": "You are an English to German translator"
          }'
      - lang: python
        source: |-
          import requests

          response = requests.post(
              "https://api.anthropic.com/v1/experimental/templatize_prompt",
              headers={
                  "Content-Type": "application/json", 
                  "x-api-key": "$ANTHROPIC_API_KEY",
                  "anthropic-version": "2023-06-01",
                  "anthropic-beta": "prompt-tools-2025-04-02"
              },
              json={
                  "messages": [{"role": "user", "content": "Translate hello to German"}],
                  "system": "You are an English to German translator"
              }
          )
      - lang: javascript
        source: >-
          const response = await
          fetch('https://api.anthropic.com/v1/experimental/templatize_prompt', {
            method: 'POST',
            headers: {
              'x-api-key': '$ANTHROPIC_API_KEY',
              'anthropic-version': '2023-06-01',
              'anthropic-beta': 'prompt-tools-2025-04-02',
              'content-type': 'application/json'
            },
            body: JSON.stringify({
              'messages': [{"role": "user", "content": "Translate hello to German"}],
              'system': "You are an English to German translator"
            })
          });


          const data = await response.json();
  response:
    '200':
      application/json:
        schemaArray:
          - type: object
            properties:
              messages:
                allOf:
                  - description: >-
                      The templatized prompt with variable placeholders.


                      The response includes the input messages with specific
                      values replaced by variable placeholders. These messages
                      maintain the original message structure but contain
                      uppercase variable names in place of concrete values.


                      For example, an input message content like `"Translate
                      hello to German"` would be transformed to `"Translate
                      {{WORD_TO_TRANSLATE}} to {{TARGET_LANGUAGE}}"`.


                      ```json

                      {
                        "messages": [
                          {
                            "role": "user",
                            "content": [
                              {
                                "type": "text",
                                "text": "Translate {{WORD_TO_TRANSLATE}} to {{TARGET_LANGUAGE}}"
                              }
                            ]
                          }
                        ]
                      }

                      ```
                    examples:
                      - - content:
                            - text: >-
                                Translate {{WORD_TO_TRANSLATE}} to
                                {{TARGET_LANGUAGE}}
                              type: text
                          role: user
                    items:
                      $ref: '#/components/schemas/InputMessage'
                    title: Messages
                    type: array
              system:
                allOf:
                  - description: >-
                      The input system prompt with variables identified and
                      replaced.


                      If no system prompt was provided in the original request,
                      this field will be an empty string.
                    examples:
                      - >-
                        You are a professional English to {{TARGET_LANGUAGE}}
                        translator
                    title: System
                    type: string
              usage:
                allOf:
                  - $ref: '#/components/schemas/Usage'
                    description: Usage information
                    examples:
                      - - input_tokens: 490
                          output_tokens: 661
              variable_values:
                allOf:
                  - additionalProperties:
                      type: string
                    description: >-
                      A mapping of template variable names to their original
                      values, as extracted from the input prompt during
                      templatization. Each key represents a variable name
                      identified in the templatized prompt, and each value
                      contains the corresponding content from the original
                      prompt that was replaced by that variable.


                      Example:


                      ```json

                      "variable_values": {
                        "WORD_TO_TRANSLATE": "hello",
                        "TARGET_LANGUAGE": "German"
                      }

                      ```


                      In this example response, the original prompt – `Translate
                      hello to German` – was templatized to `Translate
                      WORD_TO_TRANSLATE to TARGET_LANGUAGE`, with the variable
                      values extracted as shown.
                    examples:
                      - TARGET_LANGUAGE: German
                        WORD_TO_TRANSLATE: hello
                    title: Variable Values
                    type: object
            title: TemplatizePromptResponse
            requiredProperties:
              - messages
              - system
              - usage
              - variable_values
        examples:
          example:
            value:
              messages:
                - content:
                    - text: Translate {{WORD_TO_TRANSLATE}} to {{TARGET_LANGUAGE}}
                      type: text
                  role: user
              system: You are a professional English to {{TARGET_LANGUAGE}} translator
              usage:
                - input_tokens: 490
                  output_tokens: 661
              variable_values:
                TARGET_LANGUAGE: German
                WORD_TO_TRANSLATE: hello
        description: Successful Response
    4XX:
      application/json:
        schemaArray:
          - type: object
            properties:
              error:
                allOf:
                  - discriminator:
                      mapping:
                        api_error: '#/components/schemas/APIError'
                        authentication_error: '#/components/schemas/AuthenticationError'
                        billing_error: '#/components/schemas/BillingError'
                        invalid_request_error: '#/components/schemas/InvalidRequestError'
                        not_found_error: '#/components/schemas/NotFoundError'
                        overloaded_error: '#/components/schemas/OverloadedError'
                        permission_error: '#/components/schemas/PermissionError'
                        rate_limit_error: '#/components/schemas/RateLimitError'
                        timeout_error: '#/components/schemas/GatewayTimeoutError'
                      propertyName: type
                    oneOf:
                      - $ref: '#/components/schemas/InvalidRequestError'
                      - $ref: '#/components/schemas/AuthenticationError'
                      - $ref: '#/components/schemas/BillingError'
                      - $ref: '#/components/schemas/PermissionError'
                      - $ref: '#/components/schemas/NotFoundError'
                      - $ref: '#/components/schemas/RateLimitError'
                      - $ref: '#/components/schemas/GatewayTimeoutError'
                      - $ref: '#/components/schemas/APIError'
                      - $ref: '#/components/schemas/OverloadedError'
                    title: Error
              type:
                allOf:
                  - const: error
                    default: error
                    enum:
                      - error
                    title: Type
                    type: string
            title: ErrorResponse
            requiredProperties:
              - error
              - type
        examples:
          example:
            value:
              error:
                message: Invalid request
                type: invalid_request_error
              type: error
        description: >-
          Error response.


          See our [errors
          documentation](https://docs.anthropic.com/en/api/errors) for more
          details.
  deprecated: false
  type: path
components:
  schemas:
    APIError:
      properties:
        message:
          default: Internal server error
          title: Message
          type: string
        type:
          const: api_error
          default: api_error
          enum:
            - api_error
          title: Type
          type: string
      required:
        - message
        - type
      title: APIError
      type: object
    AuthenticationError:
      properties:
        message:
          default: Authentication error
          title: Message
          type: string
        type:
          const: authentication_error
          default: authentication_error
          enum:
            - authentication_error
          title: Type
          type: string
      required:
        - message
        - type
      title: AuthenticationError
      type: object
    Base64ImageSource:
      additionalProperties: false
      properties:
        data:
          format: byte
          title: Data
          type: string
        media_type:
          enum:
            - image/jpeg
            - image/png
            - image/gif
            - image/webp
          title: Media Type
          type: string
        type:
          const: base64
          enum:
            - base64
          title: Type
          type: string
      required:
        - data
        - media_type
        - type
      title: Base64ImageSource
      type: object
    Base64PDFSource:
      additionalProperties: false
      properties:
        data:
          format: byte
          title: Data
          type: string
        media_type:
          const: application/pdf
          enum:
            - application/pdf
          title: Media Type
          type: string
        type:
          const: base64
          enum:
            - base64
          title: Type
          type: string
      required:
        - data
        - media_type
        - type
      title: PDF (base64)
      type: object
    BillingError:
      properties:
        message:
          default: Billing error
          title: Message
          type: string
        type:
          const: billing_error
          default: billing_error
          enum:
            - billing_error
          title: Type
          type: string
      required:
        - message
        - type
      title: BillingError
      type: object
    CacheControlEphemeral:
      additionalProperties: false
      properties:
        ttl:
          description: |-
            The time-to-live for the cache control breakpoint.

            This may be one the following values:
            - `5m`: 5 minutes
            - `1h`: 1 hour

            Defaults to `5m`.
          enum:
            - 5m
            - 1h
          title: Ttl
          type: string
        type:
          const: ephemeral
          enum:
            - ephemeral
          title: Type
          type: string
      required:
        - type
      title: CacheControlEphemeral
      type: object
    CacheCreation:
      properties:
        ephemeral_1h_input_tokens:
          default: 0
          description: The number of input tokens used to create the 1 hour cache entry.
          minimum: 0
          title: Ephemeral 1H Input Tokens
          type: integer
        ephemeral_5m_input_tokens:
          default: 0
          description: The number of input tokens used to create the 5 minute cache entry.
          minimum: 0
          title: Ephemeral 5M Input Tokens
          type: integer
      required:
        - ephemeral_1h_input_tokens
        - ephemeral_5m_input_tokens
      title: CacheCreation
      type: object
    CodeExecutionToolResultErrorCode:
      enum:
        - invalid_tool_input
        - unavailable
        - too_many_requests
        - execution_time_exceeded
      title: CodeExecutionToolResultErrorCode
      type: string
    ContentBlockSource:
      additionalProperties: false
      properties:
        content:
          anyOf:
            - type: string
            - items:
                discriminator:
                  mapping:
                    image: '#/components/schemas/RequestImageBlock'
                    text: '#/components/schemas/RequestTextBlock'
                  propertyName: type
                oneOf:
                  - $ref: '#/components/schemas/RequestTextBlock'
                  - $ref: '#/components/schemas/RequestImageBlock'
              type: array
          title: Content
        type:
          const: content
          enum:
            - content
          title: Type
          type: string
      required:
        - content
        - type
      title: Content block
      type: object
    FileDocumentSource:
      additionalProperties: false
      properties:
        file_id:
          title: File Id
          type: string
        type:
          const: file
          enum:
            - file
          title: Type
          type: string
      required:
        - file_id
        - type
      title: File document
      type: object
    FileImageSource:
      additionalProperties: false
      properties:
        file_id:
          title: File Id
          type: string
        type:
          const: file
          enum:
            - file
          title: Type
          type: string
      required:
        - file_id
        - type
      title: FileImageSource
      type: object
    GatewayTimeoutError:
      properties:
        message:
          default: Request timeout
          title: Message
          type: string
        type:
          const: timeout_error
          default: timeout_error
          enum:
            - timeout_error
          title: Type
          type: string
      required:
        - message
        - type
      title: GatewayTimeoutError
      type: object
    InputMessage:
      additionalProperties: false
      properties:
        content:
          anyOf:
            - type: string
            - items:
                discriminator:
                  mapping:
                    code_execution_tool_result: '#/components/schemas/RequestCodeExecutionToolResultBlock'
                    container_upload: '#/components/schemas/RequestContainerUploadBlock'
                    document: '#/components/schemas/RequestDocumentBlock'
                    image: '#/components/schemas/RequestImageBlock'
                    mcp_tool_result: '#/components/schemas/RequestMCPToolResultBlock'
                    mcp_tool_use: '#/components/schemas/RequestMCPToolUseBlock'
                    redacted_thinking: '#/components/schemas/RequestRedactedThinkingBlock'
                    search_result: '#/components/schemas/RequestSearchResultBlock'
                    server_tool_use: '#/components/schemas/RequestServerToolUseBlock'
                    text: '#/components/schemas/RequestTextBlock'
                    thinking: '#/components/schemas/RequestThinkingBlock'
                    tool_result: '#/components/schemas/RequestToolResultBlock'
                    tool_use: '#/components/schemas/RequestToolUseBlock'
                    web_search_tool_result: '#/components/schemas/RequestWebSearchToolResultBlock'
                  propertyName: type
                oneOf:
                  - $ref: '#/components/schemas/RequestTextBlock'
                    description: Regular text content.
                  - $ref: '#/components/schemas/RequestImageBlock'
                    description: >-
                      Image content specified directly as base64 data or as a
                      reference via a URL.
                  - $ref: '#/components/schemas/RequestDocumentBlock'
                    description: >-
                      Document content, either specified directly as base64
                      data, as text, or as a reference via a URL.
                  - $ref: '#/components/schemas/RequestSearchResultBlock'
                    description: >-
                      A search result block containing source, title, and
                      content from search operations.
                  - $ref: '#/components/schemas/RequestThinkingBlock'
                    description: A block specifying internal thinking by the model.
                  - $ref: '#/components/schemas/RequestRedactedThinkingBlock'
                    description: >-
                      A block specifying internal, redacted thinking by the
                      model.
                  - $ref: '#/components/schemas/RequestToolUseBlock'
                    description: A block indicating a tool use by the model.
                  - $ref: '#/components/schemas/RequestToolResultBlock'
                    description: A block specifying the results of a tool use by the model.
                  - $ref: '#/components/schemas/RequestServerToolUseBlock'
                  - $ref: '#/components/schemas/RequestWebSearchToolResultBlock'
                  - $ref: '#/components/schemas/RequestCodeExecutionToolResultBlock'
                  - $ref: '#/components/schemas/RequestMCPToolUseBlock'
                  - $ref: '#/components/schemas/RequestMCPToolResultBlock'
                  - $ref: '#/components/schemas/RequestContainerUploadBlock'
              type: array
          title: Content
        role:
          enum:
            - user
            - assistant
          title: Role
          type: string
      required:
        - content
        - role
      title: InputMessage
      type: object
    InvalidRequestError:
      properties:
        message:
          default: Invalid request
          title: Message
          type: string
        type:
          const: invalid_request_error
          default: invalid_request_error
          enum:
            - invalid_request_error
          title: Type
          type: string
      required:
        - message
        - type
      title: InvalidRequestError
      type: object
    NotFoundError:
      properties:
        message:
          default: Not found
          title: Message
          type: string
        type:
          const: not_found_error
          default: not_found_error
          enum:
            - not_found_error
          title: Type
          type: string
      required:
        - message
        - type
      title: NotFoundError
      type: object
    OverloadedError:
      properties:
        message:
          default: Overloaded
          title: Message
          type: string
        type:
          const: overloaded_error
          default: overloaded_error
          enum:
            - overloaded_error
          title: Type
          type: string
      required:
        - message
        - type
      title: OverloadedError
      type: object
    PermissionError:
      properties:
        message:
          default: Permission denied
          title: Message
          type: string
        type:
          const: permission_error
          default: permission_error
          enum:
            - permission_error
          title: Type
          type: string
      required:
        - message
        - type
      title: PermissionError
      type: object
    PlainTextSource:
      additionalProperties: false
      properties:
        data:
          title: Data
          type: string
        media_type:
          const: text/plain
          enum:
            - text/plain
          title: Media Type
          type: string
        type:
          const: text
          enum:
            - text
          title: Type
          type: string
      required:
        - data
        - media_type
        - type
      title: Plain text
      type: object
    RateLimitError:
      properties:
        message:
          default: Rate limited
          title: Message
          type: string
        type:
          const: rate_limit_error
          default: rate_limit_error
          enum:
            - rate_limit_error
          title: Type
          type: string
      required:
        - message
        - type
      title: RateLimitError
      type: object
    RequestCharLocationCitation:
      additionalProperties: false
      properties:
        cited_text:
          title: Cited Text
          type: string
        document_index:
          minimum: 0
          title: Document Index
          type: integer
        document_title:
          anyOf:
            - maxLength: 255
              minLength: 1
              type: string
            - type: 'null'
          title: Document Title
        end_char_index:
          title: End Char Index
          type: integer
        start_char_index:
          minimum: 0
          title: Start Char Index
          type: integer
        type:
          const: char_location
          enum:
            - char_location
          title: Type
          type: string
      required:
        - cited_text
        - document_index
        - document_title
        - end_char_index
        - start_char_index
        - type
      title: Character location
      type: object
    RequestCitationsConfig:
      additionalProperties: false
      properties:
        enabled:
          title: Enabled
          type: boolean
      title: RequestCitationsConfig
      type: object
    RequestCodeExecutionOutputBlock:
      additionalProperties: false
      properties:
        file_id:
          title: File Id
          type: string
        type:
          const: code_execution_output
          enum:
            - code_execution_output
          title: Type
          type: string
      required:
        - file_id
        - type
      title: RequestCodeExecutionOutputBlock
      type: object
    RequestCodeExecutionResultBlock:
      additionalProperties: false
      properties:
        content:
          items:
            $ref: '#/components/schemas/RequestCodeExecutionOutputBlock'
          title: Content
          type: array
        return_code:
          title: Return Code
          type: integer
        stderr:
          title: Stderr
          type: string
        stdout:
          title: Stdout
          type: string
        type:
          const: code_execution_result
          enum:
            - code_execution_result
          title: Type
          type: string
      required:
        - content
        - return_code
        - stderr
        - stdout
        - type
      title: Code execution result
      type: object
    RequestCodeExecutionToolResultBlock:
      additionalProperties: false
      properties:
        cache_control:
          anyOf:
            - discriminator:
                mapping:
                  ephemeral: '#/components/schemas/CacheControlEphemeral'
                propertyName: type
              oneOf:
                - $ref: '#/components/schemas/CacheControlEphemeral'
            - type: 'null'
          description: Create a cache control breakpoint at this content block.
          title: Cache Control
        content:
          anyOf:
            - $ref: '#/components/schemas/RequestCodeExecutionToolResultError'
            - $ref: '#/components/schemas/RequestCodeExecutionResultBlock'
          title: Content
        tool_use_id:
          pattern: ^srvtoolu_[a-zA-Z0-9_]+$
          title: Tool Use Id
          type: string
        type:
          const: code_execution_tool_result
          enum:
            - code_execution_tool_result
          title: Type
          type: string
      required:
        - content
        - tool_use_id
        - type
      title: Code execution tool result
      type: object
    RequestCodeExecutionToolResultError:
      additionalProperties: false
      properties:
        error_code:
          $ref: '#/components/schemas/CodeExecutionToolResultErrorCode'
        type:
          const: code_execution_tool_result_error
          enum:
            - code_execution_tool_result_error
          title: Type
          type: string
      required:
        - error_code
        - type
      title: Code execution tool error
      type: object
    RequestContainerUploadBlock:
      additionalProperties: false
      description: >-
        A content block that represents a file to be uploaded to the container

        Files uploaded via this block will be available in the container's input
        directory.
      properties:
        cache_control:
          anyOf:
            - discriminator:
                mapping:
                  ephemeral: '#/components/schemas/CacheControlEphemeral'
                propertyName: type
              oneOf:
                - $ref: '#/components/schemas/CacheControlEphemeral'
            - type: 'null'
          description: Create a cache control breakpoint at this content block.
          title: Cache Control
        file_id:
          title: File Id
          type: string
        type:
          const: container_upload
          enum:
            - container_upload
          title: Type
          type: string
      required:
        - file_id
        - type
      title: Container upload
      type: object
    RequestContentBlockLocationCitation:
      additionalProperties: false
      properties:
        cited_text:
          title: Cited Text
          type: string
        document_index:
          minimum: 0
          title: Document Index
          type: integer
        document_title:
          anyOf:
            - maxLength: 255
              minLength: 1
              type: string
            - type: 'null'
          title: Document Title
        end_block_index:
          title: End Block Index
          type: integer
        start_block_index:
          minimum: 0
          title: Start Block Index
          type: integer
        type:
          const: content_block_location
          enum:
            - content_block_location
          title: Type
          type: string
      required:
        - cited_text
        - document_index
        - document_title
        - end_block_index
        - start_block_index
        - type
      title: Content block location
      type: object
    RequestDocumentBlock:
      additionalProperties: false
      properties:
        cache_control:
          anyOf:
            - discriminator:
                mapping:
                  ephemeral: '#/components/schemas/CacheControlEphemeral'
                propertyName: type
              oneOf:
                - $ref: '#/components/schemas/CacheControlEphemeral'
            - type: 'null'
          description: Create a cache control breakpoint at this content block.
          title: Cache Control
        citations:
          $ref: '#/components/schemas/RequestCitationsConfig'
        context:
          anyOf:
            - minLength: 1
              type: string
            - type: 'null'
          title: Context
        source:
          discriminator:
            mapping:
              base64: '#/components/schemas/Base64PDFSource'
              content: '#/components/schemas/ContentBlockSource'
              file: '#/components/schemas/FileDocumentSource'
              text: '#/components/schemas/PlainTextSource'
              url: '#/components/schemas/URLPDFSource'
            propertyName: type
          oneOf:
            - $ref: '#/components/schemas/Base64PDFSource'
            - $ref: '#/components/schemas/PlainTextSource'
            - $ref: '#/components/schemas/ContentBlockSource'
            - $ref: '#/components/schemas/URLPDFSource'
            - $ref: '#/components/schemas/FileDocumentSource'
        title:
          anyOf:
            - maxLength: 500
              minLength: 1
              type: string
            - type: 'null'
          title: Title
        type:
          const: document
          enum:
            - document
          title: Type
          type: string
      required:
        - source
        - type
      title: Document
      type: object
    RequestImageBlock:
      additionalProperties: false
      properties:
        cache_control:
          anyOf:
            - discriminator:
                mapping:
                  ephemeral: '#/components/schemas/CacheControlEphemeral'
                propertyName: type
              oneOf:
                - $ref: '#/components/schemas/CacheControlEphemeral'
            - type: 'null'
          description: Create a cache control breakpoint at this content block.
          title: Cache Control
        source:
          discriminator:
            mapping:
              base64: '#/components/schemas/Base64ImageSource'
              file: '#/components/schemas/FileImageSource'
              url: '#/components/schemas/URLImageSource'
            propertyName: type
          oneOf:
            - $ref: '#/components/schemas/Base64ImageSource'
            - $ref: '#/components/schemas/URLImageSource'
            - $ref: '#/components/schemas/FileImageSource'
          title: Source
        type:
          const: image
          enum:
            - image
          title: Type
          type: string
      required:
        - source
        - type
      title: Image
      type: object
    RequestMCPToolResultBlock:
      additionalProperties: false
      properties:
        cache_control:
          anyOf:
            - discriminator:
                mapping:
                  ephemeral: '#/components/schemas/CacheControlEphemeral'
                propertyName: type
              oneOf:
                - $ref: '#/components/schemas/CacheControlEphemeral'
            - type: 'null'
          description: Create a cache control breakpoint at this content block.
          title: Cache Control
        content:
          anyOf:
            - type: string
            - items:
                $ref: '#/components/schemas/RequestTextBlock'
              type: array
          title: Content
        is_error:
          title: Is Error
          type: boolean
        tool_use_id:
          pattern: ^[a-zA-Z0-9_-]+$
          title: Tool Use Id
          type: string
        type:
          const: mcp_tool_result
          enum:
            - mcp_tool_result
          title: Type
          type: string
      required:
        - tool_use_id
        - type
      title: MCP tool result
      type: object
    RequestMCPToolUseBlock:
      additionalProperties: false
      properties:
        cache_control:
          anyOf:
            - discriminator:
                mapping:
                  ephemeral: '#/components/schemas/CacheControlEphemeral'
                propertyName: type
              oneOf:
                - $ref: '#/components/schemas/CacheControlEphemeral'
            - type: 'null'
          description: Create a cache control breakpoint at this content block.
          title: Cache Control
        id:
          pattern: ^[a-zA-Z0-9_-]+$
          title: Id
          type: string
        input:
          title: Input
          type: object
        name:
          title: Name
          type: string
        server_name:
          description: The name of the MCP server
          title: Server Name
          type: string
        type:
          const: mcp_tool_use
          enum:
            - mcp_tool_use
          title: Type
          type: string
      required:
        - id
        - input
        - name
        - server_name
        - type
      title: MCP tool use
      type: object
    RequestPageLocationCitation:
      additionalProperties: false
      properties:
        cited_text:
          title: Cited Text
          type: string
        document_index:
          minimum: 0
          title: Document Index
          type: integer
        document_title:
          anyOf:
            - maxLength: 255
              minLength: 1
              type: string
            - type: 'null'
          title: Document Title
        end_page_number:
          title: End Page Number
          type: integer
        start_page_number:
          minimum: 1
          title: Start Page Number
          type: integer
        type:
          const: page_location
          enum:
            - page_location
          title: Type
          type: string
      required:
        - cited_text
        - document_index
        - document_title
        - end_page_number
        - start_page_number
        - type
      title: Page location
      type: object
    RequestRedactedThinkingBlock:
      additionalProperties: false
      properties:
        data:
          title: Data
          type: string
        type:
          const: redacted_thinking
          enum:
            - redacted_thinking
          title: Type
          type: string
      required:
        - data
        - type
      title: Redacted thinking
      type: object
    RequestSearchResultBlock:
      additionalProperties: false
      properties:
        cache_control:
          anyOf:
            - discriminator:
                mapping:
                  ephemeral: '#/components/schemas/CacheControlEphemeral'
                propertyName: type
              oneOf:
                - $ref: '#/components/schemas/CacheControlEphemeral'
            - type: 'null'
          description: Create a cache control breakpoint at this content block.
          title: Cache Control
        citations:
          $ref: '#/components/schemas/RequestCitationsConfig'
        content:
          items:
            $ref: '#/components/schemas/RequestTextBlock'
          title: Content
          type: array
        source:
          title: Source
          type: string
        title:
          title: Title
          type: string
        type:
          const: search_result
          enum:
            - search_result
          title: Type
          type: string
      required:
        - content
        - source
        - title
        - type
      title: RequestSearchResultBlock
      type: object
    RequestSearchResultLocationCitation:
      properties:
        cited_text:
          title: Cited Text
          type: string
        end_block_index:
          title: End Block Index
          type: integer
        search_result_index:
          minimum: 0
          title: Search Result Index
          type: integer
        source:
          title: Source
          type: string
        start_block_index:
          minimum: 0
          title: Start Block Index
          type: integer
        title:
          anyOf:
            - type: string
            - type: 'null'
          title: Title
        type:
          const: search_result_location
          default: search_result_location
          enum:
            - search_result_location
          title: Type
          type: string
      required:
        - cited_text
        - end_block_index
        - search_result_index
        - source
        - start_block_index
        - title
        - type
      title: RequestSearchResultLocationCitation
      type: object
    RequestServerToolUseBlock:
      additionalProperties: false
      properties:
        cache_control:
          anyOf:
            - discriminator:
                mapping:
                  ephemeral: '#/components/schemas/CacheControlEphemeral'
                propertyName: type
              oneOf:
                - $ref: '#/components/schemas/CacheControlEphemeral'
            - type: 'null'
          description: Create a cache control breakpoint at this content block.
          title: Cache Control
        id:
          pattern: ^srvtoolu_[a-zA-Z0-9_]+$
          title: Id
          type: string
        input:
          title: Input
          type: object
        name:
          enum:
            - web_search
            - code_execution
          title: Name
          type: string
        type:
          const: server_tool_use
          enum:
            - server_tool_use
          title: Type
          type: string
      required:
        - id
        - input
        - name
        - type
      title: Server tool use
      type: object
    RequestTextBlock:
      additionalProperties: false
      properties:
        cache_control:
          anyOf:
            - discriminator:
                mapping:
                  ephemeral: '#/components/schemas/CacheControlEphemeral'
                propertyName: type
              oneOf:
                - $ref: '#/components/schemas/CacheControlEphemeral'
            - type: 'null'
          description: Create a cache control breakpoint at this content block.
          title: Cache Control
        citations:
          anyOf:
            - items:
                discriminator:
                  mapping:
                    char_location: '#/components/schemas/RequestCharLocationCitation'
                    content_block_location: '#/components/schemas/RequestContentBlockLocationCitation'
                    page_location: '#/components/schemas/RequestPageLocationCitation'
                    search_result_location: '#/components/schemas/RequestSearchResultLocationCitation'
                    web_search_result_location: >-
                      #/components/schemas/RequestWebSearchResultLocationCitation
                  propertyName: type
                oneOf:
                  - $ref: '#/components/schemas/RequestCharLocationCitation'
                  - $ref: '#/components/schemas/RequestPageLocationCitation'
                  - $ref: '#/components/schemas/RequestContentBlockLocationCitation'
                  - $ref: >-
                      #/components/schemas/RequestWebSearchResultLocationCitation
                  - $ref: '#/components/schemas/RequestSearchResultLocationCitation'
              type: array
            - type: 'null'
          title: Citations
        text:
          minLength: 1
          title: Text
          type: string
        type:
          const: text
          enum:
            - text
          title: Type
          type: string
      required:
        - text
        - type
      title: Text
      type: object
    RequestThinkingBlock:
      additionalProperties: false
      properties:
        signature:
          title: Signature
          type: string
        thinking:
          title: Thinking
          type: string
        type:
          const: thinking
          enum:
            - thinking
          title: Type
          type: string
      required:
        - signature
        - thinking
        - type
      title: Thinking
      type: object
    RequestToolResultBlock:
      additionalProperties: false
      properties:
        cache_control:
          anyOf:
            - discriminator:
                mapping:
                  ephemeral: '#/components/schemas/CacheControlEphemeral'
                propertyName: type
              oneOf:
                - $ref: '#/components/schemas/CacheControlEphemeral'
            - type: 'null'
          description: Create a cache control breakpoint at this content block.
          title: Cache Control
        content:
          anyOf:
            - type: string
            - items:
                discriminator:
                  mapping:
                    image: '#/components/schemas/RequestImageBlock'
                    search_result: '#/components/schemas/RequestSearchResultBlock'
                    text: '#/components/schemas/RequestTextBlock'
                  propertyName: type
                oneOf:
                  - $ref: '#/components/schemas/RequestTextBlock'
                  - $ref: '#/components/schemas/RequestImageBlock'
                  - $ref: '#/components/schemas/RequestSearchResultBlock'
              type: array
          title: Content
        is_error:
          title: Is Error
          type: boolean
        tool_use_id:
          pattern: ^[a-zA-Z0-9_-]+$
          title: Tool Use Id
          type: string
        type:
          const: tool_result
          enum:
            - tool_result
          title: Type
          type: string
      required:
        - tool_use_id
        - type
      title: Tool result
      type: object
    RequestToolUseBlock:
      additionalProperties: false
      properties:
        cache_control:
          anyOf:
            - discriminator:
                mapping:
                  ephemeral: '#/components/schemas/CacheControlEphemeral'
                propertyName: type
              oneOf:
                - $ref: '#/components/schemas/CacheControlEphemeral'
            - type: 'null'
          description: Create a cache control breakpoint at this content block.
          title: Cache Control
        id:
          pattern: ^[a-zA-Z0-9_-]+$
          title: Id
          type: string
        input:
          title: Input
          type: object
        name:
          maxLength: 200
          minLength: 1
          title: Name
          type: string
        type:
          const: tool_use
          enum:
            - tool_use
          title: Type
          type: string
      required:
        - id
        - input
        - name
        - type
      title: Tool use
      type: object
    RequestWebSearchResultBlock:
      additionalProperties: false
      properties:
        encrypted_content:
          title: Encrypted Content
          type: string
        page_age:
          anyOf:
            - type: string
            - type: 'null'
          title: Page Age
        title:
          title: Title
          type: string
        type:
          const: web_search_result
          enum:
            - web_search_result
          title: Type
          type: string
        url:
          title: Url
          type: string
      required:
        - encrypted_content
        - title
        - type
        - url
      title: RequestWebSearchResultBlock
      type: object
    RequestWebSearchResultLocationCitation:
      additionalProperties: false
      properties:
        cited_text:
          title: Cited Text
          type: string
        encrypted_index:
          title: Encrypted Index
          type: string
        title:
          anyOf:
            - maxLength: 512
              minLength: 1
              type: string
            - type: 'null'
          title: Title
        type:
          const: web_search_result_location
          enum:
            - web_search_result_location
          title: Type
          type: string
        url:
          maxLength: 2048
          minLength: 1
          title: Url
          type: string
      required:
        - cited_text
        - encrypted_index
        - title
        - type
        - url
      title: RequestWebSearchResultLocationCitation
      type: object
    RequestWebSearchToolResultBlock:
      additionalProperties: false
      properties:
        cache_control:
          anyOf:
            - discriminator:
                mapping:
                  ephemeral: '#/components/schemas/CacheControlEphemeral'
                propertyName: type
              oneOf:
                - $ref: '#/components/schemas/CacheControlEphemeral'
            - type: 'null'
          description: Create a cache control breakpoint at this content block.
          title: Cache Control
        content:
          anyOf:
            - items:
                $ref: '#/components/schemas/RequestWebSearchResultBlock'
              type: array
            - $ref: '#/components/schemas/RequestWebSearchToolResultError'
          title: Content
        tool_use_id:
          pattern: ^srvtoolu_[a-zA-Z0-9_]+$
          title: Tool Use Id
          type: string
        type:
          const: web_search_tool_result
          enum:
            - web_search_tool_result
          title: Type
          type: string
      required:
        - content
        - tool_use_id
        - type
      title: Web search tool result
      type: object
    RequestWebSearchToolResultError:
      additionalProperties: false
      properties:
        error_code:
          $ref: '#/components/schemas/WebSearchToolResultErrorCode'
        type:
          const: web_search_tool_result_error
          enum:
            - web_search_tool_result_error
          title: Type
          type: string
      required:
        - error_code
        - type
      title: RequestWebSearchToolResultError
      type: object
    ServerToolUsage:
      properties:
        web_search_requests:
          default: 0
          description: The number of web search tool requests.
          examples:
            - 0
          minimum: 0
          title: Web Search Requests
          type: integer
      required:
        - web_search_requests
      title: ServerToolUsage
      type: object
    URLImageSource:
      additionalProperties: false
      properties:
        type:
          const: url
          enum:
            - url
          title: Type
          type: string
        url:
          title: Url
          type: string
      required:
        - type
        - url
      title: URLImageSource
      type: object
    URLPDFSource:
      additionalProperties: false
      properties:
        type:
          const: url
          enum:
            - url
          title: Type
          type: string
        url:
          title: Url
          type: string
      required:
        - type
        - url
      title: PDF (URL)
      type: object
    Usage:
      properties:
        cache_creation:
          anyOf:
            - $ref: '#/components/schemas/CacheCreation'
            - type: 'null'
          default: null
          description: Breakdown of cached tokens by TTL
        cache_creation_input_tokens:
          anyOf:
            - minimum: 0
              type: integer
            - type: 'null'
          default: null
          description: The number of input tokens used to create the cache entry.
          examples:
            - 2051
          title: Cache Creation Input Tokens
        cache_read_input_tokens:
          anyOf:
            - minimum: 0
              type: integer
            - type: 'null'
          default: null
          description: The number of input tokens read from the cache.
          examples:
            - 2051
          title: Cache Read Input Tokens
        input_tokens:
          description: The number of input tokens which were used.
          examples:
            - 2095
          minimum: 0
          title: Input Tokens
          type: integer
        output_tokens:
          description: The number of output tokens which were used.
          examples:
            - 503
          minimum: 0
          title: Output Tokens
          type: integer
        server_tool_use:
          anyOf:
            - $ref: '#/components/schemas/ServerToolUsage'
            - type: 'null'
          default: null
          description: The number of server tool requests.
        service_tier:
          anyOf:
            - enum:
                - standard
                - priority
                - batch
              type: string
            - type: 'null'
          default: null
          description: If the request used the priority, standard, or batch tier.
          title: Service Tier
      required:
        - cache_creation
        - cache_creation_input_tokens
        - cache_read_input_tokens
        - input_tokens
        - output_tokens
        - server_tool_use
        - service_tier
      title: Usage
      type: object
    WebSearchToolResultErrorCode:
      enum:
        - invalid_tool_input
        - unavailable
        - max_uses_exceeded
        - too_many_requests
        - query_too_long
      title: WebSearchToolResultErrorCode
      type: string

````

# Client SDKs

> We provide client libraries in a number of popular languages that make it easier to work with the Anthropic API.

> Additional configuration is needed to use Anthropic's Client SDKs through a partner platform. If you are using Amazon Bedrock, see [this guide](/en/api/claude-on-amazon-bedrock); if you are using Google Cloud Vertex AI, see [this guide](/en/api/claude-on-vertex-ai).

## Python

[Python library GitHub repo](https://github.com/anthropics/anthropic-sdk-python)

Example:

```Python Python
import anthropic

client = anthropic.Anthropic(
    # defaults to os.environ.get("ANTHROPIC_API_KEY")
    api_key="my_api_key",
)
message = client.messages.create(
    model="claude-sonnet-4-20250514",
    max_tokens=1024,
    messages=[
        {"role": "user", "content": "Hello, Claude"}
    ]
)
print(message.content)
```

Accepted `model` strings:

```Python
# Claude 4 Models
"claude-opus-4-20250514"
"claude-opus-4-0"  # alias
"claude-sonnet-4-20250514"
"claude-sonnet-4-0"  # alias

# Claude 3.7 Models
"claude-3-7-sonnet-20250219"
"claude-3-7-sonnet-latest"  # alias

# Claude 3.5 Models
"claude-3-5-haiku-20241022"
"claude-3-5-haiku-latest"  # alias
"claude-3-5-sonnet-20241022"
"claude-3-5-sonnet-latest"  # alias
"claude-3-5-sonnet-20240620"  # previous version

# Claude 3 Models
"claude-3-opus-20240229"
"claude-3-opus-latest"  # alias
"claude-3-sonnet-20240229"
"claude-3-haiku-20240307"
```

***

## TypeScript

[TypeScript library GitHub repo](https://github.com/anthropics/anthropic-sdk-typescript)

<Info>
  While this library is in TypeScript, it can also be used in JavaScript libraries.
</Info>

Example:

```TypeScript TypeScript
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: 'my_api_key', // defaults to process.env["ANTHROPIC_API_KEY"]
});

const msg = await anthropic.messages.create({
  model: "claude-sonnet-4-20250514",
  max_tokens: 1024,
  messages: [{ role: "user", content: "Hello, Claude" }],
});
console.log(msg);
```

Accepted `model` strings:

```TypeScript
// Claude 4 Models
"claude-opus-4-20250514"
"claude-opus-4-0"  // alias
"claude-sonnet-4-20250514"
"claude-sonnet-4-0"  // alias

// Claude 3.7 Models
"claude-3-7-sonnet-20250219"
"claude-3-7-sonnet-latest"  // alias

// Claude 3.5 Models
"claude-3-5-haiku-20241022"
"claude-3-5-haiku-latest"  // alias
"claude-3-5-sonnet-20241022"
"claude-3-5-sonnet-latest"  // alias
"claude-3-5-sonnet-20240620"  // previous version

// Claude 3 Models
"claude-3-opus-20240229"
"claude-3-opus-latest"  // alias
"claude-3-sonnet-20240229"
"claude-3-haiku-20240307"
```

***

## Java

[Java library GitHub repo](https://github.com/anthropics/anthropic-sdk-java)

Example:

```Java Java
import com.anthropic.models.Message;
import com.anthropic.models.MessageCreateParams;
import com.anthropic.models.Model;

MessageCreateParams params = MessageCreateParams.builder()
    .maxTokens(1024L)
    .addUserMessage("Hello, Claude")
    .model(Model.CLAUDE_SONNET_4_0)
    .build();
Message message = client.messages().create(params);
```

`model` enum values:

```Java
// Claude 4 Models
Model.CLAUDE_OPUS_4_0
Model.CLAUDE_OPUS_4_20250514
Model.CLAUDE_SONNET_4_0
Model.CLAUDE_SONNET_4_20250514

// Claude 3.7 Models
Model.CLAUDE_3_7_SONNET_LATEST
Model.CLAUDE_3_7_SONNET_20250219

// Claude 3.5 Models
Model.CLAUDE_3_5_HAIKU_LATEST
Model.CLAUDE_3_5_HAIKU_20241022
Model.CLAUDE_3_5_SONNET_LATEST
Model.CLAUDE_3_5_SONNET_20241022
Model.CLAUDE_3_5_SONNET_20240620

// Claude 3 Models
Model.CLAUDE_3_OPUS_LATEST
Model.CLAUDE_3_OPUS_20240229
Model.CLAUDE_3_SONNET_20240229
Model.CLAUDE_3_HAIKU_20240307
```

***

## Go

[Go library GitHub repo](https://github.com/anthropics/anthropic-sdk-go)

Example:

```Go Go
package main

import (
	"context"
	"fmt"
	"github.com/anthropics/anthropic-sdk-go/option"

	"github.com/anthropics/anthropic-sdk-go"
)

func main() {
	client := anthropic.NewClient(
		option.WithAPIKey("my-anthropic-api-key"),
	)

	message, err := client.Messages.New(context.TODO(), anthropic.MessageNewParams{
		Model:     anthropic.ModelClaudeSonnet4_0,
		MaxTokens: 1024,
		Messages: []anthropic.MessageParam{
			anthropic.NewUserMessage(anthropic.NewTextBlock("What is a quaternion?")),
		},
	})
	if err != nil {
		fmt.Printf("Error creating message: %v\n", err)
		return
	}

	fmt.Printf("%+v\n", message.Content)
}
```

`Model` constants:

```Go
// Claude 4 Models
anthropic.ModelClaudeOpus4_0
anthropic.ModelClaudeOpus4_20250514
anthropic.ModelClaudeSonnet4_0
anthropic.ModelClaudeSonnet4_20250514

// Claude 3.7 Models
anthropic.ModelClaude3_7SonnetLatest
anthropic.ModelClaude3_7Sonnet20250219

// Claude 3.5 Models
anthropic.ModelClaude3_5HaikuLatest
anthropic.ModelClaude3_5Haiku20241022
anthropic.ModelClaude3_5SonnetLatest
anthropic.ModelClaude3_5Sonnet20241022
anthropic.ModelClaude_3_5_Sonnet_20240620

// Claude 3 Models
anthropic.ModelClaude3OpusLatest
anthropic.ModelClaude_3_Opus_20240229
anthropic.ModelClaude_3_Sonnet_20240229
anthropic.ModelClaude_3_Haiku_20240307
```

***

## Ruby

[Ruby library GitHub repo](https://github.com/anthropics/anthropic-sdk-ruby)

Example:

```Ruby ruby
require "bundler/setup"
require "anthropic"

anthropic = Anthropic::Client.new(
  api_key: "my_api_key" # defaults to ENV["ANTHROPIC_API_KEY"]
)

message =
  anthropic.messages.create(
    max_tokens: 1024,
    messages: [{
      role: "user",
      content: "Hello, Claude"
    }],
    model: "claude-sonnet-4-20250514"
  )

puts(message.content)
```

Accepted `model` strings:

```Ruby
# Claude 4 Models
:"claude-opus-4-20250514"
:"claude-opus-4-0"  # alias
:"claude-sonnet-4-20250514"
:"claude-sonnet-4-0"  # alias

# Claude 3.7 Models
:"claude-3-7-sonnet-20250219"
:"claude-3-7-sonnet-latest"  # alias

# Claude 3.5 Models
:"claude-3-5-haiku-20241022"
:"claude-3-5-haiku-latest"  # alias
:"claude-3-5-sonnet-20241022"
:"claude-3-5-sonnet-latest"  # alias
:"claude-3-5-sonnet-20240620"  # previous version

# Claude 3 Models
:"claude-3-opus-20240229"
:"claude-3-opus-latest"  # alias
:"claude-3-sonnet-20240229"
:"claude-3-haiku-20240307"
```

***

## Beta namespace in client SDKs

Every SDK has a `beta` namespace that is available. This is used for new features Anthropic releases in a beta version. Use this in conjunction with [beta headers](/en/api/beta-headers) to use these features.

<CodeGroup>
  ```Python Python
  import anthropic

  client = anthropic.Anthropic(
      # defaults to os.environ.get("ANTHROPIC_API_KEY")
      api_key="my_api_key",
  )
  message = client.beta.messages.create(
      model="claude-sonnet-4-20250514",
      max_tokens=1024,
      messages=[
          {"role": "user", "content": "Hello, Claude"}
      ],
      betas=["beta-feature-name"]
  )
  print(message.content)
  ```

  ```TypeScript TypeScript
  import Anthropic from '@anthropic-ai/sdk';

  const anthropic = new Anthropic({
    apiKey: 'my_api_key', // defaults to process.env["ANTHROPIC_API_KEY"]
  });

  const msg = await anthropic.beta.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 1024,
    messages: [{ role: "user", content: "Hello, Claude" }],
    betas: ["beta-feature-name"]
  });
  console.log(msg);
  ```

  ```Java Java
  import com.anthropic.client.AnthropicClient;
  import com.anthropic.client.okhttp.AnthropicOkHttpClient;
  import com.anthropic.models.beta.messages.BetaMessage;
  import com.anthropic.models.beta.messages.MessageCreateParams;
  import com.anthropic.models.messages.Model;

  AnthropicClient client = AnthropicOkHttpClient.fromEnv();

  MessageCreateParams params = MessageCreateParams.builder()
      .model(Model.CLAUDE_SONNET_4_0)
      .maxTokens(1024L)
      .addUserMessage("Hello, Claude")
      .addBeta("beta-feature-name")
      .build();

  BetaMessage message = client.beta().messages().create(params);
  System.out.println(message);
  ```

  ```Go Go
  package main

  import (
  	"context"
  	"fmt"
  	"github.com/anthropics/anthropic-sdk-go/option"

  	"github.com/anthropics/anthropic-sdk-go"
  )

  func main() {
  	client := anthropic.NewClient(
  		option.WithAPIKey("my-anthropic-api-key"),
  	)
  	
  	message, err := client.Beta.Messages.New(context.TODO(), anthropic.BetaMessageNewParams{
  		Model:     anthropic.F(anthropic.ModelClaudeSonnet4_0),
  		MaxTokens: anthropic.F(int64(1024)),
  		Messages: anthropic.F([]anthropic.MessageParam{
  			anthropic.NewUserMessage(anthropic.NewTextBlock("Hello, Claude")),
  		}),
  		Betas: anthropic.F([]anthropic.AnthropicBeta{
  			anthropic.AnthropicBeta("beta-feature-name"),
  		}),
  	})
  	if err != nil {
  		fmt.Printf("Error creating message: %v\n", err)
  		return
  	}
  	
  	fmt.Printf("%+v\n", message.Content)
  }
  ```

  ```Ruby Ruby
  require "bundler/setup"
  require "anthropic"

  anthropic = Anthropic::Client.new(
    api_key: "my_api_key" # defaults to ENV["ANTHROPIC_API_KEY"]
  )

  message = anthropic.beta.messages.create(
    max_tokens: 1024,
    messages: [{
      role: "user",
      content: "Hello, Claude"
    }],
    model: "claude-sonnet-4-20250514",
    betas: ["beta-feature-name"]
  )

  puts(message.content)
  ```
</CodeGroup>


# Messages examples

> Request and response examples for the Messages API

See the [API reference](/en/api/messages) for full documentation on available parameters.

## Basic request and response

<CodeGroup>
  ```bash Shell
  #!/bin/sh
  curl https://api.anthropic.com/v1/messages \
       --header "x-api-key: $ANTHROPIC_API_KEY" \
       --header "anthropic-version: 2023-06-01" \
       --header "content-type: application/json" \
       --data \
  '{
      "model": "claude-opus-4-20250514",
      "max_tokens": 1024,
      "messages": [
          {"role": "user", "content": "Hello, Claude"}
      ]
  }'
  ```

  ```Python Python
  import anthropic

  message = anthropic.Anthropic().messages.create(
      model="claude-opus-4-20250514",
      max_tokens=1024,
      messages=[
          {"role": "user", "content": "Hello, Claude"}
      ]
  )
  print(message)
  ```

  ```TypeScript TypeScript
  import Anthropic from '@anthropic-ai/sdk';

  const anthropic = new Anthropic();

  const message = await anthropic.messages.create({
    model: 'claude-opus-4-20250514',
    max_tokens: 1024,
    messages: [
      {"role": "user", "content": "Hello, Claude"}
    ]
  });
  console.log(message);
  ```
</CodeGroup>

```JSON JSON
{
  "id": "msg_01XFDUDYJgAACzvnptvVoYEL",
  "type": "message",
  "role": "assistant",
  "content": [
    {
      "type": "text",
      "text": "Hello!"
    }
  ],
  "model": "claude-opus-4-20250514",
  "stop_reason": "end_turn",
  "stop_sequence": null,
  "usage": {
    "input_tokens": 12,
    "output_tokens": 6
  }
}
```

## Multiple conversational turns

The Messages API is stateless, which means that you always send the full conversational history to the API. You can use this pattern to build up a conversation over time. Earlier conversational turns don't necessarily need to actually originate from Claude — you can use synthetic `assistant` messages.

<CodeGroup>
  ```bash Shell
  #!/bin/sh
  curl https://api.anthropic.com/v1/messages \
       --header "x-api-key: $ANTHROPIC_API_KEY" \
       --header "anthropic-version: 2023-06-01" \
       --header "content-type: application/json" \
       --data \
  '{
      "model": "claude-opus-4-20250514",
      "max_tokens": 1024,
      "messages": [
          {"role": "user", "content": "Hello, Claude"},
          {"role": "assistant", "content": "Hello!"},
          {"role": "user", "content": "Can you describe LLMs to me?"}

      ]
  }'
  ```

  ```Python Python
  import anthropic

  message = anthropic.Anthropic().messages.create(
      model="claude-opus-4-20250514",
      max_tokens=1024,
      messages=[
          {"role": "user", "content": "Hello, Claude"},
          {"role": "assistant", "content": "Hello!"},
          {"role": "user", "content": "Can you describe LLMs to me?"}
      ],
  )
  print(message)

  ```

  ```TypeScript TypeScript
  import Anthropic from '@anthropic-ai/sdk';

  const anthropic = new Anthropic();

  await anthropic.messages.create({
    model: 'claude-opus-4-20250514',
    max_tokens: 1024,
    messages: [
      {"role": "user", "content": "Hello, Claude"},
      {"role": "assistant", "content": "Hello!"},
      {"role": "user", "content": "Can you describe LLMs to me?"}
    ]
  });
  ```
</CodeGroup>

```JSON JSON
{
    "id": "msg_018gCsTGsXkYJVqYPxTgDHBU",
    "type": "message",
    "role": "assistant",
    "content": [
        {
            "type": "text",
            "text": "Sure, I'd be happy to provide..."
        }
    ],
    "stop_reason": "end_turn",
    "stop_sequence": null,
    "usage": {
      "input_tokens": 30,
      "output_tokens": 309
    }
}
```

## Putting words in Claude's mouth

You can pre-fill part of Claude's response in the last position of the input messages list. This can be used to shape Claude's response. The example below uses `"max_tokens": 1` to get a single multiple choice answer from Claude.

<CodeGroup>
  ```bash Shell
  #!/bin/sh
  curl https://api.anthropic.com/v1/messages \
       --header "x-api-key: $ANTHROPIC_API_KEY" \
       --header "anthropic-version: 2023-06-01" \
       --header "content-type: application/json" \
       --data \
  '{
      "model": "claude-opus-4-20250514",
      "max_tokens": 1,
      "messages": [
          {"role": "user", "content": "What is latin for Ant? (A) Apoidea, (B) Rhopalocera, (C) Formicidae"},
          {"role": "assistant", "content": "The answer is ("}
      ]
  }'
  ```

  ```Python Python
  import anthropic

  message = anthropic.Anthropic().messages.create(
      model="claude-opus-4-20250514",
      max_tokens=1,
      messages=[
          {"role": "user", "content": "What is latin for Ant? (A) Apoidea, (B) Rhopalocera, (C) Formicidae"},
          {"role": "assistant", "content": "The answer is ("}
      ]
  )
  print(message)
  ```

  ```TypeScript TypeScript
  import Anthropic from '@anthropic-ai/sdk';

  const anthropic = new Anthropic();

  const message = await anthropic.messages.create({
    model: 'claude-opus-4-20250514',
    max_tokens: 1,
    messages: [
      {"role": "user", "content": "What is latin for Ant? (A) Apoidea, (B) Rhopalocera, (C) Formicidae"},
      {"role": "assistant", "content": "The answer is ("}
    ]
  });
  console.log(message);
  ```
</CodeGroup>

```JSON JSON
{
  "id": "msg_01Q8Faay6S7QPTvEUUQARt7h",
  "type": "message",
  "role": "assistant",
  "content": [
    {
      "type": "text",
      "text": "C"
    }
  ],
  "model": "claude-opus-4-20250514",
  "stop_reason": "max_tokens",
  "stop_sequence": null,
  "usage": {
    "input_tokens": 42,
    "output_tokens": 1
  }
}
```

## Vision

Claude can read both text and images in requests. We support both `base64` and `url` source types for images, and the `image/jpeg`, `image/png`, `image/gif`, and `image/webp` media types. See our [vision guide](/en/docs/build-with-claude/vision) for more details.

<CodeGroup>
  ```bash Shell
  #!/bin/sh

  # Option 1: Base64-encoded image
  IMAGE_URL="https://upload.wikimedia.org/wikipedia/commons/a/a7/Camponotus_flavomarginatus_ant.jpg"
  IMAGE_MEDIA_TYPE="image/jpeg"
  IMAGE_BASE64=$(curl "$IMAGE_URL" | base64)

  curl https://api.anthropic.com/v1/messages \
       --header "x-api-key: $ANTHROPIC_API_KEY" \
       --header "anthropic-version: 2023-06-01" \
       --header "content-type: application/json" \
       --data \
  '{
      "model": "claude-opus-4-20250514",
      "max_tokens": 1024,
      "messages": [
          {"role": "user", "content": [
              {"type": "image", "source": {
                  "type": "base64",
                  "media_type": "'$IMAGE_MEDIA_TYPE'",
                  "data": "'$IMAGE_BASE64'"
              }},
              {"type": "text", "text": "What is in the above image?"}
          ]}
      ]
  }'

  # Option 2: URL-referenced image
  curl https://api.anthropic.com/v1/messages \
       --header "x-api-key: $ANTHROPIC_API_KEY" \
       --header "anthropic-version: 2023-06-01" \
       --header "content-type: application/json" \
       --data \
  '{
      "model": "claude-opus-4-20250514",
      "max_tokens": 1024,
      "messages": [
          {"role": "user", "content": [
              {"type": "image", "source": {
                  "type": "url",
                  "url": "https://upload.wikimedia.org/wikipedia/commons/a/a7/Camponotus_flavomarginatus_ant.jpg"
              }},
              {"type": "text", "text": "What is in the above image?"}
          ]}
      ]
  }'
  ```

  ```Python Python
  import anthropic
  import base64
  import httpx

  # Option 1: Base64-encoded image
  image_url = "https://upload.wikimedia.org/wikipedia/commons/a/a7/Camponotus_flavomarginatus_ant.jpg"
  image_media_type = "image/jpeg"
  image_data = base64.standard_b64encode(httpx.get(image_url).content).decode("utf-8")

  message = anthropic.Anthropic().messages.create(
      model="claude-opus-4-20250514",
      max_tokens=1024,
      messages=[
          {
              "role": "user",
              "content": [
                  {
                      "type": "image",
                      "source": {
                          "type": "base64",
                          "media_type": image_media_type,
                          "data": image_data,
                      },
                  },
                  {
                      "type": "text",
                      "text": "What is in the above image?"
                  }
              ],
          }
      ],
  )
  print(message)

  # Option 2: URL-referenced image
  message_from_url = anthropic.Anthropic().messages.create(
      model="claude-opus-4-20250514",
      max_tokens=1024,
      messages=[
          {
              "role": "user",
              "content": [
                  {
                      "type": "image",
                      "source": {
                          "type": "url",
                          "url": "https://upload.wikimedia.org/wikipedia/commons/a/a7/Camponotus_flavomarginatus_ant.jpg",
                      },
                  },
                  {
                      "type": "text",
                      "text": "What is in the above image?"
                  }
              ],
          }
      ],
  )
  print(message_from_url)
  ```

  ```TypeScript TypeScript
  import Anthropic from '@anthropic-ai/sdk';

  const anthropic = new Anthropic();

  // Option 1: Base64-encoded image
  const image_url = "https://upload.wikimedia.org/wikipedia/commons/a/a7/Camponotus_flavomarginatus_ant.jpg"
  const image_media_type = "image/jpeg"
  const image_array_buffer = await ((await fetch(image_url)).arrayBuffer());
  const image_data = Buffer.from(image_array_buffer).toString('base64');

  const message = await anthropic.messages.create({
    model: 'claude-opus-4-20250514',
    max_tokens: 1024,
    messages: [
          {
              "role": "user",
              "content": [
                  {
                      "type": "image",
                      "source": {
                          "type": "base64",
                          "media_type": image_media_type,
                          "data": image_data,
                      },
                  },
                  {
                      "type": "text",
                      "text": "What is in the above image?"
                  }
              ],
          }
        ]
  });
  console.log(message);

  // Option 2: URL-referenced image
  const messageFromUrl = await anthropic.messages.create({
    model: 'claude-opus-4-20250514',
    max_tokens: 1024,
    messages: [
          {
              "role": "user",
              "content": [
                  {
                      "type": "image",
                      "source": {
                          "type": "url",
                          "url": "https://upload.wikimedia.org/wikipedia/commons/a/a7/Camponotus_flavomarginatus_ant.jpg",
                      },
                  },
                  {
                      "type": "text",
                      "text": "What is in the above image?"
                  }
              ],
          }
        ]
  });
  console.log(messageFromUrl);
  ```
</CodeGroup>

```JSON JSON
{
  "id": "msg_01EcyWo6m4hyW8KHs2y2pei5",
  "type": "message",
  "role": "assistant",
  "content": [
    {
      "type": "text",
      "text": "This image shows an ant, specifically a close-up view of an ant. The ant is shown in detail, with its distinct head, antennae, and legs clearly visible. The image is focused on capturing the intricate details and features of the ant, likely taken with a macro lens to get an extreme close-up perspective."
    }
  ],
  "model": "claude-opus-4-20250514",
  "stop_reason": "end_turn",
  "stop_sequence": null,
  "usage": {
    "input_tokens": 1551,
    "output_tokens": 71
  }
}
```

## Tool use, JSON mode, and computer use

See our [guide](/en/docs/agents-and-tools/tool-use/overview) for examples for how to use tools with the Messages API.
See our [computer use guide](/en/docs/agents-and-tools/tool-use/computer-use-tool) for examples of how to control desktop computer environments with the Messages API.


# Messages examples

> Request and response examples for the Messages API

See the [API reference](/en/api/messages) for full documentation on available parameters.

## Basic request and response

<CodeGroup>
  ```bash Shell
  #!/bin/sh
  curl https://api.anthropic.com/v1/messages \
       --header "x-api-key: $ANTHROPIC_API_KEY" \
       --header "anthropic-version: 2023-06-01" \
       --header "content-type: application/json" \
       --data \
  '{
      "model": "claude-opus-4-20250514",
      "max_tokens": 1024,
      "messages": [
          {"role": "user", "content": "Hello, Claude"}
      ]
  }'
  ```

  ```Python Python
  import anthropic

  message = anthropic.Anthropic().messages.create(
      model="claude-opus-4-20250514",
      max_tokens=1024,
      messages=[
          {"role": "user", "content": "Hello, Claude"}
      ]
  )
  print(message)
  ```

  ```TypeScript TypeScript
  import Anthropic from '@anthropic-ai/sdk';

  const anthropic = new Anthropic();

  const message = await anthropic.messages.create({
    model: 'claude-opus-4-20250514',
    max_tokens: 1024,
    messages: [
      {"role": "user", "content": "Hello, Claude"}
    ]
  });
  console.log(message);
  ```
</CodeGroup>

```JSON JSON
{
  "id": "msg_01XFDUDYJgAACzvnptvVoYEL",
  "type": "message",
  "role": "assistant",
  "content": [
    {
      "type": "text",
      "text": "Hello!"
    }
  ],
  "model": "claude-opus-4-20250514",
  "stop_reason": "end_turn",
  "stop_sequence": null,
  "usage": {
    "input_tokens": 12,
    "output_tokens": 6
  }
}
```

## Multiple conversational turns

The Messages API is stateless, which means that you always send the full conversational history to the API. You can use this pattern to build up a conversation over time. Earlier conversational turns don't necessarily need to actually originate from Claude — you can use synthetic `assistant` messages.

<CodeGroup>
  ```bash Shell
  #!/bin/sh
  curl https://api.anthropic.com/v1/messages \
       --header "x-api-key: $ANTHROPIC_API_KEY" \
       --header "anthropic-version: 2023-06-01" \
       --header "content-type: application/json" \
       --data \
  '{
      "model": "claude-opus-4-20250514",
      "max_tokens": 1024,
      "messages": [
          {"role": "user", "content": "Hello, Claude"},
          {"role": "assistant", "content": "Hello!"},
          {"role": "user", "content": "Can you describe LLMs to me?"}

      ]
  }'
  ```

  ```Python Python
  import anthropic

  message = anthropic.Anthropic().messages.create(
      model="claude-opus-4-20250514",
      max_tokens=1024,
      messages=[
          {"role": "user", "content": "Hello, Claude"},
          {"role": "assistant", "content": "Hello!"},
          {"role": "user", "content": "Can you describe LLMs to me?"}
      ],
  )
  print(message)

  ```

  ```TypeScript TypeScript
  import Anthropic from '@anthropic-ai/sdk';

  const anthropic = new Anthropic();

  await anthropic.messages.create({
    model: 'claude-opus-4-20250514',
    max_tokens: 1024,
    messages: [
      {"role": "user", "content": "Hello, Claude"},
      {"role": "assistant", "content": "Hello!"},
      {"role": "user", "content": "Can you describe LLMs to me?"}
    ]
  });
  ```
</CodeGroup>

```JSON JSON
{
    "id": "msg_018gCsTGsXkYJVqYPxTgDHBU",
    "type": "message",
    "role": "assistant",
    "content": [
        {
            "type": "text",
            "text": "Sure, I'd be happy to provide..."
        }
    ],
    "stop_reason": "end_turn",
    "stop_sequence": null,
    "usage": {
      "input_tokens": 30,
      "output_tokens": 309
    }
}
```

## Putting words in Claude's mouth

You can pre-fill part of Claude's response in the last position of the input messages list. This can be used to shape Claude's response. The example below uses `"max_tokens": 1` to get a single multiple choice answer from Claude.

<CodeGroup>
  ```bash Shell
  #!/bin/sh
  curl https://api.anthropic.com/v1/messages \
       --header "x-api-key: $ANTHROPIC_API_KEY" \
       --header "anthropic-version: 2023-06-01" \
       --header "content-type: application/json" \
       --data \
  '{
      "model": "claude-opus-4-20250514",
      "max_tokens": 1,
      "messages": [
          {"role": "user", "content": "What is latin for Ant? (A) Apoidea, (B) Rhopalocera, (C) Formicidae"},
          {"role": "assistant", "content": "The answer is ("}
      ]
  }'
  ```

  ```Python Python
  import anthropic

  message = anthropic.Anthropic().messages.create(
      model="claude-opus-4-20250514",
      max_tokens=1,
      messages=[
          {"role": "user", "content": "What is latin for Ant? (A) Apoidea, (B) Rhopalocera, (C) Formicidae"},
          {"role": "assistant", "content": "The answer is ("}
      ]
  )
  print(message)
  ```

  ```TypeScript TypeScript
  import Anthropic from '@anthropic-ai/sdk';

  const anthropic = new Anthropic();

  const message = await anthropic.messages.create({
    model: 'claude-opus-4-20250514',
    max_tokens: 1,
    messages: [
      {"role": "user", "content": "What is latin for Ant? (A) Apoidea, (B) Rhopalocera, (C) Formicidae"},
      {"role": "assistant", "content": "The answer is ("}
    ]
  });
  console.log(message);
  ```
</CodeGroup>

```JSON JSON
{
  "id": "msg_01Q8Faay6S7QPTvEUUQARt7h",
  "type": "message",
  "role": "assistant",
  "content": [
    {
      "type": "text",
      "text": "C"
    }
  ],
  "model": "claude-opus-4-20250514",
  "stop_reason": "max_tokens",
  "stop_sequence": null,
  "usage": {
    "input_tokens": 42,
    "output_tokens": 1
  }
}
```

## Vision

Claude can read both text and images in requests. We support both `base64` and `url` source types for images, and the `image/jpeg`, `image/png`, `image/gif`, and `image/webp` media types. See our [vision guide](/en/docs/build-with-claude/vision) for more details.

<CodeGroup>
  ```bash Shell
  #!/bin/sh

  # Option 1: Base64-encoded image
  IMAGE_URL="https://upload.wikimedia.org/wikipedia/commons/a/a7/Camponotus_flavomarginatus_ant.jpg"
  IMAGE_MEDIA_TYPE="image/jpeg"
  IMAGE_BASE64=$(curl "$IMAGE_URL" | base64)

  curl https://api.anthropic.com/v1/messages \
       --header "x-api-key: $ANTHROPIC_API_KEY" \
       --header "anthropic-version: 2023-06-01" \
       --header "content-type: application/json" \
       --data \
  '{
      "model": "claude-opus-4-20250514",
      "max_tokens": 1024,
      "messages": [
          {"role": "user", "content": [
              {"type": "image", "source": {
                  "type": "base64",
                  "media_type": "'$IMAGE_MEDIA_TYPE'",
                  "data": "'$IMAGE_BASE64'"
              }},
              {"type": "text", "text": "What is in the above image?"}
          ]}
      ]
  }'

  # Option 2: URL-referenced image
  curl https://api.anthropic.com/v1/messages \
       --header "x-api-key: $ANTHROPIC_API_KEY" \
       --header "anthropic-version: 2023-06-01" \
       --header "content-type: application/json" \
       --data \
  '{
      "model": "claude-opus-4-20250514",
      "max_tokens": 1024,
      "messages": [
          {"role": "user", "content": [
              {"type": "image", "source": {
                  "type": "url",
                  "url": "https://upload.wikimedia.org/wikipedia/commons/a/a7/Camponotus_flavomarginatus_ant.jpg"
              }},
              {"type": "text", "text": "What is in the above image?"}
          ]}
      ]
  }'
  ```

  ```Python Python
  import anthropic
  import base64
  import httpx

  # Option 1: Base64-encoded image
  image_url = "https://upload.wikimedia.org/wikipedia/commons/a/a7/Camponotus_flavomarginatus_ant.jpg"
  image_media_type = "image/jpeg"
  image_data = base64.standard_b64encode(httpx.get(image_url).content).decode("utf-8")

  message = anthropic.Anthropic().messages.create(
      model="claude-opus-4-20250514",
      max_tokens=1024,
      messages=[
          {
              "role": "user",
              "content": [
                  {
                      "type": "image",
                      "source": {
                          "type": "base64",
                          "media_type": image_media_type,
                          "data": image_data,
                      },
                  },
                  {
                      "type": "text",
                      "text": "What is in the above image?"
                  }
              ],
          }
      ],
  )
  print(message)

  # Option 2: URL-referenced image
  message_from_url = anthropic.Anthropic().messages.create(
      model="claude-opus-4-20250514",
      max_tokens=1024,
      messages=[
          {
              "role": "user",
              "content": [
                  {
                      "type": "image",
                      "source": {
                          "type": "url",
                          "url": "https://upload.wikimedia.org/wikipedia/commons/a/a7/Camponotus_flavomarginatus_ant.jpg",
                      },
                  },
                  {
                      "type": "text",
                      "text": "What is in the above image?"
                  }
              ],
          }
      ],
  )
  print(message_from_url)
  ```

  ```TypeScript TypeScript
  import Anthropic from '@anthropic-ai/sdk';

  const anthropic = new Anthropic();

  // Option 1: Base64-encoded image
  const image_url = "https://upload.wikimedia.org/wikipedia/commons/a/a7/Camponotus_flavomarginatus_ant.jpg"
  const image_media_type = "image/jpeg"
  const image_array_buffer = await ((await fetch(image_url)).arrayBuffer());
  const image_data = Buffer.from(image_array_buffer).toString('base64');

  const message = await anthropic.messages.create({
    model: 'claude-opus-4-20250514',
    max_tokens: 1024,
    messages: [
          {
              "role": "user",
              "content": [
                  {
                      "type": "image",
                      "source": {
                          "type": "base64",
                          "media_type": image_media_type,
                          "data": image_data,
                      },
                  },
                  {
                      "type": "text",
                      "text": "What is in the above image?"
                  }
              ],
          }
        ]
  });
  console.log(message);

  // Option 2: URL-referenced image
  const messageFromUrl = await anthropic.messages.create({
    model: 'claude-opus-4-20250514',
    max_tokens: 1024,
    messages: [
          {
              "role": "user",
              "content": [
                  {
                      "type": "image",
                      "source": {
                          "type": "url",
                          "url": "https://upload.wikimedia.org/wikipedia/commons/a/a7/Camponotus_flavomarginatus_ant.jpg",
                      },
                  },
                  {
                      "type": "text",
                      "text": "What is in the above image?"
                  }
              ],
          }
        ]
  });
  console.log(messageFromUrl);
  ```
</CodeGroup>

```JSON JSON
{
  "id": "msg_01EcyWo6m4hyW8KHs2y2pei5",
  "type": "message",
  "role": "assistant",
  "content": [
    {
      "type": "text",
      "text": "This image shows an ant, specifically a close-up view of an ant. The ant is shown in detail, with its distinct head, antennae, and legs clearly visible. The image is focused on capturing the intricate details and features of the ant, likely taken with a macro lens to get an extreme close-up perspective."
    }
  ],
  "model": "claude-opus-4-20250514",
  "stop_reason": "end_turn",
  "stop_sequence": null,
  "usage": {
    "input_tokens": 1551,
    "output_tokens": 71
  }
}
```

## Tool use, JSON mode, and computer use

See our [guide](/en/docs/agents-and-tools/tool-use/overview) for examples for how to use tools with the Messages API.
See our [computer use guide](/en/docs/agents-and-tools/tool-use/computer-use-tool) for examples of how to control desktop computer environments with the Messages API.


