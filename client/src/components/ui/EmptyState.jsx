const EmptyState = ({ icon: Icon, title, description, action }) => (
  <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
    {Icon && (
      <div className="w-16 h-16 bg-surface rounded-full flex items-center justify-center mb-4">
        <Icon className="w-8 h-8 text-text-muted" />
      </div>
    )}
    <h3 className="text-lg font-semibold text-text-primary mb-2">{title}</h3>
    {description && <p className="text-text-secondary text-sm max-w-sm mb-6">{description}</p>}
    {action}
  </div>
);
export default EmptyState;
