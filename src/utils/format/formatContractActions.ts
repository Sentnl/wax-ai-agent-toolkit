import { ABI } from "@wharfkit/antelope";

function extractParams(ricardianText: string) {
  const params: { [key: string]: string } = {};

  // Match all {{variable}} instances (excluding handlebars logic like #if, /if, etc.)
  const variableRegex = /{{\s*([a-zA-Z_][a-zA-Z0-9_]*)\s*}}/g;
  let match;
  while ((match = variableRegex.exec(ricardianText)) !== null) {
    const key = match[1];
    if (!(key in params)) {
      params[key] = "required";
    }
  }

  // Detect optional variables wrapped in {{#if ...}} blocks
  const optionalRegex = /{{#if\s+([a-zA-Z_][a-zA-Z0-9_]*)}}[\s\S]*?{{\/if}}/g;
  while ((match = optionalRegex.exec(ricardianText)) !== null) {
    const key = match[1];
    params[key] = "optional"; // Override to optional
  }

  return params;
}

export function formatContractActions(action: ABI.Action | ABI.Action[]) {
  if (Array.isArray(action)) {
    return action.map((a) => formatContractAction(a));
  }
  return formatContractAction(action);
}

export function formatContractAction(action: ABI.Action) {
  const name = action.name;
  const type = action.type;
  const ricardian_contract = action.ricardian_contract;

  return `
    -------------------------------ActionName: ${name}----------------------------------
    Type: ${type}
    Params: ${JSON.stringify(extractParams(ricardian_contract))} \n
  `;
}
