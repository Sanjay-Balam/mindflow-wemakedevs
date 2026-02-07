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

  // Tool 3: Get guided meditation
  const MEDITATIONS: Record<string, string> = {
    "body-scan": `Find a comfortable position and close your eyes. Take three deep breaths to settle in.\n\nBring your attention to the top of your head. Notice any sensations — tingling, warmth, or tension. Don't try to change anything, just observe.\n\nSlowly move your awareness down to your forehead, your eyes, your jaw. Let each area soften as you notice it. Release any tension you find.\n\nContinue scanning down through your neck and shoulders. These areas often hold stress. Breathe into any tightness and let it melt away.\n\nMove through your arms to your fingertips, then your chest and belly. Feel the gentle rise and fall of your breath.\n\nContinue down through your hips, legs, and feet. Feel the weight of your body supported beneath you.\n\nNow expand your awareness to your whole body at once. You are safe. You are present. Rest here for a few more breaths before gently opening your eyes.`,

    "loving-kindness": `Sit comfortably and close your eyes. Take a few deep breaths to center yourself.\n\nPicture yourself in your mind. Silently repeat: "May I be happy. May I be healthy. May I be safe. May I live with ease."\n\nFeel the warmth of these wishes settling into your heart. You deserve kindness, especially from yourself.\n\nNow bring to mind someone you love. Picture their face and silently say: "May you be happy. May you be healthy. May you be safe. May you live with ease."\n\nNext, think of a neutral person — maybe someone you passed on the street. Extend the same wishes to them.\n\nFinally, expand your circle to include all beings everywhere: "May all beings be happy. May all beings be healthy. May all beings be safe. May all beings live with ease."\n\nSit with this feeling of boundless compassion. When you're ready, gently open your eyes and carry this warmth with you.`,

    "progressive-relaxation": `Lie down or sit comfortably. Close your eyes and take three slow, deep breaths.\n\nStart with your feet. Tense the muscles in your feet by curling your toes tightly. Hold for 5 seconds... and release. Feel the difference between tension and relaxation.\n\nMove to your calves. Tighten them by pointing your toes up. Hold for 5 seconds... and release. Notice the relaxation flowing in.\n\nContinue to your thighs. Press them together firmly. Hold... and release. Feel the heaviness of relaxation.\n\nTighten your stomach muscles. Hold... and release. Let your belly be soft.\n\nMake fists with both hands and tense your arms. Hold... and release. Let your arms go limp.\n\nScrunch your shoulders up toward your ears. Hold... and release. Feel them drop away from tension.\n\nFinally, scrunch your entire face. Hold... and release. Let your face be smooth and calm.\n\nYour whole body is now deeply relaxed. Rest here, breathing naturally, for as long as you wish.`,

    "mindful-breathing": `Find a comfortable seated position. Let your hands rest naturally in your lap. Gently close your eyes.\n\nBegin by simply noticing your breath. Don't try to change it. Just observe the natural rhythm of breathing in and breathing out.\n\nNow deepen your breath slightly. Inhale slowly through your nose for a count of 4. Feel your lungs expand, your chest and belly rising.\n\nPause for a moment at the top of your breath.\n\nExhale slowly through your mouth for a count of 6. Feel your body softening with each exhale.\n\nContinue this pattern. Inhale for 4... pause... exhale for 6. Let each breath anchor you to the present moment.\n\nIf your mind wanders — and it will — that's perfectly okay. Simply notice the thought without judgment and gently guide your attention back to your breath.\n\nYou are here. You are breathing. That is enough.\n\nContinue for a few more cycles, then let your breath return to its natural rhythm. When you're ready, slowly open your eyes.`,
  };

  server.tool(
    "get_guided_meditation",
    "Returns a guided meditation script based on type. Available types: body-scan, loving-kindness, progressive-relaxation, mindful-breathing. Use when the user wants to meditate, relax deeply, or practice mindfulness.",
    {
      type: z.enum(["body-scan", "loving-kindness", "progressive-relaxation", "mindful-breathing"])
        .default("mindful-breathing")
        .describe("Type of meditation"),
    },
    async ({ type }) => {
      return {
        content: [{
          type: "text" as const,
          text: JSON.stringify({
            meditation_type: type,
            title: type.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" "),
            script: MEDITATIONS[type],
            duration_estimate: "5-10 minutes",
            tip: "Find a quiet, comfortable place. You can read through this slowly or have someone read it to you.",
          }, null, 2),
        }],
      };
    }
  );

  // Tool 4: CBT thought-challenging exercise
  server.tool(
    "get_cbt_exercise",
    "Returns a CBT (Cognitive Behavioral Therapy) thought-challenging worksheet. Use when the user has negative thought patterns, cognitive distortions, or wants to challenge unhelpful thinking.",
    {
      situation: z.string().describe("The situation or thought to challenge"),
    },
    async ({ situation }) => {
      return {
        content: [{
          type: "text" as const,
          text: JSON.stringify({
            title: "Thought Challenging Worksheet",
            instructions: "Work through each step to examine and reframe your thought pattern.",
            worksheet: {
              step1_situation: {
                label: "Situation",
                description: "What happened? Where were you? Who was involved?",
                value: situation,
              },
              step2_automatic_thought: {
                label: "Automatic Thought",
                description: "What thought popped into your mind? What were you telling yourself?",
                prompt: "Write down the exact thought as it occurred to you.",
              },
              step3_emotions: {
                label: "Emotions & Intensity",
                description: "What emotions did you feel? Rate each from 0-100%.",
                prompt: "e.g., Anxiety (80%), Sadness (60%), Frustration (40%)",
              },
              step4_cognitive_distortion: {
                label: "Cognitive Distortion",
                description: "Which thinking pattern might be at play?",
                common_distortions: [
                  "All-or-Nothing Thinking: Seeing things in black and white",
                  "Catastrophizing: Expecting the worst possible outcome",
                  "Mind Reading: Assuming you know what others think",
                  "Emotional Reasoning: Believing something is true because it feels true",
                  "Should Statements: Rigid rules about how things should be",
                  "Overgeneralization: Drawing broad conclusions from one event",
                  "Personalization: Blaming yourself for things outside your control",
                ],
              },
              step5_evidence: {
                label: "Evidence Examination",
                evidence_for: "What evidence supports this thought?",
                evidence_against: "What evidence contradicts this thought?",
              },
              step6_balanced_thought: {
                label: "Balanced Thought",
                description: "Considering all the evidence, what is a more balanced way to see this?",
                prompt: "Write a thought that is realistic and compassionate.",
              },
              step7_action_plan: {
                label: "Action Plan",
                description: "What is one small step you can take right now?",
                prompt: "Choose something concrete and achievable.",
              },
            },
          }, null, 2),
        }],
      };
    }
  );

  // Tool 5: Sleep hygiene tips
  const SLEEP_TIPS = [
    { id: 1, tip: "Keep a consistent sleep schedule — go to bed and wake up at the same time every day, even on weekends.", keywords: ["routine", "schedule", "consistency"] },
    { id: 2, tip: "Create a relaxing bedtime routine. Try reading, gentle stretching, or deep breathing 30 minutes before bed.", keywords: ["routine", "falling asleep", "relaxation"] },
    { id: 3, tip: "Keep your bedroom cool (60-67°F / 15-19°C), dark, and quiet. Consider blackout curtains or a white noise machine.", keywords: ["environment", "quality", "staying asleep"] },
    { id: 4, tip: "Avoid screens (phone, tablet, TV) for at least 30 minutes before bed. Blue light suppresses melatonin production.", keywords: ["screens", "falling asleep", "quality"] },
    { id: 5, tip: "Limit caffeine intake after 2 PM. Caffeine has a half-life of 5-6 hours and can disrupt sleep architecture.", keywords: ["caffeine", "falling asleep", "quality"] },
    { id: 6, tip: "Exercise regularly, but finish vigorous workouts at least 3 hours before bedtime.", keywords: ["exercise", "quality", "routine"] },
    { id: 7, tip: "Avoid large meals and alcohol close to bedtime. Both can fragment sleep and reduce sleep quality.", keywords: ["diet", "staying asleep", "quality"] },
    { id: 8, tip: "If you can't fall asleep within 20 minutes, get up and do something calming in dim light until you feel sleepy.", keywords: ["falling asleep", "insomnia", "technique"] },
    { id: 9, tip: "Use your bed only for sleep — this strengthens the mental association between your bed and rest.", keywords: ["association", "falling asleep", "routine"] },
    { id: 10, tip: "Try journaling before bed to offload worries. Write down tomorrow's tasks so your mind can let go.", keywords: ["anxiety", "falling asleep", "technique", "worry"] },
  ];

  server.tool(
    "get_sleep_tips",
    "Returns evidence-based sleep hygiene tips. Optionally filter by specific sleep issue. Use when the user mentions sleep problems, insomnia, trouble sleeping, or asks for help with sleep.",
    {
      issue: z.string().optional().describe("Specific sleep issue like 'falling asleep', 'staying asleep', 'quality', 'routine', 'insomnia'"),
    },
    async ({ issue }) => {
      let tips = SLEEP_TIPS;

      if (issue) {
        const issueLower = issue.toLowerCase();
        const filtered = SLEEP_TIPS.filter(t =>
          t.keywords.some(k => issueLower.includes(k) || k.includes(issueLower))
        );
        if (filtered.length > 0) tips = filtered;
      }

      return {
        content: [{
          type: "text" as const,
          text: JSON.stringify({
            title: "Sleep Hygiene Tips",
            issue: issue || "general",
            tips: tips.map(t => ({ id: t.id, tip: t.tip })),
            reminder: "Good sleep is a pillar of mental health. Small, consistent changes make a big difference over time.",
          }, null, 2),
        }],
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
