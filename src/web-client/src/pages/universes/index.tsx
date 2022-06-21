import { PLACEHOLDER_IMAGE_URL } from "@src/constants";
import { useHonestActor } from "@src/context/HonestActor";
import { Preloader } from "@src/ui/progress/Preloader";
import { useActorQuery } from "@src/utils/ActorUtils";
import Head from "next/head";
import Link from "next/link";
import { Universe } from "../../../../declarations/honest/honest.did";

const UniversesIndexPage: React.FC<{}> = () => {
  const honest = useHonestActor();
  const universesResult = useActorQuery<Universe[]>({
    actor: honest,
    method: "getUniverses",
  });

  if (universesResult.loading) return <Preloader />;

  const universes = universesResult.data!;

  return (
    <div className="w-full max-w-7xl m-auto">
      <Head>
        <title>Universes | Honest Ticket Machine</title>
      </Head>

      <div className="mt-4 mb-12 mx-auto xl:w-1/2 prose dark:prose-invert">
        <h1>Universe</h1>

        <p>Explore the different universes that are a part of the platform</p>
      </div>

      <section className="flex flex-row flex-wrap gap-8 justify-center">
        {universes.map((universe) => (
          <div key={Number(universe.id)} className="card w-96 bg-slate-800">
            <figure>
              <img
                src={universe.imageUrl[0] || PLACEHOLDER_IMAGE_URL}
                alt={universe.name}
              />
            </figure>
            <div className="card-body">
              <h3 className="card-title">{universe.name}</h3>

              <p>
                {(universe.description[0] || "No description provided").slice(
                  0,
                  140
                )}
              </p>

              <div className="mt-4 card-actions items-center justify-end">
                <Link href={`/universes/${String(universe.id)}`}>
                  <a className="btn btn-sm btn-primary">Discover events</a>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
};

export default UniversesIndexPage;
