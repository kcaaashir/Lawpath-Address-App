// app/page.tsx
"use client";

import SourceTab from "@/components/SourceTab";
import { useAppStore } from "@/lib/zustandStore";
import VerifierTab from "@/components/VerifierTab";
import ElasticLogs from "@/components/ElasticLogs";

export default function Page() {
  const active = useAppStore((s) => s.activeTab);
  const setActive = useAppStore((s) => s.setActiveTab);

  return (
    <main className="space-y-6">
      <nav className="relative bg-green-800">
        <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
          <div className="relative flex h-12 items-center justify-between">
            <div className="flex flex-1 sm:justify-between">
              <div className="flex items-center text-white">
                Lawpath Address App
              </div>
              <div className="hidden sm:ml-6 sm:block">
                <div className="flex space-x-4">
                  <button onClick={() => setActive("verifier")} aria-current="page" className={`tab rounded-md ${active === "verifier" ? "tab-active bg-gray-800" : "hover:bg-white/5 hover:text-white"} px-3 py-2 text-sm font-medium text-white`}>
                    Verifier
                  </button>
                  <button onClick={() => setActive("source")} className={`tab rounded-md px-3 py-2 ${active === "source" ? "tab-active bg-gray-800" : "hover:bg-white/5 hover:text-white"} text-sm font-medium text-gray-300`}>

                    Source
                  </button>
                  <button onClick={() => setActive("logs")} className={`tab rounded-md px-3 py-2 ${active === "logs" ? "tab-active bg-gray-800" : "hover:bg-white/5 hover:text-white"} text-sm font-medium text-gray-300`}>

                    Logs
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </nav>
      <div>
        {active === "verifier" && <VerifierTab />}
        {active === "source" && <SourceTab />}
        {active === "logs" && <ElasticLogs />}
      </div>
    </main>
  );
}

