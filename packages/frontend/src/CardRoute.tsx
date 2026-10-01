import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useAtomValue } from 'jotai';
import { cardsAtom } from './hellfall/atoms/cardsAtom';
import { toPlainText } from '@hellfall/shared/utils';
import { useNameToHCID, useIsHCID } from './hellfall/hooks/useNameToId';
import { SingleCard } from './hellfall/card/SingleCard.tsx';

export const CardRoute = () => {
  const params = useParams<{ '*': string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const cards = useAtomValue(cardsAtom);
  const cardIdentifier = params['*'];
  const exportFormat = searchParams.get('format');
  const cardId = useNameToHCID(cardIdentifier || '');
  const IsHCID = useIsHCID(cardIdentifier || '');
  const [shouldRender, setShouldRender] = useState(false);
  useEffect(() => {
    const handleRedirect = async () => {
      if (!IsHCID && cardId) {
        navigate(`/card/${encodeURIComponent(cardId)}`, { replace: true });
        return;
      }
      setShouldRender(true);
    };

    handleRedirect();
  }, [cardIdentifier, cardId, navigate]);

  if (!shouldRender) {
    return <div />;
  }

  if (exportFormat === 'text' || exportFormat === 'json') {
    const card = cards.getFromHCID(cardId || cardIdentifier || '');
    if (!card) {
      return <pre>Card not found.</pre>;
    }
    const content = exportFormat === 'text' ? toPlainText(card) : JSON.stringify(card, null, 2);
    return (
      <pre style={{ whiteSpace: 'pre-wrap', overflowWrap: 'anywhere' }}>
        {content}
      </pre>
    );
  }

  return <SingleCard />;
};
