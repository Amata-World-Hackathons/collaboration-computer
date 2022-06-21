import { PLACEHOLDER_IMAGE_URL } from "@src/constants";
import {
  eventHasLimitedAvailability,
  useHonestActor,
} from "@src/context/HonestActor";
import { Preloader } from "@src/ui/progress/Preloader";
import { useActorQuery } from "@src/utils/ActorUtils";
import { formatFractionalICP } from "@src/utils/Formatting";
import Head from "next/head";
import Link from "next/link";
import { Event } from "../../../../declarations/honest/honest.did";

const EventsIndexPage: React.FC<{}> = () => {
  const honest = useHonestActor();
  const eventsResult = useActorQuery<Event[]>({
    actor: honest,
    method: "getEvents",
  });

  if (eventsResult.loading) return <Preloader />;

  const events = eventsResult.data!;

  return (
    <div className="w-full max-w-7xl m-auto">
      <Head>
        <title>Events | Honest Ticket Machine</title>
      </Head>

      <div className="mt-4 mb-12 mx-auto xl:w-1/2 prose dark:prose-invert">
        <h1>Honest Events</h1>

        <p>Check out the events that were created by people like you</p>
      </div>

      <section className="flex flex-row flex-wrap gap-8 justify-center">
        {events.map((event) => (
          <div key={Number(event.id)} className="card w-96 bg-slate-800">
            <figure>
              <img
                src={event.imageUrl[0] || PLACEHOLDER_IMAGE_URL}
                alt={event.name}
              />
            </figure>
            <div className="card-body">
              <div className="flex-1">
                <h3 className="card-title">{event.name}</h3>

                <p className="mt-2 text-xs">
                  {event.startTime[0]
                    ? new Date(Number(event.startTime[0])).toLocaleDateString(
                        "en-GB",
                        {
                          day: "numeric",
                          year: "numeric",
                          month: "long",
                        }
                      )
                    : "Ongoing"}{" "}
                  {/* <span className="badge badge-primary">Official</span>{" "} */}
                  {eventHasLimitedAvailability(event) ? (
                    <span className="badge badge-secondary">
                      Limited availability
                    </span>
                  ) : null}
                </p>

                <p className="mt-3">
                  {(event.description[0] || "No description provided").slice(
                    0,
                    140
                  )}
                </p>

                {/* <p>
                <span className="badge">Dance</span>{" "}
                <span className="badge">Celebrities</span>
              </p> */}
              </div>

              <div className="mt-4">
                <p className="text-sm text-end">
                  from {formatFractionalICP(event.price)}
                </p>
              </div>

              <div className="card-actions items-center justify-end">
                <Link href={`/events/${String(event.id)}`}>
                  <a className="btn btn-sm btn-ghost">Find out more</a>
                </Link>

                <Link href={`/events/${String(event.id)}`}>
                  <a className="btn btn-primary">Get tickets</a>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
};

export default EventsIndexPage;
