import React, { Component } from 'react';

import Aux from '../../../hoc/Aux/Auxiliary';
import Button from './../../UI/Button/Button.js';

class OrderSummary extends Component {
  // This can be a functional component
  componentWillUpdate() {
    console.log("[OrderSummary willUpdate");
  }

  render(){
    const ingredientSummary = Object.keys(this.props.ingredients)
      .map(igKey => {
        return  (
          <li key={igKey}>
            <span style={{textTransform: 'capitalize'}}>{igKey}</span>: {this.props.ingredients[igKey]}
          </li>
        );
      });

    return (
      <Aux>
        <h3>Your Order</h3>
        <p>A delicious burger with the following ingredients:</p>
        <ul>
          { ingredientSummary }
        </ul>
        <p><strong>Total Price: {this.props.price}</strong></p>
        <p>Continue to Checkout?</p>
        <Button btnType='Danger' clicked={this.props.purchaseCancelled}>Cancel</Button>
        <Button btnType='Success' clicked={this.props.purchaseContinued}>Continue</Button>
      </Aux>
    );
  }
};

export default OrderSummary;