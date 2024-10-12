type Props = {
  card: Card;
};

export default function Card({ card }: Props) {
  return (
    <div className="card">
      <img
        className="card__image"
        src={card.imageUrl}
        alt="card illustration"
      />
      <p className="card__title">{card.title}</p>
      <p className="card__description">{card.description}</p>
    </div>
  );
}
