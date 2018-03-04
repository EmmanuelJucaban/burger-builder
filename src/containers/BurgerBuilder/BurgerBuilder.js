import React, { Component } from 'react';

import Aux from '../../hoc/Auxiliary/Auxiliary';
import Burger from './../../components/Burger/Burger';
import BurgerControls from './../../components/Burger/BuildControls/BuildControls';
import Modal from './../../components/UI/Modal/Modal';
import OrderSummary from './../../components/Burger/OrderSummary/OrderSummary';
import Spinner from './../../components/UI/Spinner/Spinner';
import withErrorHandler from './../../hoc/withErrorHandler/withErrorHandler';
import axios from "./../../axios-orders";

const INGREDIENT_PRICES = {
  salad: 0.5,
  cheese: 0.4,
  meat: 1.3,
  bacon: 0.7,
};

class BurgerBuilder extends Component {
  state = {
    ingredients: null,
    totalPrice: 4,
    purchasable: false,
    purchasing: false,
    loading: false,
    error: false
  }

  componentDidMount() {
    axios.get('https://burger-builder-db.firebaseio.com/ingredients.json')
      .then( res => {
        this.setState({ ingredients: res.data });
      })
  }

  purchaseHandler = () => {
    this.setState({ purchasing: true });
  }

  purchaseCancelHandler = () => {
    this.setState({ purchasing: false });
  }

  purchaseContinueHandler = () => {
    // this.setState({loading: true});
    // const order = {
    //   ingredients: this.state.ingredients,
    //   price: this.state.totalPrice,
    //   customer: {
    //     name: "Foo",
    //     address: {
    //       street: 'Foo',
    //       zipCode: '01337',
    //       country: 'Unites States'
    //     },
    //     email: 'foo@bar.com'
    //   },
    //   deliveryMethod: 'fastest'
    // };
    //
    // axios.post("/orders.json", order)
    //   .then( res => {
    //     this.setState({ loading: false, purchasing: false });
    //   })
    //   .catch( err => {
    //     this.setState({ loading: false, purchasing: false });
    //   });
    this.props.history.push('/checkout');
  }

  updatePurchaseState(ingredients) {
    const sum = Object.values(ingredients).some(quantity => quantity > 0);

    this.setState({ purchasable: sum > 0});
  }

  addIngredientHandler = type => {
    const oldCount = this.state.ingredients[type];
    const updatedCount = oldCount + 1;
    const updatedIngredients = {
      ...this.state.ingredients
    };
    updatedIngredients[type] = updatedCount;
    const priceAddition = INGREDIENT_PRICES[type];
    const oldPrice = this.state.totalPrice;
    const newPrice = oldPrice + priceAddition;
    this.setState({totalPrice: newPrice, ingredients: updatedIngredients});
    this.updatePurchaseState(updatedIngredients);
  }

  removeIngredientHandler = type => {
    const oldCount = this.state.ingredients[type];
    if ( oldCount <= 0 ) {
      return;
    }
    const updatedCount = oldCount - 1;
    const updatedIngredients = {
      ...this.state.ingredients
    };
    updatedIngredients[type] = updatedCount;
    const priceDeduction = INGREDIENT_PRICES[type];
    const oldPrice = this.state.totalPrice;
    const newPrice = oldPrice - priceDeduction;
    this.setState({totalPrice: newPrice, ingredients: updatedIngredients});
    this.updatePurchaseState(updatedIngredients);
  }

  render () {
    const disabledInfo = {
      ...this.state.ingredients
    };
    for (let key in disabledInfo) {
      disabledInfo[key] = disabledInfo[key] <= 0;
    }

    let orderSummary = null;

    let burger = this.state.error ? <p>Ingredients can't be loaded</p> : <Spinner/>;

    if ( this.state.ingredients ) {
      burger = (
        <Aux>
          <Burger ingredients={this.state.ingredients}/>
          <BurgerControls
            ingredientAdded={this.addIngredientHandler}
            ingredientRemoved={this.removeIngredientHandler}
            disabled={disabledInfo}
            purchasable={this.state.purchasable}
            price={this.state.totalPrice}
            ordered={this.purchaseHandler}/>
        </Aux>
      );

      orderSummary = <OrderSummary
          ingredients={ this.state.ingredients }
          purchaseCancelled={ this.purchaseCancelHandler }
          purchaseContinued={ this.purchaseContinueHandler }
          price={this.state.totalPrice.toFixed(2)}>
        </OrderSummary>
    }

    if (this.state.loading) {
      orderSummary = <Spinner/>;
    }

    return (
      <Aux>
        <Modal show={ this.state.purchasing } modalClosed={this.purchaseCancelHandler}>
          { orderSummary }
        </Modal>
        { burger }
      </Aux>
    );
  }
}

export default withErrorHandler(BurgerBuilder, axios);
