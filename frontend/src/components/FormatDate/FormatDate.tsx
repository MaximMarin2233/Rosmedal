import { format, parseISO } from 'date-fns';
import { ru } from 'date-fns/locale';

const formatDate = (isoDate) => {
  const date = parseISO(isoDate);
  return format(date, 'LLLL d, yyyy', { locale: ru });
};

const DateFormatter = ({ isoDate }) => {
  return (
    <div>
      {formatDate(isoDate)}
    </div>
  );
};

export default DateFormatter;
