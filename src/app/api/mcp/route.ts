import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { WebStandardStreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/webStandardStreamableHttp.js";
import { z } from "zod";

// Curated mental health resources as fallback when no Brave API key is available
const CURATED_RESOURCES = [
  {
    title: "Managing Anxiety - Mental Health Foundation",
    url: "https://www.mentalhealth.org.uk/explore-mental-health/a-z-topics/anxiety",
    description:
      "Comprehensive guide on understanding and managing anxiety, including symptoms, causes, and coping strategies.",
  },
  {
    title: "Mindfulness Exercises - Mayo Clinic",
    url: "https://www.mayoclinic.org/healthy-lifestyle/consumer-health/in-depth/mindfulness-exercises/art-20046356",
    description:
      "Simple mindfulness exercises you can practice anywhere to reduce stress and improve well-being.",
  },
  {
    title: "Coping with Stress - CDC",
    url: "https://www.cdc.gov/mental-health/living-well/cope-with-stress/index.html",
    description:
      "Evidence-based strategies for coping with stress, including healthy habits and when to seek help.",
  },
  {
    title: "Sleep and Mental Health - Harvard Health",
    url: "https://www.health.harvard.edu/newsletter_article/sleep-and-mental-health",
    description:
      "How sleep affects mental health and practical tips for improving sleep quality.",
  },
  {
    title: "Self-Care Tips - NIMH",
    url: "https://www.nimh.nih.gov/health/topics/caring-for-your-mental-health",
    description:
      "National Institute of Mental Health guide to taking care of your mental health with actionable steps.",
  },
  {
    title: "Breathing Exercises for Stress - Healthline",
    url: "https://www.healthline.com/health/breathing-exercises-for-anxiety",
    description:
      "10 breathing techniques that can help reduce anxiety and promote relaxation.",
  },
  {
    title: "Gratitude and Well-Being - Psychology Today",
    url: "https://www.psychologytoday.com/us/basics/gratitude",
    description:
      "The science behind gratitude and how practicing it can improve mental health.",
  },
  {
    title: "Depression Overview - WHO",
    url: "https://www.who.int/news-room/fact-sheets/detail/depression",
    description:
      "World Health Organization fact sheet on depression, including global statistics and treatment options.",
  },
];

const AFFIRMATIONS = [
  "You are worthy of love and kindness, especially from yourself.",
  "Every small step forward is still progress. Be proud of how far you've come.",
  "It's okay to take things one moment at a time. You don't have to have it all figured out.",
  "Your feelings are valid, and it's brave to acknowledge them.",
  "You are stronger than you think, and this difficult moment will pass.",
  "Taking care of your mental health is not selfish — it's essential.",
  "You deserve rest and peace. It's okay to slow down.",
  "Every day is a new opportunity to be gentle with yourself.",
  "You are not alone in this. Reaching out for support is a sign of strength.",
  "Your best is enough. You don't need to be perfect to be valuable.",
  "The world is better because you are in it.",
  "It's okay to set boundaries. Protecting your energy is self-care.",
  "You have survived 100% of your worst days. You're doing better than you think.",
  "Healing isn't linear, and every small act of self-kindness matters.",
  "You are allowed to outgrow the version of yourself that was struggling.",
];

function createMcpServer() {
  const server = new McpServer(
    { name: "mindflow-wellness", version: "1.0.0" },
    { capabilities: { tools: {} } }
  );

  // Tool 1: Search wellness resources
  server.tool(
    "search_wellness_resources",
    "Search for mental health and wellness resources, articles, and guides on a given topic. Returns curated resources from trusted mental health organizations.",
    { query: z.string().describe("The wellness topic to search for (e.g., 'anxiety management', 'sleep hygiene', 'mindfulness')") },
    async ({ query }) => {
      const braveApiKey = process.env.BRAVE_API_KEY;

      // Try Brave Search API if key is available
      if (braveApiKey) {
        try {
          const searchQuery = `${query} mental health wellness`;
          const response = await fetch(
            `https://api.search.brave.com/res/v1/web/search?q=${encodeURIComponent(searchQuery)}&count=5`,
            {
              headers: {
                Accept: "application/json",
                "Accept-Encoding": "gzip",
                "X-Subscription-Token": braveApiKey,
              },
            }
          );

          if (response.ok) {
            const data = await response.json();
            const results =
              data.web?.results?.map(
                (r: { title: string; url: string; description: string }) => ({
                  title: r.title,
                  url: r.url,
                  description: r.description,
                })
              ) || [];

            if (results.length > 0) {
              return {
                content: [
                  {
                    type: "text" as const,
                    text: JSON.stringify(
                      { query, source: "brave_search", results },
                      null,
                      2
                    ),
                  },
                ],
              };
            }
          }
        } catch {
          // Fall through to curated resources
        }
      }

      // Fallback: filter curated resources by query keywords
      const queryLower = query.toLowerCase();
      const keywords = queryLower.split(/\s+/);

      const matched = CURATED_RESOURCES.filter((resource) => {
        const text =
          `${resource.title} ${resource.description}`.toLowerCase();
        return keywords.some((kw) => text.includes(kw));
      });

      const results = matched.length > 0 ? matched : CURATED_RESOURCES.slice(0, 5);

      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify(
              { query, source: "curated", results },
              null,
              2
            ),
          },
        ],
      };
    }
  );

  // Tool 2: Get daily affirmation
  server.tool(
    "get_daily_affirmation",
    "Returns a positive, encouraging affirmation for mental wellness. Use this to uplift the user or start a conversation on a positive note.",
    {},
    async () => {
      // Use date-based index for consistency within a day, with some randomness
      const today = new Date();
      const dayOfYear = Math.floor(
        (today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) /
          86400000
      );
      const index = dayOfYear % AFFIRMATIONS.length;

      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify(
              {
                affirmation: AFFIRMATIONS[index],
                date: today.toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                }),
              },
              null,
              2
            ),
          },
        ],
      };
    }
  );

  return server;
}

// Handle POST requests (main MCP communication)
export async function POST(req: Request) {
  const server = createMcpServer();
  const transport = new WebStandardStreamableHTTPServerTransport({
    sessionIdGenerator: undefined, // Stateless mode
  });

  await server.connect(transport);

  const response = await transport.handleRequest(req);
  return response;
}

// Handle GET requests (SSE stream for server-initiated messages)
export async function GET(req: Request) {
  const server = createMcpServer();
  const transport = new WebStandardStreamableHTTPServerTransport({
    sessionIdGenerator: undefined,
  });

  await server.connect(transport);

  const response = await transport.handleRequest(req);
  return response;
}

// Handle DELETE requests (session termination)
export async function DELETE(req: Request) {
  const server = createMcpServer();
  const transport = new WebStandardStreamableHTTPServerTransport({
    sessionIdGenerator: undefined,
  });

  await server.connect(transport);

  const response = await transport.handleRequest(req);
  return response;
}
