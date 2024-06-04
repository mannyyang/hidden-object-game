import { defineEventHandler } from "h3";
import { createDirectus, rest, readItems, aggregate } from "@directus/sdk";

// Client with REST support
const client = createDirectus(process.env.DIRECTUS_PUBLIC_URL || "").with(
  rest()
);

export default defineEventHandler(async (event) => {
  const collectionName = "hidden_object_game";
  const query = getQuery(event);
  const limit = query.limit ? parseInt(query.limit, 10) : 10;
  const offset = query.offset ? parseInt(query.offset, 10) : 0;

  try {
    const results = await client.request(
      readItems(collectionName, {
        limit,
        offset,
        sort: ['-date_created']
      })
    );

    // use directus aggregation to get total count
    const total = await client.request(
      aggregate(collectionName, {
        aggregate: { count: "*" },
      })
    );

    if (results?.length > 0) {
      return {
        success: true,
        games: results,
        total: total[0].count,
        offset,
        limit,
      };
    } else {
      return {
        success: false,
        error: "No game data found",
      };
    }
  } catch (error: any) {
    return { success: false, error };
  }
});