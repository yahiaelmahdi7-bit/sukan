"use client";

import PostWizard, {
  type PostFormShape,
} from "@/app/[locale]/post/_components/post-wizard";

interface EditWizardProps {
  userId: string;
  listingId: string;
  initialValues: PostFormShape;
}

/**
 * Thin wrapper that renders the shared PostWizard in edit mode.
 * Keeps the edit entry-point clean and avoids re-implementing wizard logic.
 */
export default function EditWizard({
  userId,
  listingId,
  initialValues,
}: EditWizardProps) {
  return (
    <PostWizard
      userId={userId}
      editingListingId={listingId}
      initialValues={initialValues}
      mode="edit"
    />
  );
}
