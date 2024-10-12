import type { MetaFunction } from "@remix-run/cloudflare";
import Card from "~/components/card";

export const meta: MetaFunction = () => {
  return [
    { title: "Trading Card Generator" },
    { name: "description", content: "A trading card generator" },
  ];
};

/* TODO: add loader and action */

export default function Index() {
  const cardDetails = /* TODO: properly implement */ {
    title: "_PLACEHOLDER_TITLE_",
    description: "_PLACEHOLDER_DESCRIPTION_",
    imageUrl: "/image/_PLACEHOLDER_IMAGE_",
  };

  return (
    <main className="main">
      {cardDetails === null ? (
        <>{/* TODO: implement */ ""}</>
      ) : (
        <Card card={cardDetails} />
      )}
    </main>
  );
}
