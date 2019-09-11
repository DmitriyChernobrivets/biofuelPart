import React, { Component } from "react";
import { Modal } from "antd";
import Filters from "./Filters";
import OrdersList from "./OrdersList";
import ActiveOrders from "./ActiveOrders";
import OpenOrders from "./OpenOrders";
import TradeHistory from "./TradeHistory";
import CreateOrder from "./dialogWindows/CreateOrder";
import ConfirmBuyOrder from "./dialogWindows/ConfirmBuyOrder";
import ConfirmSellOrder from "./dialogWindows/ConfirmSellOrder";
import AddRatingOrder from "./dialogWindows/AddRatingOrder";

import { getOrders, getMyOpenOrders } from "../../../actions/orderActions";
// import ReconnectingWebSocket from "reconnectingwebsocket";
import "./exchange.scss";

class Exchange extends Component {
  state = {
    visible: false,
    modalType: "",
    confirmStep: 0,
    confirmBuyStep: 0,
    buyOrders: [
      {
        name: "ENplus a1",
        price: "100 грн/м³",
        amount: "124 м³",
        distance: "999999км",
        sum: "12400 грн",
        rating: "4.84",
        certificate: true
      }
    ],
    sellOrders: [
      {
        name: "ENplus a1",
        price: "100 грн/м³",
        amount: "124 м³",
        distance: "999999км",
        sum: "12400 грн",
        rating: "4.84",
        certificate: true
      }
    ],
    openOrders: [
      {
        type: "Купівля",
        category: "EnA2",
        price: "100 грн",
        amount: "20т",
        all: "2000 грн",
        distance: "467 км  ",
        delivery: "42424 грн  ",
        sum: "12/03/2018  "
      }
    ]
  };

  showModal = modalType => {
    this.setState({
      visible: true,
      modalType
    });
  };

  handleCreateOrder = (...rest) => {
    this.setState({
      visible: false
    });
  };

  handleCloseModal = e => {
    this.setState(
      {
        visible: false
      },
      () => {
        this.setState({
          confirmStep: 0,
          confirmBuyStep: 0
        });
      }
    );
  };

  getAllOrders = async () => {
    const { buy, sell } = await getOrders();

    this.setState({
      buyOrders: buy,
      sellOrders: sell
    });
  };

  getOpenOrders = async () => {
    const res = await getMyOpenOrders();

    this.setState({
      openOrders: res
    });
  };

  render() {
    const {
      modalType,
      confirmStep,
      buyOrders,
      sellOrders,
      openOrders,
      confirmBuyStep
    } = this.state;

    const renderDialogWindow = () => {
      if (modalType === "buy" || modalType === "sell") {
        return (
          <CreateOrder
            onCreateOrder={this.handleCreateOrder}
            type={modalType}
          />
        );
      } else if (modalType === "buy-confirm") {
        return (
          <ConfirmBuyOrder
            step={confirmBuyStep}
            nextStep={step => this.setState({ confirmBuyStep: step })}
            close={this.handleCancel}
          />
        );
      } else if (modalType === "sell-confirm") {
        return (
          <ConfirmSellOrder
            step={confirmStep}
            nextStep={step => this.setState({ confirmStep: step })}
            close={this.handleCancel}
          />
        );
      } else if (modalType === "rating") {
        return <AddRatingOrder />;
      }
    };

    return (
      <div className="exchange-page">
        <Filters />

        <ActiveOrders dataSource={openOrders} />

        <div className="order-block">
          <OrdersList
            type="buy"
            data={buyOrders}
            onOpenCreateWindow={this.showModal}
          />

          <OrdersList
            type="sell"
            data={sellOrders}
            onOpenCreateWindow={this.showModal}
          />
        </div>

        <OpenOrders data={openOrders} />

        <TradeHistory />

        <Modal
          footer={null}
          visible={this.state.visible}
          onCancel={this.handleCloseModal}
        >
          {renderDialogWindow()}
        </Modal>
      </div>
    );
  }
}

export default Exchange;
