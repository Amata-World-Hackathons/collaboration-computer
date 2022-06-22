import classNames from "classnames";
import { AppPage } from "@src/types";
import { FormField, TextareaFormField } from "@src/ui/forms/FormField";
import Head from "next/head";
import { useRouter } from "next/router";
import { FormProvider, useForm } from "react-hook-form";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useHonestActor } from "@src/context/HonestActor";
import {
  MintingRequest,
  Universe,
} from "../../../../declarations/honest/honest.did";
import { PLACEHOLDER_IMAGE_URL } from "@src/constants";
import { useActorQuery } from "@src/utils/ActorUtils";
import { formatFractionalICP } from "@src/utils/Formatting";
import { useICPLedger } from "@src/context/ICPLedger";
import { AccountIdentifier, ICP } from "@dfinity/nns";
import { useLoggedInIdentity } from "@src/context/LoggedInIdentity";
import applyPrivatePageLayout from "@src/layouts/PrivatePageLayout";

const STEP_CONNECT_UNIVERSE = "1";
const STEP_EVENT_DETAILS = "2";
const STEP_CONFIRM = "3";

const DEFAULT_USAGE_TERMS = {
  fixedFee: BigInt(5e6),
  attribution: true,
  royaltyFee: 5,
};

const NewEventsPage: AppPage = () => {
  const router = useRouter();
  const methods = useForm({ mode: "all" });
  const [processing, setProcessing] = useState(false);
  const [acceptedImageUrl, setAcceptedImageUrl] = useState("");
  const [didCreateUniverse, setDidCreateUniverse] = useState(false);
  const [connections, setConnections] = useState<bigint[]>([]);

  const internetIdentity = useLoggedInIdentity();
  const ledger = useICPLedger();
  const honest = useHonestActor();

  const universesResult = useActorQuery({
    actor: honest,
    method: "getUniverses",
  });

  const { register, watch, handleSubmit } = methods;

  const imageUrl = watch("imageUrl");

  const universeName = watch("universeName");
  const universeImageUrl = watch("universeImageUrl");
  const universeDescription = watch("universeDescription");
  const universeAllowSharing = watch("universeAllowSharing");

  const { step = STEP_CONNECT_UNIVERSE } = router.query;

  const universes: Universe[] = universesResult.data || [];

  return (
    <div className="w-full max-w-3xl m-auto">
      <Head>
        <title>Create a New Event | Honest Ticket Machine</title>
        <meta name="description" content="Create a new event" />
        <meta name="robots" content="noindex" />
      </Head>

      <div className="prose dark:prose-invert">
        <h1>Create a New Event</h1>

        <FormProvider {...methods}>
          <form
            action=""
            className="flex flex-col items-center border border-accent rounded-lg bg-slate-800 p-8"
            onSubmit={handleSubmit(async (data) => {
              console.log("Creating event", data);
              setProcessing(true);

              const mintingRequest: MintingRequest = {
                event: [
                  {
                    name: data.name,
                    data: [],
                    price: BigInt(parseFloat(data.price) * 1e8),
                    imageUrl: acceptedImageUrl ? [acceptedImageUrl] : [],
                    startTime: [],
                    totalSupply: parseInt(data.totalSupply, 10),
                    description: data.description ? [data.description] : [],
                    universeIds: connections,
                  },
                ],
                universe: didCreateUniverse
                  ? [
                      {
                        name: universeName,
                        tags: [],
                        imageUrl: universeImageUrl ? [universeImageUrl] : [],
                        description: universeDescription
                          ? [universeDescription]
                          : [],
                        availableUsageTerms: universeAllowSharing
                          ? [DEFAULT_USAGE_TERMS]
                          : [],
                      },
                    ]
                  : [],
              };

              // Uncomment to make actual transfers
              // const estimate = await honest.estimateMintingCost(mintingRequest);
              // const paymentAccountId = await honest.getPaymentAccountId();
              // const paymentAccountIdHex = [...paymentAccountId]
              //   .map((a) => a.toString(16).padStart(2, "0"))
              //   .join("");
              // const transferResponse = await ledger.transfer({
              //   to: AccountIdentifier.fromHex(paymentAccountIdHex),
              //   amount: ICP.fromE8s(estimate.Ok!.total as bigint),
              //   memo: BigInt(1),
              //   fee: BigInt(10_000),
              // });

              const res = await honest.mint(mintingRequest);

              console.log("Minting response", res);

              router.push(`/events/${(res as any).Ok.eventTokenId[0]}`);
            })}
          >
            <ul className="steps mb-8 mx-auto">
              <li className="step step-primary">Connect Universes</li>
              <li
                className={classNames("step", {
                  "step-primary": step !== STEP_CONNECT_UNIVERSE,
                })}
              >
                Event Details
              </li>
              <li
                className={classNames("step", {
                  "step-primary": step === STEP_CONFIRM,
                })}
              >
                Confirm &amp; Pay
              </li>
            </ul>

            {connectUniversesSection()}
            {eventDetailsSection()}
            {confirmAndPaySection()}

            <div className="mt-8 w-full flex flex-row-reverse items-center">
              <button
                type="submit"
                className={classNames("btn btn-primary", {
                  hidden: step !== STEP_CONFIRM,
                  loading: processing,
                  "btn-disabled": processing,
                })}
              >
                Create event
              </button>

              <Link
                href={{
                  pathname: router.pathname,
                  query: {
                    ...router.query,
                    step:
                      step === STEP_CONNECT_UNIVERSE
                        ? STEP_EVENT_DETAILS
                        : STEP_CONFIRM,
                  },
                }}
              >
                <a
                  className={classNames("btn btn-primary", {
                    hidden: step === STEP_CONFIRM,
                  })}
                >
                  Continue
                </a>
              </Link>

              <Link
                href={{
                  pathname: router.pathname,
                  query: {
                    ...router.query,
                    step:
                      step === STEP_CONFIRM
                        ? STEP_EVENT_DETAILS
                        : STEP_CONNECT_UNIVERSE,
                  },
                }}
              >
                <a
                  className={classNames("mr-4 btn btn-ghost", {
                    hidden: step === STEP_CONNECT_UNIVERSE,
                    "btn-disabled": processing,
                  })}
                >
                  Back
                </a>
              </Link>

              <Link href="/events">
                <a
                  className={classNames("mr-4 btn btn-ghost", {
                    hidden: step !== STEP_CONNECT_UNIVERSE,
                  })}
                >
                  Back to my events
                </a>
              </Link>
            </div>
          </form>
        </FormProvider>
      </div>
    </div>
  );

  function connectUniversesSection() {
    return (
      <section
        className={classNames({
          hidden: step !== STEP_CONNECT_UNIVERSE,
        })}
      >
        <div className="mb-4 prose dark:prose-invert">
          <h3>Connect Universes</h3>

          <p>
            Honest Ticket Machine makes it possible to give back to those that
            inspired or made this event possible. Share the love, add them here
          </p>
        </div>

        {connections.map((connection) =>
          universeCard(universes.find((uni) => uni.id === connection)!, "none")
        )}

        <label
          htmlFor="connect-universe-others"
          className={classNames("btn btn-sm btn-primary modal-button", {
            hidden: connections.length,
          })}
        >
          Add
        </label>

        <input
          type="checkbox"
          id="connect-universe-others"
          className="modal-toggle"
        />
        <label
          htmlFor="connect-universe-others"
          className="modal cursor-pointer"
        >
          <label className="modal-box w-11/12 max-w-3xl">
            <p className="mb-4 mt-0 text-lg font-bold">
              Connect another Universe
            </p>

            <div className="flex flex-col gap-4">
              {universes.map((uni) => universeCard(uni, "connect"))}
            </div>

            <div className="modal-action">
              <label
                htmlFor="connect-universe-others"
                className="btn btn-ghost"
              >
                Cancel
              </label>
            </div>
          </label>
        </label>

        <div className="divider"></div>

        {didCreateUniverse ? (
          <>
            <div className="mb-4 prose dark:prose-invert">
              <p>Part of your universe</p>
            </div>

            {universeCard(
              {
                id: BigInt(0),
                owner: 0 as any,
                name: universeName,
                tags: [],
                imageUrl: universeImageUrl ? [universeImageUrl] : [],
                description: universeDescription ? [universeDescription] : [],
                availableUsageTerms: universeAllowSharing
                  ? [DEFAULT_USAGE_TERMS]
                  : [],
              },
              "none"
            )}
          </>
        ) : (
          <>
            <div className="mb-4 prose dark:prose-invert">
              <p>Using your own original content? Share that here</p>
            </div>

            {newUniverseModalButton()}
          </>
        )}

        <div className="mt-16 alert alert-warning">
          <div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="stroke-current flex-shrink-0 h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <span>You cannot amend the Universes once an event is created</span>
          </div>
        </div>
      </section>
    );
  }

  function eventDetailsSection() {
    return (
      <section
        className={classNames("w-full", {
          hidden: step !== STEP_EVENT_DETAILS,
        })}
      >
        <label htmlFor="event-detail-image-modal" className="modal-button">
          <img
            src={
              acceptedImageUrl ||
              "https://via.placeholder.com/300/0F172A/FFFFFF?text=Upload+image"
            }
            alt=""
            className="h-80 cursor-pointer m-auto bg-slate-900"
          />
        </label>

        <input
          type="checkbox"
          id="event-detail-image-modal"
          className="modal-toggle"
        />
        <label
          htmlFor="event-detail-image-modal"
          className="modal cursor-pointer"
        >
          <label className="modal-box relative">
            <span className="text-lg font-bold">Change Event Image</span>

            <FormField
              name="imageUrl"
              label="Image URL"
              placeholder="e.g. https://picsum.photos/300"
            />

            <div className="modal-action">
              <label
                htmlFor="event-detail-image-modal"
                className="btn btn-primary"
                onClick={() => setAcceptedImageUrl(imageUrl)}
              >
                Set image
              </label>
            </div>
          </label>
        </label>

        <FormField name="name" label="Name" autoComplete="off" />

        <FormField
          type="date"
          name="date"
          label="Event date"
          showOptionalLabel
        />

        <TextareaFormField
          name="description"
          label="Description"
          showOptionalLabel
        />

        <FormField
          type="number"
          min={1}
          name="totalSupply"
          label="Total supply"
          hint="The total number of tickets allowed to be in circulation"
          placeholder="e.g. 1000"
        />
        <FormField
          min={0}
          name="price"
          type="number"
          step="0.01"
          label="Ticket price"
          placeholder="e.g. 13.5"
        />
      </section>
    );
  }

  function confirmAndPaySection() {
    return (
      <section
        className={classNames("w-full px-8 text-right", {
          hidden: step !== STEP_CONFIRM,
        })}
      >
        <section className="mb-8 p-4 border border-accent rounded-md text-right">
          <p className="text-left">
            The following fees will apply for any ticket transactions
          </p>
          {connections.map((id) => (
            <p key={String(id)} className="text-sm">
              <a
                className="link link-accent"
                href={`/universes/${id}`}
                target="_blank"
                rel="noreferrer nofollow"
              >
                {universes.find((uni) => uni.id === id)!.name}
              </a>{" "}
              royalty: {DEFAULT_USAGE_TERMS.royaltyFee}%
            </p>
          ))}
          <p className="text-sm">Platform fee: 5%</p>

          <div className="divider"></div>
          <p>
            Total: {5 + connections.length * DEFAULT_USAGE_TERMS.royaltyFee}%
          </p>
        </section>

        {connections.length ? (
          <p className="text-sm text-left">Universe connection fees</p>
        ) : null}

        {connections.map((id) => (
          <p key={String(id)} className="text-sm">
            <a
              className="link link-accent"
              href={`/universes/${id}`}
              target="_blank"
              rel="noreferrer nofollow"
            >
              {universes.find((uni) => uni.id === id)!.name}
            </a>{" "}
            connection fee: {formatFractionalICP(DEFAULT_USAGE_TERMS.fixedFee)}
          </p>
        ))}

        <p className="text-sm text-left">Platform fees</p>
        <p className="text-sm">
          Registration: {formatFractionalICP(BigInt(5e6))}
        </p>

        <div className="divider"></div>

        <p>
          Total:{" "}
          {formatFractionalICP(
            BigInt(5e6) +
              BigInt(connections.length) * DEFAULT_USAGE_TERMS.fixedFee
          )}
        </p>

        <div className="alert alert-warning p-4 text-sm text-left">
          <div>
            <span>
              Payments through the ledger have been disabled, so you will not be
              charged for any transactions on this app
            </span>
          </div>
        </div>
      </section>
    );
  }

  function newUniverseModalButton() {
    return (
      <>
        <label
          htmlFor="connect-universe-add-original"
          className="btn btn-sm btn-primary modal-button"
        >
          Add original
        </label>

        <input
          type="checkbox"
          id="connect-universe-add-original"
          className="modal-toggle"
        />
        <label
          htmlFor="connect-universe-add-original"
          className="modal cursor-pointer"
        >
          <label className="modal-box w-11/12 max-w-3xl">
            <p className="mb-4 mt-0 text-lg font-bold">
              Create your own Universe
            </p>

            <FormField
              name="universeName"
              label="Name"
              placeholder="e.g. My Awesome Universe"
            />

            <FormField
              name="universeImageUrl"
              label="Image URL"
              placeholder="e.g. https://picsum.photos/300"
              showOptionalLabel
            />

            <TextareaFormField
              name="universeDescription"
              label="Description"
              showOptionalLabel
            />

            <div className="mt-4 form-control">
              <label className="label cursor-pointer justify-start gap-4">
                <input
                  type="checkbox"
                  className="checkbox"
                  {...register("universeAllowSharing")}
                />
                <span className="label-text">Allow sharing</span>
              </label>

              <label
                htmlFor=""
                className="label-text text-base-content text-xs"
              >
                The platform currently only supports a fixed fee of{" "}
                {String(DEFAULT_USAGE_TERMS.fixedFee)} and{" "}
                {DEFAULT_USAGE_TERMS.royaltyFee}% royalties for the default
                usage
              </label>
            </div>

            <div className="modal-action">
              <label
                htmlFor="connect-universe-add-original"
                className="btn btn-ghost"
              >
                Cancel
              </label>

              <label
                htmlFor="connect-universe-add-original"
                className="btn btn-primary"
                onClick={() => setDidCreateUniverse(true)}
              >
                Add to event
              </label>
            </div>
          </label>
        </label>
      </>
    );
  }

  function universeCard(universe: Universe, action: "none" | "connect") {
    return (
      <div className="card card-side border border-accent">
        <figure>
          <img src={universe.imageUrl[0] || PLACEHOLDER_IMAGE_URL} alt="" />
        </figure>

        <div className="card-body w-1/2 flex-shrink-0">
          <span className="card-title">{universe.name}</span>

          <p>
            {(universe.description[0] || "No description provided").slice(
              0,
              280
            )}
          </p>

          <div className="card-actions justify-end">
            {action === "connect" ? (
              <label
                htmlFor="connect-universe-others"
                className="btn btn-primary"
                onClick={() => setConnections([universe.id])}
              >
                Connect
              </label>
            ) : null}
          </div>
        </div>
      </div>
    );
  }
};

NewEventsPage.applyLayout = applyPrivatePageLayout;

export default NewEventsPage;
