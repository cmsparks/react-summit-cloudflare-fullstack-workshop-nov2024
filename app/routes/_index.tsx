import type { MetaFunction } from "@remix-run/cloudflare";

export const meta: MetaFunction = () => {
  return [
    { title: "Trading Card Generator" },
    { name: "description", content: "A trading card generator" },
  ];
};

/* TODO: add loader and action */

export default function Index() {
  const cardDetails = /* TODO: implement */ {
    title: "_PLACEHOLDER_TITLE_",
    description: "_PLACEHOLDER_DESCRIPTION_",
    imageUrl: "/image/_PLACEHOLDER_IMAGE_",
  };

  return (
    <main className="main">
      {cardDetails === null ? (
        <>{/* TODO: implement */ ""}</>
      ) : (
        <div className="card">
          <img
            className="card__image"
            src={cardDetails.imageUrl}
            alt="card illustration"
          />
          <p className="card__title">{cardDetails.title}</p>
          <p className="card__description">{cardDetails.description}</p>
        </div>
      )}
    </main>
  );
}
