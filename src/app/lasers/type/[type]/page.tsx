import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { LasersBrowse } from "@/components/machines/LasersBrowse";
import {
  getAllMachines,
  getMachinesByLaserType,
  LASER_TYPE_INFO,
} from "@/lib/content";
import type { LaserType } from "@/types/machine";
import { laserTypeLabel } from "@/lib/utils";

const VALID_TYPES: LaserType[] = ["diode", "co2", "fiber", "uv", "hybrid"];

interface PageProps {
  params: Promise<{ type: string }>;
}

export async function generateStaticParams() {
  return VALID_TYPES.map((type) => ({ type }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { type } = await params;
  if (!VALID_TYPES.includes(type as LaserType)) return { title: "Not found" };

  const label = laserTypeLabel(type);
  return {
    title: `${label} Laser Engravers`,
    description: LASER_TYPE_INFO[type as LaserType].description,
  };
}

export default async function LaserTypePage({ params }: PageProps) {
  const { type } = await params;
  if (!VALID_TYPES.includes(type as LaserType)) notFound();

  const laserType = type as LaserType;
  const machines = getMachinesByLaserType(laserType);
  const info = LASER_TYPE_INFO[laserType];
  const allCount = getAllMachines().length;

  if (machines.length === 0) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <nav className="mb-6 text-sm text-stone-500">
          <Link href="/lasers" className="hover:text-amber-700">
            Laser engravers
          </Link>
          <span className="mx-2">/</span>
          <span>{info.label}</span>
        </nav>
        <h1 className="text-3xl font-bold text-stone-900">
          {info.label} laser engravers
        </h1>
        <p className="mt-4 text-stone-600">{info.description}</p>
        <p className="mt-6 rounded-lg border border-stone-200 bg-stone-50 p-4 text-sm text-stone-600">
          No {info.label.toLowerCase()} machines in our catalog yet. We are
          adding more — browse all {allCount} lasers or read the{" "}
          <Link
            href="/guides/understanding-laser-types"
            className="text-amber-700 hover:underline"
          >
            laser types guide
          </Link>
          .
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <nav className="mb-6 text-sm text-stone-500">
        <Link href="/lasers" className="hover:text-amber-700">
          Laser engravers
        </Link>
        <span className="mx-2">/</span>
        <span>{info.label}</span>
      </nav>

      <div className="mb-8 rounded-xl border border-amber-200 bg-amber-50 p-5">
        <p className="text-sm font-medium text-amber-800">About {info.label} lasers</p>
        <p className="mt-2 text-stone-700">{info.description}</p>
        <Link
          href="/guides/understanding-laser-types"
          className="mt-3 inline-block text-sm font-medium text-amber-700 hover:underline"
        >
          Read the full laser types guide →
        </Link>
      </div>

      <LasersBrowse
        machines={machines}
        initialType={laserType}
        title={`${info.label} laser engravers`}
        description={`${machines.length} ${info.label.toLowerCase()} machines in our catalog.`}
      />
    </div>
  );
}
