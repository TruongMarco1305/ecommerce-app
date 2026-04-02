import React from "react";

const NewsletterBox = () => {
  const onSubmitHandler = (event) => {
    event.preventDefault();
  };

  return (
    <div className="text-center py-12 bg-bamboo-50 rounded-lg px-4">
      <p className="text-2xl font-heading font-semibold text-bamboo-700">
        Subscribe & Get 20% Off
      </p>
      <p className="text-bamboo-400 mt-3 text-sm">
        Join our eco-community. Be the first to hear about new bamboo arrivals and exclusive offers.
      </p>
      <form
        onSubmit={onSubmitHandler}
        className="w-full sm:w-1/2 flex items-center gap-0 mx-auto my-6 border border-bamboo-300 overflow-hidden rounded-sm"
      >
        <input
          className="w-full sm:flex-1 outline-none px-4 py-3 text-sm bg-white text-bamboo-700 placeholder-bamboo-300"
          type="email"
          placeholder="Enter your email"
          required
        />
        <button
          type="submit"
          className="bg-bamboo-500 hover:bg-bamboo-600 text-cream text-xs px-8 py-4 transition-colors whitespace-nowrap"
        >
          SUBSCRIBE
        </button>
      </form>
    </div>
  );
};

export default NewsletterBox;
