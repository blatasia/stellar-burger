import { FC, useEffect } from 'react';
import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { useSelector, useDispatch, RootState } from '../../services/store';
import { TOrder } from '@utils-types';
import {
  selectFeedOrder,
  fetchFeedOrders
} from '../../services/slices/feedSlice';

export const Feed: FC = () => {
  const dispatch = useDispatch();
  const orders: TOrder[] = useSelector(selectFeedOrder);
  const requestStatus = useSelector(
    (state: RootState) => state.feed.requestStatus
  );

  useEffect(() => {
    if (orders.length === 0) {
      dispatch(fetchFeedOrders());
    }
  }, [dispatch, orders.length]);

  if (orders.length === 0 || requestStatus === 'loading') {
    return <Preloader />;
  }

  return (
    <FeedUI
      orders={orders}
      handleGetFeeds={() => dispatch(fetchFeedOrders())}
    />
  );
};
