import DfinityLogo from "@src/ui/logos/DfinityLogo";

export function formatFractionalICP(value: bigint) {
  return (
    <span>
      <DfinityLogo className="w-6 -mt-1 inline-block" /> {Number(value) / 1e8}
    </span>
  );
}
