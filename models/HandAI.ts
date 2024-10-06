export type ModelName =
  | "llama3-70b-8192"
  | "mixtral-8x7b-32768"
  | "gemma-7b-it"
  | "llama3-8b-8192";

type ToolStringParameter = {type: "string", description: string};
type ToolNumberParameter = {type: "number", description: string};
type ToolBooleanParameter = {type: "boolean", description: string};
type ToolPrimitiveParameter =
| ToolStringParameter
| ToolNumberParameter
| ToolBooleanParameter;
interface ToolObjectParameter {
  type: "object";
  properties: { [key: string]: ToolPrimitiveParameter | ToolObjectParameter };
  required?: string[];
}
type ToolParameter = ToolPrimitiveParameter | ToolObjectParameter;

type ToolTypeToType<P extends ToolParameter> = P extends ToolPrimitiveParameter ? 
    (P extends ToolStringParameter ? string
    : P extends ToolNumberParameter ? number
    : P extends ToolBooleanParameter ? boolean : never)
: P extends ToolObjectParameter ? {[key in keyof P["properties"]]: ToolTypeToType<P["properties"][key]>} : never;

interface Tool<P extends ToolParameter = any> {
  name: string;
  description: string;
  params: P;
  fn: (p: ToolTypeToType<P>) => string | Promise<string>;
}

export function tool <P extends ToolParameter> (tool: Partial<Tool<P>>) {
    return {
        handle: (fn: Tool<P>["fn"]) => tool as Tool<P>
    };
}

export default class HandAI {
  constructor(public model: ModelName = "llama3-70b-8192") {}
  private tools: Tool[] = [];
  public addTool(tool: Tool) {
    this.tools.push(tool);
    return this;
  }
}