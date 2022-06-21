import classNames from "classnames";
import { PLACEHOLDER_IMAGE_URL } from "@src/constants";
import {
  eventHasLimitedAvailability,
  useHonestActor,
} from "@src/context/HonestActor";
import { Preloader } from "@src/ui/progress/Preloader";
import { useActorQuery } from "@src/utils/ActorUtils";
import Link from "next/link";
import { useRouter } from "next/router";
import { formatFractionalICP } from "@src/utils/Formatting";
import { Event, Universe } from "../../../../declarations/honest/honest.did";

const EventPage: React.FC<{}> = () => {
  const honest = useHonestActor();
  const router = useRouter();
  const { eventId } = router.query;
  const eventResult = useActorQuery({
    actor: honest,
    method: "getEvent",
    args: eventId ? [parseInt(eventId as any, 10)] : undefined,
    skip: eventId === undefined,
  });

  const universesResult = useActorQuery({
    actor: honest,
    method: "getUniverses",
  });

  if (eventResult.loading) return <Preloader />;

  const event: Event = eventResult.data!.Ok;
  const universes: Universe[] = universesResult.data || [];

  const featuredUniverses = event.universeIds.reduce((acc, id) => {
    const u = universes.find((uni) => uni.id === id);
    if (u) {
      acc.push(u);
    }

    return acc;
  }, [] as Universe[]);

  return (
    <div className="m-auto w-full max-w-2xl flex flex-col gap-8">
      <section>
        <img
          src={event.imageUrl[0] || PLACEHOLDER_IMAGE_URL}
          alt=""
          className="h-96 mb-16 mx-auto"
        />

        <div className="prose dark:prose-invert">
          <h1>{event.name}</h1>

          <p>{event.description[0] || "No description provided"}</p>
        </div>
      </section>

      <section
        className={classNames({
          hidden: !featuredUniverses.length,
        })}
      >
        <div className="mb-4 prose dark:prose-invert">
          <h3>Feature Universes</h3>
        </div>

        {featuredUniverses.map((universe) => (
          <div key={String(universe.id)} className="card card-side h-36">
            <figure>
              <img src={universe.imageUrl[0] || PLACEHOLDER_IMAGE_URL} alt="" />
            </figure>

            <div className="card-body justify-between">
              <span className="card-title">{universe.name}</span>

              <div className="card-actions justify-end">
                <Link href={`/universes/${String(universe.id)}`}>
                  <a className="btn btn-sm btn-ghost">Find out more</a>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </section>

      <section className="p-6 flex flex-row justify-between border border-accent rounded-lg">
        <div className="flex flex-col gap-2">
          <span>
            Dates:{" "}
            {event.startTime[0]
              ? "Starts on " +
                new Date(Number(event.startTime[0])).toISOString()
              : "Ongoing"}
          </span>
          {eventHasLimitedAvailability(event) ? (
            <span className="badge badge-secondary">Limited availability</span>
          ) : null}
          {event.remainingTickets} tickets remaining
        </div>

        <div>
          <p className="text-sm mb-2 text-right">
            from {formatFractionalICP(event.price)}
          </p>

          <label htmlFor="get-tickets" className="btn btn-primary modal-button">
            Get tickets
          </label>

          <input type="checkbox" id="get-tickets" className="modal-toggle" />
          <label htmlFor="get-tickets" className="modal cursor-pointer">
            <label className="modal-box">
              <p className="mb-4 mt-0 text-lg font-bold">Ooops</p>

              <p>
                We aren&apos;t done with this yet, come back later to see if
                it&apos;s complete
              </p>

              <div className="modal-action">
                <label htmlFor="get-tickets" className="btn btn-ghost">
                  Close
                </label>
              </div>
            </label>
          </label>
        </div>
      </section>

      <div className="mt-8 flex flex-row-reverse">
        <Link href="/events">
          <a className="btn btn-ghost">Back to events</a>
        </Link>
      </div>
    </div>
  );
};

export default EventPage;
