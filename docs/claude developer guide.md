# Intro to Claude

> Claude is a highly performant, trustworthy, and intelligent AI platform built by Anthropic. Claude excels at tasks involving language, reasoning, analysis, coding, and more.

<Tip>Introducing Claude 4, our latest generation of models:<br /><br />
**Claude Opus 4** - Our most capable and intelligent model yet. Claude Opus 4 sets new standards in complex reasoning and advanced coding<br /><br />
**Claude Sonnet 4** - Our high-performance model with exceptional reasoning and efficiency<br /><br />
Learn more in our [blog post](https://www.anthropic.com/news/claude-4).</Tip>

<Note>
  Looking to chat with Claude? Visit [claude.ai](http://www.claude.ai)!
</Note>

## Get started

If you’re new to Claude, start here to learn the essentials and make your first API call.

<CardGroup cols={3}>
  <Card title="Get started" icon="check" href="/en/docs/get-started">
    Set up your development environment for building with Claude.
  </Card>

  <Card title="Learn about Claude" icon="head-side-gear" href="/en/docs/about-claude/models/overview">
    Learn about the family of Claude models.
  </Card>

  <Card title="Prompt Library" icon="books" href="/en/resources/prompt-library/library">
    Explore example prompts for inspiration.
  </Card>
</CardGroup>

***

## Develop with Claude

Anthropic has best-in-class developer tools to build scalable applications with Claude.

<CardGroup cols={3}>
  <Card title="Developer Console" icon="laptop" href="https://console.anthropic.com">
    Enjoy easier, more powerful prompting in your browser with the Workbench and prompt generator tool.
  </Card>

  <Card title="API Reference" icon="code" href="/en/api/overview">
    Explore, implement, and scale with the Anthropic API and SDKs.
  </Card>

  <Card title="Anthropic Cookbook" icon="hat-chef" href="https://github.com/anthropics/anthropic-cookbook">
    Learn with interactive Jupyter notebooks that demonstrate uploading PDFs, embeddings, and more.
  </Card>
</CardGroup>

***

## Key capabilities

Claude can assist with many tasks that involve text, code, and images.

<CardGroup cols={2}>
  <Card title="Text and code generation" icon="input-text" href="/en/docs/build-with-claude/text-generation">
    Summarize text, answer questions, extract data, translate text, and explain and generate code.
  </Card>

  <Card title="Vision" icon="image" href="/en/docs/build-with-claude/vision">
    Process and analyze visual input and generate text and code from images.
  </Card>
</CardGroup>

***

## Support

<CardGroup cols={2}>
  <Card title="Help Center" icon="circle-question" href="https://support.anthropic.com/en/">
    Find answers to frequently asked account and billing questions.
  </Card>

  <Card title="Service Status" icon="chart-line" href="https://www.anthropic.com/status">
    Check the status of Anthropic services.
  </Card>
</CardGroup>



# Get started with Claude

> Let's learn how to use the Anthropic API to build with Claude.

export const TryInConsoleButton = ({userPrompt, systemPrompt, maxTokens, thinkingBudgetTokens, buttonVariant = "primary", children}) => {
  const url = new URL("https://console.anthropic.com/workbench/new");
  if (userPrompt) {
    url.searchParams.set("user", userPrompt);
  }
  if (systemPrompt) {
    url.searchParams.set("system", systemPrompt);
  }
  if (maxTokens) {
    url.searchParams.set("max_tokens", maxTokens);
  }
  if (thinkingBudgetTokens) {
    url.searchParams.set("thinking.budget_tokens", thinkingBudgetTokens);
  }
  return <a href={url.href} className={`btn size-xs ${buttonVariant}`} style={{
    margin: "-0.25rem -0.5rem"
  }}>
      {children || "Try in Console"}{" "}
      <Icon icon="arrow-right" color="currentColor" size={14} />
    </a>;
};

In this example, we'll explore how to use Claude through the Console and API, starting with a simple question and then customizing Claude's responses.

## Prerequisites

You will need:

* An Anthropic [Console account](https://console.anthropic.com/)
* An [API key](https://console.anthropic.com/settings/keys)
* Python 3.7+ or TypeScript 4.5+

Anthropic provides [Python and TypeScript SDKs](https://docs.anthropic.com/en/api/client-sdks), although you can make direct HTTP requests to the API.

## Start with the Workbench

Any API call you make—regardless of the specific task—sends a well-configured prompt to the Anthropic API. As you're learning to make the most of Claude, we recommend that you start the development process in the Workbench, a web-based interface to Claude.

Log into the [Anthropic Console](https://console.anthropic.com) and click **Write a prompt from scratch**.

In the middle section, under User, let's ask Claude a question.

<CodeGroup>
  ```text User
  Why is the ocean salty?
  ```

  <CodeBlock
    filename={
  <TryInConsoleButton userPrompt="Why is the ocean salty?">
    Try in Console
  </TryInConsoleButton>
}
  />
</CodeGroup>

Click **Run**. On the right side, you'll see output like

```text Response
The ocean is salty due to several factors:

1. Weathering of rocks: Over millions of years, rain, rivers, and streams have eroded rocks containing mineral salts. These salts are carried into the ocean by water runoff.
2. Volcanic activity: Underwater volcanoes and hydrothermal vents release minerals, including salts, into the ocean water.
3. Atmospheric deposition: Salt particles from ocean spray can be carried by wind and deposited back into the ocean.
4. Evaporation: As water evaporates from the surface of the ocean, it leaves behind dissolved salts, increasing the concentration of salt in the remaining water.
5. Biological processes: Some marine organisms contribute to the ocean's salinity by releasing salt compounds as byproducts of their metabolism.

Over time, these processes have continuously added salts to the ocean, while evaporation removes pure water, leading to the ocean's current salinity levels. It's important to note that the total amount of salt in the ocean remains relatively stable because the input of salts is balanced by the removal of salts through processes like the formation of evaporite deposits.
```

This is a good answer, but let's say we wanted to control the exact type of answer Claude gives. For example, only allowing Claude to respond to questions with poems. We can control the format, tone, and personality of the response by adding a System Prompt.

<CodeGroup>
  ```text System prompt
  You are a world-class poet. Respond only with short poems.
  ```

  <CodeBlock
    filename={
  <TryInConsoleButton
    systemPrompt="You are a world-class poet. Respond only with short poems."
    userPrompt="Why is the ocean salty?"
  >
    Try in Console
  </TryInConsoleButton>
}
  />
</CodeGroup>

Click **Run** again.

```text Response
The ocean's salty brine,
A tale of time and elements combined.
Rocks and rain, a slow erosion,
Minerals carried in solution.
Eons pass, the salt remains,
In the vast, eternal watery domain.
```

See how Claude's response has changed? LLMs respond well to clear and direct instructions. You can put the role instructions in either the system prompt or the user message. We recommend testing to see which way yields the best results for your use case.

Once you've tweaked the inputs such that you're pleased with the output and have a good sense how to use Claude, convert your Workbench into an integration.

<Tip>Click **Get Code** to copy the generated code representing your Workbench session.</Tip>

## Install the SDK

Anthropic provides SDKs for [Python](https://pypi.org/project/anthropic/) (3.7+), [TypeScript](https://www.npmjs.com/package/@anthropic-ai/sdk) (4.5+), and [Java](https://central.sonatype.com/artifact/com.anthropic/anthropic-java/) (8+). We also currently have a [Go](https://pkg.go.dev/github.com/anthropics/anthropic-sdk-go) SDK in beta.

<Tabs>
  <Tab title="Python">
    In your project directory, create a virtual environment.

    ```bash
    python -m venv claude-env
    ```

    Activate the virtual environment using

    * On macOS or Linux, `source claude-env/bin/activate`
    * On Windows, `claude-env\Scripts\activate`

    ```bash
    pip install anthropic
    ```
  </Tab>

  <Tab title="TypeScript">
    Install the SDK.

    ```bash
    npm install @anthropic-ai/sdk
    ```
  </Tab>

  <Tab title="Java">
    First find the current version of the Java SDK on [Maven Central](https://central.sonatype.com/artifact/com.anthropic/anthropic-java).
    Declare the SDK as a dependency in your Gradle file:

    ```gradle
    implementation("com.anthropic:anthropic-java:1.0.0")
    ```

    Or in your Maven file:

    ```xml
    <dependency>
      <groupId>com.anthropic</groupId>
      <artifactId>anthropic-java</artifactId>
      <version>1.0.0</version>
    </dependency>
    ```
  </Tab>
</Tabs>

## Set your API key

Every API call requires a valid API key. The SDKs are designed to pull the API key from an environmental variable `ANTHROPIC_API_KEY`. You can also supply the key to the Anthropic client when initializing it.

<CodeGroup>
  ```bash macOS and Linux
  export ANTHROPIC_API_KEY='your-api-key-here'
  ```

  ```batch Windows
  setx ANTHROPIC_API_KEY "your-api-key-here"
  ```
</CodeGroup>

## Call the API

Call the API by passing the proper parameters to the [/messages](https://docs.anthropic.com/en/api/messages) endpoint.

Note that the code provided by the Workbench sets the API key in the constructor. If you set the API key as an environment variable, you can omit that line as below.

<CodeGroup>
  ```python Python
  import anthropic

  client = anthropic.Anthropic()

  message = client.messages.create(
      model="claude-opus-4-20250514",
      max_tokens=1000,
      temperature=1,
      system="You are a world-class poet. Respond only with short poems.",
      messages=[
          {
              "role": "user",
              "content": [
                  {
                      "type": "text",
                      "text": "Why is the ocean salty?"
                  }
              ]
          }
      ]
  )
  print(message.content)
  ```

  ```typescript TypeScript
  import Anthropic from "@anthropic-ai/sdk";

  const anthropic = new Anthropic();

  const msg = await anthropic.messages.create({
    model: "claude-opus-4-20250514",
    max_tokens: 1000,
    temperature: 1,
    system: "Respond only with short poems.",
    messages: [
      {
        role: "user",
        content: [
          {
            type: "text",
            text: "Why is the ocean salty?"
          }
        ]
      }
    ]
  });
  console.log(msg);
  ```

  ```java Java
  import com.anthropic.client.AnthropicClient;
  import com.anthropic.client.okhttp.AnthropicOkHttpClient;
  import com.anthropic.models.messages.Message;
  import com.anthropic.models.messages.MessageCreateParams;
  import com.anthropic.models.messages.Model;

  public class MessagesPoetryExample {

      public static void main(String[] args) {
          AnthropicClient client = AnthropicOkHttpClient.fromEnv();

          MessageCreateParams params = MessageCreateParams.builder()
                  .model("claude-opus-4-20250514")
                  .maxTokens(1000)
                  .temperature(1.0)
                  .system("You are a world-class poet. Respond only with short poems.")
                  .addUserMessage("Why is the ocean salty?")
                  .build();

          Message message = client.messages().create(params);
          System.out.println(message.content());
      }
  }
  ```
</CodeGroup>

Run the code using `python3 claude_quickstart.py` or `node claude_quickstart.js`.

<CodeGroup>
  ```python Output (Python)
  [TextBlock(text="The ocean's salty brine,\nA tale of time and design.\nRocks and rivers, their minerals shed,\nAccumulating in the ocean's bed.\nEvaporation leaves salt behind,\nIn the vast waters, forever enshrined.", type='text')]
  ```

  ```typescript Output (TypeScript)
  [
    {
      type: 'text',
      text: "The ocean's vast expanse,\n" +
        'Tears of ancient earth,\n' +
        "Minerals released through time's long dance,\n" +
        'Rivers carry worth.\n' +
        '\n' +
        'Salt from rocks and soil,\n' +
        'Washed into the sea,\n' +
        'Eons of this faithful toil,\n' +
        'Briny destiny.'
    }
  ]
  ```

  ```java Output (Java)
  [ContentBlock{text=TextBlock{citations=, text=The ocean's salty brine,
  A tale of time and design.
  Rocks and rivers, their minerals shed,
  Accumulating in the ocean's bed.
  Evaporation leaves salt behind,
  In the vast waters, forever enshrined.,
  Dissolved in water, wild and free., type=text, additionalProperties={}}}]
  ```
</CodeGroup>

<Info>The Workbench and code examples use default model settings for: model (name), temperature, and max tokens to sample. </Info>

This quickstart shows how to develop a basic, but functional, Claude-powered application using the Console, Workbench, and API. You can use this same workflow as the foundation for much more powerful use cases.

## Next steps

Now that you have made your first Anthropic API request, it's time to explore what else is possible:

<CardGroup cols={3}>
  <Card title="Use Case Guides" icon="arrow-progress" href="/en/docs/about-claude/use-case-guides/overview">
    End to end implementation guides for common use cases.
  </Card>

  <Card title="Anthropic Cookbook" icon="hat-chef" href="https://github.com/anthropics/anthropic-cookbook">
    Learn with interactive Jupyter notebooks that demonstrate uploading PDFs, embeddings, and more.
  </Card>

  <Card title="Prompt Library" icon="books" href="/en/resources/prompt-library/library">
    Explore dozens of example prompts for inspiration across use cases.
  </Card>
</CardGroup>


# Models overview

> Claude is a family of state-of-the-art large language models developed by Anthropic. This guide introduces our models and compares their performance with legacy models. 

<Tip>Introducing Claude 4, our latest generation of models:<br /><br />
**Claude Opus 4** - Our most capable and intelligent model yet. Claude Opus 4 sets new standards in complex reasoning and advanced coding<br /><br />
**Claude Sonnet 4** - Our high-performance model with exceptional reasoning and efficiency<br /><br />
Learn more in our [blog post](https://www.anthropic.com/news/claude-4).</Tip>

<CardGroup cols={2}>
  <Card title="Claude Opus 4" icon="trophy" href="/en/docs/about-claude/models/overview#model-comparison-table">
    Our most powerful and capable model

    * <Icon icon="inbox-in" iconType="thin" /> Text and image input
    * <Icon icon="inbox-out" iconType="thin" /> Text output
    * <Icon icon="book" iconType="thin" /> 200k context window
    * <Icon icon="brain" iconType="thin" /> Superior reasoning capabilities
  </Card>

  <Card title="Claude Sonnet 4" icon="star" href="/en/docs/about-claude/models/overview#model-comparison-table">
    High-performance model with exceptional reasoning capabilities

    * <Icon icon="inbox-in" iconType="thin" /> Text and image input
    * <Icon icon="inbox-out" iconType="thin" /> Text output
    * <Icon icon="book" iconType="thin" /> 200k context window
  </Card>
</CardGroup>

***

## Model names

| Model             | Anthropic API                                             | AWS Bedrock                                 | GCP Vertex AI                |
| ----------------- | --------------------------------------------------------- | ------------------------------------------- | ---------------------------- |
| Claude Opus 4     | `claude-opus-4-20250514`                                  | `anthropic.claude-opus-4-20250514-v1:0`     | `claude-opus-4@20250514`     |
| Claude Sonnet 4   | `claude-sonnet-4-20250514`                                | `anthropic.claude-sonnet-4-20250514-v1:0`   | `claude-sonnet-4@20250514`   |
| Claude Sonnet 3.7 | `claude-3-7-sonnet-20250219` (`claude-3-7-sonnet-latest`) | `anthropic.claude-3-7-sonnet-20250219-v1:0` | `claude-3-7-sonnet@20250219` |
| Claude Haiku 3.5  | `claude-3-5-haiku-20241022` (`claude-3-5-haiku-latest`)   | `anthropic.claude-3-5-haiku-20241022-v1:0`  | `claude-3-5-haiku@20241022`  |

| Model                | Anthropic API                                             | AWS Bedrock                                 | GCP Vertex AI                   |
| -------------------- | --------------------------------------------------------- | ------------------------------------------- | ------------------------------- |
| Claude Sonnet 3.5 v2 | `claude-3-5-sonnet-20241022` (`claude-3-5-sonnet-latest`) | `anthropic.claude-3-5-sonnet-20241022-v2:0` | `claude-3-5-sonnet-v2@20241022` |
| Claude Sonnet 3.5    | `claude-3-5-sonnet-20240620`                              | `anthropic.claude-3-5-sonnet-20240620-v1:0` | `claude-3-5-sonnet@20240620`    |
| Claude Haiku 3       | `claude-3-haiku-20240307`                                 | `anthropic.claude-3-haiku-20240307-v1:0`    | `claude-3-haiku@20240307`       |

<Note>Models with the same snapshot date (e.g., 20240620) are identical across all platforms and do not change. The snapshot date in the model name ensures consistency and allows developers to rely on stable performance across different environments.</Note>

### Model aliases

For convenience during development and testing, we offer aliases for our model ids. These aliases automatically point to the most recent snapshot of a given model. When we release new model snapshots, we migrate aliases to point to the newest version of a model, typically within a week of the new release.

<Tip>
  While aliases are useful for experimentation, we recommend using specific model versions (e.g., `claude-sonnet-4-20250514`) in production applications to ensure consistent behavior.
</Tip>

| Model             | Alias                      | Model ID                     |
| ----------------- | -------------------------- | ---------------------------- |
| Claude Opus 4     | `claude-opus-4-0`          | `claude-opus-4-20250514`     |
| Claude Sonnet 4   | `claude-sonnet-4-0`        | `claude-sonnet-4-20250514`   |
| Claude Sonnet 3.7 | `claude-3-7-sonnet-latest` | `claude-3-7-sonnet-20250219` |
| Claude Sonnet 3.5 | `claude-3-5-sonnet-latest` | `claude-3-5-sonnet-20241022` |
| Claude Haiku 3.5  | `claude-3-5-haiku-latest`  | `claude-3-5-haiku-20241022`  |

<Note>
  Aliases are subject to the same rate limits and pricing as the underlying model version they reference.
</Note>

### Model comparison table

To help you choose the right model for your needs, we've compiled a table comparing the key features and capabilities of each model in the Claude family:

| Feature                                                               | Claude Opus 4                                                                                        | Claude Sonnet 4                                                                                       | Claude Sonnet 3.7                                                                                     | Claude Sonnet 3.5                                                                                                                          | Claude Haiku 3.5                                                                                       | Claude Haiku 3                                                                                       |
| :-------------------------------------------------------------------- | :--------------------------------------------------------------------------------------------------- | :---------------------------------------------------------------------------------------------------- | :---------------------------------------------------------------------------------------------------- | :----------------------------------------------------------------------------------------------------------------------------------------- | :----------------------------------------------------------------------------------------------------- | :--------------------------------------------------------------------------------------------------- |
| **Description**                                                       | Our most capable model                                                                               | High-performance model                                                                                | High-performance model with early extended thinking                                                   | Our previous intelligent model                                                                                                             | Our fastest model                                                                                      | Fast and compact model for near-instant responsiveness                                               |
| **Strengths**                                                         | Highest level of intelligence and capability                                                         | High intelligence and balanced performance                                                            | High intelligence with toggleable extended thinking                                                   | High level of intelligence and capability                                                                                                  | Intelligence at blazing speeds                                                                         | Quick and accurate targeted performance                                                              |
| **Multilingual**                                                      | Yes                                                                                                  | Yes                                                                                                   | Yes                                                                                                   | Yes                                                                                                                                        | Yes                                                                                                    | Yes                                                                                                  |
| **Vision**                                                            | Yes                                                                                                  | Yes                                                                                                   | Yes                                                                                                   | Yes                                                                                                                                        | Yes                                                                                                    | Yes                                                                                                  |
| **[Extended thinking](/en/docs/build-with-claude/extended-thinking)** | Yes                                                                                                  | Yes                                                                                                   | Yes                                                                                                   | No                                                                                                                                         | No                                                                                                     | No                                                                                                   |
| **[Priority Tier](/en/api/service-tiers)**                            | Yes                                                                                                  | Yes                                                                                                   | Yes                                                                                                   | Yes                                                                                                                                        | Yes                                                                                                    | No                                                                                                   |
| **API model name**                                                    | `claude-opus-4-20250514`                                                                             | `claude-sonnet-4-20250514`                                                                            | `claude-3-7-sonnet-20250219`                                                                          | <strong>Upgraded version:</strong> `claude-3-5-sonnet-20241022`<br /><br /><strong>Previous version:</strong> `claude-3-5-sonnet-20240620` | `claude-3-5-haiku-20241022`                                                                            | `claude-3-haiku-20240307`                                                                            |
| **Comparative latency**                                               | Moderately Fast                                                                                      | Fast                                                                                                  | Fast                                                                                                  | Fast                                                                                                                                       | Fastest                                                                                                | Fast                                                                                                 |
| **Context window**                                                    | <Tooltip tip="~150K words \ ~680K unicode characters">200K</Tooltip>                                 | <Tooltip tip="~150K words \ ~680K unicode characters">200K</Tooltip>                                  | <Tooltip tip="~150K words \ ~680K unicode characters">200K</Tooltip>                                  | <Tooltip tip="~150K words \ ~680K unicode characters">200K</Tooltip>                                                                       | <Tooltip tip="~150K words \ ~215K unicode characters">200K</Tooltip>                                   | <Tooltip tip="~150K words \ ~680K unicode characters">200K</Tooltip>                                 |
| **Max output**                                                        | <Tooltip tip="~24K words \ 109K unicode characters \ ~50 single spaced pages">32000 tokens</Tooltip> | <Tooltip tip="~48K words \ 218K unicode characters \ ~100 single spaced pages">64000 tokens</Tooltip> | <Tooltip tip="~48K words \ 218K unicode characters \ ~100 single spaced pages">64000 tokens</Tooltip> | <Tooltip tip="~6.2K words \ 28K unicode characters \ ~12-13 single spaced pages">8192 tokens</Tooltip>                                     | <Tooltip tip="~6.2K words \ 28K unicode characters \ ~12-13 single spaced pages">8192 tokens</Tooltip> | <Tooltip tip="~3.1K words \ 14K unicode characters \ ~6-7 single spaced pages">4096 tokens</Tooltip> |
| **Training data cut-off**                                             | Mar 2025                                                                                             | Mar 2025                                                                                              | Nov 2024<sup>1</sup>                                                                                  | Apr 2024                                                                                                                                   | July 2024                                                                                              | Aug 2023                                                                                             |

*<sup>1 - While trained on publicly available information on the internet through November 2024, Claude Sonnet 3.7's knowledge cut-off date is the end of October 2024. This means the models' knowledge base is most extensive and reliable on information and events up to October 2024.</sup>*

<Note>
  Include the beta header `output-128k-2025-02-19` in your API request to increase the maximum output token length to 128k tokens for Claude Sonnet 3.7.

  We strongly suggest using our [streaming Messages API](/en/docs/build-with-claude/streaming) to avoid timeouts when generating longer outputs.
  See our guidance on [long requests](/en/api/errors#long-requests) for more details.
</Note>

### Model pricing

The table below shows the price per million tokens for each model:

| Model             | Base Input Tokens | 5m Cache Writes | 1h Cache Writes | Cache Hits & Refreshes | Output Tokens |
| ----------------- | ----------------- | --------------- | --------------- | ---------------------- | ------------- |
| Claude Opus 4     | \$15 / MTok       | \$18.75 / MTok  | \$30 / MTok     | \$1.50 / MTok          | \$75 / MTok   |
| Claude Sonnet 4   | \$3 / MTok        | \$3.75 / MTok   | \$6 / MTok      | \$0.30 / MTok          | \$15 / MTok   |
| Claude Sonnet 3.7 | \$3 / MTok        | \$3.75 / MTok   | \$6 / MTok      | \$0.30 / MTok          | \$15 / MTok   |
| Claude Sonnet 3.5 | \$3 / MTok        | \$3.75 / MTok   | \$6 / MTok      | \$0.30 / MTok          | \$15 / MTok   |
| Claude Haiku 3.5  | \$0.80 / MTok     | \$1 / MTok      | \$1.6 / MTok    | \$0.08 / MTok          | \$4 / MTok    |
| Claude Opus 3     | \$15 / MTok       | \$18.75 / MTok  | \$30 / MTok     | \$1.50 / MTok          | \$75 / MTok   |
| Claude Haiku 3    | \$0.25 / MTok     | \$0.30 / MTok   | \$0.50 / MTok   | \$0.03 / MTok          | \$1.25 / MTok |

## Prompt and output performance

Claude 4 models excel in:

* **Performance**: Top-tier results in reasoning, coding, multilingual tasks, long-context handling, honesty, and image processing. See the [Claude 4 blog post](http://www.anthropic.com/news/claude-4) for more information.
* **Engaging responses**: Claude models are ideal for applications that require rich, human-like interactions.

  * If you prefer more concise responses, you can adjust your prompts to guide the model toward the desired output length. Refer to our [prompt engineering guides](/en/docs/build-with-claude/prompt-engineering) for details.
  * For specific Claude 4 prompting best practices, see our [Claude 4 best practices guide](/en/docs/build-with-claude/prompt-engineering/claude-4-best-practices).
* **Output quality**: When migrating from previous model generations to Claude 4, you may notice larger improvements in overall performance.

## Migrating to Claude 4

In most cases, you can switch from Claude 3.7 models to Claude 4 models with minimal changes:

1. Update your model name:
   * From: `claude-3-7-sonnet-20250219`
   * To: `claude-sonnet-4-20250514` or `claude-opus-4-20250514`

2. Your existing API calls will continue to work without modification, although API behavior has changed slightly in Claude 4 models (see [API release notes](/en/release-notes/api) for details).

For more details, see [Migrating to Claude 4](/en/docs/about-claude/models/migrating-to-claude-4).

***

## Get started with Claude

If you're ready to start exploring what Claude can do for you, let's dive in! Whether you're a developer looking to integrate Claude into your applications or a user wanting to experience the power of AI firsthand, we've got you covered.

<Note>Looking to chat with Claude? Visit [claude.ai](http://www.claude.ai)!</Note>

<CardGroup cols={3}>
  <Card title="Intro to Claude" icon="check" href="/en/docs/intro-to-claude">
    Explore Claude’s capabilities and development flow.
  </Card>

  <Card title="Quickstart" icon="bolt-lightning" href="/en/resources/quickstarts">
    Learn how to make your first API call in minutes.
  </Card>

  <Card title="Anthropic Console" icon="code" href="https://console.anthropic.com">
    Craft and test powerful prompts directly in your browser.
  </Card>
</CardGroup>

If you have any questions or need assistance, don't hesitate to reach out to our [support team](https://support.anthropic.com/) or consult the [Discord community](https://www.anthropic.com/discord).


# Choosing the right model

> Selecting the optimal Claude model for your application involves balancing three key considerations: capabilities, speed, and cost. This guide helps you make an informed decision based on your specific requirements.

## Establish key criteria

When choosing a Claude model, we recommend first evaluating these factors:

* **Capabilities:** What specific features or capabilities will you need the model to have in order to meet your needs?
* **Speed:** How quickly does the model need to respond in your application?
* **Cost:** What's your budget for both development and production usage?

Knowing these answers in advance will make narrowing down and deciding which model to use much easier.

***

## Choose the best model to start with

There are two general approaches you can use to start testing which Claude model best works for your needs.

### Option 1: Start with a fast, cost-effective model

For many applications, starting with a faster, more cost-effective model like Claude 3.5 Haiku can be the optimal approach:

1. Begin implementation with Claude 3.5 Haiku
2. Test your use case thoroughly
3. Evaluate if performance meets your requirements
4. Upgrade only if necessary for specific capability gaps

This approach allows for quick iteration, lower development costs, and is often sufficient for many common applications. This approach is best for:

* Initial prototyping and development
* Applications with tight latency requirements
* Cost-sensitive implementations
* High-volume, straightforward tasks

### Option 2: Start with the most capable model

For complex tasks where intelligence and advanced capabilities are paramount, you may want to start with the most capable model and then consider optimizing to more efficient models down the line:

1. Implement with Claude Opus 4 or Claude Sonnet 4
2. Optimize your prompts for these models
3. Evaluate if performance meets your requirements
4. Consider increasing efficiency by downgrading intelligence over time with greater workflow optimization

This approach is best for:

* Complex reasoning tasks
* Scientific or mathematical applications
* Tasks requiring nuanced understanding
* Applications where accuracy outweighs cost considerations
* Advanced coding

## Model selection matrix

| When you need...                                                                                                         | We recommend starting with... | Example use cases                                                                                                        |
| ------------------------------------------------------------------------------------------------------------------------ | ----------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| Highest intelligence and reasoning, superior capabilities for the most complex tasks, such as multi agent coding         | Claude Opus 4                 | Multi agent frameworks, complex codebase refactoring, nuanced creative writing, complex financial or scientific analysis |
| Balance of intelligence and speed, strong performance but with faster response times                                     | Claude Sonnet 4               | Complex customer chatbot inquiries, complex code generation, straightforward agentic loops, data analysis                |
| Fast responses at lower cost, optimized for high volume, straightforward applications with no need for extended thinking | Claude 3.5 Haiku              | Basic customer support, high volume formulaic content generation, straightforward data extraction                        |

***

## Decide whether to upgrade or change models

To determine if you need to upgrade or change models, you should:

1. [Create benchmark tests](/en/docs/test-and-evaluate/develop-tests) specific to your use case - having a good evaluation set is the most important step in the process
2. Test with your actual prompts and data
3. Compare performance across models for:
   * Accuracy of responses
   * Response quality
   * Handling of edge cases
4. Weigh performance and cost tradeoffs

## Next steps

<CardGroup cols={3}>
  <Card title="Model comparison chart" icon="head-side-gear" href="/en/docs/about-claude/models/overview">
    See detailed specifications and pricing for the latest Claude models
  </Card>

  <Card title="Migrate to Claude 4" icon="sparkles" href="/en/docs/about-claude/models/migrating-to-claude-4">
    Follow the checklist for an easy migration to Claude 4
  </Card>

  <Card title="Start building" icon="code" href="/en/docs/get-started">
    Get started with your first API call
  </Card>
</CardGroup>


# Migrating to Claude 4

This page provides guidance on migrating from Claude 3.7 models to Claude 4 models (Opus 4 and Sonnet 4).

In most cases, you can switch to Claude 4 models with minimal changes:

1. Update your model name:
   * From: `claude-3-7-sonnet-20250219`
   * To: `claude-sonnet-4-20250514` or `claude-opus-4-20250514`

2. Existing API calls should continue to work without modification, although API behavior has changed slightly in Claude 4 models (see [API release notes](/en/release-notes/api) for details).

## What's new in Claude 4

### New refusal stop reason

Claude 4 models introduce a new `refusal` stop reason for content that the model declines to generate for safety reasons, due to the increased intelligence of Claude 4 models:

```json
{"id":"msg_014XEDjypDjFzgKVWdFUXxZP",
"type":"message",
"role":"assistant",
"model":"claude-sonnet-4-20250514",
"content":[{"type":"text","text":"I would be happy to assist you. You can "}],
"stop_reason":"refusal",
"stop_sequence":null,
"usage":{"input_tokens":564,"cache_creation_input_tokens":0,"cache_read_input_tokens":0,"output_tokens":22}
}
```

When migrating to Claude 4, you should update your application to [handle `refusal` stop reasons](/en/docs/test-and-evaluate/strengthen-guardrails/handle-streaming-refusals).

### Summarized thinking

With extended thinking enabled, the Messages API for Claude 4 models returns a summary of Claude's full thinking process. Summarized thinking provides the full intelligence benefits of extended thinking, while preventing misuse.

While the API is consistent across Claude 3.7 and 4 models, streaming responses for extended thinking might return in a "chunky" delivery pattern, with possible delays between streaming events.

<Note>
  Summarization is processed by a different model than the one you target in your requests. The thinking model does not see the summarized output.
</Note>

For more information, see the [Extended thinking documentation](/en/docs/build-with-claude/extended-thinking#summarized-thinking).

### Interleaved thinking

Claude 4 models support interleaving tool use with extended thinking, allowing for more natural conversations where tool uses and responses can be mixed with regular messages.

<Note>
  Interleaved thinking is in beta. To enable interleaved thinking, add [the beta header](/en/api/beta-headers) `interleaved-thinking-2025-05-14` to your API request.
</Note>

For more information, see the [Extended thinking documentation](/en/docs/build-with-claude/extended-thinking#interleaved-thinking).

### Updated text editor tool

The text editor tool has been updated for Claude 4 models with the following changes:

* **Tool type**: `text_editor_20250728`
* **Tool name**: `str_replace_based_edit_tool`
* The `undo_edit` command is no longer supported in Claude 4 models.

<Note>
  The `str_replace_editor` text editor tool remains the same for Claude Sonnet 3.7.
</Note>

If you're migrating from Claude Sonnet 3.7 and using the text editor tool:

```python
# Claude Sonnet 3.7
tools=[
    {
        "type": "text_editor_20250124",
        "name": "str_replace_editor"
    }
]

# Claude 4
tools=[
    {
        "type": "text_editor_20250728",
        "name": "str_replace_based_edit_tool"
    }
]
```

For more information, see the [Text editor tool documentation](/en/docs/agents-and-tools/tool-use/text-editor-tool).

### Token-efficient tool use no longer supported

[Token-efficient tool use](/en/docs/agents-and-tools/tool-use/token-efficient-tool-use) is only available in Claude Sonnet 3.7.

If you're migrating from Claude Sonnet 3.7 and using token-efficient tool use, we recommend removing the `token-efficient-tools-2025-02-19` [beta header](/en/api/beta-headers) from your requests.

The `token-efficient-tools-2025-02-19` beta header can still be included in Claude 4 requests, but it will have no effect.

### Extended output no longer supported

The `output-128k-2025-02-19` [beta header](/en/api/beta-headers) for extended output is only available in Claude Sonnet 3.7.

If you're migrating from Claude Sonnet 3.7, we recommend removing `output-128k-2025-02-19` from your requests.

The `output-128k-2025-02-19` beta header can still be included in Claude 4 requests, but it will have no effect.

## Performance considerations

### Claude Sonnet 4

* Improved reasoning and intelligence capabilities compared to Claude Sonnet 3.7
* Enhanced tool use accuracy

### Claude Opus 4

* Most capable model with superior reasoning and intelligence
* Slower than Sonnet models
* Best for complex tasks requiring deep analysis

## Migration checklist

* [ ] Update model id in your API calls
* [ ] Test existing requests (should work without changes)
* [ ] Remove `token-efficient-tools-2025-02-19` beta header if applicable
* [ ] Remove `output-128k-2025-02-19` beta header if applicable
* [ ] Handle new `refusal` stop reason
* [ ] Update text editor tool type and name if using it
* [ ] Remove any code that uses the `undo_edit` command
* [ ] Explore new tool interleaving capabilities with extended thinking
* [ ] Review [Claude 4 prompt engineering best practices](/en/docs/build-with-claude/prompt-engineering/claude-4-best-practices) for optimal results
* [ ] Test in development before production deployment

## Need help?

* Check our [API documentation](/en/api/overview) for detailed specifications.
* Review [model capabilities](/en/docs/about-claude/models/overview) for performance comparisons.
* Review [API release notes](/en/release-notes/api) for API updates.
* Contact support if you encounter any issues during migration.


# Building with Claude

> Claude is a family of [highly performant and intelligent AI models](/en/docs/about-claude/models) built by Anthropic. While Claude is powerful and extensible, it's also the most trustworthy and reliable AI available. It follows critical protocols, makes fewer mistakes, and is resistant to jailbreaks—allowing [enterprise customers](https://www.anthropic.com/customers) to build the safest AI-powered applications at scale.

This guide introduces Claude's enterprise capabilities, the end-to-end flow for developing with Claude, and how to start building.

## What you can do with Claude

Claude is designed to empower enterprises at scale with strong performance across benchmark evaluations for reasoning, math, coding, and fluency in English and non-English languages.

Here's a non-exhaustive list of Claude's capabilities and common uses.

| Capability               | Enables you to...                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| ------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Text and code generation | <ul><li>Adhere to brand voice for excellent customer-facing experiences such as copywriting and chatbots</li><li>Create production-level code and operate (in-line code generation, debugging, and conversational querying) within complex codebases</li><li>Build automatic translation features between languages</li><li>Conduct complex financial forecasts</li><li>Support legal use cases that require high-quality technical analysis, long context windows for processing detailed documents, and fast outputs</li></ul> |
| Vision                   | <ul><li>Process and analyze visual input, such as extracting insights from charts and graphs</li><li>Generate code from images with code snippets or templates based on diagrams</li><li>Describe an image for a user with low vision</li></ul>                                                                                                                                                                                                                                                                                  |
| Tool use                 | <ul><li>Interact with external client-side tools and functions, allowing Claude to reason, plan, and execute actions by generating structured outputs through API calls</li></ul>                                                                                                                                                                                                                                                                                                                                                |

## Enterprise considerations

Along with an extensive set of features, tools, and capabilities, Claude is also built to be secure, trustworthy, and scalable for wide-reaching enterprise needs.

| Feature            | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| ------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Secure**         | <ul><li><a href="https://trust.anthropic.com/">Enterprise-grade</a> security and data handling for API</li><li>SOC II Type 2 certified, HIPAA compliance options for API</li><li>Accessible through AWS (GA) and GCP (in private preview)</li></ul>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| **Trustworthy**    | <ul><li>Resistant to jailbreaks and misuse. We continuously monitor prompts and outputs for harmful, malicious use cases that violate our <a href="https://www.anthropic.com/legal/aup">AUP</a>.</li><li>Copyright indemnity protections for paid commercial services</li><li>Uniquely positioned to serve high trust industries that process large volumes of sensitive user data</li></ul>                                                                                                                                                                                                                                                                                                                                                                                                    |
| **Capable**        | <ul><li>200K token context window for expanded use cases, with future support for 1M</li><li><a href="/en/docs/agents-and-tools/tool-use/overview">Tool use</a>, also known as function calling, which allows seamless integration of Claude into specialized applications and custom workflows</li><li>Multimodal input capabilities with text output, allowing you to upload images (such as tables, graphs, and photos) along with text prompts for richer context and complex use cases</li><li><a href="https://console.anthropic.com">Developer Console</a> with Workbench and prompt generation tool for easier, more powerful prompting and experimentation</li><li><a href="/en/api/client-sdks">SDKs</a> and <a href="/en/api">APIs</a> to expedite and enhance development</li></ul> |
| **Reliable**       | <ul><li>Very low hallucination rates</li><li>Accurate over long documents</li></ul>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| **Global**         | <ul><li>Great for coding tasks and fluency in English and non-English languages like Spanish and Japanese</li><li>Enables use cases like translation services and broader global utility</li></ul>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| **Cost conscious** | <ul><li>Family of models balances cost, performance, and intelligence</li></ul>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |

## Implementing Claude

<Steps>
  <Step title="Scope your use case">
    * Identify a problem to solve or tasks to automate with Claude.
    * Define requirements: features, performance, and cost.
  </Step>

  <Step title="Design your integration">
    * Select Claude's capabilities (e.g., vision, tool use) and models (Opus, Sonnet, Haiku) based on needs.
    * Choose a deployment method, such as the Anthropic API, AWS Bedrock, or Vertex AI.
  </Step>

  <Step title="Prepare your data">
    * Identify and clean relevant data (databases, code repos, knowledge bases) for Claude's context.
  </Step>

  <Step title="Develop your prompts">
    * Use Workbench to create evals, draft prompts, and iteratively refine based on test results.
    * Deploy polished prompts and monitor real-world performance for further refinement.
  </Step>

  <Step title="Implement Claude">
    * Set up your environment, integrate Claude with your systems (APIs, databases, UIs), and define human-in-the-loop requirements.
  </Step>

  <Step title="Test your system">
    * Conduct red teaming for potential misuse and A/B test improvements.
  </Step>

  <Step title="Deploy to production">
    * Once your application runs smoothly end-to-end, deploy to production.
  </Step>

  <Step title="Monitor and improve">
    * Monitor performance and effectiveness to make ongoing improvements.
  </Step>
</Steps>

## Start building with Claude

When you're ready, start building with Claude:

* Follow the [Quickstart](/en/resources/quickstarts) to make your first API call
* Check out the [API Reference](/en/api)
* Explore the [Prompt Library](/en/resources/prompt-library/library) for example prompts
* Experiment and start building with the [Workbench](https://console.anthropic.com)
* Check out the [Anthropic Cookbook](https://github.com/anthropics/anthropic-cookbook) for working code examples


# Features overview

> Explore Claude's advanced features and capabilities.

## Core capabilities

These features enhance Claude's fundamental abilities for processing, analyzing, and generating content across various formats and use cases.

| Feature                                                           | Description                                                                                                                                                                                                               | Availability                                                                |
| ----------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------- |
| [Batch processing](/en/docs/build-with-claude/batch-processing)   | Process large volumes of requests asynchronously for cost savings. Send batches with a large number of queries per batch. Batch API calls costs 50% less than standard API calls.                                         | Anthropic API<br /><br />Amazon Bedrock<br /><br />Google Cloud's Vertex AI |
| [Citations](/en/docs/build-with-claude/citations)                 | Ground Claude's responses in source documents. With Citations, Claude can provide detailed references to the exact sentences and passages it uses to generate responses, leading to more verifiable, trustworthy outputs. | Anthropic API<br /><br />Amazon Bedrock<br /><br />Google Cloud's Vertex AI |
| [Extended thinking](/en/docs/build-with-claude/extended-thinking) | Enhanced reasoning capabilities for complex tasks, providing transparency into Claude's step-by-step thought process before delivering its final answer.                                                                  | Anthropic API<br /><br />Amazon Bedrock<br /><br />Google Cloud's Vertex AI |
| [Files API](/en/docs/build-with-claude/files)                     | Upload and manage files to use with Claude without re-uploading content with each request. Supports PDFs, images, and text files.                                                                                         | Anthropic API (Beta)                                                        |
| [PDF support](/en/docs/build-with-claude/pdf-support)             | Process and analyze text and visual content from PDF documents.                                                                                                                                                           | Anthropic API<br /><br />Amazon Bedrock<br /><br />Google Cloud's Vertex AI |
| [Prompt caching](/en/docs/build-with-claude/prompt-caching)       | Provide Claude with more background knowledge and example outputs to reduce costs and latency.                                                                                                                            | Anthropic API<br /><br />Amazon Bedrock<br /><br />Google Cloud's Vertex AI |
| [Search results](/en/docs/build-with-claude/search-results)       | Enable natural citations for RAG applications by providing search results with proper source attribution. Achieve web search-quality citations for custom knowledge bases and tools.                                      | Anthropic API (Beta)                                                        |
| [Token counting](/en/api/messages-count-tokens)                   | Token counting enables you to determine the number of tokens in a message before sending it to Claude, helping you make informed decisions about your prompts and usage.                                                  | Anthropic API<br /><br />Google Cloud's Vertex AI                           |
| [Tool use](/en/docs/agents-and-tools/tool-use/overview)           | Enable Claude to interact with external tools and APIs to perform a wider variety of tasks. For a list of supported tools, see [the Tools table](#tools).                                                                 | Anthropic API<br /><br />Amazon Bedrock<br /><br />Google Cloud's Vertex AI |

## Tools

These features enable Claude to interact with external systems, execute code, and perform automated tasks through various tool interfaces.

| Feature                                                                                       | Description                                                                                                                  | Availability                                                                                     |
| --------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| [Bash](/en/docs/agents-and-tools/tool-use/bash-tool)                                          | Execute bash commands and scripts to interact with the system shell and perform command-line operations.                     | Anthropic API<br /><br />Amazon Bedrock<br /><br />Google Cloud's Vertex AI                      |
| [Code execution](/en/docs/agents-and-tools/tool-use/code-execution-tool)                      | Run Python code in a sandboxed environment for advanced data analysis.                                                       | Anthropic API (Beta)                                                                             |
| [Computer use](/en/docs/agents-and-tools/tool-use/computer-use-tool)                          | Control computer interfaces by taking screenshots and issuing mouse and keyboard commands.                                   | Anthropic API (Beta)<br /><br />Amazon Bedrock (Beta)<br /><br />Google Cloud's Vertex AI (Beta) |
| [Fine-grained tool streaming](/en/docs/agents-and-tools/tool-use/fine-grained-tool-streaming) | Stream tool use parameters without buffering/JSON validation, reducing latency for receiving large parameters.               | Anthropic API<br /><br />Google Cloud's Vertex AI                                                |
| [MCP connector](/en/docs/agents-and-tools/mcp-connector)                                      | Connect to remote [MCP](/en/docs/agents-and-tools/mcp) servers directly from the Messages API without a separate MCP client. | Anthropic API (Beta)                                                                             |
| [Text editor](/en/docs/agents-and-tools/tool-use/text-editor-tool)                            | Create and edit text files with a built-in text editor interface for file manipulation tasks.                                | Anthropic API<br /><br />Amazon Bedrock<br /><br />Google Cloud's Vertex AI                      |
| [Web search](/en/docs/agents-and-tools/tool-use/web-search-tool)                              | Augment Claude's comprehensive knowledge with current, real-world data from across the web.                                  | Anthropic API                                                                                    |


# Context windows

## Understanding the context window

The "context window" refers to the entirety of the amount of text a language model can look back on and reference when generating new text plus the new text it generates. This is different from the large corpus of data the language model was trained on, and instead represents a "working memory" for the model. A larger context window allows the model to understand and respond to more complex and lengthy prompts, while a smaller context window may limit the model's ability to handle longer prompts or maintain coherence over extended conversations.

The diagram below illustrates the standard context window behavior for API requests<sup>1</sup>:

![Context window diagram](https://mintlify.s3.us-west-1.amazonaws.com/anthropic/images/context-window.svg)

*<sup>1</sup>For chat interfaces, such as for [claude.ai](https://claude.ai/), context windows can also be set up on a rolling "first in, first out" system.*

* **Progressive token accumulation:** As the conversation advances through turns, each user message and assistant response accumulates within the context window. Previous turns are preserved completely.
* **Linear growth pattern:** The context usage grows linearly with each turn, with previous turns preserved completely.
* **200K token capacity:** The total available context window (200,000 tokens) represents the maximum capacity for storing conversation history and generating new output from Claude.
* **Input-output flow:** Each turn consists of:
  * **Input phase:** Contains all previous conversation history plus the current user message
  * **Output phase:** Generates a text response that becomes part of a future input

## The context window with extended thinking

When using [extended thinking](/en/docs/build-with-claude/extended-thinking), all input and output tokens, including the tokens used for thinking, count toward the context window limit, with a few nuances in multi-turn situations.

The thinking budget tokens are a subset of your `max_tokens` parameter, are billed as output tokens, and count towards rate limits.

However, previous thinking blocks are automatically stripped from the context window calculation by the Anthropic API and are not part of the conversation history that the model "sees" for subsequent turns, preserving token capacity for actual conversation content.

The diagram below demonstrates the specialized token management when extended thinking is enabled:

![Context window diagram with extended thinking](https://mintlify.s3.us-west-1.amazonaws.com/anthropic/images/context-window-thinking.svg)

* **Stripping extended thinking:** Extended thinking blocks (shown in dark gray) are generated during each turn's output phase, **but are not carried forward as input tokens for subsequent turns**. You do not need to strip the thinking blocks yourself. The Anthropic API automatically does this for you if you pass them back.
* **Technical implementation details:**
  * The API automatically excludes thinking blocks from previous turns when you pass them back as part of the conversation history.
  * Extended thinking tokens are billed as output tokens only once, during their generation.
  * The effective context window calculation becomes: `context_window = (input_tokens - previous_thinking_tokens) + current_turn_tokens`.
  * Thinking tokens include both `thinking` blocks and `redacted_thinking` blocks.

This architecture is token efficient and allows for extensive reasoning without token waste, as thinking blocks can be substantial in length.

<Note>
  You can read more about the context window and extended thinking in our [extended thinking guide](/en/docs/build-with-claude/extended-thinking).
</Note>

## The context window with extended thinking and tool use

The diagram below illustrates the context window token management when combining extended thinking with tool use:

![Context window diagram with extended thinking and tool use](https://mintlify.s3.us-west-1.amazonaws.com/anthropic/images/context-window-thinking-tools.svg)

<Steps>
  <Step title="First turn architecture">
    * **Input components:** Tools configuration and user message
    * **Output components:** Extended thinking + text response + tool use request
    * **Token calculation:** All input and output components count toward the context window, and all output components are billed as output tokens.
  </Step>

  <Step title="Tool result handling (turn 2)">
    * **Input components:** Every block in the first turn as well as the `tool_result`. The extended thinking block **must** be returned with the corresponding tool results. This is the only case wherein you **have to** return thinking blocks.
    * **Output components:** After tool results have been passed back to Claude, Claude will respond with only text (no additional extended thinking until the next `user` message).
    * **Token calculation:** All input and output components count toward the context window, and all output components are billed as output tokens.
  </Step>

  <Step title="Third Step">
    * **Input components:** All inputs and the output from the previous turn is carried forward with the exception of the thinking block, which can be dropped now that Claude has completed the entire tool use cycle. The API will automatically strip the thinking block for you if you pass it back, or you can feel free to strip it yourself at this stage. This is also where you would add the next `User` turn.
    * **Output components:** Since there is a new `User` turn outside of the tool use cycle, Claude will generate a new extended thinking block and continue from there.
    * **Token calculation:** Previous thinking tokens are automatically stripped from context window calculations. All other previous blocks still count as part of the token window, and the thinking block in the current `Assistant` turn counts as part of the context window.
  </Step>
</Steps>

* **Considerations for tool use with extended thinking:**
  * When posting tool results, the entire unmodified thinking block that accompanies that specific tool request (including signature/redacted portions) must be included.
  * The effective context window calculation for extended thinking with tool use becomes: `context_window = input_tokens + current_turn_tokens`.
  * The system uses cryptographic signatures to verify thinking block authenticity. Failing to preserve thinking blocks during tool use can break Claude's reasoning continuity. Thus, if you modify thinking blocks, the API will return an error.

<Note>
  Claude 4 models support [interleaved thinking](/en/docs/build-with-claude/extended-thinking#interleaved-thinking), which enables Claude to think between tool calls and make more sophisticated reasoning after receiving tool results.

  Claude Sonnet 3.7 does not support interleaved thinking, so there is no interleaving of extended thinking and tool calls without a non-`tool_result` user turn in between.

  For more information about using tools with extended thinking, see our [extended thinking guide](/en/docs/build-with-claude/extended-thinking#extended-thinking-with-tool-use).
</Note>

### Context window management with newer Claude models

In newer Claude models (starting with Claude Sonnet 3.7), if the sum of prompt tokens and output tokens exceeds the model's context window, the system will return a validation error rather than silently truncating the context. This change provides more predictable behavior but requires more careful token management.

To plan your token usage and ensure you stay within context window limits, you can use the [token counting API](/en/docs/build-with-claude/token-counting) to estimate how many tokens your messages will use before sending them to Claude.

See our [model comparison](/en/docs/about-claude/models/overview#model-comparison-table) table for a list of context window sizes by model.

# Next steps

<CardGroup cols={2}>
  <Card title="Model comparison table" icon="scale-balanced" href="/en/docs/about-claude/models/overview#model-comparison-table">
    See our model comparison table for a list of context window sizes and input / output token pricing by model.
  </Card>

  <Card title="Extended thinking overview" icon="head-side-gear" href="/en/docs/build-with-claude/extended-thinking">
    Learn more about how extended thinking works and how to implement it alongside other features such as tool use and prompt caching.
  </Card>
</CardGroup>


# Glossary

> These concepts are not unique to Anthropic’s language models, but we present a brief summary of key terms below.

## Context window

The "context window" refers to the amount of text a language model can look back on and reference when generating new text. This is different from the large corpus of data the language model was trained on, and instead represents a "working memory" for the model. A larger context window allows the model to understand and respond to more complex and lengthy prompts, while a smaller context window may limit the model's ability to handle longer prompts or maintain coherence over extended conversations.

See our [guide to understanding context windows](/en/docs/build-with-claude/context-windows) to learn more.

## Fine-tuning

Fine-tuning is the process of further training a pretrained language model using additional data. This causes the model to start representing and mimicking the patterns and characteristics of the fine-tuning dataset. Claude is not a bare language model; it has already been fine-tuned to be a helpful assistant. Our API does not currently offer fine-tuning, but please ask your Anthropic contact if you are interested in exploring this option. Fine-tuning can be useful for adapting a language model to a specific domain, task, or writing style, but it requires careful consideration of the fine-tuning data and the potential impact on the model's performance and biases.

## HHH

These three H's represent Anthropic's goals in ensuring that Claude is beneficial to society:

* A **helpful** AI will attempt to perform the task or answer the question posed to the best of its abilities, providing relevant and useful information.
* An **honest** AI will give accurate information, and not hallucinate or confabulate. It will acknowledge its limitations and uncertainties when appropriate.
* A **harmless** AI will not be offensive or discriminatory, and when asked to aid in a dangerous or unethical act, the AI should politely refuse and explain why it cannot comply.

## Latency

Latency, in the context of generative AI and large language models, refers to the time it takes for the model to respond to a given prompt. It is the delay between submitting a prompt and receiving the generated output. Lower latency indicates faster response times, which is crucial for real-time applications, chatbots, and interactive experiences. Factors that can affect latency include model size, hardware capabilities, network conditions, and the complexity of the prompt and the generated response.

## LLM

Large language models (LLMs) are AI language models with many parameters that are capable of performing a variety of surprisingly useful tasks. These models are trained on vast amounts of text data and can generate human-like text, answer questions, summarize information, and more. Claude is a conversational assistant based on a large language model that has been fine-tuned and trained using RLHF to be more helpful, honest, and harmless.

## MCP (Model Context Protocol)

Model Context Protocol (MCP) is an open protocol that standardizes how applications provide context to LLMs. Like a USB-C port for AI applications, MCP provides a unified way to connect AI models to different data sources and tools. MCP enables AI systems to maintain consistent context across interactions and access external resources in a standardized manner. See our [MCP documentation](/en/docs/agents-and-tools/mcp) to learn more.

## MCP connector

The MCP connector is a feature that allows API users to connect to MCP servers directly from the Messages API without building an MCP client. This enables seamless integration with MCP-compatible tools and services through the Anthropic API. The MCP connector supports features like tool calling and is available in public beta. See our [MCP connector documentation](/en/docs/agents-and-tools/mcp-connector) to learn more.

## Pretraining

Pretraining is the initial process of training language models on a large unlabeled corpus of text. In Claude's case, autoregressive language models (like Claude's underlying model) are pretrained to predict the next word, given the previous context of text in the document. These pretrained models are not inherently good at answering questions or following instructions, and often require deep skill in prompt engineering to elicit desired behaviors. Fine-tuning and RLHF are used to refine these pretrained models, making them more useful for a wide range of tasks.

## RAG (Retrieval augmented generation)

Retrieval augmented generation (RAG) is a technique that combines information retrieval with language model generation to improve the accuracy and relevance of the generated text, and to better ground the model's response in evidence. In RAG, a language model is augmented with an external knowledge base or a set of documents that is passed into the context window. The data is retrieved at run time when a query is sent to the model, although the model itself does not necessarily retrieve the data (but can with [tool use](/en/docs/agents-and-tools/tool-use/overview) and a retrieval function). When generating text, relevant information first must be retrieved from the knowledge base based on the input prompt, and then passed to the model along with the original query. The model uses this information to guide the output it generates. This allows the model to access and utilize information beyond its training data, reducing the reliance on memorization and improving the factual accuracy of the generated text. RAG can be particularly useful for tasks that require up-to-date information, domain-specific knowledge, or explicit citation of sources. However, the effectiveness of RAG depends on the quality and relevance of the external knowledge base and the knowledge that is retrieved at runtime.

## RLHF

Reinforcement Learning from Human Feedback (RLHF) is a technique used to train a pretrained language model to behave in ways that are consistent with human preferences. This can include helping the model follow instructions more effectively or act more like a chatbot. Human feedback consists of ranking a set of two or more example texts, and the reinforcement learning process encourages the model to prefer outputs that are similar to the higher-ranked ones. Claude has been trained using RLHF to be a more helpful assistant. For more details, you can read [Anthropic's paper on the subject](https://arxiv.org/abs/2204.05862).

## Temperature

Temperature is a parameter that controls the randomness of a model's predictions during text generation. Higher temperatures lead to more creative and diverse outputs, allowing for multiple variations in phrasing and, in the case of fiction, variation in answers as well. Lower temperatures result in more conservative and deterministic outputs that stick to the most probable phrasing and answers. Adjusting the temperature enables users to encourage a language model to explore rare, uncommon, or surprising word choices and sequences, rather than only selecting the most likely predictions.

## TTFT (Time to first token)

Time to First Token (TTFT) is a performance metric that measures the time it takes for a language model to generate the first token of its output after receiving a prompt. It is an important indicator of the model's responsiveness and is particularly relevant for interactive applications, chatbots, and real-time systems where users expect quick initial feedback. A lower TTFT indicates that the model can start generating a response faster, providing a more seamless and engaging user experience. Factors that can influence TTFT include model size, hardware capabilities, network conditions, and the complexity of the prompt.

## Tokens

Tokens are the smallest individual units of a language model, and can correspond to words, subwords, characters, or even bytes (in the case of Unicode). For Claude, a token approximately represents 3.5 English characters, though the exact number can vary depending on the language used. Tokens are typically hidden when interacting with language models at the "text" level but become relevant when examining the exact inputs and outputs of a language model. When Claude is provided with text to evaluate, the text (consisting of a series of characters) is encoded into a series of tokens for the model to process. Larger tokens enable data efficiency during inference and pretraining (and are utilized when possible), while smaller tokens allow a model to handle uncommon or never-before-seen words. The choice of tokenization method can impact the model's performance, vocabulary size, and ability to handle out-of-vocabulary words.


# Prompt caching

Prompt caching is a powerful feature that optimizes your API usage by allowing resuming from specific prefixes in your prompts. This approach significantly reduces processing time and costs for repetitive tasks or prompts with consistent elements.

Here's an example of how to implement prompt caching with the Messages API using a `cache_control` block:

<CodeGroup>
  ```bash Shell
  curl https://api.anthropic.com/v1/messages \
    -H "content-type: application/json" \
    -H "x-api-key: $ANTHROPIC_API_KEY" \
    -H "anthropic-version: 2023-06-01" \
    -d '{
      "model": "claude-opus-4-20250514",
      "max_tokens": 1024,
      "system": [
        {
          "type": "text",
          "text": "You are an AI assistant tasked with analyzing literary works. Your goal is to provide insightful commentary on themes, characters, and writing style.\n"
        },
        {
          "type": "text",
          "text": "<the entire contents of Pride and Prejudice>",
          "cache_control": {"type": "ephemeral"}
        }
      ],
      "messages": [
        {
          "role": "user",
          "content": "Analyze the major themes in Pride and Prejudice."
        }
      ]
    }'

  # Call the model again with the same inputs up to the cache checkpoint
  curl https://api.anthropic.com/v1/messages # rest of input
  ```

  ```python Python
  import anthropic

  client = anthropic.Anthropic()

  response = client.messages.create(
      model="claude-opus-4-20250514",
      max_tokens=1024,
      system=[
        {
          "type": "text",
          "text": "You are an AI assistant tasked with analyzing literary works. Your goal is to provide insightful commentary on themes, characters, and writing style.\n",
        },
        {
          "type": "text",
          "text": "<the entire contents of 'Pride and Prejudice'>",
          "cache_control": {"type": "ephemeral"}
        }
      ],
      messages=[{"role": "user", "content": "Analyze the major themes in 'Pride and Prejudice'."}],
  )
  print(response.usage.model_dump_json())

  # Call the model again with the same inputs up to the cache checkpoint
  response = client.messages.create(.....)
  print(response.usage.model_dump_json())
  ```

  ```typescript TypeScript
  import Anthropic from '@anthropic-ai/sdk';

  const client = new Anthropic();

  const response = await client.messages.create({
    model: "claude-opus-4-20250514",
    max_tokens: 1024,
    system: [
      {
        type: "text",
        text: "You are an AI assistant tasked with analyzing literary works. Your goal is to provide insightful commentary on themes, characters, and writing style.\n",
      },
      {
        type: "text",
        text: "<the entire contents of 'Pride and Prejudice'>",
        cache_control: { type: "ephemeral" }
      }
    ],
    messages: [
      {
        role: "user",
        content: "Analyze the major themes in 'Pride and Prejudice'."
      }
    ]
  });
  console.log(response.usage);

  // Call the model again with the same inputs up to the cache checkpoint
  const new_response = await client.messages.create(...)
  console.log(new_response.usage);
  ```

  ```java Java
  import java.util.List;

  import com.anthropic.client.AnthropicClient;
  import com.anthropic.client.okhttp.AnthropicOkHttpClient;
  import com.anthropic.models.messages.CacheControlEphemeral;
  import com.anthropic.models.messages.Message;
  import com.anthropic.models.messages.MessageCreateParams;
  import com.anthropic.models.messages.Model;
  import com.anthropic.models.messages.TextBlockParam;

  public class PromptCachingExample {

      public static void main(String[] args) {
          AnthropicClient client = AnthropicOkHttpClient.fromEnv();

          MessageCreateParams params = MessageCreateParams.builder()
                  .model(Model.CLAUDE_OPUS_4_20250514)
                  .maxTokens(1024)
                  .systemOfTextBlockParams(List.of(
                          TextBlockParam.builder()
                                  .text("You are an AI assistant tasked with analyzing literary works. Your goal is to provide insightful commentary on themes, characters, and writing style.\n")
                                  .build(),
                          TextBlockParam.builder()
                                  .text("<the entire contents of 'Pride and Prejudice'>")
                                  .cacheControl(CacheControlEphemeral.builder().build())
                                  .build()
                  ))
                  .addUserMessage("Analyze the major themes in 'Pride and Prejudice'.")
                  .build();

          Message message = client.messages().create(params);
          System.out.println(message.usage());
      }
  }
  ```
</CodeGroup>

```JSON JSON
{"cache_creation_input_tokens":188086,"cache_read_input_tokens":0,"input_tokens":21,"output_tokens":393}
{"cache_creation_input_tokens":0,"cache_read_input_tokens":188086,"input_tokens":21,"output_tokens":393}
```

In this example, the entire text of "Pride and Prejudice" is cached using the `cache_control` parameter. This enables reuse of this large text across multiple API calls without reprocessing it each time. Changing only the user message allows you to ask various questions about the book while utilizing the cached content, leading to faster responses and improved efficiency.

***

## How prompt caching works

When you send a request with prompt caching enabled:

1. The system checks if a prompt prefix, up to a specified cache breakpoint, is already cached from a recent query.
2. If found, it uses the cached version, reducing processing time and costs.
3. Otherwise, it processes the full prompt and caches the prefix once the response begins.

This is especially useful for:

* Prompts with many examples
* Large amounts of context or background information
* Repetitive tasks with consistent instructions
* Long multi-turn conversations

By default, the cache has a 5-minute lifetime. The cache is refreshed for no additional cost each time the cached content is used.

<Tip>
  **Prompt caching caches the full prefix**

  Prompt caching references the entire prompt - `tools`, `system`, and `messages` (in that order) up to and including the block designated with `cache_control`.
</Tip>

***

## Pricing

Prompt caching introduces a new pricing structure. The table below shows the price per million tokens for each supported model:

| Model             | Base Input Tokens | 5m Cache Writes | 1h Cache Writes | Cache Hits & Refreshes | Output Tokens |
| ----------------- | ----------------- | --------------- | --------------- | ---------------------- | ------------- |
| Claude Opus 4     | \$15 / MTok       | \$18.75 / MTok  | \$30 / MTok     | \$1.50 / MTok          | \$75 / MTok   |
| Claude Sonnet 4   | \$3 / MTok        | \$3.75 / MTok   | \$6 / MTok      | \$0.30 / MTok          | \$15 / MTok   |
| Claude Sonnet 3.7 | \$3 / MTok        | \$3.75 / MTok   | \$6 / MTok      | \$0.30 / MTok          | \$15 / MTok   |
| Claude Sonnet 3.5 | \$3 / MTok        | \$3.75 / MTok   | \$6 / MTok      | \$0.30 / MTok          | \$15 / MTok   |
| Claude Haiku 3.5  | \$0.80 / MTok     | \$1 / MTok      | \$1.6 / MTok    | \$0.08 / MTok          | \$4 / MTok    |
| Claude Opus 3     | \$15 / MTok       | \$18.75 / MTok  | \$30 / MTok     | \$1.50 / MTok          | \$75 / MTok   |
| Claude Haiku 3    | \$0.25 / MTok     | \$0.30 / MTok   | \$0.50 / MTok   | \$0.03 / MTok          | \$1.25 / MTok |

Note:

* 5-minute cache write tokens are 1.25 times the base input tokens price
* 1-hour cache write tokens are 2 times the base input tokens price
* Cache read tokens are 0.1 times the base input tokens price
* Regular input and output tokens are priced at standard rates

***

## How to implement prompt caching

### Supported models

Prompt caching is currently supported on:

* Claude Opus 4
* Claude Sonnet 4
* Claude Sonnet 3.7
* Claude Sonnet 3.5
* Claude Haiku 3.5
* Claude Haiku 3
* Claude Opus 3

### Structuring your prompt

Place static content (tool definitions, system instructions, context, examples) at the beginning of your prompt. Mark the end of the reusable content for caching using the `cache_control` parameter.

Cache prefixes are created in the following order: `tools`, `system`, then `messages`. This order forms a hierarchy where each level builds upon the previous ones.

#### How automatic prefix checking works

**You can use just one cache breakpoint at the end of your static content, and the system will automatically find the longest matching prefix.** Here's how it works:

* When you add a `cache_control` breakpoint, the system automatically checks for cache hits at all previous content block boundaries (up to approximately 20 blocks before your explicit breakpoint)
* If any of these previous positions match cached content from earlier requests, the system uses the longest matching prefix
* This means you don't need multiple breakpoints just to enable caching - one at the end is sufficient

#### When to use multiple breakpoints

You can define up to 4 cache breakpoints if you want to:

* Cache different sections that change at different frequencies (e.g., tools rarely change, but context updates daily)
* Have more control over exactly what gets cached
* Ensure caching for content more than 20 blocks before your final breakpoint

<Note>
  **Important limitation**: The automatic prefix checking only looks back approximately 20 content blocks from each explicit breakpoint. If your prompt has more than 20 content blocks before your cache breakpoint, content earlier than that won't be checked for cache hits unless you add additional breakpoints.
</Note>

### Cache limitations

The minimum cacheable prompt length is:

* 1024 tokens for Claude Opus 4, Claude Sonnet 4, Claude Sonnet 3.7, Claude Sonnet 3.5 and Claude Opus 3
* 2048 tokens for Claude Haiku 3.5 and Claude Haiku 3

Shorter prompts cannot be cached, even if marked with `cache_control`. Any requests to cache fewer than this number of tokens will be processed without caching. To see if a prompt was cached, see the response usage [fields](https://docs.anthropic.com/en/docs/build-with-claude/prompt-caching#tracking-cache-performance).

For concurrent requests, note that a cache entry only becomes available after the first response begins. If you need cache hits for parallel requests, wait for the first response before sending subsequent requests.

Currently, "ephemeral" is the only supported cache type, which by default has a 5-minute lifetime.

### Understanding cache breakpoint costs

**Cache breakpoints themselves don't add any cost.** You are only charged for:

* **Cache writes**: When new content is written to the cache (25% more than base input tokens for 5-minute TTL)
* **Cache reads**: When cached content is used (10% of base input token price)
* **Regular input tokens**: For any uncached content

Adding more `cache_control` breakpoints doesn't increase your costs - you still pay the same amount based on what content is actually cached and read. The breakpoints simply give you control over what sections can be cached independently.

### What can be cached

Most blocks in the request can be designated for caching with `cache_control`. This includes:

* Tools: Tool definitions in the `tools` array
* System messages: Content blocks in the `system` array
* Text messages: Content blocks in the `messages.content` array, for both user and assistant turns
* Images & Documents: Content blocks in the `messages.content` array, in user turns
* Tool use and tool results: Content blocks in the `messages.content` array, in both user and assistant turns

Each of these elements can be marked with `cache_control` to enable caching for that portion of the request.

### What cannot be cached

While most request blocks can be cached, there are some exceptions:

* Thinking blocks cannot be cached directly with `cache_control`. However, thinking blocks CAN be cached alongside other content when they appear in previous assistant turns. When cached this way, they DO count as input tokens when read from cache.
* Sub-content blocks (like [citations](/en/docs/build-with-claude/citations)) themselves cannot be cached directly. Instead, cache the top-level block.

  In the case of citations, the top-level document content blocks that serve as the source material for citations can be cached. This allows you to use prompt caching with citations effectively by caching the documents that citations will reference.
* Empty text blocks cannot be cached.

### What invalidates the cache

Modifications to cached content can invalidate some or all of the cache.

As described in [Structuring your prompt](#structuring-your-prompt), the cache follows the hierarchy: `tools` → `system` → `messages`. Changes at each level invalidate that level and all subsequent levels.

The following table shows which parts of the cache are invalidated by different types of changes. ✘ indicates that the cache is invalidated, while ✓ indicates that the cache remains valid.

| What changes                                              | Tools cache | System cache | Messages cache | Impact                                                                                                                                                                                                                                                                                                                           |
| --------------------------------------------------------- | ----------- | ------------ | -------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Tool definitions**                                      | ✘           | ✘            | ✘              | Modifying tool definitions (names, descriptions, parameters) invalidates the entire cache                                                                                                                                                                                                                                        |
| **Web search toggle**                                     | ✓           | ✘            | ✘              | Enabling/disabling web search modifies the system prompt                                                                                                                                                                                                                                                                         |
| **Citations toggle**                                      | ✓           | ✘            | ✘              | Enabling/disabling citations modifies the system prompt                                                                                                                                                                                                                                                                          |
| **Tool choice**                                           | ✓           | ✓            | ✘              | Changes to `tool_choice` parameter only affect message blocks                                                                                                                                                                                                                                                                    |
| **Images**                                                | ✓           | ✓            | ✘              | Adding/removing images anywhere in the prompt affects message blocks                                                                                                                                                                                                                                                             |
| **Thinking parameters**                                   | ✓           | ✓            | ✘              | Changes to extended thinking settings (enable/disable, budget) affect message blocks                                                                                                                                                                                                                                             |
| **Non-tool results passed to extended thinking requests** | ✓           | ✓            | ✘              | When non-tool results are passed in requests while extended thinking is enabled, all previously-cached thinking blocks are stripped from context, and any messages in context that follow those thinking blocks are removed from the cache. For more details, see [Caching with thinking blocks](#caching-with-thinking-blocks). |

### Tracking cache performance

Monitor cache performance using these API response fields, within `usage` in the response (or `message_start` event if [streaming](https://docs.anthropic.com/en/docs/build-with-claude/streaming)):

* `cache_creation_input_tokens`: Number of tokens written to the cache when creating a new entry.
* `cache_read_input_tokens`: Number of tokens retrieved from the cache for this request.
* `input_tokens`: Number of input tokens which were not read from or used to create a cache.

### Best practices for effective caching

To optimize prompt caching performance:

* Cache stable, reusable content like system instructions, background information, large contexts, or frequent tool definitions.
* Place cached content at the prompt's beginning for best performance.
* Use cache breakpoints strategically to separate different cacheable prefix sections.
* Regularly analyze cache hit rates and adjust your strategy as needed.

### Optimizing for different use cases

Tailor your prompt caching strategy to your scenario:

* Conversational agents: Reduce cost and latency for extended conversations, especially those with long instructions or uploaded documents.
* Coding assistants: Improve autocomplete and codebase Q\&A by keeping relevant sections or a summarized version of the codebase in the prompt.
* Large document processing: Incorporate complete long-form material including images in your prompt without increasing response latency.
* Detailed instruction sets: Share extensive lists of instructions, procedures, and examples to fine-tune Claude's responses.  Developers often include an example or two in the prompt, but with prompt caching you can get even better performance by including 20+ diverse examples of high quality answers.
* Agentic tool use: Enhance performance for scenarios involving multiple tool calls and iterative code changes, where each step typically requires a new API call.
* Talk to books, papers, documentation, podcast transcripts, and other longform content:  Bring any knowledge base alive by embedding the entire document(s) into the prompt, and letting users ask it questions.

### Troubleshooting common issues

If experiencing unexpected behavior:

* Ensure cached sections are identical and marked with cache\_control in the same locations across calls
* Check that calls are made within the cache lifetime (5 minutes by default)
* Verify that `tool_choice` and image usage remain consistent between calls
* Validate that you are caching at least the minimum number of tokens
* The system automatically checks for cache hits at previous content block boundaries (up to \~20 blocks before your breakpoint). For prompts with more than 20 content blocks, you may need additional `cache_control` parameters earlier in the prompt to ensure all content can be cached

<Note>
  Changes to `tool_choice` or the presence/absence of images anywhere in the prompt will invalidate the cache, requiring a new cache entry to be created. For more details on cache invalidation, see [What invalidates the cache](#what-invalidates-the-cache).
</Note>

### Caching with thinking blocks

When using [extended thinking](/en/docs/build-with-claude/extended-thinking) with prompt caching, thinking blocks have special behavior:

**Automatic caching alongside other content**: While thinking blocks cannot be explicitly marked with `cache_control`, they get cached as part of the request content when you make subsequent API calls with tool results. This commonly happens during tool use when you pass thinking blocks back to continue the conversation.

**Input token counting**: When thinking blocks are read from cache, they count as input tokens in your usage metrics. This is important for cost calculation and token budgeting.

**Cache invalidation patterns**:

* Cache remains valid when only tool results are provided as user messages
* Cache gets invalidated when non-tool-result user content is added, causing all previous thinking blocks to be stripped
* This caching behavior occurs even without explicit `cache_control` markers

For more details on cache invalidation, see [What invalidates the cache](#what-invalidates-the-cache).

**Example with tool use**:

```
Request 1: User: "What's the weather in Paris?"
Response: [thinking_block_1] + [tool_use block 1]

Request 2: 
User: ["What's the weather in Paris?"], 
Assistant: [thinking_block_1] + [tool_use block 1], 
User: [tool_result_1, cache=True]
Response: [thinking_block_2] + [text block 2]
# Request 2 caches its request content (not the response)
# The cache includes: user message, thinking_block_1, tool_use block 1, and tool_result_1

Request 3:
User: ["What's the weather in Paris?"], 
Assistant: [thinking_block_1] + [tool_use block 1], 
User: [tool_result_1, cache=True], 
Assistant: [thinking_block_2] + [text block 2], 
User: [Text response, cache=True]
# Non-tool-result user block causes all thinking blocks to be ignored
# This request is processed as if thinking blocks were never present
```

When a non-tool-result user block is included, it designates a new assistant loop and all previous thinking blocks are removed from context.

For more detailed information, see the [extended thinking documentation](/en/docs/build-with-claude/extended-thinking#understanding-thinking-block-caching-behavior).

***

## Cache storage and sharing

* **Organization Isolation**: Caches are isolated between organizations. Different organizations never share caches, even if they use identical prompts.

* **Exact Matching**: Cache hits require 100% identical prompt segments, including all text and images up to and including the block marked with cache control.

* **Output Token Generation**: Prompt caching has no effect on output token generation. The response you receive will be identical to what you would get if prompt caching was not used.

***

## 1-hour cache duration

If you find that 5 minutes is too short, Anthropic also offers a 1-hour cache duration.

The 1-hour cache is currently in beta. To use the extended cache, add `extended-cache-ttl-2025-04-11` as a [beta header](/en/api/beta-headers) to your request, and then include `ttl` in the `cache_control` definition like this:

```JSON
"cache_control": {
    "type": "ephemeral",
    "ttl": "5m" | "1h"
}
```

The response will include detailed cache information like the following:

```JSON
{
    "usage": {
        "input_tokens": ...,
        "cache_read_input_tokens": ...,
        "cache_creation_input_tokens": ...,
        "output_tokens": ...,
        
        "cache_creation": {
            "ephemeral_5m_input_tokens": 456,
            "ephemeral_1h_input_tokens": 100,
        }
    }
}
```

Note that the current `cache_creation_input_tokens` field equals the sum of the values in the `cache_creation` object.

### When to use the 1-hour cache

If you have prompts that are used at a regular cadence (i.e., system prompts that are used more frequently than every 5 minutes), continue to use the 5-minute cache, since this will continue to be refreshed at no additional charge.

The 1-hour cache is best used in the following scenarios:

* When you have prompts that are likely used less frequently than 5 minutes, but more frequently than every hour. For example, when an agentic side-agent will take longer than 5 minutes, or when storing a long chat conversation with a user and you generally expect that user may not respond in the next 5 minutes.
* When latency is important and your follow up prompts may be sent beyond 5 minutes.
* When you want to improve your rate limit utilization, since cache hits are not deducted against your rate limit.

<Note>
  The 5-minute and 1-hour cache behave the same with respect to latency. You will generally see improved time-to-first-token for long documents.
</Note>

### Mixing different TTLs

You can use both 1-hour and 5-minute cache controls in the same request, but with an important constraint: Cache entries with longer TTL must appear before shorter TTLs (i.e., a 1-hour cache entry must appear before any 5-minute cache entries).

When mixing TTLs, we determine three billing locations in your prompt:

1. Position `A`: The token count at the highest cache hit (or 0 if no hits).
2. Position `B`: The token count at the highest 1-hour `cache_control` block after `A` (or equals `A` if none exist).
3. Position `C`: The token count at the last `cache_control` block.

<Note>
  If `B` and/or `C` are larger than `A`, they will necessarily be cache misses, because `A` is the highest cache hit.
</Note>

You'll be charged for:

1. Cache read tokens for `A`.
2. 1-hour cache write tokens for `(B - A)`.
3. 5-minute cache write tokens for `(C - B)`.

Here are 3 examples. This depicts the input tokens of 3 requests, each of which has different cache hits and cache misses. Each has a different calculated pricing, shown in the colored boxes, as a result.
![Mixing TTLs Diagram](https://mintlify.s3.us-west-1.amazonaws.com/anthropic/images/prompt-cache-mixed-ttl.svg)

***

## Prompt caching examples

To help you get started with prompt caching, we've prepared a [prompt caching cookbook](https://github.com/anthropics/anthropic-cookbook/blob/main/misc/prompt_caching.ipynb) with detailed examples and best practices.

Below, we've included several code snippets that showcase various prompt caching patterns. These examples demonstrate how to implement caching in different scenarios, helping you understand the practical applications of this feature:

<AccordionGroup>
  <Accordion title="Large context caching example">
    <CodeGroup>
      ```bash Shell
      curl https://api.anthropic.com/v1/messages \
           --header "x-api-key: $ANTHROPIC_API_KEY" \
           --header "anthropic-version: 2023-06-01" \
           --header "content-type: application/json" \
           --data \
      '{
          "model": "claude-opus-4-20250514",
          "max_tokens": 1024,
          "system": [
              {
                  "type": "text",
                  "text": "You are an AI assistant tasked with analyzing legal documents."
              },
              {
                  "type": "text",
                  "text": "Here is the full text of a complex legal agreement: [Insert full text of a 50-page legal agreement here]",
                  "cache_control": {"type": "ephemeral"}
              }
          ],
          "messages": [
              {
                  "role": "user",
                  "content": "What are the key terms and conditions in this agreement?"
              }
          ]
      }'
      ```

      ```Python Python
      import anthropic
      client = anthropic.Anthropic()

      response = client.messages.create(
          model="claude-opus-4-20250514",
          max_tokens=1024,
          system=[
              {
                  "type": "text",
                  "text": "You are an AI assistant tasked with analyzing legal documents."
              },
              {
                  "type": "text",
                  "text": "Here is the full text of a complex legal agreement: [Insert full text of a 50-page legal agreement here]",
                  "cache_control": {"type": "ephemeral"}
              }
          ],
          messages=[
              {
                  "role": "user",
                  "content": "What are the key terms and conditions in this agreement?"
              }
          ]
      )
      print(response.model_dump_json())
      ```

      ```typescript TypeScript
      import Anthropic from '@anthropic-ai/sdk';

      const client = new Anthropic();

      const response = await client.messages.create({
        model: "claude-opus-4-20250514",
        max_tokens: 1024,
        system: [
          {
              "type": "text",
              "text": "You are an AI assistant tasked with analyzing legal documents."
          },
          {
              "type": "text",
              "text": "Here is the full text of a complex legal agreement: [Insert full text of a 50-page legal agreement here]",
              "cache_control": {"type": "ephemeral"}
          }
        ],
        messages: [
          {
              "role": "user",
              "content": "What are the key terms and conditions in this agreement?"
          }
        ]
      });
      console.log(response);
      ```

      ```java Java
      import java.util.List;

      import com.anthropic.client.AnthropicClient;
      import com.anthropic.client.okhttp.AnthropicOkHttpClient;
      import com.anthropic.models.messages.CacheControlEphemeral;
      import com.anthropic.models.messages.Message;
      import com.anthropic.models.messages.MessageCreateParams;
      import com.anthropic.models.messages.Model;
      import com.anthropic.models.messages.TextBlockParam;

      public class LegalDocumentAnalysisExample {

          public static void main(String[] args) {
              AnthropicClient client = AnthropicOkHttpClient.fromEnv();

              MessageCreateParams params = MessageCreateParams.builder()
                      .model(Model.CLAUDE_OPUS_4_20250514)
                      .maxTokens(1024)
                      .systemOfTextBlockParams(List.of(
                              TextBlockParam.builder()
                                      .text("You are an AI assistant tasked with analyzing legal documents.")
                                      .build(),
                              TextBlockParam.builder()
                                      .text("Here is the full text of a complex legal agreement: [Insert full text of a 50-page legal agreement here]")
                                      .cacheControl(CacheControlEphemeral.builder().build())
                                      .build()
                      ))
                      .addUserMessage("What are the key terms and conditions in this agreement?")
                      .build();

              Message message = client.messages().create(params);
              System.out.println(message);
          }
      }
      ```
    </CodeGroup>

    This example demonstrates basic prompt caching usage, caching the full text of the legal agreement as a prefix while keeping the user instruction uncached.

    For the first request:

    * `input_tokens`: Number of tokens in the user message only
    * `cache_creation_input_tokens`: Number of tokens in the entire system message, including the legal document
    * `cache_read_input_tokens`: 0 (no cache hit on first request)

    For subsequent requests within the cache lifetime:

    * `input_tokens`: Number of tokens in the user message only
    * `cache_creation_input_tokens`: 0 (no new cache creation)
    * `cache_read_input_tokens`: Number of tokens in the entire cached system message
  </Accordion>

  <Accordion title="Caching tool definitions">
    <CodeGroup>
      ```bash Shell
      curl https://api.anthropic.com/v1/messages \
           --header "x-api-key: $ANTHROPIC_API_KEY" \
           --header "anthropic-version: 2023-06-01" \
           --header "content-type: application/json" \
           --data \
      '{
          "model": "claude-opus-4-20250514",
          "max_tokens": 1024,
          "tools": [
              {
                  "name": "get_weather",
                  "description": "Get the current weather in a given location",
                  "input_schema": {
                      "type": "object",
                      "properties": {
                          "location": {
                              "type": "string",
                              "description": "The city and state, e.g. San Francisco, CA"
                          },
                          "unit": {
                              "type": "string",
                              "enum": ["celsius", "fahrenheit"],
                              "description": "The unit of temperature, either celsius or fahrenheit"
                          }
                      },
                      "required": ["location"]
                  }
              },
              # many more tools
              {
                  "name": "get_time",
                  "description": "Get the current time in a given time zone",
                  "input_schema": {
                      "type": "object",
                      "properties": {
                          "timezone": {
                              "type": "string",
                              "description": "The IANA time zone name, e.g. America/Los_Angeles"
                          }
                      },
                      "required": ["timezone"]
                  },
                  "cache_control": {"type": "ephemeral"}
              }
          ],
          "messages": [
              {
                  "role": "user",
                  "content": "What is the weather and time in New York?"
              }
          ]
      }'
      ```

      ```Python Python
      import anthropic
      client = anthropic.Anthropic()

      response = client.messages.create(
          model="claude-opus-4-20250514",
          max_tokens=1024,
          tools=[
              {
                  "name": "get_weather",
                  "description": "Get the current weather in a given location",
                  "input_schema": {
                      "type": "object",
                      "properties": {
                          "location": {
                              "type": "string",
                              "description": "The city and state, e.g. San Francisco, CA"
                          },
                          "unit": {
                              "type": "string",
                              "enum": ["celsius", "fahrenheit"],
                              "description": "The unit of temperature, either 'celsius' or 'fahrenheit'"
                          }
                      },
                      "required": ["location"]
                  },
              },
              # many more tools
              {
                  "name": "get_time",
                  "description": "Get the current time in a given time zone",
                  "input_schema": {
                      "type": "object",
                      "properties": {
                          "timezone": {
                              "type": "string",
                              "description": "The IANA time zone name, e.g. America/Los_Angeles"
                          }
                      },
                      "required": ["timezone"]
                  },
                  "cache_control": {"type": "ephemeral"}
              }
          ],
          messages=[
              {
                  "role": "user",
                  "content": "What's the weather and time in New York?"
              }
          ]
      )
      print(response.model_dump_json())
      ```

      ```typescript TypeScript
      import Anthropic from '@anthropic-ai/sdk';

      const client = new Anthropic();

      const response = await client.messages.create({
          model: "claude-opus-4-20250514",
          max_tokens: 1024,
          tools=[
              {
                  "name": "get_weather",
                  "description": "Get the current weather in a given location",
                  "input_schema": {
                      "type": "object",
                      "properties": {
                          "location": {
                              "type": "string",
                              "description": "The city and state, e.g. San Francisco, CA"
                          },
                          "unit": {
                              "type": "string",
                              "enum": ["celsius", "fahrenheit"],
                              "description": "The unit of temperature, either 'celsius' or 'fahrenheit'"
                          }
                      },
                      "required": ["location"]
                  },
              },
              // many more tools
              {
                  "name": "get_time",
                  "description": "Get the current time in a given time zone",
                  "input_schema": {
                      "type": "object",
                      "properties": {
                          "timezone": {
                              "type": "string",
                              "description": "The IANA time zone name, e.g. America/Los_Angeles"
                          }
                      },
                      "required": ["timezone"]
                  },
                  "cache_control": {"type": "ephemeral"}
              }
          ],
          messages: [
              {
                  "role": "user",
                  "content": "What's the weather and time in New York?"
              }
          ]
      });
      console.log(response);
      ```

      ```java Java
      import java.util.List;
      import java.util.Map;

      import com.anthropic.client.AnthropicClient;
      import com.anthropic.client.okhttp.AnthropicOkHttpClient;
      import com.anthropic.core.JsonValue;
      import com.anthropic.models.messages.CacheControlEphemeral;
      import com.anthropic.models.messages.Message;
      import com.anthropic.models.messages.MessageCreateParams;
      import com.anthropic.models.messages.Model;
      import com.anthropic.models.messages.Tool;
      import com.anthropic.models.messages.Tool.InputSchema;

      public class ToolsWithCacheControlExample {

          public static void main(String[] args) {
              AnthropicClient client = AnthropicOkHttpClient.fromEnv();

              // Weather tool schema
              InputSchema weatherSchema = InputSchema.builder()
                      .properties(JsonValue.from(Map.of(
                              "location", Map.of(
                                      "type", "string",
                                      "description", "The city and state, e.g. San Francisco, CA"
                              ),
                              "unit", Map.of(
                                      "type", "string",
                                      "enum", List.of("celsius", "fahrenheit"),
                                      "description", "The unit of temperature, either celsius or fahrenheit"
                              )
                      )))
                      .putAdditionalProperty("required", JsonValue.from(List.of("location")))
                      .build();

              // Time tool schema
              InputSchema timeSchema = InputSchema.builder()
                      .properties(JsonValue.from(Map.of(
                              "timezone", Map.of(
                                      "type", "string",
                                      "description", "The IANA time zone name, e.g. America/Los_Angeles"
                              )
                      )))
                      .putAdditionalProperty("required", JsonValue.from(List.of("timezone")))
                      .build();

              MessageCreateParams params = MessageCreateParams.builder()
                      .model(Model.CLAUDE_OPUS_4_20250514)
                      .maxTokens(1024)
                      .addTool(Tool.builder()
                              .name("get_weather")
                              .description("Get the current weather in a given location")
                              .inputSchema(weatherSchema)
                              .build())
                      .addTool(Tool.builder()
                              .name("get_time")
                              .description("Get the current time in a given time zone")
                              .inputSchema(timeSchema)
                              .cacheControl(CacheControlEphemeral.builder().build())
                              .build())
                      .addUserMessage("What is the weather and time in New York?")
                      .build();

              Message message = client.messages().create(params);
              System.out.println(message);
          }
      }
      ```
    </CodeGroup>

    In this example, we demonstrate caching tool definitions.

    The `cache_control` parameter is placed on the final tool (`get_time`) to designate all of the tools as part of the static prefix.

    This means that all tool definitions, including `get_weather` and any other tools defined before `get_time`, will be cached as a single prefix.

    This approach is useful when you have a consistent set of tools that you want to reuse across multiple requests without re-processing them each time.

    For the first request:

    * `input_tokens`: Number of tokens in the user message
    * `cache_creation_input_tokens`: Number of tokens in all tool definitions and system prompt
    * `cache_read_input_tokens`: 0 (no cache hit on first request)

    For subsequent requests within the cache lifetime:

    * `input_tokens`: Number of tokens in the user message
    * `cache_creation_input_tokens`: 0 (no new cache creation)
    * `cache_read_input_tokens`: Number of tokens in all cached tool definitions and system prompt
  </Accordion>

  <Accordion title="Continuing a multi-turn conversation">
    <CodeGroup>
      ```bash Shell
      curl https://api.anthropic.com/v1/messages \
           --header "x-api-key: $ANTHROPIC_API_KEY" \
           --header "anthropic-version: 2023-06-01" \
           --header "content-type: application/json" \
           --data \
      '{
          "model": "claude-opus-4-20250514",
          "max_tokens": 1024,
          "system": [
              {
                  "type": "text",
                  "text": "...long system prompt",
                  "cache_control": {"type": "ephemeral"}
              }
          ],
          "messages": [
              {
                  "role": "user",
                  "content": [
                      {
                          "type": "text",
                          "text": "Hello, can you tell me more about the solar system?",
                      }
                  ]
              },
              {
                  "role": "assistant",
                  "content": "Certainly! The solar system is the collection of celestial bodies that orbit our Sun. It consists of eight planets, numerous moons, asteroids, comets, and other objects. The planets, in order from closest to farthest from the Sun, are: Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, and Neptune. Each planet has its own unique characteristics and features. Is there a specific aspect of the solar system you would like to know more about?"
              },
              {
                  "role": "user",
                  "content": [
                      {
                          "type": "text",
                          "text": "Good to know."
                      },
                      {
                          "type": "text",
                          "text": "Tell me more about Mars.",
                          "cache_control": {"type": "ephemeral"}
                      }
                  ]
              }
          ]
      }'
      ```

      ```Python Python
      import anthropic
      client = anthropic.Anthropic()

      response = client.messages.create(
          model="claude-opus-4-20250514",
          max_tokens=1024,
          system=[
              {
                  "type": "text",
                  "text": "...long system prompt",
                  "cache_control": {"type": "ephemeral"}
              }
          ],
          messages=[
              # ...long conversation so far
              {
                  "role": "user",
                  "content": [
                      {
                          "type": "text",
                          "text": "Hello, can you tell me more about the solar system?",
                      }
                  ]
              },
              {
                  "role": "assistant",
                  "content": "Certainly! The solar system is the collection of celestial bodies that orbit our Sun. It consists of eight planets, numerous moons, asteroids, comets, and other objects. The planets, in order from closest to farthest from the Sun, are: Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, and Neptune. Each planet has its own unique characteristics and features. Is there a specific aspect of the solar system you'd like to know more about?"
              },
              {
                  "role": "user",
                  "content": [
                      {
                          "type": "text",
                          "text": "Good to know."
                      },
                      {
                          "type": "text",
                          "text": "Tell me more about Mars.",
                          "cache_control": {"type": "ephemeral"}
                      }
                  ]
              }
          ]
      )
      print(response.model_dump_json())
      ```

      ```typescript TypeScript
      import Anthropic from '@anthropic-ai/sdk';

      const client = new Anthropic();

      const response = await client.messages.create({
          model: "claude-opus-4-20250514",
          max_tokens: 1024,
          system=[
              {
                  "type": "text",
                  "text": "...long system prompt",
                  "cache_control": {"type": "ephemeral"}
              }
          ],
          messages=[
              // ...long conversation so far
              {
                  "role": "user",
                  "content": [
                      {
                          "type": "text",
                          "text": "Hello, can you tell me more about the solar system?",
                      }
                  ]
              },
              {
                  "role": "assistant",
                  "content": "Certainly! The solar system is the collection of celestial bodies that orbit our Sun. It consists of eight planets, numerous moons, asteroids, comets, and other objects. The planets, in order from closest to farthest from the Sun, are: Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, and Neptune. Each planet has its own unique characteristics and features. Is there a specific aspect of the solar system you'd like to know more about?"
              },
              {
                  "role": "user",
                  "content": [
                      {
                          "type": "text",
                          "text": "Good to know."
                      },
                      {
                          "type": "text",
                          "text": "Tell me more about Mars.",
                          "cache_control": {"type": "ephemeral"}
                      }
                  ]
              }
          ]
      });
      console.log(response);
      ```

      ```java Java
      import java.util.List;

      import com.anthropic.client.AnthropicClient;
      import com.anthropic.client.okhttp.AnthropicOkHttpClient;
      import com.anthropic.models.messages.CacheControlEphemeral;
      import com.anthropic.models.messages.ContentBlockParam;
      import com.anthropic.models.messages.Message;
      import com.anthropic.models.messages.MessageCreateParams;
      import com.anthropic.models.messages.Model;
      import com.anthropic.models.messages.TextBlockParam;

      public class ConversationWithCacheControlExample {

          public static void main(String[] args) {
              AnthropicClient client = AnthropicOkHttpClient.fromEnv();

              // Create ephemeral system prompt
              TextBlockParam systemPrompt = TextBlockParam.builder()
                      .text("...long system prompt")
                      .cacheControl(CacheControlEphemeral.builder().build())
                      .build();

              // Create message params
              MessageCreateParams params = MessageCreateParams.builder()
                      .model(Model.CLAUDE_OPUS_4_20250514)
                      .maxTokens(1024)
                      .systemOfTextBlockParams(List.of(systemPrompt))
                      // First user message (without cache control)
                      .addUserMessage("Hello, can you tell me more about the solar system?")
                      // Assistant response
                      .addAssistantMessage("Certainly! The solar system is the collection of celestial bodies that orbit our Sun. It consists of eight planets, numerous moons, asteroids, comets, and other objects. The planets, in order from closest to farthest from the Sun, are: Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, and Neptune. Each planet has its own unique characteristics and features. Is there a specific aspect of the solar system you would like to know more about?")
                      // Second user message (with cache control)
                      .addUserMessageOfBlockParams(List.of(
                              ContentBlockParam.ofText(TextBlockParam.builder()
                                      .text("Good to know.")
                                      .build()),
                              ContentBlockParam.ofText(TextBlockParam.builder()
                                      .text("Tell me more about Mars.")
                                      .cacheControl(CacheControlEphemeral.builder().build())
                                      .build())
                      ))
                      .build();

              Message message = client.messages().create(params);
              System.out.println(message);
          }
      }
      ```
    </CodeGroup>

    In this example, we demonstrate how to use prompt caching in a multi-turn conversation.

    During each turn, we mark the final block of the final message with `cache_control` so the conversation can be incrementally cached. The system will automatically lookup and use the longest previously cached prefix for follow-up messages. That is, blocks that were previously marked with a `cache_control` block are later not marked with this, but they will still be considered a cache hit (and also a cache refresh!) if they are hit within 5 minutes.

    In addition, note that the `cache_control` parameter is placed on the system message. This is to ensure that if this gets evicted from the cache (after not being used for more than 5 minutes), it will get added back to the cache on the next request.

    This approach is useful for maintaining context in ongoing conversations without repeatedly processing the same information.

    When this is set up properly, you should see the following in the usage response of each request:

    * `input_tokens`: Number of tokens in the new user message (will be minimal)
    * `cache_creation_input_tokens`: Number of tokens in the new assistant and user turns
    * `cache_read_input_tokens`: Number of tokens in the conversation up to the previous turn
  </Accordion>

  <Accordion title="Putting it all together: Multiple cache breakpoints">
    <CodeGroup>
      ```bash Shell
      curl https://api.anthropic.com/v1/messages \
           --header "x-api-key: $ANTHROPIC_API_KEY" \
           --header "anthropic-version: 2023-06-01" \
           --header "content-type: application/json" \
           --data \
      '{
          "model": "claude-opus-4-20250514",
          "max_tokens": 1024,
          "tools": [
              {
                  "name": "search_documents",
                  "description": "Search through the knowledge base",
                  "input_schema": {
                      "type": "object",
                      "properties": {
                          "query": {
                              "type": "string",
                              "description": "Search query"
                          }
                      },
                      "required": ["query"]
                  }
              },
              {
                  "name": "get_document",
                  "description": "Retrieve a specific document by ID",
                  "input_schema": {
                      "type": "object",
                      "properties": {
                          "doc_id": {
                              "type": "string",
                              "description": "Document ID"
                          }
                      },
                      "required": ["doc_id"]
                  },
                  "cache_control": {"type": "ephemeral"}
              }
          ],
          "system": [
              {
                  "type": "text",
                  "text": "You are a helpful research assistant with access to a document knowledge base.\n\n# Instructions\n- Always search for relevant documents before answering\n- Provide citations for your sources\n- Be objective and accurate in your responses\n- If multiple documents contain relevant information, synthesize them\n- Acknowledge when information is not available in the knowledge base",
                  "cache_control": {"type": "ephemeral"}
              },
              {
                  "type": "text",
                  "text": "# Knowledge Base Context\n\nHere are the relevant documents for this conversation:\n\n## Document 1: Solar System Overview\nThe solar system consists of the Sun and all objects that orbit it...\n\n## Document 2: Planetary Characteristics\nEach planet has unique features. Mercury is the smallest planet...\n\n## Document 3: Mars Exploration\nMars has been a target of exploration for decades...\n\n[Additional documents...]",
                  "cache_control": {"type": "ephemeral"}
              }
          ],
          "messages": [
              {
                  "role": "user",
                  "content": "Can you search for information about Mars rovers?"
              },
              {
                  "role": "assistant",
                  "content": [
                      {
                          "type": "tool_use",
                          "id": "tool_1",
                          "name": "search_documents",
                          "input": {"query": "Mars rovers"}
                      }
                  ]
              },
              {
                  "role": "user",
                  "content": [
                      {
                          "type": "tool_result",
                          "tool_use_id": "tool_1",
                          "content": "Found 3 relevant documents: Document 3 (Mars Exploration), Document 7 (Rover Technology), Document 9 (Mission History)"
                      }
                  ]
              },
              {
                  "role": "assistant",
                  "content": [
                      {
                          "type": "text",
                          "text": "I found 3 relevant documents about Mars rovers. Let me get more details from the Mars Exploration document."
                      }
                  ]
              },
              {
                  "role": "user",
                  "content": [
                      {
                          "type": "text",
                          "text": "Yes, please tell me about the Perseverance rover specifically.",
                          "cache_control": {"type": "ephemeral"}
                      }
                  ]
              }
          ]
      }'
      ```

      ```Python Python
      import anthropic
      client = anthropic.Anthropic()

      response = client.messages.create(
          model="claude-opus-4-20250514",
          max_tokens=1024,
          tools=[
              {
                  "name": "search_documents",
                  "description": "Search through the knowledge base",
                  "input_schema": {
                      "type": "object",
                      "properties": {
                          "query": {
                              "type": "string",
                              "description": "Search query"
                          }
                      },
                      "required": ["query"]
                  }
              },
              {
                  "name": "get_document",
                  "description": "Retrieve a specific document by ID",
                  "input_schema": {
                      "type": "object",
                      "properties": {
                          "doc_id": {
                              "type": "string",
                              "description": "Document ID"
                          }
                      },
                      "required": ["doc_id"]
                  },
                  "cache_control": {"type": "ephemeral"}
              }
          ],
          system=[
              {
                  "type": "text",
                  "text": "You are a helpful research assistant with access to a document knowledge base.\n\n# Instructions\n- Always search for relevant documents before answering\n- Provide citations for your sources\n- Be objective and accurate in your responses\n- If multiple documents contain relevant information, synthesize them\n- Acknowledge when information is not available in the knowledge base",
                  "cache_control": {"type": "ephemeral"}
              },
              {
                  "type": "text",
                  "text": "# Knowledge Base Context\n\nHere are the relevant documents for this conversation:\n\n## Document 1: Solar System Overview\nThe solar system consists of the Sun and all objects that orbit it...\n\n## Document 2: Planetary Characteristics\nEach planet has unique features. Mercury is the smallest planet...\n\n## Document 3: Mars Exploration\nMars has been a target of exploration for decades...\n\n[Additional documents...]",
                  "cache_control": {"type": "ephemeral"}
              }
          ],
          messages=[
              {
                  "role": "user",
                  "content": "Can you search for information about Mars rovers?"
              },
              {
                  "role": "assistant",
                  "content": [
                      {
                          "type": "tool_use",
                          "id": "tool_1",
                          "name": "search_documents",
                          "input": {"query": "Mars rovers"}
                      }
                  ]
              },
              {
                  "role": "user",
                  "content": [
                      {
                          "type": "tool_result",
                          "tool_use_id": "tool_1",
                          "content": "Found 3 relevant documents: Document 3 (Mars Exploration), Document 7 (Rover Technology), Document 9 (Mission History)"
                      }
                  ]
              },
              {
                  "role": "assistant",
                  "content": [
                      {
                          "type": "text",
                          "text": "I found 3 relevant documents about Mars rovers. Let me get more details from the Mars Exploration document."
                      }
                  ]
              },
              {
                  "role": "user",
                  "content": [
                      {
                          "type": "text",
                          "text": "Yes, please tell me about the Perseverance rover specifically.",
                          "cache_control": {"type": "ephemeral"}
                      }
                  ]
              }
          ]
      )
      print(response.model_dump_json())
      ```

      ```typescript TypeScript
      import Anthropic from '@anthropic-ai/sdk';

      const client = new Anthropic();

      const response = await client.messages.create({
          model: "claude-opus-4-20250514",
          max_tokens: 1024,
          tools: [
              {
                  name: "search_documents",
                  description: "Search through the knowledge base",
                  input_schema: {
                      type: "object",
                      properties: {
                          query: {
                              type: "string",
                              description: "Search query"
                          }
                      },
                      required: ["query"]
                  }
              },
              {
                  name: "get_document",
                  description: "Retrieve a specific document by ID",
                  input_schema: {
                      type: "object",
                      properties: {
                          doc_id: {
                              type: "string",
                              description: "Document ID"
                          }
                      },
                      required: ["doc_id"]
                  },
                  cache_control: { type: "ephemeral" }
              }
          ],
          system: [
              {
                  type: "text",
                  text: "You are a helpful research assistant with access to a document knowledge base.\n\n# Instructions\n- Always search for relevant documents before answering\n- Provide citations for your sources\n- Be objective and accurate in your responses\n- If multiple documents contain relevant information, synthesize them\n- Acknowledge when information is not available in the knowledge base",
                  cache_control: { type: "ephemeral" }
              },
              {
                  type: "text",
                  text: "# Knowledge Base Context\n\nHere are the relevant documents for this conversation:\n\n## Document 1: Solar System Overview\nThe solar system consists of the Sun and all objects that orbit it...\n\n## Document 2: Planetary Characteristics\nEach planet has unique features. Mercury is the smallest planet...\n\n## Document 3: Mars Exploration\nMars has been a target of exploration for decades...\n\n[Additional documents...]",
                  cache_control: { type: "ephemeral" }
              }
          ],
          messages: [
              {
                  role: "user",
                  content: "Can you search for information about Mars rovers?"
              },
              {
                  role: "assistant",
                  content: [
                      {
                          type: "tool_use",
                          id: "tool_1",
                          name: "search_documents",
                          input: { query: "Mars rovers" }
                      }
                  ]
              },
              {
                  role: "user",
                  content: [
                      {
                          type: "tool_result",
                          tool_use_id: "tool_1",
                          content: "Found 3 relevant documents: Document 3 (Mars Exploration), Document 7 (Rover Technology), Document 9 (Mission History)"
                      }
                  ]
              },
              {
                  role: "assistant",
                  content: [
                      {
                          type: "text",
                          text: "I found 3 relevant documents about Mars rovers. Let me get more details from the Mars Exploration document."
                      }
                  ]
              },
              {
                  role: "user",
                  content: [
                      {
                          type: "text",
                          text: "Yes, please tell me about the Perseverance rover specifically.",
                          cache_control: { type: "ephemeral" }
                      }
                  ]
              }
          ]
      });
      console.log(response);
      ```

      ```java Java
      import java.util.List;
      import java.util.Map;

      import com.anthropic.client.AnthropicClient;
      import com.anthropic.client.okhttp.AnthropicOkHttpClient;
      import com.anthropic.core.JsonValue;
      import com.anthropic.models.messages.CacheControlEphemeral;
      import com.anthropic.models.messages.ContentBlockParam;
      import com.anthropic.models.messages.Message;
      import com.anthropic.models.messages.MessageCreateParams;
      import com.anthropic.models.messages.Model;
      import com.anthropic.models.messages.TextBlockParam;
      import com.anthropic.models.messages.Tool;
      import com.anthropic.models.messages.Tool.InputSchema;
      import com.anthropic.models.messages.ToolResultBlockParam;
      import com.anthropic.models.messages.ToolUseBlockParam;

      public class MultipleCacheBreakpointsExample {

          public static void main(String[] args) {
              AnthropicClient client = AnthropicOkHttpClient.fromEnv();

              // Search tool schema
              InputSchema searchSchema = InputSchema.builder()
                      .properties(JsonValue.from(Map.of(
                              "query", Map.of(
                                      "type", "string",
                                      "description", "Search query"
                              )
                      )))
                      .putAdditionalProperty("required", JsonValue.from(List.of("query")))
                      .build();

              // Get document tool schema
              InputSchema getDocSchema = InputSchema.builder()
                      .properties(JsonValue.from(Map.of(
                              "doc_id", Map.of(
                                      "type", "string",
                                      "description", "Document ID"
                              )
                      )))
                      .putAdditionalProperty("required", JsonValue.from(List.of("doc_id")))
                      .build();

              MessageCreateParams params = MessageCreateParams.builder()
                      .model(Model.CLAUDE_OPUS_4_20250514)
                      .maxTokens(1024)
                      // Tools with cache control on the last one
                      .addTool(Tool.builder()
                              .name("search_documents")
                              .description("Search through the knowledge base")
                              .inputSchema(searchSchema)
                              .build())
                      .addTool(Tool.builder()
                              .name("get_document")
                              .description("Retrieve a specific document by ID")
                              .inputSchema(getDocSchema)
                              .cacheControl(CacheControlEphemeral.builder().build())
                              .build())
                      // System prompts with cache control on instructions and context separately
                      .systemOfTextBlockParams(List.of(
                              TextBlockParam.builder()
                                      .text("You are a helpful research assistant with access to a document knowledge base.\n\n# Instructions\n- Always search for relevant documents before answering\n- Provide citations for your sources\n- Be objective and accurate in your responses\n- If multiple documents contain relevant information, synthesize them\n- Acknowledge when information is not available in the knowledge base")
                                      .cacheControl(CacheControlEphemeral.builder().build())
                                      .build(),
                              TextBlockParam.builder()
                                      .text("# Knowledge Base Context\n\nHere are the relevant documents for this conversation:\n\n## Document 1: Solar System Overview\nThe solar system consists of the Sun and all objects that orbit it...\n\n## Document 2: Planetary Characteristics\nEach planet has unique features. Mercury is the smallest planet...\n\n## Document 3: Mars Exploration\nMars has been a target of exploration for decades...\n\n[Additional documents...]")
                                      .cacheControl(CacheControlEphemeral.builder().build())
                                      .build()
                      ))
                      // Conversation history
                      .addUserMessage("Can you search for information about Mars rovers?")
                      .addAssistantMessageOfBlockParams(List.of(
                              ContentBlockParam.ofToolUse(ToolUseBlockParam.builder()
                                      .id("tool_1")
                                      .name("search_documents")
                                      .input(JsonValue.from(Map.of("query", "Mars rovers")))
                                      .build())
                      ))
                      .addUserMessageOfBlockParams(List.of(
                              ContentBlockParam.ofToolResult(ToolResultBlockParam.builder()
                                      .toolUseId("tool_1")
                                      .content("Found 3 relevant documents: Document 3 (Mars Exploration), Document 7 (Rover Technology), Document 9 (Mission History)")
                                      .build())
                      ))
                      .addAssistantMessageOfBlockParams(List.of(
                              ContentBlockParam.ofText(TextBlockParam.builder()
                                      .text("I found 3 relevant documents about Mars rovers. Let me get more details from the Mars Exploration document.")
                                      .build())
                      ))
                      .addUserMessageOfBlockParams(List.of(
                              ContentBlockParam.ofText(TextBlockParam.builder()
                                      .text("Yes, please tell me about the Perseverance rover specifically.")
                                      .cacheControl(CacheControlEphemeral.builder().build())
                                      .build())
                      ))
                      .build();

              Message message = client.messages().create(params);
              System.out.println(message);
          }
      }
      ```
    </CodeGroup>

    This comprehensive example demonstrates how to use all 4 available cache breakpoints to optimize different parts of your prompt:

    1. **Tools cache** (cache breakpoint 1): The `cache_control` parameter on the last tool definition caches all tool definitions.

    2. **Reusable instructions cache** (cache breakpoint 2): The static instructions in the system prompt are cached separately. These instructions rarely change between requests.

    3. **RAG context cache** (cache breakpoint 3): The knowledge base documents are cached independently, allowing you to update the RAG documents without invalidating the tools or instructions cache.

    4. **Conversation history cache** (cache breakpoint 4): The assistant's response is marked with `cache_control` to enable incremental caching of the conversation as it progresses.

    This approach provides maximum flexibility:

    * If you only update the final user message, all four cache segments are reused
    * If you update the RAG documents but keep the same tools and instructions, the first two cache segments are reused
    * If you change the conversation but keep the same tools, instructions, and documents, the first three segments are reused
    * Each cache breakpoint can be invalidated independently based on what changes in your application

    For the first request:

    * `input_tokens`: Tokens in the final user message
    * `cache_creation_input_tokens`: Tokens in all cached segments (tools + instructions + RAG documents + conversation history)
    * `cache_read_input_tokens`: 0 (no cache hits)

    For subsequent requests with only a new user message:

    * `input_tokens`: Tokens in the new user message only
    * `cache_creation_input_tokens`: Any new tokens added to conversation history
    * `cache_read_input_tokens`: All previously cached tokens (tools + instructions + RAG documents + previous conversation)

    This pattern is especially powerful for:

    * RAG applications with large document contexts
    * Agent systems that use multiple tools
    * Long-running conversations that need to maintain context
    * Applications that need to optimize different parts of the prompt independently
  </Accordion>
</AccordionGroup>

***

## FAQ

<AccordionGroup>
  <Accordion title="Do I need multiple cache breakpoints or is one at the end sufficient?">
    **In most cases, a single cache breakpoint at the end of your static content is sufficient.** The system automatically checks for cache hits at all previous content block boundaries (up to 20 blocks before your breakpoint) and uses the longest matching prefix.

    You only need multiple breakpoints if:

    * You have more than 20 content blocks before your desired cache point
    * You want to cache sections that update at different frequencies independently
    * You need explicit control over what gets cached for cost optimization

    Example: If you have system instructions (rarely change) and RAG context (changes daily), you might use two breakpoints to cache them separately.
  </Accordion>

  <Accordion title="Do cache breakpoints add extra cost?">
    No, cache breakpoints themselves are free. You only pay for:

    * Writing content to cache (25% more than base input tokens for 5-minute TTL)
    * Reading from cache (10% of base input token price)
    * Regular input tokens for uncached content

    The number of breakpoints doesn't affect pricing - only the amount of content cached and read matters.
  </Accordion>

  <Accordion title="What is the cache lifetime?">
    The cache's default minimum lifetime (TTL) is 5 minutes. This lifetime is refreshed each time the cached content is used.

    If you find that 5 minutes is too short, Anthropic also offers a [1-hour cache TTL](#1-hour-cache-duration).
  </Accordion>

  <Accordion title="How many cache breakpoints can I use?">
    You can define up to 4 cache breakpoints (using `cache_control` parameters) in your prompt.
  </Accordion>

  <Accordion title="Is prompt caching available for all models?">
    No, prompt caching is currently only available for Claude Opus 4, Claude Sonnet 4, Claude Sonnet 3.7, Claude Sonnet 3.5, Claude Haiku 3.5, Claude Haiku 3, and Claude Opus 3.
  </Accordion>

  <Accordion title="How does prompt caching work with extended thinking?">
    Cached system prompts and tools will be reused when thinking parameters change. However, thinking changes (enabling/disabling or budget changes) will invalidate previously cached prompt prefixes with messages content.

    For more details on cache invalidation, see [What invalidates the cache](#what-invalidates-the-cache).

    For more on extended thinking, including its interaction with tool use and prompt caching, see the [extended thinking documentation](/en/docs/build-with-claude/extended-thinking#extended-thinking-and-prompt-caching).
  </Accordion>

  <Accordion title="How do I enable prompt caching?">
    To enable prompt caching, include at least one `cache_control` breakpoint in your API request.
  </Accordion>

  <Accordion title="Can I use prompt caching with other API features?">
    Yes, prompt caching can be used alongside other API features like tool use and vision capabilities. However, changing whether there are images in a prompt or modifying tool use settings will break the cache.

    For more details on cache invalidation, see [What invalidates the cache](#what-invalidates-the-cache).
  </Accordion>

  <Accordion title="How does prompt caching affect pricing?">
    Prompt caching introduces a new pricing structure where cache writes cost 25% more than base input tokens, while cache hits cost only 10% of the base input token price.
  </Accordion>

  <Accordion title="Can I manually clear the cache?">
    Currently, there's no way to manually clear the cache. Cached prefixes automatically expire after a minimum of 5 minutes of inactivity.
  </Accordion>

  <Accordion title="How can I track the effectiveness of my caching strategy?">
    You can monitor cache performance using the `cache_creation_input_tokens` and `cache_read_input_tokens` fields in the API response.
  </Accordion>

  <Accordion title="What can break the cache?">
    See [What invalidates the cache](#what-invalidates-the-cache) for more details on cache invalidation, including a list of changes that require creating a new cache entry.
  </Accordion>

  <Accordion title="How does prompt caching handle privacy and data separation?">
    Prompt caching is designed with strong privacy and data separation measures:

    1. Cache keys are generated using a cryptographic hash of the prompts up to the cache control point. This means only requests with identical prompts can access a specific cache.

    2. Caches are organization-specific. Users within the same organization can access the same cache if they use identical prompts, but caches are not shared across different organizations, even for identical prompts.

    3. The caching mechanism is designed to maintain the integrity and privacy of each unique conversation or context.

    4. It's safe to use `cache_control` anywhere in your prompts. For cost efficiency, it's better to exclude highly variable parts (e.g., user's arbitrary input) from caching.

    These measures ensure that prompt caching maintains data privacy and security while offering performance benefits.
  </Accordion>

  <Accordion title="Can I use prompt caching with the Batches API?">
    Yes, it is possible to use prompt caching with your [Batches API](/en/docs/build-with-claude/batch-processing) requests. However, because asynchronous batch requests can be processed concurrently and in any order, cache hits are provided on a best-effort basis.

    The [1-hour cache](#1-hour-cache-duration) can help improve your cache hits. The most cost effective way of using it is the following:

    * Gather a set of message requests that have a shared prefix.
    * Send a batch request with just a single request that has this shared prefix and a 1-hour cache block. This will get written to the 1-hour cache.
    * As soon as this is complete, submit the rest of the requests. You will have to monitor the job to know when it completes.

    This is typically better than using the 5-minute cache simply because it’s common for batch requests to take between 5 minutes and 1 hour to complete. We’re considering ways to improve these cache hit rates and making this process more straightforward.
  </Accordion>

  <Accordion title="Why am I seeing the error `AttributeError: 'Beta' object has no attribute 'prompt_caching'` in Python?">
    This error typically appears when you have upgraded your SDK or you are using outdated code examples. Prompt caching is now generally available, so you no longer need the beta prefix. Instead of:

    <CodeGroup>
      ```Python Python
      python client.beta.prompt_caching.messages.create(...)
      ```
    </CodeGroup>

    Simply use:

    <CodeGroup>
      ```Python Python
      python client.messages.create(...)
      ```
    </CodeGroup>
  </Accordion>

  <Accordion title="Why am I seeing 'TypeError: Cannot read properties of undefined (reading 'messages')'?">
    This error typically appears when you have upgraded your SDK or you are using outdated code examples. Prompt caching is now generally available, so you no longer need the beta prefix. Instead of:

    ```typescript TypeScript
    client.beta.promptCaching.messages.create(...)
    ```

    Simply use:

    ```typescript
    client.messages.create(...)
    ```
  </Accordion>
</AccordionGroup>


# Prompt caching

Prompt caching is a powerful feature that optimizes your API usage by allowing resuming from specific prefixes in your prompts. This approach significantly reduces processing time and costs for repetitive tasks or prompts with consistent elements.

Here's an example of how to implement prompt caching with the Messages API using a `cache_control` block:

<CodeGroup>
  ```bash Shell
  curl https://api.anthropic.com/v1/messages \
    -H "content-type: application/json" \
    -H "x-api-key: $ANTHROPIC_API_KEY" \
    -H "anthropic-version: 2023-06-01" \
    -d '{
      "model": "claude-opus-4-20250514",
      "max_tokens": 1024,
      "system": [
        {
          "type": "text",
          "text": "You are an AI assistant tasked with analyzing literary works. Your goal is to provide insightful commentary on themes, characters, and writing style.\n"
        },
        {
          "type": "text",
          "text": "<the entire contents of Pride and Prejudice>",
          "cache_control": {"type": "ephemeral"}
        }
      ],
      "messages": [
        {
          "role": "user",
          "content": "Analyze the major themes in Pride and Prejudice."
        }
      ]
    }'

  # Call the model again with the same inputs up to the cache checkpoint
  curl https://api.anthropic.com/v1/messages # rest of input
  ```

  ```python Python
  import anthropic

  client = anthropic.Anthropic()

  response = client.messages.create(
      model="claude-opus-4-20250514",
      max_tokens=1024,
      system=[
        {
          "type": "text",
          "text": "You are an AI assistant tasked with analyzing literary works. Your goal is to provide insightful commentary on themes, characters, and writing style.\n",
        },
        {
          "type": "text",
          "text": "<the entire contents of 'Pride and Prejudice'>",
          "cache_control": {"type": "ephemeral"}
        }
      ],
      messages=[{"role": "user", "content": "Analyze the major themes in 'Pride and Prejudice'."}],
  )
  print(response.usage.model_dump_json())

  # Call the model again with the same inputs up to the cache checkpoint
  response = client.messages.create(.....)
  print(response.usage.model_dump_json())
  ```

  ```typescript TypeScript
  import Anthropic from '@anthropic-ai/sdk';

  const client = new Anthropic();

  const response = await client.messages.create({
    model: "claude-opus-4-20250514",
    max_tokens: 1024,
    system: [
      {
        type: "text",
        text: "You are an AI assistant tasked with analyzing literary works. Your goal is to provide insightful commentary on themes, characters, and writing style.\n",
      },
      {
        type: "text",
        text: "<the entire contents of 'Pride and Prejudice'>",
        cache_control: { type: "ephemeral" }
      }
    ],
    messages: [
      {
        role: "user",
        content: "Analyze the major themes in 'Pride and Prejudice'."
      }
    ]
  });
  console.log(response.usage);

  // Call the model again with the same inputs up to the cache checkpoint
  const new_response = await client.messages.create(...)
  console.log(new_response.usage);
  ```

  ```java Java
  import java.util.List;

  import com.anthropic.client.AnthropicClient;
  import com.anthropic.client.okhttp.AnthropicOkHttpClient;
  import com.anthropic.models.messages.CacheControlEphemeral;
  import com.anthropic.models.messages.Message;
  import com.anthropic.models.messages.MessageCreateParams;
  import com.anthropic.models.messages.Model;
  import com.anthropic.models.messages.TextBlockParam;

  public class PromptCachingExample {

      public static void main(String[] args) {
          AnthropicClient client = AnthropicOkHttpClient.fromEnv();

          MessageCreateParams params = MessageCreateParams.builder()
                  .model(Model.CLAUDE_OPUS_4_20250514)
                  .maxTokens(1024)
                  .systemOfTextBlockParams(List.of(
                          TextBlockParam.builder()
                                  .text("You are an AI assistant tasked with analyzing literary works. Your goal is to provide insightful commentary on themes, characters, and writing style.\n")
                                  .build(),
                          TextBlockParam.builder()
                                  .text("<the entire contents of 'Pride and Prejudice'>")
                                  .cacheControl(CacheControlEphemeral.builder().build())
                                  .build()
                  ))
                  .addUserMessage("Analyze the major themes in 'Pride and Prejudice'.")
                  .build();

          Message message = client.messages().create(params);
          System.out.println(message.usage());
      }
  }
  ```
</CodeGroup>

```JSON JSON
{"cache_creation_input_tokens":188086,"cache_read_input_tokens":0,"input_tokens":21,"output_tokens":393}
{"cache_creation_input_tokens":0,"cache_read_input_tokens":188086,"input_tokens":21,"output_tokens":393}
```

In this example, the entire text of "Pride and Prejudice" is cached using the `cache_control` parameter. This enables reuse of this large text across multiple API calls without reprocessing it each time. Changing only the user message allows you to ask various questions about the book while utilizing the cached content, leading to faster responses and improved efficiency.

***

## How prompt caching works

When you send a request with prompt caching enabled:

1. The system checks if a prompt prefix, up to a specified cache breakpoint, is already cached from a recent query.
2. If found, it uses the cached version, reducing processing time and costs.
3. Otherwise, it processes the full prompt and caches the prefix once the response begins.

This is especially useful for:

* Prompts with many examples
* Large amounts of context or background information
* Repetitive tasks with consistent instructions
* Long multi-turn conversations

By default, the cache has a 5-minute lifetime. The cache is refreshed for no additional cost each time the cached content is used.

<Tip>
  **Prompt caching caches the full prefix**

  Prompt caching references the entire prompt - `tools`, `system`, and `messages` (in that order) up to and including the block designated with `cache_control`.
</Tip>

***

## Pricing

Prompt caching introduces a new pricing structure. The table below shows the price per million tokens for each supported model:

| Model             | Base Input Tokens | 5m Cache Writes | 1h Cache Writes | Cache Hits & Refreshes | Output Tokens |
| ----------------- | ----------------- | --------------- | --------------- | ---------------------- | ------------- |
| Claude Opus 4     | \$15 / MTok       | \$18.75 / MTok  | \$30 / MTok     | \$1.50 / MTok          | \$75 / MTok   |
| Claude Sonnet 4   | \$3 / MTok        | \$3.75 / MTok   | \$6 / MTok      | \$0.30 / MTok          | \$15 / MTok   |
| Claude Sonnet 3.7 | \$3 / MTok        | \$3.75 / MTok   | \$6 / MTok      | \$0.30 / MTok          | \$15 / MTok   |
| Claude Sonnet 3.5 | \$3 / MTok        | \$3.75 / MTok   | \$6 / MTok      | \$0.30 / MTok          | \$15 / MTok   |
| Claude Haiku 3.5  | \$0.80 / MTok     | \$1 / MTok      | \$1.6 / MTok    | \$0.08 / MTok          | \$4 / MTok    |
| Claude Opus 3     | \$15 / MTok       | \$18.75 / MTok  | \$30 / MTok     | \$1.50 / MTok          | \$75 / MTok   |
| Claude Haiku 3    | \$0.25 / MTok     | \$0.30 / MTok   | \$0.50 / MTok   | \$0.03 / MTok          | \$1.25 / MTok |

Note:

* 5-minute cache write tokens are 1.25 times the base input tokens price
* 1-hour cache write tokens are 2 times the base input tokens price
* Cache read tokens are 0.1 times the base input tokens price
* Regular input and output tokens are priced at standard rates

***

## How to implement prompt caching

### Supported models

Prompt caching is currently supported on:

* Claude Opus 4
* Claude Sonnet 4
* Claude Sonnet 3.7
* Claude Sonnet 3.5
* Claude Haiku 3.5
* Claude Haiku 3
* Claude Opus 3

### Structuring your prompt

Place static content (tool definitions, system instructions, context, examples) at the beginning of your prompt. Mark the end of the reusable content for caching using the `cache_control` parameter.

Cache prefixes are created in the following order: `tools`, `system`, then `messages`. This order forms a hierarchy where each level builds upon the previous ones.

#### How automatic prefix checking works

**You can use just one cache breakpoint at the end of your static content, and the system will automatically find the longest matching prefix.** Here's how it works:

* When you add a `cache_control` breakpoint, the system automatically checks for cache hits at all previous content block boundaries (up to approximately 20 blocks before your explicit breakpoint)
* If any of these previous positions match cached content from earlier requests, the system uses the longest matching prefix
* This means you don't need multiple breakpoints just to enable caching - one at the end is sufficient

#### When to use multiple breakpoints

You can define up to 4 cache breakpoints if you want to:

* Cache different sections that change at different frequencies (e.g., tools rarely change, but context updates daily)
* Have more control over exactly what gets cached
* Ensure caching for content more than 20 blocks before your final breakpoint

<Note>
  **Important limitation**: The automatic prefix checking only looks back approximately 20 content blocks from each explicit breakpoint. If your prompt has more than 20 content blocks before your cache breakpoint, content earlier than that won't be checked for cache hits unless you add additional breakpoints.
</Note>

### Cache limitations

The minimum cacheable prompt length is:

* 1024 tokens for Claude Opus 4, Claude Sonnet 4, Claude Sonnet 3.7, Claude Sonnet 3.5 and Claude Opus 3
* 2048 tokens for Claude Haiku 3.5 and Claude Haiku 3

Shorter prompts cannot be cached, even if marked with `cache_control`. Any requests to cache fewer than this number of tokens will be processed without caching. To see if a prompt was cached, see the response usage [fields](https://docs.anthropic.com/en/docs/build-with-claude/prompt-caching#tracking-cache-performance).

For concurrent requests, note that a cache entry only becomes available after the first response begins. If you need cache hits for parallel requests, wait for the first response before sending subsequent requests.

Currently, "ephemeral" is the only supported cache type, which by default has a 5-minute lifetime.

### Understanding cache breakpoint costs

**Cache breakpoints themselves don't add any cost.** You are only charged for:

* **Cache writes**: When new content is written to the cache (25% more than base input tokens for 5-minute TTL)
* **Cache reads**: When cached content is used (10% of base input token price)
* **Regular input tokens**: For any uncached content

Adding more `cache_control` breakpoints doesn't increase your costs - you still pay the same amount based on what content is actually cached and read. The breakpoints simply give you control over what sections can be cached independently.

### What can be cached

Most blocks in the request can be designated for caching with `cache_control`. This includes:

* Tools: Tool definitions in the `tools` array
* System messages: Content blocks in the `system` array
* Text messages: Content blocks in the `messages.content` array, for both user and assistant turns
* Images & Documents: Content blocks in the `messages.content` array, in user turns
* Tool use and tool results: Content blocks in the `messages.content` array, in both user and assistant turns

Each of these elements can be marked with `cache_control` to enable caching for that portion of the request.

### What cannot be cached

While most request blocks can be cached, there are some exceptions:

* Thinking blocks cannot be cached directly with `cache_control`. However, thinking blocks CAN be cached alongside other content when they appear in previous assistant turns. When cached this way, they DO count as input tokens when read from cache.
* Sub-content blocks (like [citations](/en/docs/build-with-claude/citations)) themselves cannot be cached directly. Instead, cache the top-level block.

  In the case of citations, the top-level document content blocks that serve as the source material for citations can be cached. This allows you to use prompt caching with citations effectively by caching the documents that citations will reference.
* Empty text blocks cannot be cached.

### What invalidates the cache

Modifications to cached content can invalidate some or all of the cache.

As described in [Structuring your prompt](#structuring-your-prompt), the cache follows the hierarchy: `tools` → `system` → `messages`. Changes at each level invalidate that level and all subsequent levels.

The following table shows which parts of the cache are invalidated by different types of changes. ✘ indicates that the cache is invalidated, while ✓ indicates that the cache remains valid.

| What changes                                              | Tools cache | System cache | Messages cache | Impact                                                                                                                                                                                                                                                                                                                           |
| --------------------------------------------------------- | ----------- | ------------ | -------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Tool definitions**                                      | ✘           | ✘            | ✘              | Modifying tool definitions (names, descriptions, parameters) invalidates the entire cache                                                                                                                                                                                                                                        |
| **Web search toggle**                                     | ✓           | ✘            | ✘              | Enabling/disabling web search modifies the system prompt                                                                                                                                                                                                                                                                         |
| **Citations toggle**                                      | ✓           | ✘            | ✘              | Enabling/disabling citations modifies the system prompt                                                                                                                                                                                                                                                                          |
| **Tool choice**                                           | ✓           | ✓            | ✘              | Changes to `tool_choice` parameter only affect message blocks                                                                                                                                                                                                                                                                    |
| **Images**                                                | ✓           | ✓            | ✘              | Adding/removing images anywhere in the prompt affects message blocks                                                                                                                                                                                                                                                             |
| **Thinking parameters**                                   | ✓           | ✓            | ✘              | Changes to extended thinking settings (enable/disable, budget) affect message blocks                                                                                                                                                                                                                                             |
| **Non-tool results passed to extended thinking requests** | ✓           | ✓            | ✘              | When non-tool results are passed in requests while extended thinking is enabled, all previously-cached thinking blocks are stripped from context, and any messages in context that follow those thinking blocks are removed from the cache. For more details, see [Caching with thinking blocks](#caching-with-thinking-blocks). |

### Tracking cache performance

Monitor cache performance using these API response fields, within `usage` in the response (or `message_start` event if [streaming](https://docs.anthropic.com/en/docs/build-with-claude/streaming)):

* `cache_creation_input_tokens`: Number of tokens written to the cache when creating a new entry.
* `cache_read_input_tokens`: Number of tokens retrieved from the cache for this request.
* `input_tokens`: Number of input tokens which were not read from or used to create a cache.

### Best practices for effective caching

To optimize prompt caching performance:

* Cache stable, reusable content like system instructions, background information, large contexts, or frequent tool definitions.
* Place cached content at the prompt's beginning for best performance.
* Use cache breakpoints strategically to separate different cacheable prefix sections.
* Regularly analyze cache hit rates and adjust your strategy as needed.

### Optimizing for different use cases

Tailor your prompt caching strategy to your scenario:

* Conversational agents: Reduce cost and latency for extended conversations, especially those with long instructions or uploaded documents.
* Coding assistants: Improve autocomplete and codebase Q\&A by keeping relevant sections or a summarized version of the codebase in the prompt.
* Large document processing: Incorporate complete long-form material including images in your prompt without increasing response latency.
* Detailed instruction sets: Share extensive lists of instructions, procedures, and examples to fine-tune Claude's responses.  Developers often include an example or two in the prompt, but with prompt caching you can get even better performance by including 20+ diverse examples of high quality answers.
* Agentic tool use: Enhance performance for scenarios involving multiple tool calls and iterative code changes, where each step typically requires a new API call.
* Talk to books, papers, documentation, podcast transcripts, and other longform content:  Bring any knowledge base alive by embedding the entire document(s) into the prompt, and letting users ask it questions.

### Troubleshooting common issues

If experiencing unexpected behavior:

* Ensure cached sections are identical and marked with cache\_control in the same locations across calls
* Check that calls are made within the cache lifetime (5 minutes by default)
* Verify that `tool_choice` and image usage remain consistent between calls
* Validate that you are caching at least the minimum number of tokens
* The system automatically checks for cache hits at previous content block boundaries (up to \~20 blocks before your breakpoint). For prompts with more than 20 content blocks, you may need additional `cache_control` parameters earlier in the prompt to ensure all content can be cached

<Note>
  Changes to `tool_choice` or the presence/absence of images anywhere in the prompt will invalidate the cache, requiring a new cache entry to be created. For more details on cache invalidation, see [What invalidates the cache](#what-invalidates-the-cache).
</Note>

### Caching with thinking blocks

When using [extended thinking](/en/docs/build-with-claude/extended-thinking) with prompt caching, thinking blocks have special behavior:

**Automatic caching alongside other content**: While thinking blocks cannot be explicitly marked with `cache_control`, they get cached as part of the request content when you make subsequent API calls with tool results. This commonly happens during tool use when you pass thinking blocks back to continue the conversation.

**Input token counting**: When thinking blocks are read from cache, they count as input tokens in your usage metrics. This is important for cost calculation and token budgeting.

**Cache invalidation patterns**:

* Cache remains valid when only tool results are provided as user messages
* Cache gets invalidated when non-tool-result user content is added, causing all previous thinking blocks to be stripped
* This caching behavior occurs even without explicit `cache_control` markers

For more details on cache invalidation, see [What invalidates the cache](#what-invalidates-the-cache).

**Example with tool use**:

```
Request 1: User: "What's the weather in Paris?"
Response: [thinking_block_1] + [tool_use block 1]

Request 2: 
User: ["What's the weather in Paris?"], 
Assistant: [thinking_block_1] + [tool_use block 1], 
User: [tool_result_1, cache=True]
Response: [thinking_block_2] + [text block 2]
# Request 2 caches its request content (not the response)
# The cache includes: user message, thinking_block_1, tool_use block 1, and tool_result_1

Request 3:
User: ["What's the weather in Paris?"], 
Assistant: [thinking_block_1] + [tool_use block 1], 
User: [tool_result_1, cache=True], 
Assistant: [thinking_block_2] + [text block 2], 
User: [Text response, cache=True]
# Non-tool-result user block causes all thinking blocks to be ignored
# This request is processed as if thinking blocks were never present
```

When a non-tool-result user block is included, it designates a new assistant loop and all previous thinking blocks are removed from context.

For more detailed information, see the [extended thinking documentation](/en/docs/build-with-claude/extended-thinking#understanding-thinking-block-caching-behavior).

***

## Cache storage and sharing

* **Organization Isolation**: Caches are isolated between organizations. Different organizations never share caches, even if they use identical prompts.

* **Exact Matching**: Cache hits require 100% identical prompt segments, including all text and images up to and including the block marked with cache control.

* **Output Token Generation**: Prompt caching has no effect on output token generation. The response you receive will be identical to what you would get if prompt caching was not used.

***

## 1-hour cache duration

If you find that 5 minutes is too short, Anthropic also offers a 1-hour cache duration.

The 1-hour cache is currently in beta. To use the extended cache, add `extended-cache-ttl-2025-04-11` as a [beta header](/en/api/beta-headers) to your request, and then include `ttl` in the `cache_control` definition like this:

```JSON
"cache_control": {
    "type": "ephemeral",
    "ttl": "5m" | "1h"
}
```

The response will include detailed cache information like the following:

```JSON
{
    "usage": {
        "input_tokens": ...,
        "cache_read_input_tokens": ...,
        "cache_creation_input_tokens": ...,
        "output_tokens": ...,
        
        "cache_creation": {
            "ephemeral_5m_input_tokens": 456,
            "ephemeral_1h_input_tokens": 100,
        }
    }
}
```

Note that the current `cache_creation_input_tokens` field equals the sum of the values in the `cache_creation` object.

### When to use the 1-hour cache

If you have prompts that are used at a regular cadence (i.e., system prompts that are used more frequently than every 5 minutes), continue to use the 5-minute cache, since this will continue to be refreshed at no additional charge.

The 1-hour cache is best used in the following scenarios:

* When you have prompts that are likely used less frequently than 5 minutes, but more frequently than every hour. For example, when an agentic side-agent will take longer than 5 minutes, or when storing a long chat conversation with a user and you generally expect that user may not respond in the next 5 minutes.
* When latency is important and your follow up prompts may be sent beyond 5 minutes.
* When you want to improve your rate limit utilization, since cache hits are not deducted against your rate limit.

<Note>
  The 5-minute and 1-hour cache behave the same with respect to latency. You will generally see improved time-to-first-token for long documents.
</Note>

### Mixing different TTLs

You can use both 1-hour and 5-minute cache controls in the same request, but with an important constraint: Cache entries with longer TTL must appear before shorter TTLs (i.e., a 1-hour cache entry must appear before any 5-minute cache entries).

When mixing TTLs, we determine three billing locations in your prompt:

1. Position `A`: The token count at the highest cache hit (or 0 if no hits).
2. Position `B`: The token count at the highest 1-hour `cache_control` block after `A` (or equals `A` if none exist).
3. Position `C`: The token count at the last `cache_control` block.

<Note>
  If `B` and/or `C` are larger than `A`, they will necessarily be cache misses, because `A` is the highest cache hit.
</Note>

You'll be charged for:

1. Cache read tokens for `A`.
2. 1-hour cache write tokens for `(B - A)`.
3. 5-minute cache write tokens for `(C - B)`.

Here are 3 examples. This depicts the input tokens of 3 requests, each of which has different cache hits and cache misses. Each has a different calculated pricing, shown in the colored boxes, as a result.
![Mixing TTLs Diagram](https://mintlify.s3.us-west-1.amazonaws.com/anthropic/images/prompt-cache-mixed-ttl.svg)

***

## Prompt caching examples

To help you get started with prompt caching, we've prepared a [prompt caching cookbook](https://github.com/anthropics/anthropic-cookbook/blob/main/misc/prompt_caching.ipynb) with detailed examples and best practices.

Below, we've included several code snippets that showcase various prompt caching patterns. These examples demonstrate how to implement caching in different scenarios, helping you understand the practical applications of this feature:

<AccordionGroup>
  <Accordion title="Large context caching example">
    <CodeGroup>
      ```bash Shell
      curl https://api.anthropic.com/v1/messages \
           --header "x-api-key: $ANTHROPIC_API_KEY" \
           --header "anthropic-version: 2023-06-01" \
           --header "content-type: application/json" \
           --data \
      '{
          "model": "claude-opus-4-20250514",
          "max_tokens": 1024,
          "system": [
              {
                  "type": "text",
                  "text": "You are an AI assistant tasked with analyzing legal documents."
              },
              {
                  "type": "text",
                  "text": "Here is the full text of a complex legal agreement: [Insert full text of a 50-page legal agreement here]",
                  "cache_control": {"type": "ephemeral"}
              }
          ],
          "messages": [
              {
                  "role": "user",
                  "content": "What are the key terms and conditions in this agreement?"
              }
          ]
      }'
      ```

      ```Python Python
      import anthropic
      client = anthropic.Anthropic()

      response = client.messages.create(
          model="claude-opus-4-20250514",
          max_tokens=1024,
          system=[
              {
                  "type": "text",
                  "text": "You are an AI assistant tasked with analyzing legal documents."
              },
              {
                  "type": "text",
                  "text": "Here is the full text of a complex legal agreement: [Insert full text of a 50-page legal agreement here]",
                  "cache_control": {"type": "ephemeral"}
              }
          ],
          messages=[
              {
                  "role": "user",
                  "content": "What are the key terms and conditions in this agreement?"
              }
          ]
      )
      print(response.model_dump_json())
      ```

      ```typescript TypeScript
      import Anthropic from '@anthropic-ai/sdk';

      const client = new Anthropic();

      const response = await client.messages.create({
        model: "claude-opus-4-20250514",
        max_tokens: 1024,
        system: [
          {
              "type": "text",
              "text": "You are an AI assistant tasked with analyzing legal documents."
          },
          {
              "type": "text",
              "text": "Here is the full text of a complex legal agreement: [Insert full text of a 50-page legal agreement here]",
              "cache_control": {"type": "ephemeral"}
          }
        ],
        messages: [
          {
              "role": "user",
              "content": "What are the key terms and conditions in this agreement?"
          }
        ]
      });
      console.log(response);
      ```

      ```java Java
      import java.util.List;

      import com.anthropic.client.AnthropicClient;
      import com.anthropic.client.okhttp.AnthropicOkHttpClient;
      import com.anthropic.models.messages.CacheControlEphemeral;
      import com.anthropic.models.messages.Message;
      import com.anthropic.models.messages.MessageCreateParams;
      import com.anthropic.models.messages.Model;
      import com.anthropic.models.messages.TextBlockParam;

      public class LegalDocumentAnalysisExample {

          public static void main(String[] args) {
              AnthropicClient client = AnthropicOkHttpClient.fromEnv();

              MessageCreateParams params = MessageCreateParams.builder()
                      .model(Model.CLAUDE_OPUS_4_20250514)
                      .maxTokens(1024)
                      .systemOfTextBlockParams(List.of(
                              TextBlockParam.builder()
                                      .text("You are an AI assistant tasked with analyzing legal documents.")
                                      .build(),
                              TextBlockParam.builder()
                                      .text("Here is the full text of a complex legal agreement: [Insert full text of a 50-page legal agreement here]")
                                      .cacheControl(CacheControlEphemeral.builder().build())
                                      .build()
                      ))
                      .addUserMessage("What are the key terms and conditions in this agreement?")
                      .build();

              Message message = client.messages().create(params);
              System.out.println(message);
          }
      }
      ```
    </CodeGroup>

    This example demonstrates basic prompt caching usage, caching the full text of the legal agreement as a prefix while keeping the user instruction uncached.

    For the first request:

    * `input_tokens`: Number of tokens in the user message only
    * `cache_creation_input_tokens`: Number of tokens in the entire system message, including the legal document
    * `cache_read_input_tokens`: 0 (no cache hit on first request)

    For subsequent requests within the cache lifetime:

    * `input_tokens`: Number of tokens in the user message only
    * `cache_creation_input_tokens`: 0 (no new cache creation)
    * `cache_read_input_tokens`: Number of tokens in the entire cached system message
  </Accordion>

  <Accordion title="Caching tool definitions">
    <CodeGroup>
      ```bash Shell
      curl https://api.anthropic.com/v1/messages \
           --header "x-api-key: $ANTHROPIC_API_KEY" \
           --header "anthropic-version: 2023-06-01" \
           --header "content-type: application/json" \
           --data \
      '{
          "model": "claude-opus-4-20250514",
          "max_tokens": 1024,
          "tools": [
              {
                  "name": "get_weather",
                  "description": "Get the current weather in a given location",
                  "input_schema": {
                      "type": "object",
                      "properties": {
                          "location": {
                              "type": "string",
                              "description": "The city and state, e.g. San Francisco, CA"
                          },
                          "unit": {
                              "type": "string",
                              "enum": ["celsius", "fahrenheit"],
                              "description": "The unit of temperature, either celsius or fahrenheit"
                          }
                      },
                      "required": ["location"]
                  }
              },
              # many more tools
              {
                  "name": "get_time",
                  "description": "Get the current time in a given time zone",
                  "input_schema": {
                      "type": "object",
                      "properties": {
                          "timezone": {
                              "type": "string",
                              "description": "The IANA time zone name, e.g. America/Los_Angeles"
                          }
                      },
                      "required": ["timezone"]
                  },
                  "cache_control": {"type": "ephemeral"}
              }
          ],
          "messages": [
              {
                  "role": "user",
                  "content": "What is the weather and time in New York?"
              }
          ]
      }'
      ```

      ```Python Python
      import anthropic
      client = anthropic.Anthropic()

      response = client.messages.create(
          model="claude-opus-4-20250514",
          max_tokens=1024,
          tools=[
              {
                  "name": "get_weather",
                  "description": "Get the current weather in a given location",
                  "input_schema": {
                      "type": "object",
                      "properties": {
                          "location": {
                              "type": "string",
                              "description": "The city and state, e.g. San Francisco, CA"
                          },
                          "unit": {
                              "type": "string",
                              "enum": ["celsius", "fahrenheit"],
                              "description": "The unit of temperature, either 'celsius' or 'fahrenheit'"
                          }
                      },
                      "required": ["location"]
                  },
              },
              # many more tools
              {
                  "name": "get_time",
                  "description": "Get the current time in a given time zone",
                  "input_schema": {
                      "type": "object",
                      "properties": {
                          "timezone": {
                              "type": "string",
                              "description": "The IANA time zone name, e.g. America/Los_Angeles"
                          }
                      },
                      "required": ["timezone"]
                  },
                  "cache_control": {"type": "ephemeral"}
              }
          ],
          messages=[
              {
                  "role": "user",
                  "content": "What's the weather and time in New York?"
              }
          ]
      )
      print(response.model_dump_json())
      ```

      ```typescript TypeScript
      import Anthropic from '@anthropic-ai/sdk';

      const client = new Anthropic();

      const response = await client.messages.create({
          model: "claude-opus-4-20250514",
          max_tokens: 1024,
          tools=[
              {
                  "name": "get_weather",
                  "description": "Get the current weather in a given location",
                  "input_schema": {
                      "type": "object",
                      "properties": {
                          "location": {
                              "type": "string",
                              "description": "The city and state, e.g. San Francisco, CA"
                          },
                          "unit": {
                              "type": "string",
                              "enum": ["celsius", "fahrenheit"],
                              "description": "The unit of temperature, either 'celsius' or 'fahrenheit'"
                          }
                      },
                      "required": ["location"]
                  },
              },
              // many more tools
              {
                  "name": "get_time",
                  "description": "Get the current time in a given time zone",
                  "input_schema": {
                      "type": "object",
                      "properties": {
                          "timezone": {
                              "type": "string",
                              "description": "The IANA time zone name, e.g. America/Los_Angeles"
                          }
                      },
                      "required": ["timezone"]
                  },
                  "cache_control": {"type": "ephemeral"}
              }
          ],
          messages: [
              {
                  "role": "user",
                  "content": "What's the weather and time in New York?"
              }
          ]
      });
      console.log(response);
      ```

      ```java Java
      import java.util.List;
      import java.util.Map;

      import com.anthropic.client.AnthropicClient;
      import com.anthropic.client.okhttp.AnthropicOkHttpClient;
      import com.anthropic.core.JsonValue;
      import com.anthropic.models.messages.CacheControlEphemeral;
      import com.anthropic.models.messages.Message;
      import com.anthropic.models.messages.MessageCreateParams;
      import com.anthropic.models.messages.Model;
      import com.anthropic.models.messages.Tool;
      import com.anthropic.models.messages.Tool.InputSchema;

      public class ToolsWithCacheControlExample {

          public static void main(String[] args) {
              AnthropicClient client = AnthropicOkHttpClient.fromEnv();

              // Weather tool schema
              InputSchema weatherSchema = InputSchema.builder()
                      .properties(JsonValue.from(Map.of(
                              "location", Map.of(
                                      "type", "string",
                                      "description", "The city and state, e.g. San Francisco, CA"
                              ),
                              "unit", Map.of(
                                      "type", "string",
                                      "enum", List.of("celsius", "fahrenheit"),
                                      "description", "The unit of temperature, either celsius or fahrenheit"
                              )
                      )))
                      .putAdditionalProperty("required", JsonValue.from(List.of("location")))
                      .build();

              // Time tool schema
              InputSchema timeSchema = InputSchema.builder()
                      .properties(JsonValue.from(Map.of(
                              "timezone", Map.of(
                                      "type", "string",
                                      "description", "The IANA time zone name, e.g. America/Los_Angeles"
                              )
                      )))
                      .putAdditionalProperty("required", JsonValue.from(List.of("timezone")))
                      .build();

              MessageCreateParams params = MessageCreateParams.builder()
                      .model(Model.CLAUDE_OPUS_4_20250514)
                      .maxTokens(1024)
                      .addTool(Tool.builder()
                              .name("get_weather")
                              .description("Get the current weather in a given location")
                              .inputSchema(weatherSchema)
                              .build())
                      .addTool(Tool.builder()
                              .name("get_time")
                              .description("Get the current time in a given time zone")
                              .inputSchema(timeSchema)
                              .cacheControl(CacheControlEphemeral.builder().build())
                              .build())
                      .addUserMessage("What is the weather and time in New York?")
                      .build();

              Message message = client.messages().create(params);
              System.out.println(message);
          }
      }
      ```
    </CodeGroup>

    In this example, we demonstrate caching tool definitions.

    The `cache_control` parameter is placed on the final tool (`get_time`) to designate all of the tools as part of the static prefix.

    This means that all tool definitions, including `get_weather` and any other tools defined before `get_time`, will be cached as a single prefix.

    This approach is useful when you have a consistent set of tools that you want to reuse across multiple requests without re-processing them each time.

    For the first request:

    * `input_tokens`: Number of tokens in the user message
    * `cache_creation_input_tokens`: Number of tokens in all tool definitions and system prompt
    * `cache_read_input_tokens`: 0 (no cache hit on first request)

    For subsequent requests within the cache lifetime:

    * `input_tokens`: Number of tokens in the user message
    * `cache_creation_input_tokens`: 0 (no new cache creation)
    * `cache_read_input_tokens`: Number of tokens in all cached tool definitions and system prompt
  </Accordion>

  <Accordion title="Continuing a multi-turn conversation">
    <CodeGroup>
      ```bash Shell
      curl https://api.anthropic.com/v1/messages \
           --header "x-api-key: $ANTHROPIC_API_KEY" \
           --header "anthropic-version: 2023-06-01" \
           --header "content-type: application/json" \
           --data \
      '{
          "model": "claude-opus-4-20250514",
          "max_tokens": 1024,
          "system": [
              {
                  "type": "text",
                  "text": "...long system prompt",
                  "cache_control": {"type": "ephemeral"}
              }
          ],
          "messages": [
              {
                  "role": "user",
                  "content": [
                      {
                          "type": "text",
                          "text": "Hello, can you tell me more about the solar system?",
                      }
                  ]
              },
              {
                  "role": "assistant",
                  "content": "Certainly! The solar system is the collection of celestial bodies that orbit our Sun. It consists of eight planets, numerous moons, asteroids, comets, and other objects. The planets, in order from closest to farthest from the Sun, are: Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, and Neptune. Each planet has its own unique characteristics and features. Is there a specific aspect of the solar system you would like to know more about?"
              },
              {
                  "role": "user",
                  "content": [
                      {
                          "type": "text",
                          "text": "Good to know."
                      },
                      {
                          "type": "text",
                          "text": "Tell me more about Mars.",
                          "cache_control": {"type": "ephemeral"}
                      }
                  ]
              }
          ]
      }'
      ```

      ```Python Python
      import anthropic
      client = anthropic.Anthropic()

      response = client.messages.create(
          model="claude-opus-4-20250514",
          max_tokens=1024,
          system=[
              {
                  "type": "text",
                  "text": "...long system prompt",
                  "cache_control": {"type": "ephemeral"}
              }
          ],
          messages=[
              # ...long conversation so far
              {
                  "role": "user",
                  "content": [
                      {
                          "type": "text",
                          "text": "Hello, can you tell me more about the solar system?",
                      }
                  ]
              },
              {
                  "role": "assistant",
                  "content": "Certainly! The solar system is the collection of celestial bodies that orbit our Sun. It consists of eight planets, numerous moons, asteroids, comets, and other objects. The planets, in order from closest to farthest from the Sun, are: Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, and Neptune. Each planet has its own unique characteristics and features. Is there a specific aspect of the solar system you'd like to know more about?"
              },
              {
                  "role": "user",
                  "content": [
                      {
                          "type": "text",
                          "text": "Good to know."
                      },
                      {
                          "type": "text",
                          "text": "Tell me more about Mars.",
                          "cache_control": {"type": "ephemeral"}
                      }
                  ]
              }
          ]
      )
      print(response.model_dump_json())
      ```

      ```typescript TypeScript
      import Anthropic from '@anthropic-ai/sdk';

      const client = new Anthropic();

      const response = await client.messages.create({
          model: "claude-opus-4-20250514",
          max_tokens: 1024,
          system=[
              {
                  "type": "text",
                  "text": "...long system prompt",
                  "cache_control": {"type": "ephemeral"}
              }
          ],
          messages=[
              // ...long conversation so far
              {
                  "role": "user",
                  "content": [
                      {
                          "type": "text",
                          "text": "Hello, can you tell me more about the solar system?",
                      }
                  ]
              },
              {
                  "role": "assistant",
                  "content": "Certainly! The solar system is the collection of celestial bodies that orbit our Sun. It consists of eight planets, numerous moons, asteroids, comets, and other objects. The planets, in order from closest to farthest from the Sun, are: Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, and Neptune. Each planet has its own unique characteristics and features. Is there a specific aspect of the solar system you'd like to know more about?"
              },
              {
                  "role": "user",
                  "content": [
                      {
                          "type": "text",
                          "text": "Good to know."
                      },
                      {
                          "type": "text",
                          "text": "Tell me more about Mars.",
                          "cache_control": {"type": "ephemeral"}
                      }
                  ]
              }
          ]
      });
      console.log(response);
      ```

      ```java Java
      import java.util.List;

      import com.anthropic.client.AnthropicClient;
      import com.anthropic.client.okhttp.AnthropicOkHttpClient;
      import com.anthropic.models.messages.CacheControlEphemeral;
      import com.anthropic.models.messages.ContentBlockParam;
      import com.anthropic.models.messages.Message;
      import com.anthropic.models.messages.MessageCreateParams;
      import com.anthropic.models.messages.Model;
      import com.anthropic.models.messages.TextBlockParam;

      public class ConversationWithCacheControlExample {

          public static void main(String[] args) {
              AnthropicClient client = AnthropicOkHttpClient.fromEnv();

              // Create ephemeral system prompt
              TextBlockParam systemPrompt = TextBlockParam.builder()
                      .text("...long system prompt")
                      .cacheControl(CacheControlEphemeral.builder().build())
                      .build();

              // Create message params
              MessageCreateParams params = MessageCreateParams.builder()
                      .model(Model.CLAUDE_OPUS_4_20250514)
                      .maxTokens(1024)
                      .systemOfTextBlockParams(List.of(systemPrompt))
                      // First user message (without cache control)
                      .addUserMessage("Hello, can you tell me more about the solar system?")
                      // Assistant response
                      .addAssistantMessage("Certainly! The solar system is the collection of celestial bodies that orbit our Sun. It consists of eight planets, numerous moons, asteroids, comets, and other objects. The planets, in order from closest to farthest from the Sun, are: Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, and Neptune. Each planet has its own unique characteristics and features. Is there a specific aspect of the solar system you would like to know more about?")
                      // Second user message (with cache control)
                      .addUserMessageOfBlockParams(List.of(
                              ContentBlockParam.ofText(TextBlockParam.builder()
                                      .text("Good to know.")
                                      .build()),
                              ContentBlockParam.ofText(TextBlockParam.builder()
                                      .text("Tell me more about Mars.")
                                      .cacheControl(CacheControlEphemeral.builder().build())
                                      .build())
                      ))
                      .build();

              Message message = client.messages().create(params);
              System.out.println(message);
          }
      }
      ```
    </CodeGroup>

    In this example, we demonstrate how to use prompt caching in a multi-turn conversation.

    During each turn, we mark the final block of the final message with `cache_control` so the conversation can be incrementally cached. The system will automatically lookup and use the longest previously cached prefix for follow-up messages. That is, blocks that were previously marked with a `cache_control` block are later not marked with this, but they will still be considered a cache hit (and also a cache refresh!) if they are hit within 5 minutes.

    In addition, note that the `cache_control` parameter is placed on the system message. This is to ensure that if this gets evicted from the cache (after not being used for more than 5 minutes), it will get added back to the cache on the next request.

    This approach is useful for maintaining context in ongoing conversations without repeatedly processing the same information.

    When this is set up properly, you should see the following in the usage response of each request:

    * `input_tokens`: Number of tokens in the new user message (will be minimal)
    * `cache_creation_input_tokens`: Number of tokens in the new assistant and user turns
    * `cache_read_input_tokens`: Number of tokens in the conversation up to the previous turn
  </Accordion>

  <Accordion title="Putting it all together: Multiple cache breakpoints">
    <CodeGroup>
      ```bash Shell
      curl https://api.anthropic.com/v1/messages \
           --header "x-api-key: $ANTHROPIC_API_KEY" \
           --header "anthropic-version: 2023-06-01" \
           --header "content-type: application/json" \
           --data \
      '{
          "model": "claude-opus-4-20250514",
          "max_tokens": 1024,
          "tools": [
              {
                  "name": "search_documents",
                  "description": "Search through the knowledge base",
                  "input_schema": {
                      "type": "object",
                      "properties": {
                          "query": {
                              "type": "string",
                              "description": "Search query"
                          }
                      },
                      "required": ["query"]
                  }
              },
              {
                  "name": "get_document",
                  "description": "Retrieve a specific document by ID",
                  "input_schema": {
                      "type": "object",
                      "properties": {
                          "doc_id": {
                              "type": "string",
                              "description": "Document ID"
                          }
                      },
                      "required": ["doc_id"]
                  },
                  "cache_control": {"type": "ephemeral"}
              }
          ],
          "system": [
              {
                  "type": "text",
                  "text": "You are a helpful research assistant with access to a document knowledge base.\n\n# Instructions\n- Always search for relevant documents before answering\n- Provide citations for your sources\n- Be objective and accurate in your responses\n- If multiple documents contain relevant information, synthesize them\n- Acknowledge when information is not available in the knowledge base",
                  "cache_control": {"type": "ephemeral"}
              },
              {
                  "type": "text",
                  "text": "# Knowledge Base Context\n\nHere are the relevant documents for this conversation:\n\n## Document 1: Solar System Overview\nThe solar system consists of the Sun and all objects that orbit it...\n\n## Document 2: Planetary Characteristics\nEach planet has unique features. Mercury is the smallest planet...\n\n## Document 3: Mars Exploration\nMars has been a target of exploration for decades...\n\n[Additional documents...]",
                  "cache_control": {"type": "ephemeral"}
              }
          ],
          "messages": [
              {
                  "role": "user",
                  "content": "Can you search for information about Mars rovers?"
              },
              {
                  "role": "assistant",
                  "content": [
                      {
                          "type": "tool_use",
                          "id": "tool_1",
                          "name": "search_documents",
                          "input": {"query": "Mars rovers"}
                      }
                  ]
              },
              {
                  "role": "user",
                  "content": [
                      {
                          "type": "tool_result",
                          "tool_use_id": "tool_1",
                          "content": "Found 3 relevant documents: Document 3 (Mars Exploration), Document 7 (Rover Technology), Document 9 (Mission History)"
                      }
                  ]
              },
              {
                  "role": "assistant",
                  "content": [
                      {
                          "type": "text",
                          "text": "I found 3 relevant documents about Mars rovers. Let me get more details from the Mars Exploration document."
                      }
                  ]
              },
              {
                  "role": "user",
                  "content": [
                      {
                          "type": "text",
                          "text": "Yes, please tell me about the Perseverance rover specifically.",
                          "cache_control": {"type": "ephemeral"}
                      }
                  ]
              }
          ]
      }'
      ```

      ```Python Python
      import anthropic
      client = anthropic.Anthropic()

      response = client.messages.create(
          model="claude-opus-4-20250514",
          max_tokens=1024,
          tools=[
              {
                  "name": "search_documents",
                  "description": "Search through the knowledge base",
                  "input_schema": {
                      "type": "object",
                      "properties": {
                          "query": {
                              "type": "string",
                              "description": "Search query"
                          }
                      },
                      "required": ["query"]
                  }
              },
              {
                  "name": "get_document",
                  "description": "Retrieve a specific document by ID",
                  "input_schema": {
                      "type": "object",
                      "properties": {
                          "doc_id": {
                              "type": "string",
                              "description": "Document ID"
                          }
                      },
                      "required": ["doc_id"]
                  },
                  "cache_control": {"type": "ephemeral"}
              }
          ],
          system=[
              {
                  "type": "text",
                  "text": "You are a helpful research assistant with access to a document knowledge base.\n\n# Instructions\n- Always search for relevant documents before answering\n- Provide citations for your sources\n- Be objective and accurate in your responses\n- If multiple documents contain relevant information, synthesize them\n- Acknowledge when information is not available in the knowledge base",
                  "cache_control": {"type": "ephemeral"}
              },
              {
                  "type": "text",
                  "text": "# Knowledge Base Context\n\nHere are the relevant documents for this conversation:\n\n## Document 1: Solar System Overview\nThe solar system consists of the Sun and all objects that orbit it...\n\n## Document 2: Planetary Characteristics\nEach planet has unique features. Mercury is the smallest planet...\n\n## Document 3: Mars Exploration\nMars has been a target of exploration for decades...\n\n[Additional documents...]",
                  "cache_control": {"type": "ephemeral"}
              }
          ],
          messages=[
              {
                  "role": "user",
                  "content": "Can you search for information about Mars rovers?"
              },
              {
                  "role": "assistant",
                  "content": [
                      {
                          "type": "tool_use",
                          "id": "tool_1",
                          "name": "search_documents",
                          "input": {"query": "Mars rovers"}
                      }
                  ]
              },
              {
                  "role": "user",
                  "content": [
                      {
                          "type": "tool_result",
                          "tool_use_id": "tool_1",
                          "content": "Found 3 relevant documents: Document 3 (Mars Exploration), Document 7 (Rover Technology), Document 9 (Mission History)"
                      }
                  ]
              },
              {
                  "role": "assistant",
                  "content": [
                      {
                          "type": "text",
                          "text": "I found 3 relevant documents about Mars rovers. Let me get more details from the Mars Exploration document."
                      }
                  ]
              },
              {
                  "role": "user",
                  "content": [
                      {
                          "type": "text",
                          "text": "Yes, please tell me about the Perseverance rover specifically.",
                          "cache_control": {"type": "ephemeral"}
                      }
                  ]
              }
          ]
      )
      print(response.model_dump_json())
      ```

      ```typescript TypeScript
      import Anthropic from '@anthropic-ai/sdk';

      const client = new Anthropic();

      const response = await client.messages.create({
          model: "claude-opus-4-20250514",
          max_tokens: 1024,
          tools: [
              {
                  name: "search_documents",
                  description: "Search through the knowledge base",
                  input_schema: {
                      type: "object",
                      properties: {
                          query: {
                              type: "string",
                              description: "Search query"
                          }
                      },
                      required: ["query"]
                  }
              },
              {
                  name: "get_document",
                  description: "Retrieve a specific document by ID",
                  input_schema: {
                      type: "object",
                      properties: {
                          doc_id: {
                              type: "string",
                              description: "Document ID"
                          }
                      },
                      required: ["doc_id"]
                  },
                  cache_control: { type: "ephemeral" }
              }
          ],
          system: [
              {
                  type: "text",
                  text: "You are a helpful research assistant with access to a document knowledge base.\n\n# Instructions\n- Always search for relevant documents before answering\n- Provide citations for your sources\n- Be objective and accurate in your responses\n- If multiple documents contain relevant information, synthesize them\n- Acknowledge when information is not available in the knowledge base",
                  cache_control: { type: "ephemeral" }
              },
              {
                  type: "text",
                  text: "# Knowledge Base Context\n\nHere are the relevant documents for this conversation:\n\n## Document 1: Solar System Overview\nThe solar system consists of the Sun and all objects that orbit it...\n\n## Document 2: Planetary Characteristics\nEach planet has unique features. Mercury is the smallest planet...\n\n## Document 3: Mars Exploration\nMars has been a target of exploration for decades...\n\n[Additional documents...]",
                  cache_control: { type: "ephemeral" }
              }
          ],
          messages: [
              {
                  role: "user",
                  content: "Can you search for information about Mars rovers?"
              },
              {
                  role: "assistant",
                  content: [
                      {
                          type: "tool_use",
                          id: "tool_1",
                          name: "search_documents",
                          input: { query: "Mars rovers" }
                      }
                  ]
              },
              {
                  role: "user",
                  content: [
                      {
                          type: "tool_result",
                          tool_use_id: "tool_1",
                          content: "Found 3 relevant documents: Document 3 (Mars Exploration), Document 7 (Rover Technology), Document 9 (Mission History)"
                      }
                  ]
              },
              {
                  role: "assistant",
                  content: [
                      {
                          type: "text",
                          text: "I found 3 relevant documents about Mars rovers. Let me get more details from the Mars Exploration document."
                      }
                  ]
              },
              {
                  role: "user",
                  content: [
                      {
                          type: "text",
                          text: "Yes, please tell me about the Perseverance rover specifically.",
                          cache_control: { type: "ephemeral" }
                      }
                  ]
              }
          ]
      });
      console.log(response);
      ```

      ```java Java
      import java.util.List;
      import java.util.Map;

      import com.anthropic.client.AnthropicClient;
      import com.anthropic.client.okhttp.AnthropicOkHttpClient;
      import com.anthropic.core.JsonValue;
      import com.anthropic.models.messages.CacheControlEphemeral;
      import com.anthropic.models.messages.ContentBlockParam;
      import com.anthropic.models.messages.Message;
      import com.anthropic.models.messages.MessageCreateParams;
      import com.anthropic.models.messages.Model;
      import com.anthropic.models.messages.TextBlockParam;
      import com.anthropic.models.messages.Tool;
      import com.anthropic.models.messages.Tool.InputSchema;
      import com.anthropic.models.messages.ToolResultBlockParam;
      import com.anthropic.models.messages.ToolUseBlockParam;

      public class MultipleCacheBreakpointsExample {

          public static void main(String[] args) {
              AnthropicClient client = AnthropicOkHttpClient.fromEnv();

              // Search tool schema
              InputSchema searchSchema = InputSchema.builder()
                      .properties(JsonValue.from(Map.of(
                              "query", Map.of(
                                      "type", "string",
                                      "description", "Search query"
                              )
                      )))
                      .putAdditionalProperty("required", JsonValue.from(List.of("query")))
                      .build();

              // Get document tool schema
              InputSchema getDocSchema = InputSchema.builder()
                      .properties(JsonValue.from(Map.of(
                              "doc_id", Map.of(
                                      "type", "string",
                                      "description", "Document ID"
                              )
                      )))
                      .putAdditionalProperty("required", JsonValue.from(List.of("doc_id")))
                      .build();

              MessageCreateParams params = MessageCreateParams.builder()
                      .model(Model.CLAUDE_OPUS_4_20250514)
                      .maxTokens(1024)
                      // Tools with cache control on the last one
                      .addTool(Tool.builder()
                              .name("search_documents")
                              .description("Search through the knowledge base")
                              .inputSchema(searchSchema)
                              .build())
                      .addTool(Tool.builder()
                              .name("get_document")
                              .description("Retrieve a specific document by ID")
                              .inputSchema(getDocSchema)
                              .cacheControl(CacheControlEphemeral.builder().build())
                              .build())
                      // System prompts with cache control on instructions and context separately
                      .systemOfTextBlockParams(List.of(
                              TextBlockParam.builder()
                                      .text("You are a helpful research assistant with access to a document knowledge base.\n\n# Instructions\n- Always search for relevant documents before answering\n- Provide citations for your sources\n- Be objective and accurate in your responses\n- If multiple documents contain relevant information, synthesize them\n- Acknowledge when information is not available in the knowledge base")
                                      .cacheControl(CacheControlEphemeral.builder().build())
                                      .build(),
                              TextBlockParam.builder()
                                      .text("# Knowledge Base Context\n\nHere are the relevant documents for this conversation:\n\n## Document 1: Solar System Overview\nThe solar system consists of the Sun and all objects that orbit it...\n\n## Document 2: Planetary Characteristics\nEach planet has unique features. Mercury is the smallest planet...\n\n## Document 3: Mars Exploration\nMars has been a target of exploration for decades...\n\n[Additional documents...]")
                                      .cacheControl(CacheControlEphemeral.builder().build())
                                      .build()
                      ))
                      // Conversation history
                      .addUserMessage("Can you search for information about Mars rovers?")
                      .addAssistantMessageOfBlockParams(List.of(
                              ContentBlockParam.ofToolUse(ToolUseBlockParam.builder()
                                      .id("tool_1")
                                      .name("search_documents")
                                      .input(JsonValue.from(Map.of("query", "Mars rovers")))
                                      .build())
                      ))
                      .addUserMessageOfBlockParams(List.of(
                              ContentBlockParam.ofToolResult(ToolResultBlockParam.builder()
                                      .toolUseId("tool_1")
                                      .content("Found 3 relevant documents: Document 3 (Mars Exploration), Document 7 (Rover Technology), Document 9 (Mission History)")
                                      .build())
                      ))
                      .addAssistantMessageOfBlockParams(List.of(
                              ContentBlockParam.ofText(TextBlockParam.builder()
                                      .text("I found 3 relevant documents about Mars rovers. Let me get more details from the Mars Exploration document.")
                                      .build())
                      ))
                      .addUserMessageOfBlockParams(List.of(
                              ContentBlockParam.ofText(TextBlockParam.builder()
                                      .text("Yes, please tell me about the Perseverance rover specifically.")
                                      .cacheControl(CacheControlEphemeral.builder().build())
                                      .build())
                      ))
                      .build();

              Message message = client.messages().create(params);
              System.out.println(message);
          }
      }
      ```
    </CodeGroup>

    This comprehensive example demonstrates how to use all 4 available cache breakpoints to optimize different parts of your prompt:

    1. **Tools cache** (cache breakpoint 1): The `cache_control` parameter on the last tool definition caches all tool definitions.

    2. **Reusable instructions cache** (cache breakpoint 2): The static instructions in the system prompt are cached separately. These instructions rarely change between requests.

    3. **RAG context cache** (cache breakpoint 3): The knowledge base documents are cached independently, allowing you to update the RAG documents without invalidating the tools or instructions cache.

    4. **Conversation history cache** (cache breakpoint 4): The assistant's response is marked with `cache_control` to enable incremental caching of the conversation as it progresses.

    This approach provides maximum flexibility:

    * If you only update the final user message, all four cache segments are reused
    * If you update the RAG documents but keep the same tools and instructions, the first two cache segments are reused
    * If you change the conversation but keep the same tools, instructions, and documents, the first three segments are reused
    * Each cache breakpoint can be invalidated independently based on what changes in your application

    For the first request:

    * `input_tokens`: Tokens in the final user message
    * `cache_creation_input_tokens`: Tokens in all cached segments (tools + instructions + RAG documents + conversation history)
    * `cache_read_input_tokens`: 0 (no cache hits)

    For subsequent requests with only a new user message:

    * `input_tokens`: Tokens in the new user message only
    * `cache_creation_input_tokens`: Any new tokens added to conversation history
    * `cache_read_input_tokens`: All previously cached tokens (tools + instructions + RAG documents + previous conversation)

    This pattern is especially powerful for:

    * RAG applications with large document contexts
    * Agent systems that use multiple tools
    * Long-running conversations that need to maintain context
    * Applications that need to optimize different parts of the prompt independently
  </Accordion>
</AccordionGroup>

***

## FAQ

<AccordionGroup>
  <Accordion title="Do I need multiple cache breakpoints or is one at the end sufficient?">
    **In most cases, a single cache breakpoint at the end of your static content is sufficient.** The system automatically checks for cache hits at all previous content block boundaries (up to 20 blocks before your breakpoint) and uses the longest matching prefix.

    You only need multiple breakpoints if:

    * You have more than 20 content blocks before your desired cache point
    * You want to cache sections that update at different frequencies independently
    * You need explicit control over what gets cached for cost optimization

    Example: If you have system instructions (rarely change) and RAG context (changes daily), you might use two breakpoints to cache them separately.
  </Accordion>

  <Accordion title="Do cache breakpoints add extra cost?">
    No, cache breakpoints themselves are free. You only pay for:

    * Writing content to cache (25% more than base input tokens for 5-minute TTL)
    * Reading from cache (10% of base input token price)
    * Regular input tokens for uncached content

    The number of breakpoints doesn't affect pricing - only the amount of content cached and read matters.
  </Accordion>

  <Accordion title="What is the cache lifetime?">
    The cache's default minimum lifetime (TTL) is 5 minutes. This lifetime is refreshed each time the cached content is used.

    If you find that 5 minutes is too short, Anthropic also offers a [1-hour cache TTL](#1-hour-cache-duration).
  </Accordion>

  <Accordion title="How many cache breakpoints can I use?">
    You can define up to 4 cache breakpoints (using `cache_control` parameters) in your prompt.
  </Accordion>

  <Accordion title="Is prompt caching available for all models?">
    No, prompt caching is currently only available for Claude Opus 4, Claude Sonnet 4, Claude Sonnet 3.7, Claude Sonnet 3.5, Claude Haiku 3.5, Claude Haiku 3, and Claude Opus 3.
  </Accordion>

  <Accordion title="How does prompt caching work with extended thinking?">
    Cached system prompts and tools will be reused when thinking parameters change. However, thinking changes (enabling/disabling or budget changes) will invalidate previously cached prompt prefixes with messages content.

    For more details on cache invalidation, see [What invalidates the cache](#what-invalidates-the-cache).

    For more on extended thinking, including its interaction with tool use and prompt caching, see the [extended thinking documentation](/en/docs/build-with-claude/extended-thinking#extended-thinking-and-prompt-caching).
  </Accordion>

  <Accordion title="How do I enable prompt caching?">
    To enable prompt caching, include at least one `cache_control` breakpoint in your API request.
  </Accordion>

  <Accordion title="Can I use prompt caching with other API features?">
    Yes, prompt caching can be used alongside other API features like tool use and vision capabilities. However, changing whether there are images in a prompt or modifying tool use settings will break the cache.

    For more details on cache invalidation, see [What invalidates the cache](#what-invalidates-the-cache).
  </Accordion>

  <Accordion title="How does prompt caching affect pricing?">
    Prompt caching introduces a new pricing structure where cache writes cost 25% more than base input tokens, while cache hits cost only 10% of the base input token price.
  </Accordion>

  <Accordion title="Can I manually clear the cache?">
    Currently, there's no way to manually clear the cache. Cached prefixes automatically expire after a minimum of 5 minutes of inactivity.
  </Accordion>

  <Accordion title="How can I track the effectiveness of my caching strategy?">
    You can monitor cache performance using the `cache_creation_input_tokens` and `cache_read_input_tokens` fields in the API response.
  </Accordion>

  <Accordion title="What can break the cache?">
    See [What invalidates the cache](#what-invalidates-the-cache) for more details on cache invalidation, including a list of changes that require creating a new cache entry.
  </Accordion>

  <Accordion title="How does prompt caching handle privacy and data separation?">
    Prompt caching is designed with strong privacy and data separation measures:

    1. Cache keys are generated using a cryptographic hash of the prompts up to the cache control point. This means only requests with identical prompts can access a specific cache.

    2. Caches are organization-specific. Users within the same organization can access the same cache if they use identical prompts, but caches are not shared across different organizations, even for identical prompts.

    3. The caching mechanism is designed to maintain the integrity and privacy of each unique conversation or context.

    4. It's safe to use `cache_control` anywhere in your prompts. For cost efficiency, it's better to exclude highly variable parts (e.g., user's arbitrary input) from caching.

    These measures ensure that prompt caching maintains data privacy and security while offering performance benefits.
  </Accordion>

  <Accordion title="Can I use prompt caching with the Batches API?">
    Yes, it is possible to use prompt caching with your [Batches API](/en/docs/build-with-claude/batch-processing) requests. However, because asynchronous batch requests can be processed concurrently and in any order, cache hits are provided on a best-effort basis.

    The [1-hour cache](#1-hour-cache-duration) can help improve your cache hits. The most cost effective way of using it is the following:

    * Gather a set of message requests that have a shared prefix.
    * Send a batch request with just a single request that has this shared prefix and a 1-hour cache block. This will get written to the 1-hour cache.
    * As soon as this is complete, submit the rest of the requests. You will have to monitor the job to know when it completes.

    This is typically better than using the 5-minute cache simply because it’s common for batch requests to take between 5 minutes and 1 hour to complete. We’re considering ways to improve these cache hit rates and making this process more straightforward.
  </Accordion>

  <Accordion title="Why am I seeing the error `AttributeError: 'Beta' object has no attribute 'prompt_caching'` in Python?">
    This error typically appears when you have upgraded your SDK or you are using outdated code examples. Prompt caching is now generally available, so you no longer need the beta prefix. Instead of:

    <CodeGroup>
      ```Python Python
      python client.beta.prompt_caching.messages.create(...)
      ```
    </CodeGroup>

    Simply use:

    <CodeGroup>
      ```Python Python
      python client.messages.create(...)
      ```
    </CodeGroup>
  </Accordion>

  <Accordion title="Why am I seeing 'TypeError: Cannot read properties of undefined (reading 'messages')'?">
    This error typically appears when you have upgraded your SDK or you are using outdated code examples. Prompt caching is now generally available, so you no longer need the beta prefix. Instead of:

    ```typescript TypeScript
    client.beta.promptCaching.messages.create(...)
    ```

    Simply use:

    ```typescript
    client.messages.create(...)
    ```
  </Accordion>
</AccordionGroup>


# Streaming Messages

When creating a Message, you can set `"stream": true` to incrementally stream the response using [server-sent events](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent%5Fevents/Using%5Fserver-sent%5Fevents) (SSE).

## Streaming with SDKs

Our [Python](https://github.com/anthropics/anthropic-sdk-python) and [TypeScript](https://github.com/anthropics/anthropic-sdk-typescript) SDKs offer multiple ways of streaming. The Python SDK allows both sync and async streams. See the documentation in each SDK for details.

<CodeGroup>
  ```Python Python
  import anthropic

  client = anthropic.Anthropic()

  with client.messages.stream(
      max_tokens=1024,
      messages=[{"role": "user", "content": "Hello"}],
      model="claude-opus-4-20250514",
  ) as stream:
    for text in stream.text_stream:
        print(text, end="", flush=True)
  ```

  ```TypeScript TypeScript
  import Anthropic from '@anthropic-ai/sdk';

  const client = new Anthropic();

  await client.messages.stream({
      messages: [{role: 'user', content: "Hello"}],
      model: 'claude-opus-4-20250514',
      max_tokens: 1024,
  }).on('text', (text) => {
      console.log(text);
  });
  ```
</CodeGroup>

## Event types

Each server-sent event includes a named event type and associated JSON data. Each event will use an SSE event name (e.g. `event: message_stop`), and include the matching event `type` in its data.

Each stream uses the following event flow:

1. `message_start`: contains a `Message` object with empty `content`.
2. A series of content blocks, each of which have a `content_block_start`, one or more `content_block_delta` events, and a `content_block_stop` event. Each content block will have an `index` that corresponds to its index in the final Message `content` array.
3. One or more `message_delta` events, indicating top-level changes to the final `Message` object.
4. A final `message_stop` event.

<Warning>
  The token counts shown in the `usage` field of the `message_delta` event are *cumulative*.
</Warning>

### Ping events

Event streams may also include any number of `ping` events.

### Error events

We may occasionally send [errors](/en/api/errors) in the event stream. For example, during periods of high usage, you may receive an `overloaded_error`, which would normally correspond to an HTTP 529 in a non-streaming context:

```json Example error
event: error
data: {"type": "error", "error": {"type": "overloaded_error", "message": "Overloaded"}}
```

### Other events

In accordance with our [versioning policy](/en/api/versioning), we may add new event types, and your code should handle unknown event types gracefully.

## Content block delta types

Each `content_block_delta` event contains a `delta` of a type that updates the `content` block at a given `index`.

### Text delta

A `text` content block delta looks like:

```JSON Text delta
event: content_block_delta
data: {"type": "content_block_delta","index": 0,"delta": {"type": "text_delta", "text": "ello frien"}}
```

### Input JSON delta

The deltas for `tool_use` content blocks correspond to updates for the `input` field of the block. To support maximum granularity, the deltas are *partial JSON strings*, whereas the final `tool_use.input` is always an *object*.

You can accumulate the string deltas and parse the JSON once you receive a `content_block_stop` event, by using a library like [Pydantic](https://docs.pydantic.dev/latest/concepts/json/#partial-json-parsing) to do partial JSON parsing, or by using our [SDKs](https://docs.anthropic.com/en/api/client-sdks), which provide helpers to access parsed incremental values.

A `tool_use` content block delta looks like:

```JSON Input JSON delta
event: content_block_delta
data: {"type": "content_block_delta","index": 1,"delta": {"type": "input_json_delta","partial_json": "{\"location\": \"San Fra"}}}
```

Note: Our current models only support emitting one complete key and value property from `input` at a time. As such, when using tools, there may be delays between streaming events while the model is working. Once an `input` key and value are accumulated, we emit them as multiple `content_block_delta` events with chunked partial json so that the format can automatically support finer granularity in future models.

### Thinking delta

When using [extended thinking](/en/docs/build-with-claude/extended-thinking#streaming-thinking) with streaming enabled, you'll receive thinking content via `thinking_delta` events. These deltas correspond to the `thinking` field of the `thinking` content blocks.

For thinking content, a special `signature_delta` event is sent just before the `content_block_stop` event. This signature is used to verify the integrity of the thinking block.

A typical thinking delta looks like:

```JSON Thinking delta
event: content_block_delta
data: {"type": "content_block_delta", "index": 0, "delta": {"type": "thinking_delta", "thinking": "Let me solve this step by step:\n\n1. First break down 27 * 453"}}
```

The signature delta looks like:

```JSON Signature delta
event: content_block_delta
data: {"type": "content_block_delta", "index": 0, "delta": {"type": "signature_delta", "signature": "EqQBCgIYAhIM1gbcDa9GJwZA2b3hGgxBdjrkzLoky3dl1pkiMOYds..."}}
```

## Full HTTP Stream response

We strongly recommend that you use our [client SDKs](/en/api/client-sdks) when using streaming mode. However, if you are building a direct API integration, you will need to handle these events yourself.

A stream response is comprised of:

1. A `message_start` event
2. Potentially multiple content blocks, each of which contains:
   * A `content_block_start` event
   * Potentially multiple `content_block_delta` events
   * A `content_block_stop` event
3. A `message_delta` event
4. A `message_stop` event

There may be `ping` events dispersed throughout the response as well. See [Event types](#event-types) for more details on the format.

### Basic streaming request

<CodeGroup>
  ```bash Shell
  curl https://api.anthropic.com/v1/messages \
       --header "anthropic-version: 2023-06-01" \
       --header "content-type: application/json" \
       --header "x-api-key: $ANTHROPIC_API_KEY" \
       --data \
  '{
    "model": "claude-opus-4-20250514",
    "messages": [{"role": "user", "content": "Hello"}],
    "max_tokens": 256,
    "stream": true
  }'
  ```

  ```python Python
  import anthropic

  client = anthropic.Anthropic()

  with client.messages.stream(
      model="claude-opus-4-20250514",
      messages=[{"role": "user", "content": "Hello"}],
      max_tokens=256,
  ) as stream:
      for text in stream.text_stream:
          print(text, end="", flush=True)
  ```
</CodeGroup>

```json Response
event: message_start
data: {"type": "message_start", "message": {"id": "msg_1nZdL29xx5MUA1yADyHTEsnR8uuvGzszyY", "type": "message", "role": "assistant", "content": [], "model": "claude-opus-4-20250514", "stop_reason": null, "stop_sequence": null, "usage": {"input_tokens": 25, "output_tokens": 1}}}

event: content_block_start
data: {"type": "content_block_start", "index": 0, "content_block": {"type": "text", "text": ""}}

event: ping
data: {"type": "ping"}

event: content_block_delta
data: {"type": "content_block_delta", "index": 0, "delta": {"type": "text_delta", "text": "Hello"}}

event: content_block_delta
data: {"type": "content_block_delta", "index": 0, "delta": {"type": "text_delta", "text": "!"}}

event: content_block_stop
data: {"type": "content_block_stop", "index": 0}

event: message_delta
data: {"type": "message_delta", "delta": {"stop_reason": "end_turn", "stop_sequence":null}, "usage": {"output_tokens": 15}}

event: message_stop
data: {"type": "message_stop"}

```

### Streaming request with tool use

<Tip>
  Tool use now supports fine-grained streaming for parameter values as a beta feature. For more details, see [Fine-grained tool streaming](/en/docs/agents-and-tools/tool-use/fine-grained-tool-streaming).
</Tip>

In this request, we ask Claude to use a tool to tell us the weather.

<CodeGroup>
  ```bash Shell
    curl https://api.anthropic.com/v1/messages \
      -H "content-type: application/json" \
      -H "x-api-key: $ANTHROPIC_API_KEY" \
      -H "anthropic-version: 2023-06-01" \
      -d '{
        "model": "claude-opus-4-20250514",
        "max_tokens": 1024,
        "tools": [
          {
            "name": "get_weather",
            "description": "Get the current weather in a given location",
            "input_schema": {
              "type": "object",
              "properties": {
                "location": {
                  "type": "string",
                  "description": "The city and state, e.g. San Francisco, CA"
                }
              },
              "required": ["location"]
            }
          }
        ],
        "tool_choice": {"type": "any"},
        "messages": [
          {
            "role": "user",
            "content": "What is the weather like in San Francisco?"
          }
        ],
        "stream": true
      }'
  ```

  ```python Python
  import anthropic

  client = anthropic.Anthropic()

  tools = [
      {
          "name": "get_weather",
          "description": "Get the current weather in a given location",
          "input_schema": {
              "type": "object",
              "properties": {
                  "location": {
                      "type": "string",
                      "description": "The city and state, e.g. San Francisco, CA"
                  }
              },
              "required": ["location"]
          }
      }
  ]

  with client.messages.stream(
      model="claude-opus-4-20250514",
      max_tokens=1024,
      tools=tools,
      tool_choice={"type": "any"},
      messages=[
          {
              "role": "user",
              "content": "What is the weather like in San Francisco?"
          }
      ],
  ) as stream:
      for text in stream.text_stream:
          print(text, end="", flush=True)
  ```
</CodeGroup>

```json Response
event: message_start
data: {"type":"message_start","message":{"id":"msg_014p7gG3wDgGV9EUtLvnow3U","type":"message","role":"assistant","model":"claude-opus-4-20250514","stop_sequence":null,"usage":{"input_tokens":472,"output_tokens":2},"content":[],"stop_reason":null}}

event: content_block_start
data: {"type":"content_block_start","index":0,"content_block":{"type":"text","text":""}}

event: ping
data: {"type": "ping"}

event: content_block_delta
data: {"type":"content_block_delta","index":0,"delta":{"type":"text_delta","text":"Okay"}}

event: content_block_delta
data: {"type":"content_block_delta","index":0,"delta":{"type":"text_delta","text":","}}

event: content_block_delta
data: {"type":"content_block_delta","index":0,"delta":{"type":"text_delta","text":" let"}}

event: content_block_delta
data: {"type":"content_block_delta","index":0,"delta":{"type":"text_delta","text":"'s"}}

event: content_block_delta
data: {"type":"content_block_delta","index":0,"delta":{"type":"text_delta","text":" check"}}

event: content_block_delta
data: {"type":"content_block_delta","index":0,"delta":{"type":"text_delta","text":" the"}}

event: content_block_delta
data: {"type":"content_block_delta","index":0,"delta":{"type":"text_delta","text":" weather"}}

event: content_block_delta
data: {"type":"content_block_delta","index":0,"delta":{"type":"text_delta","text":" for"}}

event: content_block_delta
data: {"type":"content_block_delta","index":0,"delta":{"type":"text_delta","text":" San"}}

event: content_block_delta
data: {"type":"content_block_delta","index":0,"delta":{"type":"text_delta","text":" Francisco"}}

event: content_block_delta
data: {"type":"content_block_delta","index":0,"delta":{"type":"text_delta","text":","}}

event: content_block_delta
data: {"type":"content_block_delta","index":0,"delta":{"type":"text_delta","text":" CA"}}

event: content_block_delta
data: {"type":"content_block_delta","index":0,"delta":{"type":"text_delta","text":":"}}

event: content_block_stop
data: {"type":"content_block_stop","index":0}

event: content_block_start
data: {"type":"content_block_start","index":1,"content_block":{"type":"tool_use","id":"toolu_01T1x1fJ34qAmk2tNTrN7Up6","name":"get_weather","input":{}}}

event: content_block_delta
data: {"type":"content_block_delta","index":1,"delta":{"type":"input_json_delta","partial_json":""}}

event: content_block_delta
data: {"type":"content_block_delta","index":1,"delta":{"type":"input_json_delta","partial_json":"{\"location\":"}}

event: content_block_delta
data: {"type":"content_block_delta","index":1,"delta":{"type":"input_json_delta","partial_json":" \"San"}}

event: content_block_delta
data: {"type":"content_block_delta","index":1,"delta":{"type":"input_json_delta","partial_json":" Francisc"}}

event: content_block_delta
data: {"type":"content_block_delta","index":1,"delta":{"type":"input_json_delta","partial_json":"o,"}}

event: content_block_delta
data: {"type":"content_block_delta","index":1,"delta":{"type":"input_json_delta","partial_json":" CA\""}}

event: content_block_delta
data: {"type":"content_block_delta","index":1,"delta":{"type":"input_json_delta","partial_json":", "}}

event: content_block_delta
data: {"type":"content_block_delta","index":1,"delta":{"type":"input_json_delta","partial_json":"\"unit\": \"fah"}}

event: content_block_delta
data: {"type":"content_block_delta","index":1,"delta":{"type":"input_json_delta","partial_json":"renheit\"}"}}

event: content_block_stop
data: {"type":"content_block_stop","index":1}

event: message_delta
data: {"type":"message_delta","delta":{"stop_reason":"tool_use","stop_sequence":null},"usage":{"output_tokens":89}}

event: message_stop
data: {"type":"message_stop"}
```

### Streaming request with extended thinking

In this request, we enable extended thinking with streaming to see Claude's step-by-step reasoning.

<CodeGroup>
  ```bash Shell
  curl https://api.anthropic.com/v1/messages \
       --header "x-api-key: $ANTHROPIC_API_KEY" \
       --header "anthropic-version: 2023-06-01" \
       --header "content-type: application/json" \
       --data \
  '{
      "model": "claude-opus-4-20250514",
      "max_tokens": 20000,
      "stream": true,
      "thinking": {
          "type": "enabled",
          "budget_tokens": 16000
      },
      "messages": [
          {
              "role": "user",
              "content": "What is 27 * 453?"
          }
      ]
  }'
  ```

  ```python Python
  import anthropic

  client = anthropic.Anthropic()

  with client.messages.stream(
      model="claude-opus-4-20250514",
      max_tokens=20000,
      thinking={
          "type": "enabled",
          "budget_tokens": 16000
      },
      messages=[
          {
              "role": "user",
              "content": "What is 27 * 453?"
          }
      ],
  ) as stream:
      for event in stream:
          if event.type == "content_block_delta":
              if event.delta.type == "thinking_delta":
                  print(event.delta.thinking, end="", flush=True)
              elif event.delta.type == "text_delta":
                  print(event.delta.text, end="", flush=True)
  ```
</CodeGroup>

```json Response
event: message_start
data: {"type": "message_start", "message": {"id": "msg_01...", "type": "message", "role": "assistant", "content": [], "model": "claude-opus-4-20250514", "stop_reason": null, "stop_sequence": null}}

event: content_block_start
data: {"type": "content_block_start", "index": 0, "content_block": {"type": "thinking", "thinking": ""}}

event: content_block_delta
data: {"type": "content_block_delta", "index": 0, "delta": {"type": "thinking_delta", "thinking": "Let me solve this step by step:\n\n1. First break down 27 * 453"}}

event: content_block_delta
data: {"type": "content_block_delta", "index": 0, "delta": {"type": "thinking_delta", "thinking": "\n2. 453 = 400 + 50 + 3"}}

event: content_block_delta
data: {"type": "content_block_delta", "index": 0, "delta": {"type": "thinking_delta", "thinking": "\n3. 27 * 400 = 10,800"}}

event: content_block_delta
data: {"type": "content_block_delta", "index": 0, "delta": {"type": "thinking_delta", "thinking": "\n4. 27 * 50 = 1,350"}}

event: content_block_delta
data: {"type": "content_block_delta", "index": 0, "delta": {"type": "thinking_delta", "thinking": "\n5. 27 * 3 = 81"}}

event: content_block_delta
data: {"type": "content_block_delta", "index": 0, "delta": {"type": "thinking_delta", "thinking": "\n6. 10,800 + 1,350 + 81 = 12,231"}}

event: content_block_delta
data: {"type": "content_block_delta", "index": 0, "delta": {"type": "signature_delta", "signature": "EqQBCgIYAhIM1gbcDa9GJwZA2b3hGgxBdjrkzLoky3dl1pkiMOYds..."}}

event: content_block_stop
data: {"type": "content_block_stop", "index": 0}

event: content_block_start
data: {"type": "content_block_start", "index": 1, "content_block": {"type": "text", "text": ""}}

event: content_block_delta
data: {"type": "content_block_delta", "index": 1, "delta": {"type": "text_delta", "text": "27 * 453 = 12,231"}}

event: content_block_stop
data: {"type": "content_block_stop", "index": 1}

event: message_delta
data: {"type": "message_delta", "delta": {"stop_reason": "end_turn", "stop_sequence": null}}

event: message_stop
data: {"type": "message_stop"}
```

### Streaming request with web search tool use

In this request, we ask Claude to search the web for current weather information.

<CodeGroup>
  ```bash Shell
  curl https://api.anthropic.com/v1/messages \
       --header "x-api-key: $ANTHROPIC_API_KEY" \
       --header "anthropic-version: 2023-06-01" \
       --header "content-type: application/json" \
       --data \
  '{
      "model": "claude-opus-4-20250514",
      "max_tokens": 1024,
      "stream": true,
      "messages": [
          {
              "role": "user",
              "content": "What is the weather like in New York City today?"
          }
      ]
  }'
  ```

  ```python Python
  import anthropic

  client = anthropic.Anthropic()

  with client.messages.stream(
      model="claude-opus-4-20250514",
      max_tokens=1024,
      messages=[
          {
              "role": "user",
              "content": "What is the weather like in New York City today?"
          }
      ],
  ) as stream:
      for text in stream.text_stream:
          print(text, end="", flush=True)
  ```
</CodeGroup>

```json Response
event: message_start
data: {"type":"message_start","message":{"id":"msg_01G...","type":"message","role":"assistant","model":"claude-opus-4-20250514","content":[],"stop_reason":null,"stop_sequence":null,"usage":{"input_tokens":2679,"cache_creation_input_tokens":0,"cache_read_input_tokens":0,"output_tokens":3}}}

event: content_block_start
data: {"type":"content_block_start","index":0,"content_block":{"type":"text","text":""}}

event: content_block_delta
data: {"type":"content_block_delta","index":0,"delta":{"type":"text_delta","text":"I'll check"}}

event: content_block_delta
data: {"type":"content_block_delta","index":0,"delta":{"type":"text_delta","text":" the current weather in New York City for you"}}

event: ping
data: {"type": "ping"}

event: content_block_delta
data: {"type":"content_block_delta","index":0,"delta":{"type":"text_delta","text":"."}}

event: content_block_stop
data: {"type":"content_block_stop","index":0}

event: content_block_start
data: {"type":"content_block_start","index":1,"content_block":{"type":"server_tool_use","id":"srvtoolu_014hJH82Qum7Td6UV8gDXThB","name":"web_search","input":{}}}

event: content_block_delta
data: {"type":"content_block_delta","index":1,"delta":{"type":"input_json_delta","partial_json":""}}

event: content_block_delta
data: {"type":"content_block_delta","index":1,"delta":{"type":"input_json_delta","partial_json":"{\"query"}}

event: content_block_delta
data: {"type":"content_block_delta","index":1,"delta":{"type":"input_json_delta","partial_json":"\":"}}

event: content_block_delta
data: {"type":"content_block_delta","index":1,"delta":{"type":"input_json_delta","partial_json":" \"weather"}}

event: content_block_delta
data: {"type":"content_block_delta","index":1,"delta":{"type":"input_json_delta","partial_json":" NY"}}

event: content_block_delta
data: {"type":"content_block_delta","index":1,"delta":{"type":"input_json_delta","partial_json":"C to"}}

event: content_block_delta
data: {"type":"content_block_delta","index":1,"delta":{"type":"input_json_delta","partial_json":"day\"}"}}

event: content_block_stop
data: {"type":"content_block_stop","index":1 }

event: content_block_start
data: {"type":"content_block_start","index":2,"content_block":{"type":"web_search_tool_result","tool_use_id":"srvtoolu_014hJH82Qum7Td6UV8gDXThB","content":[{"type":"web_search_result","title":"Weather in New York City in May 2025 (New York) - detailed Weather Forecast for a month","url":"https://world-weather.info/forecast/usa/new_york/may-2025/","encrypted_content":"Ev0DCioIAxgCIiQ3NmU4ZmI4OC1k...","page_age":null},...]}}

event: content_block_stop
data: {"type":"content_block_stop","index":2}

event: content_block_start
data: {"type":"content_block_start","index":3,"content_block":{"type":"text","text":""}}

event: content_block_delta
data: {"type":"content_block_delta","index":3,"delta":{"type":"text_delta","text":"Here's the current weather information for New York"}}

event: content_block_delta
data: {"type":"content_block_delta","index":3,"delta":{"type":"text_delta","text":" City:\n\n# Weather"}}

event: content_block_delta
data: {"type":"content_block_delta","index":3,"delta":{"type":"text_delta","text":" in New York City"}}

event: content_block_delta
data: {"type":"content_block_delta","index":3,"delta":{"type":"text_delta","text":"\n\n"}}

...

event: content_block_stop
data: {"type":"content_block_stop","index":17}

event: message_delta
data: {"type":"message_delta","delta":{"stop_reason":"end_turn","stop_sequence":null},"usage":{"input_tokens":10682,"cache_creation_input_tokens":0,"cache_read_input_tokens":0,"output_tokens":510,"server_tool_use":{"web_search_requests":1}}}

event: message_stop
data: {"type":"message_stop"}
```

## Error recovery

When a streaming request is interrupted due to network issues, timeouts, or other errors, you can recover by resuming from where the stream was interrupted. This approach saves you from re-processing the entire response.

The basic recovery strategy involves:

1. **Capture the partial response**: Save all content that was successfully received before the error occurred
2. **Construct a continuation request**: Create a new API request that includes the partial assistant response as the beginning of a new assistant message
3. **Resume streaming**: Continue receiving the rest of the response from where it was interrupted

### Error recovery best practices

1. **Use SDK features**: Leverage the SDK's built-in message accumulation and error handling capabilities
2. **Handle content types**: Be aware that messages can contain multiple content blocks (`text`, `tool_use`, `thinking`). Tool use and extended thinking blocks cannot be partially recovered. You can resume streaming from the most recent text block.


# Batch processing

Batch processing is a powerful approach for handling large volumes of requests efficiently. Instead of processing requests one at a time with immediate responses, batch processing allows you to submit multiple requests together for asynchronous processing. This pattern is particularly useful when:

* You need to process large volumes of data
* Immediate responses are not required
* You want to optimize for cost efficiency
* You're running large-scale evaluations or analyses

The Message Batches API is our first implementation of this pattern.

***

# Message Batches API

The Message Batches API is a powerful, cost-effective way to asynchronously process large volumes of [Messages](/en/api/messages) requests. This approach is well-suited to tasks that do not require immediate responses, with most batches finishing in less than 1 hour while reducing costs by 50% and increasing throughput.

You can [explore the API reference directly](/en/api/creating-message-batches), in addition to this guide.

## How the Message Batches API works

When you send a request to the Message Batches API:

1. The system creates a new Message Batch with the provided Messages requests.
2. The batch is then processed asynchronously, with each request handled independently.
3. You can poll for the status of the batch and retrieve results when processing has ended for all requests.

This is especially useful for bulk operations that don't require immediate results, such as:

* Large-scale evaluations: Process thousands of test cases efficiently.
* Content moderation: Analyze large volumes of user-generated content asynchronously.
* Data analysis: Generate insights or summaries for large datasets.
* Bulk content generation: Create large amounts of text for various purposes (e.g., product descriptions, article summaries).

### Batch limitations

* A Message Batch is limited to either 100,000 Message requests or 256 MB in size, whichever is reached first.
* We process each batch as fast as possible, with most batches completing within 1 hour. You will be able to access batch results when all messages have completed or after 24 hours, whichever comes first. Batches will expire if processing does not complete within 24 hours.
* Batch results are available for 29 days after creation. After that, you may still view the Batch, but its results will no longer be available for download.
* Batches are scoped to a [Workspace](https://console.anthropic.com/settings/workspaces). You may view all batches—and their results—that were created within the Workspace that your API key belongs to.
* Rate limits apply to both Batches API HTTP requests and the number of requests within a batch waiting to be processed. See [Message Batches API rate limits](/en/api/rate-limits#message-batches-api). Additionally, we may slow down processing based on current demand and your request volume. In that case, you may see more requests expiring after 24 hours.
* Due to high throughput and concurrent processing, batches may go slightly over your Workspace's configured [spend limit](https://console.anthropic.com/settings/limits).

### Supported models

The Message Batches API currently supports:

* Claude Opus 4 (`claude-opus-4-20250514`)
* Claude Sonnet 4 (`claude-sonnet-4-20250514`)
* Claude Sonnet 3.7 (`claude-3-7-sonnet-20250219`)
* Claude Sonnet 3.5 (`claude-3-5-sonnet-20240620` and `claude-3-5-sonnet-20241022`)
* Claude Haiku 3.5 (`claude-3-5-haiku-20241022`)
* Claude Haiku 3 (`claude-3-haiku-20240307`)
* Claude Opus 3 (`claude-3-opus-20240229`)

### What can be batched

Any request that you can make to the Messages API can be included in a batch. This includes:

* Vision
* Tool use
* System messages
* Multi-turn conversations
* Any beta features

Since each request in the batch is processed independently, you can mix different types of requests within a single batch.

***

## Pricing

The Batches API offers significant cost savings. All usage is charged at 50% of the standard API prices.

| Model             | Batch input    | Batch output   |
| ----------------- | -------------- | -------------- |
| Claude Opus 4     | \$7.50 / MTok  | \$37.50 / MTok |
| Claude Sonnet 4   | \$1.50 / MTok  | \$7.50 / MTok  |
| Claude Sonnet 3.7 | \$1.50 / MTok  | \$7.50 / MTok  |
| Claude Sonnet 3.5 | \$1.50 / MTok  | \$7.50 / MTok  |
| Claude Haiku 3.5  | \$0.40 / MTok  | \$2 / MTok     |
| Claude Opus 3     | \$7.50 / MTok  | \$37.50 / MTok |
| Claude Haiku 3    | \$0.125 / MTok | \$0.625 / MTok |

***

## How to use the Message Batches API

### Prepare and create your batch

A Message Batch is composed of a list of requests to create a Message. The shape of an individual request is comprised of:

* A unique `custom_id` for identifying the Messages request
* A `params` object with the standard [Messages API](/en/api/messages) parameters

You can [create a batch](/en/api/creating-message-batches) by passing this list into the `requests` parameter:

<CodeGroup>
  ```bash Shell
  curl https://api.anthropic.com/v1/messages/batches \
       --header "x-api-key: $ANTHROPIC_API_KEY" \
       --header "anthropic-version: 2023-06-01" \
       --header "content-type: application/json" \
       --data \
  '{
      "requests": [
          {
              "custom_id": "my-first-request",
              "params": {
                  "model": "claude-opus-4-20250514",
                  "max_tokens": 1024,
                  "messages": [
                      {"role": "user", "content": "Hello, world"}
                  ]
              }
          },
          {
              "custom_id": "my-second-request",
              "params": {
                  "model": "claude-opus-4-20250514",
                  "max_tokens": 1024,
                  "messages": [
                      {"role": "user", "content": "Hi again, friend"}
                  ]
              }
          }
      ]
  }'
  ```

  ```python Python
  import anthropic
  from anthropic.types.message_create_params import MessageCreateParamsNonStreaming
  from anthropic.types.messages.batch_create_params import Request

  client = anthropic.Anthropic()

  message_batch = client.messages.batches.create(
      requests=[
          Request(
              custom_id="my-first-request",
              params=MessageCreateParamsNonStreaming(
                  model="claude-opus-4-20250514",
                  max_tokens=1024,
                  messages=[{
                      "role": "user",
                      "content": "Hello, world",
                  }]
              )
          ),
          Request(
              custom_id="my-second-request",
              params=MessageCreateParamsNonStreaming(
                  model="claude-opus-4-20250514",
                  max_tokens=1024,
                  messages=[{
                      "role": "user",
                      "content": "Hi again, friend",
                  }]
              )
          )
      ]
  )

  print(message_batch)
  ```

  ```TypeScript TypeScript
  import Anthropic from '@anthropic-ai/sdk';

  const anthropic = new Anthropic();

  const messageBatch = await anthropic.messages.batches.create({
    requests: [{
      custom_id: "my-first-request",
      params: {
        model: "claude-opus-4-20250514",
        max_tokens: 1024,
        messages: [
          {"role": "user", "content": "Hello, world"}
        ]
      }
    }, {
      custom_id: "my-second-request",
      params: {
        model: "claude-opus-4-20250514",
        max_tokens: 1024,
        messages: [
          {"role": "user", "content": "Hi again, friend"}
        ]
      }
    }]
  });

  console.log(messageBatch)
  ```

  ```java Java
  import com.anthropic.client.AnthropicClient;
  import com.anthropic.client.okhttp.AnthropicOkHttpClient;
  import com.anthropic.models.messages.Model;
  import com.anthropic.models.messages.batches.*;

  public class BatchExample {
      public static void main(String[] args) {
          AnthropicClient client = AnthropicOkHttpClient.fromEnv();

          BatchCreateParams params = BatchCreateParams.builder()
              .addRequest(BatchCreateParams.Request.builder()
                  .customId("my-first-request")
                  .params(BatchCreateParams.Request.Params.builder()
                      .model(Model.CLAUDE_OPUS_4_0)
                      .maxTokens(1024)
                      .addUserMessage("Hello, world")
                      .build())
                  .build())
              .addRequest(BatchCreateParams.Request.builder()
                  .customId("my-second-request")
                  .params(BatchCreateParams.Request.Params.builder()
                      .model(Model.CLAUDE_OPUS_4_0)
                      .maxTokens(1024)
                      .addUserMessage("Hi again, friend")
                      .build())
                  .build())
              .build();

          MessageBatch messageBatch = client.messages().batches().create(params);

          System.out.println(messageBatch);
      }
  }
  ```
</CodeGroup>

In this example, two separate requests are batched together for asynchronous processing. Each request has a unique `custom_id` and contains the standard parameters you'd use for a Messages API call.

<Tip>
  **Test your batch requests with the Messages API**

  Validation of the `params` object for each message request is performed asynchronously, and validation errors are returned when processing of the entire batch has ended. You can ensure that you are building your input correctly by verifying your request shape with the [Messages API](/en/api/messages) first.
</Tip>

When a batch is first created, the response will have a processing status of `in_progress`.

```JSON JSON
{
  "id": "msgbatch_01HkcTjaV5uDC8jWR4ZsDV8d",
  "type": "message_batch",
  "processing_status": "in_progress",
  "request_counts": {
    "processing": 2,
    "succeeded": 0,
    "errored": 0,
    "canceled": 0,
    "expired": 0
  },
  "ended_at": null,
  "created_at": "2024-09-24T18:37:24.100435Z",
  "expires_at": "2024-09-25T18:37:24.100435Z",
  "cancel_initiated_at": null,
  "results_url": null
}
```

### Tracking your batch

The Message Batch's `processing_status` field indicates the stage of processing the batch is in. It starts as `in_progress`, then updates to `ended` once all the requests in the batch have finished processing, and results are ready. You can monitor the state of your batch by visiting the [Console](https://console.anthropic.com/settings/workspaces/default/batches), or using the [retrieval endpoint](/en/api/retrieving-message-batches):

<CodeGroup>
  ```bash Shell
  curl https://api.anthropic.com/v1/messages/batches/msgbatch_01HkcTjaV5uDC8jWR4ZsDV8d \
   --header "x-api-key: $ANTHROPIC_API_KEY" \
   --header "anthropic-version: 2023-06-01" \
   | sed -E 's/.*"id":"([^"]+)".*"processing_status":"([^"]+)".*/Batch \1 processing status is \2/'
  ```

  ```python Python
  import anthropic

  client = anthropic.Anthropic()

  message_batch = client.messages.batches.retrieve(
      "msgbatch_01HkcTjaV5uDC8jWR4ZsDV8d",
  )
  print(f"Batch {message_batch.id} processing status is {message_batch.processing_status}")
  ```

  ```TypeScript TypeScript
  import Anthropic from '@anthropic-ai/sdk';

  const anthropic = new Anthropic();

  const messageBatch = await anthropic.messages.batches.retrieve(
    "msgbatch_01HkcTjaV5uDC8jWR4ZsDV8d",
  );
  console.log(`Batch ${messageBatch.id} processing status is ${messageBatch.processing_status}`);
  ```

  ```java Java
  import com.anthropic.client.AnthropicClient;
  import com.anthropic.client.okhttp.AnthropicOkHttpClient;
  import com.anthropic.models.messages.batches.*;

  public class BatchRetrieveExample {
      public static void main(String[] args) {
          AnthropicClient client = AnthropicOkHttpClient.fromEnv();

          MessageBatch messageBatch = client.messages().batches().retrieve(
                  BatchRetrieveParams.builder()
                          .messageBatchId("msgbatch_01HkcTjaV5uDC8jWR4ZsDV8d")
                          .build()
          );
          System.out.printf("Batch %s processing status is %s%n",
                  messageBatch.id(), messageBatch.processingStatus());
      }
  }
  ```
</CodeGroup>

You can [poll](/en/api/messages-batch-examples#polling-for-message-batch-completion) this endpoint to know when processing has ended.

### Retrieving batch results

Once batch processing has ended, each Messages request in the batch will have a result. There are 4 result types:

| Result Type | Description                                                                                                                                                                 |
| ----------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `succeeded` | Request was successful. Includes the message result.                                                                                                                        |
| `errored`   | Request encountered an error and a message was not created. Possible errors include invalid requests and internal server errors. You will not be billed for these requests. |
| `canceled`  | User canceled the batch before this request could be sent to the model. You will not be billed for these requests.                                                          |
| `expired`   | Batch reached its 24 hour expiration before this request could be sent to the model. You will not be billed for these requests.                                             |

You will see an overview of your results with the batch's `request_counts`, which shows how many requests reached each of these four states.

Results of the batch are available for download at the `results_url` property on the Message Batch, and if the organization permission allows, in the Console. Because of the potentially large size of the results, it's recommended to [stream results](/en/api/retrieving-message-batch-results) back rather than download them all at once.

<CodeGroup>
  ```bash Shell
  #!/bin/sh
  curl "https://api.anthropic.com/v1/messages/batches/msgbatch_01HkcTjaV5uDC8jWR4ZsDV8d" \
    --header "anthropic-version: 2023-06-01" \
    --header "x-api-key: $ANTHROPIC_API_KEY" \
    | grep -o '"results_url":[[:space:]]*"[^"]*"' \
    | cut -d'"' -f4 \
    | while read -r url; do
      curl -s "$url" \
        --header "anthropic-version: 2023-06-01" \
        --header "x-api-key: $ANTHROPIC_API_KEY" \
        | sed 's/}{/}\n{/g' \
        | while IFS= read -r line
      do
        result_type=$(echo "$line" | sed -n 's/.*"result":[[:space:]]*{[[:space:]]*"type":[[:space:]]*"\([^"]*\)".*/\1/p')
        custom_id=$(echo "$line" | sed -n 's/.*"custom_id":[[:space:]]*"\([^"]*\)".*/\1/p')
        error_type=$(echo "$line" | sed -n 's/.*"error":[[:space:]]*{[[:space:]]*"type":[[:space:]]*"\([^"]*\)".*/\1/p')

        case "$result_type" in
          "succeeded")
            echo "Success! $custom_id"
            ;;
          "errored")
            if [ "$error_type" = "invalid_request" ]; then
              # Request body must be fixed before re-sending request
              echo "Validation error: $custom_id"
            else
              # Request can be retried directly
              echo "Server error: $custom_id"
            fi
            ;;
          "expired")
            echo "Expired: $line"
            ;;
        esac
      done
    done

  ```

  ```python Python
  import anthropic

  client = anthropic.Anthropic()

  # Stream results file in memory-efficient chunks, processing one at a time
  for result in client.messages.batches.results(
      "msgbatch_01HkcTjaV5uDC8jWR4ZsDV8d",
  ):
      match result.result.type:
          case "succeeded":
              print(f"Success! {result.custom_id}")
          case "errored":
              if result.result.error.type == "invalid_request":
                  # Request body must be fixed before re-sending request
                  print(f"Validation error {result.custom_id}")
              else:
                  # Request can be retried directly
                  print(f"Server error {result.custom_id}")
          case "expired":
              print(f"Request expired {result.custom_id}")
  ```

  ```TypeScript TypeScript
  import Anthropic from '@anthropic-ai/sdk';

  const anthropic = new Anthropic();

  // Stream results file in memory-efficient chunks, processing one at a time
  for await (const result of await anthropic.messages.batches.results(
      "msgbatch_01HkcTjaV5uDC8jWR4ZsDV8d"
  )) {
    switch (result.result.type) {
      case 'succeeded':
        console.log(`Success! ${result.custom_id}`);
        break;
      case 'errored':
        if (result.result.error.type == "invalid_request") {
          // Request body must be fixed before re-sending request
          console.log(`Validation error: ${result.custom_id}`);
        } else {
          // Request can be retried directly
          console.log(`Server error: ${result.custom_id}`);
        }
        break;
      case 'expired':
        console.log(`Request expired: ${result.custom_id}`);
        break;
    }
  }
  ```

  ```java Java
  import com.anthropic.client.AnthropicClient;
  import com.anthropic.client.okhttp.AnthropicOkHttpClient;
  import com.anthropic.core.http.StreamResponse;
  import com.anthropic.models.messages.batches.MessageBatchIndividualResponse;
  import com.anthropic.models.messages.batches.BatchResultsParams;

  public class BatchResultsExample {

      public static void main(String[] args) {
          AnthropicClient client = AnthropicOkHttpClient.fromEnv();

          // Stream results file in memory-efficient chunks, processing one at a time
          try (StreamResponse<MessageBatchIndividualResponse> streamResponse = client.messages()
                  .batches()
                  .resultsStreaming(
                          BatchResultsParams.builder()
                                  .messageBatchId("msgbatch_01HkcTjaV5uDC8jWR4ZsDV8d")
                                  .build())) {

              streamResponse.stream().forEach(result -> {
                  if (result.result().isSucceeded()) {
                      System.out.println("Success! " + result.customId());
                  } else if (result.result().isErrored()) {
                      if (result.result().asErrored().error().error().isInvalidRequestError()) {
                          // Request body must be fixed before re-sending request
                          System.out.println("Validation error: " + result.customId());
                      } else {
                          // Request can be retried directly
                          System.out.println("Server error: " + result.customId());
                      }
                  } else if (result.result().isExpired()) {
                      System.out.println("Request expired: " + result.customId());
                  }
              });
          }
      }
  }
  ```
</CodeGroup>

The results will be in `.jsonl` format, where each line is a valid JSON object representing the result of a single request in the Message Batch. For each streamed result, you can do something different depending on its `custom_id` and result type. Here is an example set of results:

```JSON .jsonl file
{"custom_id":"my-second-request","result":{"type":"succeeded","message":{"id":"msg_014VwiXbi91y3JMjcpyGBHX5","type":"message","role":"assistant","model":"claude-opus-4-20250514","content":[{"type":"text","text":"Hello again! It's nice to see you. How can I assist you today? Is there anything specific you'd like to chat about or any questions you have?"}],"stop_reason":"end_turn","stop_sequence":null,"usage":{"input_tokens":11,"output_tokens":36}}}}
{"custom_id":"my-first-request","result":{"type":"succeeded","message":{"id":"msg_01FqfsLoHwgeFbguDgpz48m7","type":"message","role":"assistant","model":"claude-opus-4-20250514","content":[{"type":"text","text":"Hello! How can I assist you today? Feel free to ask me any questions or let me know if there's anything you'd like to chat about."}],"stop_reason":"end_turn","stop_sequence":null,"usage":{"input_tokens":10,"output_tokens":34}}}}
```

If your result has an error, its `result.error` will be set to our standard [error shape](https://docs.anthropic.com/en/api/errors#error-shapes).

<Tip>
  **Batch results may not match input order**

  Batch results can be returned in any order, and may not match the ordering of requests when the batch was created. In the above example, the result for the second batch request is returned before the first. To correctly match results with their corresponding requests, always use the `custom_id` field.
</Tip>

### Using prompt caching with Message Batches

The Message Batches API supports prompt caching, allowing you to potentially reduce costs and processing time for batch requests. The pricing discounts from prompt caching and Message Batches can stack, providing even greater cost savings when both features are used together. However, since batch requests are processed asynchronously and concurrently, cache hits are provided on a best-effort basis. Users typically experience cache hit rates ranging from 30% to 98%, depending on their traffic patterns.

To maximize the likelihood of cache hits in your batch requests:

1. Include identical `cache_control` blocks in every Message request within your batch
2. Maintain a steady stream of requests to prevent cache entries from expiring after their 5-minute lifetime
3. Structure your requests to share as much cached content as possible

Example of implementing prompt caching in a batch:

<CodeGroup>
  ```bash Shell
  curl https://api.anthropic.com/v1/messages/batches \
       --header "x-api-key: $ANTHROPIC_API_KEY" \
       --header "anthropic-version: 2023-06-01" \
       --header "content-type: application/json" \
       --data \
  '{
      "requests": [
          {
              "custom_id": "my-first-request",
              "params": {
                  "model": "claude-opus-4-20250514",
                  "max_tokens": 1024,
                  "system": [
                      {
                          "type": "text",
                          "text": "You are an AI assistant tasked with analyzing literary works. Your goal is to provide insightful commentary on themes, characters, and writing style.\n"
                      },
                      {
                          "type": "text",
                          "text": "<the entire contents of Pride and Prejudice>",
                          "cache_control": {"type": "ephemeral"}
                      }
                  ],
                  "messages": [
                      {"role": "user", "content": "Analyze the major themes in Pride and Prejudice."}
                  ]
              }
          },
          {
              "custom_id": "my-second-request",
              "params": {
                  "model": "claude-opus-4-20250514",
                  "max_tokens": 1024,
                  "system": [
                      {
                          "type": "text",
                          "text": "You are an AI assistant tasked with analyzing literary works. Your goal is to provide insightful commentary on themes, characters, and writing style.\n"
                      },
                      {
                          "type": "text",
                          "text": "<the entire contents of Pride and Prejudice>",
                          "cache_control": {"type": "ephemeral"}
                      }
                  ],
                  "messages": [
                      {"role": "user", "content": "Write a summary of Pride and Prejudice."}
                  ]
              }
          }
      ]
  }'
  ```

  ```python Python
  import anthropic
  from anthropic.types.message_create_params import MessageCreateParamsNonStreaming
  from anthropic.types.messages.batch_create_params import Request

  client = anthropic.Anthropic()

  message_batch = client.messages.batches.create(
      requests=[
          Request(
              custom_id="my-first-request",
              params=MessageCreateParamsNonStreaming(
                  model="claude-opus-4-20250514",
                  max_tokens=1024,
                  system=[
                      {
                          "type": "text",
                          "text": "You are an AI assistant tasked with analyzing literary works. Your goal is to provide insightful commentary on themes, characters, and writing style.\n"
                      },
                      {
                          "type": "text",
                          "text": "<the entire contents of Pride and Prejudice>",
                          "cache_control": {"type": "ephemeral"}
                      }
                  ],
                  messages=[{
                      "role": "user",
                      "content": "Analyze the major themes in Pride and Prejudice."
                  }]
              )
          ),
          Request(
              custom_id="my-second-request",
              params=MessageCreateParamsNonStreaming(
                  model="claude-opus-4-20250514",
                  max_tokens=1024,
                  system=[
                      {
                          "type": "text",
                          "text": "You are an AI assistant tasked with analyzing literary works. Your goal is to provide insightful commentary on themes, characters, and writing style.\n"
                      },
                      {
                          "type": "text",
                          "text": "<the entire contents of Pride and Prejudice>",
                          "cache_control": {"type": "ephemeral"}
                      }
                  ],
                  messages=[{
                      "role": "user",
                      "content": "Write a summary of Pride and Prejudice."
                  }]
              )
          )
      ]
  )
  ```

  ```typescript TypeScript
  import Anthropic from '@anthropic-ai/sdk';

  const anthropic = new Anthropic();

  const messageBatch = await anthropic.messages.batches.create({
    requests: [{
      custom_id: "my-first-request",
      params: {
        model: "claude-opus-4-20250514",
        max_tokens: 1024,
        system: [
          {
            type: "text",
            text: "You are an AI assistant tasked with analyzing literary works. Your goal is to provide insightful commentary on themes, characters, and writing style.\n"
          },
          {
            type: "text",
            text: "<the entire contents of Pride and Prejudice>",
            cache_control: {type: "ephemeral"}
          }
        ],
        messages: [
          {"role": "user", "content": "Analyze the major themes in Pride and Prejudice."}
        ]
      }
    }, {
      custom_id: "my-second-request",
      params: {
        model: "claude-opus-4-20250514",
        max_tokens: 1024,
        system: [
          {
            type: "text",
            text: "You are an AI assistant tasked with analyzing literary works. Your goal is to provide insightful commentary on themes, characters, and writing style.\n"
          },
          {
            type: "text",
            text: "<the entire contents of Pride and Prejudice>",
            cache_control: {type: "ephemeral"}
          }
        ],
        messages: [
          {"role": "user", "content": "Write a summary of Pride and Prejudice."}
        ]
      }
    }]
  });
  ```

  ```java Java
  import java.util.List;

  import com.anthropic.client.AnthropicClient;
  import com.anthropic.client.okhttp.AnthropicOkHttpClient;
  import com.anthropic.models.messages.CacheControlEphemeral;
  import com.anthropic.models.messages.Model;
  import com.anthropic.models.messages.TextBlockParam;
  import com.anthropic.models.messages.batches.*;

  public class BatchExample {

      public static void main(String[] args) {
          AnthropicClient client = AnthropicOkHttpClient.fromEnv();

          BatchCreateParams createParams = BatchCreateParams.builder()
                  .addRequest(BatchCreateParams.Request.builder()
                          .customId("my-first-request")
                          .params(BatchCreateParams.Request.Params.builder()
                                  .model(Model.CLAUDE_OPUS_4_0)
                                  .maxTokens(1024)
                                  .systemOfTextBlockParams(List.of(
                                          TextBlockParam.builder()
                                                  .text("You are an AI assistant tasked with analyzing literary works. Your goal is to provide insightful commentary on themes, characters, and writing style.\n")
                                                  .build(),
                                          TextBlockParam.builder()
                                                  .text("<the entire contents of Pride and Prejudice>")
                                                  .cacheControl(CacheControlEphemeral.builder().build())
                                                  .build()
                                  ))
                                  .addUserMessage("Analyze the major themes in Pride and Prejudice.")
                                  .build())
                          .build())
                  .addRequest(BatchCreateParams.Request.builder()
                          .customId("my-second-request")
                          .params(BatchCreateParams.Request.Params.builder()
                                  .model(Model.CLAUDE_OPUS_4_0)
                                  .maxTokens(1024)
                                  .systemOfTextBlockParams(List.of(
                                          TextBlockParam.builder()
                                                  .text("You are an AI assistant tasked with analyzing literary works. Your goal is to provide insightful commentary on themes, characters, and writing style.\n")
                                                  .build(),
                                          TextBlockParam.builder()
                                                  .text("<the entire contents of Pride and Prejudice>")
                                                  .cacheControl(CacheControlEphemeral.builder().build())
                                                  .build()
                                  ))
                                  .addUserMessage("Write a summary of Pride and Prejudice.")
                                  .build())
                          .build())
                  .build();

          MessageBatch messageBatch = client.messages().batches().create(createParams);
      }
  }
  ```
</CodeGroup>

In this example, both requests in the batch include identical system messages and the full text of Pride and Prejudice marked with `cache_control` to increase the likelihood of cache hits.

### Best practices for effective batching

To get the most out of the Batches API:

* Monitor batch processing status regularly and implement appropriate retry logic for failed requests.
* Use meaningful `custom_id` values to easily match results with requests, since order is not guaranteed.
* Consider breaking very large datasets into multiple batches for better manageability.
* Dry run a single request shape with the Messages API to avoid validation errors.

### Troubleshooting common issues

If experiencing unexpected behavior:

* Verify that the total batch request size doesn't exceed 256 MB. If the request size is too large, you may get a 413 `request_too_large` error.
* Check that you're using [supported models](#supported-models) for all requests in the batch.
* Ensure each request in the batch has a unique `custom_id`.
* Ensure that it has been less than 29 days since batch `created_at` (not processing `ended_at`) time. If over 29 days have passed, results will no longer be viewable.
* Confirm that the batch has not been canceled.

Note that the failure of one request in a batch does not affect the processing of other requests.

***

## Batch storage and privacy

* **Workspace isolation**: Batches are isolated within the Workspace they are created in. They can only be accessed by API keys associated with that Workspace, or users with permission to view Workspace batches in the Console.

* **Result availability**: Batch results are available for 29 days after the batch is created, allowing ample time for retrieval and processing.

***

## FAQ

<AccordionGroup>
  <Accordion title="How long does it take for a batch to process?">
    Batches may take up to 24 hours for processing, but many will finish sooner. Actual processing time depends on the size of the batch, current demand, and your request volume. It is possible for a batch to expire and not complete within 24 hours.
  </Accordion>

  <Accordion title="Is the Batches API available for all models?">
    See [above](#supported-models) for the list of supported models.
  </Accordion>

  <Accordion title="Can I use the Message Batches API with other API features?">
    Yes, the Message Batches API supports all features available in the Messages API, including beta features. However, streaming is not supported for batch requests.
  </Accordion>

  <Accordion title="How does the Message Batches API affect pricing?">
    The Message Batches API offers a 50% discount on all usage compared to standard API prices. This applies to input tokens, output tokens, and any special tokens. For more on pricing, visit our [pricing page](https://www.anthropic.com/pricing#anthropic-api).
  </Accordion>

  <Accordion title="Can I update a batch after it's been submitted?">
    No, once a batch has been submitted, it cannot be modified. If you need to make changes, you should cancel the current batch and submit a new one. Note that cancellation may not take immediate effect.
  </Accordion>

  <Accordion title="Are there Message Batches API rate limits and do they interact with the Messages API rate limits?">
    The Message Batches API has HTTP requests-based rate limits in addition to limits on the number of requests in need of processing. See [Message Batches API rate limits](/en/api/rate-limits#message-batches-api). Usage of the Batches API does not affect rate limits in the Messages API.
  </Accordion>

  <Accordion title="How do I handle errors in my batch requests?">
    When you retrieve the results, each request will have a `result` field indicating whether it `succeeded`, `errored`, was `canceled`, or `expired`. For `errored` results, additional error information will be provided. View the error response object in the [API reference](/en/api/creating-message-batches).
  </Accordion>

  <Accordion title="How does the Message Batches API handle privacy and data separation?">
    The Message Batches API is designed with strong privacy and data separation measures:

    1. Batches and their results are isolated within the Workspace in which they were created. This means they can only be accessed by API keys from that same Workspace.
    2. Each request within a batch is processed independently, with no data leakage between requests.
    3. Results are only available for a limited time (29 days), and follow our [data retention policy](https://support.anthropic.com/en/articles/7996866-how-long-do-you-store-personal-data).
    4. Downloading batch results in the Console can be disabled on the organization-level or on a per-workspace basis.
  </Accordion>

  <Accordion title="Can I use prompt caching in the Message Batches API?">
    Yes, it is possible to use prompt caching with Message Batches API. However, because asynchronous batch requests can be processed concurrently and in any order, cache hits are provided on a best-effort basis.
  </Accordion>
</AccordionGroup>


# Citations

Claude is capable of providing detailed citations when answering questions about documents, helping you track and verify information sources in responses.

The citations feature is currently available on Claude Opus 4, Claude Sonnet 4, Claude Sonnet 3.7, Claude Sonnet 3.5 (new) and Haiku 3.5.

<Warning>
  *Citations with Claude Sonnet 3.7*

  Claude Sonnet 3.7 may be less likely to make citations compared to other Claude models without more explicit instructions from the user. When using citations with Claude Sonnet 3.7, we recommend including additional instructions in the `user` turn, like `"Use citations to back up your answer."` for example.

  We've also observed that when the model is asked to structure its response, it is unlikely to use citations unless explicitly told to use citations within that format. For example, if the model is asked to use `<result>` tags in its response, you should add something like `"Always use citations in your answer, even within <result> tags."`
</Warning>

<Tip>
  Please share your feedback and suggestions about the citations feature using this [form](https://forms.gle/9n9hSrKnKe3rpowH9).
</Tip>

Here's an example of how to use citations with the Messages API:

<CodeGroup>
  ```bash Shell
  curl https://api.anthropic.com/v1/messages \
    -H "content-type: application/json" \
    -H "x-api-key: $ANTHROPIC_API_KEY" \
    -H "anthropic-version: 2023-06-01" \
    -d '{
      "model": "claude-opus-4-20250514",
      "max_tokens": 1024,
      "messages": [
        {
          "role": "user",
          "content": [
            {
              "type": "document",
              "source": {
                "type": "text",
                "media_type": "text/plain",
                "data": "The grass is green. The sky is blue."
              },
              "title": "My Document",
              "context": "This is a trustworthy document.",
              "citations": {"enabled": true}
            },
            {
              "type": "text",
              "text": "What color is the grass and sky?"
            }
          ]
        }
      ]
    }'
  ```

  ```python Python
  import anthropic

  client = anthropic.Anthropic()

  response = client.messages.create(
      model="claude-opus-4-20250514",
      max_tokens=1024,
      messages=[
          {
              "role": "user",
              "content": [
                  {
                      "type": "document",
                      "source": {
                          "type": "text",
                          "media_type": "text/plain",
                          "data": "The grass is green. The sky is blue."
                      },
                      "title": "My Document",
                      "context": "This is a trustworthy document.",
                      "citations": {"enabled": True}
                  },
                  {
                      "type": "text",
                      "text": "What color is the grass and sky?"
                  }
              ]
          }
      ]
  )
  print(response)
  ```

  ```java Java
  import java.util.List;

  import com.anthropic.client.AnthropicClient;
  import com.anthropic.client.okhttp.AnthropicOkHttpClient;
  import com.anthropic.models.messages.*;

  public class DocumentExample {

      public static void main(String[] args) {
          AnthropicClient client = AnthropicOkHttpClient.fromEnv();

          PlainTextSource source = PlainTextSource.builder()
                  .data("The grass is green. The sky is blue.")
                  .build();

          DocumentBlockParam documentParam = DocumentBlockParam.builder()
                  .source(source)
                  .title("My Document")
                  .context("This is a trustworthy document.")
                  .citations(CitationsConfigParam.builder().enabled(true).build())
                  .build();
          
          TextBlockParam textBlockParam = TextBlockParam.builder()
                  .text("What color is the grass and sky?")
                  .build();

          MessageCreateParams params = MessageCreateParams.builder()
                  .model(Model.CLAUDE_SONNET_4_20250514)
                  .maxTokens(1024)
                  .addUserMessageOfBlockParams(List.of(ContentBlockParam.ofDocument(documentParam), ContentBlockParam.ofText(textBlockParam)))
                  .build();

          Message message = client.messages().create(params);
          System.out.println(message);
      }
  }
  ```
</CodeGroup>

<Tip>
  **Comparison with prompt-based approaches**

  In comparison with prompt-based citations solutions, the citations feature has the following advantages:

  * **Cost savings:** If your prompt-based approach asks Claude to output direct quotes, you may see cost savings due to the fact that `cited_text` does not count towards your output tokens.
  * **Better citation reliability:** Because we parse citations into the respective response formats mentioned above and extract `cited_text`, citations are guaranteed to contain valid pointers to the provided documents.
  * **Improved citation quality:** In our evals, we found the citations feature to be significantly more likely to cite the most relevant quotes from documents as compared to purely prompt-based approaches.
</Tip>

***

## How citations work

Integrate citations with Claude in these steps:

<Steps>
  <Step title="Provide document(s) and enable citations">
    * Include documents in any of the supported formats: [PDFs](#pdf-documents), [plain text](#plain-text-documents), or [custom content](#custom-content-documents) documents
    * Set `citations.enabled=true` on each of your documents. Currently, citations must be enabled on all or none of the documents within a request.
    * Note that only text citations are currently supported and image citations are not yet possible.
  </Step>

  <Step title="Documents get processed">
    * Document contents are "chunked" in order to define the minimum granularity of possible citations. For example, sentence chunking would allow Claude to cite a single sentence or chain together multiple consecutive sentences to cite a paragraph (or longer)!
      * **For PDFs:** Text is extracted as described in [PDF Support](/en/docs/build-with-claude/pdf-support) and content is chunked into sentences. Citing images from PDFs is not currently supported.
      * **For plain text documents:** Content is chunked into sentences that can be cited from.
      * **For custom content documents:** Your provided content blocks are used as-is and no further chunking is done.
  </Step>

  <Step title="Claude provides cited response">
    * Responses may now include multiple text blocks where each text block can contain a claim that Claude is making and a list of citations that support the claim.
    * Citations reference specific locations in source documents. The format of these citations are dependent on the type of document being cited from.
      * **For PDFs:** citations will include the page number range (1-indexed).
      * **For plain text documents:** Citations will include the character index range (0-indexed).
      * **For custom content documents:** Citations will include the content block index range (0-indexed) corresponding to the original content list provided.
    * Document indices are provided to indicate the reference source and are 0-indexed according to the list of all documents in your original request.
  </Step>
</Steps>

<Tip>
  **Automatic chunking vs custom content**

  By default, plain text and PDF documents are automatically chunked into sentences. If you need more control over citation granularity (e.g., for bullet points or transcripts), use custom content documents instead. See [Document Types](#document-types) for more details.

  For example, if you want Claude to be able to cite specific sentences from your RAG chunks, you should put each RAG chunk into a plain text document. Otherwise, if you do not want any further chunking to be done, or if you want to customize any additional chunking, you can put RAG chunks into custom content document(s).
</Tip>

### Citable vs non-citable content

* Text found within a document's `source` content can be cited from.
* `title` and `context` are optional fields that will be passed to the model but not used towards cited content.
* `title` is limited in length so you may find the `context` field to be useful in storing any document metadata as text or stringified json.

### Citation indices

* Document indices are 0-indexed from the list of all document content blocks in the request (spanning across all messages).
* Character indices are 0-indexed with exclusive end indices.
* Page numbers are 1-indexed with exclusive end page numbers.
* Content block indices are 0-indexed with exclusive end indices from the `content` list provided in the custom content document.

### Token costs

* Enabling citations incurs a slight increase in input tokens due to system prompt additions and document chunking.
* However, the citations feature is very efficient with output tokens. Under the hood, the model is outputting citations in a standardized format that are then parsed into cited text and document location indices. The `cited_text` field is provided for convenience and does not count towards output tokens.
* When passed back in subsequent conversation turns, `cited_text` is also not counted towards input tokens.

### Feature compatibility

Citations works in conjunction with other API features including [prompt caching](/en/docs/build-with-claude/prompt-caching), [token counting](/en/docs/build-with-claude/token-counting) and [batch processing](/en/docs/build-with-claude/batch-processing).

#### Using Prompt Caching with Citations

Citations and prompt caching can be used together effectively.

The citation blocks generated in responses cannot be cached directly, but the source documents they reference can be cached. To optimize performance, apply `cache_control` to your top-level document content blocks.

<CodeGroup>
  ```python Python
  import anthropic

  client = anthropic.Anthropic()

  # Long document content (e.g., technical documentation)
  long_document = "This is a very long document with thousands of words..." + " ... " * 1000  # Minimum cacheable length

  response = client.messages.create(
      model="claude-opus-4-20250514",
      max_tokens=1024,
      messages=[
          {
              "role": "user",
              "content": [
                  {
                      "type": "document",
                      "source": {
                          "type": "text",
                          "media_type": "text/plain",
                          "data": long_document
                      },
                      "citations": {"enabled": True},
                      "cache_control": {"type": "ephemeral"}  # Cache the document content
                  },
                  {
                      "type": "text",
                      "text": "What does this document say about API features?"
                  }
              ]
          }
      ]
  )
  ```

  ```typescript TypeScript
  import Anthropic from '@anthropic-ai/sdk';

  const client = new Anthropic();

  // Long document content (e.g., technical documentation)
  const longDocument = "This is a very long document with thousands of words..." + " ... ".repeat(1000);  // Minimum cacheable length

  const response = await client.messages.create({
    model: "claude-opus-4-20250514",
    max_tokens: 1024,
    messages: [
      {
        role: "user",
        content: [
          {
            type: "document",
            source: {
              type: "text",
              media_type: "text/plain",
              data: longDocument
            },
            citations: { enabled: true },
            cache_control: { type: "ephemeral" }  // Cache the document content
          },
          {
            type: "text",
            text: "What does this document say about API features?"
          }
        ]
      }
    ]
  });
  ```

  ```bash Shell
  curl https://api.anthropic.com/v1/messages \
       --header "x-api-key: $ANTHROPIC_API_KEY" \
       --header "anthropic-version: 2023-06-01" \
       --header "content-type: application/json" \
       --data '{
      "model": "claude-opus-4-20250514",
      "max_tokens": 1024,
      "messages": [
          {
              "role": "user",
              "content": [
                  {
                      "type": "document",
                      "source": {
                          "type": "text",
                          "media_type": "text/plain",
                          "data": "This is a very long document with thousands of words..."
                      },
                      "citations": {"enabled": true},
                      "cache_control": {"type": "ephemeral"}
                  },
                  {
                      "type": "text",
                      "text": "What does this document say about API features?"
                  }
              ]
          }
      ]
  }'
  ```
</CodeGroup>

In this example:

* The document content is cached using `cache_control` on the document block
* Citations are enabled on the document
* Claude can generate responses with citations while benefiting from cached document content
* Subsequent requests using the same document will benefit from the cached content

## Document Types

### Choosing a document type

We support three document types for citations. Documents can be provided directly in the message (base64, text, or URL) or uploaded via the [Files API](/en/docs/build-with-claude/files) and referenced by `file_id`:

| Type           | Best for                                                        | Chunking               | Citation format               |
| :------------- | :-------------------------------------------------------------- | :--------------------- | :---------------------------- |
| Plain text     | Simple text documents, prose                                    | Sentence               | Character indices (0-indexed) |
| PDF            | PDF files with text content                                     | Sentence               | Page numbers (1-indexed)      |
| Custom content | Lists, transcripts, special formatting, more granular citations | No additional chunking | Block indices (0-indexed)     |

<Note>
  .csv, .xlsx, .docx, .md, and .txt files are not supported as document blocks. Convert these to plain text and include directly in message content. See [Working with other file formats](/en/docs/build-with-claude/files#working-with-other-file-formats).
</Note>

### Plain text documents

Plain text documents are automatically chunked into sentences. You can provide them inline or by reference with their `file_id`:

<Tabs>
  <Tab title="Inline text">
    ```python
    {
        "type": "document",
        "source": {
            "type": "text",
            "media_type": "text/plain",
            "data": "Plain text content..."
        },
        "title": "Document Title", # optional
        "context": "Context about the document that will not be cited from", # optional
        "citations": {"enabled": True}
    }
    ```
  </Tab>

  <Tab title="Files API">
    ```python
    {
        "type": "document",
        "source": {
            "type": "file",
            "file_id": "file_011CNvxoj286tYUAZFiZMf1U"
        },
        "title": "Document Title", # optional
        "context": "Context about the document that will not be cited from", # optional
        "citations": {"enabled": True}
    }
    ```
  </Tab>
</Tabs>

<Accordion title="Example plain text citation">
  ```python
  {
      "type": "char_location",
      "cited_text": "The exact text being cited", # not counted towards output tokens
      "document_index": 0,
      "document_title": "Document Title",
      "start_char_index": 0,    # 0-indexed
      "end_char_index": 50      # exclusive
  }
  ```
</Accordion>

### PDF documents

PDF documents can be provided as base64-encoded data or by `file_id`. PDF text is extracted and chunked into sentences. As image citations are not yet supported, PDFs that are scans of documents and do not contain extractable text will not be citable.

<Tabs>
  <Tab title="Base64">
    ```python
    {
        "type": "document",
        "source": {
            "type": "base64",
            "media_type": "application/pdf",
            "data": base64_encoded_pdf_data
        },
        "title": "Document Title", # optional
        "context": "Context about the document that will not be cited from", # optional
        "citations": {"enabled": True}
    }
    ```
  </Tab>

  <Tab title="Files API">
    ```python
    {
        "type": "document",
        "source": {
            "type": "file",
            "file_id": "file_011CNvxoj286tYUAZFiZMf1U"
        },
        "title": "Document Title", # optional
        "context": "Context about the document that will not be cited from", # optional
        "citations": {"enabled": True}
    }
    ```
  </Tab>
</Tabs>

<Accordion title="Example PDF citation">
  ```python
  {
      "type": "page_location",
      "cited_text": "The exact text being cited", # not counted towards output tokens
      "document_index": 0,     
      "document_title": "Document Title", 
      "start_page_number": 1,  # 1-indexed
      "end_page_number": 2     # exclusive
  }
  ```
</Accordion>

### Custom content documents

Custom content documents give you control over citation granularity. No additional chunking is done and chunks are provided to the model according to the content blocks provided.

```python
{
    "type": "document",
    "source": {
        "type": "content",
        "content": [
            {"type": "text", "text": "First chunk"},
            {"type": "text", "text": "Second chunk"}
        ]
    },
    "title": "Document Title", # optional
    "context": "Context about the document that will not be cited from", # optional
    "citations": {"enabled": True}
}
```

<Accordion title="Example citation">
  ```python
  {
      "type": "content_block_location",
      "cited_text": "The exact text being cited", # not counted towards output tokens
      "document_index": 0,
      "document_title": "Document Title",
      "start_block_index": 0,   # 0-indexed
      "end_block_index": 1      # exclusive
  }
  ```
</Accordion>

***

## Response Structure

When citations are enabled, responses include multiple text blocks with citations:

```python
{
    "content": [
        {
            "type": "text",
            "text": "According to the document, "
        },
        {
            "type": "text",
            "text": "the grass is green",
            "citations": [{
                "type": "char_location",
                "cited_text": "The grass is green.",
                "document_index": 0,
                "document_title": "Example Document",
                "start_char_index": 0,
                "end_char_index": 20
            }]
        },
        {
            "type": "text",
            "text": " and "
        },
        {
            "type": "text",
            "text": "the sky is blue",
            "citations": [{
                "type": "char_location",
                "cited_text": "The sky is blue.",
                "document_index": 0,
                "document_title": "Example Document",
                "start_char_index": 20,
                "end_char_index": 36
            }]
        },
        {
            "type": "text",
            "text": ". Information from page 5 states that ",
        },
        {
            "type": "text",
            "text": "water is essential",
            "citations": [{
                "type": "page_location",
                "cited_text": "Water is essential for life.",
                "document_index": 1,
                "document_title": "PDF Document",
                "start_page_number": 5,
                "end_page_number": 6
            }]
        },
        {
            "type": "text",
            "text": ". The custom document mentions ",
        },
        {
            "type": "text",
            "text": "important findings",
            "citations": [{
                "type": "content_block_location",
                "cited_text": "These are important findings.",
                "document_index": 2,
                "document_title": "Custom Content Document",
                "start_block_index": 0,
                "end_block_index": 1
            }]
        }
    ]
}
```

### Streaming Support

For streaming responses, we've added a `citations_delta` type that contains a single citation to be added to the `citations` list on the current `text` content block.

<AccordionGroup>
  <Accordion title="Example streaming events">
    ```python
    event: message_start
    data: {"type": "message_start", ...}

    event: content_block_start
    data: {"type": "content_block_start", "index": 0, ...}

    event: content_block_delta
    data: {"type": "content_block_delta", "index": 0, 
           "delta": {"type": "text_delta", "text": "According to..."}}

    event: content_block_delta
    data: {"type": "content_block_delta", "index": 0,
           "delta": {"type": "citations_delta", 
                     "citation": {
                         "type": "char_location",
                         "cited_text": "...",
                         "document_index": 0,
                         ...
                     }}}

    event: content_block_stop
    data: {"type": "content_block_stop", "index": 0}

    event: message_stop
    data: {"type": "message_stop"}
    ```
  </Accordion>
</AccordionGroup>


# Token counting

Token counting enables you to determine the number of tokens in a message before sending it to Claude, helping you make informed decisions about your prompts and usage. With token counting, you can

* Proactively manage rate limits and costs
* Make smart model routing decisions
* Optimize prompts to be a specific length

***

## How to count message tokens

The [token counting](/en/api/messages-count-tokens) endpoint accepts the same structured list of inputs for creating a message, including support for system prompts, [tools](/en/docs/agents-and-tools/tool-use/overview), [images](/en/docs/build-with-claude/vision), and [PDFs](/en/docs/build-with-claude/pdf-support). The response contains the total number of input tokens.

<Note>
  The token count should be considered an **estimate**. In some cases, the actual number of input tokens used when creating a message may differ by a small amount.
</Note>

### Supported models

The token counting endpoint supports the following models:

* Claude Opus 4
* Claude Sonnet 4
* Claude Sonnet 3.7
* Claude Sonnet 3.5
* Claude Haiku 3.5
* Claude Haiku 3
* Claude Opus 3

### Count tokens in basic messages

<CodeGroup>
  ```python Python
  import anthropic

  client = anthropic.Anthropic()

  response = client.messages.count_tokens(
      model="claude-opus-4-20250514",
      system="You are a scientist",
      messages=[{
          "role": "user",
          "content": "Hello, Claude"
      }],
  )

  print(response.json())
  ```

  ```typescript TypeScript
  import Anthropic from '@anthropic-ai/sdk';

  const client = new Anthropic();

  const response = await client.messages.countTokens({
    model: 'claude-opus-4-20250514',
    system: 'You are a scientist',
    messages: [{
      role: 'user',
      content: 'Hello, Claude'
    }]
  });

  console.log(response);
  ```

  ```bash Shell
  curl https://api.anthropic.com/v1/messages/count_tokens \
      --header "x-api-key: $ANTHROPIC_API_KEY" \
      --header "content-type: application/json" \
      --header "anthropic-version: 2023-06-01" \
      --data '{
        "model": "claude-opus-4-20250514",
        "system": "You are a scientist",
        "messages": [{
          "role": "user",
          "content": "Hello, Claude"
        }]
      }'
  ```

  ```java Java
  import com.anthropic.client.AnthropicClient;
  import com.anthropic.client.okhttp.AnthropicOkHttpClient;
  import com.anthropic.models.messages.MessageCountTokensParams;
  import com.anthropic.models.messages.MessageTokensCount;
  import com.anthropic.models.messages.Model;

  public class CountTokensExample {

      public static void main(String[] args) {
          AnthropicClient client = AnthropicOkHttpClient.fromEnv();

          MessageCountTokensParams params = MessageCountTokensParams.builder()
                  .model(Model.CLAUDE_SONNET_4_20250514)
                  .system("You are a scientist")
                  .addUserMessage("Hello, Claude")
                  .build();

          MessageTokensCount count = client.messages().countTokens(params);
          System.out.println(count);
      }
  }
  ```
</CodeGroup>

```JSON JSON
{ "input_tokens": 14 }
```

### Count tokens in messages with tools

<Note>
  [Server tool](/en/docs/agents-and-tools/tool-use/overview#server-tools) token counts only apply to the first sampling call.
</Note>

<CodeGroup>
  ```python Python
  import anthropic

  client = anthropic.Anthropic()

  response = client.messages.count_tokens(
      model="claude-opus-4-20250514",
      tools=[
          {
              "name": "get_weather",
              "description": "Get the current weather in a given location",
              "input_schema": {
                  "type": "object",
                  "properties": {
                      "location": {
                          "type": "string",
                          "description": "The city and state, e.g. San Francisco, CA",
                      }
                  },
                  "required": ["location"],
              },
          }
      ],
      messages=[{"role": "user", "content": "What's the weather like in San Francisco?"}]
  )

  print(response.json())
  ```

  ```typescript TypeScript
  import Anthropic from '@anthropic-ai/sdk';

  const client = new Anthropic();

  const response = await client.messages.countTokens({
    model: 'claude-opus-4-20250514',
    tools: [
      {
        name: "get_weather",
        description: "Get the current weather in a given location",
        input_schema: {
          type: "object",
          properties: {
            location: {
              type: "string",
              description: "The city and state, e.g. San Francisco, CA",
            }
          },
          required: ["location"],
        }
      }
    ],
    messages: [{ role: "user", content: "What's the weather like in San Francisco?" }]
  });

  console.log(response);
  ```

  ```bash Shell
  curl https://api.anthropic.com/v1/messages/count_tokens \
      --header "x-api-key: $ANTHROPIC_API_KEY" \
      --header "content-type: application/json" \
      --header "anthropic-version: 2023-06-01" \
      --data '{
        "model": "claude-opus-4-20250514",
        "tools": [
          {
            "name": "get_weather",
            "description": "Get the current weather in a given location",
            "input_schema": {
              "type": "object",
              "properties": {
                "location": {
                  "type": "string",
                  "description": "The city and state, e.g. San Francisco, CA"
                }
              },
              "required": ["location"]
            }
          }
        ],
        "messages": [
          {
            "role": "user",
            "content": "What'\''s the weather like in San Francisco?"
          }
        ]
      }'
  ```

  ```java Java
  import java.util.List;
  import java.util.Map;

  import com.anthropic.client.AnthropicClient;
  import com.anthropic.client.okhttp.AnthropicOkHttpClient;
  import com.anthropic.core.JsonValue;
  import com.anthropic.models.messages.MessageCountTokensParams;
  import com.anthropic.models.messages.MessageTokensCount;
  import com.anthropic.models.messages.Model;
  import com.anthropic.models.messages.Tool;
  import com.anthropic.models.messages.Tool.InputSchema;

  public class CountTokensWithToolsExample {

      public static void main(String[] args) {
          AnthropicClient client = AnthropicOkHttpClient.fromEnv();

          InputSchema schema = InputSchema.builder()
                  .properties(JsonValue.from(Map.of(
                          "location", Map.of(
                                  "type", "string",
                                  "description", "The city and state, e.g. San Francisco, CA"
                          )
                  )))
                  .putAdditionalProperty("required", JsonValue.from(List.of("location")))
                  .build();

          MessageCountTokensParams params = MessageCountTokensParams.builder()
                  .model(Model.CLAUDE_SONNET_4_20250514)
                  .addTool(Tool.builder()
                          .name("get_weather")
                          .description("Get the current weather in a given location")
                          .inputSchema(schema)
                          .build())
                  .addUserMessage("What's the weather like in San Francisco?")
                  .build();

          MessageTokensCount count = client.messages().countTokens(params);
          System.out.println(count);
      }
  }
  ```
</CodeGroup>

```JSON JSON
{ "input_tokens": 403 }
```

### Count tokens in messages with images

<CodeGroup>
  ```bash Shell
  #!/bin/sh

  IMAGE_URL="https://upload.wikimedia.org/wikipedia/commons/a/a7/Camponotus_flavomarginatus_ant.jpg"
  IMAGE_MEDIA_TYPE="image/jpeg"
  IMAGE_BASE64=$(curl "$IMAGE_URL" | base64)

  curl https://api.anthropic.com/v1/messages/count_tokens \
       --header "x-api-key: $ANTHROPIC_API_KEY" \
       --header "anthropic-version: 2023-06-01" \
       --header "content-type: application/json" \
       --data \
  '{
      "model": "claude-opus-4-20250514",
      "messages": [
          {"role": "user", "content": [
              {"type": "image", "source": {
                  "type": "base64",
                  "media_type": "'$IMAGE_MEDIA_TYPE'",
                  "data": "'$IMAGE_BASE64'"
              }},
              {"type": "text", "text": "Describe this image"}
          ]}
      ]
  }'
  ```

  ```Python Python
  import anthropic
  import base64
  import httpx

  image_url = "https://upload.wikimedia.org/wikipedia/commons/a/a7/Camponotus_flavomarginatus_ant.jpg"
  image_media_type = "image/jpeg"
  image_data = base64.standard_b64encode(httpx.get(image_url).content).decode("utf-8")

  client = anthropic.Anthropic()

  response = client.messages.count_tokens(
      model="claude-opus-4-20250514",
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
                      "text": "Describe this image"
                  }
              ],
          }
      ],
  )
  print(response.json())
  ```

  ```Typescript TypeScript
  import Anthropic from '@anthropic-ai/sdk';

  const anthropic = new Anthropic();

  const image_url = "https://upload.wikimedia.org/wikipedia/commons/a/a7/Camponotus_flavomarginatus_ant.jpg"
  const image_media_type = "image/jpeg"
  const image_array_buffer = await ((await fetch(image_url)).arrayBuffer());
  const image_data = Buffer.from(image_array_buffer).toString('base64');

  const response = await anthropic.messages.countTokens({
    model: 'claude-opus-4-20250514',
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
          }
        ],
      },
      {
        "type": "text",
        "text": "Describe this image"
      }
    ]
  });
  console.log(response);
  ```

  ```java Java
  import java.util.Base64;
  import java.util.List;

  import com.anthropic.client.AnthropicClient;
  import com.anthropic.client.okhttp.AnthropicOkHttpClient;
  import com.anthropic.models.messages.Base64ImageSource;
  import com.anthropic.models.messages.ContentBlockParam;
  import com.anthropic.models.messages.ImageBlockParam;
  import com.anthropic.models.messages.MessageCountTokensParams;
  import com.anthropic.models.messages.MessageTokensCount;
  import com.anthropic.models.messages.Model;
  import com.anthropic.models.messages.TextBlockParam;

  import java.net.URI;
  import java.net.http.HttpClient;
  import java.net.http.HttpRequest;
  import java.net.http.HttpResponse;

  public class CountTokensImageExample {

      public static void main(String[] args) throws Exception {
          AnthropicClient client = AnthropicOkHttpClient.fromEnv();

          String imageUrl = "https://upload.wikimedia.org/wikipedia/commons/a/a7/Camponotus_flavomarginatus_ant.jpg";
          String imageMediaType = "image/jpeg";

          HttpClient httpClient = HttpClient.newHttpClient();
          HttpRequest request = HttpRequest.newBuilder()
                  .uri(URI.create(imageUrl))
                  .build();
          byte[] imageBytes = httpClient.send(request, HttpResponse.BodyHandlers.ofByteArray()).body();
          String imageBase64 = Base64.getEncoder().encodeToString(imageBytes);

          ContentBlockParam imageBlock = ContentBlockParam.ofImage(
                  ImageBlockParam.builder()
                          .source(Base64ImageSource.builder()
                                  .mediaType(Base64ImageSource.MediaType.IMAGE_JPEG)
                                  .data(imageBase64)
                                  .build())
                          .build());

          ContentBlockParam textBlock = ContentBlockParam.ofText(
                  TextBlockParam.builder()
                          .text("Describe this image")
                          .build());

          MessageCountTokensParams params = MessageCountTokensParams.builder()
                  .model(Model.CLAUDE_SONNET_4_20250514)
                  .addUserMessageOfBlockParams(List.of(imageBlock, textBlock))
                  .build();

          MessageTokensCount count = client.messages().countTokens(params);
          System.out.println(count);
      }
  }
  ```
</CodeGroup>

```JSON JSON
{ "input_tokens": 1551 }
```

### Count tokens in messages with extended thinking

<Note>
  See [here](/en/docs/build-with-claude/extended-thinking#how-context-window-is-calculated-with-extended-thinking) for more details about how the context window is calculated with extended thinking

  * Thinking blocks from **previous** assistant turns are ignored and **do not** count toward your input tokens
  * **Current** assistant turn thinking **does** count toward your input tokens
</Note>

<CodeGroup>
  ```bash Shell
  curl https://api.anthropic.com/v1/messages/count_tokens \
      --header "x-api-key: $ANTHROPIC_API_KEY" \
      --header "content-type: application/json" \
      --header "anthropic-version: 2023-06-01" \
      --data '{
        "model": "claude-opus-4-20250514",
        "thinking": {
          "type": "enabled",
          "budget_tokens": 16000
        },
        "messages": [
          {
            "role": "user",
            "content": "Are there an infinite number of prime numbers such that n mod 4 == 3?"
          },
          {
            "role": "assistant",
            "content": [
              {
                "type": "thinking",
                "thinking": "This is a nice number theory question. Lets think about it step by step...",
                "signature": "EuYBCkQYAiJAgCs1le6/Pol5Z4/JMomVOouGrWdhYNsH3ukzUECbB6iWrSQtsQuRHJID6lWV..."
              },
              {
                "type": "text",
                "text": "Yes, there are infinitely many prime numbers p such that p mod 4 = 3..."
              }
            ]
          },
          {
            "role": "user",
            "content": "Can you write a formal proof?"
          }
        ]
      }'
  ```

  ```Python Python
  import anthropic

  client = anthropic.Anthropic()

  response = client.messages.count_tokens(
      model="claude-opus-4-20250514",
      thinking={
          "type": "enabled",
          "budget_tokens": 16000
      },
      messages=[
          {
              "role": "user",
              "content": "Are there an infinite number of prime numbers such that n mod 4 == 3?"
          },
          {
              "role": "assistant",
              "content": [
                  {
                      "type": "thinking",
                      "thinking": "This is a nice number theory question. Let's think about it step by step...",
                      "signature": "EuYBCkQYAiJAgCs1le6/Pol5Z4/JMomVOouGrWdhYNsH3ukzUECbB6iWrSQtsQuRHJID6lWV..."
                  },
                  {
                    "type": "text",
                    "text": "Yes, there are infinitely many prime numbers p such that p mod 4 = 3..."
                  }
              ]
          },
          {
              "role": "user",
              "content": "Can you write a formal proof?"
          }
      ]
  )

  print(response.json())
  ```

  ```typescript TypeScript
  import Anthropic from '@anthropic-ai/sdk';

  const client = new Anthropic();

  const response = await client.messages.countTokens({
    model: 'claude-opus-4-20250514',
    thinking: {
      'type': 'enabled',
      'budget_tokens': 16000
    },
    messages: [
      {
        'role': 'user',
        'content': 'Are there an infinite number of prime numbers such that n mod 4 == 3?'
      },
      {
        'role': 'assistant',
        'content': [
          {
            'type': 'thinking',
            'thinking': "This is a nice number theory question. Let's think about it step by step...",
            'signature': 'EuYBCkQYAiJAgCs1le6/Pol5Z4/JMomVOouGrWdhYNsH3ukzUECbB6iWrSQtsQuRHJID6lWV...'
          },
          {
            'type': 'text',
            'text': 'Yes, there are infinitely many prime numbers p such that p mod 4 = 3...',
          }
        ]
      },
      {
        'role': 'user',
        'content': 'Can you write a formal proof?'
      }
    ]
  });

  console.log(response);
  ```

  ```java Java
  import java.util.List;

  import com.anthropic.client.AnthropicClient;
  import com.anthropic.client.okhttp.AnthropicOkHttpClient;
  import com.anthropic.models.messages.ContentBlockParam;
  import com.anthropic.models.messages.MessageCountTokensParams;
  import com.anthropic.models.messages.MessageTokensCount;
  import com.anthropic.models.messages.Model;
  import com.anthropic.models.messages.TextBlockParam;
  import com.anthropic.models.messages.ThinkingBlockParam;

  public class CountTokensThinkingExample {

      public static void main(String[] args) {
          AnthropicClient client = AnthropicOkHttpClient.fromEnv();

          List<ContentBlockParam> assistantBlocks = List.of(
                  ContentBlockParam.ofThinking(ThinkingBlockParam.builder()
                          .thinking("This is a nice number theory question. Let's think about it step by step...")
                          .signature("EuYBCkQYAiJAgCs1le6/Pol5Z4/JMomVOouGrWdhYNsH3ukzUECbB6iWrSQtsQuRHJID6lWV...")
                          .build()),
                  ContentBlockParam.ofText(TextBlockParam.builder()
                          .text("Yes, there are infinitely many prime numbers p such that p mod 4 = 3...")
                          .build())
          );

          MessageCountTokensParams params = MessageCountTokensParams.builder()
                  .model(Model.CLAUDE_SONNET_4_20250514)
                  .enabledThinking(16000)
                  .addUserMessage("Are there an infinite number of prime numbers such that n mod 4 == 3?")
                  .addAssistantMessageOfBlockParams(assistantBlocks)
                  .addUserMessage("Can you write a formal proof?")
                  .build();

          MessageTokensCount count = client.messages().countTokens(params);
          System.out.println(count);
      }
  }
  ```
</CodeGroup>

```JSON JSON
{ "input_tokens": 88 }
```

### Count tokens in messages with PDFs

<Note>
  Token counting supports PDFs with the same [limitations](/en/docs/build-with-claude/pdf-support#pdf-support-limitations) as the Messages API.
</Note>

<CodeGroup>
  ```bash Shell
  curl https://api.anthropic.com/v1/messages/count_tokens \
      --header "x-api-key: $ANTHROPIC_API_KEY" \
      --header "content-type: application/json" \
      --header "anthropic-version: 2023-06-01" \
      --data '{
        "model": "claude-opus-4-20250514",
        "messages": [{
          "role": "user",
          "content": [
            {
              "type": "document",
              "source": {
                "type": "base64",
                "media_type": "application/pdf",
                "data": "'$(base64 -i document.pdf)'"
              }
            },
            {
              "type": "text",
              "text": "Please summarize this document."
            }
          ]
        }]
      }'
  ```

  ```Python Python
  import base64
  import anthropic

  client = anthropic.Anthropic()

  with open("document.pdf", "rb") as pdf_file:
      pdf_base64 = base64.standard_b64encode(pdf_file.read()).decode("utf-8")

  response = client.messages.count_tokens(
      model="claude-opus-4-20250514",
      messages=[{
          "role": "user",
          "content": [
              {
                  "type": "document",
                  "source": {
                      "type": "base64",
                      "media_type": "application/pdf",
                      "data": pdf_base64
                  }
              },
              {
                  "type": "text",
                  "text": "Please summarize this document."
              }
          ]
      }]
  )

  print(response.json())
  ```

  ```Typescript TypeScript
  import Anthropic from '@anthropic-ai/sdk';
  import { readFileSync } from 'fs';

  const client = new Anthropic();

  const pdfBase64 = readFileSync('document.pdf', { encoding: 'base64' });

  const response = await client.messages.countTokens({
    model: 'claude-opus-4-20250514',
    messages: [{
      role: 'user',
      content: [
        {
          type: 'document',
          source: {
            type: 'base64',
            media_type: 'application/pdf',
            data: pdfBase64
          }
        },
        {
          type: 'text',
          text: 'Please summarize this document.'
        }
      ]
    }]
  });

  console.log(response);
  ```

  ```java Java
  import java.nio.file.Files;
  import java.nio.file.Path;
  import java.util.Base64;
  import java.util.List;

  import com.anthropic.client.AnthropicClient;
  import com.anthropic.client.okhttp.AnthropicOkHttpClient;
  import com.anthropic.models.messages.Base64PdfSource;
  import com.anthropic.models.messages.ContentBlockParam;
  import com.anthropic.models.messages.DocumentBlockParam;
  import com.anthropic.models.messages.MessageCountTokensParams;
  import com.anthropic.models.messages.MessageTokensCount;
  import com.anthropic.models.messages.Model;
  import com.anthropic.models.messages.TextBlockParam;

  public class CountTokensPdfExample {

      public static void main(String[] args) throws Exception {
          AnthropicClient client = AnthropicOkHttpClient.fromEnv();

          byte[] fileBytes = Files.readAllBytes(Path.of("document.pdf"));
          String pdfBase64 = Base64.getEncoder().encodeToString(fileBytes);

          ContentBlockParam documentBlock = ContentBlockParam.ofDocument(
                  DocumentBlockParam.builder()
                          .source(Base64PdfSource.builder()
                                  .mediaType(Base64PdfSource.MediaType.APPLICATION_PDF)
                                  .data(pdfBase64)
                                  .build())
                          .build());

          ContentBlockParam textBlock = ContentBlockParam.ofText(
                  TextBlockParam.builder()
                          .text("Please summarize this document.")
                          .build());

          MessageCountTokensParams params = MessageCountTokensParams.builder()
                  .model(Model.CLAUDE_SONNET_4_20250514)
                  .addUserMessageOfBlockParams(List.of(documentBlock, textBlock))
                  .build();

          MessageTokensCount count = client.messages().countTokens(params);
          System.out.println(count);
      }
  }
  ```
</CodeGroup>

```JSON JSON
{ "input_tokens": 2188 }
```

***

## Pricing and rate limits

Token counting is **free to use** but subject to requests per minute rate limits based on your [usage tier](/en/api/rate-limits#rate-limits). If you need higher limits, contact sales through the [Anthropic Console](https://console.anthropic.com/settings/limits).

| Usage tier | Requests per minute (RPM) |
| ---------- | ------------------------- |
| 1          | 100                       |
| 2          | 2,000                     |
| 3          | 4,000                     |
| 4          | 8,000                     |

<Note>
  Token counting and message creation have separate and independent rate limits -- usage of one does not count against the limits of the other.
</Note>

***

## FAQ

<AccordionGroup>
  <Accordion title="Does token counting use prompt caching?">
    No, token counting provides an estimate without using caching logic. While you may provide `cache_control` blocks in your token counting request, prompt caching only occurs during actual message creation.
  </Accordion>
</AccordionGroup>


# Embeddings

> Text embeddings are numerical representations of text that enable measuring semantic similarity. This guide introduces embeddings, their applications, and how to use embedding models for tasks like search, recommendations, and anomaly detection.

## Before implementing embeddings

When selecting an embeddings provider, there are several factors you can consider depending on your needs and preferences:

* Dataset size & domain specificity: size of the model training dataset and its relevance to the domain you want to embed. Larger or more domain-specific data generally produces better in-domain embeddings
* Inference performance: embedding lookup speed and end-to-end latency. This is a particularly important consideration for large scale production deployments
* Customization: options for continued training on private data, or specialization of models for very specific domains. This can improve performance on unique vocabularies

## How to get embeddings with Anthropic

Anthropic does not offer its own embedding model. One embeddings provider that has a wide variety of options and capabilities encompassing all of the above considerations is Voyage AI.

Voyage AI makes state-of-the-art embedding models and offers customized models for specific industry domains such as finance and healthcare, or bespoke fine-tuned models for individual customers.

The rest of this guide is for Voyage AI, but we encourage you to assess a variety of embeddings vendors to find the best fit for your specific use case.

## Available Models

Voyage recommends using the following text embedding models:

| Model              | Context Length | Embedding Dimension            | Description                                                                                                                                                                                                                                           |
| ------------------ | -------------- | ------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `voyage-3-large`   | 32,000         | 1024 (default), 256, 512, 2048 | The best general-purpose and multilingual retrieval quality. See [blog post](https://blog.voyageai.com/2025/01/07/voyage-3-large/) for details.                                                                                                       |
| `voyage-3.5`       | 32,000         | 1024 (default), 256, 512, 2048 | Optimized for general-purpose and multilingual retrieval quality. See [blog post](https://blog.voyageai.com/2025/05/20/voyage-3-5/) for details.                                                                                                      |
| `voyage-3.5-lite`  | 32,000         | 1024 (default), 256, 512, 2048 | Optimized for latency and cost. See [blog post](https://blog.voyageai.com/2025/05/20/voyage-3-5/) for details.                                                                                                                                        |
| `voyage-code-3`    | 32,000         | 1024 (default), 256, 512, 2048 | Optimized for **code** retrieval. See [blog post](https://blog.voyageai.com/2024/12/04/voyage-code-3/) for details.                                                                                                                                   |
| `voyage-finance-2` | 32,000         | 1024                           | Optimized for **finance** retrieval and RAG. See [blog post](https://blog.voyageai.com/2024/06/03/domain-specific-embeddings-finance-edition-voyage-finance-2/) for details.                                                                          |
| `voyage-law-2`     | 16,000         | 1024                           | Optimized for **legal** and **long-context** retrieval and RAG. Also improved performance across all domains. See [blog post](https://blog.voyageai.com/2024/04/15/domain-specific-embeddings-and-retrieval-legal-edition-voyage-law-2/) for details. |

Additionally, the following multimodal embedding models are recommended:

| Model                 | Context Length | Embedding Dimension | Description                                                                                                                                                                                                                                          |
| --------------------- | -------------- | ------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `voyage-multimodal-3` | 32000          | 1024                | Rich multimodal embedding model that can vectorize interleaved text and content-rich images, such as screenshots of PDFs, slides, tables, figures, and more. See [blog post](https://blog.voyageai.com/2024/11/12/voyage-multimodal-3/) for details. |

Need help deciding which text embedding model to use? Check out the [FAQ](https://docs.voyageai.com/docs/faq#what-embedding-models-are-available-and-which-one-should-i-use\&ref=anthropic).

## Getting started with Voyage AI

To access Voyage embeddings:

1. Sign up on Voyage AI's website
2. Obtain an API key
3. Set the API key as an environment variable for convenience:

```bash
export VOYAGE_API_KEY="<your secret key>"
```

You can obtain the embeddings by either using the official [`voyageai` Python package](https://github.com/voyage-ai/voyageai-python) or HTTP requests, as described below.

### Voyage Python library

The `voyageai` package can be installed using the following command:

```bash
pip install -U voyageai
```

Then, you can create a client object and start using it to embed your texts:

```python
import voyageai

vo = voyageai.Client()
# This will automatically use the environment variable VOYAGE_API_KEY.
# Alternatively, you can use vo = voyageai.Client(api_key="<your secret key>")

texts = ["Sample text 1", "Sample text 2"]

result = vo.embed(texts, model="voyage-3.5", input_type="document")
print(result.embeddings[0])
print(result.embeddings[1])
```

`result.embeddings` will be a list of two embedding vectors, each containing 1024 floating-point numbers. After running the above code, the two embeddings will be printed on the screen:

```
[-0.013131560757756233, 0.019828535616397858, ...]   # embedding for "Sample text 1"
[-0.0069352793507277966, 0.020878976210951805, ...]  # embedding for "Sample text 2"
```

When creating the embeddings, you can specify a few other arguments to the `embed()` function.

For more information on the Voyage python package, see [the Voyage documentation](https://docs.voyageai.com/docs/embeddings#python-api).

### Voyage HTTP API

You can also get embeddings by requesting Voyage HTTP API. For example, you can send an HTTP request through the `curl` command in a terminal:

```bash
curl https://api.voyageai.com/v1/embeddings \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $VOYAGE_API_KEY" \
  -d '{
    "input": ["Sample text 1", "Sample text 2"],
    "model": "voyage-3.5"
  }'
```

The response you would get is a JSON object containing the embeddings and the token usage:

```json
{
  "object": "list",
  "data": [
    {
      "embedding": [-0.013131560757756233, 0.019828535616397858, ...],
      "index": 0
    },
    {
      "embedding": [-0.0069352793507277966, 0.020878976210951805, ...],
      "index": 1
    }
  ],
  "model": "voyage-3.5",
  "usage": {
    "total_tokens": 10
  }
}

```

For more information on the Voyage HTTP API, see [the Voyage documentation](https://docs.voyageai.com/reference/embeddings-api).

### AWS Marketplace

Voyage embeddings are available on [AWS Marketplace](https://aws.amazon.com/marketplace/seller-profile?id=seller-snt4gb6fd7ljg). Instructions for accessing Voyage on AWS are available [here](https://docs.voyageai.com/docs/aws-marketplace-model-package?ref=anthropic).

## Quickstart example

Now that we know how to get embeddings, let's see a brief example.

Suppose we have a small corpus of six documents to retrieve from

```python
documents = [
    "The Mediterranean diet emphasizes fish, olive oil, and vegetables, believed to reduce chronic diseases.",
    "Photosynthesis in plants converts light energy into glucose and produces essential oxygen.",
    "20th-century innovations, from radios to smartphones, centered on electronic advancements.",
    "Rivers provide water, irrigation, and habitat for aquatic species, vital for ecosystems.",
    "Apple's conference call to discuss fourth fiscal quarter results and business updates is scheduled for Thursday, November 2, 2023 at 2:00 p.m. PT / 5:00 p.m. ET.",
    "Shakespeare's works, like 'Hamlet' and 'A Midsummer Night's Dream,' endure in literature."
]

```

We will first use Voyage to convert each of them into an embedding vector

```python
import voyageai

vo = voyageai.Client()

# Embed the documents
doc_embds = vo.embed(
    documents, model="voyage-3.5", input_type="document"
).embeddings
```

The embeddings will allow us to do semantic search / retrieval in the vector space. Given an example query,

```python
query = "When is Apple's conference call scheduled?"
```

we convert it into an embedding, and conduct a nearest neighbor search to find the most relevant document based on the distance in the embedding space.

```python
import numpy as np

# Embed the query
query_embd = vo.embed(
    [query], model="voyage-3.5", input_type="query"
).embeddings[0]

# Compute the similarity
# Voyage embeddings are normalized to length 1, therefore dot-product
# and cosine similarity are the same.
similarities = np.dot(doc_embds, query_embd)

retrieved_id = np.argmax(similarities)
print(documents[retrieved_id])
```

Note that we use `input_type="document"` and `input_type="query"` for embedding the document and query, respectively. More specification can be found [here](https://docs.anthropic.com/en/docs/build-with-claude/embeddings#voyage-python-package).

The output would be the 5th document, which is indeed the most relevant to the query:

```
Apple's conference call to discuss fourth fiscal quarter results and business updates is scheduled for Thursday, November 2, 2023 at 2:00 p.m. PT / 5:00 p.m. ET.
```

If you are looking for a detailed set of cookbooks on how to do RAG with embeddings, including vector databases, check out our [RAG cookbook](https://github.com/anthropics/anthropic-cookbook/blob/main/third_party/Pinecone/rag_using_pinecone.ipynb).

## FAQ

<AccordionGroup>
  <Accordion title="Why do Voyage embeddings have superior quality?">
    Embedding models rely on powerful neural networks to capture and compress semantic context, similar to generative models. Voyage's team of experienced AI researchers optimizes every component of the embedding process, including:

    * Model architecture
    * Data collection
    * Loss functions
    * Optimizer selection

    Learn more about Voyage's technical approach on their [blog](https://blog.voyageai.com/).
  </Accordion>

  <Accordion title="What embedding models are available and which should I use?">
    For general-purpose embedding, we recommend:

    * `voyage-3-large`: Best quality
    * `voyage-3.5-lite`: Lowest latency and cost
    * `voyage-3.5`: Balanced performance with superior retrieval quality at a competitive price point

    For retrieval, use the `input_type` parameter to specify whether the text is a query or document type.

    Domain-specific models:

    * Legal tasks: `voyage-law-2`
    * Code and programming documentation: `voyage-code-3`
    * Finance-related tasks: `voyage-finance-2`
  </Accordion>

  <Accordion title="Which similarity function should I use?">
    You can use Voyage embeddings with either dot-product similarity, cosine similarity, or Euclidean distance. An explanation about embedding similarity can be found [here](https://www.pinecone.io/learn/vector-similarity/).

    Voyage AI embeddings are normalized to length 1, which means that:

    * Cosine similarity is equivalent to dot-product similarity, while the latter can be computed more quickly.
    * Cosine similarity and Euclidean distance will result in the identical rankings.
  </Accordion>

  <Accordion title="What is the relationship between characters, words, and tokens?">
    Please see this [page](https://docs.voyageai.com/docs/tokenization?ref=anthropic).
  </Accordion>

  <Accordion title="When and how should I use the input_type parameter?">
    For all retrieval tasks and use cases (e.g., RAG), we recommend that the `input_type` parameter be used to specify whether the input text is a query or document. Do not omit `input_type` or set `input_type=None`. Specifying whether input text is a query or document can create better dense vector representations for retrieval, which can lead to better retrieval quality.

    When using the `input_type` parameter, special prompts are prepended to the input text prior to embedding. Specifically:

    > 📘 **Prompts associated with `input_type`**
    >
    > * For a query, the prompt is “Represent the query for retrieving supporting documents: “.
    > * For a document, the prompt is “Represent the document for retrieval: “.
    > * Example
    >   * When `input_type="query"`, a query like "When is Apple's conference call scheduled?" will become "**Represent the query for retrieving supporting documents:** When is Apple's conference call scheduled?"
    >   * When `input_type="document"`, a query like "Apple's conference call to discuss fourth fiscal quarter results and business updates is scheduled for Thursday, November 2, 2023 at 2:00 p.m. PT / 5:00 p.m. ET." will become "**Represent the document for retrieval:** Apple's conference call to discuss fourth fiscal quarter results and business updates is scheduled for Thursday, November 2, 2023 at 2:00 p.m. PT / 5:00 p.m. ET."

    `voyage-large-2-instruct`, as the name suggests, is trained to be responsive to additional instructions that are prepended to the input text. For classification, clustering, or other [MTEB](https://huggingface.co/mteb) subtasks, please use the instructions [here](https://github.com/voyage-ai/voyage-large-2-instruct).
  </Accordion>

  <Accordion title="What quantization options are available?">
    Quantization in embeddings converts high-precision values, like 32-bit single-precision floating-point numbers, to lower-precision formats such as 8-bit integers or 1-bit binary values, reducing storage, memory, and costs by 4x and 32x, respectively. Supported Voyage models enable quantization by specifying the output data type with the `output_dtype` parameter:

    * `float`: Each returned embedding is a list of 32-bit (4-byte) single-precision floating-point numbers. This is the default and provides the highest precision / retrieval accuracy.
    * `int8` and `uint8`: Each returned embedding is a list of 8-bit (1-byte) integers ranging from -128 to 127 and 0 to 255, respectively.
    * `binary` and `ubinary`: Each returned embedding is a list of 8-bit integers that represent bit-packed, quantized single-bit embedding values: `int8` for `binary` and `uint8` for `ubinary`. The length of the returned list of integers is 1/8 of the actual dimension of the embedding. The binary type uses the offset binary method, which you can learn more about in the FAQ below.

    > **Binary quantization example**
    >
    > Consider the following eight embedding values: -0.03955078, 0.006214142, -0.07446289, -0.039001465, 0.0046463013, 0.00030612946, -0.08496094, and 0.03994751. With binary quantization, values less than or equal to zero will be quantized to a binary zero, and positive values to a binary one, resulting in the following binary sequence: 0, 1, 0, 0, 1, 1, 0, 1. These eight bits are then packed into a single 8-bit integer, 01001101 (with the leftmost bit as the most significant bit).
    >
    > * `ubinary`: The binary sequence is directly converted and represented as the unsigned integer (`uint8`) 77.
    > * `binary`: The binary sequence is represented as the signed integer (`int8`) -51, calculated using the offset binary method (77 - 128 = -51).
  </Accordion>

  <Accordion title="How can I truncate Matryoshka embeddings?">
    Matryoshka learning creates embeddings with coarse-to-fine representations within a single vector. Voyage models, such as `voyage-code-3`, that support multiple output dimensions generate such Matryoshka embeddings. You can truncate these vectors by keeping the leading subset of dimensions. For example, the following Python code demonstrates how to truncate 1024-dimensional vectors to 256 dimensions:

    ```python
    import voyageai
    import numpy as np

    def embd_normalize(v: np.ndarray) -> np.ndarray:
        """
        Normalize the rows of a 2D numpy array to unit vectors by dividing each row by its Euclidean
        norm. Raises a ValueError if any row has a norm of zero to prevent division by zero.
        """
        row_norms = np.linalg.norm(v, axis=1, keepdims=True)
        if np.any(row_norms == 0):
            raise ValueError("Cannot normalize rows with a norm of zero.")
        return v / row_norms


    vo = voyageai.Client()

    # Generate voyage-code-3 vectors, which by default are 1024-dimensional floating-point numbers
    embd = vo.embed(['Sample text 1', 'Sample text 2'], model='voyage-code-3').embeddings

    # Set shorter dimension
    short_dim = 256

    # Resize and normalize vectors to shorter dimension
    resized_embd = embd_normalize(np.array(embd)[:, :short_dim]).tolist()
    ```
  </Accordion>
</AccordionGroup>

## Pricing

Visit Voyage's [pricing page](https://docs.voyageai.com/docs/pricing?ref=anthropic) for the most up to date pricing details.


# Vision

> The Claude 3 and 4 families of models comes with new vision capabilities that allow Claude to understand and analyze images, opening up exciting possibilities for multimodal interaction.

This guide describes how to work with images in Claude, including best practices, code examples, and limitations to keep in mind.

***

## How to use vision

Use Claude’s vision capabilities via:

* [claude.ai](https://claude.ai/). Upload an image like you would a file, or drag and drop an image directly into the chat window.
* The [Console Workbench](https://console.anthropic.com/workbench/). If you select a model that accepts images (Claude 3 and 4 models only), a button to add images appears at the top right of every User message block.
* **API request**. See the examples in this guide.

***

## Before you upload

### Basics and Limits

You can include multiple images in a single request (up to 20 for [claude.ai](https://claude.ai/) and 100 for API requests). Claude will analyze all provided images when formulating its response. This can be helpful for comparing or contrasting images.

If you submit an image larger than 8000x8000 px, it will be rejected. If you submit more than 20 images in one API request, this limit is 2000x2000 px.

### Evaluate image size

For optimal performance, we recommend resizing images before uploading if they are too large. If your image’s long edge is more than 1568 pixels, or your image is more than \~1,600 tokens, it will first be scaled down, preserving aspect ratio, until it’s within the size limits.

If your input image is too large and needs to be resized, it will increase latency of [time-to-first-token](/en/docs/about-claude/glossary), without giving you any additional model performance. Very small images under 200 pixels on any given edge may degrade performance.

<Tip>
  To improve [time-to-first-token](/en/docs/about-claude/glossary), we recommend
  resizing images to no more than 1.15 megapixels (and within 1568 pixels in
  both dimensions).
</Tip>

Here is a table of maximum image sizes accepted by our API that will not be resized for common aspect ratios. With the Claude Sonnet 3.7 model, these images use approximately 1,600 tokens and around \$4.80/1K images.

| Aspect ratio | Image size   |
| ------------ | ------------ |
| 1:1          | 1092x1092 px |
| 3:4          | 951x1268 px  |
| 2:3          | 896x1344 px  |
| 9:16         | 819x1456 px  |
| 1:2          | 784x1568 px  |

### Calculate image costs

Each image you include in a request to Claude counts towards your token usage. To calculate the approximate cost, multiply the approximate number of image tokens by the [per-token price of the model](https://anthropic.com/pricing) you’re using.

If your image does not need to be resized, you can estimate the number of tokens used through this algorithm: `tokens = (width px * height px)/750`

Here are examples of approximate tokenization and costs for different image sizes within our API’s size constraints based on Claude Sonnet 3.7 per-token price of \$3 per million input tokens:

| Image size                    | # of Tokens | Cost / image | Cost / 1K images |
| ----------------------------- | ----------- | ------------ | ---------------- |
| 200x200 px(0.04 megapixels)   | \~54        | \~\$0.00016  | \~\$0.16         |
| 1000x1000 px(1 megapixel)     | \~1334      | \~\$0.004    | \~\$4.00         |
| 1092x1092 px(1.19 megapixels) | \~1590      | \~\$0.0048   | \~\$4.80         |

### Ensuring image quality

When providing images to Claude, keep the following in mind for best results:

* **Image format**: Use a supported image format: JPEG, PNG, GIF, or WebP.
* **Image clarity**: Ensure images are clear and not too blurry or pixelated.
* **Text**: If the image contains important text, make sure it’s legible and not too small. Avoid cropping out key visual context just to enlarge the text.

***

## Prompt examples

Many of the [prompting techniques](/en/docs/build-with-claude/prompt-engineering/overview) that work well for text-based interactions with Claude can also be applied to image-based prompts.

These examples demonstrate best practice prompt structures involving images.

<Tip>
  Just as with document-query placement, Claude works best when images come
  before text. Images placed after text or interpolated with text will still
  perform well, but if your use case allows it, we recommend an image-then-text
  structure.
</Tip>

### About the prompt examples

The following examples demonstrate how to use Claude's vision capabilities using various programming languages and approaches. You can provide images to Claude in three ways:

1. As a base64-encoded image in `image` content blocks
2. As a URL reference to an image hosted online
3. Using the Files API (upload once, use multiple times)

The base64 example prompts use these variables:

<CodeGroup>
  ```bash Shell
      # For URL-based images, you can use the URL directly in your JSON request
      
      # For base64-encoded images, you need to first encode the image
      # Example of how to encode an image to base64 in bash:
      BASE64_IMAGE_DATA=$(curl -s "https://upload.wikimedia.org/wikipedia/commons/a/a7/Camponotus_flavomarginatus_ant.jpg" | base64)
      
      # The encoded data can now be used in your API calls
  ```

  ```Python Python
  import base64
  import httpx

  # For base64-encoded images
  image1_url = "https://upload.wikimedia.org/wikipedia/commons/a/a7/Camponotus_flavomarginatus_ant.jpg"
  image1_media_type = "image/jpeg"
  image1_data = base64.standard_b64encode(httpx.get(image1_url).content).decode("utf-8")

  image2_url = "https://upload.wikimedia.org/wikipedia/commons/b/b5/Iridescent.green.sweat.bee1.jpg"
  image2_media_type = "image/jpeg"
  image2_data = base64.standard_b64encode(httpx.get(image2_url).content).decode("utf-8")

  # For URL-based images, you can use the URLs directly in your requests
  ```

  ```TypeScript TypeScript
  import axios from 'axios';

  // For base64-encoded images
  async function getBase64Image(url: string): Promise<string> {
    const response = await axios.get(url, { responseType: 'arraybuffer' });
    return Buffer.from(response.data, 'binary').toString('base64');
  }

  // Usage
  async function prepareImages() {
    const imageData = await getBase64Image('https://upload.wikimedia.org/wikipedia/commons/a/a7/Camponotus_flavomarginatus_ant.jpg');
    // Now you can use imageData in your API calls
  }

  // For URL-based images, you can use the URLs directly in your requests
  ```

  ```java Java
  import java.io.IOException;
  import java.util.Base64;
  import java.io.InputStream;
  import java.net.URL;

  public class ImageHandlingExample {

      public static void main(String[] args) throws IOException, InterruptedException {
          // For base64-encoded images
          String image1Url = "https://upload.wikimedia.org/wikipedia/commons/a/a7/Camponotus_flavomarginatus_ant.jpg";
          String image1MediaType = "image/jpeg";
          String image1Data = downloadAndEncodeImage(image1Url);

          String image2Url = "https://upload.wikimedia.org/wikipedia/commons/b/b5/Iridescent.green.sweat.bee1.jpg";
          String image2MediaType = "image/jpeg";
          String image2Data = downloadAndEncodeImage(image2Url);

          // For URL-based images, you can use the URLs directly in your requests
      }

      private static String downloadAndEncodeImage(String imageUrl) throws IOException {
          try (InputStream inputStream = new URL(imageUrl).openStream()) {
              return Base64.getEncoder().encodeToString(inputStream.readAllBytes());
          }
      }

  }
  ```
</CodeGroup>

Below are examples of how to include images in a Messages API request using base64-encoded images and URL references:

### Base64-encoded image example

<CodeGroup>
  ```bash Shell
  curl https://api.anthropic.com/v1/messages \
    -H "x-api-key: $ANTHROPIC_API_KEY" \
    -H "anthropic-version: 2023-06-01" \
    -H "content-type: application/json" \
    -d '{
      "model": "claude-sonnet-4-20250514",
      "max_tokens": 1024,
      "messages": [
        {
          "role": "user",
          "content": [
            {
              "type": "image",
              "source": {
                "type": "base64",
                "media_type": "image/jpeg",
                "data": "'"$BASE64_IMAGE_DATA"'"
              }
            },
            {
              "type": "text",
              "text": "Describe this image."
            }
          ]
        }
      ]
    }'
  ```

  ```Python Python
  import anthropic

  client = anthropic.Anthropic()
  message = client.messages.create(
      model="claude-sonnet-4-20250514",
      max_tokens=1024,
      messages=[
          {
              "role": "user",
              "content": [
                  {
                      "type": "image",
                      "source": {
                          "type": "base64",
                          "media_type": image1_media_type,
                          "data": image1_data,
                      },
                  },
                  {
                      "type": "text",
                      "text": "Describe this image."
                  }
              ],
          }
      ],
  )
  print(message)
  ```

  ```TypeScript TypeScript
  import Anthropic from '@anthropic-ai/sdk';

  const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
  });

  async function main() {
    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1024,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "image",
              source: {
                type: "base64",
                media_type: "image/jpeg",
                data: imageData, // Base64-encoded image data as string
              }
            },
            {
              type: "text",
              text: "Describe this image."
            }
          ]
        }
      ]
    });
    
    console.log(message);
  }

  main();
  ```

  ```Java Java
  import java.io.IOException;
  import java.util.List;

  import com.anthropic.client.AnthropicClient;
  import com.anthropic.client.okhttp.AnthropicOkHttpClient;
  import com.anthropic.models.messages.*;

  public class VisionExample {
      public static void main(String[] args) throws IOException, InterruptedException {
          AnthropicClient client = AnthropicOkHttpClient.fromEnv();
          String imageData = ""; // // Base64-encoded image data as string

          List<ContentBlockParam> contentBlockParams = List.of(
                  ContentBlockParam.ofImage(
                          ImageBlockParam.builder()
                                  .source(Base64ImageSource.builder()
                                          .data(imageData)
                                          .build())
                                  .build()
                  ),
                  ContentBlockParam.ofText(TextBlockParam.builder()
                          .text("Describe this image.")
                          .build())
          );
          Message message = client.messages().create(
                  MessageCreateParams.builder()
                          .model(Model.CLAUDE_3_7_SONNET_LATEST)
                          .maxTokens(1024)
                          .addUserMessageOfBlockParams(contentBlockParams)
                          .build()
          );

          System.out.println(message);
      }
  }
  ```
</CodeGroup>

### URL-based image example

<CodeGroup>
  ```bash Shell
  curl https://api.anthropic.com/v1/messages \
    -H "x-api-key: $ANTHROPIC_API_KEY" \
    -H "anthropic-version: 2023-06-01" \
    -H "content-type: application/json" \
    -d '{
      "model": "claude-sonnet-4-20250514",
      "max_tokens": 1024,
      "messages": [
        {
          "role": "user",
          "content": [
            {
              "type": "image",
              "source": {
                "type": "url",
                "url": "https://upload.wikimedia.org/wikipedia/commons/a/a7/Camponotus_flavomarginatus_ant.jpg"
              }
            },
            {
              "type": "text",
              "text": "Describe this image."
            }
          ]
        }
      ]
    }'
  ```

  ```Python Python
  import anthropic

  client = anthropic.Anthropic()
  message = client.messages.create(
      model="claude-sonnet-4-20250514",
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
                      "text": "Describe this image."
                  }
              ],
          }
      ],
  )
  print(message)
  ```

  ```TypeScript TypeScript
  import Anthropic from '@anthropic-ai/sdk';

  const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
  });

  async function main() {
    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1024,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "image",
              source: {
                type: "url",
                url: "https://upload.wikimedia.org/wikipedia/commons/a/a7/Camponotus_flavomarginatus_ant.jpg"
              }
            },
            {
              type: "text",
              text: "Describe this image."
            }
          ]
        }
      ]
    });
    
    console.log(message);
  }

  main();
  ```

  ```Java Java
  import java.io.IOException;
  import java.util.List;

  import com.anthropic.client.AnthropicClient;
  import com.anthropic.client.okhttp.AnthropicOkHttpClient;
  import com.anthropic.models.messages.*;

  public class VisionExample {

      public static void main(String[] args) throws IOException, InterruptedException {
          AnthropicClient client = AnthropicOkHttpClient.fromEnv();

          List<ContentBlockParam> contentBlockParams = List.of(
                  ContentBlockParam.ofImage(
                          ImageBlockParam.builder()
                                  .source(UrlImageSource.builder()
                                          .url("https://upload.wikimedia.org/wikipedia/commons/a/a7/Camponotus_flavomarginatus_ant.jpg")
                                          .build())
                                  .build()
                  ),
                  ContentBlockParam.ofText(TextBlockParam.builder()
                          .text("Describe this image.")
                          .build())
          );
          Message message = client.messages().create(
                  MessageCreateParams.builder()
                          .model(Model.CLAUDE_3_7_SONNET_LATEST)
                          .maxTokens(1024)
                          .addUserMessageOfBlockParams(contentBlockParams)
                          .build()
          );
          System.out.println(message);
      }
  }
  ```
</CodeGroup>

### Files API image example

For images you'll use repeatedly or when you want to avoid encoding overhead, use the [Files API](/en/docs/build-with-claude/files):

<CodeGroup>
  ```bash Shell
  # First, upload your image to the Files API
  curl -X POST https://api.anthropic.com/v1/files \
    -H "x-api-key: $ANTHROPIC_API_KEY" \
    -H "anthropic-version: 2023-06-01" \
    -H "anthropic-beta: files-api-2025-04-14" \
    -F "file=@image.jpg"

  # Then use the returned file_id in your message
  curl https://api.anthropic.com/v1/messages \
    -H "x-api-key: $ANTHROPIC_API_KEY" \
    -H "anthropic-version: 2023-06-01" \
    -H "anthropic-beta: files-api-2025-04-14" \
    -H "content-type: application/json" \
    -d '{
      "model": "claude-sonnet-4-20250514",
      "max_tokens": 1024,
      "messages": [
        {
          "role": "user",
          "content": [
            {
              "type": "image",
              "source": {
                "type": "file",
                "file_id": "file_abc123"
              }
            },
            {
              "type": "text",
              "text": "Describe this image."
            }
          ]
        }
      ]
    }'
  ```

  ```python Python
  import anthropic

  client = anthropic.Anthropic()

  # Upload the image file
  with open("image.jpg", "rb") as f:
      file_upload = client.beta.files.upload(file=("image.jpg", f, "image/jpeg"))

  # Use the uploaded file in a message
  message = client.beta.messages.create(
      model="claude-sonnet-4-20250514",
      max_tokens=1024,
      betas=["files-api-2025-04-14"],
      messages=[
          {
              "role": "user",
              "content": [
                  {
                      "type": "image",
                      "source": {
                          "type": "file",
                          "file_id": file_upload.id
                      }
                  },
                  {
                      "type": "text",
                      "text": "Describe this image."
                  }
              ]
          }
      ],
  )

  print(message.content)
  ```

  ```typescript TypeScript
  import { Anthropic, toFile } from '@anthropic-ai/sdk';
  import fs from 'fs';

  const anthropic = new Anthropic();

  async function main() {
    // Upload the image file
    const fileUpload = await anthropic.beta.files.upload({
      file: toFile(fs.createReadStream('image.jpg'), undefined, { type: "image/jpeg" })
    }, {
      betas: ['files-api-2025-04-14']
    });

    // Use the uploaded file in a message
    const response = await anthropic.beta.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      betas: ['files-api-2025-04-14'],
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'image',
              source: {
                type: 'file',
                file_id: fileUpload.id
              }
            },
            {
              type: 'text',
              text: 'Describe this image.'
            }
          ]
        }
      ]
    });

    console.log(response);
  }

  main();
  ```

  ```java Java
  import java.io.IOException;
  import java.nio.file.Files;
  import java.nio.file.Path;
  import java.util.List;

  import com.anthropic.client.AnthropicClient;
  import com.anthropic.client.okhttp.AnthropicOkHttpClient;
  import com.anthropic.models.File;
  import com.anthropic.models.files.FileUploadParams;
  import com.anthropic.models.messages.*;

  public class ImageFilesExample {
      public static void main(String[] args) throws IOException {
          AnthropicClient client = AnthropicOkHttpClient.fromEnv();

          // Upload the image file
          File file = client.beta().files().upload(FileUploadParams.builder()
                  .file(Files.newInputStream(Path.of("image.jpg")))
                  .build());

          // Use the uploaded file in a message
          ImageBlockParam imageParam = ImageBlockParam.builder()
                  .fileSource(file.id())
                  .build();

          MessageCreateParams params = MessageCreateParams.builder()
                  .model(Model.CLAUDE_3_7_SONNET_LATEST)
                  .maxTokens(1024)
                  .addUserMessageOfBlockParams(
                          List.of(
                                  ContentBlockParam.ofImage(imageParam),
                                  ContentBlockParam.ofText(
                                          TextBlockParam.builder()
                                                  .text("Describe this image.")
                                                  .build()
                                  )
                          )
                  )
                  .build();

          Message message = client.messages().create(params);
          System.out.println(message.content());
      }
  }
  ```
</CodeGroup>

See [Messages API examples](/en/api/messages) for more example code and parameter details.

<AccordionGroup>
  <Accordion title="Example: One image">
    It’s best to place images earlier in the prompt than questions about them or instructions for tasks that use them.

    Ask Claude to describe one image.

    | Role | Content                       |
    | ---- | ----------------------------- |
    | User | \[Image] Describe this image. |

    Here is the corresponding API call using the Claude Sonnet 3.7 model.

    <Tabs>
      <Tab title="Using Base64">
        ```Python Python
        message = client.messages.create(
            model="claude-sonnet-4-20250514",
            max_tokens=1024,
            messages=[
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "image",
                            "source": {
                                "type": "base64",
                                "media_type": image1_media_type,
                                "data": image1_data,
                            },
                        },
                        {
                            "type": "text",
                            "text": "Describe this image."
                        }
                    ],
                }
            ],
        )
        ```
      </Tab>

      <Tab title="Using URL">
        ```Python Python
        message = client.messages.create(
            model="claude-sonnet-4-20250514",
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
                            "text": "Describe this image."
                        }
                    ],
                }
            ],
        )
        ```
      </Tab>
    </Tabs>
  </Accordion>

  <Accordion title="Example: Multiple images">
    In situations where there are multiple images, introduce each image with `Image 1:` and `Image 2:` and so on. You don’t need newlines between images or between images and the prompt.

    Ask Claude to describe the differences between multiple images.

    | Role | Content                                                                 |
    | ---- | ----------------------------------------------------------------------- |
    | User | Image 1: \[Image 1] Image 2: \[Image 2] How are these images different? |

    Here is the corresponding API call using the Claude Sonnet 3.7 model.

    <Tabs>
      <Tab title="Using Base64">
        ```Python Python
        message = client.messages.create(
            model="claude-sonnet-4-20250514",
            max_tokens=1024,
            messages=[
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "text",
                            "text": "Image 1:"
                        },
                        {
                            "type": "image",
                            "source": {
                                "type": "base64",
                                "media_type": image1_media_type,
                                "data": image1_data,
                            },
                        },
                        {
                            "type": "text",
                            "text": "Image 2:"
                        },
                        {
                            "type": "image",
                            "source": {
                                "type": "base64",
                                "media_type": image2_media_type,
                                "data": image2_data,
                            },
                        },
                        {
                            "type": "text",
                            "text": "How are these images different?"
                        }
                    ],
                }
            ],
        )
        ```
      </Tab>

      <Tab title="Using URL">
        ```Python Python
        message = client.messages.create(
            model="claude-sonnet-4-20250514",
            max_tokens=1024,
            messages=[
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "text",
                            "text": "Image 1:"
                        },
                        {
                            "type": "image",
                            "source": {
                                "type": "url",
                                "url": "https://upload.wikimedia.org/wikipedia/commons/a/a7/Camponotus_flavomarginatus_ant.jpg",
                            },
                        },
                        {
                            "type": "text",
                            "text": "Image 2:"
                        },
                        {
                            "type": "image",
                            "source": {
                                "type": "url",
                                "url": "https://upload.wikimedia.org/wikipedia/commons/b/b5/Iridescent.green.sweat.bee1.jpg",
                            },
                        },
                        {
                            "type": "text",
                            "text": "How are these images different?"
                        }
                    ],
                }
            ],
        )
        ```
      </Tab>
    </Tabs>
  </Accordion>

  <Accordion title="Example: Multiple images with a system prompt">
    Ask Claude to describe the differences between multiple images, while giving it a system prompt for how to respond.

    | Content |                                                                         |
    | ------- | ----------------------------------------------------------------------- |
    | System  | Respond only in Spanish.                                                |
    | User    | Image 1: \[Image 1] Image 2: \[Image 2] How are these images different? |

    Here is the corresponding API call using the Claude Sonnet 3.7 model.

    <Tabs>
      <Tab title="Using Base64">
        ```Python Python
        message = client.messages.create(
            model="claude-sonnet-4-20250514",
            max_tokens=1024,
            system="Respond only in Spanish.",
            messages=[
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "text",
                            "text": "Image 1:"
                        },
                        {
                            "type": "image",
                            "source": {
                                "type": "base64",
                                "media_type": image1_media_type,
                                "data": image1_data,
                            },
                        },
                        {
                            "type": "text",
                            "text": "Image 2:"
                        },
                        {
                            "type": "image",
                            "source": {
                                "type": "base64",
                                "media_type": image2_media_type,
                                "data": image2_data,
                            },
                        },
                        {
                            "type": "text",
                            "text": "How are these images different?"
                        }
                    ],
                }
            ],
        )
        ```
      </Tab>

      <Tab title="Using URL">
        ```Python Python
        message = client.messages.create(
            model="claude-sonnet-4-20250514",
            max_tokens=1024,
            system="Respond only in Spanish.",
            messages=[
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "text",
                            "text": "Image 1:"
                        },
                        {
                            "type": "image",
                            "source": {
                                "type": "url",
                                "url": "https://upload.wikimedia.org/wikipedia/commons/a/a7/Camponotus_flavomarginatus_ant.jpg",
                            },
                        },
                        {
                            "type": "text",
                            "text": "Image 2:"
                        },
                        {
                            "type": "image",
                            "source": {
                                "type": "url",
                                "url": "https://upload.wikimedia.org/wikipedia/commons/b/b5/Iridescent.green.sweat.bee1.jpg",
                            },
                        },
                        {
                            "type": "text",
                            "text": "How are these images different?"
                        }
                    ],
                }
            ],
        )
        ```
      </Tab>
    </Tabs>
  </Accordion>

  <Accordion title="Example: Four images across two conversation turns">
    Claude’s vision capabilities shine in multimodal conversations that mix images and text. You can have extended back-and-forth exchanges with Claude, adding new images or follow-up questions at any point. This enables powerful workflows for iterative image analysis, comparison, or combining visuals with other knowledge.

    Ask Claude to contrast two images, then ask a follow-up question comparing the first images to two new images.

    | Role      | Content                                                                            |
    | --------- | ---------------------------------------------------------------------------------- |
    | User      | Image 1: \[Image 1] Image 2: \[Image 2] How are these images different?            |
    | Assistant | \[Claude's response]                                                               |
    | User      | Image 1: \[Image 3] Image 2: \[Image 4] Are these images similar to the first two? |
    | Assistant | \[Claude's response]                                                               |

    When using the API, simply insert new images into the array of Messages in the `user` role as part of any standard [multiturn conversation](/en/api/messages-examples#multiple-conversational-turns) structure.
  </Accordion>
</AccordionGroup>

***

## Limitations

While Claude's image understanding capabilities are cutting-edge, there are some limitations to be aware of:

* **People identification**: Claude [cannot be used](https://www.anthropic.com/legal/aup) to identify (i.e., name) people in images and will refuse to do so.
* **Accuracy**: Claude may hallucinate or make mistakes when interpreting low-quality, rotated, or very small images under 200 pixels.
* **Spatial reasoning**: Claude's spatial reasoning abilities are limited. It may struggle with tasks requiring precise localization or layouts, like reading an analog clock face or describing exact positions of chess pieces.
* **Counting**: Claude can give approximate counts of objects in an image but may not always be precisely accurate, especially with large numbers of small objects.
* **AI generated images**: Claude does not know if an image is AI-generated and may be incorrect if asked. Do not rely on it to detect fake or synthetic images.
* **Inappropriate content**: Claude will not process inappropriate or explicit images that violate our [Acceptable Use Policy](https://www.anthropic.com/legal/aup).
* **Healthcare applications**: While Claude can analyze general medical images, it is not designed to interpret complex diagnostic scans such as CTs or MRIs. Claude's outputs should not be considered a substitute for professional medical advice or diagnosis.

Always carefully review and verify Claude's image interpretations, especially for high-stakes use cases. Do not use Claude for tasks requiring perfect precision or sensitive image analysis without human oversight.

***

## FAQ

<AccordionGroup>
  <Accordion title="What image file types does Claude support?">
    Claude currently supports JPEG, PNG, GIF, and WebP image formats, specifically:

    * `image/jpeg`
    * `image/png`
    * `image/gif`
    * `image/webp`
  </Accordion>

  {" "}

  <Accordion title="Can Claude read image URLs?">
    Yes, Claude can now process images from URLs with our URL image source blocks in the API.
    Simply use the "url" source type instead of "base64" in your API requests.
    Example:

    ```json
    {
      "type": "image",
      "source": {
        "type": "url",
        "url": "https://upload.wikimedia.org/wikipedia/commons/a/a7/Camponotus_flavomarginatus_ant.jpg"
      }
    }
    ```
  </Accordion>

  <Accordion title="Is there a limit to the image file size I can upload?">
    Yes, there are limits:

    * API: Maximum 5MB per image
    * claude.ai: Maximum 10MB per image

    Images larger than these limits will be rejected and return an error when using our API.
  </Accordion>

  <Accordion title="How many images can I include in one request?">
    The image limits are:

    * Messages API: Up to 100 images per request
    * claude.ai: Up to 20 images per turn

    Requests exceeding these limits will be rejected and return an error.
  </Accordion>

  {" "}

  <Accordion title="Does Claude read image metadata?">
    No, Claude does not parse or receive any metadata from images passed to it.
  </Accordion>

  {" "}

  <Accordion title="Can I delete images I've uploaded?">
    No. Image uploads are ephemeral and not stored beyond the duration of the API
    request. Uploaded images are automatically deleted after they have been
    processed.
  </Accordion>

  {" "}

  <Accordion title="Where can I find details on data privacy for image uploads?">
    Please refer to our privacy policy page for information on how we handle
    uploaded images and other data. We do not use uploaded images to train our
    models.
  </Accordion>

  <Accordion title="What if Claude's image interpretation seems wrong?">
    If Claude's image interpretation seems incorrect:

    1. Ensure the image is clear, high-quality, and correctly oriented.
    2. Try prompt engineering techniques to improve results.
    3. If the issue persists, flag the output in claude.ai (thumbs up/down) or contact our support team.

    Your feedback helps us improve!
  </Accordion>

  <Accordion title="Can Claude generate or edit images?">
    No, Claude is an image understanding model only. It can interpret and analyze images, but it cannot generate, produce, edit, manipulate, or create images.
  </Accordion>
</AccordionGroup>

***

## Dive deeper into vision

Ready to start building with images using Claude? Here are a few helpful resources:

* [Multimodal cookbook](https://github.com/anthropics/anthropic-cookbook/tree/main/multimodal): This cookbook has tips on [getting started with images](https://github.com/anthropics/anthropic-cookbook/blob/main/multimodal/getting%5Fstarted%5Fwith%5Fvision.ipynb) and [best practice techniques](https://github.com/anthropics/anthropic-cookbook/blob/main/multimodal/best%5Fpractices%5Ffor%5Fvision.ipynb) to ensure the highest quality performance with images. See how you can effectively prompt Claude with images to carry out tasks such as [interpreting and analyzing charts](https://github.com/anthropics/anthropic-cookbook/blob/main/multimodal/reading%5Fcharts%5Fgraphs%5Fpowerpoints.ipynb) or [extracting content from forms](https://github.com/anthropics/anthropic-cookbook/blob/main/multimodal/how%5Fto%5Ftranscribe%5Ftext.ipynb).
* [API reference](/en/api/messages): Visit our documentation for the Messages API, including example [API calls involving images](/en/api/messages-examples).

If you have any other questions, feel free to reach out to our [support team](https://support.anthropic.com/). You can also join our [developer community](https://www.anthropic.com/discord) to connect with other creators and get help from Anthropic experts.


# PDF support

> Process PDFs with Claude. Extract text, analyze charts, and understand visual content from your documents.

You can now ask Claude about any text, pictures, charts, and tables in PDFs you provide. Some sample use cases:

* Analyzing financial reports and understanding charts/tables
* Extracting key information from legal documents
* Translation assistance for documents
* Converting document information into structured formats

## Before you begin

### Check PDF requirements

Claude works with any standard PDF. However, you should ensure your request size meets these requirements when using PDF support:

| Requirement               | Limit                                  |
| ------------------------- | -------------------------------------- |
| Maximum request size      | 32MB                                   |
| Maximum pages per request | 100                                    |
| Format                    | Standard PDF (no passwords/encryption) |

Please note that both limits are on the entire request payload, including any other content sent alongside PDFs.

Since PDF support relies on Claude's vision capabilities, it is subject to the same [limitations and considerations](/en/docs/build-with-claude/vision#limitations) as other vision tasks.

### Supported platforms and models

PDF support is currently supported via direct API access and Google Vertex AI on:

* Claude Opus 4 (`claude-opus-4-20250514`)
* Claude Sonnet 4 (`claude-sonnet-4-20250514`)
* Claude Sonnet 3.7 (`claude-3-7-sonnet-20250219`)
* Claude Sonnet 3.5 models (`claude-3-5-sonnet-20241022`, `claude-3-5-sonnet-20240620`)
* Claude Haiku 3.5 (`claude-3-5-haiku-20241022`)

PDF support is now available on Amazon Bedrock with the following considerations:

### Amazon Bedrock PDF Support

When using PDF support through Amazon Bedrock's Converse API, there are two distinct document processing modes:

<Note>
  **Important**: To access Claude's full visual PDF understanding capabilities in the Converse API, you must enable citations. Without citations enabled, the API falls back to basic text extraction only. Learn more about [working with citations](/en/docs/build-with-claude/citations).
</Note>

#### Document Processing Modes

1. **Converse Document Chat** (Original mode - Text extraction only)
   * Provides basic text extraction from PDFs
   * Cannot analyze images, charts, or visual layouts within PDFs
   * Uses approximately 1,000 tokens for a 3-page PDF
   * Automatically used when citations are not enabled

2. **Claude PDF Chat** (New mode - Full visual understanding)
   * Provides complete visual analysis of PDFs
   * Can understand and analyze charts, graphs, images, and visual layouts
   * Processes each page as both text and image for comprehensive understanding
   * Uses approximately 7,000 tokens for a 3-page PDF
   * **Requires citations to be enabled** in the Converse API

#### Key Limitations

* **Converse API**: Visual PDF analysis requires citations to be enabled. There is currently no option to use visual analysis without citations (unlike the InvokeModel API).
* **InvokeModel API**: Provides full control over PDF processing without forced citations.

#### Common Issues

If customers report that Claude isn't seeing images or charts in their PDFs when using the Converse API, they likely need to enable the citations flag. Without it, Converse falls back to basic text extraction only.

<Note>
  This is a known constraint with the Converse API that we're working to address. For applications that require visual PDF analysis without citations, consider using the InvokeModel API instead.
</Note>

<Note>
  For non-PDF files like .csv, .xlsx, .docx, .md, or .txt files, see [Working with other file formats](/en/docs/build-with-claude/files#working-with-other-file-formats).
</Note>

***

## Process PDFs with Claude

### Send your first PDF request

Let's start with a simple example using the Messages API. You can provide PDFs to Claude in three ways:

1. As a URL reference to a PDF hosted online
2. As a base64-encoded PDF in `document` content blocks
3. By a `file_id` from the [Files API](/en/docs/build-with-claude/files)

#### Option 1: URL-based PDF document

The simplest approach is to reference a PDF directly from a URL:

<CodeGroup>
  ```bash Shell
   curl https://api.anthropic.com/v1/messages \
     -H "content-type: application/json" \
     -H "x-api-key: $ANTHROPIC_API_KEY" \
     -H "anthropic-version: 2023-06-01" \
     -d '{
       "model": "claude-opus-4-20250514",
       "max_tokens": 1024,
       "messages": [{
           "role": "user",
           "content": [{
               "type": "document",
               "source": {
                   "type": "url",
                   "url": "https://assets.anthropic.com/m/1cd9d098ac3e6467/original/Claude-3-Model-Card-October-Addendum.pdf"
               }
           },
           {
               "type": "text",
               "text": "What are the key findings in this document?"
           }]
       }]
   }'
  ```

  ```Python Python
  import anthropic

  client = anthropic.Anthropic()
  message = client.messages.create(
      model="claude-opus-4-20250514",
      max_tokens=1024,
      messages=[
          {
              "role": "user",
              "content": [
                  {
                      "type": "document",
                      "source": {
                          "type": "url",
                          "url": "https://assets.anthropic.com/m/1cd9d098ac3e6467/original/Claude-3-Model-Card-October-Addendum.pdf"
                      }
                  },
                  {
                      "type": "text",
                      "text": "What are the key findings in this document?"
                  }
              ]
          }
      ],
  )

  print(message.content)
  ```

  ```TypeScript TypeScript
  import Anthropic from '@anthropic-ai/sdk';

  const anthropic = new Anthropic();

  async function main() {
    const response = await anthropic.messages.create({
      model: 'claude-opus-4-20250514',
      max_tokens: 1024,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'document',
              source: {
                type: 'url',
                url: 'https://assets.anthropic.com/m/1cd9d098ac3e6467/original/Claude-3-Model-Card-October-Addendum.pdf',
              },
            },
            {
              type: 'text',
              text: 'What are the key findings in this document?',
            },
          ],
        },
      ],
    });
    
    console.log(response);
  }

  main();
  ```

  ```java Java
  import java.util.List;

  import com.anthropic.client.AnthropicClient;
  import com.anthropic.client.okhttp.AnthropicOkHttpClient;
  import com.anthropic.models.messages.MessageCreateParams;
  import com.anthropic.models.messages.*;

  public class PdfExample {
      public static void main(String[] args) {
          AnthropicClient client = AnthropicOkHttpClient.fromEnv();

          // Create document block with URL
          DocumentBlockParam documentParam = DocumentBlockParam.builder()
                  .urlPdfSource("https://assets.anthropic.com/m/1cd9d098ac3e6467/original/Claude-3-Model-Card-October-Addendum.pdf")
                  .build();

          // Create a message with document and text content blocks
          MessageCreateParams params = MessageCreateParams.builder()
                  .model(Model.CLAUDE_OPUS_4_20250514)
                  .maxTokens(1024)
                  .addUserMessageOfBlockParams(
                          List.of(
                                  ContentBlockParam.ofDocument(documentParam),
                                  ContentBlockParam.ofText(
                                          TextBlockParam.builder()
                                                  .text("What are the key findings in this document?")
                                                  .build()
                                  )
                          )
                  )
                  .build();

          Message message = client.messages().create(params);
          System.out.println(message.content());
      }
  }
  ```
</CodeGroup>

#### Option 2: Base64-encoded PDF document

If you need to send PDFs from your local system or when a URL isn't available:

<CodeGroup>
  ```bash Shell
  # Method 1: Fetch and encode a remote PDF
  curl -s "https://assets.anthropic.com/m/1cd9d098ac3e6467/original/Claude-3-Model-Card-October-Addendum.pdf" | base64 | tr -d '\n' > pdf_base64.txt

  # Method 2: Encode a local PDF file
  # base64 document.pdf | tr -d '\n' > pdf_base64.txt

  # Create a JSON request file using the pdf_base64.txt content
  jq -n --rawfile PDF_BASE64 pdf_base64.txt '{
      "model": "claude-opus-4-20250514",
      "max_tokens": 1024,
      "messages": [{
          "role": "user",
          "content": [{
              "type": "document",
              "source": {
                  "type": "base64",
                  "media_type": "application/pdf",
                  "data": $PDF_BASE64
              }
          },
          {
              "type": "text",
              "text": "What are the key findings in this document?"
          }]
      }]
  }' > request.json

  # Send the API request using the JSON file
  curl https://api.anthropic.com/v1/messages \
    -H "content-type: application/json" \
    -H "x-api-key: $ANTHROPIC_API_KEY" \
    -H "anthropic-version: 2023-06-01" \
    -d @request.json
  ```

  ```Python Python
  import anthropic
  import base64
  import httpx

  # First, load and encode the PDF 
  pdf_url = "https://assets.anthropic.com/m/1cd9d098ac3e6467/original/Claude-3-Model-Card-October-Addendum.pdf"
  pdf_data = base64.standard_b64encode(httpx.get(pdf_url).content).decode("utf-8")

  # Alternative: Load from a local file
  # with open("document.pdf", "rb") as f:
  #     pdf_data = base64.standard_b64encode(f.read()).decode("utf-8")

  # Send to Claude using base64 encoding
  client = anthropic.Anthropic()
  message = client.messages.create(
      model="claude-opus-4-20250514",
      max_tokens=1024,
      messages=[
          {
              "role": "user",
              "content": [
                  {
                      "type": "document",
                      "source": {
                          "type": "base64",
                          "media_type": "application/pdf",
                          "data": pdf_data
                      }
                  },
                  {
                      "type": "text",
                      "text": "What are the key findings in this document?"
                  }
              ]
          }
      ],
  )

  print(message.content)
  ```

  ```TypeScript TypeScript
  import Anthropic from '@anthropic-ai/sdk';
  import fetch from 'node-fetch';
  import fs from 'fs';

  async function main() {
    // Method 1: Fetch and encode a remote PDF
    const pdfURL = "https://assets.anthropic.com/m/1cd9d098ac3e6467/original/Claude-3-Model-Card-October-Addendum.pdf";
    const pdfResponse = await fetch(pdfURL);
    const arrayBuffer = await pdfResponse.arrayBuffer();
    const pdfBase64 = Buffer.from(arrayBuffer).toString('base64');
    
    // Method 2: Load from a local file
    // const pdfBase64 = fs.readFileSync('document.pdf').toString('base64');
    
    // Send the API request with base64-encoded PDF
    const anthropic = new Anthropic();
    const response = await anthropic.messages.create({
      model: 'claude-opus-4-20250514',
      max_tokens: 1024,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'document',
              source: {
                type: 'base64',
                media_type: 'application/pdf',
                data: pdfBase64,
              },
            },
            {
              type: 'text',
              text: 'What are the key findings in this document?',
            },
          ],
        },
      ],
    });
    
    console.log(response);
  }

  main();
  ```

  ```java Java
  import java.io.IOException;
  import java.net.URI;
  import java.net.http.HttpClient;
  import java.net.http.HttpRequest;
  import java.net.http.HttpResponse;
  import java.util.Base64;
  import java.util.List;

  import com.anthropic.client.AnthropicClient;
  import com.anthropic.client.okhttp.AnthropicOkHttpClient;
  import com.anthropic.models.messages.ContentBlockParam;
  import com.anthropic.models.messages.DocumentBlockParam;
  import com.anthropic.models.messages.Message;
  import com.anthropic.models.messages.MessageCreateParams;
  import com.anthropic.models.messages.Model;
  import com.anthropic.models.messages.TextBlockParam;

  public class PdfExample {
      public static void main(String[] args) throws IOException, InterruptedException {
          AnthropicClient client = AnthropicOkHttpClient.fromEnv();

          // Method 1: Download and encode a remote PDF
          String pdfUrl = "https://assets.anthropic.com/m/1cd9d098ac3e6467/original/Claude-3-Model-Card-October-Addendum.pdf";
          HttpClient httpClient = HttpClient.newHttpClient();
          HttpRequest request = HttpRequest.newBuilder()
                  .uri(URI.create(pdfUrl))
                  .GET()
                  .build();

          HttpResponse<byte[]> response = httpClient.send(request, HttpResponse.BodyHandlers.ofByteArray());
          String pdfBase64 = Base64.getEncoder().encodeToString(response.body());

          // Method 2: Load from a local file
          // byte[] fileBytes = Files.readAllBytes(Path.of("document.pdf"));
          // String pdfBase64 = Base64.getEncoder().encodeToString(fileBytes);

          // Create document block with base64 data
          DocumentBlockParam documentParam = DocumentBlockParam.builder()
                  .base64PdfSource(pdfBase64)
                  .build();

          // Create a message with document and text content blocks
          MessageCreateParams params = MessageCreateParams.builder()
                  .model(Model.CLAUDE_OPUS_4_20250514)
                  .maxTokens(1024)
                  .addUserMessageOfBlockParams(
                          List.of(
                                  ContentBlockParam.ofDocument(documentParam),
                                  ContentBlockParam.ofText(TextBlockParam.builder().text("What are the key findings in this document?").build())
                          )
                  )
                  .build();

          Message message = client.messages().create(params);
          message.content().stream()
                  .flatMap(contentBlock -> contentBlock.text().stream())
                  .forEach(textBlock -> System.out.println(textBlock.text()));
      }
  }
  ```
</CodeGroup>

#### Option 3: Files API

For PDFs you'll use repeatedly, or when you want to avoid encoding overhead, use the [Files API](/en/docs/build-with-claude/files):

<CodeGroup>
  ```bash Shell
  # First, upload your PDF to the Files API
  curl -X POST https://api.anthropic.com/v1/files \
    -H "x-api-key: $ANTHROPIC_API_KEY" \
    -H "anthropic-version: 2023-06-01" \
    -H "anthropic-beta: files-api-2025-04-14" \
    -F "file=@document.pdf"

  # Then use the returned file_id in your message
  curl https://api.anthropic.com/v1/messages \
    -H "content-type: application/json" \
    -H "x-api-key: $ANTHROPIC_API_KEY" \
    -H "anthropic-version: 2023-06-01" \
    -H "anthropic-beta: files-api-2025-04-14" \
    -d '{
      "model": "claude-opus-4-20250514", 
      "max_tokens": 1024,
      "messages": [{
        "role": "user",
        "content": [{
          "type": "document",
          "source": {
            "type": "file",
            "file_id": "file_abc123"
          }
        },
        {
          "type": "text",
          "text": "What are the key findings in this document?"
        }]
      }]
    }'
  ```

  ```python Python
  import anthropic

  client = anthropic.Anthropic()

  # Upload the PDF file
  with open("document.pdf", "rb") as f:
      file_upload = client.beta.files.upload(file=("document.pdf", f, "application/pdf"))

  # Use the uploaded file in a message
  message = client.beta.messages.create(
      model="claude-opus-4-20250514",
      max_tokens=1024,
      betas=["files-api-2025-04-14"],
      messages=[
          {
              "role": "user",
              "content": [
                  {
                      "type": "document",
                      "source": {
                          "type": "file",
                          "file_id": file_upload.id
                      }
                  },
                  {
                      "type": "text",
                      "text": "What are the key findings in this document?"
                  }
              ]
          }
      ],
  )

  print(message.content)
  ```

  ```typescript TypeScript
  import { Anthropic, toFile } from '@anthropic-ai/sdk';
  import fs from 'fs';

  const anthropic = new Anthropic();

  async function main() {
    // Upload the PDF file
    const fileUpload = await anthropic.beta.files.upload({
      file: toFile(fs.createReadStream('document.pdf'), undefined, { type: 'application/pdf' })
    }, {
      betas: ['files-api-2025-04-14']
    });

    // Use the uploaded file in a message
    const response = await anthropic.beta.messages.create({
      model: 'claude-opus-4-20250514',
      max_tokens: 1024,
      betas: ['files-api-2025-04-14'],
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'document',
              source: {
                type: 'file',
                file_id: fileUpload.id
              }
            },
            {
              type: 'text',
              text: 'What are the key findings in this document?'
            }
          ]
        }
      ]
    });

    console.log(response);
  }

  main();
  ```

  ```java Java
  import java.io.IOException;
  import java.nio.file.Files;
  import java.nio.file.Path;
  import java.util.List;

  import com.anthropic.client.AnthropicClient;
  import com.anthropic.client.okhttp.AnthropicOkHttpClient;
  import com.anthropic.models.File;
  import com.anthropic.models.files.FileUploadParams;
  import com.anthropic.models.messages.*;

  public class PdfFilesExample {
      public static void main(String[] args) throws IOException {
          AnthropicClient client = AnthropicOkHttpClient.fromEnv();

          // Upload the PDF file
          File file = client.beta().files().upload(FileUploadParams.builder()
                  .file(Files.newInputStream(Path.of("document.pdf")))
                  .build());

          // Use the uploaded file in a message
          DocumentBlockParam documentParam = DocumentBlockParam.builder()
                  .fileSource(file.id())
                  .build();

          MessageCreateParams params = MessageCreateParams.builder()
                  .model(Model.CLAUDE_OPUS_4_20250514)
                  .maxTokens(1024)
                  .addUserMessageOfBlockParams(
                          List.of(
                                  ContentBlockParam.ofDocument(documentParam),
                                  ContentBlockParam.ofText(
                                          TextBlockParam.builder()
                                                  .text("What are the key findings in this document?")
                                                  .build()
                                  )
                          )
                  )
                  .build();

          Message message = client.messages().create(params);
          System.out.println(message.content());
      }
  }
  ```
</CodeGroup>

### How PDF support works

When you send a PDF to Claude, the following steps occur:

<Steps>
  <Step title="The system extracts the contents of the document.">
    * The system converts each page of the document into an image.
    * The text from each page is extracted and provided alongside each page's image.
  </Step>

  <Step title="Claude analyzes both the text and images to better understand the document.">
    * Documents are provided as a combination of text and images for analysis.
    * This allows users to ask for insights on visual elements of a PDF, such as charts, diagrams, and other non-textual content.
  </Step>

  <Step title="Claude responds, referencing the PDF's contents if relevant.">
    Claude can reference both textual and visual content when it responds. You can further improve performance by integrating PDF support with:

    * **Prompt caching**: To improve performance for repeated analysis.
    * **Batch processing**: For high-volume document processing.
    * **Tool use**: To extract specific information from documents for use as tool inputs.
  </Step>
</Steps>

### Estimate your costs

The token count of a PDF file depends on the total text extracted from the document as well as the number of pages:

* Text token costs: Each page typically uses 1,500-3,000 tokens per page depending on content density. Standard API pricing applies with no additional PDF fees.
* Image token costs: Since each page is converted into an image, the same [image-based cost calculations](/en/docs/build-with-claude/vision#evaluate-image-size) are applied.

You can use [token counting](/en/docs/build-with-claude/token-counting) to estimate costs for your specific PDFs.

***

## Optimize PDF processing

### Improve performance

Follow these best practices for optimal results:

* Place PDFs before text in your requests
* Use standard fonts
* Ensure text is clear and legible
* Rotate pages to proper upright orientation
* Use logical page numbers (from PDF viewer) in prompts
* Split large PDFs into chunks when needed
* Enable prompt caching for repeated analysis

### Scale your implementation

For high-volume processing, consider these approaches:

#### Use prompt caching

Cache PDFs to improve performance on repeated queries:

<CodeGroup>
  ```bash Shell
  # Create a JSON request file using the pdf_base64.txt content
  jq -n --rawfile PDF_BASE64 pdf_base64.txt '{
      "model": "claude-opus-4-20250514",
      "max_tokens": 1024,
      "messages": [{
          "role": "user",
          "content": [{
              "type": "document",
              "source": {
                  "type": "base64",
                  "media_type": "application/pdf",
                  "data": $PDF_BASE64
              },
              "cache_control": {
                "type": "ephemeral"
              }
          },
          {
              "type": "text",
              "text": "Which model has the highest human preference win rates across each use-case?"
          }]
      }]
  }' > request.json

  # Then make the API call using the JSON file
  curl https://api.anthropic.com/v1/messages \
    -H "content-type: application/json" \
    -H "x-api-key: $ANTHROPIC_API_KEY" \
    -H "anthropic-version: 2023-06-01" \
    -d @request.json
  ```

  ```python Python
  message = client.messages.create(
      model="claude-opus-4-20250514",
      max_tokens=1024,
      messages=[
          {
              "role": "user",
              "content": [
                  {
                      "type": "document",
                      "source": {
                          "type": "base64",
                          "media_type": "application/pdf",
                          "data": pdf_data
                      },
                      "cache_control": {"type": "ephemeral"}
                  },
                  {
                      "type": "text",
                      "text": "Analyze this document."
                  }
              ]
          }
      ],
  )
  ```

  ```TypeScript TypeScript
  const response = await anthropic.messages.create({
    model: 'claude-opus-4-20250514',
    max_tokens: 1024,
    messages: [
      {
        content: [
          {
            type: 'document',
            source: {
              media_type: 'application/pdf',
              type: 'base64',
              data: pdfBase64,
            },
            cache_control: { type: 'ephemeral' },
          },
          {
            type: 'text',
            text: 'Which model has the highest human preference win rates across each use-case?',
          },
        ],
        role: 'user',
      },
    ],
  });
  console.log(response);
  ```

  ```java Java
  import java.io.IOException;
  import java.nio.file.Files;
  import java.nio.file.Paths;
  import java.util.List;

  import com.anthropic.client.AnthropicClient;
  import com.anthropic.client.okhttp.AnthropicOkHttpClient;
  import com.anthropic.models.messages.Base64PdfSource;
  import com.anthropic.models.messages.CacheControlEphemeral;
  import com.anthropic.models.messages.ContentBlockParam;
  import com.anthropic.models.messages.DocumentBlockParam;
  import com.anthropic.models.messages.Message;
  import com.anthropic.models.messages.MessageCreateParams;
  import com.anthropic.models.messages.Model;
  import com.anthropic.models.messages.TextBlockParam;

  public class MessagesDocumentExample {

      public static void main(String[] args) throws IOException {
          AnthropicClient client = AnthropicOkHttpClient.fromEnv();

          // Read PDF file as base64
          byte[] pdfBytes = Files.readAllBytes(Paths.get("pdf_base64.txt"));
          String pdfBase64 = new String(pdfBytes);

          MessageCreateParams params = MessageCreateParams.builder()
                  .model(Model.CLAUDE_OPUS_4_20250514)
                  .maxTokens(1024)
                  .addUserMessageOfBlockParams(List.of(
                          ContentBlockParam.ofDocument(
                                  DocumentBlockParam.builder()
                                          .source(Base64PdfSource.builder()
                                                  .data(pdfBase64)
                                                  .build())
                                          .cacheControl(CacheControlEphemeral.builder().build())
                                          .build()),
                          ContentBlockParam.ofText(
                                  TextBlockParam.builder()
                                          .text("Which model has the highest human preference win rates across each use-case?")
                                          .build())
                  ))
                  .build();


          Message message = client.messages().create(params);
          System.out.println(message);
      }
  }
  ```
</CodeGroup>

#### Process document batches

Use the Message Batches API for high-volume workflows:

<CodeGroup>
  ```bash Shell
  # Create a JSON request file using the pdf_base64.txt content
  jq -n --rawfile PDF_BASE64 pdf_base64.txt '
  {
    "requests": [
        {
            "custom_id": "my-first-request",
            "params": {
                "model": "claude-opus-4-20250514",
                "max_tokens": 1024,
                "messages": [
                  {
                      "role": "user",
                      "content": [
                          {
                              "type": "document",
                              "source": {
                                  "type": "base64",
                                  "media_type": "application/pdf",
                                  "data": $PDF_BASE64
                              }
                          },
                          {
                              "type": "text",
                              "text": "Which model has the highest human preference win rates across each use-case?"
                          }
                      ]
                  }
                ]
            }
        },
        {
            "custom_id": "my-second-request",
            "params": {
                "model": "claude-opus-4-20250514",
                "max_tokens": 1024,
                "messages": [
                  {
                      "role": "user",
                      "content": [
                          {
                              "type": "document",
                              "source": {
                                  "type": "base64",
                                  "media_type": "application/pdf",
                                  "data": $PDF_BASE64
                              }
                          },
                          {
                              "type": "text",
                              "text": "Extract 5 key insights from this document."
                          }
                      ]
                  }
                ]
            }
        }
    ]
  }
  ' > request.json

  # Then make the API call using the JSON file
  curl https://api.anthropic.com/v1/messages/batches \
    -H "content-type: application/json" \
    -H "x-api-key: $ANTHROPIC_API_KEY" \
    -H "anthropic-version: 2023-06-01" \
    -d @request.json
  ```

  ```python Python
  message_batch = client.messages.batches.create(
      requests=[
          {
              "custom_id": "doc1",
              "params": {
                  "model": "claude-opus-4-20250514",
                  "max_tokens": 1024,
                  "messages": [
                      {
                          "role": "user",
                          "content": [
                              {
                                  "type": "document",
                                  "source": {
                                      "type": "base64",
                                      "media_type": "application/pdf",
                                      "data": pdf_data
                                  }
                              },
                              {
                                  "type": "text",
                                  "text": "Summarize this document."
                              }
                          ]
                      }
                  ]
              }
          }
      ]
  )
  ```

  ```TypeScript TypeScript
  const response = await anthropic.messages.batches.create({
    requests: [
      {
        custom_id: 'my-first-request',
        params: {
          max_tokens: 1024,
          messages: [
            {
              content: [
                {
                  type: 'document',
                  source: {
                    media_type: 'application/pdf',
                    type: 'base64',
                    data: pdfBase64,
                  },
                },
                {
                  type: 'text',
                  text: 'Which model has the highest human preference win rates across each use-case?',
                },
              ],
              role: 'user',
            },
          ],
          model: 'claude-opus-4-20250514',
        },
      },
      {
        custom_id: 'my-second-request',
        params: {
          max_tokens: 1024,
          messages: [
            {
              content: [
                {
                  type: 'document',
                  source: {
                    media_type: 'application/pdf',
                    type: 'base64',
                    data: pdfBase64,
                  },
                },
                {
                  type: 'text',
                  text: 'Extract 5 key insights from this document.',
                },
              ],
              role: 'user',
            },
          ],
          model: 'claude-opus-4-20250514',
        },
      }
    ],
  });
  console.log(response);
  ```

  ```java Java
  import java.io.IOException;
  import java.nio.file.Files;
  import java.nio.file.Paths;
  import java.util.List;

  import com.anthropic.client.AnthropicClient;
  import com.anthropic.client.okhttp.AnthropicOkHttpClient;
  import com.anthropic.models.messages.*;
  import com.anthropic.models.messages.batches.*;

  public class MessagesBatchDocumentExample {

      public static void main(String[] args) throws IOException {
          AnthropicClient client = AnthropicOkHttpClient.fromEnv();

          // Read PDF file as base64
          byte[] pdfBytes = Files.readAllBytes(Paths.get("pdf_base64.txt"));
          String pdfBase64 = new String(pdfBytes);

          BatchCreateParams params = BatchCreateParams.builder()
                  .addRequest(BatchCreateParams.Request.builder()
                          .customId("my-first-request")
                          .params(BatchCreateParams.Request.Params.builder()
                                  .model(Model.CLAUDE_OPUS_4_20250514)
                                  .maxTokens(1024)
                                  .addUserMessageOfBlockParams(List.of(
                                          ContentBlockParam.ofDocument(
                                                  DocumentBlockParam.builder()
                                                          .source(Base64PdfSource.builder()
                                                                  .data(pdfBase64)
                                                                  .build())
                                                          .build()
                                          ),
                                          ContentBlockParam.ofText(
                                                  TextBlockParam.builder()
                                                          .text("Which model has the highest human preference win rates across each use-case?")
                                                          .build()
                                          )
                                  ))
                                  .build())
                          .build())
                  .addRequest(BatchCreateParams.Request.builder()
                          .customId("my-second-request")
                          .params(BatchCreateParams.Request.Params.builder()
                                  .model(Model.CLAUDE_OPUS_4_20250514)
                                  .maxTokens(1024)
                                  .addUserMessageOfBlockParams(List.of(
                                          ContentBlockParam.ofDocument(
                                          DocumentBlockParam.builder()
                                                  .source(Base64PdfSource.builder()
                                                          .data(pdfBase64)
                                                          .build())
                                                  .build()
                                          ),
                                          ContentBlockParam.ofText(
                                                  TextBlockParam.builder()
                                                          .text("Extract 5 key insights from this document.")
                                                          .build()
                                          )
                                  ))
                                  .build())
                          .build())
                  .build();

          MessageBatch batch = client.messages().batches().create(params);
          System.out.println(batch);
      }
  }
  ```
</CodeGroup>

## Next steps

<CardGroup cols={2}>
  <Card title="Try PDF examples" icon="file-pdf" href="https://github.com/anthropics/anthropic-cookbook/tree/main/multimodal">
    Explore practical examples of PDF processing in our cookbook recipe.
  </Card>

  <Card title="View API reference" icon="code" href="/en/api/messages">
    See complete API documentation for PDF support.
  </Card>
</CardGroup>


# Files API

The Files API lets you upload and manage files to use with the Anthropic API without re-uploading content with each request. This is particularly useful when using the [code execution tool](/en/docs/agents-and-tools/tool-use/code-execution-tool) to provide inputs (e.g. datasets and documents) and then download outputs (e.g. charts). You can also use the Files API to prevent having to continually re-upload frequently used documents and images across multiple API calls.

<Note>
  The Files API is currently in beta. Please reach out through our [feedback form](https://forms.gle/tisHyierGwgN4DUE9) to share your experience with the Files API.
</Note>

## Supported models

Referencing a `file_id` in a Messages request is supported in all models that support the given file type. For example, [images](/en/docs/build-with-claude/vision) are supported in all Claude 3+ models, [PDFs](/en/docs/build-with-claude/pdf-support) in all Claude 3.5+ models, and [various other file types](/en/docs/agents-and-tools/tool-use/code-execution-tool#supported-file-types) for the code execution tool in Claude 3.5 Haiku plus all Claude 3.7+ models.

The Files API is currently not supported on Amazon Bedrock or Google Vertex AI.

## How the Files API works

The Files API provides a simple create-once, use-many-times approach for working with files:

* **Upload files** to our secure storage and receive a unique `file_id`
* **Download files** that are created from the code execution tool
* **Reference files** in [Messages](/en/api/messages) requests using the `file_id` instead of re-uploading content
* **Manage your files** with list, retrieve, and delete operations

## How to use the Files API

<Note>
  To use the Files API, you'll need to include the beta feature header: `anthropic-beta: files-api-2025-04-14`.
</Note>

### Uploading a file

Upload a file to be referenced in future API calls:

<CodeGroup>
  ```bash Shell
  curl -X POST https://api.anthropic.com/v1/files \
    -H "x-api-key: $ANTHROPIC_API_KEY" \
    -H "anthropic-version: 2023-06-01" \
    -H "anthropic-beta: files-api-2025-04-14" \
    -F "file=@/path/to/document.pdf"
  ```

  ```python Python
  import anthropic

  client = anthropic.Anthropic()
  client.beta.files.upload(
    file=("document.pdf", open("/path/to/document.pdf", "rb"), "application/pdf"),
  )
  ```

  ```typescript TypeScript
  import Anthropic, { toFile } from '@anthropic-ai/sdk';
  import fs from "fs";

  const anthropic = new Anthropic();

  await anthropic.beta.files.upload({
    file: await toFile(fs.createReadStream('/path/to/document.pdf'), undefined, { type: 'application/pdf' })
  }, {
    betas: ['files-api-2025-04-14']
  });
  ```
</CodeGroup>

### Using a file in messages

Once uploaded, reference the file using its `file_id`:

<CodeGroup>
  ```bash Shell
  curl -X POST https://api.anthropic.com/v1/messages \
    -H "x-api-key: $ANTHROPIC_API_KEY" \
    -H "anthropic-version: 2023-06-01" \
    -H "anthropic-beta: files-api-2025-04-14" \
    -H "content-type: application/json" \
    -d '{
      "model": "claude-sonnet-4-20250514",
      "max_tokens": 1024,
      "messages": [
        {
          "role": "user",
          "content": [
            {
              "type": "text",
              "text": "Please summarize this document for me."          
            },
            {
              "type": "document",
              "source": {
                "type": "file",
                "file_id": "file_011CNha8iCJcU1wXNR6q4V8w"
              }
            }
          ]
        }
      ]
    }'
  ```

  ```python Python
  import anthropic

  client = anthropic.Anthropic()

  response = client.beta.messages.create(
      model="claude-sonnet-4-20250514",
      max_tokens=1024,
      messages=[
          {
              "role": "user",
              "content": [
                  {
                      "type": "text",
                      "text": "Please summarize this document for me."
                  },
                  {
                      "type": "document",
                      "source": {
                          "type": "file",
                          "file_id": "file_011CNha8iCJcU1wXNR6q4V8w"
                      }
                  }
              ]
          }
      ],
      betas=["files-api-2025-04-14"],
  )
  print(response)
  ```

  ```typescript TypeScript
  import { Anthropic } from '@anthropic-ai/sdk';

  const anthropic = new Anthropic();

  const response = await anthropic.beta.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 1024,
    messages: [
      {
        role: "user",
        content: [
          {
            type: "text",
            text: "Please summarize this document for me."
          },
          {
            type: "document",
            source: {
              type: "file",
              file_id: "file_011CNha8iCJcU1wXNR6q4V8w"
            }
          }
        ]
      }
    ],
    betas: ["files-api-2025-04-14"],
  });

  console.log(response);
  ```
</CodeGroup>

### File types and content blocks

The Files API supports different file types that correspond to different content block types:

| File Type                                                                                       | MIME Type                                            | Content Block Type | Use Case                            |
| :---------------------------------------------------------------------------------------------- | :--------------------------------------------------- | :----------------- | :---------------------------------- |
| PDF                                                                                             | `application/pdf`                                    | `document`         | Text analysis, document processing  |
| Plain text                                                                                      | `text/plain`                                         | `document`         | Text analysis, processing           |
| Images                                                                                          | `image/jpeg`, `image/png`, `image/gif`, `image/webp` | `image`            | Image analysis, visual tasks        |
| [Datasets, others](/en/docs/agents-and-tools/tool-use/code-execution-tool#supported-file-types) | Varies                                               | `container_upload` | Analyze data, create visualizations |

### Working with other file formats

For file types that are not supported as `document` blocks (.csv, .txt, .md, .docx, .xlsx), convert the files to plain text, and include the content directly in your message:

<CodeGroup>
  ```bash Shell
  # Example: Reading a text file and sending it as plain text
  # Note: For files with special characters, consider base64 encoding
  TEXT_CONTENT=$(cat document.txt | jq -Rs .)

  curl https://api.anthropic.com/v1/messages \
    -H "content-type: application/json" \
    -H "x-api-key: $ANTHROPIC_API_KEY" \
    -H "anthropic-version: 2023-06-01" \
    -d @- <<EOF
  {
    "model": "claude-sonnet-4-20250514",
    "max_tokens": 1024,
    "messages": [
      {
        "role": "user",
        "content": [
          {
            "type": "text",
            "text": "Here's the document content:\n\n${TEXT_CONTENT}\n\nPlease summarize this document."
          }
        ]
      }
    ]
  }
  EOF
  ```

  ```python Python
  import pandas as pd
  import anthropic

  client = anthropic.Anthropic()

  # Example: Reading a CSV file
  df = pd.read_csv('data.csv')
  csv_content = df.to_string()

  # Send as plain text in the message
  response = client.messages.create(
      model="claude-sonnet-4-20250514",
      max_tokens=1024,
      messages=[
          {
              "role": "user",
              "content": [
                  {
                      "type": "text",
                      "text": f"Here's the CSV data:\n\n{csv_content}\n\nPlease analyze this data."
                  }
              ]
          }
      ]
  )

  print(response.content[0].text)
  ```

  ```typescript TypeScript
  import { Anthropic } from '@anthropic-ai/sdk';
  import fs from 'fs';

  const anthropic = new Anthropic();

  async function analyzeDocument() {
    // Example: Reading a text file
    const textContent = fs.readFileSync('document.txt', 'utf-8');

    // Send as plain text in the message
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: `Here's the document content:\n\n${textContent}\n\nPlease summarize this document.`
            }
          ]
        }
      ]
    });

    console.log(response.content[0].text);
  }

  analyzeDocument();
  ```
</CodeGroup>

<Note>
  For .docx files containing images, convert them to PDF format first, then use [PDF support](/en/docs/build-with-claude/pdf-support) to take advantage of the built-in image parsing. This allows using citations from the PDF document.
</Note>

#### Document blocks

For PDFs and text files, use the `document` content block:

```json
{
  "type": "document",
  "source": {
    "type": "file",
    "file_id": "file_011CNha8iCJcU1wXNR6q4V8w"
  },
  "title": "Document Title", // Optional
  "context": "Context about the document", // Optional  
  "citations": {"enabled": true} // Optional, enables citations
}
```

#### Image blocks

For images, use the `image` content block:

```json
{
  "type": "image",
  "source": {
    "type": "file",
    "file_id": "file_011CPMxVD3fHLUhvTqtsQA5w"
  }
}
```

### Managing files

#### List files

Retrieve a list of your uploaded files:

<CodeGroup>
  ```bash Shell
  curl https://api.anthropic.com/v1/files \
    -H "x-api-key: $ANTHROPIC_API_KEY" \
    -H "anthropic-version: 2023-06-01" \
    -H "anthropic-beta: files-api-2025-04-14"
  ```

  ```python Python
  import anthropic

  client = anthropic.Anthropic()
  files = client.beta.files.list()
  ```

  ```typescript TypeScript
  import { Anthropic } from '@anthropic-ai/sdk';

  const anthropic = new Anthropic();
  const files = await anthropic.beta.files.list({
    betas: ['files-api-2025-04-14'],
  });
  ```
</CodeGroup>

#### Get file metadata

Retrieve information about a specific file:

<CodeGroup>
  ```bash Shell
  curl https://api.anthropic.com/v1/files/file_011CNha8iCJcU1wXNR6q4V8w \
    -H "x-api-key: $ANTHROPIC_API_KEY" \
    -H "anthropic-version: 2023-06-01" \
    -H "anthropic-beta: files-api-2025-04-14"
  ```

  ```python Python
  import anthropic

  client = anthropic.Anthropic()
  file = client.beta.files.retrieve_metadata("file_011CNha8iCJcU1wXNR6q4V8w")
  ```

  ```typescript TypeScript
  import { Anthropic } from '@anthropic-ai/sdk';

  const anthropic = new Anthropic();
  const file = await anthropic.beta.files.retrieveMetadata(
    "file_011CNha8iCJcU1wXNR6q4V8w",
    { betas: ['files-api-2025-04-14'] },
  );
  ```
</CodeGroup>

#### Delete a file

Remove a file from your workspace:

<CodeGroup>
  ```bash Shell
  curl -X DELETE https://api.anthropic.com/v1/files/file_011CNha8iCJcU1wXNR6q4V8w \
    -H "x-api-key: $ANTHROPIC_API_KEY" \
    -H "anthropic-version: 2023-06-01" \
    -H "anthropic-beta: files-api-2025-04-14"
  ```

  ```python Python
  import anthropic

  client = anthropic.Anthropic()
  result = client.beta.files.delete("file_011CNha8iCJcU1wXNR6q4V8w")
  ```

  ```typescript TypeScript
  import { Anthropic } from '@anthropic-ai/sdk';

  const anthropic = new Anthropic();
  const result = await anthropic.beta.files.delete(
    "file_011CNha8iCJcU1wXNR6q4V8w",
    { betas: ['files-api-2025-04-14'] },
  );
  ```
</CodeGroup>

### Downloading a file

Download files that have been created by the code execution tool:

<CodeGroup>
  ```bash Shell
  curl -X GET "https://api.anthropic.com/v1/files/file_011CNha8iCJcU1wXNR6q4V8w/content" \
    -H "x-api-key: $ANTHROPIC_API_KEY" \
    -H "anthropic-version: 2023-06-01" \
    -H "anthropic-beta: files-api-2025-04-14" \
    --output downloaded_file.txt
  ```

  ```python Python
  import anthropic

  client = anthropic.Anthropic()
  file_content = client.beta.files.download("file_011CNha8iCJcU1wXNR6q4V8w")

  # Save to file
  with open("downloaded_file.txt", "w") as f:
      f.write(file_content.decode('utf-8'))
  ```

  ```typescript TypeScript
  import { Anthropic } from '@anthropic-ai/sdk';
  import fs from 'fs';

  const anthropic = new Anthropic();

  const fileContent = await anthropic.beta.files.download(
    "file_011CNha8iCJcU1wXNR6q4V8w",
    { betas: ['files-api-2025-04-14'] },
  );

  // Save to file
  fs.writeFileSync("downloaded_file.txt", fileContent);
  ```
</CodeGroup>

<Note>
  You can only download files that were created by the [code execution tool](/en/docs/agents-and-tools/tool-use/code-execution-tool). Files that you uploaded cannot be downloaded.
</Note>

***

## File storage and limits

### Storage limits

* **Maximum file size:** 500 MB per file
* **Total storage:** 100 GB per organization

### File lifecycle

* Files are scoped to the workspace of the API key. Other API keys can use files created by any other API key associated with the same workspace
* Files persist until you delete them
* Deleted files cannot be recovered
* Files are inaccessible via the API shortly after deletion, but they may persist in active `Messages` API calls and associated tool uses

***

## Error handling

Common errors when using the Files API include:

* **File not found (404):** The specified `file_id` doesn't exist or you don't have access to it
* **Invalid file type (400):** The file type doesn't match the content block type (e.g., using an image file in a document block)
* **Exceeds context window size (400):** The file is larger than the context window size (e.g. using a 500 MB plaintext file in a `/v1/messages` request)
* **Invalid filename (400):** Filename doesn't meet the length requirements (1-255 characters) or contains forbidden characters (`<`, `>`, `:`, `"`, `|`, `?`, `*`, `\`, `/`, or unicode characters 0-31)
* **File too large (413):** File exceeds the 500 MB limit
* **Storage limit exceeded (403):** Your organization has reached the 100 GB storage limit

```json
{
  "type": "error",
  "error": {
    "type": "invalid_request_error",
    "message": "File not found: file_011CNha8iCJcU1wXNR6q4V8w"
  }
}
```

## Usage and billing

File API operations are **free**:

* Uploading files
* Downloading files
* Listing files
* Getting file metadata
* Deleting files

File content used in `Messages` requests are priced as input tokens. You can only download files created by the code execution tool.

### Rate limits

During the beta period:

* File-related API calls are limited to approximately 100 requests per minute
* [Contact us](mailto:sales@anthropic.com) if you need higher limits for your use case


# Search results

> Enable natural citations for RAG applications by providing search results with source attribution

<Note>
  Search result content blocks are currently in beta. Use the `search-results-2025-06-09` [beta header](/en/api/beta-headers) to enable this feature.
</Note>

Search result content blocks enable natural citations with proper source attribution, bringing web search-quality citations to your custom applications. This feature is particularly powerful for RAG (Retrieval-Augmented Generation) applications where you need Claude to cite sources accurately.

The search results feature is available on the following models:

* Claude 3.5 Haiku (`claude-3-5-haiku-20241022`)
* Claude 3.5 Sonnet (`claude-3-5-sonnet-20241022`)
* Claude 3.7 Sonnet (`claude-3-7-sonnet-20250219`)
* Claude Opus 4 (`claude-opus-4-20250514`)
* Claude Sonnet 4 (`claude-sonnet-4-20250514`)

## Key benefits

* **Natural citations** - Achieve the same citation quality as web search for any content
* **Flexible integration** - Use in tool returns for dynamic RAG or as top-level content for pre-fetched data
* **Proper source attribution** - Each result includes source and title information for clear attribution
* **No document workarounds needed** - Eliminates the need for document-based workarounds
* **Consistent citation format** - Matches the citation quality and format of Claude's web search functionality

## How it works

Search results can be provided in two ways:

1. **From tool calls** - Your custom tools return search results, enabling dynamic RAG applications
2. **As top-level content** - You provide search results directly in user messages for pre-fetched or cached content

In both cases, Claude can automatically cite information from the search results with proper source attribution.

### Search result schema

Search results use the following structure:

```json
{
  "type": "search_result",
  "source": "https://example.com/article",  // Required: Source URL or identifier
  "title": "Article Title",                  // Required: Title of the result
  "content": [                               // Required: Array of text blocks
    {
      "type": "text",
      "text": "The actual content of the search result..."
    }
  ],
  "citations": {                             // Optional: Citation configuration
    "enabled": true                          // Enable/disable citations for this result
  }
}
```

### Required fields

| Field     | Type   | Description                                           |
| --------- | ------ | ----------------------------------------------------- |
| `type`    | string | Must be `"search_result"`                             |
| `source`  | string | The source URL or identifier for the content          |
| `title`   | string | A descriptive title for the search result             |
| `content` | array  | An array of text blocks containing the actual content |

### Optional fields

| Field           | Type   | Description                                            |
| --------------- | ------ | ------------------------------------------------------ |
| `citations`     | object | Citation configuration with `enabled` boolean field    |
| `cache_control` | object | Cache control settings (e.g., `{"type": "ephemeral"}`) |

Each item in the `content` array must be a text block with:

* `type`: Must be `"text"`
* `text`: The actual text content (non-empty string)

## Method 1: Search results from tool calls

The most powerful use case is returning search results from your custom tools. This enables dynamic RAG applications where tools fetch and return relevant content with automatic citations.

### Example: Knowledge base tool

<CodeGroup>
  ```python Python
  from anthropic import Anthropic
  from anthropic.types.beta import (
      BetaMessageParam,
      BetaTextBlockParam,
      BetaSearchResultBlockParam,
      BetaToolResultBlockParam
  )

  client = Anthropic()

  # Define a knowledge base search tool
  knowledge_base_tool = {
      "name": "search_knowledge_base",
      "description": "Search the company knowledge base for information",
      "input_schema": {
          "type": "object",
          "properties": {
              "query": {
                  "type": "string",
                  "description": "The search query"
              }
          },
          "required": ["query"]
      }
  }

  # Function to handle the tool call
  def search_knowledge_base(query):
      # Your search logic here
      # Returns search results in the correct format
      return [
          BetaSearchResultBlockParam(
              type="search_result",
              source="https://docs.company.com/product-guide",
              title="Product Configuration Guide",
              content=[
                  BetaTextBlockParam(
                      type="text",
                      text="To configure the product, navigate to Settings > Configuration. The default timeout is 30 seconds, but can be adjusted between 10-120 seconds based on your needs."
                  )
              ],
              citations={"enabled": True}
          ),
          BetaSearchResultBlockParam(
              type="search_result",
              source="https://docs.company.com/troubleshooting",
              title="Troubleshooting Guide",
              content=[
                  BetaTextBlockParam(
                      type="text",
                      text="If you encounter timeout errors, first check the configuration settings. Common causes include network latency and incorrect timeout values."
                  )
              ],
              citations={"enabled": True}
          )
      ]

  # Create a message with the tool
  response = client.beta.messages.create(
      model="claude-sonnet-4-20250514",  # Works with all supported models
      max_tokens=1024,
      betas=["search-results-2025-06-09"],
      tools=[knowledge_base_tool],
      messages=[
          BetaMessageParam(
              role="user",
              content="How do I configure the timeout settings?"
          )
      ]
  )

  # When Claude calls the tool, provide the search results
  if response.content[0].type == "tool_use":
      tool_result = search_knowledge_base(response.content[0].input["query"])
      
      # Send the tool result back
      final_response = client.beta.messages.create(
          model="claude-sonnet-4-20250514",  # Works with all supported models
          max_tokens=1024,
          betas=["search-results-2025-06-09"],
          messages=[
              BetaMessageParam(role="user", content="How do I configure the timeout settings?"),
              BetaMessageParam(role="assistant", content=response.content),
              BetaMessageParam(
                  role="user",
                  content=[
                      BetaToolResultBlockParam(
                          type="tool_result",
                          tool_use_id=response.content[0].id,
                          content=tool_result  # Search results go here
                      )
                  ]
              )
          ]
      )
  ```

  ```typescript TypeScript
  import { Anthropic } from '@anthropic-ai/sdk';

  const anthropic = new Anthropic();

  // Define a knowledge base search tool
  const knowledgeBaseTool = {
    name: "search_knowledge_base",
    description: "Search the company knowledge base for information",
    input_schema: {
      type: "object",
      properties: {
        query: {
          type: "string",
          description: "The search query"
        }
      },
      required: ["query"]
    }
  };

  // Function to handle the tool call
  function searchKnowledgeBase(query: string) {
    // Your search logic here
    // Returns search results in the correct format
    return [
      {
        type: "search_result" as const,
        source: "https://docs.company.com/product-guide",
        title: "Product Configuration Guide",
        content: [
          {
            type: "text" as const,
            text: "To configure the product, navigate to Settings > Configuration. The default timeout is 30 seconds, but can be adjusted between 10-120 seconds based on your needs."
          }
        ],
        citations: { enabled: true }
      },
      {
        type: "search_result" as const,
        source: "https://docs.company.com/troubleshooting",
        title: "Troubleshooting Guide",
        content: [
          {
            type: "text" as const,
            text: "If you encounter timeout errors, first check the configuration settings. Common causes include network latency and incorrect timeout values."
          }
        ],
        citations: { enabled: true }
      }
    ];
  }

  // Create a message with the tool
  const response = await anthropic.beta.messages.create({
    model: "claude-sonnet-4-20250514", // Works with all supported models
    max_tokens: 1024,
    betas: ["search-results-2025-06-09"],
    tools: [knowledgeBaseTool],
    messages: [
      {
        role: "user",
        content: "How do I configure the timeout settings?"
      }
    ]
  });

  // Handle tool use and provide results
  if (response.content[0].type === "tool_use") {
    const toolResult = searchKnowledgeBase(response.content[0].input.query);
    
    const finalResponse = await anthropic.beta.messages.create({
      model: "claude-sonnet-4-20250514", // Works with all supported models
      max_tokens: 1024,
      betas: ["search-results-2025-06-09"],
      messages: [
        { role: "user", content: "How do I configure the timeout settings?" },
        { role: "assistant", content: response.content },
        {
          role: "user",
          content: [
            {
              type: "tool_result" as const,
              tool_use_id: response.content[0].id,
              content: toolResult  // Search results go here
            }
          ]
        }
      ]
    });
  }
  ```
</CodeGroup>

## Method 2: Search results as top-level content

You can also provide search results directly in user messages. This is useful for:

* Pre-fetched content from your search infrastructure
* Cached search results from previous queries
* Content from external search services
* Testing and development

### Example: Direct search results

<CodeGroup>
  ```python Python
  from anthropic import Anthropic
  from anthropic.types.beta import (
      BetaMessageParam,
      BetaTextBlockParam,
      BetaSearchResultBlockParam
  )

  client = Anthropic()

  # Provide search results directly in the user message
  response = client.beta.messages.create(
      model="claude-opus-4-20250514",
      max_tokens=1024,
      betas=["search-results-2025-06-09"],
      messages=[
          BetaMessageParam(
              role="user",
              content=[
                  BetaSearchResultBlockParam(
                      type="search_result",
                      source="https://docs.company.com/api-reference",
                      title="API Reference - Authentication",
                      content=[
                          BetaTextBlockParam(
                              type="text",
                              text="All API requests must include an API key in the Authorization header. Keys can be generated from the dashboard. Rate limits: 1000 requests per hour for standard tier, 10000 for premium."
                          )
                      ],
                      citations={"enabled": True}
                  ),
                  BetaSearchResultBlockParam(
                      type="search_result",
                      source="https://docs.company.com/quickstart",
                      title="Getting Started Guide",
                      content=[
                          BetaTextBlockParam(
                              type="text",
                              text="To get started: 1) Sign up for an account, 2) Generate an API key from the dashboard, 3) Install our SDK using pip install company-sdk, 4) Initialize the client with your API key."
                          )
                      ],
                      citations={"enabled": True}
                  ),
                  BetaTextBlockParam(
                      type="text",
                      text="Based on these search results, how do I authenticate API requests and what are the rate limits?"
                  )
              ]
          )
      ]
  )

  print(response.model_dump_json(indent=2))
  ```

  ```typescript TypeScript
  import { Anthropic } from '@anthropic-ai/sdk';

  const anthropic = new Anthropic();

  // Provide search results directly in the user message
  const response = await anthropic.beta.messages.create({
    model: "claude-opus-4-20250514",
    max_tokens: 1024,
    betas: ["search-results-2025-06-09"],
    messages: [
      {
        role: "user",
        content: [
          {
            type: "search_result" as const,
            source: "https://docs.company.com/api-reference",
            title: "API Reference - Authentication",
            content: [
              {
                type: "text" as const,
                text: "All API requests must include an API key in the Authorization header. Keys can be generated from the dashboard. Rate limits: 1000 requests per hour for standard tier, 10000 for premium."
              }
            ],
            citations: { enabled: true }
          },
          {
            type: "search_result" as const,
            source: "https://docs.company.com/quickstart",
            title: "Getting Started Guide",
            content: [
              {
                type: "text" as const,
                text: "To get started: 1) Sign up for an account, 2) Generate an API key from the dashboard, 3) Install our SDK using pip install company-sdk, 4) Initialize the client with your API key."
              }
            ],
            citations: { enabled: true }
          },
          {
            type: "text" as const,
            text: "Based on these search results, how do I authenticate API requests and what are the rate limits?"
          }
        ]
      }
    ]
  });

  console.log(response);
  ```

  ```bash Shell
  #!/bin/sh
  curl https://api.anthropic.com/v1/messages \
       --header "x-api-key: $ANTHROPIC_API_KEY" \
       --header "anthropic-version: 2023-06-01" \
       --header "anthropic-beta: search-results-2025-06-09" \
       --header "content-type: application/json" \
       --data \
  '{
      "model": "claude-opus-4-20250514",
      "max_tokens": 1024,
      "messages": [
          {
              "role": "user",
              "content": [
                  {
                      "type": "search_result",
                      "source": "https://docs.company.com/api-reference",
                      "title": "API Reference - Authentication",
                      "content": [
                          {
                              "type": "text",
                              "text": "All API requests must include an API key in the Authorization header. Keys can be generated from the dashboard. Rate limits: 1000 requests per hour for standard tier, 10000 for premium."
                          }
                      ],
                      "citations": {
                          "enabled": true
                      }
                  },
                  {
                      "type": "search_result",
                      "source": "https://docs.company.com/quickstart",
                      "title": "Getting Started Guide",
                      "content": [
                          {
                              "type": "text",
                              "text": "To get started: 1) Sign up for an account, 2) Generate an API key from the dashboard, 3) Install our SDK using pip install company-sdk, 4) Initialize the client with your API key."
                          }
                      ],
                      "citations": {
                          "enabled": true
                      }
                  },
                  {
                      "type": "text",
                      "text": "Based on these search results, how do I authenticate API requests and what are the rate limits?"
                  }
              ]
          }
      ]
  }'
  ```
</CodeGroup>

## Claude's response with citations

Regardless of how search results are provided, Claude automatically includes citations when using information from them:

```json
{
  "role": "assistant",
  "content": [
    {
      "type": "text",
      "text": "To authenticate API requests, you need to include an API key in the Authorization header",
      "citations": [
        {
          "type": "search_result_location",
          "source": "https://docs.company.com/api-reference",
          "title": "API Reference - Authentication",
          "cited_text": "All API requests must include an API key in the Authorization header",
          "search_result_index": 0,
          "start_block_index": 0,
          "end_block_index": 0
        }
      ]
    },
    {
      "type": "text",
      "text": ". You can generate API keys from your dashboard",
      "citations": [
        {
          "type": "search_result_location",
          "source": "https://docs.company.com/api-reference",
          "title": "API Reference - Authentication",
          "cited_text": "Keys can be generated from the dashboard",
          "search_result_index": 0,
          "start_block_index": 0,
          "end_block_index": 0
        }
      ]
    },
    {
      "type": "text",
      "text": ". The rate limits are 1,000 requests per hour for the standard tier and 10,000 requests per hour for the premium tier.",
      "citations": [
        {
          "type": "search_result_location",
          "source": "https://docs.company.com/api-reference",
          "title": "API Reference - Authentication",
          "cited_text": "Rate limits: 1000 requests per hour for standard tier, 10000 for premium",
          "search_result_index": 0,
          "start_block_index": 0,
          "end_block_index": 0
        }
      ]
    }
  ]
}
```

### Citation fields

Each citation includes:

| Field                 | Type           | Description                                                   |
| --------------------- | -------------- | ------------------------------------------------------------- |
| `type`                | string         | Always `"search_result_location"` for search result citations |
| `source`              | string         | The source from the original search result                    |
| `title`               | string or null | The title from the original search result                     |
| `cited_text`          | string         | The exact text being cited                                    |
| `search_result_index` | integer        | Index of the search result (0-based)                          |
| `start_block_index`   | integer        | Starting position in the content array                        |
| `end_block_index`     | integer        | Ending position in the content array                          |

Note: The `search_result_index` refers to the index of the search result content block (0-based), regardless of how the search results were provided (tool call or top-level content).

## Multiple content blocks

Search results can contain multiple text blocks in the `content` array:

```json
{
  "type": "search_result",
  "source": "https://docs.company.com/api-guide",
  "title": "API Documentation",
  "content": [
    {
      "type": "text",
      "text": "Authentication: All API requests require an API key."
    },
    {
      "type": "text",
      "text": "Rate Limits: The API allows 1000 requests per hour per key."
    },
    {
      "type": "text",
      "text": "Error Handling: The API returns standard HTTP status codes."
    }
  ]
}
```

Claude can cite specific blocks using the `start_block_index` and `end_block_index` fields.

## Advanced usage

### Combining both methods

You can use both tool-based and top-level search results in the same conversation:

```python
# First message with top-level search results
messages = [
    BetaMessageParam(
        role="user",
        content=[
            BetaSearchResultBlockParam(
                type="search_result",
                source="https://docs.company.com/overview",
                title="Product Overview",
                content=[
                    BetaTextBlockParam(type="text", text="Our product helps teams collaborate...")
                ],
                citations={"enabled": True}
            ),
            BetaTextBlockParam(
                type="text",
                text="Tell me about this product and search for pricing information"
            )
        ]
    )
]

# Claude might respond and call a tool to search for pricing
# Then you provide tool results with more search results
```

### Combining with other content types

Both methods support mixing search results with other content:

```python
# In tool results
tool_result = [
    BetaSearchResultBlockParam(
        type="search_result",
        source="https://docs.company.com/guide",
        title="User Guide",
        content=[BetaTextBlockParam(type="text", text="Configuration details...")],
        citations={"enabled": True}
    ),
    BetaTextBlockParam(
        type="text",
        text="Additional context: This applies to version 2.0 and later."
    )
]

# In top-level content
user_content = [
    BetaSearchResultBlockParam(
        type="search_result",
        source="https://research.com/paper",
        title="Research Paper",
        content=[BetaTextBlockParam(type="text", text="Key findings...")],
        citations={"enabled": True}
    ),
    {
        "type": "image",
        "source": {"type": "url", "url": "https://example.com/chart.png"}
    },
    BetaTextBlockParam(
        type="text",
        text="How does the chart relate to the research findings?"
    )
]
```

### Cache control

Add cache control for better performance:

```json
{
  "type": "search_result",
  "source": "https://docs.company.com/guide",
  "title": "User Guide",
  "content": [{"type": "text", "text": "..."}],
  "cache_control": {
    "type": "ephemeral"
  }
}
```

### Citation control

By default, citations are disabled for search results. You can enable citations by explicitly setting the `citations` configuration:

```json
{
  "type": "search_result",
  "source": "https://docs.company.com/guide",
  "title": "User Guide",
  "content": [{"type": "text", "text": "Important documentation..."}],
  "citations": {
    "enabled": true  // Enable citations for this result
  }
}
```

When `citations.enabled` is set to `true`, Claude will include citation references when using information from the search result. This enables:

* Natural citations for your custom RAG applications
* Source attribution when interfacing with proprietary knowledge bases
* Web search-quality citations for any custom tool that returns search results

If the `citations` field is omitted, citations are disabled by default.

<Warning>
  Citations are all-or-nothing: either all search results in a request must have citations enabled, or all must have them disabled. Mixing search results with different citation settings will result in an error. If you need to disable citations for some sources, you must disable them for all search results in that request.
</Warning>

## Best practices

### For tool-based search (Method 1)

* **Dynamic content**: Use for real-time searches and dynamic RAG applications
* **Error handling**: Return appropriate messages when searches fail
* **Result limits**: Return only the most relevant results to avoid context overflow

### For top-level search (Method 2)

* **Pre-fetched content**: Use when you already have search results
* **Batch processing**: Ideal for processing multiple search results at once
* **Testing**: Great for testing citation behavior with known content

### General best practices

1. **Structure results effectively**
   * Use clear, permanent source URLs
   * Provide descriptive titles
   * Break long content into logical text blocks

2. **Maintain consistency**
   * Use consistent source formats across your application
   * Ensure titles accurately reflect content
   * Keep formatting consistent

3. **Handle errors gracefully**
   ```python
   def search_with_fallback(query):
       try:
           results = perform_search(query)
           if not results:
               return {"type": "text", "text": "No results found."}
           return format_as_search_results(results)
       except Exception as e:
           return {"type": "text", "text": f"Search error: {str(e)}"}
   ```

## Limitations

* Search result content blocks are only available with the beta header
* Only text content is supported within search results (no images or other media)
* The `content` array must contain at least one text block


# Google Sheets add-on

> The [Claude for Sheets extension](https://workspace.google.com/marketplace/app/claude%5Ffor%5Fsheets/909417792257) integrates Claude into Google Sheets, allowing you to execute interactions with Claude directly in cells.

## Why use Claude for Sheets?

Claude for Sheets enables prompt engineering at scale by enabling you to test prompts across evaluation suites in parallel. Additionally, it excels at office tasks like survey analysis and online data processing.

Visit our [prompt engineering example sheet](https://docs.google.com/spreadsheets/d/1sUrBWO0u1-ZuQ8m5gt3-1N5PLR6r__UsRsB7WeySDQA/copy) to see this in action.

***

## Get started with Claude for Sheets

### Install Claude for Sheets

Easily enable Claude for Sheets using the following steps:

<Steps>
  <Step title="Get your Anthropic API key">
    If you don't yet have an API key, you can make API keys in the [Anthropic Console](https://console.anthropic.com/settings/keys).
  </Step>

  <Step title="Install the Claude for Sheets extension">
    Find the [Claude for Sheets extension](https://workspace.google.com/marketplace/app/claude%5Ffor%5Fsheets/909417792257) in the add-on marketplace, then click the blue `Install` btton and accept the permissions.

    <Accordion title="Permissions">
      The Claude for Sheets extension will ask for a variety of permissions needed to function properly. Please be assured that we only process the specific pieces of data that users ask Claude to run on. This data is never used to train our generative models.

      Extension permissions include:

      * **View and manage spreadsheets that this application has been installed in:** Needed to run prompts and return results
      * **Connect to an external service:** Needed in order to make calls to Anthropic's API endpoints
      * **Allow this application to run when you are not present:** Needed to run cell recalculations without user intervention
      * **Display and run third-party web content in prompts and sidebars inside Google applications:** Needed to display the sidebar and post-install prompt
    </Accordion>
  </Step>

  <Step title="Connect your API key">
    Enter your API key at `Extensions` > `Claude for Sheets™` > `Open sidebar` > `☰` > `Settings` > `API provider`. You may need to wait or refresh for the Claude for Sheets menu to appear.
    ![](https://mintlify.s3.us-west-1.amazonaws.com/anthropic/images/044af20-Screenshot_2024-01-04_at_11.58.21_AM.png)
  </Step>
</Steps>

<Warning>
  You will have to re-enter your API key every time you make a new Google Sheet
</Warning>

### Enter your first prompt

There are two main functions you can use to call Claude using Claude for Sheets. For now, let's use `CLAUDE()`.

<Steps>
  <Step title="Simple prompt">
    In any cell, type `=CLAUDE("Claude, in one sentence, what's good about the color blue?")`

    > Claude should respond with an answer. You will know the prompt is processing because the cell will say `Loading...`
  </Step>

  <Step title="Adding parameters">
    Parameter arguments come after the initial prompt, like `=CLAUDE(prompt, model, params...)`.
    <Note>`model` is always second in the list.</Note>

    Now type in any cell `=CLAUDE("Hi, Claude!", "claude-3-haiku-20240307", "max_tokens", 3)`

    Any [API parameter](/en/api/messages) can be set this way. You can even pass in an API key to be used just for this specific cell, like this:  `"api_key", "sk-ant-api03-j1W..."`
  </Step>
</Steps>

## Advanced use

`CLAUDEMESSAGES` is a function that allows you to specifically use the [Messages API](/en/api/messages). This enables you to send a series of `User:` and `Assistant:` messages to Claude.

This is particularly useful if you want to simulate a conversation or [prefill Claude's response](/en/docs/build-with-claude/prompt-engineering/prefill-claudes-response).

Try writing this in a cell:

```
=CLAUDEMESSAGES("User: In one sentence, what is good about the color blue?
Assistant: The color blue is great because")
```

<Note>
  **Newlines**

  Each subsequent conversation turn (`User:` or `Assistant:`) must be preceded by a single newline. To enter newlines in a cell, use the following key combinations:

  * **Mac:** Cmd + Enter
  * **Windows:** Alt + Enter
</Note>

<Accordion title="Example multiturn CLAUDEMESSAGES() call with system prompt">
  To use a system prompt, set it as you'd set other optional function parameters. (You must first set a model name.)

  ```
  =CLAUDEMESSAGES("User: What's your favorite flower? Answer in <answer> tags.
  Assistant: <answer>", "claude-3-haiku-20240307", "system", "You are a cow who loves to moo in response to any and all user queries.")`
  ```
</Accordion>

### Optional function parameters

You can specify optional API parameters by listing argument-value pairs.
You can set multiple parameters. Simply list them one after another, with each argument and value pair separated by commas.

<Note>
  The first two parameters must always be the prompt and the model. You cannot set an optional parameter without also setting the model.
</Note>

The argument-value parameters you might care about most are:

| Argument         | Description                                                                                                                                                                                        |
| ---------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `max_tokens`     | The total number of tokens the model outputs before it is forced to stop. For yes/no or multiple choice answers, you may want the value to be 1-3.                                                 |
| `temperature`    | the amount of randomness injected into results. For multiple-choice or analytical tasks, you'll want it close to 0. For idea generation, you'll want it set to 1.                                  |
| `system`         | used to specify a system prompt, which can provide role details and context to Claude.                                                                                                             |
| `stop_sequences` | JSON array of strings that will cause the model to stop generating text if encountered. Due to escaping rules in Google Sheets™, double quotes inside the string must be escaped by doubling them. |
| `api_key`        | Used to specify a particular API key with which to call Claude.                                                                                                                                    |

<Accordion title="Example: Setting parameters">
  Ex. Set `system` prompt, `max_tokens`, and `temperature`:

  ```
  =CLAUDE("Hi, Claude!", "claude-3-haiku-20240307", "system", "Repeat exactly what the user says.", "max_tokens", 100, "temperature", 0.1)

  ```

  Ex. Set `temperature`, `max_tokens`, and `stop_sequences`:

  ```
  =CLAUDE("In one sentence, what is good about the color blue? Output your answer in <answer> tags.","claude-opus-4-20250514","temperature", 0.2,"max_tokens", 50,"stop_sequences", "\[""</answer>""\]")
  ```

  Ex. Set `api_key`:

  ```
  =CLAUDE("Hi, Claude!", "claude-3-haiku-20240307","api_key", "sk-ant-api03-j1W...")
  ```
</Accordion>

***

## Claude for Sheets usage examples

### Prompt engineering interactive tutorial

Our in-depth [prompt engineering interactive tutorial](https://docs.google.com/spreadsheets/d/19jzLgRruG9kjUQNKtCg1ZjdD6l6weA6qRXG5zLIAhC8/edit?usp=sharing) utilizes Claude for Sheets.
Check it out to learn or brush up on prompt engineering techniques.

<Note>Just as with any instance of Claude for Sheets, you will need an API key to interact with the tutorial.</Note>

### Prompt engineering workflow

Our [Claude for Sheets prompting examples workbench](https://docs.google.com/spreadsheets/d/1sUrBWO0u1-ZuQ8m5gt3-1N5PLR6r%5F%5FUsRsB7WeySDQA/copy) is a Claude-powered spreadsheet that houses example prompts and prompt engineering structures.

### Claude for Sheets workbook template

Make a copy of our [Claude for Sheets workbook template](https://docs.google.com/spreadsheets/d/1UwFS-ZQWvRqa6GkbL4sy0ITHK2AhXKe-jpMLzS0kTgk/copy) to get started with your own Claude for Sheets work!

***

## Troubleshooting

<Accordion title="NAME? Error: Unknown function: 'claude'">
  1. Ensure that you have enabled the extension for use in the current sheet
     1. Go to *Extensions* > *Add-ons* > *Manage add-ons*
     2. Click on the triple dot menu at the top right corner of the Claude for Sheets extension and make sure "Use in this document" is checked
        ![](https://mintlify.s3.us-west-1.amazonaws.com/anthropic/images/9cce371-Screenshot_2023-10-03_at_7.17.39_PM.png)
  2. Refresh the page
</Accordion>

<Accordion title="#ERROR!, ⚠ DEFERRED ⚠ or ⚠ THROTTLED ⚠">
  You can manually recalculate `#ERROR!`, `⚠ DEFERRED ⚠` or `⚠ THROTTLED ⚠`cells by selecting from the recalculate options within the Claude for Sheets extension menu.

  ![](https://mintlify.s3.us-west-1.amazonaws.com/anthropic/images/f729ba9-Screenshot_2024-02-01_at_8.30.31_PM.png)
</Accordion>

<Accordion title="Can't enter API key">
  1. Wait 20 seconds, then check again
  2. Refresh the page and wait 20 seconds again
  3. Uninstall and reinstall the extension
</Accordion>

***

## Further information

For more information regarding this extension, see the [Claude for Sheets Google Workspace Marketplace](https://workspace.google.com/marketplace/app/claude%5Ffor%5Fsheets/909417792257) overview page.


# Tool use with Claude

Claude is capable of interacting with tools and functions, allowing you to extend Claude's capabilities to perform a wider variety of tasks.

<Tip>
  Learn everything you need to master tool use with Claude as part of our new [courses](https://anthropic.skilljar.com/)! Please
  continue to share your ideas and suggestions using this
  [form](https://forms.gle/BFnYc6iCkWoRzFgk7).
</Tip>

Here's an example of how to provide tools to Claude using the Messages API:

<CodeGroup>
  ```bash Shell
  curl https://api.anthropic.com/v1/messages \
    -H "content-type: application/json" \
    -H "x-api-key: $ANTHROPIC_API_KEY" \
    -H "anthropic-version: 2023-06-01" \
    -d '{
      "model": "claude-opus-4-20250514",
      "max_tokens": 1024,
      "tools": [
        {
          "name": "get_weather",
          "description": "Get the current weather in a given location",
          "input_schema": {
            "type": "object",
            "properties": {
              "location": {
                "type": "string",
                "description": "The city and state, e.g. San Francisco, CA"
              }
            },
            "required": ["location"]
          }
        }
      ],
      "messages": [
        {
          "role": "user",
          "content": "What is the weather like in San Francisco?"
        }
      ]
    }'
  ```

  ```python Python
  import anthropic

  client = anthropic.Anthropic()

  response = client.messages.create(
      model="claude-opus-4-20250514",
      max_tokens=1024,
      tools=[
          {
              "name": "get_weather",
              "description": "Get the current weather in a given location",
              "input_schema": {
                  "type": "object",
                  "properties": {
                      "location": {
                          "type": "string",
                          "description": "The city and state, e.g. San Francisco, CA",
                      }
                  },
                  "required": ["location"],
              },
          }
      ],
      messages=[{"role": "user", "content": "What's the weather like in San Francisco?"}],
  )
  print(response)
  ```

  ```typescript TypeScript
  import { Anthropic } from '@anthropic-ai/sdk';

  const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY
  });

  async function main() {
    const response = await anthropic.messages.create({
      model: "claude-opus-4-20250514",
      max_tokens: 1024,
      tools: [{
        name: "get_weather",
        description: "Get the current weather in a given location",
        input_schema: {
          type: "object",
          properties: {
            location: {
              type: "string",
              description: "The city and state, e.g. San Francisco, CA"
            }
          },
          required: ["location"]
        }
      }],
      messages: [{ 
        role: "user", 
        content: "Tell me the weather in San Francisco." 
      }]
    });

    console.log(response);
  }

  main().catch(console.error);
  ```

  ```java Java
  import java.util.List;
  import java.util.Map;

  import com.anthropic.client.AnthropicClient;
  import com.anthropic.client.okhttp.AnthropicOkHttpClient;
  import com.anthropic.core.JsonValue;
  import com.anthropic.models.messages.Message;
  import com.anthropic.models.messages.MessageCreateParams;
  import com.anthropic.models.messages.Model;
  import com.anthropic.models.messages.Tool;
  import com.anthropic.models.messages.Tool.InputSchema;

  public class GetWeatherExample {

      public static void main(String[] args) {
          AnthropicClient client = AnthropicOkHttpClient.fromEnv();

          InputSchema schema = InputSchema.builder()
                  .properties(JsonValue.from(Map.of(
                          "location",
                          Map.of(
                                  "type", "string",
                                  "description", "The city and state, e.g. San Francisco, CA"))))
                  .putAdditionalProperty("required", JsonValue.from(List.of("location")))
                  .build();

          MessageCreateParams params = MessageCreateParams.builder()
                  .model(Model.CLAUDE_OPUS_4_0)
                  .maxTokens(1024)
                  .addTool(Tool.builder()
                          .name("get_weather")
                          .description("Get the current weather in a given location")
                          .inputSchema(schema)
                          .build())
                  .addUserMessage("What's the weather like in San Francisco?")
                  .build();

          Message message = client.messages().create(params);
          System.out.println(message);
      }
  }
  ```
</CodeGroup>

***

## How tool use works

Claude supports two types of tools:

1. **Client tools**: Tools that execute on your systems, which include:
   * User-defined custom tools that you create and implement
   * Anthropic-defined tools like [computer use](/en/docs/agents-and-tools/tool-use/computer-use-tool) and [text editor](/en/docs/agents-and-tools/tool-use/text-editor-tool) that require client implementation

2. **Server tools**: Tools that execute on Anthropic's servers, like the [web search](/en/docs/agents-and-tools/tool-use/web-search-tool) tool. These tools must be specified in the API request but don't require implementation on your part.

<Note>
  Anthropic-defined tools use versioned types (e.g., `web_search_20250305`, `text_editor_20250124`) to ensure compatibility across model versions.
</Note>

### Client tools

Integrate client tools with Claude in these steps:

<Steps>
  <Step title="Provide Claude with tools and a user prompt">
    * Define client tools with names, descriptions, and input schemas in your API request.
    * Include a user prompt that might require these tools, e.g., "What's the weather in San Francisco?"
  </Step>

  <Step title="Claude decides to use a tool">
    * Claude assesses if any tools can help with the user's query.
    * If yes, Claude constructs a properly formatted tool use request.
    * For client tools, the API response has a `stop_reason` of `tool_use`, signaling Claude's intent.
  </Step>

  <Step title="Execute the tool and return results">
    * Extract the tool name and input from Claude's request
    * Execute the tool code on your system
    * Return the results in a new `user` message containing a `tool_result` content block
  </Step>

  <Step title="Claude uses tool result to formulate a response">
    * Claude analyzes the tool results to craft its final response to the original user prompt.
  </Step>
</Steps>

Note: Steps 3 and 4 are optional. For some workflows, Claude's tool use request (step 2) might be all you need, without sending results back to Claude.

### Server tools

Server tools follow a different workflow:

<Steps>
  <Step title="Provide Claude with tools and a user prompt">
    * Server tools, like [web search](/en/docs/agents-and-tools/tool-use/web-search-tool), have their own parameters.
    * Include a user prompt that might require these tools, e.g., "Search for the latest news about AI."
  </Step>

  <Step title="Claude executes the server tool">
    * Claude assesses if a server tool can help with the user's query.
    * If yes, Claude executes the tool, and the results are automatically incorporated into Claude's response.
  </Step>

  <Step title="Claude uses the server tool result to formulate a response">
    * Claude analyzes the server tool results to craft its final response to the original user prompt.
    * No additional user interaction is needed for server tool execution.
  </Step>
</Steps>

***

## Tool use examples

Here are a few code examples demonstrating various tool use patterns and techniques. For brevity's sake, the tools are simple tools, and the tool descriptions are shorter than would be ideal to ensure best performance.

<AccordionGroup>
  <Accordion title="Single tool example">
    <CodeGroup>
      ```bash Shell
      curl https://api.anthropic.com/v1/messages \
           --header "x-api-key: $ANTHROPIC_API_KEY" \
           --header "anthropic-version: 2023-06-01" \
           --header "content-type: application/json" \
           --data \
      '{
          "model": "claude-opus-4-20250514",
          "max_tokens": 1024,
          "tools": [{
              "name": "get_weather",
              "description": "Get the current weather in a given location",
              "input_schema": {
                  "type": "object",
                  "properties": {
                      "location": {
                          "type": "string",
                          "description": "The city and state, e.g. San Francisco, CA"
                      },
                      "unit": {
                          "type": "string",
                          "enum": ["celsius", "fahrenheit"],
                          "description": "The unit of temperature, either \"celsius\" or \"fahrenheit\""
                      }
                  },
                  "required": ["location"]
              }
          }],
          "messages": [{"role": "user", "content": "What is the weather like in San Francisco?"}]
      }'
      ```

      ```Python Python
      import anthropic
      client = anthropic.Anthropic()

      response = client.messages.create(
          model="claude-opus-4-20250514",
          max_tokens=1024,
          tools=[
              {
                  "name": "get_weather",
                  "description": "Get the current weather in a given location",
                  "input_schema": {
                      "type": "object",
                      "properties": {
                          "location": {
                              "type": "string",
                              "description": "The city and state, e.g. San Francisco, CA"
                          },
                          "unit": {
                              "type": "string",
                              "enum": ["celsius", "fahrenheit"],
                              "description": "The unit of temperature, either \"celsius\" or \"fahrenheit\""
                          }
                      },
                      "required": ["location"]
                  }
              }
          ],
          messages=[{"role": "user", "content": "What is the weather like in San Francisco?"}]
      )

      print(response)
      ```

      ```java Java
      import java.util.List;
      import java.util.Map;

      import com.anthropic.client.AnthropicClient;
      import com.anthropic.client.okhttp.AnthropicOkHttpClient;
      import com.anthropic.core.JsonValue;
      import com.anthropic.models.messages.Message;
      import com.anthropic.models.messages.MessageCreateParams;
      import com.anthropic.models.messages.Model;
      import com.anthropic.models.messages.Tool;
      import com.anthropic.models.messages.Tool.InputSchema;

      public class WeatherToolExample {

          public static void main(String[] args) {
              AnthropicClient client = AnthropicOkHttpClient.fromEnv();

              InputSchema schema = InputSchema.builder()
                      .properties(JsonValue.from(Map.of(
                              "location", Map.of(
                                      "type", "string",
                                      "description", "The city and state, e.g. San Francisco, CA"
                              ),
                              "unit", Map.of(
                                      "type", "string",
                                      "enum", List.of("celsius", "fahrenheit"),
                                      "description", "The unit of temperature, either \"celsius\" or \"fahrenheit\""
                              )
                      )))
                      .putAdditionalProperty("required", JsonValue.from(List.of("location")))
                      .build();

              MessageCreateParams params = MessageCreateParams.builder()
                      .model(Model.CLAUDE_OPUS_4_0)
                      .maxTokens(1024)
                      .addTool(Tool.builder()
                              .name("get_weather")
                              .description("Get the current weather in a given location")
                              .inputSchema(schema)
                              .build())
                      .addUserMessage("What is the weather like in San Francisco?")
                      .build();

              Message message = client.messages().create(params);
              System.out.println(message);
          }
      }
      ```
    </CodeGroup>

    Claude will return a response similar to:

    ```JSON JSON
    {
      "id": "msg_01Aq9w938a90dw8q",
      "model": "claude-opus-4-20250514",
      "stop_reason": "tool_use",
      "role": "assistant",
      "content": [
        {
          "type": "text",
          "text": "<thinking>I need to call the get_weather function, and the user wants SF, which is likely San Francisco, CA.</thinking>"
        },
        {
          "type": "tool_use",
          "id": "toolu_01A09q90qw90lq917835lq9",
          "name": "get_weather",
          "input": {"location": "San Francisco, CA", "unit": "celsius"}
        }
      ]
    }
    ```

    You would then need to execute the `get_weather` function with the provided input, and return the result in a new `user` message:

    <CodeGroup>
      ```bash Shell
      curl https://api.anthropic.com/v1/messages \
           --header "x-api-key: $ANTHROPIC_API_KEY" \
           --header "anthropic-version: 2023-06-01" \
           --header "content-type: application/json" \
           --data \
      '{
          "model": "claude-opus-4-20250514",
          "max_tokens": 1024,
          "tools": [
              {
                  "name": "get_weather",
                  "description": "Get the current weather in a given location",
                  "input_schema": {
                      "type": "object",
                      "properties": {
                          "location": {
                              "type": "string",
                              "description": "The city and state, e.g. San Francisco, CA"
                          },
                          "unit": {
                              "type": "string",
                              "enum": ["celsius", "fahrenheit"],
                              "description": "The unit of temperature, either \"celsius\" or \"fahrenheit\""
                          }
                      },
                      "required": ["location"]
                  }
              }
          ],
          "messages": [
              {
                  "role": "user",
                  "content": "What is the weather like in San Francisco?"
              },
              {
                  "role": "assistant",
                  "content": [
                      {
                          "type": "text",
                          "text": "<thinking>I need to use get_weather, and the user wants SF, which is likely San Francisco, CA.</thinking>"
                      },
                      {
                          "type": "tool_use",
                          "id": "toolu_01A09q90qw90lq917835lq9",
                          "name": "get_weather",
                          "input": {
                              "location": "San Francisco, CA",
                              "unit": "celsius"
                          }
                      }
                  ]
              },
              {
                  "role": "user",
                  "content": [
                      {
                          "type": "tool_result",
                          "tool_use_id": "toolu_01A09q90qw90lq917835lq9",
                          "content": "15 degrees"
                      }
                  ]
              }
          ]
      }'
      ```

      ```Python Python
      response = client.messages.create(
          model="claude-opus-4-20250514",
          max_tokens=1024,
          tools=[
              {
                  "name": "get_weather",
                  "description": "Get the current weather in a given location",
                  "input_schema": {
                      "type": "object",
                      "properties": {
                          "location": {
                              "type": "string",
                              "description": "The city and state, e.g. San Francisco, CA"
                          },
                          "unit": {
                              "type": "string",
                              "enum": ["celsius", "fahrenheit"],
                              "description": "The unit of temperature, either 'celsius' or 'fahrenheit'"
                          }
                      },
                      "required": ["location"]
                  }
              }
          ],
          messages=[
              {
                  "role": "user",
                  "content": "What's the weather like in San Francisco?"
              },
              {
                  "role": "assistant",
                  "content": [
                      {
                          "type": "text",
                          "text": "<thinking>I need to use get_weather, and the user wants SF, which is likely San Francisco, CA.</thinking>"
                      },
                      {
                          "type": "tool_use",
                          "id": "toolu_01A09q90qw90lq917835lq9",
                          "name": "get_weather",
                          "input": {"location": "San Francisco, CA", "unit": "celsius"}
                      }
                  ]
              },
              {
                  "role": "user",
                  "content": [
                      {
                          "type": "tool_result",
                          "tool_use_id": "toolu_01A09q90qw90lq917835lq9", # from the API response
                          "content": "65 degrees" # from running your tool
                      }
                  ]
              }
          ]
      )

      print(response)
      ```

      ```java Java
       import java.util.List;
       import java.util.Map;

       import com.anthropic.client.AnthropicClient;
       import com.anthropic.client.okhttp.AnthropicOkHttpClient;
       import com.anthropic.core.JsonValue;
       import com.anthropic.models.messages.*;
       import com.anthropic.models.messages.Tool.InputSchema;

       public class ToolConversationExample {

           public static void main(String[] args) {
               AnthropicClient client = AnthropicOkHttpClient.fromEnv();

               InputSchema schema = InputSchema.builder()
                       .properties(JsonValue.from(Map.of(
                               "location", Map.of(
                                       "type", "string",
                                       "description", "The city and state, e.g. San Francisco, CA"
                               ),
                               "unit", Map.of(
                                       "type", "string",
                                       "enum", List.of("celsius", "fahrenheit"),
                                       "description", "The unit of temperature, either \"celsius\" or \"fahrenheit\""
                               )
                       )))
                       .putAdditionalProperty("required", JsonValue.from(List.of("location")))
                       .build();

               MessageCreateParams params = MessageCreateParams.builder()
                       .model(Model.CLAUDE_OPUS_4_0)
                       .maxTokens(1024)
                       .addTool(Tool.builder()
                               .name("get_weather")
                               .description("Get the current weather in a given location")
                               .inputSchema(schema)
                               .build())
                       .addUserMessage("What is the weather like in San Francisco?")
                       .addAssistantMessageOfBlockParams(
                               List.of(
                                       ContentBlockParam.ofText(
                                               TextBlockParam.builder()
                                                       .text("<thinking>I need to use get_weather, and the user wants SF, which is likely San Francisco, CA.</thinking>")
                                                       .build()
                                       ),
                                       ContentBlockParam.ofToolUse(
                                               ToolUseBlockParam.builder()
                                                       .id("toolu_01A09q90qw90lq917835lq9")
                                                       .name("get_weather")
                                                       .input(JsonValue.from(Map.of(
                                                               "location", "San Francisco, CA",
                                                               "unit", "celsius"
                                                       )))
                                                       .build()
                                       )
                               )
                       )
                       .addUserMessageOfBlockParams(List.of(
                               ContentBlockParam.ofToolResult(
                                       ToolResultBlockParam.builder()
                                               .toolUseId("toolu_01A09q90qw90lq917835lq9")
                                               .content("15 degrees")
                                               .build()
                               )
                       ))
                       .build();

               Message message = client.messages().create(params);
               System.out.println(message);
           }
       }
      ```
    </CodeGroup>

    This will print Claude's final response, incorporating the weather data:

    ```JSON JSON
    {
      "id": "msg_01Aq9w938a90dw8q",
      "model": "claude-opus-4-20250514",
      "stop_reason": "stop_sequence",
      "role": "assistant",
      "content": [
        {
          "type": "text",
          "text": "The current weather in San Francisco is 15 degrees Celsius (59 degrees Fahrenheit). It's a cool day in the city by the bay!"
        }
      ]
    }
    ```
  </Accordion>

  <Accordion title="Parallel tool use">
    Claude can call multiple tools in parallel within a single response, which is useful for tasks that require multiple independent operations. When using parallel tools, all `tool_use` blocks are included in a single assistant message, and all corresponding `tool_result` blocks must be provided in the subsequent user message.

    <Note>
      **Important**: Tool results must be formatted correctly to avoid API errors and ensure Claude continues using parallel tools. See our [implementation guide](/en/docs/agents-and-tools/tool-use/implement-tool-use#parallel-tool-use) for detailed formatting requirements and complete code examples.
    </Note>

    For comprehensive examples, test scripts, and best practices for implementing parallel tool calls, see the [parallel tool use section](/en/docs/agents-and-tools/tool-use/implement-tool-use#parallel-tool-use) in our implementation guide.
  </Accordion>

  <Accordion title="Multiple tool example">
    You can provide Claude with multiple tools to choose from in a single request. Here's an example with both a `get_weather` and a `get_time` tool, along with a user query that asks for both.

    <CodeGroup>
      ```bash Shell
      curl https://api.anthropic.com/v1/messages \
           --header "x-api-key: $ANTHROPIC_API_KEY" \
           --header "anthropic-version: 2023-06-01" \
           --header "content-type: application/json" \
           --data \
      '{
          "model": "claude-opus-4-20250514",
          "max_tokens": 1024,
          "tools": [{
              "name": "get_weather",
              "description": "Get the current weather in a given location",
              "input_schema": {
                  "type": "object",
                  "properties": {
                      "location": {
                          "type": "string",
                          "description": "The city and state, e.g. San Francisco, CA"
                      },
                      "unit": {
                          "type": "string",
                          "enum": ["celsius", "fahrenheit"],
                          "description": "The unit of temperature, either 'celsius' or 'fahrenheit'"
                      }
                  },
                  "required": ["location"]
              }
          },
          {
              "name": "get_time",
              "description": "Get the current time in a given time zone",
              "input_schema": {
                  "type": "object",
                  "properties": {
                      "timezone": {
                          "type": "string",
                          "description": "The IANA time zone name, e.g. America/Los_Angeles"
                      }
                  },
                  "required": ["timezone"]
              }
          }],
          "messages": [{
              "role": "user",
              "content": "What is the weather like right now in New York? Also what time is it there?"
          }]
      }'
      ```

      ```Python Python
      import anthropic
      client = anthropic.Anthropic()

      response = client.messages.create(
          model="claude-opus-4-20250514",
          max_tokens=1024,
          tools=[
              {
                  "name": "get_weather",
                  "description": "Get the current weather in a given location",
                  "input_schema": {
                      "type": "object",
                      "properties": {
                          "location": {
                              "type": "string",
                              "description": "The city and state, e.g. San Francisco, CA"
                          },
                          "unit": {
                              "type": "string",
                              "enum": ["celsius", "fahrenheit"],
                              "description": "The unit of temperature, either 'celsius' or 'fahrenheit'"
                          }
                      },
                      "required": ["location"]
                  }
              },
              {
                  "name": "get_time",
                  "description": "Get the current time in a given time zone",
                  "input_schema": {
                      "type": "object",
                      "properties": {
                          "timezone": {
                              "type": "string",
                              "description": "The IANA time zone name, e.g. America/Los_Angeles"
                          }
                      },
                      "required": ["timezone"]
                  }
              }
          ],
          messages=[
              {
                  "role": "user",
                  "content": "What is the weather like right now in New York? Also what time is it there?"
              }
          ]
      )
      print(response)
      ```

      ```java Java
      import java.util.List;
      import java.util.Map;

      import com.anthropic.client.AnthropicClient;
      import com.anthropic.client.okhttp.AnthropicOkHttpClient;
      import com.anthropic.core.JsonValue;
      import com.anthropic.models.messages.Message;
      import com.anthropic.models.messages.MessageCreateParams;
      import com.anthropic.models.messages.Model;
      import com.anthropic.models.messages.Tool;
      import com.anthropic.models.messages.Tool.InputSchema;

      public class MultipleToolsExample {

          public static void main(String[] args) {
              AnthropicClient client = AnthropicOkHttpClient.fromEnv();

              // Weather tool schema
              InputSchema weatherSchema = InputSchema.builder()
                      .properties(JsonValue.from(Map.of(
                              "location", Map.of(
                                      "type", "string",
                                      "description", "The city and state, e.g. San Francisco, CA"
                              ),
                              "unit", Map.of(
                                      "type", "string",
                                      "enum", List.of("celsius", "fahrenheit"),
                                      "description", "The unit of temperature, either \"celsius\" or \"fahrenheit\""
                              )
                      )))
                      .putAdditionalProperty("required", JsonValue.from(List.of("location")))
                      .build();

              // Time tool schema
              InputSchema timeSchema = InputSchema.builder()
                      .properties(JsonValue.from(Map.of(
                              "timezone", Map.of(
                                      "type", "string",
                                      "description", "The IANA time zone name, e.g. America/Los_Angeles"
                              )
                      )))
                      .putAdditionalProperty("required", JsonValue.from(List.of("timezone")))
                      .build();

              MessageCreateParams params = MessageCreateParams.builder()
                      .model(Model.CLAUDE_OPUS_4_0)
                      .maxTokens(1024)
                      .addTool(Tool.builder()
                              .name("get_weather")
                              .description("Get the current weather in a given location")
                              .inputSchema(weatherSchema)
                              .build())
                      .addTool(Tool.builder()
                              .name("get_time")
                              .description("Get the current time in a given time zone")
                              .inputSchema(timeSchema)
                              .build())
                      .addUserMessage("What is the weather like right now in New York? Also what time is it there?")
                      .build();

              Message message = client.messages().create(params);
              System.out.println(message);
          }
      }
      ```
    </CodeGroup>

    In this case, Claude may either:

    * Use the tools sequentially (one at a time) — calling `get_weather` first, then `get_time` after receiving the weather result
    * Use parallel tool calls — outputting multiple `tool_use` blocks in a single response when the operations are independent

    When Claude makes parallel tool calls, you must return all tool results in a single `user` message, with each result in its own `tool_result` block.
  </Accordion>

  <Accordion title="Missing information">
    If the user's prompt doesn't include enough information to fill all the required parameters for a tool, Claude Opus is much more likely to recognize that a parameter is missing and ask for it. Claude Sonnet may ask, especially when prompted to think before outputting a tool request. But it may also do its best to infer a reasonable value.

    For example, using the `get_weather` tool above, if you ask Claude "What's the weather?" without specifying a location, Claude, particularly Claude Sonnet, may make a guess about tools inputs:

    ```JSON JSON
    {
      "type": "tool_use",
      "id": "toolu_01A09q90qw90lq917835lq9",
      "name": "get_weather",
      "input": {"location": "New York, NY", "unit": "fahrenheit"}
    }
    ```

    This behavior is not guaranteed, especially for more ambiguous prompts and for less intelligent models. If Claude Opus doesn't have enough context to fill in the required parameters, it is far more likely respond with a clarifying question instead of making a tool call.
  </Accordion>

  <Accordion title="Sequential tools">
    Some tasks may require calling multiple tools in sequence, using the output of one tool as the input to another. In such a case, Claude will call one tool at a time. If prompted to call the tools all at once, Claude is likely to guess parameters for tools further downstream if they are dependent on tool results for tools further upstream.

    Here's an example of using a `get_location` tool to get the user's location, then passing that location to the `get_weather` tool:

    <CodeGroup>
      ```bash Shell
      curl https://api.anthropic.com/v1/messages \
           --header "x-api-key: $ANTHROPIC_API_KEY" \
           --header "anthropic-version: 2023-06-01" \
           --header "content-type: application/json" \
           --data \
      '{
          "model": "claude-opus-4-20250514",
          "max_tokens": 1024,
          "tools": [
              {
                  "name": "get_location",
                  "description": "Get the current user location based on their IP address. This tool has no parameters or arguments.",
                  "input_schema": {
                      "type": "object",
                      "properties": {}
                  }
              },
              {
                  "name": "get_weather",
                  "description": "Get the current weather in a given location",
                  "input_schema": {
                      "type": "object",
                      "properties": {
                          "location": {
                              "type": "string",
                              "description": "The city and state, e.g. San Francisco, CA"
                          },
                          "unit": {
                              "type": "string",
                              "enum": ["celsius", "fahrenheit"],
                              "description": "The unit of temperature, either 'celsius' or 'fahrenheit'"
                          }
                      },
                      "required": ["location"]
                  }
              }
          ],
          "messages": [{
              "role": "user",
              "content": "What is the weather like where I am?"
          }]
      }'
      ```

      ```Python Python
      response = client.messages.create(
          model="claude-opus-4-20250514",
          max_tokens=1024,
          tools=[
              {
                  "name": "get_location",
                  "description": "Get the current user location based on their IP address. This tool has no parameters or arguments.",
                  "input_schema": {
                      "type": "object",
                      "properties": {}
                  }
              },
              {
                  "name": "get_weather",
                  "description": "Get the current weather in a given location",
                  "input_schema": {
                      "type": "object",
                      "properties": {
                          "location": {
                              "type": "string",
                              "description": "The city and state, e.g. San Francisco, CA"
                          },
                          "unit": {
                              "type": "string",
                              "enum": ["celsius", "fahrenheit"],
                              "description": "The unit of temperature, either 'celsius' or 'fahrenheit'"
                          }
                      },
                      "required": ["location"]
                  }
              }
          ],
          messages=[{
         		  "role": "user",
          	  "content": "What's the weather like where I am?"
          }]
      )
      ```

      ```java Java
      import java.util.List;
      import java.util.Map;

      import com.anthropic.client.AnthropicClient;
      import com.anthropic.client.okhttp.AnthropicOkHttpClient;
      import com.anthropic.core.JsonValue;
      import com.anthropic.models.messages.Message;
      import com.anthropic.models.messages.MessageCreateParams;
      import com.anthropic.models.messages.Model;
      import com.anthropic.models.messages.Tool;
      import com.anthropic.models.messages.Tool.InputSchema;

      public class EmptySchemaToolExample {

          public static void main(String[] args) {
              AnthropicClient client = AnthropicOkHttpClient.fromEnv();

              // Empty schema for location tool
              InputSchema locationSchema = InputSchema.builder()
                      .properties(JsonValue.from(Map.of()))
                      .build();

              // Weather tool schema
              InputSchema weatherSchema = InputSchema.builder()
                      .properties(JsonValue.from(Map.of(
                              "location", Map.of(
                                      "type", "string",
                                      "description", "The city and state, e.g. San Francisco, CA"
                              ),
                              "unit", Map.of(
                                      "type", "string",
                                      "enum", List.of("celsius", "fahrenheit"),
                                      "description", "The unit of temperature, either \"celsius\" or \"fahrenheit\""
                              )
                      )))
                      .putAdditionalProperty("required", JsonValue.from(List.of("location")))
                      .build();

              MessageCreateParams params = MessageCreateParams.builder()
                      .model(Model.CLAUDE_OPUS_4_0)
                      .maxTokens(1024)
                      .addTool(Tool.builder()
                              .name("get_location")
                              .description("Get the current user location based on their IP address. This tool has no parameters or arguments.")
                              .inputSchema(locationSchema)
                              .build())
                      .addTool(Tool.builder()
                              .name("get_weather")
                              .description("Get the current weather in a given location")
                              .inputSchema(weatherSchema)
                              .build())
                      .addUserMessage("What is the weather like where I am?")
                      .build();

              Message message = client.messages().create(params);
              System.out.println(message);
          }
      }
      ```
    </CodeGroup>

    In this case, Claude would first call the `get_location` tool to get the user's location. After you return the location in a `tool_result`, Claude would then call `get_weather` with that location to get the final answer.

    The full conversation might look like:

    | Role      | Content                                                                                                                                                                                                                                   |
    | --------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
    | User      | What's the weather like where I am?                                                                                                                                                                                                       |
    | Assistant | \<thinking>To answer this, I first need to determine the user's location using the get\_location tool. Then I can pass that location to the get\_weather tool to find the current weather there.\</thinking>\[Tool use for get\_location] |
    | User      | \[Tool result for get\_location with matching id and result of San Francisco, CA]                                                                                                                                                         |
    | Assistant | \[Tool use for get\_weather with the following input]\{ "location": "San Francisco, CA", "unit": "fahrenheit" }                                                                                                                           |
    | User      | \[Tool result for get\_weather with matching id and result of "59°F (15°C), mostly cloudy"]                                                                                                                                               |
    | Assistant | Based on your current location in San Francisco, CA, the weather right now is 59°F (15°C) and mostly cloudy. It's a fairly cool and overcast day in the city. You may want to bring a light jacket if you're heading outside.             |

    This example demonstrates how Claude can chain together multiple tool calls to answer a question that requires gathering data from different sources. The key steps are:

    1. Claude first realizes it needs the user's location to answer the weather question, so it calls the `get_location` tool.
    2. The user (i.e. the client code) executes the actual `get_location` function and returns the result "San Francisco, CA" in a `tool_result` block.
    3. With the location now known, Claude proceeds to call the `get_weather` tool, passing in "San Francisco, CA" as the `location` parameter (as well as a guessed `unit` parameter, as `unit` is not a required parameter).
    4. The user again executes the actual `get_weather` function with the provided arguments and returns the weather data in another `tool_result` block.
    5. Finally, Claude incorporates the weather data into a natural language response to the original question.
  </Accordion>

  <Accordion title="Chain of thought tool use">
    By default, Claude Opus is prompted to think before it answers a tool use query to best determine whether a tool is necessary, which tool to use, and the appropriate parameters. Claude Sonnet and Claude Haiku are prompted to try to use tools as much as possible and are more likely to call an unnecessary tool or infer missing parameters. To prompt Sonnet or Haiku to better assess the user query before making tool calls, the following prompt can be used:

    Chain of thought prompt

    `Answer the user's request using relevant tools (if they are available). Before calling a tool, do some analysis within \<thinking>\</thinking> tags. First, think about which of the provided tools is the relevant tool to answer the user's request. Second, go through each of the required parameters of the relevant tool and determine if the user has directly provided or given enough information to infer a value. When deciding if the parameter can be inferred, carefully consider all the context to see if it supports a specific value. If all of the required parameters are present or can be reasonably inferred, close the thinking tag and proceed with the tool call. BUT, if one of the values for a required parameter is missing, DO NOT invoke the function (not even with fillers for the missing params) and instead, ask the user to provide the missing parameters. DO NOT ask for more information on optional parameters if it is not provided.
    `
  </Accordion>

  <Accordion title="JSON mode">
    You can use tools to get Claude produce JSON output that follows a schema, even if you don't have any intention of running that output through a tool or function.

    When using tools in this way:

    * You usually want to provide a **single** tool
    * You should set `tool_choice` (see [Forcing tool use](/en/docs/agents-and-tools/tool-use/implement-tool-use#forcing-tool-use)) to instruct the model to explicitly use that tool
    * Remember that the model will pass the `input` to the tool, so the name of the tool and description should be from the model's perspective.

    The following uses a `record_summary` tool to describe an image following a particular format.

    <CodeGroup>
      ```bash Shell
      #!/bin/bash
      IMAGE_URL="https://upload.wikimedia.org/wikipedia/commons/a/a7/Camponotus_flavomarginatus_ant.jpg"
      IMAGE_MEDIA_TYPE="image/jpeg"
      IMAGE_BASE64=$(curl "$IMAGE_URL" | base64)

      curl https://api.anthropic.com/v1/messages \
           --header "content-type: application/json" \
           --header "x-api-key: $ANTHROPIC_API_KEY" \
           --header "anthropic-version: 2023-06-01" \
           --data \
      '{
          "model": "claude-opus-4-20250514",
          "max_tokens": 1024,
          "tools": [{
              "name": "record_summary",
              "description": "Record summary of an image using well-structured JSON.",
              "input_schema": {
                  "type": "object",
                  "properties": {
                      "key_colors": {
                          "type": "array",
                          "items": {
                              "type": "object",
                              "properties": {
                                  "r": { "type": "number", "description": "red value [0.0, 1.0]" },
                                  "g": { "type": "number", "description": "green value [0.0, 1.0]" },
                                  "b": { "type": "number", "description": "blue value [0.0, 1.0]" },
                                  "name": { "type": "string", "description": "Human-readable color name in snake_case, e.g. \"olive_green\" or \"turquoise\"" }
                              },
                              "required": [ "r", "g", "b", "name" ]
                          },
                          "description": "Key colors in the image. Limit to less than four."
                      },
                      "description": {
                          "type": "string",
                          "description": "Image description. One to two sentences max."
                      },
                      "estimated_year": {
                          "type": "integer",
                          "description": "Estimated year that the image was taken, if it is a photo. Only set this if the image appears to be non-fictional. Rough estimates are okay!"
                      }
                  },
                  "required": [ "key_colors", "description" ]
              }
          }],
          "tool_choice": {"type": "tool", "name": "record_summary"},
          "messages": [
              {"role": "user", "content": [
                  {"type": "image", "source": {
                      "type": "base64",
                      "media_type": "'$IMAGE_MEDIA_TYPE'",
                      "data": "'$IMAGE_BASE64'"
                  }},
                  {"type": "text", "text": "Describe this image."}
              ]}
          ]
      }'
      ```

      ```Python Python
      import base64
      import anthropic
      import httpx

      image_url = "https://upload.wikimedia.org/wikipedia/commons/a/a7/Camponotus_flavomarginatus_ant.jpg"
      image_media_type = "image/jpeg"
      image_data = base64.standard_b64encode(httpx.get(image_url).content).decode("utf-8")

      message = anthropic.Anthropic().messages.create(
          model="claude-opus-4-20250514",
          max_tokens=1024,
          tools=[
              {
                  "name": "record_summary",
                  "description": "Record summary of an image using well-structured JSON.",
                  "input_schema": {
                      "type": "object",
                      "properties": {
                          "key_colors": {
                              "type": "array",
                              "items": {
                                  "type": "object",
                                  "properties": {
                                      "r": {
                                          "type": "number",
                                          "description": "red value [0.0, 1.0]",
                                      },
                                      "g": {
                                          "type": "number",
                                          "description": "green value [0.0, 1.0]",
                                      },
                                      "b": {
                                          "type": "number",
                                          "description": "blue value [0.0, 1.0]",
                                      },
                                      "name": {
                                          "type": "string",
                                          "description": "Human-readable color name in snake_case, e.g. \"olive_green\" or \"turquoise\""
                                      },
                                  },
                                  "required": ["r", "g", "b", "name"],
                              },
                              "description": "Key colors in the image. Limit to less than four.",
                          },
                          "description": {
                              "type": "string",
                              "description": "Image description. One to two sentences max.",
                          },
                          "estimated_year": {
                              "type": "integer",
                              "description": "Estimated year that the image was taken, if it is a photo. Only set this if the image appears to be non-fictional. Rough estimates are okay!",
                          },
                      },
                      "required": ["key_colors", "description"],
                  },
              }
          ],
          tool_choice={"type": "tool", "name": "record_summary"},
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
                      {"type": "text", "text": "Describe this image."},
                  ],
              }
          ],
      )
      print(message)
      ```

      ```java Java
      import java.io.IOException;
      import java.io.InputStream;
      import java.net.URL;
      import java.util.Base64;
      import java.util.List;
      import java.util.Map;

      import com.anthropic.client.AnthropicClient;
      import com.anthropic.client.okhttp.AnthropicOkHttpClient;
      import com.anthropic.core.JsonValue;
      import com.anthropic.models.messages.*;
      import com.anthropic.models.messages.Tool.InputSchema;

      public class ImageToolExample {

          public static void main(String[] args) throws Exception {
              AnthropicClient client = AnthropicOkHttpClient.fromEnv();

              String imageBase64 = downloadAndEncodeImage("https://upload.wikimedia.org/wikipedia/commons/a/a7/Camponotus_flavomarginatus_ant.jpg");
              // Create nested schema for colors
              Map<String, Object> colorProperties = Map.of(
                      "r", Map.of(
                              "type", "number",
                              "description", "red value [0.0, 1.0]"
                      ),
                      "g", Map.of(
                              "type", "number",
                              "description", "green value [0.0, 1.0]"
                      ),
                      "b", Map.of(
                              "type", "number",
                              "description", "blue value [0.0, 1.0]"
                      ),
                      "name", Map.of(
                              "type", "string",
                              "description", "Human-readable color name in snake_case, e.g. \"olive_green\" or \"turquoise\""
                      )
              );

              // Create the input schema
              InputSchema schema = InputSchema.builder()
                      .properties(JsonValue.from(Map.of(
                              "key_colors", Map.of(
                                      "type", "array",
                                      "items", Map.of(
                                              "type", "object",
                                              "properties", colorProperties,
                                              "required", List.of("r", "g", "b", "name")
                                      ),
                                      "description", "Key colors in the image. Limit to less than four."
                              ),
                              "description", Map.of(
                                      "type", "string",
                                      "description", "Image description. One to two sentences max."
                              ),
                              "estimated_year", Map.of(
                                      "type", "integer",
                                      "description", "Estimated year that the image was taken, if it is a photo. Only set this if the image appears to be non-fictional. Rough estimates are okay!"
                              )
                      )))
                      .putAdditionalProperty("required", JsonValue.from(List.of("key_colors", "description")))
                      .build();

              // Create the tool
              Tool tool = Tool.builder()
                      .name("record_summary")
                      .description("Record summary of an image using well-structured JSON.")
                      .inputSchema(schema)
                      .build();

              // Create the content blocks for the message
              ContentBlockParam imageContent = ContentBlockParam.ofImage(
                      ImageBlockParam.builder()
                              .source(Base64ImageSource.builder()
                                      .mediaType(Base64ImageSource.MediaType.IMAGE_JPEG)
                                      .data(imageBase64)
                                      .build())
                              .build()
              );

              ContentBlockParam textContent = ContentBlockParam.ofText(TextBlockParam.builder().text("Describe this image.").build());

              // Create the message
              MessageCreateParams params = MessageCreateParams.builder()
                      .model(Model.CLAUDE_OPUS_4_0)
                      .maxTokens(1024)
                      .addTool(tool)
                      .toolChoice(ToolChoiceTool.builder().name("record_summary").build())
                      .addUserMessageOfBlockParams(List.of(imageContent, textContent))
                      .build();

              Message message = client.messages().create(params);
              System.out.println(message);
          }

          private static String downloadAndEncodeImage(String imageUrl) throws IOException {
              try (InputStream inputStream = new URL(imageUrl).openStream()) {
                  return Base64.getEncoder().encodeToString(inputStream.readAllBytes());
              }
          }
      }
      ```
    </CodeGroup>
  </Accordion>
</AccordionGroup>

***

## Pricing

Tool use requests are priced based on:

1. The total number of input tokens sent to the model (including in the `tools` parameter)
2. The number of output tokens generated
3. For server-side tools, additional usage-based pricing (e.g., web search charges per search performed)

Client-side tools are priced the same as any other Claude API request, while server-side tools may incur additional charges based on their specific usage.

The additional tokens from tool use come from:

* The `tools` parameter in API requests (tool names, descriptions, and schemas)
* `tool_use` content blocks in API requests and responses
* `tool_result` content blocks in API requests

When you use `tools`, we also automatically include a special system prompt for the model which enables tool use. The number of tool use tokens required for each model are listed below (excluding the additional tokens listed above). Note that the table assumes at least 1 tool is provided. If no `tools` are provided, then a tool choice of `none` uses 0 additional system prompt tokens.

| Model                    | Tool choice                                        | Tool use system prompt token count          |
| ------------------------ | -------------------------------------------------- | ------------------------------------------- |
| Claude Opus 4            | `auto`, `none`<hr className="my-2" />`any`, `tool` | 346 tokens<hr className="my-2" />313 tokens |
| Claude Sonnet 4          | `auto`, `none`<hr className="my-2" />`any`, `tool` | 346 tokens<hr className="my-2" />313 tokens |
| Claude Sonnet 3.7        | `auto`, `none`<hr className="my-2" />`any`, `tool` | 346 tokens<hr className="my-2" />313 tokens |
| Claude Sonnet 3.5 (Oct)  | `auto`, `none`<hr className="my-2" />`any`, `tool` | 346 tokens<hr className="my-2" />313 tokens |
| Claude Sonnet 3.5 (June) | `auto`, `none`<hr className="my-2" />`any`, `tool` | 294 tokens<hr className="my-2" />261 tokens |
| Claude Haiku 3.5         | `auto`, `none`<hr className="my-2" />`any`, `tool` | 264 tokens<hr className="my-2" />340 tokens |
| Claude Opus 3            | `auto`, `none`<hr className="my-2" />`any`, `tool` | 530 tokens<hr className="my-2" />281 tokens |
| Claude Sonnet 3          | `auto`, `none`<hr className="my-2" />`any`, `tool` | 159 tokens<hr className="my-2" />235 tokens |
| Claude Haiku 3           | `auto`, `none`<hr className="my-2" />`any`, `tool` | 264 tokens<hr className="my-2" />340 tokens |

These token counts are added to your normal input and output tokens to calculate the total cost of a request.

Refer to our [models overview table](/en/docs/about-claude/models/overview#model-comparison-table) for current per-model prices.

When you send a tool use prompt, just like any other API request, the response will output both input and output token counts as part of the reported `usage` metrics.

***

## Next Steps

Explore our repository of ready-to-implement tool use code examples in our cookbooks:

<CardGroup cols={3}>
  <Card title="Calculator Tool" icon="calculator" href="https://github.com/anthropics/anthropic-cookbook/blob/main/tool_use/calculator_tool.ipynb">
    Learn how to integrate a simple calculator tool with Claude for precise numerical computations.
  </Card>

  {" "}

  <Card title="Customer Service Agent" icon="headset" href="https://github.com/anthropics/anthropic-cookbook/blob/main/tool_use/customer_service_agent.ipynb">
    Build a responsive customer service bot that leverages client tools to
    enhance support.
  </Card>

  <Card title="JSON Extractor" icon="brackets-curly" href="https://github.com/anthropics/anthropic-cookbook/blob/main/tool_use/extracting_structured_json.ipynb">
    See how Claude and tool use can extract structured data from unstructured text.
  </Card>
</CardGroup>


# How to implement tool use

## Choosing a model

Generally, use Claude Opus 4, Claude Sonnet 4, Claude Sonnet 3.7, Claude Sonnet 3.5 or Claude Opus 3 for complex tools and ambiguous queries; they handle multiple tools better and seek clarification when needed.

Use Claude Haiku 3.5 or Claude Haiku 3 for straightforward tools, but note they may infer missing parameters.

<Tip>
  If using Claude Sonnet 3.7 with tool use and extended thinking, refer to our guide [here](/en/docs/build-with-claude/extended-thinking) for more information.
</Tip>

## Specifying client tools

Client tools (both Anthropic-defined and user-defined) are specified in the `tools` top-level parameter of the API request. Each tool definition includes:

| Parameter      | Description                                                                                         |
| :------------- | :-------------------------------------------------------------------------------------------------- |
| `name`         | The name of the tool. Must match the regex `^[a-zA-Z0-9_-]{1,64}$`.                                 |
| `description`  | A detailed plaintext description of what the tool does, when it should be used, and how it behaves. |
| `input_schema` | A [JSON Schema](https://json-schema.org/) object defining the expected parameters for the tool.     |

<Accordion title="Example simple tool definition">
  ```JSON JSON
  {
    "name": "get_weather",
    "description": "Get the current weather in a given location",
    "input_schema": {
      "type": "object",
      "properties": {
        "location": {
          "type": "string",
          "description": "The city and state, e.g. San Francisco, CA"
        },
        "unit": {
          "type": "string",
          "enum": ["celsius", "fahrenheit"],
          "description": "The unit of temperature, either 'celsius' or 'fahrenheit'"
        }
      },
      "required": ["location"]
    }
  }
  ```

  This tool, named `get_weather`, expects an input object with a required `location` string and an optional `unit` string that must be either "celsius" or "fahrenheit".
</Accordion>

### Tool use system prompt

When you call the Anthropic API with the `tools` parameter, we construct a special system prompt from the tool definitions, tool configuration, and any user-specified system prompt. The constructed prompt is designed to instruct the model to use the specified tool(s) and provide the necessary context for the tool to operate properly:

```
In this environment you have access to a set of tools you can use to answer the user's question.
{{ FORMATTING INSTRUCTIONS }}
String and scalar parameters should be specified as is, while lists and objects should use JSON format. Note that spaces for string values are not stripped. The output is not expected to be valid XML and is parsed with regular expressions.
Here are the functions available in JSONSchema format:
{{ TOOL DEFINITIONS IN JSON SCHEMA }}
{{ USER SYSTEM PROMPT }}
{{ TOOL CONFIGURATION }}
```

### Best practices for tool definitions

To get the best performance out of Claude when using tools, follow these guidelines:

* **Provide extremely detailed descriptions.** This is by far the most important factor in tool performance. Your descriptions should explain every detail about the tool, including:
  * What the tool does
  * When it should be used (and when it shouldn't)
  * What each parameter means and how it affects the tool's behavior
  * Any important caveats or limitations, such as what information the tool does not return if the tool name is unclear. The more context you can give Claude about your tools, the better it will be at deciding when and how to use them. Aim for at least 3-4 sentences per tool description, more if the tool is complex.
* **Prioritize descriptions over examples.** While you can include examples of how to use a tool in its description or in the accompanying prompt, this is less important than having a clear and comprehensive explanation of the tool's purpose and parameters. Only add examples after you've fully fleshed out the description.

<AccordionGroup>
  <Accordion title="Example of a good tool description">
    ```JSON JSON
    {
      "name": "get_stock_price",
      "description": "Retrieves the current stock price for a given ticker symbol. The ticker symbol must be a valid symbol for a publicly traded company on a major US stock exchange like NYSE or NASDAQ. The tool will return the latest trade price in USD. It should be used when the user asks about the current or most recent price of a specific stock. It will not provide any other information about the stock or company.",
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
    ```
  </Accordion>

  <Accordion title="Example poor tool description">
    ```JSON JSON
    {
      "name": "get_stock_price",
      "description": "Gets the stock price for a ticker.",
      "input_schema": {
        "type": "object",
        "properties": {
          "ticker": {
            "type": "string"
          }
        },
        "required": ["ticker"]
      }
    }
    ```
  </Accordion>
</AccordionGroup>

The good description clearly explains what the tool does, when to use it, what data it returns, and what the `ticker` parameter means. The poor description is too brief and leaves Claude with many open questions about the tool's behavior and usage.

## Controlling Claude's output

### Forcing tool use

In some cases, you may want Claude to use a specific tool to answer the user's question, even if Claude thinks it can provide an answer without using a tool. You can do this by specifying the tool in the `tool_choice` field like so:

```
tool_choice = {"type": "tool", "name": "get_weather"}
```

When working with the tool\_choice parameter, we have four possible options:

* `auto` allows Claude to decide whether to call any provided tools or not. This is the default value when `tools` are provided.
* `any` tells Claude that it must use one of the provided tools, but doesn't force a particular tool.
* `tool` allows us to force Claude to always use a particular tool.
* `none` prevents Claude from using any tools. This is the default value when no `tools` are provided.

<Note>
  When using [prompt caching](/en/docs/build-with-claude/prompt-caching#what-invalidates-the-cache), changes to the `tool_choice` parameter will invalidate cached message blocks. Tool definitions and system prompts remain cached, but message content must be reprocessed.
</Note>

This diagram illustrates how each option works:

<Frame>
  <img src="https://mintlify.s3.us-west-1.amazonaws.com/anthropic/images/tool_choice.png" />
</Frame>

Note that when you have `tool_choice` as `any` or `tool`, we will prefill the assistant message to force a tool to be used. This means that the models will not emit a chain-of-thought `text` content block before `tool_use` content blocks, even if explicitly asked to do so.

<Note>
  When using [extended thinking](/en/docs/build-with-claude/extended-thinking) with tool use, `tool_choice: {"type": "any"}` and `tool_choice: {"type": "tool", "name": "..."}` are not supported and will result in an error. Only `tool_choice: {"type": "auto"}` (the default) and `tool_choice: {"type": "none"}` are compatible with extended thinking.
</Note>

Our testing has shown that this should not reduce performance. If you would like to keep chain-of-thought (particularly with Opus) while still requesting that the model use a specific tool, you can use `{"type": "auto"}` for `tool_choice` (the default) and add explicit instructions in a `user` message. For example: `What's the weather like in London? Use the get_weather tool in your response.`

### JSON output

Tools do not necessarily need to be client functions — you can use tools anytime you want the model to return JSON output that follows a provided schema. For example, you might use a `record_summary` tool with a particular schema. See [Tool use with Claude](/en/docs/agents-and-tools/tool-use/overview) for a full working example.

### Chain of thought

When using tools, Claude will often show its "chain of thought", i.e. the step-by-step reasoning it uses to break down the problem and decide which tools to use. The Claude Opus 3 model will do this if `tool_choice` is set to `auto` (this is the default value, see [Forcing tool use](#forcing-tool-use)), and Sonnet and Haiku can be prompted into doing it.

For example, given the prompt "What's the weather like in San Francisco right now, and what time is it there?", Claude might respond with:

```JSON JSON
{
  "role": "assistant",
  "content": [
    {
      "type": "text",
      "text": "<thinking>To answer this question, I will: 1. Use the get_weather tool to get the current weather in San Francisco. 2. Use the get_time tool to get the current time in the America/Los_Angeles timezone, which covers San Francisco, CA.</thinking>"
    },
    {
      "type": "tool_use",
      "id": "toolu_01A09q90qw90lq917835lq9",
      "name": "get_weather",
      "input": {"location": "San Francisco, CA"}
    }
  ]
}
```

This chain of thought gives insight into Claude's reasoning process and can help you debug unexpected behavior.

With the Claude Sonnet 3 model, chain of thought is less common by default, but you can prompt Claude to show its reasoning by adding something like `"Before answering, explain your reasoning step-by-step in tags."` to the user message or system prompt.

It's important to note that while the `<thinking>` tags are a common convention Claude uses to denote its chain of thought, the exact format (such as what this XML tag is named) may change over time. Your code should treat the chain of thought like any other assistant-generated text, and not rely on the presence or specific formatting of the `<thinking>` tags.

### Parallel tool use

By default, Claude may use multiple tools to answer a user query. You can disable this behavior by:

* Setting `disable_parallel_tool_use=true` when tool\_choice type is `auto`, which ensures that Claude uses **at most one** tool
* Setting `disable_parallel_tool_use=true` when tool\_choice type is `any` or `tool`, which ensures that Claude uses **exactly one** tool

<AccordionGroup>
  <Accordion title="Complete parallel tool use example">
    Here's a complete example showing how to properly format parallel tool calls in the message history:

    <CodeGroup>
      ```python Python
      import anthropic

      client = anthropic.Anthropic()

      # Define tools
      tools = [
          {
              "name": "get_weather",
              "description": "Get the current weather in a given location",
              "input_schema": {
                  "type": "object",
                  "properties": {
                      "location": {
                          "type": "string",
                          "description": "The city and state, e.g. San Francisco, CA"
                      }
                  },
                  "required": ["location"]
              }
          },
          {
              "name": "get_time",
              "description": "Get the current time in a given timezone",
              "input_schema": {
                  "type": "object",
                  "properties": {
                      "timezone": {
                          "type": "string",
                          "description": "The timezone, e.g. America/New_York"
                      }
                  },
                  "required": ["timezone"]
              }
          }
      ]

      # Initial request
      response = client.messages.create(
          model="claude-opus-4-20250514",
          max_tokens=1024,
          tools=tools,
          messages=[
              {
                  "role": "user",
                  "content": "What's the weather in SF and NYC, and what time is it there?"
              }
          ]
      )

      # Claude's response with parallel tool calls
      print("Claude wants to use tools:", response.stop_reason == "tool_use")
      print("Number of tool calls:", len([c for c in response.content if c.type == "tool_use"]))

      # Build the conversation with tool results
      messages = [
          {
              "role": "user",
              "content": "What's the weather in SF and NYC, and what time is it there?"
          },
          {
              "role": "assistant",
              "content": response.content  # Contains multiple tool_use blocks
          },
          {
              "role": "user",
              "content": [
                  {
                      "type": "tool_result",
                      "tool_use_id": "toolu_01",  # Must match the ID from tool_use
                      "content": "San Francisco: 68°F, partly cloudy"
                  },
                  {
                      "type": "tool_result",
                      "tool_use_id": "toolu_02",
                      "content": "New York: 45°F, clear skies"
                  },
                  {
                      "type": "tool_result",
                      "tool_use_id": "toolu_03",
                      "content": "San Francisco time: 2:30 PM PST"
                  },
                  {
                      "type": "tool_result",
                      "tool_use_id": "toolu_04",
                      "content": "New York time: 5:30 PM EST"
                  }
              ]
          }
      ]

      # Get final response
      final_response = client.messages.create(
          model="claude-opus-4-20250514",
          max_tokens=1024,
          tools=tools,
          messages=messages
      )

      print(final_response.content[0].text)
      ```

      ```typescript TypeScript
      import { Anthropic } from '@anthropic-ai/sdk';

      const anthropic = new Anthropic();

      // Define tools
      const tools = [
        {
          name: "get_weather",
          description: "Get the current weather in a given location",
          input_schema: {
            type: "object",
            properties: {
              location: {
                type: "string",
                description: "The city and state, e.g. San Francisco, CA"
              }
            },
            required: ["location"]
          }
        },
        {
          name: "get_time",
          description: "Get the current time in a given timezone",
          input_schema: {
            type: "object",
            properties: {
              timezone: {
                type: "string",
                description: "The timezone, e.g. America/New_York"
              }
            },
            required: ["timezone"]
          }
        }
      ];

      // Initial request
      const response = await anthropic.messages.create({
        model: "claude-opus-4-20250514",
        max_tokens: 1024,
        tools: tools,
        messages: [
          {
            role: "user",
            content: "What's the weather in SF and NYC, and what time is it there?"
          }
        ]
      });

      // Build conversation with tool results
      const messages = [
        {
          role: "user",
          content: "What's the weather in SF and NYC, and what time is it there?"
        },
        {
          role: "assistant",
          content: response.content  // Contains multiple tool_use blocks
        },
        {
          role: "user",
          content: [
            {
              type: "tool_result",
              tool_use_id: "toolu_01",  // Must match the ID from tool_use
              content: "San Francisco: 68°F, partly cloudy"
            },
            {
              type: "tool_result",
              tool_use_id: "toolu_02",
              content: "New York: 45°F, clear skies"
            },
            {
              type: "tool_result",
              tool_use_id: "toolu_03",
              content: "San Francisco time: 2:30 PM PST"
            },
            {
              type: "tool_result",
              tool_use_id: "toolu_04",
              content: "New York time: 5:30 PM EST"
            }
          ]
        }
      ];

      // Get final response
      const finalResponse = await anthropic.messages.create({
        model: "claude-opus-4-20250514",
        max_tokens: 1024,
        tools: tools,
        messages: messages
      });

      console.log(finalResponse.content[0].text);
      ```
    </CodeGroup>

    The assistant message with parallel tool calls would look like this:

    ```json
    {
      "role": "assistant",
      "content": [
        {
          "type": "text",
          "text": "I'll check the weather and time for both San Francisco and New York City."
        },
        {
          "type": "tool_use",
          "id": "toolu_01",
          "name": "get_weather",
          "input": {"location": "San Francisco, CA"}
        },
        {
          "type": "tool_use",
          "id": "toolu_02",
          "name": "get_weather",
          "input": {"location": "New York, NY"}
        },
        {
          "type": "tool_use",
          "id": "toolu_03",
          "name": "get_time",
          "input": {"timezone": "America/Los_Angeles"}
        },
        {
          "type": "tool_use",
          "id": "toolu_04",
          "name": "get_time",
          "input": {"timezone": "America/New_York"}
        }
      ]
    }
    ```
  </Accordion>

  <Accordion title="Complete test script for parallel tools">
    Here's a complete, runnable script to test and verify parallel tool calls are working correctly:

    <CodeGroup>
      ```python Python
      #!/usr/bin/env python3
      """Test script to verify parallel tool calls with the Anthropic API"""

      import os
      from anthropic import Anthropic

      # Initialize client
      client = Anthropic(api_key=os.environ.get("ANTHROPIC_API_KEY"))

      # Define tools
      tools = [
          {
              "name": "get_weather",
              "description": "Get the current weather in a given location",
              "input_schema": {
                  "type": "object",
                  "properties": {
                      "location": {
                          "type": "string",
                          "description": "The city and state, e.g. San Francisco, CA"
                      }
                  },
                  "required": ["location"]
              }
          },
          {
              "name": "get_time",
              "description": "Get the current time in a given timezone",
              "input_schema": {
                  "type": "object",
                  "properties": {
                      "timezone": {
                          "type": "string",
                          "description": "The timezone, e.g. America/New_York"
                      }
                  },
                  "required": ["timezone"]
              }
          }
      ]

      # Test conversation with parallel tool calls
      messages = [
          {
              "role": "user",
              "content": "What's the weather in SF and NYC, and what time is it there?"
          }
      ]

      # Make initial request
      print("Requesting parallel tool calls...")
      response = client.messages.create(
          model="claude-opus-4-20250514",
          max_tokens=1024,
          messages=messages,
          tools=tools
      )

      # Check for parallel tool calls
      tool_uses = [block for block in response.content if block.type == "tool_use"]
      print(f"\n✓ Claude made {len(tool_uses)} tool calls")

      if len(tool_uses) > 1:
          print("✓ Parallel tool calls detected!")
          for tool in tool_uses:
              print(f"  - {tool.name}: {tool.input}")
      else:
          print("✗ No parallel tool calls detected")

      # Simulate tool execution and format results correctly
      tool_results = []
      for tool_use in tool_uses:
          if tool_use.name == "get_weather":
              if "San Francisco" in str(tool_use.input):
                  result = "San Francisco: 68°F, partly cloudy"
              else:
                  result = "New York: 45°F, clear skies"
          else:  # get_time
              if "Los_Angeles" in str(tool_use.input):
                  result = "2:30 PM PST"
              else:
                  result = "5:30 PM EST"
          
          tool_results.append({
              "type": "tool_result",
              "tool_use_id": tool_use.id,
              "content": result
          })

      # Continue conversation with tool results
      messages.extend([
          {"role": "assistant", "content": response.content},
          {"role": "user", "content": tool_results}  # All results in one message!
      ])

      # Get final response
      print("\nGetting final response...")
      final_response = client.messages.create(
          model="claude-opus-4-20250514",
          max_tokens=1024,
          messages=messages,
          tools=tools
      )

      print(f"\nClaude's response:\n{final_response.content[0].text}")

      # Verify formatting
      print("\n--- Verification ---")
      print(f"✓ Tool results sent in single user message: {len(tool_results)} results")
      print("✓ No text before tool results in content array")
      print("✓ Conversation formatted correctly for future parallel tool use")
      ```

      ```typescript TypeScript
      #!/usr/bin/env node
      // Test script to verify parallel tool calls with the Anthropic API

      import { Anthropic } from '@anthropic-ai/sdk';

      const anthropic = new Anthropic({
        apiKey: process.env.ANTHROPIC_API_KEY
      });

      // Define tools
      const tools = [
        {
          name: "get_weather",
          description: "Get the current weather in a given location",
          input_schema: {
            type: "object",
            properties: {
              location: {
                type: "string",
                description: "The city and state, e.g. San Francisco, CA"
              }
            },
            required: ["location"]
          }
        },
        {
          name: "get_time",
          description: "Get the current time in a given timezone",
          input_schema: {
            type: "object",
            properties: {
              timezone: {
                type: "string",
                description: "The timezone, e.g. America/New_York"
              }
            },
            required: ["timezone"]
          }
        }
      ];

      async function testParallelTools() {
        // Make initial request
        console.log("Requesting parallel tool calls...");
        const response = await anthropic.messages.create({
          model: "claude-opus-4-20250514",
          max_tokens: 1024,
          messages: [{
            role: "user",
            content: "What's the weather in SF and NYC, and what time is it there?"
          }],
          tools: tools
        });

        // Check for parallel tool calls
        const toolUses = response.content.filter(block => block.type === "tool_use");
        console.log(`\n✓ Claude made ${toolUses.length} tool calls`);

        if (toolUses.length > 1) {
          console.log("✓ Parallel tool calls detected!");
          toolUses.forEach(tool => {
            console.log(`  - ${tool.name}: ${JSON.stringify(tool.input)}`);
          });
        } else {
          console.log("✗ No parallel tool calls detected");
        }

        // Simulate tool execution and format results correctly
        const toolResults = toolUses.map(toolUse => {
          let result;
          if (toolUse.name === "get_weather") {
            result = toolUse.input.location.includes("San Francisco") 
              ? "San Francisco: 68°F, partly cloudy"
              : "New York: 45°F, clear skies";
          } else {
            result = toolUse.input.timezone.includes("Los_Angeles")
              ? "2:30 PM PST"
              : "5:30 PM EST";
          }
          
          return {
            type: "tool_result",
            tool_use_id: toolUse.id,
            content: result
          };
        });

        // Get final response with correct formatting
        console.log("\nGetting final response...");
        const finalResponse = await anthropic.messages.create({
          model: "claude-opus-4-20250514",
          max_tokens: 1024,
          messages: [
            { role: "user", content: "What's the weather in SF and NYC, and what time is it there?" },
            { role: "assistant", content: response.content },
            { role: "user", content: toolResults }  // All results in one message!
          ],
          tools: tools
        });

        console.log(`\nClaude's response:\n${finalResponse.content[0].text}`);

        // Verify formatting
        console.log("\n--- Verification ---");
        console.log(`✓ Tool results sent in single user message: ${toolResults.length} results`);
        console.log("✓ No text before tool results in content array");
        console.log("✓ Conversation formatted correctly for future parallel tool use");
      }

      testParallelTools().catch(console.error);
      ```
    </CodeGroup>

    This script demonstrates:

    * How to properly format parallel tool calls and results
    * How to verify that parallel calls are being made
    * The correct message structure that encourages future parallel tool use
    * Common mistakes to avoid (like text before tool results)

    Run this script to test your implementation and ensure Claude is making parallel tool calls effectively.
  </Accordion>
</AccordionGroup>

#### Maximizing parallel tool use

While Claude 4 models have excellent parallel tool use capabilities by default, you can increase the likelihood of parallel tool execution across all models with targeted prompting:

<AccordionGroup>
  <Accordion title="System prompts for parallel tool use">
    For Claude 4 models (Opus 4 and Sonnet 4), add this to your system prompt:

    ```text
    For maximum efficiency, whenever you need to perform multiple independent operations, invoke all relevant tools simultaneously rather than sequentially.
    ```

    For even stronger parallel tool use (recommended if the default isn't sufficient), use:

    ```text
    <use_parallel_tool_calls>
    For maximum efficiency, whenever you perform multiple independent operations, invoke all relevant tools simultaneously rather than sequentially. Prioritize calling tools in parallel whenever possible. For example, when reading 3 files, run 3 tool calls in parallel to read all 3 files into context at the same time. When running multiple read-only commands like `ls` or `list_dir`, always run all of the commands in parallel. Err on the side of maximizing parallel tool calls rather than running too many tools sequentially.
    </use_parallel_tool_calls>
    ```
  </Accordion>

  <Accordion title="User message prompting">
    You can also encourage parallel tool use within specific user messages:

    ```python
    # Instead of:
    "What's the weather in Paris? Also check London."

    # Use:
    "Check the weather in Paris and London simultaneously."

    # Or be explicit:
    "Please use parallel tool calls to get the weather for Paris, London, and Tokyo at the same time."
    ```
  </Accordion>
</AccordionGroup>

<Warning>
  **Parallel tool use with Claude Sonnet 3.7**

  Claude Sonnet 3.7 may be less likely to make make parallel tool calls in a response, even when you have not set `disable_parallel_tool_use`. To work around this, we recommend enabling [token-efficient tool use](/en/docs/agents-and-tools/tool-use/token-efficient-tool-use), which helps encourage Claude to use parallel tools. This beta feature also reduces latency and saves an average of 14% in output tokens.

  If you prefer not to opt into the token-efficient tool use beta, you can also introduce a "batch tool" that can act as a meta-tool to wrap invocations to other tools simultaneously. We find that if this tool is present, the model will use it to simultaneously call multiple tools in parallel for you.

  See [this example](https://github.com/anthropics/anthropic-cookbook/blob/main/tool_use/parallel_tools_claude_3_7_sonnet.ipynb) in our cookbook for how to use this workaround.
</Warning>

## Handling tool use and tool result content blocks

Claude's response differs based on whether it uses a client or server tool.

### Handling results from client tools

The response will have a `stop_reason` of `tool_use` and one or more `tool_use` content blocks that include:

* `id`: A unique identifier for this particular tool use block. This will be used to match up the tool results later.
* `name`: The name of the tool being used.
* `input`: An object containing the input being passed to the tool, conforming to the tool's `input_schema`.

<Accordion title="Example API response with a `tool_use` content block">
  ```JSON JSON
  {
    "id": "msg_01Aq9w938a90dw8q",
    "model": "claude-opus-4-20250514",
    "stop_reason": "tool_use",
    "role": "assistant",
    "content": [
      {
        "type": "text",
        "text": "<thinking>I need to use the get_weather, and the user wants SF, which is likely San Francisco, CA.</thinking>"
      },
      {
        "type": "tool_use",
        "id": "toolu_01A09q90qw90lq917835lq9",
        "name": "get_weather",
        "input": {"location": "San Francisco, CA", "unit": "celsius"}
      }
    ]
  }
  ```
</Accordion>

When you receive a tool use response for a client tool, you should:

1. Extract the `name`, `id`, and `input` from the `tool_use` block.
2. Run the actual tool in your codebase corresponding to that tool name, passing in the tool `input`.
3. Continue the conversation by sending a new message with the `role` of `user`, and a `content` block containing the `tool_result` type and the following information:
   * `tool_use_id`: The `id` of the tool use request this is a result for.
   * `content`: The result of the tool, as a string (e.g. `"content": "15 degrees"`) or list of nested content blocks (e.g. `"content": [{"type": "text", "text": "15 degrees"}]`). These content blocks can use the `text` or `image` types.
   * `is_error` (optional): Set to `true` if the tool execution resulted in an error.

<Note>
  **Important formatting requirements**:

  * Tool result blocks must immediately follow their corresponding tool use blocks in the message history. You cannot include any messages between the assistant's tool use message and the user's tool result message.
  * In the user message containing tool results, the tool\_result blocks must come FIRST in the content array. Any text must come AFTER all tool results.

  For example, this will cause a 400 error:

  ```json
  {"role": "user", "content": [
    {"type": "text", "text": "Here are the results:"},  // ❌ Text before tool_result
    {"type": "tool_result", "tool_use_id": "toolu_01", ...}
  ]}
  ```

  This is correct:

  ```json
  {"role": "user", "content": [
    {"type": "tool_result", "tool_use_id": "toolu_01", ...},
    {"type": "text", "text": "What should I do next?"}  // ✅ Text after tool_result
  ]}
  ```

  If you receive an error like "tool\_use ids were found without tool\_result blocks immediately after", check that your tool results are formatted correctly.
</Note>

<AccordionGroup>
  <Accordion title="Example of successful tool result">
    ```JSON JSON
    {
      "role": "user",
      "content": [
        {
          "type": "tool_result",
          "tool_use_id": "toolu_01A09q90qw90lq917835lq9",
          "content": "15 degrees"
        }
      ]
    }
    ```
  </Accordion>

  <Accordion title="Example of tool result with images">
    ```JSON JSON
    {
      "role": "user",
      "content": [
        {
          "type": "tool_result",
          "tool_use_id": "toolu_01A09q90qw90lq917835lq9",
          "content": [
            {"type": "text", "text": "15 degrees"},
            {
              "type": "image",
              "source": {
                "type": "base64",
                "media_type": "image/jpeg",
                "data": "/9j/4AAQSkZJRg...",
              }
            }
          ]
        }
      ]
    }
    ```
  </Accordion>

  <Accordion title="Example of empty tool result">
    ```JSON JSON
    {
      "role": "user",
      "content": [
        {
          "type": "tool_result",
          "tool_use_id": "toolu_01A09q90qw90lq917835lq9",
        }
      ]
    }
    ```
  </Accordion>
</AccordionGroup>

After receiving the tool result, Claude will use that information to continue generating a response to the original user prompt.

### Handling results from server tools

Claude executes the tool internally and incorporates the results directly into its response without requiring additional user interaction.

<Tip>
  **Differences from other APIs**

  Unlike APIs that separate tool use or use special roles like `tool` or `function`, Anthropic's API integrates tools directly into the `user` and `assistant` message structure.

  Messages contain arrays of `text`, `image`, `tool_use`, and `tool_result` blocks. `user` messages include client content and `tool_result`, while `assistant` messages contain AI-generated content and `tool_use`.
</Tip>

### Handling the `max_tokens` stop reason

If Claude's [response is cut off due to hitting the `max_tokens` limit](/en/api/handling-stop-reasons#max-tokens), and the truncated response contains an incomplete tool use block, you'll need to retry the request with a higher `max_tokens` value to get the full tool use.

<CodeGroup>
  ```python Python
  # Check if response was truncated during tool use
  if response.stop_reason == "max_tokens":
      # Check if the last content block is an incomplete tool_use
      last_block = response.content[-1]
      if last_block.type == "tool_use":
          # Send the request with higher max_tokens
          response = client.messages.create(
              model="claude-opus-4-20250514",
              max_tokens=4096,  # Increased limit
              messages=messages,
              tools=tools
          )
  ```

  ```typescript TypeScript
  // Check if response was truncated during tool use
  if (response.stop_reason === "max_tokens") {
    // Check if the last content block is an incomplete tool_use
    const lastBlock = response.content[response.content.length - 1];
    if (lastBlock.type === "tool_use") {
      // Send the request with higher max_tokens
      response = await anthropic.messages.create({
        model: "claude-opus-4-20250514",
        max_tokens: 4096, // Increased limit
        messages: messages,
        tools: tools
      });
    }
  }
  ```
</CodeGroup>

#### Handling the `pause_turn` stop reason

When using server tools like web search, the API may return a `pause_turn` stop reason, indicating that the API has paused a long-running turn.

Here's how to handle the `pause_turn` stop reason:

<CodeGroup>
  ```python Python
  import anthropic

  client = anthropic.Anthropic()

  # Initial request with web search
  response = client.messages.create(
      model="claude-3-7-sonnet-latest",
      max_tokens=1024,
      messages=[
          {
              "role": "user",
              "content": "Search for comprehensive information about quantum computing breakthroughs in 2025"
          }
      ],
      tools=[{
          "type": "web_search_20250305",
          "name": "web_search",
          "max_uses": 10
      }]
  )

  # Check if the response has pause_turn stop reason
  if response.stop_reason == "pause_turn":
      # Continue the conversation with the paused content
      messages = [
          {"role": "user", "content": "Search for comprehensive information about quantum computing breakthroughs in 2025"},
          {"role": "assistant", "content": response.content}
      ]
      
      # Send the continuation request
      continuation = client.messages.create(
          model="claude-3-7-sonnet-latest",
          max_tokens=1024,
          messages=messages,
          tools=[{
              "type": "web_search_20250305",
              "name": "web_search",
              "max_uses": 10
          }]
      )
      
      print(continuation)
  else:
      print(response)
  ```

  ```typescript TypeScript
  import { Anthropic } from '@anthropic-ai/sdk';

  const anthropic = new Anthropic();

  // Initial request with web search
  const response = await anthropic.messages.create({
    model: "claude-3-7-sonnet-latest",
    max_tokens: 1024,
    messages: [
      {
        role: "user",
        content: "Search for comprehensive information about quantum computing breakthroughs in 2025"
      }
    ],
    tools: [{
      type: "web_search_20250305",
      name: "web_search",
      max_uses: 10
    }]
  });

  // Check if the response has pause_turn stop reason
  if (response.stop_reason === "pause_turn") {
    // Continue the conversation with the paused content
    const messages = [
      { role: "user", content: "Search for comprehensive information about quantum computing breakthroughs in 2025" },
      { role: "assistant", content: response.content }
    ];
    
    // Send the continuation request
    const continuation = await anthropic.messages.create({
      model: "claude-3-7-sonnet-latest",
      max_tokens: 1024,
      messages: messages,
      tools: [{
        type: "web_search_20250305",
        name: "web_search",
        max_uses: 10
      }]
    });
    
    console.log(continuation);
  } else {
    console.log(response);
  }
  ```
</CodeGroup>

When handling `pause_turn`:

* **Continue the conversation**: Pass the paused response back as-is in a subsequent request to let Claude continue its turn
* **Modify if needed**: You can optionally modify the content before continuing if you want to interrupt or redirect the conversation
* **Preserve tool state**: Include the same tools in the continuation request to maintain functionality

## Troubleshooting errors

There are a few different types of errors that can occur when using tools with Claude:

<AccordionGroup>
  <Accordion title="Tool execution error">
    If the tool itself throws an error during execution (e.g. a network error when fetching weather data), you can return the error message in the `content` along with `"is_error": true`:

    ```JSON JSON
    {
      "role": "user",
      "content": [
        {
          "type": "tool_result",
          "tool_use_id": "toolu_01A09q90qw90lq917835lq9",
          "content": "ConnectionError: the weather service API is not available (HTTP 500)",
          "is_error": true
        }
      ]
    }
    ```

    Claude will then incorporate this error into its response to the user, e.g. "I'm sorry, I was unable to retrieve the current weather because the weather service API is not available. Please try again later."
  </Accordion>

  <Accordion title="Invalid tool name">
    If Claude's attempted use of a tool is invalid (e.g. missing required parameters), it usually means that the there wasn't enough information for Claude to use the tool correctly. Your best bet during development is to try the request again with more-detailed `description` values in your tool definitions.

    However, you can also continue the conversation forward with a `tool_result` that indicates the error, and Claude will try to use the tool again with the missing information filled in:

    ```JSON JSON
    {
      "role": "user",
      "content": [
        {
          "type": "tool_result",
          "tool_use_id": "toolu_01A09q90qw90lq917835lq9",
          "content": "Error: Missing required 'location' parameter",
          "is_error": true
        }
      ]
    }
    ```

    If a tool request is invalid or missing parameters, Claude will retry 2-3 times with corrections before apologizing to the user.
  </Accordion>

  <Accordion title="<search_quality_reflection> tags">
    To prevent Claude from reflecting on search quality with \<search\_quality\_reflection> tags, add "Do not reflect on the quality of the returned search results in your response" to your prompt.
  </Accordion>

  <Accordion title="Server tool errors">
    When server tools encounter errors (e.g., network issues with Web Search), Claude will transparently handle these errors and attempt to provide an alternative response or explanation to the user. Unlike client tools, you do not need to handle `is_error` results for server tools.

    For web search specifically, possible error codes include:

    * `too_many_requests`: Rate limit exceeded
    * `invalid_input`: Invalid search query parameter
    * `max_uses_exceeded`: Maximum web search tool uses exceeded
    * `query_too_long`: Query exceeds maximum length
    * `unavailable`: An internal error occurred
  </Accordion>

  <Accordion title="Parallel tool calls not working">
    If Claude isn't making parallel tool calls when expected, check these common issues:

    **1. Incorrect tool result formatting**

    The most common issue is formatting tool results incorrectly in the conversation history. This "teaches" Claude to avoid parallel calls.

    Specifically for parallel tool use:

    * ❌ **Wrong**: Sending separate user messages for each tool result
    * ✅ **Correct**: All tool results must be in a single user message

    ```json
    // ❌ This reduces parallel tool use
    [
      {"role": "assistant", "content": [tool_use_1, tool_use_2]},
      {"role": "user", "content": [tool_result_1]},
      {"role": "user", "content": [tool_result_2]}  // Separate message
    ]

    // ✅ This maintains parallel tool use
    [
      {"role": "assistant", "content": [tool_use_1, tool_use_2]},
      {"role": "user", "content": [tool_result_1, tool_result_2]}  // Single message
    ]
    ```

    See the [general formatting requirements above](#handling-tool-use-and-tool-result-content-blocks) for other formatting rules.

    **2. Weak prompting**

    Default prompting may not be sufficient. Use stronger language:

    ```text
    <use_parallel_tool_calls>
    For maximum efficiency, whenever you perform multiple independent operations, 
    invoke all relevant tools simultaneously rather than sequentially. 
    Prioritize calling tools in parallel whenever possible.
    </use_parallel_tool_calls>
    ```

    **3. Measuring parallel tool usage**

    To verify parallel tool calls are working:

    ```python
    # Calculate average tools per tool-calling message
    tool_call_messages = [msg for msg in messages if any(
        block.type == "tool_use" for block in msg.content
    )]
    total_tool_calls = sum(
        len([b for b in msg.content if b.type == "tool_use"]) 
        for msg in tool_call_messages
    )
    avg_tools_per_message = total_tool_calls / len(tool_call_messages)
    print(f"Average tools per message: {avg_tools_per_message}")
    # Should be > 1.0 if parallel calls are working
    ```

    **4. Model-specific behavior**

    * Claude Opus 4 and Sonnet 4: Excel at parallel tool use with minimal prompting
    * Claude Sonnet 3.7: May need stronger prompting or [token-efficient tool use](/en/docs/agents-and-tools/tool-use/token-efficient-tool-use)
    * Claude Haiku: Less likely to use parallel tools without explicit prompting
  </Accordion>
</AccordionGroup>


# Token-efficient tool use

Claude Sonnet 3.7 is capable of calling tools in a token-efficient manner. Requests save an average of 14% in output tokens, up to 70%, which also reduces latency. Exact token reduction and latency improvements depend on the overall response shape and size.

<Info>
  Token-efficient tool use is a beta feature. Please make sure to evaluate your responses before using it in production.

  Please use [this form](https://forms.gle/iEG7XgmQgzceHgQKA) to provide feedback on the quality of the model responses, the API itself, or the quality of the documentation—we cannot wait to hear from you!
</Info>

<Tip>
  If you choose to experiment with this feature, we recommend using the [Prompt Improver](https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/prompt-improver) in the [Console](https://console.anthropic.com/) to improve your prompt.
</Tip>

<Warning>
  Token-efficient tool use does not currently work with [`disable_parallel_tool_use`](https://docs.anthropic.com/en/docs/build-with-claude/tool-use#disabling-parallel-tool-use).

  Claude 4 models (Opus and Sonnet) do not support this feature. The beta header `token-efficient-tools-2025-02-19` will not break an API request, but it will result in a no-op.
</Warning>

To use this beta feature, simply add the beta header `token-efficient-tools-2025-02-19` to a tool use request. If you are using the SDK, ensure that you are using the beta SDK with `anthropic.beta.messages`.

Here's an example of how to use token-efficient tools with the API:

<CodeGroup>
  ```bash Shell
  curl https://api.anthropic.com/v1/messages \
    -H "content-type: application/json" \
    -H "x-api-key: $ANTHROPIC_API_KEY" \
    -H "anthropic-version: 2023-06-01" \
    -H "anthropic-beta: token-efficient-tools-2025-02-19" \
    -d '{
      "model": "claude-3-7-sonnet-20250219",
      "max_tokens": 1024,
      "tools": [
        {
          "name": "get_weather",
          "description": "Get the current weather in a given location",
          "input_schema": {
            "type": "object",
            "properties": {
              "location": {
                "type": "string",
                "description": "The city and state, e.g. San Francisco, CA"
              }
            },
            "required": [
              "location"
            ]
          }
        }
      ],
      "messages": [
        {
          "role": "user",
          "content": "Tell me the weather in San Francisco."
        }
      ]
    }' | jq '.usage'
  ```

  ```Python Python
  import anthropic

  client = anthropic.Anthropic()

  response = client.beta.messages.create(
      max_tokens=1024,
      model="claude-3-7-sonnet-20250219",
      tools=[{
        "name": "get_weather",
        "description": "Get the current weather in a given location",
        "input_schema": {
          "type": "object",
          "properties": {
            "location": {
              "type": "string",
              "description": "The city and state, e.g. San Francisco, CA"
            }
          },
          "required": [
            "location"
          ]
        }
      }],
      messages=[{
        "role": "user",
        "content": "Tell me the weather in San Francisco."
      }],
      betas=["token-efficient-tools-2025-02-19"]
  )

  print(response.usage)
  ```

  ```TypeScript TypeScript
  import Anthropic from '@anthropic-ai/sdk';

  const anthropic = new Anthropic();

  const message = await anthropic.beta.messages.create({
    model: "claude-3-7-sonnet-20250219",
    max_tokens: 1024,
    tools: [{
      name: "get_weather",
      description: "Get the current weather in a given location",
      input_schema: {
        type: "object",
        properties: {
          location: {
            type: "string",
            description: "The city and state, e.g. San Francisco, CA"
          }
        },
        required: ["location"]
      }
    }],
    messages: [{ 
      role: "user", 
      content: "Tell me the weather in San Francisco." 
    }],
    betas: ["token-efficient-tools-2025-02-19"]
  });

  console.log(message.usage);
  ```

  ```Java Java
  import java.util.List;
  import java.util.Map;

  import com.anthropic.client.AnthropicClient;
  import com.anthropic.client.okhttp.AnthropicOkHttpClient;
  import com.anthropic.core.JsonValue;
  import com.anthropic.models.beta.messages.BetaMessage;
  import com.anthropic.models.beta.messages.BetaTool;
  import com.anthropic.models.beta.messages.MessageCreateParams;

  import static com.anthropic.models.beta.AnthropicBeta.TOKEN_EFFICIENT_TOOLS_2025_02_19;

  public class TokenEfficientToolsExample {

      public static void main(String[] args) {
          AnthropicClient client = AnthropicOkHttpClient.fromEnv();

          BetaTool.InputSchema schema = BetaTool.InputSchema.builder()
                  .properties(JsonValue.from(Map.of(
                          "location",
                          Map.of(
                                  "type", "string",
                                  "description", "The city and state, e.g. San Francisco, CA"
                          )
                  )))
                  .putAdditionalProperty("required", JsonValue.from(List.of("location")))
                  .build();

          MessageCreateParams params = MessageCreateParams.builder()
                  .model("claude-3-7-sonnet-20250219")
                  .maxTokens(1024)
                  .betas(List.of(TOKEN_EFFICIENT_TOOLS_2025_02_19))
                  .addTool(BetaTool.builder()
                          .name("get_weather")
                          .description("Get the current weather in a given location")
                          .inputSchema(schema)
                          .build())
                  .addUserMessage("Tell me the weather in San Francisco.")
                  .build();

          BetaMessage message = client.beta().messages().create(params);
          System.out.println(message.usage());
      }
  }
  ```
</CodeGroup>

The above request should, on average, use fewer input and output tokens than a normal request. To confirm this, try making the same request but remove `token-efficient-tools-2025-02-19` from the beta headers list.

<Tip>
  To keep the benefits of prompt caching, use the beta header consistently for requests you’d like to cache. If you selectively use it, prompt caching will fail.
</Tip>


# Fine-grained tool streaming

Tool use now supports fine-grained [streaming](/en/docs/build-with-claude/streaming) for parameter values. This allows developers to stream tool use parameters without buffering / JSON validation, reducing the latency to begin receiving large parameters.

<Note>
  Fine-grained tool streaming is a beta feature. Please make sure to evaluate your responses before using it in production.

  Please use [this form](https://forms.gle/D4Fjr7GvQRzfTZT96) to provide feedback on the quality of the model responses, the API itself, or the quality of the documentation—we cannot wait to hear from you!
</Note>

<Warning>
  When using fine-grained tool streaming, you may potentially receive invalid or partial JSON inputs. Please make sure to account for these edge cases in your code.
</Warning>

## How to use fine-grained tool streaming

To use this beta feature, simply add the beta header `fine-grained-tool-streaming-2025-05-14` to a tool use request and turn on streaming.

Here's an example of how to use fine-grained tool streaming with the API:

<CodeGroup>
  ```bash Shell
  curl https://api.anthropic.com/v1/messages \
    -H "content-type: application/json" \
    -H "x-api-key: $ANTHROPIC_API_KEY" \
    -H "anthropic-version: 2023-06-01" \
    -H "anthropic-beta: fine-grained-tool-streaming-2025-05-14" \
    -d '{
      "model": "claude-sonnet-4-20250514",
      "max_tokens": 65536,
      "tools": [
        {
          "name": "make_file",
          "description": "Write text to a file",
          "input_schema": {
            "type": "object",
            "properties": {
              "filename": {
                "type": "string",
                "description": "The filename to write text to"
              },
              "lines_of_text": {
                "type": "array",
                "description": "An array of lines of text to write to the file"
              }
            },
            "required": ["filename", "lines_of_text"]
          }
        }
      ],
      "messages": [
        {
          "role": "user",
          "content": "Can you write a long poem and make a file called poem.txt?"
        }
      ],
      "stream": true
    }' | jq '.usage'
  ```

  ```Python Python
  import anthropic

  client = anthropic.Anthropic()

  response = client.beta.messages.stream(
      max_tokens=65536,
      model="claude-sonnet-4-20250514",
      tools=[{
        "name": "make_file",
        "description": "Write text to a file",
        "input_schema": {
          "type": "object",
          "properties": {
            "filename": {
              "type": "string",
              "description": "The filename to write text to"
            },
            "lines_of_text": {
              "type": "array",
              "description": "An array of lines of text to write to the file"
            }
          },
          "required": ["filename", "lines_of_text"]
        }
      }],
      messages=[{
        "role": "user",
        "content": "Can you write a long poem and make a file called poem.txt?"
      }],
      betas=["fine-grained-tool-streaming-2025-05-14"]
  )

  print(response.usage)
  ```

  ```TypeScript TypeScript
  import Anthropic from '@anthropic-ai/sdk';

  const anthropic = new Anthropic();

  const message = await anthropic.beta.messages.stream({
    model: "claude-sonnet-4-20250514",
    max_tokens: 65536,
    tools: [{
      "name": "make_file",
      "description": "Write text to a file",
      "input_schema": {
        "type": "object",
        "properties": {
          "filename": {
            "type": "string",
            "description": "The filename to write text to"
          },
          "lines_of_text": {
            "type": "array",
            "description": "An array of lines of text to write to the file"
          }
        },
        "required": ["filename", "lines_of_text"]
      }
    }],
    messages: [{ 
      role: "user", 
      content: "Can you write a long poem and make a file called poem.txt?" 
    }],
    betas: ["fine-grained-tool-streaming-2025-05-14"]
  });

  console.log(message.usage);
  ```
</CodeGroup>

In this example, fine-grained tool streaming enables Claude to stream the lines of a long poem into the tool call `make_file` without buffering to validate if the `lines_of_text` parameter is valid JSON. This means you can see the parameter stream as it arrives, without having to wait for the entire parameter to buffer and validate.

<Note>
  With fine-grained tool streaming, tool use chunks start streaming faster, and are often longer and contain fewer word breaks. This is due to differences in chunking behavior.

  Example:

  Without fine-grained streaming (15s delay):

  ```
  Chunk 1: '{"'
  Chunk 2: 'query": "Ty'
  Chunk 3: 'peScri'
  Chunk 4: 'pt 5.0 5.1 '
  Chunk 5: '5.2 5'
  Chunk 6: '.3'
  Chunk 8: ' new f'
  Chunk 9: 'eatur'
  ...
  ```

  With fine-grained streaming (3s delay):

  ```
  Chunk 1: '{"query": "TypeScript 5.0 5.1 5.2 5.3'
  Chunk 2: ' new features comparison'
  ```
</Note>

<Warning>
  Because fine-grained streaming sends parameters without buffering or JSON validation, there is no guarantee that the resulting stream will complete in a valid JSON string.
  Particularly, if the [stop reason](/en/api/handling-stop-reasons) `max_tokens` is reached, the stream may end midway through a parameter and may be incomplete. You will generally have to write specific support to handle when `max_tokens` is reached.
</Warning>

## Handling invalid JSON in tool responses

When using fine-grained tool streaming, you may receive invalid or incomplete JSON from the model. If you need to pass this invalid JSON back to the model in an error response block, you may wrap it in a JSON object to ensure proper handling (with a reasonable key). For example:

```json
{
  "INVALID_JSON": "<your invalid json string>"
}
```

This approach helps the model understand that the content is invalid JSON while preserving the original malformed data for debugging purposes.

<Note>
  When wrapping invalid JSON, make sure to properly escape any quotes or special characters in the invalid JSON string to maintain valid JSON structure in the wrapper object.
</Note>


# Fine-grained tool streaming

Tool use now supports fine-grained [streaming](/en/docs/build-with-claude/streaming) for parameter values. This allows developers to stream tool use parameters without buffering / JSON validation, reducing the latency to begin receiving large parameters.

<Note>
  Fine-grained tool streaming is a beta feature. Please make sure to evaluate your responses before using it in production.

  Please use [this form](https://forms.gle/D4Fjr7GvQRzfTZT96) to provide feedback on the quality of the model responses, the API itself, or the quality of the documentation—we cannot wait to hear from you!
</Note>

<Warning>
  When using fine-grained tool streaming, you may potentially receive invalid or partial JSON inputs. Please make sure to account for these edge cases in your code.
</Warning>

## How to use fine-grained tool streaming

To use this beta feature, simply add the beta header `fine-grained-tool-streaming-2025-05-14` to a tool use request and turn on streaming.

Here's an example of how to use fine-grained tool streaming with the API:

<CodeGroup>
  ```bash Shell
  curl https://api.anthropic.com/v1/messages \
    -H "content-type: application/json" \
    -H "x-api-key: $ANTHROPIC_API_KEY" \
    -H "anthropic-version: 2023-06-01" \
    -H "anthropic-beta: fine-grained-tool-streaming-2025-05-14" \
    -d '{
      "model": "claude-sonnet-4-20250514",
      "max_tokens": 65536,
      "tools": [
        {
          "name": "make_file",
          "description": "Write text to a file",
          "input_schema": {
            "type": "object",
            "properties": {
              "filename": {
                "type": "string",
                "description": "The filename to write text to"
              },
              "lines_of_text": {
                "type": "array",
                "description": "An array of lines of text to write to the file"
              }
            },
            "required": ["filename", "lines_of_text"]
          }
        }
      ],
      "messages": [
        {
          "role": "user",
          "content": "Can you write a long poem and make a file called poem.txt?"
        }
      ],
      "stream": true
    }' | jq '.usage'
  ```

  ```Python Python
  import anthropic

  client = anthropic.Anthropic()

  response = client.beta.messages.stream(
      max_tokens=65536,
      model="claude-sonnet-4-20250514",
      tools=[{
        "name": "make_file",
        "description": "Write text to a file",
        "input_schema": {
          "type": "object",
          "properties": {
            "filename": {
              "type": "string",
              "description": "The filename to write text to"
            },
            "lines_of_text": {
              "type": "array",
              "description": "An array of lines of text to write to the file"
            }
          },
          "required": ["filename", "lines_of_text"]
        }
      }],
      messages=[{
        "role": "user",
        "content": "Can you write a long poem and make a file called poem.txt?"
      }],
      betas=["fine-grained-tool-streaming-2025-05-14"]
  )

  print(response.usage)
  ```

  ```TypeScript TypeScript
  import Anthropic from '@anthropic-ai/sdk';

  const anthropic = new Anthropic();

  const message = await anthropic.beta.messages.stream({
    model: "claude-sonnet-4-20250514",
    max_tokens: 65536,
    tools: [{
      "name": "make_file",
      "description": "Write text to a file",
      "input_schema": {
        "type": "object",
        "properties": {
          "filename": {
            "type": "string",
            "description": "The filename to write text to"
          },
          "lines_of_text": {
            "type": "array",
            "description": "An array of lines of text to write to the file"
          }
        },
        "required": ["filename", "lines_of_text"]
      }
    }],
    messages: [{ 
      role: "user", 
      content: "Can you write a long poem and make a file called poem.txt?" 
    }],
    betas: ["fine-grained-tool-streaming-2025-05-14"]
  });

  console.log(message.usage);
  ```
</CodeGroup>

In this example, fine-grained tool streaming enables Claude to stream the lines of a long poem into the tool call `make_file` without buffering to validate if the `lines_of_text` parameter is valid JSON. This means you can see the parameter stream as it arrives, without having to wait for the entire parameter to buffer and validate.

<Note>
  With fine-grained tool streaming, tool use chunks start streaming faster, and are often longer and contain fewer word breaks. This is due to differences in chunking behavior.

  Example:

  Without fine-grained streaming (15s delay):

  ```
  Chunk 1: '{"'
  Chunk 2: 'query": "Ty'
  Chunk 3: 'peScri'
  Chunk 4: 'pt 5.0 5.1 '
  Chunk 5: '5.2 5'
  Chunk 6: '.3'
  Chunk 8: ' new f'
  Chunk 9: 'eatur'
  ...
  ```

  With fine-grained streaming (3s delay):

  ```
  Chunk 1: '{"query": "TypeScript 5.0 5.1 5.2 5.3'
  Chunk 2: ' new features comparison'
  ```
</Note>

<Warning>
  Because fine-grained streaming sends parameters without buffering or JSON validation, there is no guarantee that the resulting stream will complete in a valid JSON string.
  Particularly, if the [stop reason](/en/api/handling-stop-reasons) `max_tokens` is reached, the stream may end midway through a parameter and may be incomplete. You will generally have to write specific support to handle when `max_tokens` is reached.
</Warning>

## Handling invalid JSON in tool responses

When using fine-grained tool streaming, you may receive invalid or incomplete JSON from the model. If you need to pass this invalid JSON back to the model in an error response block, you may wrap it in a JSON object to ensure proper handling (with a reasonable key). For example:

```json
{
  "INVALID_JSON": "<your invalid json string>"
}
```

This approach helps the model understand that the content is invalid JSON while preserving the original malformed data for debugging purposes.

<Note>
  When wrapping invalid JSON, make sure to properly escape any quotes or special characters in the invalid JSON string to maintain valid JSON structure in the wrapper object.
</Note>


# Fine-grained tool streaming

Tool use now supports fine-grained [streaming](/en/docs/build-with-claude/streaming) for parameter values. This allows developers to stream tool use parameters without buffering / JSON validation, reducing the latency to begin receiving large parameters.

<Note>
  Fine-grained tool streaming is a beta feature. Please make sure to evaluate your responses before using it in production.

  Please use [this form](https://forms.gle/D4Fjr7GvQRzfTZT96) to provide feedback on the quality of the model responses, the API itself, or the quality of the documentation—we cannot wait to hear from you!
</Note>

<Warning>
  When using fine-grained tool streaming, you may potentially receive invalid or partial JSON inputs. Please make sure to account for these edge cases in your code.
</Warning>

## How to use fine-grained tool streaming

To use this beta feature, simply add the beta header `fine-grained-tool-streaming-2025-05-14` to a tool use request and turn on streaming.

Here's an example of how to use fine-grained tool streaming with the API:

<CodeGroup>
  ```bash Shell
  curl https://api.anthropic.com/v1/messages \
    -H "content-type: application/json" \
    -H "x-api-key: $ANTHROPIC_API_KEY" \
    -H "anthropic-version: 2023-06-01" \
    -H "anthropic-beta: fine-grained-tool-streaming-2025-05-14" \
    -d '{
      "model": "claude-sonnet-4-20250514",
      "max_tokens": 65536,
      "tools": [
        {
          "name": "make_file",
          "description": "Write text to a file",
          "input_schema": {
            "type": "object",
            "properties": {
              "filename": {
                "type": "string",
                "description": "The filename to write text to"
              },
              "lines_of_text": {
                "type": "array",
                "description": "An array of lines of text to write to the file"
              }
            },
            "required": ["filename", "lines_of_text"]
          }
        }
      ],
      "messages": [
        {
          "role": "user",
          "content": "Can you write a long poem and make a file called poem.txt?"
        }
      ],
      "stream": true
    }' | jq '.usage'
  ```

  ```Python Python
  import anthropic

  client = anthropic.Anthropic()

  response = client.beta.messages.stream(
      max_tokens=65536,
      model="claude-sonnet-4-20250514",
      tools=[{
        "name": "make_file",
        "description": "Write text to a file",
        "input_schema": {
          "type": "object",
          "properties": {
            "filename": {
              "type": "string",
              "description": "The filename to write text to"
            },
            "lines_of_text": {
              "type": "array",
              "description": "An array of lines of text to write to the file"
            }
          },
          "required": ["filename", "lines_of_text"]
        }
      }],
      messages=[{
        "role": "user",
        "content": "Can you write a long poem and make a file called poem.txt?"
      }],
      betas=["fine-grained-tool-streaming-2025-05-14"]
  )

  print(response.usage)
  ```

  ```TypeScript TypeScript
  import Anthropic from '@anthropic-ai/sdk';

  const anthropic = new Anthropic();

  const message = await anthropic.beta.messages.stream({
    model: "claude-sonnet-4-20250514",
    max_tokens: 65536,
    tools: [{
      "name": "make_file",
      "description": "Write text to a file",
      "input_schema": {
        "type": "object",
        "properties": {
          "filename": {
            "type": "string",
            "description": "The filename to write text to"
          },
          "lines_of_text": {
            "type": "array",
            "description": "An array of lines of text to write to the file"
          }
        },
        "required": ["filename", "lines_of_text"]
      }
    }],
    messages: [{ 
      role: "user", 
      content: "Can you write a long poem and make a file called poem.txt?" 
    }],
    betas: ["fine-grained-tool-streaming-2025-05-14"]
  });

  console.log(message.usage);
  ```
</CodeGroup>

In this example, fine-grained tool streaming enables Claude to stream the lines of a long poem into the tool call `make_file` without buffering to validate if the `lines_of_text` parameter is valid JSON. This means you can see the parameter stream as it arrives, without having to wait for the entire parameter to buffer and validate.

<Note>
  With fine-grained tool streaming, tool use chunks start streaming faster, and are often longer and contain fewer word breaks. This is due to differences in chunking behavior.

  Example:

  Without fine-grained streaming (15s delay):

  ```
  Chunk 1: '{"'
  Chunk 2: 'query": "Ty'
  Chunk 3: 'peScri'
  Chunk 4: 'pt 5.0 5.1 '
  Chunk 5: '5.2 5'
  Chunk 6: '.3'
  Chunk 8: ' new f'
  Chunk 9: 'eatur'
  ...
  ```

  With fine-grained streaming (3s delay):

  ```
  Chunk 1: '{"query": "TypeScript 5.0 5.1 5.2 5.3'
  Chunk 2: ' new features comparison'
  ```
</Note>

<Warning>
  Because fine-grained streaming sends parameters without buffering or JSON validation, there is no guarantee that the resulting stream will complete in a valid JSON string.
  Particularly, if the [stop reason](/en/api/handling-stop-reasons) `max_tokens` is reached, the stream may end midway through a parameter and may be incomplete. You will generally have to write specific support to handle when `max_tokens` is reached.
</Warning>

## Handling invalid JSON in tool responses

When using fine-grained tool streaming, you may receive invalid or incomplete JSON from the model. If you need to pass this invalid JSON back to the model in an error response block, you may wrap it in a JSON object to ensure proper handling (with a reasonable key). For example:

```json
{
  "INVALID_JSON": "<your invalid json string>"
}
```

This approach helps the model understand that the content is invalid JSON while preserving the original malformed data for debugging purposes.

<Note>
  When wrapping invalid JSON, make sure to properly escape any quotes or special characters in the invalid JSON string to maintain valid JSON structure in the wrapper object.
</Note>


# Computer use tool

Claude can interact with computer environments through the computer use tool, which provides screenshot capabilities and mouse/keyboard control for autonomous desktop interaction.

<Note>
  Computer use is currently in beta and requires a [beta header](/en/api/beta-headers):

  * `"computer-use-2025-01-24"` (Claude 4 and 3.7 models)
  * `"computer-use-2024-10-22"` (Claude Sonnet 3.5)
</Note>

## Overview

Computer use is a beta feature that enables Claude to interact with desktop environments. This tool provides:

* **Screenshot capture**: See what's currently displayed on screen
* **Mouse control**: Click, drag, and move the cursor
* **Keyboard input**: Type text and use keyboard shortcuts
* **Desktop automation**: Interact with any application or interface

While computer use can be augmented with other tools like bash and text editor for more comprehensive automation workflows, computer use specifically refers to the computer use tool's capability to see and control desktop environments.

## Model compatibility

Computer use is available for the following Claude models:

| Model                   | Tool Version        | Beta Flag                 |
| ----------------------- | ------------------- | ------------------------- |
| Claude 4 Opus & Sonnet  | `computer_20250124` | `computer-use-2025-01-24` |
| Claude Sonnet 3.7       | `computer_20250124` | `computer-use-2025-01-24` |
| Claude Sonnet 3.5 (new) | `computer_20241022` | `computer-use-2024-10-22` |

<Note>
  Claude 4 models use updated tool versions optimized for the new architecture. Claude Sonnet 3.7 introduces additional capabilities including the thinking feature for more insight into the model's reasoning process.
</Note>

## Security considerations

<Warning>
  Computer use is a beta feature with unique risks distinct from standard API features. These risks are heightened when interacting with the internet. To minimize risks, consider taking precautions such as:

  1. Use a dedicated virtual machine or container with minimal privileges to prevent direct system attacks or accidents.
  2. Avoid giving the model access to sensitive data, such as account login information, to prevent information theft.
  3. Limit internet access to an allowlist of domains to reduce exposure to malicious content.
  4. Ask a human to confirm decisions that may result in meaningful real-world consequences as well as any tasks requiring affirmative consent, such as accepting cookies, executing financial transactions, or agreeing to terms of service.

  In some circumstances, Claude will follow commands found in content even if it conflicts with the user's instructions. For example, Claude instructions on webpages or contained in images may override instructions or cause Claude to make mistakes. We suggest taking precautions to isolate Claude from sensitive data and actions to avoid risks related to prompt injection.

  We've trained the model to resist these prompt injections and have added an extra layer of defense. If you use our computer use tools, we'll automatically run classifiers on your prompts to flag potential instances of prompt injections. When these classifiers identify potential prompt injections in screenshots, they will automatically steer the model to ask for user confirmation before proceeding with the next action. We recognize that this extra protection won't be ideal for every use case (for example, use cases without a human in the loop), so if you'd like to opt out and turn it off, please [contact us](https://support.anthropic.com/en/).

  We still suggest taking precautions to isolate Claude from sensitive data and actions to avoid risks related to prompt injection.

  Finally, please inform end users of relevant risks and obtain their consent prior to enabling computer use in your own products.
</Warning>

<Card title="Computer use reference implementation" icon="computer" href="https://github.com/anthropics/anthropic-quickstarts/tree/main/computer-use-demo">
  Get started quickly with our computer use reference implementation that includes a web interface, Docker container, example tool implementations, and an agent loop.

  **Note:** The implementation has been updated to include new tools for both Claude 4 and Claude Sonnet 3.7. Be sure to pull the latest version of the repo to access these new features.
</Card>

<Tip>
  Please use [this form](https://forms.gle/BT1hpBrqDPDUrCqo7) to provide
  feedback on the quality of the model responses, the API itself, or the quality
  of the documentation - we cannot wait to hear from you!
</Tip>

## Quick start

Here's how to get started with computer use:

<CodeGroup>
  ```python Python
  import anthropic

  client = anthropic.Anthropic()

  response = client.beta.messages.create(
      model="claude-sonnet-4-20250514",  # or another compatible model
      max_tokens=1024,
      tools=[
          {
            "type": "computer_20250124",
            "name": "computer",
            "display_width_px": 1024,
            "display_height_px": 768,
            "display_number": 1,
          },
          {
            "type": "text_editor_20250124",
            "name": "str_replace_editor"
          },
          {
            "type": "bash_20250124",
            "name": "bash"
          }
      ],
      messages=[{"role": "user", "content": "Save a picture of a cat to my desktop."}],
      betas=["computer-use-2025-01-24"]
  )
  print(response)
  ```

  ```bash Shell
  curl https://api.anthropic.com/v1/messages \
    -H "content-type: application/json" \
    -H "x-api-key: $ANTHROPIC_API_KEY" \
    -H "anthropic-version: 2023-06-01" \
    -H "anthropic-beta: computer-use-2025-01-24" \
    -d '{
      "model": "claude-sonnet-4-20250514",
      "max_tokens": 1024,
      "tools": [
        {
          "type": "computer_20250124",
          "name": "computer",
          "display_width_px": 1024,
          "display_height_px": 768,
          "display_number": 1
        },
        {
          "type": "text_editor_20250124",
          "name": "str_replace_editor"
        },
        {
          "type": "bash_20250124",
          "name": "bash"
        }
      ],
      "messages": [
        {
          "role": "user",
          "content": "Save a picture of a cat to my desktop."
        }
      ]
    }'
  ```
</CodeGroup>

<Note>
  **Beta header requirements:**

  * **Claude 4 and Sonnet 3.7**: Beta header only required for the computer use tool
  * **Claude Sonnet 3.5**: Beta header required for computer, bash, and text editor tools

  The example above shows all three tools being used together, which requires the beta header for any Claude model since it includes the computer use tool.
</Note>

***

## How computer use works

<Steps>
  <Step title="1. Provide Claude with the computer use tool and a user prompt" icon="toolbox">
    * Add the computer use tool (and optionally other tools) to your API request.
    * Include a user prompt that requires desktop interaction, e.g., "Save a picture of a cat to my desktop."
  </Step>

  <Step title="2. Claude decides to use the computer use tool" icon="screwdriver-wrench">
    * Claude assesses if the computer use tool can help with the user's query.
    * If yes, Claude constructs a properly formatted tool use request.
    * The API response has a `stop_reason` of `tool_use`, signaling Claude's intent.
  </Step>

  <Step title="3. Extract tool input, evaluate the tool on a computer, and return results" icon="computer">
    * On your end, extract the tool name and input from Claude's request.
    * Use the tool on a container or Virtual Machine.
    * Continue the conversation with a new `user` message containing a `tool_result` content block.
  </Step>

  <Step title="4. Claude continues calling computer use tools until it's completed the task" icon="arrows-spin">
    * Claude analyzes the tool results to determine if more tool use is needed or the task has been completed.
    * If Claude decides it needs another tool, it responds with another `tool_use` `stop_reason` and you should return to step 3.
    * Otherwise, it crafts a text response to the user.
  </Step>
</Steps>

We refer to the repetition of steps 3 and 4 without user input as the "agent loop" - i.e., Claude responding with a tool use request and your application responding to Claude with the results of evaluating that request.

### The computing environment

Computer use requires a sandboxed computing environment where Claude can safely interact with applications and the web. This environment includes:

1. **Virtual display**: A virtual X11 display server (using Xvfb) that renders the desktop interface Claude will see through screenshots and control with mouse/keyboard actions.

2. **Desktop environment**: A lightweight UI with window manager (Mutter) and panel (Tint2) running on Linux, which provides a consistent graphical interface for Claude to interact with.

3. **Applications**: Pre-installed Linux applications like Firefox, LibreOffice, text editors, and file managers that Claude can use to complete tasks.

4. **Tool implementations**: Integration code that translates Claude's abstract tool requests (like "move mouse" or "take screenshot") into actual operations in the virtual environment.

5. **Agent loop**: A program that handles communication between Claude and the environment, sending Claude's actions to the environment and returning the results (screenshots, command outputs) back to Claude.

When you use computer use, Claude doesn't directly connect to this environment. Instead, your application:

1. Receives Claude's tool use requests
2. Translates them into actions in your computing environment
3. Captures the results (screenshots, command outputs, etc.)
4. Returns these results to Claude

For security and isolation, the reference implementation runs all of this inside a Docker container with appropriate port mappings for viewing and interacting with the environment.

***

## How to implement computer use

### Start with our reference implementation

We have built a [reference implementation](https://github.com/anthropics/anthropic-quickstarts/tree/main/computer-use-demo) that includes everything you need to get started quickly with computer use:

* A [containerized environment](https://github.com/anthropics/anthropic-quickstarts/blob/main/computer-use-demo/Dockerfile) suitable for computer use with Claude
* Implementations of [the computer use tools](https://github.com/anthropics/anthropic-quickstarts/tree/main/computer-use-demo/computer_use_demo/tools)
* An [agent loop](https://github.com/anthropics/anthropic-quickstarts/blob/main/computer-use-demo/computer_use_demo/loop.py) that interacts with the Anthropic API and executes the computer use tools
* A web interface to interact with the container, agent loop, and tools.

### Understanding the multi-agent loop

The core of computer use is the "agent loop" - a cycle where Claude requests tool actions, your application executes them, and returns results to Claude. Here's a simplified example:

```python
async def sampling_loop(
    *,
    model: str,
    messages: list[dict],
    api_key: str,
    max_tokens: int = 4096,
    tool_version: str,
    thinking_budget: int | None = None,
    max_iterations: int = 10,  # Add iteration limit to prevent infinite loops
):
    """
    A simple agent loop for Claude computer use interactions.

    This function handles the back-and-forth between:
    1. Sending user messages to Claude
    2. Claude requesting to use tools
    3. Your app executing those tools
    4. Sending tool results back to Claude
    """
    # Set up tools and API parameters
    client = Anthropic(api_key=api_key)
    beta_flag = "computer-use-2025-01-24" if "20250124" in tool_version else "computer-use-2024-10-22"

    # Configure tools - you should already have these initialized elsewhere
    tools = [
        {"type": f"computer_{tool_version}", "name": "computer", "display_width_px": 1024, "display_height_px": 768},
        {"type": f"text_editor_{tool_version}", "name": "str_replace_editor"},
        {"type": f"bash_{tool_version}", "name": "bash"}
    ]

    # Main agent loop (with iteration limit to prevent runaway API costs)
    iterations = 0
    while True and iterations < max_iterations:
        iterations += 1
        # Set up optional thinking parameter (for Claude Sonnet 3.7)
        thinking = None
        if thinking_budget:
            thinking = {"type": "enabled", "budget_tokens": thinking_budget}

        # Call the Claude API
        response = client.beta.messages.create(
            model=model,
            max_tokens=max_tokens,
            messages=messages,
            tools=tools,
            betas=[beta_flag],
            thinking=thinking
        )

        # Add Claude's response to the conversation history
        response_content = response.content
        messages.append({"role": "assistant", "content": response_content})

        # Check if Claude used any tools
        tool_results = []
        for block in response_content:
            if block.type == "tool_use":
                # In a real app, you would execute the tool here
                # For example: result = run_tool(block.name, block.input)
                result = {"result": "Tool executed successfully"}

                # Format the result for Claude
                tool_results.append({
                    "type": "tool_result",
                    "tool_use_id": block.id,
                    "content": result
                })

        # If no tools were used, Claude is done - return the final messages
        if not tool_results:
            return messages

        # Add tool results to messages for the next iteration with Claude
        messages.append({"role": "user", "content": tool_results})
```

The loop continues until either Claude responds without requesting any tools (task completion) or the maximum iteration limit is reached. This safeguard prevents potential infinite loops that could result in unexpected API costs.

<Warning>
  When using the computer use tool, you must include the appropriate beta flag for your model version:

  <AccordionGroup>
    <Accordion title="Claude 4 models">
      When using `computer_20250124`, include this beta flag:

      ```
      "betas": ["computer-use-2025-01-24"]
      ```
    </Accordion>

    <Accordion title="Claude Sonnet 3.7">
      When using `computer_20250124`, include this beta flag:

      ```
      "betas": ["computer-use-2025-01-24"]
      ```
    </Accordion>

    <Accordion title="Claude Sonnet 3.5 (new)">
      When using `computer_20241022`, include this beta flag:

      ```
      "betas": ["computer-use-2024-10-22"]
      ```
    </Accordion>
  </AccordionGroup>

  Note: For Claude 4 and Sonnet 3.7, the beta flag is only required for the computer use tool. For Claude Sonnet 3.5, the beta flag is required for computer, bash, and text editor tools.
</Warning>

We recommend trying the reference implementation out before reading the rest of this documentation.

### Optimize model performance with prompting

Here are some tips on how to get the best quality outputs:

1. Specify simple, well-defined tasks and provide explicit instructions for each step.
2. Claude sometimes assumes outcomes of its actions without explicitly checking their results. To prevent this you can prompt Claude with `After each step, take a screenshot and carefully evaluate if you have achieved the right outcome. Explicitly show your thinking: "I have evaluated step X..." If not correct, try again. Only when you confirm a step was executed correctly should you move on to the next one.`
3. Some UI elements (like dropdowns and scrollbars) might be tricky for Claude to manipulate using mouse movements. If you experience this, try prompting the model to use keyboard shortcuts.
4. For repeatable tasks or UI interactions, include example screenshots and tool calls of successful outcomes in your prompt.
5. If you need the model to log in, provide it with the username and password in your prompt inside xml tags like `<robot_credentials>`. Using computer use within applications that require login increases the risk of bad outcomes as a result of prompt injection. Please review our [guide on mitigating prompt injections](/en/docs/test-and-evaluate/strengthen-guardrails/mitigate-jailbreaks) before providing the model with login credentials.

<Tip>
  If you repeatedly encounter a clear set of issues or know in advance the tasks
  Claude will need to complete, use the system prompt to provide Claude with
  explicit tips or instructions on how to do the tasks successfully.
</Tip>

### System prompts

When one of the Anthropic-defined tools is requested via the Anthropic API, a computer use-specific system prompt is generated. It's similar to the [tool use system prompt](/en/docs/agents-and-tools/tool-use/implement-tool-use#tool-use-system-prompt) but starts with:

> You have access to a set of functions you can use to answer the user's question. This includes access to a sandboxed computing environment. You do NOT currently have the ability to inspect files or interact with external resources, except by invoking the below functions.

As with regular tool use, the user-provided `system_prompt` field is still respected and used in the construction of the combined system prompt.

### Available actions

The computer use tool supports these actions:

**Basic actions (all versions)**

* **screenshot** - Capture the current display
* **left\_click** - Click at coordinates `[x, y]`
* **type** - Type text string
* **key** - Press key or key combination (e.g., "ctrl+s")
* **mouse\_move** - Move cursor to coordinates

**Enhanced actions (`computer_20250124`)**
Available in Claude 4 and Claude Sonnet 3.7:

* **scroll** - Scroll in any direction with amount control
* **left\_click\_drag** - Click and drag between coordinates
* **right\_click**, **middle\_click** - Additional mouse buttons
* **double\_click**, **triple\_click** - Multiple clicks
* **left\_mouse\_down**, **left\_mouse\_up** - Fine-grained click control
* **hold\_key** - Hold a key while performing other actions
* **wait** - Pause between actions

<Accordion title="Example actions">
  ```json
  // Take a screenshot
  {
    "action": "screenshot"
  }

  // Click at position
  {
    "action": "left_click",
    "coordinate": [500, 300]
  }

  // Type text
  {
    "action": "type",
    "text": "Hello, world!"
  }

  // Scroll down (Claude 4/3.7)
  {
    "action": "scroll",
    "coordinate": [500, 400],
    "scroll_direction": "down",
    "scroll_amount": 3
  }
  ```
</Accordion>

### Tool parameters

| Parameter           | Required | Description                                               |
| ------------------- | -------- | --------------------------------------------------------- |
| `type`              | Yes      | Tool version (`computer_20250124` or `computer_20241022`) |
| `name`              | Yes      | Must be "computer"                                        |
| `display_width_px`  | Yes      | Display width in pixels                                   |
| `display_height_px` | Yes      | Display height in pixels                                  |
| `display_number`    | No       | Display number for X11 environments                       |

<Warning>
  Keep display resolution at or below 1280x800 (WXGA) for best performance. Higher resolutions may cause accuracy issues due to [image resizing](/en/docs/build-with-claude/vision#evaluate-image-size).
</Warning>

<Note>
  **Important**: The computer use tool must be explicitly executed by your application - Claude cannot execute it directly. You are responsible for implementing the screenshot capture, mouse movements, keyboard inputs, and other actions based on Claude's requests.
</Note>

### Enable thinking capability in Claude 4 and Claude Sonnet 3.7

Claude Sonnet 3.7 introduced a new "thinking" capability that allows you to see the model's reasoning process as it works through complex tasks. This feature helps you understand how Claude is approaching a problem and can be particularly valuable for debugging or educational purposes.

To enable thinking, add a `thinking` parameter to your API request:

```json
"thinking": {
  "type": "enabled",
  "budget_tokens": 1024
}
```

The `budget_tokens` parameter specifies how many tokens Claude can use for thinking. This is subtracted from your overall `max_tokens` budget.

When thinking is enabled, Claude will return its reasoning process as part of the response, which can help you:

1. Understand the model's decision-making process
2. Identify potential issues or misconceptions
3. Learn from Claude's approach to problem-solving
4. Get more visibility into complex multi-step operations

Here's an example of what thinking output might look like:

```
[Thinking]
I need to save a picture of a cat to the desktop. Let me break this down into steps:

1. First, I'll take a screenshot to see what's on the desktop
2. Then I'll look for a web browser to search for cat images
3. After finding a suitable image, I'll need to save it to the desktop

Let me start by taking a screenshot to see what's available...
```

### Augmenting computer use with other tools

The computer use tool can be combined with other tools to create more powerful automation workflows. This is particularly useful when you need to:

* Execute system commands ([bash tool](/en/docs/agents-and-tools/tool-use/bash-tool))
* Edit configuration files or scripts ([text editor tool](/en/docs/agents-and-tools/tool-use/text-editor-tool))
* Integrate with custom APIs or services (custom tools)

<CodeGroup>
  ```bash Shell
  curl https://api.anthropic.com/v1/messages \
    -H "content-type: application/json" \
    -H "x-api-key: $ANTHROPIC_API_KEY" \
    -H "anthropic-version: 2023-06-01" \
    -H "anthropic-beta: computer-use-2025-01-24" \
    -d '{
      "model": "claude-opus-4-20250514",
      "max_tokens": 2000,
      "tools": [
        {
          "type": "computer_20250124",
          "name": "computer",
          "display_width_px": 1024,
          "display_height_px": 768,
          "display_number": 1
        },
        {
          "type": "text_editor_20250124",
          "name": "str_replace_editor"
        },
        {
          "type": "bash_20250124",
          "name": "bash"
        },
        {
          "name": "get_weather",
          "description": "Get the current weather in a given location",
          "input_schema": {
            "type": "object",
            "properties": {
              "location": {
                "type": "string",
                "description": "The city and state, e.g. San Francisco, CA"
              },
              "unit": {
                "type": "string",
                "enum": ["celsius", "fahrenheit"],
                "description": "The unit of temperature, either 'celsius' or 'fahrenheit'"
              }
            },
            "required": ["location"]
          }
        }
      ],
      "messages": [
        {
          "role": "user",
          "content": "Find flights from San Francisco to a place with warmer weather."
        }
      ],
      "thinking": {
        "type": "enabled",
        "budget_tokens": 1024
      }
    }'
  ```

  ```Python Python
  import anthropic

  client = anthropic.Anthropic()

  response = client.beta.messages.create(
      model="claude-sonnet-4-20250514",
      max_tokens=1024,
      tools=[
          {
            "type": "computer_20250124",
            "name": "computer",
            "display_width_px": 1024,
            "display_height_px": 768,
            "display_number": 1,
          },
          {
            "type": "text_editor_20250124",
            "name": "str_replace_editor"
          },
          {
            "type": "bash_20250124",
            "name": "bash"
          },
          {
            "name": "get_weather",
            "description": "Get the current weather in a given location",
            "input_schema": {
              "type": "object",
              "properties": {
                "location": {
                  "type": "string",
                  "description": "The city and state, e.g. San Francisco, CA"
                },
                "unit": {
                  "type": "string",
                  "enum": ["celsius", "fahrenheit"],
                  "description": "The unit of temperature, either 'celsius' or 'fahrenheit'"
                }
              },
              "required": ["location"]
            }
          },
      ],
      messages=[{"role": "user", "content": "Find flights from San Francisco to a place with warmer weather."}],
      betas=["computer-use-2025-01-24"],
      thinking={"type": "enabled", "budget_tokens": 1024},
  )
  print(response)
  ```

  ```TypeScript TypeScript
  import Anthropic from '@anthropic-ai/sdk';

  const anthropic = new Anthropic();

  const message = await anthropic.beta.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 1024,
    tools: [
        {
          type: "computer_20250124",
          name: "computer",
          display_width_px: 1024,
          display_height_px: 768,
          display_number: 1,
        },
        {
          type: "text_editor_20250124",
          name: "str_replace_editor"
        },
        {
          type: "bash_20250124",
          name: "bash"
        },
        {
          name: "get_weather",
          description: "Get the current weather in a given location",
          input_schema: {
            type: "object",
            properties: {
              location: {
                type: "string",
                description: "The city and state, e.g. San Francisco, CA"
              },
              unit: {
                type: "string",
                enum: ["celsius", "fahrenheit"],
                description: "The unit of temperature, either 'celsius' or 'fahrenheit'"
              }
            },
            required: ["location"]
          }
        },
    ],
    messages: [{ role: "user", content: "Find flights from San Francisco to a place with warmer weather." }],
    betas: ["computer-use-2025-01-24"],
    thinking: { type: "enabled", budget_tokens: 1024 },
  });
  console.log(message);
  ```

  ```java Java
  import java.util.List;
  import java.util.Map;

  import com.anthropic.client.AnthropicClient;
  import com.anthropic.client.okhttp.AnthropicOkHttpClient;
  import com.anthropic.core.JsonValue;
  import com.anthropic.models.beta.messages.BetaMessage;
  import com.anthropic.models.beta.messages.MessageCreateParams;
  import com.anthropic.models.beta.messages.BetaToolBash20250124;
  import com.anthropic.models.beta.messages.BetaToolComputerUse20250124;
  import com.anthropic.models.beta.messages.BetaToolTextEditor20250124;
  import com.anthropic.models.beta.messages.BetaThinkingConfigEnabled;
  import com.anthropic.models.beta.messages.BetaThinkingConfigParam;
  import com.anthropic.models.beta.messages.BetaTool;

  public class MultipleToolsExample {

      public static void main(String[] args) {
          AnthropicClient client = AnthropicOkHttpClient.fromEnv();

          MessageCreateParams params = MessageCreateParams.builder()
                  .model("claude-sonnet-4-20250514")
                  .maxTokens(1024)
                  .addTool(BetaToolComputerUse20250124.builder()
                          .displayWidthPx(1024)
                          .displayHeightPx(768)
                          .displayNumber(1)
                          .build())
                  .addTool(BetaToolTextEditor20250124.builder()
                          .build())
                  .addTool(BetaToolBash20250124.builder()
                          .build())
                  .addTool(BetaTool.builder()
                          .name("get_weather")
                          .description("Get the current weather in a given location")
                          .inputSchema(BetaTool.InputSchema.builder()
                                  .properties(
                                          JsonValue.from(
                                                  Map.of(
                                                          "location", Map.of(
                                                                  "type", "string",
                                                                  "description", "The city and state, e.g. San Francisco, CA"
                                                          ),
                                                          "unit", Map.of(
                                                                  "type", "string",
                                                                  "enum", List.of("celsius", "fahrenheit"),
                                                                  "description", "The unit of temperature, either 'celsius' or 'fahrenheit'"
                                                          )
                                                  )
                                          ))
                                  .build()
                          )
                          .build())
                  .thinking(BetaThinkingConfigParam.ofEnabled(
                          BetaThinkingConfigEnabled.builder()
                                  .budgetTokens(1024)
                                  .build()
                  ))
                  .addUserMessage("Find flights from San Francisco to a place with warmer weather.")
                  .addBeta("computer-use-2025-01-24")
                  .build();

          BetaMessage message = client.beta().messages().create(params);
          System.out.println(message);
      }
  }
  ```
</CodeGroup>

### Build a custom computer use environment

The [reference implementation](https://github.com/anthropics/anthropic-quickstarts/tree/main/computer-use-demo) is meant to help you get started with computer use. It includes all of the components needed have Claude use a computer. However, you can build your own environment for computer use to suit your needs. You'll need:

* A virtualized or containerized environment suitable for computer use with Claude
* An implementation of at least one of the Anthropic-defined computer use tools
* An agent loop that interacts with the Anthropic API and executes the `tool_use` results using your tool implementations
* An API or UI that allows user input to start the agent loop

#### Implement the computer use tool

The computer use tool is implemented as a schema-less tool. When using this tool, you don't need to provide an input schema as with other tools; the schema is built into Claude's model and can't be modified.

<Steps>
  <Step title="Set up your computing environment">
    Create a virtual display or connect to an existing display that Claude will interact with. This typically involves setting up Xvfb (X Virtual Framebuffer) or similar technology.
  </Step>

  <Step title="Implement action handlers">
    Create functions to handle each action type that Claude might request:

    ```python
    def handle_computer_action(action_type, params):
        if action_type == "screenshot":
            return capture_screenshot()
        elif action_type == "left_click":
            x, y = params["coordinate"]
            return click_at(x, y)
        elif action_type == "type":
            return type_text(params["text"])
        # ... handle other actions
    ```
  </Step>

  <Step title="Process Claude's tool calls">
    Extract and execute tool calls from Claude's responses:

    ```python
    for content in response.content:
        if content.type == "tool_use":
            action = content.input["action"]
            result = handle_computer_action(action, content.input)
            
            # Return result to Claude
            tool_result = {
                "type": "tool_result",
                "tool_use_id": content.id,
                "content": result
            }
    ```
  </Step>

  <Step title="Implement the agent loop">
    Create a loop that continues until Claude completes the task:

    ```python
    while True:
        response = client.beta.messages.create(...)
        
        # Check if Claude used any tools
        tool_results = process_tool_calls(response)
        
        if not tool_results:
            # No more tool use, task complete
            break
            
        # Continue conversation with tool results
        messages.append({"role": "user", "content": tool_results})
    ```
  </Step>
</Steps>

#### Handle errors

When implementing the computer use tool, various errors may occur. Here's how to handle them:

<AccordionGroup>
  <Accordion title="Screenshot capture failure">
    If screenshot capture fails, return an appropriate error message:

    ```json
    {
      "role": "user",
      "content": [
        {
          "type": "tool_result",
          "tool_use_id": "toolu_01A09q90qw90lq917835lq9",
          "content": "Error: Failed to capture screenshot. Display may be locked or unavailable.",
          "is_error": true
        }
      ]
    }
    ```
  </Accordion>

  <Accordion title="Invalid coordinates">
    If Claude provides coordinates outside the display bounds:

    ```json
    {
      "role": "user",
      "content": [
        {
          "type": "tool_result",
          "tool_use_id": "toolu_01A09q90qw90lq917835lq9",
          "content": "Error: Coordinates (1200, 900) are outside display bounds (1024x768).",
          "is_error": true
        }
      ]
    }
    ```
  </Accordion>

  <Accordion title="Action execution failure">
    If an action fails to execute:

    ```json
    {
      "role": "user",
      "content": [
        {
          "type": "tool_result",
          "tool_use_id": "toolu_01A09q90qw90lq917835lq9",
          "content": "Error: Failed to perform click action. The application may be unresponsive.",
          "is_error": true
        }
      ]
    }
    ```
  </Accordion>
</AccordionGroup>

#### Follow implementation best practices

<AccordionGroup>
  <Accordion title="Use appropriate display resolution">
    Set display dimensions that match your use case while staying within recommended limits:

    * For general desktop tasks: 1024x768 or 1280x720
    * For web applications: 1280x800 or 1366x768
    * Avoid resolutions above 1920x1080 to prevent performance issues
  </Accordion>

  <Accordion title="Implement proper screenshot handling">
    When returning screenshots to Claude:

    * Encode screenshots as base64 PNG or JPEG
    * Consider compressing large screenshots to improve performance
    * Include relevant metadata like timestamp or display state
  </Accordion>

  <Accordion title="Add action delays">
    Some applications need time to respond to actions:

    ```python
    def click_and_wait(x, y, wait_time=0.5):
        click_at(x, y)
        time.sleep(wait_time)  # Allow UI to update
    ```
  </Accordion>

  <Accordion title="Validate actions before execution">
    Check that requested actions are safe and valid:

    ```python
    def validate_action(action_type, params):
        if action_type == "left_click":
            x, y = params.get("coordinate", (0, 0))
            if not (0 <= x < display_width and 0 <= y < display_height):
                return False, "Coordinates out of bounds"
        return True, None
    ```
  </Accordion>

  <Accordion title="Log actions for debugging">
    Keep a log of all actions for troubleshooting:

    ```python
    import logging

    def log_action(action_type, params, result):
        logging.info(f"Action: {action_type}, Params: {params}, Result: {result}")
    ```
  </Accordion>
</AccordionGroup>

***

## Understand computer use limitations

The computer use functionality is in beta. While Claude's capabilities are cutting edge, developers should be aware of its limitations:

1. **Latency**: the current computer use latency for human-AI interactions may be too slow compared to regular human-directed computer actions. We recommend focusing on use cases where speed isn't critical (e.g., background information gathering, automated software testing) in trusted environments.
2. **Computer vision accuracy and reliability**: Claude may make mistakes or hallucinate when outputting specific coordinates while generating actions. Claude Sonnet 3.7 introduces the thinking capability that can help you understand the model's reasoning and identify potential issues.
3. **Tool selection accuracy and reliability**: Claude may make mistakes or hallucinate when selecting tools while generating actions or take unexpected actions to solve problems. Additionally, reliability may be lower when interacting with niche applications or multiple applications at once. We recommend that users prompt the model carefully when requesting complex tasks.
4. **Scrolling reliability**: While Claude Sonnet 3.5 (new) had limitations with scrolling, Claude Sonnet 3.7 introduces dedicated scroll actions with direction control that improves reliability. The model can now explicitly scroll in any direction (up/down/left/right) by a specified amount.
5. **Spreadsheet interaction**: Mouse clicks for spreadsheet interaction have improved in Claude Sonnet 3.7 with the addition of more precise mouse control actions like `left_mouse_down`, `left_mouse_up`, and new modifier key support. Cell selection can be more reliable by using these fine-grained controls and combining modifier keys with clicks.
6. **Account creation and content generation on social and communications platforms**: While Claude will visit websites, we are limiting its ability to create accounts or generate and share content or otherwise engage in human impersonation across social media websites and platforms. We may update this capability in the future.
7. **Vulnerabilities**: Vulnerabilities like jailbreaking or prompt injection may persist across frontier AI systems, including the beta computer use API. In some circumstances, Claude will follow commands found in content, sometimes even in conflict with the user's instructions. For example, Claude instructions on webpages or contained in images may override instructions or cause Claude to make mistakes. We recommend:
   a. Limiting computer use to trusted environments such as virtual machines or containers with minimal privileges
   b. Avoiding giving computer use access to sensitive accounts or data without strict oversight
   c. Informing end users of relevant risks and obtaining their consent before enabling or requesting permissions necessary for computer use features in your applications
8. **Inappropriate or illegal actions**: Per Anthropic's terms of service, you must not employ computer use to violate any laws or our Acceptable Use Policy.

Always carefully review and verify Claude's computer use actions and logs. Do not use Claude for tasks requiring perfect precision or sensitive user information without human oversight.

***

## Pricing

Computer use follows the standard [tool use pricing](/en/docs/agents-and-tools/tool-use/overview#pricing). When using the computer use tool:

**System prompt overhead**: The computer use beta adds 466-499 tokens to the system prompt

**Computer use tool token usage**:

| Model                 | Input tokens per tool definition |
| --------------------- | -------------------------------- |
| Claude 4 / Sonnet 3.7 | 735 tokens                       |
| Claude Sonnet 3.5     | 683 tokens                       |

**Additional token consumption**:

* Screenshot images (see [Vision pricing](/en/docs/build-with-claude/vision))
* Tool execution results returned to Claude

<Note>
  If you're also using bash or text editor tools alongside computer use, those tools have their own token costs as documented in their respective pages.
</Note>

## Next steps

<CardGroup cols={2}>
  <Card title="Reference implementation" icon="github" href="https://github.com/anthropics/anthropic-quickstarts/tree/main/computer-use-demo">
    Get started quickly with our complete Docker-based implementation
  </Card>

  <Card title="Tool documentation" icon="toolbox" href="/en/docs/agents-and-tools/tool-use/overview">
    Learn more about tool use and creating custom tools
  </Card>
</CardGroup>


# Text editor tool

Claude can use an Anthropic-defined text editor tool to view and modify text files, helping you debug, fix, and improve your code or other text documents. This allows Claude to directly interact with your files, providing hands-on assistance rather than just suggesting changes.

## Before using the text editor tool

### Use a compatible model

Anthropic's text editor tool is available for multiple Claude models:

* **Claude 4 Opus & Sonnet**: `text_editor_20250728`
* **Claude Sonnet 3.7**: `text_editor_20250124`
* **Claude Sonnet 3.5**: `text_editor_20241022`

<Note>
  Claude Sonnet 3.5 requires the `computer-use-2024-10-22` beta header when using the text editor tool.

  The text editor tool is generally available in Claude 4 and Sonnet 3.7.
</Note>

<Warning>
  The `text_editor_20250728` tool for Claude 4 models does not include the `undo_edit` command. If you require this functionality, you'll need to use Claude 3.7 or Sonnet 3.5 with their respective tool versions.
</Warning>

### Assess your use case fit

Some examples of when to use the text editor tool are:

* **Code debugging**: Have Claude identify and fix bugs in your code, from syntax errors to logic issues.
* **Code refactoring**: Let Claude improve your code structure, readability, and performance through targeted edits.
* **Documentation generation**: Ask Claude to add docstrings, comments, or README files to your codebase.
* **Test creation**: Have Claude create unit tests for your code based on its understanding of the implementation.

***

## Use the text editor tool

<Tabs>
  <Tab title="Claude 4">
    Provide the text editor tool (named `str_replace_based_edit_tool`) to Claude using the Messages API.

    You can optionally specify a `max_characters` parameter to control truncation when viewing large files.

    <Note>
      `max_characters` is only compatible with `text_editor_20250728` and later versions of the text editor tool.
    </Note>

    <CodeGroup>
      ```bash Shell
      curl https://api.anthropic.com/v1/messages \
        -H "content-type: application/json" \
        -H "x-api-key: $ANTHROPIC_API_KEY" \
        -H "anthropic-version: 2023-06-01" \
        -d '{
          "model": "claude-opus-4-20250514",
          "max_tokens": 1024,
          "tools": [
            {
              "type": "text_editor_20250728",
              "name": "str_replace_based_edit_tool",
              "max_characters": 10000
            }
          ],
          "messages": [
            {
              "role": "user",
              "content": "There'\''s a syntax error in my primes.py file. Can you help me fix it?"
            }
          ]
        }'
      ```

      ```python Python
      import anthropic

      client = anthropic.Anthropic()

      response = client.messages.create(
          model="claude-opus-4-20250514",
          max_tokens=1024,
          tools=[
              {
                  "type": "text_editor_20250728",
                  "name": "str_replace_based_edit_tool",
                  "max_characters": 10000
              }
          ],
          messages=[
              {
                  "role": "user", 
                  "content": "There's a syntax error in my primes.py file. Can you help me fix it?"
              }
          ]
      )
      ```

      ```typescript TypeScript
      import Anthropic from '@anthropic-ai/sdk';

      const anthropic = new Anthropic();

      const response = await anthropic.messages.create({
        model: "claude-opus-4-20250514",
        max_tokens: 1024,
        tools: [
          {
            type: "text_editor_20250728",
            name: "str_replace_based_edit_tool",
            max_characters: 10000
          }
        ],
        messages: [
          {
            role: "user",
            content: "There's a syntax error in my primes.py file. Can you help me fix it?"
          }
        ]
      });
      ```

      ```java Java
      import com.anthropic.client.AnthropicClient;
      import com.anthropic.client.okhttp.AnthropicOkHttpClient;
      import com.anthropic.models.messages.Message;
      import com.anthropic.models.messages.MessageCreateParams;
      import com.anthropic.models.messages.Model;
      import com.anthropic.models.messages.ToolStrReplaceBasedEditTool20250728;

      public class TextEditorToolExample {

          public static void main(String[] args) {
              AnthropicClient client = AnthropicOkHttpClient.fromEnv();

              ToolStrReplaceBasedEditTool20250728 editorTool = ToolStrReplaceBasedEditTool20250728.builder()
                      .build();

              MessageCreateParams params = MessageCreateParams.builder()
                      .model(Model.CLAUDE_SONNET_4_0)
                      .maxTokens(1024)
                      .addTool(editorTool)
                      .addUserMessage("There's a syntax error in my primes.py file. Can you help me fix it?")
                      .build();

              Message message = client.messages().create(params);
          }
      }
      ```
    </CodeGroup>
  </Tab>

  <Tab title="Claude Sonnet 3.7">
    Provide the text editor tool (named `str_replace_editor`) to Claude using the Messages API:

    <CodeGroup>
      ```bash Shell
      curl https://api.anthropic.com/v1/messages \
        -H "content-type: application/json" \
        -H "x-api-key: $ANTHROPIC_API_KEY" \
        -H "anthropic-version: 2023-06-01" \
        -d '{
          "model": "claude-3-7-sonnet-20250219",
          "max_tokens": 1024,
          "tools": [
            {
              "type": "text_editor_20250124",
              "name": "str_replace_editor"
            }
          ],
          "messages": [
            {
              "role": "user",
              "content": "There'\''s a syntax error in my primes.py file. Can you help me fix it?"
            }
          ]
        }'
      ```

      ```python Python
      import anthropic

      client = anthropic.Anthropic()

      response = client.messages.create(
          model="claude-3-7-sonnet-20250219",
          max_tokens=1024,
          tools=[
              {
                  "type": "text_editor_20250124",
                  "name": "str_replace_editor"
              }
          ],
          messages=[
              {
                  "role": "user", 
                  "content": "There's a syntax error in my primes.py file. Can you help me fix it?"
              }
          ]
      )
      ```

      ```typescript TypeScript
      import Anthropic from '@anthropic-ai/sdk';

      const anthropic = new Anthropic();

      const response = await anthropic.messages.create({
        model: "claude-3-7-sonnet-20250219",
        max_tokens: 1024,
        tools: [
          {
            type: "text_editor_20250124",
            name: "str_replace_editor"
          }
        ],
        messages: [
          {
            role: "user",
            content: "There's a syntax error in my primes.py file. Can you help me fix it?"
          }
        ]
      });
      ```

      ```java Java
      import com.anthropic.client.AnthropicClient;
      import com.anthropic.client.okhttp.AnthropicOkHttpClient;
      import com.anthropic.models.messages.Message;
      import com.anthropic.models.messages.MessageCreateParams;
      import com.anthropic.models.messages.Model;
      import com.anthropic.models.messages.ToolTextEditor20250124;

      public class TextEditorToolExample {

          public static void main(String[] args) {
              AnthropicClient client = AnthropicOkHttpClient.fromEnv();

              ToolTextEditor20250124 editorTool = ToolTextEditor20250124.builder()
                      .build();

              MessageCreateParams params = MessageCreateParams.builder()
                      .model(Model.CLAUDE_3_7_SONNET_LATEST)
                      .maxTokens(1024)
                      .addTool(editorTool)
                      .addUserMessage("There's a syntax error in my primes.py file. Can you help me fix it?")
                      .build();

              Message message = client.messages().create(params);
          }
      }
      ```
    </CodeGroup>
  </Tab>

  <Tab title="Claude Sonnet 3.5">
    Provide the text editor tool (named `str_replace_editor`) to Claude using the Messages API:

    <CodeGroup>
      ```bash Shell
      curl https://api.anthropic.com/v1/messages \
        -H "content-type: application/json" \
        -H "x-api-key: $ANTHROPIC_API_KEY" \
        -H "anthropic-version: 2023-06-01" \
        -H "anthropic-beta: computer-use-2024-10-22" \
        -d '{
          "model": "claude-3-5-sonnet-20241022",
          "max_tokens": 1024,
          "tools": [
            {
              "type": "text_editor_20241022",
              "name": "str_replace_editor"
            }
          ],
          "messages": [
            {
              "role": "user",
              "content": "There'\''s a syntax error in my primes.py file. Can you help me fix it?"
            }
          ]
        }'
      ```

      ```python Python
      import anthropic

      client = anthropic.Anthropic()

      response = client.beta.messages.create(
          model="claude-3-5-sonnet-20241022",
          max_tokens=1024,
          tools=[
              {
                  "type": "text_editor_20241022",
                  "name": "str_replace_editor"
              }
          ],
          messages=[
              {
                  "role": "user", 
                  "content": "There's a syntax error in my primes.py file. Can you help me fix it?"
              }
          ],
          betas=["computer-use-2024-10-22"]  # Required for Claude 3.5
      )
      ```

      ```typescript TypeScript
      import Anthropic from '@anthropic-ai/sdk';

      const anthropic = new Anthropic();

      const response = await anthropic.beta.messages.create({
        model: "claude-3-5-sonnet-20241022",
        max_tokens: 1024,
        tools: [
          {
            type: "text_editor_20241022",
            name: "str_replace_editor"
          }
        ],
        messages: [
          {
            role: "user",
            content: "There's a syntax error in my primes.py file. Can you help me fix it?"
          }
        ],
        betas: ["computer-use-2024-10-22"]  // Required for Claude 3.5
      });
      ```

      ```java Java
      import com.anthropic.client.AnthropicClient;
      import com.anthropic.client.okhttp.AnthropicOkHttpClient;
      import com.anthropic.models.messages.Message;
      import com.anthropic.models.messages.MessageCreateParams;
      import com.anthropic.models.messages.Model;
      import com.anthropic.models.messages.ToolTextEditor20241022;

      public class TextEditorToolExample {

          public static void main(String[] args) {
              AnthropicClient client = AnthropicOkHttpClient.fromEnv();

              ToolTextEditor20241022 editorTool = ToolTextEditor20241022.builder()
                      .build();

              MessageCreateParams params = MessageCreateParams.builder()
                      .model(Model.CLAUDE_3_5_SONNET_LATEST)
                      .maxTokens(1024)
                      .addTool(editorTool)
                      .addUserMessage("There's a syntax error in my primes.py file. Can you help me fix it?")
                      .addBeta("computer-use-2024-10-22")  // Required for Claude 3.5
                      .build();

              Message message = client.beta().messages().create(params);
          }
      }
      ```
    </CodeGroup>
  </Tab>
</Tabs>

The text editor tool can be used in the following way:

<Steps>
  <Step title="Provide Claude with the text editor tool and a user prompt">
    * Include the text editor tool in your API request
    * Provide a user prompt that may require examining or modifying files, such as "Can you fix the syntax error in my code?"
  </Step>

  <Step title="Claude uses the tool to examine files or directories">
    * Claude assesses what it needs to look at and uses the `view` command to examine file contents or list directory contents
    * The API response will contain a `tool_use` content block with the `view` command
  </Step>

  <Step title="Execute the view command and return results">
    * Extract the file or directory path from Claude's tool use request
    * Read the file's contents or list the directory contents
    * If a `max_characters` parameter was specified in the tool configuration, truncate the file contents to that length
    * Return the results to Claude by continuing the conversation with a new `user` message containing a `tool_result` content block
  </Step>

  <Step title="Claude uses the tool to modify files">
    * After examining the file or directory, Claude may use a command such as `str_replace` to make changes or `insert` to add text at a specific line number.
    * If Claude uses the `str_replace` command, Claude constructs a properly formatted tool use request with the old text and new text to replace it with
  </Step>

  <Step title="Execute the edit and return results">
    * Extract the file path, old text, and new text from Claude's tool use request
    * Perform the text replacement in the file
    * Return the results to Claude
  </Step>

  <Step title="Claude provides its analysis and explanation">
    * After examining and possibly editing the files, Claude provides a complete explanation of what it found and what changes it made
  </Step>
</Steps>

### Text editor tool commands

The text editor tool supports several commands for viewing and modifying files:

#### view

The `view` command allows Claude to examine the contents of a file or list the contents of a directory. It can read the entire file or a specific range of lines.

Parameters:

* `command`: Must be "view"
* `path`: The path to the file or directory to view
* `view_range` (optional): An array of two integers specifying the start and end line numbers to view. Line numbers are 1-indexed, and -1 for the end line means read to the end of the file. This parameter only applies when viewing files, not directories.

<Accordion title="Example view commands">
  ```json
  // Example for viewing a file
  {
    "type": "tool_use",
    "id": "toolu_01A09q90qw90lq917835lq9",
    "name": "str_replace_editor",
    "input": {
      "command": "view",
      "path": "primes.py"
    }
  }

  // Example for viewing a directory
  {
    "type": "tool_use",
    "id": "toolu_02B19r91rw91mr917835mr9",
    "name": "str_replace_editor",
    "input": {
      "command": "view",
      "path": "src/"
    }
  }
  ```
</Accordion>

#### str\_replace

The `str_replace` command allows Claude to replace a specific string in a file with a new string. This is used for making precise edits.

Parameters:

* `command`: Must be "str\_replace"
* `path`: The path to the file to modify
* `old_str`: The text to replace (must match exactly, including whitespace and indentation)
* `new_str`: The new text to insert in place of the old text

<Accordion title="Example str_replace command">
  ```json
  {
    "type": "tool_use",
    "id": "toolu_01A09q90qw90lq917835lq9",
    "name": "str_replace_editor",
    "input": {
      "command": "str_replace",
      "path": "primes.py",
      "old_str": "for num in range(2, limit + 1)",
      "new_str": "for num in range(2, limit + 1):"
    }
  }
  ```
</Accordion>

#### create

The `create` command allows Claude to create a new file with specified content.

Parameters:

* `command`: Must be "create"
* `path`: The path where the new file should be created
* `file_text`: The content to write to the new file

<Accordion title="Example create command">
  ```json
  {
    "type": "tool_use",
    "id": "toolu_01A09q90qw90lq917835lq9",
    "name": "str_replace_editor",
    "input": {
      "command": "create",
      "path": "test_primes.py",
      "file_text": "import unittest\nimport primes\n\nclass TestPrimes(unittest.TestCase):\n    def test_is_prime(self):\n        self.assertTrue(primes.is_prime(2))\n        self.assertTrue(primes.is_prime(3))\n        self.assertFalse(primes.is_prime(4))\n\nif __name__ == '__main__':\n    unittest.main()"
    }
  }
  ```
</Accordion>

#### insert

The `insert` command allows Claude to insert text at a specific location in a file.

Parameters:

* `command`: Must be "insert"
* `path`: The path to the file to modify
* `insert_line`: The line number after which to insert the text (0 for beginning of file)
* `new_str`: The text to insert

<Accordion title="Example insert command">
  ```json
  {
    "type": "tool_use",
    "id": "toolu_01A09q90qw90lq917835lq9",
    "name": "str_replace_editor",
    "input": {
      "command": "insert",
      "path": "primes.py",
      "insert_line": 0,
      "new_str": "\"\"\"Module for working with prime numbers.\n\nThis module provides functions to check if a number is prime\nand to generate a list of prime numbers up to a given limit.\n\"\"\"\n"
    }
  }
  ```
</Accordion>

#### undo\_edit

The `undo_edit` command allows Claude to revert the last edit made to a file.

<Note>
  This command is only available in Claude Sonnet 3.7 and Claude Sonnet 3.5. It is not supported in Claude 4 models using the `text_editor_20250728`.
</Note>

Parameters:

* `command`: Must be "undo\_edit"
* `path`: The path to the file whose last edit should be undone

<Accordion title="Example undo_edit command">
  ```json
  {
    "type": "tool_use",
    "id": "toolu_01A09q90qw90lq917835lq9",
    "name": "str_replace_editor",
    "input": {
      "command": "undo_edit",
      "path": "primes.py"
    }
  }
  ```
</Accordion>

### Example: Fixing a syntax error with the text editor tool

<Tabs>
  <Tab title="Claude 4">
    This example demonstrates how Claude 4 uses the text editor tool to fix a syntax error in a Python file.

    First, your application provides Claude with the text editor tool and a prompt to fix a syntax error:

    <CodeGroup>
      ```bash Shell
      curl https://api.anthropic.com/v1/messages \
        -H "content-type: application/json" \
        -H "x-api-key: $ANTHROPIC_API_KEY" \
        -H "anthropic-version: 2023-06-01" \
        -d '{
          "model": "claude-opus-4-20250514",
          "max_tokens": 1024,
          "tools": [
            {
              "type": "text_editor_20250728",
              "name": "str_replace_based_edit_tool"
            }
          ],
          "messages": [
            {
              "role": "user",
              "content": "There'\''s a syntax error in my primes.py file. Can you help me fix it?"
            }
          ]
        }'
      ```

      ```python Python
      import anthropic

      client = anthropic.Anthropic()

      response = client.messages.create(
          model="claude-opus-4-20250514",
          max_tokens=1024,
          tools=[
              {
                  "type": "text_editor_20250728",
                  "name": "str_replace_based_edit_tool"
              }
          ],
          messages=[
              {
                  "role": "user", 
                  "content": "There's a syntax error in my primes.py file. Can you help me fix it?"
              }
          ]
      )
      ```

      ```typescript TypeScript
      import Anthropic from '@anthropic-ai/sdk';

      const anthropic = new Anthropic();

      const response = await anthropic.messages.create({
        model: "claude-opus-4-20250514",
        max_tokens: 1024,
        tools: [
          {
            type: "text_editor_20250728",
            name: "str_replace_based_edit_tool"
          }
        ],
        messages: [
          {
            role: "user",
            content: "There's a syntax error in my primes.py file. Can you help me fix it?"
          }
        ]
      });
      ```

      ```java Java
      import com.anthropic.client.AnthropicClient;
      import com.anthropic.client.okhttp.AnthropicOkHttpClient;
      import com.anthropic.models.messages.Message;
      import com.anthropic.models.messages.MessageCreateParams;
      import com.anthropic.models.messages.Model;
      import com.anthropic.models.messages.ToolStrReplaceBasedEditTool20250728;

      public class TextEditorToolExample {

          public static void main(String[] args) {
              AnthropicClient client = AnthropicOkHttpClient.fromEnv();

              ToolStrReplaceBasedEditTool20250728 editorTool = ToolStrReplaceBasedEditTool20250728.builder()
                      .build();

              MessageCreateParams params = MessageCreateParams.builder()
                      .model(Model.CLAUDE_SONNET_4_0)
                      .maxTokens(1024)
                      .addTool(editorTool)
                      .addUserMessage("There's a syntax error in my primes.py file. Can you help me fix it?")
                      .build();

              Message message = client.messages().create(params);
          }
      }
      ```
    </CodeGroup>

    Claude will use the text editor tool first to view the file:

    ```json
    {
      "id": "msg_01XAbCDeFgHiJkLmNoPQrStU",
      "model": "claude-opus-4-20250514",
      "stop_reason": "tool_use",
      "role": "assistant",
      "content": [
        {
          "type": "text",
          "text": "I'll help you fix the syntax error in your primes.py file. First, let me take a look at the file to identify the issue."
        },
        {
          "type": "tool_use",
          "id": "toolu_01AbCdEfGhIjKlMnOpQrStU",
          "name": "str_replace_based_edit_tool",
          "input": {
            "command": "view",
            "path": "primes.py"
          }
        }
      ]
    }
    ```

    Your application should then read the file and return its contents to Claude:

    <CodeGroup>
      ```bash Shell
      curl https://api.anthropic.com/v1/messages \
        -H "content-type: application/json" \
        -H "x-api-key: $ANTHROPIC_API_KEY" \
        -H "anthropic-version: 2023-06-01" \
        -d '{
          "model": "claude-opus-4-20250514",
          "max_tokens": 1024,
          "tools": [
            {
              "type": "text_editor_20250728",
              "name": "str_replace_based_edit_tool"
            }
          ],
          "messages": [
            {
              "role": "user",
              "content": "There'\''s a syntax error in my primes.py file. Can you help me fix it?"
            },
            {
                  "role": "assistant",
                  "content": [
                      {
                          "type": "text",
                          "text": "I'\''ll help you fix the syntax error in your primes.py file. First, let me take a look at the file to identify the issue."
                      },
                      {
                          "type": "tool_use",
                          "id": "toolu_01AbCdEfGhIjKlMnOpQrStU",
                          "name": "str_replace_based_edit_tool",
                          "input": {
                              "command": "view",
                              "path": "primes.py"
                          }
                      }
                  ]
              },
              {
                  "role": "user",
                  "content": [
                      {
                          "type": "tool_result",
                          "tool_use_id": "toolu_01AbCdEfGhIjKlMnOpQrStU",
                          "content": "1: def is_prime(n):\n2:     \"\"\"Check if a number is prime.\"\"\"\n3:     if n <= 1:\n4:         return False\n5:     if n <= 3:\n6:         return True\n7:     if n % 2 == 0 or n % 3 == 0:\n8:         return False\n9:     i = 5\n10:     while i * i <= n:\n11:         if n % i == 0 or n % (i + 2) == 0:\n12:             return False\n13:         i += 6\n14:     return True\n15: \n16: def get_primes(limit):\n17:     \"\"\"Generate a list of prime numbers up to the given limit.\"\"\"\n18:     primes = []\n19:     for num in range(2, limit + 1)\n20:         if is_prime(num):\n21:             primes.append(num)\n22:     return primes\n23: \n24: def main():\n25:     \"\"\"Main function to demonstrate prime number generation.\"\"\"\n26:     limit = 100\n27:     prime_list = get_primes(limit)\n28:     print(f\"Prime numbers up to {limit}:\")\n29:     print(prime_list)\n30:     print(f\"Found {len(prime_list)} prime numbers.\")\n31: \n32: if __name__ == \"__main__\":\n33:     main()"
                      }
                  ]
              }
          ]
        }'
      ```

      ```python Python
      response = client.messages.create(
          model="claude-opus-4-20250514",
          max_tokens=1024,
          tools=[
              {
                  "type": "text_editor_20250728",
                  "name": "str_replace_based_edit_tool"
              }
          ],
          messages=[
              {
                  "role": "user", 
                  "content": "There's a syntax error in my primes.py file. Can you help me fix it?"
              },
              {
                  "role": "assistant",
                  "content": [
                      {
                          "type": "text",
                          "text": "I'll help you fix the syntax error in your primes.py file. First, let me take a look at the file to identify the issue."
                      },
                      {
                          "type": "tool_use",
                          "id": "toolu_01AbCdEfGhIjKlMnOpQrStU",
                          "name": "str_replace_based_edit_tool",
                          "input": {
                              "command": "view",
                              "path": "primes.py"
                          }
                      }
                  ]
              },
              {
                  "role": "user",
                  "content": [
                      {
                          "type": "tool_result",
                          "tool_use_id": "toolu_01AbCdEfGhIjKlMnOpQrStU",
                          "content": "1: def is_prime(n):\n2:     \"\"\"Check if a number is prime.\"\"\"\n3:     if n <= 1:\n4:         return False\n5:     if n <= 3:\n6:         return True\n7:     if n % 2 == 0 or n % 3 == 0:\n8:         return False\n9:     i = 5\n10:     while i * i <= n:\n11:         if n % i == 0 or n % (i + 2) == 0:\n12:             return False\n13:         i += 6\n14:     return True\n15: \n16: def get_primes(limit):\n17:     \"\"\"Generate a list of prime numbers up to the given limit.\"\"\"\n18:     primes = []\n19:     for num in range(2, limit + 1)\n20:         if is_prime(num):\n21:             primes.append(num)\n22:     return primes\n23: \n24: def main():\n25:     \"\"\"Main function to demonstrate prime number generation.\"\"\"\n26:     limit = 100\n27:     prime_list = get_primes(limit)\n28:     print(f\"Prime numbers up to {limit}:\")\n29:     print(prime_list)\n30:     print(f\"Found {len(prime_list)} prime numbers.\")\n31: \n32: if __name__ == \"__main__\":\n33:     main()"
                      }
                  ]
              }
          ]
      )
      ```

      ```typescript TypeScript
      import Anthropic from '@anthropic-ai/sdk';

      const anthropic = new Anthropic();

      const response = await anthropic.messages.create({
        model: "claude-opus-4-20250514",
        max_tokens: 1024,
        tools: [
          {
            type: "text_editor_20250728",
            name: "str_replace_based_edit_tool"
          }
        ],
        messages: [
          {
            role: "user",
            content: "There's a syntax error in my primes.py file. Can you help me fix it?"
          },
          {
            role: "assistant",
            content: [
                {
                    type: "text",
                    text: "I'll help you fix the syntax error in your primes.py file. First, let me take a look at the file to identify the issue."
                },
                {
                    type: "tool_use",
                    id: "toolu_01AbCdEfGhIjKlMnOpQrStU",
                    name: "str_replace_based_edit_tool",
                    input: {
                        command: "view",
                        path: "primes.py"
                    }
                }
            ]
          },
          {
            role: "user",
            content: [
                {
                    type: "tool_result",
                    tool_use_id: "toolu_01AbCdEfGhIjKlMnOpQrStU",
                    content: "1: def is_prime(n):\n2:     \"\"\"Check if a number is prime.\"\"\"\n3:     if n <= 1:\n4:         return False\n5:     if n <= 3:\n6:         return True\n7:     if n % 2 == 0 or n % 3 == 0:\n8:         return False\n9:     i = 5\n10:     while i * i <= n:\n11:         if n % i == 0 or n % (i + 2) == 0:\n12:             return False\n13:         i += 6\n14:     return True\n15: \n16: def get_primes(limit):\n17:     \"\"\"Generate a list of prime numbers up to the given limit.\"\"\"\n18:     primes = []\n19:     for num in range(2, limit + 1)\n20:         if is_prime(num):\n21:             primes.append(num)\n22:     return primes\n23: \n24: def main():\n25:     \"\"\"Main function to demonstrate prime number generation.\"\"\"\n26:     limit = 100\n27:     prime_list = get_primes(limit)\n28:     print(f\"Prime numbers up to {limit}:\")\n29:     print(prime_list)\n30:     print(f\"Found {len(prime_list)} prime numbers.\")\n31: \n32: if __name__ == \"__main__\":\n33:     main()"
                }
            ]
          }
        ]
      });
      ```

      ```java Java
      import com.anthropic.client.AnthropicClient;
      import com.anthropic.client.okhttp.AnthropicOkHttpClient;
      import com.anthropic.models.messages.Message;
      import com.anthropic.models.messages.MessageCreateParams;
      import com.anthropic.models.messages.Model;
      import com.anthropic.models.messages.ToolStrReplaceBasedEditTool20250728;

      public class TextEditorToolExample {

          public static void main(String[] args) {
              AnthropicClient client = AnthropicOkHttpClient.fromEnv();

              ToolStrReplaceBasedEditTool20250728 editorTool = ToolStrReplaceBasedEditTool20250728.builder()
                  .build();

              MessageCreateParams params = MessageCreateParams.builder()
                  .model(Model.CLAUDE_SONNET_4_0)
                  .maxTokens(1024)
                  .addTool(editorTool)
                  .addUserMessage("There's a syntax error in my primes.py file. Can you help me fix it?")
                  .build();

              Message message = client.messages().create(params);
              System.out.println(message);
          }
      }
      ```
    </CodeGroup>

    <Tip>
      **Line numbers**

      In the example above, the `view` tool result includes file contents with line numbers prepended to each line (e.g., "1: def is\_prime(n):"). Line numbers are not required, but they are essential for successfully using the `view_range` parameter to examine specific sections of files and the `insert_line` parameter to add content at precise locations.
    </Tip>

    Claude will identify the syntax error and use the `str_replace` command to fix it:

    ```json
    {
      "id": "msg_01VwXyZAbCdEfGhIjKlMnO",
      "model": "claude-opus-4-20250514",
      "stop_reason": "tool_use",
      "role": "assistant",
      "content": [
        {
          "type": "text",
          "text": "I found the syntax error in your primes.py file. In the `get_primes` function, there is a missing colon (:) at the end of the for loop line. Let me fix that for you."
        },
        {
          "type": "tool_use",
          "id": "toolu_01PqRsTuVwXyZAbCdEfGh",
          "name": "str_replace_based_edit_tool",
          "input": {
            "command": "str_replace",
            "path": "primes.py",
            "old_str": "    for num in range(2, limit + 1)",
            "new_str": "    for num in range(2, limit + 1):"
          }
        }
      ]
    }
    ```

    Your application should then make the edit and return the result:

    <CodeGroup>
      ```python Python
      response = client.messages.create(
          model="claude-opus-4-20250514",
          max_tokens=1024,
          tools=[
              {
                  "type": "text_editor_20250728",
                  "name": "str_replace_based_edit_tool"
              }
          ],
          messages=[
              # Previous messages...
              {
                  "role": "assistant",
                  "content": [
                      {
                          "type": "text",
                          "text": "I found the syntax error in your primes.py file. In the `get_primes` function, there is a missing colon (:) at the end of the for loop line. Let me fix that for you."
                      },
                      {
                          "type": "tool_use",
                          "id": "toolu_01PqRsTuVwXyZAbCdEfGh",
                          "name": "str_replace_based_edit_tool",
                          "input": {
                              "command": "str_replace",
                              "path": "primes.py",
                              "old_str": "    for num in range(2, limit + 1)",
                              "new_str": "    for num in range(2, limit + 1):"
                          }
                      }
                  ]
              },
              {
                  "role": "user",
                  "content": [
                      {
                          "type": "tool_result",
                          "tool_use_id": "toolu_01PqRsTuVwXyZAbCdEfGh",
                          "content": "Successfully replaced text at exactly one location."
                      }
                  ]
              }
          ]
      )
      ```

      ```typescript TypeScript
      const response = await anthropic.messages.create({
        model: "claude-opus-4-20250514",
        max_tokens: 1024,
        tools: [
          {
            type: "text_editor_20250728",
            name: "str_replace_based_edit_tool"
          }
        ],
        messages: [
          // Previous messages...
          {
            role: "assistant",
            content: [
              {
                type: "text",
                text: "I found the syntax error in your primes.py file. In the `get_primes` function, there is a missing colon (:) at the end of the for loop line. Let me fix that for you."
              },
              {
                type: "tool_use",
                id: "toolu_01PqRsTuVwXyZAbCdEfGh",
                name: "str_replace_based_edit_tool",
                input: {
                  command: "str_replace",
                  path: "primes.py",
                  old_str: "    for num in range(2, limit + 1)",
                  new_str: "    for num in range(2, limit + 1):"
                }
              }
            ]
          },
          {
            role: "user",
            content: [
              {
                type: "tool_result",
                tool_use_id: "toolu_01PqRsTuVwXyZAbCdEfGh",
                content: "Successfully replaced text at exactly one location."
              }
            ]
          }
        ]
      });
      ```

      ```java Java
      import java.util.List;
      import java.util.Map;

      import com.anthropic.client.AnthropicClient;
      import com.anthropic.client.okhttp.AnthropicOkHttpClient;
      import com.anthropic.core.JsonValue;
      import com.anthropic.models.messages.ContentBlockParam;
      import com.anthropic.models.messages.Message;
      import com.anthropic.models.messages.MessageCreateParams;
      import com.anthropic.models.messages.MessageParam;
      import com.anthropic.models.messages.Model;
      import com.anthropic.models.messages.TextBlockParam;
      import com.anthropic.models.messages.ToolResultBlockParam;
      import com.anthropic.models.messages.ToolStrReplaceBasedEditTool20250728;
      import com.anthropic.models.messages.ToolUseBlockParam;

      public class TextEditorConversationExample {

          public static void main(String[] args) {
              AnthropicClient client = AnthropicOkHttpClient.fromEnv();

              MessageCreateParams params = MessageCreateParams.builder()
                      .model(Model.CLAUDE_SONNET_4_0)
                      .maxTokens(1024)
                      .addTool(ToolStrReplaceBasedEditTool20250728.builder()
                              .build())
                      // Previous messages would go here
                      .addAssistantMessageOfBlockParams(
                              List.of(
                                      ContentBlockParam.ofText(TextBlockParam.builder()
                                              .text("I found the syntax error in your primes.py file. In the `get_primes` function, there is a missing colon (:) at the end of the for loop line. Let me fix that for you.")
                                              .build()),
                                      ContentBlockParam.ofToolUse(ToolUseBlockParam.builder()
                                              .id("toolu_01PqRsTuVwXyZAbCdEfGh")
                                              .name("str_replace_based_edit_tool")
                                              .input(JsonValue.from(Map.of(
                                                      "command", "str_replace",
                                                      "path", "primes.py",
                                                      "old_str", "    for num in range(2, limit + 1)",
                                                      "new_str", "    for num in range(2, limit + 1):"
                                              )))
                                              .build()
                                      )
                              )
                      )
                      .addUserMessageOfBlockParams(List.of(
                              ContentBlockParam.ofToolResult(ToolResultBlockParam.builder()
                                      .toolUseId("toolu_01PqRsTuVwXyZAbCdEfGh")
                                      .content("Successfully replaced text at exactly one location.")
                                      .build()
                              )
                      ))
                      .build();

              Message message = client.messages().create(params);
              System.out.println(message);
          }
      }
      ```
    </CodeGroup>

    Finally, Claude will provide a complete explanation of the fix:

    ````json
    {
      "id": "msg_01IjKlMnOpQrStUvWxYzAb",
      "model": "claude-opus-4-20250514",
      "stop_reason": "end_turn",
      "role": "assistant",
      "content": [
        {
          "type": "text",
          "text": "I've fixed the syntax error in your primes.py file. The issue was in the `get_primes` function at line 19. There was a missing colon (:) at the end of the for loop line.\n\nHere's what I changed:\n\nFrom:\n```python\nfor num in range(2, limit + 1)\n```\n\nTo:\n```python\nfor num in range(2, limit + 1):\n```\n\nIn Python, a colon is required at the end of statements that start a new code block, such as for loops, if statements, function definitions, etc. Without the colon, Python raises a syntax error because it doesn't know where the code block begins.\n\nYour code should now run correctly. The function will properly generate a list of prime numbers up to the specified limit."
        }
      ]
    }
    ````
  </Tab>

  <Tab title="Claude Sonnet 3.7">
    This example demonstrates how Claude Sonnet 3.7 uses the text editor tool to fix a syntax error in a Python file.

    First, your application provides Claude with the text editor tool and a prompt to fix a syntax error:

    ```python
    import anthropic

    client = anthropic.Anthropic()

    response = client.messages.create(
        model="claude-3-7-sonnet-20250219",
        max_tokens=1024,
        tools=[
            {
                "type": "text_editor_20250124",
                "name": "str_replace_editor"
            }
        ],
        messages=[
            {
                "role": "user", 
                "content": "There's a syntax error in my primes.py file. Can you help me fix it?"
            }
        ]
    )

    print(response)
    ```

    <Note>
      The Claude Sonnet 3.7 examples follow the same format as the Claude 4 examples above, using the same tool calls and responses but with the `text_editor_20250124` tool type and `str_replace_editor` name.
    </Note>
  </Tab>
</Tabs>

***

## Implement the text editor tool

The text editor tool is implemented as a schema-less tool. When using this tool, you don't need to provide an input schema as with other tools; the schema is built into Claude's model and can't be modified.

The tool type depends on the model version:

* **Claude 4**: `type: "text_editor_20250728"`
* **Claude Sonnet 3.7**: `type: "text_editor_20250124"`
* **Claude Sonnet 3.5**: `type: "text_editor_20241022"`

<Steps>
  <Step title="Initialize your editor implementation">
    Create helper functions to handle file operations like reading, writing, and modifying files. Consider implementing backup functionality to recover from mistakes.
  </Step>

  <Step title="Handle editor tool calls">
    Create a function that processes tool calls from Claude based on the command type:

    ```python
    def handle_editor_tool(tool_call, model_version):
        input_params = tool_call.input
        command = input_params.get('command', '')
        file_path = input_params.get('path', '')
        
        if command == 'view':
            # Read and return file contents
            pass
        elif command == 'str_replace':
            # Replace text in file
            pass
        elif command == 'create':
            # Create new file
            pass
        elif command == 'insert':
            # Insert text at location
            pass
        elif command == 'undo_edit':
            # Check if it's a Claude 4 model
            if 'str_replace_based_edit_tool' in model_version:
                return {"error": "undo_edit command is not supported in Claude 4"}
            # Restore from backup for Claude 3.7/3.5
            pass
    ```
  </Step>

  <Step title="Implement security measures">
    Add validation and security checks:

    * Validate file paths to prevent directory traversal
    * Create backups before making changes
    * Handle errors gracefully
    * Implement permissions checks
  </Step>

  <Step title="Process Claude's responses">
    Extract and handle tool calls from Claude's responses:

    ```python
    # Process tool use in Claude's response
    for content in response.content:
        if content.type == "tool_use":
            # Execute the tool based on command
            result = handle_editor_tool(content)
            
            # Return result to Claude
            tool_result = {
                "type": "tool_result",
                "tool_use_id": content.id,
                "content": result
            }
    ```
  </Step>
</Steps>

<Warning>
  When implementing the text editor tool, keep in mind:

  1. **Security**: The tool has access to your local filesystem, so implement proper security measures.
  2. **Backup**: Always create backups before allowing edits to important files.
  3. **Validation**: Validate all inputs to prevent unintended changes.
  4. **Unique matching**: Make sure replacements match exactly one location to avoid unintended edits.
</Warning>

### Handle errors

When using the text editor tool, various errors may occur. Here is guidance on how to handle them:

<AccordionGroup>
  <Accordion title="File not found">
    If Claude tries to view or modify a file that doesn't exist, return an appropriate error message in the `tool_result`:

    ```json
    {
      "role": "user",
      "content": [
        {
          "type": "tool_result",
          "tool_use_id": "toolu_01A09q90qw90lq917835lq9",
          "content": "Error: File not found",
          "is_error": true
        }
      ]
    }
    ```
  </Accordion>

  <Accordion title="Multiple matches for replacement">
    If Claude's `str_replace` command matches multiple locations in the file, return an appropriate error message:

    ```json
    {
      "role": "user",
      "content": [
        {
          "type": "tool_result",
          "tool_use_id": "toolu_01A09q90qw90lq917835lq9",
          "content": "Error: Found 3 matches for replacement text. Please provide more context to make a unique match.",
          "is_error": true
        }
      ]
    }
    ```
  </Accordion>

  <Accordion title="No matches for replacement">
    If Claude's `str_replace` command doesn't match any text in the file, return an appropriate error message:

    ```json
    {
      "role": "user",
      "content": [
        {
          "type": "tool_result",
          "tool_use_id": "toolu_01A09q90qw90lq917835lq9",
          "content": "Error: No match found for replacement. Please check your text and try again.",
          "is_error": true
        }
      ]
    }
    ```
  </Accordion>

  <Accordion title="Permission errors">
    If there are permission issues with creating, reading, or modifying files, return an appropriate error message:

    ```json
    {
      "role": "user",
      "content": [
        {
          "type": "tool_result",
          "tool_use_id": "toolu_01A09q90qw90lq917835lq9",
          "content": "Error: Permission denied. Cannot write to file.",
          "is_error": true
        }
      ]
    }
    ```
  </Accordion>
</AccordionGroup>

### Follow implementation best practices

<AccordionGroup>
  <Accordion title="Provide clear context">
    When asking Claude to fix or modify code, be specific about what files need to be examined or what issues need to be addressed. Clear context helps Claude identify the right files and make appropriate changes.

    **Less helpful prompt**: "Can you fix my code?"

    **Better prompt**: "There's a syntax error in my primes.py file that prevents it from running. Can you fix it?"
  </Accordion>

  <Accordion title="Be explicit about file paths">
    Specify file paths clearly when needed, especially if you're working with multiple files or files in different directories.

    **Less helpful prompt**: "Review my helper file"

    **Better prompt**: "Can you check my utils/helpers.py file for any performance issues?"
  </Accordion>

  <Accordion title="Create backups before editing">
    Implement a backup system in your application that creates copies of files before allowing Claude to edit them, especially for important or production code.

    ```python
    def backup_file(file_path):
        """Create a backup of a file before editing."""
        backup_path = f"{file_path}.backup"
        if os.path.exists(file_path):
            with open(file_path, 'r') as src, open(backup_path, 'w') as dst:
                dst.write(src.read())
    ```
  </Accordion>

  <Accordion title="Handle unique text replacement carefully">
    The `str_replace` command requires an exact match for the text to be replaced. Your application should ensure that there is exactly one match for the old text or provide appropriate error messages.

    ```python
    def safe_replace(file_path, old_text, new_text):
        """Replace text only if there's exactly one match."""
        with open(file_path, 'r') as f:
            content = f.read()
        
        count = content.count(old_text)
        if count == 0:
            return "Error: No match found"
        elif count > 1:
            return f"Error: Found {count} matches"
        else:
            new_content = content.replace(old_text, new_text)
            with open(file_path, 'w') as f:
                f.write(new_content)
            return "Successfully replaced text"
    ```
  </Accordion>

  <Accordion title="Verify changes">
    After Claude makes changes to a file, verify the changes by running tests or checking that the code still works as expected.

    ```python
    def verify_changes(file_path):
        """Run tests or checks after making changes."""
        try:
            # For Python files, check for syntax errors
            if file_path.endswith('.py'):
                import ast
                with open(file_path, 'r') as f:
                    ast.parse(f.read())
                return "Syntax check passed"
        except Exception as e:
            return f"Verification failed: {str(e)}"
    ```
  </Accordion>
</AccordionGroup>

***

## Pricing and token usage

The text editor tool uses the same pricing structure as other tools used with Claude. It follows the standard input and output token pricing based on the Claude model you're using.

In addition to the base tokens, the following additional input tokens are needed for the text editor tool:

| Tool                                       | Additional input tokens |
| ------------------------------------------ | ----------------------- |
| `text_editor_20250429` (Claude 4)          | 700 tokens              |
| `text_editor_20250124` (Claude Sonnet 3.7) | 700 tokens              |
| `text_editor_20241022` (Claude Sonnet 3.5) | 700 tokens              |

For more detailed information about tool pricing, see [Tool use pricing](/en/docs/agents-and-tools/tool-use/overview#pricing).

## Integrate the text editor tool with other tools

The text editor tool can be used alongside other Claude tools. When combining tools, ensure you:

* Match the tool version with the model you're using
* Account for the additional token usage for all tools included in your request

## Change log

| Date             | Version                | Changes                                                                                                                                                                                                         |
| ---------------- | ---------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| July 28, 2025    | `text_editor_20250728` | Release of an updated text editor Tool that fixes some issues and adds an optional `max_characters` parameter. It is otherwise identical to `text_editor_20250429`.                                             |
| April 29, 2025   | `text_editor_20250429` | Release of the text editor Tool for Claude 4. This version removes the `undo_edit` command but maintains all other capabilities. The tool name has been updated to reflect its str\_replace-based architecture. |
| March 13, 2025   | `text_editor_20250124` | Introduction of standalone text editor Tool documentation. This version is optimized for Claude Sonnet 3.7 but has identical capabilities to the previous version.                                              |
| October 22, 2024 | `text_editor_20241022` | Initial release of the text editor Tool with Claude Sonnet 3.5. Provides capabilities for viewing, creating, and editing files through the `view`, `create`, `str_replace`, `insert`, and `undo_edit` commands. |

## Next steps

Here are some ideas for how to use the text editor tool in more convenient and powerful ways:

* **Integrate with your development workflow**: Build the text editor tool into your development tools or IDE
* **Create a code review system**: Have Claude review your code and make improvements
* **Build a debugging assistant**: Create a system where Claude can help you diagnose and fix issues in your code
* **Implement file format conversion**: Let Claude help you convert files from one format to another
* **Automate documentation**: Set up workflows for Claude to automatically document your code

As you build applications with the text editor tool, we're excited to see how you leverage Claude's capabilities to enhance your development workflow and productivity.

<CardGroup cols={3}>
  <Card title="Tool use overview" icon="screwdriver-wrench" href="/en/docs/agents-and-tools/tool-use/overview">
    Learn how to implement tool workflows for use with Claude.
  </Card>

  {" "}

  <Card title="Token-efficient tool use" icon="bolt-lightning" href="/en/docs/agents-and-tools/tool-use/token-efficient-tool-use">
    Reduce latency and costs when using tools with Claude Sonnet 3.7.
  </Card>

  <Card title="Bash tool" icon="terminal" href="/en/docs/agents-and-tools/tool-use/bash-tool">
    Execute shell commands with Claude.
  </Card>
</CardGroup>


# Web search tool

The web search tool gives Claude direct access to real-time web content, allowing it to answer questions with up-to-date information beyond its knowledge cutoff. Claude automatically cites sources from search results as part of its answer.

<Note>
  Please reach out through our [feedback form](https://forms.gle/sWjBtsrNEY2oKGuE8) to share your experience with the web search tool.
</Note>

## Supported models

Web search is available on:

* Claude Opus 4 (`claude-opus-4-20250514`)
* Claude Sonnet 4 (`claude-sonnet-4-20250514`)
* Claude Sonnet 3.7 (`claude-3-7-sonnet-20250219`)
* Claude Sonnet 3.5 (new) (`claude-3-5-sonnet-latest`)
* Claude Haiku 3.5 (`claude-3-5-haiku-latest`)

## How web search works

When you add the web search tool to your API request:

1. Claude decides when to search based on the prompt.
2. The API executes the searches and provides Claude with the results. This process may repeat multiple times throughout a single request.
3. At the end of its turn, Claude provides a final response with cited sources.

## How to use web search

<Note>
  Your organization's administrator must enable web search in [Console](https://console.anthropic.com/settings/privacy).
</Note>

Provide the web search tool in your API request:

<CodeGroup>
  ```bash Shell
  curl https://api.anthropic.com/v1/messages \
      --header "x-api-key: $ANTHROPIC_API_KEY" \
      --header "anthropic-version: 2023-06-01" \
      --header "content-type: application/json" \
      --data '{
          "model": "claude-opus-4-20250514",
          "max_tokens": 1024,
          "messages": [
              {
                  "role": "user",
                  "content": "How do I update a web app to TypeScript 5.5?"
              }
          ],
          "tools": [{
              "type": "web_search_20250305",
              "name": "web_search",
              "max_uses": 5
          }]
      }'
  ```

  ```python Python
  import anthropic

  client = anthropic.Anthropic()

  response = client.messages.create(
      model="claude-opus-4-20250514",
      max_tokens=1024,
      messages=[
          {
              "role": "user",
              "content": "How do I update a web app to TypeScript 5.5?"
          }
      ],
      tools=[{
          "type": "web_search_20250305",
          "name": "web_search",
          "max_uses": 5
      }]
  )
  print(response)
  ```

  ```typescript TypeScript
  import { Anthropic } from '@anthropic-ai/sdk';

  const anthropic = new Anthropic();

  async function main() {
    const response = await anthropic.messages.create({
      model: "claude-opus-4-20250514",
      max_tokens: 1024,
      messages: [
        {
          role: "user",
          content: "How do I update a web app to TypeScript 5.5?"
        }
      ],
      tools: [{
        type: "web_search_20250305",
        name: "web_search",
        max_uses: 5
      }]
    });

    console.log(response);
  }

  main().catch(console.error);
  ```
</CodeGroup>

### Tool definition

The web search tool supports the following parameters:

```json JSON
{
  "type": "web_search_20250305",
  "name": "web_search",

  // Optional: Limit the number of searches per request
  "max_uses": 5,

  // Optional: Only include results from these domains
  "allowed_domains": ["example.com", "trusteddomain.org"],

  // Optional: Never include results from these domains
  "blocked_domains": ["untrustedsource.com"],

  // Optional: Localize search results
  "user_location": {
    "type": "approximate",
    "city": "San Francisco",
    "region": "California",
    "country": "US",
    "timezone": "America/Los_Angeles"
  }
}
```

#### Max uses

The `max_uses` parameter limits the number of searches performed. If Claude attempts more searches than allowed, the `web_search_tool_result` will be an error with the `max_uses_exceeded` error code.

#### Domain filtering

When using domain filters:

* Domains should not include the HTTP/HTTPS scheme (use `example.com` instead of `https://example.com`)
* Subdomains are automatically included (`example.com` covers `docs.example.com`)
* Subpaths are supported (`example.com/blog`)
* You can use either `allowed_domains` or `blocked_domains`, but not both in the same request.

#### Localization

The `user_location` parameter allows you to localize search results based on a user's location.

* `type`: The type of location (must be `approximate`)
* `city`: The city name
* `region`: The region or state
* `country`: The country
* `timezone`: The [IANA timezone ID](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones).

### Response

Here's an example response structure:

```json
{
  "role": "assistant",
  "content": [
    // 1. Claude's decision to search
    {
      "type": "text",
      "text": "I'll search for when Claude Shannon was born."
    },
    // 2. The search query used
    {
      "type": "server_tool_use",
      "id": "srvtoolu_01WYG3ziw53XMcoyKL4XcZmE",
      "name": "web_search",
      "input": {
        "query": "claude shannon birth date"
      }
    },
    // 3. Search results
    {
      "type": "web_search_tool_result",
      "tool_use_id": "srvtoolu_01WYG3ziw53XMcoyKL4XcZmE",
      "content": [
        {
          "type": "web_search_result",
          "url": "https://en.wikipedia.org/wiki/Claude_Shannon",
          "title": "Claude Shannon - Wikipedia",
          "encrypted_content": "EqgfCioIARgBIiQ3YTAwMjY1Mi1mZjM5LTQ1NGUtODgxNC1kNjNjNTk1ZWI3Y...",
          "page_age": "April 30, 2025"
        }
      ]
    },
    {
      "text": "Based on the search results, ",
      "type": "text"
    },
    // 4. Claude's response with citations
    {
      "text": "Claude Shannon was born on April 30, 1916, in Petoskey, Michigan",
      "type": "text",
      "citations": [
        {
          "type": "web_search_result_location",
          "url": "https://en.wikipedia.org/wiki/Claude_Shannon",
          "title": "Claude Shannon - Wikipedia",
          "encrypted_index": "Eo8BCioIAhgBIiQyYjQ0OWJmZi1lNm..",
          "cited_text": "Claude Elwood Shannon (April 30, 1916 – February 24, 2001) was an American mathematician, electrical engineer, computer scientist, cryptographer and i..."
        }
      ]
    }
  ],
  "id": "msg_a930390d3a",
  "usage": {
    "input_tokens": 6039,
    "output_tokens": 931,
    "server_tool_use": {
      "web_search_requests": 1
    }
  },
  "stop_reason": "end_turn"
}
```

#### Search results

Search results include:

* `url`: The URL of the source page
* `title`: The title of the source page
* `page_age`: When the site was last updated
* `encrypted_content`: Encrypted content that must be passed back in multi-turn conversations for citations

#### Citations

Citations are always enabled for web search, and each `web_search_result_location` includes:

* `url`: The URL of the cited source
* `title`: The title of the cited source
* `encrypted_index`: A reference that must be passed back for multi-turn conversations.
* `cited_text`: Up to 150 characters of the cited content

The web search citation fields `cited_text`, `title`, and `url` do not count towards input or output token usage.

<Note>
  When displaying web results or information contained in web results to end users, inline citations must be made clearly visible and clickable in your user interface.
</Note>

#### Errors

If an error occurs during web search, you'll receive a response that takes the following form:

```json
{
  "type": "web_search_tool_result",
  "tool_use_id": "servertoolu_a93jad",
  "content": {
    "type": "web_search_tool_result_error",
    "error_code": "max_uses_exceeded"
  }
}
```

These are the possible error codes:

* `too_many_requests`: Rate limit exceeded
* `invalid_input`: Invalid search query parameter
* `max_uses_exceeded`: Maximum web search tool uses exceeded
* `query_too_long`: Query exceeds maximum length
* `unavailable`: An internal error occurred

#### `pause_turn` stop reason

The response may include a `pause_turn` stop reason, which indicates that the API paused a long-running turn. You may provide the response back as-is in a subsequent request to let Claude continue its turn, or modify the content if you wish to interrupt the conversation.

## Prompt caching

Web search works with [prompt caching](/en/docs/build-with-claude/prompt-caching). To enable prompt caching, add at least one `cache_control` breakpoint in your request. The system will automatically cache up until the last `web_search_tool_result` block when executing the tool.

For multi-turn conversations, set a `cache_control` breakpoint on or after the last `web_search_tool_result` block to reuse cached content.

For example, to use prompt caching with web search for a multi-turn conversation:

<CodeGroup>
  ```python
  import anthropic

  client = anthropic.Anthropic()

  # First request with web search and cache breakpoint
  messages = [
      {
          "role": "user",
          "content": "What's the current weather in San Francisco today?"
      }
  ]

  response1 = client.messages.create(
      model="claude-opus-4-20250514",
      max_tokens=1024,
      messages=messages,
      tools=[{
          "type": "web_search_20250305",
          "name": "web_search",
          "user_location": {
              "type": "approximate",
              "city": "San Francisco",
              "region": "California",
              "country": "US",
              "timezone": "America/Los_Angeles"
          }
      }]
  )

  # Add Claude's response to the conversation
  messages.append({
      "role": "assistant",
      "content": response1.content
  })

  # Second request with cache breakpoint after the search results
  messages.append({
      "role": "user",
      "content": "Should I expect rain later this week?",
      "cache_control": {"type": "ephemeral"}  # Cache up to this point
  })

  response2 = client.messages.create(
      model="claude-opus-4-20250514",
      max_tokens=1024,
      messages=messages,
      tools=[{
          "type": "web_search_20250305",
          "name": "web_search",
          "user_location": {
              "type": "approximate",
              "city": "San Francisco",
              "region": "California",
              "country": "US",
              "timezone": "America/Los_Angeles"
          }
      }]
  )
  # The second response will benefit from cached search results
  # while still being able to perform new searches if needed
  print(f"Cache read tokens: {response2.usage.get('cache_read_input_tokens', 0)}")
  ```
</CodeGroup>

## Streaming

With streaming enabled, you'll receive search events as part of the stream. There will be a pause while the search executes:

```javascript
event: message_start
data: {"type": "message_start", "message": {"id": "msg_abc123", "type": "message"}}

event: content_block_start
data: {"type": "content_block_start", "index": 0, "content_block": {"type": "text", "text": ""}}

// Claude's decision to search

event: content_block_start
data: {"type": "content_block_start", "index": 1, "content_block": {"type": "server_tool_use", "id": "srvtoolu_xyz789", "name": "web_search"}}

// Search query streamed
event: content_block_delta
data: {"type": "content_block_delta", "index": 1, "delta": {"type": "input_json_delta", "partial_json": "{\"query\":\"latest quantum computing breakthroughs 2025\"}"}}

// Pause while search executes

// Search results streamed
event: content_block_start
data: {"type": "content_block_start", "index": 2, "content_block": {"type": "web_search_tool_result", "tool_use_id": "srvtoolu_xyz789", "content": [{"type": "web_search_result", "title": "Quantum Computing Breakthroughs in 2025", "url": "https://example.com"}]}}

// Claude's response with citations (omitted in this example)
```

## Batch requests

You can include the web search tool in the [Messages Batches API](/en/docs/build-with-claude/batch-processing). Web search tool calls through the Messages Batches API are priced the same as those in regular Messages API requests.

## Usage and pricing

Web search usage is charged in addition to token usage:

```json
"usage": {
  "input_tokens": 105,
  "output_tokens": 6039,
  "cache_read_input_tokens": 7123,
  "cache_creation_input_tokens": 7345,
  "server_tool_use": {
    "web_search_requests": 1
  }
}
```

Web search is available on the Anthropic API for **\$10 per 1,000 searches**, plus standard token costs for search-generated content. Web search results retrieved throughout a conversation are counted as input tokens, in search iterations executed during a single turn and in subsequent conversation turns.

Each web search counts as one use, regardless of the number of results returned. If an error occurs during web search, the web search will not be billed.


# MCP connector

Claude's Model Context Protocol (MCP) connector feature enables you to connect to remote MCP servers directly from the Messages API without a separate MCP client.

<Note>
  This feature requires the beta header: `"anthropic-beta": "mcp-client-2025-04-04"`
</Note>

## Key features

* **Direct API integration**: Connect to MCP servers without implementing an MCP client
* **Tool calling support**: Access MCP tools through the Messages API
* **OAuth authentication**: Support for OAuth Bearer tokens for authenticated servers
* **Multiple servers**: Connect to multiple MCP servers in a single request

## Limitations

* Of the feature set of the [MCP specification](https://modelcontextprotocol.io/introduction#explore-mcp), only [tool calls](https://modelcontextprotocol.io/docs/concepts/tools) are currently supported.
* The server must be publicly exposed through HTTP (supports both Streamable HTTP and SSE transports). Local STDIO servers cannot be connected directly.
* The MCP connector is currently not supported on Amazon Bedrock and Google Vertex.

## Using the MCP connector in the Messages API

To connect to a remote MCP server, include the `mcp_servers` parameter in your Messages API request:

<CodeGroup>
  ```bash cURL
  curl https://api.anthropic.com/v1/messages \
    -H "Content-Type: application/json" \
    -H "X-API-Key: $ANTHROPIC_API_KEY" \
    -H "anthropic-version: 2023-06-01" \
    -H "anthropic-beta: mcp-client-2025-04-04" \
    -d '{
      "model": "claude-sonnet-4-20250514",
      "max_tokens": 1000,
      "messages": [{"role": "user", "content": "What tools do you have available?"}],
      "mcp_servers": [
        {
          "type": "url",
          "url": "https://example-server.modelcontextprotocol.io/sse",
          "name": "example-mcp",
          "authorization_token": "YOUR_TOKEN"
        }
      ]
    }'
  ```

  ```typescript TypeScript
  const response = await anthropic.beta.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 1000,
    messages: [
      {
        role: "user",
        content: "What tools do you have available?",
      },
    ],
    mcp_servers: [
      {
        type: "url",
        url: "https://example-server.modelcontextprotocol.io/sse",
        name: "example-mcp",
        authorization_token: "YOUR_TOKEN",
      },
    ],
    betas: ["mcp-client-2025-04-04"],
  });
  ```

  ```python Python
  response = anthropic.beta.messages.create(
      model="claude-sonnet-4-20250514",
      max_tokens=1000,
      messages=[{
          "role": "user",
          "content": "What tools do you have available?"
      }],
      mcp_servers=[{
          "type": "url",
          "url": "https://mcp.example.com/sse",
          "name": "example-mcp",
          "authorization_token": "YOUR_TOKEN"
      }],
      betas=["mcp-client-2025-04-04"]
  )
  ```
</CodeGroup>

## MCP server configuration

Each MCP server in the `mcp_servers` array supports the following configuration:

```json
{
  "type": "url",
  "url": "https://example-server.modelcontextprotocol.io/sse",
  "name": "example-mcp",
  "tool_configuration": {
    "enabled": true,
    "allowed_tools": ["example_tool_1", "example_tool_2"]
  },
  "authorization_token": "YOUR_TOKEN"
}
```

### Field descriptions

| Property                           | Type    | Required | Description                                                                                                                                                     |
| ---------------------------------- | ------- | -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `type`                             | string  | Yes      | Currently only "url" is supported                                                                                                                               |
| `url`                              | string  | Yes      | The URL of the MCP server. Must start with https\://                                                                                                            |
| `name`                             | string  | Yes      | A unique identifier for this MCP server. It will be used in `mcp_tool_call` blocks to identify the server and to disambiguate tools to the model.               |
| `tool_configuration`               | object  | No       | Configure tool usage                                                                                                                                            |
| `tool_configuration.enabled`       | boolean | No       | Whether to enable tools from this server (default: true)                                                                                                        |
| `tool_configuration.allowed_tools` | array   | No       | List to restrict the tools to allow (by default, all tools are allowed)                                                                                         |
| `authorization_token`              | string  | No       | OAuth authorization token if required by the MCP server. See [MCP specification](https://modelcontextprotocol.io/specification/2025-03-26/basic/authorization). |

## Response content types

When Claude uses MCP tools, the response will include two new content block types:

### MCP Tool Use Block

```json
{
  "type": "mcp_tool_use",
  "id": "mcptoolu_014Q35RayjACSWkSj4X2yov1",
  "name": "echo",
  "server_name": "example-mcp",
  "input": { "param1": "value1", "param2": "value2" }
}
```

### MCP Tool Result Block

```json
{
  "type": "mcp_tool_result",
  "tool_use_id": "mcptoolu_014Q35RayjACSWkSj4X2yov1",
  "is_error": false,
  "content": [
    {
      "type": "text",
      "text": "Hello"
    }
  ]
}
```

## Multiple MCP servers

You can connect to multiple MCP servers by including multiple objects in the `mcp_servers` array:

```json
{
  "model": "claude-sonnet-4-20250514",
  "max_tokens": 1000,
  "messages": [
    {
      "role": "user",
      "content": "Use tools from both mcp-server-1 and mcp-server-2 to complete this task"
    }
  ],
  "mcp_servers": [
    {
      "type": "url",
      "url": "https://mcp.example1.com/sse",
      "name": "mcp-server-1",
      "authorization_token": "TOKEN1"
    },
    {
      "type": "url",
      "url": "https://mcp.example2.com/sse",
      "name": "mcp-server-2",
      "authorization_token": "TOKEN2"
    }
  ]
}
```

## Authentication

For MCP servers that require OAuth authentication, you'll need to obtain an access token. The MCP connector beta supports passing an `authorization_token` parameter in the MCP server definition.
API consumers are expected to handle the OAuth flow and obtain the access token prior to making the API call, as well as refreshing the token as needed.

### Obtaining an access token for testing

The MCP inspector can guide you through the process of obtaining an access token for testing purposes.

1. Run the inspector with the following command. You need Node.js installed on your machine.

   ```bash
   npx @modelcontextprotocol/inspector
   ```

2. In the sidebar on the left, for "Transport type", select either "SSE" or "Streamable HTTP".

3. Enter the URL of the MCP server.

4. In the right area, click on the "Open Auth Settings" button after "Need to configure authentication?".

5. Click "Quick OAuth Flow" and authorize on the OAuth screen.

6. Follow the steps in the "OAuth Flow Progress" section of the inspector and click "Continue" until you reach "Authentication complete".

7. Copy the `access_token` value.

8. Paste it into the `authorization_token` field in your MCP server configuration.

### Using the access token

Once you've obtained an access token using either OAuth flow above, you can use it in your MCP server configuration:

```json
{
  "mcp_servers": [
    {
      "type": "url",
      "url": "https://example-server.modelcontextprotocol.io/sse",
      "name": "authenticated-server",
      "authorization_token": "YOUR_ACCESS_TOKEN_HERE"
    }
  ]
}
```

For detailed explanations of the OAuth flow, refer to the [Authorization section](https://modelcontextprotocol.io/docs/concepts/authentication) in the MCP specification.


# Define your success criteria

Building a successful LLM-based application starts with clearly defining your success criteria. How will you know when your application is good enough to publish?

Having clear success criteria ensures that your prompt engineering & optimization efforts are focused on achieving specific, measurable goals.

***

## Building strong criteria

Good success criteria are:

* **Specific**: Clearly define what you want to achieve. Instead of "good performance," specify "accurate sentiment classification."
* **Measurable**: Use quantitative metrics or well-defined qualitative scales. Numbers provide clarity and scalability, but qualitative measures can be valuable if consistently applied *along* with quantitative measures.

  * Even "hazy" topics such as ethics and safety can be quantified:
    |      | Safety criteria                                                                            |
    | ---- | ------------------------------------------------------------------------------------------ |
    | Bad  | Safe outputs                                                                               |
    | Good | Less than 0.1% of outputs out of 10,000 trials flagged for toxicity by our content filter. |

  <Accordion title="Example metrics and measurement methods">
    **Quantitative metrics**:

    * Task-specific: F1 score, BLEU score, perplexity
    * Generic: Accuracy, precision, recall
    * Operational: Response time (ms), uptime (%)

    **Quantitative methods**:

    * A/B testing: Compare performance against a baseline model or earlier version.
    * User feedback: Implicit measures like task completion rates.
    * Edge case analysis: Percentage of edge cases handled without errors.

    **Qualitative scales**:

    * Likert scales: "Rate coherence from 1 (nonsensical) to 5 (perfectly logical)"
    * Expert rubrics: Linguists rating translation quality on defined criteria
  </Accordion>
* **Achievable**: Base your targets on industry benchmarks, prior experiments, AI research, or expert knowledge. Your success metrics should not be unrealistic to current frontier model capabilities.
* **Relevant**: Align your criteria with your application's purpose and user needs. Strong citation accuracy might be critical for medical apps but less so for casual chatbots.

<Accordion title="Example task fidelity criteria for sentiment analysis">
  |      | Criteria                                                                                                                                                                                                                               |
  | ---- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
  | Bad  | The model should classify sentiments well                                                                                                                                                                                              |
  | Good | Our sentiment analysis model should achieve an F1 score of at least 0.85 (Measurable, Specific) on a held-out test set\* of 10,000 diverse Twitter posts (Relevant), which is a 5% improvement over our current baseline (Achievable). |

  \**More on held-out test sets in the next section*
</Accordion>

***

## Common success criteria to consider

Here are some criteria that might be important for your use case. This list is non-exhaustive.

<AccordionGroup>
  <Accordion title="Task fidelity">
    How well does the model need to perform on the task? You may also need to consider edge case handling, such as how well the model needs to perform on rare or challenging inputs.
  </Accordion>

  <Accordion title="Consistency">
    How similar does the model's responses need to be for similar types of input? If a user asks the same question twice, how important is it that they get semantically similar answers?
  </Accordion>

  <Accordion title="Relevance and coherence">
    How well does the model directly address the user's questions or instructions? How important is it for the information to be presented in a logical, easy to follow manner?
  </Accordion>

  <Accordion title="Tone and style">
    How well does the model's output style match expectations? How appropriate is its language for the target audience?
  </Accordion>

  <Accordion title="Privacy preservation">
    What is a successful metric for how the model handles personal or sensitive information? Can it follow instructions not to use or share certain details?
  </Accordion>

  <Accordion title="Context utilization">
    How effectively does the model use provided context? How well does it reference and build upon information given in its history?
  </Accordion>

  <Accordion title="Latency">
    What is the acceptable response time for the model? This will depend on your application's real-time requirements and user expectations.
  </Accordion>

  <Accordion title="Price">
    What is your budget for running the model? Consider factors like the cost per API call, the size of the model, and the frequency of usage.
  </Accordion>
</AccordionGroup>

Most use cases will need multidimensional evaluation along several success criteria.

<Accordion title="Example multidimensional criteria for sentiment analysis">
  |      | Criteria                                                                                                                                                                                                                                                                                   |
  | ---- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
  | Bad  | The model should classify sentiments well                                                                                                                                                                                                                                                  |
  | Good | On a held-out test set of 10,000 diverse Twitter posts, our sentiment analysis model should achieve:<br />- an F1 score of at least 0.85<br />- 99.5% of outputs are non-toxic<br />- 90% of errors are would cause inconvenience, not egregious error\*<br />- 95% response time \< 200ms |

  \**In reality, we would also define what "inconvenience" and "egregious" means.*
</Accordion>

***

## Next steps

<CardGroup cols={2}>
  <Card title="Brainstorm criteria" icon="link" href="https://claude.ai/">
    Brainstorm success criteria for your use case with Claude on claude.ai.<br /><br />**Tip**: Drop this page into the chat as guidance for Claude!
  </Card>

  <Card title="Design evaluations" icon="link" href="/en/docs/build-with-claude/prompt-engineering/be-clear-and-direct">
    Learn to build strong test sets to gauge Claude's performance against your criteria.
  </Card>
</CardGroup>


# Define your success criteria

Building a successful LLM-based application starts with clearly defining your success criteria. How will you know when your application is good enough to publish?

Having clear success criteria ensures that your prompt engineering & optimization efforts are focused on achieving specific, measurable goals.

***

## Building strong criteria

Good success criteria are:

* **Specific**: Clearly define what you want to achieve. Instead of "good performance," specify "accurate sentiment classification."
* **Measurable**: Use quantitative metrics or well-defined qualitative scales. Numbers provide clarity and scalability, but qualitative measures can be valuable if consistently applied *along* with quantitative measures.

  * Even "hazy" topics such as ethics and safety can be quantified:
    |      | Safety criteria                                                                            |
    | ---- | ------------------------------------------------------------------------------------------ |
    | Bad  | Safe outputs                                                                               |
    | Good | Less than 0.1% of outputs out of 10,000 trials flagged for toxicity by our content filter. |

  <Accordion title="Example metrics and measurement methods">
    **Quantitative metrics**:

    * Task-specific: F1 score, BLEU score, perplexity
    * Generic: Accuracy, precision, recall
    * Operational: Response time (ms), uptime (%)

    **Quantitative methods**:

    * A/B testing: Compare performance against a baseline model or earlier version.
    * User feedback: Implicit measures like task completion rates.
    * Edge case analysis: Percentage of edge cases handled without errors.

    **Qualitative scales**:

    * Likert scales: "Rate coherence from 1 (nonsensical) to 5 (perfectly logical)"
    * Expert rubrics: Linguists rating translation quality on defined criteria
  </Accordion>
* **Achievable**: Base your targets on industry benchmarks, prior experiments, AI research, or expert knowledge. Your success metrics should not be unrealistic to current frontier model capabilities.
* **Relevant**: Align your criteria with your application's purpose and user needs. Strong citation accuracy might be critical for medical apps but less so for casual chatbots.

<Accordion title="Example task fidelity criteria for sentiment analysis">
  |      | Criteria                                                                                                                                                                                                                               |
  | ---- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
  | Bad  | The model should classify sentiments well                                                                                                                                                                                              |
  | Good | Our sentiment analysis model should achieve an F1 score of at least 0.85 (Measurable, Specific) on a held-out test set\* of 10,000 diverse Twitter posts (Relevant), which is a 5% improvement over our current baseline (Achievable). |

  \**More on held-out test sets in the next section*
</Accordion>

***

## Common success criteria to consider

Here are some criteria that might be important for your use case. This list is non-exhaustive.

<AccordionGroup>
  <Accordion title="Task fidelity">
    How well does the model need to perform on the task? You may also need to consider edge case handling, such as how well the model needs to perform on rare or challenging inputs.
  </Accordion>

  <Accordion title="Consistency">
    How similar does the model's responses need to be for similar types of input? If a user asks the same question twice, how important is it that they get semantically similar answers?
  </Accordion>

  <Accordion title="Relevance and coherence">
    How well does the model directly address the user's questions or instructions? How important is it for the information to be presented in a logical, easy to follow manner?
  </Accordion>

  <Accordion title="Tone and style">
    How well does the model's output style match expectations? How appropriate is its language for the target audience?
  </Accordion>

  <Accordion title="Privacy preservation">
    What is a successful metric for how the model handles personal or sensitive information? Can it follow instructions not to use or share certain details?
  </Accordion>

  <Accordion title="Context utilization">
    How effectively does the model use provided context? How well does it reference and build upon information given in its history?
  </Accordion>

  <Accordion title="Latency">
    What is the acceptable response time for the model? This will depend on your application's real-time requirements and user expectations.
  </Accordion>

  <Accordion title="Price">
    What is your budget for running the model? Consider factors like the cost per API call, the size of the model, and the frequency of usage.
  </Accordion>
</AccordionGroup>

Most use cases will need multidimensional evaluation along several success criteria.

<Accordion title="Example multidimensional criteria for sentiment analysis">
  |      | Criteria                                                                                                                                                                                                                                                                                   |
  | ---- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
  | Bad  | The model should classify sentiments well                                                                                                                                                                                                                                                  |
  | Good | On a held-out test set of 10,000 diverse Twitter posts, our sentiment analysis model should achieve:<br />- an F1 score of at least 0.85<br />- 99.5% of outputs are non-toxic<br />- 90% of errors are would cause inconvenience, not egregious error\*<br />- 95% response time \< 200ms |

  \**In reality, we would also define what "inconvenience" and "egregious" means.*
</Accordion>

***

## Next steps

<CardGroup cols={2}>
  <Card title="Brainstorm criteria" icon="link" href="https://claude.ai/">
    Brainstorm success criteria for your use case with Claude on claude.ai.<br /><br />**Tip**: Drop this page into the chat as guidance for Claude!
  </Card>

  <Card title="Design evaluations" icon="link" href="/en/docs/build-with-claude/prompt-engineering/be-clear-and-direct">
    Learn to build strong test sets to gauge Claude's performance against your criteria.
  </Card>
</CardGroup>


# Using the Evaluation Tool

> The [Anthropic Console](https://console.anthropic.com/dashboard) features an **Evaluation tool** that allows you to test your prompts under various scenarios.

## Accessing the Evaluate Feature

To get started with the Evaluation tool:

1. Open the Anthropic Console and navigate to the prompt editor.
2. After composing your prompt, look for the 'Evaluate' tab at the top of the screen.

![Accessing Evaluate Feature](https://mintlify.s3.us-west-1.amazonaws.com/anthropic/images/access_evaluate.png)

<Tip>
  Ensure your prompt includes at least 1-2 dynamic variables using the double brace syntax: \{\{variable}}. This is required for creating eval test sets.
</Tip>

## Generating Prompts

The Console offers a built-in [prompt generator](https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/prompt-generator) powered by Claude Opus 4:

<Steps>
  <Step title="Click 'Generate Prompt'">
    Clicking the 'Generate Prompt' helper tool will open a modal that allows you to enter your task information.
  </Step>

  <Step title="Describe your task">
    Describe your desired task (e.g., "Triage inbound customer support requests") with as much or as little detail as you desire. The more context you include, the more Claude can tailor its generated prompt to your specific needs.
  </Step>

  <Step title="Generate your prompt">
    Clicking the orange 'Generate Prompt' button at the bottom will have Claude generate a high quality prompt for you. You can then further improve those prompts using the Evaluation screen in the Console.
  </Step>
</Steps>

This feature makes it easier to create prompts with the appropriate variable syntax for evaluation.

![Prompt Generator](https://mintlify.s3.us-west-1.amazonaws.com/anthropic/images/promptgenerator.png)

## Creating Test Cases

When you access the Evaluation screen, you have several options to create test cases:

1. Click the '+ Add Row' button at the bottom left to manually add a case.
2. Use the 'Generate Test Case' feature to have Claude automatically generate test cases for you.
3. Import test cases from a CSV file.

To use the 'Generate Test Case' feature:

<Steps>
  <Step title="Click on 'Generate Test Case'">
    Claude will generate test cases for you, one row at a time for each time you click the button.
  </Step>

  <Step title="Edit generation logic (optional)">
    You can also edit the test case generation logic by clicking on the arrow dropdown to the right of the 'Generate Test Case' button, then on 'Show generation logic' at the top of the Variables window that pops up. You may have to click \`Generate' on the top right of this window to populate initial generation logic.

    Editing this allows you to customize and fine tune the test cases that Claude generates to greater precision and specificity.
  </Step>
</Steps>

Here's an example of a populated Evaluation screen with several test cases:

![Populated Evaluation Screen](https://mintlify.s3.us-west-1.amazonaws.com/anthropic/images/eval_populated.png)

<Note>
  If you update your original prompt text, you can re-run the entire eval suite against the new prompt to see how changes affect performance across all test cases.
</Note>

## Tips for Effective Evaluation

<Accordion title="Prompt Structure for Evaluation">
  To make the most of the Evaluation tool, structure your prompts with clear input and output formats. For example:

  ```
  In this task, you will generate a cute one sentence story that incorporates two elements: a color and a sound.
  The color to include in the story is:
  <color>
  {{COLOR}}
  </color>
  The sound to include in the story is:
  <sound>
  {{SOUND}}
  </sound>
  Here are the steps to generate the story:
  1. Think of an object, animal, or scene that is commonly associated with the color provided. For example, if the color is "blue", you might think of the sky, the ocean, or a bluebird.
  2. Imagine a simple action, event or scene involving the colored object/animal/scene you identified and the sound provided. For instance, if the color is "blue" and the sound is "whistle", you might imagine a bluebird whistling a tune.
  3. Describe the action, event or scene you imagined in a single, concise sentence. Focus on making the sentence cute, evocative and imaginative. For example: "A cheerful bluebird whistled a merry melody as it soared through the azure sky."
  Please keep your story to one sentence only. Aim to make that sentence as charming and engaging as possible while naturally incorporating the given color and sound.
  Write your completed one sentence story inside <story> tags.

  ```

  This structure makes it easy to vary inputs (\{\{COLOR}} and \{\{SOUND}}) and evaluate outputs consistently.
</Accordion>

<Tip>
  Use the 'Generate a prompt' helper tool in the Console to quickly create prompts with the appropriate variable syntax for evaluation.
</Tip>

## Understanding and comparing results

The Evaluation tool offers several features to help you refine your prompts:

1. **Side-by-side comparison**: Compare the outputs of two or more prompts to quickly see the impact of your changes.
2. **Quality grading**: Grade response quality on a 5-point scale to track improvements in response quality per prompt.
3. **Prompt versioning**: Create new versions of your prompt and re-run the test suite to quickly iterate and improve results.

By reviewing results across test cases and comparing different prompt versions, you can spot patterns and make informed adjustments to your prompt more efficiently.

Start evaluating your prompts today to build more robust AI applications with Claude!


# Reducing latency

Latency refers to the time it takes for the model to process a prompt and and generate an output. Latency can be influenced by various factors, such as the size of the model, the complexity of the prompt, and the underlying infrastucture supporting the model and point of interaction.

<Note>
  It's always better to first engineer a prompt that works well without model or prompt constraints, and then try latency reduction strategies afterward. Trying to reduce latency prematurely might prevent you from discovering what top performance looks like.
</Note>

***

## How to measure latency

When discussing latency, you may come across several terms and measurements:

* **Baseline latency**: This is the time taken by the model to process the prompt and generate the response, without considering the input and output tokens per second. It provides a general idea of the model's speed.
* **Time to first token (TTFT)**: This metric measures the time it takes for the model to generate the first token of the response, from when the prompt was sent. It's particularly relevant when you're using streaming (more on that later) and want to provide a responsive experience to your users.

For a more in-depth understanding of these terms, check out our [glossary](/en/docs/about-claude/glossary).

***

## How to reduce latency

### 1. Choose the right model

One of the most straightforward ways to reduce latency is to select the appropriate model for your use case. Anthropic offers a [range of models](/en/docs/about-claude/models/overview) with different capabilities and performance characteristics. Consider your specific requirements and choose the model that best fits your needs in terms of speed and output quality. For more details about model metrics, see our [models overview](/en/docs/about-claude/models/overview) page.

### 2. Optimize prompt and output length

Minimize the number of tokens in both your input prompt and the expected output, while still maintaining high performance. The fewer tokens the model has to process and generate, the faster the response will be.

Here are some tips to help you optimize your prompts and outputs:

* **Be clear but concise**: Aim to convey your intent clearly and concisely in the prompt. Avoid unnecessary details or redundant information, while keeping in mind that [claude lacks context](/en/docs/build-with-claude/prompt-engineering/be-clear-and-direct) on your use case and may not make the intended leaps of logic if instructions are unclear.
* **Ask for shorter responses:**: Ask Claude directly to be concise. The Claude 3 family of models has improved steerability over previous generations. If Claude is outputting unwanted length, ask Claude to [curb its chattiness](/en/docs/build-with-claude/prompt-engineering/be-clear-and-direct).
  <Tip> Due to how LLMs count [tokens](/en/docs/about-claude/glossary#tokens) instead of words, asking for an exact word count or a word count limit is not as effective a strategy as asking for paragraph or sentence count limits.</Tip>
* **Set appropriate output limits**: Use the `max_tokens` parameter to set a hard limit on the maximum length of the generated response. This prevents Claude from generating overly long outputs.
  > **Note**: When the response reaches `max_tokens` tokens, the response will be cut off, perhaps midsentence or mid-word, so this is a blunt technique that may require post-processing and is usually most appropriate for multiple choice or short answer responses where the answer comes right at the beginning.
* **Experiment with temperature**: The `temperature` [parameter](/en/api/messages) controls the randomness of the output. Lower values (e.g., 0.2) can sometimes lead to more focused and shorter responses, while higher values (e.g., 0.8) may result in more diverse but potentially longer outputs.

Finding the right balance between prompt clarity, output quality, and token count may require some experimentation.

### 3. Leverage streaming

Streaming is a feature that allows the model to start sending back its response before the full output is complete. This can significantly improve the perceived responsiveness of your application, as users can see the model's output in real-time.

With streaming enabled, you can process the model's output as it arrives, updating your user interface or performing other tasks in parallel. This can greatly enhance the user experience and make your application feel more interactive and responsive.

Visit [streaming Messages](/en/docs/build-with-claude/streaming) to learn about how you can implement streaming for your use case.




