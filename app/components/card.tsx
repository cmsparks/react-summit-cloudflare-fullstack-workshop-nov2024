type Props = {
  card: Card;
};

export default function Card({ card }: Props) {
  return (
    <div data-testid="card" className="card">
      <img
        className="card__image"
        data-testid="card-image"
        src={card.imageUrl}
        alt="card illustration"
      />
      <p className="card__title" data-testid="card-title">
        {card.title}
      </p>
      <p className="card__description" data-testid="card-description">
        {card.description}
      </p>
    </div>
  );
}
