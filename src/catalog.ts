import {
  ALL_TOOL_DEFINITIONS,
  filterToolDefinitions,
  type FilterToolsOptions,
  type ToolDefinition,
} from "@andrewkimjoseph/celina-sdk/tools";

/** Hosted MCP filter plus `families: ["read"]` — no prepare, estimate, or server-key tools. */
export const PUBLIC_READ_FILTER: FilterToolsOptions = {
  surface: "mcp",
  families: ["read"],
  serverKeyToolsEnabled: false,
  selfSessionToolsEnabled: false,
  estimateToolsEnabled: false,
};

export function getPublicReadToolDefinitions(): ToolDefinition[] {
  return filterToolDefinitions(ALL_TOOL_DEFINITIONS, PUBLIC_READ_FILTER);
}

export function getPublicReadToolNames(): string[] {
  return getPublicReadToolDefinitions().map((definition) => definition.name);
}

export function getPublicReadTool(name: string): ToolDefinition | undefined {
  return getPublicReadToolDefinitions().find((definition) => definition.name === name);
}
