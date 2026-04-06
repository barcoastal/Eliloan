import { getContacts } from "@/actions/contacts";
import { AbandonedClient } from "./abandoned-client";

export default async function AbandonedPage() {
  const { contacts, total } = await getContacts({ tag: "abandoned-app" });

  return (
    <AbandonedClient
      contacts={contacts.map((c) => ({
        id: c.id,
        firstName: c.firstName,
        lastName: c.lastName,
        email: c.email,
        phone: c.phone,
        lastAppStep: c.lastAppStep,
        source: c.source,
        createdAt: c.createdAt.toISOString(),
        assignedRep: c.assignedRep,
        tags: c.tags.map((t) => t.tag),
      }))}
      total={total}
    />
  );
}
