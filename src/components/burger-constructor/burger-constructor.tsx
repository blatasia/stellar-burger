import { FC, useMemo } from 'react';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import { useDispatch, useSelector } from '../../services/store';
import { useNavigate } from 'react-router-dom';

import { RootState } from '../../services/store';
import { orderBurger } from '../../services/slices/burgerSlice';

import {
  selectBurger,
  resetConstructor
} from '../../services/slices/burgerSlice';
import { selectUser } from '../../services/slices/userSlice';

export const BurgerConstructor: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { bun, ingredients } = useSelector(selectBurger);

  const orderModalData = useSelector(
    (state: RootState) => state.burger.orderModalData
  );

  const orderRequest = useSelector(
    (state: RootState) => state.burger.orderRequest
  );
  const user = useSelector(selectUser);

  const onOrderClick = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (!bun || orderRequest) {
      console.log('оформление заказа ошибка');
      return;
    }

    const ingredientIds = ingredients.map((ingredient) => ingredient._id);
    if (bun) {
      ingredientIds.push(bun._id, bun._id);
    }
    dispatch(orderBurger(ingredientIds));
    console.log('placing order with:', ingredientIds);
  };

  const closeOrderModal = () => {
    dispatch(resetConstructor());
  };

  const price = useMemo(
    () =>
      (bun ? bun.price * 2 : 0) +
      ingredients.reduce(
        (sum: number, ingredient: TConstructorIngredient) =>
          sum + ingredient.price,
        0
      ),
    [bun, ingredients]
  );

  const constructorItems = { bun, ingredients };

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
