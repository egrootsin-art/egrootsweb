// src/pages/EventThankYou.tsx
import { useParams, Link } from "react-router-dom";

const EventThankYou = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="max-w-md text-center space-y-4">
        <h1 className="text-3xl font-bold text-foreground">
          Thank you for your payment!
        </h1>
        <p className="text-muted-foreground">
          Your registration has been received. A confirmation email will be sent shortly.
        </p>
        <Link
          to="/products"
          className="inline-block mt-4 px-4 py-2 rounded-md bg-primary text-primary-foreground"
        >
          Back to Products
        </Link>
      </div>
    </div>
  );
};

export default EventThankYou;
