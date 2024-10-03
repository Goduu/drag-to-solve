import InteractiveStoryGrid from "@/components/draggable-area/draggable-area";
import { PositionLoggerNode, Test } from "@/components/test";
import { ModeToggle } from "@/components/ui/theme-toggle";
import Image from "next/image";
import "@xyflow/react/dist/style.css";
import { Xongas } from "@/components/xongas";
import CodeToDiagramConverter from "@/components/testParser";

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <header>
        <ModeToggle />
      </header>
      <main className="h-screen w-screen flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <CodeToDiagramConverter />
        {/* <InteractiveStoryGrid /> */}
      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">

      </footer>
    </div>
  );
}
