import { getTypedMessages } from "@/i18n/get-messages";

export async function FormatComparison() {
  const ru = await getTypedMessages();
  const { comparisonHeading, comparisonTable } = ru.academy.hub;

  return (
    <div className="flex flex-col gap-4">
      <h2 className="font-heading text-3xl text-ink-strong">{comparisonHeading}</h2>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[560px] border-collapse text-left text-sm">
          <thead className="border-b border-border">
            <tr>
              <th className="px-3 py-2 font-medium text-ink-strong">
                {comparisonTable.featureHeader}
              </th>
              <th className="px-3 py-2 font-medium text-ink-strong">
                {comparisonTable.onlineHeader}
              </th>
              <th className="px-3 py-2 font-medium text-ink-strong">
                {comparisonTable.offlineHeader}
              </th>
            </tr>
          </thead>
          <tbody>
            {comparisonTable.rows.map((row) => (
              <tr key={row.feature} className="border-b border-border">
                <th scope="row" className="px-3 py-2 font-medium text-ink-strong">
                  {row.feature}
                </th>
                <td className="px-3 py-2 text-ink-muted">{row.online}</td>
                <td className="px-3 py-2 text-ink-muted">{row.offline}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
