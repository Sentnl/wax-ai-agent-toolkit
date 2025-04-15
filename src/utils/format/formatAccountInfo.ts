import { Name, API, TimePoint } from "@wharfkit/antelope";

export function formatAccountInfo(account: API.v1.AccountObject) {
  // Account Information Section
  const accountInfo = `
      Account Information:
      - Account Name: ${account.account_name}
      - Account Created On: ${new Date(account.created.toMilliseconds()).toLocaleString()}
      - Last Code Update: ${new Date(account.last_code_update.toMilliseconds()).toLocaleString()}
      - Privileged Status: ${account.privileged ? "Yes" : "No"}
    `;

  // Resource Usage & Limits Section
  const resourceUsage = `
        Resource Usage & Limits:
        - CPU Usage: ${account.cpu_limit.used.value} / ${account.cpu_limit.max.value}
        - Network Usage: ${account.net_limit.used.value} / ${account.net_limit.max.value}
        - RAM Usage: ${account.ram_usage.value} bytes / ${account.ram_quota.value} bytes
      `;

  // Core Balance Section
  const coreBalance = `
        Core Liquid Balance:
        - ${account.core_liquid_balance?.units.value} ${account.core_liquid_balance?.symbol.value}
      `;

  // Permissions Section
  const permissions = account.permissions
    .map((permission, index) => {
      return `
          Permission ${index + 1}:
          - Name: ${permission.perm_name.value}
          - Parent: ${permission.parent.value}
          - Required Authentication: ${permission.required_auth.keys.map((key) => key.key).join(", ")}
          - Linked Actions: ${permission.linked_actions.length ? permission.linked_actions.join(", ") : "None"}
        `;
    })
    .join("\n");

  // Resource Totals Section
  const resourceTotals = `
        Resource Totals:
        - Total Net Weight: ${account.total_resources.net_weight.units.value} ${account.total_resources.net_weight.symbol.value}
        - Total CPU Weight: ${account.total_resources.cpu_weight.units.value} ${account.total_resources.cpu_weight.symbol.value}
        - Total RAM Bytes: ${account.total_resources.ram_bytes.value} bytes
      `;

  // Combine everything into a final output
  const output = `
      ${accountInfo}
      ${resourceUsage}
      ${coreBalance}
      ${permissions}
      ${resourceTotals}
    `;

  return output;
}
