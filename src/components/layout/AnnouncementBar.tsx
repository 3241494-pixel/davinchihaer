import { getTypedMessages } from "@/i18n/get-messages";

/** Тонкая полоса над шапкой с одним служебным сообщением (референс fenomen.beauty). */
export async function AnnouncementBar() {
  const ru = await getTypedMessages();
  return (
    <div className="bg-ink text-bg">
      <p className="caps mx-auto w-full max-w-[1280px] px-4 py-2 text-center text-[12px] md:px-8">
        {ru.header.announcement}
      </p>
    </div>
  );
}
