import MiniSparkline from "./MiniSparkline";

type KPI = {
  label: string;
  value: string;
  badge?: "green"|"amber"|"red";
  series?: number[];
};

export default function KPIGrid({ data }: { data: KPI[] }) {
  return (
    <section className="mx-auto max-w-7xl px-4 mt-8 grid md:grid-cols-4 gap-4">
      {data.map((k) => (
        <div className="card" key={k.label}>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm subtle">{k.label}</p>
              <p className="text-2xl font-semibold mt-1">{k.value}</p>
            </div>
            {k.badge && <span className={`badge badge-${k.badge}`}>{k.badge}</span>}
          </div>
          {k.series && (
            <div className="mt-3">
              <MiniSparkline values={k.series} />
            </div>
          )}
        </div>
      ))}
    </section>
  );
}