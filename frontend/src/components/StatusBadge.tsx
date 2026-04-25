interface BadgeProps {
  status: 'fulfilled' | 'pending' | 'expired';
}

const styles = {
  fulfilled: 'bg-green-100 text-green-700',
  pending: 'bg-yellow-100 text-yellow-700',
  expired: 'bg-red-100 text-red-700',
};

export default function StatusBadge({ status }: BadgeProps) {
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${styles[status]}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}
