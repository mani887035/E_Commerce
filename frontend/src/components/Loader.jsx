const Loader = ({ size = 44 }) => (
  <div className="page-loader">
    <div className="spinner" style={{ width: size, height: size }} />
  </div>
);

export const SkeletonCard = () => (
  <div className="product-card" style={{ pointerEvents: 'none' }}>
    <div className="skeleton" style={{ aspectRatio: '1', width: '100%' }} />
    <div className="product-info" style={{ gap: 10, display: 'flex', flexDirection: 'column' }}>
      <div className="skeleton" style={{ height: 12, width: '40%', borderRadius: 6 }} />
      <div className="skeleton" style={{ height: 16, width: '90%', borderRadius: 6 }} />
      <div className="skeleton" style={{ height: 12, width: '60%', borderRadius: 6 }} />
      <div className="skeleton" style={{ height: 24, width: '50%', borderRadius: 6, marginTop: 8 }} />
    </div>
  </div>
);

export default Loader;
