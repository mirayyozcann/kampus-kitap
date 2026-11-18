"use client";

export default function DeleteListingButton({
  action,
}: {
  action: () => Promise<void>;
}) {
  return (
    <form
      action={action}
      onSubmit={(e) => {
        if (!confirm("Bu ilanı silmek istediğine emin misin?")) {
          e.preventDefault();
        }
      }}
    >
      <button
        type="submit"
        className="rounded-lg border border-red-200 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
      >
        Sil
      </button>
    </form>
  );
}