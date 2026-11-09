// Placeholder with the same footprint as ProductItem (4:5 image box, name +
// price bars in the same min-height info block, the 44px action row), so
// the grid doesn't shift when real cards replace it. Purely visual: the
// grid around it carries the accessible loading status.
const ProductCardSkeleton = () => (
  <div className="flex flex-col animate-pulse" aria-hidden="true">
    <div className="aspect-4/5 bg-stone/20" />
    <div className="pt-3 min-h-[72px] flex flex-col justify-between">
      <div className="h-5 w-3/4 bg-stone/30" />
      <div className="h-4 w-1/4 mt-2 bg-stone/30" />
    </div>
    <div className="mt-3 min-h-11" />
  </div>
);

export default ProductCardSkeleton;
