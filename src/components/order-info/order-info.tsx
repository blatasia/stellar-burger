import { FC, useEffect, useMemo, useState } from 'react';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient } from '@utils-types';
import { getOrderByNumberApi } from '@api';
import { useParams } from 'react-router-dom';
import { TOrder } from '@utils-types';
import { useSelector } from '../../services/store';
import { selectIngredients } from '../../services/slices/ingredientsSlice';

export const OrderInfo: FC = () => {
  const { number } = useParams<{ number: string }>();
  const [orderData, setOrderData] = useState<TOrder | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const ingredients = useSelector(selectIngredients);

  useEffect(() => {
    const fetchOrderData = async () => {
      try {
        const response = await getOrderByNumberApi(Number(number));
        setOrderData(response.orders[0]);
      } catch (error) {
        console.error('err in fetchOrderData order-info', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderData();
  }, [number]);

  const orderInfo = useMemo(() => {
    if (!orderData) return null;

    const date = new Date(orderData.createdAt);

    const ingredientsInfo = orderData.ingredients.reduce(
      (acc: { [key: string]: TIngredient & { count: number } }, item) => {
        if (!acc[item]) {
          const ingredient = ingredients.find((ing) => ing._id === item);
          if (ingredient) {
            acc[item] = { ...ingredient, count: 1 };
          }
        } else {
          acc[item].count++;
        }
        return acc;
      },
      {}
    );

    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    return { ...orderData, ingredientsInfo, date, total };
  }, [orderData]);

  if (loading || !orderInfo) {
    return <Preloader />;
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};
