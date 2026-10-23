import React from "react";
import { Heart, Star } from "lucide-react";
import { Link } from "react-router-dom";

const money = (value) => `₹${new Intl.NumberFormat("en-IN").format(value)}`;

const discount = (price, mrp) => Math.round((1 - price / mrp) * 100);

const ProductCard = ({
  product,
  onCart,
  onWish,
  wished = false,
  onCompare,
}) => {
  const off = discount(product.discountPrice, product.price);

  return (
    <article className="group relative overflow-hidden rounded-[1.25rem] border border-border bg-card p-2 shadow-[0_12px_32px_rgba(37,50,64,.05)] transition hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(37,50,64,.11)]">
      <div className="relative">
        <Link to={`/product/${product._id}`} className="block">
          <div className="mx-auto flex h-44 w-full max-w-sm items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-teal-900 via-teal-700 to-amber-600 sm:h-48">
            <span className="display text-[90px] font-extrabold text-white/90 drop-shadow-lg">
              {product.name?.charAt(0)}
            </span>
          </div>
        </Link>

        <button
          type="button"
          onClick={onWish}
          className="absolute right-3 top-3 grid size-9 place-items-center rounded-full bg-white/90 text-slate-700 shadow-sm transition hover:scale-105 hover:text-red-600"
          aria-label="Add to wishlist"
        >
          <Heart size={17} fill={wished ? "red" : "none"} />
        </button>

        {off > 0 && (
          <span className="absolute bottom-3 left-3 rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-bold text-slate-800">
            {off}% off
          </span>
        )}
      </div>

      <div className="p-2 pt-3">
        <p className="text-[10px] font-semibold text-muted-foreground">
          {product.vendor?.storeName}
        </p>

        <Link to="#">
          <h3 className="display mt-1 line-clamp-1 font-bold group-hover:text-primary">
            {product.name}
          </h3>
        </Link>

        <div className="mt-3 flex items-end justify-between gap-2">
          <div>
            <p className="text-lg font-extrabold">
              {money(product.discountPrice)}
            </p>

            {off > 0 && (
              <p className="text-[10px] text-muted-foreground line-through">
                {money(product.price)}
              </p>
            )}
          </div>

          <span
            className={`text-[10px] font-bold ${
              product.stock < 10 ? "text-red-600" : "text-teal-700"
            }`}
          >
            {product.stock < 10 ? `${product.stock} left` : "In stock"}
          </span>
        </div>

        <div className="mt-4 flex gap-2">
          <button
            type="button"
            onClick={onCart}
            className="flex-1 rounded-xl bg-primary px-3 py-2.5 text-xs font-bold text-primary-foreground hover:opacity-90"
          >
            Add to cart
          </button>

          {onCompare && (
            <button
              type="button"
              onClick={onCompare}
              className="rounded-xl border border-border px-3 text-xs font-bold text-muted-foreground hover:border-primary hover:text-primary"
            >
              Compare
            </button>
          )}
        </div>
      </div>
    </article>
  );
};

export default ProductCard;
