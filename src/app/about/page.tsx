import Link from "next/link";

export default function AboutPage() {
  const steps = [
    { emoji: "🎁", title: "Receive Your Gift", desc: "Your loved one gives you a beautiful gift with an NFC chip embedded in it." },
    { emoji: "📲", title: "Tap the Tag", desc: "Hold your phone near the NFC tag on your gift. It instantly opens MemoryTap." },
    { emoji: "🔐", title: "Sign In", desc: "Enter the unique username and password that was set up just for you." },
    { emoji: "💝", title: "Explore Your Memories", desc: "Discover photos, videos, voice notes, and written messages shared with love." },
  ];

  return (
    <div className="min-h-screen bg-stone-50 px-6 py-12 flex flex-col items-center font-sans">
      <div className="max-w-md w-full">
        <Link href="/" className="text-stone-400 hover:text-stone-700 text-sm mb-8 flex items-center gap-1">
          ← Back
        </Link>
        <h1 className="text-3xl font-medium text-stone-800 mb-2">How MemoryTap Works</h1>
        <p className="text-stone-500 text-sm mb-10">A personal digital memory box, unlocked with a tap.</p>

        <div className="space-y-5">
          {steps.map((step, i) => (
            <div key={i} className="bg-white rounded-2xl p-5 border border-stone-100 shadow-sm flex gap-4 items-start">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center text-2xl shrink-0">
                {step.emoji}
              </div>
              <div>
                <p className="font-medium text-stone-800 mb-1">{step.title}</p>
                <p className="text-stone-500 text-sm">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10">
          <Link
            href="/login"
            className="w-full flex justify-center py-4 rounded-2xl bg-stone-900 text-white text-sm font-medium shadow-md hover:bg-stone-800 transition-all active:scale-[0.98]"
          >
            Unlock My Memories
          </Link>
        </div>
      </div>
    </div>
  );
}
