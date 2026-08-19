import type { ToolDefinition } from "@andrewkimjoseph/celina-sdk/tools";
import { toWebsiteToolBaseline } from "@andrewkimjoseph/celina-sdk/tools";

export function toolPublicMetadata(definition: ToolDefinition) {
  const baseline = toWebsiteToolBaseline(definition);
  return {
    name: baseline.name,
    title: baseline.title,
    description: baseline.description,
    inputs: baseline.inputs,
  };
}
