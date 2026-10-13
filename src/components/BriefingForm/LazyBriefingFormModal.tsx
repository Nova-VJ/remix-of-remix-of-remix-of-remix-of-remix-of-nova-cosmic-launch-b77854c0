import { lazy, Suspense, useEffect, useState, type ComponentProps } from 'react';

const BriefingFormModal = lazy(() => import('./BriefingFormModal'));

type Props = ComponentProps<typeof import('./BriefingFormModal')['default']>;

// Downloads the briefing form only the first time it is opened
const LazyBriefingFormModal = (props: Props) => {
  const [requested, setRequested] = useState(props.open);

  useEffect(() => {
    if (props.open) setRequested(true);
  }, [props.open]);

  if (!requested) return null;

  return (
    <Suspense fallback={null}>
      <BriefingFormModal {...props} />
    </Suspense>
  );
};

export default LazyBriefingFormModal;
