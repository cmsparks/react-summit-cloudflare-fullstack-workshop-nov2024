import { Form } from "@remix-run/react";

type Props = {
  submitting: boolean;
};

export default function CardForm({ submitting }: Props) {
  return (
    <Form className="card-form" method="post">
      {submitting && (
        <div
          className="card-form__loading"
          data-testid="card-loading-indicator"
        >
          <div className="loader"></div>
        </div>
      )}
      <div className="card" data-testid="card">
        <div className="card__image" data-testid="card-image-placeholder"></div>
        <input
          data-testid="card-title-input"
          className="card__title card__title--input"
          type="text"
          name="card-title"
          id="card-title"
          disabled={submitting}
          placeholder="title"
          required
        />
        <textarea
          data-testid="card-description-input"
          className="card__description card__description--input"
          name="card-description"
          id="card-description"
          disabled={submitting}
          placeholder="description..."
          required
        ></textarea>
      </div>
      <button
        data-testid="card-generate-btn"
        disabled={submitting}
        className="btn btn--generate"
      >
        Generate
      </button>
    </Form>
  );
}
