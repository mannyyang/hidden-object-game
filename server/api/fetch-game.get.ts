import { defineEventHandler } from "h3";
import { createDirectus, rest, readItems, aggregate } from "@directus/sdk";

// Client with REST support
const client = createDirectus(process.env.DIRECTUS_PUBLIC_URL || "").with(
  rest()
);

export default defineEventHandler(async (event) => {
  const collectionName = "hidden_object_game";
  const query = getQuery(event);
  const page = query.page ? parseInt(query.page, 10) : 1;
  const limit = query.limit ? parseInt(query.limit, 10) : 10;
  const offset = (page - 1) * limit;

  try {
    const results = await client.request(
      readItems(collectionName, {
        limit,
        offset,
      })
    );

    // use directus aggregation to get total count
    const total = await client.request(
      aggregate(collectionName, {
        aggregate: { count: "*" },
      })
    );
    console.log(total);

    if (results?.length > 0) {
      return {
        success: true,
        games: results,
        // total: results.meta.total_count,
        page,
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
