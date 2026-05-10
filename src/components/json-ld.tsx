/**
 * JsonLd — minimal server component that injects a <script type="application/ld+json">
 * tag with structured data.
 *
 * Usage:
 *   import JsonLd from "@/components/json-ld";
 *   import { buildOrganizationLD } from "@/lib/json-ld";
 *   <JsonLd data={buildOrganizationLD({ siteUrl })} />
 *
 * This is the Next.js-recommended pattern for App Router JSON-LD injection:
 * https://nextjs.org/docs/app/building-your-application/optimizing/metadata#json-ld
 */

export default function JsonLd({ data }: { data: unknown }) {
  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
