import { defineEventHandler, readBody } from "h3";
import {
  createDirectus,
  rest,
  readItems,
  createItem,
  updateItem,
} from "@directus/sdk";

// Client with REST support
const client = createDirectus(process.env.DIRECTUS_PUBLIC_URL || "").with(
  rest()
);

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { id, hidden_objects, image_url, image_width, image_height } = body;

  const collection_name = "hidden_object_game";

  // Remove the found property from the hidden objects.
  const updatedHiddenObjects = hidden_objects.map((circle: any) => {
    return {
      x: circle.x,
      y: circle.y,
      radius: circle.radius,
    };
  });

  try {
    let results: any[] = [];
    if (id) {
      results = await client.request(
        readItems(collection_name, {
          filter: {
            id: {
              _eq: id,
            },
          },
        })
      );
    }

    if (results?.length > 0) {
      // Update existing item
      await client.request(
        updateItem(collection_name, id, {
          updatedHiddenObjects,
          image_url,
          image_width,
          image_height,
        })
      );

      return { success: true, updatedHiddenObjects };
    } else {
      // Create new item
      const newItem = await client.request(
        createItem(collection_name, {
          updatedHiddenObjects,
          image_url,
          image_width,
          image_height,
        })
      );

      return {
        success: true,
        id: newItem.id,
        hidden_objects: newItem.updatedHiddenObjects,
      };
    }
  } catch (error: any) {
    return { success: false, error: error.message };
  }
});
