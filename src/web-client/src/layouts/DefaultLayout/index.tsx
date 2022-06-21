import DfinityLogo from "@src/ui/logos/DfinityLogo";
import AccountDropdown from "./AccountDropdown";

export function applyDefaultLayout(page: React.ReactNode) {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="navbar px-6">
        <div className="flex-1">
          <ul className="menu menu-horizontal">
            <li>
              <a href="/" className="uppercase">
                Honest Ticket Machine
              </a>
            </li>
            <li>
              <a href="/events">Events</a>
            </li>
            <li>
              <a href="/universes">Universes</a>
            </li>
          </ul>
        </div>

        <div className="flex-none ml-8">
          <AccountDropdown />
        </div>
      </header>

      <main className="flex-1">{page}</main>

      <footer className="mt-16 text-sm bg-slate-800">
        <div className="pt-12 pb-4 flex flex-row items-center justify-between w-full max-w-6xl m-auto">
          <div>Honest Ticket Machine</div>

          <div>
            Built to run fully on-chain. Powered by{" "}
            <a
              href="https://dfinity.org/"
              target="_blank"
              rel="noreferrer nofollow"
            >
              <DfinityLogo className="w-8 inline-block" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
